import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { IMessageDTO } from '../models/message.interface';
import { IUser } from '../models/user.interface';

const socket = io('ws://localhost:3000');

const useSockets = () => {
  const [ params ] = useSearchParams();
  const navigate = useNavigate();
  const [ message, setMessage ] = useState<IMessageDTO>();
  const [ location, setLocation ] = useState<IMessageDTO>();
  const [ currentUser, setCurrentUser ] = useState<IUser>();

  useEffect(() => {
    const userName = params.get('username');
    const room = params.get('room');
    // Join room based on query params and set current user
    if (userName && room) {
      socket.emit('join', { userName, room }, (data: { user: IUser, error?: Error }) => {
        if (data.error) {
          alert('This user cannot join the room!');
          navigate('/');
          return;
        }
        setCurrentUser({ userName, room, id: data.user.id });
      });
    } else {
      navigate('/');
      return;
    }

    socket.on('message', (message: IMessageDTO) => {
      console.log(message);
      setMessage(message);
    });

    socket.on('locationMessage', (message: IMessageDTO) => {
      console.log(message);
      setLocation(message);
    });

    return () => {
      socket.emit('leaveRoom', { userName, room });
    }
  }, [socket, params]);

  const sendMessage = (value: string) => {
    socket.emit(
      'sendMessage',
      value,
      /* NOTE: the 3rd argument is a callback function which is envoked in either of two cases:
      - if message was successfully send
      - if there's error on validating message (then error message is passed as an argument)
      */
      (error: Error) => {
        if (error) {
          console.warn(error);
          return;
        }
        console.log('Message delivered');
      }
    );
  }

  const sendLocation = (value: string) => {
    socket.emit('sendLocation', value, () => {
      console.log('Location was successfully shared.')
    });
  }

  return { sendMessage, sendLocation, message, location, currentUser };
}

export default useSockets;
