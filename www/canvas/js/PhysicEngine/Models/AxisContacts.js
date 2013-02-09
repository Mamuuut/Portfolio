AxisContacts = function()
{   
	this.axis_min = new Array();
	this.axis_max = new Array();
};

AxisContacts.prototype.addContact = function(object, position)
{
	this[position].push(object);
};