import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { IconContext } from 'react-icons';
import { MdOutlineAdd } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GiAlarmClock } from 'react-icons/gi';
import { VscTasklist } from 'react-icons/vsc';


import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

//import 'bulma/css/bulma.min.css';

import AddListModal from './AddListModal';
import AddTaskModal from './AddTaskModal';
import AddUserModal from './AddUserModal';
import AddCommentModal from './AddCommentModal';
import MenuModal from './MenuModal';
import CenterModal from './CenterModal';
import TaskModal from './TaskModal';
import UserModal from './UserModal';
import PassModal from './PassModal';
import UserEditModal from './UserEditModal';



/* メイン画面 */
export const Login = ({ userData, array, listArray }) => {

  /* ユーザーデータ */
  const [user, setUser] = React.useState({});
  /* 表示サイズ */
  const [sizeClass, setSizeClass] = React.useState('Med');

  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(true);
  const [loadingTask, setLoadingTask] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [loadingUserEdit, setLoadingUserEdit] = React.useState(true);
  /* AddListダイアログの開閉ステータス */
  const [showAddList, setShowAddList] = React.useState(false);
  /* AddListダイアログのデータ */
  const [addListData, setAddListData] = React.useState(new Map());
  /* AddTaskダイアログの開閉ステータス */
  const [showAddTask, setShowAddTask] = React.useState(false);
  /* AddTaskダイアログのデータ */
  const [addTaskData, setAddTaskData] = React.useState(new Map());
  /* AddCommentダイアログの開閉ステータス */
  const [showAddComment, setShowAddComment] = React.useState(false);
  /* AddCommentダイアログのデータ */
  const [addCommentData, setAddCommentData] = React.useState(new Map());
  /* Menuダイアログの開閉ステータス */
  const [showMenu, setShowMenu] = React.useState(false);
  /* Menuダイアログのデータ */
  const [menuDatas, setMenuDatas] = React.useState([{}]);
  /* Centerダイアログの開閉ステータス */
  const [showCenter, setShowCenter] = React.useState(false);
  /* Centerダイアログのデータ */
  const [centerData, setCenterData] = React.useState(new Map());
  /* Taskのデータ */
  const [taskDatas, setTaskDatas] = React.useState([{}]);
  /* Taskダイアログの開閉ステータス */
  const [showTask, setShowTask] = React.useState(false);
  const newTaskData = new Map();
  newTaskData.list_no = '0';
  newTaskData.list_name = '';
  newTaskData.list_color = 'cdcdcd';
  /* Taskダイアログのデータ */
  const [taskData, setTaskData] = React.useState(newTaskData);
  /* Userダイアログの開閉ステータス */
  const [showUser, setShowUser] = React.useState(false);
  /* Passダイアログの開閉ステータス */
  const [showPass, setShowPass] = React.useState(false);
  /* UserEditダイアログの開閉ステータス */
  const [showUserEdit, setShowUserEdit] = React.useState(false);
  /* Userリスト情報 */
  const [userItems, setUserItems] = React.useState([]);
  /* AddUserダイアログの開閉ステータス */
  const [showAddUser, setShowAddUser] = React.useState(false);
  /* AddUserダイアログのデータ */
  const [addUserData, setAddUserData] = React.useState(new Map());
  /* UserUpdate用のデータ */
  const [updateUserId, setUpdateUserId] = React.useState('');

  /* リストデータ(リスト件数) */
  const [listDatas, setListDatas] = React.useState({});
  /* リストデータ */
  const [items, setItems] = React.useState([]);

  /* 現在表示中のタブのlist_no */
  const [tabListNo, setTabListNo] = React.useState('');
  /* タブのカラー */
  const [tabColor, setTabColor] = React.useState('');
  /* タブのカラー */
  const [tabName, setTabName] = React.useState('');

  /* ウインドウサイズ（高さ） */
  const [innerHeight, setInnerHeight] = React.useState('');

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

  /* リスト追加ボタン */
  const onClickAddList = () => {
    const newAddListData = new Map();
    newAddListData.action = 'insert';
    newAddListData.execName = '追加';
    setAddListData(newAddListData);
    openAddList();
  }

  /* リスト編集ボタン */
  const listEdit = (list_no, list_name, list_color) => {
    const newAddListData = new Map();
    newAddListData.action = 'update';
    newAddListData.execName = '変更';
    newAddListData.list_no = list_no;
    newAddListData.list_name = list_name;
    newAddListData.list_color = list_color;
    setAddListData(newAddListData);
    openAddList();;
  }

  /* リスト削除 */
  const listDel = (list_no, list_name) => {
    const newCenterData = new Map();
    newCenterData.action = 'list_delete';
    newCenterData.list_no = list_no;
    newCenterData.title = 'リスト削除[ '+list_name+' ]';
    newCenterData.text = 'リストを削除します。よろしいですか？';
    newCenterData.execName = '削除';
    setCenterData(newCenterData);
    setShowCenter(true);
  }


/* --------------------AddListModal-------------------- */

  /* AddListモーダルを開いた時の処理 */
  const addListOpen = () => {

  }

  /* AddListモーダルを閉めた時の処理 */
  const addListClose = () => {
    setShowAddList(false);
//    setLoading(false);
  }

  /* AddListモーダルを開く */
  const openAddList = () =>{
    setShowAddList(true);
  }

  const addList = addData => {
    setShowAddList(false);

    /* ローディング表示 */
    setLoading(true);

    /* リスト追加 */
    if(addListData.action=='insert') {

      fetch('/insert_list?user_id='+user.user_id+'&list_name='+addData.list_name+'&list_color='+(addData.list_color).replace('#', ''))
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newItems = [...items, {
                list_no: data.list_no,
                list_name: addData.list_name,
                list_color: (addData.list_color).replace('#', ''),
                task_cnt: '0'
              }];
              setItems(newItems);
              setLoading(false);
            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setLoading(false);
            }
          }
        );

    /* リスト編集 */
    }else if(addListData.action=='update') {

      fetch('/update_list?user_id='+user.user_id+'&list_no='+addListData.list_no+'&list_name='+addData.list_name+'&list_color='+(addData.list_color).replace('#', ''))
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newItems = items.map(item => {
                if(item.list_no==addListData.list_no) {
                  item.list_name = addData.list_name;
                  item.list_color = (addData.list_color).replace('#', '');
                }
                return item;
              });
              setItems(newItems);
              setLoading(false);
            }else {
              alert('更新処理に失敗しました');
              /* ローディング非表示 */
              setLoading(false);
            }
          }
        );

    }
  }

/* --------------------AddTaskModal-------------------- */

  /* AddTaskモーダルを開いた時の処理 */
  const addTaskOpen = () => {

  }

  /* AddTaskモーダルを閉めた時の処理 */
  const addTaskClose = () => {
    setShowAddTask(false);
//    setLoading(false);
  }

  /* AddTaskモーダルを開く */
  const openAddTask = () =>{
    const newAddTaskData = {
      
    }
    setAddTaskData(newAddTaskData);
    setShowAddTask(true);
  }

  /* タスク追加実行 */
  const addTask = sendTaskData => {

    setShowAddTask(false);

    /* ローディング表示 */
    setLoadingTask(true);

    var sendData = '?task_name='+sendTaskData.task_name
                 + '&task_color='+(sendTaskData.task_color).replace('#', '')
                 + '&task_dtl='+sendTaskData.dtl.replace(/\r?\n/g, '%0A')
                 + '&task_date='+sendTaskData.date
                 + '&shime_time='+sendTaskData.shime_time
                 + '&shime_min='+sendTaskData.shime_min
                 + '&time_add_flg='+sendTaskData.time_add_flg
                 + '&task_check='+sendTaskData.task_check
                 + '&list_no='+addTaskData.list_no
                 + '&user_id='+user.user_id
                 ;

    if(addTaskData.action=='insert') {

      fetch('/insert_task'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              var task_cnt = 0;
              /* リストデータのタスク数を+1する */
              const newItems = items.map(item => {
                if(item.list_no==addTaskData.list_no) {
                  item.task_cnt = Number(item.task_cnt)+1;
                  task_cnt = item.task_cnt;
                }
                return item;
              });
              setItems(newItems);

              if(task_cnt==1) {
                const newTaskDatas = [{
                  task: data.task_no,
                  task_name: sendTaskData.task_name,
                  task_color: (sendTaskData.task_color).replace('#', ''),
                  task_check: sendTaskData.task_check,
                  dtl: sendTaskData.dtl,
                  shimebi: sendTaskData.date,
                  shime_time: sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_time,
                  shime_min: sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_min,
                  sub_cnt: 0,
                }];
                setTaskDatas(newTaskDatas);
                const newTaskData = taskData;
                newTaskData.task_cnt = 1;
                setTaskData(newTaskData);
              }else {
                const newTaskDatas = [...taskDatas, {
                  task: data.task_no,
                  task_name: sendTaskData.task_name,
                  task_color: (sendTaskData.task_color).replace('#', ''),
                  task_check: sendTaskData.task_check,
                  dtl: sendTaskData.dtl,
                  shimebi: sendTaskData.date,
                  shime_time: sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_time,
                  shime_min: sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_min,
                  sub_cnt: 0,
                }];
                setTaskDatas(newTaskDatas);
              }

              setLoadingTask(false);
            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTask(false);
            }
          }
        );

    }else if(addTaskData.action=='update') {
      sendData += '&task_no='+addTaskData.task_no;

      fetch('/update_task'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {

              const newTaskDatas = taskDatas.map(item => {
                if(item.task==addTaskData.task_no) {
                  item.task_name = sendTaskData.task_name;
                  item.task_color = (sendTaskData.task_color).replace('#', '');
                  item.task_check = sendTaskData.task_check;
                  item.dtl = sendTaskData.dtl;
                  item.shimebi = sendTaskData.date;
                  item.shime_time = sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_time;
                  item.shime_min = sendTaskData.time_add_flg=='0' ? '' : sendTaskData.shime_min;
                }
                return item;
              });
              setTaskDatas(newTaskDatas);

              setLoadingTask(false);
            }else {
              alert('更新処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTask(false);
            }
          }
        );

    }

  }

/* --------------------AddCommentModal-------------------- */

  /* AddCommentモーダルを開いた時の処理 */
  const addCommentOpen = () => {

  }

  /* AddCommentモーダルを閉めた時の処理 */
  const addCommentClose = () => {
    setShowAddComment(false);
//    setLoading(false);
  }

  /* AddCommentモーダルを開く */
  const openAddComment = () =>{
    const newAddCommentData = {
      
    }
    setAddCommentData(newAddCommentData);
    setShowAddComment(true);
  }

  const addComment = addCommentData => {
    setShowAddComment(false);

    /* 追加 */
    if(addCommentData.action=='insert') {
      /* ローディング表示 */
      setLoadingTask(true);

      fetch('/insert_sub?user_id='+user.user_id+'&list_no='+addCommentData.list_no+'&task_no='+addCommentData.task_no+'&comment='+addCommentData.comment)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              /* タスクデータにコメントを追加、コメント数を+1する */
              const newTaskDatas = taskDatas.map(item => {
                if(item.task==addCommentData.task_no) {
                  item.sub_cnt = String(Number(item.sub_cnt)+1);
                  item.subDatas = data.sub_datas;
                  item.comment = true;
                  item.show_comment = true;
                }
                return item;
              });
              setTaskDatas(newTaskDatas);
              setLoadingTask(false);
            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTask(false);
            }
          }
        );
    /* 編集 */
    }else if(addCommentData.action=='update') {

      /* ローディング表示 */
      setLoadingTask(true);

      fetch('/update_sub?user_id='+user.user_id+'&list_no='+addCommentData.list_no+'&task_no='+addCommentData.task_no+'&comment='+addCommentData.comment+'&sub_no='+addCommentData.sub_no)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              /* タスクデータを更新 */
              const newTaskDatas = taskDatas.map(item => {
                if(item.task==addCommentData.task_no) {
                  const newSubDatas = (item.subDatas).map(subData => {
                    if(subData.sub_no==addCommentData.sub_no) {
                      subData.sub_name = addCommentData.comment;
                    }
                    return subData;
                  });
                }
                return item;
              });
              setTaskDatas(newTaskDatas);
              setLoadingTask(false);
            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTask(false);
            }
          }
        );
    }
  }


/* --------------------MenuModal-------------------- */

  /* Menuモーダルを開いた時の処理 */
  const menuOpen = () => {

  }

  /* Menuモーダルを閉めた時の処理 */
  const menuClose = () => {
    setShowMenu(false);
//    setLoading(false);
  }

  /* Menuモーダルを開く */
  const openMenu = () =>{
    const newMenuDatas = [];
    newMenuDatas.push({
      menu_no: 1,
      menu_name: 'アカウント情報',
    });
    newMenuDatas.push({
      menu_no: 2,
      menu_name: 'ログアウト',
    });
    if(user.admin=='1') {
      newMenuDatas.push({
        menu_no: 3,
        menu_name: 'ユーザー管理',
      });
    }
    setMenuDatas(newMenuDatas);
    setShowMenu(true);
  }

  const goMyAccount = () => {
    setShowMenu(false);
    setShowUser(true);
  }

  const goUserEdit = () => {
    setShowMenu(false);
    setShowUserEdit(true);
  }

/* --------------------CenterModal-------------------- */

  /* Centerモーダルを開いた時の処理 */
  const centerOpen = () => {

  }

  /* Centerモーダルを閉めた時の処理 */
  const centerClose = () => {
    setShowCenter(false);
//    setLoading(false);
  }

  /* Centerモーダルを開く */
  const openCenter = () =>{
    setShowCenter(true);
  }

  /* OKボタンの処理 */
  const centerOk = () => {
    /* モーダル閉じる */
    setShowCenter(false);

    /* リスト削除処理 */
    if(centerData.action==='list_delete') {

      setLoading(true);

      fetch('/delete_list?user_id='+user.user_id+'&list_no='+centerData.list_no)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              var index = 0;
              var del_index = -1;
              items.map(item => {
                if(item.list_no==centerData.list_no) {
                  del_index = index;
                }
                index++;
              });
              const newItems = [...items];
              newItems.splice(del_index,1);
              setItems(newItems);
              setLoading(false);
            }else {
              alert('削除処理に失敗しました');
              /* ローディング非表示 */
              setLoading(false);
            }
          }
        );
    /* タスク削除 */
    }else if(centerData.action==='task_delete') {

      setLoadingTask(true);

      fetch('/delete_task?user_id='+user.user_id+'&list_no='+centerData.list_no+'&task_no='+centerData.task_no)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              var index = 0;
              var del_index = -1;
              taskDatas.map(taskData => {
                if(taskData.task==centerData.task_no) {
                  del_index = index;
                }
                index++;
              });
              const newTaskDatas = [...taskDatas];
              newTaskDatas.splice(del_index,1);
              setTaskDatas(newTaskDatas);
              /*リストデータのタスク数を-1する*/
              const newItems = items.map(item => {
                if(item.list_no == centerData.list_no) {
                  item.task_cnt = Number(item.task_cnt)-1;
                }
                return item;
              });
              setItems(newItems);
              setLoadingTask(false);
            }else {
              alert('削除処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTask(false);
            }
          }
        );
    /* ユーザー削除 */
    }else if(centerData.action==='user_delete') {

      setLoadingUserEdit(true);

      fetch('/delete_user?user_id='+centerData.user_id)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              var index = 0;
              var del_index = -1;
              userItems.map(userItem => {
                if(userItem.user_id==centerData.user_id) {
                  del_index = index;
                }
                index++;
              });
              const newUserItems = [...userItems];
              newUserItems.splice(del_index,1);
              setUserItems(newUserItems);
              setLoadingUserEdit(false);
            }else {
              alert('削除処理に失敗しました');
              /* ローディング非表示 */
              setLoadingUserEdit(false);
            }
          }
        );
    }
  }

/* --------------------TaskModal-------------------- */

  /* Taskモーダルを開いた時の処理 */
  const taskOpen = () => {

  }

  /* Taskモーダルを閉めた時の処理 */
  const taskClose = () => {
    setShowTask(false);
//    setLoading(false);
  }

  /* Taskモーダルを開く */
  const openTask = () =>{
    setShowTask(true);
  }

/* --------------------UserModal-------------------- */

  /* Userモーダルを開いた時の処理 */
  const userOpen = () => {

  }

  /* Userモーダルを閉めた時の処理 */
  const userClose = () => {
    setShowUser(false);
//    setLoading(false);
  }

  /* Userモーダルを開く */
  const openUser = () =>{
    setShowUser(true);
  }

/* --------------------PassModal-------------------- */

  /* Passモーダルを開いた時の処理 */
  const passOpen = () => {

  }

  /* Passモーダルを閉めた時の処理 */
  const passClose = () => {
    setShowPass(false);
//    setLoading(false);
  }

  /* Passモーダルを開く */
  const openPass = () =>{
    setShowPass(true);
  }

/* --------------------UserEditModal-------------------- */

  /* UserEditモーダルを開いた時の処理 */
  const userEditOpen = () => {

  }

  /* UserEditモーダルを閉めた時の処理 */
  const userEditClose = () => {
    setShowUserEdit(false);
//    setLoading(false);
  }

  /* UserEditモーダルを開く */
  const openUserEdit = () =>{
    setShowUserEdit(true);
  }

/* --------------------AddUserModal-------------------- */

  /* AddUserモーダルを開いた時の処理 */
  const addUserOpen = () => {

  }

  /* AddUserモーダルを閉めた時の処理 */
  const addUserClose = () => {
    setShowAddUser(false);
//    setLoading(false);
  }

  /* AddUserモーダルを開く */
  const openAddUser = () =>{
    setShowAddUser(true);
  }

  const addUser = addUser_data => {
    setShowAddUser(false);

    setLoadingUserEdit(true);

    var sendData = '?login_id='+addUser_data.login_id
                 + '&user_name='+addUser_data.user_name
                 + '&admin='+addUser_data.admin
                 + '&font_size='+addUser_data.font_size
                 + '&pass='+addUser_data.pass
                 ;

    if(addUserData.action=='insert') {

      fetch('/insert_user'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              const newUserItems = [...userItems, {
                                   user_id: data.user_id,
                                   login_id: addUser_data.login_id,
                                   user_name: addUser_data.user_name,
                                   admin: addUser_data.admin,
                                   font_size: addUser_data.font_size
                                 }];
              setUserItems(newUserItems);
              setLoadingUserEdit(false);
            }else if(data.result===2) {
              alert('[ '+addUser_data.login_id+' ] は使用できないユーザーIDです');
              setLoadingUserEdit(false);
            }else {
              alert('登録処理に失敗しました');
              setLoadingUserEdit(false);
            }
          }
        );

    }else if(addUserData.action=='update') {

      sendData += '&user_id='+addUser_data.user_id;

      fetch('/update_user'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
  
              const newUserItems = userItems.map(userItem => {
                if(userItem.user_id==addUser_data.user_id) {
                  userItem.login_id = addUser_data.login_id;
                  userItem.user_name = addUser_data.user_name;
                  userItem.admin = addUser_data.admin;
                  userItem.font_size = addUser_data.font_size;
                }
                return userItem;
              });
              setUserItems(newUserItems);
              setLoadingUserEdit(false);
              if(user.user_id==addUser_data.user_id) {
                const newUser = user;
                newUser.login_id = addUser_data.login_id;
                newUser.admin = addUser_data.admin;
                newUser.o_font = Number(addUser_data.font_size);
                newUser.user_name = addUser_data.user_name;
                setUser(newUser);
                if(addUser_data.font_size=='0') {
                  setSizeClass('Small');
                }else if(addUser_data.font_size=='1') {
                  setSizeClass('Med');
                }else if(addUser_data.font_size=='2') {
                  setSizeClass('Large');
                }
              }

            }else if(data.result===2) {
              alert('[ '+addUser_data.login_id+' ] は使用できないユーザーIDです');
              setLoadingUserEdit(false);
            }else {
              alert('更新処理に失敗しました');
              setLoadingUserEdit(false);
            }
          }
        );
    }

  }


  function reportWindowSize() {
    setInnerHeight(window.innerHeight);
  }

  window.onresize = reportWindowSize;

/* --------------------useEffect-------------------- */

  useEffect(() => {
    setUser(userData);
    var font = 'Med';
    if(userData.o_font==0) {
      font = 'Small';
    }else if(userData.o_font==1) {
      font = 'Med';
    }else if(userData.o_font==2) {
      font = 'Large';
    }
    setSizeClass(font);
    reportWindowSize();
  }, [userData]);

  /* DBから取得したデータを初期データとしてセット */
  useEffect(() => {
    const defaultItems = array.map(item => {
      item.key = item.list_no;
      return item;
    });
    /* DBからのデータ取得前はリストを表示しない */
    if(array[0].key) {
      setItems(defaultItems);
      if(tabColor=='') {
        setTabColor('#'+defaultItems[0].list_color);
      }
      if(tabName=='') {
        setTabName(defaultItems[0].list_name);
      }
    }

  }, [array]);

  useEffect(() => {
    setListDatas(listArray);
    if(listArray[0].cnt || listArray[0].cnt=='0') {
      setLoading(false);
    }
  }, [listArray]);

/* --------------------Style-------------------- */

  const headerStyle = {
     background: tabColor,
  }

  var menu_size = '26px';
  var add_size = '20px';
  if(sizeClass=='Small') {
    menu_size = '22px';
    add_size = '16px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
    add_size = '28px';
  }


/* --------------------本体-------------------- */

  return (
    <div>
      {/* Taskモーダル */}
      <TaskModal
        showModal={showTask}
        modalOpen={taskOpen}
        modalClose={taskClose}
        modalData={taskData}
        setModalData={setTaskData}
        taskDatas={taskDatas}
        setTaskDatas={setTaskDatas}
        items={items}
        setItems={setItems}
        user={user}
        openMenu={openMenu}
        setCenterData={setCenterData}
        setShowCenter={setShowCenter}
        setShowAddTask={setShowAddTask}
        addTaskData={addTaskData}
        setAddTaskData={setAddTaskData}
        setShowAddComment={setShowAddComment}
        setAddCommentData={setAddCommentData}
        loadingTask={loadingTask}
        setLoadingTask={setLoadingTask}
        sizeClass={sizeClass}
      />
      {/* UserEditモーダル */}
      <UserEditModal
        showModal={showUserEdit}
        modalOpen={userEditOpen}
        modalClose={userEditClose}
        userItems={userItems}
        setUserItems={setUserItems}
        user={user}
        setUser={setUser}
        setShowAddUser={setShowAddUser}
        addUserData={addUserData}
        setAddUserData={setAddUserData}
        setCenterData={setCenterData}
        setShowCenter={setShowCenter}
        loadingUserEdit={loadingUserEdit}
        setLoadingUserEdit={setLoadingUserEdit}
        sizeClass={sizeClass}
      />
      {/* AddListモーダル */}
      <AddListModal
        showModal={showAddList}
        modalOpen={addListOpen}
        modalClose={addListClose}
        modalData={addListData}
        setModalData={setAddListData}
        addList={addList}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
      {/* AddTaskモーダル */}
      <AddTaskModal
        showModal={showAddTask}
        modalOpen={addTaskOpen}
        modalClose={addTaskClose}
        modalData={addTaskData}
        setModalData={setAddTaskData}
        addTask={addTask}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
      {/* AddCommentモーダル */}
      <AddCommentModal
        showModal={showAddComment}
        modalOpen={addCommentOpen}
        modalClose={addCommentClose}
        modalData={addCommentData}
        setModalData={setAddCommentData}
        addComment={addComment}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
      {/* Menuモーダル */}
      <MenuModal
        showModal={showMenu}
        modalOpen={menuOpen}
        modalClose={menuClose}
        modalDatas={menuDatas}
        setModalDatas={setMenuDatas}
        userName={user.user_name}
        goMyAccount={goMyAccount}
        goUserEdit={goUserEdit}
        sizeClass={sizeClass}
      />
      {/* Centerモーダル */}
      <CenterModal
        showModal={showCenter}
        modalOpen={centerOpen}
        modalClose={centerClose}
        modalData={centerData}
        onClickOk={centerOk}
        onClickClose={centerClose}
        sizeClass={sizeClass}
      />

      {/* Userモーダル */}
      <UserModal
        showModal={showUser}
        modalOpen={userOpen}
        modalClose={userClose}
        user={user}
        setUser={setUser}
        setUpdateUserId={setUpdateUserId}
        setShowPass={setShowPass}
        loadingUser={loadingUser}
        setLoadingUser={setLoadingUser}
        sizeClass={sizeClass}
        setSizeClass={setSizeClass}
      />
      {/* AddUserモーダル */}
      <AddUserModal
        showModal={showAddUser}
        modalOpen={addUserOpen}
        modalClose={addUserClose}
        modalData={addUserData}
        setModalData={setAddUserData}
        addUser={addUser}
        sizeClass={sizeClass}
        innerHeight={innerHeight}
      />
      {/* Passモーダル */}
      <PassModal
        showModal={showPass}
        modalOpen={passOpen}
        modalClose={passClose}
        updateUserId={updateUserId}
        sizeClass={sizeClass}
      />

      <div className={classNames("panel", "height100P")}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
          <table className={"width100P"}>
            <tr>
              <td role="menu_btn" className={classNames("width10P")} onClick={openMenu}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </td>
              <td className={"width60P"}><span className={"title"+sizeClass}>{'リスト一覧'}</span></td>

            </tr>
          </table>
        </div>
        {/* リスト表示部分 */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>
            {items.map(item => (
              <ToDoList
                item={item}
                taskData={taskData}
                setTaskData={setTaskData}
                openTask={openTask}
                listDel={listDel}
                listEdit={listEdit}
                sizeClass={sizeClass}
              />
            ))}

            {/* リスト追加 */}
            <div className={classNames("addTask")}>
              <span onClick={onClickAddList}>
                <IconContext.Provider value={{ size: add_size }}>
                  <MdOutlineAdd />
                </IconContext.Provider>
              </span>
              <span className={"medText"+sizeClass} onClick={onClickAddList}><b>リスト追加</b></span>
            </div>

          </div>
        </div>
      </div>
      <Loader isLoading={ loading } />
    </div>
  );
}

/* リスト */
function ToDoList({ item, taskData, setTaskData, openTask, listDel, listEdit, sizeClass }) {

  /* リストクリック */
  const onClickList = () => {
    const newTaskData = taskData;
    newTaskData.list_no = item.list_no;
    newTaskData.list_name = item.list_name;
    newTaskData.list_color = item.list_color;
    newTaskData.task_cnt = item.task_cnt;
    setTaskData(newTaskData);
    openTask();
  }

  /* リスト編集 */
  const onClickEdit = e => {
    e.stopPropagation();
    listEdit(item.list_no, item.list_name, item.list_color);
  }

  /* リスト削除 */
  const onClickDel = e => {
    e.stopPropagation();
    listDel(item.list_no, item.list_name);
  }

  /* リストのラベルカラー */
  const labelColor = {
    background: '#'+item.list_color,
  }

  var list_name = '';
  var limit_cnt = 40;
  if(sizeClass=='Small') {
    limit_cnt = 50;
  }else if(sizeClass=='Large') {
    limit_cnt = 30;
  }
  if(item.list_name) {
    var text_array = (item.list_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        list_name += '...';
        break;
      }else {
        list_name += (item.list_name).charAt(i);
      }
    }
  }else {
    list_name = '';
  }

  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    edit_close_size = '40px';
  }

  return (
    <div className={classNames("listBox", "cursorPointer")} onClick={onClickList}>
      <table className={"width100P"}>
        <tr>
          <td style={labelColor} className={"taskLabel"}>
            <span>
              <IconContext.Provider value={{ size: '24px'}}>
                <VscTasklist />
              </IconContext.Provider>
            </span>
          </td>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width75P")}>
                  <span className={classNames("title"+sizeClass, "pad0marR20")}><b>{list_name}</b></span>
                  <span className={classNames("titleMod"+sizeClass)}>[ {item.task_cnt} ]</span>
                </td>
                <td align="right" className={classNames("width25P")}>
                  <span className={classNames("pad0marR20")} onClick={onClickEdit}>
                    <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                      <FiEdit />
                    </IconContext.Provider>
                  </span>
                  <span onClick={onClickDel}>
                    <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                      <AiOutlineCloseCircle />
                    </IconContext.Provider>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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



/* 初期処理 */
function Main() {
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [array, setArray] = useState([{}]);
  const [listArray, setListArray] = useState([{}]);

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

      /* list_data */
      fetch('/select_list?user_id='+location.state.user.user_id)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              setArray(data.data);
              setListArray([{ cnt: 1}]);
            /* 検索結果0 */
            }else if(data.result===2) {
              setListArray([{ cnt: 0}]);
            }
          }
        );
    }
  },[]);

  return (
    <div class="container is-fluid">
      <Login userData={ userData } array={ array } listArray={ listArray }  />
    </div>
  );
}

export default Main;
