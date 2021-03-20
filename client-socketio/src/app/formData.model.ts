import * as Forge from 'node-forge';

export interface FormData
{
    messageType : string;
    message : string;
}

export interface FormDataRSA
{
    messageType : string;
    message : string;
    n : Forge.jsbn.BigInteger;
    e : Forge.jsbn.BigInteger;
}