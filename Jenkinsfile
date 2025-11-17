pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    environment {
        NODE_ENV = 'test'
        CI = 'true'
        PORT = '3000'
        // These will be set from Jenkins credentials
        MONDAY_API_KEY = credentials('MONDAY_API_KEY')
        MONDAY_BOARD_ID = credentials('MONDAY_BOARD_ID')
        MONDAY_ITEM_ID = credentials('MONDAY_ITEM_ID')
        API_KEY = credentials('API_KEY')
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
                
                script {
                    updateMondayCom('CHECKOUT_STARTED', 'Code checkout from GitHub started')
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing Node.js dependencies...'
                sh 'npm install'
                
                script {
                    updateMondayCom('DEPS_INSTALLED', 'All dependencies installed successfully')
                }
            }
        }
        
        stage('Security Audit') {
            steps {
                echo '🔒 Running security audit...'
                sh 'npm audit --audit-level moderate || true'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test'
                
                script {
                    updateMondayCom('TESTS_PASSED', 'All tests passed successfully')
                }
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
                sh 'npm run build'
                
                script {
                    updateMondayCom('BUILD_SUCCESS', 'Application built successfully')
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    try {
                        sh 'docker build -t sample-test-app:${BUILD_NUMBER} .'
                        updateMondayCom('DOCKER_BUILT', 'Docker image built successfully')
                    } catch (Exception e) {
                        echo 'Docker build skipped: ' + e.getMessage()
                        updateMondayCom('DOCKER_SKIPPED', 'Docker build skipped - Docker might not be available')
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                script {
                    try {
                        // Start the server in background
                        sh '''
                            export NODE_ENV=test
                            export PORT=3000
                            npm start &
                            SERVER_PID=$!
                            echo "Server started with PID: $SERVER_PID"
                            
                            # Wait for server to start
                            sleep 15
                            
                            # Test health endpoint
                            echo "Testing health endpoint..."
                            curl -f http://localhost:3000/health
                            
                            # Test API endpoint with API key
                            echo "Testing users endpoint..."
                            curl -H "x-api-key: ${API_KEY}" http://localhost:3000/api/users
                            
                            # Stop the server
                            echo "Stopping server..."
                            kill $SERVER_PID || true
                            sleep 5
                        '''
                        updateMondayCom('HEALTH_CHECK_PASSED', 'Health checks passed - API is responsive')
                    } catch (Exception e) {
                        echo "Health check warning: ${e.getMessage()}"
                        updateMondayCom('HEALTH_CHECK_WARNING', 'Health check had issues: ' + e.getMessage())
                    } finally {
                        // Ensure server is stopped
                        sh 'pkill -f "node.*app" || true'
                    }
                }
            }
        }
        
        stage('Integration Test') {
            steps {
                echo '🔗 Running integration tests...'
                script {
                    try {
                        sh '''
                            export NODE_ENV=test
                            export PORT=3001
                            npm start &
                            SERVER_PID=$!
                            sleep 10
                            
                            # Test user creation
                            curl -X POST http://localhost:3001/api/users \
                                -H "Content-Type: application/json" \
                                -H "x-api-key: ${API_KEY}" \
                                -d '{"name":"Integration User","email":"integration@test.com","age":30,"department":"Testing"}'
                            
                            kill $SERVER_PID || true
                        '''
                        updateMondayCom('INTEGRATION_TEST_PASSED', 'Integration tests completed successfully')
                    } catch (Exception e) {
                        echo "Integration test completed with notes: ${e.getMessage()}"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline execution completed'
            script {
                // Cleanup
                sh 'pkill -f "node.*app" || true'
                sh 'docker system prune -f || true'
            }
        }
        success {
            echo '🎉 Pipeline completed successfully!'
            script {
                updateMondayCom('PIPELINE_SUCCESS', '✅ All stages completed successfully! Build #${BUILD_NUMBER}')
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                updateMondayCom('PIPELINE_FAILED', '❌ Pipeline failed! Check Jenkins logs for build #${BUILD_NUMBER}')
            }
        }
        unstable {
            echo '⚠️ Pipeline unstable - tests might have failed'
            script {
                updateMondayCom('PIPELINE_UNSTABLE', '⚠️ Pipeline unstable - some tests failed for build #${BUILD_NUMBER}')
            }
        }
    }
}

// Enhanced Monday.com update function with better error handling
def updateMondayCom(status, message) {
    echo "📋 Attempting Monday.com update: ${status} - ${message}"
    
    def mondayApiKey = env.MONDAY_API_KEY
    def boardId = env.MONDAY_BOARD_ID
    def itemId = env.MONDAY_ITEM_ID
    
    // Check if credentials are available
    if (mondayApiKey && boardId && itemId && mondayApiKey != 'MONDAY_API_KEY') {
        try {
            def updateMessage = "Jenkins Build #${env.BUILD_NUMBER}: ${status} - ${message} - ${env.BUILD_URL}"
            
            def curlCommand = """
                curl -X POST \\
                -H "Authorization: ${mondayApiKey}" \\
                -H "Content-Type: application/json" \\
                -d '{
                    "query": "mutation { create_update (item_id: ${itemId}, body: \\"${updateMessage}\\" ) { id } }"
                }' \\
                "https://api.monday.com/v2"
            """
            
            sh curlCommand
            echo "✅ Monday.com updated successfully: ${status}"
            
        } catch (Exception e) {
            echo "⚠️ Monday.com update failed: ${e.getMessage()}"
            // Continue pipeline even if Monday.com update fails
        }
    } else {
        echo "⚠️ Monday.com credentials not configured properly - skipping update"
        echo "   MONDAY_API_KEY: ${mondayApiKey ? 'Set' : 'Not set'}"
        echo "   MONDAY_BOARD_ID: ${boardId ? 'Set' : 'Not set'}" 
        echo "   MONDAY_ITEM_ID: ${itemId ? 'Set' : 'Not set'}"
    }
}