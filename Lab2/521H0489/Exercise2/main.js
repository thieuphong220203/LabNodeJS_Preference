const http = require('http');
const URL = require('url');
const queryString = require('querystring');
const fs = require('fs');
const path = require('path')

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })

    let { pathname, _ } = URL.parse(req.url, true);

    if (pathname === '/') {
        let html = fs.readFileSync(path.join(__dirname, 'views/login.html'))
        return res.end(html)
    }
    else if (pathname === '/login') {
        return processLogin(req, res)
    }

    let html = fs.readFileSync(path.join(__dirname, 'views/error.html')).toString().replace('replace', 'Invalid Path');
    return res.end(html)

});

function processLogin(req, res) {
    let fail = fs.readFileSync(path.join(__dirname, 'views/error.html')).toString();
    if (req.method !== 'POST') {
        return res.end(fail.replace('replace', `Method ${req.method} is not supported`))
    }

    let string = '';
    req.on('data', data => string += data.toString());
    req.on('end', () => {
        let { inputEmail, inputPassword } = queryString.decode(string);

        if (!inputEmail) {
            return res.end(fail.replace('replace', `Missing email`))
        }
        if (!inputPassword) {
            return res.end(fail.replace('replace', `Missing Password`))
        }
        if (!inputEmail && !inputPassword) {
            return res.end(fail.replace('replace', `Missing email and password`))
        }
        if (inputPassword < 6) {
            return res.end(fail.replace('replace', `Password has the least at 6 words`))
        }
        if (inputEmail !== 'admin@gmail.com') {
            return res.end(fail.replace('replace', `Username is wrong`))
        }
        if (inputPassword !== '123qwe') {
            return res.end(fail.replace('replace', `Password is wrong`))
        }

        return res.end(fs.readFileSync(path.join(__dirname, 'views/success.html')));
    })
}

server.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
});
