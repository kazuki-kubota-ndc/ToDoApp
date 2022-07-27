import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';


const PassModal = ({ showModal, modalOpen, modalClose, updateUserId, sizeClass }) => {

  /* パスワード */
  const [pass, setPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');

  /* 処理実行中ステータス */
  const [isRunning, setIsRunning] = React.useState(false);

  /* モーダル閉じる */
  const closeModal = () => {
    if(!isRunning) {
      modalClose();
    }
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setPass('');
    setNewPass('');
    setIsRunning(false);
    modalOpen();
  }

  /* 更新ボタン押した時の処理 */
  const onClickOk = () => {
    setIsRunning(true);
    if(pass=='') {
      alert('変更前パスワードが未入力です');
      setIsRunning(false);
    }else if(newPass=='') {
      alert('変更後パスワードが未入力です');
      setIsRunning(false);
    }else {
      updatePass();
    }
  }

  /* パスワード更新処理実行 */
  const updatePass = () => {
    fetch('/map_update_pass?user_id='+updateUserId+'&pass='+pass+'&new_pass='+newPass)
      .then((res) => res.json())
      .then(
        (data) => {
          /* 正常終了 */
          if(data.result===1) {

          /* パスワード不一致 */
          }else if(data.result===2) {
            alert('パスワードが一致しません');
            setIsRunning(false);
          }else {
            alert('更新処理に失敗しました');
            setIsRunning(false);
          }
          modalClose();
        }
      );
  }

  /* 現パスワード */
  const changePass = e => {
    setPass(e.target.value);
  }

  /* 新パスワード */
  const changeNewPass = e => {
    setNewPass(e.target.value);
  }

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

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={closeModal}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)}>
           パスワード変更
        </div>
        {/* メイン */}
        <div className={"mar20"}>
          <div className={"labelFont"+sizeClass}>
            <span>変更前パスワード</span>
          </div>
          <div>
            <input
              class="input"
              type="password"
              onChange={changePass}
            />
          </div>
          <div className={"labelFont"+sizeClass}>
            <span>変更後パスワード</span>
          </div>
          <div>
            <input
              class="input"
              type="password"
              onChange={changeNewPass}
            />
          </div>
        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass, "button", "is-success")} onClick={onClickOk} disabled={isRunning}>変更</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass, "button", "is-light")} onClick={closeModal} disabled={isRunning}>取消</button>
          </span>
        </div>
      </div>
    </ReactModal>
  );
}



export default PassModal;