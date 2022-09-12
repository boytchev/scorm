// 827 -> 199 (24%)

MEIRO.Models.T005.prototype.constructDigits = function()
{
	var geometry = new THREE.CylinderBufferGeometry( this.WELL_RADIUS, this.WELL_RADIUS, this.PLATE_HEIGHT, 6, 1, true, -Math.PI/25, 2*Math.PI/25  );

	var plateGeometry = new THREE.CylinderBufferGeometry( this.WELL_RADIUS, this.WELL_RADIUS, N*this.PLATE_HEIGHT, 6, 1, true, -Math.PI/25, 2*Math.PI/25  );
	
	for (var i=0; i<2*N; i++)
	{
		
		for (var j=0; j<N; j++)
		{
			var material = new THREE.MeshLambertMaterial({
				color: user?'navy':'darkorange',
				map: this.mapDigitX,
				alphaMap: this.mapDigitX,
				transparent: true,
				opacity: 0.3+0.7*Math.random(),
				polygonOffset: true,
				polygonOffsetUnits: -4,
				polygonOffsetFactor: -4,
			});
			if (!user)
			{
				switch (this.codes[i][j])
				{
					case '0':
						material.map = this.mapDigit0;
						material.alphaMap = this.mapDigit0;
						break;
					case '1':
						material.map = this.mapDigit1;
						material.alphaMap = this.mapDigit1;
						break;
				}
			}
			
			var plate = new THREE.Mesh( geometry, material );
			plate.rotation.z = 0.2-0.4*Math.random();	
			plate.position.y = this.WELL_HEIGHT-3/2*this.PLATE_HEIGHT-j*this.PLATE_HEIGHT;
			plate.rotation.y = -angle*2*Math.PI;
			plate.angle = -angle*2*Math.PI;
			
			if (user) this.plates.push( plate );
			this.image.add( plate );
		}
	}
}



MEIRO.Models.T005.prototype.onObject = function()
{
	if (!this.playing) return undefined;
	
	// координати на мишка
	this.mouse.x = (controls.human.mousePos.x/window.innerWidth)*2 - 1;
	this.mouse.y = -(controls.human.mousePos.y/window.innerHeight)*2 + 1;

	this.raycaster.setFromCamera( this.mouse, camera );

	for (var i=0; i<this.plates.length; i++)
	{
		var plate = this.plates[i];
		var intersects = this.raycaster.intersectObject( plate );
		if (intersects.length)
		{	
			this.clicks++;
			if (plate.material.map == this.mapDigitX)
			{
				plate.material.map = this.mapDigit0;
				plate.material.alphaMap = this.mapDigit0;
			}
			else
			if (plate.material.map == this.mapDigit0)
			{
				plate.material.map = this.mapDigit1;
				plate.material.alphaMap = this.mapDigit1;
			}
			else
			if (plate.material.map == this.mapDigit1)
			{
				plate.material.map = this.mapDigitX;
				plate.material.alphaMap = this.mapDigitX;
			}
			
			this.swithchLight.position.set( 
				(this.WELL_RADIUS+0.3)*Math.sin(plate.angle),
				plate.position.y,
				(this.WELL_RADIUS+0.3)*Math.cos(plate.angle) );
			this.swithchLight.intensity = 10;
			
			//console.log(i);
			this.buttonClick.pause();
			this.buttonClick.currentTime=0;;
			this.buttonClick.play();
			return this.plates[i];
		}
	}

	return undefined;
}


// аниматор на модела
MEIRO.Models.T005.prototype.onAnimate = function(time)
{	
	if (this.playing)
	{
		this.swithchLight.intensity *= 0.8;
	}
	reanimate();
}



MEIRO.Models.T005.prototype.evaluateResult = function()
{	
	var match = 0;
	var user_code = '';
	for (var i=0; i<this.plates.length; i++)
	{
		var plate = this.plates[i];
		if (plate.material.map == this.mapDigit0)
			user_code += '0';
		else
		if (plate.material.map == this.mapDigit1)
			user_code += '1';
		else
			user_code += '?';
		if (plate.material.map == this.mapDigit0 && this.codes[this.config.user_index][i]=='0')
			match += 1/this.plates.length;
		else
		if (plate.material.map == this.mapDigit1 && this.codes[this.config.user_index][i]=='1')
			match += 1/this.plates.length;
	}
	match = match*match;
//	console.log('match',match);

	this.config.score = match*this.config.max_score;

	this.config.time =  Math.floor((animationLoop.time-this.startTime)/1000);
	
//	console.log('score=',this.config.score);
	this.info = '';
	this.info += '<h1 style="text-align:center;">Коенсъдърлендов напръстник &ndash; '+Math.round(100*this.config.score)/1+' от '+Math.round(100*this.config.max_score)+' точки</span></h1>';

	this.info += '<p>Верният код на избраната зона е <b>'+this.codes[this.config.user_index]+'</b>';

	if (match>0.99) this.info += ' и напълно съвпада с определения от вас код.</p>';
	else
	if (match<0.01) this.info += ' и нито една част от него не е правилно определена.</p>';
	else
		this.info += ', а определеният от вас код е <b>'+user_code+'</b>.</p>';
//	console.log('evaluation=',this.config.score*match);
}



MEIRO.Models.T005.prototype.construct = function()
{
	this.swithchLight = new THREE.PointLight( 'cornflowerblue', 0 );
	this.image.add( this.swithchLight );
}
	
	
