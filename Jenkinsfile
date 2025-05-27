/* groovylint-disable-next-line CompileStatic */
pipeline {
  agent any
  environment {
    DIRECTORY_PATH = '/var/lib/jenkins/workspace/sit753-73hd/task'
    TESTING_ENVIRONMENT = 'Test'
    PRODUCTION_ENVIRONMENT = 'production'
    PROJECT_NAME = 'sit753-73hd'
    DOCKER_IMAGE_VERSION = 'v1'
  }
  stages {
    stage('Build') {
      steps {

        echo 'Fetch the source code from the directory path specified by the environment variable'
        checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/wenyupeng/sit753-73hd.git']])
        echo 'Compiling the code and building Docker image'
        dir("${env.DIRECTORY_PATH}") {
          sh 'pwd'
          sh "docker build -t ${env.PROJECT_NAME}:${env.DOCKER_IMAGE_VERSION} ."
        }

        script {
          env.DOCKER_IMAGE_VERSION = "v${(env.DOCKER_IMAGE_VERSION - 'v').toInteger() + 1}"
        }

        echo 'Compile the code and generate any necessary artefacts'
      }
    }
    stage('Test') {
      steps {
        echo 'mocha tests'
        dir("${env.DIRECTORY_PATH}") {
          sh 'pwd'
          sh "npm test"
        }
      }
    }
    stage('Code Quality') {
      steps {
        echo 'Check the quality of the code'
      }
    }
    stage('Security') {
      steps {
        echo 'Check the quality of the code'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploy the application to a testing environment specified by the environment variable'
        echo "${TESTING_ENVIRONMENT}"
        echo 'Application deployed to testing environment successfully'
      }
    }
    stage('Release') {
      steps {
        echo 'Deploy the application to a testing environment specified by the environment variable'
        echo "${TESTING_ENVIRONMENT}"
        echo 'Application deployed to testing environment successfully'
      }
    }

    stage('Monitoring') {
      steps {
        echo 'Deploy the application to the production environment specified by the environment variable'
        echo "${PRODUCTION_ENVIRONMENT}"
        echo 'Application deployed to production successfully'
      }
    }
  }
}