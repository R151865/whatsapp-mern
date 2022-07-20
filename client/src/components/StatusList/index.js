import { Avatar } from "@material-ui/core";
import "./index.css";
import StatusItem from "../StatusItem";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function StatusList() {
  const [status, setStatus] = useState([]);

  useEffect(() => {
    async function FetchStatus() {
      const jwtToken = Cookies.get("jwtToken");
      const url = "https://whatsapp-backend-sb.herokuapp.com/status";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      const convertedData = data.map((each) => ({
        statusId: each._id,
        videoUrl: each.video_url,
        thumbnailUrl: each.thumbnail_url,
        statusMessage: each.status_message,
        roomId: each.room_id,
        roomName: each.room_name,
        timestamp: each.timestamp,
      }));
      setStatus(convertedData);
    }

    FetchStatus();
  }, []);

  return (
    <div className="status-list">
      <div className="status-list__myStatus">
        <div className="status-list__avatar">
          <Avatar />
          <button type="button">+</button>
        </div>
        <div className="status-list__myStatusInfo">
          <h3>My Status</h3>
          <p>Tap to add status update</p>
        </div>
      </div>

      <p>Recent updates</p>

      <ul className="status-list__list">
        {status.map((each) => (
          <StatusItem key={each.statusId} statusData={each} />
        ))}
      </ul>
    </div>
  );
}

export default StatusList;
