import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { Login } from '../App';
import AddUserModal from '../AddUserModal';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
    window.alert = jest.fn();
  });
afterEach(() => {
  /* fetchMockをリセット */
  fetchMock.restore();
});

describe('新規登録実行時のテスト', () => {
  test('ユーザーIDが空の時のエラー表示テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowAddUser = jest.fn();
    const mockFuncAddUserOpen = jest.fn();
    const mockFuncAddUserClose = jest.fn();
    const mockFuncSetAddUserData = jest.fn();
    const mockFuncAddUser = jest.fn();
    const addUserData = new Map();
    const sizeClass = 'Med';
    const innerHeight = '1000';

    render(
      <AddUserModal
        showModal={mockFuncShowAddUser}
        modalOpen={mockFuncAddUserOpen}
        modalClose={mockFuncAddUserClose}
        modalData={addUserData}
        setModalData={mockFuncSetAddUserData}
        addUser={mockFuncAddUser}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
    );
    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByLabelText('ユーザーID'), '');

    /* 追加ボタンクリック */
    await userEvent.click(screen.getByRole('button'));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('ユーザーIDが入力されていません');
  });
  test('ユーザー名が空の時のエラー表示テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowAddUser = jest.fn();
    const mockFuncAddUserOpen = jest.fn();
    const mockFuncAddUserClose = jest.fn();
    const mockFuncSetAddUserData = jest.fn();
    const mockFuncAddUser = jest.fn();
    const addUserData = new Map();
    const sizeClass = 'Med';
    const innerHeight = '1000';

    render(
      <AddUserModal
        showModal={mockFuncShowAddUser}
        modalOpen={mockFuncAddUserOpen}
        modalClose={mockFuncAddUserClose}
        modalData={addUserData}
        setModalData={mockFuncSetAddUserData}
        addUser={mockFuncAddUser}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
    );
    /* inputのvalueを空に変更 */
    await userEvent.type(screen.getByLabelText('ユーザーID'), 'add_user_id');
    await userEvent.type(screen.getByLabelText('ユーザー名'), '');

    /* 追加ボタンクリック */
    await userEvent.click(screen.getByRole('button'));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('ユーザー名が入力されていません');
  });
  test('パスワードが空白の時のエラー表示テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowAddUser = jest.fn();
    const mockFuncAddUserOpen = jest.fn();
    const mockFuncAddUserClose = jest.fn();
    const mockFuncSetAddUserData = jest.fn();
    const mockFuncAddUser = jest.fn();
    const addUserData = new Map();
    const sizeClass = 'Med';
    const innerHeight = '1000';

    render(
      <AddUserModal
        showModal={mockFuncShowAddUser}
        modalOpen={mockFuncAddUserOpen}
        modalClose={mockFuncAddUserClose}
        modalData={addUserData}
        setModalData={mockFuncSetAddUserData}
        addUser={mockFuncAddUser}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
    );
    /* inputのvalueを変更 */
    await userEvent.type(screen.getByLabelText('ユーザーID'), 'add_user_id');
    await userEvent.type(screen.getByLabelText('ユーザー名'), 'add_user_name');
    await userEvent.type(screen.getByLabelText('パスワード'), '');

    /* 追加ボタンクリック */
    await userEvent.click(screen.getByRole('button'));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('パスワードが入力されていません');
  });
  test('ユーザー新規登録実行のテスト', async () => {
    const history = createMemoryHistory();

    /* ユーザー登録処理用のデータ(adminとfont_sizeはデフォルト値) */
    const sendData = '?login_id=add_user_id'
                 + '&user_name=add_user_name'
                 + '&admin=0'
                 + '&font_size=1'
                 + '&pass=add_user_pass'
                 ;
    /* /loginで返すdataはhistory.pushの呼び出しまでのテストなので空でOK */
    fetchMock
      .get('/insert_user'+sendData, {
        result: 1,
        pass: 'add_user_pass'
      })
      .get('/login?login_id=add_user_id&pass=add_user_pass', {
        result: 1,
        data: [{}]
      });

    render(
      <Router history={history}>
        <Login />
      </Router>
    );

    /* 新規登録ダイアログ呼び出し*/
    await userEvent.click(screen.getByRole('button',{ name: '新規登録'}));

    /* inputのvalueを変更 */
    await userEvent.type(screen.getByLabelText('ユーザーID'), 'add_user_id');
    await userEvent.type(screen.getByLabelText('ユーザー名'), 'add_user_name');
    await userEvent.type(screen.getByLabelText('パスワード'), 'add_user_pass');

    /* 追加ボタンクリック */
    await userEvent.click(screen.getByRole('button', {name: '追加'}));
 
    /* history.pushが/Mainで呼び出されるのをチェック */
    await waitFor(() => 
      expect(history.location.pathname).toBe('/Main')
    );
    
  });
});