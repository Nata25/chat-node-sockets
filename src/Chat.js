import React from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { geolocationPromisified } from './utils.js';

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

  const shareLocation = async () => {
    try {
      const position = await geolocationPromisified();
      const { coords } = position;
      const locationObj = {
        lat: coords.latitude,
        lng: coords.longitude,
      };
      const successCallback = () => console.log('Location was successfully shared.');
      socket.emit('sendLocation', locationObj, successCallback);
    } catch (e) {
      console.warn(`Error ocurred: ${e}`);
    }
  }

  return (
    <div>
      <form onSubmit={postMessage} action="#">
        <input name="message"/>
        <button>Submit message</button>
      </form>
      <button onClick={shareLocation}>Send location</button>
    </div>
  )
}

export default Chat;
