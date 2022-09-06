//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTS_SPEED = 2000;
	static POINTER_MOVEMENT = 5;
	
	constructor( )
	{
		super( );
		
		this.resize( );

		this.n = 0; // number of active pins
		this.ring = new Ring;
		this.pins = [new Pin(),new Pin(),new Pin(),new Pin()];
		this.dragPin = null;
		
		this.debugLine = line( [0,0,0], [0,0,0] );
		
		this.membrane = new Membrane;

		this.toucher = this.constructToucher( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Normal pins',
				bg: 'Нормални карфици',
				jp: '法線ピン'},
		] );
		
	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.membrane.show( );
		
		// number of pins
		this.n = Math.round( THREE.MathUtils.mapLinear( this.difficulty**5, 10**5, 100**5, 1, 4 ));
		
		var	angle = random( 0, 2*Math.PI ),
			dist;
			
		for( var i=0; i<this.n; i++ )
		{
			dist = random( 0.1, 0.30 );
			angle += 2*Math.PI/this.n;

			this.pins[i].show( 0.5+dist*Math.sin(angle), 0.5+dist*Math.cos(angle) );
		}

var pin = this.pins[0];		
var pinPos = new THREE.Vector3(...pin.center);
var uVector = new THREE.Vector3( ...playground.membrane.surface.curve( pin.u+0.001, pin.v ) ) . sub( pinPos ),
	vVector = new THREE.Vector3( ...playground.membrane.surface.curve( pin.u, pin.v+0.001 ) ) . sub( pinPos ),
	norVector = new THREE.Vector3() . crossVectors( uVector, vVector ) . normalize();
this.debugLine.from = [
	pin.center[0]+20*norVector.x,
	pin.center[1]+20*norVector.y,
	pin.center[2]+20*norVector.z ];
this.debugLine.to = [
	pin.center[0]-20*norVector.x,
	pin.center[1]-20*norVector.y,
	pin.center[2]-20*norVector.z ];

		
		// ...

	} // Playground.newGame



	// check whether a game can end
	canEndGame( )
	{
		// ...
		return true;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 30, 100 );
		var maxAngle = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 60, 30 ),
			minAngle = THREE.MathUtils.mapLinear( this.difficulty, 0, 100, 20, 10 );
		
			
		var score = 0;
	
console.log('-------------');	
		for( var pin of this.pins ) if( pin.visible )
		{
			// get pin vector
			var pinPos = new THREE.Vector3( ...pin.center ),
				pinHeadPos = new THREE.Vector3( ...pin.pinHeads[0].objectPosition() ),
				pinVector = new THREE.Vector3() . subVectors(pinHeadPos,pinPos) . normalize();
				
			// get normal vector
			var uVector = new THREE.Vector3( ...playground.membrane.surface.curve( pin.u+0.001, pin.v ) ) . sub( pinPos ),
				vVector = new THREE.Vector3( ...playground.membrane.surface.curve( pin.u, pin.v+0.001 ) ) . sub( pinPos ),
				norVector = new THREE.Vector3() . crossVectors( uVector, vVector ) . normalize();
		
			// get angle between vectors in degrees
			var angle = degrees( pinVector.angleTo( norVector ) );
				if( angle > 90 ) angle = 180-angle;
			
			
			var subScore = THREE.MathUtils.mapLinear( angle, minAngle, maxAngle, 1, 0 );
				subScore = THREE.MathUtils.clamp( subScore, 0, 1 )**0.75;
				
		console.log(angle|0,'in','['+(minAngle|0)+'..'+(maxAngle|0)+'] ->', subScore.toFixed(2));
			
			score += subScore/this.n;
		// line( this.center, [this.center[0]+n.x,this.center[1]+n.y,this.center[2]+n.z], 'crimson' );
		}

//		console.log('score', score.toFixed(2));
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		this.membrane.hide( );

		// hide all pins
		for( var pin of this.pins ) pin.hide( );
		
		// ...
		
	} // Playground.endGame
	


	// update the viewpoint to set the image size depending
	// on orientation of mobile devices
	resize( )
	{
		// ...
	} // Playground.resize
	


	// load all sounds
	loadSounds( )
	{
		//this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		//this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		//this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	// construct toucher sphere
	constructToucher( )
	{
		var material = new THREE.MeshBasicMaterial( {
				color: 'crimson',
				side: THREE.DoubleSide,
		});

		var toucher = square( [0,0,0], 100 );
			its.threejs.material = material;
			its.visible = false;
			
		return toucher;
	}

	
	// update the playground
	update( t, dT )
	{
		// ...
		this.membrane.update( t, dT );
	}
} // class Playground
