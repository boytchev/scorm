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
		this.masterPlate = new Plate( [0,0,0], 0 );
		this.masterPlate.addEventListener( 'click', function(){playground.newGame( 0 )} );

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
				
			var plate = new Plate( [x,0,z], 90-spin );
				plate.addEventListener( 'click', function(){this.toggle();} );
			
			this.plates.push( plate );
		}
	
		
	} // Playground.constructor
	
	newGame( difficulty )
	{
		var mapLinear = THREE.MathUtils.mapLinear;
		
		// 000 015 030 045 060 075 090 105 120 135 150 165
		// 1.0 0.6 0.4 0.4 0.5 0.5 0.9 1.2 1.9 1.0 0.5 0.4
		
		// 180 195 210 225 240 255 270 285 300 315 330 345
		// 0.4 0.4 0.6 0.9 1.8 0.8 0.4 0.6 0.9 0.9 0.8 0.9
		/*
		var colorSensitivity = spline( [[1.0],[0.6],[0.4],[0.4],[0.5],[0.5],[0.9],[1.2],[2.0],[1.2],[0.5],[0.4],[0.4],[0.4],[0.6],[0.9],[1.8],[0.9],[0.4],[0.6],[0.9],[0.9],[0.8],[0.9]], true, false );
		
		var masterHue = random( 0, 359 );
		//,			sensitivity = 1;//colorSensitivity( masterHue/360 )[0];

		this.masterPlate.hue = masterHue;
		this.masterPlate.flipIn( 0 );
		
		var deltaHue = random( 10, 30 ),
			deltaIndex = random( [0, 1, 2, 3, 4, 5] );
		this.plates[ deltaIndex ].hue = masterHue+deltaHue;
		this.plates[ (deltaIndex+3)%6 ].hue = masterHue-deltaHue;

		var sign = random( [-1, 1] );
		var hueStep = sensitivity * mapLinear( difficulty, 0, 1, 30, 6 );
		var hueSpan = sensitivity * mapLinear( difficulty, 0, 1, 60, 12 );
		var hues = [masterHue+sign*hueStep*sensitivity];
		hues = [masterHue+sign*hueStep];
		
		for( var i=1; i<6; i++ )
		{
			hues.push( masterHue-sign*mapLinear(i,1,5,hueStep,hueSpan) );
		}
		hues.sort(() => random([-1,1]));
		for( var i=0; i<6; i++ )
		{
			var j = random([0,1,2,3,4,5]);
			var temp = hues[i];
			hues[i] = hues[j];
			hues[j] = temp;
		}
*/		

		var hues = [],
			masterHue = random( 0, 359 ),
			hueStep = mapLinear( difficulty, 0, 1, 60, 10 );
		
		this.masterPlate.hue = masterHue + random([0.5, 1.5, 2.5, 3.5, 4.5])*hueStep;
		this.masterPlate.flipIn( 0 );
		
		for( var i=0; i<6; i++ )
		{
			hues.push( masterHue + i*hueStep );
		}

		for( var k=0; k<10; k++ )
		{
			var i = random([0,1,2,3,4,5]);
			var j = random([0,1,2,3,4,5]);
			var temp = hues[i];
			hues[i] = hues[j];
			hues[j] = temp;
		}

		for( var plate of this.plates )
		{
			plate.hue = hues.pop();
			plate.flipIn( 0 );
		}

console.log( this.masterPlate.hue );
for( var plate of this.plates )
{
	var diff=plate.hue-this.masterPlate.hue;
	if(diff>=180) diff-=360;
	if(diff<=-180) diff+=360;
console.log( plate.hue, 'delta', diff);
}

	} // Playground.newGame
	
} // class Playground
