//
//	class Playground( )
//
//		newGame( )
//		endGame( )
//
//		canEndGame( )
//		evaluateGame( )
//		redrawPerformanceGraph( )
//		animateScore( oldScore )
//		resize( )
//		loadSounds( )
//		clickSound( )
//		clackSound( )
//		mute( )
//		unmute( )
	

class Playground
{
	static TEMPORAL_AVERAGE_OLD = 0.7;
	static TEMPORAL_AVERAGE_NEW = 1-Playground.TEMPORAL_AVERAGE_OLD;
	
	static POINTS_SPEED = 2000;
	
	
	
	constructor( )
	{
		// create plates
		this.masterPlate = new Plate( [0,0,0], 0 );
		this.masterPlate.isMasterPlate = true;

		this.plates = [ ];
		for( var spin=-30; spin<360-30; spin+=60 )
		{
			var x = 19 * Math.cos( radians(spin) ),
				z = 19 * Math.sin( radians(spin) );
		
			this.plates.push( new Plate( [x,0,z], 90-spin ) );
		}
	
		this.masterIndex = 0;
		
		this.gameStarted = false;
		
		this.totalScore = 0;
		this.totalTime = 0;

		this.scoreHistory = [];
		
		this._clickIndex = -1;
		this._clickSound = [null, null, null, null];
		this._clackSound = null;
		this._backgroundSound = null;
		
		this.redrawPerformanceGraph( );
		this.resize( );

		element( 'sound-on-off' ).addEventListener( 'click', toggleSound );
		
		translate( [
			{id: 'txt-time',
				en: 'Time',
				bg: 'Време',
				jp: '時間'},
			{id: 'txt-score',
				en: 'Score',
				bg: 'Резултат',
				jp: '時間'},
			{id: 'txt-performance',
				en: 'Performance',
				bg: 'Изпълнение',
				jp: '時間'},
			{id: 'txt-caption',
				en: 'Color hues',
				bg: 'Цветни оттенъци',
				jp: '色相'},
			{id: 'txt-user',
				en: scorm.api
						? `<b>${scorm.studentName}</b>`
						: '<b>Guest</b>',
				bg: scorm.api
						? `<b>${scorm.studentName}</b>`
						: '<b>Гост</b>',
				jp: scorm.api
						? `<b>${scorm.studentName}</b>`
						: '<b>賓客</b>',
				},
			{id: 'suica-fullscreen-button',
				en: 'FULLSCREEN',
				bg: 'ПЪЛЕН ЕКРАН',
				jp: 'フルスクリーン'},
		] );
		
		scorm.setValue( 'cmi.core.lesson_status', 'not attempted' );
		//scorm.setValue( 'cmi.student_data.mastery_score', '100' );

	} // Playground.constructor

	

	// starts a new game by selecting new color hues
	newGame( )
	{
		// initiate SCORM data when the first game starts,
		// i.e. there is still no any score history
		if( this.scoreHistory.length==0 )
		{
			scorm.setValue( 'cmi.core.lesson_status', 'completed' );
			scorm.setValue( 'cmi.core.score.max', 100 );
			scorm.setValue( 'cmi.core.score.min', 0 );
		}

		// protect agains browser closure - assume that the user
		// will gets 0 points, update the points when the game ends
		scorm.score = (Playground.TEMPORAL_AVERAGE_OLD*this.totalScore).toFixed(1);

		// generate initial hue and hue step
		var masterHue = random( 0, 359 ),
			difficulty = Math.min( this.totalScore+10, 100 ),
			hueStep = THREE.MathUtils.mapLinear( difficulty, 0, 100, 70, 7 );
			
		// setup master plate hue
		this.masterPlate.index = random([0.5, 1.5, 2.5, 3.5, 4.5]);
		this.masterPlate.hue = masterHue + this.masterPlate.index*hueStep;
		this.masterPlate.flipIn( );
		
		// setup other plates hues
		var offset = random([0,1,2,3,4,5]);
		for( var i=0; i<6; i++ )
		{
			var plate = this.plates[ (i+offset)%6 ];
			plate.hue = masterHue + i*hueStep;
			plate.index = i;
			
			plate.flipIn( );
		}

		this.gameStarted = true;

	} // Playground.newGame



	// check whether a game can end - there must be two selected plates
	canEndGame( )
	{
		this.clackSound( );
		
		var selected = 0;
		for( var plate of this.plates )
			if( plate.selected )
				selected++;
		
		return selected==2;
	} // Playground.canEndGame
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		// get offsets of selected plates compared to the correct plate
		// 0 = the correct plate is selected; 1 = next to the correct, and so on
		
		var answers = [];
		for( var i in this.plates )
		{
			var plate = this.plates[i];
			if( plate.selected ) answers.push( Math.abs(plate.index-this.masterPlate.index)-0.5 );
		}

		var difficulty = Math.min( this.totalScore+10, 100 ),
			points = THREE.MathUtils.mapLinear( difficulty, 0, 100, 30, 100 );
		
		var score = 0;
		
		switch( answers.join('') )
		{
			case '00': return points;		// 100% of points for correct answer

			case '01':
			case '10': return 0.5*points;	// 50%

			case '11': return 0.3*points;	// 30%

			case '02':
			case '20': return 0.1*points;	// 10%

			default: return 0;
		}
	} // Playground.evaluateGame
	
	
	
	// update the graph - a history of scores
	redrawPerformanceGraph( )
	{
		// get sizes
		var canvas = element( 'performance' ),
			W = canvas.width,
			H = canvas.height;
	
		// clear the canvas
		var ctx = element( 'performance' ).getContext( '2d' );
			ctx.clearRect( 0, 0, W, H );

		// draw the grid
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

		// draw the history bars
		for( var i in this.scoreHistory )
		{
			ctx.fillStyle = 'black';
			ctx.fillRect( 10*i+2, Math.min(H-1,H-H*this.scoreHistory[i]/100), 7, H );
		}
		
	} // Playground.redrawPerformanceGraph
	
	
	
	// ends the current game - evaluate results, update data
	endGame( )
	{
		// get the score
		var score = this.evaluateGame( );

		// calculate temporal average score
		var oldScore = this.totalScore;
		this.totalScore = Playground.TEMPORAL_AVERAGE_OLD*this.totalScore + Playground.TEMPORAL_AVERAGE_NEW*score;
		
		// ensure that an increment of the total score are at least 1 point
		// this is important when the score reaches 100% - increments
		// become too small
		if( this.totalScore > oldScore && this.totalScore < oldScore+1 )
			this.totalScore = THREE.MathUtils.clamp( oldScore+1, 0, 100 );

		// send the score to LMS
		scorm.score = this.totalScore.toFixed(1);

		// record the score in the history
		this.scoreHistory.push( this.totalScore );
		if( this.scoreHistory.length > 24 )
		{
			this.scoreHistory.shift();
		}
			
		// the change of total score is animated
		// from the center to the score corner
		this.animateScore( oldScore );
		
		// flip out all plates
		playground.masterPlate.flipOut( );
		for( var plate of this.plates ) plate.flipOut( );

		// Hide the FULL SCREEN button if it was shown but not used
		if( element('suica-fullscreen-button' ) )
			element('suica-fullscreen-button' ).remove();
		
		this.gameStarted = false;
		
	} // Playground.endGame
	


	// animate score floating from center to the score corner
	animateScore( oldScore )
	{
		var scoreElem = element('score');
		
		var pointsElem = element( 'points' ),
			pointsValue = Math.round(10*(this.totalScore-oldScore))/10;
			pointsElem.innerHTML = (pointsValue>0?'+':'')+pointsValue;
			
		new TWEEN.Tween( {opacity:0, scale:4, x:suica.width/2, y:suica.height/2} )
			.to( {opacity:1, scale:1, x:scoreElem.offsetLeft+30, y:scoreElem.offsetTop}, Playground.POINTS_SPEED )
			.easing( TWEEN.Easing.Cubic.InOut )
			.onUpdate( (state) => {
				pointsElem.style.opacity = 0.5-0.5*Math.cos(2*Math.PI*state.opacity);
				pointsElem.style.transform = `scale(${1.3*state.scale},${state.scale})`;
				pointsElem.style.right = Math.round(state.x)+'px';
				pointsElem.style.bottom = Math.round(state.y)+'px';
			})
			.onComplete( ()=> {
				var sc = this.totalScore.toFixed(1);
				scoreElem.innerHTML = sc;
				scoreElem.style.right = 1+0.065*(sc.length-1)+'em';
				
				this.redrawPerformanceGraph( );
			})
			.start();
	}
	
	
	
	// update the viewpoint to set the image size depending
	// on orientation of mobile devices
	resize( )
	{
		var distance = 90*THREE.MathUtils.clamp(suica.canvas.clientHeight/suica.canvas.clientWidth,1,3);
		lookAt( [0,distance,0], [0,0,0], [0,0,1] );
	} // Playground.resize
	


	// load all sounds
	loadSounds( )
	{
		var audioListener = new THREE.AudioListener();

		new THREE.AudioLoader().load( 'sounds/click.mp3', function( buffer ) {
			for( var i=0; i<4; i++ )
			{
				playground._clickSound[i] = new THREE.Audio( audioListener );
				playground._clickSound[i].setBuffer( buffer );
				playground._clickSound[i].setVolume( 0 );
			}
			setSound( );
		});

		new THREE.AudioLoader().load( 'sounds/clack.mp3', function( buffer ) {
			playground._clackSound = new THREE.Audio( audioListener );
			playground._clackSound.setBuffer( buffer );
			playground._clackSound.setVolume( 0 );
			setSound( );
		});

		new THREE.AudioLoader().load( 'sounds/background.mp3', function( buffer ) {
			playground._backgroundSound = new THREE.Audio( audioListener );
			playground._backgroundSound.setBuffer( buffer );
			playground._backgroundSound.setVolume( 0 );
			playground._backgroundSound.play( );
			setSound( );
		});
	} // Playground.loadSounds



	mute( )
	{
		for( var i=0; i<4; i++ )
			this._clickSound[i]?.setVolume( 0 );
		this._clackSound?.setVolume( 0 );
		this._backgroundSound?.setVolume( 0 );
	} // Playground.mute
	
	
	
	unmute( unmuteBackground )
	{
		for( var i=0; i<4; i++ )
			this._clickSound[i]?.setVolume( 0.1 );
		this._clackSound?.setVolume( 0.03 );
		this._backgroundSound?.setVolume( unmuteBackground?0.2:0 );
	} // Playground.unmute
	
	
	
	clickSound( )
	{
		this._clickIndex = (this._clickIndex+1)%4;
		this._clickSound[this._clickIndex]?.play( );
	} // Playground.clickSound



	clackSound( )
	{
		this._clackSound?.play( );
	} // Playground.clackSound

	
} // class Playground
