// socket/socket.js

let rooms = {};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
      if (!rooms[room]) {
        rooms[room] = { players: [], quizStarted: false };
      }

      rooms[room].players.push({ id: socket.id, username });
      socket.join(room);

      io.to(room).emit('roomPlayers', rooms[room].players);

      console.log(`${username} joined room ${room}`);
    });

    socket.on('startQuiz', (room) => {
      if (rooms[room] && !rooms[room].quizStarted) {
        rooms[room].quizStarted = true;

        io.to(room).emit('quizStarted');
      }
    });

    socket.on('submitAnswer', ({ room, answer }) => {
      // Process submitted answer logic for the room here
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);

      // Find and remove player from rooms
      for (const room in rooms) {
        rooms[room].players = rooms[room].players.filter((player) => player.id !== socket.id);
        io.to(room).emit('roomPlayers', rooms[room].players);

        if (rooms[room].players.length === 0) {
          delete rooms[room];
        }
      }
    });
  });
};

module.exports = { setupSocket };
