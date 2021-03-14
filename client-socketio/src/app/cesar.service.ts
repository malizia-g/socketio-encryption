import { Injectable } from '@angular/core';
@Injectable()
export class CesarService {
    decode(encoded:string, offset:number) : string
    {
        let charArray = Array.from(encoded);
        let decodedArray = [];
        for (const char of charArray) {
            let charCode = char.charCodeAt(0);
            let newChar = String.fromCharCode(charCode - offset)
            decodedArray.push(newChar);
        }

        return decodedArray.join('');
    }

    encode(toEncode:string, offset:number) : string
    {
        let charArray = Array.from(toEncode); //Trasformo la stringa in un array di carateri
        let encodedArray = [];
        for (const char of charArray) {
            //Estraggo da ogni carattere il codice ascii
            let charCode = char.charCodeAt(0); 
            //Modifico il codice ascii e lo salvo in un carattere
            let newChar = String.fromCharCode(charCode + offset) 
            encodedArray.push(newChar);
        }
        //Trasformo l'encoded array in una stringa
        return encodedArray.join('');
    }
}
