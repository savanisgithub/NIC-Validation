import express from "express"
import con from "../utils/db.js"
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import csv from 'csv-parser'
import PDFDocument from 'pdfkit'
import { Parser } from 'json2csv'
import ExcelJS from 'exceljs'


// Configure storage options for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

// Validate  NIC for both old and modern
const validateNIC = (nic) => {
    nic = nic.trim().toUpperCase();
    const oldNicRegex = /^\d{9}[VX]?$/;
    const modernNicRegex = /^\d{12}$/;
    return oldNicRegex.test(nic) || modernNicRegex.test(nic);
};

// Save NIC validity data to the database
// const saveNICValidity = (nic, validity) => {
//     const sql = "INSERT INTO nic_validity (nic_number, validity) VALUES (?, ?)"
//     con.query(sql, nic, validity, (err) => {
//         if (err) {
//             console.error(`Error saving NIC data: ${err.message}`);
//         }
//     });
//     sql.finalize();
// };

const router = express.Router();

router.post('/auth/upload', upload.array('files'), (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        files.forEach((file) => {
            if (path.extname(file.originalname) === '.csv') {
                fs.createReadStream(file.path)
                  .pipe(csv())
                  .on('data', (row) => {

                    //validation part
                    if (row.NIC) {
                        const isValid = validateNIC(row.NIC);
                        console.log(`NIC: ${row.NIC}, Validity: ${isValid}`);
                            // saveNICValidity(row.NIC);

                        //Save to database
                        const sql = 'INSERT INTO nic_validity (NIC, validity) VALUES (?, ?)';
                        con.query(sql, [row.NIC, isValid], (err, result) => {
                            if (err) throw err;
                        });

                    }
                })
                  .on('end', () => {
                    console.log(`Finished processing ${file.originalname}`);

                });
          } else {
              console.log(`${file.originalname} is not a CSV file.`);
          }
      });

      res.send('Files uploaded and processed successfully!');
  } catch (err) {
      res.status(400).send('Error uploading files');
  }
});

//////
router.get('/data', (req, res) => {
    const sql = 'SELECT NIC, validity FROM nic_validity';
    con.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching data');
        }
        res.json(results);
    });
});

router.post('/saveValidNicData', async (req, res) => {
    const validNicData = req.body;
  
    try {
      const insertQueries = validNicData.map(row => {
        const { NIC, gender, birthday, age } = row;

        // Format the birthday to 'YYYY-MM-DD'
        const formattedBirthday = new Date(birthday).toISOString().split('T')[0];

        return `INSERT INTO valid_nic_data (NIC, gender, birthday, age) 
                VALUES ('${NIC}', '${gender}', '${formattedBirthday}', ${age})`;
      });
  
      for (const query of insertQueries) {
        await con.query(query);
      }
  
      res.status(200).send('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).send('Error saving data.');
    }
  });

router.get('/download/:format', async (req, res) => {
    const format = req.params.format;
  
    con.query('SELECT * FROM valid_nic_data', async (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching data from database');
      }
  
      const data = results.map(row => ({
        NIC: row.NIC,
        Gender: row.gender,
        Birthday: row.birthday,
        Age: row.age
      }));

  
      if (format === 'pdf') {
        const doc = new PDFDocument();
        res.setHeader('Content-disposition', 'attachment; filename=validated_nic_data.pdf');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);
  
        doc.text('Validated NIC Data', { align: 'center' });
        doc.moveDown();
  
        data.forEach(row => {
          doc.text(`NIC: ${row.NIC}`);
          doc.text(`Gender: ${row.Gender}`);
          doc.text(`Birthday: ${row.Birthday}`);
          doc.text(`Age: ${row.Age}`);
          doc.moveDown();
        });
  
        doc.end();
      } else if (format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(data);
        res.setHeader('Content-disposition', 'attachment; filename=validated_nic_data.csv');
        res.setHeader('Content-type', 'text/csv');
        res.send(csv);
      } else if (format === 'xlsx') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Validated NIC Data');
        worksheet.columns = [
          { header: 'NIC_Number', key: 'NIC', width: 20 },
          { header: 'Gender', key: 'Gender', width: 10 },
          { header: 'Birthday', key: 'Birthday', width: 15 },
          { header: 'Age', key: 'Age', width: 10 }
        ];
  
        data.forEach(row => {
          worksheet.addRow(row);
        });
  
        res.setHeader('Content-disposition', 'attachment; filename=validated_nic_data.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await workbook.xlsx.write(res);
        res.end();
      } else {
          res.status(400).send('Invalid format requested');
        }
    });
});


export {router as fileUploadRouter}