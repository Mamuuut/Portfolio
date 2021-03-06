Collision = function(objectA, objectB, axis, time)
{
	var time = time; // from 0 to 1
	var axis = axis; // x or y 
	var objectA = objectA;
	var objectB = objectB;
	
	function getObjects()
	{
		var minContactObjects = objectA.getContactObjects( axis, Rect.AXIS_MIN );
		var maxContactObjects = objectB.getContactObjects( axis, Rect.AXIS_MAX );
		return minContactObjects.concat( maxContactObjects );
	};
	
	function getNextVelocity()
	{
		return Math.round( getPonderatedVelocity() / getMassSum() );
	};
		
	function getMassSum()
	{
		var massSum = 0;
		var objects = getObjects()
        var object;
        for( var i = 0, len = objects.length; object = objects[i], i < len; i++ ) {
			if ( object.hasMaxMass() )
			{
				return 1;
			}
			massSum += object.mass;
		}

		return massSum;
	};
		
	function getPonderatedVelocity()
	{
		var ponderatedVelocity = 0;
		
		var objects = getObjects()
        var object;
        for( var i = 0, len = objects.length; object = objects[i], i < len; i++ ) {
			if ( object.hasMaxMass() )
			{
				return object.velocity[axis];
			}
			ponderatedVelocity += object.mass * object.velocity[axis];
		}
		
		return ponderatedVelocity;
	};
		
	this.Collide = function()
	{
		var nextVelocity = getNextVelocity();
		
		var objects = getObjects()
        var object;
        for( var i = 0, len = objects.length; object = objects[i], i < len; i++ ) {
			object.updateTimePosition( time );
            //TODO : check prevVelocity utility: 
            //object.prevVelocity = new Vector2D( object.velocity.x, object.velocity.y );
			object.velocity[axis] = nextVelocity;
			object.updateTimeNextPosition( time );
		}
		
		raiseEvent( PhysicEvent.COLLIDE, { objects: [objectA, objectB] } );
	};
	
	this.getTime = function()
	{
		return time;
	};
	
	this.getObjects = function()
	{
		return getObjects();
	};
}