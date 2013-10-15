

////////////
function Field(name, fieldType)
{
    this.name = name;
    this.fieldType = fieldType;
}


////////////

function ADOR(name)
{
    this.name = name;
    this.value = undefined;
    this.isCalculated = false;
    this.calcFunc = undefined;
}

function ADOR(name, calcFunc, plan)
{
    this.name = name;
    this.value = undefined;
    this.isCalculated = false;
    this.calcFunc = calcFunc;
    this.plan = plan;
}

ADOR.prototype.getValue = function()
{
    if (!this.isCalculated)
    {
        this.calcValue();
    }
    return this.value;
}

ADOR.prototype.isCalculated = function()
{
    return this.isCalculated;
}

ADOR.prototype.calcValue = function()
{
    this.value = this.calcFunc();
    this.isCalculated = true;
}

////////////

function Plan()
{
    this.adorList = {};
    this.fieldList = {};
    this.fieldOrder = [];
    this.fieldValues = {};
}

Plan.prototype.evalRecord = function(fieldValues)
{
    this.fieldValues = fieldValues;
    this.resetAdorValues();
    for (var an in this.adorList)
    {
        this.adorList[an].getValue();
    }
    return this.getAllAdorValues();
}

Plan.prototype.resetAdorValues = function()
{
    for (var an in this.adorList)
    {
        this.adorList[an].value = undefined;
        this.adorList[an].isCalculated = false;
    }
}

Plan.prototype.getAdorList = function()
{
    return this.adorList;
}

Plan.prototype.getAdorValue = function(adorName)
{
    return this.adorList[adorName].getValue();
}
Plan.prototype.ADOR = function(adorName) //shortcut to getAdorValue()
{
    return this.getAdorValue(adorName);
}


Plan.prototype.getFieldValue = function(fieldName)
{
    return this.fieldValues[fieldName];
}
Plan.prototype.FV = function(fieldName) // shortcut to getFieldValue()
{ 
    return this.getFieldValue(fieldName);
}

Plan.prototype.getAllAdorValues = function()
{
    var adorValueList = {};
    for (var an in this.adorList)
    {
        adorValueList[an] = this.adorList[an].getValue();
    }
    return adorValueList;
}

Plan.prototype.addAdor = function(ador)
{
    this.adorList[ador.name] = ador;
}

Plan.prototype.addAdorAndDetails = function(adorName, calcFunc, plan)
{
    var ador = new ADOR(adorName, calcFunc, plan);
    this.adorList[ador.name] = ador;
}

Plan.prototype.addFieldAndDetails = function(fieldName, fieldType, plan)
{
    var field = new Field(fieldName, fieldType);
    this.fieldList[field.name] = field;
    this.fieldOrder.push(field.name);
}

function inherit(baseModFile, derivedCtor)
{
    var util = require('util');
    var baseMod = require(baseModFile); // importing the other plan
    util.inherits(derivedCtor,baseMod.PlanMod); // this will add the parent PlanMod prototype, so the constructor can call the parent methods
}

module.exports.ADOR = ADOR;
module.exports.Plan = Plan;
module.exports.Field = Field;
module.exports.inherit = inherit;

