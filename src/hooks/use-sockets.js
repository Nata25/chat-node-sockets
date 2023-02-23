import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

const useSockets = () => {
  const [ message, setMessage ] = useState('');
  const [ location, setLocation ] = useState('');

  useEffect(() => {
    socket.on('message', message => {
      console.log(message);
      setMessage(message);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('locationMessage', message => {
      console.log(message);
      setLocation(message);
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

  return { sendMessage, sendLocation, message, location };
}

export default useSockets;
