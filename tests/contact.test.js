const request = require('supertest');
const app = require('../app');

describe('Contact API Endpoints', () => {
  let contactId;

  describe('POST /api/contact', () => {
    it('should submit a contact form successfully', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Thank you for contacting us');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('submittedAt');
      
      contactId = response.body.data.id;
    });

    it('should submit contact without subject (optional field)', async () => {
      const contactData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'Test message without subject'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should fail if name is missing', async () => {
      const contactData = {
        email: 'test@example.com',
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should fail if email is missing', async () => {
      const contactData = {
        name: 'Test User',
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should fail if message is missing', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should fail if email format is invalid', async () => {
      const contactData = {
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email');
    });
  });

  describe('GET /api/contact', () => {
    it('should get all contacts', async () => {
      const response = await request(app)
        .get('/api/contact')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter contacts by status', async () => {
      const response = await request(app)
        .get('/api/contact?status=pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/contact/stats', () => {
    it('should get contact statistics', async () => {
      const response = await request(app)
        .get('/api/contact/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('pending');
      expect(response.body.data).toHaveProperty('inProgress');
      expect(response.body.data).toHaveProperty('resolved');
      expect(response.body.data).toHaveProperty('closed');
    });
  });

  describe('GET /api/contact/:id', () => {
    it('should get a specific contact by ID', async () => {
      const response = await request(app)
        .get(`/api/contact/${contactId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', contactId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
    });

    it('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .get('/api/contact/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /api/contact/:id/status', () => {
    it('should update contact status', async () => {
      const response = await request(app)
        .patch(`/api/contact/${contactId}/status`)
        .send({ status: 'in-progress' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('in-progress');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should fail with invalid status', async () => {
      const response = await request(app)
        .patch(`/api/contact/${contactId}/status`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Status must be one of');
    });

    it('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .patch('/api/contact/99999/status')
        .send({ status: 'resolved' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/contact/:id', () => {
    it('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .delete('/api/contact/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should delete a contact', async () => {
      const response = await request(app)
        .delete(`/api/contact/${contactId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });
  });
});
