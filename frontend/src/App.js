import './App.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons'
import { FaGithub, FaTwitterSquare } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';



/* ログイン画面 */
function Login() {

  /* リストデータ */
  const [items, setItems] = React.useState([]);
  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(false);
  /* ダイアログ(OK/CANCEL)の開閉ステータス */
  const [showModal, setShowModal] = React.useState(false);
  /* ダイアログのテキスト名 */
  const [modalDatas, setModalDatas] = React.useState(new Map());
  /* 追加・編集ボタンのdisabled：true/false */
  const [addEditBtn, setAddEditBtn] = React.useState(true);
  /* ログイン用データ */
  const [datas, setDatas] = React.useState(new Map());

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
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

  /* モーダルを開いた時の処理 */
  const modalOpen = () => {

  }

  /* モーダルを閉めた時の処理 */
  const modalClose = () => {
    setShowModal(false);
    setLoading(false);
  }

  /* モーダルOKボタンの処理 */
  const modalOk = () => {
    setLoading(true);

    /* ユーザー追加 */
    if(datas.action==='add') {
      if(datas.login_id.trim()==='') {
        alert('ユーザーIDを入力して下さい。');
        return;
      }else if(datas.pass.trim()==='') {
        alert('パスワードを入力して下さい。');
        return;
      }
      /* モーダル閉じる */
      setShowModal(false);
      addUser();
    /* ユーザー管理へ */
    }else if(datas.action==='edit') {
      if(datas.login_id.trim()==='') {
        alert('ユーザーIDを入力して下さい。');
        return;
      }else if(datas.pass.trim()==='') {
        alert('パスワードを入力して下さい。');
        return;
      }
      /* モーダル閉じる */
      setShowModal(false);
      goLogin('edit');
    }
  }

  /* ユーザー追加ダイアログ */
  const showAddModal = () => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'add';
    data.login_id = '';
    data.pass = '';
    data.admin = '0';
    data.font = '1';
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = '新規登録';
    modalData.text = 'ユーザー情報を入力して下さい。';
    modalData.execName = '追加';
    modalData.phId = 'USER_ID';
    modalData.phPass = 'PASSWORD';
    modalData.model = 'add';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* ユーザー管理確認ダイアログ */
  const showEditModal = () => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'edit';
    data.login_id = '';
    data.pass = '';
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'ユーザー管理ログイン';
    modalData.text = '管理者権限の[ユーザーID]と[パスワード]を入力して下さい。';
    modalData.execName = '実行';
    modalData.phId = 'USER_ID';
    modalData.phPass = 'PASSWORD';
    modalData.model = 'login';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* input欄のデータをセット */
  const changeDatas = e => {
    const data = datas;
    data.login_id = e.target.value;
    setDatas(data);
  }

  /* input欄(password)のデータをセット */
  const changeDatasPass = e => {
    const data = datas;
    data.pass = e.target.value;
    setDatas(data);
  }

  /* input欄のデータをセット */
  const changeDatasFromModal = text => {
    const data = datas;
    data.login_id = text;
    setDatas(data);
  }

  /* input欄(password)のデータをセット */
  const changeDatasPassFromModal = text => {
    const data = datas;
    data.pass = text;
    setDatas(data);
  }

  /* select(font_size)のデータをセット */
  const changeDatasFontFromModal = text => {
    const data = datas;
    data.font = text;
    setDatas(data);
  }

  const onClickLogin = () => {
    if(!datas.login_id || datas.login_id==null || datas.login_id=='') {
      alert('ユーザーIDを入力して下さい。');
      return;
    }else if(!datas.pass || datas.pass==null || datas.pass=='') {
      alert('パスワードを入力して下さい。');
      return;
    }
    goLogin('main');
  }

  /* ログイン */
  const goLogin = target => {
    setLoading(true);

    fetch('/login?login_id='+datas.login_id+'&pass='+datas.pass)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            /* ログイン */
            if(target=='main') {
              goMain(data.data[0]);
            /* ユーザー管理 */
            }else if(target=='edit') {
              if(data.data[0].admin==1) {
                history.push({ pathname: '/UserEdit', state: { data: data.data[0].admin }});
              }else {
                alert('管理者権限がありません。');
                setLoading(false);
              }
            }
          /* ユーザー情報無し */
          }else if(data.result===2) {
            alert('ユーザーID、パスワードが正しくありません。');
            setLoading(false);
          }
        }
      );
  }

  /* ユーザー追加 */
  const addUser = () => {

    const sendData = '?login_id='+datas.login_id+'&pass='+datas.pass
                   + '&admin=0&font='+datas.font;

    fetch('/insert_user'+sendData)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            goMain(data.data[0]);
          /* 登録済みID */
          }else if(data.result===2) {
            alert('['+datas.login_id+']\n既に登録されているIDです。');
          }else {
            alert('insert failed');
          }
          /* ローディング非表示 */
          setLoading(false);
        }
      );

  }

  /* メインページへ */
  const goMain = user =>{
    history.push({ pathname: '/Main', state: { user: user }});
  }

  const style = {
    padding: 0,
    margin: 0,
  };

  const style2 = {
    padding: 5,
    margin: 0,
  }

  const inputDiv = {
    marginBottom: 5,
  }

    return (
      <div>
        <Loader isLoading={ loading } />
        <ReactModal
          isOpen={showModal}
          onAfterOpen={modalOpen}
          onRequestClose={modalClose}
          style={modalStyle}
          contentLabel="Settings"
        >
          <ModalInside
            modalData={modalDatas}
            onChangeInput={changeDatasFromModal}
            onChangeInputPass={changeDatasPassFromModal}
            onClickOk={modalOk}
            onClickClose={modalClose}
            onChangeSelectFont={changeDatasFontFromModal}
          />
        </ReactModal>
        <div class="panel">
          {/* ヘッダー */}
          <div class="panel-heading">ログイン</div>
          {/* リスト表示部分 */}
          <span class="column is-4">
            <span>ユーザーID</span>
            <div>
              <input
                class="input"
                type="text"
                placeholder='USER_ID'
                onChange={changeDatas}
              />
            </div>
            <span>PASSWORD</span>
            <div style={inputDiv}>
              <input
                class="input"
                type="password"
                placeholder='PASSWORD'
                onChange={changeDatasPass}
              />
            </div>
            <span align="center" style={style2}>
              <button onClick={onClickLogin}>ログイン</button>
            </span>
          </span>
          {!loading && <SocialBtn login={goMain} />}
          {loading && <SocialBtnDummy />}
          {/* フッター */}
          <div class="panel-block" style={style}>
            <span class="column is-8" style={style2}>
            </span>
            <span class="column is-2" align="center" style={style2}>
              <button onClick={showAddModal}>新規登録</button>
            </span>
            <span class="column is-2" align="center" style={style2}>
              <button onClick={showEditModal}>ユーザー管理</button>
            </span>
          </div>
        </div>
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

/* 確認ダイアログの中身 */
function ModalInside({ modalData, onChangeInput, onChangeInputPass, onClickOk, onClickClose, onChangeSelectFont }) {
  const model = modalData.model;

  const inputChange = e => {
    onChangeInput(e.target.value);
  }

  const inputChangePass = e => {
    onChangeInputPass(e.target.value);
  }

  const selectChangeFont = e => {
    onChangeSelectFont(e.target.value);
  }

  const modalTextStyle = {
    margin: 20,
  }

  const buttonStyle = {
    fontSize: '20px',
  }

  const footerStyle = {
    padding: 0,
    marginBottom: 10,
  }

  const divInputfooterStyle = {
    marginBottom: 10,
  }

  const inputLabelStyle = {
    fontSize: '12px',
  }

  if(model==='simple') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <span>{modalData.text}</span>
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='add') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <div>
            <span>{modalData.text}</span>
          </div>
          <span style={inputLabelStyle}>ユーザーID(必須)</span>
          <div>
            <input
              class="input"
              type="text"
              placeholder={modalData.phId}
              onChange={inputChange}
            />
          </div>
          <span style={inputLabelStyle}>PASSWORD(必須)</span>
          <div style={divInputfooterStyle}>
            <input
              class="input"
              type="password"
              placeholder={modalData.phPass}
              onChange={inputChangePass}
            />
          </div>
          <div>
            <span>サイズ</span>
            <select onChange={selectChangeFont}>
              <option value="0">小</option>
              <option value="1" selected>中</option>
              <option value="2">大</option>
            </select>
          </div>
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='login') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <div>
            <span>{modalData.text}</span>
          </div>
          <span style={inputLabelStyle}>ユーザーID</span>
          <div>
            <input
              class="input"
              type="text"
              placeholder={modalData.phId}
              onChange={inputChange}
            />
          </div>
          <span style={inputLabelStyle}>PASSWORD</span>
          <div>
            <input
              class="input"
              type="password"
              placeholder={modalData.phPass}
              onChange={inputChangePass}
            />
          </div>
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }
}


function SocialBtnDummy() {
  return (
    <div>
      <div class="container is-fluid">
        <IconContext.Provider value={{ color: '#00acee', size: '20px' }}>
          <FaTwitterSquare />
        </IconContext.Provider>
        <span>
          Sign in with Twitter
        </span>
      </div>
      <div class="container is-fluid">
        <IconContext.Provider value={{ size: '20px' }}>
          <FcGoogle />
        </IconContext.Provider>
        <span>
          Sign in with Google
        </span>
      </div>
      <div class="container is-fluid">
        <IconContext.Provider value={{ color: '#000', size: '20px' }}>
          <FaGithub />
        </IconContext.Provider>
        <span>
          Sign in with Github
        </span>
      </div>
      <div class="container is-fluid"></div>
    </div>
  );
}

/* 初期処理 */
function App() {
  const location = useLocation();

  return (
    <div class="container is-fluid">
      <Login />
    </div>
  );
}

class SocialBtn extends Component {

  /* oauth.jsをCDNからダウンロードする */
  componentDidMount () {
    const oauthScript = document.createElement("script");
    oauthScript.src = "https://cdn.rawgit.com/oauth-io/oauth-js/c5af4519/dist/oauth.js";

    document.body.appendChild(oauthScript);

  }

  handleClick(e) {
    if(document.getElementById('loading').style.display=='flex') {
      e.preventDefault();
      return;
    }else {
      document.getElementById('loading').style.display='flex';
    }

    /* 新規登録 */
    const social_create_user = (target, id, name) => {
      fetch('/social_create_user?target='+target+'&id='+id+'&name='+name)
        .then((res) => res.json())
        .then(
          (data) => {
            /* ログイン */
            if(data.result===1) {
              this.props.login(data.data[0]);
            }
          }
        );
    }

    var parentId = e.target.parentElement.id;
    /* ページのリロードを防止 */
    e.preventDefault();

    /* API keyを使ってOAuth.ioを初期化する(OAuth.ioのAPIkey) */
    window.OAuth.initialize('WUB_up_G3bfyyzZNDmtOMzCjSKo');

    /* ポップアップウインドウを表示し、Githubの承認する */
    window.OAuth.popup(parentId).then((provider) => {

      /* データ取得 */
      /* twitter: data.raw.id, data.alias */
      /* google: data.raw.email, data.raw.name */
      /* github: data["id"], data["alias"] */
      provider.me().then((data) => {
        console.log("data: ", data);
        var target_id = '';
        var target_name = '';
        if(parentId=='twitter') {
          target_id = data.raw.id;
          target_name = data.alias;
        }else if(parentId=='google') {
          target_id = data.raw.email;
          target_name = data.raw.name;
        }else if(parentId=='github') {
          target_id = data["id"];
          target_name = data["alias"];
        }
        if(parentId!='') {
          fetch('/social_login?target='+parentId+'&id='+target_id)
            .then((res) => res.json())
            .then(
              (data) => {
                /* ログイン */
                if(data.result===1) {
                  this.props.login(data.data[0]);
                /* 件数0(新規登録) */
                }else if(data.result===2) {
                  if(window.confirm('ユーザー情報が登録されていません。\n新規ユーザーで登録します、よろしいですか？')) {
                    social_create_user(parentId, target_id, target_name);
                  }else {
                    document.getElementById('loading').style.display='none';
                  }
                }
              }
            );
        }
      });
    });
  }

  render() {

    const style = {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "none",
      justifyContent: "center",
      alignItems: "center"
    };

    return (
    <div>
      <div id="loading" style={style}>
        <i class="fas fa-spinner fa-spin fa-5x"></i>
      </div>
      <div class="container is-fluid">
        <a href="" id="twitter" onClick={this.handleClick.bind(this)}>
          <IconContext.Provider value={{ color: '#00acee', size: '20px' }}>
            <FaTwitterSquare />
          </IconContext.Provider>
          <span>
            Sign in with Twitter
          </span>
        </a>
      </div>
      <div class="container is-fluid">
        <a href="" id="google" onClick={this.handleClick.bind(this)}>
          <IconContext.Provider value={{ size: '20px' }}>
            <FcGoogle />
          </IconContext.Provider>
          <span>
            Sign in with Google
          </span>
        </a>
      </div>
      <div class="container is-fluid">
        <a href="" id="github" onClick={this.handleClick.bind(this)}>
          <IconContext.Provider value={{ color: '#000', size: '20px' }}>
            <FaGithub />
          </IconContext.Provider>
          <span>
            Sign in with Github
          </span>
        </a>
      </div>
    </div>
    );
  }
}


export default App;
