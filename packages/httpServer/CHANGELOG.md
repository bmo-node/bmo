# CHANGELOG

v0.5.0
- [CHANGE] Update version

v0.4.3
- [CHANGE] Add serializers dependency using pino default serializers

v0.4.2
- [CHANGE] Add `healthy` value to `/health` endpoint

v0.4.1
- [ADD] Export for dependencies so it can be used with the mocker
- [CHANGE] Use new bmo module loader

v0.4.0
- [ADD] Http to default dependencies
- [ADD] Joi to default dependencies
- [UPDATE] joi, joi-to-swagger and other dependencies
- [BREAKING CHANGES] Applications will have to update their schemas to use the supplied joi dependency
