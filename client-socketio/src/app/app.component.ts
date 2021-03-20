import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { CesarService } from './cesar.service';
import { CyptoJsService } from './crypto.service';
import { RsaService } from './rsa.service';
import { FormData, FormDataRSA } from './formData.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  messageList: string[] = [];
  encryptionKey: string = "0";
  message: string = "";
  obs: Observable<string>;
  rsaHello: FormDataRSA;
  otherRSAHello: FormDataRSA;

  constructor(
    private socketService: SocketService,
    private cesarService: CesarService,
    private cryptoService: CyptoJsService,
    private rsaService : RsaService
  ) { }

  sendMessage(formData: FormData) {
    console.log("form input: " + JSON.stringify(formData));
    
    let encoded: FormData = formData; //Preparo una variabile da criptare
    switch (formData.messageType) {
      //Se il tipo di messaggio è cesar allora cripto con cesarService
      case "cesar":
        encoded.message = this.cesarService.encode(formData.message, Number(this.encryptionKey));
        break;
      //Se il tipo di messaggio è t-des allora cripto con cryptoService.encodeDes
      case "t-des":
        encoded.message = this.cryptoService.encodeDes(formData.message, this.encryptionKey);
        break;
      case "rsa":
        encoded.message = this.rsaService.encryptWithPublicKey(formData.message, this.otherRSAHello.n, this.otherRSAHello.e);
        break;

    }
    //Invio il messaggio cifrato
    this.socketService.sendMessage(JSON.stringify(encoded));

    this.message = "";
  }
  setEncryptionKey(encryptionKey: HTMLInputElement) {
    this.encryptionKey = encryptionKey.value;
  }

  getRSAHello() {
    console.log("hello");
    this.rsaHello = this.rsaService.getRsaKeyPair();
  }

  setOtherRSAPublic(rsaHelloPasted: HTMLInputElement) {
    this.otherRSAHello = JSON.parse(rsaHelloPasted.value);
    console.log(this.otherRSAHello);
  }

  ngOnInit() {
    this.obs = this.socketService.getMessage();
    this.obs.subscribe(this.decodeData);
  }

  decodeData = (messageData: string) => {
    let received: FormData = JSON.parse(messageData);
    console.log("messagereceived: " + JSON.stringify(received))

    switch (received.messageType) {
      case "cesar":
        received.message = this.cesarService.decode(received.message, Number(this.encryptionKey));
        break;

      case "t-des":
        received.message = this.cryptoService.decodeDes(received.message, this.encryptionKey);
        break;

      case "rsa":
        received.message = this.rsaService.decrypyrWithPrivateKey(received.message);
        break;
    }

    this.messageList.push("messaggio cifrato: " + messageData + " messaggio decifrato " + JSON.stringify(received));

  }
}