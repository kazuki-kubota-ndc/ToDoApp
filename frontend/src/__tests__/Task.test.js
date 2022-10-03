import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main, { Login } from '../Main';
import TaskModal from '../TaskModal';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
  window.alert = jest.fn();
});

describe('タスク画面、初期表示処理のテスト', () => {
  test('タスク画面初期表示テスト', async () => {
    const history = createMemoryHistory();

    /* モック関数作成 */
    const mockFuncShowTask = jest.fn();
    const mockFuncTaskOpen = jest.fn();
    const mockFuncTaskClose = jest.fn();
    const mockFuncSetTaskData = jest.fn();
    const mockFuncSetTaskDatas = jest.fn();
    const mockFuncSetItems = jest.fn();
    const mockFuncOpenMenu = jest.fn();
    const mockFuncSetCenterData = jest.fn();
    const mockFuncSetShowCenter = jest.fn();
    const mockFuncSetShowAddTask = jest.fn();
    const mockFuncAddTaskData = jest.fn();
    const mockFuncSetAddTaskData = jest.fn();
    const mockFuncSetShowAddComment = jest.fn();
    const mockFuncSetAddCommentData = jest.fn();
    const mockFuncLoadingTask = jest.fn();
    const mockFuncSetLoadingTask = jest.fn();

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

    /* テストタスクデータ */
    const testTaskData = {
      list_no: 1,
      list_name: 'first_list',
      list_color: 'cdcdcd',
      task_cnt: 0
    }
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];

    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});

    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        formData: testTaskDatas
      });

    render(
      <Router history={history}>
        <TaskModal
          showModal={mockFuncShowTask}
          modalOpen={mockFuncTaskOpen}
          modalClose={mockFuncTaskClose}
          modalData={testTaskData}
          setModalData={mockFuncSetTaskData}
          taskDatas={testTaskDatas}
          setTaskDatas={mockFuncSetTaskDatas}
          items={testListData}
          setItems={mockFuncSetItems}
          user={testUserData}
          openMenu={mockFuncOpenMenu}
          setCenterData={mockFuncSetCenterData}
          setShowCenter={mockFuncSetShowCenter}
          setShowAddTask={mockFuncSetShowAddTask}
          addTaskData={mockFuncAddTaskData}
          setAddTaskData={mockFuncSetAddTaskData}
          setShowAddComment={mockFuncSetShowAddComment}
          setAddCommentData={mockFuncSetAddCommentData}
          loadingTask={mockFuncLoadingTask}
          setLoadingTask={mockFuncSetLoadingTask}
          sizeClass={'Med'}
        />
      </Router>
    );
    /* タスク名が表示されているのを確認 */
    expect(await screen.findByText('test_task')).toBeInTheDocument();
    /* カラーが適応されているか確認 */
    expect(await screen.findByRole('test_task_labelcolor_task')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    fetchMock.restore();
  });
});
describe('タスク画面、タスク追加処理のテスト', () => {
  test('タスク名が空の時のエラーメッセージのテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
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
    /* タスク追加をクリック */
    userEvent.click(await screen.findByText('タスク追加'));
    /* タスク名を空に変更 */
    userEvent.clear(await screen.findByLabelText('タスク名'));
    /* 追加を実行 */
    userEvent.click(await screen.findByRole('button', {name: '追加'}));
    /* アラートを確認 */
    expect(window.alert).toHaveBeenCalledWith('タスク名が入力されていません');
    fetchMock.restore();
  });
  test('詳細に4行以上入力した時のエラーメッセージのテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
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
    /* タスク追加をクリック */
    userEvent.click(await screen.findByText('タスク追加'));
    /* タスク名を入力 */
    userEvent.type(await screen.findByLabelText('タスク名'), 'new_task');
    /* 詳細に4行入力 */
    userEvent.clear(await screen.findByLabelText('詳細'));
    userEvent.type(await screen.findByLabelText('詳細'), 'a\nb\nc\nd');
    /* 追加を実行 */
    userEvent.click(await screen.findByRole('button', {name: '追加'}));
    /* アラートを確認 */
    expect(window.alert).toHaveBeenCalledWith('詳細が４行以上入力されています、３行以下に修正して下さい。');
    fetchMock.restore();
  });
  test('詳細に4行以上入力した時のエラーメッセージのテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/insert_task?task_name=new_task&task_color=dcdcdc&task_dtl=new_dtl&task_date=2022/10/03&shime_time=12&shime_min=0&time_add_flg=0&task_check=0&list_no=1&user_id=test_user_id', {
        result: 1,
        task_no: 2
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
    /* タスク追加をクリック */
    userEvent.click(await screen.findByText('タスク追加'));
    /* タスク名を入力 */
    userEvent.type(await screen.findByLabelText('タスク名'), 'new_task');
    /* 詳細に4行入力 */
    userEvent.clear(await screen.findByLabelText('詳細'));
    userEvent.type(await screen.findByLabelText('詳細'), 'new_dtl');
    /* 追加を実行 */
    userEvent.click(await screen.findByRole('button', {name: '追加'}));
    /* タスクが追加されているのを確認 */
    const new_task = await screen.findByRole('new_task_task_name');
    expect(new_task.textContent).toBe('new_task');
    fetchMock.restore();
  });
});
describe('タスク編集処理のテスト', () => {
  test('タスク編集初期画面表示テスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
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
    /* タスク編集アイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_edit_btn_task'));
    /* タスク名が正常に表示されているのを確認 */
    const task = await screen.findByRole('test_task_task_name');
    expect(task.textContent).toBe('test_task');
    /* 詳細が正常に表示されているのを確認 */
    const dtl = await screen.findByRole('test_dtl_dtl');
    expect(dtl.textContent).toBe('test_dtl');
    fetchMock.restore();
  });
  test('タスク編集処理実行のテスト', async () => {
    const history = createMemoryHistory();
  
    const testTaskDatas = [{
      task: 1,
      task_name: 'test_task',
      task_color: 'ee82ee',
      task_check: 0,
      dtl: 'test_dtl',
      shimebi: '2022/10/01',
      shime_time: 12,
      shime_min: 10,
      sub_cnt: 0,
    }];
  
    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_task?user_id=test_user_id&list_no=1', {
        result: 1,
        data: testTaskDatas
      })
      .get('/update_task?task_name=edit_task&task_color=ee82ee&task_dtl=edit_dtl&task_date=2022/10/01&shime_time=12&shime_min=10&time_add_flg=1&task_check=0&list_no=1&user_id=test_user_id&task_no=1', {
        result: 1
      })

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
    /* タスク編集アイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_edit_btn_task'));
    /* タスク名を変更 */
    userEvent.clear(await screen.findByLabelText('タスク名'));
    userEvent.type(await screen.findByLabelText('タスク名'), 'edit_task');
    /* 詳細を変更 */
    userEvent.clear(await screen.findByLabelText('詳細'));
    userEvent.type(await screen.findByLabelText('詳細'), 'edit_dtl')
    /* 変更ボタンをクリック */
    userEvent.click(await screen.findByRole('button', {name: '変更'}));

    /* タスク名が変更されているのを確認 */
    const task = await screen.findByRole('edit_task_task_name');
    expect(task.textContent).toBe('edit_task');
    /* 詳細が変更されているのを確認 */
    const dtl = await screen.findByRole('edit_dtl_dtl');
    expect(dtl.textContent).toBe('edit_dtl');
    fetchMock.restore();
  });
});
describe('タスク削除処理のテスト', () => {
  test('タスク削除処理実行のテスト', async () => {
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
      .get('/delete_task?user_id=test_user_id&list_no=1&task_no=1', {
        result: 1
      })

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
    /* タスク削除アイコンをクリック */
    userEvent.click(await screen.findByRole('test_task_delete_btn_task'));
    /* 削除確認窓の削除ボタンをクリックして実行 */
    await userEvent.click(screen.getByRole('button', {name: '削除'}));
    /* 画面表示の変更を待つ */
    await new Promise((res) => setTimeout(res, 1000));
    /* タスクが削除されているのを確認する */
    expect(await screen.queryByRole('test_task_task_name')).toBeNull();
  });
});