import queryString from 'querystring'
const myParser = (req, res, next) => {
    let body = ''
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => {

        req.body = queryString.decode(body)
        next()
    })
    req.on('error', error =>{
        throw error
    })
}

export default myParser