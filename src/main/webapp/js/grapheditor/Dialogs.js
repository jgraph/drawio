/**
 * Copyright (c) 2006-2012, JGraph Holdings Ltd
 */
/**
 * Constructs a new open dialog.
 */
var OpenDialog = function()
{
	var iframe = document.createElement('iframe');
	iframe.style.backgroundColor = 'transparent';
	iframe.allowTransparency = 'true';
	iframe.style.borderStyle = 'none';
	iframe.style.borderWidth = '0px';
	iframe.style.overflow = 'hidden';
	iframe.style.maxWidth = '100%';
	iframe.frameBorder = '0';
	
	var dx = 0;
	iframe.setAttribute('width', (((Editor.useLocalStorage) ? 640 : 320) + dx) + 'px');
	iframe.setAttribute('height', (((Editor.useLocalStorage) ? 480 : 220) + dx) + 'px');
	iframe.setAttribute('src', OPEN_FORM);
	
	this.container = iframe;
};

/**
 * 
 */
var ColorPicker = function()
{
	mxEventSource.call(this);

	var div = document.createElement('div');

	var x0 = 6;
	var y0 = 4;

	div.style.overflow = 'visible';
	div.style.position = 'relative';
	div.style.top = '0px';
	div.style.left = '0px';
	div.style.width = '230px';
	div.style.height = '114px';

	var colorPanel = document.createElement('div');

	colorPanel.style.border = '1px solid light-dark(black, white)';
	colorPanel.style.backgroundImage = 'url(' + this.hsImage + ')';
	colorPanel.style.position = 'absolute';
	colorPanel.style.overflow = 'hidden';
	colorPanel.style.cursor = 'crosshair';
	colorPanel.style.width = '181px';
	colorPanel.style.height = '101px';
	colorPanel.style.left = x0 + 'px';
	colorPanel.style.top = y0 + 'px';

	var cross = document.createElement('div');
	cross.style.background = 'url(' + this.crossImage + ')';
	cross.style.pointerEvents = 'none';
	cross.style.position = 'absolute';
	cross.style.width = '15px';
	cross.style.height = '15px';
	cross.style.left = '-8px';
	cross.style.top = '-8px';

	var currentHsv = [0, 0, 1];
	var currentAlpha = 1;
	
	function hsv2rgb(h, s, v)
	{
		if (h == null)
		{
			return [v, v, v];
		}

		var i = Math.floor(h);
		var f = i % 2 ? h - i : 1 - (h - i);
		var m = v * (1 - s);
		var n = v * (1 - s * f);

		switch(i)
		{
			case 6:
			case 0: return [v, n, m];
			case 1: return [n, v, m];
			case 2: return [m, v, n];
			case 3: return [m, n, v];
			case 4: return [n, m, v];
			case 5: return [v, m, n];
		}
	};

	function rgb2hsv(r, g, b)
	{
		var n = Math.min(Math.min(r, g), b);
		var v = Math.max(Math.max(r, g), b);
		var m = v - n;

		if (m === 0)
		{
			return [null, 0, v];
		}

		var h = r === n ? 3 + (b - g) / m :
			(g === n ? 5 + (r - b) / m :
				1 + (g - r) / m);
		
		return [h === 6 ? 0 : h, m / v, v];
	};

	function fromHSV(h, s, v)
	{
		h < 0 && (h = 0) || h > 6 && (h = 6);
		s < 0 && (s = 0) || s > 1 && (s = 1);
		v < 0 && (v = 0) || v > 1 && (v = 1);

		return hsv2rgb(
			h == null ? currentHsv[0] : (currentHsv[0] = h),
			s == null ? currentHsv[1] : (currentHsv[1] = s),
			v == null ? currentHsv[2] : (currentHsv[2] = v)
		);
	};

	colorPanel.appendChild(cross);
	div.appendChild(colorPanel);

	sliderBox = document.createElement('div');
	sliderBox.style.position = 'absolute';
	sliderBox.style.cursor = 'pointer';
	sliderBox.style.width = '38px';
	sliderBox.style.height = '110px';
	sliderBox.style.left = (193 + x0) + 'px';
	sliderBox.style.top = y0 + 'px';

	var sliderPanel = document.createElement('div');
	sliderPanel.style.border = '1px solid light-dark(black, white)';
	sliderPanel.style.pointerEvents = 'none';
	sliderPanel.style.overflow = 'hidden';
	sliderPanel.style.position = 'absolute';
	sliderPanel.style.width = '16px';
	sliderPanel.style.height = '101px';
	sliderPanel.style.left = '9px';
	sliderPanel.style.top = '0px';

	var panelActive = false;
	var sliderActive = false;

	var update = mxUtils.bind(this, function(quiet)
	{
		var x = Math.round((currentHsv[0] / 6) * 180);
		var y = Math.round((1 - currentHsv[1]) * 100);

		cross.style.left = (x - 8) + 'px';
		cross.style.top = (y - 8) + 'px';

		var seg = sliderPanel.childNodes;
		var arr = hsv2rgb(currentHsv[0], currentHsv[1], 1);
		
		if (arr != null)
		{
			for (var i = 0; i < seg.length; i++)
			{
				seg[i].style.backgroundColor = 'rgb('+
					(arr[0] * (1 - i / seg.length)) * 255 + ', ' +
					(arr[1] * (1 - i / seg.length)) * 255 + ', ' +
					(arr[2] * (1 - i / seg.length)) * 255 + ')';
			}

			var arrowY = Math.round((1 - currentHsv[2]) * 100);
			arrow.style.top = (arrowY - 4) + 'px';

			var rgb = hsv2rgb(currentHsv[0], currentHsv[1], currentHsv[2]);
			var color = '#' +
				('0' + Math.round(rgb[0] * 255).toString(16)).slice(-2) +
				('0' + Math.round(rgb[1] * 255).toString(16)).slice(-2) +
				('0' + Math.round(rgb[2] * 255).toString(16)).slice(-2) +
				(currentAlpha < 1 ?
					('0' + Math.round(currentAlpha * 255).toString(16)).slice(-2) : '');

			if (quiet != true)
			{
				this.fireEvent(new mxEventObject('change',
					'color', mxUtils.rgba2hex(color)));
			}
		}
	});

	var panelMouseDown = mxUtils.bind(this, function(e)
	{
		if (currentHsv[2] == 0)
		{
			currentHsv[2] = 1;
		}
		
		panelActive = true;
		mouseMove(e);
	});

	var sliderMouseDown = mxUtils.bind(this, function(e)
	{
		sliderActive = true;
		mouseMove(e);
	});

	var mouseMove = mxUtils.bind(this, function(e)
	{
		if (panelActive)
		{
			var bounds = colorPanel.getBoundingClientRect();
			var x = mxEvent.getClientX(e) - bounds.left;
			var y = mxEvent.getClientY(e) - bounds.top;

			cross.style.left = (x - 8) + 'px';
			cross.style.top = (y - 8) + 'px';

			var temp = fromHSV(x * (6 / 180), 1 - y / 100);

			this.fromString('#' +
				('0' + Math.floor(temp[0] * 255).toString(16)).slice(-2) +
				('0' + Math.floor(temp[1] * 255).toString(16)).slice(-2) +
				('0' + Math.floor(temp[2] * 255).toString(16)).slice(-2) +
				(currentAlpha < 1 ?
					('0' + Math.round(currentAlpha * 255).toString(16)).slice(-2) : ''));
		}
		else if (sliderActive)
		{
			var bounds = sliderBox.getBoundingClientRect();
			var y = mxEvent.getClientY(e) - bounds.top;
			currentHsv[2] = Math.max(Math.min(1, 1 - y / 100), 0);
			update();
		}
	});

	var mouseUp = mxUtils.bind(this, function()
	{
		var wasActive = panelActive || sliderActive;
		sliderActive = false;
		panelActive = false;

		if (wasActive)
		{
			this.fireEvent(new mxEventObject('release'));
		}
	});

	mxEvent.addGestureListeners(colorPanel, panelMouseDown);
	mxEvent.addGestureListeners(sliderBox, sliderMouseDown);
	mxEvent.addGestureListeners(div, null, mouseMove, mouseUp);
	mxEvent.addListener(div, 'mouseleave', mouseUp);

	var tileHeight = 4;

	for(var i = 0; i < 101; i += tileHeight)
	{
		var seg = document.createElement('div');
		seg.style.height = tileHeight + 'px';
		seg.style.pointerEvents = 'none';
		sliderPanel.appendChild(seg);
	}

	div.appendChild(sliderPanel);

	var arrow = document.createElement('div');
	arrow.style.background = 'url(' + this.arrowImage + ')';
	arrow.style.position = 'absolute';
	arrow.style.pointerEvents = 'none';
	arrow.style.width = '7px';
	arrow.style.height = '11px';
	arrow.style.left = '2px';
	arrow.style.top = '-3px';

	sliderBox.appendChild(arrow);
	sliderBox.appendChild(sliderPanel);
	div.appendChild(sliderBox);

	this.fromString = function(color, quiet)
	{
		quiet = (quiet != null) ? quiet : false;

		if (color == null || color == '' ||
			mxUtils.isVarColor(color) ||
			color == mxConstants.NONE)
		{
			color = '#ffffff';
			quiet = true;
		}
		
		var rgb = mxUtils.parseColor(color);
		var hsv = rgb2hsv(rgb.r / 255, rgb.g / 255, rgb.b / 255);

		if (hsv[0] != null)
		{
			currentHsv[0] = hsv[0];
		}
		
		if (hsv[2] != 0)
		{
			currentHsv[1] = hsv[1];
		}

		currentHsv[2] = hsv[2];
		currentAlpha = rgb.a;
		update(quiet);
	};

	this.fromString('#ffffff');
	this.div = div;
};

// Extends mxEventSource
mxUtils.extend(ColorPicker, mxEventSource);

/**
 * Contains the HS image.
 */
ColorPicker.prototype.hsImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAABlCAIAAACEDzXRAAAKQ0lEQVR42u2d23IjKwxFBeRh5v8/9uQlzXlI2gGELoCEm6pxubp6PI69WoV3C20uIQPAH4A/AH/p41/pDcTxP4BPGDtq3vYJGPpv8craeRdo/fyTI8ZhHnodOGgcV/3rnx8QI0SABO2xfAbiCfVR8Wj+CD8jenbRJNyGOxLoAaH1iLu4EUEHAv1+MsQ4zLE4AiIOcpibv4u9OET6+cP4ASnJ1JH4/G60A9km+GbBxLlpKAkADoR2JnaBrvWD/x1GCZn9EYLEHqVfI6Efx0D7E9tDF/rBSJ54l8FqTUse0J+EvxPrdK0fD4aOLXQi7zyGxMaRvvWjjH2U8o9I44OKnf+wyCpHoR/Phk6d/COq8481YrNI3/qR2B+kMl1Fl6J8o/JrU/GEA6HdiB2ha/0YBVx7rFwNHAj9JuIl6EI/qKyJug4Yvg7xA0QEpB8nQe8itoQu9EOT8M3mTsqUSUzykH6cBO1PbA9d91+ShDzV9xrtcgW21IT6L0yfcS90FKCdw+wS6Q9ISWjVfLTVVT2mdiPGGRduFKWm7dBStWlLmI0j/QExdgp7gT5qCu2BLKiLqtc94hI7PB8auQP4KuyIvSJ960fUqXWcd2F48Khr1bHSj2dDp/afmg7tMrFxpG/9mHMFuqrH3spFw0s0Bgr9OAzamdgFutaPpMuqo6WVEXWJdSL14xhof2J76MKfS2yXWGOVB1WXXGOVdxFSx587CXoLsTE0689RH7VW4RMLeKI9wPpzz4XeS2wDzdbXR52AWStjwiSAA6HdiB2h1f6cqT0whzzuzz0LejuxATTy90Xt40v7CzdGRvKS4O/zQ0AiXaRW5x/dv4vS4A/a308LYR5pFquRRvlHIrKWoCj5woCVId4eR/KPNDjURg2tdEC7rSQN5B9DYR70X5YivVxft7AyrOvrD4V2JnaBJurr+qpemLEywlRhT6qvPx16C7ExdK0fSjcj0maAzsqgBt7rfIxGP46B9iT2gi70I842bNj0U4wd/WAG/L5VP3p0W4iNoYv6Oh6eoJmSMW5laIzF8iT1TtgeV9RZoZ7QvdEUzsQu0CP+HOMKDFoZvDFg6s89CNqf2B5a4e8Hts84W0pgeohBtspBXYp8H3Tk/H23MBtHuvbn5mp7dlU9TUkP+XNJMabzHdCIbnuYDSItzZ+bdgUWrAwNPhwInRxw1/wXuYGj+4vo7flboRpjEQ6EjgojYK9/K04NFfNTauEBypXQWQLAfqQoHl9CfvpQ6C3ExtC9/q2YW2u6X1JWzfsYFPKX3L99LrQ/sT10XR+jKh+UN2AxlDOyXfLQaxxf/fkvT4d2JnaBZv258M6h4IFu2Em7/sezoLcQG0Mjfy6xrqLnVBLGWHw1i69WP5LCCn0TNEL3DLNXpCV/n5oo5jAVLY5Em6i8Pwm6uSNuCrNxpNX+nDira20qqyZriv384xhoZ2IX6Lr/wg8eiwpXYGQqPEgjsBrX+er3X46B9ie2h6bX/4i6IfcLS2mIY++7TfoCuLj6hwgN89CwBJ3Gx8rOVsn0kQ48tDS/4X1L8SzMb3BbkGdtwsD05AbP9YOU8xui+uljZei/P/3qx2HQbsSO0Ar/lveHLZYCVK4GeN1P5N+eAb2R2Aya9ueUY+8dlhLtdhWvgfEfz4AeGf9hR2wcaeTPpacvRdzLTx8J/Qq1Ij995PrJ3/mp0p8LO5YyF0s215g/9yxoZ2IXaLo+FiwtgTlvIAznp4+G3khsBk3Pf5mYvqOwMqZnNnw3i9cRDoT2JPaCZuvreskDuXkHxfQMvfbBgdBbiI2hC/3QLCg6lESZZkrfJ7nSj3gWNEMcRkYJsf5L0BXENBl1WV8/aquMLM9/eSJ0UtxZmFGGg4MigZ75ovHnvsOcUX09zRbzjCrU/K/Rev0gT2i2vu4cZrNI1+sH2e49Yb3lRC6e9fSS9ETohjj7hdkx0rQ/57/rxIrhBQdCv494Hlrtz1lo30Qjz1z+cRh02ndTNIMm1j8NxtmePs+76i+/esJHrH/6dGh/YntoRf9l2RtQWgJXzY4bdtbqx0OhnYldoHv7I79jf4+rOGGaRWr14yToLcTG0Ky/v32rjAsdX9S5vgI4ENqT2Asa7Z/9vq0yStiGNNVHkOe/RGmqwBQ0jEDHFpoJ85BLN+jPaRoHGWl2/2yx3msxVRHjZ0Td4GfV/Bf9bCM1dBiBfrHeJ1HR6dKEedDf5yPdBLilp/efC3Ribb1VxlUHGQe8iTb0598+Hdqf2B6a3b9SOerezsoIBWaJ3IBn1fp0j4PeQmwMzc5/idLK3UZWRkmKX2zA4Vc/DoPeSGwGrdvfY24RpKmVjrLuCQdCuxE7Qkv64TZ3Z44dVPrxUOh3EK9C1/lHGpz7ZzpVsYTF7K8Hyj+Ogd5FbAk9uL9H9LIyYg821sjo13gYtD+xPbRU/9Ds/b1sZTTIr5OStMGHA6GdiV2gUf2UmQcfJdUbXOoe6HoN1A0b2uQD4EBosXJqQTwKnXvXAEX+oZlfGaS9ewetDGCLeV1exH4e9Mr+2TDpv2iggYFW+LdBsTbngv/yUroGH0jleEX7MOgtxMbQ7PzKoMuajKyM8pYIiB194HnQzsQu0Gp/LvpulVHylsgK/TgG2p/YHrqXf6T3bJUBhfxFWUDPg95CbAytm/+ycasM9WOxWu0PnTniLWE2iLRi/4Z3bJXRvY76s0+Arl93I3aMNOHPBce2PdSkL7Kpnwe9l9gGutCPoFgkUtytXAGbex0vKCznSOs00o+ToLcQG0N/QErCrG6jrTIynVUDwo896vCzssPrNnAYtD+xPfR9fwmKeu/CVhm5OAn1STPkvhxBW1KXjeP60Y/DoJ2JXaAL/RCPy+PXc80L9d7OV294dVPbC/fb4EDoLcTG0IV+TCDrrIxMHIFg512BWj9OgvYk9oK+9SMoZG55q/JMiGS40/sLjacu28T3MVfd0Aha+u3QJXr+0Q//MBtHutaPQOzh3H0RBoZS5OJ/MjqJ9x2vQb7qgSuvX0StH0+FLptzrvTDh9gl0oV+iAbi2lAsqNmbK3yBAyLNdbRzW8Y6Btqf2B76A2IURE2zZY16KGfZlwqofJSL4feABka+xCNX+ekx0LuILaFr/Zit7s4ZA7y5Qg2sDr/t4zDodxCvQt/6occctDKGriMPzH85D9qN2BG61g/QwcLSVDSGl78C6LePY6A3EptBf0BKcjWWH/GqyJqoxKnMufEVBLJxAJwJ7U9sDH3fX0CxnIB4orMyuilTyRh6g+0bfDgQ2p/YHrrQD+jV6qb/SdRrMit8TRWwyEabxgFwJrQnsQt0rR+LR3VqFNiGHRBv73ge9EZiM+haPyicuRcVmIxzAMTMl9wfi3sGtBuxF3ShH92C29yJTteU+ohbRrZk3Qe9hdgY+tYPnOqanA+mTN33ZGKE06HQbsQu0LV+MF8+94rU5dK8B8/KyJaI+6D9ie2hC/3Q12QnSnYLn5p9P/6d0D7EltAh5wz/Hv8exON/LUjHOuz5CksAAAAASUVORK5CYII=';

/**
 * Contains the cross cursor.
 */
ColorPicker.prototype.crossImage = 'data:image/gif;base64,R0lGODlhDwAPAKEBAAAAAP///////////yH5BAEKAAIALAAAAAAPAA8AAAIklB8Qx53b4otSUWcvyiz4/4AeQJbmKY4p1HHapBlwPL/uVRsFADs=';

/**
 * Contains the arrow cursor.
 */
ColorPicker.prototype.arrowImage = 'data:image/gif;base64,R0lGODlhBwALAKECAAAAAP///6g8eKg8eCH5BAEKAAIALAAAAAAHAAsAAAITTIQYcLnsgGxvijrxqdQq6DRJAQA7';

/**
 * Constructs a new color dialog.
 */
var ColorDialog = function(editorUi, color, apply, cancelFn, defaultColor, defaultColorValue, singleColorMode, liveApply, allowInherit)
{
	var cssDefaultColor = (defaultColorValue != null) ?
		mxUtils.getLightDarkColor(defaultColorValue,
			null, null, singleColorMode) : null;
	var graph = editorUi.editor.graph;
	this.editorUi = editorUi;
	var useDefault = false;

	function validateColor(color)
	{
		return mxUtils.color2hex('#' + color).substring(1).toUpperCase();
	};

	// Converts color names to hex
	if (color != 'default' &&
		color != 'transparent' &&
		color != mxConstants.NONE &&
		!mxUtils.isVarColor(color) &&
		!mxUtils.isHexColor(color) &&
		!mxUtils.isRgbColor(color) &&
		!mxUtils.isLightDarkColor(color))
	{
		color = mxUtils.color2hex(color);
	}

	var input = document.createElement('input');
	input.style.textOverflow = 'ellipsis';
	input.style.marginLeft = '6px';
	input.style.width = '100%';

	var wrapper = document.createElement('div');

	var inputDiv = document.createElement('div');
	inputDiv.style.display = 'flex';
	inputDiv.style.alignItems = 'center';
	wrapper.appendChild(inputDiv);
	
	var darkInput = document.createElement('input');
	darkInput.style.textOverflow = 'ellipsis';
	darkInput.style.margin = '0 6px';
	darkInput.style.maxWidth = '70px';
	darkInput.style.width = '100%';

	var darkSelect = document.createElement('select');
	darkSelect.style.textOverflow = 'ellipsis';
	darkSelect.style.width = '100%';

	var autoDarkOption = document.createElement('option');
	autoDarkOption.setAttribute('value', 'automatic');
	mxUtils.write(autoDarkOption, mxResources.get('automatic'));
	darkSelect.appendChild(autoDarkOption);

	var customDarkOption = document.createElement('option');
	customDarkOption.setAttribute('value', 'custom');
	mxUtils.write(customDarkOption, mxResources.get('userDefined'));
	darkSelect.appendChild(customDarkOption);
	darkSelect.value = (!mxUtils.isLightDarkColor(color) ?
		'automatic' : 'custom');

	var darkColorDiv = document.createElement('div');

	var img = document.createElement('img');
	img.setAttribute('title', mxResources.get('dark'));
	img.className = 'geAdaptiveAsset';
	img.src = Editor.thinDarkImage;
	img.style.width = '20px';
	darkColorDiv.appendChild(img);

	mxEvent.addListener(img, 'click', function()
	{
		darkInput.focus();
	});

	darkColorDiv.appendChild(darkInput);
	darkColorDiv.appendChild(darkSelect);
	darkColorDiv.style.display = 'flex';
	darkColorDiv.style.alignItems = 'center';
	darkColorDiv.style.marginTop = '6px';

	var advancedDiv = document.createElement('div');
	advancedDiv.style.display = 'flex';
	advancedDiv.style.alignItems = 'center';
	advancedDiv.style.userSelect = 'none';
	advancedDiv.style.cursor = 'pointer';
	advancedDiv.style.marginTop = '4px';
	
	var collapse = document.createElement('img');
	collapse.setAttribute('title', mxResources.get('dark'));
	collapse.className = 'geAdaptiveAsset';
	advancedDiv.appendChild(collapse);

	mxUtils.write(advancedDiv, mxResources.get('advanced'));

	var swapBtn = document.createElement('img');
	swapBtn.setAttribute('title', mxResources.get('swap'));
	swapBtn.className = 'geAdaptiveAsset';
	swapBtn.style.marginLeft = '6px';
	swapBtn.style.width = '16px';
	swapBtn.style.height = '16px';
	swapBtn.style.cursor = 'pointer';
	swapBtn.src = Editor.swapImage;

	mxEvent.addListener(swapBtn, 'click', function(evt)
	{
		toggleDarkColor(true, false);
		darkSelect.value = 'custom';
		setDefaultSelected(false);

		var tmp = input.value;
		input.value = darkInput.value;
		darkInput.value = tmp;

		updateInputColors();
		currentInput.focus();
		doLiveApply();
		mxEvent.consume(evt);
	});

	advancedDiv.appendChild(swapBtn);

	var copyBtn = swapBtn.cloneNode();
	copyBtn.setAttribute('title', mxResources.get('copy'));
	copyBtn.style.marginLeft = '2px';
	copyBtn.src = Editor.doubleArrowUpImage;

	mxEvent.addListener(copyBtn, 'click', function(evt)
	{
		toggleDarkColor(true, false);
		darkSelect.value = 'custom';
		setDefaultSelected(false);

		if (currentInput == darkInput)
		{
			input.value = darkInput.value;
		}
		else
		{
			darkInput.value = input.value;
		}

		updateInputColors();
		currentInput.focus();
		doLiveApply();
		mxEvent.consume(evt);
	});

	advancedDiv.appendChild(copyBtn);

	var opacityBtn = copyBtn.cloneNode();
	opacityBtn.setAttribute('title', mxResources.get('opacity'));
	opacityBtn.src = Editor.opacityImage;

	mxEvent.addListener(opacityBtn, 'click', function(evt)
	{
		var rgb = mxUtils.parseColor('#' + currentInput.value);
		var opacity = String(Math.floor(Math.max(0, Math.min(rgb.a * 100, 100))));

		editorUi.prompt(mxResources.get('opacity') + ' (0-100)', opacity, function(newValue)
		{
			if (!isNaN(newValue) && newValue !== '' &&
				newValue >= 0 && newValue <= 100)
			{
				setDefaultSelected(false);
				
				input.value = mxUtils.rgba2hex(mxUtils.addAlphaToColor(
					'#' + input.value, newValue / 100, true)).
						substring(1).toUpperCase();
				darkInput.value = mxUtils.rgba2hex(mxUtils.addAlphaToColor(
					'#' + darkInput.value, newValue / 100, true)).
						substring(1).toUpperCase();
				
				updateInputColors();
				currentInput.focus();
			}
		});
		
		mxEvent.consume(evt);
	});

	advancedDiv.appendChild(opacityBtn);

	function updateCollapseIcon()
	{
		if (darkColorDiv.style.display == 'none')
		{
			collapse.src = Editor.arrowRightImage;
		}
		else
		{
			collapse.src = Editor.arrowDownImage;
		}
	};

	updateCollapseIcon();

	function toggleDarkColor(show, transferFocus)
	{
		if (show || darkColorDiv.style.display == 'none')
		{
			darkColorDiv.style.display = 'flex';

			if (transferFocus !== false)
			{
				darkInput.focus();
			}
		}
		else
		{
			darkColorDiv.style.display = 'none';
		}

		updateCollapseIcon();

		if (self.resizeFn != null)
		{
			self.resizeFn();
		}
	};
	
	mxEvent.addListener(advancedDiv, 'click', function()
	{
		toggleDarkColor();
		updateCollapseIcon();
		ColorDialog.collapsed = darkColorDiv.style.display == 'none';

		if (self.resizeFn != null)
		{
			self.resizeFn();
		}
	});

	function isDefaultColor(color)
	{
		var lc = color.toLowerCase();

		return defaultColor != null && (color == '' ||
			lc == 'automatic' || lc == 'default' ||
			lc == mxResources.get('default').toLowerCase() ||
			lc == mxResources.get('automatic').toLowerCase());
	};

	function updateInputColor(input)
	{
		if (input.value == '' && cssDefaultColor != null && useDefault)
		{
			input.style.background = (input == darkInput) ?
				cssDefaultColor.dark :
				cssDefaultColor.light;
		}
		else if (input.value == '' || input.value == mxConstants.NONE ||
			mxUtils.isVarColor(input.value))
		{
			input.style.background = 'transparent';
		}
		else
		{
			var color = '#' + input.value;
			input.style.background = color;
		}

		if (input.style.background == 'transparent')
		{
			input.style.color = 'light-dark(#000000, #ffffff)';
		}
		else
		{
			input.style.color =
				(mxUtils.isDarkColor(input.style.background)) ?
				'#ffffff' : '#000000';
		}
	};

	function updateInputColors()
	{
		updateInputColor(input);
		updateInputColor(darkInput);
	};

	function setDefaultSelected(selected)
	{
		if (useDefault != selected)
		{
			if (selected)
			{
				if (singleColorMode && cssDefaultColor != null)
				{
					input.value = cssDefaultColor.light.substring(1).toUpperCase();
					selected = false;
				}
				else
				{
					input.value = '';
					darkInput.value = '';
					darkSelect.value = 'automatic';
					input.setAttribute('placeholder', mxResources.get('useBlackAndWhite'));
					darkInput.setAttribute('title', mxResources.get('useBlackAndWhite'));
					input.setAttribute('title', mxResources.get('useBlackAndWhite'));
				}
			}
			else
			{
				if (input.value == '' && cssDefaultColor != null)
				{	
					input.value = cssDefaultColor.light.substring(1).toUpperCase();
				}

				input.removeAttribute('placeholder');
				input.removeAttribute('title');

				if (darkInput.value == '' && cssDefaultColor != null)
				{
					darkInput.style.background = cssDefaultColor.dark;
					var style = mxUtils.getCurrentStyle(darkInput);
					darkInput.value = mxUtils.rgba2hex(style.backgroundColor).
						substring(1).toUpperCase();
				}

				darkInput.removeAttribute('placeholder');
				darkInput.removeAttribute('title');
				selected = false;
			}
		}

		useDefault = selected;
	};

	var defaultBtn = mxUtils.button('', function()
	{
		setDefaultSelected(true);
		updateInputColors();
		currentInput.focus();

		if (currentInput.value == '' && cssDefaultColor != null && useDefault)
		{
			picker.fromString((currentInput == darkInput) ?
				cssDefaultColor.dark :
				cssDefaultColor.light, true);
		}

		doLiveApply();
	});

	mxEvent.addListener(darkSelect, 'change', function(evt)
	{
		if (darkSelect.value == 'automatic')
		{
			input.focus();
			inputChanged(input);
		}
		else
		{
			setDefaultSelected(false);
			darkInput.focus();
			selectInput();
		}

		updateInputColors();
		doLiveApply();
		mxEvent.consume(evt);
	});

	function inputChanged(elt)
	{
		if (elt.value.charAt(0) == '#')
		{
			elt.value = elt.value.substring(1);
		}

		if (isDefaultColor(elt.value) && cssDefaultColor != null)
		{
			defaultBtn.click();
		}
		else
		{
			if (elt.value != mxConstants.NONE &&
				!mxUtils.isVarColor(elt.value))
			{
				elt.value = validateColor(elt.value);
				picker.fromString('#' + elt.value);
			}

			setDefaultSelected(false);

			if (elt == darkInput &&
				(input.value != mxConstants.NONE ||
				darkInput.value != mxConstants.NONE))
			{
				darkSelect.value = 'custom';
			}

			if (elt == input && darkSelect.value == 'automatic')
			{
				if (input.value == mxConstants.NONE)
				{
					darkInput.value = mxConstants.NONE;
				}
				else if (mxUtils.isVarColor(input.value))
				{
					darkInput.value = input.value;
				}
				else
				{
					darkInput.value = mxUtils.rgba2hex(mxUtils.
						getInverseColor('#' + elt.value)).
						substring(1).toUpperCase();
				}
			}

			updateInputColors();
		}
	};

	mxEvent.addListener(input, 'change', function()
	{
		inputChanged(input);
		doLiveApply();
	});

	mxEvent.addListener(darkInput, 'change', function()
	{
		inputChanged(darkInput);
		doLiveApply();
	});
	
	var applyFunction = (apply != null) ? apply :
		this.createApplyFunction();

	var self = this;

	function buildFinalColor()
	{
		var color = input.value;
		var dark = darkInput.value;

		// Blocks any non-alphabetic chars in colors
		if ((useDefault && cssDefaultColor != null) ||
			((/(^#?[a-zA-Z0-9]*$)/.test(color) || mxUtils.isVarColor(color)) &&
			(/(^#?[a-zA-Z0-9]*$)/.test(dark) || mxUtils.isVarColor(dark))))
		{
			if (useDefault)
			{
				color = 'default';
			}
			else
			{
				if (color == '')
				{
					color = mxConstants.NONE;
				}

				if (dark == '')
				{
					dark = mxConstants.NONE;
				}

				if (color != mxConstants.NONE &&
					!mxUtils.isVarColor(color) &&
					color.charAt(0) != '#')
				{
					color = '#' + validateColor(color);
				}

				if (dark != mxConstants.NONE &&
					!mxUtils.isVarColor(dark) &&
					dark.charAt(0) != '#')
				{
					dark = '#' + validateColor(dark);
				}

				if (color != 'none' || dark != 'none')
				{
					color = (color == mxConstants.NONE) ? 'transparent' : color;
					dark = (dark == mxConstants.NONE) ? 'transparent' : dark;

					if (!singleColorMode && darkSelect.value != 'automatic')
					{
						color = 'light-dark(' + color + ',' + dark + ')';
					}
				}
			}

			return {color: color, valid: true};
		}
		else
		{
			return {color: null, valid: false};
		}
	};

	// Tracks the recent color entry for the current editing session
	// so successive changes update the same slot instead of flooding the list
	var sessionRecentColor = null;

	function addCurrentToRecent()
	{
		var color = input.value;
		var dark = darkInput.value;

		if (!((useDefault && cssDefaultColor != null) ||
			((/(^#?[a-zA-Z0-9]*$)/.test(color) || mxUtils.isVarColor(color)) &&
			(/(^#?[a-zA-Z0-9]*$)/.test(dark) || mxUtils.isVarColor(dark)))))
		{
			return;
		}

		if (!useDefault)
		{
			if (color == '') color = mxConstants.NONE;
			if (dark == '') dark = mxConstants.NONE;

			if (color != mxConstants.NONE &&
				!mxUtils.isVarColor(color) &&
				color.charAt(0) != '#')
			{
				color = '#' + validateColor(color);
			}

			if (dark != mxConstants.NONE &&
				!mxUtils.isVarColor(dark) &&
				dark.charAt(0) != '#')
			{
				dark = '#' + validateColor(dark);
			}

			var recentCount = 12;
			var newEntry = null;

			if (darkSelect.value != 'automatic' &&
				dark != mxConstants.NONE)
			{
				if (color == mxConstants.NONE)
				{
					newEntry = dark.substring(1);
				}
				else
				{
					newEntry = 'light-dark(' + color + ',' + dark + ')';
				}
			}
			else if (color != mxConstants.NONE)
			{
				newEntry = color.substring(1);
			}
			else
			{
				newEntry = mxConstants.NONE;
			}

			// Remove previous session entry before adding new one
			if (sessionRecentColor != null)
			{
				mxUtils.remove(sessionRecentColor, ColorDialog.recentColors);
			}

			ColorDialog.addRecentColor(newEntry, recentCount);
			sessionRecentColor = newEntry;
		}
	};

	function doApply()
	{
		var result = buildFinalColor();

		if (result.valid)
		{
			addCurrentToRecent();
			applyFunction(result.color);
			refreshRecentColors();

			if (!liveApply)
			{
				editorUi.hideDialog();
			}
		}
		else if (!liveApply)
		{
			editorUi.handleError({message: mxResources.get('invalidInput')});
		}
	};

	// Debounced apply for live mode (picker drag)
	var liveApplyTimer = null;

	function doLiveApply(delay)
	{
		if (liveApply)
		{
			if (liveApplyTimer != null)
			{
				clearTimeout(liveApplyTimer);
			}

			liveApplyTimer = setTimeout(function()
			{
				liveApplyTimer = null;
				var result = buildFinalColor();

				if (result.valid)
				{
					addCurrentToRecent();
					applyFunction(result.color);
					refreshRecentColors();
				}
			}, delay || 0);
		}
	};

	function selectInput()
	{
		if (!mxClient.IS_TOUCH)
		{
			window.setTimeout(function()
			{
				currentInput.focus();
				
				if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
				{
					currentInput.select();
				}
				else
				{
					document.execCommand('selectAll', false, null);
				}
			}, 0);
		}
	};
	
	this.init = function()
	{
		selectInput();
	};

	var picker = new ColorPicker();
	var currentInput = (Editor.isDarkMode() &&
		(graph.getAdaptiveColors() == 'auto' ||
		(graph.getAdaptiveColors() == 'simple' &&
		darkSelect.value == 'custom')) &&
		!singleColorMode) ? darkInput : input;
	
	function updatePickerFromCurrentInput()
	{
		if (currentInput.value != mxConstants.NONE &&
			currentInput.value != '')
		{
			picker.fromString('#' + currentInput.value, true);
		}
	};

	mxEvent.addListener(input, 'focus', function()
	{
		currentInput = input;
		updatePickerFromCurrentInput();
		copyBtn.src = Editor.doubleArrowDownImage;
	});

	mxEvent.addListener(darkInput, 'focus', function()
	{
		currentInput = darkInput;
		updatePickerFromCurrentInput();
		copyBtn.src = Editor.doubleArrowUpImage;
	});

	picker.addListener('change', function(sender, evt)
	{
		var color = evt.getProperty('color').substring(1).toUpperCase();

		if (currentInput.value.toUpperCase() != color)
		{
			currentInput.value = color;
			inputChanged(currentInput);

			window.setTimeout(function()
			{
				currentInput.focus();
			}, 0);
		}
	});

	picker.addListener('release', function()
	{
		doLiveApply();
	});

	var div = document.createElement('div');

	// The tool-window (liveApply) host is a borderless mxWindow with no
	// padding of its own, so the content supplies it. The modal dialog host
	// (.geDialog) already pads, so skip it there to avoid double padding and
	// to keep the 230px picker from overflowing the padded content box.
	if (liveApply)
	{
		div.style.padding = '12px 12px 18px 12px';
	}

	div.appendChild(picker.div);
	picker.div.style.marginBottom = '10px';

	var center = document.createElement('div');
	center.style.display = 'flex';
	center.style.flexFlow = 'row wrap';
	center.style.justifyContent = 'center';
	center.style.marginTop = '10px';
	
	function createRecentColorTable()
	{
		var table = addPresets((ColorDialog.recentColors.length == 0) ?
			['FFFFFF'] : ColorDialog.recentColors, 11, 'FFFFFF', true);
		table.style.marginBottom = '6px';

		return table;
	};
	
	var addPresets = mxUtils.bind(this, function(presets, rowLength, defaultColor, addResetOption)
	{
		rowLength = (rowLength != null) ? rowLength : 12;
		var table = document.createElement('table');
		table.style.borderCollapse = 'collapse';
		table.setAttribute('cellspacing', '0');
		table.style.marginBottom = '10px';
		table.style.cellSpacing = '0px';
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		var rows = presets.length / rowLength;
		
		for (var row = 0; row < rows; row++)
		{
			var tr = document.createElement('tr');
			
			for (var i = 0; i < rowLength; i++)
			{
				(mxUtils.bind(this, function(clr)
				{
					var td = document.createElement('td');
					td.style.border = '0px solid black';
					td.style.padding = '0px';
					td.style.width = '16px';
					td.style.height = '16px';
					
					if (clr == null)
					{
						clr = defaultColor;
					}

					if (clr != null)
					{
						td.style.borderWidth = '1px';

						if (clr == mxConstants.NONE || clr == null)
						{
							td.style.background = 'url(\'' + Dialog.prototype.noColorImage + '\')';
						}
						else
						{
							if (mxUtils.isLightDarkColor(clr))
							{
								var cssColor = mxUtils.getLightDarkColor(clr);
								td.style.background = 'linear-gradient(to right bottom, ' +
									cssColor.cssText + ' 50%, ' +
									mxUtils.invertLightDarkColor(cssColor).cssText + ' 50.3%)';
							}
							else
							{
								td.style.backgroundColor = '#' + clr;
							}
						}

						var name = this.colorNames[String(clr).toUpperCase()];

						if (name != null)
						{
							td.setAttribute('title', name);
						}
					}
					
					tr.appendChild(td);

					if (clr != null)
					{
						td.style.cursor = 'pointer';
						
						mxEvent.addListener(td, 'click', function()
						{
							if (clr == mxConstants.NONE)
							{
								if (currentInput == darkInput &&
									darkInput.value == mxConstants.NONE)
								{
									input.value = mxConstants.NONE
								}
								else
								{
									currentInput.value = mxConstants.NONE;
								}
								
								if (currentInput == input ||
									(currentInput == darkInput &&
									input.value == mxConstants.NONE))
								{
									darkSelect.value = 'automatic';
								}

								inputChanged(currentInput);
								doLiveApply();

								window.setTimeout(function()
								{
									currentInput.focus();
								}, 0);
							}
							else
							{
								if (mxUtils.isLightDarkColor(clr))
								{
									var cssColor = mxUtils.getLightDarkColor(clr);

									if (singleColorMode)
									{
										input.value = cssColor.light.substring(1).toUpperCase();
										inputChanged(input);
										picker.fromString(cssColor.light);
										doLiveApply();
									}
									else
									{
										toggleDarkColor(true, false);
										darkSelect.value = 'custom';
										input.value = cssColor.light.substring(1).toUpperCase();
										darkInput.value = cssColor.dark.substring(1).toUpperCase();
										inputChanged(input);
										inputChanged(darkInput);
										doLiveApply();

										if (currentInput == input)
										{
											picker.fromString(cssColor.light);
										}
										else
										{
											picker.fromString(cssColor.dark);
										}
									}
								}
								else
								{
									picker.fromString('#' + clr);
									doLiveApply();
								}
							}
						});
						
						mxEvent.addListener(td, 'dblclick', function()
							{
								doApply();

								if (liveApply && self.closeFn != null)
								{
									self.closeFn();
								}
							});
					}
				}))(presets[row * rowLength + i]);
			}
			
			tbody.appendChild(tr);
		}
		
		if (addResetOption)
		{
			var td = document.createElement('td');
			td.setAttribute('title', mxResources.get('reset'));
			td.className = 'geAdaptiveAsset';
			td.style.border = '1px solid black';
			td.style.padding = '0px';
			td.style.width = '16px';
			td.style.height = '16px';
			td.style.backgroundImage = 'url(\'' + Editor.crossImage + '\')';
			td.style.backgroundPosition = 'center center';
			td.style.backgroundSize = '14px 14px';
			td.style.backgroundRepeat = 'no-repeat';
			td.style.cursor = 'pointer';
			
			tr.appendChild(td);

			mxEvent.addListener(td, 'click', function()
			{
				ColorDialog.resetRecentColors();
				var newTable = createRecentColorTable();

				if (table.parentNode != null)
				{
					table.parentNode.replaceChild(newTable, table);
				}

				recentTable = newTable;
			});
		}
		
		center.appendChild(table);
		
		return table;
	});

	var lightIcon = null;

	if (!singleColorMode)
	{
		wrapper.appendChild(advancedDiv);

		if (ColorDialog.collapsed && (!Editor.isDarkMode() ||
			graph.getAdaptiveColors() != 'auto') &&
			darkSelect.value == 'automatic')
		{
			darkColorDiv.style.display = 'none';
			updateCollapseIcon();
		}

		lightIcon = document.createElement('img');
		lightIcon.setAttribute('title', mxResources.get('light'));
		lightIcon.className = 'geAdaptiveAsset';
		lightIcon.src = Editor.thinLightImage;
		lightIcon.style.width = '20px';
		inputDiv.appendChild(lightIcon);

		mxEvent.addListener(lightIcon, 'click', function()
		{
			input.focus();
		});
	}

	inputDiv.appendChild(input);

	defaultBtn.style.cursor = 'pointer';
	defaultBtn.style.position = 'relative';
	defaultBtn.style.marginLeft = '6px';

	if (cssDefaultColor != null)
	{
		defaultBtn.setAttribute('title', mxResources.get(
			(singleColorMode) ? 'default' : 'useBlackAndWhite'));
		defaultBtn.innerText = '';

		var def = document.createElement('div');
		def.style.display = 'inline-block';
		def.style.verticalAlign = 'middle';
		def.style.borderStyle = 'solid';
		def.style.borderWidth = '1px';
		def.style.marginTop = '-2px';
		def.style.width = '12px';
		def.style.height = '12px';

		if (singleColorMode)
		{
			def.style.backgroundColor = cssDefaultColor.light;
		}
		else
		{
			def.style.backgroundImage = 'linear-gradient(to right bottom, ' +
				cssDefaultColor.cssText + ' 50%, ' +
				mxUtils.invertLightDarkColor(cssDefaultColor).cssText + ' 50.3%)';
		}

		defaultBtn.appendChild(def);
	}
	else
	{
		defaultBtn.style.display = 'none';
	}

	inputDiv.appendChild(defaultBtn);

	mxEvent.addListener(defaultBtn, 'dblclick', function()
	{
		doApply();

		if (liveApply && self.closeFn != null)
		{
			self.closeFn();
		}
	});

	var clrInput = document.createElement('input');
	clrInput.setAttribute('type', 'color');
	clrInput.style.position = 'relative';
	clrInput.style.visibility = 'hidden';
	clrInput.style.top = '10px';
	clrInput.style.width = '0px';
	clrInput.style.height = '0px';
	clrInput.style.border = 'none';
	
	div.style.whiteSpace = 'nowrap';
	inputDiv.appendChild(clrInput);

	var dropperBtn = mxUtils.button('', function()
	{
		// LATER: Check if clrInput is expanded
		if (document.activeElement == clrInput)
		{
			input.focus();
		}
		else
		{
			clrInput.value = '#' + input.value;
			clrInput.click();
		}
	});

	dropperBtn.style.cursor = 'pointer';

	var dropper = document.createElement('img');
	dropper.src = Editor.colorDropperImage;
	dropper.className = 'geAdaptiveAsset';
	dropper.style.position = 'relative';
	dropper.style.verticalAlign = 'middle';
	dropper.style.marginTop = '-2px';
	dropper.style.width = 'auto';
	dropper.style.height = '14px';

	dropperBtn.appendChild(dropper);
	inputDiv.appendChild(dropperBtn);

	div.appendChild(wrapper);

	mxEvent.addListener(clrInput, 'change', function()
	{
		picker.fromString(clrInput.value);
	});

	if (!singleColorMode)
	{
		div.appendChild(darkColorDiv);
	}

	// Adds recent colors
	var recentTable = createRecentColorTable();

	function refreshRecentColors()
	{
		if (recentTable != null && recentTable.parentNode != null)
		{
			recentTable.parentNode.removeChild(recentTable);
		}

		recentTable = createRecentColorTable();

		if (center.firstChild != recentTable)
		{
			center.insertBefore(recentTable, center.firstChild);
		}
	};

	// Adds presets
	var table = addPresets(this.presetColors);
	table.style.marginBottom = '6px';
	table = addPresets(this.defaultColors);
	table.style.marginBottom = '0';

	div.appendChild(center);

	// Offers an explicit "Inherit" choice so a color can be set to inherit from
	// the parent (eg. a table/swimlane cell using its container's color). Shown
	// only when the caller marks the value as inheritable (allowInherit). Applies
	// the 'inherit' sentinel and closes the picker like choosing a color.
	var inheritBtn = mxUtils.button(mxResources.get('inherit', null, 'Inherit'), function()
	{
		applyFunction('inherit');

		if (liveApply)
		{
			if (self.closeFn != null)
			{
				self.closeFn();
			}
		}
		else
		{
			editorUi.hideDialog();
		}
	});

	inheritBtn.setAttribute('title', mxResources.get('inherit', null, 'Inherit'));
	// allowInherit may be a live predicate (re-evaluated as the selection changes
	// while the reused color window stays open) or a plain boolean
	function inheritAllowed(v)
	{
		return (typeof v === 'function') ? v() : v;
	};

	inheritBtn.style.display = (inheritAllowed(allowInherit)) ? '' : 'none';
	inheritBtn.style.width = '100%';
	inheritBtn.style.margin = '6px 0 0 0';
	div.appendChild(inheritBtn);

	var buttons = null;

	if (!liveApply)
	{
		buttons = document.createElement('div');
		buttons.style.display = 'flex';
		buttons.style.whiteSpace = 'nowrap';
		buttons.style.alignItems = 'center';
		buttons.style.justifyContent = 'end';
		buttons.style.marginTop = '34px';

		if (!editorUi.isOffline())
		{
			buttons.appendChild(editorUi.createHelpIcon('https://www.drawio.com/docs/manual/editor/appearance/adaptive-colours/'));
		}

		var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
		{
			editorUi.hideDialog();

			if (cancelFn != null)
			{
				cancelFn();
			}
		});
		cancelBtn.className = 'geBtn';

		if (editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}

		var applyBtn = mxUtils.button(mxResources.get('apply'), doApply);
		applyBtn.className = 'geBtn gePrimaryBtn';
		buttons.appendChild(applyBtn);

		if (!editorUi.editor.cancelFirst)
		{
			buttons.appendChild(cancelBtn);
		}
	}
	
	if (color != null)
	{
		if (color == 'default')
		{
			defaultBtn.click();
		}
		else
		{
			var cssColor = mxUtils.getLightDarkColor(color);

			if (color == mxConstants.NONE ||
				cssColor.light == 'transparent')
			{
				input.value = mxConstants.NONE;
			}
			else
			{
				if (mxUtils.isVarColor(cssColor.light))
				{
					input.value = cssColor.light;
				}
				else
				{
					if (mxUtils.isRgbColor(cssColor.light))
					{
						cssColor.light = mxUtils.rgba2hex(cssColor.light);
					}
					else if (!mxUtils.isHexColor(cssColor.light))
					{
						cssColor.light = '#' + validateColor(cssColor.light);
					}

					input.value = cssColor.light.substring(1).toUpperCase();
				}
			}

			if (color == mxConstants.NONE ||
				cssColor.dark == 'transparent')
			{
				darkInput.value = mxConstants.NONE;
			}
			else
			{
				if (mxUtils.isVarColor(cssColor.dark))
				{
					darkInput.value = cssColor.dark;
				}
				else
				{
					if (mxUtils.isRgbColor(cssColor.dark))
					{
						cssColor.dark = mxUtils.rgba2hex(cssColor.dark);
					}
					else if (!mxUtils.isHexColor(cssColor.dark))
					{
						cssColor.dark = '#' + validateColor(cssColor.dark);
					}
					
					darkInput.value = cssColor.dark.substring(1).toUpperCase();
				}
			}

			updatePickerFromCurrentInput();
			updateInputColors();
		}
	}
	
	if (!singleColorMode && ColorDialog.collapsed &&
		darkSelect.value == 'automatic' &&
		!Editor.isDarkMode())
	{
		darkColorDiv.style.display = 'none';
		updateCollapseIcon();
	}
	
	if (buttons != null)
	{
		div.appendChild(buttons);
	}

	this.picker = picker;
	this.colorInput = input;

	function keyPressed(e)
	{
		if (e.keyCode == 13)
		{
			inputChanged(mxEvent.getSource(e));
			doApply();

			if (liveApply && self.closeFn != null)
			{
				self.closeFn();
			}
		}
	};

	mxEvent.addListener(input, 'keypress', keyPressed);
	mxEvent.addListener(darkInput, 'keypress', keyPressed);

	// LATER: Only fires if input if focused, should always
	// fire if this dialog is showing.
	mxEvent.addListener(div, 'keydown', function(e)
	{
		if (e.keyCode == 27)
		{
			if (liveApply)
			{
				if (self.closeFn != null)
				{
					self.closeFn();
				}
			}
			else
			{
				editorUi.hideDialog();

				if (cancelFn != null)
				{
					cancelFn();
				}
			}

			mxEvent.consume(e);
		}
	});

	this.container = div;

	// Methods for reuse in live mode
	this.closeFn = null;
	this.resizeFn = null;

	this.setApplyFn = function(fn)
	{
		applyFunction = fn;
	};

	this.setColor = function(newColor, newDefaultColor, newDefaultColorValue, newSingleColorMode, newAllowInherit)
	{
		// Reset session tracking for recent colors
		sessionRecentColor = null;

		// Update default color state
		defaultColor = newDefaultColor;
		defaultColorValue = newDefaultColorValue;
		singleColorMode = newSingleColorMode;

		// Toggles the inherit affordance for the reused (non-modal) picker
		inheritBtn.style.display = (inheritAllowed(newAllowInherit)) ? '' : 'none';
		cssDefaultColor = (newDefaultColorValue != null) ?
			mxUtils.getLightDarkColor(newDefaultColorValue,
				null, null, newSingleColorMode) : null;
		useDefault = false;

		// Update singleColorMode visibility
		if (newSingleColorMode)
		{
			advancedDiv.style.display = 'none';
			darkColorDiv.style.display = 'none';

			if (lightIcon != null)
			{
				lightIcon.style.display = 'none';
			}

			currentInput = input;
			input.focus();
		}
		else
		{
			advancedDiv.style.display = 'flex';

			if (lightIcon != null)
			{
				lightIcon.style.display = '';
			}

			if (ColorDialog.collapsed && darkSelect.value == 'automatic' &&
				!Editor.isDarkMode())
			{
				darkColorDiv.style.display = 'none';
			}
			else
			{
				darkColorDiv.style.display = 'flex';
			}

			updateCollapseIcon();
		}

		// Update default button
		if (cssDefaultColor != null)
		{
			defaultBtn.style.display = '';
			defaultBtn.setAttribute('title', mxResources.get(
				(newSingleColorMode) ? 'default' : 'useBlackAndWhite'));
			defaultBtn.innerText = '';

			var def = document.createElement('div');
			def.style.display = 'inline-block';
			def.style.verticalAlign = 'middle';
			def.style.borderStyle = 'solid';
			def.style.borderWidth = '1px';
			def.style.marginTop = '-2px';
			def.style.width = '12px';
			def.style.height = '12px';

			if (newSingleColorMode)
			{
				def.style.backgroundColor = cssDefaultColor.light;
			}
			else
			{
				def.style.backgroundImage = 'linear-gradient(to right bottom, ' +
					cssDefaultColor.cssText + ' 50%, ' +
					mxUtils.invertLightDarkColor(cssDefaultColor).cssText + ' 50.3%)';
			}

			defaultBtn.appendChild(def);
		}
		else
		{
			defaultBtn.style.display = 'none';
		}

		// Set color values
		if (newColor != null)
		{
			// Converts color names to hex
			if (newColor != 'default' &&
				newColor != 'transparent' &&
				newColor != mxConstants.NONE &&
				!mxUtils.isVarColor(newColor) &&
				!mxUtils.isHexColor(newColor) &&
				!mxUtils.isRgbColor(newColor) &&
				!mxUtils.isLightDarkColor(newColor))
			{
				newColor = mxUtils.color2hex(newColor);
			}

			darkSelect.value = (!mxUtils.isLightDarkColor(newColor) ?
				'automatic' : 'custom');

			if (newColor == 'default')
			{
				setDefaultSelected(true);
				updateInputColors();

				if (cssDefaultColor != null)
				{
					picker.fromString((currentInput == darkInput) ?
						cssDefaultColor.dark :
						cssDefaultColor.light, true);
				}
			}
			else
			{
				var cssColor = mxUtils.getLightDarkColor(newColor);

				if (newColor == mxConstants.NONE ||
					cssColor.light == 'transparent')
				{
					input.value = mxConstants.NONE;
				}
				else
				{
					if (mxUtils.isVarColor(cssColor.light))
					{
						input.value = cssColor.light;
					}
					else
					{
						if (mxUtils.isRgbColor(cssColor.light))
						{
							cssColor.light = mxUtils.rgba2hex(cssColor.light);
						}
						else if (!mxUtils.isHexColor(cssColor.light))
						{
							cssColor.light = '#' + validateColor(cssColor.light);
						}

						input.value = cssColor.light.substring(1).toUpperCase();
					}
				}

				if (newColor == mxConstants.NONE ||
					cssColor.dark == 'transparent')
				{
					darkInput.value = mxConstants.NONE;
				}
				else
				{
					if (mxUtils.isVarColor(cssColor.dark))
					{
						darkInput.value = cssColor.dark;
					}
					else
					{
						if (mxUtils.isRgbColor(cssColor.dark))
						{
							cssColor.dark = mxUtils.rgba2hex(cssColor.dark);
						}
						else if (!mxUtils.isHexColor(cssColor.dark))
						{
							cssColor.dark = '#' + validateColor(cssColor.dark);
						}

						darkInput.value = cssColor.dark.substring(1).toUpperCase();
					}
				}

				updatePickerFromCurrentInput();
				updateInputColors();
			}
		}

		if (!newSingleColorMode && ColorDialog.collapsed &&
			darkSelect.value == 'automatic' &&
			!Editor.isDarkMode())
		{
			darkColorDiv.style.display = 'none';
			updateCollapseIcon();
		}

		refreshRecentColors();

		if (self.resizeFn != null)
		{
			self.resizeFn();
		}
	};
};

/**
 * Creates function to apply value
 */
ColorDialog.prototype.presetColors = ['E6D0DE', 'CDA2BE', 'B5739D', 'E1D5E7', 'C3ABD0', 'A680B8', 'D4E1F5', 'A9C4EB', '7EA6E0', 'D5E8D4', '9AC7BF', '67AB9F', 'D5E8D4', 'B9E0A5', '97D077', 'FFF2CC', 'FFE599', 'FFD966', 'FFF4C3', 'FFCE9F', 'FFB570', 'F8CECC', 'F19C99', 'EA6B66']; 

/**
 * Creates function to apply value
 */
ColorDialog.prototype.colorNames = {};

/**
 * Creates function to apply value
 */
ColorDialog.prototype.defaultColors = ['none', 'FFFFFF', 'E6E6E6', 'CCCCCC', 'B3B3B3', '999999', '808080', '666666', '4D4D4D', '333333', '1A1A1A', '000000', 'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6',
		'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC', 'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3', 'FF3333', 'FF9933', 'FFFF33',
		'99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399', 'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080', 'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66',
		'00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066', '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D', '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066',
		'330066', '660066', '660033', '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A'];

/**
 * Creates function to apply value
 */
ColorDialog.prototype.createApplyFunction = function()
{
	return ColorDialog.createApplyFunction(this.editorUi, this.currentColorKey);
};

/**
 * Creates function to apply value
 */
ColorDialog.createApplyFunction = function(editorUi, colorKey)
{
	return function(color)
	{
		var graph = editorUi.editor.graph;
		
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(colorKey, color);
			editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	};
};

/**
 * 
 */
ColorDialog.recentColors = [];

/**
 * Adds recent color for later use.
 */
ColorDialog.addRecentColor = function(color, max)
{
	if (color != null)
	{
		mxUtils.remove(color, ColorDialog.recentColors);
		ColorDialog.recentColors.splice(0, 0, color);
		
		if (ColorDialog.recentColors.length >= max)
		{
			ColorDialog.recentColors.pop();
		}
	}
};

/**
 * Adds recent color for later use.
 */
ColorDialog.resetRecentColors = function()
{
	ColorDialog.recentColors = [];
};

/**
 * Remembers collapsed dark color state.
 */
ColorDialog.collapsed = true;

/**
 * Non-modal color picker tool window.
 */
var ColorWindow = function(editorUi, x, y, w)
{
	var graph = editorUi.editor.graph;

	this.colorDialog = new ColorDialog(editorUi, mxConstants.NONE,
		function() {}, null, null, null, false, true);

	// Initial height from content
	var container = this.colorDialog.container;
	var titleHeight = 26;
	var initH = titleHeight + 200;

	this.window = new mxWindow('', container,
		x, y, w, initH, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 260, 200);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(false);
	this.window.setClosable(true);

	var self = this;

	this.fitHeight = function()
	{
		// While minimized the content is hidden (scrollHeight 0), so measuring
		// would shrink to the title bar and setSize would then clamp back up to
		// minimumSize, leaving a wrong-sized empty window. The minimize/restore
		// logic owns the size in that state, so leave it alone.
		if (self.window.minimized)
		{
			return;
		}

		var titleH = self.window.title.offsetHeight || titleHeight;
		var contentH = container.scrollHeight;
		var newH = titleH + contentH + self.window.contentHeightCorrection;
		self.window.setSize(parseInt(self.window.div.style.width), newH);
		self.window.fit();
	};

	this.colorDialog.closeFn = mxUtils.bind(this, function()
	{
		this.window.setVisible(false);
	});

	this.colorDialog.resizeFn = mxUtils.bind(this, function()
	{
		this.fitHeight();
	});

	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		this.fitHeight();
	}));

	// State for auto-refresh
	this.getColorFn = null;
	this.currentDefaultColor = null;
	this.currentDefaultColorValue = null;
	this.currentSingleColorMode = null;
	this.currentAllowInherit = null;
	this.applying = false;

	var refreshColor = mxUtils.bind(this, function()
	{
		if (this.window.isVisible() && this.getColorFn != null &&
			!this.applying)
		{
			var color = this.getColorFn();

			if (color != null)
			{
				// Passes allowInherit so an external change (eg. collaborator
				// edit) does not drop the Inherit button while the window is open
				this.colorDialog.setColor(color, this.currentDefaultColor,
					this.currentDefaultColorValue, this.currentSingleColorMode,
					this.currentAllowInherit);
			}
		}
	});

	graph.getSelectionModel().addListener(mxEvent.CHANGE, refreshColor);
	graph.getModel().addListener(mxEvent.CHANGE, refreshColor);
	editorUi.addListener('styleChanged', refreshColor);

	editorUi.installResizeHandler(this, true);
};

/**
 * Updates the color window state for a new color property.
 */
ColorWindow.prototype.update = function(color, applyFn, title,
	defaultColor, defaultColorValue, singleColorMode, getColorFn, allowInherit)
{
	this.getColorFn = getColorFn || null;
	this.currentDefaultColor = defaultColor;
	this.currentDefaultColorValue = defaultColorValue;
	this.currentSingleColorMode = singleColorMode;
	this.currentAllowInherit = allowInherit;

	this.window.setTitle(title);
	this.colorDialog.setApplyFn(applyFn);
	this.colorDialog.setColor(color, defaultColor, defaultColorValue, singleColorMode, allowInherit);
	this.window.setVisible(true);
	this.fitHeight();
	this.colorDialog.init();
};

/**
 * Constructs a new about dialog.
 */
var AboutDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('about') + ' GraphEditor');
	div.appendChild(h3);
	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	div.appendChild(img);
	mxUtils.br(div);
	mxUtils.write(div, 'Powered by mxGraph ' + mxClient.VERSION);
	mxUtils.br(div);
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.jgraph.com/');
	link.setAttribute('target', '_blank');
	mxUtils.write(link, 'www.jgraph.com');
	div.appendChild(link);
	mxUtils.br(div);
	mxUtils.br(div);
	var closeBtn = mxUtils.button(mxResources.get('close'), function()
	{
		editorUi.hideDialog();
	});
	closeBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(closeBtn);
	
	this.container = div;
};

/**
 * Constructs a simple textarea dialog.
 */
var SimpleTextareaDialog = function(editorUi, value, fn, buttonLabel, helpLink, headerControl, applyKeepsOpen)
{
	var initialValue = (value != null) ? value : '';
	var applying = false;

	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';
	div.style.boxSizing = 'border-box';
	// the flex column never overflows (the textarea scrolls internally),
	// so opt out of the .geDialog > :first-child scroll container — it
	// clips the focus halo of the bottom-row controls
	div.style.overflow = 'visible';

	var textarea = document.createElement('textarea');
	textarea.style.flex = '1';
	textarea.style.minHeight = '0';
	textarea.style.width = '100%';
	textarea.style.boxSizing = 'border-box';
	textarea.style.resize = 'none';
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');
	textarea.value = (value != null) ? value : '';
	div.appendChild(textarea);

	var buttons = document.createElement('div');
	buttons.style.display = 'flex';
	buttons.style.justifyContent = 'end';
	buttons.style.alignItems = 'center';
	buttons.style.marginTop = '14px';
	buttons.style.flexShrink = '0';

	if (helpLink != null && !editorUi.isOffline())
	{
		buttons.appendChild(editorUi.createHelpIcon(helpLink));
	}

	// Optional caller-supplied control (e.g. a select) placed left of the
	// action buttons, matching the type dropdown in ParseDialog.
	if (headerControl != null)
	{
		buttons.appendChild(headerControl);
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});

	cancelBtn.setAttribute('title', 'Escape');
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	var okBtn = mxUtils.button((buttonLabel != null) ?
		buttonLabel : mxResources.get('apply'), function()
	{
		// applyKeepsOpen leaves the dialog open for an async fn that may
		// fail (e.g. mermaid parsing) so the input isn't lost; the caller
		// hides it via this.hide() once the apply succeeds, like the
		// mermaid branch in ParseDialog.
		if (applyKeepsOpen)
		{
			fn(textarea.value);

			return;
		}

		// suppresses the unsaved-changes confirmation a caller may have
		// wired into the dialog's onClose (see shouldConfirmClose)
		applying = true;

		try
		{
			editorUi.hideDialog();
		}
		finally
		{
			applying = false;
		}

		fn(textarea.value);
	});

	okBtn.setAttribute('title', 'Ctrl+Enter');
	okBtn.className = 'geBtn gePrimaryBtn';
	buttons.appendChild(okBtn);

	mxEvent.addListener(textarea, 'keydown', function(e)
	{
		if (e.keyCode == 13 && mxEvent.isControlDown(e))
		{
			okBtn.click();
		}
	});

	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	this.init = function()
	{
		textarea.focus();
		textarea.scrollTop = 0;
	};

	/**
	 * True when closing now would lose the user's edits: the text differs
	 * from the initial value and the close wasn't triggered by Apply.
	 * Callers use this from the dialog's onClose to show an
	 * "all changes will be lost" confirmation.
	 */
	this.shouldConfirmClose = function()
	{
		return !applying && textarea.value != initialValue;
	};

	/**
	 * Hides the dialog with the unsaved-changes confirmation suppressed.
	 * Used with applyKeepsOpen: the caller closes the dialog once its
	 * async apply has succeeded.
	 */
	this.hide = function()
	{
		applying = true;

		try
		{
			editorUi.hideDialog();
		}
		finally
		{
			applying = false;
		}
	};

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Constructs a new textarea dialog.
 */
var TextareaDialog = function(editorUi, title, url, fn, cancelFn, cancelTitle, w, h,
	addButtons, noHide, noWrap, applyTitle, helpLink, customButtons, header)
{
	w = (w != null) ? w : 300;
	h = (h != null) ? h : 120;
	noHide = (noHide != null) ? noHide : false;

	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';
	div.style.boxSizing = 'border-box';

	var top = document.createElement('div');
	top.style.display = 'flex';
	top.style.alignItems = 'center';
	top.style.marginBottom = '8px';
	top.style.flexShrink = '0';

	var hd = document.createElement('h3');
	mxUtils.write(hd, title);
	hd.style.cssText = 'width:100%;text-align:center;margin:0';
	top.appendChild(hd);

	if (header != null)
	{
		top.appendChild(header);
	}

	div.appendChild(top);

	var nameInput = document.createElement('textarea');

	if (noWrap)
	{
		nameInput.setAttribute('wrap', 'off');
	}
	else
	{
		nameInput.style.wordBreak = 'break-all';
	}

	nameInput.setAttribute('spellcheck', 'false');
	nameInput.setAttribute('autocorrect', 'off');
	nameInput.setAttribute('autocomplete', 'off');
	nameInput.setAttribute('autocapitalize', 'off');

	mxUtils.write(nameInput, url || '');
	nameInput.style.resize = 'none';
	nameInput.style.flex = '1';
	nameInput.style.minHeight = '0';
	nameInput.style.width = '100%';
	nameInput.style.boxSizing = 'border-box';

	this.textarea = nameInput;

	this.init = function()
	{
		nameInput.focus();
		nameInput.scrollTop = 0;
	};

	div.appendChild(nameInput);

	var buttons = document.createElement('div');
	buttons.style.display = 'flex';
	buttons.style.whiteSpace = 'nowrap';
	buttons.style.alignItems = 'center';
	buttons.style.justifyContent = 'end';
	buttons.style.marginTop = '14px';
	buttons.style.flexShrink = '0';

	if (helpLink != null && !editorUi.isOffline())
	{
		buttons.appendChild(editorUi.createHelpIcon(helpLink));
	}

	if (customButtons != null)
	{
		for (var i = 0; i < customButtons.length; i++)
		{
			(function(label, fn, title)
			{
				var customBtn = mxUtils.button(label, function(e)
				{
					fn(e, nameInput);
				});

				if (title != null)
				{
					customBtn.setAttribute('title', title);
				}

				customBtn.className = 'geBtn';

				buttons.appendChild(customBtn);
			})(customButtons[i][0], customButtons[i][1], customButtons[i][2]);
		}
	}

	var cancelBtn = mxUtils.button(cancelTitle || mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();

		if (cancelFn != null)
		{
			cancelFn();
		}
	});

	cancelBtn.setAttribute('title', 'Escape');
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	if (addButtons != null)
	{
		addButtons(buttons, nameInput);
	}

	if (fn != null)
	{
		var genericBtn = mxUtils.button(applyTitle || mxResources.get('apply'), function()
		{
			if (!noHide)
			{
				editorUi.hideDialog();
			}

			fn(nameInput.value);
		});

		genericBtn.setAttribute('title', 'Ctrl+Enter');
		genericBtn.className = 'geBtn gePrimaryBtn';
		buttons.appendChild(genericBtn);

		mxEvent.addListener(nameInput, 'keydown', function(e)
		{
			if (e.keyCode == 13 && mxEvent.isControlDown(e))
			{
				genericBtn.click();
			}
		});
	}

	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * Constructs a new edit file dialog.
 */
var EditDiagramDialog = function(editorUi)
{
	var div = document.createElement('div');
	div.style.display = 'flex';
	div.style.flexDirection = 'column';
	div.style.height = '100%';
	div.style.boxSizing = 'border-box';

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get('editDiagram'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:10px;flex-shrink:0';
	div.appendChild(hd);

	var textarea = document.createElement('textarea');
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');
	textarea.style.overflow = 'auto';
	textarea.style.resize = 'none';
	textarea.style.flex = '1';
	textarea.style.minHeight = '0';
	textarea.style.width = '100%';
	textarea.style.boxSizing = 'border-box';

	var snapshot = editorUi.getDiagramSnapshot();
	textarea.value = mxUtils.getPrettyXml(snapshot.node);
	div.appendChild(textarea);

	this.init = function()
	{
		textarea.focus();
	};

	// Enables dropping files
	if (Graph.fileSupport)
	{
		function handleDrop(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();

			if (evt.dataTransfer.files.length > 0)
			{
				var file = evt.dataTransfer.files[0];
				var reader = new FileReader();

				reader.onload = function(e)
				{
					textarea.value = e.target.result;
				};

				reader.readAsText(file);
			}
			else
			{
				textarea.value = editorUi.extractGraphModelFromEvent(evt);
			}
		};

		function handleDragOver(evt)
		{
			evt.stopPropagation();
			evt.preventDefault();
		};

		// Setup the dnd listeners.
		textarea.addEventListener('dragover', handleDragOver, false);
		textarea.addEventListener('drop', handleDrop, false);
	}

	var buttons = document.createElement('div');
	buttons.style.display = 'flex';
	buttons.style.whiteSpace = 'nowrap';
	buttons.style.alignItems = 'center';
	buttons.style.justifyContent = 'end';
	buttons.style.marginTop = '14px';
	buttons.style.flexShrink = '0';

	if (!editorUi.isOffline())
	{
		var helpIcon = editorUi.createHelpIcon(EditDiagramDialog.helpLink);
		helpIcon.style.marginRight = 'auto';
		buttons.appendChild(helpIcon);
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});

	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	var select = document.createElement('select');
	select.style.textOverflow = 'ellipsis';
	select.style.marginLeft = '8px';
	select.style.height = '30px';
	select.style.width = '196px';

	var placeholderOption = document.createElement('option');
	placeholderOption.setAttribute('value', '');
	placeholderOption.setAttribute('disabled', 'disabled');
	placeholderOption.setAttribute('selected', 'selected');
	mxUtils.write(placeholderOption, mxResources.get('select') + '...');
	select.appendChild(placeholderOption);

	var copyOption = document.createElement('option');
	copyOption.setAttribute('value', 'copy');
	mxUtils.write(copyOption, mxResources.get('copyDiagramToClipboard'));
	select.appendChild(copyOption);

	var newOption = document.createElement('option');
	newOption.setAttribute('value', 'new');
	mxUtils.write(newOption, mxResources.get('openInNewWindow'));

	if (EditDiagramDialog.showNewWindowOption && !navigator.standalone)
	{
		select.appendChild(newOption);
	}

	var extractTextAction = editorUi.actions.get('extractText');
	var hasExtractText = extractTextAction != null;
	var hasAnonymize = typeof editorUi.anonymizeXml == 'function';

	if (hasExtractText)
	{
		var extractOption = document.createElement('option');
		extractOption.setAttribute('value', 'extractText');
		mxUtils.write(extractOption, mxResources.get('extractText'));
		select.appendChild(extractOption);
	}

	if (hasAnonymize)
	{
		var anonymizeOption = document.createElement('option');
		anonymizeOption.setAttribute('value', 'anonymize');
		mxUtils.write(anonymizeOption, mxResources.get('anonymize'));
		select.appendChild(anonymizeOption);
	}

	mxEvent.addListener(select, 'change', function()
	{
		var value = select.value;
		// Removes all illegal control characters before parsing
		var data = Graph.zapGremlins(mxUtils.trim(textarea.value));
		var error = null;

		if (value == 'new')
		{
			editorUi.hideDialog();
			editorUi.editor.editAsNew(data);
		}
		else if (value == 'copy')
		{
			editorUi.writeTextToClipboard(data, function(e)
			{
				editorUi.handleError(e);
			}, function()
			{
				editorUi.alert(mxResources.get('copiedToClipboard'));
			});
		}
		else if (value == 'extractText')
		{
			extractTextAction.funct(true);
		}
		else if (value == 'anonymize')
		{
			try
			{
				textarea.value = editorUi.anonymizeXml(data);
			}
			catch (e)
			{
				error = e;
			}
		}

		select.value = '';

		if (error != null)
		{
			editorUi.handleError(error);
		}
	});

	buttons.appendChild(select);

	if (editorUi.editor.graph.isEnabled())
	{
		var applyBtn = mxUtils.button(mxResources.get('apply'), function()
		{
			// Removes all illegal control characters before parsing
			var data = Graph.zapGremlins(mxUtils.trim(textarea.value));
			var error = null;

			try
			{
				var node = mxUtils.parseXml(data).documentElement;
				var cause = Editor.extractParserError(node, mxResources.get('unknownError'));

				if (cause)
				{
					EditorUi.debug('EditDiagramDialogParserError', [this],
						'node', [node], 'cause', [cause]);
					error = mxResources.get('invalidInput') + ' (' + cause + ')';
				}
				else
				{
					if (node.nodeName == 'mxfile')
					{
						editorUi.editor.setGraphXml(node);
					}
					else
					{
						editorUi.updateDiagramData(snapshot, node);
					}

					editorUi.hideDialog();
				}
			}
			catch (e)
			{
				error = e;
			}

			if (error != null)
			{
				editorUi.handleError(error);
			}
		});
		applyBtn.className = 'geBtn gePrimaryBtn';
		buttons.appendChild(applyBtn);
	}

	if (!editorUi.editor.cancelFirst)
	{
		buttons.appendChild(cancelBtn);
	}

	div.appendChild(buttons);
	this.container = div;
};

/**
 * 
 */
EditDiagramDialog.showNewWindowOption = true;

/**
 * URL for the user-facing documentation of this dialog.
 */
EditDiagramDialog.helpLink = 'https://www.drawio.com/docs/manual/advanced/diagram-source-edit/';

/**
 * Constructs a new export dialog.
 */
var ExportDialog = function(editorUi)
{
	var graph = editorUi.editor.graph;
	var bounds = graph.getGraphBounds();
	var scale = graph.view.scale;
	
	var width = Math.ceil(bounds.width / scale);
	var height = Math.ceil(bounds.height / scale);

	var container = document.createElement('div');

	// --- File section ---
	var section = document.createElement('div');
	section.className = 'geDialogSection';

	var formRow = document.createElement('div');
	formRow.className = 'geDialogFormRow';
	var lbl = document.createElement('span');
	lbl.className = 'geDialogFormLabel';
	mxUtils.write(lbl, mxResources.get('filename') + ':');
	formRow.appendChild(lbl);
	var nameInput = document.createElement('input');
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename());
	formRow.appendChild(nameInput);
	section.appendChild(formRow);

	formRow = document.createElement('div');
	formRow.className = 'geDialogFormRow';
	lbl = document.createElement('span');
	lbl.className = 'geDialogFormLabel';
	mxUtils.write(lbl, mxResources.get('format') + ':');
	formRow.appendChild(lbl);
	var imageFormatSelect = document.createElement('select');

	var pngOption = document.createElement('option');
	pngOption.setAttribute('value', 'png');
	mxUtils.write(pngOption, mxResources.get('formatPng'));
	imageFormatSelect.appendChild(pngOption);

	var gifOption = document.createElement('option');

	if (ExportDialog.showGifOption)
	{
		gifOption.setAttribute('value', 'gif');
		mxUtils.write(gifOption, mxResources.get('formatGif'));
		imageFormatSelect.appendChild(gifOption);
	}

	var jpgOption = document.createElement('option');
	jpgOption.setAttribute('value', 'jpg');
	mxUtils.write(jpgOption, mxResources.get('formatJpg'));
	imageFormatSelect.appendChild(jpgOption);

	var svgOption = document.createElement('option');
	svgOption.setAttribute('value', 'svg');
	mxUtils.write(svgOption, mxResources.get('formatSvg'));
	imageFormatSelect.appendChild(svgOption);

	if (ExportDialog.showXmlOption)
	{
		var xmlOption = document.createElement('option');
		xmlOption.setAttribute('value', 'xml');
		mxUtils.write(xmlOption, mxResources.get('formatXml'));
		imageFormatSelect.appendChild(xmlOption);
	}

	formRow.appendChild(imageFormatSelect);
	section.appendChild(formRow);
	container.appendChild(section);

	// --- Size section ---
	section = document.createElement('div');
	section.className = 'geDialogSection';

	formRow = document.createElement('div');
	formRow.className = 'geDialogFormRow';
	lbl = document.createElement('span');
	lbl.className = 'geDialogFormLabel';
	mxUtils.write(lbl, mxResources.get('zoom') + ' (%):');
	formRow.appendChild(lbl);
	var zoomInput = document.createElement('input');
	zoomInput.setAttribute('type', 'number');
	zoomInput.setAttribute('value', '100');
	formRow.appendChild(zoomInput);
	section.appendChild(formRow);

	var inlineRow = document.createElement('div');
	inlineRow.className = 'geDialogInlineFields';
	inlineRow.style.marginTop = '6px';

	var field = document.createElement('div');
	field.className = 'geDialogInlineField';
	lbl = document.createElement('label');
	mxUtils.write(lbl, mxResources.get('width') + ':');
	field.appendChild(lbl);
	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'number');
	widthInput.setAttribute('value', width);
	field.appendChild(widthInput);
	inlineRow.appendChild(field);

	field = document.createElement('div');
	field.className = 'geDialogInlineField';
	lbl = document.createElement('label');
	mxUtils.write(lbl, mxResources.get('height') + ':');
	field.appendChild(lbl);
	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'number');
	heightInput.setAttribute('value', height);
	field.appendChild(heightInput);
	inlineRow.appendChild(field);
	section.appendChild(inlineRow);

	formRow = document.createElement('div');
	formRow.className = 'geDialogFormRow';
	lbl = document.createElement('span');
	lbl.className = 'geDialogFormLabel';
	mxUtils.write(lbl, mxResources.get('dpi') + ':');
	formRow.appendChild(lbl);
	var dpiSelect = document.createElement('select');

	var dpi100Option = document.createElement('option');
	dpi100Option.setAttribute('value', '100');
	mxUtils.write(dpi100Option, '100dpi');
	dpiSelect.appendChild(dpi100Option);

	var dpi200Option = document.createElement('option');
	dpi200Option.setAttribute('value', '200');
	mxUtils.write(dpi200Option, '200dpi');
	dpiSelect.appendChild(dpi200Option);

	var dpi300Option = document.createElement('option');
	dpi300Option.setAttribute('value', '300');
	mxUtils.write(dpi300Option, '300dpi');
	dpiSelect.appendChild(dpi300Option);

	var dpi400Option = document.createElement('option');
	dpi400Option.setAttribute('value', '400');
	mxUtils.write(dpi400Option, '400dpi');
	dpiSelect.appendChild(dpi400Option);

	var dpiCustOption = document.createElement('option');
	dpiCustOption.setAttribute('value', 'custom');
	mxUtils.write(dpiCustOption, mxResources.get('custom'));
	dpiSelect.appendChild(dpiCustOption);

	var customDpi = document.createElement('input');
	customDpi.style.display = 'none';
	customDpi.setAttribute('value', '100');
	customDpi.setAttribute('type', 'number');
	customDpi.setAttribute('min', '50');
	customDpi.setAttribute('step', '50');

	formRow.appendChild(dpiSelect);
	formRow.appendChild(customDpi);
	section.appendChild(formRow);
	container.appendChild(section);

	// Options section (populated after DPI handlers below)
	var optSection = document.createElement('div');
	optSection.className = 'geDialogSection';
	
	var zoomUserChanged = false;
	
	mxEvent.addListener(dpiSelect, 'change', function()
	{
		if (this.value == 'custom')
		{
			this.style.display = 'none';
			customDpi.style.display = '';
			customDpi.focus();
		}
		else
		{
			customDpi.value = this.value;
			
			if (!zoomUserChanged) 
			{
				zoomInput.value = this.value;
			}
		}
	});
	
	mxEvent.addListener(customDpi, 'change', function()
	{
		var dpi = parseInt(customDpi.value);
		
		if (isNaN(dpi) || dpi <= 0)
		{
			customDpi.style.backgroundColor = 'red';
		}
		else
		{
			customDpi.style.backgroundColor = '';

			if (!zoomUserChanged) 
			{
				zoomInput.value = dpi;
			}
		}	
	});
	
	var checkRow = document.createElement('div');
	checkRow.className = 'geDialogCheckRow';
	var transparentCheckbox = document.createElement('input');
	transparentCheckbox.setAttribute('type', 'checkbox');
	transparentCheckbox.checked = graph.background == null || graph.background == mxConstants.NONE;
	checkRow.appendChild(transparentCheckbox);
	lbl = document.createElement('label');
	mxUtils.write(lbl, mxResources.get('transparent'));
	checkRow.appendChild(lbl);
	optSection.appendChild(checkRow);

	checkRow = document.createElement('div');
	checkRow.className = 'geDialogCheckRow';
	var gridCheckbox = document.createElement('input');
	gridCheckbox.setAttribute('type', 'checkbox');
	gridCheckbox.checked = false;
	checkRow.appendChild(gridCheckbox);
	lbl = document.createElement('label');
	mxUtils.write(lbl, mxResources.get('grid'));
	checkRow.appendChild(lbl);
	optSection.appendChild(checkRow);

	formRow = document.createElement('div');
	formRow.className = 'geDialogFormRow';
	lbl = document.createElement('span');
	lbl.className = 'geDialogFormLabel';
	mxUtils.write(lbl, mxResources.get('borderWidth') + ':');
	formRow.appendChild(lbl);
	var borderInput = document.createElement('input');
	borderInput.setAttribute('type', 'number');
	borderInput.setAttribute('value', ExportDialog.lastBorderValue);
	formRow.appendChild(borderInput);
	optSection.appendChild(formRow);
	container.appendChild(optSection);
	
	// Handles changes in the export format
	function formatChanged()
	{
		var name = nameInput.value;
		var dot = name.lastIndexOf('.');
		
		if (dot > 0)
		{
			nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value;
		}
		else
		{
			nameInput.value = name + '.' + imageFormatSelect.value;
		}
		
		if (imageFormatSelect.value === 'xml')
		{
			zoomInput.setAttribute('disabled', 'true');
			widthInput.setAttribute('disabled', 'true');
			heightInput.setAttribute('disabled', 'true');
			borderInput.setAttribute('disabled', 'true');
		}
		else
		{
			zoomInput.removeAttribute('disabled');
			widthInput.removeAttribute('disabled');
			heightInput.removeAttribute('disabled');
			borderInput.removeAttribute('disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'svg' || imageFormatSelect.value === 'pdf')
		{
			transparentCheckbox.removeAttribute('disabled');
		}
		else
		{
			transparentCheckbox.setAttribute('disabled', 'disabled');
		}
		
		if (imageFormatSelect.value === 'png' || imageFormatSelect.value === 'jpg' || imageFormatSelect.value === 'pdf')
		{
			gridCheckbox.removeAttribute('disabled');
		}
		else
		{
			gridCheckbox.setAttribute('disabled', 'disabled');
		}
		
		if (imageFormatSelect.value === 'png')
		{
			dpiSelect.removeAttribute('disabled');
			customDpi.removeAttribute('disabled');
		}
		else
		{
			dpiSelect.setAttribute('disabled', 'disabled');
			customDpi.setAttribute('disabled', 'disabled');
		}
	};
	
	mxEvent.addListener(imageFormatSelect, 'change', formatChanged);
	formatChanged();

	function checkValues()
	{
		if (widthInput.value * heightInput.value > MAX_AREA || widthInput.value <= 0)
		{
			widthInput.style.backgroundColor = 'red';
		}
		else
		{
			widthInput.style.backgroundColor = '';
		}
		
		if (widthInput.value * heightInput.value > MAX_AREA || heightInput.value <= 0)
		{
			heightInput.style.backgroundColor = 'red';
		}
		else
		{
			heightInput.style.backgroundColor = '';
		}
	};

	mxEvent.addListener(zoomInput, 'change', function()
	{
		zoomUserChanged = true;
		var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
		zoomInput.value = parseFloat((s * 100).toFixed(2));
		
		if (width > 0)
		{
			widthInput.value = Math.floor(width * s);
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(widthInput, 'change', function()
	{
		var s = parseInt(widthInput.value) / width;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			heightInput.value = Math.floor(height * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});

	mxEvent.addListener(heightInput, 'change', function()
	{
		var s = parseInt(heightInput.value) / height;
		
		if (s > 0)
		{
			zoomInput.value = parseFloat((s * 100).toFixed(2));
			widthInput.value = Math.floor(width * s);
		}
		else
		{
			zoomInput.value = '100';
			widthInput.value = width;
			heightInput.value = height;
		}
		
		checkValues();
	});
	
	var btnRow = document.createElement('div');
	btnRow.style.textAlign = 'right';
	btnRow.style.paddingTop = '16px';

	var saveBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function()
	{
		if (parseInt(zoomInput.value) <= 0)
		{
			mxUtils.alert(mxResources.get('drawingEmpty'));
		}
		else
		{
	    	var name = nameInput.value;
			var format = imageFormatSelect.value;
	    	var s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
			var b = Math.max(0, parseInt(borderInput.value));
			var bg = graph.background;
			var dpi = Math.max(1, parseInt(customDpi.value));

			if ((format == 'svg' || format == 'png' || format == 'pdf') && transparentCheckbox.checked)
			{
				bg = null;
			}
			else if (bg == null || bg == mxConstants.NONE)
			{
				bg = '#ffffff';
			}

			ExportDialog.lastBorderValue = b;
			ExportDialog.exportFile(editorUi, name, format, bg, s, b, dpi, gridCheckbox.checked);
		}
	}));
	saveBtn.className = 'geBtn gePrimaryBtn';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		btnRow.appendChild(cancelBtn);
		btnRow.appendChild(saveBtn);
	}
	else
	{
		btnRow.appendChild(saveBtn);
		btnRow.appendChild(cancelBtn);
	}

	container.appendChild(btnRow);
	this.container = container;
};

/**
 * Remembers last value for border.
 */
ExportDialog.lastBorderValue = 0;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true;

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true;

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function(editorUi, name, format, bg, s, b, dpi, grid)
{
	var graph = editorUi.editor.graph;
	
	if (format == 'xml')
	{
    	ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(editorUi.editor.getGraphXml()), name, format);
	}
    else if (format == 'svg')
	{
		ExportDialog.saveLocalFile(editorUi, mxUtils.getXml(graph.getSvg(bg, s, b)), name, format);
	}
    else
    {
    	var bounds = graph.getGraphBounds();
    	
		// New image export
		var xmlDoc = mxUtils.createXmlDocument();
		var root = xmlDoc.createElement('output');
		xmlDoc.appendChild(root);
		
	    // Renders graph. Offset will be multiplied with state's scale when painting state.
		var xmlCanvas = new mxXmlCanvas2D(root);
		xmlCanvas.translate(Math.floor((b / s - bounds.x) / graph.view.scale),
			Math.floor((b / s - bounds.y) / graph.view.scale));
		xmlCanvas.scale(s / graph.view.scale);
		
		var imgExport = new mxImageExport()
	    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
	    
		// Puts request data together
		var param = 'xml=' + encodeURIComponent(mxUtils.getXml(root));
		var w = Math.ceil(bounds.width * s / graph.view.scale + 2 * b);
		var h = Math.ceil(bounds.height * s / graph.view.scale + 2 * b);
		
		// Requests image if request is valid
		if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA)
		{
			editorUi.hideDialog();
			var req = new mxXmlRequest(EXPORT_URL, 'format=' + format +
				'&filename=' + encodeURIComponent(name) +
				'&bg=' + ((bg != null) ? bg : 'none') +
				'&w=' + w + '&h=' + h + '&' + param +
				'&dpi=' + dpi);
			req.simulate(document, '_blank');
		}
		else
		{
			mxUtils.alert(mxResources.get('drawingTooLarge'));
		}
	}
};

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveLocalFile = function(editorUi, data, filename, format)
{
	if (data.length < MAX_REQUEST_SIZE)
	{
		editorUi.hideDialog();
		var req = new mxXmlRequest(SAVE_URL, 'xml=' + encodeURIComponent(data) + '&filename=' +
			encodeURIComponent(filename) + '&format=' + format);
		req.simulate(document, '_blank');
	}
	else
	{
		mxUtils.alert(mxResources.get('drawingTooLarge'));
		mxUtils.popup(xml);
	}
};

/**
 * Constructs a new metadata dialog.
 */
var EditDataDialog = function(ui, cell, optionalGraph)
{
	var container = document.createElement('div');
	container.style.display = 'flex';
	container.style.flexDirection = 'column';
	container.style.height = '100%';
	var graph = optionalGraph || ui.editor.graph;

	var value = graph.getModel().getValue(cell);

	// Converts the value to an XML node
	if (!mxUtils.isNode(value))
	{
		var doc = mxUtils.createXmlDocument();
		var obj = doc.createElement('object');
		obj.setAttribute('label', value || '');
		value = obj;
	}

	var meta = {};

	try
	{
		var temp = mxUtils.getValue(ui.editor.graph.getCurrentCellStyle(cell), 'metaData', null);

		if (temp != null)
		{
			meta = JSON.parse(temp);
		}
	}
	catch (e)
	{
		// ignore
	}

	var attrs = value.attributes;
	var names = [];
	var texts = [];
	var rows = [];
	var count = 0;

	var id = (EditDataDialog.getDisplayIdForCell != null) ?
		EditDataDialog.getDisplayIdForCell(ui, cell, optionalGraph) : null;

	// Properties container for dynamic rows
	var propertiesContainer = document.createElement('div');

	var addRemoveButton = function(row, name)
	{
		var removeAttr = document.createElement('a');
		var img = mxUtils.createImage(Dialog.prototype.closeImage);
		img.style.height = '9px';
		img.style.fontSize = '9px';

		removeAttr.className = 'geButton';
		removeAttr.setAttribute('title', mxResources.get('delete'));
		removeAttr.style.marginLeft = '8px';
		removeAttr.style.cursor = 'pointer';
		removeAttr.style.flexShrink = '0';
		removeAttr.appendChild(img);

		var removeAttrFn = (function(name)
		{
			return function()
			{
				for (var j = 0; j < names.length; j++)
				{
					if (names[j] == name && texts[j] != null)
					{
						texts[j] = null;
						rows[j] = null;
						row.parentNode.removeChild(row);

						break;
					}
				}
			};
		})(name);

		mxEvent.addListener(removeAttr, 'click', removeAttrFn);
		row.appendChild(removeAttr);
	};

	var addTextArea = function(index, name, value)
	{
		names[index] = name;

		var row = document.createElement('div');
		row.className = 'geDialogFormRow';
		row.style.alignItems = 'flex-start';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		lbl.style.paddingTop = '4px';
		mxUtils.write(lbl, name + ':');
		row.appendChild(lbl);

		var textarea = document.createElement('textarea');
		textarea.setAttribute('rows', (value.indexOf('\n') > 0) ? '3' : '2');
		textarea.value = value;
		textarea.style.resize = 'vertical';
		row.appendChild(textarea);

		texts[index] = textarea;
		rows[index] = row;

		addRemoveButton(row, name);
		propertiesContainer.appendChild(row);

		if (meta[name] != null && meta[name].editable == false)
		{
			textarea.setAttribute('disabled', 'disabled');
		}
	};

	var temp = [];
	var isLayer = graph.getModel().getParent(cell) == graph.getModel().getRoot();
	var style = graph.getCellStyle(cell);

	for (var i = 0; i < attrs.length; i++)
	{
		if ((attrs[i].nodeName != 'label' || style['metaEdit'] == '1' ||
			Graph.translateDiagram || isLayer) &&
			attrs[i].nodeName != 'placeholders')
		{
			temp.push({name: attrs[i].nodeName, value: attrs[i].nodeValue});
		}
	}

	// Sorts by name
	temp.sort(function(a, b)
	{
		if (a.name == 'label')
		{
			return 1;
		}
		else if (b.name == 'label')
		{
			return -1;
		}
	    else if (a.name < b.name)
	    {
	    	return -1;
	    }
	    else if (a.name > b.name)
	    {
	    	return 1;
	    }
	    else
	    {
	    	return 0;
	    }
	});

	// --- ID section ---
	if (id != null)
	{
		var idSection = document.createElement('div');
		idSection.className = 'geDialogSection';

		var idRow = document.createElement('div');
		idRow.className = 'geDialogFormRow';

		var idLabel = document.createElement('span');
		idLabel.className = 'geDialogFormLabel';
		mxUtils.write(idLabel, mxResources.get('id') + ':');
		idRow.appendChild(idLabel);

		var idText = document.createElement('span');
		idText.style.fontSize = '12px';
		idText.style.cursor = 'pointer';
		idText.style.opacity = '0.6';
		idText.setAttribute('title', mxResources.get('doubleClickToEdit'));
		mxUtils.write(idText, id);
		idRow.appendChild(idText);

		mxEvent.addListener(idText, 'dblclick', function(evt)
		{
			var dlg = new FilenameDialog(ui, id, mxResources.get('apply'),
				mxUtils.bind(this, function(value)
			{
				if (value != null && value.length > 0 && value != id)
				{
					if (graph.model.isRoot(cell))
					{
						var page = ui.getPageById(id);

						if (page != null)
						{
							if (ui.getPageById(value) == null)
							{
								var index = ui.getPageIndex(page);

								if (index >= 0)
								{
									ui.removePage(page);
									page.node.setAttribute('id', value);
									id = value;
									idText.innerHTML = mxUtils.htmlEntities(value);
									ui.insertPage(page, index);
								}
							}
							else
							{
								ui.handleError({message: mxResources.get('alreadyExst',
									[mxResources.get('page')])});
							}
						}
					}
					else
					{
						if (graph.getModel().getCell(value) == null)
						{
							graph.getModel().cellRemoved(cell);
							cell.setId(value);
							id = value;
							idText.innerHTML = mxUtils.htmlEntities(value);
							graph.getModel().cellAdded(cell);
						}
						else
						{
							ui.handleError({message: mxResources.get('alreadyExst', [value])});
						}
					}
				}
			}), mxResources.get('id'));
			ui.showDialog(dlg.container, 300, 80, true, true);
			dlg.init();
		});

		idSection.appendChild(idRow);
		container.appendChild(idSection);
	}

	for (var i = 0; i < temp.length; i++)
	{
		addTextArea(count, temp[i].name, temp[i].value);
		count++;
	}

	// --- Properties section ---
	var propsSection = document.createElement('div');
	propsSection.className = 'geDialogSection';
	propsSection.style.flex = '1';
	propsSection.style.minHeight = '0';
	propsSection.style.overflowY = 'auto';
	propsSection.appendChild(propertiesContainer);
	container.appendChild(propsSection);

	// --- Add Property section ---
	var addSection = document.createElement('div');
	addSection.className = 'geDialogSection';

	var addRow = document.createElement('div');
	addRow.className = 'geDialogFormRow';

	var nameInput = document.createElement('input');
	nameInput.setAttribute('placeholder', mxResources.get('enterPropertyName'));
	nameInput.setAttribute('type', 'text');
	addRow.appendChild(nameInput);

	var addBtn = mxUtils.button(mxResources.get('addProperty'), function()
	{
		var name = nameInput.value;

		// Avoid ':' in attribute names which seems to be valid in Chrome
		if (name.length > 0 && name != 'label' && name != 'id' &&
			name != 'placeholders' && name.indexOf(':') < 0 &&
			EditDataDialog.isValidAttributeName(name))
		{
			try
			{
				var idx = mxUtils.indexOf(names, name);

				if (idx >= 0 && texts[idx] != null)
				{
					texts[idx].focus();
				}
				else
				{
					// Checks if the name is valid
					var clone = value.cloneNode(false);
					clone.setAttribute(name, '');

					if (idx >= 0)
					{
						names.splice(idx, 1);
						texts.splice(idx, 1);
						rows.splice(idx, 1);
					}

					var newIndex = names.length;
					addTextArea(newIndex, name, '');
					texts[newIndex].focus();
					propsSection.scrollTop = propsSection.scrollHeight;
				}

				addBtn.setAttribute('disabled', 'disabled');
				nameInput.value = '';
			}
			catch (e)
			{
				mxUtils.alert(e);
			}
		}
		else
		{
			mxUtils.alert(mxResources.get('invalidName'));
		}
	});

	addBtn.setAttribute('title', mxResources.get('addProperty'));
	addBtn.setAttribute('disabled', 'disabled');
	addBtn.style.flexShrink = '0';
	addBtn.style.marginLeft = '8px';
	addBtn.className = 'geBtn';
	addRow.appendChild(addBtn);

	addSection.appendChild(addRow);
	container.appendChild(addSection);

	mxEvent.addListener(nameInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			addBtn.click();
		}
	});

	function updateAddBtn()
	{
		if (nameInput.value.length > 0)
		{
			addBtn.removeAttribute('disabled');
		}
		else
		{
			addBtn.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(nameInput, 'keyup', updateAddBtn);

	// Catches all changes that don't fire a keyup (such as paste via mouse)
	mxEvent.addListener(nameInput, 'change', updateAddBtn);

	// --- Options section ---
	if (ui.editor.graph.getModel().isVertex(cell) || ui.editor.graph.getModel().isEdge(cell))
	{
		var optSection = document.createElement('div');
		optSection.className = 'geDialogSection';

		var checkRow = document.createElement('div');
		checkRow.className = 'geDialogCheckRow';

		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');

		if (value.getAttribute('placeholders') == '1')
		{
			input.setAttribute('checked', 'checked');
			input.defaultChecked = true;
		}

		mxEvent.addListener(input, 'click', function()
		{
			if (value.getAttribute('placeholders') == '1')
			{
				value.removeAttribute('placeholders');
			}
			else
			{
				value.setAttribute('placeholders', '1');
			}
		});

		checkRow.appendChild(input);
		var lbl = document.createElement('label');
		mxUtils.write(lbl, mxResources.get('placeholders'));
		checkRow.appendChild(lbl);

		if (EditDataDialog.placeholderHelpLink != null)
		{
			checkRow.appendChild(ui.createHelpIcon(
				EditDataDialog.placeholderHelpLink));
		}

		optSection.appendChild(checkRow);
		container.appendChild(optSection);
	}

	// --- Button bar ---
	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog.apply(ui, arguments);
	});

	cancelBtn.setAttribute('title', 'Escape');
	cancelBtn.className = 'geBtn';

	var exportBtn = mxUtils.button(mxResources.get('export'), mxUtils.bind(this, function(evt)
	{
		var result = graph.getDataForCells([cell], true);

		var dlg = new EmbedDialog(ui, JSON.stringify(result, null, 2), null, null, function()
		{
			console.log(result);
			ui.alert('Written to Console (Dev Tools)');
		}, mxResources.get('export'), null, 'Console', 'data.json');
		ui.showDialog(dlg.container, 450, 270, true, true, null,
			false, null, new mxRectangle(0, 0, 400, 250));
		dlg.init();
	}));

	exportBtn.setAttribute('title', mxResources.get('export'));
	exportBtn.className = 'geBtn';

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		try
		{
			ui.hideDialog.apply(ui, arguments);

			// Clones and updates the value
			value = value.cloneNode(true);
			var removeLabel = false;

			for (var i = 0; i < names.length; i++)
			{
				if (texts[i] == null)
				{
					value.removeAttribute(names[i]);
				}
				else
				{
					value.setAttribute(names[i], texts[i].value);
					removeLabel = removeLabel || (names[i] == 'placeholder' &&
						value.getAttribute('placeholders') == '1');
				}
			}

			// Removes label if placeholder is assigned
			if (removeLabel)
			{
				value.removeAttribute('label');
			}

			// Updates the value of the cell (undoable)
			graph.getModel().setValue(cell, value);
		}
		catch (e)
		{
			mxUtils.alert(e);
		}
	});

	applyBtn.setAttribute('title', 'Ctrl+Enter');
	applyBtn.className = 'geBtn gePrimaryBtn';

	var btnRow = document.createElement('div');
	btnRow.style.textAlign = 'right';
	btnRow.style.paddingTop = '16px';

	if (ui.editor.cancelFirst)
	{
		btnRow.appendChild(cancelBtn);
	}

	btnRow.appendChild(exportBtn);
	btnRow.appendChild(applyBtn);

	if (!ui.editor.cancelFirst)
	{
		btnRow.appendChild(cancelBtn);
	}

	container.appendChild(btnRow);

	// --- Keyboard shortcuts ---
	mxEvent.addListener(container, 'keydown', function(e)
	{
		if (e.keyCode == 13 && mxEvent.isControlDown(e))
		{
			applyBtn.click();
		}
	});

	this.init = function()
	{
		if (texts.length > 0)
		{
			texts[0].focus();
		}
		else
		{
			nameInput.focus();
		}
	};

	this.container = container;
};

/**
 * Characters allowed as the first character of an XML attribute name
 * (NameStartChar in the XML Name production, restricted to the BMP).
 * See https://www.w3.org/TR/xml/#NT-Name.
 */
EditDataDialog.nameStartChar = ':A-Z_a-z' +
	'\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF' +
	'\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';

/**
 * Characters allowed in an XML attribute name after the first character
 * (NameChar in the XML Name production, restricted to the BMP).
 */
EditDataDialog.nameChar = '-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040' + EditDataDialog.nameStartChar;

/**
 * Matches a valid XML attribute name. Browsers' setAttribute does not reliably
 * reject names that start with a digit (or other invalid characters), which
 * produces invalid XML and silently corrupts the file on save, see
 * jgraph/drawio#5647.
 */
EditDataDialog.attributeNamePattern = new RegExp('^[' + EditDataDialog.nameStartChar +
	'][' + EditDataDialog.nameChar + ']*$');

/**
 * Returns true if the given string can be used as a data property (XML attribute) name.
 */
EditDataDialog.isValidAttributeName = function(name)
{
	return EditDataDialog.attributeNamePattern.test(name);
};

/**
 * Optional help link.
 */
EditDataDialog.getDisplayIdForCell = function(ui, cell)
{
	var id = null;
	
	if (ui.editor.graph.getModel().getParent(cell) != null)
	{
		id = cell.getId();
	}
	
	return id;
};

/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null;

/**
 * Constructs a new link dialog.
 */
var LinkDialog = function(editorUi, initialValue, btnLabel, fn)
{
	var div = document.createElement('div');
	mxUtils.write(div, mxResources.get('editLink') + ':');
	
	var inner = document.createElement('div');
	inner.className = 'geTitle';
	inner.style.backgroundColor = 'transparent';
	inner.style.borderColor = 'transparent';
	inner.style.whiteSpace = 'nowrap';
	inner.style.textOverflow = 'clip';
	inner.style.cursor = 'default';
	inner.style.paddingRight = '20px';
	
	var linkInput = document.createElement('input');
	linkInput.setAttribute('value', initialValue);
	linkInput.setAttribute('placeholder', 'http://www.example.com/');
	linkInput.setAttribute('type', 'text');
	linkInput.style.marginTop = '6px';
	linkInput.style.width = '400px';
	linkInput.style.backgroundImage = 'url(\'' + Dialog.prototype.clearImage + '\')';
	linkInput.style.backgroundRepeat = 'no-repeat';
	linkInput.style.backgroundPosition = '100% 50%';
	linkInput.style.paddingRight = '14px';
	
	var cross = document.createElement('div');
	cross.setAttribute('title', mxResources.get('reset'));
	cross.style.position = 'relative';
	cross.style.left = '-16px';
	cross.style.width = '12px';
	cross.style.height = '14px';
	cross.style.cursor = 'pointer';

	// Workaround for inline-block not supported in IE
	cross.style.display = 'inline-block';
	cross.style.top = '3px';
	
	// Needed to block event transparency in IE
	cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';

	mxEvent.addListener(cross, 'click', function()
	{
		linkInput.value = '';
		linkInput.focus();
	});
	
	inner.appendChild(linkInput);
	inner.appendChild(cross);
	div.appendChild(inner);
	
	this.init = function()
	{
		linkInput.focus();
		
		if (mxClient.IS_GC || mxClient.IS_FF || document.documentMode >= 5)
		{
			linkInput.select();
		}
		else
		{
			document.execCommand('selectAll', false, null);
		}
	};
	
	var btns = document.createElement('div');
	btns.style.marginTop = '18px';
	btns.style.textAlign = 'right';

	mxEvent.addListener(linkInput, 'keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			editorUi.hideDialog();
			fn(linkInput.value);
		}
	});

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	
	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}
	
	var mainBtn = mxUtils.button(btnLabel, function()
	{
		editorUi.hideDialog();
		fn(linkInput.value);
	});
	mainBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(mainBtn);
	
	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};

/**
 * 
 */
var OutlineWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;

	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.width = '100%';
	div.style.height = '100%';
	div.style.overflow = 'hidden';

	this.window = new mxWindow(mxResources.get('outline'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 80, 80);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	var outline = editorUi.createOutline(this.window);

	editorUi.installResizeHandler(this, true, function()
	{
		outline.destroy();
	});

	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		this.window.fit();
		outline.setSuspended(false);
	}));
	
	this.window.addListener(mxEvent.HIDE, mxUtils.bind(this, function()
	{
		outline.setSuspended(true);
	}));
	
	this.window.addListener(mxEvent.NORMALIZE, mxUtils.bind(this, function()
	{
		outline.setSuspended(false);
	}));
			
	this.window.addListener(mxEvent.MINIMIZE, mxUtils.bind(this, function()
	{
		outline.setSuspended(true);
	}));

	outline.init(div);
	
	mxEvent.addMouseWheelListener(function(evt, up)
	{
		var outlineWheel = false;
		var source = mxEvent.getSource(evt);

		while (source != null)
		{
			if (source == outline.svg)
			{
				outlineWheel = true;
				break;
			}

			source = source.parentNode;
		}

		if (outlineWheel)
		{
			var factor = graph.zoomFactor;

			// Slower zoom for pinch gesture on trackpad
			if (evt.deltaY != null && Math.round(evt.deltaY) != evt.deltaY)
			{
				factor = 1 + (Math.abs(evt.deltaY) / 20) * (factor - 1);
			}

			graph.lazyZoom(up, null, null, factor);
			mxEvent.consume(evt);
		}
	});
};

/**
 * 
 */
var LayersWindow = function(editorUi, x, y, w, h)
{
	var graph = editorUi.editor.graph;
	var model = graph.getModel();
	
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.height = '100%';
	div.style.marginBottom = '10px';
	div.style.overflow = 'auto';

	var listDiv = document.createElement('div')
	listDiv.style.position = 'absolute';
	listDiv.style.overflow = 'auto';
	listDiv.style.left = '0px';
	listDiv.style.right = '0px';
	listDiv.style.top = '0px';
	listDiv.style.bottom = '32px';
	div.appendChild(listDiv);
	
	var dragSource = null;
	var dropIndex = null;
	
	mxEvent.addListener(div, 'dragover', function(evt)
	{
		evt.dataTransfer.dropEffect = 'move';
		dropIndex = 0;
		evt.stopPropagation();
		evt.preventDefault();
	});
	
	// Workaround for "no element found" error in FF
	mxEvent.addListener(div, 'drop', function(evt)
	{
		evt.stopPropagation();
		evt.preventDefault();
	});

	var layerCount = null;
	var selectionLayer = null;
	var layerDivs = new mxDictionary();
	var ldiv = document.createElement('div');
	ldiv.className = 'geToolbarContainer geDialogToolbar';
	
	var link = document.createElement('a');
	link.className = 'geButton';
	
	var addLink = link.cloneNode(false);
	addLink.style.backgroundImage = 'url(' + Editor.plusImage + ')';
	addLink.setAttribute('title', mxResources.get('addLayer'));

	mxEvent.addListener(addLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			selectLayers(false);
			model.beginUpdate();
			var cell
			
			try
			{
				cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')), model.root);
				graph.setDefaultParent(cell);
			}
			finally
			{
				model.endUpdate();
			}

			renameLayer(cell);
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		addLink.classList.add('mxDisabled');
	}
	
	ldiv.appendChild(addLink);
	
	function renameLayer(layer)
	{
		if (graph.isEnabled() && layer != null)
		{
			var div = layerDivs.get(layer);

			if (div != null)
			{
				var spans = div.getElementsByTagName('div');

				if (spans != null && spans.length > 1)
				{
					var span = spans[1];
					var oldValue = mxUtils.getTextContent(span);
					span.style.textOverflow = '';
					span.style.cursor = 'text';
					span.contentEditable = 'true';
					span.focus();
					document.execCommand('selectAll', false, null);

					// Stops drag and drop on parent div
					div.removeAttribute('draggable');
					div.style.cursor = '';

					var stopEditing = function(applyValue)
					{
						if (span.contentEditable == 'true')
						{
							span.contentEditable = 'false';
							var newValue = mxUtils.getTextContent(span);

							if (applyValue && newValue != oldValue)
							{
								var newValue = mxUtils.getTextContent(span);

								if (newValue.length > 0)
								{
									graph.cellLabelChanged(layer, newValue);
								}
								else
								{
									graph.cellLabelChanged(layer, mxResources.get('untitledLayer'));
								}
							}
							else
							{
								refresh();
							}
						}
					};

					mxEvent.addListener(span, 'keydown', function(evt)
					{
						if (evt.keyCode == 13 || evt.keyCode == 27)
						{
							stopEditing(evt.keyCode == 13);
							mxEvent.consume(evt);
						}
					});

					mxEvent.addListener(span, 'blur', function(evt)
					{
						stopEditing(true);
						mxEvent.consume(evt);
					});
				}
			}
		}
	};
	
	var menuLink = link.cloneNode(false);
	menuLink.style.backgroundImage = 'url(' + Editor.menuImage + ')';
	ldiv.appendChild(menuLink);

	function isLayersVisible(layers)
	{
		var visible = true;

		for (var i = 0; i < layers.length; i++)
		{
			if (!model.isVisible(layers[i]))
			{
				visible = false;
				break;
			}
		}

		return visible;
	};

	function selectLayers(selected)
	{
		var divs = layerDivs.getValues();
		
		for (var i = 0; i < divs.length; i++)
		{
			var cb = divs[i].getElementsByTagName('input')[0];
			
			if (cb != null)
			{
				cb.checked = (selected != null) ?
					selected : !cb.checked;
			}
		}
	};

	function isLayerSelected(layer)
	{
		var div = layerDivs.get(layer);
		
		if (div != null)
		{
			var cb = div.getElementsByTagName('input')[0];
			return cb != null && cb.checked;
		}
		
		return false;
	};

	function getSelectedLayers(exclude, ignoreCheckbox)
	{
		var layers = [];

		for (var i = 0; i < model.getChildCount(model.root); i++)
		{
			var layer = model.getChildAt(model.root, i);

			if (layer != exclude && (ignoreCheckbox ||
				isLayerSelected(layer)))
			{
				layers.push(layer);
			}
		}

		return layers;
	};

	function setLayersLocked(layers, locked)
	{
		graph.setCellStyles('locked', (locked) ? '1' : '0', layers);

		if (locked)
		{
			for (var i = 0; i < layers.length; i++)
			{
				graph.removeSelectionCells(model.getDescendants(layers[i]));
			}
		}
	};

	mxEvent.addListener(menuLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			editorUi.editor.graph.popupMenuHandler.hideMenu();
			
			var selectedLayers = getSelectedLayers();
			var index = model.root.getIndex(selectionLayer);
			var enabled = selectedLayers.length > 0 && graph.isEnabled();
			var nothingIsSelected = mxResources.get('nothingIsSelected');
			var layer = graph.getLayerForCells(graph.getSelectionCells());
			var label = graph.convertValueToString(selectionLayer) || mxResources.get('background');

			var menu = new mxPopupMenu(mxUtils.bind(this, function(menu, parent)
			{
				// Adds submenu for multiple selected layers
				var layersSubmenu = menu.addItem(mxResources.get('layers'), null, null, parent);

				menu.addItem(mxResources.get('selectAll'), null, mxUtils.bind(this, function()
				{
					refresh();
					selectLayers(true);
				}), layersSubmenu);

				menu.addItem(mxResources.get('selectNone'), null, mxUtils.bind(this, function()
				{
					refresh();
					selectLayers(false);
				}), layersSubmenu, null, selectedLayers.length > 0).setAttribute('title',
					selectedLayers.length > 0 ? mxResources.get('selectNone') : nothingIsSelected);

				menu.addItem(mxResources.get('invertSelection'), null, mxUtils.bind(this, function()
				{
					refresh();
					selectLayers();
				}), layersSubmenu);

				menu.addSeparator(layersSubmenu);
				
				menu.addItem(mxResources.get('show'), null, mxUtils.bind(this, function()
				{
					graph.setCellsVisible(selectedLayers, true);
				}), layersSubmenu, null, enabled).setAttribute('title', selectedLayers.length > 0 ?
						mxResources.get('show') : nothingIsSelected);
				menu.addItem(mxResources.get('hide'), null, mxUtils.bind(this, function()
				{
					graph.setCellsVisible(selectedLayers, false);
				}), layersSubmenu, null, enabled).setAttribute('title', selectedLayers.length > 0 ?
						mxResources.get('hide') : nothingIsSelected);

				menu.addSeparator(layersSubmenu);

				menu.addItem(mxResources.get('lock'), null, mxUtils.bind(this, function()
				{
					setLayersLocked(getSelectedLayers(), true);
				}), layersSubmenu, null, enabled).setAttribute('title', selectedLayers.length > 0 ?
						mxResources.get('lock') : nothingIsSelected);

				menu.addItem(mxResources.get('unlock'), null, mxUtils.bind(this, function()
				{
					setLayersLocked(getSelectedLayers(), false);
				}), layersSubmenu, null, enabled).setAttribute('title', selectedLayers.length > 0 ?
						mxResources.get('unlock') : nothingIsSelected);
				
				// Adds submenu for single layer operations
				var layerSubmenu = menu.addItem(mxResources.get('currentLayer'), null, null, parent);
				
				menu.addItem(mxResources.get('duplicate'), null, mxUtils.bind(this, function()
				{
					selectLayers(false);
					var newCell = null;
					model.beginUpdate();
					try
					{
						newCell = graph.cloneCell(selectionLayer);
						graph.cellLabelChanged(newCell, mxResources.get('copyOf', [label]));
						newCell = graph.addCell(newCell, model.root, index + 1);
						newCell.setVisible(true);
					}
					finally
					{
						model.endUpdate();
					}

					if (newCell != null && !graph.isCellLocked(newCell))
					{
						graph.setDefaultParent(newCell);
						graph.selectAll(newCell);
					}
				}), layerSubmenu);

				menu.addItem(mxResources.get('addLayer'), null, mxUtils.bind(this, function(evt)
				{
					if (graph.isEnabled())
					{
						selectLayers(false);
						model.beginUpdate();
						var cell
						
						try
						{
							cell = graph.addCell(new mxCell(mxResources.get('untitledLayer')),
								model.root, index + ((mxEvent.isShiftDown(evt) ? 0 : 1)));
							graph.setDefaultParent(cell);
						}
						finally
						{
							model.endUpdate();
						}

						renameLayer(cell);
					}
					
					mxEvent.consume(evt);
				}), layerSubmenu);
				
				menu.addSeparator(layerSubmenu);

				menu.addItem(mxResources.get('rename'), null, mxUtils.bind(this, function()
				{
					renameLayer(selectionLayer);
				}), layerSubmenu);

				menu.addItem(mxResources.get('editData'), null, mxUtils.bind(this, function()
				{
					editorUi.showDataDialog(selectionLayer);
				}), layerSubmenu);

				if (layerCount > 1)
				{
					menu.addSeparator(layerSubmenu);

					menu.addItem(mxResources.get('toFront'), null, mxUtils.bind(this, function()
					{
						graph.addCell(selectionLayer, model.root, layerCount - 1);
					}), layerSubmenu, null, index >= 0 && index < layerCount - 1);

					menu.addItem(mxResources.get('toBack'), null, mxUtils.bind(this, function()
					{
						graph.addCell(selectionLayer, model.root, 0);
					}), layerSubmenu, null, index > 0);

					if (layerCount > 2)
					{
						menu.addItem(mxResources.get('bringForward'), null, mxUtils.bind(this, function()
						{
							graph.addCell(selectionLayer, model.root, index + 1);
						}), layerSubmenu, null, index >= 0 && index < layerCount - 1);

						menu.addItem(mxResources.get('sendBackward'), null, mxUtils.bind(this, function()
						{
							graph.addCell(selectionLayer, model.root, index - 1);
						}), layerSubmenu, null, index > 0);
					}
				}

				menu.addSeparator(layerSubmenu);

				menu.addItem(mxResources.get('selectObjectsInLayer'), null, mxUtils.bind(this, function()
				{
					graph.clearSelection();
					graph.selectAll(selectionLayer);
				}), layerSubmenu, null, selectionLayer.children != null &&
					selectionLayer.children.length > 0);

				// Adds submenu for moving selection cells
				var moveSubmenu = menu.addItem(mxResources.get('moveSelectionTo', ['']),
					null, null, parent, null, !graph.isSelectionEmpty());
				
				if (graph.isSelectionEmpty())
				{
					moveSubmenu.setAttribute('title', mxResources.get('nothingIsSelected'));
				}

				for (var i = layerCount - 1; i >= 0; i--)
				{
					(mxUtils.bind(this, function(child)
					{
						var locked = mxUtils.getValue(graph.getCurrentCellStyle(child), 'locked', '0') == '1';

						var item = menu.addItem(graph.convertValueToString(child) ||
							mxResources.get('background'), null, mxUtils.bind(this, function()
						{
							if (!locked)
							{
								graph.moveCells(graph.getSelectionCells(), 0, 0, false, child);
							}
						}), moveSubmenu, null, !locked);

						if (locked)
						{
							item.setAttribute('title', mxResources.get('locked'));
						}

						if (child == layer)
						{
							menu.addCheckmark(item, Editor.checkmarkImage);
						}
					}))(model.getChildAt(model.root, i));
				}
			}));
			
			menu.smartSeparators = true;
			menu.showDisabled = true;
			menu.autoExpand = true;
			
			// Disables autoexpand and destroys menu when hidden
			menu.hideMenu = mxUtils.bind(this, function()
			{
				mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
				menu.destroy();
			});
		
			var x = mxEvent.getClientX(evt);
			var y = mxEvent.getClientY(evt);
			menu.popup(x, y, null, evt);
			
			// Allows hiding by clicking on document
			editorUi.setCurrentMenu(menu);
			mxEvent.consume(evt);
		}
	});
	
	if (!graph.isEnabled())
	{
		menuLink.classList.add('mxDisabled');
	}
	
	var removeLink = link.cloneNode(false);
	removeLink.style.backgroundImage = 'url(' + Editor.trashImage + ')';
	removeLink.setAttribute('title', mxResources.get('delete'));
	ldiv.appendChild(removeLink);

	mxEvent.addListener(removeLink, 'click', function(evt)
	{
		if (graph.isEnabled())
		{
			model.beginUpdate();
			try
			{
				var index = model.root.getIndex(selectionLayer);
				var layers = getSelectedLayers();

				if (layers.length == 0)
				{
					layers.push(selectionLayer);
				}
				
				graph.removeCells(layers, false);
				
				// Creates default layer if no layer exists
				if (model.getChildCount(model.root) == 0)
				{
					model.add(model.root, new mxCell());
					graph.setDefaultParent(null);
				}
				else if (index > 0 && index <= model.getChildCount(model.root))
				{
					graph.setDefaultParent(model.getChildAt(model.root, index - 1));
				}
				else
				{
					graph.setDefaultParent(null);
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
		
		mxEvent.consume(evt);
	});
	
	if (!graph.isEnabled())
	{
		removeLink.classList.add('mxDisabled');
	}

	div.appendChild(ldiv);
	
	var dot = document.createElement('span');
	dot.setAttribute('title', mxResources.get('allSelectedObjectsInThisLayer'));
	dot.innerHTML = '&#8226;';
	dot.style.padding = '0 2px';
	dot.style.fontSize = '16pt';
	dot.style.order = '1';
	
	function updateLayerDot()
	{
		var div = layerDivs.get(graph.getLayerForCells(graph.getSelectionCells()));
		
		if (div != null)
		{
			div.appendChild(dot);
		}
		else if (dot.parentNode != null)
		{
			dot.parentNode.removeChild(dot);
		}
	};

	function refresh()
	{
		if (graph.isEnabled())
		{
			removeLink.classList.remove('mxDisabled');
			menuLink.classList.remove('mxDisabled');
			addLink.classList.remove('mxDisabled');
		}
		else
		{
			removeLink.classList.add('mxDisabled');
			menuLink.classList.add('mxDisabled');
			addLink.classList.add('mxDisabled');
		}

		layerCount = model.getChildCount(model.root)
		listDiv.innerText = '';
		var newLayerDivs = new mxDictionary();
		
		function addLayer(index, label, child, defaultParent, selected)
		{
			var ldiv = document.createElement('div');
			ldiv.className = 'geToolbarContainer';
			ldiv.style.overflow = 'hidden';
			ldiv.style.position = 'relative';
			ldiv.style.height = '30px';
			ldiv.style.display = 'flex';
			ldiv.style.padding = '0 8px';
			ldiv.style.alignItems = 'center';
			ldiv.style.justifyContent = 'flex-start';
			ldiv.style.borderWidth = '0px 0px 1px 0px';
			ldiv.style.borderStyle = 'solid';
			ldiv.style.whiteSpace = 'nowrap';
			ldiv.style.cursor = 'move';
			ldiv.setAttribute('draggable', 'true');
			ldiv.setAttribute('title', label  +
				' (' + child.getId() + ')');
			newLayerDivs.put(child, ldiv);

			var cb = document.createElement('input');
			cb.setAttribute('type', 'checkbox');
			cb.style.cursor = 'pointer';
			cb.style.order = '2';
			cb.checked = selected;
			cb.style.display = (graph.isEnabled()) ? '' : 'none';
			ldiv.appendChild(cb);
			
			var div = document.createElement('div');
			div.style.display = 'flex';
			div.style.alignItems = 'center';
			div.style.minWidth = '0';
			div.style.flexGrow = '1';

			mxEvent.addListener(cb, 'click', function(evt)
			{
				if (mxEvent.isShiftDown(evt))
				{
					selectLayers(cb.checked);
				}
			});

			var title = document.createElement('div');
			mxUtils.write(title, label);
			title.style.whiteSpace = 'nowrap';
			title.style.overflow = 'hidden';
			title.style.textOverflow = 'ellipsis';
			title.style.marginRight = '4px';
			title.style.padding = '4px';
			title.style.flexGrow = '1';

			mxEvent.addListener(ldiv, 'dragover', function(evt)
			{
				evt.dataTransfer.dropEffect = 'move';
				dropIndex = index;
				evt.stopPropagation();
				evt.preventDefault();
			});
			
			mxEvent.addListener(ldiv, 'dragstart', function(evt)
			{
				if (title.contentEditable != 'true')
				{
					dragSource = ldiv;
					
					// Workaround for no DnD on DIV in FF
					if (mxClient.IS_FF)
					{
						// LATER: Check what triggers a parse as XML on this in FF after drop
						evt.dataTransfer.setData('Text', '<layer/>');
					}
				}
			});
			
			mxEvent.addListener(ldiv, 'dragend', function(evt)
			{
				var layers = getSelectedLayers();

				if (dragSource != null && dropIndex != null &&
					model.getChildCount(model.root) > 1)
				{
					layers = (layers.length == 0) ? [child] : layers;

					// Moves all selected layers
					model.beginUpdate();
					try
					{
						for (var i = 0; i < layers.length; i++)
						{
							graph.addCell(layers[i], model.root, dropIndex);
						}
					}
					finally
					{
						model.endUpdate();
					}
				}

				dragSource = null;
				dropIndex = null;
				evt.stopPropagation();
				evt.preventDefault();
			});

			var visible = model.isVisible(child);
			var inp = document.createElement('img');
			inp.className = 'geAdaptiveAsset';
			inp.style.width = '16px';
			inp.style.padding = '0px 6px 0 0';
			inp.style.cursor = 'pointer';
			inp.setAttribute('title', mxResources.get(
				visible ? 'hide' : 'show'));

			if (visible)
			{
				inp.setAttribute('src', Editor.visibleImage);
				mxUtils.setOpacity(div, 90);
			}
			else
			{
				inp.setAttribute('src', Editor.hiddenImage);
				mxUtils.setOpacity(div, 40);
			}

			if (!graph.isEnabled())
			{
				mxUtils.setOpacity(inp, 50);
			}

			div.appendChild(inp);

			mxEvent.addListener(inp, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					if (mxEvent.isShiftDown(evt))
					{
						var others = getSelectedLayers(child, true);
						graph.setCellsVisible(others, !isLayersVisible(others));
					}
					else
					{
						graph.setCellsVisible([child], !visible);
					}
				}

				mxEvent.consume(evt);
			});

			var btn = inp.cloneNode(false);
			var style = graph.getCurrentCellStyle(child);
			btn.setAttribute('title', mxResources.get('lockUnlock'));
			var locked = mxUtils.getValue(style, 'locked', '0') == '1';

			if (locked)
			{
				btn.setAttribute('src', Editor.lockedImage);
				mxUtils.setOpacity(btn, 90);
				ldiv.style.color = 'red';
			}
			else
			{
				btn.setAttribute('src', Editor.unlockedImage);
				mxUtils.setOpacity(btn, 40);
			}
			
			if (graph.isEnabled())
			{
				btn.style.cursor = 'pointer';
			}

			function toggleLock(allLayers)
			{
				var value = null;
				
				model.beginUpdate();
				try
				{
					value = (locked) ? null : '1';

					if (allLayers)
					{
						var parent = model.getParent(child);

						for (var i = 0; i < model.getChildCount(parent); i++)
						{
							graph.setCellStyles('locked', value,
								[model.getChildAt(parent, i)]);
						}
					}
					else
					{
						graph.setCellStyles('locked', value, [child]);
					}
				}
				finally
				{
					model.endUpdate();
				}

				if (value == '1')
				{
					graph.removeSelectionCells(model.getDescendants(child));
				}
			};
			
			mxEvent.addListener(btn, 'click', function(evt)
			{
				if (graph.isEnabled())
				{
					setLayersLocked(mxEvent.isShiftDown(evt) ?
						getSelectedLayers(null, true) : [child],
						!locked);
					mxEvent.consume(evt);
				}
			});

			div.appendChild(btn);
			div.appendChild(title);
			ldiv.appendChild(div);
			
			mxEvent.addListener(ldiv, 'dblclick', function(evt)
			{
				var nodeName = mxEvent.getSource(evt).nodeName;
				
				if (nodeName != 'INPUT' && nodeName != 'IMG' &&
					title.contentEditable != 'true')
				{
					renameLayer(child);
					mxEvent.consume(evt);
				}
			});

			if (graph.getDefaultParent() == child)
			{
				ldiv.classList.add('geActivePage');
				ldiv.style.fontWeight = (graph.isEnabled()) ? 'bold' : '';
				selectionLayer = child;
			}

			mxEvent.addListener(ldiv, 'click', function(evt)
			{
				if (graph.isEnabled() && title.contentEditable != 'true' &&
					mxEvent.getSource(evt) != cb)
				{
					graph.setDefaultParent(defaultParent);
					graph.view.setCurrentRoot(null);

					if (mxEvent.isShiftDown(evt))
					{
						graph.clearSelection();
						graph.selectAll(selectionLayer);
					}

					mxEvent.consume(evt);
				}
			});
			
			listDiv.appendChild(ldiv);
		};
		
		for (var i = layerCount - 1; i >= 0; i--)
		{
			(mxUtils.bind(this, function(child)
			{
				addLayer(i, graph.convertValueToString(child) ||
					mxResources.get('background'), child, child,
					isLayerSelected(child));
			}))(model.getChildAt(model.root, i));
		}

		layerDivs = newLayerDivs;
		updateLayerDot();
	};

	refresh();
	model.addListener(mxEvent.CHANGE, refresh);
	graph.addListener('defaultParentChanged', refresh);
	editorUi.addListener('lockedChanged', refresh);

	graph.selectionModel.addListener(mxEvent.CHANGE, function()
	{
		updateLayerDot();
	});

	this.window = new mxWindow(mxResources.get('layers'), div, x, y, w, h, true, true);
	this.window.minimumSize = new mxRectangle(0, 0, 170, 120);
	this.window.destroyOnClose = false;
	this.window.setMaximizable(false);
	this.window.setResizable(true);
	this.window.setClosable(true);
	this.window.setVisible(true);
	
	this.init = function()
	{
		listDiv.scrollTop = listDiv.scrollHeight - listDiv.clientHeight;	
	};

	this.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
	{
		this.window.fit();
	}));
	
	// Make refresh available via instance
	this.refreshLayers = refresh;
	editorUi.installResizeHandler(this, true);
};
