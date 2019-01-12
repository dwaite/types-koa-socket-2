import * as Koa from "koa";
import * as socket from 'socket.io';
import { ServerOptions } from 'https';
import * as compose from 'koa-compose';
import { Http2SecureServer, Http2Server } from "http2";
import { EventEmitter } from "events";

export = IO;
declare namespace IO {
    type Event = string | symbol;
    type Handler = any;
    type Listeners = {[key: string]: Handler} ;
    type Packet = any;
    type Callback = any;
    type Room = string;
    type Namespace = string;
    type Data = any;
    interface Context {
            event: string,
            data: Data,
            socket: Socket,
            acknowledge: any
    }
    interface Application extends Koa {
        server: EventEmitter
        io: IO
    }
}

declare class IO {
    constructor(options?: 
        IO.Namespace | { 
        namespace?: IO.Namespace,
        hidden?: boolean,
        ioOptions?: socket.ServerOptions
    });

    attach: (app: Koa, https?: boolean, opts?: ServerOptions ) => void;
    attachNamespace: (app: Koa, namespace: IO.Namespace) => void;
    use: (fn: compose.Middleware<IO.Context>) => IO;
    on: (event: IO.Event, handler: IO.Handler) => IO;
    off: (event: IO.Event, handler: IO.Handler) => IO;
    broadcast: (event: IO.Event, data: IO.Data) => void;
    to: (room: IO.Room) => socket.Socket;
}
declare class Socket {
    constructor(socket: socket.Socket, listeners: IO.Listeners, middleware: Koa.Middleware);
    on: (event: IO.Event, handler: IO.Handler) => void;
    update: (listeners: IO.Listeners) => void;
    readonly id: string;
    emit: (event: IO.Event, packet: IO.Packet, callback: IO.Callback) => void;
    readonly broadcast: socket.Socket;
    join: (room: IO.Room) => socket.Socket;
    leave: (room: IO.Room) => socket.Socket;
    readonly rooms: { [key: string]: socket.Room };
    readonly volatile: socket.Socket;
    compress: (compress: boolean) => socket.Socket;
    disconnect: () => void;
}