var http = require('http');
var port = process.env.PORT;

http.createServer(
function (request, response)
{
	if (request.method == 'POST')
	{
		var body = '';
		request.on('data',
			function (data)
			{
				body += data;
				if (body.length > 1e7/*~10M*/) // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
					request.connection.destroy();
			}
		);
		request.on('end',
			function ()
			{
				response.writeHead(200, { 'Content-Type': 'text/plain' });
				response.end(JSON.stringify(HandleRequest(JSON.parse(body.toString()))));
			}
		);
	}
	else
	{
	    response.writeHead(200, { 'Content-Type': 'text/plain' });
		response.end('support only POST requests\n');
	}
}
).listen(port);

function HandleRequest(inRequestObj)
{
	return inRequestObj; // for the sample just return back the request as is
}