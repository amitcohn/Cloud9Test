var cluster = require('cluster');
var fs = require('fs');

if(cluster.isMaster)
{
  // cluster master is just spawning listener servers
  
  var numCPUs = require('os').cpus().length;
  numCPUs = 1; // override when we want to disable clustering
  for (var i = 0; i < numCPUs; i++) {
	cluster.fork();
  }

  cluster.on('exit', function(worker,code, signal) {
	console.log('worker ' + worker.process.pid + ' died');
  });
}
else
{
	// let worker threads do all the work
	console.log("Starting worker server " + process.pid);

	var planUtil = require('./planUtil.js');
	var serverPort = (process.env.PORT ? process.env.PORT : 8124);  // 8124 unless running from C9
	console.log('Server running at port ' + serverPort + '...');
	
	var express = require('express');
	var app = express();
	app.configure(function()
	{
		app.use(express.static(__dirname + '/public'));
		app.use(express.bodyParser());
	});
	var fieldValues = {};
	var planName;
	var isSingleRecord = false;
	// POST command where the request parameters are in the request body
	app.post('/', function(req, res)
	{
		// This is the request coming from the PlanTech plugin, that expects a single record in the output.
		// So set isSingleRecord to true.
		isSingleRecord = true;
		var planID = req.body.PlanId;
		var jobID = req.body.JobId;
		var requestID = req.body.RequestId;
		var requestData = req.body.RequestData;
		fieldValues = req.body.RecipientData;
		planName = planID + ".js";
		console.log(fieldValues);
		if(requestID == 0) // For testing porposes just echo the fields values as the AVL
		{
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(fieldValues));
		}
		else
		{
			execNewPlan(planName, new Array(fieldValues), isSingleRecord, res);
		}
	});
	// POST command where the request parameters are in the URL in REST-style (good for data piping)
	app.post('/plans/:PlanID', function(req, res)
	{
		var planID = req.params.PlanID;
		fieldValues = req.body;
		planName = planID + ".js";
		execNewPlan(planName, fieldValues, isSingleRecord, res)
	});
	// GET command for testing
	app.get('/', function(req, res)
	{
		console.log("Serving request from " + process.pid);

		// load a plan module, according to the URL parameter 'plan'.
		// if the URL param specifies plan=x, then plan module x.js is loaded.
		var planName = req.param('plan');
		if (!planName) {
			planName = 's1.js'; // just a default
		}
		var fieldValuesFile = fs.readFileSync("ClientReq.json", 'utf8'); 
		var fieldValues = JSON.parse(fieldValuesFile).RecipientData; 
		execNewPlan(planName, new Array(fieldValues), isSingleRecord, res);
	});
	app.listen(serverPort);
	
	///////////////
	
	function execNewPlan(planName, fieldValues_arr, isSingleRecord, res)
	{

		var planFile = './Plans/' + planName;
		// the following line invalidates the module cache, so the plan module is reloaded with every call.
		// this is (1) for the POC to prove it's possible, (2) to make debugging easier.
		// eventually it should become an option, so the loaded usually caches the modules unless forced to refresh.
		delete require.cache[require.resolve(planFile)];
		// now load the plan file
		var planMod = require(planFile);
		// create a planUtil.plan object and pass it to the loaded plan module to use - it's a helper class.
		// TODO: create a better relationship between the module and the helper class, probably inherit from it.
		var p = new planUtil.Plan();
		new planMod.PlanMod(p);
		// the following line is a test for override capability: load a plan module then override (or add) an ADOR expression.
		//p.addAdorAndDetails("A1", function() { return 4; });
		// evaluate all ADORs, and return the result as JSON.
		//var responseString = JSON.stringify(p.evalRecord(fieldValues));
		var AVL_arr = new Array();
		for (var i=0; i<fieldValues_arr.length; i++)
		{
			AVL_arr[i] = p.evalRecord(fieldValues_arr[i]);
		}
		// write the AVL arrays as JSON
		res.writeHead(200, {'Content-Type': 'application/json'});
		if (isSingleRecord === true) { 
			// Return only a single (the first record), not an array.
			// This is a patch for the PlanTech plugin (TODO: fix)
			var responseString = JSON.stringify(AVL_arr[0]);
			res.end(responseString);
			return AVL_arr[0];
		}
		else { 
			// Return the full resut array
			var responseString = JSON.stringify(AVL_arr);
			res.end(responseString);
			return AVL_arr;
		}
	}
	
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}
