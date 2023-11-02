# SimpleCI - Frontend

This is an extremely barebones start, as my focus was primarily to see how I would get the runner and server for a CI pipeline working. The frontend would not be that complicated to implement.

For the actual server and runner implementation, check out [the runner directory](../runner/README.md).

What has been implemented (Extremely barebones):

- Signing In With GitHub and getting access to the GitHub token
- Using the GitHub token to list the user's repositories.
- Ability for the user to create a project and choose the events they want to run the pipeline on + choose the kind of runner they want for their pipelines.

Follow the steps [here](../README.md) and run `npm run dev` to start the frontend.
