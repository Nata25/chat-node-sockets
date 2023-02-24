import React, { FormEvent }  from 'react';

import chatIcon from './img/chat.svg';
import pinIcon from './img/location-pin.svg';

import useSockets from './hooks/use-sockets';
import useGeolocation from './hooks/use-geolocation';

import { IFormElements } from './models/form-elements';
import { MessageType, IMessage } from './models/message.interface';

const Chat = () => {
  const [ messages, setMessages ] = React.useState<IMessage[]>([]);
  const { sendMessage, sendLocation, message: newMessage, location } = useSockets();
  const { isLoading, error, fetchGeolocation } = useGeolocation();

  React.useEffect(() => {
    if (newMessage) {
      const { value, createdAt } = newMessage;
      setMessages([...messages, { type: MessageType.TEXT, value, createdAt }]);
    }
  }, [newMessage]);

  React.useEffect(() => {
    if (location) {
      const { value, createdAt } = location;
      setMessages([...messages, { type: MessageType.LINK, value, createdAt }]);
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

  const TextMessage = (props: { message: IMessage }) => {
    const { value, createdAt } = props.message;
    return (
      <p  className="message">{ value } <span className="date-time"> - { createdAt }</span></p>
    )
  }

  const LinkMessage = (props: { message: IMessage }) => {
    const { value, createdAt } = props.message;
    return (
      <p className="message">
        <a
          href={value}
          target="_blank"
        >
          My current location
        </a>
        <span className="date-time"> - { createdAt }</span>
      </p>)
  }

  return (
    <div className="chat-section">
      <h1 className="title">
        Chat App
        <img src={chatIcon} className="chat-icon" alt="Chat Icon" />
      </h1>
      <div className="messages">
        {messages.map((msg, ind) => {
          const key = `${msg.value}-${ind}`;
          if (msg.type === MessageType.TEXT) return <TextMessage key={key} message={msg} />
          else if (msg.type === MessageType.LINK) return <LinkMessage key={key} message={msg} />
        })}
      </div>
      <div className="controls">
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
    </div>
  )
}

export default Chat;
