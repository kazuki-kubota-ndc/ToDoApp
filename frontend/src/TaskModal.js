import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { useHistory,useLocation } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';

import { IconContext } from 'react-icons';
import { MdOutlineAdd } from 'react-icons/md';
import { AiOutlineMenu } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { GiAlarmClock } from 'react-icons/gi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { MdOutlineTaskAlt } from 'react-icons/md';

const TaskModal = ({ showModal, modalOpen, modalClose, modalData, setModalData, taskDatas, setTaskDatas, items, setItems, user, openMenu, setCenterData, setShowCenter, setShowAddTask, addTaskData, setAddTaskData, setShowAddComment, setAddCommentData, loadingTask, setLoadingTask, sizeClass }) => {

  /* 表示ON/OFF */
  const [isDisplay, setIsDisplay] = React.useState(false);
  const [listCnt, setListCnt] = React.useState(0);

  const history = useHistory();
  const location = useLocation();

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    
    modalOpen();
  }

  const backListView = () => {
    modalClose();
  }

  /* タスク追加 */
  const onClickTaskList = () => {
    const newAddTaskData = new Map();
    newAddTaskData.action = 'insert';
    newAddTaskData.execName = '追加';
    newAddTaskData.list_no = modalData.list_no;
    setAddTaskData(newAddTaskData);
    setShowAddTask(true);
  }

  /* タスク編集 */
  const onClickEdit = taskData => {

    const newAddTaskData = new Map();
    newAddTaskData.action = 'update';
    newAddTaskData.execName = '変更';
    newAddTaskData.list_no = modalData.list_no;
    newAddTaskData.task_no = taskData.task;
    newAddTaskData.task_name = taskData.task_name;
    newAddTaskData.task_color = taskData.task_color;
    newAddTaskData.dtl = taskData.dtl;
    newAddTaskData.task_check = taskData.task_check;
    newAddTaskData.shimebi = taskData.shimebi;
    newAddTaskData.shime_time = taskData.shime_time;
    newAddTaskData.shime_min = taskData.shime_min;
    setAddTaskData(newAddTaskData);
    setShowAddTask(true);
  }

  /* 削除ボタン */
  const onClickDel = (task_no,task_name) => {
    const newCenterData = new Map();
    newCenterData.action = 'task_delete';
    newCenterData.list_no = modalData.list_no;
    newCenterData.task_no = task_no;
    newCenterData.title = 'タスク削除[ '+task_name+' ]';
    newCenterData.text = 'タスクを削除します。よろしいですか？';
    newCenterData.execName = '削除';
    setCenterData(newCenterData);
    setShowCenter(true);
  }

  /* コメントアイコンクリック */
  const onClickComment = task_no => {
    const newTaskDatas = taskDatas.map(taskData => {
      if(taskData.task==task_no) {
        if(!taskData.comment) {
          taskData.comment = true;
        }else {
          taskData.comment = false;
        }
      }
      return taskData;
    });
    setTaskDatas(newTaskDatas);
  }

  /* コメント追加クリック */
  const onClickCommentAdd = task_no => {
    const newAddCommentData = new Map();
    newAddCommentData.action = 'insert';
    newAddCommentData.execName = '追加';
    newAddCommentData.list_no = modalData.list_no;
    newAddCommentData.task_no = task_no;
    setAddCommentData(newAddCommentData);
    setShowAddComment(true);

  }

  /* コメント編集 */
  const onClickEditCom = subData => {
    const newAddCommentData = new Map();
    newAddCommentData.action = 'update';
    newAddCommentData.execName = '変更';
    newAddCommentData.list_no = modalData.list_no;
    newAddCommentData.task_no = subData.task_no;
    newAddCommentData.sub_no = subData.sub_no;
    newAddCommentData.sub_name = subData.sub_name;
    setAddCommentData(newAddCommentData);
    setShowAddComment(true);

  }

  /* リストをドラッグ＆ドロップした時のイベント */
  const onDrop = ({ removedIndex, addedIndex }) => {
    if(removedIndex!=addedIndex) {

      /* ローディング表示 */
      setLoadingTask(true);

      /* タスクデータを入れ替え */
      const sortTasks = arrayMoveImmutable(taskDatas, removedIndex, addedIndex);
      setTaskDatas(sortTasks);
      var sort = 1;
      const newSortTasks = sortTasks.map(sorTask => {
        sorTask.user_id = user.user_id;
        sorTask.list_no = modalData.list_no;
        sorTask.sort = sort;
        sort++;
        return sorTask;
      });

      fetch('/upd_task_sort', {
        method : 'POST',
        body : JSON.stringify(newSortTasks),
        headers : new Headers({ 'Content-type' : 'application/json' })
      }).then((res) => res.json())
        .then(
          (data) => {
            if(!data.result===1) {
              alert('更新処理に失敗しました');
              history.push('/');
            }else {
              setLoadingTask(false);
            }
          }
        );

    }
  }

  /* モーダルのスタイル */
  const modalStyle = {
    content: {
      top: '0%',
      left: '0%',
      right: 'auto',
      bottom: 'auto',
      height: '100%',
      width: '100%',
//      marginRight: '-50%',
//      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  const panelHedStyle = {
    background: '#'+modalData.list_color,
  }

  var list_name = '';
  var limit_cnt = 40;
  if(sizeClass=='Small') {
    limit_cnt = 50;
  }else if(sizeClass=='Large') {
    limit_cnt = 30;
  }
  if(modalData.list_name) {
    var text_array = (modalData.list_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        list_name += '...';
        break;
      }else {
        list_name += (modalData.list_name).charAt(i);
      }
    }
  }else {
    list_name = '';
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

  useEffect(() =>{

    setIsDisplay(false);
    setLoadingTask(true);

    fetch('/select_task?user_id='+location.state.user.user_id+'&list_no='+modalData.list_no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            setTaskDatas(data.data);
            const newModalData = modalData;
            newModalData.task_cnt = 1;
            setModalData(newModalData);
            setIsDisplay(true);
          /* 検索結果0 */
          }else if(data.result===2) {
            setTaskDatas([{}]);
            const newModalData = modalData;
            newModalData.task_cnt = 0;
            setModalData(newModalData);
            setIsDisplay(true);
          }
          setLoadingTask(false);
        }
      );
  },[modalData.list_no]);

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalClose}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={"panel"}>
        {/* ヘッダー */}
        <div style={panelHedStyle} className={classNames("panel-heading")}>
          <table className={"width100P"}>
            <tr>
              <td className={classNames("width10P")} onClick={openMenu}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </td>
              <td className={"width60P"}><span className={"title"+sizeClass}>{list_name}</span></td>
              <td className={classNames("flexboxRight")} onClick={backListView}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <IoMdArrowRoundBack />
                </IconContext.Provider>
              </td>
            </tr>
          </table>
        </div>
        {/* メイン */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>

            {/* タスク */}
            {modalData.task_cnt>0 && 
              <Container onDrop={onDrop}>
                {taskDatas.map(taskData => (
                  <ToDoTask
                    taskData={taskData}
                    modalData={modalData}
                    isDisplay={isDisplay}
                    onClickComment={onClickComment}
                    onClickCommentAdd={onClickCommentAdd}
                    onClickEdit={onClickEdit}
                    onClickDel={onClickDel}
                    taskDatas={taskDatas}
                    setTaskDatas={setTaskDatas}
                    setLoadingTask={setLoadingTask}
                    sizeClass={sizeClass}
                    onClickEditCom={onClickEditCom}
                  />
                ))}
              </Container>
            }

            {/* タスク追加 */}
            <div className={classNames("addTask")}>
              <span onClick={onClickTaskList}>
                <IconContext.Provider value={{ size: add_size }}>
                  <MdOutlineAdd />
                </IconContext.Provider>
              </span>
              <span className={"medText"+sizeClass} onClick={onClickTaskList}><b>タスク追加</b></span>
            </div>

          </div>
        </div>
      </div>
      <LoaderTask isLoading={ loadingTask } />
    </ReactModal>
  );
}

/* ローディング表示 */
function LoaderTask({ isLoading }) {

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

/* リスト */
function ToDoTask({ taskData, modalData, isDisplay, onClickComment, onClickCommentAdd, onClickEdit, onClickDel, taskDatas, setTaskDatas, setLoadingTask, sizeClass, onClickEditCom }) {

  /* コメントのデータ */
  const [subDatas, setSubDatas] = React.useState([{}]);

  const location = useLocation();

  const onClickEditComment = subData => {
    subData.task_no = taskData.task;
    onClickEditCom(subData);
  }

  const searchComment = target =>{
    
    fetch('/select_sub?user_id='+location.state.user.user_id+'&list_no='+modalData.list_no+'&task_no='+taskData.task)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            setSubDatas(data.data);
            const newTaskDatas = taskDatas.map(item =>{
              if(item.task==taskData.task) {
                item.subDatas = data.data;
                item.show_comment = true;
              }
              return item;
            });
            setTaskDatas(newTaskDatas);
          /* 検索結果0 */
          }else if(data.result===2) {
            setSubDatas([{}]);
          }

          if(target=='0') {
            onClickComment(taskData.task);
          }else if(target=='1') {
            onClickCommentAdd(taskData.task);
          }

        }
      );

  }

  const delComment = sub_no => {

    /* ローディング表示 */
    setLoadingTask(true);

    fetch('/delete_sub?user_id='+location.state.user.user_id+'&list_no='+modalData.list_no+'&task_no='+taskData.task+'&sub_no='+sub_no)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            var index = 0;
            var del_index = -1;
            subDatas.map(subData => {
              if(subData.sub_no==sub_no) {
                del_index = index;
              }
              index++;
            });

            const newSubDatas = [...subDatas];
            newSubDatas.splice(del_index,1);
            setSubDatas(newSubDatas);
            /* タスクデータのコメントデータを更新、コメント数を-1 */
            const newTaskDatas = taskDatas.map(item =>{
              if(item.task==taskData.task) {
                item.subDatas = newSubDatas;
                if(index==1) {
                  item.show_comment = false;
                }
                item.sub_cnt = String(Number(item.sub_cnt)-1);
              }
              return item;
            });
            setTaskDatas(newTaskDatas);
            /* ローディング非表示 */
            setLoadingTask(false);
          }else {
            alert('削除処理に失敗しました');
            /* ローディング非表示 */
            setLoadingTask(false);
          }
        }
      );
  }

  useEffect(() =>{
    if(taskData.subDatas) {
      setSubDatas(taskData.subDatas);
    }else {
      setSubDatas([{}]);
    }
  },[taskData.subDatas]);

  var disp = 'none';
  if(isDisplay) {
    disp = 'block';
  }

  const dispStyle = {
    display: disp,
  }

  const taskStyle = {
    background: '#'+taskData.task_color,
  }

  var comDisp = 'none';
  if(taskData.comment) {
    comDisp = 'block';
  }

  const commentStyle = {
    display: comDisp,
  }

  var task_name = '';
  var limit_cnt = 40;
  if(sizeClass=='Small') {
    limit_cnt = 50;
  }else if(sizeClass=='Large') {
    limit_cnt = 30;
  }
  if(taskData.task_name) {
    var text_array = (taskData.task_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        task_name += '...';
        break;
      }else {
        task_name += (taskData.task_name).charAt(i);
      }
    }
  }else {
    task_name = '';
  }

  var com_size = '22px';
  var add_size = '20px';
  var clock_size = '24px';
  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    com_size = '22px';
    add_size = '20px';
    clock_size = '24px';
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    com_size = '32px';
    add_size = '30px';
    clock_size = '30px';
    edit_close_size = '40px';
  }

  return (
  <Draggable key={taskData.task}>
    <div style={dispStyle} className={classNames("taskBox")}>
      <table className={"width100P"}>
        <tr>
          <td role={task_name+'_labelcolor_task'} style={taskStyle} className={"taskLabel"}>
              <IconContext.Provider value={{ size: '24px'}}>
                <MdOutlineTaskAlt />
              </IconContext.Provider>
          </td>
          <td className={"width2P"}>&nbsp;</td>
          <td className={"width97P"}>
            <div className={"pad0mar0"}>
              <table className={"width100P"}>
                <tr>
                  <td className={classNames("width80P")}>
                    <span className={classNames("titleMod"+sizeClass)}>
                      <b role={task_name+'_task_name'}>{task_name}</b>
                    </span>
                  </td>
                  <td className={classNames("width20P")}>
                    <span className={"flexboxRight"}>
                      <span role={task_name+'_edit_btn_task'} className={classNames("pad0marR20")} onClick={() => onClickEdit(taskData)}>
                        <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                          <FiEdit />
                        </IconContext.Provider>
                      </span>
                      <span role={task_name+'_delete_btn_task'} onClick={() => onClickDel(taskData.task,taskData.task_name)}>
                        <IconContext.Provider value={{ size: edit_close_size, style: { cursor: 'pointer'} }}>
                          <AiOutlineCloseCircle />
                        </IconContext.Provider>
                      </span>
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div className={"pad0mar0"}>
              <Dtl
                dtl_str={taskData.dtl}
                sizeClass={sizeClass}
              />
            </div>
            <div className={"pad0mar0"}>
              <span className={"pad0marR20"}></span>
              <span className={"pad0marR20"}>
                <IconContext.Provider value={{ size: clock_size, style: { cursor: 'default'} }}>
                  <GiAlarmClock />
                </IconContext.Provider>
              </span>
              <span className={"pad0marR10"}>
                <Shimebi
                  shimebi={taskData.shimebi}
                  sizeClass={sizeClass}
                />
              </span>
              {taskData.shime_time &&
                <span>
                  <span className={"ellipsePanelDef"}>
                    &nbsp;{taskData.shime_time}&nbsp;:&nbsp;{('00'+taskData.shime_min).slice(-2)}&nbsp;
                  </span>
                </span>
              }
            </div>
            <div className={"pad0mar0"}>
              <span className={"pad0marR20"}>
                <CheckBtn
                  taskData={taskData}
                  sizeClass={sizeClass}
                />
              </span>
              <span className={classNames("pad0marR5", "cursorPointer")} onClick={() => searchComment('0')}>
                <IconContext.Provider value={{ size: com_size, style: { cursor: 'pointer'} }}>
                  <FaRegComment />
                </IconContext.Provider>
              </span>
              <span className={classNames("pad0marR10", "cursorPointer", "titleMod"+sizeClass)} onClick={() => searchComment('0')}>
                {taskData.sub_cnt}
              </span>
              <span onClick={() => searchComment('1')}>
                <IconContext.Provider value={{ size: add_size, style: { cursor: 'pointer'} }}>
                  <MdOutlineAdd />
                </IconContext.Provider>
              </span>
            </div>
            {/* コメント */}
            <div style={commentStyle}>
              {taskData.show_comment && subDatas.map(subData => (
                <CommentList
                  subData={subData}
                  delComment={delComment}
                  sizeClass={sizeClass}
                  onClickEditComment={onClickEditComment}
                />
              ))}
            </div>
          </td>
        </tr>
      </table>
    </div>
  </Draggable>
  );
}

/* 日付 */
function Shimebi({ shimebi, sizeClass }) {

  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const today_str = today.getFullYear() + '/' + ("00" + (today.getMonth()+1)).slice(-2) + '/' + ("00" + today.getDate()).slice(-2);
  const tomorrow_str = tomorrow.getFullYear() + '/' + ("00" + (tomorrow.getMonth()+1)).slice(-2) + '/' + ("00" + tomorrow.getDate()).slice(-2);
  const shimebiDate = Date.parse(shimebi);

  var nitiji = '';
  var class_name = "";
  if(shimebi==today_str) {
    nitiji = '今日';
    class_name = "ellipsePanelB";
  }else if(shimebi==tomorrow_str) {
    nitiji = '明日';
    class_name = "ellipsePanelG";
  }else {
    nitiji = shimebi;
    if(shimebiDate>today) {
      class_name = "ellipsePanelK";
    }else {
      class_name = "ellipsePanelR";
    }
  }

  return (
    <span className={classNames(class_name, "medBtnFont"+sizeClass)}>
      &nbsp;{nitiji}&nbsp;
    </span>
  );
}

/* 詳細 */
function Dtl({ dtl_str, sizeClass }) {

  var dtlArray = new Array();
  if(dtl_str) {
    if(dtl_str.match(/\r?\n/g)) {
      dtlArray = dtl_str.split(/\r?\n/g);
    }else {
      dtlArray[0] = dtl_str;
    }
  }

  var limit_cnt = 90;
  if(sizeClass=='Small') {
    limit_cnt = 110;
  }else if(sizeClass=='Large') {
    limit_cnt = 70;
  }

  var k = 0;
  var dtl_names = new Array();

  for(const dtl_name of dtlArray) {
    dtl_names[k] = '';
    var text_array = (dtl_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        dtl_names[k] += '...';
        break;
      }else {
        dtl_names[k] += (dtl_name).charAt(i);
      }
    }
    k++;
  }

  return (
    <span className={classNames("medText"+sizeClass)}>
      {dtl_names.map(dtl => (
        <div role={dtl+"_dtl"}>{dtl}</div>
      ))}
    </span>
  );
}

/* コメント */
function CommentList({ subData, delComment, sizeClass, onClickEditComment }) {

  const onClickDelComment = () => {
    delComment(subData.sub_no);
  }

  var sub_name = '';
  var limit_cnt = 60;
  if(sizeClass=='Small') {
    limit_cnt = 80;
  }else if(sizeClass=='Large') {
    limit_cnt = 40;
  }
  if(subData.sub_name) {
    var text_array = (subData.sub_name).split('');
    var count = 0;
    for (var i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) count++;
      else count += 2;
      if (count > limit_cnt) {
        sub_name += '...';
        break;
      }else {
        sub_name += (subData.sub_name).charAt(i);
      }
    }
  }else {
    sub_name = '';
  }

  return (
    <div className={"pad0mar0"}>
      <span className={"pad0marR20"}></span>
      <span className={"pad0marR20"}></span>
      <span className={"pad0marR20"}></span>
      <span className={"pad0marR20"}></span>
      <span className={"pad0marR80"}>{sub_name}</span>
      <span className={classNames("pad0marR20")} onClick={() => onClickEditComment(subData)}>
        <IconContext.Provider value={{ size: '20px', style: { cursor: 'pointer'} }}>
          <FiEdit />
        </IconContext.Provider>
      </span>
      <span onClick={onClickDelComment}>
        <IconContext.Provider value={{ size: '20px', style: { cursor: 'pointer'} }}>
          <AiOutlineCloseCircle />
        </IconContext.Provider>
      </span>
    </div>
  );
}

/* 状態アイコン */
function CheckBtn({ taskData, sizeClass }) {

  const btnStyle = {
    cursor: 'default',
  }

  /* 1:完了 */
  if(taskData.task_check=='1') {
    if(sizeClass=='Large') {
      return (
        <button style={btnStyle} className={classNames("button", "is-success", "is-normal", "is-rounded")}>完了</button>
      );
    }else {
      return (
        <button style={btnStyle} className={classNames("button", "is-success", "is-small", "is-rounded")}>完了</button>
      );
    }
  /* 2:保留 */
  }else if(taskData.task_check=='2') {
    if(sizeClass=='Large') {
      return (
        <button style={btnStyle} className={classNames("button", "is-warning", "is-normal", "is-rounded")}>保留</button>
      );
    }else {
      return (
        <button style={btnStyle} className={classNames("button", "is-warning", "is-small", "is-rounded")}>保留</button>
      );
    }
  /* 0:作業中 */
  }else {
    if(sizeClass=='Large') {
      return (
        <button style={btnStyle} className={classNames("button", "is-info", "is-normal", "is-rounded")}>作業中</button>
      );
    }else {
      return (
        <button style={btnStyle} className={classNames("button", "is-info", "is-small", "is-rounded")}>作業中</button>
      );
    }
  }

}

export default TaskModal;