
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
        sh 'scp docker-compose.yml root@${BACKEND_SERVER_IP}:~'
        sh '''
            ssh -o StrictHostKeyChecking=no root@${BACKEND_SERVER_IP} -C\
            docker-compose down &&
            docker-compose -H "ssh://root@${BACKEND_SERVER_IP}" up
        '''
        sh "echo 'updated docker image(s) running'"
      }
    }
  }
  catch (err) {
    throw err
  }
}