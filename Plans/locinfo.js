var http = require('http');
//var httpsync = require('httpsync');

function getRoute(zip1, zip2)
{
    // do the GET request
    var httpsync = require('httpsync');
    var url = "http://maps.googleapis.com/maps/api/directions/json?origin=" + zip1 + "&destination=" + zip2 + "&sensor=false";
    var req = httpsync.get({ url : url });
    var resp = req.end();
    var respJS = JSON.parse(resp.data);
    //var addressFields = respJS['results'][0]['address_components'][1];
    //city = respJS['results'][0]['address_components'][1]['long_name'];
    //console.log(url);
    //console.log(respJS);
    var distanceMeters = respJS["routes"][0]["legs"][0]["distance"]["value"];
    //var distanceMiles = 0.00062137 * distanceMeters;
    //console.log(zip1 + " --> " + zip2 + ": Distance: " + distanceMiles);
    return distanceMeters/1000.0;
    //return city;
}

function getWeather(zip)
{
    var weathers = require('weathers');

    weathers.getWeather("40.9530599", "-73.95354569999999", function(err, data){
      var description = data["currentobservation"]["Weather"];
      console.log(description);
      return description;
    });
}

function getcity(zip)
{
    // do the GET request
    var resp = '';
    var city = "";

    var httpsync = require('httpsync');
    var req = httpsync.get({ url : "http://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&sensor=true"});
    var resp = req.end();
    var respJS = JSON.parse(resp.data);
    var addressFields = respJS['results'][0]['address_components'][1];
    city = respJS['results'][0]['address_components'][1]['long_name'];
    console.log(respJS);
    return city;
}

function getcityAsync(zip)
{
    var optionsget = {
        host : 'maps.googleapis.com', // here only the domain name
        // (no http/https !)
        port : 80,
        path : '/maps/api/geocode/json?address=10017&sensor=true', // the rest of the url with parameters if needed
    };
    //http://maps.googleapis.com/maps/api/geocode/json?address=10017&sensor=true
    //console.info('Options prepared:');
    //console.info(optionsget);
    //console.info('Do the GET call');
    
    // do the GET request
    var resp = '';
    var city = "Motza";
    var reqGet = http.get(optionsget, function(res) {
                               //console.log("statusCode: ", res.statusCode);
                               // uncomment it for header details
                               //	console.log("headers: ", res.headers);
                               
                               res.on('data', function(d) {
                                      //console.info('GET result:\n');
                                      //process.stdout.write(d);
                                      //console.info('\n\nCall completed');
                                      resp += d;
                                      });
                               
                               res.on('end', function() {
                                        var respJS = JSON.parse(resp);
                                        city = respJS['results'][0]['address_components'][1]['long_name'];
                                        console.log(city);
                                        //return city;
                                      });
                               });
    
    return city;
    reqGet.on('error', function(e) {
              console.error(e);
              });
}

module.exports.getcity = getcity;
module.exports.getRoute = getRoute;
module.exports.getWeather = getWeather;

