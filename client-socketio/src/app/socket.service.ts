import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { FormData } from './formData.model';
 
@Injectable()
export class SocketService {
 
    constructor(private socket: Socket) { }
 
    sendMessage(msg: string){
        console.log(msg);
        this.socket.emit("new-message", msg);
    }
     getMessage() : Observable<string> {
         return this.socket.fromEvent("resp-message");
    }

}
 