(function()
{
	// Adds Android shapes
	Sidebar.prototype.addAndroidPalette = function()
	{
		var sizeX = 211; //reference size for iPhone and all other iOS shapes
		
		var sizeY = 2 * sizeX; //change only sizeX, to avoid changing aspect ratio

		var sb = this;
		var s = 'strokeWidth=1;html=1;shadow=0;dashed=0;shape=mxgraph.android.';
		var sm = 'strokeWidth=2;shadow=0;dashed=0;html=1;shape=mxgraph.android.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.android.';
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;strokeColor=none;shape=';
		var s4 = 'rounded=1;html=1;shadow=0;dashed=0;whiteSpace=wrap;fontSize=10;fillColor=#';
		var s5 = 'whiteSpace=wrap;html=1;shadow=0;dashed=0;fontSize=10;align=left;fillColor=#';
		var s6 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=2;shape=mxgraph.android.';
		
		//default tags
		var dt = 'android ';

		var fns =
		[
			this.createVertexTemplateEntry(s2 + 'phone2;fillColor=#ffffff;strokeColor=#c0c0c0;', 
					200, 390, '', 'Phone', null, null, dt + 'phone mobile portrait'),
			this.createVertexTemplateEntry(s2 + 'phone2;fillColor=#ffffff;strokeColor=#c0c0c0;direction=south;', 
					390, 200, '', 'Phone (landscape)', null, null, dt + 'phone mobile landscape'),
			this.createVertexTemplateEntry(s2 + 'tab2;fillColor=#ffffff;strokeColor=#c0c0c0;', 
					472, 686, '', 'Tab', null, null, dt + 'tab tablet portrait'),
			this.createVertexTemplateEntry(s2 + 'tab2;fillColor=#ffffff;strokeColor=#c0c0c0;direction=north;', 
					686, 472, '', 'Tab (landscape)', null, null, dt + 'tab tablet landscape'),
			this.createVertexTemplateEntry(s + 'action_bar;fillColor=#1A1A1A;strokeColor=#c0c0c0;strokeWidth=2;fontColor=#FFFFFF;', 
					185, 30, '', 'Action Bar', null, null, dt + 'action bar dark portrait'),
			this.createVertexTemplateEntry(s + 'action_bar;fillColor=#E6E6E6;strokeColor=#c0c0c0;strokeWidth=2;', 
					185, 30, '', 'Action Bar (Bright)', null, null, dt + 'action bar bright portrait'),
			this.createVertexTemplateEntry(s + 'action_bar_landscape;fillColor=#1A1A1A;strokeColor=#c0c0c0;strokeWidth=2;fontColor=#FFFFFF;', 
					320, 30, '', 'Action Bar Landscape', null, null, dt + 'action bar landscape dark'),
			this.createVertexTemplateEntry(s + 'action_bar_landscape;fillColor=#E6E6E6;strokeColor=#c0c0c0;strokeWidth=2;', 
					320, 30, '', 'Action Bar Landscape (Bright)', null, null, dt + 'action bar bright landscape'),
			this.createVertexTemplateEntry(s4 + '666666;align=center;strokeColor=#4D4D4D;fontColor=#ffffff;', 
					sizeX * 0.5, sizeY * 0.04, 'Normal', 'Button (Normal)', null, null, dt + 'button normal'),
			this.createVertexTemplateEntry(s4 + '666666;align=center;strokeColor=#999999;fontColor=#ffffff;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused', 'Button (Focused)', null, null, dt + 'button focused'),
			this.createVertexTemplateEntry(s4 + '999999;align=center;strokeColor=#666666;fontColor=#ffffff;strokeWidth=2;', 
					sizeX * 0.5, sizeY * 0.04, 'Pressed', 'Button (Pressed)', null, null, dt + 'button pressed'),
			this.createVertexTemplateEntry(s4 + '333333;align=center;strokeColor=#4D4D4D;fontColor=#666666;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused disabled', 'Button (Focused, Disabled)', null, null, dt + 'button focused disabled'),
			this.createVertexTemplateEntry(s4 + '333333;align=center;strokeColor=#333333;fontColor=#666666;', 
					sizeX * 0.5, sizeY * 0.04, 'Disabled', 'Button (Disabled)', null, null, dt + 'button disabled'),
			this.createVertexTemplateEntry(s4 + 'E6E6E6;align=center;strokeColor=#E6E6E6;fontColor=#333333;', 
					sizeX * 0.5, sizeY * 0.04, 'Normal', 'Button (Normal, Bright)', null, null, dt + 'button normal bright'),
			this.createVertexTemplateEntry(s4 + 'E6E6E6;align=center;strokeColor=#B3B3B3;fontColor=#333333;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused', 'Button (Focused, Bright)', null, null, dt + 'button focused bright'),
			this.createVertexTemplateEntry(s4 + 'B3B3B3;align=center;strokeColor=#E6E6E6;fontColor=#333333;strokeWidth=2;', 
					sizeX * 0.5, sizeY * 0.04, 'Pressed', 'Button (Pressed, Bright)', null, null, dt + 'button pressed bright'),
			this.createVertexTemplateEntry(s4 + 'F4F4F4;align=center;strokeColor=#E6E6E6;fontColor=#CCCCCC;', 
					sizeX * 0.5, sizeY * 0.04, 'Focused disabled', 'Button (Focused, Disabled, Bright)', null, null, dt + 'button focused disabled bright'),
			this.createVertexTemplateEntry(s4 + 'F4F4F4;align=center;strokeColor=#F4F4F4;fontColor=#CCCCCC;', 
					sizeX * 0.5, sizeY * 0.04, 'Disabled', 'Button (Disabled, Bright)', null, null, dt + 'button disabled bright'),
			this.addDataEntry(dt + 'checkboxes checkbox', 165, 50, 'Checkboxes',
				'5ZjPb4IwFMf/Go4zlArqdbh52U4edq7wpMRCSekm+NevtZ1uE43R2ZB5MPT9Ko+v7xNSPBwXzUyQir7yFJiHnzwcC86lWRVNDIx5gZ+nHp56QeCrnxc8H4mibdSviIBSnlMQmIIPwt7BeIyjli2zjloKvoK3PJVUOZCHH6ksmF3WlKR8rQxfGSmpKaTWUJFK71A0mX66ASlTwfNUXRPKhUqwdwYhoTna/dZlW58BL0CKVqWsbTc6IwpNGYU8o7YsNE/tk9rY2a50r4VaWDm6pcEH0sxByrzMlBM5U4mwPCtVAoOl1PkVSVQLL1trivQWS17Keb7Ru4ytGXOmi1VfGONFCOG5cgeXyY2CQXi94MOezyLuFqc10eh6AULnAggBiR4rYQdI5wqo8w1ZsC/b3PLikRp2q2YLdoNjVXzYOb7NXBfg16sdneDb3eT1gu/2N8ZugB/1HPjo1sCP/yPwo74CPzkBPL5L4AOnuCO/57xPbs07Qs4VSCgkqwVvbsu8+Wv7CD06POHsqR/eJfV45PY1jw5PUv3iHp3W6y/Ad3+2cfCmR0dORM6pV+b+k8k29uOLyic='),
			this.addDataEntry(dt + 'radiobuttons radiobutton', 165, 50, 'Radiobuttons',
				'5ZhNb4IwGMc/DccZ2grqVdy8bNlhh52rVNqsUFK6CX76Fdqgm7CQqaSJB0Kft9LnT38hxUNRWq4lzumLiAn30KOHIimEMqO0jAjnHvRZ7KGVB6GvLw8+9URBE/VzLEmmhhRAU/CF+ScxHuMoVMWto1BSfJB3FiuqHcBDS6pSbocFxbHYa8PXRowLSmJr6Ehez5CWSd3dBGexFCzW9y0VUifYJxOpSNm7+sZll74mIiVKVjplb1dTZ4SBKaOEJdSWBaZrHxfGTtrSoxZ6YOXolgadSfOaKyYy7QOjiYQ5SzKdwMlO1fk53rIseW6sFain2IlMvbFDPcvcmpHgdbFeF0JoE5BgqNrwf2oDOAku13vq+FZE3eJUJhpeLkAwQADbiS5keaFHS0kKdsCbJqHptZGoawecSDWo32l3v7agfeW2/4fWcbJbusi8XKewH8zxtowTYFa/+RuH1JnjpIa3JnXuFqkzV0ld9JOK7pJUOCqnwHcc1MWtQQXgtqTuGOfXINi8KRcRBucnhJbh6V0yjGbjfm3B+UHELYrB33pdA+MhZ4MRP7ig5ywwOq7aPP4raGI/fiV8Aw=='),

			this.createVertexTemplateEntry(s2 + 'contact_badge_focused;', 40, 40, '', 'Contact Badge Focused', null, null, dt + 'contact badge focused'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_focused;', 60, 60, '', 'Contact Badge Focused', null, null, dt + 'contact badge focused'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_normal;', 40, 40, '', 'Contact Badge Normal', null, null, dt + 'contact badge normal'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_normal;', 60, 60, '', 'Contact Badge Normal', null, null, dt + 'contact badge normal'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_pressed;', 40, 40, '', 'Contact Badge Pressed', null, null, dt + 'contact badge pressed'),
			this.createVertexTemplateEntry(s2 + 'contact_badge_pressed;', 60, 60, '', 'Contact Badge Pressed', null, null, dt + 'contact badge pressed'),

			this.addEntry(dt + 'contextual action bar dark portrait', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'contextual_action_bar;fillColor=#002E3E;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar');
			}),
					
			this.addEntry(dt + 'contextual action bar bright portrait', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 30), s + 'contextual_action_bar_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar (Bright)');
			}),

			this.addEntry(dt + 'contextual action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 30), s + 'contextual_action_bar_landscape;fillColor=#002E3E;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar Landscape');
			}),

			this.addEntry(dt + 'contextual action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 30), s + 'contextual_action_bar_landscape_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Action', new mxGeometry(40, 0, 100, 30), s + 'anchor;align=left;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Action Bar Landscape (Bright)');
			}),

			this.addEntry(dt + 'contextual split action bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'contextual_split_action_bar;fillColor=#002E3E;fontColor=#FFFFFF;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar');
			}),

			this.addEntry(dt + 'contextual split action bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'contextual_split_action_bar_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar (Bright)');
			}),

			this.addEntry(dt + 'contextual split action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'contextual_split_action_bar_landscape;fillColor=#002E3E;fontColor=#FFFFFF;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar Landscape');
			}),

			this.addEntry(dt + 'contextual split action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'contextual_split_action_bar_landscape_white;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Contextual', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Contextual Split Action Bar Landscape (Bright)');
			}),

			this.createVertexTemplateEntry(s2 + 'indeterminate_progress_bar;strokeColor=#33B5E5;', 
					149, 5, '', 'Indeterminate Progress Bar', null, null, dt + 'indeterminate progress bar'),
			this.createVertexTemplateEntry(s2 + 'indeterminateSpinner;', 
					50, 50, '', 'Indeterminate Spinner', null, null, dt + 'indeterminate spinner'),
			this.createVertexTemplateEntry(s2 + 'keyboard;', 
					185, 100, '', 'Keyboard', null, null, dt + 'keyboard'),
			this.addDataEntry(dt + 'menu bar', 185, 50, 'Menu bar',
				'7VZdT8MgFP01vC4trLrndbqYuCcffCbjrhApNJS5zl/vLaCbH3NO4xaTkTTlnMu9cM8JCYSVdTd1vJEzK0ATdkVY6az1cVZ3JWhNaKYEYRNCaYYfodc7onmIZg13YPx3EmhMeOR6CZGJROvXOhGtd/YB7pXwEomcsLH0tU7TVnJhVwgyBIK3EkQCGGn6CnVX9d0NuBHOKjFwDuZ4tLG7U0/wsjZsUVptXdiTjcLAyEJpvcUPw0A+HRuch25n64FKfU/B1uDdGpesUiv9ilER0ySoSqa0IkqW8Tbi6jV1IyROkpaf68o+6DoDs0TmxkONv/wUMm+LaayBL5XnWlUGOQ2Lvk7b8Lky1W1AkzyUs8an6qMEtwotwviuVfRnVuV0UPzerOEes05yJ/6fWev3nhzHvWKPe+zs3gHu0aN6d7HHu+HZuwO8Y5d/evMQbh4mIfbm3fIM'),
			this.addDataEntry(dt + 'menu bar', 185, 50, 'Menu bar',
				'7VZdb8IgFP01vJoW1s1n62aWzKc97JnItZBRaCjOul+/W8DpPoy6ZZolkjTlnPvR3nNCAmFl3U0cb+TUCtCE3RJWOmt93NVdCVoTmilB2JhQmuFD6N2OaB6iWcMdGH9IAY0FL1wvIDKRaP1KJ6L1zj7DkxJeIpETNpK+1mnbSi7sEkGGQPBWgkgAI03foe6qfroBN8JZJQbOwQx/beQe1Susc8MnSqutC99kEBZG5krrLX4eFvLYUyiccR0z1vTpaRpwHrqdigQqyTEBW4N3K0xZpgn7jGERyySoSqayIiqZ8Tbi6r10oy9uksTfy82+yD0Fs0Dm3kONr/wc6m9rnHTcbQjXqjLIaZj3fdqGz5SpHgIa56GdNT51Hya41SiuQ62iP7Mqp4Pi92Zd7THrLEfl/5m1+uzJadwr9rjHLu4d4R49qXfXe7y7unh3hHfs5k9PHsLNfSXEPlxn3gA='),

			this.createVertexTemplateEntry(s6 + 'navigation_bar_1;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar portrait horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_1_landscape;fillColor=#1A1A1A;strokeColor=#999999;', 
					320, 30, '', 'Navigation Bar Landscape', null, null, dt + 'navigation bar landscape horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_1_vertical;fillColor=#1A1A1A;strokeColor=#999999;', 
					30, 320, '', 'Navigation Bar Vertical', null, null, dt + 'navigation bar vertical'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_2;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_3;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar portrait horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_3_landscape;fillColor=#1A1A1A;strokeColor=#999999;', 
					320, 30, '', 'Navigation Bar Landscape', null, null, dt + 'navigation bar landscape horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_4;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_5;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_5_vertical;fillColor=#1A1A1A;strokeColor=#999999;', 
					30, 320, '', 'Navigation Bar Vertical', null, null, dt + 'navigation bar vertical'),
			this.createVertexTemplateEntry(s6 + 'navigation_bar_6;fillColor=#1A1A1A;strokeColor=#999999;', 
					185, 30, '', 'Navigation Bar', null, null, dt + 'navigation bar horizontal'),
			this.createVertexTemplateEntry(s2 + 'progressBar;strokeColor=#33b5e5;dx1=0.8;dx2=0.6;strokeWidth=2;', 
					185, 5, '', 'Progress Bar', null, null, dt + 'progress bar'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberDisabled;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Disabled', null, null, dt + 'progress scrubber disabled'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberFocused;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Focused', null, null, dt + 'progress scrubber focused'),
			this.createVertexTemplateEntry(s2 + 'progressScrubberPressed;dx=0.3;fillColor=#33b5e5;', 
					185, 16, '', 'Progress Scrubber Pressed', null, null, dt + 'progress scrubber pressed'),
			this.createVertexTemplateEntry(s2 + 'quickscroll2;dy=0.5;fillColor=#33b5e5;strokeColor=#66D5F5;', 
					58, 320, '', 'Quickscroll', null, null, dt + 'quickscroll quick scroll'),

			this.createVertexTemplateEntry(s2 + 'quickscroll3;dy=0.5;fillColor=#33b5e5;strokeColor=#66D5F5;', 
					6, 320, '', 'Quickscroll', null, null, dt + 'quickscroll quick scroll'),
					
			this.addEntry(dt + 'quick contact', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 150, 165), s + 'quick_contact;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Name', new mxGeometry(0, 65, 150, 18), s + 'anchor;rSize=0;fontStyle=1;fontColor=#FFFFFF;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Item 1', new mxGeometry(0, 108, 120, 28), s + 'anchor;rSize=0;align=left;spacingLeft=10;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('Item 2', new mxGeometry(0, 136, 120, 28), s + 'anchor;rSize=0;align=left;spacingLeft=10;');
			   	text3.vertex = true;
			   	bg.insert(text3);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Quick Contact');
			}),

			this.addEntry(dt + 'scrollable tab scroll', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 15), s + 'rrect;rSize=0;fillColor=#444444;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('One', new mxGeometry(0, 0, 46.25, 15), s + 'anchor;align=left;fontColor=#FFFFFF;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Tab Two', new mxGeometry(46.25, 0, 92.5, 15), s + 'anchor;fontColor=#FFFFFF;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('Tab', new mxGeometry(138.75, 0, 46.25, 15), s + 'anchor;align=right;fontColor=#FFFFFF;');
			   	text3.vertex = true;
			   	bg.insert(text3);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Scrollable Tab');
			}),

		   	this.createVertexTemplateEntry(s + 'scrollbars2;fillColor=#999999;strokeColor=none;', 
		   			56, 56, '', 'Scrollbars', null, null, dt + 'scrollbar scroll bar'),
			this.createVertexTemplateEntry(s5 + '1A1A1A;strokeColor=#1A1A1A;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Normal', 'Section Header (Normal)', null, null, dt + 'section header normal dark'),
			this.createVertexTemplateEntry(s5 + '4D4D4D;strokeColor=#4D4D4D;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Pressed', 'Section Header (Pressed)', null, null, dt + 'section header pressed dark'),
			this.createVertexTemplateEntry(s5 + '33b5e5;strokeColor=#33B5E5;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Activated', 'Section Header (Activated)', null, null, dt + 'section header activated dark'),
			this.createVertexTemplateEntry(s5 + '006699;strokeColor=#33B5E5;fontColor=#FFFFFF;', 
					sizeX * 0.8, sizeY * 0.04, 'Focused', 'Section Header (Focused)', null, null, dt + 'section header focused dark'),
			this.createVertexTemplateEntry(s5 + '006699;strokeColor=#33B5E5;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled focused', 'Section Header (Disabled focused)', null, null, dt + 'section header disabled focused dark'),
			this.createVertexTemplateEntry(s5 + '1A1A1A;strokeColor=#1A1A1A;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled', 'Section Header (Disabled)', null, null, dt + 'section header disabled dark'),
			this.createVertexTemplateEntry(s5 + 'FFFFFF;strokeColor=#FFFFFF;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Normal', 'Section Header (Normal, Bright)', null, null, dt + 'section header normal bright'),
			this.createVertexTemplateEntry(s5 + 'f6f6f6;strokeColor=#f6f6f6;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Pressed', 'Section Header (Pressed, Bright)', null, null, dt + 'section header pressed bright'),
			this.createVertexTemplateEntry(s5 + '33b5e5;strokeColor=#33B5E5;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Activated', 'Section Header (Activated, Bright)', null, null, dt + 'section header activated bright'),
			this.createVertexTemplateEntry(s5 + '99e5ff;strokeColor=#33B5E5;fontColor=#4D4D4D;', 
					sizeX * 0.8, sizeY * 0.04, 'Focused', 'Section Header (Focused, Bright)', null, null, dt + 'section header focused bright'),
			this.createVertexTemplateEntry(s5 + '99e5ff;strokeColor=#33B5E5;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled focused', 'Section Header (Disabled focused, Bright)', null, null, dt + 'section header disabled focused bright'),
			this.createVertexTemplateEntry(s5 + 'FFFFFF;strokeColor=#FFFFFF;fontColor=#B3B3B3;', 
					sizeX * 0.8, sizeY * 0.04, 'Disabled', 'Section Header (Disabled, Bright)', null, null, dt + 'section header disabled bright'),
			this.createVertexTemplateEntry(s + 'spinner2;align=center;fillColor=#999999;strokeColor=#999999;verticalAlign=bottom', 
					110, 10, 'Item', 'Spinner Normal', null, null, dt + 'spinner normal'),
			this.createVertexTemplateEntry(s + 'spinner2;align=center;fillColor=#33b5e5;strokeColor=#33b5e5;verticalAlign=bottom', 
					110, 10, 'Item', 'Spinner Focused', null, null, dt + 'spinner focused'),
					
			this.addEntry(dt + 'spinner disabled focused', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#207585;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=1;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#999999;fillColor=#999999;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Disabled Focused');
			}),
					
			this.addEntry(dt + 'spinner disabled focused light bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#ccf2ff;strokeColor=#88c5f5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#666666;align=center;verticalAlign=middle;strokeColor=#cccccc;fillColor=#cccccc;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Disabled Focused Bright');
			}),

			this.addEntry(dt + 'spinner pressed', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#33b5e5;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#aaeeff;fillColor=#aaeeff;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Pressed');
			}),

			this.addEntry(dt + 'spinner pressed light bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 117, 28), s + 'rect;rounded=1;fillColor=#33b5e5;strokeColor=#33b5e5;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Item', new mxGeometry(3, 4, 110, 20), s + 'spinner2;fontStyle=0;fontColor=#ffffff;align=center;verticalAlign=middle;strokeColor=#666666;fillColor=#666666;');
			   	text1.vertex = true;
			   	bg.insert(text1);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Spinner Pressed Bright');
			}),
			
			this.addEntry(dt + 'split action bar dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'split_action_bar;fillColor=#1A1A1A;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar');
			}),

			this.addEntry(dt + 'split action bar bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 185, 70), s + 'split_action_bar;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 185, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 185, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar (Bright)');
			}),

			this.addEntry(dt + 'split action bar landscape dark', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'split_action_bar_landscape;fillColor=#1A1A1A;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;fontColor=#ffffff;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar Landscape');
			}),

			this.addEntry(dt + 'split action bar landscape bright', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 320, 70), s + 'split_action_bar_landscape;fillColor=#E6E6E6;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Split', new mxGeometry(0, 0, 320, 30), s + 'anchor;fontStyle=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Action', new mxGeometry(0, 40, 320, 30), s + 'anchor;fontStyle=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

	   			return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Split Action Bar Landscape (Bright)');
			}),

			this.createVertexTemplateEntry(s + 'statusBar;align=center;fillColor=#000000;strokeColor=#ffffff;fontColor=#ffffff;fontSize=10;', 
					sizeX * 0.87, sizeY * 0.0375, '', 'Status bar (portrait)', null, null, dt + 'status bar portrait'),
			this.createVertexTemplateEntry(s + 'statusBar;align=center;fillColor=#000000;strokeColor=#ffffff;fontColor=#ffffff;fontSize=10;', 
					sizeX * 1.517, sizeY * 0.0375, '', 'Status bar (landscape)', null, null, dt + 'status bar landscape'),
			this.createVertexTemplateEntry(s2 + 'switch_off;fillColor=#666666;', 
					80, 20, '', 'Switch Off', null, null, dt + 'switch off'),
			this.createVertexTemplateEntry(s2 + 'switch_off;fillColor=#E6E6E6;', 
					80, 20, '', 'Switch Off', null, null, dt + 'switch off'),
			this.createVertexTemplateEntry(s2 + 'switch_on;fillColor=#666666;', 
					80, 20, '', 'Switch On', null, null, dt + 'switch on'),
			this.createVertexTemplateEntry(s2 + 'switch_on;fillColor=#E6E6E6;', 
					80, 20, '', 'Switch On', null, null, dt + 'switch on'),
			this.addDataEntry(dt + 'tab tabulator bar dark', 185, 30, 'Tab Bar Dark',
				'3ZZfb8IgEMA/Da8NhdY/r+02n/bkkj1jQSGjxVCc7T79KMVpp81qnG6RhIS744D7cVwAOM2rmSZr/qwokwA/ApxqpUw7yquUSQkQFBTgB4AQtB2gpx5r6KxwTTQrzBAH1Dq8E7lhraZVlKaWXlEard7Yq6CGW0UIcMJNLv2w5ISqrRWgFSgpOaNesJZ1s0JerZroAlJQrQQNtGaZPVqi5+KD+blLIWWqpNJuRxy51qzhtt5ZClVYh8SfmGnDqt6oncqHPGMqZ0bXdsrWR9HMmMStG2dixb0bbmlBUrby6st1z9AOPMbTSPER0heysIrw2mRJkfEGVLJUhZn7bUIvH+BdujaUJPqRZDQK0JVYRj0s/yZLv2PtZi2E02mW9WXtNe6gOuJ/m1uJ/2PRwHgRs/iiohGdxlz7SxgPZnw54lFP4uO7KiLeYYqCm+bvuAdudI9wQzwJxjfFOxlQHjwgKdzr7D7ZQwBUNC9fqMLqS7VpTv87UMJdytWdmnb4QYDHeND5eKy4/845W+e39wk='),
			this.addDataEntry(dt + 'tab tabulator bar dark', 185, 30, 'Tab Bar Dark',
				'3ZZRb4MgEIB/Da9GQdvuVbf1aU9dsmdaaCFDaZCuul8/1OtqV81cOrulJCbcHQfcx3k5RJK0mBu6FU+acYXIAyKJ0do2s7RIuFII+5Ihco8w9t2H8GOPNait/pYantkhDrhxeKNqxxtNo8htqUCRW6Nf+YtkVjhFgEgsbKpgmgvK9N4JvhMYzQVnIDjLttohLTZVdB7NmNGSecbwlbtabBbyncPatVQq0Uqb+kQS1qPaoz76YMl05hxiuDE3lhe9UdcqCHnOdcqtKd2SPURRrZhFjZvgciPAjTS0fJo38ubT9cjQTQBjN1JyhvSZLp0iGJsszVaiAhWvdWYXcEwAcgvvuh5DSeJvSYYTD4/EMuxh+TdZ+hVrK2shNzsTdgz8xRn66zxI9B/rBSHLiEcX1YuwG3MJjzAdzPhyxJOenCc3VT/A4Q57V83faQ/c8BbhBmTmTa+KdzagPAAgJTsqZhsAk9WfL3Xm9LneVbf/HSjBIeXKk5rW7g38czz453iceOzkattJo/cB'),
			this.addDataEntry(dt + 'tab tabulator bar bright', 185, 30, 'Tab Bar Bright',
				'3ZZfb4MgEMA/Da9GQdvutW7r0566ZM+0YCFDaJCuuk8/QLr+cWYuXbulJCbcHSfc784TgPKynmm8Zk+KUAHQA0C5Vsq0s7LOqRAAxpwAdA8gjO0D4GOPNfHWeI01lWaIA2wd3rDY0FbTKirTiKCojFav9IUTw6wiAWjKTCnCtGKYqK0VYisQXDFKgmAta/eGsl656CIsiVacRFrTpT3aVM/5Ow1rCy5EroTSfkdE/XDv8FvvLFJJpwwnptrQujdqrwohz6gqqdGNXbINUbgVk6x1Y5SvWHBDLa0YV628+nTdM7STgPFrpKiD9BkvrCK5NFksl8yBmhZKmnnYJgnyAd6RH0NJwm9JpqMIXohl2sPyb6r0FOtx1abpMiuyvqo9yUHhx5k5qDv8r5OV7D82DYQWGe3FPwhz+jXmJiRhPJjx+YhHPYWPbqqJBIc7GF21fsc9cNNbhJugSTS+Kt7JgPYQAAkuu//5QwCEuy+fK2n1ldq40/8OlGRXcs1RTzu8IMRdPPDneKy4v85529Ft7wM='),
			this.addDataEntry(dt + 'tab tabulator bar bright', 185, 30, 'Tab Bar Bright',
				'3Zbfb8IgEMf/Gl6bFlp1r3abT3tyyZ5RUMhoMRRnu79+0J6zzjbr4nSLJE2473H8+HC9gEialTNDN+JJM64QeUAkNVrbppeVKVcK4VAyRO4RxqH7EH7s8Ua1N9xQw3M7JAA3AW9UbXmjNEJhKwVCYY1+5S+SWeGECJGpsJmCbiEo0ztnhM5gtBCcgeE8Gz9DVq796QKaM6MlC4zhS7e1qZnLdw5jV1KpVCtt6hUJr5ufo15678l17kXYMTeWl72nriU48ozrjFtTuSE7OIUfMUmaMMHlWkAYaWiFtGjs9WfogaHrAMZupOQE6TNdOCG6NFmaL4UHNV3p3M5hmQjsFt5R3YaSxN+SjEcBvhDLuIfl32TpV6ytrIXc7EzYS+AvT9Bf50KS/1gvCFkkPDmrXsTdmCu4hPFgxucjHvXkPLmp+gEBdzi4av6Oe+DGtwg3IpNgfFW8kwHlAQAp2VEx2wCY9H++1LnTC731u/8dKNE+5aqjmtZ+G4SnePDP8Tjz8JKrfUcPvQ8='),

		   	this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#4D4D4D;', 
		   			174, 30, '', 'Textfield Disabled', null, null, dt + 'textfield disabled'),
			this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#999999;', 
					174, 30, '', 'Textfield Normal', null, null, dt + 'textfield normal'),
			this.createVertexTemplateEntry(s + 'textfield;align=center;strokeColor=#33b5e5;', 
					174, 30, '', 'Textfield Activated', null, null, dt + 'textfield activated'),
			this.createVertexTemplateEntry(s2 + 'text_insertion_point;', 
					20, 30, '', 'Text Insertion Point', null, null, dt + 'textfield insertion point'),
			this.createVertexTemplateEntry(s2 + 'textSelHandles;fillColor=#33b5e5;strokeColor=#0099cc;', 
					sizeX * 0.8, sizeY * 0.1, '', 'Text Selection Handles', null, null, dt + 'text selection handle'),
			this.createVertexTemplateEntry(s2 + 'time_picker;', 
					150, 230, '', 'Time Picker (Bright)', null, null, dt + 'time picker bright'),
			this.createVertexTemplateEntry(s2 + 'time_picker_dark;', 
					150, 230, '', 'Time Picker (Dark)', null, null, dt + 'time picker dark'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#33b5e5;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#0099cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#aa66cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#9933cc;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#99cc00;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#669900;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ffbb33;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ff8800;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#ff4444;', 
					50, 50, '', 'Color', null, null, dt + 'color'),
			this.createVertexTemplateEntry(s3 + 'rect;fillColor=#cc0000;', 
					50, 50, '', 'Color', null, null, dt + 'color')
		];

		this.addPalette('android', mxResources.get('android'), false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
