import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
 
@Injectable()
export class SocketService {
 
    constructor(private socket: Socket) { }
 
    sendMessage(msg: string){
        this.socket.emit("new-message", msg);
    }
     getMessage() {
         return this.socket
             .fromEvent("resp-message")
             .pipe(map((data) => data));
    }
}
 