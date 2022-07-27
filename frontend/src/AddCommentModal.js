import './common.css';
import './AddCommentModal.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

import 'bulma/css/bulma.min.css';

const AddCommentModal = ({
  showModal,
  modalOpen,
  modalClose,
  modalData,
  setModalData,
  addComment,
  sizeClass,
  innerHeight }) => {

  /* AddCommentダイアログのデータ */
  const [addCommentData, setAddCommentData] = React.useState(new Map());
  /* 入力欄 */
  const [inputComName, setInputComName] = React.useState('');

  /* コメント */
  const changeComment = e => {
    const data = addCommentData;
    data.comment = e.target.value;
    setAddCommentData(data);
    setInputComName(e.target.value);
  }

  /* 追加ボタン実行 */
  const onClickAddComment = () => {
    if(!addCommentData.comment) {
      alert("コメントが未入力です");
    }else {
      const newAddCommentData = addCommentData;
      newAddCommentData.list_no = modalData.list_no;
      newAddCommentData.task_no = modalData.task_no;
      newAddCommentData.sub_no = modalData.sub_no;
      newAddCommentData.action = modalData.action;
      addComment(newAddCommentData);
      setInputComName('');
    }
  }

  /* モーダルを開く時にデータを初期化 */
  const modalOpenBefore = () => {

    modalOpen();
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    setInputComName('');
    modalClose();
  }

  useEffect(() =>{
    if(modalData.sub_no) {
      const data = new Map();
      setAddCommentData(data);
      setInputComName(modalData.sub_name);
    }else {
      const data = new Map();
      setAddCommentData(data);
      setInputComName('');
    }
  },[modalData]);

  var modal_top = (Number(innerHeight)-140)+'px';
  var modal_height = '140px';
  if(sizeClass=='Small') {
    modal_top = (Number(innerHeight)-130)+'px';
    modal_height = '130px';
  }else if(sizeClass=='Large') {
    modal_top = (Number(innerHeight)-160)+'px';
    modal_height = '160px';
  }

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
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
      <div className={classNames("addModal")}>
        <div>
          <span className={"labelFont"+sizeClass}>コメント</span>
        </div>
        <div>
          <input
            class="input"
            className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
            type="text"
            placeholder='コメントを追加する'
            onChange={changeComment}
            value={inputComName}
          />
        </div>



        <div className={classNames("width90P")} align="right">
          <button class="button is-primary" onClick={onClickAddComment}>{modalData.execName}</button>
        </div>
      </div>
    </ReactModal>
  );
}



export default AddCommentModal;