
var _plan;
var P;

function PlanMod(plan)
{
    this.plan1 = 10;
    this.plan = _plan = P = plan;
    plan.addAdorAndDetails("FirstName", this.calc_FirstName, plan);
    plan.addAdorAndDetails("LastName", this.calc_LastName, plan);
    plan.addAdorAndDetails("FullName", this.calc_FullName, plan);
    plan.addAdorAndDetails("Company", this.calc_Company, plan);
    plan.addAdorAndDetails("City", this.calc_City, plan);
    plan.addAdorAndDetails("ZIP", this.calc_ZIP, plan);
    plan.addAdorAndDetails("Temp", this.calc_Temp, plan);
    plan.addAdorAndDetails("Distance", this.calc_Distance, plan);
    plan.addAdorAndDetails("DistanceMsg", this.calc_DistanceMsg, plan);    

    delete require.cache[require.resolve("./locinfo.js")];
}

PlanMod.prototype.calc_FirstName = function()
{
    return P.FV('FirstName');
}

PlanMod.prototype.calc_LastName = function()
{
    return P.FV('LastName');
}

PlanMod.prototype.calc_Company = function()
{
    return P.FV('Company');
}

PlanMod.prototype.calc_ZIP = function()
{
    return P.FV('PostalCode');
}

PlanMod.prototype.calc_City = function()
{
    return P.FV('City');
}

PlanMod.prototype.calc_FullName = function()
{
    return P.ADOR("FirstName") + " " + P.ADOR("LastName");
}

PlanMod.prototype.calc_Temp = function()
{
	var locinfo = require("./locinfo.js")
    //return 72;//P.FV();
    return locinfo.getWeather("07627");
}

PlanMod.prototype.calc_Distance = function()
{
	var xugHotelZip = "92802";
	var recipientZip = P.ADOR("ZIP");
	if (recipientZip == null)
	{
		return -1;
	}
	var locinfo = require("./locinfo.js")
    var distance = locinfo.getRoute(recipientZip, xugHotelZip);
    return Math.round(distance);
}

PlanMod.prototype.calc_DistanceMsg = function()
{
	var distanceKm = P.ADOR("Distance");
	//var geolib = require('geolib');
	//var distanceMiles = geolib.convertUnit('mi', distanceKm*1000, 5);
	//distanceMiles = Math.round(distanceMiles);
	var msg;
	msg = "Welcome to Anaheim " + P.ADOR("FirstName") + "!\n" + 
	      "You travelled " + distanceKm + " km to be here.\n";
	if (distanceKm == -1)
	{
		msg += "Thanks for coming!";
	}
	else if (distanceKm < 5)
	{
		msg += "Did you walk here from home?";
	}
	else if (distanceKm < 100)
	{
		msg += "You can make it home for dinner!";
	}
	else
	{
		msg += "Thanks for coming from that far!";
	}
	return msg;
}

module.exports.PlanMod = PlanMod;
