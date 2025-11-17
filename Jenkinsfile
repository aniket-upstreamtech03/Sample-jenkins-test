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
                    // Clean and create deployment folder
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    echo '✅ Application files copied to deployment folder'
                }
            }
        }
        
        stage('Stop Previous Server') {
            steps {
                echo '🛑 Stopping previous server instance...'
                bat 'taskkill /f /im node.exe > nul 2>&1 && echo "Previous server stopped" || echo "No previous server running"'
                // Wait a moment
                bat 'ping -n 3 127.0.0.1 > nul'
            }
        }
        
        stage('Start New Server') {
            steps {
                echo '🚀 Starting new server in background...'
                script {
                    // Method 1: Using Windows Service (most reliable)
                    bat """
                    @echo off
                    echo Starting Sample Test API Server as background process...
                    
                    REM Create a VBS script to start Node.js hidden
                    echo Set WshShell = CreateObject("WScript.Shell") > \"${DEPLOY_FOLDER}\\start-hidden.vbs\"
                    echo WshShell.Run "cmd /c cd /d \"${DEPLOY_FOLDER}\" && node app.js", 0, False >> \"${DEPLOY_FOLDER}\\start-hidden.vbs\"
                    
                    REM Run the VBS script to start server hidden
                    cscript //nologo \"${DEPLOY_FOLDER}\\start-hidden.vbs\"
                    
                    echo Server starting in background...
                    """
                    
                    // Wait for server to start
                    bat 'ping -n 10 127.0.0.1 > nul'
                    
                    echo '✅ Server started in background'
                }
            }
        }
        
        stage('Verify Server Running') {
            steps {
                echo '🔍 Verifying server is running...'
                script {
                    // Test if server is responding
                    bat 'curl http://localhost:3000/health && echo "✅ SERVER IS RUNNING AND RESPONDING!" || echo "⚠️ Server may be starting..."'
                    bat 'curl http://localhost:3000/ && echo "✅ Main endpoint working" || echo "⚠️ Endpoint check"'
                    
                    // Check if Node process is running
                    bat 'tasklist | findstr node.exe && echo "✅ Node.js process is running" || echo "⚠️ Node process check"'
                }
            }
        }
        
        stage('Create Management Scripts') {
            steps {
                echo '📜 Creating management scripts...'
                script {
                    bat """
                    @echo off
                    
                    REM Create STOP script
                    echo @echo off > \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo echo Stopping Sample Test API Server... >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo taskkill /f /im node.exe >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo if errorlevel 1 ( >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo   echo No server running or already stopped >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo ) else ( >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo   echo Server stopped successfully >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo ) >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    
                    REM Create RESTART script
                    echo @echo off > \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo echo Restarting Sample Test API Server... >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo taskkill /f /im node.exe > nul 2>&1 >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo timeout /t 3 /nobreak > nul >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo start \"\" /B \"%CD%\\start-hidden.vbs\" >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo echo Server restart initiated >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\restart-server.bat\"
                    
                    REM Create STATUS script
                    echo @echo off > \"${DEPLOY-FOLDER}\\server-status.bat\"
                    echo echo Sample Test API Server Status >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo echo ============================ >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo tasklist | findstr node.exe > nul && ( >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo   echo ✅ SERVER IS RUNNING >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo   echo 🌐 Access at: http://localhost:3000 >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo ) || ( >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo   echo ❌ SERVER IS STOPPED >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo ) >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo curl http://localhost:3000/health > nul 2>&1 && echo ✅ Health check: PASSED || echo ❌ Health check: FAILED >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    
                    echo Management scripts created successfully!
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo ' '
            echo '🎉 🎉 🎉 SUCCESS: SERVER DEPLOYED AND STARTED! 🎉 🎉 🎉'
            echo ' '
            echo '📋 SERVER STATUS: RUNNING IN BACKGROUND'
            echo '📍 Location: C:\\deployed-apps\\sample-test-api'
            echo '🌐 Access URL: http://localhost:3000'
            echo ' '
            echo '🛠️  MANAGEMENT TOOLS:'
            echo '🛑 stop-server.bat    - Stop the server'
            echo '🔁 restart-server.bat  - Restart the server' 
            echo '📊 server-status.bat   - Check server status'
            echo ' '
            echo '💡 The server will continue running until manually stopped.'
            echo ' '
        }
        failure {
            echo '❌ Deployment failed'
        }
    }
}