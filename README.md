# Sample Test API

A Node.js API with Jenkins CI/CD pipeline and Monday.com integration. 

## Features
a

- RESTful API for user management
- Jenkins CI/CD pipeline with Monday.com integration
- Docker support for containerization
- Comprehensive test suite with Jest
- Health checks and monitoring
- Security best practices


## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/count` - User statistics

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
