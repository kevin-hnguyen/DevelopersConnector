#### Back-end

#### Front-end
In the root of the project, we create a new folder called `client`. That is the place we store the whole front-end app.
Back to the `root/package.json` file, we need to add 2 scripts:
```
    "client": "npm start --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
```
Why do we need `--prefix`? Because the front-end app is inside the `client` folder.
The `dev` script (used by `npm run dev`) is used to simultaneously run 2 apps.
Finally, in the `.gitignore` file, we need to tell git to ignore the new folder `root/client/node_modules`.
We then install some dependencies specific to the client side only.
(we could use fetch API though, but axios helps creating global headers and stuff => better)
```
cd client
npm install axios 
npm install react-router-dom
npm install redux
npm install react-redux
npm install redux-thunk
npm install redux-devtools-extension
npm install moment
npm install react-moment
```
Next, we delete all the trace of git in the `client` folder.
Finally, for our convenience, we do not want to repetitively type `http://localhost:5000` while using the `axios` library. Hence,
we will define a proxy in the `root/client/package.json` file:
```
"proxy": "http://localhost:5000"
```