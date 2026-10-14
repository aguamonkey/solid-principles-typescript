export interface ChannelSchema {
  readonly channel: string;
  readonly version: number;
}
export interface DeliveryPreview {
  readonly label: string;
  readonly recipient: string;
  readonly body: string;
}
export interface ChannelExtension {
  readonly schema: ChannelSchema;
  readonly decode: (payload: unknown) => DeliveryPreview;
}
export class DispatchRegistry {
  #decoders = new Map<string, ChannelExtension["decode"]>();
  constructor(extensions: readonly ChannelExtension[]) {
    for (const extension of extensions) {
      const { channel, version } = extension.schema;
      if (!channel.trim() || !Number.isSafeInteger(version) || version <= 0)
        throw new Error("Invalid registration key.");
      const key = JSON.stringify([channel, version]);
      if (this.#decoders.has(key))
        throw new Error("Duplicate registration key.");
      this.#decoders.set(key, extension.decode);
    }
  }
  decoder(schema: ChannelSchema): ChannelExtension["decode"] | undefined {
    return this.#decoders.get(JSON.stringify([schema.channel, schema.version]));
  }
}
