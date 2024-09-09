require('dotenv')
const express = require('express')
const AccountRouter = require('./routers/AccountRouter')
const cookieParser = require('cookie-parser')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const fs = require('fs')
const Path = require('path')
const rateLimit = require('express-rate-limit')
const fileReader = require('./Util/fileReader')
const fileDelete = require('./Util/fileDelete')
const multer = require('multer')
const FileSystem = require('fs');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
})

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('hohuuan'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
app.use(limiter)
app.use(csrfProtection);


const uploader = multer({ dest: __dirname + "/uploads/" })

app.use((req, res, next) => {
    req.vars = { root: __dirname }
    next()
})

app.use('/user', AccountRouter)

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

const getCurrentDir = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    const { root } = req.session.user
    let { dir } = req.query
    if (dir === undefined) {
        dir = ''
    }
    console.log(dir)

    let currentDir = Path.join(root, dir)
    if (!fs.existsSync(currentDir)) {
        currentDir = root
    }

    req.vars.currentDir = currentDir
    req.vars.root = root
    next();
}

app.get('/', getCurrentDir, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/user/login')
    }

    let { root, currentDir } = req.vars
    console.log("Folder: ", currentDir)
    fileReader.load(root, currentDir)
        .then(files => {
            const user = req.session.user
            res.render('index', { user, files })
        })
})

app.post('/upload', uploader.single('attachment'), (req, res) => {
    const { email, path } = req.body
    const file = req.file

    if (!email || !path || !file) {
        return res.json({ code: 1, message: "Invalid information" })
    }
    const { root } = req.vars
    const currentPath = Path.join(root, "users", email, path)

    console.log(currentPath)

    if (!fs.existsSync(currentPath)) {
        return res.json({ code: 2, message: "Path does not exist" })
    }

    let name = file.originalname
    let newPath = Path.join(currentPath, name)

    fs.renameSync(file.path, newPath)

    return res.json({ code: 0, message: "Upload Successfully at " + newPath })

})


app.post('/delete', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'User not authenticated' });
    }

    const { filePath } = req.body;

    if (!fs.existsSync(filePath)) {
        return res.json({ success: false, message: 'File not found' });
    }

    console.log(filePath)
    fileDelete.deleteFile(filePath)
        .then(() => {
            return res.json({ success: true, message: 'File has been deleted successfully' });
        })
        .catch((err) => {
            return res.json({ success: false, message: 'File deletion failed: ' + err.message });
        });
});


app.post('/rename', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'User not authenticated' });
    }

    const { filePath, newFileName } = req.body;

    const newFilePath = filePath.replace(/[^\\]+$/, newFileName);
    console.log(newFilePath)
    if (!fs.existsSync(filePath)) {
        return res.json({ success: false, message: 'File not found' });
    }

    FileSystem.rename(filePath, newFilePath, (err) => {
        if (err) {
            return res.json({ success: false, message: 'File renaming failed: ' + err.message });
        } else {
            return res.json({ success: true, message: 'File has been renamed successfully' });
        }
    });
});

app.get('/download', (req, res) => {
    const filePath = req.query.filePath; 

    const isFolder = fs.lstatSync(filePath).isDirectory();

    if (isFolder) {
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });
        archive.directory(filePath, 'folder'); 

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=folder.zip`);

        archive.pipe(res);
        archive.on('end', () => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting zip file:', err);
                }
            });
        });
        archive.finalize();
    } else {
        const fileName = filePath.split('/').pop();
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        fs.createReadStream(filePath).pipe(res);
    }
});

app.post('/create-folder', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'User not authenticated' });
    }

    const { email, path, folderName } = req.body;

    if (!email || !path || !folderName) {
        return res.json({ success: false, message: 'Invalid information' });
    }

    const { root } = req.vars;
    const currentPath = Path.join(root, 'users', email, path, folderName);

    fs.mkdirSync(currentPath);

    return res.json({ success: true, message: 'Folder created successfully' });
});

app.post('/create-text-file', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, message: 'User not authenticated' });
    }

    const { email, path, fileName, content } = req.body;

    if (!email || !path || !fileName) {
        return res.json({ success: false, message: 'Invalid information' });
    }

    const { root } = req.vars;
    const currentPath = Path.join(root, 'users', email, path, fileName);

    fs.writeFileSync(currentPath, content || '');

    return res.json({ success: true, message: 'Text file created successfully' });
});



app.use((req, res) => {
    res.set('Content-Type', 'text/html')
    res.render("error")
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`http://localhost:${port}`))

