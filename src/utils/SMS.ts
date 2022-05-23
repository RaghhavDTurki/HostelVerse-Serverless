import { SmsClient } from '@azure/communication-sms';

const SMS_CONN_STRING = process.env.SMS_CONN_STRING

const smsClient = new SmsClient(SMS_CONN_STRING);
async function main() {
    const sendResults = await smsClient.send({
      from: "<from-phone-number>",
      to: ["<to-phone-number-1>", "<to-phone-number-2>"],
      message: "Hello World 👋🏻 via SMS"
    });
  
    // individual messages can encounter errors during sending
    // use the "successful" property to verify
    for (const sendResult of sendResults) {
      if (sendResult.successful) {
        console.log("Success: ", sendResult);
      } else {
        console.error("Something went wrong when trying to send this message: ", sendResult);
      }
    }
  }
  
