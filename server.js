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
				// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				if (body.length > 1e6)
				{
					// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
					request.connection.destroy();
				}
			}
		);
		request.on('end',
			function ()
			{
				response.writeHead(200, { 'Content-Type': 'text/plain' });
				response.end(body.toString());
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