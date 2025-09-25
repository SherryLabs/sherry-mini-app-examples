import express, { Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import { serializeTx } from './utils/serializer.util.js';

const app: Express = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip || req.socket?.remoteAddress}`);
  next();
});

// GET /api/buy-png - Returns Sherry metadata
app.get('/api/buy-png', (req: Request, res: Response) => {
  try {
    // Get server URL information
    const host = req.get('host') || 'localhost:5002';
    const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
    const serverUrl = `${protocol}://${host}`;

    const metadata = {
      url: 'https://pangolin.exchange',
      icon: 'https://kfrzkvoejzjkugwosqxx.supabase.co/storage/v1/object/public/images/icons/pangolin.png',
      title: 'Buy PNG with AVAX',
      baseUrl: serverUrl,
      description: 'Pick a bag or name your price. Swap AVAX for PNG.',
      actions: [
        {
          type: 'dynamic',
          label: '0.1 AVAX',
          description: 'Action description',
          chains: { source: 43114 },
          path: `/api/buy-png?amount=0.1`,
          params: [
            {
              name: 'to',
              label: 'Send PNG tokens to address',
              type: 'address',
              required: true,
              value: 'sender',
            },
          ],
        },
        {
          type: 'dynamic',
          label: '0.5 AVAX',
          description: 'Action description',
          chains: { source: 43114 },
          path: `/api/buy-png?amount=0.5`,
          params: [
            {
              name: 'to',
              label: 'Send PNG tokens to address',
              type: 'address',
              required: true,
              value: 'sender',
            },
          ],
        },
        {
          type: 'dynamic',
          label: '1 AVAX',
          description: 'Action description',
          chains: { source: 43114 },
          path: `/api/buy-png?amount=1`,
          params: [
            {
              name: 'to',
              label: 'Send PNG tokens to address',
              type: 'address',
              required: true,
              value: 'sender',
            },
          ],
        },
        {
          type: 'dynamic',
          label: 'Send it',
          description: 'How much AVAX? You tell us.',
          chains: { source: 43114 },
          path: `/api/buy-png`,
          params: [
            {
              name: 'to',
              label: 'Send PNG tokens to address',
              type: 'address',
              required: true,
              value: 'sender',
            },
            {
              name: 'amount',
              label: "Custom amount",
              type: 'number',
              required: false,
              description: 'Buy custom amount of PNG tokens',
            },
          ],
        },
      ],
    };

    res.json(metadata);
  } catch (error) {
    console.error('Error creating metadata:', error);
    res.status(500).json({ error: 'Error creating metadata' });
  }
});

// POST /api/buy-png - Execute transaction
app.post('/api/buy-png', async (req: Request, res: Response) => {
  try {
    // Extract parameters from query string
    const { amount, to } = req.query;

    // Validate required parameters
    if (!to || typeof to !== 'string') {
      return res.status(400).json({ error: 'User not logged in' });
    }

    // Use default amount if not provided
    const finalAmount = (amount as string) || '0.1';

    // Serialize the transaction for the blockchain
    const serialized = await serializeTx(finalAmount, 43114, to);

    // Create the response object expected by Sherry
    const resp = {
      serializedTransaction: serialized,
      chainId: 43114,
    };

    res.json(resp);
  } catch (error) {
    console.error('Error in POST request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Express API server running on port ${PORT}`);
});

export default app;