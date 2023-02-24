### Chat app with Node and Socket.io (+ React, Typescript)

Training project (in progress).

- [x] The app welcomes new users joining the chat and informs others that new user has been joined.
- [x] The app notifies all users when somebody is leaving chat.
- [x] The app prints messages.
- [x] Users are able to share their current location.
- [x] Users can see their messages listed on UI.
- [x] Users can see the clickable link to the shared location.
- [ ] TBD

The `main` implementation is based on **The complete Node.js Developer Course (3rd Edition) by Andrew Mead and Rob Percival** (_Udemy_). It uses `Mustache` lib to render dynamic content on UI.

The alternative implementation with **React & Typescript** is in a separate branch `react` (launched with `webpack`, `webpack-dev-server` and `babel`, no out-of-the-box solutions like CRA).

To run app in dev mode:

- on `main` branch (launches node server with nodemon)

```
cd server && npm run dev
```

- on `react` branch (launches separately FE and BE parts with the watch for changes and browser reload)

```
npm start
```
