import React from 'react';

import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

import useSockets from './hooks/use-sockets.js';
import useGeolocation from './hooks/use-geolocation.js';

const Chat = () => {
  const [ messages, setMessages ] = React.useState([]);
  const { sendMessage, sendLocation, message: newMessage, location } = useSockets();
  const { isLoading, error, fetchGeolocation } = useGeolocation();

  React.useEffect(() => {
    setMessages([...messages, { type: 'text', value: newMessage }]);
  }, [newMessage]);

  React.useEffect(() => {
    setMessages([...messages, { type: 'link', value: location }]);
  }, [location]);

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
      <div className="messages-list">
        {messages.map((msg, ind) => {
          if (msg.type === 'text') return <p key={`${msg.value}-${ind}`}>{ msg.value }</p>
          else return (<p key={`${msg.value}-${ind}`}>
            <a
              key={`${msg.value}-${ind}`}
              href={msg.value}
              target="_blank"
            >{ msg.value }</a>
          </p>);
        })}
      </div>
      <form onSubmit={postMessage} action="#">
        <input name="message" autoComplete="off"/>
        <button>Submit message</button>
      </form>
      <div className="location">
        <img src={pinIcon} className="location-icon" alt="Location Icon" />
        <button disabled={isLoading ?? null} onClick={shareLocation}>Send location</button>
        {error && <p>Error on fetching location!</p>}
      </div>
    </div>
  )
}

export default Chat;
