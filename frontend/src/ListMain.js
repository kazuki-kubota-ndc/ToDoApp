import React,{ useState,useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

import 'bulma/css/bulma.min.css';


/* リスト表示 */
function Todo({ array, listArray, mainArray }) {

  /* リストNoとリスト名 */
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

  /* 戻るで返却する用のデータ */
  const [mainDatas, setMainDatas] = React.useState([]);

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

  /* リスト名編集確認ダイアログ */
  const showUpdModal = (no, text) => {

    /* 確認後の処理内容をセット */
    const data = new Map();
    data.action = 'update';
    data.no = no;
    data.name = '';
    setDatas(data);
    /* モーダル情報をセット */
    const modalData = new Map();
    modalData.title = 'リスト名称変更';
    modalData.text = 'リスト名を入力して下さい';
    modalData.execName = '変更';
    modalData.phName = text;
    modalData.model = 'input';
    setModalDatas(modalData);
    setShowModal(true);
  }

  /* リスト名変更のデータをセット */
  const changeDatas = text => {
    const data = datas;
    data.name = text;
    setDatas(data);
  }

  /* リスト名変更処理 */
  const rowUpdate = () => {
    const newItems = items.map(item => {
      if (item.key === datas.no) {
        item.text = datas.name;
      }
      return item;
    });
    setItems(newItems);

    fetch('/update_hed_name?group_no='+listDatas.group_no+'&no='+datas.no+'&name='+datas.name)
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
    fetch('/update_check?group_no='+listDatas.group_no+'&no='+checked.key+'&check_flg='+check_flg)
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

    fetch('/delete_hed?group_no='+listDatas.group_no+'&no='+no)
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
    history.push({ pathname: '/HedSort', state: { data: items, listData: listDatas, mainData: mainDatas }});
  }

  /* inputタブでEnterを押した時の処理 */
  const handleAdd = text => {
    if(text.trim()==='') {
      alert('List Name is empty');
      return;
    }

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

    fetch('/insert_hed?group_no='+listDatas.group_no+'&no='+insert_no+'&name='+text+'&sort='+insert_sort)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            setItems([...items, { key: data.no, no: data.no, text: data.name, name: data.name, done: false, sort: data.sort }]);
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
  };

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

    fetch('/insert_dtl?group_no='+group_no+'&no='+no+'&name='+name)
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

      fetch('/select_dtl?group_no='+group_no+'&no='+no)
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

    fetch('/update_dtl_name?group_no='+listDatas.group_no+'&no='+no+'&dtl_no='+dtl_no+'&name='+name)
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

    fetch('/delete_dtl?group_no='+listDatas.group_no+'&no='+no+'&dtl_no='+dtl_no)
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
    history.push({ pathname: '/', state: { data: mainDatas }});
  }

  /* フィルターを変えた時の処理 */
  const handleFilterChange = value => setFilter(value);

  /* リスト表示のフィルター処理 */
  const displayItems = items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'TODO') return !item.done;
    if (filter === 'DONE') return item.done;
  });

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
            onClickOk={modalOk}
            onClickClose={modalClose}
          />
        </ReactModal>
        <div class="panel">
          {/* ヘッダー */}
            { listDatas && <div class="panel-heading">{listDatas.name}</div> }
          {/* テキスト入力欄 */}
          <Input onAdd={handleAdd} isLoading={ loading } />
          {/* フィルター */}
          <Filter
            onChange={handleFilterChange}
            value={filter}
          />
          {/* リスト表示部分 */}
          {displayItems.map(item => (
            <TodoItem
              key={item.key}
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
            />
          ))}
          {/* フッター */}
          <div class="panel-block" style={style}>
            <span class="column is-8" style={style2}>
              全 {items.length} 件
            </span>
            <span class="column is-2" align="center" style={style2}>
              <button onClick={onClickSort} disabled={sortDisabled}>並び順変更</button>
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
function ModalInside({ modalData, onChangeInput, onClickOk, onClickClose }) {
  const model = modalData.model;

  const inputChange = e => {
    onChangeInput(e.target.value);
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
  }else if(model==='input') {
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

/* リスト中身 */
function TodoItem({ items, setItems, item, onCheck, onClickDel, onClickHedUpd, onLoading, onClickDtlAdd, onClickDtlUpd, onClickDtlDel, listData, mainData }) {

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
    if(e.target.id==='list_div') {
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
    fetch('/select_dtl?group_no='+listData.group_no+'&no='+item.no)
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
              history.push({ pathname: '/DtlSort', state: { data: data.data, listData: listData, title: item.name, no: item.no, mainData: mainData }});
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
      history.push({ pathname: '/DtlSort', state: { data: dtlItems, listData: listData, title: item.name, no: item.no, items: items, mainData: mainData }});
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

  const style = {
    padding: 0,
    margin: 0,
  };

  const style2 = {
    padding: 5,
    margin: 0,
  }

  const dtlStyle = {
    padding: 5,
    margin: 0,
    display: changeDisplay(showDtl),
  };

  return (
    <div>
      {/* HED */}
      <label class="panel-block columns" style={ style }>
        <div id="list_div" class="column is-8" onClick={onListClick} style={ style2 }>
          <input
            id="list_input"
            type="checkbox"
            checked={item.done}
            onChange={checkboxChange}
          />
          <span
            className={classNames({
              'has-text-grey-light': item.done
            })}
          >
            {item.text}
          </span>
        </div>
        <div class="column is-2" onClick={noClickEvent} style={ style2 }>
          <span style={ style2 }>
            <button onClick={dtlAdd}>追加</button>
          </span>
          <span style={ style2 }>
            <button onClick={dtlSort} disabled={sortDisabled(showDtl)}>並び順</button>
          </span>
        </div>
        <div class="column is-2" onClick={noClickEvent} style={ style2 }>
          <span style={ style2 }>
            <button onClick={hedUpdate}>編集</button>
          </span>
          <span style={ style2 }>
            <button onClick={rowDelete}>削除</button>
          </span>
        </div>
      </label>

      {/* DTL */}
      <label class="columns" onClick={noClickEvent} style={ dtlStyle }>
        <div class="column" onClick={noClickEvent} style={ style }>
          <label class="columns" onClick={noClickEvent} style={ style }>
            <div class="column is-1" onClick={noClickEvent} style={ style2 }>
            </div>
            <div class="column is-11" onClick={noClickEvent} style={ style2 }>
              {/* 詳細中身 */}
              {dtlItems.map(item => (
                <TodoDtl
                  key={item.no}
                  item={item}
                  dtlUpdate={dtlUpdModal}
                  dtlDelete={dtlDelModal}
                  onLoading={onLoading}
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
function TodoDtl({ item, dtlUpdate, dtlDelete, onLoading }) {

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

  const style2 = {
    padding: 5,
    margin: 0,
  }

  const style3 = {
    padding: 0,
    margin: 0,
    borderBottom: 'solid 1px #f5f5f5',
  }

  return (
    <label class="columns" style={ style3 }>
      <div class="column is-10" onClick={noClickEvent} style={ style2 }>
        {item.name}
      </div>
      <div class="column is-2" style={ style2 }>
        <span style={ style2 }>
          <button onClick={onClickUpd}>編集</button>
        </span>
        <span style={ style2 }>
          <button onClick={onClickDel}>削除</button>
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

/* フィルター */
function Filter({ value, onChange }) {
  const handleClick = (key, e) => {
    e.preventDefault();
    onChange(key);
  };

  return (
    <div class="panel-tabs">
      <a
        href="#"
        onClick={handleClick.bind(null, 'ALL')}
        className={classNames({ 'is-active': value === 'ALL' })}
      >All</a>
      <a
        href="#"
        onClick={handleClick.bind(null, 'TODO')}
        className={classNames({ 'is-active': value === 'TODO' })}
      >ToDo</a>
      <a
        href="#"
        onClick={handleClick.bind(null, 'DONE')}
        className={classNames({ 'is-active': value === 'DONE' })}
      >Done</a>
    </div>
  );
}

/* 初期処理 */
function ListMain() {
  const location = useLocation();
  const [array, setArray] = useState([{}]);
  const [listArray, setListArray] = useState({});
  const [mainArray, setMainArray] = useState([{}]);

  useEffect(() =>{
    /* 初期表示 */
    if(location.state.no!=null) {
      fetch('/init?group_no='+location.state.no+'&name='+location.state.name)
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
  
  },[])


  return (
    <div class="container is-fluid">
      <Todo array={ array } listArray={ listArray } mainArray={ mainArray } />
    </div>
  );
}

export default ListMain;
