import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SupplyOrderEvent, Order } from '../types/types.ts';

const SBL_URL = process.env.REACT_APP_SBL_URL || 'http://localhost:8092';
// The backend is expected to expose Kafka topic `supply.order` via SSE at this path
const SSE_ENDPOINT = `${SBL_URL}/api/events/supply.order`;

// ──────────────────────────────────────────────
// Context shape
// ──────────────────────────────────────────────
interface NotificationContextValue {
  notifications: SupplyOrderEvent[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotification: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SupplyOrderEvent[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Subscribe to Kafka queue `supply.order` exposed as SSE by the SBL backend
  useEffect(() => {
    const connect = () => {
      const es = new EventSource(SSE_ENDPOINT);
      eventSourceRef.current = es;

      es.onmessage = (event: MessageEvent) => {
        try {
          const order: Order = JSON.parse(event.data);
          const notification: SupplyOrderEvent = {
            id: `${Date.now()}-${Math.random()}`,
            payload: order,
            receivedAt: new Date().toISOString(),
            read: false,
          };
          setNotifications((prev) => [notification, ...prev]);
        } catch {
          console.warn('[NotificationContext] Failed to parse SSE event:', event.data);
        }
      };

      es.onerror = () => {
        console.warn('[NotificationContext] SSE connection lost, reconnecting in 5 s…');
        es.close();
        // Attempt reconnect after 5 s
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
