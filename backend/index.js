const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001

const { getPostgresClient } = require('../db/postgresManager');
const UserEdit = require('./BEUserEdit');
const Main = require('./BEMain');
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

/* ログイン */
app.get('/login', (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[login]';
  console.log(apiName+': start');
  console.log('login_id:'+req.query.login_id+', pass:'+req.query.pass);
  select_user([req.query.login_id, req.query.pass]);

  function return_result(flg, data, isUser) {
    console.log('err: '+flg);
    console.log(apiName+': end');

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* ユーザー情報有り */
      if(isUser) {
        res.json({
          result: 1,
          data: data
        });
      /* ユーザー情報無し */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_user(params) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,FONT_SIZE AS O_FONT,ADMIN FROM USER_MST WHERE LOGIN_ID = $1 AND PASS = $2';
    try {
      result = await dbm.execute(sql, params);
      if(result.rowCount>0) {
        isUser = true;
      }
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows, isUser);
    }
  }

});

/* ソーシャルログイン */
app.get('/social_login', (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[social_login]';
  console.log(apiName+': start');
  console.log('target:'+req.query.target+', id:'+req.query.id);
  /* 検索処理を実行 */
  select_user(req.query.target, [req.query.id]);

  function return_result(flg, data, isUser) {
    console.log('err: '+flg);
    console.log(apiName+': end');

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* ユーザー情報有り */
      if(isUser) {
        res.json({
          result: 1,
          data: data
        });
      /* ユーザー情報無し */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_user(target, params) {
    var err_flg = false;
    var isUser = false;
    var result;
    var whereCol = '';
    if(target=='twitter') {
      whereCol = 'TWITTER_ID';
    }else if(target=='google') {
      whereCol = 'GOOGLE_ADDRESS';
    }else if(target=='github') {
      whereCol = 'GITHUB_ID';
    }
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,FONT_SIZE,ADMIN FROM USER_MST WHERE '+whereCol+' = $1';
    try {
      result = await dbm.execute(sql, params);
      if(result.rowCount>0) {
        isUser = true;
      }
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows, isUser);
    }
  }
});

/* ソーシャルログイン(新規ユーザー作成) */
app.get('/social_create_user', (req, res) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[social_create_user]';
  console.log(apiName+': start');
  console.log('target:'+req.query.target+', id:'+req.query.id+', name:'+req.query.name);
  /* id作成 */
  create_user_id(req.query.target, req.query.id, req.query.name);

  function return_result(flg, data) {
    console.log('err: '+flg);

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      console.log(apiName+': end');
      res.json({
        result: 1,
        data: data
      });
    }
  }

  async function create_user_id(target, social_id, name) {
    const user_id = Math.random().toString(32).substring(2);
    await select_user('insert', target, social_id, req.query.name, user_id);
  }

  /* 登録処理 */
  async function insert_user(target, social_id, name, user_id) {
    var err_flg = false;
    var cnt = 0;
    var insertCol = '';
    if(target=='twitter') {
      insertCol = 'TWITTER_ID';
    }else if(target=='google') {
      insertCol = 'GOOGLE_ADDRESS';
    }else if(target=='github') {
      insertCol = 'GITHUB_ID';
    }
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO USER_MST (USER_ID,LOGIN_ID, PASS, USER_NAME, FONT_SIZE, ADMIN, '+insertCol+') VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const params = [user_id, user_id, user_id, name, 1, 0, social_id];
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
        console.log('user_id:'+user_id);
        select_user('login', target, social_id, name, user_id);
      }
    }
  }

  /* 検索処理 */
  async function select_user(action, target, social_id, name, user_id) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,FONT_SIZE,ADMIN FROM USER_MST WHERE USER_ID = $1';
    const params = [user_id];
    try {
      result = await dbm.execute(sql, params);
      if(result.rowCount>0) {
        isUser = true;
      }
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, []);
      }else {
        /* ログイン */
        if(action=='login') {
          return_result(err_flg, result.rows);
        }else if(action=='insert') {
          /* 再度id作成 */
          if(isUser) {
            create_user_id(target, social_id, name);
          /* 登録処理実行 */
          }else {
            insert_user(target, social_id, name, user_id)
          }
        }
      }
    }
  }
});



/* -------------------- BEUserEdit.js -------------------- */
app.get("/select_all_user", UserEdit.select_all_user);

app.get("/insert_user", UserEdit.insert_user);

app.get("/update_user", UserEdit.update_user);

app.get("/delete_user", UserEdit.delete_user);



/* -------------------- BEMain.js -------------------- */

/* リスト画面初期表示時の処理 */
app.get("/main", Main.main);



/* -------------------- BEListMain.js -------------------- */

/* リスト画面初期表示時の処理 */
app.get("/list_main", ListMain.list_main);

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