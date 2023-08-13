import { WebSocketServer } from "ws";
import { WSEventDataMap, WSEventName } from "../client/types.client";
import { WS_PORT } from "./consts.server";

const wss = new WebSocketServer({ port: WS_PORT });

export const emitAll = async <E extends WSEventName>(
  eventName: E,
  data: WSEventDataMap[E]
): Promise<void> => {
  wss.emit(eventName, data);
};

wss.on("connection", (ws) => {
  ws.on("error", console.error);
});
