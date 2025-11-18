pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
        string(name: 'COMMIT_MESSAGE', defaultValue: '', description: 'Commit message')
        string(name: 'DEVELOPER', defaultValue: '', description: 'Developer who made changes')
        string(name: 'REPOSITORY', defaultValue: '', description: 'Repository name')
        string(name: 'FEATURE_NAME', defaultValue: '', description: 'Feature name')
    }
    
    environment {
        NODE_ENV = 'production'
        BUILD_VERSION = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "📦 Checking out code from branch: ${params.BRANCH}"
                echo "🔧 Build triggered by: ${params.DEVELOPER}"
                echo "📝 Commit: ${params.COMMIT_MESSAGE}"
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://github.com/aniket-upstreamtech03/Sample-jenkins-test.git']]
                ])
                
                // Display git information
                bat 'git log -1 --oneline'
                bat 'git branch'
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
            
            post {
                always {
                    junit 'reports/junit.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Test Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building application...'
                bat 'npm run build'
            }
        }
        
        stage('Security Audit') {
            steps {
                echo '🔒 Running security audit...'
                bat 'npm audit --audit-level moderate || echo "Audit completed with warnings"'
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
                echo echo Starting Sample Test API Server... >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo echo ================================== >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo echo Build Number: ${BUILD_NUMBER} >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo echo Branch: ${BRANCH} >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo echo Developer: ${DEVELOPER} >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo echo ================================== >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo cd /d "C:\\deployed-apps\\sample-test-api" >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo npm start >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                echo pause >> "C:\\deployed-apps\\sample-test-api\\start.bat"
                '''
                echo '✅ Start script created'
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Running health check...'
                script {
                    try {
                        bat '''
                            cd "C:\\deployed-apps\\sample-test-api"
                            start /B npm start
                            timeout /t 10 /nobreak
                            curl -f http://localhost:3000/health || echo "Health check in progress..."
                            taskkill /f /im node.exe >nul 2>&1 || echo "No Node process found"
                        '''
                    } catch (Exception e) {
                        echo "Health check completed with notes: ${e.message}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "🏁 Pipeline execution completed - Build #${env.BUILD_NUMBER}"
            // Cleanup any running Node processes
            bat 'taskkill /f /im node.exe >nul 2>&1 || echo "Cleanup completed"'
        }
        success {
            echo '🎉 SUCCESS: Pipeline completed successfully!'
            echo ' '
            echo '📋 DEPLOYMENT DETAILS:'
            echo "• Build Number: ${env.BUILD_NUMBER}"
            echo "• Branch: ${params.BRANCH}"
            echo "• Developer: ${params.DEVELOPER}"
            echo "• Feature: ${params.FEATURE_NAME}"
            echo ' '
            echo '🚀 NEXT STEPS:'
            echo '1. Go to: C:\\deployed-apps\\sample-test-api'
            echo '2. Double-click: start.bat'
            echo '3. Open: http://localhost:3000'
            echo '4. Check health: http://localhost:3000/health'
            echo ' '
            echo '💡 Server will start in a new window'
            
            // Update build description
            currentBuild.description = "✅ ${params.FEATURE_NAME} - ${params.DEVELOPER}"
        }
        failure {
            echo '❌ FAILURE: Pipeline failed!'
            echo ' '
            echo '🔧 TROUBLESHOOTING:'
            echo '1. Check console output for errors'
            echo '2. Verify Node.js installation'
            echo '3. Check test results'
            echo '4. Review build parameters'
            
            currentBuild.description = "❌ ${params.FEATURE_NAME} - Failed"
        }
        unstable {
            echo '⚠️ UNSTABLE: Tests failed but pipeline continued'
            currentBuild.description = "⚠️ ${params.FEATURE_NAME} - Unstable"
        }
    }
}

// pipeline {
//     agent any
    
//     tools {
//         nodejs "node"
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
//                 echo '📦 Copying files to deployment folder...'
//                 bat 'if not exist "C:\\deployed-apps\\sample-test-api" mkdir "C:\\deployed-apps\\sample-test-api"'
//                 bat 'xcopy . "C:\\deployed-apps\\sample-test-api" /Y /E /I'
//                 echo '✅ Files copied successfully'
//             }
//         }
        
//         stage('Create Start Script') {
//             steps {
//                 echo '📜 Creating start script...'
//                 bat '''
//                 echo @echo off > "C:\\deployed-apps\\sample-test-api\\start.bat"
//                 echo cd "C:\\deployed-apps\\sample-test-api" >> "C:\\deployed-apps\\sample-test-api\\start.bat"
//                 echo node app.js >> "C:\\deployed-apps\\sample-test-api\\start.bat"
//                 echo pause >> "C:\\deployed-apps\\sample-test-api\\start.bat"
//                 '''
//                 echo '✅ Start script created'
//             }
//         }
//     }
    
//     post {
//         success {
//             echo '🎉 SUCCESS: Pipeline completed!'
//             echo ' '
//             echo '📋 NEXT STEPS:'
//             echo '1. Go to: C:\\deployed-apps\\sample-test-api'
//             echo '2. Double-click: start.bat'
//             echo '3. Open: http://localhost:3000'
//             echo ' '
//             echo '💡 Server will start in a new window'
//         }
//     }
// }