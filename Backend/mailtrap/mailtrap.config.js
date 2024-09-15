import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv'

dotenv.config();

const client = new MailtrapClient({
    endpoint: process.env.MAILTRAP_ENDPOINT,
    token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

export {client, sender}