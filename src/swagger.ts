
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VitalSync API',
      version: '1.0.0',
      description: 'API para o sistema VitalSync - Monitoramento Remoto de Sinais Vitais',
      contact: {
        name: 'VitalSync Team',
        email: 'dev@vitalsync.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a requisição foi bem-sucedida',
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva do resultado',
            },
            data: {
              description: 'Dados da resposta (pode ser qualquer tipo)',
            },
          },
        },
        VitalSigns: {
          type: 'object',
          properties: {
            heartRate: {
              type: 'integer',
              description: 'Frequência cardíaca (BPM)',
              example: 72,
            },
            oxygenSaturation: {
              type: 'integer',
              description: 'Saturação de oxigênio (%)',
              example: 98,
            },
            bloodPressure: {
              type: 'object',
              properties: {
                systolic: {
                  type: 'integer',
                  description: 'Pressão sistólica (mmHg)',
                  example: 120,
                },
                diastolic: {
                  type: 'integer',
                  description: 'Pressão diastólica (mmHg)',
                  example: 80,
                },
              },
            },
            temperature: {
              type: 'number',
              format: 'float',
              description: 'Temperatura corporal (°C)',
              example: 36.8,
            },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do paciente',
              example: 'clp2xxx...',
            },
            name: {
              type: 'string',
              description: 'Nome do paciente',
              example: 'João Silva',
            },
            age: {
              type: 'integer',
              description: 'Idade do paciente',
              example: 45,
            },
            condition: {
              type: 'string',
              description: 'Condição médica do paciente',
              example: 'Hipertensão arterial',
            },
            photoUrl: {
              type: 'string',
              nullable: true,
              description: 'URL da foto do paciente',
              example: '/uploads/photo.jpg',
            },
            transmissionsCount: {
              type: 'integer',
              description: 'Número total de transmissões',
              example: 150,
            },
            lastTransmission: {
              type: 'string',
              format: 'date-time',
              description: 'Data/hora da última transmissão',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do registro',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
            },
            currentVitalSigns: {
              $ref: '#/components/schemas/VitalSigns',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Swagger UI page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'VitalSync API Documentation',
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation configurada em /api-docs');
}
