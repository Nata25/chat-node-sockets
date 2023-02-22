import React from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { geolocationPromisified } from './utils.js';
import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

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
    <div className="chat-section">
      <h1 className="title">
        Chat App
        <img src={chatIcon} className="chat-icon" alt="Chat Icon" />
      </h1>
      <form onSubmit={postMessage} action="#">
        <input name="message"/>
        <button>Submit message</button>
      </form>
      <div className="location">
        <img src={pinIcon} className="location-icon" alt="location icon" />
        <button onClick={shareLocation}>Send location</button>
      </div>
    </div>
  )
}

export default Chat;
