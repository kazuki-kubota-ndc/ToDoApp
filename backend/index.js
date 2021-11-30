const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001

const { getPostgresClient } = require('../db/postgresManager');
const ListMain = require('./BEListMain');
const ListEdit = require('./BEListEdit');
const hedSort = require('./BEHedSort');
const dtlSort = require('./BEDtlSort');

app.use(express.static(path.join(__dirname, '../frontend/build')));
// リクエストボディをjsonに変換する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

/* トップ画面初期表示 */
app.get("/api", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[api]';
  console.log(apiName+': start');
  /* 検索処理を実行 */
  select_all();

  /* 正常時、検索結果を返す */
  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      if(cnt!=0) {
        res.json({
          result: 1,
          data: data
        });
      /* 検索結果0件 */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_all() {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT TDL.GROUP_NO,TDL.NAME,COALESCE(TDLH.CNT, 0) AS CNT,TDL.SORT FROM TO_DO_LIST TDL LEFT JOIN ('
              + 'SELECT GROUP_NO,COUNT(*) AS CNT FROM TO_DO_LIST_HED GROUP BY GROUP_NO'
              + ') TDLH ON TDL.GROUP_NO = TDLH.GROUP_NO ORDER BY TDL.SORT';
    try {
      result = await dbm.execute(sql, []);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows, cnt);
    }
  }

});



/* -------------------- BEListMain.js -------------------- */

/* リスト画面初期表示時の処理 */
app.get("/init", ListMain.init);

/* ヘッダー削除処理 */
app.get("/delete_hed", ListMain.delete_hed);

/* チェックボックスをチェックした時の処理 */
app.get("/update_check", ListMain.update_check);

/* リスト名変更処理 */
app.get("/update_hed_name", ListMain.update_hed_name);

/* inputでEnterを押した時の処理(hed追加) */
app.get("/insert_hed", ListMain.insert_hed);

/* 詳細の表示 */
app.get("/select_dtl", ListMain.select_dtl);

/* 詳細の追加 */
app.get("/insert_dtl", ListMain.insert_dtl);

/* 詳細名変更処理 */
app.get("/update_dtl_name", ListMain.update_dtl_name);

/* 詳細削除処理 */
app.get("/delete_dtl", ListMain.delete_dtl);



/* -------------------- BEListEdit.js -------------------- */

/* insert処理 */
app.get("/insert_main", ListEdit.insert_main);

/* delete処理 */
app.get("/delete_main", ListEdit.delete_main);

/* update処理 */
app.get("/update_main_name", ListEdit.update_main_name);

/* ソート処理 */
app.post("/update_main_sort", ListEdit.update_main_sort);



/* -------------------- BEHedSort.js -------------------- */

/* ヘッダーソート処理 */
app.post("/upd_hed_sort", hedSort.upd_hed_sort);



/* -------------------- BEDtlSort.js -------------------- */

/* 詳細ソート処理 */
app.post("/upd_dtl_sort", dtlSort.upd_dtl_sort);



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});