import { geolocationPromisified } from './utils.js';

const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.querySelector('#chatForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const { value } = event.target.elements.message;
  if (value) {
    socket.emit('sendMessage', value, error => {
      if (error) {
        console.warn(error);
        return;
      }
      console.log('Message delivered');
    });
  }
  return false;
});

document.querySelector('#locationShare').addEventListener('click', function() {
  geolocationPromisified()
    .then(position => {
      const { coords } = position;
      socket.emit('sendLocation', {
        lat: coords.latitude,
        lng: coords.longitude,
      }, () => {
        console.log('Location was successfully shared.')
      });
    })
    .catch(e => {
      console.warn(`Error ocurred: ${e}`);
    });
});
