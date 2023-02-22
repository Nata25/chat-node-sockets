import React from 'react';
import { io } from 'socket.io-client';
import { geolocationPromisified } from './utils.js';
import { useEffect } from 'react';

const socket = io('ws://localhost:3000');

socket.on('message', message => {
  console.log(message);
});

const Chat = () => {
  useEffect(() => {
    setTimeout(() => {
      socket.emit('sendMessage', 'Hello again', error => {
        // Just for testing!
        if (error) {
          console.warn(error);
          return;
        }
        console.log('Message delivered');
      });
    }, 1000);
  }, []);
  return <div>This is chat!</div>
}

export default Chat;

// FORE FUTURE REFERENCE
// document.querySelector('#chatForm').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const { value } = event.target.elements.message;
//   if (value) {
//     socket.emit('sendMessage', value, error => {
//       if (error) {
//         console.warn(error);
//         return;
//       }
//       console.log('Message delivered');
//     });
//   }
//   return false;
// });

// document.querySelector('#locationShare').addEventListener('click', function() {
//   geolocationPromisified()
//     .then(position => {
//       const { coords } = position;
//       socket.emit('sendLocation', {
//         lat: coords.latitude,
//         lng: coords.longitude,
//       }, () => {
//         console.log('Location was successfully shared.')
//       });
//     })
//     .catch(e => {
//       console.warn(`Error ocurred: ${e}`);
//     });
// });
