let onlineUsers = [];

const addNewUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
};

module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Add user to online list
        socket.on("addUser", (userId) => {
            addNewUser(userId, socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        });

        // Join a chat room
        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('User joined room: ' + room);
        });

        // Handle typing indicator
        socket.on('typing', (room) => socket.in(room).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

        // Handle new message
        socket.on("new message", (newMessage) => {
            const chat = newMessage.chat;
            if (!chat.users) return console.log("chat.users not defined");

            chat.users.forEach(user => {
                if (user._id == newMessage.sender._id) return;
                // Send to the specific room (chatId)
                socket.in(user._id).emit("message received", newMessage);
            });
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            removeUser(socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        });
    });
};