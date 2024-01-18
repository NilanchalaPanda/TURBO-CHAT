import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";

const kafka = new Kafka({
  // CONFIGURATIONS -
  brokers: ["kafka-17ad1b83-nilanchalpanda2003-35d9.a.aivencloud.com:12979"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_uo9xc0RLtPmHeEWkT3d",
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

// PRODUCER -
export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  console.log('Consumer started consuming messages');
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  await consumer.run({
    autoCommit: true,
    // autoCommitInterval: 5,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;

      console.log(`New message rec..`);

      try {
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (error) {
        console.log("Error while saving the message to database");
        pause();

        // RESUME AFTER 1 MINUTE -
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
