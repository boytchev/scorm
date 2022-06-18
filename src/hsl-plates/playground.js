//
// class Playground
//
// public API:
// 
// 	newGame( difficulty=[0..1] )
//


class Playground
{
	constructor( )
	{
		this.masterPlate = new Plate( this, [0,0,0], 0 );
		this.masterPlate.addEventListener( 'click', function(){playground.toggleGame( )} );

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
				
			var plate = new Plate( this, [x,0,z], 90-spin );
				plate.addEventListener( 'click', function(){this.toggle();} );
			
			this.plates.push( plate );
		}
	
		this.gameStarted = false;
		
	} // Playground.constructor
	
	toggleGame( )
	{
		console.log('bobo');
		if( this.gameStarted )
			this.endGame( );
		else
			this.newGame( 0 );
	}
	
	
	endGame( )
	{
		console.log( 'end game' );
		
		this.masterPlate.flipOut( 0 );
		
		for( var plate of this.plates )
		{
			plate.flipOut( 0 );
			if( plate.selected )
				plate.toggle( );
		}

		this.gameStarted = false;
	}
	
	newGame( difficulty )
	{
		console.log( 'new game' );
		
		// prepare master plate
		
		var masterHue = random( 0, 359 ),
			hueStep = THREE.MathUtils.mapLinear( difficulty, 0, 1, 60, 10 );
		
		this.masterPlate.hue = masterHue + random([0.5, 1.5, 2.5, 3.5, 4.5])*hueStep;
		this.masterPlate.flipIn( 0 );
		
		
		// prepare other plates
		
		var j = random([0,1,2,3,4,5]);
		for( var i=0; i<6; i++ )
		{
			var plate = this.plates[ (i+j)%6 ];
			plate.hue = masterHue + i*hueStep;
			plate.flipIn( 0 );
		}

		this.gameStarted = true;
		
console.log( Math.round(this.masterPlate.hue));
for( var plate of this.plates )
{
	var diff=plate.hue-this.masterPlate.hue;
	if(diff>=180) diff-=360;
	if(diff<=-180) diff+=360;
console.log( Math.round(plate.hue), `Δ = ${Math.round(100*diff/180)}%`);
}

	} // Playground.newGame
	
} // class Playground
