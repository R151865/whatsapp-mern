const express = require("express");
const path = require("path");
const cors = require("cors");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Pusher = require("pusher");
const mongoose = require("mongoose");
const {
  UserModal,
  RoomModal,
  MessageModal,
  StatusModal,
  CallModal,
} = require("./modal.js");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const createDatabaseAndData = require("./createDatabaseAndData.js");

const pusher = new Pusher({
  appId: "1422273",
  key: "b56383faa5c5cb36c00f",
  secret: "5822e876b387c9f82540",
  cluster: "ap2",
  useTLS: true,
});

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const PORT = process.env.PORT || 5000;

const connectionUrl =
  "mongodb+srv://sulthan:sulthan@cluster0.hrbrj.mongodb.net/?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const initializeDBAndServer = async () => {
  try {
    mongoose
      .connect(connectionUrl, options)
      .then(() => console.log("Mongoose DB Connected"));

    const db = mongoose.connection;
    db.once("open", () => {
      console.log("connection happened");

      const msgCollection = db.collection("messages");
      const changeStream = msgCollection.watch();

      changeStream.on("change", (change) => {
        if (change.operationType === "insert") {
          const msgDetails = change.fullDocument;
          pusher.trigger("messages", "inserted", msgDetails);
        }
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running at : http://localhost:${PORT}`);
    });

    createDatabaseAndData();
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};

initializeDBAndServer();

// MIDDLE WARES
const authenticateAccessToken = (request, response, next) => {
  let jwtToken;
  const authHeaders = request.headers["authorization"];
  if (authHeaders !== undefined) {
    jwtToken = authHeaders.split(" ")[1];
  }

  if (jwtToken === undefined) {
    return response.status(401).send({ message: "No access" });
  }

  jwt.verify(jwtToken, "WHATSAPP", (err, user) => {
    if (err) {
      return response.status(401).send({ message: "No access" });
    } else {
      request.userDetails = user;
      next();
    }
  });
};

// APIs Section

// Rooms API
app.get("/", authenticateAccessToken, async (req, res) => {
  const rooms = await RoomModal.find();
  res.send(rooms);
});

// Messages API
app.get(
  "/rooms/:roomId/messages",
  authenticateAccessToken,
  async (req, res) => {
    const { roomId } = req.params;

    const room = await RoomModal.findOne({ _id: roomId });
    const messages = await MessageModal.find({ room_id: roomId });

    res.send({
      room,
      messages,
    });
  }
);

// Create Message API
app.post(
  "/rooms/:roomId/messages/new",
  authenticateAccessToken,
  async (req, resp) => {
    const { message } = req.body;
    const { roomId } = req.params;

    const userId = req.userDetails.user_id;
    const name = req.userDetails.name;

    const newMsg = await MessageModal.create({
      message: message,
      user_id: userId,
      user_name: name,
      room_id: roomId,
    });

    resp.send({ message: "Message Added" });
  }
);

// User Register API

app.post("/users/new", async (req, res) => {
  const { username, password, name } = req.body;

  // username already exists
  const dbUser = await UserModal.find({ username: username });
  if (dbUser.length > 0) {
    return res.status(400).send({ message: "Username already exists" });
  }

  const user = await UserModal.create({
    username,
    password,
    name,
  });

  res.send({ message: "User Added" });
});

// Login API
app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  const dbUser = await UserModal.findOne({ username: username });

  if (dbUser == undefined) {
    return response.status(400).send({ message: "Invalid credentials" });
  }

  // const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

  const isPasswordMatched = password === dbUser.password;

  if (isPasswordMatched) {
    const payLoad = {
      user_id: dbUser._id,
      name: dbUser.name,
      username: dbUser.username,
      password: dbUser.password,
    };
    const jwtToken = jwt.sign(payLoad, "WHATSAPP");

    return response.send({ jwtToken, userId: dbUser._id });
  } else {
    return response.status(400).send({ message: "Invalid credentials" });
  }
});

// Get Status API
app.get("/status", authenticateAccessToken, async (request, response) => {
  const status = await StatusModal.find();
  response.send(status);
});

// Video call permissions

app.post("/video-call/asking-permission", (request, response) => {
  const { userId, name, myId, myName } = request.body;
  const userData = {
    userId,
    name,
    myId,
    myName,
  };

  pusher.trigger("video-call", "asking-permission", userData);
  response.send({ message: "Asking permission" });
});

app.post("/video-call/response", async (request, response) => {
  const { userId, name, myId, myName, isAccepted } = request.body;
  const responseData = {
    userId,
    myId,
    isAccepted,
  };

  const callData = {
    call_by: name,
    call_to: myName,
    timestamp: new Date(),
    is_success: isAccepted,
  };
  await CallModal.create(callData);
  // creating video call data here
  //   console.log(request.body);

  pusher.trigger("video-call", "response", responseData);
  response.send({ message: "Response for video call" });
});

app.get("/users", async (request, response) => {
  // getting users and sending the users

  const users = await UserModal.find();
  const convertedUsers = users.map((each) => ({
    userId: each._id,
    name: each.name,
  }));

  response.send(convertedUsers);
});

// call sections
app.get("/calls", async (request, response) => {
  const calls = await CallModal.find();
  const convertedData = calls.map((each) => ({
    callId: each._id,
    callBy: each.call_by,
    callTo: each.call_to,
    timestamp: each.timestamp,
    isSuccess: each.is_success,
  }));
  response.send(convertedData);
});
