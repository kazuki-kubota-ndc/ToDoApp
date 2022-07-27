import './common.css';
import './AddTaskModal.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import 'bulma/css/bulma.min.css';

const AddTaskModal = ({
  showModal,
  modalOpen,
  modalClose,
  modalData,
  setModalData,
  addTask,
  sizeClass,
  innerHeight }) => {

  /* AddTaskダイアログのデータ */
  const [addTaskData, setAddTaskData] = React.useState(new Map());
  /* 入力欄 */
  const [inputTaskName, setInputTaskName] = React.useState('');
  const [inputDtl, setInputDtl] = React.useState('');

  /* colorPikerの表示制御 */
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  /* colorPickerの表示色 */
  const [pickerColor, setPickerColor] = React.useState('#dcdcdc');

  /* btnPikerの表示制御 */
  const [showBtnPicker, setShowBtnPicker] = React.useState(false);


  /* 日時追加の表示制御 */
  const [showTime, setShowTime] = React.useState(false);

  /* 日付データ */
  const [date, setDate] = useState(moment);
  const dateFormat = 'YYYY/MM/DD';
  const [focused, setFocused] = useState(false);

  /* 表示用 */
  const [isDisp, setIsDisp] = React.useState(true);

  /* タスク名 */
  const changeTaskName = e => {
    const data = addTaskData;
    data.task_name = e.target.value;
    setAddTaskData(data);
    setInputTaskName(e.target.value);
  }

  /* 追加ボタン実行 */
  const onClickAddTask = () => {
    var text = addTaskData.dtl;
    var targetStr = "\n";
    var cnt = (text.match(new RegExp(targetStr, "g")) || [] ).length;

    if(!addTaskData.task_name) {
      alert("タスク名が入力されていません");
    }else if(cnt>2) {
      alert("詳細が４行以上入力されています、３行以下に修正して下さい。");
    }else {
      const newAddTaskData = addTaskData;
      newAddTaskData.date = date.format(dateFormat);
      setTimeout(() => {reNewData();}, 1000);
      addTask(newAddTaskData);
    }
  }

  /* フォームデータ等を初期化 */
  const reNewData = () => {
    const newModalData = new Map();
    setModalData(newModalData);
    const data = new Map();
    data.task_color = '#dcdcdc';
    data.dtl = '';
    data.shime_time = '12';
    data.shime_min = '0';
    data.time_add_flg = '0';
    data.task_check = '0';
    setAddTaskData(data);
    setInputTaskName('');
    setInputDtl('');
    setPickerColor('#dcdcdc');
    setShowColorPicker(false);
    setShowBtnPicker(false);
    const now = moment();
    setDate(now);
    setShowTime(false);
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
    const data = addTaskData;
    data.task_color = color;
    setAddTaskData(data);
    setPickerColor(color);
    setShowColorPicker(false);
  }

  /* 状態クリック時の動作 */
  const onClickBtn = () => {
    if(showBtnPicker) {
      setShowBtnPicker(false);
    }else {
      setShowBtnPicker(true);
    }
  }

  /* 状態選択時の動作 */
  const onSelectBtn = check => {
    const data = addTaskData;
    data.task_check = check;
    setAddTaskData(data);
    setShowBtnPicker(false);
  }

  const openTime = () =>{
    const data = addTaskData;
    data.time_add_flg = '1';
    setAddTaskData(data);
    setShowTime(true);
  }

  const closeTime = () =>{
    const data = addTaskData;
    data.time_add_flg = '0';
    setAddTaskData(data);
    setShowTime(false);
  }

  /* 詳細 */
  const changeDtl = e => {
    const data = addTaskData;
    data.dtl = e.target.value;
    setAddTaskData(data);
    setInputDtl(e.target.value);
  }

  /* 時 */
  const selectChangeTime = e => {
    const data = addTaskData;
    data.shime_time = e.target.value;
    setAddTaskData(data);
  }

  /* 分 */
  const selectChangeMin = e => {
    const data = addTaskData;
    data.shime_min = e.target.value;
    setAddTaskData(data);
  }

  useEffect(() =>{
    if(modalData.task_no) {
      const data = new Map();
      data.task_name = modalData.task_name;
      data.task_color = modalData.task_color;
      data.task_check = modalData.task_check;
      data.dtl = modalData.dtl;
      if(modalData.shime_time) {
        setShowTime(true);
        data.time_add_flg = '1';
        data.shime_time = modalData.shime_time;
        data.shime_min = modalData.shime_min;
      }else {
        setShowTime(false);
        data.time_add_flg = '0';
        data.shime_time = '12';
        data.shime_min = '0';
      }
      setAddTaskData(data);
      setDate(moment(modalData.shimebi, dateFormat));
      setPickerColor('#'+modalData.task_color);
      setShowColorPicker(false);
      setInputTaskName(modalData.task_name);
      setInputDtl(modalData.dtl);

    }else {
      const data = new Map();
      data.task_color = '#dcdcdc';
      data.dtl = '';
      data.shime_time = '12';
      data.shime_min = '0';
      data.time_add_flg = '0';
      data.task_check = '0';
      setAddTaskData(data);
      const now = moment();
      setDate(now);
      setPickerColor('#dcdcdc');
      setShowColorPicker(false);
      setInputTaskName('');
      setInputDtl('');
    }
  },[modalData.task_no]);

  var modal_top = (Number(innerHeight)-460)+'px';
  var modal_height = '460px';
  var circle_class = 'circleM';
  if(sizeClass=='Small') {
    circle_class = 'circleS';
    modal_top = (Number(innerHeight)-420)+'px';
    modal_height = '420px';
  }else if(sizeClass=='Large') {
    circle_class = 'circleL';
    modal_top = (Number(innerHeight)-540)+'px';
    modal_height = '540px';
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

  const colorPickStyle = {
    display: showColorPicker ? 'inline-block' : 'none',
  }

  const colorStyle = {
    background: pickerColor,
  }

  const btnPickStyle = {
    display: showBtnPicker ? 'inline-block' : 'none',
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
            <span className={"labelFont"+sizeClass}>タスク名</span>
          </div>
          <div>
            <input
              class="input"
              className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
              type="text"
              placeholder='タスクを追加する'
              onChange={changeTaskName}
              value={inputTaskName}
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

          <table>
            <tr>
              <td>
                <div>
                  <span className={"labelFont"+sizeClass}>日付</span>
                </div>
                <div>
                  <span className={"pad0marR40"}>
                    <SingleDatePicker
                      date={date}
                      onDateChange={date => setDate(date)}
                      focused={focused}
                      onFocusChange={focused => setFocused(focused)}
                      id="date"
                      onClose={focused => setFocused(false)}
                      displayFormat="YYYY/MM/DD"
                      withPortal={true}
                    />
                  </span>
                </div>
              </td>
              {!showTime &&
                <td onClick={openTime}>
                  <span className={classNames("labelFont"+sizeClass, "cursorPointer")}><b>時間追加</b></span>
                </td>
              }
              {showTime &&
                <td>
                  <div>
                    <span className={"labelFont"+sizeClass}>時間</span>
                  </div>
                  <div>
                    <span className={classNames("pad0marR5", "select", "is-round")}>
                      <span>
                        <SelectTime
                          selectChangeTime={selectChangeTime}
                          defValue={addTaskData.shime_time}
                        />
                      </span>
                    </span>
                    <span className={classNames("pad0marR5", "verBottom")}>時</span>
                    <span className={classNames("pad0marR5", "select", "is-round")}>
                      <span>
                        <SelectMin
                          selectChangeMin={selectChangeMin}
                          defValue={addTaskData.shime_min}
                        />
                      </span>
                    </span>
                    <span className={classNames("pad0marR5", "verBottom")}>分</span>
                  </div>
                </td>
              }
              {showTime &&
                <td>
                  <span onClick={closeTime}>
                    <IconContext.Provider value={{ size: '30px', style: { cursor: 'pointer'} }}>
                      <AiOutlineCloseCircle />
                    </IconContext.Provider>
                  </span>
                </td>
              }
            </tr>
          </table>

          <div>
            <div>
              <span className={"labelFont"+sizeClass}>詳細</span>
            </div>
            <div>
              <textarea
                className={classNames("noBorderTextarea", "titleMod"+sizeClass, "cursorPointer")}
                defaultValue={inputDtl}
                onChange={changeDtl}
                rows="4"
              />
            </div>
          </div>

          <div>
            <span className={"labelFont"+sizeClass}>状態</span>
          </div>
          <div>
            <span className={"pad0marR20"}>
              <CheckBtn
                addTaskData={addTaskData}
                onClickBtn={onClickBtn}
                sizeClass={sizeClass}
              />
            </span>
            <span style={btnPickStyle}>
              {(addTaskData.task_check!='1' && sizeClass!='Large') && <button class="button is-success is-small is-rounded" onClick={() => onSelectBtn('1')}>完了</button> }
              {(addTaskData.task_check!='1' && sizeClass=='Large') && <button class="button is-success is-normal is-rounded" onClick={() => onSelectBtn('1')}>完了</button> }
              {(addTaskData.task_check!='2' && sizeClass!='Large') && <button class="button is-warning is-small is-rounded" onClick={() => onSelectBtn('2')}>保留</button> }
              {(addTaskData.task_check!='2' && sizeClass=='Large') && <button class="button is-warning is-normal is-rounded" onClick={() => onSelectBtn('2')}>保留</button> }
              {((addTaskData.task_check=='1' || addTaskData.task_check=='2') && sizeClass!='Large') && <button class="button is-info is-small is-rounded" onClick={() => onSelectBtn('0')}>作業中</button> }
              {((addTaskData.task_check=='1' || addTaskData.task_check=='2') && sizeClass=='Large') && <button class="button is-info is-normal is-rounded" onClick={() => onSelectBtn('0')}>作業中</button> }
            </span>
          </div>

          <div className={classNames("width90P")} align="right">
            <button class="button is-primary" onClick={onClickAddTask}>{modalData.execName}</button>
          </div>
        </div>
      }
    </ReactModal>
  );
}

/* 時間選択プルダウン */
function SelectTime({ selectChangeTime, defValue }) {
  const htmls = [];

  for(let i=0;i<24;i++) {
    htmls.push(<option value={String(i+1)}>{String(i+1)}</option>);
  }

  return (
    <select defaultValue={defValue} onChange={selectChangeTime}>
      { htmls }
    </select>
  );
}

/* 分選択プルダウン */
function SelectMin({ selectChangeMin, defValue }) {
  const htmls = [];

  for(let i=0;i<60;i++) {
    htmls.push(<option value={String(i)}>{String(i)}</option>);
  }

  return (
    <select defaultValue={defValue} onChange={selectChangeMin}>
      { htmls }
    </select>
  );
}

/* 状態アイコン */
function CheckBtn({ addTaskData, onClickBtn, sizeClass }) {
  /* 1:完了 */
  if(addTaskData.task_check=='1') {
    if(sizeClass=='Large') {
      return (
        <button class="button is-success is-normal is-rounded" onClick={onClickBtn}>完了</button>
      );
    }else {
      return (
        <button class="button is-success is-small is-rounded" onClick={onClickBtn}>完了</button>
      );
    }
  /* 2:保留 */
  }else if(addTaskData.task_check=='2') {
    if(sizeClass=='Large') {
      return (
        <button class="button is-warning is-normal is-rounded" onClick={onClickBtn}>保留</button>
      );
    }else {
      return (
        <button class="button is-warning is-small is-rounded" onClick={onClickBtn}>保留</button>
      );
    }
  /* 0:作業中 */
  }else {
    if(sizeClass=='Large') {
      return (
        <button class="button is-info is-normal is-rounded" onClick={onClickBtn}>作業中</button>
      );
    }else {
      return (
        <button class="button is-info is-small is-rounded" onClick={onClickBtn}>作業中</button>
      );
    }
  }

}

export default AddTaskModal;