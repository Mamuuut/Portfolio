PhysicController = function( context, gravity )
{
    var _nbCompute;
    var _objects = new Array();
    var _context = context;
    var _quadTree;

    function updateCollisions()
    {
        clearContacts();
        var minTimeCollision = _quadTree.getMinTimeCollision();
        if( null != minTimeCollision )
        {
            _nbCompute++;
            minTimeCollision.Collide();
            
            var objects = minTimeCollision.getObjects()
            var object;
            for( var i = 0, len = objects.length; object = objects[i], i < len; i++ ) {
				_quadTree.update( object );
			}

            updateCollisions();
        }
    }

    function clearContacts()
    { 
        var object;
        for( var i = 0, len = _objects.length; object = _objects[i], i < len; i++ ) {
            object.clearContacts();
		}
    }

    this.addObject = function( object )
    {
        _objects.push( object );
        _quadTree.insert( object );
    };

    this.removeObject = function( object )
    {
        var index = _objects.indexOf( object );
        _objects.splice( index, 1 );
    };

    this.clearObjects = function()
    {
        _quadTree = new QuadTree( 0, 0, _context.canvas.width, _context.canvas.height );
        _objects = new Array();
    };

    this.updatePhysic = function()
    {
        _nbCompute = 0;
           
        var object;
        for( var i = 0, len = _objects.length; object = _objects[i], i < len; i++ ) {
            object.updateForces();
            object.resetForces();
            object.updateTimeNextPosition( 0 );
            _quadTree.update( object );
		}

        updateCollisions();

		var object;
        var hasPositionChanged;
        for( var i = 0, len = _objects.length; object = _objects[i], i < len; i++ ) {
            object.updatePosition();
            object.checkOverriding();
		}
    };

    this.clearObjects();
    PhysicController.GRAVITY = null != gravity ? gravity : new Vector2D( 0, 3 );
};

PhysicController.GRAVITY = new Vector2D();
