const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const users = [];
const usersOnline = { online: 0 };

wss.on('connection', function connection(ws) {
  users.push(ws);
  usersOnline.online += 1;

  users.forEach(user => user.send(JSON.stringify(usersOnline)));

  ws.on('message', function incoming(message) {
    const recievers = users.filter(user => user !== ws);

    recievers.forEach(reciever => reciever.send(message));
  });

  ws.on('close', () => {
    users.splice(users.indexOf(ws));
    usersOnline.online -= 1;
    users.forEach(user => user.send(JSON.stringify(usersOnline)));
  });
});

console.log('Server is running on port 8080');
