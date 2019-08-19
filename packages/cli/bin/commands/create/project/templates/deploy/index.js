/* eslint-disable no-useless-escape */

export const dockerFile = () =>
	`FROM dtr-uscm.ddc2.prod-shared.aws.lmig.com/jenkinsuser/oracle-node-dockerfile:latest

WORKDIR /usr/src/app

# Add app
COPY node_modules /usr/src/app/node_modules
COPY dist /usr/src/app/dist
COPY config /usr/src/app/config
COPY swagger /usr/src/app/swagger
COPY package.json /usr/src/app/package.json

HEALTHCHECK --interval=60s --timeout=30s --retries=3 CMD curl -v --fail http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]`;
export const entrypoint = () =>
	`
`;

export const jenkinsFile = ({ gitRepo, snyk }) =>
	`timestamps {

    try {
        node('linux') {
        def nodeVer = "node_V10-14-2"
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

        env.SERVICE_MAJOR_VERSION = sh(
          returnStdout: true,
          script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g' | cut -d '.' -f1"
        ).trim()

        env.SERVICE_VERSION = sh(
          returnStdout: true,
          script: "cat package.json | grep version | head -1 | awk -F: '{print \$2}' | sed 's/[\" ,]//g'"
        ).trim()

        buildVersion = "\$\{SERVICE_VERSION}_B\$\{env.BUILD_NUMBER}"
        println "buildVersion: \$\{buildVersion}"
        println "service version: \$\{SERVICE_VERSION}"
        env.REV = sh(
          returnStdout: true,
          script: "git rev-parse --short HEAD"
        ).trim()

        env.APP_VERSION = "\$\{SERVICE_VERSION}"
        env.SERVICE_VERSION = "\$\{SERVICE_VERSION}-\$\{REV}"
        env.SERVICE_DEPLOY_NAME="\$\{SERVICE_NAME}-v\$\{SERVICE_MAJOR_VERSION}"
        currentBuild.displayName = "\$\{SERVICE_NAME}.\$\{SERVICE_VERSION}"
        env.BRANCH_PREFIX = 'develop'
        env.HOST_URL_ENV = 'develop'
        if(env.BRANCH_NAME != 'master'){
          def split=BRANCH_NAME.split('/')
          env.BRANCH_PREFIX=split[0]
          // if(split.length >= 2){
          //  def branchTicket=split[1].split('-')
          //  def TICKET_NUMBER="_" + branchTicket[1]
          //  env.HOST_URL_ENV = (env.BRANCH_PREFIX + TICKET_NUMBER).toLowerCase()
          // }else{
          //  env.HOST_URL_ENV = env.BRANCH_PREFIX.replace(' -','')
          // }

        }
      }

      stage("Install") {
        sh "yarn install --ignore-engines --pure-lockfile"
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
      }`}
      stage("Test") {
        sh "yarn test"
      }
      stage("Build"){
        sh "yarn build"
      }
      stage('Sonar Scan') {
        scannerHome = tool name: 'Sonar Scanner 2.8', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
        sh "\$\{scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=\$\{SERVICE_NAME}.\$\{SERVICE_VERSION}"
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

    stage("Build Docker Image") {
      checkpoint "Build Docker Image"
      node("docker_build") {

        def DTR_USER_ID_BASE = global.dtr['prod'].base64
        def DTR_HOST = global.dtr['prod'].host
        def DTR_REPO_NAME = "\$\{SERVICE_NAME}".toLowerCase()

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

          if(env.BRANCH_NAME == 'master'){
            def MASTER_IMAGE = APP_IMAGE_BASE + ":master"
            sh "sudo docker build . " + "--build-arg all_proxy=http://vxpit-putil001:3128 " + "--build-arg http_proxy=http://vxpit-putil001:3128 " + "--build-arg https_proxy=http://vxpit-putil001:3128 " + "-t \$\{APP_IMAGE} -t \$\{MASTER_IMAGE} --pull"
            sh "sudo docker push \$\{MASTER_IMAGE}"

          } else {
            sh "sudo docker build . " + "--build-arg all_proxy=http://vxpit-putil001:3128 " + "--build-arg http_proxy=http://vxpit-putil001:3128 " + "--build-arg https_proxy=http://vxpit-putil001:3128 " + "-t \$\{APP_IMAGE} --pull"
          }

          PUSH_OUTPUT = sh(script: "sudo docker push \$\{APP_IMAGE}", returnStdout: true)
          IMAGE_SHA = getSHA(PUSH_OUTPUT)
          env.IMAGE_PATH = "\$\{DTR_HOST}/\$\{DTR_REPO}:\$\{SERVICE_VERSION}@\$\{IMAGE_SHA}"

          step([$class: 'WsCleanup'])
        }
      }
    }
    node('linux'){
      stage("Deploy") {
        def APP_ENV = "\$\{env.BRANCH_PREFIX}"

        args = [
            GIT_URL: "${gitRepo}",
            APP_NAME: env.SERVICE_NAME,
            SERVICE_NAME: env.SERVICE_DEPLOY_NAME,
            PORTFOLIO: "distribution",
            APP_IMAGE: "\$\{env.IMAGE_PATH}",
            GIT_BRANCH: env.BRANCH_NAME,
            ENVIRONMENT: "\$\{APP_ENV}",
            APP_ENV: "\$\{APP_ENV}",
            MESH_ENV: "\$\{APP_ENV}",
            VAULT_ROUTE: "np",
            UPDATE_STACK: true,
            ETS_DEPLOY_ENV: "test",
            PROCESS_PARENT_SECRETS: true,
            STACK_NAME: "CM-\$\{env.SERVICE_NAME}-\$\{APP_ENV}"
        ]
        if(env.BRANCH_NAME == 'master'){
          args['APPDYNAMICS_HOST'] = "libertymutual-test.saas.appdynamics.com"
          args['APPDYNAMICS_NAME'] = "libertymutual-test"
          args['APPDYNAMICS_KEY'] = "ec707779-409a-4597-aa21-45071cdebf9d"
        }
        fusion_launchDeploy(args)
      }
    }
    }
    catch(err) {
        node {
            env.jobstatus="failed"
            env.END_PHASE_VALUE=PHASE_VALUE
            env.END_PHASE_STRING=PHASE_STRING
            throw err
        }
    }
    finally {
        stage("Notify")
        {
            node('linux')
            {
                postbuild()
                step([$class: 'WsCleanup'])
            }
        }
    }
}
@NonCPS
def getSHA(push_output) {
  def matcher = push_output =~ /sha256:[A-Fa-f0-9]{64}/
  return matcher[0]
}`;

export const dockerCompose = ({ name }) =>
	`version: '3'

networks:
  ucp-uscm-distribution:
    external: true

services:
  ${name.replace(' ', '-')}:
    image: \$\{APP_IMAGE}
    networks:
      - ucp-uscm-distribution
    environment:
      - PORT=8080
      - 'VAULT_TLE=\$\{VAULT_ROUTE}'
      - 'VAULT_TOKEN=\$\{VAULT_TOKEN}'
      - 'ETS_DEPLOY_ENV=\$\{ETS_DEPLOY_ENV}'
      - 'APP_ENV=\$\{APP_ENV}'
      - 'APP_NAME=\$\{APP_NAME}'
      - 'NODE_ENV=\$\{APP_ENV}'
      - 'APPDYNAMICS_CONTROLLER_HOST_NAME=\$\{APPDYNAMICS_HOST}'
      - 'APPDYNAMICS_AGENT_ACCOUNT_NAME=\$\{APPDYNAMICS_NAME}'
      - 'APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY=\$\{APPDYNAMICS_KEY}'
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 5
        window: 0s
      update_config:
        parallelism: 1
        delay: 60s
      resources:
        limits:
          cpus: '4.0'
          memory: 1024M
      placement:
        constraints:
          - node.labels.com.middleware != nginx
      labels:
        com.docker.ucp.access.label: \$\{PORTFOLIO}
        com.docker.ucp.mesh.http.80: external_route=http://\$\{APP_NAME}-v0-\$\{MESH_ENV},internal_port=8080
    labels:
      - com.docker.ucp.access.label=\$\{PORTFOLIO}
      - domain.uscm=\$\{DOMAIN_NAME}
      - network.name=\$\{NETWORK_NAME}
      - platform.uscm=nodejs
      - platform.env=\$\{APP_ENV}
      - application.name=\$\{APP_NAME}
      - application.version=\$\{APP_VERSION}
      - project.name=\$\{APP_NAME}
      - service.name=\$\{APP_NAME}
      - AUTO_ENV_TO_DEPLOY_TO=\$\{APP_ENV}
      - LM_ENV_TO_DEPLOY_TO=\$\{APP_ENV}
      - AUTO_APP_ID=\$\{STACK_NAME}
      - LM_APP_ID=\$\{STACK_NAME}
      - lm_app=\$\{APP_NAME}
      - lm_app_env=\$\{APP_ENV}
      - lm_team=H.E.L.P
      - lm_portfolio=\$\{PORTFOLIO}
      - lm_sbu=grm
      - lm_platform=nodejs
      - lm_deploy_date=\$\{LM_DEPLOY_DATE}
      - card_catalog_deployment_id=\$\{CC_DEP_GUID}
      - lm.cluster.id=\$\{LM_CLUSTER_ID}
    logging:
      driver: splunk
      options:
        labels: domain.uscm,platform.uscm,platform.env,application.version,application.name,project.name,service.name,network.name
`;

export default {
	dockerFile,
	jenkinsFile,
	entrypoint
};
