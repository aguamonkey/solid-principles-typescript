// ✅ GOOD: This follows OCP - new notification types can be added without modifying existing code

// Define the abstraction
export interface NotificationStrategy {
  send(recipient: string, message: string): void;
  getType(): string;
}

// Concrete implementations
export class EmailNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(`Sending email to ${recipient}: ${message}`);
    // Email sending logic
  }

  getType(): string {
    return 'email';
  }
}

export class SMSNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // SMS sending logic
  }

  getType(): string {
    return 'sms';
  }
}

export class PushNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(`Sending push notification to ${recipient}: ${message}`);
    // Push notification logic
  }

  getType(): string {
    return 'push';
  }
}

// New notification type - no existing code modified!
export class SlackNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(`Sending Slack message to ${recipient}: ${message}`);
    // Slack sending logic
  }

  getType(): string {
    return 'slack';
  }
}

// Service that's closed for modification but open for extension
export class NotificationService {
  private strategies: Map<string, NotificationStrategy> = new Map();

  registerStrategy(strategy: NotificationStrategy): void {
    this.strategies.set(strategy.getType(), strategy);
  }

  send(type: string, recipient: string, message: string): void {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No strategy registered for type: ${type}`);
    }
    strategy.send(recipient, message);
  }
}

// React component using the good service
import React, { useMemo } from 'react';

export const NotificationSender: React.FC = () => {
  const service = useMemo(() => {
    const svc = new NotificationService();
    svc.registerStrategy(new EmailNotification());
    svc.registerStrategy(new SMSNotification());
    svc.registerStrategy(new PushNotification());
    svc.registerStrategy(new SlackNotification()); // Easy to add new types!
    return svc;
  }, []);

  const notifications = [
    { type: 'email', label: 'Email', color: 'bg-blue-500' },
    { type: 'sms', label: 'SMS', color: 'bg-green-500' },
    { type: 'push', label: 'Push', color: 'bg-purple-500' },
    { type: 'slack', label: 'Slack', color: 'bg-yellow-500' },
  ];

  const handleSend = (type: string) => {
    service.send(type, 'user@example.com', 'Hello!');
  };

  return (
    <div className="p-4">
      {notifications.map(({ type, label, color }) => (
        <button
          key={type}
          onClick={() => handleSend(type)}
          className={`mr-2 px-4 py-2 ${color} text-white rounded hover:opacity-90`}
        >
          Send {label}
        </button>
      ))}
    </div>
  );
};
