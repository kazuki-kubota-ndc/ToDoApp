const { getPostgresClient } = require('../db/postgresManager');

/* insert���� */
exports.insert_main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_main]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', name:'+req.query.name+', sort:'+req.query.sort);
  exec_insert([req.query.user_id, req.query.group_no, req.query.name, 'dcdcdc', req.query.sort]);

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
  async function exec_insert(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST(USER_ID,GROUP_NO,NAME,COLOR,SORT) VALUES($1, $2, $3, $4, $5)';
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
}

/* delete���� */
exports.delete_main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_main]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no);
  exec_delete([req.query.group_no, req.query.user_id]);

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
  async function exec_delete(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST WHERE GROUP_NO = $1 AND USER_ID = $2';
    const sql2 = 'DELETE FROM TO_DO_LIST_HED WHERE GROUP_NO = $1 AND USER_ID = $2';
    const sql3 = 'DELETE FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.execute(sql2, params);
      await dbm.execute(sql3, params);
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

/* update���� */
exports.update_main_name = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_main_name]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', name:'+req.query.name+', color:'+req.query.color);
  update_main([req.query.group_no, req.query.user_id, req.query.name, req.query.color]);

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
  async function update_main(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST SET NAME = $3, COLOR = $4 WHERE GROUP_NO = $1 AND USER_ID = $2';
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
}

/* �\�[�g���� */
exports.update_main_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_main_sort]';
  console.log(apiName+': start');
  update_main(req.body);

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
  async function update_main(items) {
    var err_flg = false;
    var log_message = '';
    var user_id;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST SET SORT = $3 WHERE GROUP_NO = $1 AND USER_ID = $2';
    try {
      await dbm.begin();
      items.map(async item => {
        const params = [item.group_no, item.user_id, item.sort];
        await dbm.execute(sql, params);
        log_message += '('+item.group_no+','+item.sort+'),';
        user_id = item.user_id;
      });
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      console.log('user_id: '+user_id);
      console.log('group_no,sort: '+log_message);
      return_result(err_flg);
    }
  }
}

