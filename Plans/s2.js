
var _plan;

function PlanMod(plan)
{
    this.plan = _plan = plan;
    plan.addAdorAndDetails("A1", this.calc_A1, plan);
    plan.addAdorAndDetails("A2", this.calc_A2, plan);
    plan.addAdorAndDetails("A3", this.calc_A3, plan);
}

PlanMod.prototype.calc_A1 = function()
{
    return 1;
}

PlanMod.prototype.calc_A2 = function()
{
    return _plan.getAdorValue("A1") + 1;
}

PlanMod.prototype.calc_A3 = function()
{
    return _plan.getAdorValue("A2") + 1;
}

module.exports.PlanMod = PlanMod;
