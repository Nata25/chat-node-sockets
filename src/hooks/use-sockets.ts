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
  const [ users, setUsers ] = useState<IUser[]>([]);

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
      // Don't allow in a chat without username and room
      navigate('/');
      return;
    }

    socket.on('message', (message: IMessageDTO) => {
      setMessage(message);
    });

    socket.on('locationMessage', (message: IMessageDTO) => {
      setLocation(message);
    });

    socket.on('roomData', data => {
      // Event is fired once user joined the room. Need this to populate Sidebar with data
      const otherUsers = data.users.filter((user: IUser) => user.id !== socket.id);
      setUsers(otherUsers);
    });


    return () => {
      // Need to emit custom event as on socket doesn't disconnect on routing (without page reload)
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

  return { sendMessage, sendLocation, message, location, currentUser, users };
}

export default useSockets;
