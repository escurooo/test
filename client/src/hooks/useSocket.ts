import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order } from '../types';

const SOCKET_URL = 'http://localhost:3001';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  return { socket, isConnected };
}

export function useOrders() {
  const { socket, isConnected } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('orders:initial', (initialOrders: Order[]) => {
      setOrders(initialOrders);
    });

    socket.on('order:created', (order: Order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on('order:updated', (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    socket.on('order:deleted', ({ id }: { id: string }) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    });

    return () => {
      socket.off('orders:initial');
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('order:deleted');
    };
  }, [socket]);

  return { orders, isConnected };
}
