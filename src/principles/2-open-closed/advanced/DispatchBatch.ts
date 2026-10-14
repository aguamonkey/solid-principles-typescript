import {
  DispatchRegistry,
  type ChannelSchema,
  type DeliveryPreview,
} from "./DispatchRegistry";
export type DispatchOutcome =
  | {
      readonly kind: "ready";
      readonly id: string;
      readonly schema: ChannelSchema;
      readonly preview: DeliveryPreview;
    }
  | {
      readonly kind: "unsupported";
      readonly id: string;
      readonly schema: ChannelSchema;
    }
  | { readonly kind: "rejected"; readonly reason: string };
export interface DispatchRow {
  readonly index: number;
  readonly outcome: DispatchOutcome;
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function usefulString(value: unknown): value is string {
  return typeof value === "string" && !!value.trim();
}
// Preview-only independent records: no delivery side effects occur here.
export function previewBatch(
  input: unknown,
  registry: DispatchRegistry,
): readonly DispatchRow[] {
  if (!Array.isArray(input)) throw new Error("Expected a message array.");
  const seen = new Set<string>();
  return input.map((record: unknown, index): DispatchRow => {
    const reject = (reason: string): DispatchRow => ({
      index,
      outcome: { kind: "rejected", reason },
    });
    if (
      !isRecord(record) ||
      !usefulString(record.id) ||
      !usefulString(record.channel) ||
      typeof record.version !== "number" ||
      !Number.isSafeInteger(record.version) ||
      record.version <= 0
    )
      return reject("Invalid envelope");
    const { id, channel, version } = record;
    if (seen.has(id)) return reject("Duplicate message ID");
    seen.add(id); // First valid envelope claims identity, including unsupported/bad payloads.
    const schema: ChannelSchema = Object.freeze({ channel, version });
    const decode = registry.decoder(schema);
    if (!decode) return { index, outcome: { kind: "unsupported", id, schema } };
    let result: DeliveryPreview;
    try {
      result = decode(record.payload);
    } catch {
      return reject("Invalid payload");
    }
    if (
      !isRecord(result) ||
      !usefulString(result.label) ||
      !usefulString(result.recipient) ||
      !usefulString(result.body)
    )
      return reject("Invalid adapter output");
    const preview = Object.freeze({
      label: result.label,
      recipient: result.recipient,
      body: result.body,
    });
    return { index, outcome: { kind: "ready", id, schema, preview } };
  });
}
