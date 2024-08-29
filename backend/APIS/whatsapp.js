const twilio = require('twilio')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log(accountSid, authToken)
const client = twilio(accountSid, authToken);

const WhatsappNormal=async()=>{
    const message = await client.messages.create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: "+14155238886",
        to: "+918618881769",
      });
      console.log(message.body, 'body in');
}


console.log("hello")
// WhatsappNormal()





