# 🎯 Quick Start - Where to Configure What

## 📍 Single Source of Truth: **Jenkinsfile**

**Location:** `Sample-jenkins-test/Jenkinsfile` (Lines 8-14)

```groovy
environment {
    DOCKER_IMAGE_NAME = "sample-test-api"              // Your app name
    DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"               // Auto-generated
    DOCKER_CONTAINER_NAME = "sample-test-api-container" // Container name
    DOCKER_PORT = "3000"                               // Port inside container
    HOST_PORT = "3000"                                 // Port on your machine
}
```

---

## 🔑 Do You Need Docker Tokens?

```
┌─────────────────────────────────────────────┐
│  LOCAL DEPLOYMENT (Your Setup)             │
│  ❌ NO TOKENS NEEDED                        │
│  ❌ NO CREDENTIALS NEEDED                   │
│  ❌ NO DOCKER HUB ACCOUNT NEEDED            │
│                                             │
│  ✅ Just install Docker                     │
│  ✅ Configure Jenkinsfile                   │
│  ✅ Push to GitHub                          │
│  ✅ Done!                                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  DOCKER HUB DEPLOYMENT (Advanced)          │
│  ✅ Docker Hub account needed               │
│  ✅ Access token needed                     │
│  ✅ Jenkins credentials needed              │
│                                             │
│  Use Case:                                  │
│  - Share images publicly                    │
│  - Deploy to multiple servers               │
│  - Use private registries                   │
└─────────────────────────────────────────────┘
```

---

## 📁 Configuration Files Overview

```
Sample-jenkins-test/
│
├── Jenkinsfile                    ⭐ MAIN CONFIG FILE
│   └── Lines 8-14                 ← Change Docker settings HERE
│       • DOCKER_IMAGE_NAME
│       • DOCKER_CONTAINER_NAME
│       • HOST_PORT
│
├── docker-compose.yml             🐳 Alternative deployment
│   └── Lines 8-11                 ← Can also change here
│       • container_name
│       • ports mapping
│
├── Dockerfile                     📦 Image configuration
│   └── Line 15                    ← Usually no change needed
│       • EXPOSE 3000
│
└── DOCKER-CONFIG-GUIDE.md         📚 This detailed guide
```

---

## 🎨 What Each Setting Does

### **1. DOCKER_IMAGE_NAME**
```
Current: "sample-test-api"
What it is: Name of your Docker image (like a class name)
Change it? Optional - use your app name
Example: "my-api", "user-service", "backend-api"
```

### **2. DOCKER_CONTAINER_NAME**
```
Current: "sample-test-api-container"
What it is: Name of running container (like a variable name)
Change it? Optional - keep it descriptive
Example: "my-api-container", "backend-container"
```

### **3. DOCKER_PORT**
```
Current: "3000"
What it is: Port your app listens on INSIDE container
Change it? Only if your app uses different port
Example: If app.js uses port 8080, change to "8080"
```

### **4. HOST_PORT**
```
Current: "3000"
What it is: Port to access app on YOUR machine
Change it? If port 3000 is already used on your machine
Example: "8080" → access via localhost:8080
```

### **5. DOCKER_IMAGE_TAG**
```
Current: "${BUILD_NUMBER}"
What it is: Version number (auto-increments: 1, 2, 3...)
Change it? NO - automatically managed by Jenkins
```

---

## 🚀 Common Scenarios

### **Scenario 1: Everything Works - Don't Change Anything! ✅**
```groovy
DOCKER_IMAGE_NAME = "sample-test-api"
DOCKER_CONTAINER_NAME = "sample-test-api-container"
HOST_PORT = "3000"
```
Access: `http://localhost:3000`

---

### **Scenario 2: Port 3000 Already in Use ⚠️**

**Problem:** Another app is using port 3000

**Solution:** Change only HOST_PORT
```groovy
DOCKER_IMAGE_NAME = "sample-test-api"
DOCKER_CONTAINER_NAME = "sample-test-api-container"
DOCKER_PORT = "3000"    // Keep this
HOST_PORT = "8080"      // Change this
```
Access: `http://localhost:8080`

---

### **Scenario 3: Want Different App Name 📝**

**Reason:** Multiple projects, better organization

**Solution:** Change image and container names
```groovy
DOCKER_IMAGE_NAME = "user-management-api"
DOCKER_CONTAINER_NAME = "user-management-container"
HOST_PORT = "3000"
```
Access: `http://localhost:3000`

---

### **Scenario 4: Running Multiple Apps 🔀**

**Reason:** Need to run multiple APIs simultaneously

**Solution:** Different names and ports for each
```groovy
// App 1
DOCKER_IMAGE_NAME = "sample-test-api"
DOCKER_CONTAINER_NAME = "sample-test-api-container"
HOST_PORT = "3000"

// App 2 (in different Jenkinsfile)
DOCKER_IMAGE_NAME = "another-api"
DOCKER_CONTAINER_NAME = "another-api-container"
HOST_PORT = "3001"
```
Access: 
- App 1: `http://localhost:3000`
- App 2: `http://localhost:3001`

---

## 🔍 How to Check Your Configuration

### **Step 1: Check Running Containers**
```bash
docker ps
```
**Look for:**
- `IMAGE`: Should match your `DOCKER_IMAGE_NAME`
- `NAMES`: Should match your `DOCKER_CONTAINER_NAME`
- `PORTS`: Should show `0.0.0.0:3000->3000/tcp` (or your port)

### **Step 2: Test Your App**
```bash
curl http://localhost:3000/health
```
**Should return:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "version": "1.0.0"
}
```

### **Step 3: View Logs**
```bash
docker logs sample-test-api-container
```
**Should show:**
```
🚀 Server running on port 3000
📊 Health check: http://localhost:3000/health
```

---

## 🛠️ Step-by-Step: Change Port Example

### **Goal:** Change from port 3000 to 8080

#### **Step 1: Edit Jenkinsfile**
Open: `Sample-jenkins-test/Jenkinsfile`

**Change line 14:**
```groovy
// Before
HOST_PORT = "3000"

// After
HOST_PORT = "8080"
```

#### **Step 2: Edit docker-compose.yml (Optional)**
Open: `Sample-jenkins-test/docker-compose.yml`

**Change line 10:**
```yaml
# Before
ports:
  - "3000:3000"

# After
ports:
  - "8080:3000"
```

#### **Step 3: Commit and Push**
```bash
git add Jenkinsfile docker-compose.yml
git commit -m "Change port to 8080"
git push origin main
```

#### **Step 4: Jenkins Deploys Automatically**
- Webhook triggers Jenkins
- Jenkins builds and deploys with new port

#### **Step 5: Access New URL**
```bash
curl http://localhost:8080/health
```

**Done! ✅**

---

## 📊 Configuration Priority

```
1. Jenkinsfile (Lines 8-14)       ← HIGHEST PRIORITY
   Used by Jenkins automation     ⭐ Change here for CI/CD

2. docker-compose.yml              ← MEDIUM PRIORITY
   Used for manual deployment     🐳 Change here for local testing

3. Dockerfile                      ← LOWEST PRIORITY
   Used to build image            📦 Rarely needs changes
```

**Recommendation:** Change **Jenkinsfile** for automated deployment

---

## ✅ Checklist for New Developers

### **Before Starting:**
- [ ] Docker installed: `docker --version`
- [ ] Jenkins installed and configured
- [ ] GitHub repository connected to Jenkins
- [ ] Webhook configured in GitHub

### **Configuration:**
- [ ] Review Jenkinsfile lines 8-14
- [ ] Check if port 3000 is available: `netstat -ano | findstr :3000`
- [ ] If port 3000 used, change `HOST_PORT` in Jenkinsfile
- [ ] Keep default names or choose descriptive names

### **No Need To:**
- [ ] ❌ Create Docker Hub account (for local deployment)
- [ ] ❌ Generate access tokens
- [ ] ❌ Add credentials to Jenkins
- [ ] ❌ Modify Dockerfile (usually)

### **After Push:**
- [ ] Check Jenkins build status
- [ ] Verify container running: `docker ps`
- [ ] Test app: `curl http://localhost:3000/health`
- [ ] View logs: `docker logs sample-test-api-container`

---

## 🎓 Understanding Port Mapping

### **Visual Explanation:**

```
┌─────────────────────────────────────────────┐
│  Your Computer (Windows)                    │
│                                             │
│  Browser/Postman → localhost:3000           │ ← HOST_PORT
│                         │                   │
│                         ↓                   │
│  ┌─────────────────────────────────────┐   │
│  │  Docker Container                   │   │
│  │                                     │   │
│  │  Your App listening on port 3000 ← │   │ ← DOCKER_PORT
│  │  (Node.js Express Server)          │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### **Port Mapping Examples:**

```yaml
ports:
  - "3000:3000"
    ↓      ↓
  HOST  CONTAINER
```

**Meaning:** Access `localhost:3000` → forwards to → container port `3000`

```yaml
ports:
  - "8080:3000"
    ↓      ↓
  HOST  CONTAINER
```

**Meaning:** Access `localhost:8080` → forwards to → container port `3000`

---

## 🚨 Common Mistakes to Avoid

### **❌ Mistake 1: Changing DOCKER_PORT unnecessarily**
```groovy
DOCKER_PORT = "8080"  // ❌ Wrong if app listens on 3000
```
**Fix:** Keep `DOCKER_PORT = "3000"` unless app.js changed

### **❌ Mistake 2: Using Docker Hub username without setup**
```groovy
DOCKER_IMAGE_NAME = "username/sample-test-api"  // ❌ Needs Docker Hub
```
**Fix:** Use simple name: `DOCKER_IMAGE_NAME = "sample-test-api"`

### **❌ Mistake 3: Forgetting to change docker-compose.yml**
If you change ports in Jenkinsfile, also update docker-compose.yml for consistency

### **❌ Mistake 4: Using spaces in names**
```groovy
DOCKER_IMAGE_NAME = "sample test api"  // ❌ Spaces not allowed
```
**Fix:** Use dashes: `"sample-test-api"`

---

## 📞 Quick Help

### **I want to change the port**
→ Edit `HOST_PORT` in Jenkinsfile line 14

### **I want to rename the app**
→ Edit `DOCKER_IMAGE_NAME` in Jenkinsfile line 10

### **I want to run multiple apps**
→ Use different `HOST_PORT` and names for each

### **I want to use Docker Hub**
→ See DOCKER-CONFIG-GUIDE.md "Docker Hub Configuration" section

### **I want to add environment variables**
→ Edit docker-compose.yml or Jenkinsfile deploy stage

### **Port 3000 is already in use**
→ Either kill the process or change `HOST_PORT` to 8080

---

## 🎉 Summary

**For 99% of use cases:**
1. ✅ Keep default configuration
2. ✅ No tokens needed
3. ✅ No Docker Hub account needed
4. ✅ Just push code to GitHub
5. ✅ Jenkins handles everything automatically

**Only change if:**
- Port 3000 is taken → Change `HOST_PORT`
- Want different name → Change `DOCKER_IMAGE_NAME`

**That's it! 🚀**

---

## 📚 Related Documentation

- **DOCKER-CONFIG-GUIDE.md** - Detailed Docker configuration
- **SETUP-GUIDE.md** - Initial setup instructions
- **DEPLOYMENT.md** - Complete deployment documentation

---

**Need Help?** Review the detailed guides or check Jenkins console output for errors.
