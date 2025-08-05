const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// @desc    Create or fetch one-on-one chat
// @route   POST /api/chat
// @access  Protected
const accessChat = async (req, res) => {
    const { userId } = req.body; // The user ID to chat with

    if (!userId) {
        return res.status(400).send({ message: "UserId param not sent with request" });
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // Logged in user
            { users: { $elemMatch: { $eq: userId } } },      // The other user
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    // Further populating sender info
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name profilePic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        // Create a new chat
        var chatData = {
            chatName: "sender", // Not really used for 1-on-1
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

// You would create other functions like fetchChats, createGroupChat, etc. here
module.exports = { accessChat, /* ...other exports */ };