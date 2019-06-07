
timestamps
  {
    try {
      node('gcc4-8-5') {
        stage("Checkout") {

          env.JAVA_HOME = "${tool global.java.java8.home}"
          env.NODE_HOME = "${tool global.nodejs.node8.home}"
          env.PATH = "${env.JAVA_HOME}/bin:${env.NODE_HOME}/bin:${env.PATH}"
          env.jobstatus = "success"
          step([$class: 'WsCleanup'])

          checkout([
            $class           : 'GitSCM',
            extensions       : scm.extensions + [[$class: 'LocalBranch']],
            userRemoteConfigs: scm.userRemoteConfigs
          ])

          env.appName = "bmo"
          def packageJsonVersion = sh(returnStdout: true, script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g'").trim()
          def commitHash = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
          appVersion = "${env.BRANCH_NAME}_${packageJsonVersion}_B${env.BUILD_NUMBER}_${commitHash}"
          applicationVersion = "${packageJsonVersion}_B${env.BUILD_NUMBER}"

          currentBuild.displayName = "${appName}_${appVersion}"
        }

        stage("yarn install")
          {
            sh 'yarn install --ignore-engines --pure-lockfile --update-checksums'
          }

        stage("yarn run build")
          {
            sh 'yarn run build'
          }

        stage("yarn lint")
          {
            checkpoint "Lint"
            sh 'yarn lint'
          }

        stage("yarn test")
          {
            checkpoint "Test"
            sh 'CI=true NO_PROXY="localhost,127.0.0.1,*.lmig.com,*.lm.lmig.com,*.libertyec.com,192.168.99.100" HTTPS_PROXY="http://fusion-proxy.lmig.com:80" HTTP_PROXY="http://fusion-proxy.lmig.com:80" yarn test'
          }

        // stage('Sonar Scan')
        //   {
        //     scannerHome = tool name: 'Sonar Scanner 2.8', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
        //     sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=${appName}_${appVersion}"
        //   }

        stage("Stash Artifacts")
          {
            sh "zip -q --symlinks -r bmo.zip . -x Jenkinsfile Dockerfile docker-compose.yml .git* .npmrc .git/\\* test/\\* node_modules/\\*"
            stash name: 'app-archive', includes: 'bmo.zip'
            stash name: 'dockerfile', includes: 'Dockerfile'
          }

        stage("Cleanup") {
          step([$class: 'WsCleanup'])
        }

      }

      if (env.BRANCH_NAME == 'develop') {

        stage("Build Docker Image") {
          checkpoint "Build Docker Image"
          node("docker_build") {

            def DTR_USER_ID_BASE = global.dtr['prod'].base64
            def DTR_HOST = global.dtr['prod'].host
            def DTR_REPO_NAME = "bmo"

            withCredentials([[$class: 'StringBinding', credentialsId: DTR_USER_ID_BASE, variable: 'DTR_CREDS_BASE']]) {

              def DTR_REPO = 'jenkinsuser' + "/${DTR_REPO_NAME}"

              def REPO = sh(script: "/bin/curl -k -s -H \"Authorization: Basic ${DTR_CREDS_BASE}\" --insecure -X GET https://${DTR_HOST}/api/v0/repositories/${DTR_REPO} | /builds/tools/jq/jq -r .name", returnStdout: true)
              env.REPO = REPO.trim()
              REPO = REPO.replace('\n', '')

              if (REPO == DTR_REPO_NAME) {
                println 'Repo ' + DTR_REPO_NAME + ' already exists.'
              } else {
                println 'Repo ' + DTR_REPO_NAME + ' does not exist, creating it...'
                sh '/bin/curl -k -s -H "Authorization: Basic ' + DTR_CREDS_BASE + '" --insecure -X POST --data \'{"name":"' + DTR_REPO_NAME + '","visibility":"public"}\' --header "Content-type: application/json" https://' + DTR_HOST + '/api/v0/repositories/' + 'jenkinsuser'
              }

              deleteDir()
              unstash 'app-archive'
              unstash 'dockerfile'
              sh 'unzip -q bmo.zip'

              def APP_IMAGE_BASE = "${global.dtrHostProd}/${global.dtrUserProd}/${DTR_REPO_NAME}"
              APP_IMAGE = APP_IMAGE_BASE + ":${appVersion}"
              def LATEST_APP_IMAGE = APP_IMAGE_BASE + ":latest"

              sh "sudo docker build . --build-arg HTTP_PROXY=http://vxpit-putil001:3128 --build-arg HTTPS_PROXY=http://vxpit-putil001:3128 -t ${APP_IMAGE} -t ${APP_IMAGE} -t ${LATEST_APP_IMAGE} --pull"
              PUSH_OUTPUT = sh(script: "sudo docker push ${APP_IMAGE}", returnStdout: true)
              println PUSH_OUTPUT
              IMAGE_SHA = getSHA(PUSH_OUTPUT)

              step([$class: 'WsCleanup'])
            }
          }
        }

        node("linux")
          {
            withEnv(["PATH=/builds/tools/git/git-2.6.0/bin:${env.PATH}:/builds/tools/git/git-2.6.0/bin".minus('/usr/bin')]) {

              stage("Install Deploy Trigger")
                {
                  sh 'yarn add dna-deploy-trigger@0.x --registry=https://pi-artifactory.lmig.com/artifactory/api/npm/npm'
                }

              stage("Trigger Deploy") {

                withCredentials([usernamePassword(credentialsId: 'fusion-gituser', passwordVariable: 'GRGIT_PASS', usernameVariable: 'GRGIT_USER')]) {

                  sh "./node_modules/.bin/dna-deploy-trigger " +
                    "--username ${GRGIT_USER} " +
                    "--password ${GRGIT_PASS} " +
                    "--git-clone-url https://git.forge.lmig.com/scm/tinkertime/bmo-deploy.git " +
                    "--branch ${env.BRANCH_NAME} " +
                    "--image ${APP_IMAGE}@${IMAGE_SHA} " +
                    "--service-name bmo-v0 " +
                    "--applicationVersion ${applicationVersion}"

                }
                step([$class: 'WsCleanup'])
              }
            }

            sh 'echo $PATH'
          }
      }
    }
    catch (err) {
      node('linux')
        {
          env.jobstatus = "failed"
          throw err
        }
    }
    finally {
      stage("Notify")
        {
          node('linux')
            {
              EMAIL_SUBJECT = "${currentBuild.displayName} - ${env.jobstatus}"

              SLACK_MESSAGE = "${env.jobstatus.toUpperCase()} - ${env.JOB_NAME} [ ${currentBuild.displayName} ] (${env.BUILD_URL})"

              emailext(
                subject: EMAIL_SUBJECT,
                body: "<p>Job ${env.JOB_NAME}" + "[" + env.BUILD_NUMBER + "]" +
                  ":</p><p>Check console output at &QUOT;<a href=" + env.BUILD_URL + ">" + env.JOB_NAME + "[" + env.BUILD_NUMBER + "]</a>&QUOT;</p>",
                recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider'], [$class: 'DevelopersRecipientProvider']],
                attachLog: true,
                compressLog: true
              )

              //Just need to supply channel and domain and uncomment if you wish to integration builds with slack
                              //util_slackNotify SLACK_MESSAGE:SLACK_MESSAGE,
              				//				SLACK_CHANNEL:'',
              				//				SLACK_TEAM_DOMAIN:'',
              				//				SLACK_COLOR:SLACK_COLOR,
              				//				SLACK_TOKEN_ID:'dna-uscm-slack-token'

              step([$class: 'WsCleanup'])
            }
        }
    }
  }

@NonCPS
def getSHA(push_output) {
  def matcher = push_output =~ /sha256:[A-Fa-f0-9]{64}/
  return matcher[0]
}
