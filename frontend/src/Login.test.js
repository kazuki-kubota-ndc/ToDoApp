import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import Main, { Login } from './Main';
import LoginModal from './LoginModal';
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
  test('ログイン後の権限による表示を確認(管理者）', async () => {
    
  });
});
