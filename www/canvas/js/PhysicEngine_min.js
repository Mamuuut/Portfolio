function registerEventListener(a,b){}function raiseEvent(a,b){}AxisContacts=function(){this.axis_min=new Array;this.axis_max=new Array};AxisContacts.prototype.addContact=function(a,b){this[b].push(a)};Vector2D=function(a,b){this.x=a||0;this.y=b||0};Vector2D.prototype.fromString=function(a){if(null!=string){var b=string.split(";");if(2==b.length){x=parseFloat(b[0]);y=parseFloat(b[1])}}};Vector2D.X_AXIS="x";Vector2D.Y_AXIS="y";Rect=function(a,b,c,d){this.size=new Vector2D(c,d);this.position=new Vector2D(a,b)};Rect.prototype.getLeftTop=function(a){return this.position[a]};Rect.prototype.getRightBottom=function(a){return this.position[a]+this.size[a]};Rect.AXIS_MIN="axis_min";Rect.AXIS_MAX="axis_max";Collision=function(a,b,c,d){function h(){var a=0;var b=e();var d;for(var f=0,g=b.length;d=b[f],f<g;f++){if(d.hasMaxMass()){return d.velocity[c]}a+=d.mass*d.velocity[c]}return a}function g(){var a=0;var b=e();var c;for(var d=0,f=b.length;c=b[d],d<f;d++){if(c.hasMaxMass()){return 1}a+=c.mass}return a}function f(){return Math.round(h()/g())}function e(){var d=a.getContactObjects(c,Rect.AXIS_MIN);var e=b.getContactObjects(c,Rect.AXIS_MAX);return d.concat(e)}var d=d;var c=c;var a=a;var b=b;this.Collide=function(){var g=f();var h=e();var i;for(var j=0,k=h.length;i=h[j],j<k;j++){i.updateTimePosition(d);i.velocity[c]=g;i.updateTimeNextPosition(d)}raiseEvent(PhysicEvent.COLLIDE,{objects:[a,b]})};this.getTime=function(){return d};this.getObjects=function(){return e()}};Contacts=function(){this.x=null;this.y=null;this.clear()};Contacts.prototype.addContact=function(a,b,c){return this.getObjects(b,c).push(a)};Contacts.prototype.hasContact=function(a){return 0!=this[a].axis_min.length||0!=this[a].axis_max.length};Contacts.prototype.getObjects=function(a,b){return this.getAxisContacts(a)[b]};Contacts.prototype.getAxisContacts=function(a){return this[a]};Contacts.prototype.clear=function(){this.x=new AxisContacts;this.y=new AxisContacts};ObjectModel=function(){function d(a){if(-1!=b.objectFriction){return b.objectFriction}return b.contacts.hasContact(a)?ObjectModel.CONTACT_FRICTION[a]:ObjectModel.AIR_FRICTION}function c(){b.velocity.x=Math.max(-ObjectModel.MAX_VELOCITY.x,Math.min(ObjectModel.MAX_VELOCITY.x,b.velocity.x));b.velocity.y=Math.max(-ObjectModel.MAX_VELOCITY.y,Math.min(ObjectModel.MAX_VELOCITY.y,b.velocity.y))}Rect.call(this);var a=null;this.nextPosition=new Vector2D;this.velocity=new Vector2D;this.mass=1;this.contacts=new Contacts;this.objectFriction=-1;this.collideBits=0;this.parentQuads=[];var b=this;this.updateTimePosition=function(a){c();this.position=this.getTimePosition(a)};this.updateTimeNextPosition=function(a){c();this.nextPosition=this.getTimePosition(1-a)};this.updateForces=function(){if(!this.hasMaxMass()){var b;var c=this.velocity;for(var e=0,f=a.length;b=a[e],e<f;e++){c.x+=b.x;c.y+=b.y}c.x*=d(Vector2D.Y_AXIS);c.y*=d(Vector2D.X_AXIS)}};this.resetForces=function(){a=new Array;this.addForce(PhysicController.GRAVITY)};this.addForce=function(b){a.push(b)};this.resetForces()};extend(ObjectModel,Rect);ObjectModel.MAX_VELOCITY=new Vector2D(40,40);ObjectModel.CONTACT_FRICTION=new Vector2D(.5,.9);ObjectModel.AIR_FRICTION=.95;ObjectModel.prototype.updatePosition=function(){this.position.x=this.nextPosition.x;this.position.y=this.nextPosition.y};ObjectModel.prototype.checkOverriding=function(){this.checkOverridingObjects(this.contacts.getObjects(Vector2D.X_AXIS,Rect.AXIS_MIN));this.checkOverridingObjects(this.contacts.getObjects(Vector2D.X_AXIS,Rect.AXIS_MAX));this.checkOverridingObjects(this.contacts.getObjects(Vector2D.Y_AXIS,Rect.AXIS_MIN));this.checkOverridingObjects(this.contacts.getObjects(Vector2D.Y_AXIS,Rect.AXIS_MAX))};ObjectModel.prototype.checkOverridingObjects=function(a){var b;var c=CollisionHelper.checkOverriding;var d=this.position;var e=this.size;for(var f=0,g=a.length;b=a[f],f<g;f++){if(c(d,e,b.position,b.size)){raiseEvent(PhysicEvent.OVERRIDE,{objects:[this,b]})}}};ObjectModel.prototype.collidesWith=function(a){var b=this.collideBits&a.collideBits;return 0!=b};ObjectModel.prototype.clearContacts=function(){this.contacts.clear()};ObjectModel.prototype.getContactObjects=function(a,b){var c=new Array;c.push(this);if(0!=this.contacts.getObjects(a,b).length){var d=this.contacts.getObjects(a,b);var e;for(var f=0,g=d.length;e=d[f],f<g;f++){c=c.concat(e.getContactObjects(a,b))}}return c};ObjectModel.prototype.getTimePosition=function(a){return new Vector2D(Math.round(this.position.x+a*this.velocity.x),Math.round(this.position.y+a*this.velocity.y))};ObjectModel.prototype.hasMaxMass=function(){return Number.MAX_VALUE==this.mass};QuadTree=function(a,b,c,d){this.rect=new Rect(a,b,c,d);this.objects=[];this.isLeaf=true;this.minTimeCollision=undefined;this.isUpToDate=false;this.childs=[]};QuadTree.MAX_OBJECTS_PER_QUAD=10;QuadTree.prototype={subdivide:function(){var a=Math.floor(this.rect.size.x/2);var b=Math.floor(this.rect.size.y/2);var c=this.rect.position.x;var d=this.rect.position.y;this.childs.push(new QuadTree(c,d,a,b));this.childs.push(new QuadTree(c+a,d,a,b));this.childs.push(new QuadTree(c,d+b,a,b));this.childs.push(new QuadTree(c+a,d+b,a,b));var e=this.objects;var f=this.childs;var g;var h;var i=CollisionHelper.checkOverriding;for(var j=0,k=e.length;g=e[j],j<k;j++){var l=g.position;var m=g.size;for(var n=0,o=f.length;h=f[n],n<o;n++){if(i(h.rect.position,h.rect.size,l,m))h.insert(g)}}this.objects=[];this.isLeaf=false},insert:function(a){this.isUpToDate=false;if(this.isLeaf===true){this.objects.push(a);a.parentQuads.push(this);if(this.objects.length>QuadTree.MAX_OBJECTS_PER_QUAD){this.subdivide()}}else{var b=CollisionHelper.checkOverriding;var c=this.childs;var d;var e=a.position;var f=a.nextPosition;var g=a.size;for(var h=0,i=c.length;d=c[h],h<i;h++){if(b(d.rect.position,d.rect.size,e,g)||b(d.rect.position,d.rect.size,f,g))d.insert(a)}}},remove:function(a){this.isUpToDate=false;var b=a.parentQuads;var c;for(var d=0,e=b.length;c=b[d],d<e;d++){var f=c.objects.indexOf(a);c.objects.splice(f,1)}a.parentQuads=[]},update:function(a){this.remove(a);this.insert(a)},getMinTimeCollision:function(){if(this.isUpToDate){return this.minTimeCollision}this.minTimeCollision=undefined;if(this.isLeaf===true){this.minTimeCollision=CollisionHelper.getMinTimeCollisionFromObjects(this.objects);return this.minTimeCollision}else{var a=this.childs;var b;var c;for(var d=0,e=a.length;b=a[d],d<e;d++){c=CollisionHelper.getMinTimeCollision(c,b.getMinTimeCollision())}this.minTimeCollision=c}this.isUpToDate=true;return this.minTimeCollision}};PhysicController=function(a,b){function h(){var a;for(var b=0,c=d.length;a=d[b],b<c;b++){a.clearContacts()}}function g(){h();var a=f.getMinTimeCollision();if(null!=a){c++;a.Collide();var b=a.getObjects();var d;for(var e=0,i=b.length;d=b[e],e<i;e++){f.update(d)}g()}}var c;var d=new Array;var e=a;var f;this.addObject=function(a){d.push(a);f.insert(a)};this.removeObject=function(a){var b=d.indexOf(a);d.splice(b,1)};this.clearObjects=function(){f=new QuadTree(0,0,e.canvas.width,e.canvas.height);d=new Array};this.updatePhysic=function(){c=0;var a;for(var b=0,e=d.length;a=d[b],b<e;b++){a.updateForces();a.resetForces();a.updateTimeNextPosition(0);f.update(a)}g();var a;var h;for(var b=0,e=d.length;a=d[b],b<e;b++){a.updatePosition();a.checkOverriding()}};this.clearObjects();PhysicController.GRAVITY=null!=b?b:new Vector2D(0,3)};PhysicController.GRAVITY=new Vector2D;PhysicEvent={COLLIDE:"collide",OVERRIDE:"override"};CollisionHelper={checkOverriding:function(a,b,c,d){return!(c.x>=a.x+b.x||c.x+d.x<=a.x||c.y>=a.y+b.y||c.y+d.y<=a.y)},checkContacts:function(a,b){if(a.hasMaxMass()&&b.hasMaxMass()){return}if(b.position.x>a.position.x+a.size.x||b.position.x+b.size.x<a.position.x||b.position.y>a.position.y+a.size.y||b.position.y+b.size.y<a.position.y){return}var c=CollisionHelper.getAxisProj(Vector2D.X_AXIS,a,b);var d=CollisionHelper.getAxisProj(Vector2D.Y_AXIS,a,b);if(c<d){CollisionHelper.checkAxisContact(Vector2D.X_AXIS,a,b)}else{CollisionHelper.checkAxisContact(Vector2D.Y_AXIS,a,b)}},getCollision:function(a,b){if(a.hasMaxMass()&&b.hasMaxMass()){return null}var c=CollisionHelper.getLeftTopObject(Vector2D.X_AXIS,a,b);var d=CollisionHelper.getRightBottomObject(Vector2D.X_AXIS,a,b);var e=CollisionHelper.getCollisionTime(Vector2D.X_AXIS,c,d);var f=CollisionHelper.getLeftTopObject(Vector2D.Y_AXIS,a,b);var g=CollisionHelper.getRightBottomObject(Vector2D.Y_AXIS,a,b);var h=CollisionHelper.getCollisionTime(Vector2D.Y_AXIS,f,g);if(0<=e&&1>=e&&0<=h&&1>=h){if(e<=h){return new Collision(c,d,Vector2D.X_AXIS,e)}else{return new Collision(f,g,Vector2D.Y_AXIS,h)}}else if(0<=e&&1>=e){var i=f.getTimePosition(e).y+f.size.y;var j=g.getTimePosition(e).y;if(i>=j&&c.velocity.x>d.velocity.x){return new Collision(c,d,Vector2D.X_AXIS,e)}}else if(0<=h&&1>=h){var k=c.getTimePosition(h).x+c.size.x;var l=d.getTimePosition(h).x;if(k>=l&&f.velocity.y>g.velocity.y){return new Collision(f,g,Vector2D.Y_AXIS,h)}}return null},getCollisionTime:function(a,b,c){return(b.position[a]+b.size[a]-c.position[a])/(c.velocity[a]-b.velocity[a])},getMinTimeCollisionFromObjects:function(a){var b=undefined;for(i=0;i<a.length;i++){for(j=i+1;j<a.length;j++){if(a[i].collidesWith(a[j])){CollisionHelper.checkContacts(a[i],a[j]);b=CollisionHelper.getMinTimeCollision(b,CollisionHelper.getCollision(a[i],a[j]))}}}return b},getMinTimeCollision:function(a,b){isCollisionAValid=CollisionHelper.isValidCollision(a);isCollisionBValid=CollisionHelper.isValidCollision(b);if(!isCollisionAValid&&isCollisionBValid){return b}if(isCollisionAValid&&!isCollisionBValid){return a}if(isCollisionAValid&&isCollisionBValid){return a.getTime()<b.getTime()?a:b}},isValidCollision:function(a){return undefined!=a&&a.getTime()>=0&&a.getTime()<=1},checkAxisContact:function(a,b,c){var d=CollisionHelper.getLeftTopObject(a,b,c);var e=CollisionHelper.getRightBottomObject(a,b,c);if(d.velocity[a]>=e.velocity[a]){d.contacts.addContact(e,a,Rect.AXIS_MAX);e.contacts.addContact(d,a,Rect.AXIS_MIN)}},getAxisProj:function(a,b,c){var d=Math.max(b.getLeftTop(a),c.getLeftTop(a));var e=Math.min(b.getRightBottom(a),c.getRightBottom(a));return e-d},getLeftTopObject:function(a,b,c){if(b.getRightBottom(a)<=c.getLeftTop(a)){return b}return c},getRightBottomObject:function(a,b,c){if(b.getRightBottom(a)<=c.getLeftTop(a)){return c}return b}}