const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function init() {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  });

  while (true) {
    try {
      const { Messages } = await client.send(command);

      if (!Messages || Messages.length === 0) {
        console.log("No Message in Queue");
        continue;
      }

      for (const message of Messages) {
        try {
          const { MessageId, Body } = message;
          console.log("Message Received", { MessageId, Body });

          if (!Body) continue;

          // Unwrap SNS envelope from SQS Body
          const snsEnvelope = JSON.parse(Body);

          // Unwrap actual payload
          const payload = JSON.parse(snsEnvelope.Message);

          // Ignore S3 test event
          if ("Service" in snsEnvelope && "Event" in snsEnvelope) {
            if (snsEnvelope.Event === "s3:TestEvent") {
              await client.send(
                new DeleteMessageCommand({
                  QueueUrl: process.env.SQS_QUEUE_URL,
                  ReceiptHandle: message.ReceiptHandle,
                })
              );
              console.log(`Ignored s3:TestEvent message ${MessageId}`);
              continue;
            }
          }

          console.log("Sending email to:", payload.user.email);

          // Prepare SendGrid email
          const msg = {
            to: payload.user.email,
            from: "itsalrightnet@gmail.com", // Verified sender
            subject: "Test mail from Nishith",
            text: "Thank you for your time 😊",
            html: "<strong>Easy to send emails with Node.js!</strong>",
          };

          const res = await sgMail.send(msg);
          if (res) {
            console.log("Email Sent!");
          }

          console.log(`Processing message ${MessageId}...`);

          // Delete message after processing
          await client.send(
            new DeleteMessageCommand({
              QueueUrl: process.env.SQS_QUEUE_URL,
              ReceiptHandle: message.ReceiptHandle,
            })
          );
          console.log(`Deleted message ${MessageId}`);
        } catch (msgError) {
          console.error(
            `Error processing message ${message.MessageId}:`,
            msgError
          );
          // Optional: move to DLQ instead of deleting
        }
      }
    } catch (pollError) {
      console.error("Error receiving messages from SQS:", pollError);
      // Small delay before retry to avoid tight loop
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

init().catch((err) => {
  console.error("Fatal error in init:", err);
});
