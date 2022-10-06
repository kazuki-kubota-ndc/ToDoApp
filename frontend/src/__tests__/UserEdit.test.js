import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main, { Login } from '../Main';
import UserEditModal from '../UserEditModal';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
  window.alert = jest.fn();
});
afterEach(() => {
  /* fetchMockをリセット */
  fetchMock.restore();
});

describe('ユーザー管理画面、初期表示のテスト', () => {
  test('ユーザー管理画面初期表示テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowUserEdit = jest.fn();
    const mockFuncUserEditOpen = jest.fn();
    const mockFuncUserEditClose = jest.fn();
    const mockFuncSetUserItems = jest.fn();
    const mockFuncSetUser = jest.fn();
    const mockFuncSetShowAddUser = jest.fn();
    const mockFuncAddUserData = jest.fn();
    const mockFuncSetAddUserData = jest.fn();
    const mockFuncSetCenterData = jest.fn();
    const mockFuncSetShowCenter = jest.fn();
    const mockFuncLoadingUserEdit = jest.fn();
    const mockFuncSetLoadingUserEdit = jest.fn();

    /* テスト用ユーザーデータ */
    const testUser = {
        login_id: 'test_id',
        user_name: 'test_name',
        admin: 1,
        font_size: 1 
    }
    const testUserItems = [
      {
        login_id: 'test_id',
        user_name: 'test_name',
        admin: 1,
        font_size: 1
      },
      {
        login_id: 'second_id',
        user_name: 'second_name',
        admin: 0,
        font_size: 0
      }
    ]

    render(
      <UserEditModal
        showModal={mockFuncShowUserEdit}
        modalOpen={mockFuncUserEditOpen}
        modalClose={mockFuncUserEditClose}
        userItems={testUserItems}
        setUserItems={mockFuncSetUserItems}
        user={testUser}
        setUser={mockFuncSetUser}
        setShowAddUser={mockFuncSetShowAddUser}
        addUserData={mockFuncAddUserData}
        setAddUserData={mockFuncSetAddUserData}
        setCenterData={mockFuncSetCenterData}
        setShowCenter={mockFuncSetShowCenter}
        loadingUserEdit={mockFuncLoadingUserEdit}
        setLoadingUserEdit={mockFuncSetLoadingUserEdit}
        sizeClass={'Med'}
      />
    );
    /* ユーザーデータがリスト表示されているか確認 */
    expect(screen.getByText('test_id')).toBeInTheDocument();
    expect(screen.getByText('test_name')).toBeInTheDocument();
    expect(screen.getByText('second_id')).toBeInTheDocument();
    expect(screen.getByText('second_name')).toBeInTheDocument();
  });
});
describe('ユーザー管理画面、ユーザー追加処理のテスト', () => {
  test('ユーザー追加実行時のテスト', async () => {
    const history = createMemoryHistory();

    /* テスト用ユーザーデータ */
    const testUserItems = [
      {
        user_id: 'test_user_id',
        login_id: 'test_id',
        user_name: 'test_name',
        admin: 1,
        font_size: 1
      },
      {
        user_id: 'second_user_id',
        login_id: 'second_id',
        user_name: 'second_name',
        admin: 0,
        font_size: 0
      }
    ]
    const sendData = '?login_id=NEW_USERID'
                 + '&user_name=NEW_NAME'
                 + '&admin=0'
                 + '&font_size=1'
                 + '&pass=NEW_PASS'
                 ;

    fetchMock
      .get('/select_task?user_id=test_user_id&list_no=0', {
        result: 2
      })
      .get('/select_user', {
        result: 1,
        data: testUserItems
      })
      .get('/insert_user'+sendData, {
        result: 1,
        user_id: 'CREATED_USERID',
        login_id: 'NEW_USERID',
        user_name: 'NEW_NAME',
        admin: 0,
        font_size: 1
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
    userEvent.click(screen.getByRole('menu_btn'));
    expect(await screen.findByText('ユーザー管理')).toBeInTheDocument();
    /* ユーザー管理をクリック */
    userEvent.click(screen.getByText('ユーザー管理'));
    expect(await screen.findByText('ユーザー追加')).toBeInTheDocument();

    /* ユーザー追加をクリック */
    userEvent.click(screen.getByText('ユーザー追加'));
    expect(await screen.findByPlaceholderText('NEW USERID')).toBeInTheDocument();

    /* ユーザーID、ユーザー名、パスワードを入力して追加ボタンをクリック */
    await userEvent.type(screen.getByPlaceholderText('NEW USERID'), 'NEW_USERID');
    await userEvent.type(screen.getByPlaceholderText('NEW NAME'), 'NEW_NAME');
    await userEvent.type(screen.getByLabelText('パスワード'), 'NEW_PASS');
    userEvent.click(screen.getByRole('button', { name: '追加'}));

    /* 追加したユーザーIDとユーザー名が表示されているか確認 */
    expect(await screen.findByText('USERID')).toBeInTheDocument();
    expect(await screen.findByText('NAME')).toBeInTheDocument();
  });
});
describe('ユーザー管理画面、ユーザー編集処理のテスト', () => {
    test('ユーザー編集実行時のテスト', async () => {
      const history = createMemoryHistory();

      /* テスト用ユーザーデータ */
      const testUserItems = [
        {
          user_id: 'test_user_id',
          login_id: 'test_id',
          user_name: 'test_name',
          admin: 1,
          font_size: 1
        },
        {
          user_id: 'second_user_id',
          login_id: 'second_id',
          user_name: 'second_name',
          admin: 0,
          font_size: 0
        }
      ]

      const updateSendData = '?login_id=edit_id'
                   + '&user_name=edit_name'
                   + '&admin=0'
                   + '&font_size=1'
                   + '&pass=edit_pass'
                   + '&user_id=second_user_id';

      fetchMock
        .get('/select_task?user_id=test_user_id&list_no=0', {
          result: 2
        })
        .get('/select_user', {
          result: 1,
          data: testUserItems
        })
        .get('/select_pass?user_id=second_user_id', {
          result: 1,
          pass: 'second_pass'
        })
        .get('/update_user'+updateSendData, {
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
      userEvent.click(screen.getByRole('menu_btn'));
      expect(await screen.findByText('ユーザー管理')).toBeInTheDocument();
      /* ユーザー管理をクリック */
      userEvent.click(screen.getByText('ユーザー管理'));
      expect(await screen.findByText('ユーザー追加')).toBeInTheDocument();
  
      /* second_idの編集ボタンをクリック */
      expect(await screen.findByText('second_id')).toBeInTheDocument();
      userEvent.click(screen.getByRole('second_id_edit_btn'));

      /* ユーザーID、ユーザー名を編集して変更ボタンをクリック */
      await screen.findByLabelText('ユーザーID');
      userEvent.clear(screen.getByLabelText('ユーザーID'));
      userEvent.type(screen.getByLabelText('ユーザーID'), 'edit_id');
      userEvent.clear(screen.getByLabelText('ユーザー名'));
      userEvent.type(screen.getByLabelText('ユーザー名'), 'edit_name');
      userEvent.clear(screen.getByLabelText('パスワード'));
      userEvent.type(screen.getByLabelText('パスワード'), 'edit_pass');
      await userEvent.click(screen.getByRole('button',{ name: '変更'}));

      /* 変更後のユーザーID、ユーザー名が表示されているのを確認 */
      expect(await screen.findByText('edit_id')).toBeInTheDocument();
      expect(await screen.findByText('edit_name')).toBeInTheDocument();
    });
  });