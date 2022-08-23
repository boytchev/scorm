//
//	library SCORM Utils
//



function update( t, dT )
{
	if( playground?.gameStarted )
	{
		playground.totalTime += dT;
	}
	if( playground?.update )
	{
		playground.update( t, dT );
	}
	TWEEN.update( 1000*t );
}



class PlaygroundAudio
{
	static audioListener;
	
	constructor( audioFile, volume, count=1, autoPlay=false )
	{
		this.audio = [];
		this.index = 0;
		this.volume = volume;

		if( !PlaygroundAudio.audioListener )
			PlaygroundAudio.audioListener = new THREE.AudioListener();
		
		var that = this;
		new THREE.AudioLoader().load( audioFile, function( buffer ) {
			for( var i=0; i<count; i++ )
			{
				that.audio.push( new THREE.Audio( PlaygroundAudio.audioListener ) );
				that.audio[i].setBuffer( buffer );
				that.audio[i].setVolume( 0 );
			}
			playground.setSound( );
			if( autoPlay && playground.getSound()=='on' ) that.audio[0].play( );
		});
			
	}
	
	mute( )
	{
		for( var audio of this.audio )
			audio.setVolume( 0 );
	}
	
	unmute( )
	{
		for( var audio of this.audio )
			audio.setVolume( this.volume );
	}
	
	setVolume( volume )
	{
		this.volume = volume;
		this.audio[this.index]?.setVolume( volume );
	}
	
	play( )
	{
		if( playground.getSound()=='off' ) return;
		
		this.index = (this.index+1) % this.audio.length;
		this.audio[ this.index ]?.play( );
	}
	
	stop( )
	{
		for( var audio of this.audio )
			if( audio.isPlaying ) audio.stop( );
	}
}


class ScormPlayground
{
	static TEMPORAL_AVERAGE_OLD = 0.7;
	static TEMPORAL_AVERAGE_NEW = 1-ScormPlayground.TEMPORAL_AVERAGE_OLD;
	
	static ICON_SOUND_ON = 'images/sound-on.png';
	static ICON_SOUND_FX = 'images/sound-fx.png';
	static ICON_SOUND_OFF = 'images/sound-off.png';


	constructor( )
	{
		this.gameStarted = false;
		
		this.totalTime = 0;
		
		this.totalScore = 0;
		this.scoreHistory = [];
		
		this.redrawScoreHistory( );
		
		this.soundMelody = [];
		this.soundEffects = [];
		
		scorm.setValue( 'cmi.core.lesson_status', 'incomplete' );

		element( 'sound-on-off' ).addEventListener( 'click', this.toggleSound );

		window.addEventListener( 'click', this.onGlobalClick );

		setInterval( update4PerSecond, 1000 );
		
		function update4PerSecond( )
		{
			var t = playground.totalTime;
			
			var hours = Math.floor(t/3600);
			if( hours<10 ) hours = '0'+hours;
			
			t -= 3600*hours;
			var minutes = Math.floor(t/60);
			if( minutes<10 ) minutes = '0'+minutes;
			
			t -= 60*minutes;
			var seconds = Math.floor(t);
			if( seconds<10 ) seconds = '0'+seconds;
			
			element('timer').innerHTML = `${hours}:${minutes}:${seconds}`;
		}
		
		this.translate( [
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

	} // ScormPlayground.constructor



	onGlobalClick( )
	{
		window.removeEventListener( 'click', playground.onGlobalClick );
		playground.loadSounds( );
	}


	// update the graph - a history of scores
	redrawScoreHistory( )
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
	} // ScormPlayground.redrawPerformanceGraph
	
	
	
	// starts a new game
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

		this.gameStarted = true;

	} // ScormPlayground.newGame
	
	
	
	// return difficulty 10 units above the current total score
	get difficulty( )
	{
		return Math.min( this.totalScore+10, 100 );
		
	} // ScormPlayground.difficulty
	
	
	
	// returns the score of the current game
	evaluateGame( )
	{
		return 0;
	}
	
	
	
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

		// hide the FULL SCREEN button if it was shown but not used
		if( element('suica-fullscreen-button' ) )
			element('suica-fullscreen-button' ).remove();
		
		this.gameStarted = false;
		
	} // ScormPlayground.endGame
	
	
	
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
				
				this.redrawScoreHistory( );
			})
			.start();
	} // ScormPlayground.animateScore



	// get the language for the user interface, currently supported languages
	// are English (en), Bulgarian (bg) and Japanese (jp)
	getLanguage( )
	{
		// get language parameter from the URL,
		// if omitted, use time zone of the OS
		
		var urlParams = new URLSearchParams( window.location.search );

		if( urlParams.has('lang') )
			return urlParams.get('lang');

		// https://stackoverflow.com/a/70870895
		var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			
		// https://codepen.io/diego-fortes/pen/YzEPxYw
		switch( timeZone )
		{
			case 'Europe/Sofia': return 'bg';
			case 'Asia/Tokyo':   return 'jp';
			default:             return 'en';
		}
	} // ScormPlayground.getLanguage



	// translate user interface elements using a custom dictionary
	translate( dictionary )
	{
		var language = this.getLanguage( );
		
		for( var string of dictionary )
		{
			if( string[language] )
			{
				var elem = element( string.id );
				if( elem ) elem.innerHTML = string[language] || string.en;
			}
		}
	} // ScormPlayground.translate
	
	
	
	// abstract method loadSounds
	loadSounds( )
	{
		throw 'abstract method';
	} // ScormPlayground.loadSounds

	
	
	mute( )
	{
		var sound;
		for( sound of this.soundEffects ) sound.mute( );
		for( sound of this.soundMelody )
		{
			sound.mute( );
			sound.stop( );
		}
	} // ScormPlayground.mute
	
	
	
	unmute( unmuteMelody )
	{
		var sound;
		for( sound of this.soundEffects ) sound.unmute( );
		
		for( sound of this.soundMelody ) 
			if( unmuteMelody )
			{
				sound.unmute( );
				sound.play( );
			}
			else
			{
				sound.mute( );
				sound.stop( );
			}
	} // ScormPlayground.unmute
	


	// get the status of the sound - either on or off (default)
	getSound( )
	{
		return localStorage.getItem( 'sound' ) || 'off';
	}



	// set sound button on/off depending on previous user's setting (if any)
	setSound( )
	{
		var elem = element( 'sound-on-off' );
		if( !elem ) return;

		switch( this.getSound() )
		{
			case 'on':
				elem.src = ScormPlayground.ICON_SOUND_ON;
				this.unmute( true );
				break;
			case 'fx':
				elem.src = ScormPlayground.ICON_SOUND_FX;
				this.unmute( false );
				break;
			case 'off':
			default:
				elem.src = ScormPlayground.ICON_SOUND_OFF;
				this.mute( );
				break;
		}
	}



	// toggle sound button on/off
	toggleSound( )
	{
		var elem = element( 'sound-on-off' );
		if( !elem ) return;

		// 'this' is not available, use 'playground' instead
		switch( playground.getSound() )
		{
			case 'fx':
				localStorage.setItem( 'sound', 'on' );
				elem.src = ScormPlayground.ICON_SOUND_ON;
				playground.unmute( true );
				break;
			case 'off':
				localStorage.setItem( 'sound', 'fx' );
				elem.src = ScormPlayground.ICON_SOUND_FX;
				playground.unmute( false );
				break;
			case 'on':
			default:
				localStorage.setItem( 'sound', 'off' );
				elem.src = ScormPlayground.ICON_SOUND_OFF;
				playground.mute( );
				break;
		}
	}
	
} // class ScormPlayground
	
	
class ScormUtils
{	

	// add UV2 attribute to objects with materials with light or AO mapping
	static addUV2( object )
	{
		var geometry = object.threejs.geometry;
		
		var uv = geometry.getAttribute('uv');
		
		geometry.setAttribute( 'uv2', new THREE.BufferAttribute( uv.array, 2 ) );
	} // ScormUtils.addUV2
	
	
	// load image and set its count and offset
	static image( fileName, uCount=1, vCount=uCount, uOffset=0, vOffset=uOffset )
	{
		var map = image( 'images/'+fileName );
			map.repeat.set( uCount, vCount );
			map.offset.set( uOffset, vOffset );
			
		return map;
	} // ScormUtils.image
	
} // class ScormUtils

