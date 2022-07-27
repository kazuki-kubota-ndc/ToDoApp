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
import { AiOutlineEnvironment } from 'react-icons/ai';

const MarkerList = ({ showModal, modalOpen, modalClose, markerListData, setMarkerListData, tagData, setTagData, user, setShowMarker, markerEditForList, setCenterData, setShowCenter, loadingMarkerList, setLoadingMarkerList, moveMap, selectTagDatas, sizeClass }) => {

  const [markerData, setMarkerData] = React.useState([{}]);

  /* 表示ON/OFF */
  const [isDisplay, setIsDisplay] = React.useState(false);
  const [listCnt, setListCnt] = React.useState(0);

  const history = useHistory();
  const location = useLocation();

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setLoadingMarkerList(false);
    modalOpen();
  }

  const backMain = () => {
    modalClose();
  }

  /* 移動ボタン */
  const onClickMove = (item) => {
    moveMap(item);
  }

  /* マーカー編集 */
  const onClickEdit = (item) => {
    markerEditForList(item);
  }

  /* 削除ボタン */
  const onClickDel = (item) => {
    const newCenterData = new Map();
    newCenterData.action = 'marker_delete';
    newCenterData.marker_no = item.marker_no;
    newCenterData.title = 'マーカー削除[ '+item.marker_name+' ]';
    newCenterData.text = 'マーカーを削除します。よろしいですか？';
    newCenterData.execName = '削除';
    setCenterData(newCenterData);
    setShowCenter(true);
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
  if(sizeClass=='Small') {
    menu_size = '22px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
  }



  useEffect(() =>{
    if(selectTagDatas[0]) {
      var selectTagNo = [];
      selectTagDatas.map(tag => {
        selectTagNo.push(tag.tag_no);
      });
      var selectMarkerNo =[];
      tagData.map(tag => {
        if(selectTagNo.indexOf(tag.tag_no)!=-1) {
          selectMarkerNo.push(tag.marker_no);
        }
      });
      var newMarkerData = [];
      markerListData.map(marker => {
        if(selectMarkerNo.indexOf(marker.marker_no)!=-1) {
          newMarkerData.push(marker);
        }
      });
      setMarkerData(newMarkerData);
    }else {
      setMarkerData(markerListData);
    }
  },[markerListData, selectTagDatas]);

  var select_tag_name = '';
  selectTagDatas.map(tag => {
    if(select_tag_name!='') {
      select_tag_name += ',';
    }
    select_tag_name += tag.tag_name;
  });

  useEffect(() => {
    if(user.user_id) {
      setIsDisplay(true);
    }else {
      setIsDisplay(false);
    }
  }, [user]);

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalClose}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
          <table className={"width100P"}>
            <tr>
              <td className={classNames("width10P")} onClick={backMain}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <IoMdArrowRoundBack />
                </IconContext.Provider>
              </td>
              <td className={"width60P"}><span className={"title"+sizeClass}>{'マーカー一覧'}{select_tag_name ? '['+select_tag_name+']' : ''}</span></td>
              <td className={classNames("flexboxRight")}>
              </td>
            </tr>
          </table>
        </div>
        {/* メイン */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>

            {/* タスク */}
            {markerData.map(item => (
              <MarkerBox
                key={item}
                item={item}
                tagData={tagData}
                onClickEdit={onClickEdit}
                onClickMove={onClickMove}
                onClickDel={onClickDel}
                isDisplay={isDisplay}
                sizeClass={sizeClass}
              />
            ))}

          </div>
        </div>
      </div>
      <LoaderMarkerList isLoading={ loadingMarkerList } />
    </ReactModal>
  );
}



/* マーカーリスト */
function MarkerBox({ item, tagData, onClickEdit, onClickMove, onClickDel, isDisplay, sizeClass }) {

  const [markerTagDatas, setMarkerTagDatas] = React.useState([{}]);

  useEffect(() => {
    const newMarkerTagDatas = [];
    tagData.map(tag => {
      if(item.marker_no==tag.marker_no) {
        newMarkerTagDatas.push(tag);
      }
    });
    setMarkerTagDatas(newMarkerTagDatas);
  }, [tagData]);

  var com_size = '22px';
  var clock_size = '24px';
  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    com_size = '22px';
    clock_size = '24px';
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    com_size = '32px';
    clock_size = '30px';
    edit_close_size = '40px';
  }

  const favoriteColor = item.favorite_flg==1 ? "lavenderblush" : "";

  return (
    <div className={classNames("markerBox", favoriteColor)}>
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
                    <span className={"flexboxRight"}>
                      <span className={classNames("pad0marR20")} onClick={() => onClickMove(item)}>
                        <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                          <AiOutlineEnvironment />
                        </IconContext.Provider>
                      </span>
                      {isDisplay &&
                        <span className={classNames("pad0marR20")} onClick={() => onClickEdit(item)}>
                          <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                            <FiEdit />
                          </IconContext.Provider>
                        </span>
                      }
                      {isDisplay &&
                        <span onClick={() => onClickDel(item)}>
                          <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                            <AiOutlineCloseCircle />
                          </IconContext.Provider>
                        </span>
                      }
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
            {/* タグ */}
            <div className={"pad0mar0"}>
              {markerTagDatas.map(markerTagData => (
                <Tag
                  markerTagData={markerTagData}
                />
              ))}
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

/* タグ */
function Tag({ markerTagData }) {

  var nameLength = 0;
  var reTagName = '';
  if(markerTagData.tag_name) {
    for (var i = 0; i < (markerTagData.tag_name).length; i++) {
      var c = markerTagData.tag_name.charCodeAt(i);
      if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        nameLength += 1;
      } else {
        nameLength += 2;
      }
      if(nameLength<11) {
        reTagName += markerTagData.tag_name.charAt(i);
      }
    }
  }

  var colorClass = "ellipsePanel";
  if(markerTagData.color=='cd853f') {
    colorClass = "ellipsePanelPE";
  }else if(markerTagData.color=='ff7f50') {
    colorClass = "ellipsePanelCO";
  }else if(markerTagData.color=='ffb6c1') {
    colorClass = "ellipsePanelLP";
  }else if(markerTagData.color=='dda0dd') {
    colorClass = "ellipsePanelPL";
  }else if(markerTagData.color=='adff2f') {
    colorClass = "ellipsePanelGY";
  }else if(markerTagData.color=='dcdcdc') {
    colorClass = "ellipsePanelDef";
  }else if(markerTagData.color=='f0f8ff') {
    colorClass = "ellipsePanelAB";
  }else if(markerTagData.color=='fffacd') {
    colorClass = "ellipsePanelLC";
  }else if(markerTagData.color=='cd5c5c') {
    colorClass = "ellipsePanelIR";
  }

  return (
    <span>
      {nameLength<3 &&
        <span className={colorClass}>
          &nbsp;{reTagName}&nbsp;
        </span>
      }
      {nameLength>2 &&
        <span className={colorClass}>
          {reTagName}
        </span>
      }
      &nbsp;
    </span>
  );
}

/* ローディング表示 */
function LoaderMarkerList({ isLoading }) {

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

export default MarkerList;