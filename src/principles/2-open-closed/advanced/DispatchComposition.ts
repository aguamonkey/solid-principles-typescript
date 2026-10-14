import { DispatchRegistry, type ChannelExtension } from "./DispatchRegistry";
import { isRecord } from "./DispatchBatch";
export const emailV1: ChannelExtension = {
  schema: { channel: "email", version: 1 },
  decode(payload) {
    if (
      !isRecord(payload) ||
      typeof payload.to !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.to) ||
      typeof payload.subject !== "string" ||
      !payload.subject.trim()
    )
      throw new Error("Invalid email payload.");
    return {
      label: "Email preview",
      recipient: payload.to,
      body: payload.subject,
    };
  },
};
export const webhookV1: ChannelExtension = {
  schema: { channel: "webhook", version: 1 },
  decode(payload) {
    if (
      !isRecord(payload) ||
      typeof payload.endpoint !== "string" ||
      typeof payload.text !== "string" ||
      !payload.text.trim()
    )
      throw new Error("Invalid webhook payload.");
    const url = new URL(payload.endpoint);
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password
    )
      throw new Error("Invalid endpoint.");
    return {
      label: "Webhook preview",
      recipient: url.host,
      body: payload.text,
    };
  },
};
export function composeDispatch(includeWebhook: boolean): DispatchRegistry {
  return new DispatchRegistry(
    includeWebhook ? [emailV1, webhookV1] : [emailV1],
  );
}
export const sampleBatch: unknown = [
  {
    id: "dispatch-01",
    channel: "email",
    version: 1,
    payload: {
      to: "reader@example.com",
      subject: "Your field notes are ready.",
    },
  },
  {
    id: "dispatch-02",
    channel: "webhook",
    version: 1,
    payload: {
      endpoint: "https://example.com/study-hook",
      text: "Release notes ready.",
    },
  },
  {
    id: "dispatch-03",
    channel: "email",
    version: 2,
    payload: { recipient: "reader@example.com", title: "A future schema" },
  },
  {
    id: "dispatch-04",
    channel: "email",
    version: 1,
    payload: { to: "not-an-address", subject: "Damaged record" },
  },
];
