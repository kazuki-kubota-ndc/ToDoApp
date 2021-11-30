import './App.css';
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
  /* 追加・編集ボタンのdisabled：true/false */
  const [addEditBtn, setAddEditBtn] = React.useState(true);

  /* ボタン表示用のリストデータ（１列３行） */
  const [btnItems, setBtnItems] = React.useState([]);

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

  /* リストメイン画面へ */
  const goMain = (no, name) => {
    history.push({ pathname: '/ListMain', state: { no: no, name: name, data: items }});
  }

  /* 追加編集ボタン */
  const onClickEdit = () => {
    history.push({ pathname: '/ListEdit', state: { data: items }});
  }

  /* DBから取得したデータを初期データとしてセット */
  useEffect(() => {
    /* DBからのデータ取得前はリストを表示しない */
    try {
      if(array[0].group_no) {
        setItems(array);
      }
    } catch(e) {
    }
    setLoading(false);
    setAddEditBtn(false);
  }, [array]);

  useEffect(() => {
    var newBtnItems = [];
    var i = 0;
    var index = 0;
    var no1 = 0;
    var no2 = 0;
    var no3 = 0;
    var name1 = '';
    var name2 = '';
    var name3 = '';
    items.map(item => {
      if(i==0) {
        no1 = item.group_no;
        name1 = item.name;
      }else if(i==1) {
        no2 = item.group_no;
        name2 = item.name;
      }else if(i==2) {
        no3 = item.group_no;
        name3 = item.name;
        newBtnItems[index] = {
          no1: no1,
          no2: no2,
          no3: no3,
          name1: name1,
          name2: name2,
          name3: name3
        }
        index++;
      }
      if(i!=2) {
        i++;
      }else {
        i=0;
        no1 = 0;
        no2 = 0;
        no3 = 0;
        name1 = '';
        name2 = '';
        name3 = '';
      }
    });
    if(i!=0) {
      newBtnItems[index] = {
        no1: no1,
        no2: no2,
        no3: no3,
        name1: name1,
        name2: name2,
        name3: name3
      }
    }
    setBtnItems(newBtnItems);
  }, [items]);

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
        <div class="panel">
          {/* ヘッダー */}
          <div class="panel-heading">ToDo List</div>
          {/* リスト表示部分 */}
          {btnItems.map(item => (
            <TodoGroup
              item={item}
              onClickBtn={goMain}
            />
          ))}
          {/* フッター */}
          <div class="panel-block" style={style}>
            <span class="column is-9" style={style2}>
            </span>
            <span class="column is-3" align="center" style={style2}>
              <button onClick={onClickEdit} disabled={addEditBtn}>追加・編集</button>
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

/* 本体 */
function TodoGroup({ item, onClickBtn }) {

  const onClickBtn1 = () =>{
    onClickBtn(item.no1, item.name1);
  }

  const onClickBtn2 = () =>{
    onClickBtn(item.no2, item.name2);
  }

  const onClickBtn3 = () =>{
    onClickBtn(item.no3, item.name3);
  }

  const style = {
    padding: 0,
    margin: 0,
    borderBottom: "solid 0px #dcdcdc",
  };

  const style2 = {
    padding: 5,
    margin: 0,
  }

  const buttonStyle = {
    fontSize: '20px',
    width : '70%',
  }

  return (
    <div class="panel-block" style={style}>
      <span class="column is-4" align="center" style={style2}>
        <button onClick={onClickBtn1} style={buttonStyle}>{item.name1}</button>
      </span>
      <span class="column is-4" align="center" style={style2}>
        {item.no2!=0 &&
          <button onClick={onClickBtn2} style={buttonStyle}>{item.name2}</button>
        }
      </span>
      <span class="column is-4" align="center" style={style2}>
        {item.no3!=0 &&
          <button onClick={onClickBtn3} style={buttonStyle}>{item.name3}</button>
        }
      </span>
    </div>
  );
}

/* 初期処理 */
function App() {
  const location = useLocation();
  const [array, setArray] = useState([{}]);

  useEffect(() =>{
    /* 初期表示 */
    if(location.state==null) {
      fetch('/api')
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              setArray(data.data);
            }
          }
        );

    /* メインリスト、ソートからの「戻る」 */
    }else if(location.state.data!=null) {
      setArray(location.state.data);
    }
  
  },[])


  return (
    <div class="container is-fluid">
      <Todo array={ array }/>
    </div>
  );
}

export default App;
