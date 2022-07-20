const mongoose = require("mongoose");
const {
  UserModal,
  RoomModal,
  MessageModal,
  StatusModal,
} = require("./modal.js");

const profile =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-YsNuOMErx0pu9-ri-mrLK1SFTGL8LxAceTs6fKUDlgzImIcVdh3U3xDxwTKZz2FhTA&usqp=CAU";

const createAndInsertUserModal = async () => {
  const data = [
    {
      name: "naresh",
      username: "naresh",
      password: "naresh",
      profile: profile,
    },
    {
      name: "sulthan",
      username: "sulthan",
      password: "sulthan",
      profile: profile,
    },
    {
      name: "shaji",
      username: "shaji",
      password: "shaji",
      profile: profile,
    },
  ];
  await UserModal.insertMany(data);

  console.log("User Data Created");
};

const createAndInsertRoomModal = async () => {
  const data = [
    {
      room_name: "Youth Pp7",
      room_profile: profile,
    },
    {
      room_name: "Cricket team",
      room_profile: profile,
    },
    {
      room_name: "Volley ball ",
      room_profile: profile,
    },
    {
      room_name: "Chaddi gang",
      room_profile: profile,
    },
  ];

  await RoomModal.insertMany(data);
  console.log("Room Data createed");
};

const createAndInsertMessageModal = async () => {
  const data = [
    {
      message: "Hello pp7 youth",
      user_name: "naresh",
      user_id: "62ab3d55316e52802ea3388f",
      room_id: "62ab3eb94fb626445aab70e0",
    },
    {
      message: "text 2",
      user_name: "naresh",
      user_id: "62ab3d55316e52802ea3388f",
      room_id: "62ab3eb94fb626445aab70e0",
    },
    {
      message: "text 3",
      user_name: "naresh",
      user_id: "62ab3d55316e52802ea3388f",
      room_id: "62ab3eb94fb626445aab70e1",
    },
  ];

  const messages = await MessageModal.insertMany(data);
  console.log("messages data created", messages);
};

const createAndInsertStatusModal = async () => {
  const data = [
    {
      video_url: "https://www.youtube.com/shorts/tTDI2Am2f9g",
      thumbnail_url:
        "https://etvbharatimages.akamaized.net/etvbharat/prod-images/492-492-14089435-thumbnail-3x2-rgv.jpg",
      status_message: "Rgv mawaa....",
      room_id: "62ab3eb94fb626445aab70e0",
      room_name: "Youth Pp7",
    },
    {
      video_url: "https://www.youtube.com/watch?v=FpV9efyW92w",
      thumbnail_url:
        "https://i.pinimg.com/736x/fd/e6/bc/fde6bcf1c5df5e0b431ac06bb36ee6cd.jpg",
      status_message: "My god Rgv mawaa....",
      room_id: "62ab3eb94fb626445aab70e2",
      room_name: "Volley ball",
    },
  ];

  await StatusModal.insertMany(data);
  console.log("status created");
};

const createDatabaseAndData = () => {
  //   createAndInsertUserModal();
  //   createAndInsertRoomModal();
  //   createAndInsertMessageModal();
  //   createAndInsertStatusModal();
};

module.exports = createDatabaseAndData;
