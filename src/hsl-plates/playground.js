//
// class Playground
//
// public API:
// 
// 	newGame( difficulty=[0..1] )
//


class Playground
{
	static TEMPORAL_AVERAGE_OLD = 0.7;
	static TEMPORAL_AVERAGE_NEW = 1-Playground.TEMPORAL_AVERAGE_OLD;
	
	constructor( )
	{
		this.masterPlate = new Plate( this, [0,0,0], 0 );
		this.masterPlate.isMasterPlate = true;

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
				
			var plate = new Plate( this, [x,0,z], 90-spin );
			
			this.plates.push( plate );
		}
	
		this.difficulty = 0;
		this.masterIndex = 0;
		this.gameStarted = false;
		
		this.totalScore = 0;
		
	} // Playground.constructor
	

	evaluate( )
	{
		var answers = [];
		for( var i in this.plates )
		{
			var plate = this.plates[i];
			if( plate.selected ) answers.push( Math.abs(plate.index-this.masterPlate.index)-0.5 );
		}

		var points = THREE.MathUtils.mapLinear( this.difficulty, 0, 1, 30, 100 );
		var score = 0;
		
		switch( answers.join('') )
		{
			case '00':
				score = 1.0; break;
			case '01':
			case '10':
				score = 0.5; break;
			case '11':
				score = 0.3; break;
			case '02':
			case '20':
				score = 0.1; break;
		}
		
		return score * points;
		
	} // Playground.evaluate
	
	
	endGame( )
	{
		var score = this.evaluate( );
		
		if( score > this.totalScore )
			this.difficulty += 0.05;
		if( score < this.totalScore )
			this.difficulty -= 0.05;
		this.difficulty = THREE.MathUtils.clamp( this.difficulty, 0, 1 );
		
		this.totalScore = Playground.TEMPORAL_AVERAGE_OLD*this.totalScore + Playground.TEMPORAL_AVERAGE_NEW*score;

		console.log( 'end game',score,this.totalScore );

		
		playground.masterPlate.flipOut( 0 );
		for( var plate of this.plates )
		{
			plate.retract( );
		}


		this.gameStarted = false;
	} // Playground.endGame
	
	
	newGame( )
	{
		console.log( 'new game' );
		
		// prepare master plate
		
		this.masterPlate.index = random([0.5, 1.5, 2.5, 3.5, 4.5]);
		
		var masterHue = random( 0, 359 ),
			hueStep = THREE.MathUtils.mapLinear( this.difficulty, 0, 1, 60, 10 );
		
		this.masterPlate.hue = masterHue + this.masterPlate.index*hueStep;
		this.masterPlate.flipIn( 0 );
		
		
		// prepare other plates
		
		var j = random([0,1,2,3,4,5]);
		for( var i=0; i<6; i++ )
		{
			var plate = this.plates[ (i+j)%6 ];
			plate.hue = masterHue + i*hueStep;
			plate.index = i;
			
			if( i%2 ) plate.flipIn( 0 ); else plate.flipOut( 0 );
		}

		this.gameStarted = true;
/*		
console.log( Math.round(this.masterPlate.hue));
for( var plate of this.plates )
{
	var diff=plate.hue-this.masterPlate.hue;
	if(diff>=180) diff-=360;
	if(diff<=-180) diff+=360;
console.log( Math.round(plate.hue), `Δ = ${Math.round(100*diff/180)}%`,'idx='+plate.index, 'pts=',Math.abs(plate.index-this.masterPlate.index)-0.5);
}
*/
	} // Playground.newGame
	
} // class Playground
