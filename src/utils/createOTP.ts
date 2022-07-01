import { v4 as uuidv4 } from "uuid";

export function createOTP(): number {
    const code = Math.floor(100000 + Math.random() * 900000);  //Generate random 6 digit code.  
    return code;
}

export function genUUID(): string {
    return uuidv4();
}