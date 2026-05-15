import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Mock WhatsApp API Integration
app.post('/api/whatsapp/send', async (req, res) => {
  const { phone, message, templateName } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  // Simulate external API delay (e.g., Twilio / Meta Graph API)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log(`[WhatsApp API] Message sent to ${phone}`);
  console.log(`[WhatsApp API] Template: ${templateName}`);
  console.log(`[WhatsApp API] Content: ${message}`);

  // Return success response
  res.json({
    success: true,
    messageId: `wamid.HBgL${Math.floor(Math.random() * 100000000000)}`,
    status: 'sent',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
