import * as EventEmitter from "events";
import { IEventBus } from "../interfaces/eventBus.interface";

export class EventBus extends EventEmitter implements IEventBus {
  public subscribe(event, listener) {
    this.on(event, listener);
  }
  public publish(event, payload) {
    this.emit(event, payload);
  }
}
