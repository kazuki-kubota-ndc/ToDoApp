import './common.css';
import React,{ useState,useEffect,Component } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import { IconContext } from 'react-icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsBookmarkStarFill } from 'react-icons/bs';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Leaflet from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// marker setting
let DefaultIcon = Leaflet.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
Leaflet.Marker.prototype.options.icon = DefaultIcon;

const MarkerModal = ({ showModal, modalOpen, modalClose, modalData, setModalData, tagData, tagUpdateData, setTagUpdateData, tagListData, setTagListData, tagCheck, setTagCheck, user, loadingMarker, setLoadingMarker, setShowMarkerTag, sizeClass, addMarker, markerTagViewDatas, setMarkerTagViewDatas }) => {

  const [favoriteColor, setFavoriteColor] = React.useState('#a9a9a9');

  /* markerダイアログのデータ */
  const [markerData, setMarkerData] = React.useState(new Map());

  /* 入力欄 */
  const [inputMarkerName, setInputMarkerName] = React.useState('');
  const [inputDtl, setInputDtl] = React.useState('');
  const [inputFavoriteFlg, setInputFavoriteFlg] = React.useState('');
  /* 表示用 */
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  /* マーカー名 */
  const changeMarkerName = e => {
    setIsDisabled(false);
    const data = markerData;
    data.markerName = e.target.value;
    setMarkerData(data);
    setInputMarkerName(e.target.value);
  }

  /* 詳細 */
  const changeDtl = e => {
    setIsDisabled(false);
    const data = markerData;
    data.dtl = e.target.value;
    setMarkerData(data);
    setInputDtl(e.target.value);
  }



  /* フォームデータ等を初期化 */
  const reNewData = () => {
//    const newModalData = new Map();
//    setModalData(newModalData);
    const newMarkerData = new Map();
    setMarkerData(newMarkerData);
    setInputMarkerName('');
    setInputDtl('');
    setInputFavoriteFlg('0');
    setFavoriteColor('#a9a9a9');
    setIsDisabled(true);
  }

  /* モーダルを閉じる時にデータを初期化 */
  const modalCloseBefore = () => {
    if(!loadingMarker) {
      setTimeout(() => {reNewData();}, 200);
      modalClose();
    }
  }

  /* モーダル閉じる */
  const closeModal = () => {
    modalClose();
  }

  /* 開く時の初期処理 */
  const modalOpenBefore = () => {
    setLoadingMarker(false);

    modalOpen();
  }


  const onClickUpdate = () => {

    const newMarkerData = markerData;
    var err = false;
    /* 登録 */
    if(modalData.action=='insert') {
      if(markerData.markerName==null || markerData.markerName=='') {
        alert('MARKERNAME IS EMPTY');
        err = true;
      }
      if(!markerData.markerName) {
        newMarkerData.markerName = '';
      }
      if(!markerData.dtl) {
        newMarkerData.dtl = '';
      }
      if(!markerData.favoriteFlg) {
        newMarkerData.favoriteFlg = '0';
      }
    /* 編集 */
    }else if(modalData.action=='update' || modalData.action=='update_for_list') {
      if(!markerData.markerName) {
        newMarkerData.markerName = modalData.markerName;
      }
      if(!markerData.dtl) {
        newMarkerData.dtl = modalData.dtl;
      }
      if(!markerData.favoriteFlg) {
        newMarkerData.favoriteFlg = modalData.favoriteFlg;
      }
    }
    if(!err) {
//      reNewData();
      setInputFavoriteFlg('0');
      setFavoriteColor('#a9a9a9');
      addMarker(newMarkerData);
    }
  }

  const onClickMarkerTagEdit = () => {
    if(!loadingMarker) {
      setShowMarkerTag(true);
    }
  }

  const onClickFavorite = () => {
    if(!loadingMarker) {
      setIsDisabled(false);
      if(favoriteColor=='#a9a9a9') {
        setFavoriteColor('#ff69b4');
        setInputFavoriteFlg('1');
        const data = markerData;
        data.favoriteFlg = '1';
        setMarkerData(data);
      }else {
        setFavoriteColor('#a9a9a9');
        setInputFavoriteFlg('0');
        const data = markerData;
        data.favoriteFlg = '0';
        setMarkerData(data);
      }
    }
  }

  const [mapKey, setMapKey] = useState(0);
  /* マーカー座標 */
  const [markerPos, setMarkerPos] = useState(new LatLng(34.732938, 135.498543));

  useEffect(() => {
    /* 登録情報初期化 */
    setMarkerData([]);

    setInputMarkerName(modalData.markerName);
    setInputDtl(modalData.dtl);
    setInputFavoriteFlg(modalData.favoriteFlg);
    if(modalData.favoriteFlg=='1') {
      setFavoriteColor('#ff69b4');
    }
    if(modalData.lat) {
      const lat = Number(modalData.lat)+0.000178;
      const lng = Number(modalData.lng)-0.00007;
      setMarkerPos(new LatLng(lat, lng));
    }
    /* タグチェック情報 */
    var newTagCheck = [];
    tagData.map(item => {
      if(item.marker_no==modalData.markerNo) {
        newTagCheck.push(item.tag_no);
      }
    });
    setTagCheck(newTagCheck);
    setTagUpdateData([]);

    const newMarkerTagDatas = [];

    tagData.map(tag => {
      if(modalData.markerNo===tag.marker_no) {
        newMarkerTagDatas.push(tag);
      }
    });
    setMarkerTagViewDatas(newMarkerTagDatas);

  }, [modalData]);

  useEffect(() => {
    if(tagUpdateData.length!=0) {
      setIsDisabled(false);
    }
  }, [tagUpdateData]);

  useEffect(() => {
    if(loadingMarker) {
      setIsDisabled(true);
    }
  }, [loadingMarker]);

  useEffect(() => {
    if(user.user_id) {
      setIsReadOnly(false);
    }else {
      setIsReadOnly(true);
    }
  }, [user]);

  /* モーダルのスタイル */
  const modalStyle : ReactModal.Styles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
//      height: '90%',
//      width: '90%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    // 親ウィンドウのスタイル（ちょっと暗くする）
    overlay: {
      background: 'rgba(0, 0, 0, 0.2)'
    }
  };

  /* リストのラベルカラー */
  const labelColor1 = {
    background: '#0000ff',
  }

  const labelColor2 = {
    background: '#ff0000',
  }

  var select_size = 'is-normal';
  if(sizeClass=='Small') {
    select_size = 'is-small';
  }else if(sizeClass=='Large') {
    select_size = 'is-medium';
  }

  var edit_close_size = '30px';
  if(sizeClass=='Small') {
    edit_close_size = '24px';
  }else if(sizeClass=='Large') {
    edit_close_size = '40px';
  }

  return (
    <ReactModal
      isOpen={showModal}
      onAfterOpen={modalOpenBefore}
      onRequestClose={modalCloseBefore}
      style={modalStyle}
      contentLabel="Settings"
    >
      <div className={classNames("panel", "height100P")}>
        {/* ヘッダー */}
        <div className={classNames("panel-heading")}>
            <table className={"width100P"}>
              <tr>
                <td className={classNames("width10P")}>
                  {user.user_id &&
                    <div onClick={onClickFavorite}>
                      <IconContext.Provider value={{ color: favoriteColor, size: '28px', style: { cursor: 'pointer'} }}>
                        <BsBookmarkStarFill />
                      </IconContext.Provider>
                    </div>
                  }
                </td>
                <td className={classNames("width5P")}>&nbsp;</td>
                <td className={classNames("width2P")}>&nbsp;</td>
                <td className={"width68P"}>
                  <span className={classNames("titleMod"+sizeClass)}>
                    マーカー{modalData.titleName}
                  </span>
                </td>
                <td className={classNames("flexboxRight")} onClick={modalCloseBefore}>
                  <IconContext.Provider value={{ size: '26px', style: { cursor: 'pointer'} }}>
                    <AiOutlineCloseCircle />
                  </IconContext.Provider>
                </td>
              </tr>
            </table>
        </div>

        {/* リスト表示部分 */}
        <div className={classNames("panel-block", "panelB")}>
          <div className={classNames("height100P", "width100P")}>

            <div className={"MapContainerMarker"}>
              <MapContainer key={mapKey} center={markerPos} zoom={19} scrollWheelZoom={false} zoomControl={false} dragging={false} style={{ height: '40vh' }}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPos}>
                </Marker>
              </MapContainer>
            </div>

            <div>
              <div>
                <span className={"labelFont"+sizeClass}>タイトル</span>
              </div>
              <div>
                <input
                  class="input"
                  className={classNames("noBorderInput", "title"+sizeClass, "cursorPointer")}
                  type="text"
                  placeholder='NEW NAME'
                  onChange={changeMarkerName}
                  value={inputMarkerName}
                  readOnly={isReadOnly}
                />
              </div>
            
              <div>
                <div>
                  <span className={"labelFont"+sizeClass}>詳細</span>
                </div>
                <div>
                  <textarea
                    className={classNames("noBorderTextarea", "titleMod"+sizeClass, "cursorPointer")}
                    onChange={changeDtl}
                    value={inputDtl}
                    rows="4"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>
            {/* タグ */}
            <div className={"pad0mar0"}>
              {markerTagViewDatas.map(markerTagData => (
                <Tag
                  markerTagData={markerTagData}
                />
              ))}
            </div>

            {user.user_id &&
              <div className={classNames("width100P")}>
                <table className={"width100P"}>
                  <tr>
                    <td>
                      <span className={classNames("medText"+sizeClass, "cursorPointer")} onClick={onClickMarkerTagEdit}><b>タグの追加・削除</b></span>
                    </td>
                    <td className={classNames("flexboxRight")}>
                      <button class="button is-primary" onClick={onClickUpdate} disabled={isDisabled}>{modalData.execName}</button>
                    </td>
                  </tr>
                </table>
              </div>
            }

          </div>
        </div>

      </div>
      <LoaderUser isLoading={ loadingMarker } />
    </ReactModal>
  );
}

/* タグ */
function Tag({ markerTagData }) {

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
    <span>
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
function LoaderUser({ isLoading }) {

  const style = {
    position: "fixed",
    top: "25%",
    left: 0,
    width: "100%",
    height: "75%",
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



export default MarkerModal;