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
		this.totalTime = 0;
		
		this.scoreHistory = [];
		//for( var i=0; i<55; i++ ) this.scoreHistory.push( 50 + 30*Math.sin(i/10) );
		
		this.redrawPerformanceGraph( );
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
	
	
	redrawPerformanceGraph( )
	{
		var canvas = element( 'performance' ),
			W = canvas.width,
			H = canvas.height;
	
		var ctx = element( 'performance' ).getContext( '2d' );
		ctx.clearRect( 0, 0, W, H );

		ctx.strokeStyle = 'lightgray';
		for( var y=0; y<H; y+=20 )
		{
			ctx.moveTo( 0, y+0.5 );
			ctx.lineTo( W, y+0.5 );
		}
		for( var x=0; x<W; x+=20 )
		{
			ctx.moveTo( x+0.5, 0 );
			ctx.lineTo( x+0.5, H );
		}
		ctx.stroke( );

//		ctx.fillRect( 0, 0, W, H );

		ctx.fillStyle = 'black';

		for( var i in this.scoreHistory )
		{
			ctx.fillRect( 10*i+2, Math.min(H-1,H-H*this.scoreHistory[i]/100), 7, H );
		}
	} // Playground.redrawPerformanceGraph
	
	
	endGame( )
	{
		var score = this.evaluate( );
		
		if( score > this.totalScore )
			this.difficulty += 0.05;
		if( score < this.totalScore )
			this.difficulty -= 0.05;
		this.difficulty = THREE.MathUtils.clamp( this.difficulty, 0, 1 );
		
		this.totalScore = Playground.TEMPORAL_AVERAGE_OLD*this.totalScore + Playground.TEMPORAL_AVERAGE_NEW*score;

		this.scoreHistory.push( this.totalScore );
		if( this.scoreHistory.length > 24 ) this.scoreHistory.shift();

		var sc = this.totalScore.toFixed(1);
		element('score').innerHTML = sc;
		element('score').style.right = 1+0.065*(sc.length-1)+'em';
		
		console.log( 'end game',score,this.totalScore );

		
		playground.masterPlate.flipOut( 0 );
		for( var plate of this.plates )
		{
			plate.retract( );
		}

		this.redrawPerformanceGraph( );
		
		
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
