const { getPostgresClient } = require('../db/postgresManager');

/* ユーザー情報取得 */
exports.select_user = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_user]';
  console.log(apiName+': start');

  /* 検索処理を実行 */
  select_mst();

  function return_result(flg, data) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        data: data
      });
    }
  }

  /* 検索 */
  async function select_mst(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT USER_ID,LOGIN_ID,USER_NAME,ADMIN,FONT_SIZE FROM USER_MST ORDER BY LOGIN_ID';
    try {
      result = await dbm.execute(sql, []);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows);
    }
  }
}



