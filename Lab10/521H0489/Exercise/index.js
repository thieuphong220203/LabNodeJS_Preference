require('dotenv').config()
const express = require("express")
const session = require('express-session');
const socketio = require("socket.io")
const db = require('./config/database');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');
const cookieParser = require('cookie-parser');
const ChatMessage = require('./models/ChatMessage');

db.connect();

const app = express()
app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


//auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URIS,
},
    function (accessToken, refreshToken, profile, done) {
        const user = {
            id: profile.id,
            displayName: profile.displayName,
        };

        return done(null, user);
    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['profile']
    }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})


const PORT = process.env.PORT || 8000
const httpServer = app.listen(PORT, () => console.log('http://localhost:' + PORT))
const io = socketio(httpServer)

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },

});

app.post('/upload', upload.single('image'), (req, res) => {
    const message = req.body.message;
    const imageFile = req.file;
    if (imageFile) {
        res.json({ message, image: imageFile.originalname });
    } else {
        res.json({ message });
    }
});





io.on('connection', client => {
    console.log(`Client ${client.id} connected`)

    client.free = true
    client.loginAt = new Date().toLocaleTimeString()

    let users = Array.from(io.sockets.sockets.values())
        .map(socket => ({ id: socket.id, username: socket.username, free: socket.free, loginAt: socket.loginAt }))


    client.on('disconnect', () => {
        console.log(`\t\t${client.id} has left`)
        client.broadcast.emit('user-leave', client.id)
    })

    client.on('register-name', username => {
        client.username = username

        client.broadcast.emit('register-name', { id: client.id, username: username })
    })
    client.emit('list-users', users)
    client.broadcast.emit('new-user', { id: client.id, username: client.username, free: client.free, loginAt: client.loginAt })

    client.on('chat_message', (message) => {
        const data = {
            username: client.username,
            message: message.message,
        };
        const chatMessage = new ChatMessage({
            text: message.message,
        });
        chatMessage
            .save()
            .then(() => {
                console.log('Added text successfully');
            })
            .catch((err) => {
                console.log('Error:', err);
            });

        client.broadcast.emit('chat_message', data);
    });
})
