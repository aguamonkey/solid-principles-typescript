// ❌ BAD: This violates OCP - adding new notification types requires modifying this class

export type NotificationType = 'email' | 'sms' | 'push';

export class NotificationService {
  send(type: NotificationType, recipient: string, message: string): void {
    // Every time we add a new notification type, we need to modify this method
    switch (type) {
      case 'email':
        this.sendEmail(recipient, message);
        break;
      case 'sms':
        this.sendSMS(recipient, message);
        break;
      case 'push':
        this.sendPushNotification(recipient, message);
        break;
      // Adding 'slack' would require modifying this switch statement
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }

  private sendEmail(recipient: string, message: string): void {
    console.log(`Sending email to ${recipient}: ${message}`);
    // Email sending logic
  }

  private sendSMS(recipient: string, message: string): void {
    console.log(`Sending SMS to ${recipient}: ${message}`);
    // SMS sending logic
  }

  private sendPushNotification(recipient: string, message: string): void {
    console.log(`Sending push notification to ${recipient}: ${message}`);
    // Push notification logic
  }

  // Adding new notification type requires adding another method here
}

// React component using the bad service
import React from 'react';

export const NotificationSender: React.FC = () => {
  const service = new NotificationService();

  const handleSend = (type: NotificationType) => {
    service.send(type, 'user@example.com', 'Hello!');
  };

  return (
    <div className="p-4">
      <button onClick={() => handleSend('email')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send Email
      </button>
      <button onClick={() => handleSend('sms')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
        Send SMS
      </button>
      <button onClick={() => handleSend('push')} className="px-4 py-2 bg-purple-500 text-white rounded">
        Send Push
      </button>
    </div>
  );
};
