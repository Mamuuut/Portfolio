/**
 * @author Mamut
 */
define( [ 
	"Events/EventManager"
], function( EventManager )
{
	function EventTargetMixin() {};   
	
	EventTargetMixin.prototype = 
	{
		dispatchEvent: function( eventType, data )
		{
			EventManager.dispatchEvent( this, eventType, data );
		},
		
		addEventListener: function( eventType, listener )
		{
			EventManager.addEventListener( this, eventType, listener );
		},
		
		removeEventListener: function( eventType, listener )
		{
			EventManager.removeEventListener( this, eventType, listener );
		},		
	};

	EventTargetMixin.StateEvent = {
	    SetNextState: "setNextState"
	};
	
	return EventTargetMixin;
} );