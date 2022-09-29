import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import Main, { Login } from '../Main';
import LoginModal from '../LoginModal';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
  window.alert = jest.fn();
});

describe('ログイン実行時のテスト', () => {

  afterEach(() => {
    /* fetchMockをリセット */
    fetchMock.restore();
  });

  test('ユーザーIDが空の時のエラー表示テスト', async () => {

    /* ダミーで定義するだけ */
    const mockFuncShowLogin = jest.fn();
    const mockFuncLoginOpen = jest.fn();
    const mockFuncLoginClose = jest.fn();
    const mockFuncAddUserBtn = jest.fn();

    render(
      <LoginModal
        showModal={mockFuncShowLogin}
        modalOpen={mockFuncLoginOpen}
        modalClose={mockFuncLoginClose}
        addUser={mockFuncAddUserBtn}
      />
    );

    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByPlaceholderText('USER_ID'), '');

    /* ログイン処理実行 */
    await userEvent.click(screen.getByRole('button', {name: 'ログイン'}));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('ユーザーIDを入力して下さい。');

  });

  test('パスワードが空の時のエラー表示テスト', async () => {

    /* ダミーで定義するだけ */
    const mockFuncShowLogin = jest.fn();
    const mockFuncLoginOpen = jest.fn();
    const mockFuncLoginClose = jest.fn();
    const mockFuncAddUserBtn = jest.fn();

    render(
      <LoginModal
        showModal={mockFuncShowLogin}
        modalOpen={mockFuncLoginOpen}
        modalClose={mockFuncLoginClose}
        addUser={mockFuncAddUserBtn}
      />
    );

    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByPlaceholderText('USER_ID'), 'test');
    await userEvent.type(screen.getByPlaceholderText('PASSWORD'), '');

    /* ログイン処理実行 */
    await userEvent.click(screen.getByRole('button', {name: 'ログイン'}));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('パスワードを入力して下さい。');

  });

  test('ユーザーとパスワードが正しくない場合のエラー表示テスト', async () => {

    /* /loginでのgetのfetchに対してエラーを返すmock */
    fetchMock
      .get('/login?login_id=test&pass=pass', {
        result: 2,
      });

    /* ダミーで定義するだけ */
    const mockFuncShowLogin = jest.fn();
    const mockFuncLoginOpen = jest.fn();
    const mockFuncLoginClose = jest.fn();
    const mockFuncAddUserBtn = jest.fn();

    render(
      <LoginModal
        showModal={mockFuncShowLogin}
        modalOpen={mockFuncLoginOpen}
        modalClose={mockFuncLoginClose}
        addUser={mockFuncAddUserBtn}
      />
    );

    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByPlaceholderText('USER_ID'), 'test');
    await userEvent.type(screen.getByPlaceholderText('PASSWORD'), 'pass');

    /* ログイン処理実行 */
    await userEvent.click(screen.getByRole('button', {name: 'ログイン'}));

    /* アラートの確認 */
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('ユーザーID、パスワードが正しくありません。'));

  });

  test('ログイン実行、history.pushで/Mainが呼び出されるかの確認テスト', async () => {

    const history = createMemoryHistory();

    /* 正常な処理想定のダミーデータ */
    const data = [{}];
    
    /* 正常ログイン処理 */
    fetchMock
      .get('/login?login_id=test&pass=pass', {
        result: 1,
        data: data
      });

    /* ダミーで定義するだけ */
    const mockFuncShowLogin = jest.fn();
    const mockFuncLoginOpen = jest.fn();
    const mockFuncLoginClose = jest.fn();
    const mockFuncAddUserBtn = jest.fn();

    render(
      <Router history={history}>
        <LoginModal
          showModal={mockFuncShowLogin}
          modalOpen={mockFuncLoginOpen}
          modalClose={mockFuncLoginClose}
          addUser={mockFuncAddUserBtn}
        />
      </Router>
    );

    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByPlaceholderText('USER_ID'), 'test');
    await userEvent.type(screen.getByPlaceholderText('PASSWORD'), 'pass');

    /* ログイン処理実行 */
    await userEvent.click(screen.getByRole('button', {name: 'ログイン'}));

    /* history.pushが/Mainで呼び出されるのをチェック */
    await waitFor(() => 
      expect(history.location.pathname).toBe('/Main')
    );

  });
});

describe('ログイン後の画面表示テスト', () => {

  test('ログイン後の文字サイズ適応を確認(大）', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      });

    /* テスト用ユーザーデータ(font_size,o_font => 2) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '2',
      o_font: '2',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});

    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'test_list',
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
    /* 'リスト一覧'の文字サイズ用のクラスがitleLargeになっているか確認 */
    expect(screen.getByText('リスト一覧')).toHaveClass('titleLarge');
    fetchMock.restore();
  });
  test('ログイン後の文字サイズ適応を確認(中）', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      });

    /* テスト用ユーザーデータ(font_size,o_font => 1) */
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
        list_name: 'test_list',
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
    /* 'リスト一覧'の文字サイズ用のクラスがitleMedになっているか確認 */
    expect(screen.getByText('リスト一覧')).toHaveClass('titleMed');
    fetchMock.restore();
  });
  test('ログイン後の文字サイズ適応を確認(小）', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      });

    /* テスト用ユーザーデータ(font_size,o_font => 0) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '0',
      o_font: '0',
      admin: '1'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});

    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'test_list',
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
    /* 'リスト一覧'の文字サイズ用のクラスがitleSmallになっているか確認 */
    expect(screen.getByText('リスト一覧')).toHaveClass('titleSmall');
    fetchMock.restore();
  }); 
});
describe('メニューの表示確認', () => {
  test('管理者権限でのメニュー表示テスト', async () => {
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
        list_name: 'test_list',
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
    /* メニューボタンをクリック*/
    await userEvent.click(screen.getByRole('menu_btn'));
    
    /* ユーザー名及びメニュー名が管理者権限のものが表示されているのを確認する */
    expect(await screen.findByText(/test_user_name/)).toBeInTheDocument();
    expect(await screen.findByText(/アカウント情報/)).toBeInTheDocument();
    expect(await screen.findByText(/ログアウト/)).toBeInTheDocument();
    expect(await screen.findByText(/ユーザー管理/)).toBeInTheDocument();
    fetchMock.restore();
  });
  test('一般ユーザー権限でのメニュー表示テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      });

    /* テスト用ユーザーデータ(admin => 0) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '0'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});

    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'test_list',
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
    /* メニューボタンをクリック*/
    await userEvent.click(screen.getByRole('menu_btn'));
    
    /* ユーザー名及びメニュー名が管理者権限のものが表示されていないのを確認する */
    expect(await screen.findByText(/test_user_name/)).toBeInTheDocument();
    expect(await screen.findByText(/アカウント情報/)).toBeInTheDocument();
    expect(await screen.findByText(/ログアウト/)).toBeInTheDocument();
    expect(await screen.queryByText(/ユーザー管理/)).toBeNull();
    fetchMock.restore();
  });
});
describe('ログアウト実行時のテスト', () => {
  test('ログアウト処理実行テスト', async () => {
    const history = createMemoryHistory();

    /* タスクモーダル呼び出し時のfetch(検索結果0を返す) */
    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      });

    /* テスト用ユーザーデータ(admin => 0) */
    const testUserData = {
      user_id: 'test_user_id',
      login_id: 'test_login_id',
      user_name: 'test_user_name',
      pass: 'test_pass',
      font_size: '1',
      o_font: '1',
      admin: '0'
    };
    /* useLocation()で使用するデータをhistoryにpushしておく */
    history.push({ pathname: '/Main', state: { user: testUserData }});

    /* テストリストデータ */
    const testListData = [
      {
        list_no: 1,
        list_name: 'test_list',
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
    /* メニューボタンをクリック*/
    await userEvent.click(screen.getByRole('menu_btn'));   
    /* ログアウトを実行 */
    await userEvent.click(screen.getByText('ログアウト'));

    /* history.pushが/で呼び出されるのをチェック */
    await waitFor(() => 
      expect(history.location.pathname).toBe('/')
    );
    fetchMock.restore();
  });
});