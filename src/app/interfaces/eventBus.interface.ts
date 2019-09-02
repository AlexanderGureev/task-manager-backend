import { EventEmitter } from "events";

export interface IEventBus extends EventEmitter {
  subscribe(event: string, listener: any): void;
  publish(event: string, payload: any): void;
}
