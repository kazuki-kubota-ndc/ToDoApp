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

describe('メイン画面、初期表示処理のテスト', () => {
  test('メイン画面初期表示テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
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
        list_color: 'cdcdcd',
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
    /* リストデータのリスト名が表示されているか確認 */
    expect(screen.getByText('first_list')).toBeInTheDocument();
    expect(screen.getByText('second_list')).toBeInTheDocument();
    fetchMock.restore();
  });
});
describe('リスト追加処理のテスト', () => {
  test('リスト名が空の時のエラーメッセージ確認テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
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
        list_color: 'cdcdcd',
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
    /* リスト追加をクリック */
    userEvent.click(screen.getByText('リスト追加'));
    expect(await screen.findByText('リスト名')).toBeInTheDocument();

    /* リスト名を空白にする */
    await userEvent.clear(screen.getByLabelText('リスト名'));
    /* 追加ボタンをクリック */
    userEvent.click(screen.getByText('追加'));
    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('リスト名が入力されていません');
    fetchMock.restore();
  });
  test('リスト追加処理実行のテスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/insert_list?user_id=test_user_id&list_name=new_list&list_color=dcdcdc', {
        result: 1,
        list_no: 3
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
        list_color: 'cdcdcd',
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
    /* リスト追加をクリック */
    userEvent.click(screen.getByText('リスト追加'));
    expect(await screen.findByText('リスト名')).toBeInTheDocument();

    /* リスト名を変更する */
    await userEvent.clear(screen.getByLabelText('リスト名'));
    await userEvent.type(screen.getByLabelText('リスト名'), 'new_list');
    /* 追加ボタンをクリック */
    userEvent.click(screen.getByText('追加'));
    /* new_listが画面に表示されているのを確認 */
    expect(await screen.findByText('new_list')).toBeInTheDocument();
    fetchMock.restore();
  });
});
describe('リスト編集処理のテスト', () => {
  test('リスト編集初期画面表示テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/insert_list?user_id=test_user_id&list_name=new_list&list_color=dcdcdc', {
        result: 1,
        list_no: 3
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
    /* 編集をクリック */
    userEvent.click(screen.getByRole('second_list_edit_btn'));
    /* カラーが適応されているか確認する */
    expect(await screen.findByRole('new_color')).toHaveStyle({background: 'rgb(255, 255, 255)'});
    fetchMock.restore();
  });
  test('リスト編集処理実行のテスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/insert_list?user_id=test_user_id&list_name=new_list&list_color=dcdcdc', {
        result: 1,
        list_no: 3
      })
      .get('/update_list?user_id=test_user_id&list_no=1&list_name=edit_list&list_color=ee82ee', {
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
    /* 編集をクリック */
    userEvent.click(screen.getByRole('first_list_edit_btn'));
    /* リスト名を変更する */
    await userEvent.clear(screen.getByLabelText('リスト名'));
    await userEvent.type(screen.getByLabelText('リスト名'), 'edit_list');
    /* カラーを変更する */
    await userEvent.click(screen.getByRole('new_color'));
    await userEvent.click(screen.getByRole('violet'));

    /* 変更処理実行 */
    userEvent.click(screen.getByRole('button', {name: '変更'}));

    /* カラーが適応されているか確認する */
    expect(await screen.findByRole('edit_list_labelcolor')).toHaveStyle({background: 'rgb(238, 130, 238)'});
    fetchMock.restore();
  });
});
describe('リスト削除処理のテスト', () => {
  test('リスト削除処理実行テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/insert_list?user_id=test_user_id&list_name=new_list&list_color=dcdcdc', {
        result: 1,
        list_no: 3
      })
      .get('/delete_list?user_id=test_user_id&list_no=1', {
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
    /* リストの削除アイコンをクリック */
    userEvent.click(screen.getByRole('first_list_delete_btn'));
    /* 削除確認窓の削除ボタンをクリックして実行 */
    await userEvent.click(screen.getByRole('button', {name: '削除'}));
    /* 画面表示の変更を待つ */
    await new Promise((res) => setTimeout(res, 1000));
    /* リストが削除されているのを確認する */
    expect(await screen.queryByText('first_list')).toBeNull();
    fetchMock.restore();
  });
});