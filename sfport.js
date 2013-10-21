var http = require('http');
var request = require('request');
var sf = require('node-salesforce');
var express = require('express');


var serverPort = (process.env.PORT ? process.env.PORT : 8126);  // 8124 unless running from C9

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
    var conn = new sf.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
      // loginUrl : 'https://test.salesforce.com'
      loginUrl: 'https://login.salesforce.com/services/Soap/u/28.0'
    });
    var username = "raneng@gmail.com";
    var password = "sfXmp9021G3VZEBbRaqmm0wVqZBMqWwcuE";

    conn.login(username, password, function(err, userInfo) {
      if (err) { return console.error(err); }
      // Now you can get the access token and instance URL information.

      // Save them to establish connection next time.
      //console.log(conn.accessToken);
      //console.log(conn.instanceUrl);
      // logged in user property
      //console.log("User ID: " + userInfo.id);
      //console.log("Org ID: " + userInfo.organizationId);
      // ...
/*      
      var records = [];
      conn.query("SELECT Id, Name FROM Account")
      .on("record", function(record) {
        records.push(record);
      })
      .on("end", function(query) {
        //console.log("total in database : " + query.totalSize);
        //console.log("total fetched : " + query.totalFetched);
        //console.log(records);
        for (var i=0; i < records.length; i++)
        {
            //console.log(records[i].Name);
        }
      })
      .on("error", function(err) {
        console.error(err);
      })
      .run({ autoFetch : true, maxFetch : 4000 }); // synonym of Query#execute();
*/
    //var recID_arr = [ recID ];
    res.writeHead(200, {'Content-Type': 'application/json'});
    var fields = ["FirstName", "LastName", "Company"];
    var AVL_arr = new Array();
    //var whereCondition = "id != '00Q7000000J9q3v'";
    var whereCondition = "status != 'blah'";
    if (recID)
    {
      whereCondition = "id = '" + recID + "'";
    }
    //console.log(recID_arr);
    //conn.sobject("Lead").retrieve(recID_arr, 
    conn.sobject("Lead")
  .select('*') // asterisk means all fields in specified level are target.
  //.where("CreatedDate = TODAY") // conditions in raw SOQL where clause.
  .offset(fromRec) // synonym of "skip"
  .limit(toRec-fromRec+1) // max records
  .where(whereCondition)
  .execute(
      function(err, accounts) {
        if (err) { return console.error(err); }
        for (var i=0; i < accounts.length; i++) {
          var rec = new Object();
          for (var j=0; j<fields.length; j++) {
            var fieldName = fields[j];
            rec[fieldName] = accounts[i][fieldName];        
          }
          AVL_arr[i] = rec;
          //console.log("Name : " + accounts[i].Name);
          //console.log(accounts[i]);
        }
        console.log(AVL_arr);
        var responseString = JSON.stringify(AVL_arr);
        res.end(responseString);
      });
    });
}
