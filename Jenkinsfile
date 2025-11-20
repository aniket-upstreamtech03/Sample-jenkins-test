pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    environment {
        // Docker configuration
        DOCKER_IMAGE_NAME = "sample-jenkins-test"
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CONTAINER_NAME = "sample-jenkins-test"
        DOCKER_PORT = "3000"
        HOST_PORT = "3000"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
                echo '✅ Code checkout completed'
            }
        }
        
        stage('Install Dependencies & Test') {
            steps {
                echo '📦 Installing dependencies...'
                bat 'npm install'
                echo '🧪 Running tests...'
                bat 'npm test'
                echo '✅ Dependencies installed and tests passed'
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🔨 Building application...'
                bat 'npm run build'
                echo '✅ Build completed successfully'
            }
        }
        
        stage('Stop & Remove Old Docker Container') {
            steps {
                echo '🛑 Stopping and removing old Docker container...'
                script {
                    bat """
                    @echo off
                    echo Checking for existing container: ${DOCKER_CONTAINER_NAME}
                    docker ps -a -q --filter "name=${DOCKER_CONTAINER_NAME}" > container_id.txt
                    set /p CONTAINER_ID=<container_id.txt
                    if defined CONTAINER_ID (
                        echo Found existing container, stopping and removing...
                        docker stop ${DOCKER_CONTAINER_NAME} 2>nul || echo Container already stopped
                        docker rm ${DOCKER_CONTAINER_NAME} 2>nul || echo Container already removed
                        echo ✅ Old container cleaned up
                    ) else (
                        echo No existing container found
                    )
                    del container_id.txt 2>nul
                    exit 0
                    """
                }
            }
        }
        
        stage('Remove Old Docker Image') {
            steps {
                echo '🗑️ Removing old Docker images...'
                script {
                    bat """
                    @echo off
                    echo Removing old images for ${DOCKER_IMAGE_NAME}
                    docker images ${DOCKER_IMAGE_NAME} -q | findstr . >nul && (
                        for /f %%i in ('docker images ${DOCKER_IMAGE_NAME} -q') do (
                            docker rmi -f %%i 2>nul || echo Image might be in use
                        )
                        echo Old images removed
                    ) || (
                        echo No old images found
                    )
                    exit 0
                    """
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat """
                docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} -t ${DOCKER_IMAGE_NAME}:latest .
                """
                echo '✅ Docker image built successfully'
                bat "docker images ${DOCKER_IMAGE_NAME}"
            }
        }
        
        stage('Deploy Docker Container') {
            steps {
                echo '🚀 Deploying Docker container...'
                bat """
                docker run -d ^
                    --name ${DOCKER_CONTAINER_NAME} ^
                    -p ${HOST_PORT}:${DOCKER_PORT} ^
                    -e NODE_ENV=production ^
                    --restart unless-stopped ^
                    ${DOCKER_IMAGE_NAME}:latest
                """
                echo '⏳ Waiting for container to initialize...'
                sleep 5
                echo '✅ Container deployed successfully'
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying Docker container status...'
                bat "docker ps -a --filter name=${DOCKER_CONTAINER_NAME}"
                echo ' '
                echo '📊 Container logs (last 20 lines):'
                bat "docker logs --tail 20 ${DOCKER_CONTAINER_NAME}"
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health check...'
                echo '⏳ Waiting for application to be ready...'
                sleep 3
                script {
                    bat """
                    echo Testing endpoint: http://localhost:${HOST_PORT}/health
                    curl -f http://localhost:${HOST_PORT}/health && (
                        echo ✅ Health check PASSED!
                        exit 0
                    ) || (
                        echo ⚠️ Health check endpoint not responding
                        echo Checking if container is running...
                        docker ps --filter name=${DOCKER_CONTAINER_NAME}
                        exit 1
                    )
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 SUCCESS: Docker Deployment Pipeline Completed!'
            echo '═══════════════════════════════════════════════════'
            echo '✅ Application deployed in Docker container'
            echo ' '
            echo '📋 Deployment Details:'
            echo "   🐳 Container Name: ${DOCKER_CONTAINER_NAME}"
            echo "   🏷️  Image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            echo "   🌐 URL: http://localhost:${HOST_PORT}"
            echo "   🏥 Health Check: http://localhost:${HOST_PORT}/health"
            echo "   📊 API Docs: http://localhost:${HOST_PORT}/"
            echo ' '
            echo '🔧 Useful Docker Commands:'
            echo "   View logs: docker logs -f ${DOCKER_CONTAINER_NAME}"
            echo "   Stop container: docker stop ${DOCKER_CONTAINER_NAME}"
            echo "   Restart container: docker restart ${DOCKER_CONTAINER_NAME}"
            echo "   Shell access: docker exec -it ${DOCKER_CONTAINER_NAME} sh"
            echo ' '
            echo '💡 Container is running in background with auto-restart enabled'
            echo '═══════════════════════════════════════════════════'
        }
        failure {
            echo '❌ FAILURE: Pipeline failed!'
            echo '═══════════════════════════════════════════════════'
            echo 'Troubleshooting steps:'
            echo '1. Check Jenkins console output above for errors'
            echo '2. Verify Docker is running: docker --version'
            echo "3. Check container logs: docker logs ${DOCKER_CONTAINER_NAME}"
            echo "4. Check container status: docker ps -a --filter name=${DOCKER_CONTAINER_NAME}"
            echo '═══════════════════════════════════════════════════'
        }
        always {
            echo ' '
            echo '📊 Docker System Info:'
            bat "docker ps -a --filter name=${DOCKER_CONTAINER_NAME}"
            bat "docker images ${DOCKER_IMAGE_NAME}"
        }
    }
}
