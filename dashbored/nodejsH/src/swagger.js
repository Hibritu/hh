const swaggerUi = require('swagger-ui-express');

function setupSwagger(app) {
  const openapiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'HireHub API',
      version: '1.0.0',
      description: 'Swagger documentation for auth and user endpoints',
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 4000) },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            role: { type: 'string', enum: ['job_seeker', 'employer', 'admin'] },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female'] },
            is_verified: { type: 'boolean' },
            preferred_categories: { type: 'array', items: { type: 'string' } },
            preferred_locations: { type: 'array', items: { type: 'string' } },
            education: { type: 'string' },
            skills: { type: 'string' },
            experience: { type: 'string' },
            resume: { type: 'string' },
            profile_picture: { type: 'string' },
          },
        },
        EmployerProfile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['individual', 'company'] },
            company_name: { type: 'string' },
            sector: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            website: { type: 'string' },
            category: { type: 'string' },
            tin_number: { type: 'string' },
            verification_status: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
            license_document: { type: 'string' },
            national_id: { type: 'string' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['role', 'email', 'password', 'first_name', 'last_name'],
          properties: {
            role: { type: 'string', enum: ['job_seeker', 'employer'] },
            email: { 
              type: 'string', 
              format: 'email',
              description: 'Only Gmail addresses (@gmail.com) are allowed'
            },
            password: { type: 'string', minLength: 6 },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: { email: { type: 'string', format: 'email' } },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['email', 'otp'],
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 4 },
          },
        },
        UpdateMeRequest: {
          type: 'object',
          properties: {
            gender: { type: 'string', enum: ['male', 'female'] },
            education: { type: 'string' },
            skills: { type: 'string' },
            experience: { type: 'string' },
            preferred_categories: { type: 'array', items: { type: 'string' } },
            preferred_locations: { type: 'array', items: { type: 'string' } },
          },
        },
        UpdateEmployerRequest: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['individual', 'company'] },
            company_name: { type: 'string' },
            sector: { type: 'string' },
            website: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            category: { type: 'string' },
            tin_number: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        MessageResponse: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        UpdateMeResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            updated_fields: { type: 'array', items: { type: 'string' } },
            resume_uploaded: { type: 'boolean' },
            picture_uploaded: { type: 'boolean' },
          },
        },
        EmployerStatusResponse: {
          type: 'object',
          properties: {
            verification_status: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
            verification_notes: { type: 'string' },
            license_document: { type: 'string' },
            national_id: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          responses: { '200': { description: 'OK' } },
        },
      },
      '/auth/register': {
        post: {
          summary: 'Register user (account inactive until email verified)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
          },
          responses: {
            '201': { 
              description: 'Created - Account inactive until email verified', 
              content: { 
                'application/json': { 
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' },
                      needsVerification: { type: 'boolean' }
                    }
                  }
                } 
              } 
            },
            '400': { description: 'Validation error' },
            '409': { description: 'Email already registered' }
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login (only verified accounts allowed)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            '401': { 
              description: 'Unauthorized', 
              content: { 
                'application/json': { 
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                      needsVerification: { type: 'boolean' },
                      email: { type: 'string' }
                    }
                  }
                } 
              } 
            },
          },
        },
      },
      '/auth/forgot-password': {
        post: {
          summary: 'Request password reset',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
          },
          responses: { '200': { description: 'OK' } },
        },
      },
      '/auth/verify-email': {
        post: {
          summary: 'Verify email with OTP',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailRequest' } } },
          },
          responses: { '200': { description: 'OK' }, '400': { description: 'Invalid or expired OTP' } },
        },
      },
      '/users/me': {
        get: {
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
        put: {
          summary: 'Update user profile with optional file uploads',
          description: 'Update user profile data, preferences, and upload resume/profile picture in a single request',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    gender: { type: 'string', enum: ['male', 'female'] },
                    education: { type: 'string' },
                    skills: { type: 'string' },
                    experience: { type: 'string' },
                    preferred_categories: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'JSON array as string'
                    },
                    preferred_locations: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'JSON array as string'
                    },
                    resume: { 
                      type: 'string', 
                      format: 'binary',
                      description: 'PDF file for resume'
                    },
                    profile_picture: { 
                      type: 'string', 
                      format: 'binary',
                      description: 'Image file for profile picture'
                    },
                  },
                },
              },
              'application/json': { 
                schema: { $ref: '#/components/schemas/UpdateMeRequest' },
                description: 'For profile data only (no file uploads)'
              },
            },
          },
          responses: { 
            '200': { 
              description: 'Profile updated successfully', 
              content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMeResponse' } } }
            }, 
            '401': { description: 'Unauthorized' } 
          },
        },
      },
      '/employers/me': {
        get: {
          summary: 'Get current employer profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployerProfile' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
        put: {
          summary: 'Update employer profile',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateEmployerRequest' } } },
          },
          responses: { '200': { description: 'OK' }, '401': { description: 'Unauthorized' } },
        },
      },
      
      
      '/employers/me/status': {
        get: {
          summary: 'Get employer verification status',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/EmployerStatusResponse' } } } },
            '401': { description: 'Unauthorized' },
          },
        },
      },
    },
  };

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
}

module.exports = setupSwagger;
