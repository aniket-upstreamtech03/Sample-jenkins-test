pipeline {
    agent any
    
    tools {
        nodejs "node"
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
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Stop any running instance
                    bat 'taskkill /f /im node.exe > nul 2>&1 || echo "Cleanup completed"'
                    
                    // Wait briefly
                    bat 'ping -n 3 127.0.0.1 > nul'
                    
                    // Deploy by starting the server directly
                    bat 'start "" /B node app.js'
                    
                    echo '✅ Application deployment started'
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 SUCCESS: Application deployed and should be running!'
            echo '🌐 Check: http://localhost:3000'
        }
    }
}