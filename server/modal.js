const mongoose = require("mongoose");

const profile =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-YsNuOMErx0pu9-ri-mrLK1SFTGL8LxAceTs6fKUDlgzImIcVdh3U3xDxwTKZz2FhTA&usqp=CAU";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: profile,
  },
});

const RoomSchema = mongoose.Schema({
  room_name: {
    type: String,
    required: true,
  },
  room_profile: String,
});

const MessageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user_id: String,
  user_name: String,
  room_id: String,
});

const StatusSchema = mongoose.Schema({
  video_url: {
    type: String,
    required: true,
  },
  thumbnail_url: {
    type: String,
    required: true,
  },
  status_message: String,
  room_id: {
    type: String,
    required: true,
  },
  room_name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CallSchema = mongoose.Schema({
  call_by: {
    type: String,
    required: true,
  },
  call_to: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  is_success: {
    type: Boolean,
    required: true,
  },
});

module.exports.UserModal = mongoose.model("users", UserSchema);
module.exports.RoomModal = mongoose.model("rooms", RoomSchema);
module.exports.MessageModal = mongoose.model("messages", MessageSchema);
module.exports.StatusModal = mongoose.model("status", StatusSchema);
module.exports.CallModal = mongoose.model("calls", CallSchema);
