import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';


const MarkerTagModal = ({ showModal, modalOpen, modalClose, modalData, tagData, tagUpdateData, setTagUpdateData, tagCheck, setTagCheck, tagListData, setTagListData, user, loadingMarkerTag, setLoadingMarkerTag, sizeClass, setMarkerTagViewDatas }) => {

  /* タグ表示用 */
  const [tagViewData, setTagViewData] = React.useState([{}]);
  /* 表示用 */
  const [isDisabled, setIsDisabled] = React.useState(true);


  /* フォームデータ等を初期化 */
  const reNewData = () => {

    const newTagListData = tagListData.map(item => {
      if(tagCheck.indexOf(item.tag_no)!=-1) {
        item.tag_check = '1';
      }else {
        item.tag_check = '0';
      }
      return item;
    });
    setTagListData(newTagListData);

    setIsDisabled(true);
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {

    if(!loadingMarkerTag) {
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
    setIsDisabled(true);
    setLoadingMarkerTag(false);
    modalOpen();
  }

  /* 表示タグ変更 */
  const onClickUpdate = () => {

    /* Update処理用のtagUpdateDataを更新 */
    var newTagData = [];
    tagData.map(item => {
      if(item.marker_no!=modalData.marker_no) {
        newTagData.push(item);
      }
    });
    var newMarkerTagViewDatas = [];
    tagListData.map(item => {
      if(item.tag_check=='1') {
        newTagData.push({
          marker_no: modalData.marker_no,
          tag_no: item.tag_no,
          tag_name: item.tag_name,
          color: item.color
        });
        newMarkerTagViewDatas.push({
          marker_no: modalData.marker_no,
          tag_no: item.tag_no,
          tag_name: item.tag_name,
          color: item.color
        });
      }
    });
    setTagUpdateData(newTagData);
    /* マーカーモーダルの表示タグを更新 */
    setMarkerTagViewDatas(newMarkerTagViewDatas);
    modalClose();
  }

  /* リストクリック */
  const onClickTab = no => {
    setIsDisabled(false);

    const newTagListData = tagListData.map(item => {
      if(item.tag_no==no) {
        if(item.tag_check=='1') {
          item.tag_check = '0';
        }else {
          item.tag_check = '1';
        }
      }
      return item;
    });
    setTagListData(newTagListData);

  }

  useEffect(() => {

    const newTagListData = tagListData.map(item => {
      if(tagCheck.indexOf(item.tag_no)!=-1) {
        item.tag_check = '1';
      }else {
        item.tag_check = '0';
      }
      return item;
    });
    setTagListData(newTagListData);

  }, [tagCheck]);

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



  var select_size = 'is-normal';
  if(sizeClass=='Small') {
    select_size = 'is-small';
  }else if(sizeClass=='Large') {
    select_size = 'is-medium';
  }



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
                <td className={classNames("width2P")}>&nbsp;</td>
                <td className={"width78P"}>
                  <span className={classNames("titleMod"+sizeClass)}>
                    表示タグ選択
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

            {/* タグリスト */}
            {modalData.list_cnt>0 &&
              <div>
                {tagListData.map(item => (
                  <TagList
                    key={item}
                    item={item}
                    onClickTab={onClickTab}
                    sizeClass={sizeClass}
                  />
                ))}
              </div>
            }

            <div className={classNames("width100P")} align="right">
              <button class="button is-primary" onClick={onClickUpdate} disabled={isDisabled}>{'決定'}</button>
            </div>

          </div>
        </div>

      </div>
      <LoaderUser isLoading={ loadingMarkerTag } />
    </ReactModal>
  );
}

/* タグリスト */
function TagList({ item, onClickTab, sizeClass }) {

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
    <div className={classNames("listBox", "cursorPointer")} onClick={() => onClickTab(item.tag_no)}>
      <table className={"width100P"}>
        <tr>
          <td style={labelColor} className={"tabLabel"}>&nbsp;</td>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width75P")}>
                  <span className={classNames("title"+sizeClass, "pad0marR20")}><b>{item.tag_name}</b></span>
                </td>
                <td align="right" className={classNames("width25P")}>
                  <span className={classNames("pad0marR20")}>
                    {item.tag_check=='1' &&
                      <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                        <AiOutlineCheck />
                      </IconContext.Provider>
                    }
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



export default MarkerTagModal;