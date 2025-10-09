import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database.js';
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.get('/',(req,res)=>{
    document.body.innerHTML = '<h1>Server is running</h1>'
})
app.get('/getAllData', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${process.env.TABLE_NAME};`); // replace 'your_table_name' with your actual table name
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
    
})

app.get ('/search',async (req,res)=>{
    const searchName = req.query.name 
    const [data] = await pool.query(`SELECT * FROM ${process.env.TABLE_NAME} WHERE name LIKE ?`, [`${searchName}%`]);

    res.json(data)

})

app.post('/insert-name', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        await pool.query(`insert into ${process.env.TABLE_NAME} (name) values(?)`,[req.body.name])

        res.json({ message: "Data saved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process request' });
    }
})

app.delete('/makETableEmpty',async (req,res)=>{
    await pool.query(`ALTER TABLE ${process.env.TABLE_NAME} AUTO_INCREMENT = 1;`)
    res.status(200).json({ message: ` All Data deleted` });
})

app.delete('/delete',async (req,res)=>{
    const deleteNameId = req.query.id ;
    await pool.query(`delete from ${process.env.TABLE_NAME} where id = ?`,[deleteNameId])
    res.status(200).json({ message: ` the user id ${deleteNameId} Data deleted` });
})

app.put('/update',async (req,res)=>{
    const updateId = req.query.id ;
    const updatedName = req.query.name ;
    await pool.query(`update ${process.env.TABLE_NAME} set name = ? where id = ?`,[updatedName,updateId])
    res.status(200).json({ message: ` the user id ${updateId} Data updated` });
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})