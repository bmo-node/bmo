
timestamps
  {
    try {
      node('gcc4-8-5') {
        stage("Checkout") {
          def nodeVer = "node_V10-15-3"
          env.NODE_HOME="${tool nodeVer}"
          env.JAVA_HOME = "${tool global.java.java8.home}"
          env.PATH = "${env.JAVA_HOME}/bin:${env.NODE_HOME}/bin:${env.PATH}"
          env.CI = true
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

        stage("Security Audit") {
            withCredentials([string(credentialsId: 'help_snyk_token', variable: 'SNYK_TOKEN')]) {
              withEnv(["SNYK_TOKEN=${SNYK_TOKEN}","http-proxy=http://vxpit-putil001.lmig.com:3128","https_proxy=http://vxpit-putil001.lmig.com:3128"]){
                sh "yarn snyk:test"
              }
            }
          }
          if (env.BRANCH_NAME == 'master') {
          stage("publish"){
            sh "yarn publish:packages"
          }
          // stage("publish"){
          //   sh "echo \"publishing packages\""
          // }
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
