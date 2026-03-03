import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const useSocket = () => {
  const { auth } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: auth.token
      }
    });

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [auth?.token]);

  const joinShipment = (shipmentId) => {
    if (socket) {
      socket.emit('join-shipment', shipmentId);
    }
  };

  const leaveShipment = (shipmentId) => {
    if (socket) {
      socket.emit('leave-shipment', shipmentId);
    }
  };

  const joinUserRoom = (userId) => {
    if (socket) {
      socket.emit('join-user-room', userId);
    }
  };

  return { socket, connected, joinShipment, leaveShipment, joinUserRoom };
};

export default useSocket;
