const { getPostgresClient } = require('../db/postgresManager');

/* 詳細ソート処理 */
exports.upd_dtl_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_dtl_sort]';
  console.log(apiName+': start');
  update_hed(req.body);

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
  async function update_hed(items) {
    var err_flg = false;
    var log_message = '';
    var no;
    var user_id;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_DTL SET SORT = $4 WHERE NO = $1 AND USER_ID = $2 AND DTL_NO = $3';
    try {
      await dbm.begin();
      items.map(async item => {
        const params = [item.no, item.user_id, item.dtl_no, item.sort];
        await dbm.execute(sql, params);
        log_message += '('+item.dtl_no+','+item.sort+'),';
        no = item.no;
        user_id = item.user_id;
      });
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      console.log('user_id: '+user_id+', no: '+no);
      console.log('dtl_no,sort: '+log_message);
      return_result(err_flg);
    }
  }
}