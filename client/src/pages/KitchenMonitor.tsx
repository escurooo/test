import { useEffect, useState } from 'react';
import { useOrders } from '../hooks/useSocket';
import { api } from '../api';
import { Order } from '../types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  preparing: 'bg-blue-100 text-blue-800 border-blue-300',
  ready: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
};

export function KitchenMonitor() {
  const { orders: liveOrders, isConnected } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch initial orders
    api.getActiveOrders().then(setOrders).catch(console.error);
  }, []);

  useEffect(() => {
    // Update with live orders
    if (liveOrders.length > 0) {
      setOrders(liveOrders);
    }
  }, [liveOrders]);

  const updateStatus = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getTimeElapsed = (timestamp: number) => {
    const elapsed = Math.floor(Date.now() / 1000 - timestamp);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}m ${seconds}s`;
  };

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(
    (order) => order.status !== 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Kitchen Monitor</h1>
            <p className="text-gray-400">
              Real-time order tracking and management
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-2xl font-mono mt-2">
              {new Date(currentTime).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-semibold text-gray-400">
              No active orders
            </h2>
            <p className="text-gray-500 mt-2">
              New orders will appear here automatically
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Order #{order.id.slice(0, 8)}
                    </div>
                    {order.customer_name && (
                      <div className="text-lg font-semibold">
                        {order.customer_name}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="text-sm font-mono">
                      {getTimeElapsed(order.created_at)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-400 mb-2">
                    Items:
                  </div>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{item.name}</span>
                          <span className="bg-gray-600 px-2 py-1 rounded text-xs">
                            x{item.quantity}
                          </span>
                        </div>
                        {item.special_instructions && (
                          <div className="text-xs text-yellow-400 mt-1">
                            📝 {item.special_instructions}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {order.notes && (
                  <div className="mb-4 bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Notes:</div>
                    <div className="text-sm">{order.notes}</div>
                  </div>
                )}

                <div className="space-y-2">
                  <div
                    className={`px-3 py-2 rounded-lg text-center font-semibold text-sm border-2 ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(order.id, 'preparing')}
                        className="col-span-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateStatus(order.id, 'ready')}
                        className="col-span-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="col-span-3 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-700">
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            ← Back to Order Placement
          </a>
        </div>
      </div>
    </div>
  );
}
