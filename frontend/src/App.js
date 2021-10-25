import './App.css';
import React,{ useState,useEffect } from 'react';
import classNames from 'classnames'

import 'bulma/css/bulma.min.css';

const getKey = () => Math.random().toString(32).substring(2);

function Todo() {
  const [items, setItems] = React.useState([]);
  const [filter, setFilter] = React.useState('ALL');

  const handleCheck = checked => {
    const newItems = items.map(item => {
      if (item.key === checked.key) {
        item.done = !item.done;
      }
      return item;
    });
    setItems(newItems);
  };

  const handleAdd = text => {
    setItems([...items, { key: getKey(), text, done: false }]);
  };

  const handleFilterChange = value => setFilter(value);

  const displayItems = items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'TODO') return !item.done;
    if (filter === 'DONE') return item.done;
  });

  return (
    <div className="panel">
      <div className="panel-heading">
         ToDo List
      </div>
      <Input onAdd={handleAdd} />
      <Filter
        onChange={handleFilterChange}
        value={filter}
      />
      {displayItems.map(item => (
        <TodoItem
          key={item.text}
          item={item}
          onCheck={handleCheck}
         />
      ))}
      <div className="panel-block">
        {items.length} items
      </div>
    </div>
  );
}

function TodoItem({ item, onCheck }) {

  const handleChange = () => {
    onCheck(item);
  };

  return (
    <label className="panel-block">
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
    </label>
  );
}

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

function App() {

  const [message, setMessage] = useState('');
  useEffect(() =>{
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  },[])

  return (
    <div className="container is-fluid">
      <Todo />
      <p>{ message }</p>
    </div>
  );
}

export default App;
