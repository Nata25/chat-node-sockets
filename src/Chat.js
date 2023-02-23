import React from 'react';

import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

import useSockets from './hooks/use-sockets.js';
import useGeolocation from './hooks/use-geolocation.js';

const Chat = () => {
  const { sendMessage, sendLocation } = useSockets();
  const { isLoading, error, fetchGeolocation } = useGeolocation();

  const postMessage = event => {
    event.preventDefault();
    const input = event.target.elements.message;
    const { value } = input;
    if (value) {
      sendMessage(value);
      input.value = '';
      input.focus();
    }
  }

  const shareLocation = () => {
    fetchGeolocation(sendLocation);
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
