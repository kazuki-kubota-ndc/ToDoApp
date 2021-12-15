import React,{ useState,useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';


/* リスト表示 */
function Todo({ array }) {

  /* リストデータ */
  const [items, setItems] = React.useState([]);
  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(true);
  /* ダイアログ(OK/CANCEL)の開閉ステータス */
  const [showModal, setShowModal] = React.useState(false);
  /* ダイアログのテキスト名 */
  const [modalDatas, setModalDatas] = React.useState(new Map());
  /* 追加ボタンの表示 */
  const [showAdd, setShowAdd] = React.useState(false);
  /* ユーザー追加用データ */
  const [datas, setDatas] = React.useState(new Map());

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

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
    setLoading(false);
  }

  /* モーダルOKボタンの処理 */
  const modalOk = () => {
    /* ユーザー編集 */
    if(datas.action==='update') {
      if(datas.login_id.trim()==='') {
        alert('ユーザーIDを入力して下さい。');
        return;
      }else if(datas.pass.trim()==='') {
        alert('パスワードを入力して下さい。');
        return;
      }
      /* モーダル閉じる */
      setShowModal(false);
      updUser();
    /* ユーザー追加 */
    }else if(datas.action==='add') {
      if(datas.login_id.trim()==='') {
        alert('ユーザーIDを入力して下さい。');
        return;
      }else if(datas.pass.trim()==='') {
        alert('パスワードを入力して下さい。');
        return;
      }
      /* モーダル閉じる */
      setShowModal(false);
      addUser();
    /* ユーザー削除 */
    }else if(datas.action==='delete') {
      /* モーダル閉じる */
      setShowModal(false);
      deleteUser();
    }
  }

  /* ユーザー編集ダイアログ */
  const showUpdModal = user_id => {

    setLoading(true);

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'update';
    data.user_id = user_id;

    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'ユーザー編集';
    modalData.text = 'ユーザー情報を入力して下さい。';
    modalData.execName = '編集';
    modalData.model = 'update';

    items.map(item => {
      if(item.user_id==user_id){
        data.login_id = item.login_id;
        data.user_name = item.user_name;
        data.pass = item.o_pass;
        data.admin = item.o_admin;
        data.font = item.o_font;
        modalData.login_id = item.login_id;
        modalData.user_name = item.user_name;
        modalData.pass = '******';
        modalData.admin = item.o_admin;
        modalData.font = item.o_font;
      }
    });

    setDatas(data);
    setModalDatas(modalData);
    setShowModal(true);

  }

  /* ユーザー追加ダイアログ */
  const showAddModal = () => {

    setLoading(true);

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'add';
    data.login_id = '';
    data.pass = '';
    data.admin = '0';
    data.font = '1';
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'ユーザー追加';
    modalData.text = 'ユーザー情報を入力して下さい。';
    modalData.execName = '追加';
    modalData.phId = 'USER_ID';
    modalData.phPass = 'PASSWORD';
    modalData.model = 'add';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* ユーザー削除ダイアログ */
  const showDelModal = user_id => {

    setLoading(true);

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'delete';
    data.user_id = user_id;
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'ユーザー削除';
    items.map(item => {
      if(item.user_id==user_id){
        modalData.text = 'ユーザーを削除します、よろしいですか？';
        modalData.text_user_id = item.login_id;
        modalData.text_user_name = item.user_name;
      }
    });

    modalData.execName = '削除';
    modalData.model = 'simple';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* input欄のデータをセット */
  const changeDatas = text => {
    const data = datas;
    data.login_id = text;
    setDatas(data);
  }

  /* input欄(ユーザー名)のデータをセット */
  const changeDatasName = text => {
    const data = datas;
    data.user_name = text;
    setDatas(data);
  }

  /* input欄(password)のデータをセット */
  const changeDatasPass = text => {
    const data = datas;
    data.pass = text;
    setDatas(data);
  }

  /* select(admin)のデータをセット */
  const changeDatasAdmin = text => {
    const data = datas;
    data.admin = text;
    setDatas(data);
  }

  /* select(font_size)のデータをセット */
  const changeDatasFont = text => {
    const data = datas;
    data.font = text;
    setDatas(data);
  }

  const onClickBack = () => {
    history.push({ pathname: '/' });
  }

  /* ユーザー更新 */
  const updUser = () => {

    const sendData = '?user_id='+datas.user_id+'&login_id='+datas.login_id+'&user_name='+datas.user_name+'&pass='+datas.pass
                   + '&admin='+datas.admin+'&font='+datas.font;

    fetch('/update_user'+sendData)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            alert('ユーザーを編集しました。');
            const newItems = items.map(item => {
              if(item.user_id==datas.user_id) {
                item.login_id = datas.login_id;
                item.user_name = datas.user_name;
                item.o_pass = datas.pass;
                item.o_admin = datas.admin;
                item.o_font = datas.font;
                if(datas.pass!='') {
                  item.pass = '******';
                }else {
                  item.pass = '未設定';
                }
                if(datas.admin=='0') {
                  item.admin = 'ユーザー';
                }else if(datas.admin=='1') {
                  item.admin = '管理者';
                }
                if(datas.font=='0') {
                  item.font = '小';
                }else if(datas.font=='1') {
                  item.font = '中';
                }else if(datas.font=='2') {
                  item.font = '大';
                }
              }
              return item;
            });
            setItems(newItems);
          /* ID重複 */
          }else if(data.result===2) {
            alert('['+datas.login_id+']\n既に登録されているIDです。');
          }else {
            alert('update failed');
          }
          /* ローディング非表示 */
          setLoading(false);
        }
      );

  }

  /* ユーザー追加 */
  const addUser = () => {

    const sendData = '?login_id='+datas.login_id+'&pass='+datas.pass
                   + '&admin='+datas.admin+'&font='+datas.font;

    fetch('/insert_user'+sendData)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            alert('ユーザーを追加しました。');
            var insert_pass = '';
            if(datas.pass=='') {
              insert_pass = '未設定';
            }else {
              insert_pass = '******';
            }
            var insert_admin = '';
            if(datas.admin=='0') {
              insert_admin = 'ユーザー';
            }else if(datas.admin=='1') {
              insert_admin = '管理者';
            }
            var insert_font = '';
            if(datas.font=='0') {
              insert_font = '小';
            }else if(datas.font=='1') {
              insert_font = '中';
            }else if(datas.font=='2') {
              insert_font = '大';
            }
            setItems([...items, {
              user_id: data.user_id,
              login_id: datas.login_id,
              o_pass: datas.pass,
              o_admin: datas.admin,
              o_font: datas.font,
              pass: insert_pass,
              ad: insert_admin,
              font: insert_font
            }]);
          /* 登録済みID */
          }else if(data.result===2) {
            alert('['+datas.login_id+']\n既に登録されているIDです。');
          }else {
            alert('insert failed');
          }
          /* ローディング非表示 */
          setLoading(false);
        }
      );

  }

  /* ユーザー削除 */
  const deleteUser = () => {

    fetch('/delete_user?user_id='+datas.user_id)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            alert('ユーザーを削除しました。');
            var i = 0;
            var index = 0;
            items.map(item => {
              if(item.user_id==datas.user_id){
                index = i;
              }
              i++;
            });
            const newItems = [...items];
            newItems.splice(index,1);
            setItems(newItems);
          }else {
            alert('insert failed');
          }
          /* ローディング非表示 */
          setLoading(false);
        }
      );

  }

  /* DBから取得したデータを初期データとしてセット */
  useEffect(() => {
    /* DBからのデータ取得前はリストを表示しない */
    try {
      /* 検索結果取得時 */
      if(array[0].user_id) {
        setItems(array);
        setShowAdd(true);
      /* 検索0件だった時 */
      }else if(array[0].cnt==0) {
        setShowAdd(true);
      }
    } catch(e) {
    }
    setLoading(false);
  }, [array]);

  const style = {
    padding: 0,
    margin: 0,
  };

  const style2 = {
    padding: 5,
    margin: 0,
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
            modalData={modalDatas}
            onChangeInput={changeDatas}
            onChangeInputName={changeDatasName}
            onChangeInputPass={changeDatasPass}
            onClickOk={modalOk}
            onClickClose={modalClose}
            onChangeSelectAdmin={changeDatasAdmin}
            onChangeSelectFont={changeDatasFont}
          />
        </ReactModal>
        <div class="panel">
          {/* ヘッダー */}
          <div class="panel-heading">ユーザー管理</div>
          {/* リスト表示部分 */}
          <UserTable
            items={items}
            execEdit={showUpdModal}
            execDelet={showDelModal}
          />
          {/* フッター */}
          <div class="panel-block" style={style}>
            <span class="column is-8" style={style2}>
            </span>
            <span class="column is-2" align="center" style={style2}>
              {showAdd && <button onClick={showAddModal}>追加</button>}
            </span>
            <span class="column is-2" align="center" style={style2}>
              <button onClick={onClickBack}>戻る</button>
            </span>
          </div>
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
        <i class="fas fa-spinner fa-spin fa-5x"></i>
      </div>
    );
  } else{
    return null;
  }
}

/* 確認ダイアログの中身 */
function ModalInside({ modalData, onChangeInput, onChangeInputName, onChangeInputPass, onClickOk, onClickClose, onChangeSelectAdmin, onChangeSelectFont }) {
  const model = modalData.model;

  const inputChange = e => {
    onChangeInput(e.target.value);
  }

  const inputChangeName = e => {
    onChangeInputName(e.target.value);
  }

  const inputChangePass = e => {
    onChangeInputPass(e.target.value);
  }

  const selectChangeAdmin = e => {
    onChangeSelectAdmin(e.target.value);
  }

  const selectChangeFont = e => {
    onChangeSelectFont(e.target.value);
  }

  const modalTextStyle = {
    margin: 20,
  }

  const buttonStyle = {
    fontSize: '20px',
  }

  const footerStyle = {
    padding: 0,
    marginBottom: 10,
  }

  const divInputfooterStyle = {
    marginBottom: 10,
  }

  const inputLabelStyle = {
    fontSize: '12px',
  }

  if(model==='simple') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <span>{modalData.text}</span>
          {modalData.text_user_id &&
            <span>
              <br /><span style={inputLabelStyle}>ユーザーID: </span><span>{modalData.text_user_id}</span>
              <br /><span style={inputLabelStyle}>ユーザー名: </span><span>{modalData.text_user_name}</span>
            </span>
          }
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='update') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <div>
            <span>{modalData.text}</span>
          </div>
          <span style={inputLabelStyle}>ユーザーID(必須)</span>
          <div>
            <input
              class="input"
              type="text"
              onChange={inputChange}
              placeholder={modalData.login_id}
            />
          </div>
          <span style={inputLabelStyle}>ユーザー名</span>
          <div>
            <input
              class="input"
              type="text"
              onChange={inputChangeName}
              placeholder={modalData.user_name}
            />
          </div>
          <span style={inputLabelStyle}>PASSWORD(必須)</span>
          <div style={divInputfooterStyle}>
            <input
              class="input"
              type="password"
              onChange={inputChangePass}
              placeholder={modalData.pass}
            />
          </div>
          <div>
            <span>権限</span>
            <select defaultValue={modalData.admin} onChange={selectChangeAdmin}>
              <option value="1">管理者</option>
              <option value="0">ユーザー</option>
            </select>
            <span>サイズ</span>
            <select defaultValue={modalData.font} onChange={selectChangeFont}>
              <option value="0">小</option>
              <option value="1">中</option>
              <option value="2">大</option>
            </select>
          </div>
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickOk} style={buttonStyle}>{modalData.execName}</button>
          </span>
          <span class="column is-6" align="center" style={footerStyle}>
            <button onClick={onClickClose} style={buttonStyle}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='add') {
    return (
      <div class="panel">
        {/* ヘッダー */}
        <div class="panel-heading">
           {modalData.title}
        </div>
        {/* メイン */}
        <div style={modalTextStyle}>
          <div>
            <span>{modalData.text}</span>
          </div>
          <span style={inputLabelStyle}>ユーザーID(必須)</span>
          <div>
            <input
              class="input"
              type="text"
              placeholder={modalData.phId}
              onChange={inputChange}
            />
          </div>
          <span style={inputLabelStyle}>PASSWORD(必須)</span>
          <div style={divInputfooterStyle}>
            <input
              class="input"
              type="password"
              placeholder={modalData.phPass}
              onChange={inputChangePass}
            />
          </div>
          <div>
            <span>権限</span>
            <select onChange={selectChangeAdmin}>
              <option value="1">管理者</option>
              <option value="0" selected>ユーザー</option>
            </select>
            <span>サイズ</span>
            <select onChange={selectChangeFont}>
              <option value="0">小</option>
              <option value="1" selected>中</option>
              <option value="2">大</option>
            </select>
          </div>
        </div>
        {/* フッター */}
        <div class="panel-block" style={footerStyle}>
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

/* ユーザー情報テーブル */
function UserTable({ items, execEdit, execDelet }) {

  const columns = [
    { header: 'ユーザーID', accessor: 'login_id' },
    { header: 'ユーザー名', accessor: 'user_name' },
    { header: 'パスワード', accessor: 'pass' },
    { header: '権限', accessor: 'admin' },
    { header: '文字サイズ', accessor: 'font' },
    { header: 'twitter連携', accessor: 'twitter' },
    { header: 'google連携', accessor: 'google' },
    { header: 'GitHub連携', accessor: 'github' },
    { header: '', accessor: 'button' }
  ];

  const tableStyle = {
  width: '100%',
    fontSize: '14px',
    
  }

  const tableThTdStyle = {
    textAlign: 'center',
    background: '#98fb98',
    border: 'solid 1px #808080',
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map(column => (
            <td style={tableThTdStyle}>{column.header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <TableTbody
            item={item}
            execEdit={execEdit}
            execDelete={execDelet}
          />
        ))}
      </tbody>
    </table>
  );
}

/* テーブル本体 */
function TableTbody({ item, execEdit, execDelete }) {

  const onClickEdit = () => {
    execEdit(item.user_id);
  }

  const onClickDelete = () => {
    execDelete(item.user_id);
  }

  const buttonStyle = {
    fontSize: '10px',
  }

  const tableTdLStyle = {
    textAlign: 'left',
    background: '#f5f5f5',
    border: 'solid 1px #808080',
  }

  const tableTdCStyle = {
    textAlign: 'center',
    background: '#f5f5f5',
    border: 'solid 1px #808080',
  }

  const btnSpan = {
    marginRight: 10,
  }

  return (
    <tr>
      <td style={tableTdLStyle}>{item.login_id}</td>
      <td style={tableTdLStyle}>{item.user_name}</td>
      <td style={tableTdLStyle}>{item.pass}</td>
      <td style={tableTdCStyle}>{item.ad}</td>
      <td style={tableTdCStyle}>{item.font}</td>
      <td style={tableTdCStyle}>{item.twitter}</td>
      <td style={tableTdCStyle}>{item.google}</td>
      <td style={tableTdCStyle}>{item.github}</td>
      <td style={tableTdCStyle}>
        <span style={btnSpan}>
          <button onClick={onClickEdit} style={buttonStyle}>編集</button>
        </span>
        <span>
          <button onClick={onClickDelete} style={buttonStyle}>削除</button>
        </span>
      </td>
    </tr>
  );
}

/* 初期処理 */
function UserEdit() {
  const location = useLocation();
  const [array, setArray] = useState([{}]);

  const history = useHistory();

  useEffect(() =>{
    /* 権限無しはトップ画面へ */
    var isView = false;
    if(location.state) {
      if(location.state.data==1) {
        isView = true;
      }
    }
    if(isView) {
      fetch('/select_all_user')
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              setArray(data.data);
            /* 件数0 */
            }else if(data.result===2) {
              const newArray = [{ cnt: 0 }];
              setArray(newArray);
            }
          }
        );
    }else {
      history.push({ pathname: '/'});
    }
  
  },[])


  return (
    <div class="container is-fluid">
      <Todo array={ array }/>
    </div>
  );
}

export default UserEdit;
