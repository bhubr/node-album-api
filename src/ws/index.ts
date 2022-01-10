import { verify } from "jsonwebtoken";
import { User } from "../entity/User";
import { Post } from "../entity/Post";

export default class WebSocketHandler {
  map = new Map<number, WebSocket>();

  static instance: WebSocketHandler | null = null;

  private constructor() {
    this.onConnect = this.onConnect.bind(this);
  }

  static getInstance() {
    if (!WebSocketHandler.instance) {
      WebSocketHandler.instance = new WebSocketHandler();
    }
    return WebSocketHandler.instance;
  }

  onConnect(ws) {
    ws.on('message', async (data) => {
      const { type, ...rest } = JSON.parse(data);
      if (type === 'connect') {
        await this.processConnect(ws, rest as { token: string });
      }
    });

    ws.send(JSON.stringify({msg:'something'}));
  }

  async processConnect(ws: WebSocket, { token }: { token: string }) {
    const payload = await verify(token, process.env.JWT_SECRET)
    this.map.set(payload.id, ws)
  }

  async notifyLike(uid: number, user: Partial<User>, post: Partial<Post>) {
    const ws = this.map.get(uid);
    if (!ws) {
      return
    }
    this.map.get(uid).send(JSON.stringify({ type: 'post:like', user, post }))
  }

  async notifyComment(uid: number, user: Partial<User>, post: Partial<Post>) {
    const ws = this.map.get(uid);
    if (!ws) {
      return
    }
    this.map.get(uid).send(JSON.stringify({ type: 'post:comment', user, post }))
  }
}
