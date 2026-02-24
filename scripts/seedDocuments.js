import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import { generateEmbedding } from "../services/embeddingService.js";

async function seed() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chatboat",
    port: 3308
  });

  const documents = [
    {
      type: "faq",
      title: "Refund Policy",
      content: "Customers can request a refund within 7 days of purchase."
    },
    {
      type: "faq",
      title: "Shipping Time",
      content: "Orders are delivered within 3 to 5 business days."
    },
    {
      type: "faq",
      title: "Working Hours",
      content: "Our business hours are Monday to Friday, 9 AM to 6 PM IST. We are closed on weekends and public holidays. For urgent matters, email support is available 24/7 with response within 24 hours."
    },
    {
      type: "faq",
      title: "Frequently Asked Questions",
      content: "Common questions: 1) Refund within 7 days. 2) Shipping takes 3-5 days. 3) We accept all payment methods. 4) Support available Mon-Fri 9-6. 5) Free returns on defective items."
    },
    {
      type: "privacy",
      title: "Data Privacy",
      content: "We do not share customer data with third parties."
    }
  ];

  for (const doc of documents) {

    console.log("Generating embedding for:", doc.title);

    const embedding = await generateEmbedding(doc.content);

    await db.execute(
      `INSERT INTO documents (type, title, content, embedding)
       VALUES (?, ?, ?, ?)`,
      [doc.type, doc.title, doc.content, JSON.stringify(embedding)]
    );
  }

  console.log("Seeding completed.");
  process.exit();
}

seed();