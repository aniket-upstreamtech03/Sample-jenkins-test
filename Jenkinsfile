pipeline {
    agent any
    
    tools {
        nodejs "node"
    }
    
    stages {
        stage('Debug - Check Node.js') {
            steps {
                echo '🔍 Debugging Node.js setup...'
                bat 'node --version'
                bat 'npm --version'
                bat 'where node'
                bat 'where npm'
            }
        }
        
        stage('Debug - Check Files') {
            steps {
                echo '🔍 Checking project files...'
                bat 'dir'
                bat 'type package.json'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing dependencies...'
                bat 'npm install'
            }
        }
        
        stage('Simple Test') {
            steps {
                echo '🧪 Running simple test...'
                bat 'npm test -- --listTests || echo "Test discovery completed"'
            }
        }
    }
    
    post {
        always {
            echo '🏁 Debug completed'
        }
    }
}