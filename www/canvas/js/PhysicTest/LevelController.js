LevelController = function(context) {
	this.pause = true;

	this._context = context;
	this._physicController = new PhysicController(context);

	this.clearLevel();
	
	var that = this;
	window.setInterval( function() { that.updateLevel() }, 1000 / 30);
	
	this.updateLevel();

    this._nbFrameLeft = undefined;
    this._callback = undefined;
};

LevelController.BOX_SIZE = 20;

LevelController.prototype.clearLevel = function() {
	this._physicController.clearObjects();
	this._levelObjects = [];
};

LevelController.prototype.addRandomObjects = function( nbObjects ) {
    this._physicController.clearObjects();
	PhysicController.GRAVITY = new Vector2D( 0, 0 );
	ObjectModel.AIR_FRICTION = 1;
	ObjectModel.CONTACT_FRICTION = new Vector2D( 1, 1 );
	var i = 0;
	for( i = 0; i < nbObjects; i++ ) {
		this.addRandomObject();
	}
};

LevelController.prototype.addRandomObject = function() {
	var objectView = new ObjectView(this._context);
	objectView.color = '#' + (Math.random()*0xFFFFFF<<0).toString(16);
	
	var objectModel = new ObjectModel();
	objectModel.position.x = Math.round( Math.random() * ( this._context.canvas.width - LevelController.BOX_SIZE ) );
	objectModel.position.y = Math.round( Math.random() * ( this._context.canvas.height - LevelController.BOX_SIZE ) );
	objectModel.size.x = LevelController.BOX_SIZE;
	objectModel.size.y = LevelController.BOX_SIZE;
	var velocity = new Vector2D( ( Math.random() * 10) - 5, ( Math.random() * 10 ) - 5 );
	objectModel.velocity = velocity;
	objectModel.collideBits = 1;
	objectModel.mass = 1;
			
	this.addObject(objectView, objectModel);
};

LevelController.prototype.testXCollisions = function() {
    this._physicController.clearObjects();
	PhysicController.GRAVITY = new Vector2D(0,0);
	ObjectModel.AIR_FRICTION = 1;
	ObjectModel.CONTACT_FRICTION = new Vector2D(1, 1);
	
	this.addCollidingObject( 20, 20, new Vector2D( 20, 20 ), new Vector2D( 4, 0 ), "#FF0000" );
	this.addCollidingObject( 20, 20, new Vector2D( 40, 41 ), new Vector2D( 6, 0 ), "#FFFF00" );
	this.addCollidingObject( 20, 20, new Vector2D( 220, 30 ), new Vector2D( 0, 0 ), "#00FF00" );
	this.addCollidingObject( 20, 20, new Vector2D( 320, 20 ), new Vector2D( -12, 0 ), "#00FFFF" );
	 
	this.addCollidingObject( 20, 20, new Vector2D( 20, 120 ), new Vector2D( 0, 0 ), "#000000", Number.MAX_VALUE );
	this.addCollidingObject( 20, 20, new Vector2D( 120, 120 ), new Vector2D( 4, 0 ), "#FFFF00",2 );
	this.addCollidingObject( 20, 20, new Vector2D( 220, 120 ), new Vector2D( 0, 0 ), "#00FF00" );
	this.addCollidingObject( 20, 20, new Vector2D( 320, 120 ), new Vector2D( -4, 0 ), "#00FFFF" );
	this.addCollidingObject( 20, 20, new Vector2D( 420, 120 ), new Vector2D( -20, 0 ), "#0000FF", 2 );
	
};

LevelController.prototype.testGravity = function() {
    this._physicController.clearObjects();
	PhysicController.GRAVITY = new Vector2D(0,3);
	ObjectModel.AIR_FRICTION = 0.95;
	
	this.addCollidingObject( 800, 20, new Vector2D( 0, 300 ), new Vector2D( 0, 0 ), "#000000", Number.MAX_VALUE, 3 );
	this.addCollidingObject( 20, 20, new Vector2D( 40, 20 ), new Vector2D( 0, 0 ), "#FF0000", 1, 1 );
	this.addCollidingObject( 20, 20, new Vector2D( 40, 160 ), new Vector2D( 0, -20 ), "#FFFF00", 1, 1 );
	this.addCollidingObject( 20, 20, new Vector2D( 80, 160 ), new Vector2D( 20, -20 ), "#00FF00", 1, 1 );
};

LevelController.prototype.addCollidingObject = function(width, height, position, velocity, color, mass, collideBits) 
{
	var objectView = new ObjectView(this._context);
	objectView.color = color;
	
	var objectModel = new ObjectModel();
	objectModel.size = new Vector2D( width, height );
	objectModel.position = position;
	objectModel.velocity = velocity;
	objectModel.mass = mass || 1;
	objectModel.collideBits = collideBits || 1;
	
	return this.addObject(objectView, objectModel);
};

LevelController.prototype.addObject = function( objectView, objectModel ) {
	var levelObject = new LevelObject( objectView, objectModel );
	this._levelObjects.push( levelObject );
	this._physicController.addObject( objectModel );
	return levelObject;
};

LevelController.prototype.nextFrame = function() {
    if( undefined !== this._nbFrameLeft )
    {
        this._nbFrameLeft--;
        if( 0 == this._nbFrameLeft )
        {
            this.pause = true;
            this.nbFrameLeft = undefined;
            if( this._callback )
            {
                this._callback();
                this._callback = undefined;
            }
        }
    }

	this._physicController.updatePhysic();
	
	this._context.clearRect( 0, 0, this._context.canvas.width, this._context.canvas.height );
	
	$.each(this._levelObjects, function() {
		this.updateView();
	});
};

LevelController.prototype.updateLevel = function( event ) {
	if( !this.pause ) {
		this.nextFrame();
	} 
};

LevelController.prototype.playNextFrames = function( nbFrames, callback ) {
    this._nbFrameLeft = nbFrames;
    this.pause = false;
    this._callback = callback;
};
