const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);

    socket.on('login', (payload) => {
        users.push({
          id: socket.id,
          name: payload.name,
        });
        socket.broadcast.emit('message', {
          author: 'Chat Bot',
          content: `${payload.name} has joined the conversation!`,
        });
      });
    
    
    socket.on('message', (message) => { console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', (payload) => { console.log('Oh, socket ' + socket.id + ' has left') 
        const leavingUser = users.find(user => user.id === socket.id);
        users = users.filter(user => user.id !== socket.id);
        
        socket.broadcast.emit('removeUser', {
        author: 'Chat Bot',
        content: `${leavingUser.name} has left the conversation!`,
      });
        });
        console.log('I\'ve added a listener on message event \n');
    });
    

   

    


