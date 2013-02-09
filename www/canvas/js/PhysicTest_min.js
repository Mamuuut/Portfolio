ObjectView=function(a){this.x=0;this.y=0;this.width=20;this.height=20;this.color="#000000";this._context=a};ObjectView.prototype={draw:function(){this._context.fillStyle=this.color;this._context.fillRect(this.x,this.y,this.width,this.height)}};LevelObject=function(a,b){this._view=a;this._model=b};LevelObject.prototype.updateView=function(){this._view.x=this._model.position.x;this._view.y=this._model.position.y;this._view.width=this._model.size.x;this._view.height=this._model.size.y;this._view.draw()};LevelController=function(a){this.pause=true;this._context=a;this._physicController=new PhysicController(a);this.clearLevel();var b=this;window.setInterval(function(){b.updateLevel()},1e3/30);this.updateLevel();this._nbFrameLeft=undefined;this._callback=undefined};LevelController.BOX_SIZE=20;LevelController.prototype.clearLevel=function(){this._physicController.clearObjects();this._levelObjects=[]};LevelController.prototype.addRandomObjects=function(a){this._physicController.clearObjects();PhysicController.GRAVITY=new Vector2D(0,0);ObjectModel.AIR_FRICTION=1;ObjectModel.CONTACT_FRICTION=new Vector2D(1,1);var b=0;for(b=0;b<a;b++){this.addRandomObject()}};LevelController.prototype.addRandomObject=function(){var a=new ObjectView(this._context);a.color="#"+(Math.random()*16777215<<0).toString(16);var b=new ObjectModel;b.position.x=Math.round(Math.random()*(this._context.canvas.width-LevelController.BOX_SIZE));b.position.y=Math.round(Math.random()*(this._context.canvas.height-LevelController.BOX_SIZE));b.size.x=LevelController.BOX_SIZE;b.size.y=LevelController.BOX_SIZE;var c=new Vector2D(Math.random()*10-5,Math.random()*10-5);b.velocity=c;b.collideBits=1;b.mass=1;this.addObject(a,b)};LevelController.prototype.testXCollisions=function(){this._physicController.clearObjects();PhysicController.GRAVITY=new Vector2D(0,0);ObjectModel.AIR_FRICTION=1;ObjectModel.CONTACT_FRICTION=new Vector2D(1,1);this.addCollidingObject(20,20,new Vector2D(20,20),new Vector2D(4,0),"#FF0000");this.addCollidingObject(20,20,new Vector2D(40,41),new Vector2D(6,0),"#FFFF00");this.addCollidingObject(20,20,new Vector2D(220,30),new Vector2D(0,0),"#00FF00");this.addCollidingObject(20,20,new Vector2D(320,20),new Vector2D(-12,0),"#00FFFF");this.addCollidingObject(20,20,new Vector2D(20,120),new Vector2D(0,0),"#000000",Number.MAX_VALUE);this.addCollidingObject(20,20,new Vector2D(120,120),new Vector2D(4,0),"#FFFF00",2);this.addCollidingObject(20,20,new Vector2D(220,120),new Vector2D(0,0),"#00FF00");this.addCollidingObject(20,20,new Vector2D(320,120),new Vector2D(-4,0),"#00FFFF");this.addCollidingObject(20,20,new Vector2D(420,120),new Vector2D(-20,0),"#0000FF",2)};LevelController.prototype.testGravity=function(){this._physicController.clearObjects();PhysicController.GRAVITY=new Vector2D(0,3);ObjectModel.AIR_FRICTION=.95;this.addCollidingObject(800,20,new Vector2D(0,300),new Vector2D(0,0),"#000000",Number.MAX_VALUE,3);this.addCollidingObject(20,20,new Vector2D(40,20),new Vector2D(0,0),"#FF0000",1,1);this.addCollidingObject(20,20,new Vector2D(40,160),new Vector2D(0,-20),"#FFFF00",1,1);this.addCollidingObject(20,20,new Vector2D(80,160),new Vector2D(20,-20),"#00FF00",1,1)};LevelController.prototype.addCollidingObject=function(a,b,c,d,e,f,g){var h=new ObjectView(this._context);h.color=e;var i=new ObjectModel;i.size=new Vector2D(a,b);i.position=c;i.velocity=d;i.mass=f||1;i.collideBits=g||1;return this.addObject(h,i)};LevelController.prototype.addObject=function(a,b){var c=new LevelObject(a,b);this._levelObjects.push(c);this._physicController.addObject(b);return c};LevelController.prototype.nextFrame=function(){if(undefined!==this._nbFrameLeft){this._nbFrameLeft--;if(0==this._nbFrameLeft){this.pause=true;this.nbFrameLeft=undefined;if(this._callback){this._callback();this._callback=undefined}}}this._physicController.updatePhysic();this._context.clearRect(0,0,this._context.canvas.width,this._context.canvas.height);$.each(this._levelObjects,function(){this.updateView()})};LevelController.prototype.updateLevel=function(a){if(!this.pause){this.nextFrame()}};LevelController.prototype.playNextFrames=function(a,b){this._nbFrameLeft=a;this.pause=false;this._callback=b};TestManager=function(a){var b=$('<div id="canvas_container"></div>');a.append(b);var c=$('<canvas id="testCanvas" width="800" height="600"></canvas>');if(!c[0].getContext||!c[0].getContext("2d")){var d=$("<div class='canvas-support-msg'><a href='http://caniuse.com/#search=canvas' target='_blank'>The Canvas is not supported by your browser.</a></div>");b.append(d);return}else{b.append(c)}var e=c[0].getContext("2d");var f=$('<div id="radio_container"></div>');var g=$('<input id="gravity_test" type="radio" name="test" value="gravity"/>Gravity Test</br>');var h=$('<input id="x_collision_test" type="radio" name="test" value="collisions"/>X Collision Test</br>');var i=$('<input id="random_objects_test" type="radio" name="test" value="random"/>Random Objects Test</br>');f.append(g);f.append(h);f.append(i);a.append(f);var j=$('<div id="button_container"></div>');var k=$('<div id="next" class="button-icon"></div>');var l=$('<div id="pause" class="button-icon"></div>');var m=$('<div id="play" class="button-icon"></div>');var n=$('<div id="reset" class="button-icon"></div>');j.append(n);j.append(k);j.append(l);j.append(m);a.append(j);var o=new LevelController(e);var p=100;var q=function(){u();w();o.testGravity();v()};var r=function(){u();w();o.testXCollisions();v()};var s=function(){u();w();o.addRandomObjects(p);v()};var t=function(){o.playNextFrames(300)};var u=function(){o.pause=true};var v=function(){o.nextFrame()};var w=function(){o.clearLevel()};var x=function(){$("input[name=test]:checked").click()};l.click(u);m.click(t);k.click(v);n.click(x);g.click(q);h.click(r);i.click(s);$("#gravity_test").click()};TestManager.prototype={}