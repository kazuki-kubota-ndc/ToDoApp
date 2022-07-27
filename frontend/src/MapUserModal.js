import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';


const UserModal = ({ showModal, modalOpen, modalClose, user, setUser, setUpdateUserId, setShowPass, loadingUser, setLoadingUser, sizeClass, setSizeClass }) => {

  /* ログインID(表記はユーザーID) */
  const [userId, setUserId] = React.useState(user.login_id);
  /* ユーザー名 */
  const [userName, setUserName] = React.useState(user.user_name);

  /* モーダル閉じる */
  const closeModal = () => {
    modalClose();
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setLoadingUser(false);
    setUserId(user.login_id);
    setUserName(user.user_name);
    modalOpen();
  }

  /* パスワード変更 */
  const onClickChangePass = () => {
    setUpdateUserId(user.user_id);
    setShowPass(true);
  }

  /* ログインID変更 */
  const updateUserId = value => {

    if(value=='') {
      alert('ユーザーIDが未入力です');
      setUserId(user.login_id);
    }else {
      setLoadingUser(true);

      fetch('/map_update_login_id?user_id='+user.user_id+'&new_login_id='+value)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newUser = user;
              newUser.login_id = value;
              setUser(newUser);
            }else if(data.result===2) {
              alert('[ '+value+' ] は使用できないユーザーIDです');
              setUserId(user.user_id);
            }else {
              alert('参照処理に失敗しました');
            }
            setLoadingUser(false);
          }
        );
    }
  }

  /* ユーザー名変更 */
  const updateUserName = value => {
    if(value=='') {
      alert('ユーザー名が未入力です');
      setUserName(user.user_name);
    }else {
      setLoadingUser(true);

      fetch('/map_update_user_name?user_id='+user.user_id+'&user_name='+value)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newUser = user;
              newUser.user_name = value;
              setUser(newUser);
            }else {
              alert('更新処理に失敗しました');
            }
            setLoadingUser(false);
          }
        );
    }
  }

  /* 権限変更 */
  const onChangeAdmin = e => {
    setLoadingUser(true);

    fetch('/map_update_admin?user_id='+user.user_id+'&admin='+e.target.value)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            const newUser = user;
            newUser.admin = Number(e.target.value);
            setUser(newUser);
          }else {
            alert('更新処理に失敗しました');
          }
          setLoadingUser(false);
        }
      );
  }

  /* 文字サイズ変更 */
  const onChangeSize = e => {
    setLoadingUser(true);

    fetch('/map_update_size?user_id='+user.user_id+'&size='+e.target.value)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            const newUser = user;
            newUser.o_font = Number(e.target.value);
            setUser(newUser);
            if(e.target.value=='0') {
              setSizeClass('Small');
            }else if(e.target.value=='1') {
              setSizeClass('Med');
            }else if(e.target.value=='2') {
              setSizeClass('Large');
            }
          }else {
            alert('更新処理に失敗しました');
          }
          setLoadingUser(false);
        }
      );
  }

  useEffect(() => {
    setUserId(user.login_id);
    setUserName(user.user_name);
  }, [user]);

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
//      height: '90%',
//      width: '90%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  var select_size = 'is-normal';
  if(sizeClass=='Small') {
    select_size = 'is-small';
  }else if(sizeClass=='Large') {
    select_size = 'is-medium';
  }

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div>
        <div className={"panel"}>
          {/* ヘッダー */}
          <div className={classNames("panel-heading")}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width2P")}>&nbsp;</td>
                <td className={"width78P"}>
                  <span className={classNames("titleMod"+sizeClass)}>
                    ユーザー情報
                  </span>
                </td>
                <td className={classNames("flexboxRight")} onClick={closeModal}>
                  <IconContext.Provider value={{ size: '26px', style: { cursor: 'pointer'} }}>
                    <AiOutlineCloseCircle />
                  </IconContext.Provider>
                </td>
              </tr>
            </table>
          </div>
          {/* メイン */}
          <div className={"mar20"}>
            <div>
              <span className={"labelFont"+sizeClass}>ユーザーID</span>
            </div>
            <div>
              <InputText
                textValue={userId}
                textChange={setUserId}
                motoText={user.login_id}
                updateData={updateUserId}
                sizeClass={sizeClass}
              />
            </div>
            <div>
              <span className={"labelFont"+sizeClass}>ユーザー名</span>
            </div>
            <div>
              <InputText
                textValue={userName}
                textChange={setUserName}
                motoText={user.user_name}
                updateData={updateUserName}
                sizeClass={sizeClass}
              />
            </div>
            <div>
              <span className={"labelFont"+sizeClass}>パスワード</span>
            </div>
            <div>
              <span className={classNames("title"+sizeClass, "pad0marR40")}>*****</span>
              <span>
                <button class="button is-small is-info is-light" onClick={onClickChangePass}>パスワード変更</button>
              </span>
            </div>
            <div>
              <span className={"labelFont"+sizeClass}>権限</span>
            </div>
            <div>
              <span className={classNames("pad0marR5", "select", "is-round", select_size)}>
                <select defaultValue={user.admin} onChange={onChangeAdmin}>
                  {user.admin=='1' ? <option value="1">管理者</option> : <option value="0">ユーザー</option>}
                </select>
              </span>
            </div>
            <div>
              <span className={"labelFont"+sizeClass}>文字サイズ</span>
            </div>
            <div>
              <span className={classNames("pad0marR5", "select", "is-round", select_size)}>
                <select defaultValue={user.o_font} onChange={onChangeSize}>
                  <option value="2">大</option>
                  <option value="1">中</option>
                  <option value="0">小</option>
                </select>
              </span>
            </div>
            <div className={"height20"}></div>
          </div>
        </div>
      </div>
      <LoaderUser isLoading={ loadingUser } />
    </ReactModal>
  );
}

/* ローディング表示 */
function LoaderUser({ isLoading }) {

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

function InputText({ textValue, textChange, motoText, updateData, sizeClass }) {

  const onChangeInput = e =>{
    textChange(e.target.value);
  }

  /* フォーカス外れた時に実行 */
  const onBlurText = e =>{
    /* 変更有り時データを更新 */
    if(motoText!=e.target.value) {
      updateData(e.target.value);
    }
  }

  var width_px = '400px';
  if(sizeClass=='Small') {
    width_px = '350px';
  }else if(sizeClass=='Large') {
    width_px = '450px';
  }

  if(textValue) {
    var text_array = (textValue).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > 50) {
        width_px = '1000px';
      }else if(count > 40) {
        width_px = '800px';
      }else if(count > 30) {
        width_px = '500px';
      }
    }
  }

  const inputStyle = {
    width: width_px,
  }



  return (
    <span>
      <input
        class="input"
        className={classNames("noBorderInputUser", "title"+sizeClass, "cursorPointer")}
        type="text"
        value={textValue}
        onChange={onChangeInput}
        onBlur={onBlurText}
        style={inputStyle}
      />
    </span>
  );
}

export default UserModal;