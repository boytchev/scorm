//
//	class Playground( )
//

	

class Playground extends ScormPlayground
{
	static POINTER_MOVEMENT = 5;
	static POINTER_USED = false;
	
	constructor( )
	{
		super( );
		
		this.pointerMovement = 0;
		this.solid = null;
		
		this.resize( );

		this.translate( [
			{id: 'txt-caption',
				en: 'Platonic walk',
				bg: 'Платонична разходка',
				jp: 'プラトニックな散歩------'},
		] );
		
		orb.addEventListener( 'start', () => Playground.POINTER_USED=true  );
		orb.addEventListener( 'end', () => Playground.POINTER_USED=false );

		this.solids = [];
		for( var i=0; i<6; i++ )
			this.solids.push( new Platonic( i ) );
		
		this.model = new THREEJSModel();
		this.modelShell = prism( 6, [0,-THREEJSModel.HEIGHT,0], [2*THREEJSModel.SIZE,THREEJSModel.HEIGHT+9], 'crimson' );
		its.visible = false;



		this.route = [];
		this.routeRing = tube( [0,0,0], [[0,2,0,24.5], [0,1,0,25], [0,0,0,25.2], [0,-1,0,25], [0,-2,0,24.5]], 1, [10,120], 0, 'white' );
			its.threejs.material = new THREE.MeshPhysicalMaterial( {
				transparent: true,
				opacity: 1,
				metalness: 0,
				roughness: 1,
				side: THREE.DoubleSide,
			} );
			this.routeRing.threejs.renderOrder = -15;
		this.ringImage = drawing( 1024, 128 );
		this.ringAlpha = drawing( 1024, 128 );
		this.setGlyphTexture( );
		
		this.modelShell.addEventListener( 'click', this.onClickModel )
	} // Playground.constructor

	

	glyphStroke( img, seed )
	{
		console.log('route',this.route);
		
		THREE.MathUtils.seededRandom( seed );

		// starting point
		var x = 20,
			y = 64;
		
		const LINE_STEP = 16;
		const LINE_LENGTH = 40;
		const CIRCLE_RADIUS = 16;
		const CIRCLE_MIN_RADIUS = 5;

		// starting node
		img.moveTo( x, y+CIRCLE_MIN_RADIUS );
		img.arc( x, y, CIRCLE_MIN_RADIUS );
		img.moveTo( x, y );
		x += LINE_STEP;
		img.lineTo( x, y );

		for( var i=0; i<this.route.length; i++ )
		{
			var count = Math.abs(this.route[i]),
				sign = Math.sign(this.route[i]);
			
			var prevX = x - CIRCLE_RADIUS - 0.5*LINE_STEP,
				nextX = x + count*LINE_STEP + CIRCLE_RADIUS + 0.5*LINE_STEP;
				
			// draw up/down lines
			var treshold;

			if( count < 4 )
				treshold = THREE.MathUtils.seededRandom() * (count+1) - 1;
			else
				treshold = THREE.MathUtils.seededRandom() * (count-1) + 1;

			for( var j=0; j<count; j++ )
			{
				img.moveTo( x + (j+0.5)*LINE_STEP, y );
				//img.lineTo( x + (j+0.5)*LINE_STEP, y + LINE_LENGTH*sign );
				
				if( j < treshold )
				{
					// curve left
					if( sign > 0 )
						img.arc( prevX, y, x+(j+0.5)*LINE_STEP - prevX, 90, 45, false );
					else
						img.arc( prevX, y, x+(j+0.5)*LINE_STEP - prevX, 90, 135, true );
				}
				else
				{
					// curve right
					if( sign > 0 )
						img.arc( nextX, y, nextX - (x+(j+0.5)*LINE_STEP), 270, 315, true );
					else
						img.arc( nextX, y, nextX - (x+(j+0.5)*LINE_STEP), 270, 225, false );
				}
			}
			
			// draw horizontal line
			img.moveTo( x, y );
			x += (count) * LINE_STEP;
			img.lineTo( x, y );
			
			// if not the last one, add circle
			if( i < this.route.length-1 )
			{
				img.moveTo( x, y );
				x += 0.5 * LINE_STEP;
				img.lineTo( x, y );
				
				img.moveTo( x+CIRCLE_RADIUS, y+CIRCLE_RADIUS );
				img.arc( x+CIRCLE_RADIUS, y, CIRCLE_RADIUS );
				// img.moveTo( x+CIRCLE_RADIUS, y+CIRCLE_MIN_RADIUS );
				// img.arc( x+CIRCLE_RADIUS, y, CIRCLE_MIN_RADIUS );
				x += 2*CIRCLE_RADIUS;
				
				img.moveTo( x, y );
				x += 0.5 * LINE_STEP;
				img.lineTo( x, y );
				
			}
			
		}

		// ending node
		img.moveTo( x, y );
		x += LINE_STEP;
		img.lineTo( x, y );
		img.moveTo( x, y+CIRCLE_MIN_RADIUS );
		img.arc( x, y, CIRCLE_MIN_RADIUS );



//		img.moveTo( 0, 0 );
//		img.lineTo( 1024, 128 );

//		img.moveTo( 1024, 0 );
//		img.lineTo( 0, 128 );
	}

	setGlyphTexture( )
	{
		var material = this.routeRing.threejs.material;
		
		var seed = Math.floor( random(1,100000) );
		
		this.ringImage.clear( 'Crimson' );
		this.glyphStroke( this.ringImage, seed );
		this.ringImage.stroke( 'Black', 12 );
		this.ringImage.stroke( 'Yellow', 10 );
		
		if( material.map ) material.map.dispose( );
		material.map = new THREE.CanvasTexture( this.ringImage.canvas );
		material.map.repeat.set( 5, 1 ); 
		material.map.rotation = Math.PI/2; 
		material.map.offset.set( 0, 1 );
		material.map.wrapS = THREE.RepeatWrapping;
		material.map.wrapT = THREE.RepeatWrapping;			
		
		this.ringAlpha.clear( '#202020' );
		this.ringAlpha.context.shadowBlur = 5;
		this.ringAlpha.context.shadowColor = "white";
		this.glyphStroke( this.ringAlpha, seed );
		this.ringAlpha.stroke( 'White', 12 );
		this.ringAlpha.moveTo( 0, 0 );
		this.ringAlpha.lineTo( 1024, 0 );
		this.ringAlpha.moveTo( 0, 128 );
		this.ringAlpha.lineTo( 1024, 128 );
		this.ringAlpha.stroke( 'dimgray', 2 );
		
		if( material.alphaMap ) material.alphaMap.dispose( );
		material.alphaMap = new THREE.CanvasTexture( this.ringAlpha.canvas );
		material.alphaMap.repeat.set( 5, 1 ); 
		material.alphaMap.rotation = Math.PI/2; 
		material.alphaMap.offset.set( 0, 1 );
		material.alphaMap.wrapS = THREE.RepeatWrapping;
		material.alphaMap.wrapT = THREE.RepeatWrapping;			

/*
		var material = this.routeRing.threejs.material;
		
		this.ringImage.clear( 'Crimson' );
		this.ringImage.fillText( 6, 40, 'Abcdefgh Ijklmno Pqrstuvwxyz', 'Yellow', 'bold 60px Arial Black' );		
		this.ringImage.context.font = 'bold 60px Arial Black';		
		this.ringImage.context.lineWidth = 2;		
		this.ringImage.context.strokeStyle = 'Crimson';
		this.ringImage.context.strokeText( 'Abcdefgh Ijklmno Pqrstuvwxyz', 6, 88.2 );	
		this.ringImage.context.stroke( );	
		
		if( material.map ) material.map.dispose( );
		material.map = new THREE.CanvasTexture( this.ringImage.canvas );
		material.map.repeat.set( 4, 1 ); 
		material.map.rotation = Math.PI/2; 
		material.map.offset.set( 0, 1 );
		material.map.wrapS = THREE.RepeatWrapping;
		material.map.wrapT = THREE.RepeatWrapping;			
		
		this.ringAlpha.clear( 'Black' );
		this.ringAlpha.context.shadowBlur = 5;
		this.ringAlpha.context.shadowColor = "white";
		this.ringAlpha.fillText( 6, 40, 'Abcdefgh Ijklmno Pqrstuvwxyz', 'white', 'bold 60px Arial Black' );
		
		if( material.alphaMap ) material.alphaMap.dispose( );
		material.alphaMap = new THREE.CanvasTexture( this.ringAlpha.canvas );
*/
	}
	
	
	
	// clicking on the model while the game is not started
	// starts a new game
	onClickModel( )
	{
		if( playground.pointerMovement > Playground.POINTER_MOVEMENT )
			return;

		if( !playground.gameStarted )
			playground.newGame( );
	} // Playground.onClickModel
	
	
	// starts a new game by selecting new color hues
	newGame( )
	{
		super.newGame( );

		this.clickSound.play( );

		// remove model shell (because otherwise it will capture onclick events)
		this.modelShell.y = 1000;
		
		// pick solid index, spot index and route parameters
		var solidIdx = Math.round( THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 0, 4 ) ),
			spotIdx = Math.floor( random(0, this.solids[solidIdx].spots.length) ),
			routeLength = Math.round( THREE.MathUtils.mapLinear( this.difficulty**1.5, 10**1.5, 100**1.5, 2, 6 ) ),
			routeMax = THREE.MathUtils.mapLinear( this.difficulty, 10, 100, 2, 5 );

		// generate descriptor of the route; forward > 0, backward < 0, twin between two numbers
		// [2,-2,3,0] means FFtBBtFFFt
		this.route = [];
		for( var i=0; i<=routeLength; i++ )
			this.route.push( Math.floor(routeMax * random(0,1)**0.5 ) * random([-1,1]) );

		this.setGlyphTexture( );
		
		// show selected solid
		this.solid = this.solids[solidIdx];
		this.solid.show( spotIdx );

		// move to a random slot
		this.model.moveToSpot( spotIdx );
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
		
		// ...
		var score = 1;
		
		return score * points;

	} // Playground.evaluateGame
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		super.endGame( );
		
		this.clackSound.play( );
		
		this.solid.hide( );
		
		this.modelShell.y = -THREEJSModel.HEIGHT;
		
		this.model.moveToCenter( );
		
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
		this.clickSound = new PlaygroundAudio( 'sounds/click.mp3', 0.1, 4 );
		this.clackSound = new PlaygroundAudio( 'sounds/clack.mp3', 0.03 );
		//this.backgroundMelody = new PlaygroundAudio( 'sounds/background.mp3', 0.2, 1, true );
		
		this.soundEffects.push( this.clickSound, this.clackSound );
		//this.soundMelody.push( this.backgroundMelody );
	} // Playground.loadSounds
	
	
	
	// update the playground
	update( t, dT )
	{
		// ...
		this.model.update( t, dT );
	}
} // class Playground
