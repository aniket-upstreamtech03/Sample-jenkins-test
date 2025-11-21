# 🚀 Quick Setup Guide - GitHub + Jenkins + Docker Automation

## Prerequisites  testtsttsttetstst

- ✅ Docker installed on Jenkins server
- ✅ Jenkins installed with plugins: Git, NodeJS, Pipeline
- ✅ GitHub repository connected to Jenkins
- ✅ NodeJS configured in Jenkins (Tools → NodeJS → named "node")

---

## 🔧 Step-by-Step Setup

### **1. Setup GitHub Webhook (Auto-trigger Jenkins on Push)**

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL:** `http://YOUR_JENKINS_SERVER_URL/github-webhook/`
   - **Content type:** `application/json`
   - **Which events:** Select "Just the push event"
   - **Active:** ✅ Check
4. Click **Add webhook**

✅ **Now Jenkins will automatically build when you push code!**

---

### **2. Create Jenkins Pipeline Job**

1. Open Jenkins Dashboard
2. Click **New Item**
3. Enter name: `sample-test-docker-deployment`
4. Select **Pipeline**
5. Click **OK**

---

### **3. Configure Jenkins Job**

#### **General Section:**
- ✅ Check **GitHub project**
- Project URL: `https://github.com/YOUR_USERNAME/YOUR_REPO/`

#### **Build Triggers:**
- ✅ Check **GitHub hook trigger for GITScm polling**

#### **Pipeline Section:**
- **Definition:** `Pipeline script from SCM`
- **SCM:** `Git`
- **Repository URL:** `https://github.com/YOUR_USERNAME/YOUR_REPO.git`
- **Credentials:** Add your GitHub credentials if private repo
- **Branch:** `*/main` or `*/wow-test` (your branch name)
- **Script Path:** `Jenkinsfile`

#### **Save the job**

---

### **4. Verify Docker on Jenkins Server**

Run these commands on your Jenkins server:

```bash
# Check Docker is installed
docker --version

# Check Docker is running
docker ps

# Test Docker permissions (Jenkins user should be able to run Docker)
docker run hello-world
```

If Jenkins user can't run Docker, add to docker group:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

### **5. Configure NodeJS in Jenkins**

1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Find **NodeJS** section
3. Click **Add NodeJS**
4. **Name:** `node` (must match Jenkinsfile)
5. **Version:** Select Node.js 18.x or later
6. Click **Save**

---

### **6. Test the Pipeline**

#### **Method 1: Manual Trigger**
1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the console output

#### **Method 2: Push to GitHub (Automatic)**
1. Make a small change in your code
2. Commit and push:
```bash
git add .
git commit -m "Test Docker deployment"
git push origin main
```
3. Jenkins should automatically start building!

---

## 📋 What Happens After Push?

```
Your Git Push 
    ↓
GitHub Webhook Notifies Jenkins
    ↓
Jenkins Pipeline Starts
    ↓
┌─────────────────────────────────┐
│ 1. Checkout code from GitHub    │
│ 2. Install npm dependencies     │
│ 3. Run tests (npm test)         │
│ 4. Build application            │
│ 5. Stop old Docker container    │
│ 6. Remove old Docker image      │
│ 7. Build new Docker image       │
│ 8. Deploy new container         │
│ 9. Health check                 │
└─────────────────────────────────┘
    ↓
✅ Application Running in Docker!
   http://localhost:3000
```

---

## 🐳 Verify Deployment

### **Check Container is Running:**
```bash
docker ps | findstr sample-test-api
```

### **Test Application:**
```bash
curl http://localhost:3000/health
```

### **View Logs:**
```bash
docker logs -f sample-test-api-container
```

---

## 🎯 File Structure Overview

```
Sample-jenkins-test/
│
├── Jenkinsfile              ⭐ MAIN - CI/CD Pipeline definition
├── Dockerfile               ⭐ MAIN - Docker image configuration
├── docker-compose.yml       ⭐ Alternative deployment method
├── .dockerignore           🔧 Excludes files from Docker build
├── DEPLOYMENT.md           📚 Detailed documentation
├── SETUP-GUIDE.md          📚 This file
│
├── app.js                  🚀 Main application entry
├── package.json            📦 Dependencies & scripts
│
├── routes/                 🛣️ API routes
├── controllers/            🎮 Business logic
├── models/                 📊 Data models
├── middleware/             🔒 Authentication, etc.
├── config/                 ⚙️ Configuration
└── tests/                  🧪 Test files
```

---

## 🔑 Key Files You'll Modify

| **File** | **Purpose** | **When to Edit** |
|----------|-------------|------------------|
| `Jenkinsfile` | Pipeline automation | Change ports, add stages, modify deployment |
| `Dockerfile` | Docker image config | Change Node version, add build steps |
| `app.js` | Application code | Add features, fix bugs |
| `package.json` | Dependencies | Add/remove npm packages |

---

## 🛠️ Common Modifications

### **Change Application Port:**

**1. Edit Jenkinsfile:**
```groovy
environment {
    DOCKER_PORT = "8080"      // Change from 3000
    HOST_PORT = "8080"        // Change from 3000
}
```

**2. Edit Dockerfile:**
```dockerfile
EXPOSE 8080  # Change from 3000
```

**3. Edit app.js:**
```javascript
const PORT = process.env.PORT || 8080;  // Change from 3000
```

### **Add Environment Variable:**

Edit Jenkinsfile, in "Deploy Docker Container" stage:
```groovy
docker run -d \
    --name ${DOCKER_CONTAINER_NAME} \
    -p ${HOST_PORT}:${DOCKER_PORT} \
    -e NODE_ENV=production \
    -e DATABASE_URL=your_database_url \
    -e API_KEY=your_api_key \
    --restart unless-stopped \
    ${DOCKER_IMAGE_NAME}:latest
```

---

## 🔍 Troubleshooting

### **Problem: Jenkins not triggering on push**
✅ **Solution:**
- Check webhook in GitHub (Settings → Webhooks)
- Verify URL is correct: `http://YOUR_JENKINS/github-webhook/`
- Check webhook delivery logs in GitHub
- Ensure "GitHub hook trigger" is enabled in Jenkins job

### **Problem: Docker command not found in Jenkins**
✅ **Solution:**
```bash
# On Jenkins server:
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### **Problem: Port 3000 already in use**
✅ **Solution:**
```bash
# Stop the container
docker stop sample-test-api-container

# Or kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### **Problem: Tests failing**
✅ **Solution:**
- Check test logs in Jenkins console output
- Run tests locally: `npm test`
- Fix failing tests before pushing

### **Problem: Container starts but immediately stops**
✅ **Solution:**
```bash
# Check container logs
docker logs sample-test-api-container

# Common issues:
# - Missing dependencies (check package.json)
# - App crashes on startup (check app.js)
# - Port already in use inside container
```

---

## 📊 Monitoring Commands

```bash
# View all containers
docker ps -a

# View container logs (live)
docker logs -f sample-test-api-container

# View container resource usage
docker stats sample-test-api-container

# Access container shell
docker exec -it sample-test-api-container sh

# Restart container
docker restart sample-test-api-container
```

---

## 🎉 Success Indicators

After pushing code, check these:

1. ✅ **GitHub** - Webhook delivery shows successful (200 response)
2. ✅ **Jenkins** - Build triggered automatically and shows SUCCESS
3. ✅ **Docker** - Container is running: `docker ps`
4. ✅ **Health Check** - Responds: `curl http://localhost:3000/health`
5. ✅ **Application** - Accessible: `curl http://localhost:3000/`

---

## 📞 Quick Reference

**Start over completely:**
```bash
# Remove container and image
docker stop sample-test-api-container
docker rm sample-test-api-container
docker rmi sample-test-api:latest

# Trigger new build in Jenkins
```

**Manual Docker deployment (without Jenkins):**
```bash
# Build image
docker build -t sample-test-api:latest .

# Run container
docker run -d --name sample-test-api-container -p 3000:3000 sample-test-api:latest
```

**Using docker-compose:**
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 🎯 Next Steps

1. ✅ Verify webhook is working (push test commit)
2. ✅ Monitor first automated build in Jenkins
3. ✅ Test application endpoints
4. ✅ Set up monitoring/logging (optional)
5. ✅ Configure production environment variables

---

## 📚 Additional Resources

- **Detailed Documentation:** See `DEPLOYMENT.md`
- **Jenkins Documentation:** https://www.jenkins.io/doc/
- **Docker Documentation:** https://docs.docker.com/
- **GitHub Webhooks:** https://docs.github.com/en/webhooks

---

**🎊 You're all set! Push code and watch the magic happen!**
