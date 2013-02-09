/**
 * @author Mathieu Delaunay
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        canvas: '../canvas'
    }
});
require( [ 
	"canvas/js/utils", 
	"canvas/js/PhysicEngine_min",
	"canvas/js/PhysicTest_min"
] );

require( [ 
    "app/analytics",
    "app/locale",
    "app/ui",
    "app/email",
    "app/pixels",
], function( Analytics, LocaleManager, UiController, EmailEncoder, PixelInvaders )
{    
    $( function()
    {  
        /* Ananlytics */
        Analytics.initialize( 'UA-29366499-1' );
                    
        /* LocaleManager */
        LocaleManager.initialize();
        
        /* PixelInvaders - background pixel animation */
        var pixelInvaders = new PixelInvaders( $( '#pixel_container' ), 200 );
        
        /* UiController */
        UiController.initialize( pixelInvaders );
    
        /* EmailEncoder */
        new EmailEncoder( "contact", "mamut", "delaunay", "gmail" );
    } );
} );