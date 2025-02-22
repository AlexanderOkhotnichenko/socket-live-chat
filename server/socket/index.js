// const express = require('express');
// const { Server } = require('socket.io');
// const http = require('http');
// const getUserDataFromToken = require('../helpers/getUserDataFromToken');
// const UserModel = require('../models/User');
// const { ConversationModel, MessageModel } = require('../models/Conversation');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true
//   }
// });

// // status user online
// const onlineUser = new Set();

// // connection
// io.on('connection', async (socket) => {
//   console.log("connect User", socket.id);
//   const token = socket.handshake.auth.token;
//   const user = await getUserDataFromToken(token); // current user data

//   // create a room user
//   socket.join(user?._id?.toString());
//   onlineUser.add(user?._id?.toString());

//   io.emit('onlineUser', Array.from(onlineUser))

//   socket.on("message-page", async (userId) => {
//     console.log("userId:", userId);
//     const userData = await UserModel.findById(userId).select('-password');
//     const payload = {
//       _id: userData?._id,
//       firstName: userData?.firstName,
//       email: userData?.email,
//       profile_pic: userData?.profile_pic,
//       online : onlineUser.has(userId)
//     };

//     socket.emit("message-user", payload);
//   });

//   // new message
//   socket.on('new message', async (data) => {
//     let conversation = await ConversationModel.findOne({
//       "$or": [
//         { sender: data?.sender, receiver: data?.receiver },
//         { sender: data?.receiver, receiver: data?.sender }
//       ]
//     });

//     // if conversation is not available
//     if (!conversation) {
//       const createConversation = await ConversationModel({
//         sender: data?.sender,
//         receiver: data?.receiver
//       });
//       conversation = await createConversation.save();
//     }

//     const message = new MessageModel({
//       text: data.text,
//       imageUrl: data.imageUrl,
//       videoUrl: data.videoUrl,
//       msgByUserId: data?.msgByUserId
//     });
//     const saveMessage = await message.save();
//     const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
//       "$push": { messages: saveMessage?._id }
//     });
//     const getConversationMessage = await ConversationModel.findOne({
//       "$or": [
//         { sender: data?.sender, receiver: data?.receiver },
//         { sender: data?.receiver, receiver: data?.sender }
//       ]
//     }).populate('messages').sort({ updatedAt: -1 });

//     io.to(data?.sender).emit('message', getConversationMessage.messages);
//     io.to(data?.receiver).emit('message', getConversationMessage.messages);
//   });

//   // disconnect
//   socket.on('disconnect', () => {
//     onlineUser.delete(user?._id)
//     console.log('disconnect user', socket.id);
//   });
// });

// module.exports = {
//   app, server
// }

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const getUserDataFromToken = require('../helpers/getUserDataFromToken');
const getConversation = require('../helpers/getConversation');
const UserModel = require('../models/User');
const { ConversationModel, MessageModel } = require('../models/Conversation');

// socket connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// socket running at http://localhost:8080

// online status user
const onlineUser = new Set();

io.on('connection', async (socket) => {
  console.log('connect user:', socket.id);
  const token = socket.handshake.auth.token;
  
  // current user data
  const user = await getUserDataFromToken(token);

  // create a room
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit('onlineUser', Array.from(onlineUser));

  socket.on('message-page', async (userId) => {
    console.log('userId:', userId);
    const userData = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userData?._id,
      firstName: userData?.firstName,
      email: userData?.email,
      profile_pic: userData?.profile_pic,
      online: onlineUser.has(userId)
    };

    socket.emit('message-user', payload);

    // get messages user
    const getConversationMessage = await ConversationModel.findOne({
      "$or" : [
          { sender : user?._id, receiver : userId },
          { sender : userId, receiver : user?._id}
      ]
    }).populate('messages').sort({ updatedAt : -1 })

    socket.emit('message',getConversationMessage?.messages || [])
  });

  // new message
  socket.on('new message', async (data) => {
    // check conversation is available both user
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    });

    // if conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver
      });

      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId
    });

    const saveMessage = await message.save();

    const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
      "$push": { messages: saveMessage?._id }
    });
    
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    }).populate("messages").sort({ updatedAt: -1 });
    
    io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', conversationSender);
    io.to(data?.receiver).emit('conversation', conversationReceiver);
  });

  // list users
  socket.on('user-list', async (currentUserId) => {
    const conversation = await getConversation(currentUserId)

    socket.emit('conversation', conversation)
  });

  // seen messages id user
  socket.on('seen',async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      "$or" : [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id}
      ]
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await MessageModel.updateMany(
      { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
      { "$set": { seen: true }}
    );

    // send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  });

  // disconnect
  socket.on('disconnect', () => {
    onlineUser.delete(user?._id?.toString());
    console.log('disconnect user:', socket.id);
  });
});

module.exports = { app, server }