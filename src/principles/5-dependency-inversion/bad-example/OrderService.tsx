// ❌ BAD: High-level module depends on low-level concrete implementations

// Low-level module (concrete implementation)
class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
    // Actual email sending logic
  }
}

// Another low-level module (concrete implementation)
class MySQLDatabase {
  save(table: string, data: any): void {
    console.log(`Saving to MySQL table ${table}:`, data);
    // MySQL specific logic
  }

  find(table: string, id: string): any {
    console.log(`Finding in MySQL table ${table} with id ${id}`);
    // MySQL specific logic
    return { id, status: 'pending' };
  }
}

// High-level module depending on concrete implementations ❌
export class OrderService {
  private emailService: EmailService;
  private database: MySQLDatabase;

  constructor() {
    // ❌ Direct instantiation - tightly coupled to specific implementations
    this.emailService = new EmailService();
    this.database = new MySQLDatabase();
  }

  createOrder(orderData: any): void {
    // Business logic
    this.database.save('orders', orderData);
    
    // Tightly coupled to EmailService
    this.emailService.sendEmail(
      orderData.customerEmail,
      'Order Confirmation',
      `Your order ${orderData.id} has been created`
    );
  }

  getOrder(orderId: string): any {
    return this.database.find('orders', orderId);
  }
}

// React component - also violating DIP
import React, { useState } from 'react';

export const OrderManager: React.FC = () => {
  // ❌ Component directly creates service - can't inject mocks for testing
  const orderService = new OrderService();
  const [orderStatus, setOrderStatus] = useState<string>('');

  const handleCreateOrder = () => {
    const order = {
      id: '12345',
      customerEmail: 'customer@example.com',
      items: ['item1', 'item2'],
      total: 99.99
    };
    
    orderService.createOrder(order);
    setOrderStatus('Order created successfully!');
  };

  return (
    <div className="p-4">
      <button 
        onClick={handleCreateOrder}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Order (Tightly Coupled)
      </button>
      {orderStatus && <p className="mt-2 text-green-600">{orderStatus}</p>}
    </div>
  );
};
