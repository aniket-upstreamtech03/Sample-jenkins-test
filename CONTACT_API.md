# Contact Us API Documentation

This document describes the Contact Us feature implementation in the Sample Test API.

## Overview

The Contact Us feature allows users to submit contact forms and provides admin endpoints to manage and track contact submissions.

## Features

- ✅ Submit contact forms (public endpoint)
- ✅ Email validation
- ✅ View all contact submissions
- ✅ Filter contacts by status
- ✅ Update contact status (pending, in-progress, resolved, closed)
- ✅ Delete contacts
- ✅ Contact statistics dashboard
- ✅ Beautiful HTML contact form included

## API Endpoints

### Public Endpoint

#### Submit Contact Form
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "General Inquiry",
  "message": "I would like to know more about your services."
}
```

**Required Fields:** `name`, `email`, `message`  
**Optional Fields:** `subject`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "id": 1,
    "submittedAt": "2025-11-20T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Name, email, and message are required fields"
}
```

### Admin Endpoints

#### Get All Contacts
```
GET /api/contact
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, resolved, closed)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "subject": "General Inquiry",
      "message": "I would like to know more...",
      "submittedAt": "2025-11-20T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

#### Get Contact Statistics
```
GET /api/contact/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 5,
    "inProgress": 3,
    "resolved": 1,
    "closed": 1
  }
}
```

#### Get Contact by ID
```
GET /api/contact/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "subject": "General Inquiry",
    "message": "I would like to know more...",
    "submittedAt": "2025-11-20T10:30:00.000Z",
    "status": "pending"
  }
}
```

#### Update Contact Status
```
PATCH /api/contact/:id/status
```

**Request Body:**
```json
{
  "status": "in-progress"
}
```

**Valid Status Values:**
- `pending`
- `in-progress`
- `resolved`
- `closed`

**Response (200):**
```json
{
  "success": true,
  "message": "Contact status updated successfully",
  "data": {
    "id": 1,
    "status": "in-progress",
    "updatedAt": "2025-11-20T11:00:00.000Z"
  }
}
```

#### Delete Contact
```
DELETE /api/contact/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

## HTML Contact Form

A beautiful, responsive HTML contact form is included at `contact.html`. 

### Usage

1. Start your API server:
```bash
npm start
```

2. Open `contact.html` in your browser
3. Fill out the form and submit

The form includes:
- Real-time validation
- Success/error messages
- Responsive design
- Loading states

### Customization

To change the API URL in the HTML form, modify the `API_URL` constant in the JavaScript section:

```javascript
const API_URL = 'http://your-domain.com/api/contact';
```

## Testing

Run the contact API tests:

```bash
npm test tests/contact.test.js
```

The test suite includes:
- Form submission validation
- Email format validation
- Required field checks
- Status update operations
- CRUD operations
- Statistics endpoint

## Example Usage with cURL

### Submit a contact form:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "Product Question",
    "message": "I have a question about your product."
  }'
```

### Get all contacts:
```bash
curl http://localhost:3000/api/contact
```

### Get statistics:
```bash
curl http://localhost:3000/api/contact/stats
```

### Update contact status:
```bash
curl -X PATCH http://localhost:3000/api/contact/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

## Security Considerations

For production deployment, consider:

1. **Rate Limiting**: Add rate limiting to prevent spam submissions
2. **CAPTCHA**: Implement CAPTCHA for bot protection
3. **Email Notifications**: Send email notifications when forms are submitted
4. **Authentication**: Protect admin endpoints with proper authentication
5. **Data Sanitization**: Sanitize input to prevent XSS attacks
6. **Database Storage**: Use a database instead of in-memory storage

## Files Created

- `controllers/contactController.js` - Business logic for contact operations
- `routes/contact.js` - Route definitions
- `contact.html` - Beautiful contact form UI
- `tests/contact.test.js` - Comprehensive test suite
- `CONTACT_API.md` - This documentation

## Integration

The contact routes are automatically integrated into `app.js` and available at `/api/contact`.

All endpoints are listed in the root endpoint (`GET /`) under the `endpoints` object.
