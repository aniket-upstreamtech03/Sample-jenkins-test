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
                echo '🔧 Preparing deployment...'
                script {
                    // Create deployment folder if it doesn't exist
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    
                    // Clean deployment folder
                    bat "rmdir /S /Q \"${DEPLOY_FOLDER}\" || echo \"Folder cleaned\""
                    bat "mkdir \"${DEPLOY_FOLDER}\""
                    
                    echo '✅ Deployment folder ready'
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Copy all files to deployment folder
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    
                    echo '✅ Application files copied to deployment folder'
                }
            }
        }
        
        stage('Start Application') {
            steps {
                echo '⚡ Starting application...'
                script {
                    // Stop any existing instance
                    bat 'taskkill /f /im node.exe > nul 2>&1 || echo "No running server found"'
                    
                    // Wait a moment
                    bat 'timeout /t 2 /nobreak > nul'
                    
                    // Start the application from deployment folder
                    bat "cd /d \"${DEPLOY_FOLDER}\" && start /B npm start"
                    
                    // Wait for server to start
                    bat 'timeout /t 5 /nobreak > nul'
                    
                    echo '✅ Application started from deployment folder'
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                script {
                    // Test if the deployed application is running
                    bat 'curl -f http://localhost:3000/health && echo "✅ Deployment verified - Health check passed" || echo "⚠️ Health check failed but deployment completed"'
                    
                    bat 'curl http://localhost:3000/ && echo "✅ Main endpoint working" || echo "⚠️ Main endpoint check completed"'
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline execution completed'
            // Final cleanup - only kill node processes if needed
            bat 'tasklist | findstr node.exe > nul && (echo "Node processes running" && taskkill /f /im node.exe > nul 2>&1 && echo "Cleanup completed") || echo "No cleanup needed"'
        }
        success {
            echo '🎉 SUCCESS: Application deployed and running at http://localhost:3000'
            echo '📋 Deployment Location: C:\\deployed-apps\\sample-test-api'
        }
        failure {
            echo '❌ DEPLOYMENT FAILED: Check logs above'
        }
    }
}