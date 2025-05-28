/* groovylint-disable-next-line CompileStatic */
pipeline {
  agent any
  environment {
    DIRECTORY_PATH = '/var/lib/jenkins/workspace/sit753-73hd/task'
    TESTING_ENVIRONMENT = 'Test'
    PRODUCTION_ENVIRONMENT = 'production'
    PROJECT_NAME = 'sit753-73hd'
    DOCKER_IMAGE_VERSION = 'v1'
    DOCKERHUB_REPO = 'chrisyp'
    IMAGE_NAME= "${DOCKERHUB_REPO}/${PROJECT_NAME}:${DOCKER_IMAGE_VERSION}"
  }

  stages {
    // stage('Build') {
    //   steps {

    //     echo 'Fetch the source code from the directory path specified by the environment variable'
    //     checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/wenyupeng/sit753-73hd.git']])
    //     echo 'Compiling the code and building Docker image'
    //     withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
    //       sh "docker login -u ${DOCKERHUB_USER} -p ${DOCKERHUB_PASSWORD}"
    //     }
        
    //     script{
    //       def image_name = "${DOCKERHUB_REPO}/${env.PROJECT_NAME}:${env.DOCKER_IMAGE_VERSION}"
    //       env.IMAGE_NAME = image_name
    //     }

    //     dir("${env.DIRECTORY_PATH}") {
    //       sh 'pwd'
    //       sh "docker build -t ${env.IMAGE_NAME} ."
    //       sh "docker push ${env.IMAGE_NAME}"
    //     }

    //     echo 'Compile the code and generate any necessary artefacts'
    //   }
    // }
    // stage('Test') {
    //   steps {
    //     echo 'mocha tests'
    //     dir("${env.DIRECTORY_PATH}") {
    //       echo 'install dependencies and run tests'
    //       sh 'npm install'
    //       echo 'run unit tests'
    //       sh "npm test"
    //       echo 'run audit for vulnerabilities'
    //       sh "npm audit"
    //     }
    //   }
    // }
    // stage('Code Quality') {
    //   environment {
    //     scannerHome = tool 'Sonar-Scanner'
    //   }
    //   steps {
    //     echo 'Check the quality of the code'
    //     dir("${env.DIRECTORY_PATH}") {
    //       withSonarQubeEnv('SonarCloud') {
    //         sh "${scannerHome}/bin/sonar-scanner"
    //       }
    //     }
        
    //   }
    // }
    // stage('Security') {
    //   environment {
    //     dependencyCheckHome = tool name: 'dependencyCheckAnalyzer', type: 'dependency-check'
    //   }
    //   steps {
    //     echo '[INFO] Starting Dependency Check Scan'
    //     sh 'rm -rf ./dependency-check-report* || true'
    //     sh 'rm -rf ./dependency-check-data || true'
    //     withCredentials([string(credentialsId: 'NVD_ID', variable: 'NVD_ID')]) {
    //       sh '''
    //         export TEMP_DATA_DIR=/home/chris/.dependency-check-data
    //         echo "[INFO] Using temporary dependency-check data directory: $TEMP_DATA_DIR"
    //         ${dependencyCheckHome}bin/dependency-check.sh \
    //           --nvdApiKey $NVD_ID \
    //           --data $TEMP_DATA_DIR \
    //           -s $DIRECTORY_PATH \
    //           --format HTML --format XML \
    //           -o ./ \
    //           --disableNodeAudit \
    //           --disableYarnAudit 
    //       '''
    //       echo '[INFO] Dependency Check Completed. Log output:'
    //     }
    //   }
    // }

    stage('Deploy') {
      steps {
        echo "[INFO] Deploying to ${env.TESTING_ENVIRONMENT} environment..."
        sh """
          ssh -o StrictHostKeyChecking=no jenkins@34.129.141.103 \\
            "docker pull ${IMAGE_NAME} && \\
            docker stop sit753-73hd || true && \\
            docker rm sit753-73hd || true && \\
            docker run -d -p 5000:5000 --name sit753-73hd --restart always ${IMAGE_NAME}"
        """

        echo '[INFO] Application deployed to testing environment successfully.'
      }
    }
    stage('Release') {
      steps {
        echo 'Deploy the application to product environment specified by the environment variable'
        echo "${TESTING_ENVIRONMENT}"
        sh 'ssh jenkins@34.129.141.103'
        sh "docker run -d -p 5000:5000 --name sit753-73hd --restart always ${env.IMAGE_NAME}"
        echo 'Application deployed to product environment successfully'
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