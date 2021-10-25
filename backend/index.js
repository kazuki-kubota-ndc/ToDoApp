const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 3001

const db = require('../db/db');

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/api", (req, res) => {
  db.pool.connect((err, client) => {
    if (err) {
      console.log(err);
    } else {
      client.query('SELECT NAME FROM TO_DO_LIST_DATA', (err, result) => {
        res.json({ message: result.rows[0].name });
      });
    }
  });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})