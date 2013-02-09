/**
 * @author Mamut
 */
define( [
	"Models/LevelObject",
	"Models/LevelPhysicObject"
], function( LevelObject, LevelPhysicObject )
{
	ModelFactory = function() {};
	
	ModelFactory.prototype.createModel = function( def )
	{
		switch( def.modelClass )
		{
			case "LevelObject" :
				var model = new LevelObject( def.x, def.y, def.width, def.height );
				return model;
			case "LevelPhysicObject" :
				var model = new LevelPhysicObject( def.x, def.y, def.width, def.height );
				model.mass = def.mass;
				model.collideBits = def.collideBits;
				return model;
			default :
				throw new Error( "Model class " + def.modelClass + " is not supported." );
		}
	};
	
	return ModelFactory;
} );