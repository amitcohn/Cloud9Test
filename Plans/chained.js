var _plan;
var P;

function PlanMod(plan)
{
    this.plan1 = 10;
    this.plan = _plan = P = plan;
    plan.addAdorAndDetails("FName2", this.calc_FName, plan);
    plan.addAdorAndDetails("LName2", this.calc_LName, plan);
    plan.addAdorAndDetails("FullName2", this.calc_FullName, plan);
}

PlanMod.prototype.calc_FName = function()
{
    return P.FV('FName');
}

PlanMod.prototype.calc_LName = function()
{
    return P.FV('LName');
}

PlanMod.prototype.calc_FullName = function()
{
    return P.ADOR("FName2") + " " + P.ADOR("LName2");
}

module.exports.PlanMod = PlanMod;
