import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';

import 'bulma/css/bulma.min.css';



const CenterModal = ({ showModal, modalOpen, modalClose, addUser }) => {

  /* Loginダイアログのデータ */
  const [loginData, setLoginData] = React.useState(new Map());
  /* ログインボタン、新規登録のdisabled */
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  /* 新規登録 */
  const onClickAddUser = () =>{
    addUser();
  }

  /* ログイン */
  const onClickLogin = () =>{
    if(!loginData.user_id || loginData.user_id==null || loginData.user_id=='') {
      alert('ユーザーIDを入力して下さい。');
      return;
    }else if(!loginData.pass || loginData.pass==null || loginData.pass=='') {
      alert('パスワードを入力して下さい。');
      return;
    }
    goLogin('main');
  }

  /* ログイン実行 */
  const goLogin = () => {
    setLoading(true);

    fetch('/login?login_id='+loginData.user_id+'&pass='+loginData.pass)
      .then((res) => res.json())
      .then(
        (data) => {
          /* ログイン */
          if(data.result===1) {
            history.push({ pathname: '/Main', state: { user: data.data[0] }});
          /* ユーザー情報無し */
          }else if(data.result===2) {
            alert('ユーザーID、パスワードが正しくありません。');
            setLoading(false);
          }
        }
      );
  }

  /* ユーザー名 */
  const changeUserId = e => {
    const data = loginData;
    data.user_id = e.target.value;
    setLoginData(data);
  }

  /* パスワード */
  const changePass = e => {
    const data = loginData;
    data.pass = e.target.value;
    setLoginData(data);
  }

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  const loginBaseStyle = {
    height: '320px',
    width: '400px',
  
  }

  const linkStyle = {
    fontSize: '12px',
  }

  const inputDiv = {
    marginBottom: 5,
  }

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpen}
      onRequestClose={modalClose}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"} style={loginBaseStyle}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
           ログイン [ToDoList]
        </div>
        {/* メイン */}
        <div className={classNames("column", "is-10", "pad0marT10L30")}>
          <div>
            <span>ユーザーID</span>
            <div>
              <input
                class="input"
                type="text"
                placeholder='USER_ID'
                onChange={changeUserId}
              />
            </div>
          </div>
          <div className={classNames("pad0marT10")}>
            <span>PASSWORD</span>
            <div style={inputDiv}>
              <input
                class="input"
                type="password"
                placeholder='PASSWORD'
                onChange={changePass}
              />
            </div>
          </div>
        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button class="button is-primary" onClick={onClickLogin} disabled={loading}>ログイン</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button class="button is-info" onClick={onClickAddUser} disabled={loading}>新規登録</button>
          </span>
        </div>
      </div>
    </ReactModal>
  );
}

export default CenterModal;