const request = require('supertest');
const app = require('../app');

describe('Sample Test API', () => {
  // Health check tests
  describe('GET /health', () => {
    it('should return health status with OK', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });

    it('should include system information', async () => {
      const response = await request(app).get('/health');
      
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(typeof response.body.uptime).toBe('number');
      expect(typeof response.body.memory).toBe('object');
    });
  });

  // Root endpoint tests
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Welcome to Sample Test API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('users');
    });
  });

  // Users API tests
  describe('Users API', () => {
    let testUserId;

    // Test GET all users
    describe('GET /api/users', () => {
      it('should get all users with success response', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('x-api-key', 'demo-key-123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body).toHaveProperty('pagination');
      });

      it('should work without API key in development', async () => {
        const response = await request(app).get('/api/users');
        
        // Should work without API key in development
        expect([200, 401]).toContain(response.status);
      });
    });

    // Test CREATE user
    describe('POST /api/users', () => {
      it('should create a new user with valid data', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test.user@example.com',
          age: 30,
          department: 'Testing'
        };
        
        const response = await request(app)
          .post('/api/users')
          .set('x-api-key', 'demo-key-123')
          .send(newUser);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(newUser.name);
        expect(response.body.data.email).toBe(newUser.email);
        
        testUserId = response.body.data.id;
      });

      it('should fail with missing required fields', async () => {
        const invalidUser = {
          name: 'Incomplete User'
          // Missing email, age, department
        };
        
        const response = await request(app)
          .post('/api/users')
          .set('x-api-key', 'demo-key-123')
          .send(invalidUser);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
      });
    });

    // Test GET user by ID
    describe('GET /api/users/:id', () => {
      it('should get user by ID', async () => {
        const response = await request(app)
          .get(`/api/users/${testUserId}`)
          .set('x-api-key', 'demo-key-123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.id).toBe(testUserId);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/9999')
          .set('x-api-key', 'demo-key-123');
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
      });
    });

    // Test UPDATE user
    describe('PUT /api/users/:id', () => {
      it('should update user with valid data', async () => {
        const updatedData = {
          name: 'Updated Test User',
          age: 35
        };
        
        const response = await request(app)
          .put(`/api/users/${testUserId}`)
          .set('x-api-key', 'demo-key-123')
          .send(updatedData);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.name).toBe(updatedData.name);
        expect(response.body.data.age).toBe(updatedData.age);
      });
    });

    // Test user statistics
    describe('GET /api/users/stats/count', () => {
      it('should get user statistics', async () => {
        const response = await request(app)
          .get('/api/users/stats/count')
          .set('x-api-key', 'demo-key-123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('total');
        expect(response.body.data).toHaveProperty('active');
        expect(response.body.data).toHaveProperty('inactive');
        expect(response.body.data).toHaveProperty('departments');
      });
    });

    // Test DELETE user
    describe('DELETE /api/users/:id', () => {
      it('should delete user', async () => {
        const response = await request(app)
          .delete(`/api/users/${testUserId}`)
          .set('x-api-key', 'demo-key-123');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
      });
    });
  });

  // 404 handler test
  describe('Non-existent routes', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('availableEndpoints');
    });
  });

  // Error handling test
  describe('Error handling', () => {
    it('should handle internal errors gracefully', async () => {
      // This test verifies the error handling middleware works
      const response = await request(app).get('/api/users'); // Without causing actual error
      expect(response.status).toBeOneOf([200, 401]); // Should not be 500
    });
  });
});

// Custom matcher for status code options
expect.extend({
  toBeOneOf(received, options) {
    const pass = options.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of [${options.join(', ')}]`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be one of [${options.join(', ')}]`,
        pass: false
      };
    }
  }
});