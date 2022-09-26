import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';


const TagSelectModal = ({ showModal, modalOpen, modalClose, user, loadingTagSelect, setLoadingTagSelect, selectTagDatas, setSelectTagDatas, tagListData, setTagListData, sizeClass }) => {

  /* 変更前データ */
  const [defaultTagListData, setDefaultTagListData] = React.useState([{}]);
  /* 表示データ */
  const [tagListViewData, setTagListViewData] = React.useState([{}]);

  const [isCheckAll, setIsCheckAll] = React.useState(true);
  /* 表示用 */
  const [isDisabled, setIsDisabled] = React.useState(true);

  /* フォームデータ等を初期化 */
  const reNewData = () => {

    var isCheck = 0;
    if(selectTagDatas[0]) {
      var selectTagNo = [];
      selectTagDatas.map(tag => {
        selectTagNo.push(tag.tag_no);
      });
      var newTagListData = [];
      tagListData.map(tag => {
        if(selectTagNo.indexOf(tag.tag_no)!=-1) {
          tag.selected = 1;
          isCheck = 1;
        }else {
          tag.selected = 0;
        }
        newTagListData.push(tag);
      });
      setTagListData(newTagListData);

    }else {
      const newTagListData = tagListData.map(tag => {
        tag.selected = 0;
        return tag;
      });
      setTagListData(newTagListData);

    }
    if(isCheck==0) {
      setIsCheckAll(true);
    }else {
      setIsCheckAll(false);
    }
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    if(!loadingTagSelect) {
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
    setLoadingTagSelect(false);

    modalOpen();
  }

  /* 表示タグ変更 */
  const onClickUpdate = () => {

    const newSelectTagDatas = [];
    tagListData.map(tag => {
      if(tag.selected==1) {
        newSelectTagDatas.push({
          tag_no: tag.tag_no,
          tag_name: tag.tag_name
        });
      }
    });
    setSelectTagDatas(newSelectTagDatas);

    modalClose();
  }

  const onClickTabAll = () => {
    setIsCheckAll(true);
    const newTagListViewData = tagListViewData.map(tag => {
      tag.selected = 0;
      return tag;
    });
    setTagListViewData(newTagListViewData);
  }

  /* リストクリック */
  const onClickTab = item => {
    const newTagListViewData = tagListViewData.map(tag => {
      if(tag.tag_no==item.tag_no) {
        if(tag.selected!=1) {
          tag.selected = 1;
        }else {
          tag.selected = 0;
        }
      }
      return tag;
    });
    setTagListViewData(newTagListViewData);
    var isCheck = 0;
    newTagListViewData.map(tag => {
      if(tag.selected==1) {
        isCheck = 1;
      }
    });
    if(isCheck==0) {
      setIsCheckAll(true);
    }else {
      setIsCheckAll(false);
    }

  }

  useEffect(() => {
    const newTagListData = tagListData;
    setTagListViewData(newTagListData);
  }, [tagListData]);

  /* モーダルのスタイル */
  const modalStyle = {
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

  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    edit_close_size = '40px';
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

            {/* <TagList /> */}
            <div className={classNames("listBox", "cursorPointer")} onClick={() => onClickTabAll()}>
              <table className={"width100P"}>
                <tr>
                  <td className={"tabLabel"}>&nbsp;</td>
                  <td className={"width2P"}>&nbsp;</td>
                  <td className={"width97P"}>
                    <table className={"width100P"}>
                      <tr>
                        <td className={classNames("width75P")}>
                          <span className={classNames("title"+sizeClass, "pad0marR20")}><b>{'全て'}</b></span>
                        </td>
                        <td align="right" className={classNames("width25P")}>
                          <span className={classNames("pad0marR20")}>
                            {isCheckAll &&
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
            {/* タグリスト */}
            {tagListViewData.map(item => (
              <TagList
                key={item}
                item={item}
                onClickTab={onClickTab}
                sizeClass={sizeClass}
              />
            ))}





            <div className={classNames("width100P")} align="right">
              <button class="button is-primary" onClick={onClickUpdate}>{'変更'}</button>
            </div>

          </div>
        </div>

      </div>
      <LoaderUser isLoading={ loadingTagSelect } />
    </ReactModal>
  );
}

function TagList({ item, onClickTab, sizeClass }) {

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

  /* リストのラベルカラー */
  const labelColor = {
    background: '#'+item.color,
  }

  return (
    <div className={classNames("listBox", "cursorPointer")} onClick={() => onClickTab(item)}>
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
                    {item.selected==1 &&
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



export default TagSelectModal;