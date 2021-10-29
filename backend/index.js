const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 3001

const db = require('../db/db');

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

/* 画面初期表示時の処理 */
app.get("/api", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  db.pool.connect((err, client) => {
    if (err) {
      console.log(err);
    } else {
      client.query('SELECT NO,NAME,CHECK_FLG,SORT FROM TO_DO_LIST_HED ORDER BY SORT', (err, result) => {
        if(err) {
          console.log(err.stack);
          res.json({ result: 0 });
        }else {
          if(result.rows.length!=0) {
            res.json({
              result: 1 ,
              data: result.rows
            });
          /* 検索結果0件 */
          }else {
            res.json({ result: 2 });
          }
        }
      });
    }
  });
});

app.get("/delete", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  console.log('delete[no:'+req.query.no+']');

  db.pool.connect((err, client) => {
    var err_flg = false;
    if (err) {
      console.log(err);
      res.json({ result: 0 });
    } else {
      /* データを削除 */
      const delete_query = {
        text: 'DELETE FROM TO_DO_LIST_HED WHERE NO = $1',
        values: [req.query.no],
      }
      client.query(delete_query, (err, result) => {
        if(err) {
          console.log(err.stack);
          res.json({ result: 0 });
        }else {
          res.json({ result: 1 });
        }
      });
    }
  });
});

app.get("/test", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  if(req.query.no==6) {
    res.json({ result: 1 });
  }else {
    res.json({ result: 0 });
  }
});

/* チェックボックスをチェックした時の処理 */
app.get("/update_check", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  console.log('update_check[no:'+req.query.no+', check_flg:'+req.query.check_flg+']');

  function return_result(flg) {
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  db.pool.connect((err, client) => {
    var err_flg = false;
    if (err) {
      console.log(err);
      err_flg = true;
    } else {
      /* CHECK_FLGをアップデート */
      const update_query = {
        text: 'UPDATE TO_DO_LIST_HED SET CHECK_FLG = $2 WHERE NO = $1',
        values: [req.query.no, req.query.check_flg],
      }
      client.query(update_query, (err, result) => {
        if(err) {
          console.log(err.stack);
          err_flg = true;
        }else {
          /* 更新件数0件 */
          if(result.rowCount==0) {
            err_flg = true;
          }
          return_result(err_flg);
        }
      });
    }
  });
});

/* inputでEnterを押した時の処理 */
app.get("/insert", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  console.log('insert[name:'+req.query.name+']');

  function insert_hed(no, name, sort){
    db.pool.connect((err, client) => {
      if (err) {
        console.log(err);
      }else {
        var err_flg = false;
        /* DTLを削除 */
        if(!err_flg) {
          const delete_query = {
            text: 'DELETE FROM TO_DO_LIST_DTL WHERE NO = $1',
            values: [no],
          }
          client.query(delete_query, (err, result) => {
            if(err) {
              console.log(err.stack);
              err_flg = true;
            }
          });
        }
        /* 登録 */
        if(!err_flg) {
          const insert_query = {
            text: 'INSERT INTO TO_DO_LIST_HED (NO, NAME, CHECK_FLG, SORT) VALUES ($1, $2, $3, $4)',
            values: [no, name, 0, sort],
          }
          client.query(insert_query, (err, result) => {
            if(err) {
              console.log(err.stack);
              res.json({ result: 0 });
            }else {
              res.json({
                result: 1,
                key: no
              });
            }
          });
        }else {
          res.json({ result: 0 });
        }
      }
    });
  }

  db.pool.connect((err, client) => {
    if (err) {
      console.log(err);
      res.json({ result: 0 });
    } else {
      /* 登録するNO,SORTを取得 */
      client.query('SELECT MAX(NO) AS MAX_NO, MAX(SORT) AS MAX_SORT FROM TO_DO_LIST_HED', (err, result) => {
        if(err) {
          console.log(err.stack);
        }else {
          insert_hed(result.rows[0].max_no + 1, req.query.name, result.rows[0].max_sort + 1);
        }
      });
    }
  });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});