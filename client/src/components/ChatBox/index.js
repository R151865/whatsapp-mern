import { Avatar, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";

import { HiCurrencyRupee } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";

import { Link } from "react-router-dom";

import "./index.css";

function ChatBox(props) {
  const userId = Cookies.get("userId");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState({});

  useEffect(() => {
    async function FetchRoomMessages() {
      const jwtToken = Cookies.get("jwtToken");
      const url = `https://whatsapp-backend-sb.herokuapp.com/rooms/${roomId}/messages`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      const convertedMsgs = data.messages.map((each) => ({
        messageId: each._id,
        message: each.message,
        userId: each.user_id,
        userName: each.user_name,
        roomId: each.room_id,
        timestamp: each.timestamp,
      }));

      const lastSeen = convertedMsgs[convertedMsgs.length - 1].timestamp;

      const convertedRoom = {
        roomId: data.room._id,
        roomName: data.room.room_name,
        roomProfile: data.room.room_profile,
        lastSeen,
      };

      setRoom(convertedRoom);
      setMessages(convertedMsgs);
    }
    FetchRoomMessages();
  }, [roomId]);

  useEffect(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      const newMsg = {
        messageId: data._id,
        message: data.message,
        userId: data.user_id,
        userName: data.user_name,
        roomId: data.room_id,
        timestamp: data.timestamp,
      };

      setMessages([...messages, newMsg]);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [messages]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    const jwtToken = Cookies.get("jwtToken");
    const url = `https://whatsapp-backend-sb.herokuapp.com/rooms/${roomId}/messages/new`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ message: input }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    setInput("");
  };

  const getFormattedDate = (timestamp) => {
    let newDate = new Date(timestamp);
    // console.log(newDate);
    // newDate = addHours(newDate, 5);
    // newDate = addMinutes(newDate, 30);
    return distanceInWordsToNow(new Date(newDate));
  };

  return (
    <div className="chat-box">
      <div className="chat-box__header">
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar />

        <div className="chat-box__headerInfo">
          <h3>{`${room.roomName}`.slice(0, 20)}</h3>
          <p>
            {room.lastSeen
              ? `${getFormattedDate(room.lastSeen)} ...ago`.slice(0, 20)
              : "last seen at..."}
          </p>
        </div>

        <div className="chat-box__headerRight">
          <IconButton onClick={() => navigate("/video-call")}>
            <VideocamIcon />
          </IconButton>

          <IconButton>
            <CallIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat-box__body">
        {messages.map((each) => (
          <p
            key={each.messageId}
            className={`chat-box__senderMessage 
            ${each.userId == userId ? "chat-box__receiverMessage" : ""}`}
          >
            <span className="chat-box__name">{each.userName}</span>
            {each.message}
            <span className="chat-box__timestamp">
              {getFormattedDate(each.timestamp)}
            </span>
          </p>
        ))}
      </div>

      <div className="chat-box__footer">
        <div className="chat-box__search">
          <IconButton>
            <InsertEmoticonIcon />
          </IconButton>

          <form onSubmit={onSubmitForm}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="input"
              placeholder="Message..."
            />
          </form>
          <div className="chat-box__searchRightIcons">
            <div className="chat-box__searchFileButton">
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </div>

            <IconButton>
              <HiCurrencyRupee />
            </IconButton>

            <IconButton>
              <PhotoCameraIcon />
            </IconButton>
          </div>
        </div>

        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatBox;
