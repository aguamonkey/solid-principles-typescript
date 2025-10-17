export default `// ✅ GOOD: Follows OCP - open for extension, closed for modification

interface NotificationStrategy {
  send(recipient: string, message: string): void;
}

class EmailNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(\`Email to \${recipient}: \${message}\`);
  }
}

class SMSNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(\`SMS to \${recipient}: \${message}\`);
  }
}

// New notification type - no existing code modified!
class SlackNotification implements NotificationStrategy {
  send(recipient: string, message: string): void {
    console.log(\`Slack to \${recipient}: \${message}\`);
  }
}

class NotificationService {
  private strategies = new Map<string, NotificationStrategy>();

  register(type: string, strategy: NotificationStrategy): void {
    this.strategies.set(type, strategy);
  }

  send(type: string, recipient: string, message: string): void {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(\`No strategy for type: \${type}\`);
    }
    strategy.send(recipient, message);
  }
}`;
