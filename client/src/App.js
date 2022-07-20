import { Route, Routes } from "react-router-dom";

import ChatBox from "./components/ChatBox";
import Home from "./components/Home";
import Login from "./components/Login";
import VideoCall from "./components/VideoCall";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => (
  <>
    <Routes>
      <Route exact path="/login" element={<Login />} />

      <Route
        exact
        path="/video-call"
        element={<ProtectedRoutes component={<VideoCall />} />}
      />

      <Route
        exact
        path="/"
        element={<ProtectedRoutes component={<Home />} />}
      />

      <Route
        exact
        path="/rooms/:roomId/messages"
        element={<ProtectedRoutes component={<ChatBox />} />}
      />
    </Routes>
  </>
);

export default App;
