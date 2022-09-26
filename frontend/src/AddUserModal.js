import './common.css';
import './AddTaskModal.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';

const AddUserModal = ({showModal, modalOpen, modalClose, modalData, setModalData, addUser, sizeClass, innerHeight }) => {

  /* AddUserダイアログのデータ */
  const [addUserData, setAddUserData] = React.useState(new Map());
  /* 入力欄 */
  const [inputLoginId, setInputLoginId] = React.useState('');
  const [inputUserName, setInputUserName] = React.useState('');
  const [inputPass, setInputPass] = React.useState('');
  const [inputFontSize, setInputFontSize] = React.useState('1');
  /* 表示用 */
  const [isDisp, setIsDisp] = React.useState(false);


  const history = useHistory();

  /* ユーザーID */
  const changeUserId = e => {
    const data = addUserData;
    data.login_id = e.target.value;
    setAddUserData(data);
    setInputLoginId(e.target.value);
  }

  /* ユーザー名 */
  const changeUserName = e => {
    const data = addUserData;
    data.user_name = e.target.value;
    setAddUserData(data);
    setInputUserName(e.target.value);
  }

  /* パスワード */
  const changePass = e => {
    const data = addUserData;
    data.pass = e.target.value;
    setAddUserData(data);
    setInputPass(e.target.value);
  }

  /* 権限 */
  const onChangeAdmin = e => {
//    const data = addUserData;
//    data.admin = e.target.value;
//    setAddUserData(data);
  }

  /* 文字サイズ */
  const onChangeSize = e => {
    const data = addUserData;
    data.font_size = e.target.value;
    setAddUserData(data);
    setInputFontSize(e.target.value);
  }

  /* 追加ボタン実行 */
  const onClickAddUser = () => {
    if(!addUserData.login_id) {
      alert("ユーザーIDが入力されていません");
    }else if(!addUserData.user_name) {
      alert("ユーザー名が入力されていません");
    }else if(!addUserData.pass) {
      alert("パスワードが入力されていません");
    }else {

      /* 新規作成時、権限は「ユーザー」固定 */
      if(modalData.action=='insert' || modalData.action=='login') {
        addUserData.admin = 0;
      }
      /* 変更時、権限の変更は無し */
      if(modalData.action=='update') {
        addUserData.admin = modalData.admin;
      }
      if(!addUserData.font_size) {
        addUserData.font_size = '1';
      }

      setTimeout(() => {reNewData();}, 1000);
      addUser(addUserData);

    }
  }

  /* フォームデータ等を初期化 */
  const reNewData = () => {
    const newModalData = new Map();
    setModalData(newModalData);
    const newAddUserData = new Map();
    setAddUserData(newAddUserData);
    setInputLoginId('');
    setInputUserName('');
    setInputPass('');
    setInputFontSize('1');
  }

  /* モーダルを開く時にデータを初期化 */
  const modalOpenBefore = () => {

    modalOpen();
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    setIsDisp(false);
    setTimeout(() => {reNewData();}, 200);
    modalClose();
  }

  useEffect(() =>{

    if(modalData.user_id) {
      setIsDisp(false);

      /* パスワード検索 */
      fetch('/select_pass?user_id='+modalData.user_id)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newAddUserData = new Map();
              newAddUserData.user_id = modalData.user_id;
              newAddUserData.login_id = modalData.login_id;
              newAddUserData.user_name = modalData.user_name;
              newAddUserData.pass = data.pass;
              newAddUserData.font_size = modalData.font_size;
              setAddUserData(newAddUserData);
              setInputLoginId(modalData.login_id);
              setInputUserName(modalData.user_name);
              setInputPass(data.pass);
              setInputFontSize(modalData.font_size);
            }else {
              alert('検索処理に失敗しました');
              modalCloseBefore();
            }
            setIsDisp(true);
          }
        );

    }else {
      const newAddUserData = new Map();
      setAddUserData(newAddUserData);
      setInputLoginId('');
      setInputUserName('');
      setInputPass('');
      setInputFontSize('1');
      setIsDisp(true);
    }
  },[modalData]);

  var modal_top = (Number(innerHeight)-380)+'px';
  var modal_height = '380px';
  var select_size = 'is-normal';
  if(sizeClass=='Small') {
    modal_top = (Number(innerHeight)-340)+'px';
    modal_height = '340px';
    select_size = 'is-small';
  }else if(sizeClass=='Large') {
    modal_top = (Number(innerHeight)-430)+'px';
    modal_height = '430px';
    select_size = 'is-medium';
  }

  /* モーダルのスタイル */
  const modalStyle = {
    content: {
      position: 'absolute',
      top: modal_top,
      left: '0px',
      right: 'auto',
      bottom: 'auto',
      height: modal_height,
      width: '100%',

//      marginRight: '-50%',
//      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalCloseBefore}
      style={modalStyle}
      contentLabel="Settings"
      
      overlayClassName={{
        base: "overlay-base",
        afterOpen: "overlay-after",
        beforeClose: "overlay-before"
      }}
      className={{
        base: "content-base",
        afterOpen: "content-after",
        beforeClose: "content-before"
      }}
      closeTimeoutMS={500}
    >
      {isDisp &&
        <div className={classNames("addModal")}>
          <div>
            <span className={"labelFont"+sizeClass}>ユーザーID</span>
          </div>
          <div>
            <input
              class="input"
              className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
              type="text"
              placeholder='NEW USERID'
              onChange={changeUserId}
              value={inputLoginId}
            />
          </div>
          <div>
            <span className={"labelFont"+sizeClass}>ユーザー名</span>
          </div>
          <div>
            <input
              class="input"
              className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
              type="text"
              placeholder='NEW NAME'
              onChange={changeUserName}
              value={inputUserName}
            />
          </div>
          <div>
            <span className={"labelFont"+sizeClass}>パスワード</span>
          </div>
          <div>
            <input
              class="input"
              className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
              type="password"
              onChange={changePass}
              value={inputPass}
            />
          </div>
          <div>
            <span className={"labelFont"+sizeClass}>権限</span>
          </div>
          <div>
            <span className={classNames("pad0marR5", "select", "is-round", select_size)}>
              <select onChange={onChangeAdmin}>
                {(modalData.action=='insert' || modalData.action=='login') &&
                  <option value="0">ユーザー</option>
                }
                {(modalData.action=='update' && modalData.admin==1) &&
                  <option value="1">管理者</option>
                }
                {(modalData.action=='update' && modalData.admin==0) &&
                  <option value="0">ユーザー</option>
                }
              </select>
            </span>
          </div>
          <div>
            <span className={"labelFont"+sizeClass}>文字サイズ</span>
          </div>
          <div>
            <span className={classNames("pad0marR5", "select", "is-round", select_size)}>
              <select defaultValue={inputFontSize} onChange={onChangeSize}>
                <option value="2">大</option>
                <option value="1">中</option>
                <option value="0">小</option>
              </select>
            </span>
          </div>

          <div className={classNames("width90P")} align="right">
            <button class="button is-primary" onClick={onClickAddUser}>{modalData.execName}</button>
          </div>
        </div>
      }
    </ReactModal>
  );
}

export default AddUserModal;