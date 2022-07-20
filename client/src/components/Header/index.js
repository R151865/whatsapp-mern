import { IconButton } from "@material-ui/core";

import CameraAltIcon from "@material-ui/icons/CameraAlt";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import "./index.css";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { TbLogout } from "react-icons/tb";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { IoMdVideocam } from "react-icons/io";

function Header({ activeTab = "CHATS", updateActiveTab }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const activeChatTabClassName = activeTab === "CHATS" ? "active-tab" : "";
  const activeStatusTabClassName = activeTab === "STATUS" ? "active-tab" : "";
  const activeCallTabClassName = activeTab === "CALLS" ? "active-tab" : "";

  const onClickLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("userId");
    navigate("/login", { replace: true });
  };

  const renderRightTopMenu = () => (
    <div className="right_top_menu" onClick={() => setShowMenu(false)}>
      <p>Linked devices</p>
      <p>New broadcast</p>
      <p>Settings</p>
      <button onClick={onClickLogout}>LOGOUT</button>
    </div>
  );

  return (
    <div className="header">
      {showMenu && renderRightTopMenu()}

      <div className="header__top">
        <p>WhatsApp</p>
        <div className="header__topRight">
          <IconButton onClick={() => navigate("/video-call")}>
            <IoMdVideocam className="icon-button" />
          </IconButton>

          <IconButton onClick={() => setShowMenu(true)}>
            <MoreVertOutlinedIcon className="icon-button" />
          </IconButton>
        </div>
      </div>

      <div className="header__tabs">
        <CameraAltIcon />
        <button
          onClick={() => updateActiveTab("CHATS")}
          type="button"
          className={`header__tabsButton ${activeChatTabClassName}`}
        >
          CHATS
        </button>
        <button
          onClick={() => updateActiveTab("STATUS")}
          type="button"
          className={`header__tabsButton ${activeStatusTabClassName}`}
        >
          STATUS
        </button>
        <button
          onClick={() => updateActiveTab("CALLS")}
          type="button"
          className={`header__tabsButton ${activeCallTabClassName}`}
        >
          CALLS
        </button>
      </div>
    </div>
  );
}

export default Header;
