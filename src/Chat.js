import React from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

import useGeolocation from './hooks/use-geolocation.js';

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

  const { isLoading, error, fetchGeolocation } = useGeolocation();

  const locationSharedSuccess = () => console.log('Location was successfully shared.');

  const shareLocation = () => {
    fetchGeolocation(locationObj => {
      socket.emit('sendLocation', locationObj, locationSharedSuccess);
    });
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
        <button disabled={isLoading ?? null} onClick={shareLocation}>Send location</button>
        {error && <p>Error on fetching location!</p>}
      </div>
    </div>
  )
}

export default Chat;
