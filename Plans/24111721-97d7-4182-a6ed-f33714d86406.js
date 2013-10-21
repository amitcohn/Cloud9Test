
var _plan;
var P;

function PlanMod(plan)
{
    this.plan1 = 10;
    this.plan = _plan = P = plan;
    plan.addAdorAndDetails("FirstName", this.calc_FName, plan);
    plan.addAdorAndDetails("LastName", this.calc_LName, plan);
    plan.addAdorAndDetails("Company", this.calc_FullName, plan);
}

PlanMod.prototype.calc_FName = function()
{
    return P.FV('FirstName');
}

PlanMod.prototype.calc_LName = function()
{
    return P.FV('LastName');
}

PlanMod.prototype.calc_FullName = function()
{
    return P.ADOR("FirstName") + " " + P.ADOR("LastName");
}

module.exports.PlanMod = PlanMod;
