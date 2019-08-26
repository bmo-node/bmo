export default ({ snyk }) => `timestamps {
  try {
    node('linux') {
      def nodeVer = "node_V10-15-3"
      env.NODE_HOME="\$\{tool nodeVer}"
      env.PATH = "\$\{env.NODE_HOME}/bin:\$\{env.PATH}"

      env.JAVA_HOME = "\$\{tool global.latestJava8}"
      env.PATH = "\$\{env.JAVA_HOME}/bin:\$\{env.PATH}"

      stage("Checkout") {

        env.jobstatus = "success"

        checkout([
          $class           : 'GitSCM',
          extensions       : scm.extensions + [[$class: 'LocalBranch']],
          userRemoteConfigs: scm.userRemoteConfigs
        ])

        env.SERVICE_NAME = sh(
          returnStdout: true,
          script: "cat package.json | grep name | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g'"
        ).trim()

        env.SERVICE_VERSION = sh(
          returnStdout: true,
          script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g'"
        ).trim()

        env.SERVICE_MAJOR_VERSION = sh(
          returnStdout: true,
          script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g' | cut -d '.' -f1"
        ).trim()

        def packageJsonVersion = sh(
          returnStdout: true,
          script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g'"
        ).trim()

        applicationVersion = "\$\{packageJsonVersion}_B\$\{env.BUILD_NUMBER}"
        println "applicationVersion: \$\{applicationVersion}"

        env.REV = sh(
          returnStdout: true,
          script: "git rev-parse --short HEAD"
        ).trim()

        env.SERVICE_VERSION = "\$\{SERVICE_VERSION}-\$\{REV}"
        env.SERVICE_DEPLOY_NAME="\$\{SERVICE_NAME}-v\$\{SERVICE_MAJOR_VERSION}"

        currentBuild.displayName = "\$\{SERVICE_NAME}.\$\{SERVICE_VERSION}"
      }

      stage("Install") {
        sh "yarn --pure-lockfile --ignore-optional"
        sh "npm i --package-lock-only"
      }

      ${
	     snyk
		? `stage("Security Audit") {
        withCredentials([string(credentialsId: 'help_snyk_token', variable: 'SNYK_TOKEN')]) {
          withEnv(["SNYK_TOKEN=\$\{SNYK_TOKEN}","http-proxy=http://vxpit-putil001.lmig.com:3128","https_proxy=http://vxpit-putil001.lmig.com:3128"]){
            sh "yarn snyk:test"
          }
        }
      }`
		: `stage("Security Audit") {
        sh "yarn audit"
      }`
}
      stage("Test") {
        sh "npm run test"
      }

      stage("Code Quality") {
        sh "npm run lint"
      }

      if(env.BRANCH_NAME == "Checkmarx-Scans"){
        stage('Sonar Scan') {
          withSonarQubeEnv('Production') {
            scannerHome = tool name: 'Sonar Scanner 2.8', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
            sh "\$\{scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=\$\{SERVICE_NAME}.\$\{SERVICE_VERSION}"
          }

          sleep(time:15,unit:"SECONDS")
          script{
            def qg = waitForQualityGate abortPipeline: true
            if (qg.status != 'OK') {
              echo "Status: \$\{qg.status}"
              error "Pipeline aborted due to quality gate failure: \$\{qg.status}"
            }
          }
        }

        stage("Checkmarx Scan") {
          step([
            $class: 'CxScanBuilder',
            comment: '',
            excludeFolders: 'JenkinsBuild, build, test, tests, lib, Libraries, node_modules, coverage',
            excludeOpenSourceFolders: '',
            exclusionsSetting: 'job',
            filterPattern:
              '''
              !**/_cvs/**/*, !**/.svn/**/*,   !**/.hg/**/*,   !**/.git/**/*,  !**/.bzr/**/*, !**/bin/**/*,
              !**/obj/**/*,  !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr,     !**/*.iws,
              !**/*.bak,     !**/*.tmp,       !**/*.aac,      !**/*.aif,      !**/*.iff,     !**/*.m3u, !**/*.mid, !**/*.mp3,
              !**/*.mpa,     !**/*.ra,        !**/*.wav,      !**/*.wma,      !**/*.3g2,     !**/*.3gp, !**/*.asf, !**/*.asx,
              !**/*.avi,     !**/*.flv,       !**/*.mov,      !**/*.mp4,      !**/*.mpg,     !**/*.rm,  !**/*.swf, !**/*.vob,
              !**/*.wmv,     !**/*.bmp,       !**/*.gif,      !**/*.jpg,      !**/*.png,     !**/*.psd, !**/*.tif, !**/*.swf,
              !**/*.jar,     !**/*.zip,       !**/*.rar,      !**/*.exe,      !**/*.dll,     !**/*.pdb, !**/*.7z,  !**/*.gz,
              !**/*.tar.gz,  !**/*.tar,       !**/*.gz,       !**/*.ahtm,     !**/*.ahtml,   !**/*.fhtml, !**/*.hdm,
              !**/*.hdml,    !**/*.hsql,      !**/*.ht,       !**/*.hta,      !**/*.htc,     !**/*.htd,
              !**/*.htmls,   !**/*.ihtml,     !**/*.mht,      !**/*.mhtm,     !**/*.mhtml,   !**/*.ssi, !**/*.stm,
              !**/*.stml,    !**/*.ttml,      !**/*.txn,      !**/*.xhtm,     !**/*.xhtml,   !**/*.class, !**/*.iml, !**/*.lock''',

            fullScanCycle: 10,
            fullScansScheduled: true,
            generatePdfReport: true,
            groupId: '251373a1-cb42-4263-856d-f1552f0b8208',
            includeOpenSourceFolders: '',
            preset: '100006',
            projectName: "\$\{SERVICE_NAME}",
            serverUrl: 'https://checkmarxJenkins.lmig.com:8443',
            sourceEncoding: '1',
            waitForResultsEnabled: true,
            incremental: true,
            highThreshold: 0,
            mediumThreshold: 0,
            lowThreshold: 41,
            vulnerabilityThresholdEnabled: true,
            vulnerabilityThresholdResult: 'FAILURE'
          ])
        }
      }

      stage("Build") {
        sh "npm run build"
      }

      stage("Prune") {
        sh "npm prune --production"
      }

      stage("Stash Artifacts") {
        stash name: "application", includes: "**"
        stash name: "docker-compose", includes: "docker-compose/"
      }

      stage("Cleanup") {
        step([$class: 'WsCleanup'])
      }
    }

    // change to dev/release branches
    if (env.BRANCH_NAME == "develop" || env.BRANCH_NAME == "master") {
      def DTR_REPO_NAME = "\$\{SERVICE_NAME}".toLowerCase()

      stage("Build Docker Image") {
        checkpoint "Build Docker Image"
        node("docker_build") {

          def DTR_USER_ID_BASE = global.dtr['prod'].base64
          def DTR_HOST = global.dtr['prod'].host

          withCredentials([[$class: 'StringBinding', credentialsId: DTR_USER_ID_BASE, variable: 'DTR_CREDS_BASE']]) {

            def DTR_REPO = 'jenkinsuser' + "/\$\{DTR_REPO_NAME}"

            def REPO = sh(script: "/bin/curl -k -s -H \"Authorization: Basic \$\{DTR_CREDS_BASE}\" --insecure -X GET https://\$\{DTR_HOST}/api/v0/repositories/\$\{DTR_REPO} | /builds/tools/jq/jq -r .name", returnStdout: true)
            env.REPO = REPO.trim()
            REPO = REPO.replace('\n', '')

            if (REPO == DTR_REPO_NAME) {
              println 'Repo ' + DTR_REPO_NAME + ' already exists.'
            } else {
              println 'Repo ' + DTR_REPO_NAME + ' does not exist, creating it...'
              sh '/bin/curl -k -s -H "Authorization: Basic ' + DTR_CREDS_BASE + '" --insecure -X POST --data \'{"name":"' + DTR_REPO_NAME + '","visibility":"public"}\' --header "Content-type: application/json" https://' + DTR_HOST + '/api/v0/repositories/' + 'jenkinsuser'
            }

            unstash "application"

            def APP_IMAGE_BASE = "\$\{global.dtr['prod'].host}/\$\{global.dtr['prod'].repoUserName}/\$\{DTR_REPO_NAME}"
            APP_IMAGE = APP_IMAGE_BASE + ":\$\{SERVICE_VERSION}"
            def MASTER_APP_IMAGE = APP_IMAGE_BASE + ":master"
            sh "sudo docker build . " + "--build-arg all_proxy=http://vxpit-putil001:3128 " + "--build-arg http_proxy=http://vxpit-putil001:3128 " + "--build-arg https_proxy=http://vxpit-putil001:3128 " + "-t \$\{APP_IMAGE} -t \$\{MASTER_APP_IMAGE} --pull"
            if (env.BRANCH_NAME == "develop" || env.BRANCH_NAME == "master") {
              sh "sudo docker push \$\{MASTER_APP_IMAGE}"
            }
            PUSH_OUTPUT = sh(script: "sudo docker push \$\{APP_IMAGE}", returnStdout: true)
            println PUSH_OUTPUT
            IMAGE_SHA = getSHA(PUSH_OUTPUT)

            step([$class: 'WsCleanup'])
          }
        }
      }
      build job:'/grmus/Deploy Services' , parameters:[
        string(name: "service_name",value: DTR_REPO_NAME),
        string(name: "target_environment", value: "develop"),
        string(name: "image_tag",value: SERVICE_VERSION),
        string(name: "project_name",value: "\$\{DTR_REPO_NAME}-v0")
      ]

    }
  }
  catch (err) {
    node('linux') {
      env.jobstatus = "failed"
      throw err
    }
  }
  finally {
    node('linux') {
      EMAIL_SUBJECT = "\$\{currentBuild.displayName} - \$\{env.jobstatus}"

      emailext(
        subject: EMAIL_SUBJECT,
        body: "<p>Job \$\{env.JOB_NAME}" + "[" + env.BUILD_NUMBER + "]" +
              ":</p><p>Check console output at &QUOT;<a href=" + env.BUILD_URL + ">" + env.JOB_NAME + "[" + env.BUILD_NUMBER + "]</a>&QUOT;</p>",
        recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider'], [$class: 'DevelopersRecipientProvider']],
        attachLog: true,
        compressLog: true
      )

      // Notification to Slack of build status
      SLACK_MESSAGE = "\$\{env.jobstatus} - \$\{env.JOB_NAME} [ \$\{currentBuild.displayName} ] (\$\{env.BUILD_URL})"
      switch (env.jobstatus) {
        case "failed":
          SLACK_COLOR = "danger"
          break
        case "success":
          SLACK_COLOR = "good"
          break
        default:
          SLACK_COLOR = "warning"
          break
      }

      //Just need to supply channel and domain and uncomment if you wish to integration builds with slack
              //util_slackNotify SLACK_MESSAGE:SLACK_MESSAGE,
      //        SLACK_CHANNEL:'',
      //        SLACK_TEAM_DOMAIN:'',
      //        SLACK_COLOR:SLACK_COLOR,
      //        SLACK_TOKEN_ID:'dna-uscm-slack-token'

      step([$class: 'WsCleanup'])
    }
  }
}

@NonCPS
def getSHA(push_output) {
  def matcher = push_output =~ /sha256:[A-Fa-f0-9]{64}/
  return matcher[0]
}`;
