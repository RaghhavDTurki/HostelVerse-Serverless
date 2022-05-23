export function createOTP(): number {
    const code = Math.floor(100000 + Math.random() * 900000);  //Generate random 6 digit code.  
    return code;
}