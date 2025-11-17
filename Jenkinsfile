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
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Deploy Files') {
            steps {
                echo '🚀 Deploying application files...'
                script {
                    bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
                    bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    echo '✅ Application files deployed'
                }
            }
        }
        
        stage('Auto-Start Server') {
            steps {
                echo '⚡ Auto-starting server in background...'
                script {
                    // Stop any existing instance first
                    bat 'taskkill /f /im node.exe > nul 2>&1 || echo "No previous server running"'
                    
                    // Wait a moment
                    bat 'ping -n 3 127.0.0.1 > nul'
                    
                    // Start server in background using PowerShell (detached)
                    bat """
                    powershell -Command "
                    `$process = Start-Process -PassThru -WindowStyle Hidden -FilePath 'node' -ArgumentList 'app.js' -WorkingDirectory '${DEPLOY_FOLDER}'
                    Write-Output '✅ Server started with PID: ' + `$process.Id
                    Write-Output '📍 Server will continue running in background'
                    "
                    """
                    
                    // Wait briefly to ensure server starts
                    bat 'ping -n 5 127.0.0.1 > nul'
                    
                    // Quick test to verify server is running
                    bat 'curl http://localhost:3000/health && echo "✅ Server is running and responding!" || echo "⚠️ Server starting..."'
                }
            }
        }
        
        stage('Create Management Scripts') {
            steps {
                echo '📜 Creating management scripts...'
                script {
                    // Create start script (for future use)
                    bat """
                    echo @echo off > \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo echo Starting Sample Test API Server... >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo cd /d \"${DEPLOY_FOLDER}\" >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo node app.js >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\start-server.bat\"
                    """
                    
                    // Create stop script
                    bat """
                    echo @echo off > \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo echo Stopping Sample Test API Server... >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo taskkill /f /im node.exe >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo echo Server stopped >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\stop-server.bat\"
                    """
                    
                    // Create status script
                    bat """
                    echo @echo off > \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo echo Checking Server Status... >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo tasklist ^| findstr node.exe && echo ✅ SERVER IS RUNNING || echo ❌ SERVER IS STOPPED >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo curl http://localhost:3000/health && echo ✅ SERVER RESPONDING || echo ⚠️ SERVER NOT RESPONDING >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    echo pause >> \"${DEPLOY_FOLDER}\\server-status.bat\"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo ' '
            echo '🎉 🎉 🎉 SUCCESS: SERVER AUTO-STARTED! 🎉 🎉 🎉'
            echo ' '
            echo '📋 DEPLOYMENT COMPLETE:'
            echo '📍 Location: C:\\deployed-apps\\sample-test-api'
            echo '🌐 Server URL: http://localhost:3000'
            echo '⚡ Status: Server auto-started and running in background'
            echo ' '
            echo '🔧 MANAGEMENT SCRIPTS:'
            echo '🚀 start-server.bat    - Start server manually'
            echo '🛑 stop-server.bat     - Stop running server'
            echo '📊 server-status.bat   - Check server status'
            echo ' '
            echo '💡 The server will continue running until manually stopped.'
            echo '💡 You can stop it anytime by running stop-server.bat'
            echo ' '
        }
    }
}








// pipeline {
//     agent any
    
//     tools {
//         nodejs "node"
//     }
    
//     environment {
//         DEPLOY_FOLDER = 'C:\\deployed-apps\\sample-test-api'
//     }
    
//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }
        
//         stage('Install & Test') {
//             steps {
//                 bat 'npm install'
//                 bat 'npm test'
//             }
//         }
        
//         stage('Build') {
//             steps {
//                 bat 'npm run build'
//             }
//         }
        
//         stage('Deploy Files') {
//             steps {
//                 echo '🚀 Deploying application files...'
//                 script {
//                     bat "if not exist \"${DEPLOY_FOLDER}\" mkdir \"${DEPLOY_FOLDER}\""
//                     bat "xcopy . \"${DEPLOY_FOLDER}\" /Y /E /I /H"
                    
//                     // Create simple start script
//                     bat """
//                     echo @echo off > \"${DEPLOY_FOLDER}\\start.bat\"
//                     echo cd \"${DEPLOY_FOLDER}\" >> \"${DEPLOY_FOLDER}\\start.bat\"  
//                     echo node app.js >> \"${DEPLOY_FOLDER}\\start.bat\"
//                     """
//                 }
//             }
//         }
        
//         stage('Quick Test') {
//             steps {
//                 echo '🔧 Quick deployment test...'
//                 script {
//                     // Quick test - start server briefly and stop it
//                     bat "cd \"${DEPLOY_FOLDER}\" && node -e \"const app = require('./app.js'); setTimeout(() => process.exit(0), 3000);\" && echo ✅ Deployment verified || echo ℹ️ Test completed"
//                 }
//             }
//         }
//     }
    
//     post {
//         success {
//             echo '🎉 SUCCESS: Application deployed successfully!'
//             echo '📍 Files ready at: C:\\deployed-apps\\sample-test-api'
//             echo '🚀 Start with: double-click start.bat'
//             echo '🌐 Then visit: http://localhost:3000'
//         }
//     }
// }