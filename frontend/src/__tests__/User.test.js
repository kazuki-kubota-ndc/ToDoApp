import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation,Router } from 'react-router-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { Login } from '../App';
import UserModal from '../UserModal';
import fetchMock from 'fetch-mock';
import { createMemoryHistory } from 'history'

beforeAll(() => {
    window.alert = jest.fn();
  });
afterEach(() => {
  /* fetchMockをリセット */
  fetchMock.restore();
});

describe('アカウント情報画面、初期表示のテスト', () => {
  test('アカウント情報初期表示テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowUser = jest.fn();
    const mockFuncUserOpen = jest.fn();
    const mockFuncUserClose = jest.fn();
    const mockFuncSetUser = jest.fn();
    const mockFuncSetUpdateUserId = jest.fn();
    const mockFuncSetShowPass = jest.fn();
    const mockFuncSetLoadingUser = jest.fn();
    const mockFuncSetSizeClass = jest.fn();

    /* テスト用ユーザーデータ */
    const user = {
        user_id: 'test_user_id',
        login_id: 'test_login_id',
        user_name: 'test_user_name',
        admin: 0,
        font_size: 0,
        o_font: 0,
        pass: 'test_pass'
    }

    render(
      <UserModal
        showModal={mockFuncShowUser}
        modalOpen={mockFuncUserOpen}
        modalClose={mockFuncUserClose}
        user={user}
        setUser={mockFuncSetUser}
        setUpdateUserId={mockFuncSetUpdateUserId}
        setShowPass={mockFuncSetShowPass}
        loadingUser={false}
        setLoadingUser={mockFuncSetLoadingUser}
        sizeClass={'Med'}
        setSizeClass={mockFuncSetSizeClass}
      />
    );
    /* ユーザーID欄にlogin_idが入力されているか確認 */
    expect(screen.getByLabelText('ユーザーID').value).toBe('test_login_id');
    /* ユーザー名にuser_nameが入力されているか確認 */
    expect(screen.getByLabelText('ユーザー名').value).toBe('test_user_name');
    /* 権限がユーザーになっているか確認 */
    expect(screen.getByLabelText('権限').value).toBe('0');
    /* 文字サイズが小になっているか確認 */
    expect(screen.getByLabelText('文字サイズ').value).toBe('0');

  });
});
describe('アカウント情報画面、変更処理のテスト', () => {
    test('ユーザーIDを空にした時のエラーメッセージの確認テスト', async () => {
    /* ダミーで定義するだけ */
    const mockFuncShowUser = jest.fn();
    const mockFuncUserOpen = jest.fn();
    const mockFuncUserClose = jest.fn();
    const mockFuncSetUser = jest.fn();
    const mockFuncSetUpdateUserId = jest.fn();
    const mockFuncSetShowPass = jest.fn();
    const mockFuncSetLoadingUser = jest.fn();
    const mockFuncSetSizeClass = jest.fn();

    /* テスト用ユーザーデータ */
    const user = {
        user_id: 'test_user_id',
        login_id: 'test_login_id',
        user_name: 'test_user_name',
        admin: 0,
        font_size: 0,
        o_font: 0,
        pass: 'test_pass'
    }

    render(
      <UserModal
        showModal={mockFuncShowUser}
        modalOpen={mockFuncUserOpen}
        modalClose={mockFuncUserClose}
        user={user}
        setUser={mockFuncSetUser}
        setUpdateUserId={mockFuncSetUpdateUserId}
        setShowPass={mockFuncSetShowPass}
        loadingUser={false}
        setLoadingUser={mockFuncSetLoadingUser}
        sizeClass={'Med'}
        setSizeClass={mockFuncSetSizeClass}
      />
    );
    /* ユーザーIDを空に変更してフォーカスを外す */
    await fireEvent.focus(screen.getByLabelText('ユーザーID'));
    await userEvent.clear(screen.getByLabelText('ユーザーID'));
    await fireEvent.focusOut(screen.getByLabelText('ユーザーID'));

    /* アラートの確認 */
    expect(window.alert).toHaveBeenCalledWith('ユーザーIDが未入力です');

    });
    test('ユーザーIDをを変更した時の処理テスト', async () => {
        /* ダミーで定義するだけ */
        const mockFuncShowUser = jest.fn();
        const mockFuncUserOpen = jest.fn();
        const mockFuncUserClose = jest.fn();
        const mockFuncSetUser = jest.fn();
        const mockFuncSetUpdateUserId = jest.fn();
        const mockFuncSetShowPass = jest.fn();
        const mockFuncSetLoadingUser = jest.fn();
        const mockFuncSetSizeClass = jest.fn();
    
        /* テスト用ユーザーデータ */
        const user = {
            user_id: 'test_user_id',
            login_id: 'test_login_id',
            user_name: 'test_user_name',
            admin: 0,
            font_size: 0,
            o_font: 0,
            pass: 'test_pass'
        }

        fetchMock
        .get('/update_login_id?user_id=test_user_id&new_login_id=test_login_id_change', {
          result: 1
        });
  
        render(
          <UserModal
            showModal={mockFuncShowUser}
            modalOpen={mockFuncUserOpen}
            modalClose={mockFuncUserClose}
            user={user}
            setUser={mockFuncSetUser}
            setUpdateUserId={mockFuncSetUpdateUserId}
            setShowPass={mockFuncSetShowPass}
            loadingUser={false}
            setLoadingUser={mockFuncSetLoadingUser}
            sizeClass={'Med'}
            setSizeClass={mockFuncSetSizeClass}
          />
        );
        /* ユーザーIDを変更してフォーカスを外す */
        await fireEvent.focus(screen.getByLabelText('ユーザーID'));
        await userEvent.type(screen.getByLabelText('ユーザーID'), '_change');
        await fireEvent.focusOut(screen.getByLabelText('ユーザーID'));
    
        /* ユーザーID変更処理が呼ばれて、valueがtest_login_id_changeに変更されているのを確認 */
        expect(await screen.queryByLabelText('ユーザーID').value).toBe('test_login_id_change');
    });
    test('ユーザー名を空にした時のエラーメッセージの確認テスト', async () => {
        /* ダミーで定義するだけ */
        const mockFuncShowUser = jest.fn();
        const mockFuncUserOpen = jest.fn();
        const mockFuncUserClose = jest.fn();
        const mockFuncSetUser = jest.fn();
        const mockFuncSetUpdateUserId = jest.fn();
        const mockFuncSetShowPass = jest.fn();
        const mockFuncSetLoadingUser = jest.fn();
        const mockFuncSetSizeClass = jest.fn();
    
        /* テスト用ユーザーデータ */
        const user = {
            user_id: 'test_user_id',
            login_id: 'test_login_id',
            user_name: 'test_user_name',
            admin: 0,
            font_size: 0,
            o_font: 0,
            pass: 'test_pass'
        }
    
        render(
          <UserModal
            showModal={mockFuncShowUser}
            modalOpen={mockFuncUserOpen}
            modalClose={mockFuncUserClose}
            user={user}
            setUser={mockFuncSetUser}
            setUpdateUserId={mockFuncSetUpdateUserId}
            setShowPass={mockFuncSetShowPass}
            loadingUser={false}
            setLoadingUser={mockFuncSetLoadingUser}
            sizeClass={'Med'}
            setSizeClass={mockFuncSetSizeClass}
          />
        );
        /* ユーザー名を空に変更してフォーカスを外す */
        await fireEvent.focus(screen.getByLabelText('ユーザー名'));
        await userEvent.clear(screen.getByLabelText('ユーザー名'));
        await fireEvent.focusOut(screen.getByLabelText('ユーザー名'));
    
        /* アラートの確認 */
        expect(window.alert).toHaveBeenCalledWith('ユーザー名が未入力です');
    
    });
    test('ユーザー名をを変更した時の処理テスト', async () => {
        /* ダミーで定義するだけ */
        const mockFuncShowUser = jest.fn();
        const mockFuncUserOpen = jest.fn();
        const mockFuncUserClose = jest.fn();
        const mockFuncSetUser = jest.fn();
        const mockFuncSetUpdateUserId = jest.fn();
        const mockFuncSetShowPass = jest.fn();
        const mockFuncSetLoadingUser = jest.fn();
        const mockFuncSetSizeClass = jest.fn();
        
        /* テスト用ユーザーデータ */
        const user = {
            user_id: 'test_user_id',
             login_id: 'test_login_id',
             user_name: 'test_user_name',
             admin: 0,
            font_size: 0,
            o_font: 0,
            pass: 'test_pass'
        }
    
        fetchMock
        .get('/update_user_name?user_id=test_user_id&user_name=test_user_name_change', {
          result: 1
        });
      
        render(
          <UserModal
            showModal={mockFuncShowUser}
            modalOpen={mockFuncUserOpen}
            modalClose={mockFuncUserClose}
            user={user}
            setUser={mockFuncSetUser}
            setUpdateUserId={mockFuncSetUpdateUserId}
            setShowPass={mockFuncSetShowPass}
            loadingUser={false}
            setLoadingUser={mockFuncSetLoadingUser}
            sizeClass={'Med'}
            setSizeClass={mockFuncSetSizeClass}
          />
        );
        /* ユーザー名を変更してフォーカスを外す */
        await fireEvent.focus(screen.getByLabelText('ユーザー名'));
        await userEvent.type(screen.getByLabelText('ユーザー名'), '_change');
        await fireEvent.focusOut(screen.getByLabelText('ユーザー名'));
        
        /* ユーザー名変更処理が呼ばれて、valueがtest_user_name_changeに変更されているのを確認 */
        expect(await screen.queryByLabelText('ユーザー名').value).toBe('test_user_name_change');
    });
    test('文字サイズ変処理のテスト', async () => {
        /* ダミーで定義するだけ */
        const mockFuncShowUser = jest.fn();
        const mockFuncUserOpen = jest.fn();
        const mockFuncUserClose = jest.fn();
        const mockFuncSetUser = jest.fn();
        const mockFuncSetUpdateUserId = jest.fn();
        const mockFuncSetShowPass = jest.fn();
        const mockFuncSetLoadingUser = jest.fn();
        const mockFuncSetSizeClass = jest.fn();
        
        /* テスト用ユーザーデータ */
        const user = {
            user_id: 'test_user_id',
            login_id: 'test_login_id',
            user_name: 'test_user_name',
            admin: 0,
            font_size: 0,
            o_font: 0,
            pass: 'test_pass'
        }
        fetchMock
        .get('/update_size?user_id=test_user_id&size=2', {
          result: 1
        });        
        render(
          <UserModal
            showModal={mockFuncShowUser}
            modalOpen={mockFuncUserOpen}
            modalClose={mockFuncUserClose}
            user={user}
            setUser={mockFuncSetUser}
            setUpdateUserId={mockFuncSetUpdateUserId}
            setShowPass={mockFuncSetShowPass}
            loadingUser={false}
            setLoadingUser={mockFuncSetLoadingUser}
            sizeClass={'Med'}
            setSizeClass={mockFuncSetSizeClass}
          />
        );
        /* 文字サイズを大に変更 */
        userEvent.selectOptions(screen.getByLabelText('文字サイズ'), '2');
        /* 画面表示の変更が無いのでwait処理でイベント実行を待つ */
        await new Promise((res) => setTimeout(res, 1000));
        /* setSizeClassが引数"Large"で呼ばれたのを確認する */
        expect(mockFuncSetSizeClass.mock.calls[0]).toEqual(["Large"]);
    });
});