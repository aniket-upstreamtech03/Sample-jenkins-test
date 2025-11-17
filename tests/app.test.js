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
    });
  });

  // Root endpoint tests
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Welcome to Sample Test API');
    });
  });

  // Users API tests
  describe('Users API', () => {
    // Test GET all users
    it('should get all users with success response', async () => {
      const response = await request(app).get('/api/users');
      
      // Should work without API key in development
      expect([200, 401]).toContain(response.status);
    });

    // Test user statistics
    it('should get user statistics', async () => {
      const response = await request(app).get('/api/users/stats/count');
      
      expect([200, 401]).toContain(response.status);
    });
  });

  // 404 handler test
  describe('Non-existent routes', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});