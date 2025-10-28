import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // لتحميل متغيرات البيئة من ملف .env

const app = express();
app.use(cors());
app.use(express.json());

// إنشاء كائن OpenAI مع مفتاحك
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// المسار اللي يتعامل مع طلبات الواجهة
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "الرسالة مطلوبة" });
    }

    // إرسال الرسالة إلى نموذج OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // نموذج سريع ودقيق
      messages: [{ role: "user", content: message }],
    });

    // إرسال الرد للواجهة
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ خطأ في السيرفر:", error);
    res.status(500).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" });
  }
});

// تشغيل السيرفر
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ الخادم يعمل على المنفذ ${PORT}`));

