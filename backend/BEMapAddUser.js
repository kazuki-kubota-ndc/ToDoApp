const { getPostgresClient } = require('../db/postgresManager');

/* ユーザー追加 */
exports.map_insert_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[map_insert_user]';
  console.log(apiName+': start');
  var msg = 'login_id:'+req.query.login_id
          + ', user_name:'+req.query.user_name
          + ', admin:'+req.query.admin
          + ', font_size:'+req.query.font_size
          + ', pass:'+req.query.pass
          ;
  console.log(msg);

  /* 検索処理=>ユーザーID作成処理=>追加処理を実行 */
  select_mst([req.query.login_id]);

  function return_result(flg, cnt, user_id) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      var result = 1;
      /* 重複有り */
      if(cnt!=0) {
        result = 2;
      }
      res.json({
        result: result,
        user_id: user_id,
        pass: req.query.pass
      });
    }
  }

  /* ログインIDの重複チェック */
  async function select_mst(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COUNT(*) AS CNT FROM USER_MST_MAP WHERE LOGIN_ID = $1';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0, '')
      }else {
        if(result.rows[0].cnt!=0) {
          return_result(err_flg, result.rows[0].cnt, '');
        }else {
          /* 新規ユーザーID作成 */
          create_user_id();
        }
      }
    }
  }

  async function create_user_id() {
    const user_id = Math.random().toString(32).substring(2);
    await select_user_id(user_id);
  }

  /* 検索処理(user_id) */
  async function select_user_id(user_id) {
    var err_flg = false;
    var isUser = false;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,USER_NAME,PASS,FONT_SIZE,ADMIN FROM USER_MST_MAP WHERE USER_ID = $1';
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
        return_result(err_flg, 0, '');
      }else {
        /* 再度id作成 */
        if(isUser) {
          create_user_id();
        /* 登録処理実行 */
        }else {
          console.log('user_id: '+user_id);
          exec_insert_user([user_id, req.query.login_id, req.query.user_name, req.query.pass, req.query.admin, req.query.font_size], user_id);
        }
      }
    }
  }

  /* 登録処理(初期のlist_dataも登録) */
  async function exec_insert_user(params, user_id) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO USER_MST_MAP(USER_ID,LOGIN_ID,USER_NAME,PASS,ADMIN,FONT_SIZE)VALUES($1,$2,$3,$4,$5,$6)';
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
      return_result(err_flg, 0, user_id)
    }
  }
}

/* ユーザー更新 */
exports.map_update_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[map_update_user]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', login_id:'+req.query.login_id
          + ', user_name:'+req.query.user_name
          + ', admin:'+req.query.admin
          + ', font_size:'+req.query.font_size
          + ', pass:'+req.query.pass
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_mst([req.query.login_id, req.query.user_id]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      var result = 1;
      /* 重複有り */
      if(cnt!=0) {
        result = 2;
      }
      res.json({
        result: result,
      });
    }
  }

  /* ログインIDの重複チェック */
  async function select_mst(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COUNT(*) AS CNT FROM USER_MST_MAP WHERE LOGIN_ID = $1 AND USER_ID <> $2';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0)
      }else {
        if(result.rows[0].cnt!=0) {
          return_result(err_flg, result.rows[0].cnt);
        }else {
          /* 更新処理実行 */
          exec_update_user([req.query.login_id, req.query.user_name, req.query.pass, req.query.admin, req.query.font_size, req.query.user_id]);
        }
      }
    }
  }

  /* 登録処理 */
  async function exec_update_user(params, user_id) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST_MAP SET LOGIN_ID = $1, USER_NAME = $2, PASS = $3, ADMIN = $4, FONT_SIZE = cast($5 as integer) WHERE USER_ID = $6';
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
      return_result(err_flg, 0)
    }
  }
}

/* パスワード検索 */
exports.map_select_pass = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[map_select_pass]';
  console.log(apiName+': start');
  console.log('user_id: '+req.query.user_id);
  /* 検索処理を実行 */
  select_pass([req.query.user_id]);

  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* 検索結果有り */
      if(cnt>0) {
        res.json({
          result: 1,
          pass: data
        });
      /* 検索結果無し */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_pass(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT PASS FROM USER_MST_MAP WHERE USER_ID = $1';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows[0].pass, cnt);
    }
  }
}
