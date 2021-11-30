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
function Todo({ array, listArray, title, no, motoItems, mainArray }) {

  /* リストNoとタイトル */
  const [listDatas, setListDatas] = React.useState({});
  /* 親リストタイトル */
  const [oyaTitle, setOyaTitle] = React.useState('');
  /* 親リストNO */
  const [oyaNo, setOyaNo] = React.useState();
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

    /* itemsにnoをセット */
    const newItems = items.map( item => {
      item.no = oyaNo;
      return item;
    });

    fetch('/upd_dtl_sort', {
      method : 'POST',
      body : JSON.stringify(items),
      headers : new Headers({ 'Content-type' : 'application/json' })
    }).then((res) => res.json())
      .then(
        (data) => {
          if(!data.result===1) {
            alert('sort failed');
            history.push('/');
          }else {
            /* ソートを採番し直したデータを返却用のデータにセット */
            const newMotoItems = motoItems.map( item => {
              if(item.no==no) {
                item.dtl = items;
              }
              return item;
            });
            setDatas(newMotoItems);
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
    history.push({ pathname: '/ListMain', state: { data: datas, listData: listDatas, mainData: mainDatas }});
  }

  /* 初期表示時の処理 */
  useEffect(() =>{
    /* 戻るの返却用データ(保存実行時のみ書き換える) */
    setDatas(motoItems);
    setOyaTitle(title);
    setOyaNo(no);
    setItems(array);
  },[array]);

  useEffect(() =>{
    setListDatas(listArray);
  },[listArray]);

  useEffect(() =>{
    setMainDatas(mainArray);
  },[mainArray]);

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
        />
      </ReactModal>
      <div className="panel">
        {/* ヘッダー */}
        <div className="panel-heading">
           [{ oyaTitle }] 並び順変更
        </div>
        {/* ドラッグ＆ドロップ出来るメイン表示 */}
        <MainList
          items={items}
          onDrop={onDrop}
          isLoading={loading}
        />
        {/* ローディング中に表示させる用 */}
        <SubList
          items={items}
          isLoading={loading}
        />
        {/* フッター */}
        <Footer
          items={items}
          onClickUpd={showUpdModal}
          disabled={updDisabled}
          onClickBack={goBack}
          isLoading={loading}
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
function ModalInside({ items, modalData, onChangeInput, onClickOk, onClickClose }) {
  const model = modalData.model;

  const inputChange = e => {
    onChangeInput(e.target.value);
  }

  const modalTextStyle ={
    margin: 20,
  }

  const buttonStyle = {
    fontSize: '20px',
  }

  const footerStyle = {
    padding: 0,
    marginBottom: 10,
  }

  if(model==='simple') {
    return (
      <div className="panel">
        {/* ヘッダー */}
        <div className="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <span>{modalData.text}</span>
        </div>
        {/* フッター */}
        <div className="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='input') {
    return (
      <div className="panel">
        {/* ヘッダー */}
        <div className="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <div>
            <span>{modalData.text}</span>
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
        <div className="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }
}

/* メインのリスト */
function MainList({items, onDrop, isLoading}) {

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
            />
          </Draggable>
        ))}
      </Container>
    </div>
  );
}

/* サブのリスト */
function SubList({items, isLoading}) {

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
        />
      ))}
    </div>
  );
}

/* リスト中身 */
function TodoItem({ item, isMain }) {

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
    <label class="columns" className="panel-block" style={ style }>
        <div class="column is-12" style={ style2 }>
          <span
            className={classNames({
              'has-text-grey-light': item.done
            })}
          >
            {item.name}
          </span>
        </div>
    </label>
  );
}

/* フッター */
function Footer({ items, onClickUpd, disabled, onClickBack, isLoading }) {

  const border_top = () => {
    if(isLoading) {
      return "solid 1px #dcdcdc";
    }else {
      return "";
    }
  }

  const style = {
    padding: 0,
    margin: 0,
    borderTop: border_top(),
  };

  const style2 = {
    padding: 5,
    margin: 0,
  }

  return (
    <div className="panel-block" style={style}>
      <span class="column is-8" style={style2}>
        全 {items.length} 件
      </span>
      <span class="column is-2" align="center" style={style2}>
        <button onClick={onClickUpd} disabled={disabled}>保存</button>
      </span>
      <span class="column is-2" align="center" style={style2}>
        <button onClick={onClickBack}>戻る</button>
      </span>
    </div>
  );
}

/* 初期処理 */
function HedSort() {
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [no, setNo] = useState();
  const [listArray, setListArray] = useState({});
  const [array, setArray] = useState([{}]);
  const [items, setItems] = useState([{}]);
  const [mainArray, setMainArray] = useState([{}]);

  useEffect(() =>{
    setTitle(location.state.title);
    setNo(location.state.no);
    setItems(location.state.items);
    setArray(location.state.data);
    setListArray(location.state.listData);
    setMainArray(location.state.mainData);
  },[])

  return (
      <div className="container is-fluid">
        <Todo array={ array } listArray={ listArray } title={ title } no={ no } motoItems={ items } mainArray={ mainArray }/>
      </div>
  );
}

export default HedSort;
