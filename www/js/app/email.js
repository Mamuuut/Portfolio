/**
 * @author Mathieu Delaunay
 *
 * EmailEncoder
 * avoid explicit email address in the web page
 */

define( function()
{   
    var _at = "@";
    var _m = "mailto:";
    var _com = ".com";

    var EmailEncoder = function( contactClass, firstName, lastName, domain )
    {
        var emailAddress = _m + firstName + '.' + lastName + _at + domain + _com;
        $( '.' + contactClass ).attr( 'href', emailAddress );
    };
    
    return EmailEncoder;
} );
