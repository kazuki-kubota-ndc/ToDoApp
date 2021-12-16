const { getPostgresClient } = require('../db/postgresManager');

/* 初期表示 */
exports.main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[main]';
  console.log(apiName+': start');
  console.log('user_id: '+req.query.user_id);
  /* 検索処理を実行 */
  select_all([req.query.user_id]);

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
  async function select_all(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT TDL.GROUP_NO,TDL.NAME,COALESCE(TDLH.CNT, 0) AS CNT,TDL.COLOR AS COLOR,TDL.SORT AS SORT FROM TO_DO_LIST TDL LEFT JOIN ('
              + 'SELECT GROUP_NO,COUNT(*) AS CNT FROM TO_DO_LIST_HED WHERE USER_ID = $1 GROUP BY GROUP_NO'
              + ') TDLH ON TDL.GROUP_NO = TDLH.GROUP_NO WHERE TDL.USER_ID = $1 ORDER BY TDL.SORT';
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
}
