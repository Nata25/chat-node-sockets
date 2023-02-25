import { geolocationPromisified } from './utils.js';

const socket = io();

// DOM elements
const chatForm = document.getElementById('chatForm');
const submitMessageBtn = document.getElementById('submitMessageBtn');
const message = document.getElementById('message');
const locationBtn = document.getElementById('locationShare');
const messages = document.getElementById('messages');
const roomTitle = document.getElementById('roomTitle');

// Templates
const messageTemplate = document.getElementById('messageTemplate').innerHTML;
const locationTemplate = document.getElementById('locationTemplate').innerHTML;
const roomNameTemplate = document.getElementById('roomNameTemplate').innerHTML;

// Chat params
const obj = new URLSearchParams(window.location.search);
const userName = obj.get('username');
const room = obj.get('room');

const html = Mustache.render(roomNameTemplate, { room });
roomTitle.insertAdjacentHTML('beforeend', html);

socket.emit('join', { userName, room });

socket.on('message', message => {
  const { text, createdAt } = message;
  const html = Mustache.render(messageTemplate, { message: text, createdAt });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', locationData => {
  const { text, createdAt } = locationData;
  const html = Mustache.render(locationTemplate, { locationLink: text, createdAt });
  messages.insertAdjacentHTML('beforeend', html);
});

chatForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const { value } = event.target.elements.message;
  if (value) {
    submitMessageBtn.setAttribute('disabled', 'disabled');
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
