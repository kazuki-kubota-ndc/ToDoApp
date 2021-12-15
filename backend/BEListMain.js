const { getPostgresClient } = require('../db/postgresManager');

/* ���X�g��ʏ����\�����̏��� */
exports.list_main = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[list_main]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', name:'+req.query.name+', color:'+req.query.color);
  /* �������������s */
  select_all([req.query.group_no, req.query.user_id]);

  /* ���펞�A�������ʂ�Ԃ� */
  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      if(cnt!=0) {
        res.json({
          result: 1 ,
          data: data,
          listData: {
            group_no: req.query.group_no,
            name: req.query.name,
            color: req.query.color
          }
        });
      /* ��������0�� */
      }else {
        res.json({
          result: 2 ,
          listData: {
            group_no: req.query.group_no,
            name: req.query.name,
            color: req.query.color
          }
        });
      }
    }
  }

  /* �������� */
  async function select_all(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT NO,NAME,CHECK_FLG,SORT,TO_CHAR(SHIMEBI, \'yyyy/mm/dd\') AS SHIMEBI,EXTRACT(HOUR FROM SHIMEBI) AS SHIMETIME,EXTRACT(MINUTE FROM SHIMEBI) AS SHIMEMIN FROM TO_DO_LIST_HED WHERE GROUP_NO = $1 AND USER_ID = $2 ORDER BY SORT';
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

/* �w�b�_�[�폜���� */
exports.delete_hed = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_hed]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no);
  /* delete�����s */
  delete_hed([req.query.group_no, req.query.user_id, req.query.no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* �X�V����0�� */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* �폜���� */
  async function delete_hed(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_HED WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3';
    const sql2 = 'DELETE FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3';
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

/* �`�F�b�N�{�b�N�X���`�F�b�N�������̏��� */
exports.update_check = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_check]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+', check_flg:'+req.query.check_flg);
  /* update�����s */
  update_check([req.query.group_no, req.query.user_id, req.query.no, req.query.check_flg]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      /* �X�V����0�� */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* �X�V���� */
  async function update_check(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_HED SET CHECK_FLG = $4 WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3';
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
      /* �X�V����0�� */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg, cnt);
    }
  }

}

/* ���X�g�ҏW���� */
exports.update_hed_name = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_hed_name]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+', name:'+req.query.name+', shimebi:'+req.query.shimebi+', time:'+req.query.shimetime+', min:'+req.query.shimemin);
  /* update�����s */
  update_hed_name([req.query.group_no, req.query.no, req.query.name, req.query.shimebi+' '+req.query.shimetime+':'+req.query.shimemin+':00']);

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
  async function update_hed_name(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_HED SET NAME = $3, SHIMEBI = TO_TIMESTAMP($4, \'YYYY/MM/DD HH24:MI:SS\') WHERE GROUP_NO = $1 AND NO = $2';
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
      /* �X�V����0�� */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg);
    }
  }

}

/* input��Enter�����������̏���(hed�ǉ�) */
exports.insert_hed = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_hed]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+',name:'+req.query.name+',sort:'+req.query.sort+',shimebi:'+req.query.shimebi+',time:'+req.query.shimetime+',minute:'+req.query.shimemin);
  /* DTL�폜=>HED�o�^ */
  delete_dtl(req.query.user_id, req.query.group_no, req.query.no);

  function return_result(flg) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        no: req.query.no,
        name: req.query.name,
        sort: req.query.sort,
        shimebi: req.query.shimebi,
        time: req.query.shimetime,
        min: req.query.shimemin
      });
    }
  }

  /* �폜���� */
  async function delete_dtl(user_id, group_no, no) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3';
    const params = [group_no, user_id, no];
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
        return_result(err_flg)
      }else {
        insert_hed([group_no, user_id, no, req.query.name, 0, req.query.sort, req.query.shimebi+' '+req.query.shimetime+':'+req.query.shimemin+':00']);
      }
    }
  }

  /* �o�^���� */
  async function insert_hed(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST_HED (GROUP_NO, USER_ID, NO, NAME, CHECK_FLG, SORT,SHIMEBI) VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7, \'YYYY/MM/DD HH24:MI:SS\'))';
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
      return_result(err_flg)
    }
  }

}

/* �ڍׂ̕\�� */
exports.select_dtl = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[select_dtl]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no);
  /* �������������s */
  select_dtl([req.query.group_no, req.query.user_id, req.query.no]);

  /* ���펞�A�������ʂ�Ԃ� */
  function return_result(flg, data, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      if(cnt!=0) {
        res.json({
          result: 1 ,
          cnt: cnt,
          data: data
        });
      /* ��������0�� */
      }else {
        res.json({ result: 2 });
      }
    }
  }

  /* �������� */
  async function select_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT DTL_NO,NAME,SORT FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3 ORDER BY SORT';
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

/* �ڍׂ̒ǉ� */
exports.insert_dtl = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[insert_dtl]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+', name:'+req.query.name);
  /* ��������=>�ǉ����������s */
  select_dtl([req.query.group_no, req.query.user_id, req.query.no]);

  function return_result(flg, dtl_no, sort) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0 });
    }else {
      res.json({
        result: 1,
        no: req.query.no,
        dtl_no: dtl_no,
        name: req.query.name,
        sort: sort
      });
    }
  }

  /* �������� */
  async function select_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    var result;
    const dbm = await getPostgresClient();
    const sql = 'SELECT MAX(DTL_NO) AS DTL_NO,MAX(SORT) AS SORT FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3';
    try {
      result = await dbm.execute(sql, params);
      cnt = result.rowCount;
    } catch (e) {
      console.log('err:'+e.stack);
      err_flg = true;
    } finally {
      await dbm.release();
      if(err_flg) {
        return_result(err_flg, 0, 0)
      }else {
        var new_dtl_no = result.rows[0].dtl_no+1;
        var new_sort = result.rows[0].sort+1;
        console.log('dtl_no:'+new_dtl_no+',sort:'+new_sort);
        insert_dtl([req.query.group_no, req.query.user_id, req.query.no, new_dtl_no, req.query.name, new_sort]);
      }
    }
  }

  /* �o�^���� */
  async function insert_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'INSERT INTO TO_DO_LIST_DTL (GROUP_NO, USER_ID, NO, DTL_NO, NAME, SORT) VALUES ($1, $2, $3, $4, $5, $6)';
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
      return_result(err_flg, params[3], params[5])
    }
  }

}

/* �ڍז��ύX���� */
exports.update_dtl_name = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[update_dtl_name]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+', dtl_no:'+req.query.dtl_no+', name:'+req.query.name);
  /* update�����s */
  update_dtl_name([req.query.group_no, req.query.user_id, req.query.no, req.query.dtl_no, req.query.name]);

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
  async function update_dtl_name(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'UPDATE TO_DO_LIST_DTL SET NAME = $5 WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3 AND DTL_NO = $4';
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
      /* �X�V����0�� */
      if(cnt==0) {
        err_flg = true;
      }
      return_result(err_flg);
    }
  }

}

/* �ڍ׍폜���� */
exports.delete_dtl = function(req, res) {
  res.header("Content-Type", "application/json; charset=utf-8");
  var apiName = '[delete_dtl]';
  console.log(apiName+': start');
  console.log('user_id:'+req.query.user_id+', group_no:'+req.query.group_no+', no:'+req.query.no+', dtl_no:'+req.query.dtl_no);
  /* delete�����s */
  delete_dtl([req.query.group_no, req.query.user_id, req.query.no, req.query.dtl_no]);

  function return_result(flg, cnt) {
    console.log('err: '+flg);
    console.log(apiName+': end');
    /* ���폈���F�P�A�G���[�F�O��Ԃ� */
    if(flg) {
      res.json({ result: 0});
    }else {
      /* �X�V����0�� */
      if(cnt==0) {
        res.json({ result: 0 });
      }else {
        res.json({ result: 1 });
      }
    }
  }

  /* �폜���� */
  async function delete_dtl(params) {
    var err_flg = false;
    var cnt = 0;
    const dbm = await getPostgresClient();
    const sql = 'DELETE FROM TO_DO_LIST_DTL WHERE GROUP_NO = $1 AND USER_ID = $2 AND NO = $3 AND DTL_NO = $4';
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
