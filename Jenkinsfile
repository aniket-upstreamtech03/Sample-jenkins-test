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
        
        stage('Deploy Files') {
            steps {
                echo '📦 Copying files to deployment folder...'
                bat 'if not exist "C:\\deployed-apps\\sample-test-api" mkdir "C:\\deployed-apps\\sample-test-api"'
                bat 'xcopy . "C:\\deployed-apps\\sample-test-api" /Y /E /I'
                echo '✅ Files copied successfully'
            }
        }
        
        stage('Create Start Script') {
            steps {
                echo '📜 Creating start script...'
                bat '''
                echo @echo off > "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo cd "C:\\deployed-apps\\sample-test-api" >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo node app.js >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo pause >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                '''
                echo '✅ Start script created'
            }
        }
    }
    
    post {
        success {
            echo '🎉 SUCCESS: Pipeline completed!'
            echo ' '
            echo '📋 NEXT STEPS:'
            echo '1. Go to: C:\\deployed-apps\\sample-test-api'
            echo '2. Double-click: start.bat'
            echo '3. Open: http://localhost:3000'
            echo ' '
            echo '💡 Server will start in a new window'
        }
    }
}
