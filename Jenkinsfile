pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }
    environment {
      PATH = "/usr/local/bin/:$PATH"
    }
    stages {
        stage('Preparation') {
            steps {
                checkout scm

                withCredentials([usernamePassword(
                  credentialsId: "cad2f741-7b1e-4ddd-b5ca-2959d40f62c2",
                  usernameVariable: "USER",
                  passwordVariable: "PASS"
                )]) {
                    sh 'set +x'
                    sh 'docker login -u $USER -p $PASS'
                }
                script {
                    def properties = readProperties file: 'project.properties'
                    if (!properties.version) {
                        error("version property not found")
                    }
                    VERSION = properties.version
                    currentBuild.displayName += " - " + VERSION
                }
            }
        }
        stage('Build') {
            steps {
                withCredentials([file(credentialsId: '8da5ba56-8ebb-4a6a-bdb5-43c9d0efb120', variable: 'ENV_FILE')]) {
                    sh 'sudo rm -f .env'
                    sh 'cp $ENV_FILE .env'

                    sh 'docker-compose pull'
                    sh 'docker-compose down --volumes'
                    sh 'docker-compose run --entrypoint /dev-ui/build.sh requisition-ui'
                    sh 'docker-compose build image'
                    sh 'docker-compose down --volumes'
                    sh 'docker images'
                }
            }
            post {
                success {
                    archive 'build/styleguide/*, build/styleguide/**/*, build/docs/*, build/docs/**/*, build/messages/*'
                }
                always {
                    junit '**/build/test/test-results/*.xml'
                }
            }
        }
        stage('Sonar analysis') {
            steps {
                withSonarQubeEnv('Sonar OpenLMIS') {
                    withCredentials([string(credentialsId: 'SONAR_LOGIN', variable: 'SONAR_LOGIN'), string(credentialsId: 'SONAR_PASSWORD', variable: 'SONAR_PASSWORD')]) {
                        sh '''
                            set +x
                            
                            sudo rm -f .env
                            touch .env
                        
                            SONAR_LOGIN_TEMP=$(echo $SONAR_LOGIN | cut -f2 -d=)
                            SONAR_PASSWORD_TEMP=$(echo $SONAR_PASSWORD | cut -f2 -d=)
                            echo "SONAR_LOGIN=$SONAR_LOGIN_TEMP" >> .env
                            echo "SONAR_PASSWORD=$SONAR_PASSWORD_TEMP" >> .env

                            docker-compose pull
                            docker-compose run --entrypoint ./sonar.sh requisition-ui
                            docker-compose down --volumes
                        '''
                        // workaround because sonar plugin retrieve the path directly from the output
                        sh 'echo "Working dir: ${WORKSPACE}/.sonar"'
                    }
                }
                timeout(time: 1, unit: 'HOURS') {
                    script {
                        def gate = waitForQualityGate()
                        if (gate.status != 'OK') {
                            error 'Quality Gate FAILED'
                        }
                    }
                }
            }
                }
        stage('Push image') {
            when {
                expression {
                    return env.GIT_BRANCH == 'master' || env.GIT_BRANCH =~ /rel-.+/
                }
            }
            steps {
                sh "docker images"
                sh "docker push openlmis/requisition-ui:${VERSION}"
            }
        }
    }
    post {
        success{
            build job: 'OpenLMIS-reference-ui', wait: false
        }
    }
}