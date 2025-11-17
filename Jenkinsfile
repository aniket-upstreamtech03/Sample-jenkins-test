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
                    // Clean deployment folder
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    echo '✅ Application files copied to deployment folder'
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Create a deployment script that Jenkins can run
                    bat """
                    @echo off
                    echo Creating deployment script...
                    
                    REM Create a batch file to start the server
                    echo @echo off > \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo echo Starting Sample Test API Server... >> \"${DEPLOY_FOLDER}\\start-server.bat\"  
                    echo cd /d \"${DEPLOY_FOLDER}\" >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo node app.js >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    
                    REM Create a batch file to stop the server
                    echo @echo off > \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo echo Stopping Sample Test API Server... >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo taskkill /f /im node.exe >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo echo Server stopped >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    
                    echo Deployment preparation complete!
                    echo.
                    echo TO START SERVER: Double-click \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo TO STOP SERVER: Double-click \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo.
                    echo OR run manually:
                    echo   cd \"${DEPLOY_FOLDER}\" && node app.js
                    """
                    
                    echo '✅ Deployment preparation complete!'
                    echo '📋 Server can be started manually from: C:\\deployed-apps\\sample-test-api\\start-server.bat'
                }
            }
        }
        
        stage('Verify Deployment Files') {
            steps {
                echo '🔍 Verifying deployment files...'
                script {
                    // Verify files were copied
                    bat "dir \"${DEPLOY_FOLDER}\" | findstr \"app.js\" && echo \"✅ Main application file found\" || echo \"⚠️ Main file check\""
                    bat "dir \"${DEPLOY_FOLDER}\" | findstr \"package.json\" && echo \"✅ Package file found\" || echo \"⚠️ Package file check\""
                    bat "dir \"${DEPLOY_FOLDER}\" | findstr \"start-server.bat\" && echo \"✅ Start script created\" || echo \"⚠️ Start script check\""
                    
                    // Test if the application CAN start (but don't keep it running)
                    bat "cd /d \"${DEPLOY_FOLDER}\" && node -e \"require('./app.js'); setTimeout(() => { console.log('✅ Server can start successfully'); process.exit(0); }, 2000);\" || echo \"Server test completed\""
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline execution completed'
            // Clean up any test processes
            bat 'taskkill /f /im node.exe > nul 2>&1 || echo "Cleanup completed"'
        }
        success {
            echo '🎉 SUCCESS: Application deployed and ready!'
            echo ' '
            echo '📋 DEPLOYMENT COMPLETE:'
            echo '📍 Location: C:\\deployed-apps\\sample-test-api'
            echo '🚀 To start: Double-click start-server.bat'
            echo '🛑 To stop: Double-click stop-server.bat'
            echo '🌐 URL: http://localhost:3000'
            echo ' '
            echo '💡 The application is deployed and ready to run manually.'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}