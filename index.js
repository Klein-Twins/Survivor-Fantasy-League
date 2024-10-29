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
    database: 'master',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.get('/api/survivorCastList', async (req, res) => {
    try {
        let pool = await sql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM SURVIVOR_CAST');
        console.log(result);
        res.json(result.recordset);
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



const DUMMY_SURVIVORS = [
    {
      season_id: 47,
      survivor_id: 4701,
      first_name: 'Andy',
      nick_name: null,
      last_name: 'Rueda',
      age: 31,
      from_city: 'Brooklyn',
      from_state: 'New York',
      from_country: 'US',
      job: 'AI Research Assistant',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4702,
      first_name: 'Anika',
      nick_name: null,
      last_name: 'Dhar',
      age: 26,
      from_city: 'Los Angeles',
      from_state: 'California',
      from_country: 'US',
      job: 'Marketing Manager',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4703,
      first_name: 'Aysha',
      nick_name: null,
      last_name: 'Welch',
      age: 32,
      from_city: 'Houston',
      from_state: 'Texas',
      from_country: 'US',
      job: 'IT Consultant',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4704,
      first_name: 'Caroline',
      nick_name: null,
      last_name: 'Vidmar',
      age: 27,
      from_city: 'Chicago',
      from_state: 'Illinois',
      from_country: 'US',
      job: 'Strategy Consultant',
      tribe: 'Tuku',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4705,
      first_name: 'Gabe',
      nick_name: null,
      last_name: 'Ortis',
      age: 26,
      from_city: 'Baltimore',
      from_state: 'Maryland',
      from_country: 'US',
      job: 'Radio Host',
      tribe: 'Tuku',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4706,
      first_name: 'Genevieve',
      nick_name: null,
      last_name: 'Mushaluk',
      age: 33,
      from_city: 'Winnipeg',
      from_state: 'Manitoba',
      from_country: 'US',
      job: 'Corporate Lawyer',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4707,
      first_name: 'Rome',
      nick_name: null,
      last_name: 'Cooney',
      age: 30,
      from_city: 'Phoenix',
      from_state: 'Arizona',
      from_country: 'US',
      job: 'E-Sports Commentator',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4708,
      first_name: 'Jon',
      nick_name: null,
      last_name: 'Lovett',
      age: 42,
      from_city: 'Los Angeles',
      from_state: 'California',
      from_country: 'US',
      job: 'Podcast Host',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4709,
      first_name: 'Kishan',
      nick_name: null,
      last_name: 'Patel',
      age: 28,
      from_city: 'San Francisco',
      from_state: 'California',
      from_country: 'US',
      job: 'Emergency Room Doctor',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4710,
      first_name: 'Kyle',
      nick_name: null,
      last_name: 'Ostwald',
      age: 31,
      from_city: 'Cheboygan',
      from_state: 'Michigan',
      from_country: 'US',
      job: 'Construction Worker',
      tribe: 'Tuku',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4711,
      first_name: 'Rachel',
      nick_name: null,
      last_name: 'LaMont',
      age: 34,
      from_city: 'Southfield',
      from_state: 'Michigan',
      from_country: 'US',
      job: 'Graphic Designer',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4712,
      first_name: 'Sam',
      nick_name: null,
      last_name: 'Phalen',
      age: 24,
      from_city: 'Nashville',
      from_state: 'Tennessee',
      from_country: 'US',
      job: 'Sports Reporter',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4713,
      first_name: 'Sierra',
      nick_name: null,
      last_name: 'Wright',
      age: 27,
      from_city: 'Pheonixville',
      from_state: 'Pennsylvania',
      from_country: 'US',
      job: 'Nurse',
      tribe: 'Gata',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4714,
      first_name: 'Solomon',
      nick_name: 'Sol',
      last_name: 'Yi',
      age: 43,
      from_city: 'Norwalk',
      from_state: 'Connecticut',
      from_country: 'US',
      job: 'Medical Device Sales',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4715,
      first_name: 'Sue',
      nick_name: null,
      last_name: 'Smey',
      age: 59,
      from_city: 'Putnam Valley',
      from_state: 'New York',
      from_country: 'US',
      job: 'Flight School Owner',
      tribe: 'Tuku',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4716,
      first_name: 'Teeny',
      nick_name: null,
      last_name: 'Chirichillo',
      age: 23,
      from_city: 'Manahawkin',
      from_state: 'New Jersey',
      from_country: 'US',
      job: 'Freelance Writer',
      tribe: 'Lavo',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4717,
      first_name: 'Terran',
      nick_name: 'TK',
      last_name: 'Foster',
      age: 31,
      from_city: null,
      from_state: 'Washington D.C.',
      from_country: 'US',
      job: 'Athlete Marketing Manager',
      tribe: 'Tuku',
      img_url: null
    },
    {
      season_id: 47,
      survivor_id: 4718,
      first_name: 'Tiyana',
      nick_name: null,
      last_name: 'Hallums',
      age: 27,
      from_city: 'Oahu',
      from_state: 'Hawaii',
      from_country: 'US',
      job: 'Flight Attendant',
      tribe: 'Tuku',
      img_url: null
    }
  ];