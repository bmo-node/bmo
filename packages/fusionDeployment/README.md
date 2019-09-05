# @lmig/bmo-extension-fusion-deploy

This module provides the `fusionDeploy` template to the `bmo create` command.

To use this module install it either globally or locally.

`npm install (-g) @lmig/bmo-extension-fusion-deploy`

then you can invoke it using `bmo create fusionDeploy`

This will generate a Jenkinsfile and a Dockerfile in the cwd.

These can be used with the DNA jenkins job to easily deploy new services

go [here](https://dna-initializer-production.prod.uscm.libertyec.com/catalog) and find the template called
`DNA Style Jenkins Build Job` and initialize that on your git repo. From there you should have a fully functioning deployment pipeline.
For information on how the deployment pipeline works go [here](TODO-ADD-LINK-TO-DEPLOY-DOCS)
