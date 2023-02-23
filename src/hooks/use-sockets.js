import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

const useSockets = () => {
  useEffect(() => {
    socket.on('message', message => {
      console.log(message);
    });
  }, [socket]);

  const sendMessage = value => {
    socket.emit(
      'sendMessage',
      value,
      /* NOTE: the 3rd argument is a callback function which is envoked in either of two cases:
      - if message was successfully send
      - if there's error on validating message (then error message is passed as an argument)
      */
      error => {
        if (error) {
          console.warn(error);
          return;
        }
        console.log('Message delivered');
      }
    );
  }

  const sendLocation = value => {
    socket.emit('sendLocation', value, () => {
      console.log('Location was successfully shared.')
    });
  }

  return { sendMessage, sendLocation };
}

export default useSockets;
