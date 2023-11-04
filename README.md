# SimpleCI

A simple implementation of a CI Pipeline runner based on Webhooks provided by Git Providers like GitHub.

For the whole blog post, check [here](https://blog.devesh.tech/post/lets-build-our-own-ci-job-runner).

For the actual server and runner implementation, check out [the runner directory](./runner/README.md).

### Requisites to run this project yourself

- I've used Firebase Authentication and Firestore, you'll need to set the `VITE_FIREBASE_CONFIG` environment variable for the app to start as well as set the security rules correctly based on [this file](./runner/firebase/firestore.rules).
- Do not forget to create a GitHub OAuth App, and enable the GitHub sign-in for your Firebase App.

You can use [Firebase Emulator suite](https://firebase.google.com/docs/emulator-suite) to run Firestore, Authentication and Firebase Cloud Functions (Helps as most of the cloud functions, including the core runner are triggered by writes to Firestore and notification over a pub-sub channel for security).
