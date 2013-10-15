// lib functions
function planInherit(inPlanMod, inOthePlanModulePath)
{
    var util = require('util');
    var otherModule = require(inOthePlanModulePath); // importing the other plan
    util.inherits(inPlanMod,otherModule.PlanMod); // this will add the parent PlanMod prototype, so the constructor can call the parent methods
}


function PlanMod(plan)
{
   PlanMod.super_.call(this,plan); // calling super class, so it's ADORs are added
   plan.addAdorAndDetails("A4", this.calc_A4, plan);
   plan.addAdorAndDetails("FName", this.calc_FName, plan);
}

planInherit(PlanMod,'./s1.js');

PlanMod.prototype.calc_A4 = function()
{
    return 4;
}

PlanMod.prototype.calc_FName = function()
{
    // plan s4 override ADOR from s1
    return "Amit";
}

module.exports.PlanMod = PlanMod;

