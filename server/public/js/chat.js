import { geolocationPromisified } from './utils.js';

const socket = io();

// DOM elements
const chatForm = document.getElementById('chatForm');
const submitMessageBtn = document.getElementById('submitMessageBtn');
const message = document.getElementById('message');
const locationBtn = document.getElementById('locationShare');
const messages = document.getElementById('messages');
const chatMetadata = document.getElementById('chatMetadata');

// Templates
const messageTemplate = document.getElementById('messageTemplate').innerHTML;
const locationTemplate = document.getElementById('locationTemplate').innerHTML;
const chatMetadataTemplate = document.getElementById('chatMetadataTemplate').innerHTML;

// Chat params
const obj = new URLSearchParams(window.location.search);
const userName = obj.get('username');
const room = obj.get('room');
let users = [];

socket.emit('join', { userName, room }, (error) => {
  if (error) {
    alert('This user cannot join the room!');
    location.href = '/';
  }
});

socket.on('message', message => {
  const { text, createdAt, userName, userId } = message;
  const isCurrentUser = userId === socket.id;
  const user = isCurrentUser ? '[Me]' : userName;
  let html = Mustache.render(messageTemplate, { message: text, createdAt, user });
  if (isCurrentUser) {
    html = `<div class="current-user">${html}</div>`;
  }
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', locationData => {
  const { text, createdAt, userId } = locationData;
  const isCurrentUser = userId === socket.id;
  const user = isCurrentUser ? '[Me]' : userName;
  let html = Mustache.render(locationTemplate, { locationLink: text, createdAt, user });
  if (isCurrentUser) {
    html = `<div class="current-user">${html}</div>`;
  }
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', data => {
  users = data.users.filter(user => user.id !== socket.id);
  const html = Mustache.render(chatMetadataTemplate, { room, userName, users });
  chatMetadata.innerHTML = html;
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
