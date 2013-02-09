/**
 * @author Mamut
 */
define( [ 
	"Models/LevelObjectMixin"
], function( LevelObjectMixin )
{
	function LevelObject( x, y, width, height )
	{
	    Rect.call( this, x, y, width, height );
	};
	
	extend( LevelObject, Rect );
	augment( LevelObject, LevelObjectMixin );
	
	return LevelObject;
} );