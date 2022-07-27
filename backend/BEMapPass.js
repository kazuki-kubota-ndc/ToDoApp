const { getPostgresClient } = require('../db/postgresManager');

/* パスワードの変更 */
exports.map_update_pass = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[map_update_pass]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', password:'+req.query.pass
          + ', new_password:'+req.query.new_pass
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_mst([req.query.user_id, req.query.pass]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      var result = 1;
      /* パスワード不一致 */
      if(cnt!=1) {
        result = 2;
      }
      res.json({
        result: result
      });
    }
  }

  /* 現行パスワードチェック */
  async function select_mst(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COUNT(*) AS CNT FROM USER_MST_MAP WHERE USER_ID = $1 AND PASS = $2';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 1)
      }else {
        if(result.rows[0].cnt==0) {
          return_result(err_flg, 0);
        }else {
          update_pass([req.query.user_id, req.query.new_pass]);
        }
      }
    }
  }

  /* 登録処理 */
  async function update_pass(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE USER_MST_MAP SET PASS = $2 WHERE USER_ID = $1';
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
      return_result(err_flg, 1)
    }
  }
}

