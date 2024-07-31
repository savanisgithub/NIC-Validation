import express from "express"
import con from "../utils/db.js"
import jwt from 'jsonwebtoken'


const router = express.Router();

router.post('/userlogin', (req, res) => {
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?" 
    con.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const username = result[0].username;
            const token = jwt.sign(
                { role: "user", username: username}, 
                "jwt_secret_key", 
                { expiresIn: '1d' }
            );
            res.cookie('token', token)
            return res.json({ loginStatus: true });
        }
        else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

// Forgot password route
router.post('/forgotpassword', (req, res) => {
    const { username } = req.body;
    con.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.send({ exists: true });
        } else {
            res.send({ exists: false });
        }
    });
});

router.post('/resetpassword', (req, res) => {
    const { username, newPassword } = req.body;
    con.query('UPDATE user SET password = ? WHERE username = ?', [newPassword, username], (err, results) => {
        if (err) throw err;
        if (results.affectedRows > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});


router.get('/search', (req, res) => {
    const { query } = req.query;

    let sql = 'SELECT * FROM valid_nic_data WHERE 1=1';
    const params = [];

    if (query) {
        sql += ' AND (gender = ? OR NIC LIKE ?)';
        params.push(query, `%${query}%`);
    }

    con.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching data');
        }
        res.json(results);
    });
});


export {router as userRouter}