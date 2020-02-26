require('./model/mongodb');

const config = require('config');
const express = require('express');
const { urlencoded, json } = require('body-parser');

const authMiddleware = require("./middlewares/auth")

var app = express();
if(!config.get("jwtPrivateKey")){
    console.log('JWT PRIVATE KEY IS NOT DEFINED')
    process.exit(1)
} 

const userController = require('./controllers/UserController');
const communityController = require("./controllers/communityController")
const postController = require("./controllers/postController")
const tagController = require("./controllers/tagController")
const ComunityCategoryController = require("./controllers/CategoryController")
const ProfileController = require("./controllers/profileController")
const messagesController = require("./controllers/messageController")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","DELETE, POST, PUT, GET, UPDATE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-auth-token");
    next();
})

app.use(urlencoded({extended: true}));
app.use(json());

app.get('/', (req, res) => { res.send('Welcome to our app ........'); });


app.use('/api/users',userController)

app.use('/api/c_categories', ComunityCategoryController);
app.use('/api/communities', communityController);

app.use('/api/tags', tagController);
app.use('/api/posts', postController);

app.use('/api/profile', ProfileController);

app.use('/api/messages',authMiddleware, messagesController);


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
 
