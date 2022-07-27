import './common.css';
import React,{ useState,useEffect,useRef,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import { Container, Draggable } from 'react-smooth-dnd';
import { arrayMoveImmutable } from 'array-move';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Leaflet from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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

import AddUserModal from './MapAddUserModal';
import MenuModal from './MapMenuModal';
import CenterModal from './CenterModal';
import UserModal from './MapUserModal';
import PassModal from './MapPassModal';
import UserEditModal from './MapUserEditModal';
import TagSelectModal from './TagSelectModal';
import MarkerModal from './MarkerModal';
import MarkerTagModal from './MarkerTagModal';
import MarkerList from './MarkerList'
import TagEdit from './TagEdit'
import TagEditDtlModal from './TagEditDtlModal'
import TagEditMarkerEditModal from './TagEditMarkerEditModal'

// marker setting
let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
Leaflet.Marker.prototype.options.icon = DefaultIcon;

/* メイン画面 */
function Login({ userData, defaultPosition, defaultZoomLevel, array, tagArray, markerListArray, tagListArray }) {

  /* 画面位置 */
  const [position, setPosition] = useState(new LatLng(34.732938, 135.498543));
  const [posData, setPosData] = useState({});
  /* zoom情報 */
  const [zoomLevel, setZoomLevel] = useState(18);
  /* 表示マーカーデータ */
  const [markerViewData, setMarkerViewData] = React.useState([{}]);
  /* マーカー用タグデータ */
  const [tagData, setTagData] = React.useState([{}]);
  /* マーカー用タグデータ更新情報 */
  const [tagUpdateData, setTagUpdateData] = React.useState([{}]);
  /* マーカー一覧用 */
  const [markerListData, setMarkerListData] = React.useState([{}]);
  /* タグ一覧用 */
  const [tagListData, setTagListData] = React.useState([{}]);
  /* タグ一覧用マーカーデータ更新情報 */
  const [tagListUpdateData, setTagListUpdateData] = React.useState([{}]);
  /* タグチェックデータ */
  const [tagCheck, setTagCheck] = React.useState([]);
  /* 所属マーカーデータ */
  const [inMarker, setInMarker] = React.useState([]);


  /* ユーザーデータ */
  const [user, setUser] = React.useState({});
  /* 表示サイズ */
  const [sizeClass, setSizeClass] = React.useState('Med');

  /* ローディング(API通信中)のステータス：true/false */
  const [loading, setLoading] = React.useState(true);
  const [loadingTask, setLoadingTask] = React.useState(true);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const [loadingUserEdit, setLoadingUserEdit] = React.useState(true);
  const [loadingTagSelect, setLoadingTagSelect] = React.useState(true);
  const [loadingMarker, setLoadingMarker] = React.useState(true);
  const [loadingMarkerList, setLoadingMarkerList] = React.useState(true);
  const [loadingMarkerTag, setLoadingMarkerTag] = React.useState(true);
  const [loadingTagEdit, setLoadingTagEdit] = React.useState(true);
  const [loadingTagEditDtl, setLoadingTagEditDtl] = React.useState(true);

  /* Menuダイアログの開閉ステータス */
  const [showMenu, setShowMenu] = React.useState(false);
  /* Menuダイアログのデータ */
  const [menuDatas, setMenuDatas] = React.useState([{}]);
  /* Centerダイアログの開閉ステータス */
  const [showCenter, setShowCenter] = React.useState(false);
  /* Centerダイアログのデータ */
  const [centerData, setCenterData] = React.useState(new Map());
  /* Userダイアログの開閉ステータス */
  const [showUser, setShowUser] = React.useState(false);
  /* Passダイアログの開閉ステータス */
  const [showPass, setShowPass] = React.useState(false);
  /* TagSelectダイアログの開閉ステータス */
  const [showTagSelect, setShowTagSelect] = React.useState(false);
  /* Markerダイアログの開閉ステータス */
  const [showMarker, setShowMarker] = React.useState(false);
  /* Markerダイアログのデータ */
  const [markerData, setMarkerData] = React.useState(new Map());
  /* MarkerTagダイアログの開閉ステータス */
  const [showMarkerTag, setShowMarkerTag] = React.useState(false);
  /* MarkerTagダイアログのデータ */
  const [markerTagData, setMarkerTagData] = React.useState(new Map());
  /* MarkerListダイアログの開閉ステータス */
  const [showMarkerList, setShowMarkerList] = React.useState(false);
  /* TagEditダイアログの開閉ステータス */
  const [showTagEdit, setShowTagEdit] = React.useState(false);
  /* TagEditDtlダイアログの開閉ステータス */
  const [showTagEditDtl, setShowTagEditDtl] = React.useState(false);
  /* TagEditDtlダイアログのデータ */
  const [tagEditDtlData, setTagEditDtlData] = React.useState(new Map());
  /* tagEditDtlダイアログのデータ(表示用) */
  const [tagEditDtlViewData, setTagEditDtlViewData] = React.useState(new Map());
  /* TagEditMarkerEditダイアログの開閉ステータス */
  const [showTagEditMarkerEdit, setShowTagEditMarkerEdit] = React.useState(false);
  /* TagEditMarkerEditダイアログのデータ */
  const [tagEditMarkerEditData, setTagEditMarkerEditData] = React.useState(new Map());
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
  /* タグのデータ */
  const [markerTagViewDatas, setMarkerTagViewDatas] = React.useState([{}]);

  /* 表示タグ情報 */
  const [selectTagDatas, setSelectTagDatas] = React.useState([]);

  /* 地図表示用 */
  const [isMapView, setIsMapView] = React.useState(true);

  /* ウインドウサイズ（高さ） */
  const [innerHeight, setInnerHeight] = React.useState('');

  const history = useHistory();

  const onLoading = flg => {
    /* ローディング表示 */
    setLoading(flg);
  }

  /* マーカー追加 */
  const markerAdd = (latlng) =>{
    if(user.user_id) {
      const newMarkerData = new Map();
      newMarkerData.action = 'insert';
      newMarkerData.titleName = '登録';
      newMarkerData.execName = '追加';
      newMarkerData.lat = latlng.lat;
      newMarkerData.lng = latlng.lng;
      setMarkerData(newMarkerData);
      openMarker();
    }else {
      savaPos();
      setIsMapView(false);
      setIsMapView(true);
      alert('マーカー登録するにはログイン・アカウント新規登録を実行して下さい');
    }
  }

  /* マーカー編集 */
  const markerEdit = (item) =>{
    const newMarkerData = new Map();
    newMarkerData.action = 'update';
    if(user.user_id) {
      newMarkerData.titleName = '編集';
    }else {
      newMarkerData.titleName = '詳細';
    }
    newMarkerData.execName = '保存';
    newMarkerData.markerNo = item.marker_no;
    newMarkerData.markerName = item.marker_name;
    newMarkerData.dtl = item.dtl;
    newMarkerData.lat = item.latitude;
    newMarkerData.lng = item.longitude;
    newMarkerData.favoriteFlg = item.favorite_flg;
    setMarkerData(newMarkerData);
    openMarker();
  }

  /* マーカー編集(一覧から) */
  const markerEditForList = (item) =>{
    const newMarkerData = new Map();
    newMarkerData.action = 'update_for_list';
    newMarkerData.titleName = '編集';
    newMarkerData.execName = '保存';
    newMarkerData.markerNo = item.marker_no;
    newMarkerData.markerName = item.marker_name;
    newMarkerData.dtl = item.dtl;
    newMarkerData.lat = item.latitude;
    newMarkerData.lng = item.longitude;
    newMarkerData.favoriteFlg = item.favorite_flg;
    setMarkerData(newMarkerData);
    openMarker();
  }

  /* マーカー追加・編集実行 */
  const addMarker = (modalData) =>{
    /* 追加 */
    if(markerData.action=='insert') {

      setLoadingMarker(true);
      const sendData = '?user_id='+user.user_id
                 + '&marker_name='+modalData.markerName
                 + '&dtl='+modalData.dtl
                 + '&lat='+markerData.lat
                 + '&lng='+markerData.lng
                 + '&favorite_flg='+modalData.favoriteFlg
                 ;
      var insert_marker_no = '';

      fetch('/insert_marker'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              insert_marker_no = data.marker_no;
              /* 表示マーカーデータ追加 */
              var reMarkerViewData = [];
              if(markerViewData[0].marker_no) {
                reMarkerViewData = markerViewData;
              }
              const addMarkerData = {
                marker_no: Number(data.marker_no),
                marker_name: modalData.markerName,
                dtl: modalData.dtl,
                longitude: String(markerData.lng),
                latitude: String(markerData.lat),
                favorite_flg: Number(modalData.favoriteFlg),
                create_user_id: user.user_id,
                key: Number(data.marker_no)
              };
              const newMarkerViewData = [...reMarkerViewData, addMarkerData];
              setMarkerViewData(newMarkerViewData);

              /* マーカー一覧の末尾に追加 */
              var reMarkerListData = [];
              if(markerListData[0].marker_no) {
                reMarkerListData = markerListData;
              }
              if(modalData.favoriteFlg==0) {
                const newMarkerListData = [...reMarkerListData, addMarkerData];
                setMarkerListData(newMarkerListData);
              /* マーカー一覧のお気に入り末尾に追加 */
              }else {
                const newMarkerListData = [];
                var add = 0;
                reMarkerListData.map(item => {
                  if(item.favorite_flg==1 || add==1) {
                    newMarkerListData.push(item);
                  }else {
                    newMarkerListData.push(addMarkerData);
                    newMarkerListData.push(item);
                    add = 1;
                  }
                });
                if(add==0) {
                  newMarkerListData.push(addMarkerData);
                }
                setMarkerListData(newMarkerListData);
              }

              /* タグデータ更新 */
              if(tagUpdateData.length!=0) {

                var selectTagNo = [];
                selectTagDatas.map(tag => {
                  selectTagNo.push(tag.tag_no);
                });
                var tagInclude = 0;
                var newTagUpdateData = [];
                tagUpdateData.map(item => {
                  if(item.marker_no==markerData.markerNo) {
                    newTagUpdateData.push({
                      marker_no: insert_marker_no,
                      tag_no: item.tag_no,
                      tag_name: item.tag_name
                    });
                    if(selectTagNo.indexOf(item.tag_no)!=-1) {
                      tagInclude = 1;
                    }
                  }
                });
                if(newTagUpdateData.length!=0) {

                  fetch('/update_tagging', {
                    method : 'POST',
                    body : JSON.stringify(newTagUpdateData),
                    headers : new Headers({ 'Content-type' : 'application/json' })
                  }).then((res) => res.json())
                    .then(
                      (data) => {
                        if(data.result===1) {
                          /* 作成マーカーが選択中のタグを含まない場合はタグ選択初期化 */
                          if(tagInclude==0) {
                            setSelectTagDatas([]);
                            setMarkerViewData(markerListData);
                          }
                          /* ローディング非表示 */
                          setLoadingMarker(false);
                          /* 非同期処理実行前に作成しているのでtagUpdateDataのmarker_noにundefinedが入っている、新規登録marker_noをセット */
                          const reTagUpdateData = tagUpdateData.map(tag => {
                            if(!tag.marker_no) {
                              tag.marker_no = insert_marker_no;
                            }
                            return tag;
                          });
                          setTagUpdateData(reTagUpdateData);
                          setTagData(reTagUpdateData);
                          setTagUpdateData([]);
                          markerClose();
                        }else {
                          alert('変更処理に失敗しました');
                          /* ローディング非表示 */
                          setLoadingMarker(false);
                          setTagUpdateData([]);
                          markerClose();
                        }
                      }
                    );
                }else {
                  /* 選択タグ、表示マーカーデータを初期化 */
                  setSelectTagDatas([]);
                  setMarkerViewData(markerListData);
                  setLoadingMarker(false);
                  setTagUpdateData([]);
                  markerClose();
                }
              }else {
                /* 選択タグ、表示マーカーデータを初期化 */
                setSelectTagDatas([]);
                setMarkerViewData(markerListData);
                setLoadingMarker(false);
                setTagUpdateData([]);
                markerClose();
              }

            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setLoadingMarker(false);
              markerClose();
            }
          }
        );

    /* 編集 */
    }else if(markerData.action=='update' || markerData.action=='update_for_list') {
      setLoadingMarker(true);
      const sendData = '?user_id='+user.user_id
                 + '&marker_no='+markerData.markerNo
                 + '&marker_name='+modalData.markerName
                 + '&dtl='+modalData.dtl
                 + '&favorite_flg='+modalData.favoriteFlg
                 ;

      fetch('/update_marker'+sendData)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              /* 表示マーカーデータを更新 */
              const newMarkerViewData = markerViewData.map(item => {
                if(item.marker_no==markerData.markerNo) {
                  item.marker_name = modalData.markerName;
                  item.dtl = modalData.dtl;
                  item.favorite_flg = modalData.favoriteFlg;
                }
                return item;
              });
              setMarkerViewData(newMarkerViewData);

              /* マーカー一覧を更新 */
              const addMarkerData = {
                marker_no: Number(markerData.markerNo),
                marker_name: modalData.markerName,
                dtl: modalData.dtl,
                longitude: String(markerData.lng),
                latitude: String(markerData.lat),
                favorite_flg: Number(modalData.favoriteFlg),
                create_user_id: user.user_id,
                key: Number(markerData.markerNo)
              };
              var add = 1;
              var newMarkerListData = [];
              markerListData.map(item => {
                if(item.marker_no==markerData.markerNo) {
                  /* favorite_flg変更なし */
                  if(item.favorite_flg==modalData.favoriteFlg) {
                    newMarkerListData.push({
                      marker_no: Number(markerData.markerNo),
                      marker_name: modalData.markerName,
                      dtl: modalData.dtl,
                      longitude: String(markerData.lng),
                      latitude: String(markerData.lat),
                      favorite_flg: Number(modalData.favoriteFlg),
                      create_user_id: user.user_id,
                      key: Number(markerData.markerNo)
                    });
                  /* favoite_flg変更有り */
                  }else {
                    add = 0;
                  }
                }else {
                  newMarkerListData.push(item);
                }
              });

              if(add==0) {
                /* マーカー一覧に追加 */
                if(modalData.favoriteFlg=='0') {
                  const reNewMarkerListData = newMarkerListData;
                  newMarkerListData = [];
                  reNewMarkerListData.map(item => {
                    if(item.favorite_flg==0 && Number(item.marker_no)>Number(markerData.markerNo) && add==0) {
                      newMarkerListData.push(addMarkerData);
                      newMarkerListData.push(item);
                      add=1;
                    }else {
                      newMarkerListData.push(item);
                    }
                  });
                  if(add==0) {
                    newMarkerListData.push(addMarkerData);
                  }
                /* マーカー一覧のお気に入りに追加 */
                }else {
                  const reNewMarkerListData = newMarkerListData;
                  newMarkerListData = [];
                  reNewMarkerListData.map(item => {
                    if(item.favorite_flg==1 && Number(item.marker_no)>Number(markerData.markerNo) && add==0) {
                      newMarkerListData.push(addMarkerData);
                      newMarkerListData.push(item);
                      add=1;
                    }else {
                      newMarkerListData.push(item);
                    }
                  });
                  if(add==0) {
                    newMarkerListData.push(addMarkerData);
                  }
                }
              }
              setMarkerListData(newMarkerListData);

              /* タグデータ更新 */
              if(tagUpdateData.length!=0) {
                var selectTagNo = [];
                selectTagDatas.map(tag => {
                  selectTagNo.push(tag.tag_no);
                });
                var tagInclude = 0;
                var newTagUpdateData = [];
                tagUpdateData.map(item => {
                  if(item.marker_no==markerData.markerNo) {
                    newTagUpdateData.push(item);
                    if(selectTagNo.indexOf(item.tag_no)!=-1) {
                      tagInclude = 1;
                    }
                  }
                });
                if(newTagUpdateData.length==0) {
                  newTagUpdateData.push({
                    not_insert: 1,
                    marker_no: markerData.markerNo
                  });
                }

                fetch('/update_tagging', {
                  method : 'POST',
                  body : JSON.stringify(newTagUpdateData),
                  headers : new Headers({ 'Content-type' : 'application/json' })
                }).then((res) => res.json())
                  .then(
                    (data) => {
                      if(data.result===1) {
                        /* 編集マーカーが選択中のタグを含まない場合はタグ選択初期化 */
                        if(tagInclude==0) {
                          setSelectTagDatas([]);
                          setMarkerViewData(markerListData);
                        }
                        /* ローディング非表示 */
                        setLoadingMarker(false);
                        setTagData(tagUpdateData);
                        setTagUpdateData([]);
                        if(markerData.action=='update') {
                          markerClose();
                        }else if(markerData.action=='update_for_list') {
                          setShowMarker(false);
                        }
                      }else {
                        alert('変更処理に失敗しました');
                        /* ローディング非表示 */
                        setLoadingMarker(false);
                        setTagUpdateData([]);
                        if(markerData.action=='update') {
                          markerClose();
                        }else if(markerData.action=='update_for_list') {
                          setShowMarker(false);
                        }
                      }
                    }
                  );

              }else {
                setLoadingMarker(false);
                setTagUpdateData([]);
                if(markerData.action=='update') {
                  markerClose();
                }else if(markerData.action=='update_for_list') {
                  setShowMarker(false);
                }
              }

            }else {
              alert('変更処理に失敗しました');
              /* ローディング非表示 */
              setLoadingMarker(false);
              if(markerData.action=='update') {
                markerClose();
              }else if(markerData.action=='update_for_list') {
                setShowMarker(false);
              }
            }
          }
        );
    }
    /* マーカーリストを読み直しする */
    markerListReset();
  }

  /* 地図移動 */
  const moveMap = (item) => {
    const newPosison = new LatLng(Number(item.latitude), Number(item.longitude));
    setPosition(newPosison);
    setZoomLevel(18);
    markerListClose();
  }

  /* マーカーリスト再取得 */
  const markerListReset = () => {

    /* ログイン時のみ */
    if(user.user_id) {

      var paramTag = '';
      selectTagDatas.map(tag => {
        if(!paramTag=='') {
          paramTag += ',';
        }
        paramTag += tag.tag_no;
      });
      /* タグ絞り込み無しは0 */
      if(paramTag=='') {
        paramTag = '0';
      }
      fetch('/marker_list_reset?user_id='+user.user_id+'&tag_nos='+paramTag)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              setMarkerViewData(data.markerViewData);
              setMarkerListData(data.markerListData);
            }
          }
        );
    }
  }

/* --------------------MenuModal-------------------- */

  /* Menuモーダルを開いた時の処理 */
  const menuOpen = () => {
markerListReset();
//console.log(user);
//console.log('markerViewData');
//console.log(markerViewData);
//console.log('markerListData');
//console.log(markerListData);
//console.log('tagData');
//console.log(tagData);
//console.log('inMarker');
//console.log(inMarker);
//console.log('tagListData');
//console.log(tagListData);
//console.log('selectTagDatas');
//console.log(selectTagDatas);
//console.log('zoomLevel');
//console.log(zoomLevel);
//console.log(markerTagData);
//console.log(tagCheck);
//console.log('tagUpdateData');
//console.log(tagUpdateData);
    savaPos();
  }

  /* Menuモーダルを閉めた時の処理 */
  const menuClose = () => {
    setIsMapView(true);
    setShowMenu(false);
//    setLoading(false);

  }

  /* Menuモーダルを開く */
  const openMenu = () =>{
    setIsMapView(false);
    const newMenuDatas = [];
    newMenuDatas.push({
      menu_no: 4,
      menu_name: 'タグ絞り込み表示',
    });
    newMenuDatas.push({
      menu_no: 5,
      menu_name: 'マーカー一覧',
    });
    if(user.admin=='1') {
      newMenuDatas.push({
        menu_no: 6,
        menu_name: 'タグ管理',
      });
      newMenuDatas.push({
        menu_no: 3,
        menu_name: 'ユーザー管理',
      });
    }
    if(user.login_id) {
      newMenuDatas.push({
        menu_no: 1,
        menu_name: 'アカウント情報',
      });
      newMenuDatas.push({
        menu_no: 2,
        menu_name: 'ログアウト',
      });
    }else {
      newMenuDatas.push({
        menu_no: 0,
        menu_name: 'ログイン',
      });
      newMenuDatas.push({
        menu_no: 7,
        menu_name: '新規登録',
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

  const goTagSelect = () => {
    setShowMenu(false);
    setShowTagSelect(true);
  }

  const goMarkerList = () => {
    setShowMenu(false);
    setShowMarkerList(true);
  }

  const goTagEdit = () => {
    setShowMenu(false);
    setShowTagEdit(true);
  }

  /* ログアウト処理 */
  const goLogout = () =>{
    setSizeClass('Med');
    reportWindowSize();
    setUser({
      admin: 0,
      o_font: 1,
      user_name: 'ゲスト'
    });
    setIsMapView(true);
    setShowMenu(false);
  }

  /* ログイン処理 */
  const goLogin = () =>{
    history.push({ pathname: '/MapLogin', state: { defaultPosition: position, defaultZoomLevel:zoomLevel } });
  }

  /* 新規登録 */
  const goShinki = () =>{
    const newAddUserData = new Map();
    newAddUserData.action = 'login';
    newAddUserData.execName = '追加';
    setAddUserData(newAddUserData);
    setInnerHeight(window.innerHeight);

    setShowMenu(false);
    setShowAddUser(true);
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

    /* ユーザー削除 */
    if(centerData.action==='user_delete') {

      setLoadingUserEdit(true);

      fetch('/map_delete_user?user_id='+centerData.user_id)
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
    /* マーカー削除 */
    }else if(centerData.action==='marker_delete') {

      setLoadingMarkerList(true);

      fetch('/delete_marker?marker_no='+centerData.marker_no)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {
              /* 表示マーカーリストのデータ削除 */
              var index = 0;
              var del_index = -1;
              markerViewData.map(marker => {
                if(marker.marker_no==centerData.marker_no) {
                  del_index = index;
                }
                index++;
              });
              const newMarkerViewData = [...markerViewData];
              newMarkerViewData.splice(del_index,1);
              setMarkerViewData(newMarkerViewData);
              /* マーカー一覧のデータ削除 */
              index = 0;
              del_index = -1;
              markerListData.map(marker => {
                if(marker.marker_no==centerData.marker_no) {
                  del_index = index;
                }
                index++;
              });
              const newMarkerListData = [...markerListData];
              newMarkerListData.splice(del_index,1);
              setMarkerListData(newMarkerListData);
              /* タグデータのデータ削除 */
              var newTagData = [];
              tagData.map(tag => {
                if(tag.marker_no!=centerData.marker_no) {
                  newTagData.push(tag);
                }
              });
              setTagData(newTagData);
              setLoadingMarkerList(false);
            }else {
              alert('削除処理に失敗しました');
              /* ローディング非表示 */
              setLoadingMarkerList(false);
            }
          }
        );
    /* タグ削除 */
    }else if(centerData.action==='tag_delete') {
      setLoadingTagEdit(true);

      fetch('/delete_tag?tag_no='+centerData.tag_no)
        .then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {

              /* タグリストから削除 */
              var newTagListData = [];
              tagListData.map(tag => {
                if(centerData.tag_no!=tag.tag_no) {
                  newTagListData.push(tag);
                }
              });
              setTagListData(newTagListData);
              
              /* タグデータを削除 */
              var newTagData = [];
              tagData.map(tag => {
                if(centerData.tag_no!=tag.tag_no) {
                  newTagData.push(tag);
                }
              });
              setTagData(newTagData);
              setLoadingTagEdit(false);
            }else {
              alert('削除処理に失敗しました');
              /* ローディング非表示 */
              setLoadingTagEdit(false);
            }
          }
        );
    }
  }

/* --------------------UserModal-------------------- */

  /* Userモーダルを開いた時の処理 */
  const userOpen = () => {

  }

  /* Userモーダルを閉めた時の処理 */
  const userClose = () => {
    setIsMapView(true);
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

/* --------------------TagSelectModal-------------------- */

  /* TagSelectモーダルを開いた時の処理 */
  const tagSelectOpen = () => {

  }

  /* TagSelectモーダルを閉めた時の処理 */
  const tagSelectClose = () => {
    setIsMapView(true);
    setShowTagSelect(false);
//    setLoading(false);
  }

  /* TagSelectモーダルを開く */
  const openTagSelect = () =>{
    setShowTagSelect(true);
  }

/* --------------------MarkerModal-------------------- */

  /* Markerモーダルを開いた時の処理 */
  const markerOpen = () => {
    savaPos();
    markerTagOpen();
  }

  /* Markerモーダルを閉めた時の処理(地図表示) */
  const markerClose = () => {
    if(!showMarkerList) {
      setIsMapView(true);
    }
    setShowMarker(false);
//    setLoading(false);
  }

  /* Markerモーダルを開く */
  const openMarker = () =>{
    if(!showMarkerList) {
      setIsMapView(false);
    }
    setShowMarker(true);
  }

/* --------------------MarkerTagModal-------------------- */

  /* MarkerTagモーダルを開いた時の処理 */
  const markerTagOpen = () => {
    const newMarkerTagData = markerTagData;
    newMarkerTagData.list_cnt = tagListData.length;
    newMarkerTagData.marker_no = markerData.markerNo;
    setMarkerTagData(newMarkerTagData);
  }

  /* MarkerTagモーダルを閉めた時の処理 */
  const markerTagClose = () => {
//    setIsMapView(true);
    setShowMarkerTag(false);
//    setLoading(false);
  }

  /* MarkerTagモーダルを開く */
  const openMarkerTag = () =>{
    setShowMarkerTag(true);
  }

/* --------------------MarkerList-------------------- */

  /* MarkerListモーダルを開いた時の処理 */
  const markerListOpen = () => {

  }

  /* MarkerListモーダルを閉めた時の処理 */
  const markerListClose = () => {
    setIsMapView(true);
    setShowMarkerList(false);
//    setLoading(false);
  }

  /* MarkerListモーダルを開く */
  const openMarkerList = () =>{
    setShowMarkerList(true);
  }


/* --------------------TagEdit-------------------- */

  /* TagEditモーダルを開いた時の処理 */
  const tagEditOpen = () => {

  }

  /* TagEditモーダルを閉めた時の処理 */
  const tagEditClose = () => {
    setIsMapView(true);
    setShowTagEdit(false);
//    setLoading(false);
  }

  /* TagEditモーダルを開く */
  const openTagEdit = () =>{
    setShowTagEdit(true);
  }

/* --------------------TagEditDtlModal-------------------- */

  /* タグデータ更新処理 */
  const addTag = (modalData) => {

    var sendData = [];
    /* tagging更新有り */
    if(tagEditDtlData.marker_update==1) {
        tagListUpdateData.map(tag => {
          sendData.push({
            tagging_update: 1,
            tag_no: tagEditDtlData.tagNo,
            tag_name: modalData.tag_name,
            color: (modalData.color).replace('#', ''),
            user_id: user.user_id,
            marker_no: tag.marker_no
          });
        });
    /* tagging更新無し */
    }else {
      sendData.push({
        tagging_update: 0,
        tag_no: tagEditDtlData.tagNo,
        tag_name: modalData.tag_name,
        color: (modalData.color).replace('#', ''),
        user_id: user.user_id
      });
    }

    /* 追加 */
    if(tagEditDtlData.action=='insert') {

      setLoadingTagEditDtl(true);

      fetch('/insert_tag', {
        method : 'POST',
        body : JSON.stringify(sendData),
        headers : new Headers({ 'Content-type' : 'application/json' })
      }).then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {

              /* タグ一覧更新 */
              const newTagListData = tagListData;
              var cnt = 0;
              if(tagEditDtlData.marker_update==1) {
                cnt = tagListUpdateData.length;
              }
              newTagListData.push({
                tag_no: data.tag_no,
                tag_name: modalData.tag_name,
                color: (modalData.color).replace('#', ''),
                create_user_id: user.user_id,
                cnt: cnt
              });
              setTagListData(newTagListData);

              /* タグデータ更新 */
              /* tagDataのnameとcolorを更新 */
              const newTagData = tagData.map(tag => {
                if(tag.tag_no==tagEditDtlData.tagNo) {
                  tag.tag_name = modalData.tag_name;
                  tag.color = (modalData.color).replace('#', '');
                }
                return tag;
              });
              if(tagEditDtlData.marker_update==1) {
                if(tagListUpdateData!=[]) {
                  tagListUpdateData.map(updData => {
                    newTagData.push({
                      marker_no: updData.marker_no,
                      tag_no: data.tag_no,
                      tag_name: modalData.tag_name,
                      color: (modalData.color).replace('#', '')
                    });
                  });
                }
              }
              setTagData(newTagData);

              setTagEditDtlViewData([{}]);
              setLoadingTagEditDtl(false);
              setShowTagEditDtl(false);

            }else {
              alert('登録処理に失敗しました');
              /* ローディング非表示 */
              setTagEditDtlViewData([{}]);
              setLoadingTagEditDtl(false);
              setShowTagEditDtl(false);
            }
          }
        );

    /* 編集 */
    }else if(tagEditDtlData.action=='update') {
      setLoadingTagEditDtl(true);

      fetch('/update_tag', {
        method : 'POST',
        body : JSON.stringify(sendData),
        headers : new Headers({ 'Content-type' : 'application/json' })
      }).then((res) => res.json())
        .then(
          (data) => {
            if(data.result===1) {

              /* タグ一覧更新 */
              const newTagListData = tagListData.map(tag => {
                if(tag.tag_no==tagEditDtlData.tagNo) {
                  tag.tag_name = modalData.tag_name;
                  tag.color = (modalData.color).replace('#', '');
                  if(tagEditDtlData.marker_update==1) {
                    tag.cnt = tagEditDtlData.cnt;
                  }
                }
                return tag;
              });
              setTagListData(newTagListData);

              /* タグデータ更新 */
              if(tagEditDtlData.marker_update==1) {
                /* tagDataのnameとcolorを更新 */
                const reTagData = tagData.map(tag => {
                  if(tag.tag_no==tagEditDtlData.tagNo) {
                    tag.tag_name = modalData.tag_name;
                    tag.color = (modalData.color).replace('#', '');
                  }
                  return tag;
                });

                var addFlg = 0;
                var delFlg = 0;
                var newTagData = [];
                reTagData.map(tag => {
                  if(tag.tag_no==tagEditDtlData.tagNo) {
                    delFlg = 1;
                  }else {
                    if(delFlg==1 && addFlg==0) {
                      if(tagListUpdateData!=[]) {
                        tagListUpdateData.map(updData => {
                          newTagData.push({
                            marker_no: updData.marker_no,
                            tag_no: tagEditDtlData.tagNo,
                            tag_name: modalData.tag_name,
                            color: modalData.color
                          });
                        });
                      }
                      addFlg = 1;
                    }
                    newTagData.push(tag);
                  }
                });
                if(addFlg==0) {
                  if(tagListUpdateData!=[]) {
                    tagListUpdateData.map(data => {
                      newTagData.push({
                        marker_no: data.marker_no,
                        tag_no: tagEditDtlData.tagNo,
                        tag_name: modalData.tag_name,
                        color: modalData.color
                      });
                    });
                  }
                  addFlg = 1;
                }
                setTagData(newTagData);

              }else {
                /* tagDataのnameとcolorを更新 */
                const reTagData = tagData.map(tag => {
                  if(tag.tag_no==tagEditDtlData.tagNo) {
                    tag.tag_name = modalData.tag_name;
                    tag.color = (modalData.color).replace('#', '');
                  }
                  return tag;
                });
                setTagData(reTagData);
              }
              setTagEditDtlViewData([{}]);
              setLoadingTagEditDtl(false);
              setShowTagEditDtl(false);

            }else {
              alert('変更処理に失敗しました');
              /* ローディング非表示 */
              setTagEditDtlViewData([{}]);
              setLoadingTagEditDtl(false);
              setShowTagEditDtl(false);
            }
          }
        );
    }

  }

  /* TagEditDtlモーダルを開いた時の処理 */
  const tagEditDtlOpen = () => {

  }

  /* TagEditDtlモーダルを閉めた時の処理 */
  const tagEditDtlClose = () => {
//    setIsMapView(true);
    setShowTagEditDtl(false);
//    setLoading(false);
  }

  /* TagEditDtlモーダルを開く */
  const openTagEditDtl = () =>{
//    setIsMapView(false);
    setShowTagEditDtl(true);
  }

/* --------------------TagEditMarkerEditModal-------------------- */

  /* TagEditMarkerEditモーダルを開いた時の処理 */
  const tagEditMarkerEditOpen = () => {

  }

  /* TagEditMarkerEditモーダルを閉めた時の処理 */
  const tagEditMarkerEditClose = () => {
//    setIsMapView(true);
    setShowTagEditMarkerEdit(false);
//    setLoading(false);
  }

  /* TagEditMarkerEditモーダルを開く */
  const openTagEditMarkerEdit = () =>{
//    setIsMapView(false);
    setShowTagEditMarkerEdit(true);
  }



/* --------------------UserEditModal-------------------- */

  /* UserEditモーダルを開いた時の処理 */
  const userEditOpen = () => {

  }

  /* UserEditモーダルを閉めた時の処理 */
  const userEditClose = () => {
    setIsMapView(true);
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
    setIsMapView(true);
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

    if(addUserData.action=='insert' || addUserData.action=='login') {

      if(addUserData.action=='login') {
        setLoading(true);
      }

      fetch('/map_insert_user'+sendData)
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
              /* ユーザー情報をセット */
              if(addUserData.action=='login') {
                setUser({
                  user_id: data.user_id,
                  login_id: addUser_data.login_id,
                  user_name: addUser_data.user_name,
                  admin: addUser_data.admin,
                  o_font: addUser_data.font_size
                });
                var font = 'Med';
                if(addUser_data.font_size==0) {
                  font = 'Small';
                }else if(addUser_data.font_size==1) {
                  font = 'Med';
                }else if(addUser_data.font_size==2) {
                  font = 'Large';
                }
                setSizeClass(font);
                reportWindowSize();
                setIsMapView(true);
                setLoading(false);
              }
              
            }else if(data.result===2) {
              alert('[ '+addUser_data.login_id+' ] は使用できないユーザーIDです');
              setLoadingUserEdit(false);
              if(addUserData.action=='login') {
                setIsMapView(true);
                setLoading(false);
              }
            }else {
              alert('登録処理に失敗しました');
              setLoadingUserEdit(false);
              if(addUserData.action=='login') {
                setIsMapView(true);
                setLoading(false);
              }
            }
          }
        );



    }else if(addUserData.action=='update') {

      sendData += '&user_id='+addUser_data.user_id;

      fetch('/map_update_user'+sendData)
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

  function savaPos() {
    if(posData.lat) {
      const lat = Number(posData.lat);
      const lng = Number(posData.lng);
      setPosition(new LatLng(lat, lng));
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

  useEffect(() => {
    setPosition(defaultPosition);
    setZoomLevel(defaultZoomLevel);
  }, [defaultPosition,defaultZoomLevel]);

  /* DBから取得したデータを初期データとしてセット */
  useEffect(() => {
    const defaultMarkerViewData = array.map(item => {
      item.key = item.marker_no;
      return item;
    });
    /* DBからのデータ取得前はリストを表示しない */
    if(array[0].key) {
      setMarkerViewData(defaultMarkerViewData);
    }

  }, [array]);

  useEffect(() => {
    setTagData(tagArray);
  }, [tagArray]);

  useEffect(() => {
    setMarkerListData(markerListArray);
  }, [markerListArray]);

  useEffect(() => {
    setTagListData(tagListArray);
  }, [tagListArray]);

  useEffect(() => {

    if(selectTagDatas[0]) {
      var selectTagNo = [];
      selectTagDatas.map(tag => {
        selectTagNo.push(tag.tag_no);
      });
      var selectMarkerNo =[];
      tagData.map(tag => {
        if(selectTagNo.indexOf(tag.tag_no)!=-1) {
          selectMarkerNo.push(tag.marker_no);
        }
      });
      var defaultMarkerViewData = [];
      markerListData.map(item => {
        if(selectMarkerNo.indexOf(item.marker_no)!=-1) {
          item.key = item.marker_no;
          defaultMarkerViewData.push(item);
        }
      });
      setMarkerViewData(defaultMarkerViewData);

      const newTagListData = tagListData.map(tag => {
        if(selectTagNo.indexOf(tag.tag_no)!=-1) {
          tag.selected = 1;
        }else {
          tag.selected = 0;
        }
        return tag;
      });
      setTagListData(newTagListData);
    }else {
      setMarkerViewData(markerListData);
      const newTagListData = tagListData.map(tag => {
        tag.selected = 0;
        return tag;
      });
      setTagListData(newTagListData);
    }
  }, [selectTagDatas]);

  useEffect(() => {
    setLoading(false);
  }, []);

/* --------------------Style-------------------- */

  var menu_size = '26px';
  var add_size = '20px';
  if(sizeClass=='Small') {
    menu_size = '22px';
    add_size = '16px';
  }else if(sizeClass=='Large') {
    menu_size = '32px';
    add_size = '28px';
  }

  var select_tag_name = '';
  selectTagDatas.map(tag => {
    if(select_tag_name!='') {
      select_tag_name += ',';
    }
    select_tag_name += tag.tag_name;
  });


/* --------------------本体-------------------- */

  return (
    <div>
      {/* TagSelectモーダル */}
      <TagSelectModal
        showModal={showTagSelect}
        modalOpen={tagSelectOpen}
        modalClose={tagSelectClose}
        user={user}
        loadingTagSelect={loadingTagSelect}
        setLoadingTagSelect={setLoadingTagSelect}
        selectTagDatas={selectTagDatas}
        setSelectTagDatas={setSelectTagDatas}
        tagListData={tagListData}
        setTagListData={setTagListData}
        sizeClass={sizeClass}
      />
      {/* MarkerListモーダル */}
      <MarkerList
        showModal={showMarkerList}
        modalOpen={markerListOpen}
        modalClose={markerListClose}
        markerListData={markerListData}
        setMarkerListData={setMarkerListData}
        tagData={tagData}
        setTagData={setTagData}
        user={user}
        setShowMarker={setShowMarker}
        markerEditForList={markerEditForList}
        setCenterData={setCenterData}
        setShowCenter={setShowCenter}
        loadingMarkerList={loadingMarkerList}
        setLoadingMarkerList={setLoadingMarkerList}
        moveMap={moveMap}
        selectTagDatas={selectTagDatas}
        sizeClass={sizeClass}
      />
      {/* TagEditモーダル */}
      <TagEdit
        showModal={showTagEdit}
        modalOpen={tagEditOpen}
        modalClose={tagEditClose}
        user={user}
        setShowTagEditDtl={setShowTagEditDtl}
        setCenterData={setCenterData}
        setShowCenter={setShowCenter}
        loadingTagEdit={loadingTagEdit}
        setLoadingTagEdit={setLoadingTagEdit}
        tagData={tagData}
        setTagData={setTagData}
        tagListData={tagListData}
        setTagListData={setTagListData}
        setTagEditDtlData={setTagEditDtlData}
        sizeClass={sizeClass}
      />
      {/* TagEditDtlモーダル */}
      <TagEditDtlModal
        showModal={showTagEditDtl}
        modalOpen={tagEditDtlOpen}
        modalClose={tagEditDtlClose}
        modalData={tagEditDtlData}
        tagEditDtlViewData={tagEditDtlViewData}
        setTagEditDtlViewData={setTagEditDtlViewData}
        user={user}
        loadingTagEditDtl={loadingTagEditDtl}
        setLoadingTagEditDtl={setLoadingTagEditDtl}
        setShowTagEditMarkerEdit={setShowTagEditMarkerEdit}
        tagListUpdateData={tagListUpdateData}
        setTagListUpdateData={setTagListUpdateData}
        setTagEditMarkerEditData={setTagEditMarkerEditData}
        markerListData={markerListData}
        tagData={tagData}
        inMarker={inMarker}
        setInMarker={setInMarker}
        addTag={addTag}
        sizeClass={sizeClass}
      />
      {/* TagEditMarkerEditモーダル */}
      <TagEditMarkerEditModal
        showModal={showTagEditMarkerEdit}
        modalOpen={tagEditMarkerEditOpen}
        modalClose={tagEditMarkerEditClose}
        modalData={tagEditMarkerEditData}
        markerListData={markerListData}
        tagListUpdateData={tagListUpdateData}
        setTagListUpdateData={setTagListUpdateData}
        tagData={tagData}
        inMarker={inMarker}
        setInMarker={setInMarker}
        tagEditDtlData={tagEditDtlData}
        setTagEditDtlData={setTagEditDtlData}
        user={user}
        sizeClass={sizeClass}
      />
      {/* Markerモーダル */}
      <MarkerModal
        showModal={showMarker}
        modalOpen={markerOpen}
        modalClose={markerClose}
        modalData={markerData}
        setModalData={setMarkerData}
        tagData={tagData}
        tagUpdateData={tagUpdateData}
        setTagUpdateData={setTagUpdateData}
        tagListData={tagListData}
        setTagListData={setTagListData}
        tagCheck={tagCheck}
        setTagCheck={setTagCheck}
        user={user}
        loadingMarker={loadingMarker}
        setLoadingMarker={setLoadingMarker}
        setShowMarkerTag={setShowMarkerTag}
        sizeClass={sizeClass}
        addMarker={addMarker}
        markerTagViewDatas={markerTagViewDatas}
        setMarkerTagViewDatas={setMarkerTagViewDatas}
      />
      {/* MarkerTagモーダル */}
      <MarkerTagModal
        showModal={showMarkerTag}
        modalOpen={markerTagOpen}
        modalClose={markerTagClose}
        modalData={markerTagData}
        tagData={tagData}
        tagUpdateData={tagUpdateData}
        setTagUpdateData={setTagUpdateData}
        tagListData={tagListData}
        setTagListData={setTagListData}
        tagCheck={tagCheck}
        setTagCheck={setTagCheck}
        user={user}
        loadingMarkerTag={loadingMarkerTag}
        setLoadingMarkerTag={setLoadingMarkerTag}
        sizeClass={sizeClass}
        setMarkerTagViewDatas={setMarkerTagViewDatas}
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
        goTagSelect={goTagSelect}
        goMarkerList={goMarkerList}
        goTagEdit={goTagEdit}
        goLogin={goLogin}
        goLogout={goLogout}
        goShinki={goShinki}
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
              <td className={classNames("width10P")} onClick={openMenu}>
                <IconContext.Provider value={{ size: menu_size, style: { cursor: 'pointer'} }}>
                  <AiOutlineMenu />
                </IconContext.Provider>
              </td>
              <td className={"width60P"}><span className={"title"+sizeClass}>{select_tag_name}</span></td>

            </tr>
          </table>
        </div>
        {/* リスト表示部分 */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>

            <MapView
                position={position}
                tagData={tagData}
                isMapView={isMapView}
                markerAdd={markerAdd}
                markerEdit={markerEdit}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                markerViewData={markerViewData}
                setPosition={setPosition}
                setPosData={setPosData}
                sizeClass={sizeClass}
            />

          </div>
        </div>
      </div>
      <Loader isLoading={ loading } />
    </div>
  );
}

/* 地図表示 */
function MapView({ position, tagData, isMapView, markerAdd, markerEdit, zoomLevel, setZoomLevel, markerViewData, setPosition, setPosData, sizeClass }) {

  const [mapKey, setMapKey] = useState(0);

  const onClickAdd = (latlng) =>{
    markerAdd(latlng);
  }

  const onClickEdit = (item) =>{
    markerEdit(item);
  }

  useEffect(() => {
    setMapKey(new Date().getTime());
  }, [position]);



  if (!position) {
    return (
      <div className={"App"}>Loading...</div>
    );
  }else {

/* [MapApp.js]でnavigator.geolocation.getCurrentPositionでposition取得して[MapMain.js]へ値を渡してる */
/* getCurrentPositionで値が取得できてなかった場合考慮の処理(再取得？)が必要 */
//    const nowPos = new LatLng(position.latitude, position.longitude);


    /* 取り敢えず画面確認用にベタ書き */
//    const nowPos = new LatLng(34.73766, 135.49798);
//    const nowPos = new LatLng(position.latitude, position.longitude);

    return (
      <div className={"MapContainer"}>
        {isMapView &&
          <MapContainer key={mapKey} center={position} zoom={zoomLevel} style={{ height: '80vh' }}>
            <MapViewEvent
              markerViewData={markerViewData}
              tagData={tagData}
              onClickAdd={onClickAdd}
              onClickEdit={onClickEdit}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
              setPosition={setPosition}
              setPosData={setPosData}
              sizeClass={sizeClass}
            />
          </MapContainer>
        }

      </div>

    );

  }
}

/* 地図表示 */
function MapViewEvent({ markerViewData, tagData, onClickAdd, onClickEdit, zoomLevel, setZoomLevel, setPosition, setPosData, sizeClass }) {

  /* イベント取得 */
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
    dblclick: (e) => {
      onClickAdd(e.latlng);
    },
    move: () => {
      const lat = (mapEvents.getCenter()).lat;
      const lng = (mapEvents.getCenter()).lng;
      setPosData({lat:lat, lng:lng});
    },
  });

  const onClickMarker = (item) => {
    onClickEdit(item);
  }

  return (
    <div>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerViewData.map(item => (
      (item.latitude &&
        <MarkerView
          item={item}
          tagData={tagData}
          onClickEdit={() => onClickMarker(item)}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          sizeClass={sizeClass}
        />
      )
      ))}
    </div>
  );
}

/* マーカー表示 */
function MarkerView({ item, tagData, onClickEdit, zoomLevel, setZoomLevel, sizeClass }) {

  /* タグのデータ */
  const [markerTagDatas, setMarkerTagDatas] = React.useState([{}]);

  /* マーカー座標 */
  var lat = Number(item.latitude);
  var lng = Number(item.longitude);
  var reLat = 0.000178;
  var reLng = 0.00007;
  var kake = 18-zoomLevel;
  lat = lat + reLat*Math.pow(2,kake);
  lng = lng - reLng*Math.pow(2,kake);

  const markerPos = new LatLng(lat, lng);

  useEffect(() => {
    const newMarkerTagDatas = [];
    tagData.map(tag => {
      if(item.marker_no==tag.marker_no) {
        newMarkerTagDatas.push(tag);
      }
    });
    setMarkerTagDatas(newMarkerTagDatas);
  }, [tagData]);

  return (

    <Marker position={markerPos}>
      <Popup>
        <div onClick={() => onClickEdit(item)}>
          <span className={"titleMod"+sizeClass}><b>{item.marker_name}</b></span>
        </div>
        <div onClick={() => onClickEdit(item)}>
          <span className={"tableCel"+sizeClass}>{item.dtl}</span>
        </div>
        <div>
          {markerTagDatas.map(markerTagData => (
            <Tag
              markerTagData={markerTagData}
              item={item}
              onClickEdit={onClickEdit}
            />
          ))}
        </div>
      </Popup>
    </Marker>

  );

}

/* タグ */
function Tag({ markerTagData, item, onClickEdit }) {

  var nameLength = 0;
  var reTagName = '';
  if(markerTagData.tag_name) {
    for (var i = 0; i < (markerTagData.tag_name).length; i++) {
      var c = markerTagData.tag_name.charCodeAt(i);
      if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        nameLength += 1;
      } else {
        nameLength += 2;
      }
      if(nameLength<11) {
        reTagName += markerTagData.tag_name.charAt(i);
      }
    }
  }

  var colorClass = "ellipsePanel";
  if(markerTagData.color=='cd853f') {
    colorClass = "ellipsePanelPE";
  }else if(markerTagData.color=='ff7f50') {
    colorClass = "ellipsePanelCO";
  }else if(markerTagData.color=='ffb6c1') {
    colorClass = "ellipsePanelLP";
  }else if(markerTagData.color=='dda0dd') {
    colorClass = "ellipsePanelPL";
  }else if(markerTagData.color=='adff2f') {
    colorClass = "ellipsePanelGY";
  }else if(markerTagData.color=='dcdcdc') {
    colorClass = "ellipsePanelDef";
  }else if(markerTagData.color=='f0f8ff') {
    colorClass = "ellipsePanelAB";
  }else if(markerTagData.color=='fffacd') {
    colorClass = "ellipsePanelLC";
  }else if(markerTagData.color=='cd5c5c') {
    colorClass = "ellipsePanelIR";
  }

  return (
    <span onClick={() => onClickEdit(item)}>
      {nameLength<3 &&
        <span className={colorClass}>
          &nbsp;{reTagName}&nbsp;
        </span>
      }
      {nameLength>2 &&
        <span className={colorClass}>
          {reTagName}
        </span>
      }
      &nbsp;
    </span>
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
function MapMain() {

  const location = useLocation();
  const [userData, setUserData] = useState({});
  const [array, setArray] = useState([{}]);
  const [tagArray, setTagArray] = useState([{}]);
  const [markerListArray, setMarkerListArray] = useState([{}]);
  const [tagListArray, setTagListArray] = useState([{}]);
  const [position, setPosition] = useState(new LatLng(34.732938, 135.498543));
  const [zoomLevel, setZoomLevel] = useState(18);
  const [tagNo, setTagNo] = useState(0);

  const history = useHistory();

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      if(position!=null) {
        setPosition(new LatLng( latitude, longitude ));
      }
    });
  }

  useEffect(() =>{

    var user_flg = false;
    /* ユーザーデータ確認 */
    if(location.state!=null) {
      if(location.state.user!=null) {
        user_flg = true;
      }
    }
    if(!user_flg) {
      setUserData({
        admin: 0,
        o_font: 1,
        user_name: 'ゲスト'
      });
    }else {
      setUserData(location.state.user);
    }

    /* 位置情報,表示タグ */
    if(location.state!=null) {
      if(location.state.defaultPosition!=null) {
        if(location.state.defaultPosition.defaultPosition!=null) {
          setPosition(location.state.defaultPosition.defaultPosition);
          setZoomLevel(location.state.defaultPosition.defaultZoomLevel);
        }
      }
      if(location.state.tagNo!=null) {
        setTagNo(location.state.tagNo);
      }
    }

    var user_id = '';
    if(location.state!=null) {
      if(location.state.user) {
        user_id = location.state.user.user_id;
      }
    }

    /* marker_data,tag_data検索 */
    fetch('/select_marker?tag_no='+tagNo+'&user_id='+user_id)
      .then((res) => res.json())
      .then(
        (data) => {
          if(data.result===1) {
            setArray(data.data);
            setMarkerListArray(data.data3);
          }
          setTagArray(data.data2);
          setTagListArray(data.data4);
        }
      );
  },[]);

  return (
    <div class="container is-fluid">
      <Login userData={ userData } defaultPosition={ position } defaultZoomLevel={ zoomLevel } array={ array } tagArray={ tagArray } markerListArray={ markerListArray } tagListArray={ tagListArray } />
    </div>
  );
}

export default MapMain;
