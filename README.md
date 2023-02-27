### Chat app with Node and Socket.io (+ React, Typescript)

Training project.

- [x] The app allows users to join chat rooms.
- [x] Dublicate usernames in the same room are not allowed.
- [x] The app welcomes new users joining the chat room and informs others in the room that new user has been joined.
- [x] On a room page, a current user can see the room name and the list of other users present in the room. The list updates when new user joins the room or someone leaves.
- [x] Users in a room can send messages to all room members.
- [x] The app notifies all users when somebody is leaving the room.
- [x] Messages are checked for "a good language" before publishing (3rd-party lib).
- [x] Users can see their messages listed on UI with date and time when they were sent.
- [x] Users can share their current location.
- [x] Users can see the clickable link to the shared location.
- [x] Usernames are displayed near each message. For system messages and current user there are corresponding placeholders.
- [x] The messages of current user are highlighted to distinct from others.

The `main` implementation is based on **The complete Node.js Developer Course (3rd Edition) by Andrew Mead and Rob Percival** ([here](https://www.udemy.com/course/the-complete-nodejs-developer-course-2) on _Udemy_). It uses `Mustache` lib to render dynamic content on UI.

Note that styling of UI differs from the original version given in the course.

The alternative implementation with **React & Typescript** is in a separate branch `react`. React app is launched with `webpack`, `webpack-dev-server` and `babel`; no out-of-the-box solutions like CRA is used.

To run app in dev mode:

- on `main` branch (launches node server with nodemon)

```
cd server && npm run dev
```

- on `react` branch (launches separately FE and BE parts with the watch for changes and browser reload)

```
npm start
```

To debug BE functinality, on `main` branch run:

```
npm run debug
```

and open Node dev tools in Chrome. The app will re-run on change of a node codebase.
