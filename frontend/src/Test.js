//import './Test.css';
import React,{ useState,useEffect,useRef,Component } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import classNames from 'classnames';
import ReactModal from 'react-modal';
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

function MapMaker({nowPosition}) {

  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  /* useEffect,getCurrentPositionが実行されているかどうかを判定 */
  const isFirstRef = useRef(true);
  const isCurrentPositionRef = useRef(true);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
    isCurrentPositionRef.current = false;
  };

  getCurrentPosition();

  const onClickEdit = () =>{
alert('test');
  }

  useEffect(() => {
    isFirstRef.current = false;
    if ('geolocation' in navigator) {
      setAvailable(true);
    }
  }, [isAvailable]);

  /* useEffect実行前の処理 */
  if (isFirstRef.current || isCurrentPositionRef.current) {
    return (
      <div className={"App"}>Loading...</div>
    );
  }else {

    const nowPos = new LatLng(position.latitude, position.longitude);

    return (
      <div className={"MapContainer"}>
        <MapContainer center={nowPos} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
            url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
          />
          <Marker position={nowPos}>
            <Popup>
              <div onClick={onClickEdit}>
                <span><b>title</b></span>
              </div>
              <div>
                <span>dtl</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

      <div>
        {position.latitude}:{position.longitude}
      </div>

      </div>

    );
  }
}



/* 初期処理 */
function Test() {


  return (
    <div class="container is-fluid">
      <MapMaker

      />
    </div>
  );
}


export default Test;