import { geolocationPromisified } from './utils.js';

const socket = io();

// DOM elements
const chatForm = document.getElementById('chatForm');
const submitMessageBtn = document.getElementById('submitMessageBtn');
const message = document.getElementById('message');
const locationBtn = document.getElementById('locationShare');
const messages = document.getElementById('messages');
const locationMessage = document.getElementById('locationMessage');

// Templates
const messageTemplate = document.getElementById('messageTemplate').innerHTML;
const locationTemplate = document.getElementById('locationTemplate').innerHTML;

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, { message });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', locationLink => {
  console.log(locationLink);
  const html = Mustache.render(locationTemplate, { locationLink });
  messages.insertAdjacentHTML('beforeend', html);
});

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
