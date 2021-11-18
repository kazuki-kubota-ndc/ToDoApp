const { getPostgresClient } = require('../db/postgresManager');

/* �w�b�_�[�\�[�g���� */
exports.upd_hed_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_hed_sort]';
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
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_HED SET SORT = $2 WHERE NO = $1';
    try {
      await dbm.begin();
      items.map(async item => {
        const params = [item.no, item.sort];
        await dbm.execute(sql, params);
        log_message += '('+item.no+','+item.sort+'),';
      });
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      console.log('no,sort: '+log_message);
      return_result(err_flg)
    }
  }
}