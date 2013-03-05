ObjectView = function( context )
{
    this.x = 0;
    this.y = 0;

    this.width = 20;
    this.height = 20;

    this.color = "#000000";

    this._context = context;
};

ObjectView.prototype = {
    draw: function()
    {
        this._context.fillStyle = this.color;
        this._context.fillRect( this.x, this.y, this.width, this.height );
    }
};

