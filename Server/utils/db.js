import mysql from 'mysql'

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sava21#$',
    database: 'nic_validation'
})

con.connect(function(err) {
    if(err) {
        console.log("Connection error",err)
    } else {
        console.log("Connected")
    }
})

export default con;



//api to upload csv file (loop show) apply the validation process to the loop
//from frontend upload it to backend