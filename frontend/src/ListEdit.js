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
function Todo({ array }) {

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

  const history = useHistory();

  /* 戻るで返却する用のデータ */
  const [datas, setDatas] = React.useState([]);
  /* DB登録データ */
  const [apiDatas, setApiDatas] = React.useState(new Map());


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
    /* 削除処理 */
    if(apiDatas.action==='delete') {
      /* モーダル閉じる */
      setShowModal(false);
      mainDelete();
    /* 保存処理 */
    }else if(apiDatas.action==='save') {
      /* モーダル閉じる */
      setShowModal(false);
      execSave('save', '');
    /* 更新処理 */
    }else if(apiDatas.action==='update') {
      /* 入力欄の空文字はエラー */
      if(apiDatas.name.trim()==='') {
        alert('New Group Name is empty');
      }else {
        /* モーダル閉じる */
        setShowModal(false);
        execMainUpd();
      }
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
  const showSaveModal = () => {
    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'save';
    setApiDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = '並び順保存';
    modalData.text = '並び順を保存します、よろしいですか？';
    modalData.execName = '保存';
    modalData.model = 'simple';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* リストデータを送信 */
  const execSave = (action, name) => {
    /* 保存ボタンを無効 */
    setUpdDisabled(true);
    /* ローディング表示 */
    setLoading(true);

    fetch('/update_main_sort', {
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
            if(action==='save') {
              /* ソートを採番し直したデータを返却用のデータにセット */
              setDatas(items);
              /* ローディング非表示 */
              setLoading(false);
            }else if(action==='insert_main') {
              /* 登録 */
              execInsertMain(name);
            }
          }
        }
      );
  }

  /* ダイアログのinput変更時のイベント */
  const changeDatas = text => {
    const data = new Map();
    data.action = apiDatas.action;
    data.no = apiDatas.no;
    data.name = text;
    setApiDatas(data);
  }

  /* リスト名編集確認ダイアログ */
  const showUpdModal = (no, text) => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'update';
    data.no = no;
    data.name = '';
    setApiDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'グループ名称変更';
    modalData.text = 'グループ名を入力して下さい';
    modalData.execName = '変更';
    modalData.phName = text;
    modalData.model = 'input';
    setModalDatas(modalData);
    setShowModal(true);
  }


  /* 削除確認ダイアログ */
  const showDelModal = no => {
    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'delete';
    data.no = no;
    setApiDatas(data);
    /* モーダル情報をセット */
    var hed_name = '';
    items.map(item => {
      if(no === item.group_no) {
        hed_name = item.name;
      }
    });
    const modalData = new Map();
    modalData.title = 'グループ削除['+hed_name+']';
    modalData.text = 'グループを削除します、よろしいですか？';
    modalData.execName = '削除';
    modalData.model = 'simple';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* inputタブでEnterを押した時の処理 */
  const handleAdd = text => {

    if(text.trim()==='') {
      alert('Group Name is empty');
      return;
    }

    /* ローディング表示 */
    setLoading(true);

    /* 先に並び順の保存を実行 */
    if(!updDisabled) {
      execSave('insert_main', text);
    }else {
      execInsertMain(text);
    }
  };

  /* 追加処理 */
  const execInsertMain = text => {

    var insert_sort = 1;
    var insert_no = 1;

    if(items.length > 0) {
      items.map(item => {
        if(insert_no <= item.group_no) {
          insert_no = parseInt(item.group_no)+1;
        }
        if(insert_sort <= item.sort) {
          insert_sort = parseInt(item.sort)+1;
        }
      });
    }

    fetch('/insert_main?group_no='+insert_no+'&name='+text+'&sort='+insert_sort)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
          setItems([...items, { key: insert_no, group_no: insert_no, name: text, cnt: 0, sort: insert_sort }]);
          setDatas([...items, { key: insert_no, group_no: insert_no, name: text, cnt: 0, sort: insert_sort }]);
          }else {
            alert('insert failed');
          }
          /* ローディング非表示 */
          setLoading(false);
        }
      );

  };

  /* リスト名変更処理 */
  const execMainUpd = () => {
    const newItems = items.map(item => {
      if (item.group_no === apiDatas.no) {
        item.name = apiDatas.name;
      }
      return item;
    });
    setItems(newItems);

    fetch('/update_main_name?group_no='+apiDatas.no+'&name='+apiDatas.name)
      .then((res) => res.json())
      .then(
        (data) => {
          /* 更新失敗時 */
          if(!data.result===1) {
            alert('update failed');
            window.location.reload();
          }
        }
      );
  }

  /* 削除処理(DB) */
  const mainDelete = () => {
    const no = apiDatas.no;

    /* ローディング表示 */
    setLoading(true);

    fetch('/delete_main?group_no='+no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
          mainDelData(no);
          }else {
            alert('delete failed');
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );
  }

  /* 削除処理(画面) */
  const mainDelData = (no) => {

    var i = -1;
    var index = -1;
    /* 削除する行のindexを取得 */
    items.map(item => {
      i++;
      if (item.group_no === no) {
        index = i;
      }
    });
    /* newItemsのindex行を削除してsetItemsする(itemsをspliceしてsetItemsするのはダメ) */
    const newItems = [...items];
    newItems.splice(index,1);

    setItems(newItems);
    /* 戻る用のデータも更新 */
    setDatas(newItems);
    setLoading(false);
  }

  /* 戻る */
  const goBack = () => {
    history.push({ pathname: '/', state: { data: datas }});
  }

  /* 初期表示時の処理 */
  useEffect(() =>{
    /* 戻るの返却用データ(保存実行時のみ書き換える) */
    setDatas(array);
    setItems(array);
  },[array]);

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
           ToDo List 追加・編集
        </div>
        {/* テキスト入力欄 */}
        <Input onAdd={handleAdd} isLoading={ loading } />
        {/* ドラッグ＆ドロップ出来るメイン表示 */}
        <MainList
          items={items}
          onDrop={onDrop}
          isLoading={loading}
          mainUpdate={showUpdModal}
          mainDelete={showDelModal}
        />
        {/* ローディング中に表示させる用 */}
        <SubList
          items={items}
          isLoading={loading}
        />
        {/* フッター */}
        <Footer
          items={items}
          onClickUpd={showSaveModal}
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
function MainList({ items, onDrop, isLoading, mainUpdate, mainDelete }) {

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
          <Draggable key={item.group_no}>
            <TodoItem
              key={item.group_no}
              item={item}
              isMain={true}
              mainUpdate={mainUpdate}
              mainDelete={mainDelete}
            />
          </Draggable>
        ))}
      </Container>
    </div>
  );
}

/* サブのリスト */
function SubList({ items, isLoading, mainUpdate, mainDelete }) {

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
          key={item.group_no}
          item={item}
          isMain={false}
          mainUpdate={mainUpdate}
          mainDelete={mainDelete}
        />
      ))}
    </div>
  );
}

/* リスト中身 */
function TodoItem({ item, isMain, mainUpdate, mainDelete }) {

  const onClickUpdate = () => {
    mainUpdate(item.group_no, item.name);
  }

  const onClickDelete = () => {
    mainDelete(item.group_no);
  }

  const onListClick = e => {
    /* リスト内の要素をクリックした時は動かさない */
    if(e.target.id==='list_div') {
      /* リスト内の要素のイベントは動かさない */
      e.preventDefault();
    }
  }

  const noClickEvent = e => {
    /* リスト内の要素のイベントは動かさない */
    e.preventDefault();
  }

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

  const style1 = {
    padding: 5,
    margin: 0,
  }

  const style2 = {
    padding: 5,
    margin: 0,
    borderBottom: border_bottom(),
  }

  return (
    <label class="panel-block columns" style={ style }>
      <div id="list_div" class="column is-10" onClick={onListClick} style={ style2 }>
        <span>
          {item.name} [{item.cnt}]
        </span>
      </div>
      <div class="column is-2" onClick={noClickEvent} style={ style2 }>
        <span style={ style1 }>
          <button onClick={onClickUpdate}>編集</button>
        </span>
        <span style={ style1 }>
          <button onClick={onClickDelete}>削除</button>
        </span>
      </div>
    </label>
  );
}

/* inputタグ */
function Input({ onAdd, isLoading }) {
  const [text, setText] = React.useState('');

  const handleChange = e => setText(e.target.value);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onAdd(text);
      setText('');
    }
  };

  return (
    <div class="panel-block">
      <input
        class="input"
        type="text"
        placeholder="Enter to add"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
    </div>
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
      </span>
      <span class="column is-2" align="center" style={style2}>
        <button onClick={onClickUpd} disabled={disabled}>並び順保存</button>
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
  const [array, setArray] = useState([{}]);

  useEffect(() =>{
    setArray(location.state.data);
  },[])

  return (
      <div className="container is-fluid">
        <Todo array={ array }/>
      </div>
  );
}

export default HedSort;
