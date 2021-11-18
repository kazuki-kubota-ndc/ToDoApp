const { getPostgresClient } = require('../db/postgresManager');

/* �ڍ׃\�[�g���� */
exports.upd_dtl_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_dtl_sort]';
  console.log(apiName+': start');
  update_hed(req.body);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  /* �X�V���� */
  async function update_hed(items) {
    var err_flg = false;
    var log_message = '';
    var no;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_DTL SET SORT = $3 WHERE NO = $1 AND DTL_NO = $2';
    try {
      await dbm.begin();
      items.map(async item => {
        const params = [item.no, item.dtl_no, item.sort];
        await dbm.execute(sql, params);
        log_message += '('+item.dtl_no+','+item.sort+'),';
        no = item.no;
      });
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      console.log('no: '+no);
      console.log('dtl_no,sort: '+log_message);
      return_result(err_flg)
    }
  }
}