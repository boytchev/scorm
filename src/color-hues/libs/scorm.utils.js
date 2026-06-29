//
//	library SCORM Utils
//



// smart legacy XR path enforcer - only for local development with emulator / AI
function setupLegacyXRForEmulator()
{

    const isLocalhost = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '[::1]';

    if( !isLocalhost ) return; // do nothing if not on localhost

    console.log('Localhost detected - forcing legacy XR path for emulator compatibility');

    if( typeof XRWebGLBinding === "undefined" ) return;

    try {
		
        const proto = XRWebGLBinding.prototype;
        
        // remove createProjectionLayer to force legacy path
        if (Object.getOwnPropertyDescriptor(proto, 'createProjectionLayer'))
		{
			
            delete proto.createProjectionLayer;
            console.log('Successfully forced legacy XR path');
			
        }
		
    } catch (e) {
        console.warn('could not modify XRWebGLBinding:', e);
    }
}



function update( t, dT )
{
	if( playground )
	{
		if( playground.gameStarted ) playground.totalTime += dT;
		
		if( playground.update ) playground.update( t, dT );
		
		if( playground.inVR )
		{
			var intersections0 = playground.vrIntersections( playground.controller0 );
			
			if( intersections0.length )
				playground.marker0.center = [...intersections0[0].point];
			else
				playground.marker0.center = [0,-1000,0];

			var intersections1 = playground.vrIntersections( playground.controller1 );
			
			if( intersections1.length )
				playground.marker1.center = [...intersections1[0].point];
			else
				playground.marker1.center = [0,-1000,0];
		}
	}
	TWEEN.update( 1000*t );
}



class PlaygroundAudio
{
//	static audioListener;
	
	constructor( audioFile, volume, count=1, autoplay=false, loop=false )
	{
		this.audio = [];
		this.index = 0;
//		this.volume = volume;
		
		for( var i=0; i<count; i++ )
		{
			this.audio[i] = new Audio( audioFile );
			this.audio[i].autoplay = autoplay;
			this.audio[i].loop = loop;
			this.audio[i].volume = volume;
			this.audio[i].pause( );

			this.audio[i].addEventListener( 'canplaythrough', this.onLoaded );
			
//			console.log( 'LOADING', audioFile.split('/').pop() );
		}

	}


	onLoaded( event )
	{
//		console.log( 'READY', event.path[0].src.split('/').pop() );
		playground.setSound( );
	}
	
	
	mute( )
	{
		for( var audio of this.audio )
			audio.muted = true;
	}
	
	unmute( )
	{
		for( var audio of this.audio )
			audio.muted = false;
	}
	
	setVolume( volume )
	{
//		this.volume = volume;
		this.audio[this.index].volume = volume;
	}
	
	play( )
	{
//		console.log( 'ATTEMPT', this.audio[this.index].src.split('/').pop() );
		if( playground.userInteracted == false ) return;
		if( playground.getSound() == 'off' ) return;
		
		this.index = (this.index+1) % this.audio.length;

		// https://www.w3schools.com/jsref/prop_audio_readystate.asp
		if( this.audio[this.index].readyState >= 4/*HAVE_ENOUGH_DATA*/ )
		{
//			console.log( 'PLAY', this.audio[this.index].src.split('/').pop() );
			this.audio[this.index].play( );
		}
	}
	
	stop( )
	{
		for( var audio of this.audio )
			audio.pause( );
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
		lookAt( [0,0,200], [0,0,0], [0,1,0] );

		this.gameStarted = false;
		
		this.gameTime = 0;
		this.gameHits = 0;
		this.gameNumber = 0;
		
		this.totalTime = 0;
		
		this.totalScore = 0;
		this.scoreHistory = [];
				
		this.redrawScoreHistory( );

		this.soundMelody = [];
		this.soundEffects = [];
		this.loadSounds( );
		
		this.userInteracted = false; // used for audio play

		suica.light.intensity = 0;

		this.light = new THREE.PointLight( 'white', 5 );
		this.light.position.y = 1;
		this.light.decay = 0;
		suica.scene.add( this.light );
			
			
		this.urlParams = new URLSearchParams( window.location.search );
		this.inVRMode = this.urlParams.has( 'vr' ); // whether VR is or should be used
		this.inVR = false; // whether in VR session right now
		if( this.inVRMode ) {
			this.vrInitialize( );
		} else {
			suica.fullScreen( );
		}
		
		scorm.setValue( 'cmi.core.lesson_status', 'incomplete' );

		element( 'sound-on-off' ).addEventListener( 'click', this.toggleSound );

		window.addEventListener( 'pointerdown', this.onGlobalClick );
		window.addEventListener( 'visibilitychange', this.onVisibilityChange );

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
			
			var time = `${hours}:${minutes}:${seconds}`;
			element('timer').innerHTML = time;
			
			if( playground.inVR )
			{
				playground.vrTimePanel.image.clear( );
				playground.vrTimePanel.image.moveTo(5,125,295,125,295,5);
				playground.vrTimePanel.image.stroke('black',1);
				playground.vrTimePanel.image.fillText( 18, 60, time, 'black', 'bold 66px Arial' );
				playground.vrTimePanel.image.fillText( 154, 20, element('txt-time').innerHTML, 'black', '36px Arial' );

				playground.vrScorePanel.image.clear( );
				playground.vrScorePanel.image.moveTo(5,5,295,5,295,125);
				playground.vrScorePanel.image.stroke('black',1);
				var xx = 0;
				var txt = playground.totalScore.toFixed(1);
				if( txt.length==3 ) xx = 185;
				if( txt.length==4 ) xx = 150;
				if( txt.length==5 ) xx = 110;
				playground.vrScorePanel.image.fillText( xx, 20, txt, 'black', 'bold 66px Arial' );
				playground.vrScorePanel.image.fillText( 100, 85, element('txt-score').innerHTML, 'black', '36px Arial' );
			}
		}
		
		this.translate( [
			{id: 'txt-time',
				en: 'TIME',
				bg: 'ВРЕМЕ',
				jp: '時間'},
			{id: 'txt-score',
				en: 'SCORE',
				bg: 'РЕЗУЛТАТ',
				jp: '時間'},
			{id: 'txt-performance',
				en: 'PERFORMANCE',
				bg: 'ИЗПЪЛНЕНИЕ',
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
		if( playground )
		{
			playground.userInteracted = true;
			playground.setSound( );
			playground.gameHits++;
		}
	}


	// if user exits the game tab, end the game automatically	
	onVisibilityChange( )
	{
		if( playground && playground.gameStarted )
			playground.endGame( true );
	}



	// when user enters VR experience
	onEnterVR( )
	{
		console.log('🔴 VR Session STARTED - User is now in VR');
		playground.inVR = true;
	}



	// when user exits VR experience
	onExitVR( )
	{
		console.log('🔵 VR Session ENDED - User exited VR');
		playground.inVR = false;
	}



	vrInitialize( )
	{
		// fix local VR simulator
		setupLegacyXRForEmulator();
		
		// track vr mode
		suica.vr( );
		suica.renderer.xr.addEventListener('sessionstart', this.onEnterVR );
		suica.renderer.xr.addEventListener('sessionend', this.onExitVR );

		// fix VR camera frustum
		suica.vrCamera.children[0].near = 0.01;
		suica.vrCamera.children[0].far = 30;
		suica.vrCamera.children[0].updateProjectionMatrix();
		
		// create controllers
		this.controller0 = suica.renderer.xr.getController(0);
		this.controller0.addEventListener( 'selectstart', function(){ playground.ray0.material.color.set(1,0.5,0); } );
		this.controller0.addEventListener( 'selectend', function(){ playground.ray0.material.color.set(1,1,1); } );
		this.controller0.addEventListener( 'select', function(){ playground.vrClick( playground.controller0 ); } );
		
		this.controller1 = suica.renderer.xr.getController(1);
		this.controller1.addEventListener( 'selectstart', function(){ playground.ray1.material.color.set(1,0.5,0); } );
		this.controller1.addEventListener( 'selectend', function(){ playground.ray1.material.color.set(1,1,1); } );
		this.controller1.addEventListener( 'select', function(){ playground.vrClick( playground.controller1 ); } );

		suica.scene.add( suica.vrCamera );
		suica.vrCamera.add( this.controller0 );
		suica.vrCamera.add( this.controller1 );
	
		// create controllers rays
		// this.ray0 = new THREE.Mesh(
					// new THREE.CylinderGeometry( 0.01, 0.001, 1 ).rotateX( Math.PI/2 ).translate( 0, 0, -0.5 ),
					// new THREE.MeshBasicMaterial( {
						// color: 'white',
						// transparent: true,
						// opacity: 0.7} )
				// );
		this.ray0 = suica.model('models/hand.glb');
		its.center = [-0.015,-0.015,-0.15]
		its.size = [-0.075,0.075,0.075];
		its.spinH = -10;
		this.ray0.onload = ()=>{
			this.ray0.threejs.children[0].children[0].material = new THREE.MeshPhysicalMaterial({
				color: 'ghostwhite',
				transmission: 1.5,
				reflectivity: 1,
				roughness: 0.45,
			});
		}
		this.controller0.add( this.ray0.threejs );

		// this.ray1 = new THREE.Mesh( this.ray0.geometry, this.ray0.material.clone() );
		this.ray1 = suica.model('models/hand.glb');
		its.center = [0.015,-0.015,-0.15]
		its.size = [0.075,0.075,0.075];
		its.spinH = 10;
		this.ray1.onload = ()=>{
			this.ray1.threejs.children[0].children[0].material = new THREE.MeshPhysicalMaterial({
				color: 'ghostwhite',
				transmission: 1.5,
				reflectivity: 1,
				roughness: 0.45,
			});
		}
		this.controller1.add( this.ray1.threejs );

		this.marker0 = suica.sphere( [0,0,0], 0.3, 'white' );
		this.marker0.threejs.material = new THREE.MeshBasicMaterial({
			color: 'white',
			transparent: true,
			opacity: 0.7,
		depthTest: false} );
		this.marker0.threejs.renderOrder = -10;
		
		this.marker1 = suica.sphere( [0,0,0], 0.3, 'white' );
		this.marker1.threejs.material = new THREE.MeshBasicMaterial({
			color: 'white',
			transparent: true,
			opacity: 0.7,
		depthTest: false} );
		this.marker1.threejs.renderOrder = -10;
				
		// create time info panel
		this.vrTimePanel = suica.square( [-3,0,3], [1.5,0.6], 'white' );
		its.spinH = 180;
		its.spinV = -90;
		its.image = drawing( 300, 130 );

		// create score info panel
		this.vrScorePanel = suica.square( [-3,0,-3], [1.5,0.6], 'white' );
		its.spinH = 180;
		its.spinV = -90;
		its.image = drawing( 300, 130 );

		// create dscore info panel
		this.vrDScorePanel = suica.square( [0,1,0], [1,0.5], 'white' );
		its.spinH = 180;
		its.spinV = -90;
		its.image = drawing( 600, 300 );
		its.threejs.material.transparent = true;
		
		this.raycaster = new THREE.Raycaster( );
		this._v = new THREE.Vector3( ); // dummy
		this.intersectables = [];
		
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
		
		this.gameNumber++;
				
		// if score is almost 100, keep it as it is (no penalty for early exit)
		var score = this.totalScore * (this.totalScore > 99.9 ? 1 : Playground.TEMPORAL_AVERAGE_OLD);
			score = score.toFixed( 1 )+'1'; // id for start of game

		setTimeout( () => {
			
			if ( scorm.api && scorm.api.LMSInitialize( "" ) ) {

				// initiate SCORM data when the first game starts,
				// i.e. there is still no any score history
				if( this.scoreHistory.length==0 )
				{
					//console.log( 'cmi.core.lesson_status', 'completed' );
					//console.log( 'cmi.core.score.max', 100 );
					//console.log( 'cmi.core.score.min', 0 );

					scorm.api.LMSSetValue( 'cmi.core.lesson_status', 'completed' );
					scorm.api.LMSSetValue( 'cmi.core.score.max', 100 );
					scorm.api.LMSSetValue( 'cmi.core.score.min', 0 );
				}

				//console.log( 'cmi.core.score.raw', score );
				//console.log( 'cmi.comments', '['+score );

				scorm.api.LMSSetValue( 'cmi.core.score.raw', score );
				scorm.api.LMSSetValue( 'cmi.comments', '['+score );

				scorm.api.LMSCommit( '' );
				scorm.api.LMSFinish( '' );

			}
			
		}, 0 );
		
		this.gameStarted = true;
		this.gameTime = performance.now();
		this.gameHits = 0;

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
	endGame( forced = false )
	{

		// get the score
		var score = this.evaluateGame( );

		// calculate temporal average score
		var oldScore = this.totalScore;
		this.totalScore = Playground.TEMPORAL_AVERAGE_OLD*this.totalScore + Playground.TEMPORAL_AVERAGE_NEW*score;
		
		// protect high scores
		if( oldScore>99.9 )
			this.totalScore = Math.max( this.totalScore, oldScore );
		
		// ensure that an increment of the total score is at least 2 points
		// this is important when the score reaches 100% - increments
		// become too small
		if( this.totalScore > oldScore && this.totalScore < oldScore+2 )
			this.totalScore = THREE.MathUtils.clamp( this.totalScore+2, 0, 100 );


		var lastScore = this.totalScore.toFixed(1);

		var message = '-' + Math.round(10*Math.round( performance.now() - this.gameTime )/1000)
						  + '.' + this.gameHits + (forced?'(!)':'') + '=' + lastScore + ']';
		
		setTimeout( () => {
			
			if ( scorm.api && scorm.api.LMSInitialize( "" ) ) {

				//console.log( 'cmi.core.score.raw', lastScore );
				//console.log( 'cmi.comments', message );

				// send the score to LMS
				scorm.api.LMSSetValue( 'cmi.core.score.raw', lastScore );
				scorm.api.LMSSetValue( 'cmi.comments', message );
				
				scorm.api.LMSCommit( "" );
				scorm.api.LMSFinish( "" );
				
			}
			
		}, 0 );
		
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
			
		if( this.totalScore>99.9 ) pointsElem.innerHTML = '&#x22C6;';
		

		if( this.inVR )
		{
			this.vrDScorePanel.image.clear( );
			this.vrDScorePanel.image.fillText( 20, 20, pointsElem.innerHTML, 'black', 'bold 300px Arial' );
			this.vrDScorePanel.visible = true;
			this.vrDScorePanel.size = 0;
		}
		

		new TWEEN.Tween( {opacity:0, scale:4, x:suica.width/2, y:suica.height/2, vrScale:0.01} )
			.to( {opacity:1, scale:1, x:scoreElem.offsetLeft+30, y:scoreElem.offsetTop, vrScale:10}, Playground.POINTS_SPEED )
			.easing( TWEEN.Easing.Cubic.InOut )
			.onUpdate( (state) => {
				pointsElem.style.opacity = 0.5-0.5*Math.cos(2*Math.PI*state.opacity);
				pointsElem.style.transform = `scale(${1.3*state.scale},${state.scale})`;
				pointsElem.style.right = Math.round(state.x)+'px';
				pointsElem.style.bottom = Math.round(state.y)+'px';
				playground.vrDScorePanel.size = [state.vrScale,state.vrScale/2,0];
				playground.vrDScorePanel.threejs.material.opacity = pointsElem.style.opacity;
			})
			.onComplete( ()=> {
				var sc = this.totalScore.toFixed(1);
				scoreElem.innerHTML = sc;
				scoreElem.style.right = 1+0.065*(sc.length-1)+'em';
				
				if( playground.inVR )
				{
					playground.vrDScorePanel.visible = false;
				}

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
		if( this.urlParams.has('lang') )
			return this.urlParams.get('lang');

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
				break;
			case 'off':
				localStorage.setItem( 'sound', 'fx' );
				break;
			case 'on':
			default:
				localStorage.setItem( 'sound', 'off' );
				break;
		}
		
		playground.setSound( );
	}


	// generate configuraiton value based on difficulty
	configRange( min, max, power=1 )
	{
		var difficulty = playground?.difficulty || 0,		
			value = THREE.MathUtils.mapLinear( difficulty**power, 10**power, 100**power, min, max );
			
		return value;
	} // Playground.config


	// generate integer configuraiton value based on difficulty
	configRangeInt( min, max, power=1 )
	{
		var value = this.configRange( min, max, power );
		
		return Math.round( value );
	} // Playground.configRangeInt
	
	
	// generate points score based on difficulty
	maxPoints( )
	{
		var difficulty = playground?.difficulty || 0,		
			value = THREE.MathUtils.mapLinear( difficulty, 0, 100, 30, 100 );
			
		return value;
	} // Playground.maxPoints


	vrDrawTime( )
	{
		element('timer').innerHTML = `${hours}:${minutes}:${seconds}`;
	}


	vrIntersections( controller )
	{
		controller.getWorldDirection( playground._v );
		playground.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
		playground.raycaster.ray.direction.set( -playground._v.x, -playground._v.y, -playground._v.z );

		return playground.raycaster.intersectObjects( playground.intersectables );
	}
	
	
	
	vrClick( controller )
	{
		var intersections = this.vrIntersections( controller );
		
		if( intersections.length )
		{
			var objects = [];
			intersections.forEach( e => {
				
				var obj = e.object?.suicaObject;
				if( obj ) {
					while( obj.parent ) obj = obj.parent;
					if( obj.onclick && objects.indexOf(obj)<0 ) objects.push( obj );
				}
				
			} );

			objects.forEach( e => e.onclick() );
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

