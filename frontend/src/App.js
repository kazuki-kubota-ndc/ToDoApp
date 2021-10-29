import './App.css';
import React,{ useState,useEffect } from 'react';
import classNames from 'classnames'

import 'bulma/css/bulma.min.css';

const getKey = () => Math.random().toString(32).substring(2);

/* リスト表示 */
function Todo({ array }) {

  const [items, setItems] = React.useState([]);
  const [filter, setFilter] = React.useState('ALL');

  /* チェックボックスをチェックした時の処理 */
  const handleCheck = checked => {
    const newItems = items.map(item => {
      if (item.key === checked.key) {
        item.done = !item.done;
      }
      return item;
    });
    var check_flg = 0;
    if(checked.done) {
      check_flg = 1;
    }
    setItems(newItems);
    fetch('/update_check?no='+checked.key+'&check_flg='+check_flg)
      .then((res) => res.json())
      .then(
        (data) => {
          /* 更新失敗時 */
          if(!data.result==1) {
            alert('update failed');
            window.location.reload();
          }
        }
      );
  };

  /* テスト */
  const test = no => {
alert(no);
  }

  /* 削除処理 */
  const rowDelete = no => {
    function del_item(target) {
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
      setItems(newItems);
    }

    fetch('/delete?no='+no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result==1) {
            del_item(no);
          }else {
            alert('delete failed');
          }
        }
      );
  }

  /* inputタブでEnterを押した時の処理 */
  const handleAdd = text => {
    fetch('/insert?name='+text)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result==1) {
            setItems([...items, { key: data.key, text, done: false }]);
          }else {
            alert('insert failed');
          }
        }
      );
  };

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
      if(item.check_flg==1){
        done_flg = true;
      }
      item.done = done_flg;
      return item;
    });
    /* DBからのデータ取得前はリストを表示しない */
    if(array[0].key) {
      setItems(defaultItems);
    }
  }, [array]);

  return (
    <div className="panel">
      <div className="panel-heading">
         ToDo List
      </div>
      {/* テキスト入力欄 */}
      <Input onAdd={handleAdd} />
      {/* フィルター */}
      <Filter
        onChange={handleFilterChange}
        value={filter}
      />
      {/* リスト表示部分 */}
      {displayItems.map(item => (
        <TodoItem
          key={item.key}
          item={item}
          onCheck={handleCheck}
          onClickDel={rowDelete}
          modalTest={test}
         />
      ))}
      {/* フッター部分 */}
      <div className="panel-block">
        全 {items.length} 件
      </div>
    </div>

  );
}

/* リスト中身 */
function TodoItem({ item, onCheck, onClickDel, modalTest }) {

  const handleChange = () => {
    onCheck(item);
  };

  const row_delete = () => {
    onClickDel(item.key);
  }

  const style = {
    padding: 0,
    margin: 0,
  };

  const style2 = {
    padding: 5,
    margin: 0,
  }

  const modal_test = () => {
    modalTest(item.key);
  }

  return (
    <label class="columns" className="panel-block" style={ style }>
        <div class="column is-11" style={ style2 }>
          <input
            type="checkbox"
            checked={item.done}
            onChange={handleChange}
          />
          <span
            className={classNames({
              'has-text-grey-light': item.done
            })}
          >
            {item.text}
          </span>
        </div>
{/*        <div class="column is-1" style={ style2 }>
          <button onClick={modal_test}>テスト</button>
        </div>
*/}
        <div class="column is-1" style={ style2 }>
          <button onClick={row_delete}>削除</button>
        </div>
    </label>

  );
}

/* inputタグ */
function Input({ onAdd }) {
  const [text, setText] = React.useState('');

  const handleChange = e => setText(e.target.value);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onAdd(text);
      setText('');
    }
  };

  return (
    <div className="panel-block">
      <input
        class="input"
        type="text"
        placeholder="Enter to add"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
    <div className="panel-tabs">
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
function App() {
  const [array, setArray] = useState([{}]);

  useEffect(() =>{
    fetch('/api')
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result==1) {
            setArray(data.data);
          }
        }
      );
  },[])

  return (
    <div className="container is-fluid">
      <Todo array={ array }/>
    </div>
  );
}

export default App;
