import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import UserEdit from './UserEdit';
import Main from './Main';
import ListMain from './ListMain';
import ListEdit from './ListEdit';
import HedSort from './HedSort';
import DtlSort from './DtlSort';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/UserEdit" component={UserEdit} />
        <Route exact path="/Main" component={Main} />
        <Route exact path="/ListMain" component={ListMain} />
        <Route exact path="/ListEdit" component={ListEdit} />
        <Route exact path="/HedSort" component={HedSort} />
        <Route exact path="/DtlSort" component={DtlSort} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
