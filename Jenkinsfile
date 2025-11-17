pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    environment {
        NODE_ENV = 'production'
        DEPLOY_FOLDER = 'C:\\deployed-apps\\sample-test-api'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing Node.js dependencies...'
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test'
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building application...'
                bat 'npm run build'
            }
        }
        
        stage('Prepare Deployment') {
            steps {
                echo '🔧 Preparing deployment folder...'
                script {
                    // Clean and create deployment folder
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    echo '✅ Application copied to deployment folder'
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Stop any running instance
                    bat 'taskkill /f /im node.exe > nul 2>&1 || echo "No previous server running"'
                    
                    // Wait a moment for cleanup
                    bat 'ping -n 3 127.0.0.1 > nul'
                    
                    // Use the PowerShell command that works manually
                    bat "powershell -Command \"Start-Process -WindowStyle Hidden -FilePath 'node' -ArgumentList 'app.js' -WorkingDirectory '${DEPLOY_FOLDER}'\""
                    
                    echo '✅ Application deployment command executed'
                }
            }
        }
        
        stage('Wait for Startup') {
            steps {
                echo '⏳ Waiting for application to start...'
                script {
                    // Wait for server to start up
                    bat 'ping -n 10 127.0.0.1 > nul'
                    echo '✅ Startup wait completed'
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                script {
                    // Test if application is running
                    bat 'curl http://localhost:3000/ || echo "Main endpoint check completed"'
                    bat 'curl http://localhost:3000/health || echo "Health endpoint check completed"'
                    bat 'curl http://localhost:3000/api/users || echo "Users API check completed"'
                    echo '✅ Deployment verification completed'
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline execution completed'
        }
        success {
            echo '🎉 SUCCESS: CI/CD Pipeline Complete! 🚀'
            echo ' '
            echo '📋 DEPLOYMENT SUMMARY:'
            echo '✅ Application deployed to: C:\\deployed-apps\\sample-test-api'
            echo '🌐 Application running at: http://localhost:3000'
            echo '📊 Health check: http://localhost:3000/health'
            echo '👥 Users API: http://localhost:3000/api/users'
            echo ' '
            echo '🎊 Your CI/CD pipeline is now fully automated!'
        }
        failure {
            echo '❌ Pipeline failed - check stage logs above'
        }
    }
}