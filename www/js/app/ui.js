/**
 * @author Mathieu Delaunay
 * 
 * UiController
 * control UI widgets and event
 */

define( [
    "app/analytics"
], function( Analytics )
{
    var _instance = null;
    var _physicTestManager = undefined;
    var _pixelInvaders = undefined;
    var _currentModalContent = undefined;
    var _modalContainer = undefined;
    var _contentWidth = 0;
    var _selectedTab = undefined;
    var _swf = {
        path : 
        {
            platform_game: "flash/platform_game/PlatformGame.swf",
            physic_test: "flash/physic_test/Physic.swf"
        },
        container : "swf_div",
        width : "800",
        height : "600",
        version : "9.0.0",
        loading : false,
        loaded : false,
        currentSwfCode : undefined
    };
    
    /* Modal content */
    
    /**
     * Update the modal content size and position
     */
    var updateModalContent = function()
    {
        if( _currentModalContent )
        {
            var left = Math.max( 0, $( window ).width() - _currentModalContent.width() ) / 2;
            _currentModalContent.css( 'left', left );
            var top = Math.max( 0, $( window ).height() - _currentModalContent.height() ) / 2;
            _currentModalContent.css( 'top', top );

            $( window ).scrollTop( 0 );
            _modalContainer.width( $(window).width() );
            _modalContainer.height( $(window).height() );
        }
    };

    /**
     * Open the modal content view
     */
    var openModalContent = function( contentId )
    {
        _pixelInvaders.stop();
        _currentModalContent = $( contentId );
        _currentModalContent.show();
        updateModalContent();
        _modalContainer.show();
    };

    /**
     * Close the modal content window
     */
    var closeModalContent = function()
    {
        _pixelInvaders.start();
        _currentModalContent.hide();
        _currentModalContent = undefined;
        _modalContainer.hide();
    };

    /**
     * embedSWF callback
     */
    var swfCallback = function( event )
    {
        _swf.loading = false;
        Analytics.trackEvent( "Swf", "callback", event.success );
    };

    /**
     * open a SWF in the modal content view
     * @param swfCode
     */
    var openSwfFile = function( swfCode )
    {
        Analytics.trackEvent( "Swf", "open", swfCode );
        if( !_swf.loading && _swf.currentSwfCode != swfCode )
        {
            _swf.currentSwfCode = swfCode;
            _swf.loading = true;
            swfobject.embedSWF( _swf.path[ swfCode ], _swf.container, _swf.width, _swf.height, _swf.version, null, null, null, null, swfCallback );
        }
        openModalContent( "#swf_container" );
    };


    /**
     * Open the canvas physic engine test interface
     */
    var openPhysicTest = function()
    {
        Analytics.trackEvent( "Canvas", "open", "PhysicTest" );
        if( !_physicTestManager )
        {
            _physicTestManager = new TestManager( $( "#physic_test_container" ) );
        }
        openModalContent( "#physic_test_container" );
    };
    
    /**
     * Update the selected tab x translation
     */
    function updateSelectedContentPosition()
    {
        $(".tab-contents").css( "left", _selectedTab.index() * -_contentWidth + "px" );
    };
    
    /**
     * Constructor
     */
    function UiController()
    {
        if( _instance !== null )
        {
            throw new Error("Cannot instantiate more than one UiController, use UiController.getInstance()");
        } 
    };
    
    UiController.prototype.initialize = function( pixelInvaders )
    {   
        _pixelInvaders = pixelInvaders;
        
        _modalContainer = $( '#modal_container' );
        
        /* Menu tab navigation */
        $( ".menu-item" ).click( function()
        {
            $( ".menu-item" ).removeClass( "selected" );
            _selectedTab = $( this );
            _selectedTab.addClass( "selected" );
            
            var tab = _selectedTab.attr( "tab" );
            updateSelectedContentPosition();  
            Analytics.trackEvent( "Navigation", "Tab", tab );
        } );
        $( ".menu-item[tab=home]" ).click();
        
        $( ".header-left" ).click( function()
        {
            $( ".menu-item[tab=home]" ).click();
        } );
        
        /* Modal content */
        $( '#modal_close' ).click( closeModalContent );
        $( '#flash_physic_test_preview' ).click( function() 
        { 
            openSwfFile( "physic_test" ) 
        } );
        $( '#flash_game_preview, #home_play_button' ).click( function() 
        { 
            openSwfFile( "platform_game" ) 
        } );
        $( '#fscot_preview' ).click( function()
        {
            $( "a", $( '#fscot_preview' ).parent() ).click(); 
        } );
        $( '#physic_test_preview' ).click( openPhysicTest );
        
        /* Content size */
       var headerHeight = $( '.header' ).outerHeight( true );
       var menuHeight = $( '.menu' ).outerHeight( true );
       var separatorHeight = 2 * $( '.separator' ).outerHeight( true );
       var footerHeight = $( 'footer' ).outerHeight( true );
       var notContentHeight = headerHeight + menuHeight + separatorHeight + footerHeight + 104;
       var contentMinHeight = 300;

        $( '.container' ).show();
                   
        $( window ).resize( function()
        {
            updateModalContent();
           
            var windowHeight = $( window ).innerHeight();
            var contentMaxHeight = Math.max( 300, windowHeight - notContentHeight );
            $( '.tab-content' ).css( 'max-height', contentMaxHeight + 'px' );
            _contentWidth = $( '.content' ).width();
            var nbContents = $( '.tab-content' ).length;
            $( '.tab-contents' ).css( 'width', ( _contentWidth * nbContents ) + 'px' );
            $( '.tab-content' ).outerWidth( _contentWidth, true );
            updateSelectedContentPosition();
        } );
        $( window ).resize();
       
       // 
       if( swfobject.hasFlashPlayerVersion( "10" ) )
       {
           $( '#home_play' ).show();   
       }
       
       // Expose JavaScript methods to SWF Object
       window.swfInterface = 
       {
           trackEvent: Analytics.trackEvent  
       }
    };
      
    /**
     * @return the UiController singleton instance
     */     
    UiController.getInstance = function()
    {
        {
            if( _instance === null ){
                _instance = new UiController();
            }
            return _instance;
        }
    };
    
    return UiController.getInstance();
        
    return UiController;
} );
