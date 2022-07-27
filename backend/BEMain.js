const { getPostgresClient } = require('../db/postgresManager');

/* 検索(list_data) */
exports.select_list = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_list]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id);
  /* 検索処理を実行 */
  select_list([req.query.user_id]);

  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* 検索結果有り */
      if(cnt>0) {
        res.json({
          result: 1,
          data: data
        });
      /* 検索結果無し */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* 検索処理 */
  async function select_list(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT LIST.LIST_NO,LIST.NAME AS LIST_NAME,LIST.COLOR AS LIST_COLOR,COALESCE(TASK.CNT,0) AS TASK_CNT'
              + ' FROM LIST_DATA LIST'
              + ' LEFT JOIN ('
              + ' SELECT LIST_NO,COUNT(*) AS CNT'
              + ' FROM TASK_DATA'
              + ' WHERE USER_ID = $1'
              + ' GROUP BY LIST_NO'
              + ' )TASK ON LIST.LIST_NO = TASK.LIST_NO'
              + ' WHERE USER_ID = $1'
              + ' ORDER BY LIST_NO';
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
};





/* チェックボックスをチェックした時の処理(task) */
exports.update_task_check = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_task_check]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no+', task_no:'+req.query.task_no+', check_flg:'+req.query.check_flg);
  /* updateを実行 */
  update_check([req.query.user_id, req.query.list_no, req.query.task_no, req.query.check_flg]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_check(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TASK_DATA SET CHECK_FLG = $4 WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3';
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
      /* 更新件数0件 */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg, cnt);
    }
  }

}

/* チェックボックスをチェックした時の処理(sub) */
exports.update_sub_check = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_sub_check]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no+', task_no:'+req.query.task_no+', sub_no:'+req.query.sub_no+', check_flg:'+req.query.check_flg);
  /* updateを実行 */
  update_check([req.query.user_id, req.query.list_no, req.query.task_no, req.query.sub_no, req.query.check_flg]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_check(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE SUB_DATA SET CHECK_FLG = $5 WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3 AND SUB_NO = $4';
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
      /* 更新件数0件 */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg, cnt);
    }
  }

}

/* タスクソート処理 */
exports.upd_task_sort = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[upd_task_sort]';
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
  async function update_hed(taskDatas) {
    var err_flg = false;
    var log_message = '';
    var user_id;
    var list_no;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TASK_DATA SET SORT = $4 WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3';
    try {
      await dbm.begin();
      taskDatas.map(async task => {
        const params = [task.user_id, task.list_no, task.task, task.sort];
        await dbm.execute(sql, params);
        log_message += '('+task.task+', '+task.sort+'),';
        user_id = task.user_id;
        list_no = task.list_no;
      });
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      console.log('user_id: '+user_id+', list_no: '+list_no);
      console.log('task, sort: '+log_message);
      return_result(err_flg);
    }
  }
}

/* リストの追加 */
exports.insert_list = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_list]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', list_name:'+req.query.list_name
          + ', list_color:'+req.query.list_color
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_list([req.query.user_id]);

  function return_result(flg, list_no) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        list_no: list_no
      });
    }
  }

  /* 検索処理 */
  async function select_list(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT MAX(LIST_NO) AS LIST_NO FROM LIST_DATA WHERE USER_ID = $1';
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
        var new_list_no = result.rows[0].list_no+1;
        console.log('list_no:'+new_list_no);
        insert_list([req.query.user_id, new_list_no, req.query.list_name, req.query.list_color]);
      }
    }
  }

  /* 登録処理 */
  async function insert_list(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO LIST_DATA (USER_ID, LIST_NO, NAME, COLOR) VALUES ($1, $2, $3, $4)';
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
      return_result(err_flg, params[1])
    }
  }

}

/* リスト削除処理 */
exports.delete_list = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_list]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no);
  /* deleteを実行 */
  delete_list([req.query.user_id, req.query.list_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 削除処理 */
  async function delete_list(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM LIST_DATA WHERE USER_ID = $1 AND LIST_NO = $2';
    const sql2 = 'DELETE FROM TASK_DATA WHERE USER_ID = $1 AND LIST_NO = $2';
    const sql3 = 'DELETE FROM SUB_DATA WHERE USER_ID = $1 AND LIST_NO = $2';
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
      return_result(err_flg, cnt);
    }
  }

}

/* リスト更新 */
exports.update_list = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_list]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no+', list_name:'+req.query.list_name+', list_color:'+req.query.list_color);
  update_list([req.query.list_name, req.query.list_color, req.query.user_id, req.query.list_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_list(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE LIST_DATA SET NAME = $1, COLOR = $2 WHERE USER_ID = $3 AND LIST_NO = $4';
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
      return_result(err_flg, cnt);
    }
  }
}

/* タスクの追加 */
exports.insert_task = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_task]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', list_no:'+req.query.list_no
          + ', task_name:'+req.query.task_name
          + ', task_color:'+req.query.task_color
          + ', task_dtl:'+req.query.task_dtl
          + ', task_date:'+req.query.task_date
          + ', shime_time:'+req.query.shime_time
          + ', shime_min:'+req.query.shime_min
          + ', time_add_flg:'+req.query.time_add_flg
          + ', task_check:'+req.query.task_check
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_task([req.query.list_no, req.query.user_id]);

  function return_result(flg, task_no) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        task_no: task_no
      });
    }
  }

  /* 検索処理 */
  async function select_task(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT MAX(TASK_NO) AS TASK_NO,MAX(SORT) AS SORT FROM TASK_DATA WHERE LIST_NO = $1 AND USER_ID = $2';
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
        var new_task_no = result.rows[0].task_no+1;
        var new_sort = result.rows[0].sort+1;
        console.log('task_no:'+new_task_no+',sort:'+new_sort);

        if(req.query.time_add_flg=='0') {
          insert_task([req.query.list_no, req.query.user_id, new_task_no, req.query.task_name, req.query.task_check, req.query.task_color, req.query.task_date, req.query.task_dtl, new_sort]);
        }else {
          insert_task([req.query.list_no, req.query.user_id, new_task_no, req.query.task_name, req.query.task_check, req.query.task_color, req.query.task_date, req.query.task_dtl, new_sort, req.query.shime_time, req.query.shime_min]);
        }
      }
    }
  }

  /* 登録処理 */
  async function insert_task(params) {
    var err_flg = false;
    var cnt = 0;
    var shimebi_sql = '';
    const dbm = await getPostgresClient();
    var sql='';
    if(req.query.time_add_flg=='0') {
      sql = 'INSERT INTO TASK_DATA (LIST_NO, USER_ID, TASK_NO, NAME, CHECK_FLG, COLOR, SHIMEBI, DTL, SORT) VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7, \'YYYY/MM/DD\'), $8, $9)';
    }else {
      sql = 'INSERT INTO TASK_DATA (LIST_NO, USER_ID, TASK_NO, NAME, CHECK_FLG, COLOR, SHIMEBI, DTL, SORT, SHIME_TIME, SHIME_MIN) VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7, \'YYYY/MM/DD\'), $8, $9, $10, $11)';
    }
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
      return_result(err_flg, params[2])
    }
  }

}

/* タスク削除処理 */
exports.delete_task = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_task]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no+', task_no:'+req.query.task_no);
  /* deleteを実行 */
  delete_task([req.query.user_id, req.query.list_no, req.query.task_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 削除処理 */
  async function delete_task(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TASK_DATA WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3';
    const sql2 = 'DELETE FROM SUB_DATA WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      cnt = result.rowCount;
      await dbm.execute(sql2, params);
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, cnt);
    }
  }

}

/* タスク更新 */
exports.update_task = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_task]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', list_no:'+req.query.list_no
          + ', task_name:'+req.query.task_name
          + ', task_color:'+req.query.task_color
          + ', task_dtl:'+req.query.task_dtl
          + ', task_date:'+req.query.task_date
          + ', shime_time:'+req.query.shime_time
          + ', shime_min:'+req.query.shime_min
          + ', time_add_flg:'+req.query.time_add_flg
          + ', task_check:'+req.query.task_check
          + ', task_no:'+req.query.task_no
          ;
  console.log(msg);
  if(req.query.time_add_flg=='0') {
    update_task([req.query.task_name, req.query.task_color, req.query.task_dtl, req.query.task_date, req.query.task_check, req.query.user_id, req.query.list_no, req.query.task_no]);
  }else {
    update_task([req.query.task_name, req.query.task_color, req.query.task_dtl, req.query.task_date, req.query.task_check, req.query.user_id, req.query.list_no, req.query.task_no, req.query.shime_time, req.query.shime_min]);
  }

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_task(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    var sql = '';
    if(req.query.time_add_flg=='0') {
      sql = 'UPDATE TASK_DATA SET NAME = $1, COLOR = $2, DTL = $3, SHIMEBI = TO_TIMESTAMP($4, \'YYYY/MM/DD\'), CHECK_FLG = $5 WHERE USER_ID = $6 AND LIST_NO = $7 AND TASK_NO = $8';
    }else {
      sql = 'UPDATE TASK_DATA SET NAME = $1, COLOR = $2, DTL = $3, SHIMEBI = TO_TIMESTAMP($4, \'YYYY/MM/DD\'), CHECK_FLG = $5, SHIME_TIME = $9, SHIME_MIN = $10 WHERE USER_ID = $6 AND LIST_NO = $7 AND TASK_NO = $8';
    }
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
      return_result(err_flg, cnt);
    }
  }
}

/* コメントの追加 */
exports.insert_sub = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_sub]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', list_no:'+req.query.list_no
          + ', task_no:'+req.query.task_no
          + ', comment:'+req.query.comment
          ;
  console.log(msg);

  /* 検索処理=>追加処理=>コメント一覧検索を実行 */
  select_sub([req.query.list_no, req.query.task_no, req.query.user_id]);

  function return_result(flg, sub_no, data) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        sub_no: sub_no,
        sub_datas: data
      });
    }
  }

  /* 検索処理 */
  async function select_sub(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT MAX(SUB_NO) AS SUB_NO,MAX(SORT) AS SORT FROM SUB_DATA WHERE LIST_NO = $1 AND TASK_NO = $2 AND USER_ID = $3';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0, [{}]);
      }else {
        var new_sub_no = result.rows[0].sub_no+1;
        var new_sort = result.rows[0].sort+1;
        console.log('sub_no:'+new_sub_no+',sort:'+new_sort);
        insert_sub([req.query.user_id, req.query.list_no, req.query.task_no, new_sub_no, req.query.comment, 0, new_sort]);
      }
    }
  }

  /* 登録処理 */
  async function insert_sub(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO SUB_DATA (USER_ID,LIST_NO,TASK_NO,SUB_NO,NAME,CHECK_FLG,SORT) VALUES ($1, $2, $3, $4, $5, $6, $7)';
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
      if(err_flg) {
        return_result(err_flg, 0, [{}]);
      }else {
        select_sub_list([req.query.user_id, req.query.list_no, req.query.task_no], params[3]);
      }
    }
  }

  /* 検索処理(一覧) */
  async function select_sub_list(params, new_sub_no) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT SUB_NO,NAME AS SUB_NAME,CHECK_FLG AS SUB_CHECK FROM SUB_DATA WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3 ORDER BY SORT';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, new_sub_no, result.rows);
    }
  }

}

/* コメント更新 */
exports.update_sub = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_sub]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', list_no:'+req.query.list_no
          + ', task_no:'+req.query.task_no
          + ', sub_no:'+req.query.task_no
          + ', comment:'+req.query.comment
          ;
  console.log(msg);
  update_task([req.query.comment, req.query.user_id, req.query.list_no, req.query.task_no, req.query.sub_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* 更新件数0件 */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* 更新処理 */
  async function update_task(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    var sql = '';
    sql = 'UPDATE SUB_DATA SET NAME = $1 WHERE USER_ID = $2 AND LIST_NO = $3 AND TASK_NO = $4 AND SUB_NO = $5';
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
      return_result(err_flg, cnt);
    }
  }
}

