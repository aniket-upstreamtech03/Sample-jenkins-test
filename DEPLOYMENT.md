# 🚀 Docker Deployment Automation Guide

## 📋 Overview

This document explains the complete CI/CD pipeline that automates the deployment from GitHub to Docker containers using Jenkins.

---

## 🔄 Deployment Flow

### **Current Automated Flow:**
```
Developer Pushes Code → GitHub Repository
                            ↓
                    GitHub Webhook Trigger
                            ↓
                    Jenkins Pipeline Starts
                            ↓
        ┌───────────────────┴───────────────────┐
        │   1. Checkout Code from GitHub        │
        │   2. Install Dependencies (npm)        │
        │   3. Run Tests (Jest)                  │
        │   4. Build Application                 │
        │   5. Stop Old Docker Container         │
        │   6. Remove Old Docker Images          │
        │   7. Build New Docker Image            │
        │   8. Deploy New Docker Container       │
        │   9. Health Check                      │
        └────────────────────────────────────────┘
                            ↓
            ✅ Application Running in Docker
               Auto-restart enabled
               Accessible at http://localhost:3000
```

### **Previous Flow (Without Docker):**
```
Developer → GitHub → Jenkins → Copy to Local Folder → Manual node app.js
```

---

## 🔑 Key Files for Automation

### **1. Jenkinsfile** ⭐ **MAIN AUTOMATION FILE**
**Location:** `Sample-jenkins-test/Jenkinsfile`

**Purpose:** This is the CORE file that controls the entire CI/CD pipeline.

**What it does:**
- Triggered automatically when code is pushed to GitHub (via webhook)
- Runs tests to ensure code quality
- Builds Docker image from your application
- Stops old containers and deploys new ones
- Performs health checks to verify deployment

**Key Configuration Variables:**
```groovy
DOCKER_IMAGE_NAME = "sample-test-api"          // Name of your Docker image
DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"           // Version tag (auto-incremented)
DOCKER_CONTAINER_NAME = "sample-test-api-container"  // Container name
DOCKER_PORT = "3000"                           // Port inside container
HOST_PORT = "3000"                             // Port on host machine
```

**To modify deployment settings in future:**
- Change port numbers: Edit `DOCKER_PORT` and `HOST_PORT`
- Change container name: Edit `DOCKER_CONTAINER_NAME`
- Add environment variables: Add to `docker run` command in "Deploy Docker Container" stage
- Modify build steps: Edit stages in the pipeline

**Pipeline Stages:**
1. **Checkout** - Gets latest code from GitHub
2. **Install Dependencies & Test** - Runs `npm install` and `npm test`
3. **Build Application** - Runs `npm run build`
4. **Stop & Remove Old Docker Container** - Cleans up previous deployment
5. **Remove Old Docker Image** - Removes old images to save space
6. **Build Docker Image** - Creates new Docker image with latest code
7. **Deploy Docker Container** - Starts container with the application
8. **Verify Deployment** - Checks container status and logs
9. **Health Check** - Tests if application is responding

---

### **2. Dockerfile** ⭐ **DOCKER CONFIGURATION**
**Location:** `Sample-jenkins-test/Dockerfile`

**Purpose:** Defines how your application is packaged into a Docker container.

**What it does:**
- Uses Node.js 18 Alpine (lightweight Linux)
- Copies application code
- Installs dependencies
- Exposes port 3000
- Includes health check mechanism
- Starts the application with `npm start`

**Current Configuration:**
```dockerfile
FROM node:18-alpine          # Base image
WORKDIR /app                 # Working directory in container
COPY package*.json ./        # Copy package files first (for caching)
RUN npm install              # Install dependencies
COPY . .                     # Copy all application code
EXPOSE 3000                  # Expose port 3000
HEALTHCHECK --interval=30s   # Health check every 30 seconds
CMD ["npm", "start"]         # Start command
```

**To modify in future:**
- Change Node version: Edit `FROM node:18-alpine` to desired version
- Change port: Edit `EXPOSE 3000` to your port
- Add build steps: Add `RUN` commands before `CMD`
- Change start command: Edit `CMD ["npm", "start"]`

---

### **3. docker-compose.yml** ⭐ **DOCKER COMPOSE CONFIGURATION**
**Location:** `Sample-jenkins-test/docker-compose.yml`

**Purpose:** Alternative way to run the application (for local testing or manual deployment).

**What it does:**
- Defines service configuration
- Maps ports
- Sets environment variables
- Configures health checks and restart policy

**Usage:**
```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

---

### **4. .dockerignore** ⭐ **OPTIMIZATION FILE**
**Location:** `Sample-jenkins-test/.dockerignore`

**Purpose:** Tells Docker which files to exclude when building the image.

**Why it matters:**
- Reduces image size (excludes node_modules, tests, documentation)
- Faster builds (less files to copy)
- Security (excludes .env, .git)

**What it excludes:**
- node_modules (will be installed fresh in container)
- Tests and coverage reports
- Documentation files
- Git files
- IDE settings
- Docker files themselves

---

### **5. package.json**
**Location:** `Sample-jenkins-test/package.json`

**Purpose:** Defines application dependencies and scripts.

**Important scripts used in pipeline:**
- `npm install` - Installs dependencies
- `npm test` - Runs Jest tests
- `npm run build` - Builds the application
- `npm start` - Starts the server (used in Docker)

---

### **6. app.js**
**Location:** `Sample-jenkins-test/app.js`

**Purpose:** Main application entry point.

**Key features:**
- Express server on port 3000
- Health check endpoint at `/health`
- API routes at `/api/users`
- Graceful shutdown handling

---

## 🔧 GitHub Webhook Setup

**To enable automatic deployment on push:**

1. **Go to your GitHub repository**
2. **Settings → Webhooks → Add webhook**
3. **Configure:**
   - **Payload URL:** `http://YOUR_JENKINS_URL/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Select "Just the push event"
   - **Active:** Check the box
4. **Save**

Now every push to GitHub will automatically trigger Jenkins!

---

## 🐳 Docker Commands Cheat Sheet

### **View Running Containers:**
```bash
docker ps
```

### **View All Containers (including stopped):**
```bash
docker ps -a
```

### **View Container Logs:**
```bash
docker logs sample-test-api-container
docker logs -f sample-test-api-container  # Follow logs in real-time
```

### **Stop Container:**
```bash
docker stop sample-test-api-container
```

### **Start Container:**
```bash
docker start sample-test-api-container
```

### **Restart Container:**
```bash
docker restart sample-test-api-container
```

### **Remove Container:**
```bash
docker rm sample-test-api-container
docker rm -f sample-test-api-container  # Force remove
```

### **View Images:**
```bash
docker images
docker images sample-test-api
```

### **Remove Image:**
```bash
docker rmi sample-test-api:latest
```

### **Access Container Shell:**
```bash
docker exec -it sample-test-api-container sh
```

### **View Container Stats (CPU, Memory):**
```bash
docker stats sample-test-api-container
```

### **Inspect Container:**
```bash
docker inspect sample-test-api-container
```

---

## 🔍 Troubleshooting

### **Problem: Pipeline fails at Docker build**
**Solution:**
- Check if Docker is running: `docker --version`
- Check Docker service: `docker ps`
- Review Jenkins console output for specific error

### **Problem: Container starts but health check fails**
**Solution:**
- Check container logs: `docker logs sample-test-api-container`
- Verify port 3000 is not in use: `netstat -ano | findstr :3000`
- Test health endpoint manually: `curl http://localhost:3000/health`

### **Problem: Port already in use**
**Solution:**
- Stop conflicting container: `docker stop sample-test-api-container`
- Or change HOST_PORT in Jenkinsfile to different port

### **Problem: Jenkins can't find Docker commands**
**Solution:**
- Ensure Docker is installed on Jenkins server
- Add Docker to Jenkins user's PATH
- Restart Jenkins service

### **Problem: Container stops immediately after starting**
**Solution:**
- Check logs: `docker logs sample-test-api-container`
- Verify app.js starts correctly
- Check for missing dependencies

---

## 📊 Monitoring Your Application

### **Health Check Endpoint:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-20T10:30:00.000Z",
  "uptime": 123.45,
  "memory": {...},
  "environment": "production",
  "version": "1.0.0"
}
```

### **API Root:**
```bash
curl http://localhost:3000/
```

### **Users API:**
```bash
curl http://localhost:3000/api/users
```

---

## 🔄 Making Changes to Deployment

### **To change Docker container configuration:**
1. Edit `Jenkinsfile` - Modify environment variables or docker run command
2. Commit and push to GitHub
3. Jenkins will automatically redeploy with new configuration

### **To change application code:**
1. Edit your code files (app.js, routes, etc.)
2. Commit and push to GitHub
3. Jenkins automatically tests, builds, and redeploys

### **To change Dockerfile:**
1. Edit `Dockerfile`
2. Commit and push to GitHub
3. Jenkins will build new image with changes

### **To add environment variables:**
Edit Jenkinsfile, in "Deploy Docker Container" stage:
```groovy
docker run -d \
    --name ${DOCKER_CONTAINER_NAME} \
    -p ${HOST_PORT}:${DOCKER_PORT} \
    -e NODE_ENV=production \
    -e NEW_VARIABLE=value \    // Add your variable here
    --restart unless-stopped \
    ${DOCKER_IMAGE_NAME}:latest
```

---

## ✅ Benefits of Docker Deployment

### **Before (Local Deployment):**
- ❌ Manual setup on each server
- ❌ "Works on my machine" problems
- ❌ Dependency conflicts
- ❌ Difficult to scale
- ❌ Manual process management

### **After (Docker Deployment):**
- ✅ Consistent environment everywhere
- ✅ Isolated dependencies
- ✅ Easy to scale (multiple containers)
- ✅ Automatic restart on failure
- ✅ Version control for deployments
- ✅ Easy rollback (keep old images)

---

## 📝 Summary for Future Developers

**Main file to modify for deployment changes:** `Jenkinsfile`

**To deploy the application:**
1. Push code to GitHub
2. Jenkins webhook triggers automatically
3. Pipeline runs tests and builds Docker image
4. Application deploys in container
5. Health check verifies deployment

**No manual intervention required!**

**To check deployment status:**
- View Jenkins build console
- Check Docker containers: `docker ps`
- Test application: `http://localhost:3000/health`

---

## 🎯 Quick Reference

| **Action** | **File to Edit** |
|-----------|------------------|
| Change deployment port | `Jenkinsfile` (DOCKER_PORT, HOST_PORT) |
| Add environment variables | `Jenkinsfile` (docker run command) |
| Change Node version | `Dockerfile` (FROM line) |
| Modify application logic | `app.js`, `routes/`, `controllers/` |
| Add dependencies | `package.json` |
| Change Docker build | `Dockerfile` |
| Exclude files from image | `.dockerignore` |

---

## 📞 Support

**Check application logs:**
```bash
docker logs -f sample-test-api-container
```

**Check Jenkins build logs:**
- Go to Jenkins → Your Job → Build Number → Console Output

**Restart deployment:**
- Trigger new build in Jenkins
- Or push new commit to GitHub

---

**🎉 Happy Deploying!**
