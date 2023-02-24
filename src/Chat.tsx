import React, { FormEvent }  from 'react';

import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

import useSockets from './hooks/use-sockets.js';
import useGeolocation from './hooks/use-geolocation.js';

import { IFormElements } from './models/form-elements';
import { MessageType, IMessage } from './models/message.interface';

const Chat = () => {
  const [ messages, setMessages ] = React.useState<IMessage[]>([]);
  const { sendMessage, sendLocation, message: newMessage, location } = useSockets();
  const { isLoading, error, fetchGeolocation } = useGeolocation();

  React.useEffect(() => {
    setMessages([...messages, { type: MessageType.TEXT, value: newMessage }]);
  }, [newMessage]);

  React.useEffect(() => {
    setMessages([...messages, { type: MessageType.LINK, value: location }]);
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
      <h1 className="title">
        Chat App
        <img src={chatIcon} className="chat-icon" alt="Chat Icon" />
      </h1>
      <div className="messages-list">
        {messages.map((msg, ind) => {
          if (msg.type === MessageType.TEXT) return <p key={`${msg.value}-${ind}`}>{ msg.value }</p>
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
