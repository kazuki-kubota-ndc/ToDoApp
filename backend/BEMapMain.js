const { getPostgresClient } = require('../db/postgresManager');

/* 検索(marker_data) */
exports.select_marker = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_marker]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id);
  console.log('tag_no:'+req.query.tag_no);
  /* 検索処理を実行 */
  select_marker_view(req.query.tag_no, req.query.user_id);

  function return_result(flg, data, cnt, data2, data3, data4) {
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
          data: data,
          data2: data2,
          data3: data3,
          data4: data4
        });
      /* 検索結果無し */
      }else {
        res.json({
          result: 2,
          data: data,
          data2: data2,
          data3: data3,
          data4: data4
        });
      }
    }
  }

  /* 検索処理 */
  async function select_marker_view(tag_no, user_id) {
    var err_flg = false;
    var cnt = 0;
    var result;
    var result2;
    var params1 = [];
    var params2 = [];
    var params3 = [];
    var params4 = [];
    const dbm = await getPostgresClient();
    var sql = '';
    /* ユーザーID有り */
    if(user_id) {
      sql = 'SELECT MD.MARKER_NO, MD.NAME AS MARKER_NAME, MD.DTL, MD.LONGITUDE, MD.LATITUDE, CASE WHEN FA.MARKER_NO IS NOT NULL THEN 1 ELSE 0 END AS FAVORITE_FLG, MD.CREATE_USER_ID FROM MARKER_DATA MD '
          + 'LEFT JOIN FAVORITE FA ON MD.MARKER_NO = FA.MARKER_NO AND FA.USER_ID = $1'
          ;
      params1[0] = user_id;
      if(tag_no!='0') {
        sql += 'LEFT JOIN TAGGING TAG ON MD.MARKER_NO = TAG.MARKER_NO WHERE TAG.TAG_NO = $2 ';
        params1[1] = tag_no;
      }
      sql += 'ORDER BY MD.MARKER_NO';
    }else {
      sql = 'SELECT MD.MARKER_NO, MD.NAME AS MARKER_NAME, MD.DTL, MD.LONGITUDE, MD.LATITUDE, 0 AS FAVORITE_FLG, MD.CREATE_USER_ID FROM MARKER_DATA MD ';
      if(tag_no!='0') {
        sql += 'LEFT JOIN TAGGING TAG ON MD.MARKER_NO = TAG.MARKER_NO WHERE TAG.TAG_NO = $1 ';
      }
      sql += 'ORDER BY MD.MARKER_NO';
    }

    const sql2 = 'SELECT TAG.MARKER_NO, TAG.TAG_NO, TD.NAME AS TAG_NAME, TD.COLOR FROM TAGGING TAG LEFT JOIN TAG_DATA TD ON TAG.TAG_NO = TD.TAG_NO ORDER BY TAG.TAG_NO,TAG.MARKER_NO';
    var sql3 = '';
    /* ユーザーID有り */
    if(user_id) {
      sql3 = 'SELECT MD.MARKER_NO, MD.NAME AS MARKER_NAME, MD.DTL, MD.LONGITUDE, MD.LATITUDE, CASE WHEN FA.MARKER_NO IS NOT NULL THEN 1 ELSE 0 END AS FAVORITE_FLG, MD.CREATE_USER_ID FROM MARKER_DATA MD '
           + 'LEFT JOIN FAVORITE FA ON MD.MARKER_NO = FA.MARKER_NO AND FA.USER_ID = $1'
           + 'ORDER BY (CASE WHEN FA.MARKER_NO IS NOT NULL THEN 1 ELSE 0 END) DESC, MD.MARKER_NO'
           ;
      params3[0] = user_id;
    }else {
      sql3 = 'SELECT MARKER_NO, NAME AS MARKER_NAME, DTL, LONGITUDE, LATITUDE, 0 AS FAVORITE_FLG, CREATE_USER_ID FROM MARKER_DATA ORDER BY MARKER_NO';
    }
    const sql4 = 'SELECT TD.TAG_NO, TD.NAME AS TAG_NAME, TD.COLOR, TD.CREATE_USER_ID, TD.UPDATE_USER_ID, COALESCE(TAG.CNT, 0) AS CNT FROM TAG_DATA TD LEFT JOIN(SELECT TAG_NO, COUNT(*) AS CNT FROM TAGGING GROUP BY TAG_NO) TAG ON TD.TAG_NO = TAG.TAG_NO ORDER BY TAG_NO';
    try {
      result = await dbm.execute(sql, params1);
      result2 = await dbm.execute(sql2, params2);
      result3 = await dbm.execute(sql3, params3);
      result4 = await dbm.execute(sql4, params4);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows, cnt, result2.rows, result3.rows, result4.rows);
    }
  }
};

/* マーカーの追加 */
exports.insert_marker = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_marker]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', marker_name:'+req.query.marker_name
          + ', dtl:'+req.query.dtl
          + ', lat:'+req.query.lat
          + ', lng:'+req.query.lng
          + ', favorite_flg:'+req.query.favorite_flg
          ;
  console.log(msg);

  /* 検索処理=>追加処理を実行 */
  select_marker();

  function return_result(flg, marker_no) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        marker_no: marker_no
      });
    }
  }

  /* 検索処理 */
  async function select_marker() {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COALESCE(MAX(MARKER_NO),0) AS MARKER_NO FROM MARKER_DATA';
    const sql2 = 'SELECT COALESCE(MAX(ID),0) AS ID FROM FAVORITE';
    try {
      result = await dbm.execute(sql, []);
      result2 = await dbm.execute(sql2, []);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0)
      }else {
        var new_marker_no = result.rows[0].marker_no+1;
        console.log('marker_no:'+new_marker_no);
        var new_id = result2.rows[0].id+1;
        insert_marker([new_marker_no, req.query.marker_name, req.query.dtl, req.query.lng, req.query.lat, req.query.user_id], [new_id, req.query.user_id, new_marker_no]);
      }
    }
  }

  /* 登録処理 */
  async function insert_marker(params, params2) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO MARKER_DATA (MARKER_NO, NAME, DTL, LONGITUDE, LATITUDE, CREATE_USER_ID) VALUES ($1, $2, $3, $4, $5, $6)';
    const sql2 = 'INSERT INTO FAVORITE(ID, USER_ID, MARKER_NO) VALUES($1, $2, $3)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      if(req.query.user_id && req.query.favorite_flg=='1') {
        console.log('favorite insert');
        console.log('id:'+params2[0]);
        const result2 = await dbm.execute(sql2, params2);
      }
      cnt = result.rowCount;
      await dbm.commit();
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, params[0])
    }
  }

}

/* マーカー更新 */
exports.update_marker = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_marker]';
  console.log(apiName+': start');
  var msg = 'user_id:'+req.query.user_id
          + ', marker_no:'+req.query.marker_no
          + ', marker_name:'+req.query.marker_name
          + ', dtl:'+req.query.dtl
          + ', favorite_flg:'+req.query.favorite_flg
          ;
  console.log(msg);
  update_marker([req.query.marker_name, req.query.dtl, req.query.user_id, req.query.marker_no], [req.query.user_id, req.query.marker_no], req.query.user_id, req.query.favorite_flg);

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
  async function update_marker(params, params2, user_id, favorite_flg) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE MARKER_DATA SET NAME = $1, DTL = $2, UPDATE_USER_ID = $3 WHERE MARKER_NO = $4';
    const sql2 = 'INSERT INTO FAVORITE(ID, USER_ID, MARKER_NO) VALUES((SELECT COALESCE(MAX(ID)+1,1) FROM FAVORITE), $1, $2)';
    const sql3 = 'DELETE FROM FAVORITE WHERE USER_ID = $1 AND MARKER_NO = $2';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      if(user_id) {
        if(favorite_flg=='1') {
          console.log('favorite insert');
          console.log('user_id:'+params2[0]+',marker_no:'+params2[1]);
          const result3 = await dbm.execute(sql3, params2);
          const result2 = await dbm.execute(sql2, params2);
        }else {
          console.log('favorite delete');
          console.log('user_id:'+params2[0]+',marker_no:'+params2[1]);
          const result3 = await dbm.execute(sql3, params2);
        }
      }
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

/* タグ情報更新処理 */
exports.update_tagging = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var log_message = '';
  var apiName = '[update_tagging]';
  console.log(apiName+': start');
  var tagDatas = req.body;
  var not_insert = 0;
  var insert_marker_no = 0;
  var index = 0;
  req.body.map(async tag => {
    if(index==0) {
      if(tag.not_insert) {
        not_insert = tag.not_insert;
      }
      insert_marker_no = tag.marker_no;
    }
    index++;
  });
  console.log('not_insert: '+not_insert);
  console.log('insert_marker_no: '+insert_marker_no);
  delete_tagging(insert_marker_no);

  function return_result(flg) {
    if(not_insert==0) {
      console.log('(marker_no, tag_no)');
      console.log(log_message);
    }
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  /* 削除>登録処理 */
  async function delete_tagging(insert_marker_no) {
    var err_flg = false;
    var apiName = '[delete_tagging]';
    console.log(apiName+': start');
    console.log('insert_marker_no: '+insert_marker_no);
    var params = [insert_marker_no];
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TAGGING WHERE MARKER_NO = $1';
    const sql2 = 'INSERT INTO TAGGING(ID, MARKER_NO, TAG_NO) VALUES((SELECT COALESCE(MAX(ID)+1,1) FROM TAGGING), $1, $2)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      if(not_insert==0) {
        tagDatas.map(async tag => {
          const params2 = [insert_marker_no, tag.tag_no];
          await dbm.execute(sql2, params2);
          log_message += '('+insert_marker_no+', '+tag.tag_no+'),';
        });
      }
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.commit();
      await dbm.release();
      return_result(err_flg);
    }
  }
}

/* マーカー削除処理 */
exports.delete_marker = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_marker]';
  console.log(apiName+': start');
  console.log('marker_no: '+req.query.marker_no);
  /* deleteを実行 */
  delete_marker([req.query.marker_no]);

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
  async function delete_marker(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM MARKER_DATA WHERE MARKER_NO = $1';
    const sql2 = 'DELETE FROM TAGGING WHERE MARKER_NO = $1';
    const sql3 = 'DELETE FROM FAVORITE WHERE MARKER_NO = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      await dbm.execute(sql2, params);
      await dbm.execute(sql3, params);
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

/* タグ情報登録処理 */
exports.insert_tag = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_tag]';
  console.log(apiName+': start');
  var tagDatas = req.body;
  var tagging_insert = 0;
  var insert_tag_no = 0;
  var insert_tag_name = '';
  var insert_color = '';
  var insert_user_id = '';
  var index = 0;
  req.body.map(async tag => {
    if(index==0) {
      if(tag.tagging_update) {
        tagging_insert = tag.tagging_update;
      }
      insert_tag_name = tag.tag_name;
      insert_color = tag.color;
      insert_user_id = tag.user_id
    }
    index++;
  });
  console.log('tagging_insert: '+tagging_insert);
  console.log('insert_tag_name: '+insert_tag_name);
  console.log('insert_color: '+insert_color);
  console.log('insert_user_id: '+insert_user_id);
  select_tag_no(tagging_insert);

  function return_result(flg, insert_tag_no, log_message) {
    if(log_message!='') {
      console.log('(tag_no, marker_no)');
      console.log(log_message);
    }
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        tag_no: insert_tag_no
      });
    }
  }

  /* TAG_NO取得 */
  async function select_tag_no(tagging_insert) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT COALESCE(MAX(TAG_NO),0) AS TAG_NO FROM TAG_DATA';
    try {
      result = await dbm.execute(sql, []);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0, '')
      }else {
        var new_tag_no = result.rows[0].tag_no+1;
        console.log('tag_no:'+new_tag_no);
        insert_tag(tagging_insert, new_tag_no, [new_tag_no, insert_tag_name, insert_color, insert_user_id]);
      }
    }
  }

  /* 登録処理 */
  async function insert_tag(tagging_insert, insert_tag_no, params) {
    var err_flg = false;
    var log_message = '';
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TAG_DATA(TAG_NO, NAME, COLOR, CREATE_USER_ID) VALUES($1, $2, $3, $4)';
    const sql2 = 'INSERT INTO TAGGING(ID, MARKER_NO, TAG_NO) VALUES((SELECT COALESCE(MAX(ID)+1,1) FROM TAGGING), $1, $2)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      if(tagging_insert==1) {
        tagDatas.map(async tag => {
          const params2 = [tag.marker_no, insert_tag_no];
          await dbm.execute(sql2, params2);
          log_message += '('+insert_tag_no+', '+tag.marker_no+'),';
        });
      }
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.commit();
      await dbm.release();
      return_result(err_flg, insert_tag_no, log_message);
    }
  }
}


/* タグ情報更新処理 */
exports.update_tag = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_tag]';
  console.log(apiName+': start');
  var tagDatas = req.body;
  var tagging_update = 0;
  var upd_tag_no = 0;
  var upd_tag_name = '';
  var upd_color = '';
  var upd_user_id = '';
  var index = 0;
  req.body.map(async tag => {
    if(index==0) {
      if(tag.tagging_update) {
        tagging_update = tag.tagging_update;
      }
      upd_tag_no = tag.tag_no;
      upd_tag_name = tag.tag_name;
      upd_color = tag.color;
      upd_user_id = tag.user_id
    }
    index++;
  });
  console.log('tagging_update: '+tagging_update);
  console.log('upd_tag_no: '+upd_tag_no);
  console.log('upd_tag_name: '+upd_tag_name);
  console.log('upd_color: '+upd_color);
  console.log('upd_user_id: '+upd_user_id);
  update_tag(tagging_update, [upd_tag_name, upd_color, upd_user_id, upd_tag_no], [upd_tag_no]);

  function return_result(flg, log_message) {
    if(log_message!='') {
      console.log('(tag_no, marker_no)');
      console.log(log_message);
    }
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({ result: 1 });
    }
  }

  /* 更新処理、削除>登録処理 */
  async function update_tag(tagging_update, params, params2) {
    var err_flg = false;
    var log_message = '';
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TAG_DATA SET NAME = $1, COLOR = $2, UPDATE_USER_ID = $3 WHERE TAG_NO = $4';
    const sql2 = 'DELETE FROM TAGGING WHERE TAG_NO = $1';
    const sql3 = 'INSERT INTO TAGGING(ID, MARKER_NO, TAG_NO) VALUES((SELECT COALESCE(MAX(ID)+1,1) FROM TAGGING), $1, $2)';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      if(tagging_update==1) {
        await dbm.execute(sql2, params2);
        tagDatas.map(async tag => {
          const params3 = [tag.marker_no, tag.tag_no];
          await dbm.execute(sql3, params3);
          log_message += '('+tag.tag_no+', '+tag.marker_no+'),';
        });
      }
    } catch (e) {
      await dbm.rollback();
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.commit();
      await dbm.release();
      return_result(err_flg, log_message);
    }
  }
}

/* タグ削除処理 */
exports.delete_tag = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_tag]';
  console.log(apiName+': start');
  console.log('tag_no: '+req.query.tag_no);
  /* deleteを実行 */
  delete_tag([req.query.tag_no]);

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
  async function delete_tag(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TAG_DATA WHERE TAG_NO = $1';
    const sql2 = 'DELETE FROM TAGGING WHERE TAG_NO = $1';
    try {
      await dbm.begin();
      const result = await dbm.execute(sql, params);
      await dbm.execute(sql2, params);
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


/* 検索(marker_list_reset) */
exports.marker_list_reset = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[marker_list_reset]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id);
  console.log('tag_nos:'+req.query.tag_nos);
  /* 検索処理を実行 */
  select_marker_list(req.query.user_id, req.query.tag_nos);

  function return_result(flg, data, data2) {
    console.log('err: '+flg);
    console.log(apiName+': end');

    /* 正常処理：１、エラー：０を返す */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        markerViewData: data,
        markerListData: data2
      });
    }
  }

  /* 検索処理 */
  async function select_marker_list(user_id, tag_nos) {
    var err_flg = false;
    var cnt = 0;
    var result;
    var result2;
    var params1 = [];
    var params2 = [];
    const dbm = await getPostgresClient();
    var sql = '';
      sql = 'SELECT MD.MARKER_NO, MD.NAME AS MARKER_NAME, MD.DTL, MD.LONGITUDE, MD.LATITUDE, CASE WHEN FA.MARKER_NO IS NOT NULL THEN 1 ELSE 0 END AS FAVORITE_FLG, MD.CREATE_USER_ID FROM MARKER_DATA MD '
          + 'LEFT JOIN FAVORITE FA ON MD.MARKER_NO = FA.MARKER_NO AND FA.USER_ID = $1 '
          ;
      params1[0] = user_id;

      /* sql2はタグ絞り込み無しのデータ */
      const sql2 = sql + 'ORDER BY FAVORITE_FLG DESC,MD.MARKER_NO';
      params2[0] = user_id;
      /* sql1はタグ絞り込みで画面に表示するデータ */
      if(tag_nos!='0') {
        var tag_no = tag_nos.split(',');
        sql += 'LEFT JOIN TAGGING TAG ON MD.MARKER_NO = TAG.MARKER_NO WHERE TAG.TAG_NO IN( ';
        for(var i=0;i<tag_no.length;i++) {
          if(i!=0) {
            sql += ',';
          }
          sql += '$' + String(i+2);
          params1[i+1] = tag_no[i];
        }
        sql += ') ';
      }
      sql += 'ORDER BY FAVORITE_FLG DESC,MD.MARKER_NO';
    try {
      result = await dbm.execute(sql, params1);
      result2 = await dbm.execute(sql2, params2);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      return_result(err_flg, result.rows, result2.rows);
    }
  }
};



