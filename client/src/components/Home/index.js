import React, { useState } from "react";

import Header from "../Header";
import ChatsList from "../ChatsList";
import StatusList from "../StatusList";
import CallsList from "../CallsList";

function Home() {
  const [activeTab, setActiveTab] = useState("CHATS");

  const updateActiveTab = (activeTab) => {
    setActiveTab(activeTab);
    // getBackendPostCall();
  };

  const renderViewsBasedOnActiveTab = () => {
    switch (activeTab) {
      case "CHATS":
        return <ChatsList />;
      case "STATUS":
        return <StatusList />;
      case "CALLS":
        return <CallsList />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header activeTab={activeTab} updateActiveTab={updateActiveTab} />
      {renderViewsBasedOnActiveTab()}
    </>
  );
}

export default Home;
