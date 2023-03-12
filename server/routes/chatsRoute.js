const router = require('express').Router();
const Chat = require('../models/chatModel');
const authMiddleware = require('../middlewares/authMiddleware');

//create a new chart
router.post('/create-new-chat', authMiddleware, async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();
    res.send({
      success: true,
      message: 'Chat created successfully',
      data: savedChat,
    })
  } catch (error) {
    res.send({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
});

// get all chats of current user
router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({
      members: { $in: [req.body.userId] }
    }).populate("members").populate("lastMessage")
    .sort({updatedAt: -1});
    res.send({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
  }
})

module.exports = router;