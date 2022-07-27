import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { useHistory,useLocation } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';

import { IconContext } from 'react-icons';
import { MdOutlineAdd } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GiAlarmClock } from 'react-icons/gi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { MdOutlineTaskAlt } from 'react-icons/md';

const TagEditMarkerEditModal = ({ showModal, modalOpen, modalClose, modalData, markerListData, tagListUpdateData, setTagListUpdateData, tagData, inMarker, setInMarker, tagEditDtlData, setTagEditDtlData, user, sizeClass }) => {

  /* リスト表示用データ */
  const [tagMarkerData, setTagMarkerData] = React.useState([{}]);
  const [includeMarkerData, setIncludeMarkerData] = React.useState([{}]);
  /* 表示用 */
  const [isDisabled, setIsDisabled] = React.useState(true);
  /* 所属マーカー更新用データ */
  const [updateMarkerData, setUpdateMarkerData] = React.useState([{}]);

  /* リストの切り替え用 */
  const [isAdd, setIsAdd] = React.useState(false);

  const history = useHistory();
  const location = useLocation();

  /* フォームデータ等を初期化 */
  const reNewData = () => {
    setIsAdd(false);
    setIsDisabled(true);
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    setTimeout(() => {reNewData();}, 200);
    modalClose();
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setIsDisabled(true);
    modalOpen();
  }

  /* 決定 */
  const onClickUpdate = () => {

    var newInMarker = [];
    var cnt = 0;
    includeMarkerData.map(marker => {
      newInMarker.push(Number(marker.marker_no));
      cnt++;
    });
    setInMarker(newInMarker);
    var newTagEditDtlData = tagEditDtlData;
    newTagEditDtlData.cnt = cnt;
    newTagEditDtlData.marker_update = 1;
    setTagEditDtlData(newTagEditDtlData);

    /* 更新用データをセット */
    if(updateMarkerData.length!=0) {
      setTagListUpdateData(updateMarkerData);
    }else {
      setTagListUpdateData([{not_update: 1}]);
    }
    setIsDisabled(true);
    setIsAdd(false);
    modalClose();


  }

  /* 追加ボタン */
  const onClickAdd = (item) => {
    setIsDisabled(false);

    /* 表示用データ更新 */
    var addMarker = new Map();
    const newTagMarkerData = tagMarkerData.map(marker => {
      if(item.marker_no==marker.marker_no) {
        marker.isTagIn = 1;
        addMarker = marker;
      }
      return marker;
    });
    setTagMarkerData(newTagMarkerData);
    var addFlg = 0;
    var newIncludeMarkerData = [];
    includeMarkerData.map(marker => {
      if(Number(item.marker_no)<Number(marker.marker_no) && addFlg == 0) {
        addFlg = 1;
        newIncludeMarkerData.push(addMarker);
      }
      newIncludeMarkerData.push(marker);
    });
    if(addFlg==0) {
      newIncludeMarkerData.push(addMarker);
    }
    setIncludeMarkerData(newIncludeMarkerData);
    /* 更新用データ */
    var addFlg=0;
    var newUpdateMarkerData = [];
    updateMarkerData.map(marker => {
      if(Number(item.marker_no)<Number(marker.marker_no) && addFlg == 0) {
        addFlg = 1;
        newUpdateMarkerData.push(addMarker);
      }
      newUpdateMarkerData.push(marker);
    });
    if(addFlg==0) {
      newUpdateMarkerData.push(addMarker);
    }
    setUpdateMarkerData(newUpdateMarkerData);


  }

  /* 削除ボタン */
  const onClickDel = (item) => {
    setIsDisabled(false);

    /* 表示用データ更新 */
    const newTagMarkerData = tagMarkerData.map(marker => {
      if(item.marker_no==marker.marker_no) {
        marker.isTagIn = 0;
      }
      return marker;
    });
    setTagMarkerData(newTagMarkerData);
    var newIncludeMarkerData = [];
    includeMarkerData.map(marker => {
      if(item.marker_no!=marker.marker_no) {
        newIncludeMarkerData.push(marker);
      }
    });
    setIncludeMarkerData(newIncludeMarkerData);
    /* 更新用データ */
    var newUpdateMarkerData = [];
    updateMarkerData.map(marker => {
      if(item.marker_no!=marker.marker_no) {
        newUpdateMarkerData.push(marker);
      }
    });
    setUpdateMarkerData(newUpdateMarkerData);

  }

  /* 表示切り替え */
  const onClickChange = () => {

    const newIsAdd = !isAdd;
    setIsAdd(newIsAdd);
  }

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
    content: {
      top: '0%',
      left: '0%',
      right: 'auto',
      bottom: 'auto',
      height: '100%',
      width: '100%',
//      marginRight: '-50%',
//      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  var menu_size = '26px';
  var add_size = '20px';
  if(sizeClass=='Small') {
    menu_size = '22px';
    add_size = '16px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
    add_size = '28px';
  }

  var com_size = '22px';
  var add_size = '20px';
  var clock_size = '24px';
  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    com_size = '22px';
    add_size = '20px';
    clock_size = '24px';
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    com_size = '32px';
    add_size = '30px';
    clock_size = '30px';
    edit_close_size = '40px';
  }

  useEffect(() =>{


    var newTagMarkerData = [];
    var newIncludeMarkerData = [];
    var newUpdateMarkerData = [];
    markerListData.map(marker => {
      var isTagIn = 0;
      if(inMarker.indexOf(marker.marker_no)!=-1) {
        isTagIn = 1;
      }
      marker.isTagIn = isTagIn;
      newTagMarkerData.push(marker);
      if(isTagIn==1) {
        newIncludeMarkerData.push(marker);
        newUpdateMarkerData.push(marker);
      }
    });
    setTagMarkerData(newTagMarkerData);
    setIncludeMarkerData(newIncludeMarkerData);
    setUpdateMarkerData(newUpdateMarkerData);

    if(newIncludeMarkerData.length==0) {
      setIsAdd(true);
    }
  },[modalData]);

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalCloseBefore}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
          <table className={"width100P"}>
            <tr>
              <td className={classNames("width10P")} onClick={modalCloseBefore}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <IoMdArrowRoundBack />
                </IconContext.Provider>
              </td>
              <td className={"width60P"}>
                <span className={"title"+sizeClass}>
                  {!isAdd ? '所属' : '全'}マーカー [タグ１]
                </span>
              </td>
              <td className={classNames("flexboxRight")}>
              </td>
            </tr>
          </table>
        </div>
        {/* メイン */}
        <div className={classNames("panel-block", "panelB")}>

          {/* 一覧 */}
          {!isAdd &&
            <div className={classNames("height100P", "width100P")}>

              {/* 所属マーカーのリスト */}
              {includeMarkerData.map(item => (
                <DefaultList
                  item={item}
                  onClickDel={onClickDel}
                  sizeClass={sizeClass}
                />
              ))}

              <div>
                <span className={classNames("medText"+sizeClass, "cursorPointer")} onClick={onClickChange}><b>マーカーの追加</b></span>
              </div>

              <div className={classNames("width100P")} align="right">
                <button class="button is-primary" onClick={onClickUpdate} disabled={isDisabled}>{'決定'}</button>
              </div>

            </div>
          }
          {/* 追加 */}
          {isAdd &&
            <div className={classNames("height100P", "width100P")}>

              {/* 全マーカーリスト */}
              {tagMarkerData.map(item => (
                <AddList
                  item={item}
                  onClickDel={onClickDel}
                  onClickAdd={onClickAdd}
                  sizeClass={sizeClass}
                />
              ))}

              <div>
                <span className={classNames("medText"+sizeClass, "cursorPointer")} onClick={onClickChange}><b>所属マーカーのみ表示</b></span>
              </div>

              <div className={classNames("width100P")} align="right">
                <button class="button is-primary" onClick={onClickUpdate} disabled={isDisabled}>{'決定'}</button>
              </div>

            </div>
          }

        </div>

      </div>
    </ReactModal>
  );
}

/* デフォルト表示リスト */
function DefaultList({ item, onClickDel, sizeClass }) {

  return (
    <div className={classNames("taskBox")}>
      <table className={"width100P"}>
        <tr>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            {/* タイトル */}
            <div className={"pad0mar0"}>
              <table className={"width100P"}>
                <tr>
                  <td className={classNames("width80P")}>
                    <span className={classNames("titleMod"+sizeClass)}>
                      <b>{item.marker_name}</b>
                    </span>
                  </td>
                  <td className={classNames("width20P")}>
                    <span className={"flexboxRight"} onClick={() => onClickDel(item)}>
                      <button className={classNames("largeBtnFont"+sizeClass, "button", "is-success")}>タグ削除</button>
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            {/* 詳細 */}
            <div className={"pad0mar0"}>
              <Dtl
                dtl_str={item.dtl}
                sizeClass={sizeClass}
              />
            </div>

          </td>
        </tr>
      </table>
    </div>
  );
}

/* 追加時の表示リスト */
function AddList({ item, onClickDel, onClickAdd, sizeClass }) {

  return (
    <div className={classNames("taskBox")}>
      <table className={"width100P"}>
        <tr>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            {/* タイトル */}
            <div className={"pad0mar0"}>
              <table className={"width100P"}>
                <tr>
                  <td className={classNames("width80P")}>
                    <span className={classNames("titleMod"+sizeClass)}>
                      <b>{item.marker_name}</b>
                    </span>
                  </td>
                  <td className={classNames("width20P")}>
                    {item.isTagIn==1 &&
                      <span className={"flexboxRight"} onClick={() => onClickDel(item)}>
                        <button className={classNames("largeBtnFont"+sizeClass, "button", "is-success")}>タグ削除</button>
                      </span>
                    }
                    {item.isTagIn==0 &&
                      <span className={"flexboxRight"} onClick={() => onClickAdd(item)}>
                        <button className={classNames("largeBtnFont"+sizeClass, "button", "is-info")}>追加</button>
                      </span>
                    }
                  </td>
                </tr>
              </table>
            </div>
            {/* 詳細 */}
            <div className={"pad0mar0"}>
              <Dtl
                dtl_str={item.dtl}
                sizeClass={sizeClass}
              />
            </div>

          </td>
        </tr>
      </table>
    </div>
  );
}

/* 詳細 */
function Dtl({ dtl_str, sizeClass }) {

  var dtlArray = new Array();
  if(dtl_str) {
    if(dtl_str.match(/\r?\n/g)) {
      dtlArray = dtl_str.split(/\r?\n/g);
    }else {
      dtlArray[0] = dtl_str;
    }
  }

  var limit_cnt = 90;
  if(sizeClass=='Small') {
    limit_cnt = 110;
  }else if(sizeClass=='Large') {
    limit_cnt = 70;
  }

  var k = 0;
  var dtl_names = new Array();

  for(const dtl_name of dtlArray) {
    dtl_names[k] = '';
    var text_array = (dtl_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        dtl_names[k] += '...';
        break;
      }else {
        dtl_names[k] += (dtl_name).charAt(i);
      }
    }
    k++;
  }

  return (
    <span className={classNames("medText"+sizeClass)}>
      {dtl_names.map(dtl => (
        <div>{dtl}</div>
      ))}
    </span>
  );
}





export default TagEditMarkerEditModal;