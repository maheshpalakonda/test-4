pipeline {
    agent any

    environment {
        IMAGE_NAME = 'shopnest-app'
        CONTAINER_NAME = 'shopnest-app'
        PORT = '3000'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/maheshpalakonda/test-4.git', credentialsId: 'github-pat'
            }
        }

        stage('Install Node Modules') {
            steps {
                sh 'npm install'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
            }
        }

        stage('Remove Old Images & Volumes') {
            steps {
                sh "docker rmi ${IMAGE_NAME}:latest || true"
                sh "docker volume prune -f"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Run Docker Container') {
            steps {
                sh "docker run -d -p ${PORT}:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:latest"
            }
        }
    }

    post {
        success {
            echo "Deployment completed successfully!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}

