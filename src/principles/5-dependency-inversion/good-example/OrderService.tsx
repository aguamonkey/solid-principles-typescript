// ✅ GOOD: High-level and low-level modules depend on abstractions

// Abstractions (interfaces)
export interface NotificationService {
  notify(recipient: string, message: string): void;
}

export interface Database {
  save(collection: string, data: any): void;
  find(collection: string, id: string): any;
}

// Low-level module implementing abstraction
export class EmailNotificationService implements NotificationService {
  notify(recipient: string, message: string): void {
    console.log(`📧 Email to ${recipient}: ${message}`);
    // Email implementation
  }
}

// Alternative implementation
export class SMSNotificationService implements NotificationService {
  notify(recipient: string, message: string): void {
    console.log(`📱 SMS to ${recipient}: ${message}`);
    // SMS implementation
  }
}

// Low-level database implementations
export class MongoDatabase implements Database {
  save(collection: string, data: any): void {
    console.log(`Saving to MongoDB collection ${collection}:`, data);
    // MongoDB specific logic
  }

  find(collection: string, id: string): any {
    console.log(`Finding in MongoDB collection ${collection} with id ${id}`);
    return { id, status: 'pending' };
  }
}

export class PostgreSQLDatabase implements Database {
  save(collection: string, data: any): void {
    console.log(`Saving to PostgreSQL table ${collection}:`, data);
    // PostgreSQL specific logic
  }

  find(collection: string, id: string): any {
    console.log(`Finding in PostgreSQL table ${collection} with id ${id}`);
    return { id, status: 'pending' };
  }
}

// High-level module depending on abstractions ✅
export class OrderService {
  constructor(
    private notificationService: NotificationService,
    private database: Database
  ) {}

  createOrder(orderData: any): void {
    // Business logic
    this.database.save('orders', orderData);
    
    // Using abstraction - not tied to specific implementation
    this.notificationService.notify(
      orderData.customerEmail,
      `Your order ${orderData.id} has been created`
    );
  }

  getOrder(orderId: string): any {
    return this.database.find('orders', orderId);
  }
}

// Dependency injection container
export class ServiceContainer {
  private services = new Map<string, any>();

  register(name: string, service: any): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    return this.services.get(name);
  }
}

// React component with dependency injection
import React, { useState, useMemo } from 'react';

interface OrderManagerProps {
  notificationService?: NotificationService;
  database?: Database;
}

export const OrderManager: React.FC<OrderManagerProps> = ({
  notificationService = new EmailNotificationService(),
  database = new MongoDatabase()
}) => {
  // ✅ Dependencies are injected, making the component testable
  const orderService = useMemo(
    () => new OrderService(notificationService, database),
    [notificationService, database]
  );
  
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'email' | 'sms'>('email');

  const handleCreateOrder = () => {
    const order = {
      id: Date.now().toString(),
      customerEmail: 'customer@example.com',
      items: ['item1', 'item2'],
      total: 99.99
    };
    
    orderService.createOrder(order);
    setOrderStatus(`Order created with ${notificationType} notification!`);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="mr-2">Notification Type:</label>
        <select 
          value={notificationType} 
          onChange={(e) => setNotificationType(e.target.value as 'email' | 'sms')}
          className="px-2 py-1 border rounded"
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </div>
      <button 
        onClick={handleCreateOrder}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Order (Dependency Injected)
      </button>
      {orderStatus && <p className="mt-2 text-green-600">{orderStatus}</p>}
    </div>
  );
};

// Example usage showing how easy it is to swap implementations
export const App: React.FC = () => {
  const [useEmail, setUseEmail] = useState(true);
  
  const notificationService = useEmail 
    ? new EmailNotificationService()
    : new SMSNotificationService();

  return (
    <div>
      <button onClick={() => setUseEmail(!useEmail)}>
        Switch to {useEmail ? 'SMS' : 'Email'}
      </button>
      <OrderManager 
        notificationService={notificationService}
        database={new MongoDatabase()}
      />
    </div>
  );
};
