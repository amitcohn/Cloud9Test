var http = require('http');
var request = require('request');
var sf = require('node-salesforce');
var express = require('express');


var serverPort = (process.env.PORT ? process.env.PORT : 8129);  // 8124 unless running from C9

var app = express();
app.configure(function()
{
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});
app.post('/', function(req, res)
{
    var recID = req.body.RecID;
});
app.get('/recs/:recID', function(req, res)
{
    var recID = req.params.recID;
    //recID = "00Q7000000J9q3v"; // "00Q7000000rjC4Q"
    //console.log(recID)
    getDataByIDs(res, recID);
});
app.get('/range/:from,:to', function(req, res)
{
    var fromRec = req.params.from;
    var toRec = req.params.to;
    console.log("Range request: from " + fromRec + " to " + toRec);
    //recID = "00Q7000000J9q3v"; // "00Q7000000rjC4Q"
    //console.log(recID)
    getDataByIDs(res, null, fromRec, toRec);
});
app.listen(serverPort);
console.log('Server running at port ' + serverPort + '...');



function getDataByIDs(res, recID, fromRec, toRec)
{

    var Twit = require('twit')

    var T = new Twit({
        consumer_key:         'FJU5MFTOcmnmhyuMphsOA'
      , consumer_secret:      'hU8Qhi3sBIdMWqoZ7QJ25JmfjcoR8hz8p1ZO37mU'
      , access_token:         '41874729-rf1U6gm3SF0SJJSaZvminMwlkcJG57n9NA3jKtiQU'
      , access_token_secret:  'lHOvdzVMtpXJRkYG0q3MrB40otu9bPzOHtgealPCZTVjf'
    })

    var AVL_arr = new Array();

    T.get('search/tweets', { q: '#XUGanaheim13', count: 3 }, function(err, reply) {
      for (var i=0; i<reply.statuses.length; i++)
      {
        console.log(reply.statuses[i].user.name);
        var rec = new Object();
        rec.FirstName = reply.statuses[i].user.name;
        rec.LastName = "";
        rec.City = "";
        rec.Company = "";
        rec.PostalCode = "92802";
        AVL_arr[i] = rec;
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      var fields = ["FirstName", "LastName", "Company", "City", "PostalCode"];
      console.log(AVL_arr);
      var responseString = JSON.stringify(AVL_arr);
      res.end(responseString);
    })

    
}
