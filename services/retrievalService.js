import { cosineSimilarity } from "../utils/vector.js";
import { generateEmbedding } from "./embeddingService.js";

export async function getRelevantDocuments(db, message) {

  const queryEmbedding = await generateEmbedding(message);

  // 2️⃣ DB se sab documents lao
  const [rows] = await db.query(
    `SELECT id, content, embedding FROM documents`
  );

  // 3️⃣ Similarity calculate karo
  const scoredDocs = rows.map(doc => {
    const docEmbedding = JSON.parse(doc.embedding);

    return {
      content: doc.content,
      score: cosineSimilarity(queryEmbedding, docEmbedding)
    };
  });

  // 4️⃣ Sort descending
  scoredDocs.sort((a, b) => b.score - a.score);

  // 5️⃣ Top 3 return karo
  return scoredDocs.slice(0, 3).map(d => d.content);
}