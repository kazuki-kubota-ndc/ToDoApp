import './common.css';
import React,{ useState,useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';
import classNames from 'classnames';
import { arrayMoveImmutable } from 'array-move';
import ReactModal from 'react-modal';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';

/* リスト表示 */
function Todo({ userData, array, listArray, mainArray }) {

  /* ユーザーデータ */
  const [user, setUser] = React.useState({});
  /* 表示サイズ */
  const [sizeClass, setSizeClass] = React.useState('Med');
  /* リストNo,リスト名,カラー */
  const [listDatas, setListDatas] = React.useState({});
  /* リストデータ */
  const [items, setItems] = React.useState([]);
  /* 保存ボタンのdisabled */
  const [updDisabled, setUpdDisabled] = React.useState(true);
  /* ダイアログ(OK/CANCEL)の開閉ステータス */
  const [showModal, setShowModal] = React.useState(false);
  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(false);
  /* ダイアログのテキスト名 */
  const [modalDatas, setModalDatas] = React.useState(new Map());
  /* メイングループデータ */
  const [mainDatas, setMainDatas] = React.useState([]);

  const history = useHistory();

  /* 戻るで返却する用のデータ */
  const [datas, setDatas] = React.useState([]);

  const onClickLogout = () => {
    history.push({ pathname: '/' });
  }

  /* モーダルを開いた時の処理 */
  const modalOpen = () => {

  }

  /* モーダルを閉めた時の処理 */
  const modalClose = () => {
    setShowModal(false);
  }

  /* モーダルOKボタンの処理 */
  const modalOk = () => {

    /* 更新処理 */
    if(modalDatas.action==='update') {
      /* モーダル閉じる */
      setShowModal(false);
      execUpdate();
    }

  }

  /* リストをドラッグ＆ドロップした時のイベント */
  const onDrop = ({ removedIndex, addedIndex }) => {

    /* リストデータを入れ替え */
    const sortItems = arrayMoveImmutable(items, removedIndex, addedIndex);
    /* 入れ替えたリストのsortを変更する */
    const newItems = sortItems.map((item, idx) => {
      item.sort = idx+1;
      return item;
    });
    /* itemsを更新 */
    setItems(newItems);
    /* 保存ボタンを有効 */
    setUpdDisabled(false);

  };

  /* 保存確認ダイアログ */
  const showUpdModal = () => {

    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = '並び順保存';
    modalData.text = '並び順を保存します、よろしいですか？';
    modalData.execName = '保存';
    modalData.model = 'simple';
    modalData.action = 'update';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* リストデータを送信 */
  const execUpdate = () => {
    /* 保存ボタンを無効 */
    setUpdDisabled(true);
    /* ローディング表示 */
    setLoading(true);

    const newItems = items.map(item => {
      item.user_id = user.user_id;
      return item;
    });

    fetch('/upd_hed_sort', {
      method : 'POST',
      body : JSON.stringify(newItems),
      headers : new Headers({ 'Content-type' : 'application/json' })
    }).then((res) => res.json())
      .then(
        (data) => {
          if(!data.result===1) {
            alert('sort failed');
            history.push('/');
          }else {
            /* ソートを採番し直したデータを返却用のデータにセット */
            setDatas(items);
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );
  }

  /* ダイアログのinput変更時のイベント */
  const changeDatas = text => {

  }

  /* 戻る */
  const goBack = () => {
    history.push({ pathname: '/ListMain', state: { user: user, data: datas, listData: listDatas, mainData: mainDatas }});
  }

  useEffect(() => {
    setUser(userData);
    var font = 'Med';
    if(userData.o_font==0) {
      font = 'Small';
    }else if(userData.o_font==1) {
      font = 'Med';
    }else if(userData.o_font==2) {
      font = 'Large';
    }
    setSizeClass(font);
  }, [userData]);

  /* 初期表示時の処理 */
  useEffect(() =>{
    /* 戻るの返却用データ(保存実行時のみ書き換える) */
    setDatas(array);
    setItems(array);
  },[array]);

  useEffect(() =>{
    setListDatas(listArray);
  },[listArray]);

  useEffect(() =>{
    setMainDatas(mainArray);
  },[mainArray]);

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  const panelHedStyle = {
    background: '#'+listDatas.color,
  }

  return (
    <div>
      <Loader isLoading={ loading } />
      <ReactModal
        isOpen={showModal}
        onAfterOpen={modalOpen}
        onRequestClose={modalClose}
        style={modalStyle}
        contentLabel="Settings"
      >
        <ModalInside
          items={items}
          modalData={modalDatas}
          onChangeInput={changeDatas}
          onClickOk={modalOk}
          onClickClose={modalClose}
          listDatas={listDatas}
          sizeClass={sizeClass}
        />
      </ReactModal>
      <div className="panel">
        {/* ヘッダー */}
        <div className={"panel-heading"} style={panelHedStyle}>
          { listDatas &&
            <div className={classNames("panel-block", "pad0mar0")}>
              <span className={classNames("column", "is-10", "pad0mar0", "title"+sizeClass)}>
                [{ listDatas.name }] 並び順変更
              </span>
              <span className={classNames("column", "is-2", "pad0mar0")} align="center">
                <button onClick={onClickLogout}><span className={"medBtnFont"+sizeClass}>ログアウト</span></button>
              </span>
            </div>
          }
        </div>
        {/* ドラッグ＆ドロップ出来るメイン表示 */}
        <MainList
          items={items}
          onDrop={onDrop}
          isLoading={loading}
          sizeClass={sizeClass}
        />
        {/* ローディング中に表示させる用 */}
        <SubList
          items={items}
          isLoading={loading}
          sizeClass={sizeClass}
        />
        {/* フッター */}
        <Footer
          items={items}
          onClickUpd={showUpdModal}
          disabled={updDisabled}
          onClickBack={goBack}
          isLoading={loading}
          sizeClass={sizeClass}
        />
      </div>
    </div>
  );
}

/* ローディング表示 */
function Loader({ isLoading }) {

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
        <i className="fas fa-spinner fa-spin fa-5x"></i>
      </div>
    );
  } else{
    return null;
  }
}

/* 確認ダイアログの中身 */
function ModalInside({ items, modalData, onChangeInput, onClickOk, onClickClose, listDatas, sizeClass }) {
  const model = modalData.model;

  const inputChange = e => {
    onChangeInput(e.target.value);
  }

  const panelHedStyle = {
    background: '#'+listDatas.color,
  }

  if(model==='simple') {
    return (
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)} style={panelHedStyle}>
           {modalData.title}
        </div>
        {/* メイン */}
        <div className={"mar20"}>
          <span className={"medText"+sizeClass}>{modalData.text}</span>
        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass)} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass)} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='input') {
    return (
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)} style={panelHedStyle}>
           {modalData.title}
        </div>
        {/* メイン */}
        <div className={"mar20"}>
          <div>
            <span className={"medText"+sizeClass}>{modalData.text}</span>
          </div>
          <div>
            <input
              class="input"
              type="text"
              placeholder={modalData.phName}
              onChange={inputChange}
            />
          </div>
        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass)} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={classNames("largeBtnFont"+sizeClass)} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
    );
  }
}

/* メインのリスト */
function MainList({items, onDrop, isLoading, sizeClass }) {

  /* ローディング画面表示中は表示しない */
  const disp = () => {
    if(isLoading) {
      return 'none'
    }else {
      return 'block'
    }
  }

  const style = {
    display: disp(),
    margin: 0,
  };

  return (
    <div style={style}>
      <Container onDrop={onDrop}>
        {items.map(item => (
          <Draggable key={item.key}>
            <TodoItem
              key={item.key}
              item={item}
              isMain={true}
              sizeClass={sizeClass}
            />
          </Draggable>
        ))}
      </Container>
    </div>
  );
}

/* サブのリスト */
function SubList({items, isLoading, sizeClass }) {

  /* ローディング画面表示中のみ表示する */
  const disp = isLoading => {
    if(isLoading) {
      return 'block';
    }else {
      return 'none';
    }
  }

  const style = {
    display: disp(isLoading),
    margin: 0,
  };

  return (
    <div style={style}>
      {items.map(item => (
        <TodoItem
          key={item.key}
          item={item}
          isMain={false}
          sizeClass={sizeClass}
        />
      ))}
    </div>
  );
}

/* リスト中身 */
function TodoItem({ item, isMain, sizeClass }) {

  const border_bottom = () => {
    if(isMain) {
      return "solid 1px #dcdcdc";
    }else {
      return "";
    }
  }

  const style = {
    padding: 0,
    margin: 0,
  };

  const style2 = {
    padding: 5,
    margin: 0,
    borderBottom: border_bottom(),
  }

  return (
    <label className={classNames("columns", "panel-block")} style={ style }>
        <div className={classNames("column", "is-12")} style={ style2 }>
          <div className={"columns"}>
            <div className={classNames("column", "is-3")}>
              <input
                type="checkbox"
                checked={item.done}
                readonly
              />
              <span
                className={classNames({
                  'has-text-grey-light': item.done
                }, "medText"+sizeClass)}
              >
                {item.text}
              </span>
            </div>
            <div className={classNames("column", "is-9")}>
              <span className={"medText"+sizeClass}>
                [ {item.shimebi} ]
              </span>
            </div>
          </div>
        </div>
    </label>
  );
}

/* フッター */
function Footer({ items, onClickUpd, disabled, onClickBack, isLoading, sizeClass }) {

  const border_top = () => {
    if(isLoading) {
      return "solid 1px #dcdcdc";
    }else {
      return "";
    }
  }

  const style = {
    borderTop: border_top(),
  };

  return (
    <div className={classNames("panel-block", "pad0mar0")} style={style}>
      <span className={classNames("column", "is-8", "pad5mar0", "medText"+sizeClass)}>
        全 {items.length} 件
      </span>
      <span className={classNames("column", "is-2", "pad5mar0")} align="center">
        <button onClick={onClickUpd} disabled={disabled}><span className={"medBtnFont"+sizeClass}>保存</span></button>
      </span>
      <span className={classNames("column", "is-2", "pad5mar0")} align="center">
        <button onClick={onClickBack}><span className={"medBtnFont"+sizeClass}>戻る</span></button>
      </span>
    </div>
  );
}

/* 初期処理 */
function HedSort() {
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [array, setArray] = useState([{}]);
  const [listArray, setListArray] = useState({});
  const [mainArray, setMainArray] = useState([{}]);

  const history = useHistory();

  useEffect(() =>{
    var user_flg = false;
    /* ユーザーデータ確認 */
    if(location.state!=null) {
      if(location.state.user!=null) {
        user_flg = true;
      }
    }
    if(!user_flg) {
      history.push({ pathname: '/' });
    }else {
      setUserData(location.state.user);

      setListArray(location.state.listData);
      setArray(location.state.data);
      setMainArray(location.state.mainData);
    }
  },[])

  return (
      <div className="container is-fluid">
        <Todo userData={ userData } array={ array } listArray={ listArray } mainArray={ mainArray }/>
      </div>
  );
}

export default HedSort;
