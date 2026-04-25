import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BYLD Backend Intern - Variant A',
      version: '1.0.0',
      description: 'Investment Portfolio Management API with Holdings and SIPs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            client_name: { type: 'string' },
            risk_profile: { type: 'string' },
            cash_balance: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Holding: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            portfolio_id: { type: 'string', format: 'uuid' },
            symbol: { type: 'string' },
            quantity: { type: 'number', format: 'decimal' },
            weighted_avg_cost: { type: 'number', format: 'decimal' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            portfolio_id: { type: 'string', format: 'uuid' },
            symbol: { type: 'string' },
            type: { type: 'string', enum: ['BUY', 'SELL'] },
            quantity: { type: 'number', format: 'decimal' },
            price: { type: 'number', format: 'decimal' },
            amount: { type: 'number', format: 'decimal' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;