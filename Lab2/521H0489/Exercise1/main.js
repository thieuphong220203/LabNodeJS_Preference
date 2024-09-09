const http = require('http');
const URL = require('url');
const queryString = require('querystring');

const server = http.createServer( (req, res) => {

    const url = URL.parse(req.url)

    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })

    if (url.pathname === '/'){
        return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exercise 1 - Lab 1</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
            <div class="container p-5">
                <h2>Simple Calculations</h2>
                <form action="/result" method="get">
                    <table class="table-hover">
                        <tr >
                            <td class="p-2">Number 1</td>
                            <td class="p-2"><input type="text"  name="numberOne" placeholder="Number 1"></td>
                        </tr>
                        <tr>
                            <td class="p-2">Number 2</td>
                            <td class="p-2"><input type="text"  name="numberTwo" placeholder="Number 2"></td>
                        </tr>
                        <tr>
                            <td class="p-2">Operation</td>
                            <td class="p-2">
                                <select name="Operation" id="Operation">
                                    <option value="">Choose Operation</option>
                                    <option value="+">Addition</option>
                                    <option value="-">Subtraction</option>
                                    <option value="*">Multiplication</option>
                                    <option value="/">Division</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="p-2"></td>
                            <td class="p-2"><button type="submit" class="btn btn-success">Calculate</button></td>
                        </tr>
                    </table>
                </form>
            </div>
        </body>
        </html>
        `);
    }
    
    if (url.pathname === '/result'){
        let {numberOne, numberTwo, Operation} = queryString.decode(url.query)

        if(!numberOne){
            return res.end("Missing first parameter")
        }

        if(!numberTwo){
            return res.end("Missing second parameter")
        }

        if(!Operation){
            return res.end("Missing operator parameter")
        }
        // let operations = ['+', '-', '*', '/']
        // if (operations.indexOf(Operation) === -1){
        //     return res.end("Invalid operation")
        // }
        numberOne = parseInt(numberOne);
        numberTwo = parseInt(numberTwo);
        let result = 0
        switch (Operation) {
            case '+':
                result = numberOne + numberTwo;
                break;
            case '-':
                result = numberOne - numberTwo;
                break;
            case '*':
                result = numberOne * numberTwo;
                break;
            case '/':
                if (numberTwo === 0){
                    return res.end("The second parameter is zero");
                }
                result = numberOne / numberTwo;
                break;
            default:
                break;
        }
        return res.end(`Result: ${numberOne} ${Operation} ${numberTwo} = ${result}`);
    }

    res.end('Invalid path')
});

server.listen( 8080, () => {
    console.log('Server is running at http://localhost:8080'); 
});
