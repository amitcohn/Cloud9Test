// POC for mod1 calling mod2.
// load S2 so that S3 can call values from it - this loading method should be organized better.
var planUtil = require('./planUtil.js');
var s2 = require('./s2.js');
var p2 = new planUtil.Plan();
new s2.PlanMod(p2);

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
    // plan s3 uses ADOR from s2
    return p2.getAdorValue('A1') + 10;
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
