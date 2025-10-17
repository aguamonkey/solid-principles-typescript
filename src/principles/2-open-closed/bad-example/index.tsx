export default `// ❌ BAD: Violates OCP - requires modification for new types

export type NotificationType = 'email' | 'sms' | 'push';

export class NotificationService {
  send(type: NotificationType, recipient: string, message: string): void {
    // Adding new type requires modifying this switch
    switch (type) {
      case 'email':
        this.sendEmail(recipient, message);
        break;
      case 'sms':
        this.sendSMS(recipient, message);
        break;
      case 'push':
        this.sendPush(recipient, message);
        break;
      default:
        throw new Error(\`Unknown type: \${type}\`);
    }
  }

  private sendEmail(recipient: string, message: string): void {
    console.log(\`Email to \${recipient}: \${message}\`);
  }

  private sendSMS(recipient: string, message: string): void {
    console.log(\`SMS to \${recipient}: \${message}\`);
  }

  private sendPush(recipient: string, message: string): void {
    console.log(\`Push to \${recipient}: \${message}\`);
  }
}`;
