node {
  environment {
    REGISTRY = "keezee/tealeel"
    REGISTRY_CREDENTIALS = "docker_registry_server"
    dockerImage = ""
  }
  try {
    stage('Checkout') {
      checkout scm
    }
    stage('Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Build Docker test'){
      sh 'groups'
      sh 'docker build -t tealeel-backend -f Dockerfile --no-cache .'
      dockerImage = docker.build("keezee/tealeel-api:${BUILD_NUMBER}")
    }
    stage('Push Docker image'){
      docker.withRegistry( 'https://registry.hub.docker.com', 'docker_registry_server') {
        dockerImage.push()
      }
    }
    stage('Clean Docker test'){
      sh 'docker rmi tealeel-backend'
    }
    stage('Deploy'){
      sshagent(credentials : ['tealeel-backend-server-ssh-credentials']) {
        sh "docker pull keezee/tealeel-api:${BUILD_NUMBER}"
        sh "docker stop tealeel-frontend-app"
        sh "docker rm tealeel-frontend-app"
        sh "docker run --name=tealeel-frontend-app --restart=always -d keezee/tealeel-api:${BUILD_NUMBER}"
      }
    }
  }
  catch (err) {
    throw err
  }
}