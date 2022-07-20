import { Avatar } from "@material-ui/core";
import Popup from "reactjs-popup";
import ReactPlayer from "react-player";
import { VscChromeClose } from "react-icons/vsc";

import { useState } from "react";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";

import "./index.css";

// statusId: each._id,
// videoUrl: each.video_url,
// thumbnailUrl: each.thumbnail_url,
// statusMessage: each.status_message,
// roomId: each.room_id,
// roomName: each.room_name,
// timestamp: each.timestamp,

function StatusItem({ statusData }) {
  const {
    videoUrl,
    thumbnailUrl,
    statusMessage,
    roomName,
    timestamp,
  } = statusData;

  const [openVideo, setOpenVideo] = useState(false);

  const getFormattedDatetime = (timestamp) => {
    return distanceInWordsToNow(new Date(timestamp));
  };

  const onClickVideoCloseButton = () => {
    setOpenVideo(false);
  };

  const renderMediaView = () => (
    <Popup
      onClose={() => setOpenVideo(false)}
      open={openVideo}
      className="popup-content"
      modal
    >
      {(close) => (
        <div className="popup-body">
          <button onClick={onClickVideoCloseButton} className="close-button">
            <VscChromeClose size={27} />
          </button>
          <div className="react-wrapper">
            <ReactPlayer
              playing={openVideo}
              width="100%"
              height="100%"
              className="react-player"
              url={videoUrl}
            />
          </div>
          <p>{statusMessage}</p>
        </div>
      )}
    </Popup>
  );
  const renderStatusView = () => (
    <li className="status-item" onClick={() => setOpenVideo(true)}>
      <Avatar url={thumbnailUrl} />
      <div className="status-item__info">
        <h3> {roomName}</h3>
        <p>{getFormattedDatetime(timestamp)} ago...</p>
      </div>
      {renderMediaView()}
    </li>
  );

  return renderStatusView();
}

export default StatusItem;
