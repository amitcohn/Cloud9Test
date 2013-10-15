var util = require('util');
//var planUtil = require('./planUtil');


function PlanMod(plan)
{
    this.plan2 = 20;
    //planUtil.inherit('./s1.js', this.PlanMod);
    PlanMod.super_.call(this,plan); // calling super class, so it's ADORs are added
    plan.addAdorAndDetails("A4", this.calc_A4, plan);
    console.log(this.plan1 + this.plan2);
}

var s1PlanModule = require('./s1.js'); // importing the other plan
util.inherits(PlanMod,s1PlanModule.PlanMod); // this will add the parent PlanMod prototype, so the constructor can call the parent methods

PlanMod.prototype.calc_A4 = function()
{
    return 4;
}

module.exports.PlanMod = PlanMod;

