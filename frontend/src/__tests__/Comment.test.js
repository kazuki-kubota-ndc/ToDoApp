import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main, { Login } from '../Main';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
  window.alert = jest.fn();
});
afterEach(() => {
  /* fetchMockをリセット */
  fetchMock.restore();
});

describe('コメント追加処理のテスト', () => {
  test('コメントが空の時のエラーメッセージのテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [
      {
        task: 1,
        task_name: 'test_task',
        task_color: 'ee82ee',
        task_check: 0,
        dtl: 'test_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      },
      {
        task: 2,
        task_name: 'second_task',
        task_color: 'cdcdcd',
        task_check: 0,
        dtl: 'second_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      }
    ];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/select_sub?user_id=test_user_id&list_no=1&task_no=1', {
        result: 2
      });

    /* テスト用ユーザーデータ(admin => 1) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});
  
    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'first_list',
        list_color: 'cdcdcd',
        task_cnt: 0
      },
      {
        list_no: 2,
        list_name: 'second_list',
        list_color: 'ffffff',
        task_cnt: 0
      }
    ];
    /* 検索結果が存在するかのデータ(0:存在なし、1:存在) */
    const testlistArray = [
      {cnt: 1}
    ];
    render(
      <Router history={history}>
        <Login
          userData={testUserData}
          array={testListData}
          listArray={testlistArray}
        />
      </Router>
    );
    /* リストをクリック */
    userEvent.click(await screen.findByText('first_list'));
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    /* コメント追加アイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_searchcomment_add'));
    /* コメント名を空に変更 */
    userEvent.clear(await screen.findByLabelText('コメント'));
    /* 追加ボタンをクリック */
    userEvent.click(await screen.findByRole('button', {name: '追加'}));
    /* アラートを確認 */
    expect(window.alert).toHaveBeenCalledWith('コメントが未入力です');
  });
  test('コメント追加処理実行のテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [
      {
        task: 1,
        task_name: 'test_task',
        task_color: 'ee82ee',
        task_check: 0,
        dtl: 'test_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      },
      {
        task: 2,
        task_name: 'second_task',
        task_color: 'cdcdcd',
        task_check: 0,
        dtl: 'second_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      }
    ];
  
    /* コメント追加後のコメントリストデータ */
    const subDatas = [
      {
        sub_no: 1,
        sub_name: 'new_comment',
        sub_check: 0
      }
    ];

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/select_sub?user_id=test_user_id&list_no=1&task_no=1', {
        result: 2
      })
      .get('/insert_sub?user_id=test_user_id&list_no=1&task_no=1&comment=new_comment', {
        result: 1,
        sub_no: 1,
        sub_datas: subDatas
      });

    /* テスト用ユーザーデータ(admin => 1) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});
  
    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'first_list',
        list_color: 'cdcdcd',
        task_cnt: 0
      },
      {
        list_no: 2,
        list_name: 'second_list',
        list_color: 'ffffff',
        task_cnt: 0
      }
    ];
    /* 検索結果が存在するかのデータ(0:存在なし、1:存在) */
    const testlistArray = [
      {cnt: 1}
    ];
    render(
      <Router history={history}>
        <Login
          userData={testUserData}
          array={testListData}
          listArray={testlistArray}
        />
      </Router>
    );
    /* リストをクリック */
    userEvent.click(await screen.findByText('first_list'));
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    /* コメント追加アイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_searchcomment_add'));
    /* コメント名を変更 */
    userEvent.clear(await screen.findByLabelText('コメント'));
    userEvent.type(await screen.findByLabelText('コメント'), 'new_comment');
    /* 追加ボタンをクリック */
    userEvent.click(await screen.findByRole('button', {name: '追加'}));
    /* コメントが表示されているか確認 */
    const comment = await screen.findByRole('new_comment_sub_name');
    expect(comment.textContent).toBe('new_comment');
  });
});
describe('コメント編集処理のテスト', () => {
  test('コメント編集画面初期表示テスト', async () => {
    const history = createMemoryHistory();
      
    const testTaskDatas = [
      {
        task: 1,
        task_name: 'test_task',
        task_color: 'ee82ee',
        task_check: 0,
        dtl: 'test_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      },
      {
        task: 2,
        task_name: 'second_task',
        task_color: 'cdcdcd',
        task_check: 0,
        dtl: 'second_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      }
    ];
      
    /* コメント追加後のコメントリストデータ */
    const subDatas = [
      {
        sub_no: 1,
        sub_name: 'test_comment',
        sub_check: 0
      }
    ];
    
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/select_sub?user_id=test_user_id&list_no=1&task_no=1', {
        result: 1,
        sub_no: 1,
        data: subDatas
      });
    
    /* テスト用ユーザーデータ(admin => 1) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});
      
    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'first_list',
        list_color: 'cdcdcd',
        task_cnt: 0
      },
      {
        list_no: 2,
        list_name: 'second_list',
        list_color: 'ffffff',
        task_cnt: 0
      }
    ];
    /* 検索結果が存在するかのデータ(0:存在なし、1:存在) */
    const testlistArray = [
      {cnt: 1}
    ];
    render(
      <Router history={history}>
        <Login
          userData={testUserData}
          array={testListData}
          listArray={testlistArray}
        />
      </Router>
    );
    /* リストをクリック */
    userEvent.click(await screen.findByText('first_list'));
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    /* コメントアイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_searchcomment'));
    /* コメント編集アイコンをクリック */
    userEvent.click(await screen.findByRole('test_comment_edit'));
    /* コメントが表示されているか確認 */
    const comment = await screen.findByRole('test_comment_sub_name');
    expect(comment.textContent).toBe('test_comment');
  });
  test('コメント編集処理実行テスト', async () => {
    const history = createMemoryHistory();
      
    const testTaskDatas = [
      {
        task: 1,
        task_name: 'test_task',
        task_color: 'ee82ee',
        task_check: 0,
        dtl: 'test_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      },
      {
        task: 2,
        task_name: 'second_task',
        task_color: 'cdcdcd',
        task_check: 0,
        dtl: 'second_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      }
    ];
      
    /* コメント追加後のコメントリストデータ */
    const subDatas = [
      {
        sub_no: 1,
        sub_name: 'test_comment',
        sub_check: 0
      }
    ];
    
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/select_sub?user_id=test_user_id&list_no=1&task_no=1', {
        result: 1,
        sub_no: 1,
        data: subDatas
      })
      .get('/update_sub?user_id=test_user_id&list_no=1&task_no=1&comment=edit_comment&sub_no=1', {
        result: 1
      });
    
    /* テスト用ユーザーデータ(admin => 1) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});
      
    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'first_list',
        list_color: 'cdcdcd',
        task_cnt: 0
      },
      {
        list_no: 2,
        list_name: 'second_list',
        list_color: 'ffffff',
        task_cnt: 0
      }
    ];
    /* 検索結果が存在するかのデータ(0:存在なし、1:存在) */
    const testlistArray = [
      {cnt: 1}
    ];
    render(
      <Router history={history}>
        <Login
          userData={testUserData}
          array={testListData}
          listArray={testlistArray}
        />
      </Router>
    );
    /* リストをクリック */
    userEvent.click(await screen.findByText('first_list'));
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    /* コメントアイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_searchcomment'));
    /* コメント編集アイコンをクリック */
    userEvent.click(await screen.findByRole('test_comment_edit'));
    /* コメント名を変更 */
    userEvent.clear(await screen.findByLabelText('コメント'));
    userEvent.type(await screen.findByLabelText('コメント'), 'edit_comment');
    /* 変更ボタンをクリック */
    userEvent.click(await screen.findByRole('button', {name: '変更'}));    
    /* コメントが表示されているか確認 */
    const comment = await screen.findByRole('edit_comment_sub_name');
    expect(comment.textContent).toBe('edit_comment');
  });
});
describe('コメント編集処理のテスト', () => {
  test('コメント編集画面初期表示テスト', async () => {
    const history = createMemoryHistory();
        
    const testTaskDatas = [
      {
        task: 1,
        task_name: 'test_task',
        task_color: 'ee82ee',
        task_check: 0,
        dtl: 'test_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      },
      {
        task: 2,
        task_name: 'second_task',
        task_color: 'cdcdcd',
        task_check: 0,
        dtl: 'second_dtl',
        shimebi: '2022/10/01',
        shime_time: 12,
        shime_min: 10,
        sub_cnt: 0,
      }
    ];
        
    /* コメント追加後のコメントリストデータ */
    const subDatas = [
      {
        sub_no: 1,
        sub_name: 'test_comment',
        sub_check: 0
      }
    ];
      
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/select_sub?user_id=test_user_id&list_no=1&task_no=1', {
        result: 1,
        sub_no: 1,
        data: subDatas
      })
      .get('/delete_sub?user_id=test_user_id&list_no=1&task_no=1&sub_no=1', {
        result: 1
      })
      ;
      
    /* テスト用ユーザーデータ(admin => 1) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});
        
    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'first_list',
        list_color: 'cdcdcd',
        task_cnt: 0
      },
      {
        list_no: 2,
        list_name: 'second_list',
        list_color: 'ffffff',
        task_cnt: 0
      }
    ];
    /* 検索結果が存在するかのデータ(0:存在なし、1:存在) */
    const testlistArray = [
      {cnt: 1}
    ];
    render(
      <Router history={history}>
        <Login
          userData={testUserData}
          array={testListData}
          listArray={testlistArray}
        />
      </Router>
    );
    /* リストをクリック */
    userEvent.click(await screen.findByText('first_list'));
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    /* コメントアイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_searchcomment'));
    /* コメント削除アイコンをクリック */
    userEvent.click(await screen.findByRole('test_comment_delete'));
    /* 画面表示の変更を待つ */
    await new Promise((res) => setTimeout(res, 1000));
    /* コメントが削除されているか確認 */
    expect(await screen.queryByRole('test_comment_sub_name')).toBeNull();
  });
});
