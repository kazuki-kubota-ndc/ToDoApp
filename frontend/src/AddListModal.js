import './common.css';
import './AddListModal.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

import 'bulma/css/bulma.min.css';

const AddListModal = ({
  showModal,
  modalOpen,
  modalClose,
  modalData,
  setModalData,
  addList,
  sizeClass,
  innerHeight }) => {

  /* AddListダイアログのデータ */
  const [addListData, setAddListData] = React.useState(new Map());
  /* 入力欄 */
  const [inputListName, setInputListName] = React.useState('');

  /* colorPikerの表示制御 */
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  /* colorPickerの表示色 */
  const [pickerColor, setPickerColor] = React.useState('#dcdcdc');

  /* 表示用 */
  const [isDisp, setIsDisp] = React.useState(true);

  /* リスト名 */
  const changeListName = e => {
    const data = addListData;
    data.list_name = e.target.value;
    setAddListData(data);
    setInputListName(e.target.value);
  }

  /* 追加ボタン実行 */
  const onClickAddList = () => {
    if(!addListData.list_name) {
      alert("リスト名が入力されていません");
    }else {
      setTimeout(() => {reNewData();}, 1000);
      addList(addListData);
    }
  }

  /* フォームデータ等を初期化 */
  const reNewData = () => {
    const newModalData = new Map();
    setModalData(newModalData);
    const data = new Map();
    data.list_color = '#dcdcdc';
    setAddListData(data);
    setInputListName('');
    setPickerColor('#dcdcdc');
    setShowColorPicker(false);
  }

  /* モーダルを開く時にデータを初期化 */
  const modalOpenBefore = () => {
    setIsDisp(true);
    modalOpen();
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    setIsDisp(false);
    reNewData();
    modalClose();
  }

  /* カラークリック時の動作 */
  const onClickColor = () => {
    if(showColorPicker) {
      setShowColorPicker(false);
    }else {
      setShowColorPicker(true);
    }
  }

  /* カラー選択時の動作 */
  const onSelectColor = color => {
    const data = addListData;
    data.list_color = color;
    setAddListData(data);
    setPickerColor(color);
    setShowColorPicker(false);
  }

  useEffect(() =>{
    if(modalData.list_no) {
      const data = new Map();
      data.list_name = modalData.list_name;
      data.list_color = modalData.list_color;
      setAddListData(data);
      setPickerColor('#'+modalData.list_color);
      setShowColorPicker(false);
      setInputListName(modalData.list_name);
    }else {
      const data = new Map();
      data.list_color = '#dcdcdc';
      setAddListData(data);
      setPickerColor('#dcdcdc');
      setShowColorPicker(false);
      setInputListName('');
    }
  },[modalData.list_no]);

  var modal_top = (Number(innerHeight)-200)+'px';
  var modal_height = '200px';
  var circle_class = 'circleM';
  if(sizeClass=='Small') {
    circle_class = 'circleS';
    modal_top = (Number(innerHeight)-180)+'px';
    modal_height = '180px';
  }else if(sizeClass=='Large') {
    circle_class = 'circleL';
    modal_top = (Number(innerHeight)-220)+'px';
    modal_height = '220px';
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

  const colorPickStyle = {
    display: showColorPicker ? 'inline-block' : 'none',
  }

  const colorStyle = {
    background: pickerColor,
  }

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
            <span className={"labelFont"+sizeClass}>リスト名</span>
          </div>
          <div>
            <input
              id="list_name"
              class="input"
              className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
              type="text"
              placeholder='リストを追加する'
              onChange={changeListName}
              value={inputListName}
            />
          </div>
          <div>
            <span className={"labelFont"+sizeClass}>カラー</span>
          </div>
          <div>
            <p className={classNames("pad0marR40", circle_class, "cursorPointer")} style={colorStyle} onClick={onClickColor}></p>
            <span style={colorPickStyle}>
              {pickerColor!='#8b4513' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "saddlebrown")} onClick={() => onSelectColor('#8b4513')}></p> }
              {pickerColor!='#ff0000' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "red")} onClick={() => onSelectColor('#ff0000')}></p> }
              {pickerColor!='#ff69b4' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "hotpink")} onClick={() => onSelectColor('#ff69b4')}></p> }
              {pickerColor!='#dcdcdc' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "gainsboro")} onClick={() => onSelectColor('#dcdcdc')}></p> }
              {pickerColor!='#ff7f50' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "coral")} onClick={() => onSelectColor('#ff7f50')}></p> }
              {pickerColor!='#ffff00' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "yellow")} onClick={() => onSelectColor('#ffff00')}></p> }
              {pickerColor!='#adff2f' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "greenyellow")} onClick={() => onSelectColor('#adff2f')}></p> }
              {pickerColor!='#008000' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "green")} onClick={() => onSelectColor('#008000')}></p> }
              {pickerColor!='#00ffff' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "aqua")} onClick={() => onSelectColor('#00ffff')}></p> }
              {pickerColor!='#0000ff' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "blue")} onClick={() => onSelectColor('#0000ff')}></p> }
              {pickerColor!='#191970' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "midnightblue")} onClick={() => onSelectColor('#191970')}></p> }
              {pickerColor!='#ee82ee' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "violet")} onClick={() => onSelectColor('#ee82ee')}></p> }
            </span>
          </div>

          <div className={classNames("width90P")} align="right">
            <button class="button is-primary" onClick={onClickAddList}>{modalData.execName}</button>
          </div>
        </div>
      }
    </ReactModal>
  );
}



export default AddListModal;