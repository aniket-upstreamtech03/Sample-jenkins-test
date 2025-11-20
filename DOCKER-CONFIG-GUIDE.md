# 🐳 Docker Configuration Guide for Beginners

## ❓ Do You Need Docker Tokens?

### **For Local Deployment: NO!** ❌
You **don't need any tokens** if you're:
- Running Docker locally on your machine
- Deploying to the same machine where Jenkins runs
- Building and running containers locally

### **For Docker Hub (Online Registry): YES** ✅
You **need Docker Hub credentials** only if you want to:
- Push images to Docker Hub (public registry)
- Pull private images from Docker Hub
- Share images across different machines

---

## 📍 Where to Configure Docker Settings

### **1. Jenkinsfile - Main Configuration** ⭐ **MOST IMPORTANT**

**Location:** `Sample-jenkins-test/Jenkinsfile`

**Lines 8-14** contain all Docker settings:

```groovy
environment {
    // Docker configuration
    DOCKER_IMAGE_NAME = "sample-test-api"           // ← Change this to your app name
    DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"            // ← Auto-increments with each build
    DOCKER_CONTAINER_NAME = "sample-test-api-container"  // ← Change container name
    DOCKER_PORT = "3000"                            // ← Port inside container
    HOST_PORT = "3000"                              // ← Port on your machine
}
```

#### **What Each Variable Means:**

| Variable | Current Value | What It Does | Should You Change? |
|----------|---------------|--------------|-------------------|
| `DOCKER_IMAGE_NAME` | `sample-test-api` | Name of your Docker image | ✅ Optional - use your app name |
| `DOCKER_IMAGE_TAG` | `${BUILD_NUMBER}` | Version/tag of image | ❌ No - auto-generated |
| `DOCKER_CONTAINER_NAME` | `sample-test-api-container` | Running container name | ✅ Optional - keep it descriptive |
| `DOCKER_PORT` | `3000` | Port app listens on inside container | ✅ Only if app uses different port |
| `HOST_PORT` | `3000` | Port to access app on your machine | ✅ Change if 3000 is already used |

#### **Example: Change Port to 8080**

If port 3000 is already in use, change to 8080:

```groovy
environment {
    DOCKER_IMAGE_NAME = "sample-test-api"
    DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
    DOCKER_CONTAINER_NAME = "sample-test-api-container"
    DOCKER_PORT = "3000"     // Keep this - app still runs on 3000 inside container
    HOST_PORT = "8080"       // Change this - access via localhost:8080
}
```

Then access your app at: `http://localhost:8080`

---

### **2. docker-compose.yml - Alternative Deployment**

**Location:** `Sample-jenkins-test/docker-compose.yml`

```yaml
services:
  app:
    image: sample-test-api:latest              # ← Image name
    container_name: sample-test-api-container  # ← Container name
    ports:
      - "3000:3000"                            # ← HOST_PORT:CONTAINER_PORT
    environment:
      - NODE_ENV=production                    # ← Environment variables
      - PORT=3000
```

#### **To Change Ports:**

```yaml
ports:
  - "8080:3000"  # Access via localhost:8080, app runs on 3000 inside
```

---

### **3. Dockerfile - Image Configuration**

**Location:** `Sample-jenkins-test/Dockerfile`

```dockerfile
FROM node:18-alpine    # ← Node.js version
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000           # ← Document which port app uses
CMD ["npm", "start"]
```

**Usually you DON'T need to change this file** unless:
- Changing Node.js version: `FROM node:20-alpine`
- App uses different port: `EXPOSE 8080`
- Need custom build steps

---

## 🔐 Docker Hub Configuration (Optional - Advanced)

### **When Do You Need This?**

Only if you want to:
1. Push images to Docker Hub (share with others)
2. Deploy to different servers
3. Use private Docker images

### **How to Set Up Docker Hub:**

#### **Step 1: Create Docker Hub Account**
- Go to https://hub.docker.com/
- Sign up for free account
- Create an access token (not your password!)

#### **Step 2: Add Credentials to Jenkins**

1. Go to Jenkins Dashboard
2. **Manage Jenkins** → **Manage Credentials**
3. Click **(global)** domain
4. **Add Credentials**
5. Configure:
   - **Kind:** Username with password
   - **Username:** Your Docker Hub username
   - **Password:** Your Docker Hub access token (NOT password)
   - **ID:** `docker-hub-credentials`
   - **Description:** Docker Hub Login

#### **Step 3: Modify Jenkinsfile to Push to Docker Hub**

Add after "Build Docker Image" stage:

```groovy
stage('Push to Docker Hub') {
    steps {
        echo '📤 Pushing image to Docker Hub...'
        script {
            docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                bat """
                docker tag ${DOCKER_IMAGE_NAME}:latest YOUR_DOCKERHUB_USERNAME/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                docker push YOUR_DOCKERHUB_USERNAME/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                docker push YOUR_DOCKERHUB_USERNAME/${DOCKER_IMAGE_NAME}:latest
                """
            }
        }
    }
}
```

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username.

---

## 🎯 Quick Configuration Checklist

### **For Basic Local Deployment (No Tokens Needed):**

- [x] **Jenkinsfile** - Configure image/container names and ports
- [x] **Dockerfile** - Already configured (no changes needed)
- [x] **docker-compose.yml** - Already configured (optional to use)
- [ ] Docker Hub credentials - **NOT NEEDED for local deployment**

### **For Docker Hub Push (Advanced):**

- [ ] Create Docker Hub account
- [ ] Create access token in Docker Hub
- [ ] Add credentials to Jenkins
- [ ] Modify Jenkinsfile to push images
- [ ] Update DOCKER_IMAGE_NAME to include username

---

## 🛠️ Common Configuration Scenarios

### **Scenario 1: Default Setup (No Changes)**
```
✅ Just use as-is!
- Image: sample-test-api:latest
- Container: sample-test-api-container
- Access: http://localhost:3000
```

### **Scenario 2: Port 3000 Already in Use**

**Change in Jenkinsfile:**
```groovy
HOST_PORT = "8080"  // Change from 3000
```

**Change in docker-compose.yml:**
```yaml
ports:
  - "8080:3000"
```

**Access:** `http://localhost:8080`

### **Scenario 3: Different App Name**

**Change in Jenkinsfile:**
```groovy
DOCKER_IMAGE_NAME = "my-awesome-api"
DOCKER_CONTAINER_NAME = "my-awesome-api-container"
```

### **Scenario 4: Multiple Environments**

**For staging:**
```groovy
DOCKER_IMAGE_NAME = "sample-test-api-staging"
DOCKER_CONTAINER_NAME = "sample-test-api-staging"
HOST_PORT = "3001"
```

**For production:**
```groovy
DOCKER_IMAGE_NAME = "sample-test-api-production"
DOCKER_CONTAINER_NAME = "sample-test-api-production"
HOST_PORT = "3000"
```

---

## 🔍 How to Check Your Current Configuration

### **1. Check What's Running:**
```bash
docker ps
```

Output shows:
- `CONTAINER ID` - Unique container ID
- `IMAGE` - Which image is running (e.g., sample-test-api:latest)
- `NAMES` - Container name (e.g., sample-test-api-container)
- `PORTS` - Port mapping (e.g., 0.0.0.0:3000->3000/tcp)

### **2. Check Images:**
```bash
docker images
```

Shows all Docker images with:
- `REPOSITORY` - Image name (e.g., sample-test-api)
- `TAG` - Version (e.g., latest, 1, 2, 3)
- `SIZE` - Image size

### **3. View Container Details:**
```bash
docker inspect sample-test-api-container
```

Shows complete configuration including:
- Port mappings
- Environment variables
- Network settings
- Volume mounts

---

## 📝 Environment Variables in Docker

### **Currently Set (in docker-compose.yml):**

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
```

### **To Add More Variables:**

**Option 1: In docker-compose.yml:**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DATABASE_URL=your_database_url
  - API_KEY=your_api_key
  - DEBUG=true
```

**Option 2: In Jenkinsfile (Deploy stage):**
```groovy
docker run -d \
    --name ${DOCKER_CONTAINER_NAME} \
    -p ${HOST_PORT}:${DOCKER_PORT} \
    -e NODE_ENV=production \
    -e DATABASE_URL=your_db_url \
    -e API_KEY=your_key \
    --restart unless-stopped \
    ${DOCKER_IMAGE_NAME}:latest
```

**Option 3: Using .env file:**

Create `.env` file:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://localhost:27017
API_KEY=your_secret_key
```

Update docker-compose.yml:
```yaml
services:
  app:
    env_file:
      - .env
```

---

## 🎓 Docker Basics for Your Project

### **What's Happening Behind the Scenes:**

1. **Build Stage** - Jenkins creates a Docker image:
   ```
   Docker reads Dockerfile → Installs Node.js → Copies your code → Creates image
   ```

2. **Deploy Stage** - Jenkins runs a container:
   ```
   Takes image → Creates running container → Maps ports → Starts your app
   ```

### **Image vs Container:**

| Concept | Analogy | In Your Project |
|---------|---------|-----------------|
| **Image** | Blueprint/Recipe | `sample-test-api:latest` - Contains your code + Node.js |
| **Container** | Running instance | `sample-test-api-container` - Your app actually running |

**Think of it like:**
- **Image** = Class definition (code)
- **Container** = Object instance (running process)

### **Port Mapping:**

```
HOST_PORT:DOCKER_PORT
   ↓          ↓
  3000  →   3000

Your Machine:3000 → forwards to → Container:3000
```

**Example:** `HOST_PORT=8080, DOCKER_PORT=3000`
```
localhost:8080 → Container:3000 (app listening here)
```

---

## ✅ Recommended Configuration for Beginners

### **Keep It Simple - Use Defaults:**

1. **Don't change anything** in Jenkinsfile unless port 3000 is used
2. **Don't worry about Docker Hub** - not needed for local deployment
3. **No tokens required** for basic setup
4. Just push code to GitHub and let Jenkins handle everything!

### **Only Change If:**

- ❗ Port 3000 is already in use → Change `HOST_PORT`
- ❗ Want different app name → Change `DOCKER_IMAGE_NAME`
- ❗ Need to share images → Set up Docker Hub (advanced)

---

## 🆘 Troubleshooting Configuration Issues

### **Error: Port 3000 already in use**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill that process
taskkill /F /PID <PID>

# OR change port in Jenkinsfile
HOST_PORT = "8080"
```

### **Error: Container name already in use**
```bash
# Remove old container
docker stop sample-test-api-container
docker rm sample-test-api-container
```

### **Error: Image not found**
```bash
# Check image name in Jenkinsfile matches
docker images sample-test-api
```

---

## 🎯 Summary - What You Need to Know

### **For Your Current Setup:**

✅ **NO Docker Hub tokens needed**
✅ **NO credentials required**
✅ **NO complex configuration**

### **Just Configure These (if needed):**

1. **Image Name:** `DOCKER_IMAGE_NAME` in Jenkinsfile
2. **Container Name:** `DOCKER_CONTAINER_NAME` in Jenkinsfile
3. **Ports:** `HOST_PORT` in Jenkinsfile (if 3000 is taken)

### **Everything Else is Already Set Up!**

---

## 📞 Quick Reference

**File to edit:** `Jenkinsfile` (lines 8-14)

**Default values work fine:**
```groovy
DOCKER_IMAGE_NAME = "sample-test-api"
DOCKER_CONTAINER_NAME = "sample-test-api-container"
HOST_PORT = "3000"
```

**Check deployment:**
```bash
docker ps                              # See running containers
curl http://localhost:3000/health      # Test your app
docker logs sample-test-api-container  # View logs
```

---

**🎉 You're Ready! No tokens needed for local deployment!**
