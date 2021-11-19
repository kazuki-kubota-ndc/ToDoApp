const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001

const { getPostgresClient } = require('../db/postgresManager');
const hedSort = require('./BEHedSort');
const dtlSort = require('./BEDtlSort');

app.use(express.static(path.join(__dirname, '../frontend/build')));
// リクエストボディをjsonに変換する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

/* 画面初期表示時の処理 */
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
          result: 1 ,
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
    const sql = 'SELECT NO,NAME,CHECK_FLG,SORT FROM TO_DO_LIST_HED ORDER BY SORT';
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

/* ヘッダー削除処理 */
app.get("/delete_hed", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_hed]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no);
  /* deleteを実行 */
  delete_hed([req.query.no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 削除処理 */
  async function delete_hed(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_HED WHERE NO = $1';
    const sql2 = 'DELETE FROM TO_DO_LIST_DTL WHERE NO = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.execute(sql2, params);
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, cnt);
    }
  }

});

/* チェックボックスをチェックした時の処理 */
app.get("/update_check", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_check]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+', check_flg:'+req.query.check_flg);
  /* updateを実行 */
  update_check([req.query.no, req.query.check_flg]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_check(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_HED SET CHECK_FLG = $2 WHERE NO = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      /* 更新件数0件 */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg, cnt);
    }
  }

});

/* リスト名変更処理 */
app.get("/update_hed_name", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_hed_name]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+', name:'+req.query.name);
  /* updateを実行 */
  update_hed_name([req.query.no, req.query.name]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  /* 更新処理 */
  async function update_hed_name(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_HED SET NAME = $2 WHERE NO = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      /* 更新件数0件 */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg);
    }
  }

});

/* inputでEnterを押した時の処理(hed追加) */
app.get("/insert_hed", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_hed]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+',name:'+req.query.name+',sort:'+req.query.sort);
  /* DTL削除=>HED登録 */
  delete_dtl(req.query.no, req.query.name, req.query.sort);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        no: req.query.no,
        name: req.query.name,
        sort: req.query.sort
      });
    }
  }

  /* 削除処理 */
  async function delete_dtl(no, name, sort) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_DTL WHERE NO = $1';
    const params = [no];
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg)
      }else {
        insert_hed([no, name, 0, sort]);
      }
    }
  }

  /* 登録処理 */
  async function insert_hed(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST_HED (NO, NAME, CHECK_FLG, SORT) VALUES ($1, $2, $3, $4)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg)
    }
  }

});

/* 詳細の表示 */
app.get("/select_dtl", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_dtl]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no);
  /* 検索処理を実行 */
  select_dtl([req.query.no]);

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
          result: 1 ,
          cnt: cnt,
          data: data
        });
      /* 検索結果0件 */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT DTL_NO,TEXT AS NAME,SORT FROM TO_DO_LIST_DTL WHERE NO = $1 ORDER BY SORT';
    try {
      result = await dbm.execute(sql, params);
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

/* 詳細の追加 */
app.get("/insert_dtl", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_dtl]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+', name:'+req.query.name);
  /* 検索処理=>追加処理を実行 */
  select_dtl([req.query.no]);

  function return_result(flg, dtl_no, sort) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        no: req.query.no,
        dtl_no: dtl_no,
        name: req.query.name,
        sort: sort
      });
    }
  }

  /* 検索処理 */
  async function select_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT MAX(DTL_NO) AS DTL_NO,MAX(SORT) AS SORT FROM TO_DO_LIST_DTL WHERE NO = $1';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0, 0)
      }else {
        var new_dtl_no = result.rows[0].dtl_no+1;
        var new_sort = result.rows[0].sort+1;
        console.log('dtl_no:'+new_dtl_no+',sort:'+new_sort);
        insert_dtl([req.query.no, new_dtl_no, req.query.name, new_sort]);
      }
    }
  }

  /* 登録処理 */
  async function insert_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST_DTL (NO, DTL_NO, TEXT, SORT) VALUES ($1, $2, $3, $4)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, params[1], params[3])
    }
  }

});

/* 詳細名変更処理 */
app.get("/update_dtl_name", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_dtl_name]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+', dtl_no:'+req.query.dtl_no+', name:'+req.query.name);
  /* updateを実行 */
  update_dtl_name([req.query.no, req.query.dtl_no, req.query.name]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  /* 更新処理 */
  async function update_dtl_name(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_DTL SET TEXT = $3 WHERE NO = $1 AND DTL_NO = $2';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      /* 更新件数0件 */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg);
    }
  }

});

/* 詳細削除処理 */
app.get("/delete_dtl", (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_dtl]';
  console.log(apiName+': start');
  console.log('no:'+req.query.no+', dtl_no:'+req.query.dtl_no);
  /* deleteを実行 */
  delete_dtl([req.query.no, req.query.dtl_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 削除処理 */
  async function delete_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_DTL WHERE NO = $1 AND DTL_NO = $2';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, cnt);
    }
  }

});

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