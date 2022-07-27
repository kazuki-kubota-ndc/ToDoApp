import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsBookmarkStarFill } from 'react-icons/bs';

const TagEditDtlModal = ({ showModal, modalOpen, modalClose, modalData, tagEditDtlViewData, setTagEditDtlViewData, user, loadingTagEditDtl, setLoadingTagEditDtl, setShowTagEditMarkerEdit, tagListUpdateData, setTagListUpdateData, setTagEditMarkerEditData, markerListData, tagData, inMarker, setInMarker, addTag, sizeClass }) => {

  /* 入力欄 */
  const [inputTagName, setInputTagName] = React.useState('');
  /* colorPikerの表示制御 */
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  /* colorPickerの表示色 */
  const [pickerColor, setPickerColor] = React.useState('#dcdcdc');

  /* 表示用 */
  const [isDisabled, setIsDisabled] = React.useState(true);

  /* マーカー名 */
  const changeTagName = e => {
    setIsDisabled(false);
    const data = tagEditDtlViewData;
    data.tag_name = e.target.value;
    setTagEditDtlViewData(data);
    setInputTagName(e.target.value);
  }

  /* フォームデータ等を初期化 */
  const reNewData = () => {

    /* 更新用マーカーデータをリセット */
    setTagListUpdateData([]);

    const newTagEditDtlViewData = new Map();
    setTagEditDtlViewData(newTagEditDtlViewData);
    setInputTagName('');
    setPickerColor('#dcdcdc');
    setShowColorPicker(false);
    setIsDisabled(true);
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    if(!loadingTagEditDtl) {
      setTimeout(() => {reNewData();}, 200);
      modalClose();
    }
  }

  /* モーダル閉じる */
  const closeModal = () => {
    modalClose();
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setLoadingTagEditDtl(false);
    setIsDisabled(true);
    modalOpen();
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
    setIsDisabled(false);
    const data = tagEditDtlViewData;
    data.color = color;
    setTagEditDtlViewData(data);
    setPickerColor(color);
    setShowColorPicker(false);
  }

  const onClickUpdate = () => {

    const newTagEditDtlViewData = tagEditDtlViewData;
    var err = false;
    /* 登録 */
    if(modalData.action=='insert') {
      if(tagEditDtlViewData.tag_name==null || tagEditDtlViewData.tag_name=='') {
        alert('TAGNAME IS EMPTY');
        err = true;
      }
      if(!tagEditDtlViewData.tag_name) {
        newTagEditDtlViewData.tag_name = '';
      }
      if(!tagEditDtlViewData.color) {
        newTagEditDtlViewData.color = '#dcdcdc';
      }
    /* 編集 */
    }else if(modalData.action=='update') {
      if(!tagEditDtlViewData.tag_name) {
        newTagEditDtlViewData.tag_name = modalData.tag_name;
      }
      if(!tagEditDtlViewData.color) {
        newTagEditDtlViewData.color = modalData.color;
      }
    }
    if(!err) {
//      reNewData();
      addTag(newTagEditDtlViewData);

    }
  }

  const onClickTagEditMarkerEdit = () => {
    const newTagEditMarkerEditData = new Map();
    newTagEditMarkerEditData.tag_no = modalData.tagNo;
    setTagEditMarkerEditData(newTagEditMarkerEditData);
    setShowTagEditMarkerEdit(true);
  }

  useEffect(() => {

    setInputTagName(modalData.tag_name);
    setPickerColor('#'+modalData.color);
    setTagListUpdateData([]);

    /* 所属マーカーデータ */
    var newInMarker = [];
    tagData.map(tag => {
      if(modalData.tagNo == tag.tag_no) {
        newInMarker.push(tag.marker_no);
      }
    });
    setInMarker(newInMarker);


  }, [modalData]);

  useEffect(() => {
    if(tagListUpdateData.length!=0) {
      setIsDisabled(false);
    }
  }, [tagListUpdateData]);

  useEffect(() => {
    if(loadingTagEditDtl) {
      setIsDisabled(true);
    }
  }, [loadingTagEditDtl]);


  var circle_class = 'circleM';
  if(sizeClass=='Small') {
    circle_class = 'circleS';
  }else if(sizeClass=='Large') {
    circle_class = 'circleL';
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

  const colorPickStyle = {
    display: showColorPicker ? 'inline-block' : 'none',
  }

  const colorStyle = {
    background: pickerColor,
  }

  var select_size = 'is-normal';
  if(sizeClass=='Small') {
    select_size = 'is-small';
  }else if(sizeClass=='Large') {
    select_size = 'is-medium';
  }

  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    edit_close_size = '40px';
  }

  var titleStr = 'タグ'+modalData.titleName
  var titleCnt = '[登録数 : '+modalData.cnt+']';

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalCloseBefore}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={classNames("panel", "height100P")}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width10P")}>
                </td>
                <td className={classNames("width5P")}>&nbsp;</td>
                <td className={classNames("width2P")}>&nbsp;</td>
                <td className={"width68P"}>
                  <span className={classNames("titleMod"+sizeClass)}>
                    {titleStr}&nbsp;{titleCnt}
                  </span>
                </td>
                <td className={classNames("flexboxRight")} onClick={modalCloseBefore}>
                  <IconContext.Provider value={{ size: '26px', style: { cursor: 'pointer'} }}>
                    <AiOutlineCloseCircle />
                  </IconContext.Provider>
                </td>
              </tr>
            </table>
        </div>

        {/* リスト表示部分 */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>

            <div>
              <div>
                <span className={"labelFont"+sizeClass}>タグ名</span>
              </div>
              <div>
                <input
                  class="input"
                  className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
                  type="text"
                  placeholder='NEW NAME'
                  onChange={changeTagName}
                  value={inputTagName}
                />
              </div>
            
              <div>
                <div>
                  <span className={"labelFont"+sizeClass}>カラー</span>
                </div>
                <div>
                  <p className={classNames("pad0marR40", circle_class, "cursorPointer")} style={colorStyle} onClick={onClickColor}></p>
                  <span style={colorPickStyle}>
                    {pickerColor!='#dcdcdc' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "gainsboro")} onClick={() => onSelectColor('#dcdcdc')}></p> }
                    {pickerColor!='#cd853f' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "peru")} onClick={() => onSelectColor('#cd853f')}></p> }
                    {pickerColor!='#cd5c5c' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "indianred")} onClick={() => onSelectColor('#cd5c5c')}></p> }
                    {pickerColor!='#ff7f50' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "coral")} onClick={() => onSelectColor('#ff7f50')}></p> }
                    {pickerColor!='#ffb6c1' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "lightpink")} onClick={() => onSelectColor('#ffb6c1')}></p> }
                    {pickerColor!='#fffacd' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "lemonchiffon")} onClick={() => onSelectColor('#fffacd')}></p> }
                    {pickerColor!='#f0f8ff' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "aliceblue")} onClick={() => onSelectColor('#f0f8ff')}></p> }
                    {pickerColor!='#adff2f' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "greenyellow")} onClick={() => onSelectColor('#adff2f')}></p> }
                    {pickerColor!='#dda0dd' && <p className={classNames("pad0marR5", circle_class, "cursorPointer", "plum")} onClick={() => onSelectColor('#dda0dd')}></p> }

                  </span>
                </div>
              </div>

              <div>
                <span className={classNames("medText"+sizeClass, "cursorPointer")} onClick={onClickTagEditMarkerEdit}><b>マーカーの追加・削除</b></span>
              </div>

              <div className={classNames("width100P")}>
                <table className={"width100P"}>
                  <tr>
                    <td>

                    </td>
                    <td className={classNames("flexboxRight")}>
                      <button class="button is-primary" onClick={() => onClickUpdate()} disabled={isDisabled}>{modalData.execName}</button>
                    </td>
                  </tr>
                </table>
              </div>

            </div>

          </div>
        </div>

      </div>
      <LoaderUser isLoading={ loadingTagEditDtl } />
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



export default TagEditDtlModal;