import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';
import { FormDataRSA } from './formData.model';

@Injectable()
export class RsaService {
    myKeypair: Forge.pki.rsa.KeyPair;
   
    //Genera una coppia di di Chiavi per RSA
    //Accessibili myKeypair.privateKey, myKeypair.publicKey
    public getRsaKeyPair() : FormDataRSA
    {
        //Se non esiste una coppia di chiavi la genero
        if(this.myKeypair == undefined)
        {
             this.myKeypair = Forge.pki.rsa.generateKeyPair({bits: 1024, e: 0x10001});
        }
        return this.getNEMessage();
        //Modalità asincrona con subject e observable TODO
        /*Forge.pki.rsa.generateKeyPair({bits: 2048, workers: 2}, function(err, keypair) {
            // keypair.privateKey, keypair.publicKey
        });*/
    }

    //Genera il messaggio per inviare la chiave pubblica agli altri client
    private getNEMessage() : FormDataRSA
    {
        let rsaData : FormDataRSA = {
        e : this.myKeypair.publicKey.e,
        n : this.myKeypair.publicKey.n,
        messageType : "RSA_PUBLIC",
        message : "hello"
        }
        return rsaData;
    }

    public encryptWithPublicKey(message : string, n: Forge.jsbn.BigInteger, e: Forge.jsbn.BigInteger) : string
    {
        let { nFunc, eFunc } = this.recreateBigInteger(n, e);
        let otherPublic = Forge.pki.rsa.setPublicKey(nFunc, eFunc);
        return otherPublic.encrypt(message);
    }

    //Funzione da utilizzare poichè in json non vengono preservate le funzioni
    private recreateBigInteger(n: Forge.jsbn.BigInteger, e: Forge.jsbn.BigInteger) {
        let nFunc = new Forge.jsbn.BigInteger();
        let eFunc = new Forge.jsbn.BigInteger();
        nFunc.data = n.data;
        nFunc.s = n.s;
        nFunc.t = n.t;
        eFunc.data = e.data;
        eFunc.s = e.s;
        eFunc.t = e.t;
        return { nFunc, eFunc };
    }

    public decrypyrWithPrivateKey(message) :string
    {
        return this.myKeypair.privateKey.decrypt(message);
    }
    
}