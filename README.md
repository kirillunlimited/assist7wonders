[![Build Status](https://travis-ci.org/kirillunlimited/assist7wonders.svg?branch=master)](https://travis-ci.com/kirillunlimited/assist7wonders)
[![Coverage Status](https://coveralls.io/repos/github/kirillunlimited/assist7wonders/badge.svg?branch=master)](https://coveralls.io/github/kirillunlimited/assist7wonders?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b5baa33b48e4995b5adc37a65cae574)](https://app.codacy.com/gh/kirillunlimited/assist7wonders?utm_source=github.com&utm_medium=referral&utm_content=kirillunlimited/assist7wonders&utm_campaign=Badge_Grade_Settings)
![GitHub top language](https://img.shields.io/github/languages/top/kirillunlimited/assist7wonders)
[![License](https://img.shields.io/github/license/kirillunlimited/assist7wonders)](https://github.com/kirillunlimited/assist7wonders/blob/master/LICENSE.md)

# 7 Wonders assistant app

[https://assist7wonders.web.app](https://assist7wonders.web.app)

## Features
* 🧪 Science score calculator with wildcards
* 🧩 Addons support:
  * 🦸 Leaders
  * 🏙️ Cities
* 👨‍👩‍👧‍👦 Players management:
  * 🏛 Select or randomize wonders
  * 🔄 Change order of the players with drag & drop
* 🌍 English and Russian support
* 📱 Simple, lightweight and user-friendly interface with the responsive layout for both desktop and mobile devices

## Roadmap
* 🗿 Add "Wonder pack" addon
* 🗼 Add "Babel" addon
* 🛥️ Add "Armada" addon

## Build and development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Firebase
1. `npm install -g firebase-tools` to install [Firebase CLI](https://github.com/firebase/firebase-tools)
2. `firebase login` to authorize to your firebase account
3. `firebase use --add` to init `.firebaserc` file
4. `npm run deploy` to reveal this amazing project to the world
