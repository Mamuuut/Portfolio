TestManager = function( testContainer )
{
    var canvasContainer = $( '<div id="canvas_container"></div>' );
    testContainer.append( canvasContainer );
    var canvas = $( '<canvas id="testCanvas" width="800" height="600"></canvas>' );
    
    if ( !canvas[0].getContext || !canvas[0].getContext('2d'))
    {
        var notSupportedLink = $( "<div class='canvas-support-msg'><a href='http://caniuse.com/#search=canvas' target='_blank'>The Canvas is not supported by your browser.</a></div>" )
        canvasContainer.append( notSupportedLink );
        return;
    }
    else
    {
        canvasContainer.append( canvas );
    }

    var context = canvas[0].getContext( "2d" );

    var radioContainer = $( '<div id="radio_container"></div>' );
    var gravityTestRadio = $( '<input id="gravity_test" type="radio" name="test" value="gravity"/>Gravity Test</br>' );
    var xCollisionTestRadio = $( '<input id="x_collision_test" type="radio" name="test" value="collisions"/>X Collision Test</br>' ); 
    var randomObjectsTestRadio = $( '<input id="random_objects_test" type="radio" name="test" value="random"/>Random Objects Test</br>' ); 
    radioContainer.append( gravityTestRadio );
    radioContainer.append( xCollisionTestRadio );
    radioContainer.append( randomObjectsTestRadio );
    testContainer.append( radioContainer );  

    var buttonContainer = $( '<div id="button_container"></div>' );
    var nextButton = $( '<div id="next" class="button-icon"></div>' );
    var pauseButton = $( '<div id="pause" class="button-icon"></div>' );
    var playButton = $( '<div id="play" class="button-icon"></div>' );
    var resetButton = $( '<div id="reset" class="button-icon"></div>' );
    buttonContainer.append( resetButton );
    buttonContainer.append( nextButton );
    buttonContainer.append( pauseButton );
    buttonContainer.append( playButton );
    testContainer.append( buttonContainer );

    var _levelController = new LevelController( context );

    var _nbRandomObjects = 100;

    var testGravity = function()
    {
        pause();
        clearLevel();
        _levelController.testGravity();
        nextFrame();
    };

    var testXCollisions = function()
    {
        pause();
        clearLevel();
        _levelController.testXCollisions();
        nextFrame();
    };

    var testRandomObjects = function()
    {
        pause();
        clearLevel();
        _levelController.addRandomObjects( _nbRandomObjects );
        nextFrame();
    };

    var play = function()
    {
        _levelController.playNextFrames( 300 );
    };

    var pause = function()
    {
        _levelController.pause = true;
    };

    var nextFrame = function()
    {
        _levelController.nextFrame();
    };

    var clearLevel = function()
    {
        _levelController.clearLevel();
    };

    var resetLevel = function()
    {
        $( 'input[name=test]:checked' ).click();
    };
    
    pauseButton.click( pause );
    playButton.click( play );
    nextButton.click( nextFrame );
    resetButton.click( resetLevel );
    gravityTestRadio.click( testGravity );
    xCollisionTestRadio.click( testXCollisions );
    randomObjectsTestRadio.click( testRandomObjects );
    
    $( '#gravity_test' ).click();
};

TestManager.prototype = {
    
};