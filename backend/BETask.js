const { getPostgresClient } = require('../db/postgresManager');

/* 検索(task_data) */
exports.select_task = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_task]';
  console.log(apiName+': start');
  console.log('user_id: '+req.query.user_id+', list_no: '+req.query.list_no);
  /* 検索処理を実行 */
  select_task([req.query.user_id, req.query.list_no]);

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
  async function select_task(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT TASKD.LIST_NO,TASKD.TASK_NO AS TASK,TASKD.NAME AS TASK_NAME,TASKD.COLOR AS TASK_COLOR,TASKD.CHECK_FLG AS TASK_CHECK,TASKD.DTL,TO_CHAR(TASKD.SHIMEBI, \'YYYY/MM/DD\') AS SHIMEBI,TASKD.SHIME_TIME,TASKD.SHIME_MIN,COALESCE(SUB.CNT,0) AS SUB_CNT'
              + ' FROM TASK_DATA TASKD'
              + ' LEFT JOIN ('
              + ' SELECT TASK_NO,COUNT(*) AS CNT,FALSE AS COMMENT,FALSE AS ADD'
              + ' FROM SUB_DATA'
              + ' WHERE USER_ID = $1 AND LIST_NO = $2'
              + ' GROUP BY TASK_NO'
              + ' )SUB ON TASKD.TASK_NO = SUB.TASK_NO'
              + ' WHERE TASKD.USER_ID = $1 AND TASKD.LIST_NO = $2'
              + ' ORDER BY TASKD.SORT';
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

/* 検索(sub_data) */
exports.select_sub = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_sub]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+',list_no:'+req.query.list_no+',task_no:'+req.query.task_no);
  /* 検索処理を実行 */
  select_sub([req.query.user_id,req.query.list_no,req.query.task_no]);

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
  async function select_sub(params) {
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
      return_result(err_flg, result.rows, cnt);
    }
  }
}

/* コメント削除処理 */
exports.delete_sub = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_sub]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', list_no:'+req.query.list_no+', task_no:'+req.query.task_no+', sub_no:'+req.query.sub_no);
  /* deleteを実行 */
  delete_sub([req.query.user_id, req.query.list_no, req.query.task_no, req.query.sub_no]);

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
  async function delete_sub(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM SUB_DATA WHERE USER_ID = $1 AND LIST_NO = $2 AND TASK_NO = $3 AND SUB_NO = $4';
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