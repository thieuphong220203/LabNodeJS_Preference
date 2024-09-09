const http = require('http');
const URL = require('url');
const queryString = require('querystring');

let students = new Map();
let pattern = /\/students\/[a-zA-Z0-9]+\/*$/ig
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })

    let { pathname, _ } = URL.parse(req.url, true);
    if (pathname === '/students' && req.method === 'GET') {
        return getStudent(req, res);
    }
    else if (pathname === '/students' && req.method === 'POST') {
        return addStudent(req, res);
    }
    else if (pathname === '/students') {
        return res.end(JSON.stringify({ code: 101, message: "This method is not supported at /students" }))
    }
    else if (pathname.match(pattern)) {
        let studentId = pathname.slice(10);
        // let idPattern = /[a-zA-Z0-9]+\/*$/ig
        // let studentId = pathname.match(idPattern)[0].replace(/\/*$/ig, '')
        if (req.method === 'GET') {
            return studentWithId(req, res, studentId);
        }
        else if (req.method === 'PUT') {
            return updateStudent(req, res, studentId)
        }
        else if (req.method === 'DELETE') {
            return deleteStudent(req, res, studentId);
        }
        else return res.end(JSON.stringify({ code: 101, message: `This method is not supported at /students/${studentId}` }))
    }
    return res.end(JSON.stringify({ code: 100, message: "The path is not supported" }))
});

function getStudent(req, res) {
    if (students.size === 0) {
        return res.end(JSON.stringify({ code: 102, message: "Not students in data yet" }))
    }
    let studentList = Array.from(students.values())
    // console.log(studentList)
    return res.end(JSON.stringify({ studentList }))
}

function addStudent(req, res) {
    let body = ''
    req.on('data', data => body += data.toString());
    req.on('end', () => {
        let { id, name, age } = queryString.decode(body);

        if (!id) {
            return res.end(JSON.stringify({ code: 1, message: "Not student id yet" }))
        }
        if (!name) {
            return res.end(JSON.stringify({ code: 1, message: "Not student name yet" }))
        }
        if (!age) {
            return res.end(JSON.stringify({ code: 1, message: "Not student age yet" }))
        }
        if (Number.isInteger(age)) {
            return res.end(JSON.stringify({ code: 1, message: "Age of Student is incorrect format" }))
        }
        if (age < 15 || age > 100) {
            return res.end(JSON.stringify({ code: 1, message: "Range of age must be from 15 to 100" }))
        }
        if (students.has(id)) {
            return res.end(JSON.stringify({ code: 2, message: `Student associated with id: ${id} has been already existed` }))
        }

        students.set(id, { id, name, age });
        return res.end(JSON.stringify({ code: 0, message: "Added student Successfully" }))
    })
}

function studentWithId(req, res, studentId) {
    if (!students.has(studentId)) {
        return res.end(JSON.stringify({ code: 103, message: `Not found student with id: ${studentId}` }))
    }
    return res.end(JSON.stringify({
        code: 103,
        message: `Found student with id: ${studentId}`,
        data: students.get(studentId)
    }))
}

function updateStudent(req, res, studentId) {
    if (!students.has(studentId)) {
        return res.end(JSON.stringify({ code: 104, message: `Not found student with id: ${studentId}` }))
    }
    let body = ''
    req.on('data', data => body += data.toString());
    req.on('end', () => {
        let { name, age } = queryString.decode(body);

        if (!name) {
            return res.end(JSON.stringify({ code: 104, message: "Not student name yet" }))
        }
        if (!age) {
            return res.end(JSON.stringify({ code: 104, message: "Not student age yet" }))
        }
        if (Number.isInteger(age)) {
            return res.end(JSON.stringify({ code: 104, message: "Age of Student is incorrect format" }))
        }
        if (age < 15 || age > 100) {
            return res.end(JSON.stringify({ code: 104, message: "Range of age must be from 15 to 100" }))
        }

        students.get(studentId).name = name;
        students.get(studentId).age = age;
        return res.end(JSON.stringify({
            code: 104,
            message: ": Updates information for a student successfully",
            student: students.get(studentId)
        }))
    })
}

function deleteStudent(req, res, studentId) {
    if (!students.has(studentId)) {
        return res.end(JSON.stringify({ code: 105, message: `Not found student with id: ${studentId}` }))
    }
    students.delete(studentId)
    let studentList = Array.from(students.values())

    return res.end(JSON.stringify({
        code: 105,
        message: `Delete student with id: ${studentId}`,
        student: studentList
    }))

}
server.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
});
