# **Tic Tac Toe Online**

Online game where you can face off against AI or other players.

## **Live demo**
https://tic-tac-toe-online-11df9.web.app/

<img src="https://icon-library.com/images/under-construction-icon-png/under-construction-icon-png-15.jpg" width="100px">

![screenshot](screenshot.png)

## **Tech stack**
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)

## **App Feautures**
- Users sign in with Google account or with anonymous session. Authentication is handled by Firebase.
- Users, authenticaticated by Google account, can see and review their last PvP and PvE games.
- PvE mode vs AI.
- PvP mode vs other users. Users create a game room and one other player can join in.
 - All games are recorded in [Cloud Firestore](https://firebase.google.com/products/firestore?gclid=EAIaIQobChMIocGHrYni-QIVgc53Ch3uAwFSEAAYASAAEgKoPvD_BwE&gclsrc=aw.ds).

 ## **Start & watch**
```
$ npm start
```

## **Build for production**
```
$ npm run build
```

## **Test**
```
$ npm test
```