const { getPostgresClient } = require('../db/postgresManager');

/* ログイン */
exports.map_login = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[map_login]';
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
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,FONT_SIZE AS O_FONT,ADMIN FROM USER_MST_MAP WHERE LOGIN_ID = $1 AND PASS = $2';
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

};


