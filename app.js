//App testing

const LogIn = require('./lib/login');
const config_app = require('./config/app.json');

const http = require('http');
var url = require('url');

//create a server object:
http.createServer(function (req, res) {
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    let code = query['code'];

    if(code){
        LogIn(0, config_app.client_id, config_app.client_secret, code, config_app.callbackUrl);
    }

    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(3000); //the server object listens on port 8080