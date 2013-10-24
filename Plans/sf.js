
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
	var d = P.ADOR("Distance");
	var msg;
	if (d == -1)
	{
		msg = "Home is... somewhere"
	}
	else if (d < 100)
	{
		msg = "Home is close by";
	}
	else
	{
		msg = "Far from home";
	}
	return msg;
}

module.exports.PlanMod = PlanMod;
