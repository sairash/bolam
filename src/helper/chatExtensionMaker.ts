import { messageSchema, type Message } from '@/types/message'
import { CHAT_EXTENSION_NAME } from './constants'
import { usePeerStore } from '@/store/peer'
import type { Wire, ExtensionConstructor } from 'bittorrent-protocol'


function chatExtensionMaker(): ExtensionConstructor {
  const chatExtension = class ChatExtension {
    private _wire: Wire;
    public name: string;
    constructor(wire: Wire) {
      this._wire = wire;
      this.name = CHAT_EXTENSION_NAME;
    }

    send(message: Message) {
      const stringData = JSON.stringify(message);
      const encoder = new TextEncoder();
      const uint8Data = encoder.encode(stringData);
      this._wire.extended(CHAT_EXTENSION_NAME, uint8Data)
    }

    // This method is called when a message is received from the peer.
    onMessage(payload: Uint8Array) {
      const decoder = new TextDecoder();
      let str = decoder.decode(payload);
      const startIndex = str.indexOf("\"");
      if (startIndex !== -1) {
        str = str.slice(startIndex);
      }
      
      const data = JSON.parse(JSON.parse(str));

      const parsedData = messageSchema.parse(data);

      try {
        usePeerStore.getState().addMessage(parsedData);
      } catch (err) {
        console.log(err);
      }
    }
  }

  chatExtension.prototype.name = CHAT_EXTENSION_NAME;
  return chatExtension as unknown as ExtensionConstructor;
}

export default chatExtensionMaker;