// React
import React, { FormEvent }  from 'react';
import { Link } from 'react-router-dom';

// icons
import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

// hooks
import useSockets from './hooks/use-sockets';
import useGeolocation from './hooks/use-geolocation';

// models
import { MessageType, IMessage } from './models/message.interface';

// components
import Sidebar from './Sidebar';
import { TextMessage, LinkMessage } from './Messages';

interface IFormElements extends HTMLFormControlsCollection {
  message?: HTMLInputElement,
}

const Chat = () => {
  const [ messages, setMessages ] = React.useState<IMessage[]>([]);
  const {
    sendMessage,
    sendLocation,
    message: newMessage,
    location,
    currentUser,
    users,
  } = useSockets();
  const { isLoading, error, fetchGeolocation } = useGeolocation();

  React.useEffect(() => {
    if (newMessage) {
      setMessages([...messages, {
        ...newMessage,
        type: MessageType.TEXT
      }]);
    }
  }, [newMessage]);

  React.useEffect(() => {
    if (location) {
      setMessages([...messages, {
        type: MessageType.LINK,
        ...location,
      }]);
    }
  }, [location]);

  const postMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElements: IFormElements = (event.target as HTMLFormElement).elements;
    const input = formElements.message;
    if (input.value) {
      sendMessage(input.value);
      input.value = '';
      input.focus();
    }
  }

  const shareLocation = () => {
    fetchGeolocation(sendLocation);
  }

  return (
    <div className="chat-section">
      {currentUser && <div className="sidebar">
        <Sidebar userName={currentUser.userName} room={currentUser.room} users={users} />
      </div>}
      <div className="chat-section-content">
        <h1 className="title">
          <Link to="/">
            Chat App
          </Link>
          <img src={chatIcon} className="chat-icon" alt="Chat Icon" />
        </h1>
        <div className="messages-wrapper">
          {currentUser && <div className="messages">
            {messages.map((msg, ind) => {
              const key = `${msg.value}-${ind}`;
              if (msg.type === MessageType.TEXT) return (
                <TextMessage key={key} message={msg} currentUser={currentUser} />
              )
              else if (msg.type === MessageType.LINK) return (
                <LinkMessage key={key} message={msg} currentUser={currentUser} />
              )
            })}
          </div>}
        </div>
        <div className="controls">
          <form onSubmit={postMessage} action="#">
            <input name="message" autoComplete="off"/>
            <button>Message</button>
          </form>
          <div className="location">
            <button className="location-button" disabled={isLoading ?? null} onClick={shareLocation}>
              <img src={pinIcon} className="location-icon" alt="Location Icon" />
              Send location
            </button>
            {error && <p>Error on fetching location!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat;
