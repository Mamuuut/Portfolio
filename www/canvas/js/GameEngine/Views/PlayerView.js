/**
 * @author Mamut
 */
define( [
    "Inputs/KeyboardManager",
    "Commands/Command", 
	"Views/FrameAnimation"
], function( KeyboardManager, Command, FrameAnimation )
{
	function PlayerView( def, model )
	{   
        FrameAnimation.call( this, def, model );
        this.initCommands( def );
	}
	
	extend( PlayerView, FrameAnimation );
	
    PlayerView.prototype.moveRight = function()
    {
        this._model.addForce( new Vector2D( 2, 0 ) );  
    };
    
    PlayerView.prototype.moveLeft = function()
    {
        this._model.addForce( new Vector2D( -2, 0 ) );
    };
    
    PlayerView.prototype.jump = function()
    {
        this._model.addForce( new Vector2D( 0, -30 ) );
    };
    
    PlayerView.prototype.initCommands = function( def )
    {
        for( var idx in def.commands )
        {
            var command = def.commands[ idx ];
            KeyboardManager.addCommand(
                command.keyType,
                command.keyCode,
                new Command( this, command.action )
            );
        }
	}
	
	return PlayerView;
} );