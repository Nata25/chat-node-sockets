import React from 'react';
import { io } from 'socket.io-client';
import { geolocationPromisified } from './utils.js';
import { useEffect } from 'react';

const socket = io('ws://localhost:3000');

const Chat = () => {
  useEffect(() => {
    socket.on('message', message => {
      console.log(message);
    });
  }, [socket]);

  const postMessage = (event) => {
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
  }

  return (
    <div>
      <form onSubmit={postMessage} action="#">
        <input name="message"/>
        <button>Submit message</button>
      </form>
    {/* <button id="locationShare">Send location</button> */}
    </div>
  )
}

export default Chat;

// FORE FUTURE REFERENCE

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
