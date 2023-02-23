import { geolocationPromisified } from './utils.js';

const socket = io();

socket.on('message', message => {
  console.log(message);
});

const chatForm = document.querySelector('#chatForm');
const submitMessageBtn = document.querySelector('#submitMessageBtn');
const message = document.querySelector('#message');
const locationBtn = document.querySelector('#locationShare');

chatForm.addEventListener('submit', function(event) {
  event.preventDefault();
  submitMessageBtn.setAttribute('disabled', 'disabled');

  const { value } = event.target.elements.message;
  if (value) {
    socket.emit('sendMessage', value, error => {
      submitMessageBtn.removeAttribute('disabled');
      message.value = '';
      message.focus();

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
  locationBtn.setAttribute('disabled', 'disabled');
  console.log('Fetching location...');
  geolocationPromisified()
    .then(position => {
      const { coords } = position;
      socket.emit('sendLocation', {
        lat: coords.latitude,
        lng: coords.longitude,
      }, () => {
        console.log('Location was successfully shared.');
        locationBtn.removeAttribute('disabled');
      });
    })
    .catch(e => {
      console.warn(`Error ocurred: ${e}`);
    });
});
