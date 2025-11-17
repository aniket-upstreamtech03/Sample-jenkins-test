pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    environment {
        DEPLOY_FOLDER = 'C:\\deployed-apps\\sample-test-api'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install & Test') {
            steps {
                bat 'npm install'
                bat 'npm test'
            }
        }
        
        stage('Build & Deploy') {
            steps {
                echo '🚀 Building and deploying...'
                script {
                    // Deploy files
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    
                    // Clean up any existing server
                    bat 'taskkill /f /im node.exe > nul 2>&1 || echo "Cleanup completed"'
                    
                    // Try to start server (but don't fail if it doesn't work)
                    bat "cd \"${DEPLOY_FOLDER}\" && start node app.js || echo \"Server start attempted\""
                    
                    echo '✅ Deployment completed'
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 SUCCESS: Application deployed successfully!'
            echo '📍 Location: C:\\deployed-apps\\sample-test-api'
            echo '🚀 Start server: Double-click start-server.bat (in the folder)'
            echo '🌐 Then visit: http://localhost:3000'
            echo '💡 Server auto-start was attempted - check if running'
        }
    }
}