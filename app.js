//Access Token:APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//User Id:469263818
//Nickname:ALJO8929348

//AppId: 8714978096978885
//Secret: T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v

//Auth Token: TG-5d755427dbc4b80006e36c46-469263818

//https://developers.mercadolibre.com.mx/es_mx/autenticacion-y-autorizacion/#obtener_token

//curl -X POST -H "Content-Type: application/json" -d '{"site_id":"MLM"}' https://api.mercadolibre.com/users/test_user?access_token=APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//curl -X POST -H "Content-Type: application/json" -d '{"site_id":"MLM"}' https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=8714978096978885&client_secret=T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v&code=TG-5d755427dbc4b80006e36c46-469263818&redirect_uri=localhost:300
//https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=APP_USR-8714978096978885-090819-a045fa15acb13d110d2f6691c7f4edff-469263818
//Test user
//{"id":469261720,"nickname":"TETE9841944","password":"qatest960","site_status":"active","email":"test_user_29952594@testuser.com"}


//https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=8714978096978885&client_secret=T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v&code=SERVER_GENERATED_AUTHORIZATION_CODE&redirect_uri=

var meli = require('mercadolibre'); 

const client_id = 'APP_USR-8714978096978885-090818-8669777eecd61caf2038eeae7732449a-469263818';
const client_secret = 'T9DbCl2dAEeKZtqMFZYWZQSrHYgoE28v';
const access_token = '';
const refresh_token = '';

var meliObject = new meli.Meli(client_id, client_secret);//, access_token, refresh_token);

var redirect_uri = meliObject.getAuthURL();


meliObject.authorize('TG-5d755427dbc4b80006e36c46-469263818', redirect_uri, (result) => {
    var r = result;
} ) 