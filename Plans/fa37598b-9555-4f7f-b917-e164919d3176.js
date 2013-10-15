
var _plan;
var P;

function PlanMod(plan)
{
    this.plan1 = 10;
    this.plan = _plan = P = plan;
    plan.addAdorAndDetails("FName", this.calc_FName, plan);
    plan.addAdorAndDetails("LName", this.calc_LName, plan);
    plan.addAdorAndDetails("FullName", this.calc_FullName, plan);
}

PlanMod.prototype.calc_FName = function()
{
    return P.FV('f_name');
}

PlanMod.prototype.calc_LName = function()
{
    return P.FV('l_name');
}

PlanMod.prototype.calc_FullName = function()
{
    return P.ADOR("FName") + " " + P.ADOR("LName");
}

module.exports.PlanMod = PlanMod;
