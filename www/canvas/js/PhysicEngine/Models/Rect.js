Rect = function( x, y, width, height )
{
	this.size = new Vector2D( width, height );
	this.position = new Vector2D( x, y );
};

Rect.prototype.getLeftTop = function( axis )
{
	return this.position[ axis ];
};

Rect.prototype.getRightBottom = function( axis )
{
	return this.position[ axis ] + this.size[ axis ];
};

Rect.AXIS_MIN = "axis_min"; // Left or Top
Rect.AXIS_MAX = "axis_max"; // Right or Bottom