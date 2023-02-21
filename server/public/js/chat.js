const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#chatForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const { value } = event.target.elements.message;
  if (value) {
    socket.emit('sendMessage', value);
  }
  return false;
});


