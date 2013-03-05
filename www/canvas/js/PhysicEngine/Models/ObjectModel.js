ObjectModel = function()
{
    Rect.call( this );

    var _forces = null;

    this.nextPosition = new Vector2D();
    this.velocity = new Vector2D();
    this.mass = 1;
    this.contacts = new Contacts();
    this.objectFriction = -1;
    this.collideBits = 0;
    this.parentQuads = [];

    var that = this;

    function clampVelocity()
    {
        that.velocity.x = Math.max( -ObjectModel.MAX_VELOCITY.x, Math.min( ObjectModel.MAX_VELOCITY.x, that.velocity.x ) );
        that.velocity.y = Math.max( -ObjectModel.MAX_VELOCITY.y, Math.min( ObjectModel.MAX_VELOCITY.y, that.velocity.y ) );
    }

    function getFriction( axis )
    {
        if( -1 != that.objectFriction )
        {
            return that.objectFriction;
        }
        return that.contacts.hasContact( axis ) ? ObjectModel.CONTACT_FRICTION[axis] : ObjectModel.AIR_FRICTION;
    }

    this.updateTimePosition = function( frameTime )
    {
        clampVelocity();
        this.position = this.getTimePosition( frameTime );
    };

    this.updateTimeNextPosition = function( frameTime )
    {
        clampVelocity();
        this.nextPosition = this.getTimePosition( 1 - frameTime );
    };


    this.updateForces = function()
    {
        if( !this.hasMaxMass() )
        {
        	var force;
        	var velocity = this.velocity;
        	for( var i = 0, len = _forces.length; force = _forces[i], i < len; i++ ) {
        		velocity.x += force.x;
                velocity.y += force.y;
			}

            velocity.x *= getFriction( Vector2D.Y_AXIS );
            velocity.y *= getFriction( Vector2D.X_AXIS );
        }
    };

    this.resetForces = function()
    {
        _forces = new Array();
        this.addForce( PhysicController.GRAVITY );
    };

    this.addForce = function( force )
    {
        _forces.push( force );
    };

    this.resetForces();
};

extend( ObjectModel, Rect );

ObjectModel.MAX_VELOCITY = new Vector2D( 40, 40 );
ObjectModel.CONTACT_FRICTION = new Vector2D( 0.5, 0.9 );
ObjectModel.AIR_FRICTION = 0.95;

/* Update */
ObjectModel.prototype.updatePosition = function()
{
	this.position.x = this.nextPosition.x;
    this.position.y = this.nextPosition.y;
};

/* Override */
ObjectModel.prototype.checkOverriding = function()
{
    this.checkOverridingObjects( this.contacts.getObjects( Vector2D.X_AXIS, Rect.AXIS_MIN ) );
    this.checkOverridingObjects( this.contacts.getObjects( Vector2D.X_AXIS, Rect.AXIS_MAX ) );
    this.checkOverridingObjects( this.contacts.getObjects( Vector2D.Y_AXIS, Rect.AXIS_MIN ) );
    this.checkOverridingObjects( this.contacts.getObjects( Vector2D.Y_AXIS, Rect.AXIS_MAX ) );
};

ObjectModel.prototype.checkOverridingObjects = function( objects )
{
    var object;
	var checkOverriding = CollisionHelper.checkOverriding;
	var position = this.position;
	var size = this.size;
    for( var i = 0, len = objects.length; object = objects[i], i < len; i++ ) {
        if( checkOverriding( position, size, object.position, object.size ) )
        {
            raiseEvent( PhysicEvent.OVERRIDE, { objects: [this, object] } );
        }
	}
};

ObjectModel.prototype.collidesWith = function( object )
{
    var result = (this.collideBits & object.collideBits);
    return 0 != result;
};

/* Contacts */
ObjectModel.prototype.clearContacts = function()
{
    this.contacts.clear();
};

ObjectModel.prototype.getContactObjects = function( axis, position )
{
    var objects = new Array();
    objects.push( this );
    if( 0 != this.contacts.getObjects( axis, position ).length )
    {
    	var contactObjects = this.contacts.getObjects( axis, position );
    	var object;
	    for( var i = 0, len = contactObjects.length; object = contactObjects[i], i < len; i++ ) {
            objects = objects.concat( object.getContactObjects( axis, position ) );
		}
    }
    return objects;
};

/* Time Position */
ObjectModel.prototype.getTimePosition = function( frameTime )
{
    return new Vector2D( Math.round( this.position.x + frameTime * this.velocity.x ), Math.round( this.position.y + frameTime * this.velocity.y ) );
};

ObjectModel.prototype.hasMaxMass = function()
{
    return Number.MAX_VALUE == this.mass;
};