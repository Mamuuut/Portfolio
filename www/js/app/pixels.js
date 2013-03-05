/**
 * PixelInvaders add and switch random pixels img in a container
 * - dependency libs/jquery-1.8.2.min
 * - public interface :
 *   - start
 *   - stop
 * @author Mathieu Delaunay
 */

define( function()
{
    /* Static  */
    var PIXEL_WIDTH = 36;
    var PIXEL_HEIGHT = 42;
    var PIXEL_X_GAP = 35;
    var PIXEL_Y_GAP = 25;
    var PIXEL_TYPES = {
        red: { weight: 1 },
        blue_corner: { weight: 10 },
        blue_hole: { weight: 10 },
        black: { weight: 140 },
        blue: { weight: 378 }
    };
    var MAX_NB_ROWS = 256;
    
    /* Static methods */ 
    
    /**
     * Randomize a pixel src from PIXEL_TYPES
     * @param pixel The pixel to switch
     */
    function randomizePixel( pixel )
    {
        var sum = 0;
        $.each( PIXEL_TYPES, function( type, def )
        {
            sum += def.weight;
        } );
                
        var currentLimit = 0;
        var rand = 1 + Math.floor( ( Math.random() * sum ) );
        var randomType;
        $.each( PIXEL_TYPES, function( type, def )
        {
            currentLimit += def.weight;
            if( rand <= currentLimit )
            {
                randomType = type;
                return false;   
            }
        } );
         
        pixel.attr( 'src', 'img/pixel_' + randomType + '.gif' );
        pixel.attr( 'pixel', randomType );
    }
        
    /**
     * Switch a pixel visibility
     * @param pixel The pixel to switch
     */
    function switchPixelVisibility( pixel )
    {
        if( pixel.is( ':visible' ) )
        {
            pixel.hide();
        } 
        else 
        {
            pixel.show();
        }
    };
        
    /**
     * Constructor
     * @param container The container where the pixels will be added
     * @param frameRate
     */
    function PixelInvaders( container, frameRate )
    {
        /* Private attributes */
        var _container = container;
        var _frameRate = frameRate;
        var _intervalId = undefined;
        
        /* Private methods */ 
        
        /**
         * Create a new pixel element and add it to the container
         * @param row The pixel row
         * @param column The pixel column
         */
        function addPixel( row, column )
        {
            var pixel = $( '<img class="pixel-invaders" />' );
            pixel.attr( "px", row + '_' + column );
            pixel.attr( "width", PIXEL_WIDTH );
            pixel.attr( "height", PIXEL_HEIGHT );
            pixel.css( {
                'position': 'absolute',
                'top': row * PIXEL_Y_GAP + 'px',
                'left': column * PIXEL_X_GAP + 'px',
                'z-index': MAX_NB_ROWS - row
            } );
            randomizePixel( pixel );
    
            _container.append( pixel );
        };
        
        /**
         * Switch a pixel.
         * If the pixel do not exist, we add it to the container.
         * Otherwise we switch its visibility.
         * @param row The pixel row
         * @param column The pixel column
         */
        function switchPixel( row, column )
        {
            var pixelArray = $( '[px=' + row + '_' + column + ']' );
            if( 0 == pixelArray.length )
            {
                addPixel( row, column );
            } 
            else 
            {
                switchPixelVisibility( $( pixelArray[0] ) );
            }
        };

        /* Privileged methods */    
    
        /**
         * Start switching pixels in the container
         */
        this.start = function()
        {
            _intervalId = setInterval( function()
            {
                // Max number of columns
                var maxNbColumns = 1 + Math.floor( _container.width() / PIXEL_X_GAP );
                // Max number of rows
                var maxNbRows = 1 + Math.floor( _container.height() / PIXEL_Y_GAP );
                maxNbRows = Math.min( MAX_NB_ROWS, maxNbRows );
                
                // Random pixel column
                var column = Math.floor( Math.random() * maxNbColumns );
                // Random pixel row
                var row = Math.floor( Math.random() * maxNbRows );
                
                switchPixel( row, column );
            }, _frameRate );
        }
        
        /**
         * Stop switching pixels in the container
         */
        this.stop = function()
        {
            clearInterval( _intervalId );
        }

        this.start();
    };
    
    return PixelInvaders;
} );