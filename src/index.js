const sql = require('mssql');
const express = require('express');
const cors = require('cors');

const app = express();
const expressPort = 4343;
app.use(cors());

const sqlConfig = {
    user: 'SA',
    password: 'MyStrongPass123',
    server: 'localhost',
    port: 1433,
    database: 'SFL',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.get('/api/survivorCastList', async (req, res) => {
    try {
        let pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM SURVIVOR_CAST');
        res.status(200).json({ cast: result.recordset });
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).send({message : "Error querying the database"});
    } finally {
        sql.close();
    }
});

app.listen(expressPort, () => {
    console.log(`Server is running on http://localhost:${expressPort}`);
})