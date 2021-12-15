import './common.css';
import React,{ useState,useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
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
  /* フィルターのステータス：ALL/TODO/DONE */
  const [filter, setFilter] = React.useState('ALL');
  /* ダイアログ(OK/CANCEL)の開閉ステータス */
  const [showModal, setShowModal] = React.useState(false);
  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(true);
  /* 並び順変更のdisabled */
  const [sortDisabled, setSortDisabled] = React.useState(true);

  /* ダイアログのテキスト名 */
  const [modalDatas, setModalDatas] = React.useState(new Map());
  /* DB登録データ */
  const [datas, setDatas] = React.useState(new Map());
  /* 日付データ */
  const [date, setDate] = useState(moment);
  const dateFormat = 'YYYY/MM/DD';

  /* 戻るで返却する用のデータ */
  const [mainDatas, setMainDatas] = React.useState([]);

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

  const onClickLogout = () => {
    history.push({ pathname: '/' });
  }

  /* モーダルを開いた時の処理 */
  const modalOpen = () => {

  }

  /* モーダルを閉めた時の処理 */
  const modalClose = () => {
    setDate(moment(new Date()));
    setShowModal(false);
  }

  /* モーダルOKボタンの処理 */
  const modalOk = () => {
    /* ヘッダー削除処理 */
    if(datas.action==='delete') {
      /* モーダル閉じる */
      setShowModal(false);
      rowDelete();
    /* リスト名変更 */
    }else if(datas.action==='update') {
      /* 入力欄の空文字はエラー */
      if(datas.name.trim()==='') {
        alert('New List Name is empty');
      }else {
        /* モーダル閉じる */
        setShowModal(false);
        rowUpdate();
      }
    /* 詳細削除 */
    }else if(datas.action==='dtlDel') {
      /* モーダル閉じる */
      setShowModal(false);
      dtlDel();
    /* 詳細追加 */
    }else if(datas.action==='dtlAdd') {
      /* 入力欄の空文字はエラー */
      if(datas.name.trim()==='') {
        alert('New Detail Name is empty');
      }else {
        /* モーダル閉じる */
        setShowModal(false);
        dtlAdd();
      }
    /* 詳細変更 */
    }else if(datas.action==='dtlUpd') {
      /* 入力欄の空文字はエラー */
      if(datas.name.trim()==='') {
        alert('New Detail Name is empty');
      }else {
        /* モーダル閉じる */
        setShowModal(false);
        dtlUpd();
      }
    /* 日付入力 */
    }else if(datas.action==='date') {
      /* 日付チェック */
      
      /* モーダル閉じる */
      setShowModal(false);
      createList();
    }
  }

  /* 詳細の表示・非表示 */
  const setShowDtl = (no, flg) => {
    const newItems = items.map(newItem => {
      if (no === newItem.no) {
        newItem.showDtl = flg;
      }
      return newItem;
    });
    setItems(newItems);
  }

  /* リスト編集確認ダイアログ */
  const showUpdModal = (no, text) => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'update';
    data.no = no;
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'リスト編集';
    modalData.nameLabel = 'リスト名';
    modalData.dateLabel = '日付';
    modalData.timeLabel = '時';
    modalData.minLabel = '分';
    modalData.execName = '変更';
    modalData.phName = text;
    modalData.model = 'inputColor';

    items.map(item => {
      if (item.key === no) {
        data.name = item.text;
        data.shimebi = item.shimebi;
        data.time = item.shimetime;
        data.min = item.shimemin;
        modalData.time = item.shimetime;
        modalData.min = item.shimemin;
        /* 日付情報をセット */
        setDate(moment(item.shimebi));
      }
    });

    setDatas(data);
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* リスト名変更のデータをセット */
  const changeDatas = text => {
    const data = datas;
    data.name = text;
    setDatas(data);
  }

  /* リスト編集処理 */
  const rowUpdate = () => {
    const shimebi = date.format(dateFormat);
    const newItems = items.map(item => {
      if (item.key === datas.no) {
        item.text = datas.name;
        item.shimebi = shimebi;
        item.shimetime = datas.time;
        item.shimemin = datas.min;
      }
      return item;
    });
    setItems(newItems);

    fetch('/update_hed_name?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+datas.no+'&name='+datas.name+'&shimebi='+datas.shimebi+'&shimetime='+datas.time+'&shimemin='+datas.min)
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

  /* チェックボックスをチェックした時の処理 */
  const handleCheck = checked => {
    const newItems = items.map(item => {
      if (item.key === checked.key) {
        if(item.done) {
          item.check_flg = 0;
        }else {
          item.check_flg = 1;
        }
        item.done = !item.done;
      }
      return item;
    });
    var check_flg = 0;
    if(checked.done) {
      check_flg = 1;
    }
    setItems(newItems);
    fetch('/update_check?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+checked.key+'&check_flg='+check_flg)
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
  };

  /* 削除確認ダイアログ */
  const showDelModal = no => {
    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'delete';
    data.no = no;
    setDatas(data);
    /* モーダル情報をセット */
    var hed_name = '';
    items.map(item => {
      if(no === item.no) {
        hed_name = item.text;
      }
    });
    const modalData = new Map();
    modalData.title = 'リスト削除['+hed_name+']';
    modalData.text = 'リストを削除します、よろしいですか？';
    modalData.execName = '削除';
    modalData.model = 'simple';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* 削除処理(DB) */
  const rowDelete = () => {
    const no = datas.no;

    /* ローディング表示 */
    setLoading(true);

    fetch('/delete_hed?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            rowDeleteData(no);
          }else {
            alert('delete failed');
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );
  }

  /* 削除処理(画面) */
  const rowDeleteData = no => {

    var i = -1;
    var index = -1;
    /* 削除する行のindexを取得 */
    items.map(item => {
      i++;
      if (item.key === no) {
        index = i;
      }
    });
    /* newItemsのindex行を削除してsetItemsする(itemsをspliceしてsetItemsするのはダメ) */
    const newItems = [...items];
    newItems.splice(index,1);
    /* リストが１件以下の時はソートボタンをdisabled */
    if(newItems.length < 2) {
      setSortDisabled(true);
    }
    setItems(newItems);
    setLoading(false);
  }

  /* 並び順変更実行 */
  const onClickSort = () => {
    history.push({ pathname: '/HedSort', state: { user: user, data: items, listData: listDatas, mainData: mainDatas }});
  }

  /* 日付確認ダイアログ */
  const showDateModal = text => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'date';
    data.text = text;
    data.time = '12';
    data.min = '0';
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = '日時入力 ['+text+']';
    modalData.dateLabel = '日付';
    modalData.timeLabel = '時';
    modalData.minLabel = '分';
    modalData.execName = '決定';
    modalData.model = 'date';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* 時間のデータをセット */
  const changeTime = text => {
    const data = datas;
    data.time = text;
    setDatas(data);
  }

  /* 分のデータをセット */
  const changeMin = text => {
    const data = datas;
    data.min = text;
    setDatas(data);
  }

  /* inputタブでEnterを押した時の処理 */
  const handleAdd = text => {
    if(text.trim()==='') {
      alert('List Name is empty');
      return;
    }
    showDateModal(text);
  }

  /* リスト追加処理 */
  const createList = () => {
    const text = datas.text;
    const shimebi = date.format(dateFormat);
    const shimetime = datas.time;
    const shimemin = datas.min;

    var insert_sort = 1;
    var insert_no = 1;

    if(items.length > 0) {
      insert_sort = parseInt(items[items.length-1].sort)+1;
      items.map(item => {
        if(insert_no <= item.no) {
          insert_no = parseInt(item.no)+1;
        }
      });
    }

    /* ローディング表示 */
    setLoading(true);

    fetch('/insert_hed?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+insert_no+'&name='+text+'&sort='+insert_sort+'&shimebi='+shimebi+'&shimebitime='+shimetime+'&shimebimin='+shimemin)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            setItems([...items, { key: data.no, no: data.no, text: data.name, name: data.name, done: false, sort: data.sort, shimebi: data.shimebi, shimetime: data.time, shimemin: data.min }]);
          }else {
            alert('insert failed');
          }
          /* ローディング非表示 */
          setLoading(false);
          /* (追加前)itemsが1件以上の場合、ソートボタンを表示 */
          if(items.length>0) {
            setSortDisabled(false);
          }
        }
      );
  }

  /* DTL追加ダイアログ */
  const showDtlAddModal = no => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'dtlAdd';
    data.no = no;
    data.dtl_no = 0;
    data.name = '';
    data.sort = 0;
    setDatas(data);
    /* モーダル情報をセット */
    var hed_name = '';
    items.map(item => {
      if(no === item.no) {
        hed_name = item.text;
      }
    });
    const modalData = new Map();
    modalData.title = '詳細追加['+hed_name+']';
    modalData.text = '詳細を入力して下さい';
    modalData.execName = '追加';
    modalData.phName = 'NEW DETAIL NAME';
    modalData.model = 'input';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* DTL編集ダイアログ */
  const showDtlUpdModal = (no, dtl_no, name)  => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'dtlUpd';
    data.no = no;
    data.dtl_no = dtl_no;
    data.name = '';
    setDatas(data);
    /* モーダル情報をセット */
    var hed_name = '';
    items.map(item => {
      if(no === item.no) {
        hed_name = item.text;
      }
    });
    const modalData = new Map();
    modalData.title = '詳細変更['+hed_name+']';
    modalData.text = '詳細を入力して下さい';
    modalData.execName = '変更';
    modalData.phName = name;
    modalData.model = 'input';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* DTL削除ダイアログ */
  const showDtlDelModal = (no, dtl_no, name) => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'dtlDel';
    data.no = no;
    data.dtl_no = dtl_no;
    setDatas(data);
    /* モーダル情報をセット */
    var hed_name = '';
    items.map(item => {
      if(no === item.no) {
        hed_name = item.text;
      }
    });
    const modalData = new Map();
    modalData.title = '詳細削除['+hed_name+':'+name+']';
    modalData.text = '詳細を削除します、よろしいですか？';
    modalData.execName = '削除';
    modalData.model = 'simple';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* 追加処理(DB) */
  const dtlAdd = () => {
    const group_no = listDatas.group_no;
    const no = datas.no;
    const name = datas.name;

    /* ローディング表示 */
    setLoading(true);

    fetch('/insert_dtl?user_id='+user.user_id+'&group_no='+group_no+'&no='+no+'&name='+name)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            dtlAddData(group_no, no, data.dtl_no, name, data.sort);
          }else {
            alert('insert failed');
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );

  }

  /* 追加処理(画面) */
  const dtlAddData = (group_no, no, dtl_no, text, sort) => {

    /* 詳細の検索が必要か調べる */
    const isNeedSelectDtl = () => {
      var flg = false;
      items.map(newItem => {
        if (newItem.no === no) {
          /* 未検索で詳細無し */
          if(newItem.search==null) {
            flg = true;
          }
        }
      });
      return flg;
    }

    /* 詳細にデータを追加 */
    const newItems = items.map(newItem => {
      if (newItem.no === no) {
        /* 詳細無し */
        if(newItem.dtl==null) {
          newItem.dtl = [];
        }
        newItem.dtl = [...newItem.dtl, { "no": no, "dtl_no": dtl_no, "name": text, "sort": sort }];
        /* 詳細表示 */
        newItem.showDtl = true;
      }
      return newItem;
    });

    /* 詳細データ取得 */
    const selectDtl = () => {

      fetch('/select_dtl?user_id='+user.user_id+'&group_no='+group_no+'&no='+no)
        .then((res) => res.json())
        .then(
          (data) => {
            var reData;
            if(data.result===1) {
              /* 詳細追加後のデータが返ってきている */
              reData = data.data;
            /* 検索件数0件 */
            }else if(data.result===2) {
              reData = [];
            }else {
              reData = [];
            }
            showDtlItems(reData);
          }
        );
    }

    /* 詳細を表示する */
    const showDtlItems = addDtl => {

      const newAddItems = items.map(newItem => {
        if (newItem.no === no) {
          newItem.dtl = addDtl;
          newItem.search = 1;
          newItem.showDtl = true;
        }
        return newItem;
      });

      setItems(newAddItems);
      /* ローディング非表示 */
      setLoading(false);
    }

    /* 詳細検索=>追加 */
    if(isNeedSelectDtl()) {
      selectDtl();
    /* 追加 */
    }else {
      setItems(newItems);
      /* ローディング非表示 */
      setLoading(false);
    }

  }

  /* 更新処理(DB) */
  const dtlUpd = () => {
    const no = datas.no;
    const dtl_no = datas.dtl_no;
    const name = datas.name;

    /* ローディング表示 */
    setLoading(true);

    fetch('/update_dtl_name?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+no+'&dtl_no='+dtl_no+'&name='+name)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            dtlUpdData(no, dtl_no, name);
          }else {
            alert('update failed');
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );

  }

  /* 更新処理(画面) */
  const dtlUpdData = (no, dtl_no, text) => {

    /* 詳細のデータを削除 */
    const newItems = items.map(newItem => {
      if (newItem.no === no) {
        const newDtlItems = newItem.dtl.map(newDtlItem => {
          if(newDtlItem.dtl_no == dtl_no) {
            newDtlItem.name = text;
          }
          return newDtlItem;
        });
        newItem.dtl = newDtlItems;
      }
      return newItem;
    });
    setItems(newItems);
    /* ローディング非表示 */
    setLoading(false);
  }

  /* 削除処理(DB) */
  const dtlDel = () => {
    const no = datas.no;
    const dtl_no = datas.dtl_no;

    /* ローディング表示 */
    setLoading(true);

    fetch('/delete_dtl?user_id='+user.user_id+'&group_no='+listDatas.group_no+'&no='+no+'&dtl_no='+dtl_no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            dtlDelData(no, dtl_no);
          }else {
            alert('delete failed');
            /* ローディング非表示 */
            setLoading(false);
          }
        }
      );
  }

  /* 削除処理(画面) */
  const dtlDelData = (no, dtl_no) => {

    var dtl_length = 0;
    /* 詳細のデータを削除 */
    const newItems = items.map(newItem => {
      if (newItem.no === no) {
        var i = -1;
        var index = -1;
        dtl_length = newItem.dtl.length;
        newItem.dtl.map(newDtlItem => {
          i++;
          if(newDtlItem.dtl_no == dtl_no) {
            index = i;
          }
        });
        newItem.dtl.splice(index,1);
      }
      return newItem;
    });
    /* 削除後リスト無しになる場合は非表示 */
    if(dtl_length==1) {
      setShowDtl(no, false);
    }
    setItems(newItems);
    /* ローディング非表示 */
    setLoading(false);
  }

  /* 戻るボタン */
  const onClickBack = () => {
    history.push({ pathname: '/Main', state: { user: user, data: mainDatas }});
  }

  /* フィルターを変えた時の処理 */
  const handleFilterChange = value => setFilter(value);

  /* リスト表示のフィルター処理 */
  const displayItems = items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'TODO') return !item.done;
    if (filter === 'DONE') return item.done;
  });

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
    const defaultItems = array.map(item => {
      item.text = item.name;
      item.key = item.no;
      var done_flg = false;
      if(item.check_flg===1){
        done_flg = true;
      }
      item.done = done_flg;
      return item;
    });
    /* DBからのデータ取得前はリストを表示しない */
    if(array[0].key) {
      setItems(defaultItems);
    }

    /* リストが２件以上の時はソートボタンを表示 */
    if(array.length>1) {
      setSortDisabled(false);
    }

  }, [array]);

  useEffect(() => {
    setListDatas(listArray);
    setLoading(false);
  }, [listArray]);

  useEffect(() => {
    setMainDatas(mainArray);
  }, [mainArray]);

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
            modalData={modalDatas}
            onChangeInput={changeDatas}
            onChangeTime={changeTime}
            onChangeMin={changeMin}
            onClickOk={modalOk}
            onClickClose={modalClose}
            listDatas={listDatas}
            date={date}
            setDate={setDate}
            sizeClass={sizeClass}
          />
        </ReactModal>
        <div className={"panel"}>
          {/* ヘッダー */}
          <div className={"panel-heading"} style={panelHedStyle}>
            { listDatas &&
              <div className={classNames("panel-block", "pad0mar0")}>
                <span className={classNames("column", "is-10", "pad0mar0", "title"+sizeClass)}>
                  {listDatas.name}
                </span>
                <span className={classNames("column", "is-2", "pad0mar0")} align="center">
                  <button onClick={onClickLogout}><span className={"medBtnFont"+sizeClass}>ログアウト</span></button>
                </span>
              </div>
            }
          </div>
          {/* テキスト入力欄 */}
          <Input onAdd={handleAdd} isLoading={ loading } />
          {/* フィルター */}
          <Filter
            onChange={handleFilterChange}
            value={filter}
            sizeClass={sizeClass}
          />
          {/* リスト表示部分 */}
          {displayItems.map(item => (
            <TodoItem
              key={item.key}
              user={user}
              items={items}
              setItems={setItems}
              item={item}
              onCheck={handleCheck}
              onClickDel={showDelModal}
              onClickHedUpd={showUpdModal}
              onLoading={onLoading}
              onClickDtlAdd={showDtlAddModal}
              onClickDtlUpd={showDtlUpdModal}
              onClickDtlDel={showDtlDelModal}
              listData={listDatas}
              mainData={mainDatas}
              sizeClass={sizeClass}
            />
          ))}
          {/* フッター */}
          <div className={classNames("panel-block", "pad0mar0")}>
            <span className={classNames("column", "is-8", "pad5mar0", "medText"+sizeClass)}>
              全 {items.length} 件
            </span>
            {listDatas.name &&
              <span className={classNames("column", "is-2", "pad5mar0")} align="center">
                <button onClick={onClickSort} disabled={sortDisabled}><span className={"medBtnFont"+sizeClass}>並び順変更</span></button>
              </span>
            }
            {listDatas.name &&
              <span className={classNames("column", "is-2", "pad5mar0")} align="center">
                <button onClick={onClickBack}><span className={"medBtnFont"+sizeClass}>戻る</span></button>
              </span>
            }
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

/* 確認ダイアログの中身 */
function ModalInside({ modalData, onChangeInput, onChangeTime, onChangeMin, onClickOk, onClickClose, listDatas, date, setDate, sizeClass  }) {
  const model = modalData.model;

  const [focused, setFocused] = useState(false);

  const inputChange = e => {
    onChangeInput(e.target.value);
  }

  const selectChangeTime = e => {
    onChangeTime(e.target.value);
  }

  const selectChangeMin = e => {
    onChangeMin(e.target.value);
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
            <button className={"largeBtnFont"+sizeClass} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickClose}>取消</button>
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
          <div className={"labelFont"+sizeClass}>
            <span>{modalData.nameLabel}</span>
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
            <button className={"largeBtnFont"+sizeClass} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='inputColor') {
    return (
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)} style={panelHedStyle}>
           {modalData.title}
        </div>
        {/* メイン */}
        <div className={"mar20"}>

          <div className={"columns"}>
            <div className={classNames("column", "is-12")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.nameLabel}</span>
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
          </div>
          <div className={"columns"}>
            <div className={classNames("column", "is-6")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.dateLabel}</span>
              </div>
              <div>
                <SingleDatePicker
                  date={date}
                  onDateChange={date => setDate(date)}
                  focused={focused}
                  onFocusChange={focused => setFocused(focused)}
                  id="date"
                  onClose={focused => setFocused(false)}
                  displayFormat="YYYY/MM/DD"
                  withPortal={true}
                />
              </div>

            </div>
            <div className={classNames("column", "is-3")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.timeLabel}</span>
              </div>
              <div>
                <SelectTime
                  selectChangeTime={selectChangeTime}
                  defValue={modalData.time}
                />
              </div>

            </div>
            <div className={classNames("column", "is-3")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.minLabel}</span>
              </div>
              <div>
                <SelectMin
                  selectChangeMin={selectChangeMin}
                  defValue={modalData.min}
                />
              </div>

            </div>
          </div>

        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
    );
  }else if(model==='date') {
    return (
      <div className={"panel"}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading", "titleMod"+sizeClass)} style={panelHedStyle}>
           {modalData.title}
        </div>
        {/* メイン */}
        <div className={"mar20"}>

          <div className={"columns"}>
            <div className={classNames("column", "is-6")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.dateLabel}</span>
              </div>
              <div>
                <SingleDatePicker
                  date={date}
                  onDateChange={date => setDate(date)}
                  focused={focused}
                  onFocusChange={focused => setFocused(focused)}
                  id="date"
                  onClose={focused => setFocused(false)}
                  displayFormat="YYYY/MM/DD"
                  withPortal={true}
                />
              </div>

            </div>
            <div className={classNames("column", "is-3")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.timeLabel}</span>
              </div>
              <div>
                <SelectTime
                  selectChangeTime={selectChangeTime}
                  defValue={12}
                />
              </div>

            </div>
            <div className={classNames("column", "is-3")}>

              <div className={"labelFont"+sizeClass}>
                <span>{modalData.minLabel}</span>
              </div>
              <div>
                <SelectMin
                  selectChangeMin={selectChangeMin}
                  defValue={0}
                />
              </div>

            </div>
          </div>

        </div>
        {/* フッター */}
        <div className={classNames("panel-block", "pad0marB10")}>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickOk}>{modalData.execName}</button>
          </span>
          <span className={classNames("column", "is-6", "pad0marB10")} align="center">
            <button className={"largeBtnFont"+sizeClass} onClick={onClickClose}>取消</button>
          </span>
        </div>
      </div>
    );
  }
}

/* 時間選択プルダウン */
function SelectTime({ selectChangeTime, defValue }) {
  const htmls = [];

  const style = {
    color: '#5e5e5e',
    fontSize: '18px',
    border: '#dbdbdb 1px solid',
  }

  for(let i=0;i<24;i++) {
    htmls.push(<option style={style} value={String(23-i)}>{String(23-i)}</option>);
  }

  return (
    <select className={"select"} style={style} defaultValue={defValue} onChange={selectChangeTime}>
      { htmls }
    </select>
  );
}

/* 分選択プルダウン */
function SelectMin({ selectChangeMin, defValue }) {
  const htmls = [];

  const style = {
    color: '#5e5e5e',
    fontSize: '18px',
    border: '#dbdbdb 1px solid',
  }

  for(let i=0;i<60;i++) {
    htmls.push(<option style={style} value={String(59-i)}>{String(59-i)}</option>);
  }

  return (
    <select className={"select"} style={style} defaultValue={defValue} onChange={selectChangeMin}>
      { htmls }
    </select>
  );
}

/* リスト中身 */
function TodoItem({ user, items, setItems, item, onCheck, onClickDel, onClickHedUpd, onLoading, onClickDtlAdd, onClickDtlUpd, onClickDtlDel, listData, mainData, sizeClass }) {

  const history = useHistory();

  /* 詳細データ */
  var dtlItems;
  if(item.dtl) {
    dtlItems = item.dtl;
  }else {
    dtlItems = [{}];
  }
  /* 詳細部分の表示ステータス */
  var showDtl;
  if(item.showDtl) {
    showDtl = item.showDtl;
  }else {
    showDtl = false;
  }

  /* 詳細の表示・非表示 */
  const setShowDtl = flg => {
    const newItems = items.map(newItem => {
      if (newItem.no === item.no) {
        newItem.showDtl = flg;
      }
      return newItem;
    });
    setItems(newItems);
  }

  const checkboxChange = e => {
    onCheck(item);
  }

  const onListClick = e => {
    /* リスト内の要素をクリックした時は動かさない */
    if(e.target.className.match('click-list')) {
      /* リスト内の要素のイベントは動かさない */
      e.preventDefault();
      /* 詳細表示ステータス表示時は閉じる処理 */
      if(showDtl) {
        setShowDtl(false);
      }else {
        onLoading(true);
        selectDtl('view');
      }
    }
  }

  /* データ取得（view:詳細表示、sort:ソート画面へ） */
  const selectDtl = action => {
    fetch('/select_dtl?user_id='+user.user_id+'&group_no='+listData.group_no+'&no='+item.no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            /* 表示 */
            if(action==='view') {
              const newItems = items.map(newItem => {
                if (newItem.no === item.no) {
                  newItem.dtl = data.data;
                }
                return newItem;
              });
              setItems(newItems);
              setShowDtl(true);
              onLoading(false);
            /* ソート */
            }else if(action==='sort') {
              history.push({ pathname: '/DtlSort', state: { user: user, data: data.data, listData: listData, title: item.name, no: item.no, mainData: mainData }});
            }
          /* 検索件数0件 */
          }else if(data.result===2) {
            /* 詳細追加時の検索済み/未検索の判別用 */
            const newItems = items.map(newItem => {
              if (newItem.no === item.no) {
                newItem.search = 1;
              }
              return newItem;
            });
            setItems(newItems);
            onLoading(false);
            /* 表示 */
            if(action==='view') {
              alert('検索結果0件');
            /* ソート */
            }else if(action==='sort') {
              alert('詳細データ無し');
            }
          }else {
            onLoading(false);
            alert('select failed');
          }
        }
      );
  }

  /* 詳細追加 */
  const dtlAdd = () => {
    onClickDtlAdd(item.no);
  }

  /* 詳細ソート */
  const dtlSort = () => {
    onLoading(true);

    /* リスト0件 */
    if(dtlItems.length==0) {
      alert('詳細0件');
      onLoading(false);
    /* １件のみの場合 */
    }else if(dtlItems.length==1) {
      alert('詳細1件');
      onLoading(false);
    }else {
      history.push({ pathname: '/DtlSort', state: { user: user, data: dtlItems, listData: listData, title: item.name, no: item.no, items: items, mainData: mainData }});
    }

  }

  const noClickEvent = e => {
    /* リスト内の要素のイベントは動かさない */
    e.preventDefault();
  }

  const hedUpdate = () => {
    onClickHedUpd(item.key, item.text);
  }

  const rowDelete = () => {
    onClickDel(item.key);
  }

  const dtlUpdModal = (dtl_no, name) => {
    onClickDtlUpd(item.no, dtl_no, name);
  }

  const dtlDelModal = (dtl_no, name) => {
    onClickDtlDel(item.no, dtl_no, name);
  }

  const changeDisplay = flg => {
    if(flg) {
      return "block";
    }else {
      return "none";
    }
  }

  /* 詳細ソートボタンの表示/非表示(false/true) */
  const sortDisabled = flg => {
    var return_flg = true;

    /* 詳細表示＆２件以上でソートボタン表示 */
    if(flg && dtlItems.length > 1) {
      return_flg = false;
    }

    return return_flg;
  }

  const dtlStyle = {
    display: changeDisplay(showDtl),
  };

  const style = {
    padding: 0,
    margin: 0,
  };

  return (
    <div>
      {/* HED */}
      <label className={classNames("panel-block", "columns")} style={ style }>
        <div className={classNames("column", "is-8", "click-list", "pad5mar0")} onClick={onListClick}>
          <div className={classNames("columns", "click-list")} onClick={onListClick}>
            <div className={classNames("column", "is-4", "click-list")} onClick={onListClick}>
              <input
                id="list_input"
                type="checkbox"
                checked={item.done}
                onChange={checkboxChange}
              />
              <span
                className={classNames({
                  'has-text-grey-light': item.done
                }, "medText"+sizeClass)}
              >
                {item.text}
              </span>
            </div>
            <div className={classNames("column", "is-8", "click-list")} onClick={onListClick}>
              <span className={"medText"+sizeClass}>
                [ {item.shimebi+' '+('00'+item.shimetime).slice(-2)+':'+('00'+item.shimemin).slice(-2)} ]
              </span>
            </div>
          </div>
        </div>
        <div className={classNames("column", "is-2", "pad5mar0")} onClick={noClickEvent}>
          <span className={"pad5mar0"}>
            <button onClick={dtlAdd}><span className={"medBtnFont"+sizeClass}>追加</span></button>
          </span>
          <span className={"pad5mar0"}>
            <button onClick={dtlSort} disabled={sortDisabled(showDtl)}><span className={"medBtnFont"+sizeClass}>並び順</span></button>
          </span>
        </div>
        <div className={classNames("column", "is-2", "pad5mar0")} onClick={noClickEvent}>
          <span className={"pad5mar0"}>
            <button onClick={hedUpdate}><span className={"medBtnFont"+sizeClass}>編集</span></button>
          </span>
          <span className={"pad5mar0"}>
            <button onClick={rowDelete}><span className={"medBtnFont"+sizeClass}>削除</span></button>
          </span>
        </div>
      </label>

      {/* DTL */}
      <label className={classNames("columns", "pad0mar0")} onClick={noClickEvent} style={ dtlStyle }>
        <div className={classNames("column", "pad0mar0")} onClick={noClickEvent}>
          <label className={classNames("columns", "pad0mar0")} onClick={noClickEvent}>
            <div className={classNames("column", "is-1", "pad5mar0")} onClick={noClickEvent}>
            </div>
            <div className={classNames("column", "is-11", "pad5mar0")} onClick={noClickEvent}>
              {/* 詳細中身 */}
              {dtlItems.map(item => (
                <TodoDtl
                  key={item.no}
                  item={item}
                  dtlUpdate={dtlUpdModal}
                  dtlDelete={dtlDelModal}
                  onLoading={onLoading}
                  sizeClass={sizeClass}
                />
              ))}
            </div>
          </label>
        </div>
      </label>

    </div>
  );
}

/* 詳細部分中身 */
function TodoDtl({ item, dtlUpdate, dtlDelete, onLoading, sizeClass }) {

  const noClickEvent = e => {
    /* リスト内の要素のイベントは動かさない */
    e.preventDefault();
  }

  const onClickUpd = () => {
    dtlUpdate(item.dtl_no, item.name);
  }

  const onClickDel = () => {
    dtlDelete(item.dtl_no, item.name);
  }

  const style3 = {
    padding: 0,
    margin: 0,
    borderBottom: 'solid 1px #f5f5f5',
  }

  return (
    <label className={classNames("columns")} style={ style3 }>
      <div className={classNames("column", "is-10", "pad5mar0")} onClick={noClickEvent}>
        <span className={"medText"+sizeClass}>
          {item.name}
        </span>
      </div>
      <div className={classNames("column", "is-12", "pad5mar0")}>
        <span className={"pad5mar0"}>
          <button onClick={onClickUpd}><span className={"medBtnFont"+sizeClass}>編集</span></button>
        </span>
        <span className={"pad5mar0"}>
          <button onClick={onClickDel}><span className={"medBtnFont"+sizeClass}>削除</span></button>
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
    <div className={"panel-block"}>
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

/* フィルター */
function Filter({ value, onChange, sizeClass }) {
  const handleClick = (key, e) => {
    e.preventDefault();
    onChange(key);
  };

  return (
    <div className={"panel-tabs"}>
      <a
        href="#"
        onClick={handleClick.bind(null, 'ALL')}
        className={classNames({ 'is-active': value === 'ALL' }), "medBtnFont"+sizeClass}
      >All</a>
      <a
        href="#"
        onClick={handleClick.bind(null, 'TODO')}
        className={classNames({ 'is-active': value === 'TODO' }), "medBtnFont"+sizeClass}
      >ToDo</a>
      <a
        href="#"
        onClick={handleClick.bind(null, 'DONE')}
        className={classNames({ 'is-active': value === 'DONE' }), "medBtnFont"+sizeClass}
      >Done</a>
    </div>
  );
}

/* 初期処理 */
function ListMain() {
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

      /* 初期表示 */
      if(location.state.no!=null) {
        fetch('/list_main?user_id='+location.state.user.user_id+'&group_no='+location.state.no+'&name='+location.state.name+'&color='+location.state.color)
          .then((res) => res.json())
          .then(
            (data) => {
              if(data.result===1) {
                setArray(data.data);
              }
              setListArray(data.listData);
              setMainArray(location.state.data);
            }
          );
      /* ソートからの「戻る」 */
      }else if(location.state.data!=null) {
        setArray(location.state.data);
        setListArray(location.state.listData);
        setMainArray(location.state.mainData);
      }
    }
  
  },[])


  return (
    <div className={classNames("container", "is-fluid")}>
      <Todo userData={ userData } array={ array } listArray={ listArray } mainArray={ mainArray } />
    </div>
  );
}

export default ListMain;
