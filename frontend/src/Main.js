import './common.css';
import React,{ useState,useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';

/* リスト表示 */
function Todo({ userData, array, colCnt }) {

  /* ユーザーデータ */
  const [user, setUser] = React.useState({});
  /* 表示サイズ */
  const [sizeClass, setSizeClass] = React.useState('Med');
  /* リストデータ */
  const [items, setItems] = React.useState([]);
  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(true);

  /* ボタン表示用のリストデータ（１列３行） */
  const [btnItems, setBtnItems] = React.useState([]);
  /* 追加編集ボタンの表示 */
  const [showEdit, setShowEdit] = React.useState(false);

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

  const onClickLogout = () => {
    history.push({ pathname: '/' });
  }

  /* リストメイン画面へ */
  const goMain = (no, name, color) => {
    history.push({ pathname: '/ListMain', state: { user: user, no: no, name: name, color: color, data: items }});
  }

  /* 追加編集ボタン */
  const onClickEdit = () => {
    history.push({ pathname: '/ListEdit', state: { user: user, data: items }});
  }

  /* listデータをボタン配置用データに変換 */
  const itemsToBtnItems = items => {
    var newBtnItems = [{}];
    var newBtnItem = [{}];
    var i = 0;
    var index = 0;

    items.map(item => {
      newBtnItem[i] = item;
      if(i==colCnt-1) {
        newBtnItems[index] = {
          items: newBtnItem
        }
        index++;
        newBtnItem = [{}];
        i=0;
      }else {
        i++;
      }
    });
    if(i!=0) {
      newBtnItems[index] = {
        items: newBtnItem
      }
    }
    setBtnItems(newBtnItems);
  }

  useEffect(() => {
    setUser(userData);
    var font = 'Med';
    if(userData.font_size==0) {
      font = 'Small';
    }else if(userData.font_size==1) {
      font = 'Med';
    }else if(userData.font_size==2) {
      font = 'Large';
    }
    setSizeClass(font);
  }, [userData]);

  /* DBから取得したデータを初期データとしてセット */
  useEffect(() => {
    /* DBからのデータ取得前はリストを表示しない */
    try {
      /* 検索結果取得時 */
      if(array[0].group_no) {
        setItems(array);
        setShowEdit(true);
      /* 検索0件だった時 */
      }else if(array[0].cnt==0) {
        setShowEdit(true);
      }
    } catch(e) {
    }
    setLoading(false);
  }, [array]);

  useEffect(() => {
    itemsToBtnItems(items);
  }, [items]);

    return (
      <div>
        <Loader isLoading={ loading } />
        <div className={"panel"}>
          {/* ヘッダー */}
          <div className={"panel-heading"}>
            <div className={classNames("panel-block", "pad0mar0")}>
              <span className={classNames("column", "is-10", "pad0mar0", "title"+sizeClass)}>
                ToDo List
              </span>
              <span className={classNames("column", "is-2", "pad0mar0")} align="center">
                <button onClick={onClickLogout}><span className={"medBtnFont"+sizeClass}>ログアウト</span></button>
              </span>
            </div>
          </div>
          {/* リスト表示部分 */}
          {btnItems.map(item => (
            <TodoGroup
              btnItem={item.items}
              onClickBtn={goMain}
              colCnt={colCnt}
              sizeClass={sizeClass}
            />
          ))}
          {/* フッター */}
          <div className={classNames("panel-block", "pad0mar0")}>
            <span className={classNames("column", "is-9", "pad5mar0")}>
            </span>
            <span className={classNames("column", "is-3", "pad5mar0")} align="center">
              {showEdit && <button onClick={onClickEdit}><span className={"medBtnFont"+sizeClass}>追加・編集</span></button>}
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
        <i className={classNames("fas", "fa-spinner", "fa-spin", "fa-5x")}></i>
      </div>
    );
  } else{
    return null;
  }
}

/* 本体 */
function TodoGroup({ btnItem, onClickBtn, colCnt, sizeClass }) {

  const style = {
    borderBottom: "solid 0px #dcdcdc",
  }

  return (
    <div className={classNames("panel-block", "pad0mar0")} style={style}>
      {btnItem && btnItem.map(item => (
        <TodoGroupBtn
          item={item}
          colCnt={colCnt}
          onClickBtn={onClickBtn}
          sizeClass={sizeClass}
        />
      ))}
    </div>
  );
}

function TodoGroupBtn({ item, colCnt, onClickBtn, sizeClass }) {

  const onClickListBtn = () => {
    onClickBtn(item.group_no, item.name, item.color)
  }

  const isNum = () => {
    if(colCnt==2) {
      return "is-6";
    }else if(colCnt==3) {
      return "is-4";
    }else if(colCnt==4) {
      return "is-3";
    }else if(colCnt==6) {
      return "is-2";
    }
  }

  const btnClass = isNum();

  const style = {
    background: '#'+item.color,
  }

  return (
      <span className={classNames("column", "pad5mar0", btnClass)} align="center">
        <button onClick={onClickListBtn} className={classNames("width70", "largeBtnFont"+sizeClass)} style={style}>{item.name}</button>
      </span>
  );
}


/* 初期処理 */
function Main() {
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [array, setArray] = useState([{}]);

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

      /* 初期表示 */
      if(location.state.data==null) {
        fetch('/main?user_id='+location.state.user.user_id)
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

      /* メインリスト、ソートからの「戻る」 */
      }else {
        setArray(location.state.data);
      }
    }
  },[])


  return (
    <div class="container is-fluid">
      <Todo userData={ userData } array={ array } colCnt={ 4 }/>
    </div>
  );
}

export default Main;
