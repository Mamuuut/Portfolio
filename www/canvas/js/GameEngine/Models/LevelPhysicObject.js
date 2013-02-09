/**
 * @author Mamut
 */
define( [ 
	"Models/LevelObjectMixin"
], function( LevelObjectMixin )
{

	function LevelPhysicObject( x, y, width, height )
	{
	    ObjectModel.call( this );
	    
	    this.size = new Vector2D( width, height );
		this.position = new Vector2D( x, y );
		this.supportPhysic = true;
	};
	
	extend( LevelPhysicObject, ObjectModel );
	augment( LevelPhysicObject, LevelObjectMixin );

	return LevelPhysicObject;
} );