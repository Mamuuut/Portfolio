/**
 * @author Mamut
 */
define( [ 
	"jquery",
	"Helpers/ImageLoader",
	"States/State",
	"Events/EventTargetMixin"
], function( $, ImageLoader, State, EventTargetMixin )
{
	function LoadingState( config, container )
	{
	    State.call( this, config, container );
	    this._timeoutComplete = false;
	    this._imagesLoaded = false;
	};
	
	extend( LoadingState, State );
	
	LoadingState.prototype.start = function()
	{
	    LoadingState.superClass.start.call( this );
	    
	    var that = this;
	    setTimeout( function()
	    { 
	        that._timeoutComplete = true;
	    }, this._config.loadingState.duration );
	    
	    ImageLoader.loadImages( this._config.levelImg, function()
	    {
	        that._imagesLoaded = true;
	    } );
	};
	
	LoadingState.prototype.update = function()
	{
	    if( this._timeoutComplete && this._imagesLoaded )
	        this.dispatchEvent( EventTargetMixin.StateEvent.SetNextState, { state: "startMenu" } );
	};
	
	LoadingState.prototype.createView = function()
	{
	    var introductionImg = new Image();
	    introductionImg.src = this._config.loadingState.src;
	    introductionImg.width = $( this._container ).width();
	    
	    var view = $( '<div class="loading-view"></div>' );
	    
	    view.append( introductionImg );
	    
	    this._view = view; 
	};
	
	return LoadingState;
} );