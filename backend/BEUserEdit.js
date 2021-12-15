const { getPostgresClient } = require('../db/postgresManager');

/* ユーザー一覧検索 */
exports.select_all_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_all_user]';
  console.log(apiName+': start');
  /* 検索処理を実行 */
  select_all_user();

  /* 正常時、検索結果を返す */
  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log('cnt: '+cnt);
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
  async function select_all_user() {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,PASS AS O_PASS,ADMIN AS O_ADMIN,FONT_SIZE AS O_FONT,'
              + 'CASE WHEN FONT_SIZE = 0 THEN \'小\' WHEN FONT_SIZE = 2 THEN \'大\' ELSE \'中\' END AS FONT,'
              + 'CASE WHEN ADMIN = 1 THEN \'管理者\' ELSE \'ユーザー\' END AS AD,'
              + 'CASE WHEN PASS IS NULL THEN \'未設定\' WHEN PASS = \'\' THEN \'未設定\' ELSE \'******\' END AS PASS,'
              + 'CASE WHEN TWITTER_ID IS NULL THEN \'\' ELSE \'連携済み\' END AS TWITTER,'
              + 'CASE WHEN GOOGLE_ADDRESS IS NULL THEN \'\' ELSE \'連携済み\' END AS GOOGLE,'
              + 'CASE WHEN GITHUB_ID IS NULL THEN \'\' ELSE \'連携済み\' END AS GITHUB'
              + ' FROM USER_MST ORDER BY LOGIN_ID,USER_NAME';
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
}

/* ユーザー追加 */
exports.insert_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_user]';
  console.log(apiName+': start');
  console.log('login_id: '+req.query.login_id+', pass: '+req.query.pass+', admin: '+req.query.admin+', font_size: '+req.query.font);
  /* login_idの重複確認 */
  select_login_id('insert');

  function return_result(flg, data, user_id) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        user_id: user_id,
        data: data
      });
    }
  }

  async function create_user_id() {
    const user_id = Math.random().toString(32).substring(2);
    await select_user_id(user_id);
  }

  /* 登録 */
  async function exec_insert_user(user_id, data) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO USER_MST(USER_ID,LOGIN_ID,USER_NAME,PASS,ADMIN,FONT_SIZE) VALUES($1, $2, $3, $4, $5, $6)';
    const params = [user_id, req.query.login_id, req.query.login_id, req.query.pass, req.query.admin, req.query.font];
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
      select_login_id('login');
    }
  }

  /* 検索処理(login_id) */
  async function select_login_id(action) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,PASS,FONT_SIZE,ADMIN FROM USER_MST WHERE (USER_ID = $1 OR LOGIN_ID = $1)';
    const params = [req.query.login_id];
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
        return_result(err_flg, [], '');
      }else {
        if(action=='insert') {
          /* login_id重複 */
          if(isUser) {
            console.log('err: '+err_flg);
            console.log('Registered ID');
            console.log(apiName+': end');
            res.json({ result: 2 });
          /* 登録処理実行 */
          }else {
            create_user_id();
          }
        }else if(action=='login') {
          return_result(err_flg, result.rows, result.rows[0].user_id);
        }
      }
    }
  }

  /* 検索処理(user_id) */
  async function select_user_id(user_id) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,USER_NAME,PASS,FONT_SIZE,ADMIN FROM USER_MST WHERE USER_ID = $1';
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
        /* 再度id作成 */
        if(isUser) {
          create_user_id();
        /* 登録処理実行 */
        }else {
          console.log('user_id: '+user_id);
          exec_insert_user(user_id);
        }
      }
    }
  }

}

/* ユーザー編集 */
exports.update_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_user]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', login_id:'+req.query.login_id+', user_name:'+req.query.user_name+', pass:'+req.query.pass+', admin:'+req.query.admin+', font:'+req.query.font);
  select_login_id([req.query.user_id, req.query.login_id]);

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
  async function update_user(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST SET LOGIN_ID = $2,USER_NAME = $3,PASS = $4,ADMIN = $5,FONT_SIZE = $6 WHERE USER_ID = $1';
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
      return_result(err_flg);
    }
  }

  /* 検索処理(login_id) */
  async function select_login_id(params) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,USER_NAME,PASS,FONT_SIZE,ADMIN FROM USER_MST WHERE LOGIN_ID = $2 AND NOT USER_ID = $1';
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
        return_result(err_flg);
      }else {
        /* login_id重複 */
        if(isUser) {
          console.log('err: '+err_flg);
          console.log('Registered ID');
          console.log(apiName+': end');
          res.json({ result: 2 });
        /* 更新処理実行 */
        }else {
          update_user([req.query.user_id, req.query.login_id, req.query.user_name, req.query.pass, req.query.admin, req.query.font]);
        }
      }
    }
  }

}

/* ユーザー削除 */
exports.delete_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_user]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id);
  exec_delete([req.query.user_id]);

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
  async function exec_delete(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM USER_MST WHERE USER_ID = $1';
    const sql2 = 'DELETE FROM TO_DO_LIST WHERE USER_ID = $1';
    const sql3 = 'DELETE FROM TO_DO_LIST_HED WHERE USER_ID = $1';
    const sql4 = 'DELETE FROM TO_DO_LIST_DTL WHERE USER_ID = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.execute(sql2, params);
      await dbm.execute(sql3, params);
      await dbm.execute(sql4, params);
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg);
    }
  }
}

