import { ReactElement } from 'react';

import { IMessage, UserNamePlaceholders } from "./models/message.interface";
import { IUser } from './models/user.interface';

const getUserDisplayedName = (message: IMessage, isMe: boolean): string => {
  const displayedUser = message.isSystem ? UserNamePlaceholders.SYSTEM
    : isMe ? UserNamePlaceholders.CURRENT_USER
    : message.userName;
  return displayedUser;
}

const MessageWrapper = (props: { isMe: boolean, originalContent: ReactElement }) => {
  const { isMe, originalContent } = props;
  return isMe ? <div className="current-user">{originalContent}</div> : originalContent;
}

const TextMessage = (props: { message: IMessage, currentUser: IUser }) => {
  const { value, createdAt, userId, isSystem } = props.message;
  const isMe = userId === props.currentUser.id && !isSystem;
  const displayedUser = getUserDisplayedName(props.message, isMe);
  const content = (
    <p className="message">
      <span className="user-name">{ displayedUser }</span>
      <span className="date-time"> - { createdAt }</span>
      <span className="message-text">
        { value }
      </span>
    </p>);
  return <MessageWrapper isMe={isMe} originalContent={content} />
}

const LinkMessage = (props: { message: IMessage, currentUser: IUser }) => {
  const { value, createdAt, userId } = props.message;
  const isMe = userId === props.currentUser.id;
  const displayedUser = getUserDisplayedName(props.message, isMe);
  const content = (
    <p className="message">
      <span className="user-name">{ displayedUser }</span>
      <span className="date-time"> - { createdAt }</span>
      <a
        href={value}
        target="_blank"
        className="message-text"
      >
        My current location
      </a>
    </p>)
  return <MessageWrapper isMe={isMe} originalContent={content} />
}

export {
  TextMessage,
  LinkMessage,
}
