import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineAdd } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const UserEditModal = ({ showModal, modalOpen, modalClose, userItems, setUserItems, user, setUser, setShowAddUser, addUserData, setAddUserData, setCenterData, setShowCenter, loadingUserEdit, setLoadingUserEdit, sizeClass }) => {

  /* モーダル閉じる */
  const closeModal = () => {
    modalClose();
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {

    setLoadingUserEdit(true);

    /* ユーザーマスタ検索 */
      /* list_data */
      fetch('/select_user')
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              setUserItems(data.data);
            }
            setLoadingUserEdit(false);
          }
        );

    modalOpen();
  }

  /* ユーザー追加クリック */
  const onClickAddUserBtn = () => {
    const newAddUserData = new Map();
    newAddUserData.action = 'insert';
    newAddUserData.execName = '追加';
    setAddUserData(newAddUserData);
    setShowAddUser(true);
  }

  /* ユーザー編集クリック */
  const onClickEditUserBtn = userData => {
    const newAddUserData = new Map();
    newAddUserData.action = 'update';
    newAddUserData.execName = '変更';
    newAddUserData.user_id = userData.user_id;
    newAddUserData.login_id = userData.login_id;
    newAddUserData.user_name = userData.user_name;
    newAddUserData.admin = userData.admin;
    newAddUserData.font_size = userData.font_size;
    setAddUserData(newAddUserData);
    setShowAddUser(true);

  }

  /* ユーザー削除クリック */
  const onClickDelUserBtn = (user_id, login_id, user_name) => {

    const newCenterData = new Map();
    newCenterData.action = 'user_delete';
    newCenterData.user_id = user_id;
    newCenterData.title = 'ユーザー削除[ '+login_id+'/'+user_name+' ]';
    newCenterData.text = 'ユーザーを削除します。よろしいですか？';
    newCenterData.execName = '削除';
    setCenterData(newCenterData);
    setShowCenter(true);
  }

  var menu_size = '26px';
  var add_size = '20px';
  var edit_size = '18px';
  var delete_size = '20px';
  if(sizeClass=='Small') {
    menu_size = '22px';
    add_size = '16px';
    edit_size = '16px';
    delete_size = '18px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
    add_size = '28px';
    edit_size = '26px';
    delete_size = '28px';
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

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={closeModal}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
          <table className={"width100P"}>
            <tr>
              <td className={classNames("width10P")}>
                <span onClick={closeModal}>
                  <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                    <BiArrowBack />
                  </IconContext.Provider>
                </span>
              </td>
              <td className={"width90P"}>
                <span className={classNames("titleMod"+sizeClass)}>
                  ユーザー管理
                </span>
              </td>
            </tr>
          </table>
        </div>
        {/* メイン */}
        <div>
          <table className={classNames("table", "is-striped", "width96P", "pad0marT10L2P")}>
            <thead>
              <tr>
                <th className={classNames("width30P")}><span className={"medText"+sizeClass}>ユーザーID</span></th>
                <th className={classNames("width30P")}><span className={"medText"+sizeClass}>ユーザー名</span></th>
                <th className={classNames("width14P")}><span className={"medText"+sizeClass}>権限</span></th>
                <th className={classNames("width14P")}><span className={"medText"+sizeClass}>文字サイズ</span></th>
                <th className={classNames("width6P")}><span></span></th>
                <th className={classNames("width6P")}><span></span></th>
              </tr>
            </thead>
            <tbody>
              {userItems.map(item =>(
                <tr>
                  <td><span className={"tableCel"+sizeClass}>{item.login_id}</span></td>
                  <td><span className={"tableCel"+sizeClass}>{item.user_name}</span></td>
                  <td>
                    <span className={"tableCel"+sizeClass}>
                      {
                        (() => {
                          if(item.admin=='1'){
                            return '管理者';
                          }else {
                            return 'ユーザー';
                          }
                        })()
                      }
                    </span>
                  </td>
                  <td>
                    <span className={classNames("textCenter", "tableCel"+sizeClass)}>
                      {
                        (() => {
                          if(item.font_size=='0'){
                            return '小';
                          }else if(item.font_size=='2'){
                            return '大';
                          }else {
                            return '中';
                          }
                        })()
                      }
                    </span>
                  </td>
                  <td>
                    <span className={"pad0marR10"} onClick={() => onClickEditUserBtn(item)}>
                      <IconContext.Provider value={{ size: edit_size, style: { cursor: 'pointer'} }}>
                        <FiEdit />
                      </IconContext.Provider>
                    </span>
                  </td>
                  <td>
                    {item.admin!=1 &&
                      <span onClick={() => onClickDelUserBtn(item.user_id, item.login_id, item.user_name)}>
                        <IconContext.Provider value={{ size: delete_size, style: { cursor: 'pointer'} }}>
                          <AiOutlineCloseCircle />
                        </IconContext.Provider>
                      </span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={classNames("addUser")}>
          <span onClick={() => onClickAddUserBtn()} className={"cursorPointer"}>
            <IconContext.Provider value={{ size: add_size }}>
              <MdOutlineAdd />
            </IconContext.Provider>
          </span>
          <span onClick={() => onClickAddUserBtn()} className={classNames("cursorPointer", "medText"+sizeClass)}><b>ユーザー追加</b></span>
        </div>

      </div>
      <LoaderUserEdit isLoading={ loadingUserEdit } />
    </ReactModal>
  );
}

/* ローディング表示 */
function LoaderUserEdit({ isLoading }) {

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

export default UserEditModal;