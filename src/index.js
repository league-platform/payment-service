import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'payments_db'
});

app.post('/payments', async (req, res) => {
  const { user, amount, method } = req.body;
  const [result] = await pool.query(
    'INSERT INTO payments (user, amount, method) VALUES (?, ?, ?)',
    [user, amount, method]
  );
  const payment = { id: result.insertId, user, amount, method };
  console.log('EVENT: payment.created ->', payment);
  res.status(201).json({ message: 'Payment registered', payment });
});

app.get('/payments', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM payments');
  res.json(rows);
});

app.listen(3000, () => console.log('Payment service running on port 3000'));
