const { getPostgresClient } = require('../db/postgresManager');

/* ログインIDの変更 */
exports.update_login_id = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_login_id]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', new_login_id:'+req.query.new_login_id
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_mst([req.query.new_login_id]);

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
        result: result
      });
    }
  }

  /* ログインIDの重複チェック */
  async function select_mst(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COUNT(*) AS CNT FROM USER_MST WHERE LOGIN_ID = $1';
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
          update_login_id([req.query.new_login_id, req.query.user_id]);
        }
      }
    }
  }

  /* 登録処理 */
  async function update_login_id(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST SET LOGIN_ID = $1 WHERE USER_ID = $2';
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

/* ユーザー名変更 */
exports.update_user_name = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_user_name]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', user_name:'+req.query.user_name
          ;
  console.log(msg);

  /* 処理を実行 */
  update_user_name([req.query.user_id, req.query.user_name]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1
      });
    }
  }

  /* 登録処理 */
  async function update_user_name(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST SET USER_NAME = $2 WHERE USER_ID = $1';
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
}

/* 権限変更 */
exports.update_admin = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_admin]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', admin:'+req.query.admin
          ;
  console.log(msg);

  /* 処理を実行 */
  update_admin([req.query.user_id, req.query.admin]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1
      });
    }
  }

  /* 登録処理 */
  async function update_admin(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST SET ADMIN = $2 WHERE USER_ID = $1';
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
}

/* サイズ変更 */
exports.update_size = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_size]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', admin:'+req.query.size
          ;
  console.log(msg);

  /* 処理を実行 */
  update_size([req.query.user_id, req.query.size]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1
      });
    }
  }

  /* 登録処理 */
  async function update_size(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST SET FONT_SIZE = $2 WHERE USER_ID = $1';
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
}

/* ユーザー削除 */
exports.delete_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_user]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id;
  console.log(msg);

  /* 処理を実行 */
  delete_user([req.query.user_id]);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1
      });
    }
  }

  /* 削除処理 */
  async function delete_user(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM USER_MST WHERE USER_ID = $1';
    const sql2 = 'DELETE FROM LIST_DATA WHERE USER_ID = $1';
    const sql3 = 'DELETE FROM TASK_DATA WHERE USER_ID = $1';
    const sql4 = 'DELETE FROM SUB_DATA WHERE USER_ID = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      await dbm.execute(sql2, params);
      await dbm.execute(sql3, params);
      await dbm.execute(sql4, params);
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
}

