import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';

import LoginModal from './MapLoginModal';
import AddUserModal from './MapAddUserModal';


/* メイン画面 */
function Login( defaultPosition, defaultZoomLevel ) {

  /* ユーザーデータ */
  const [user, setUser] = React.useState({});

  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(false);
  /* Loginダイアログの開閉ステータス */
  const [showLogin, setShowLogin] = React.useState(true);
  /* AddUserダイアログの開閉ステータス */
  const [showAddUser, setShowAddUser] = React.useState(false);
  /* AddUserダイアログのデータ */
  const [addUserData, setAddUserData] = React.useState(new Map());

  /* ウインドウサイズ（高さ） */
  const [innerHeight, setInnerHeight] = React.useState('');

  const history = useHistory();

  const [position, setPosition] = useState({ latitude: null, longitude: null });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
  }

/* --------------------LoginModal-------------------- */

  /* Loginモーダルを開いた時の処理 */
  const loginOpen = () => {

  }

  /* Loginモーダルを閉めた時の処理(ログインは枠外クリックで閉じない) */
  const loginClose = () => {

  }

  /* ユーザー新規登録 */
  const addUserBtn = () => {
    setShowLogin(false);
    const newAddUserData = new Map();
    newAddUserData.action = 'login';
    newAddUserData.execName = '追加';
    setAddUserData(newAddUserData);
    setInnerHeight(window.innerHeight);
    setShowAddUser(true);
  }

/* --------------------AddUserModal-------------------- */

  /* AddUserモーダルを開いた時の処理 */
  const addUserOpen = () => {

  }

  /* AddUserモーダルを閉めた時の処理 */
  const addUserClose = () => {
    setShowAddUser(false);
    setShowLogin(true);
  }

  /* AddUserモーダルを開く */
  const openAddUser = () =>{
    setShowAddUser(true);
  }

  const addUser = addUser_data => {
    setShowAddUser(false);

    setLoading(true);

    var sendData = '?login_id='+addUser_data.login_id
                 + '&user_name='+addUser_data.user_name
                 + '&admin='+addUser_data.admin
                 + '&font_size='+addUser_data.font_size
                 + '&pass='+addUser_data.pass
                 ;

    if(addUserData.action=='login') {

      fetch('/map_insert_user'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              login(addUser_data.login_id,data.pass);
            }else if(data.result===2) {
              alert('[ '+addUser_data.login_id+' ] は既に使用されているユーザーIDです');
              setLoading(false);
              setShowLogin(true);
            }else {
              alert('登録処理に失敗しました');
              setLoading(false);
              setShowLogin(true);
            }
          }
        );
    }
  }

  /* ログイン処理実行 */
  const login = (login_id, pass) => {

    fetch('/map_login?login_id='+login_id+'&pass='+pass)
      .then((res) => res.json())
      .then(
        (data) => {
          /* ログイン */
          if(data.result===1) {
            history.push({ pathname: '/MapMain', state: { user: data.data[0], defaultPosition: defaultPosition }});
            setLoading(false);
          /* ユーザー情報無し */
          }else if(data.result===2) {
            alert('ユーザーID、パスワードが正しくありません。');
            setLoading(false);
            setShowLogin(true);
          }
        }
      );
  }

  function reportWindowSize() {
    setInnerHeight(window.innerHeight);
  }

  window.onresize = reportWindowSize;

/* --------------------useEffect-------------------- */

/* --------------------Style-------------------- */


  return (
    <div>
      {/* Loginモーダル */}
      <LoginModal
        showModal={showLogin}
        modalOpen={loginOpen}
        modalClose={loginClose}
        addUser={addUserBtn}
        defaultPosition={defaultPosition}
        defaultZoomLevel={defaultZoomLevel}
      />
      {/* AddUserモーダル */}
      <AddUserModal
        showModal={showAddUser}
        modalOpen={addUserOpen}
        modalClose={addUserClose}
        modalData={addUserData}
        setModalData={setAddUserData}
        addUser={addUser}
        sizeClass={'Med'}
        innerHeight={innerHeight}
      />
      <div className={classNames("panel")}>
        {/* ヘッダー */}
        <div class="panel-heading"></div>
        {/* リスト表示部分 */}

        {/* フッター */}
        <div className={classNames("panel-block", "pad0mar0")}>

        </div>
      </div>
      <Loader isLoading={ loading } />
    </div>
  );
}

/* ローディング表示 */
function Loader({ isLoading }) {

  const style = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  if(isLoading){
    return (
      /* ローディングアイコン */
      <div style={style}>
        <i class="fas fa-spinner fa-spin fa-5x"></i>
      </div>
    );
  } else{
    return null;
  }
}

/* 初期処理 */
function MapApp() {
  const location = useLocation();
  const [position, setPosition] = useState({ latitude: 34.732938, longitude: 135.498543 });
  const [zoomLevel, setZoomLevel] = useState(18);

  useEffect(() =>{

    /* 位置情報 */
    if(location.state!=null) {
      if(location.state.defaultPosition!=null) {
        setPosition(location.state.defaultPosition);
        setZoomLevel(location.state.defaultZoomLevel);
      }
    }
  },[]);

  return (
    <div class="container is-fluid">
      <Login defaultPosition={ position } defaultZoomLevel={ zoomLevel } />
    </div>
  );
}

export default MapApp;
