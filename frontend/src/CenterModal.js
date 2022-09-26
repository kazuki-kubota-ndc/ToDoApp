import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';

const CenterModal = ({showModal, modalOpen, modalClose, modalData, onClickOk, onClickClose, sizeClass }) => {

  /* モーダルのスタイル */
  const modalStyle = {
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

  const panelHedStyle = {
    background: '#'+modalData.color,
  }

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpen}
      onRequestClose={modalClose}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div>
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)} style={panelHedStyle}>
           {modalData.title}
        </div>
        {/* メイン */}
        <div className={"mar20"}>
          <span className={"medText"+sizeClass}>{modalData.text}</span>
        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
      </div>
    </ReactModal>
  );
}

export default CenterModal;