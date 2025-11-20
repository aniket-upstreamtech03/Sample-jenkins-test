# Sample Test API 🚀

A Node.js REST API with **fully automated CI/CD pipeline** - from GitHub push to Docker deployment!

## ✨ Features

- 🔄 **Automated Deployment** - Push code → GitHub triggers Jenkins → Automatic Docker deployment
- 🐳 **Docker Containerization** - Consistent environment across all deployments
- 🧪 **Automated Testing** - Jest test suite runs on every push
- 🏥 **Health Checks** - Built-in health monitoring
- 🔒 **Security** - Helmet.js, CORS, and best practices
- 📊 **RESTful API** - Complete user management system

## 🎯 Deployment Flow

```
Developer Push → GitHub → Jenkins Webhook → Docker Build → Container Deploy
                                                    ↓
                            ✅ Real-time tracking of entire pipeline
                            ✅ No manual intervention required
```


## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information |
| `GET` | `/health` | Health check & status |
| `GET` | `/api/users` | Get all users |
| `POST` | `/api/users` | Create new user |
| `GET` | `/api/users/:id` | Get user by ID |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |
| `GET` | `/api/users/stats/count` | User statistics |

## 🚀 Quick Start

### Automated Deployment (Recommended)

**Just push your code to GitHub!** Jenkins automatically:
1. ✅ Pulls latest code
2. ✅ Runs tests
3. ✅ Builds Docker image
4. ✅ Deploys container
5. ✅ Performs health check

**Access your app:** `http://localhost:3000`

👉 **See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for first-time setup**
👉 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed documentation**

---

### Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
2. Run tests:
```bash
npm test
```

3. Start development server:
```bash
npm run dev
```

4. Access the API at http://localhost:3000

---

### Docker Deployment

#### Using Docker Compose (Easiest):
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Using Docker Commands:
```bash
# Build the image
docker build -t sample-test-api:latest .

# Run the container
docker run -d --name sample-test-api-container -p 3000:3000 sample-test-api:latest

# View logs
docker logs -f sample-test-api-container

# Stop and remove
docker stop sample-test-api-container
docker rm sample-test-api-container
```

---

##  Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

##  Project Structure

```
Sample-jenkins-test/
 Jenkinsfile            CI/CD Pipeline definition
 Dockerfile             Docker image configuration
 docker-compose.yml     Docker Compose config
 .dockerignore          Docker build exclusions
 DEPLOYMENT.md          Detailed deployment docs
 SETUP-GUIDE.md         Setup instructions
 app.js                 Main application
 package.json           Dependencies
 routes/                API routes
 controllers/           Business logic
 models/                Data models
 middleware/            Authentication
 config/                Configuration
 tests/                 Test files
```

---

##  Configuration

### Environment Variables

Create a .env file for local development:

```env
NODE_ENV=development
PORT=3000
```

### Jenkins Environment Variables

Set in Jenkinsfile:
- DOCKER_IMAGE_NAME - Docker image name
- DOCKER_IMAGE_TAG - Image version tag
- DOCKER_CONTAINER_NAME - Container name
- DOCKER_PORT - Port inside container
- HOST_PORT - Port on host machine

---

##  Docker Commands Reference

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View container logs
docker logs -f sample-test-api-container

# Access container shell
docker exec -it sample-test-api-container sh

# View container stats
docker stats sample-test-api-container

# Restart container
docker restart sample-test-api-container

# Remove stopped containers
docker container prune
```

---

##  API Usage Examples

### Health Check
```bash
curl http://localhost:3000/health
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

---

##  CI/CD Pipeline Stages

1. **Checkout** - Clone repository from GitHub
2. **Install & Test** - Install dependencies and run tests
3. **Build** - Build the application
4. **Stop Old Container** - Stop existing Docker container
5. **Remove Old Image** - Clean up old Docker images
6. **Build Docker Image** - Create new Docker image
7. **Deploy Container** - Start new Docker container
8. **Verify Deployment** - Check container status
9. **Health Check** - Verify application is responding

---

##  Troubleshooting

### Container won't start
```bash
# Check logs
docker logs sample-test-api-container

# Inspect container
docker inspect sample-test-api-container
```

### Port already in use
```bash
# Windows: Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /F /PID <PID>
```

### Jenkins pipeline fails
- Check Jenkins console output
- Verify Docker is installed: docker --version
- Ensure Jenkins user has Docker permissions
- Check webhook configuration in GitHub

---

##  Documentation

- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Complete setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment documentation
- **[TEST.md](./TEST.md)** - Testing documentation

---

##  Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Make your changes
4. Run tests: 
pm test
5. Commit: git commit -m 'Add feature'
6. Push: git push origin feature-name
7. Create a Pull Request

---

##  License

MIT License - feel free to use this project for learning and development.

---

##  Success!

Your automated deployment pipeline is ready:
-  Push code to GitHub
-  Jenkins automatically builds and tests
-  Docker container deploys automatically
-  Application accessible at http://localhost:3000

**Happy coding! **
