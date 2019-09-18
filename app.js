//App testing

const LogIn = require('./lib/login');
const configApp = require('./config/app.json');

const http = require('http');
var url = require('url');

//create a server object:
http.createServer(async function (req, res) {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    let code = query['code'];

    if(code){
        let authToken = await LogIn(0, configApp.clientId, configApp.clientSecret, code, configApp.callbackUrl)
        .catch(err => console.log(err));
        console.log(authToken);
    }

    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(3000); //the server object listens on port 8080

//https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=8714978096978885