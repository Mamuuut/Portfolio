LevelObject = function(view, model)
{
	this._view = view;
	this._model = model;
			
	//registerEventListener(PhysicEvent.COLLIDE, onCollide);
};		

LevelObject.prototype.updateView = function()
{
	this._view.x = this._model.position.x;
	this._view.y = this._model.position.y;
	this._view.width = this._model.size.x;
	this._view.height = this._model.size.y;
	this._view.draw();
};