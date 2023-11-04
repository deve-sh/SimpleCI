### CI Runner

The runner and WebHooks server are present in this directory.

We use Firebase Cloud Functions for both due to the simplicity of translating their infra into code and their quick time from scaffolding to deployment.

Make sure you've created a Firebase Project via which you can run `firebase init` in this directory.

The following data has to be present in `.runtimeconfig.json` before starting up your server with `npm run serve`:

```json
{
	"github": {
		"webhook_secret": "<any secret value>"
	}
}
```