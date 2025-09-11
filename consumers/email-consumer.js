const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const dotenv = require("dotenv");

dotenv.config();

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
        console.log(`No Message in Queue`);
        continue;
      }

      for (const message of Messages) {
        try {
          const { MessageId, Body } = message;
          console.log(`Message Received`, { MessageId, Body });

          if (!Body) continue;

          // Validate and Parse the event
          const event = JSON.parse(Body);
          console.log(event);

          // Ignore test event
          if ("Service" in event && "Event" in event) {
            if (event.Event === "s3:TestEvent") {
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

          // Your processing logic here
          console.log(`Processing message ${MessageId}...`);

          // Delete after processing
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
      // small delay before retry to avoid tight loop on repeated errors
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

init().catch((err) => {
  console.error("Fatal error in init:", err);
});
