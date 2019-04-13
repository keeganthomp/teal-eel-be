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
    stage('Check Environment') {
      sh 'git --version'
      echo "Branch: ${env.BRANCH_NAME}"
      sh 'docker -v'
      sh 'printenv'
    }
    stage('Build Docker Image'){
      sh 'groups'
      sh 'docker build -t tealeel-backend -f Dockerfile --no-cache .'
      dockerImage = docker.build("keezee/tealeel-api:${BUILD_NUMBER}")
    }
    stage('Push Docker image'){
      docker.withRegistry( 'https://registry.hub.docker.com', 'docker_registry_server') {
        dockerImage.push()
      }
    }
    stage('Clean Docker Images'){
      sh 'docker rmi tealeel-backend'
      sh 'yes | docker system prune -a'
    }
    stage('Deploy'){
      sshagent(credentials : ['tealeel-backend-server-ssh-credentials']) {
        sh '''
            ssh -o StrictHostKeyChecking=no root@142.93.241.62 -C\
            ls &&
            pwd
        '''
      }
    }
  }
  catch (err) {
    throw err
  }
}