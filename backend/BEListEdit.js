const { getPostgresClient } = require('../db/postgresManager');

/* insert処理 */
exports.insert_main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_main]';
  console.log(apiName+': start');
  console.log('group_no:'+req.query.group_no+', name:'+req.query.name+', sort:'+req.query.sort);
  exec_insert([req.query.group_no, req.query.name, req.query.sort]);

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
  async function exec_insert(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST(GROUP_NO,NAME,SORT) VALUES($1, $2, $3)';
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

/* delete処理 */
exports.delete_main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_main]';
  console.log(apiName+': start');
  console.log('group_no:'+req.query.group_no);
  exec_delete([req.query.group_no]);

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
  async function exec_delete(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST WHERE GROUP_NO = $1';
    const sql2 = 'DELETE FROM TO_DO_LIST_HED WHERE GROUP_NO = $1';
    const sql3 = 'DELETE FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1';
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

/* update処理 */
exports.update_main_name = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_main_name]';
  console.log(apiName+': start');
  console.log('group_no:'+req.query.group_no+', name:'+req.query.name);
  update_main([req.query.group_no, req.query.name]);

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
  async function update_main(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST SET NAME = $2 WHERE GROUP_NO = $1';
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

/* ソート処理 */
exports.update_main_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_main_sort]';
  console.log(apiName+': start');
  update_main(req.body);

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
  async function update_main(items) {
    var err_flg = false;
    var log_message = '';
    var no;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST SET SORT = $2 WHERE GROUP_NO = $1';
    try {
      await dbm.begin();
      items.map(async item => {
        const params = [item.group_no, item.sort];
        await dbm.execute(sql, params);
        log_message += '('+item.group_no+','+item.sort+'),';
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
      console.log('group_no,sort: '+log_message);
      return_result(err_flg);
    }
  }
}

