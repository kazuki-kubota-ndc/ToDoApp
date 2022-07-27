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

const TagEdit = ({ showModal, modalOpen, modalClose, user, setShowTagEditDtl, setCenterData, setShowCenter, loadingTagEdit, setLoadingTagEdit, tagData, setTagData, tagListData, setTagListData, setTagEditDtlData, sizeClass }) => {

  /* 表示ON/OFF */
  const [isDisplay, setIsDisplay] = React.useState(false);
  const [listCnt, setListCnt] = React.useState(0);

  const history = useHistory();
  const location = useLocation();

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setLoadingTagEdit(false);
    modalOpen();
  }

  const backMain = () => {
    modalClose();
  }

  /* マーカー編集 */
  const onClickEdit = (item) => {
    const newTagEditDtlData = new Map();
    newTagEditDtlData.action = 'update';
    newTagEditDtlData.titleName = '編集';
    newTagEditDtlData.execName = '変更';
    newTagEditDtlData.tagNo = item.tag_no;
    newTagEditDtlData.tag_name = item.tag_name;
    newTagEditDtlData.cnt = item.cnt;
    newTagEditDtlData.color = item.color;
    setTagEditDtlData(newTagEditDtlData);
    setShowTagEditDtl(true);
  }

  /* 削除ボタン */
  const onClickDel = (item) => {
    const newCenterData = new Map();
    newCenterData.action = 'tag_delete';
    newCenterData.tag_no = item.tag_no;
    newCenterData.title = 'タグ削除[ '+item.tag_name+' ]';
    newCenterData.text = 'タグを削除します。よろしいですか？';
    newCenterData.execName = '削除';
    setCenterData(newCenterData);
    setShowCenter(true);
  }

  /* タグ新規追加 */
  const onClickTagAdd = () => {
    const newTagEditDtlData = new Map();
    newTagEditDtlData.action = 'insert';
    newTagEditDtlData.titleName = '登録';
    newTagEditDtlData.execName = '追加';
    newTagEditDtlData.cnt = 0;
    newTagEditDtlData.color = 'cdcdcd';
    setTagEditDtlData(newTagEditDtlData);
    setShowTagEditDtl(true);
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

  /* リストのラベルカラー */
  const labelColor1 = {
    background: '#0000ff',
  }

  const labelColor2 = {
    background: '#ff0000',
  }

  var menu_size = '26px';
  var add_size = '20px';
  if(sizeClass=='Small') {
    menu_size = '22px';
    add_size = '16px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
    add_size = '28px';
  }

  useEffect(() =>{

  },[]);

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
              <td className={"width60P"}><span className={"title"+sizeClass}>{'タグ管理'}</span></td>
              <td className={classNames("flexboxRight")}>
              </td>
            </tr>
          </table>
        </div>
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>
            {/* メイン */}
            {tagListData.map(item => (
              <TagList
                key={item}
                item={item}
                onClickEdit={onClickEdit}
                onClickDel={onClickDel}
                sizeClass={sizeClass}
              />
            ))}

            {/* タスク追加 */}
            <div className={classNames("addTask")}>
              <span onClick={onClickTagAdd}>
                <IconContext.Provider value={{ size: add_size }}>
                  <MdOutlineAdd />
                </IconContext.Provider>
              </span>
              <span className={"medText"+sizeClass} onClick={onClickTagAdd}><b>タグ追加</b></span>
            </div>

          </div>
        </div>



      </div>
      <LoaderTagEdit isLoading={ loadingTagEdit } />
    </ReactModal>
  );
}



/* タグリスト */
function TagList({ item, onClickEdit, onClickDel, sizeClass }) {

  /* リストのラベルカラー */
  const labelColor = {
    background: '#'+item.color,
  }

  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    edit_close_size = '40px';
  }

  return (
    <div className={classNames("listBox", "cursorPointer")}>
      <table className={"width100P"}>
        <tr>
          <td style={labelColor} className={"tagLabel"}>&nbsp;</td>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width75P")}>
                  <span className={classNames("title"+sizeClass, "pad0marR20")}>
                    <b>{item.tag_name}</b>&nbsp;[{item.cnt}]
                  </span>
                </td>
                <td align="right" className={classNames("width25P")}>
                  <span className={classNames("pad0marR20")} onClick={() => onClickEdit(item)}>
                    <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                      <FiEdit />
                    </IconContext.Provider>
                  </span>
                  <span onClick={() => onClickDel(item)}>
                    <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                      <AiOutlineCloseCircle />
                    </IconContext.Provider>
                  </span>
                </td>
              </tr>
            </table>
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

/* ローディング表示 */
function LoaderTagEdit({ isLoading }) {

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



export default TagEdit;