/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	// var playerObject = new GravityObj(camera, 20);

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;
	var mirror = 1;

	this.velocity = new THREE.Vector3(0,0,0);
	var that = this;

	var PI_2 = Math.PI / 2;
	var lookUpLimit = PI_2;
	var lookDownLimit = -PI_2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.02 * mirror;
		pitchObject.rotation.x -= movementY * 0.002 * mirror;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; 
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) that.velocity.y += 10 * mirror;
				canJump = false;
				break;


			// GRAVITY CONTROL
			case 89: // y back wall
				gravityDir.x = -1;
				gravityDir.y = 0;
				gravityDir.z = 0;
				isOnWall = 1;
				break;

			case 85: // u front wall
				yawObject.rotation.y += PI_2;
				gravityDir.x = 1;
				gravityDir.y = 0;
				gravityDir.z = 0;
				isOnWall = -1;
				break;

			case 81: // e floor
				if (mirror == -1) {
					pitchObject.rotation.z += 2 * PI_2;
					mirror *= -1;
				}
				gravityDir.x = 0;
				gravityDir.y = -1;
				gravityDir.z = 0;
				break;

			case 69: // q ceiling
				if (mirror == 1) {
					pitchObject.rotation.z += 2 * PI_2;
					mirror *= -1;
				}
				gravityDir.x = 0;
				gravityDir.y = 1;
				gravityDir.z = 0;
				break;

			case 86: // v left wall
				gravityDir.x = 0;
				gravityDir.y = 0;
				gravityDir.z = -1;
				isOnWall = true;
				break;

			case 66: // b right wall
				gravityDir.x = 0;
				gravityDir.y = 0;
				gravityDir.z = 1;
				isOnWall = true;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		this.velocity.x += ( - this.velocity.x ) * 0.08 * delta;
		this.velocity.z += ( - this.velocity.z ) * 0.08 * delta;

		// this.velocity.y -= 0.25 * delta;

		if ( moveForward ) this.velocity.z -= 0.12 * delta;
		if ( moveBackward ) this.velocity.z += 0.12 * delta;

		if ( moveLeft ) this.velocity.x -= 0.12 * delta;
		if ( moveRight ) this.velocity.x += 0.12 * delta;

		if ( isOnObject === true ) {

			this.velocity.y = Math.max( 0, this.velocity.y );

		}

		yawObject.translateX( this.velocity.x );
		yawObject.translateY( this.velocity.y ); 
		yawObject.translateZ( this.velocity.z );

		if ( yawObject.position.y < 10 - roomSize ) {

			this.velocity.y = 0;
			yawObject.position.y = 10 - roomSize;

			canJump = true;

		}


		if ( yawObject.position.y < 10 - roomSize ) {

			this.velocity.y = 0;
			yawObject.position.y = 10 - roomSize;

			canJump = true;

		}

	};

};
