import './common.css';
import './MenuModal.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';

import 'bulma/css/bulma.min.css';

const MenuModal = ({
  showModal,
  modalOpen,
  modalClose,
  modalDatas,
  setModalDatas,
  userName,
  goMyAccount,
  goUserEdit,
  sizeClass }) => {

  /* リストのマウスオーバー */
  const EnterList = menu_no => {
    const newModalDatas = modalDatas.map(modalData => {
      if(modalData.menu_no==menu_no) {
        modalData.color='#f5f5f5';
      }
      return modalData;
    });
    setModalDatas(newModalDatas);
  }
  const LeaveList = menu_no => {
    const newModalDatas = modalDatas.map(modalData => {
      if(modalData.menu_no==menu_no) {
        modalData.color='#ffffff';
      }
      return modalData;
    });
    setModalDatas(newModalDatas);
  }

  var user_name = '';
  var limit_cnt = 15;
  var modal_width = '240px';
  if(sizeClass=='Small') {
    limit_cnt = 16;
    modal_width = '220px';
  }else if(sizeClass=='Large') {
    limit_cnt = 14;
    modal_width = '280px';
  }
  if(userName) {
    var text_array = (userName).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        user_name += '...';
        break;
      }else {
        user_name += (userName).charAt(i);
      }
    }
  }else {
    user_name = '';
  }

  /* モーダルのスタイル */
  const modalStyle = {
    content: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      right: 'auto',
      bottom: 'auto',
      height: '100%',
      width: modal_width,
//      marginRight: '-50%',
//      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  const titleStyle = {
    borderBottom: '1px solid #999999',
  }

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpen}
      onRequestClose={modalClose}
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
      <div className={classNames("menu")}>
        <div style={titleStyle} className={classNames("pad5mar0", "title"+sizeClass)}>
          <span>
            {user_name}
          </span>
        </div>
        {modalDatas.map(modalData => (
          <MenuGroup
            modalData={modalData}
            EnterList={EnterList}
            LeaveList={LeaveList}
            goMyAccount={goMyAccount}
            goUserEdit={goUserEdit}
            sizeClass={sizeClass}
          />
        ))}
      </div>
    </ReactModal>
  );
}

function MenuGroup ({
  modalData,
  EnterList,
  LeaveList,
  goMyAccount,
  goUserEdit,
  sizeClass }) {

  const history = useHistory();

  const listStyle = {
    background: modalData.color,
  }

  const onClickList = menu_no => {

    if(menu_no=='1') {
      goMyAccount();
    }else if(menu_no=='2') {
      history.push({ pathname: '/' });
    /* 管理者のみ */
    }else if(menu_no=='3') {
      goUserEdit();
    }
  }

  return (
    <div
      style={listStyle}
      className={classNames("pad5mar0", "cursorPointer")}
      onClick={() => onClickList(modalData.menu_no)}
      onMouseEnter={() => EnterList(modalData.menu_no)}
      onMouseLeave={() => LeaveList(modalData.menu_no)}
    >
      <span className={"medText"+sizeClass}>
        {modalData.menu_name}
      </span>
    </div>
  );
}

export default MenuModal;