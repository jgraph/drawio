/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addGMDLPalette = function()
	{
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlBottom Navigation');
		this.addGMDLBottomNavigationPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlBottom Sheets');
		this.addGMDLBottomSheetsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlButtons');
		this.addGMDLButtonsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlCards');
		this.addGMDLCardsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlChips');
		this.addGMDLChipsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlDialogs');
		this.addGMDLDialogsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlDividers');
		this.addGMDLDividersPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlGrid Lists');
		this.addGMDLGridListsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlIcons');
		this.addGMDLIconsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlLists');
		this.addGMDLListsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlMenus');
		this.addGMDLMenusPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlMisc');
		this.addGMDLMiscPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlPickers');
		this.addGMDLPickersPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlSelection Controls');
		this.addGMDLSelectionControlsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlSliders');
		this.addGMDLSlidersPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlSteppers');
		this.addGMDLSteppersPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlTabs');
		this.addGMDLTabsPalette();
		this.setCurrentSearchEntryLibrary('gmdl', 'gmdlText Fields');
		this.addGMDLTextFieldsPalette();
		this.setCurrentSearchEntryLibrary();
	}
	
	//Adds Google Media Design shapes
	Sidebar.prototype.addGMDLBottomNavigationPalette = function(expand)
	{
		var s = "dashed=0;align=center;fontSize=12;shape=";
		var s2 = "dashed=0;html=1;shape=mxgraph.gmdl.";
		var anc = "shape=rect;fillColor=none;strokeColor=none;";
		var fac = 'shape=ellipse;perimeter=ellipsePerimeter;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library bottom navigation ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'bottom navigation', 358, 48, 'Bottom Navigation',
				'7VbbjtowFPyaPIJyIVv6yGWhD9tq1fYHTHISW3VyItuw0K/vcexAKKFCu9qquyoRkT3nMo5nYiVIFtV+rVjDP2MOMkjug2ShEI0bVfsFSBnEociDZBnEcUj/IF5diUZtNGyYgtrcUhC7gh2TW3CIA7Q5SA/kTHOw6WGQzJkUZU3jjPqDIqDA2nwTP21uFNNcc9bYiYLM2LCQcoESVdsrKdqfTTMKf0AXqbEGV5vjk2fiLONbBWvWEDAhoEFhOe93RK19kmVfsUrIAwEzlXFhiFfTAyzZtuS9JeJWZXZd3JiG4mkyoxtti73ZBD0uEUsJrBF6nGHVBjLdpq4KR0HDM5I0nvdo/E6CMrC/qkYLeSnWgBUYRX3DJ5Eb7jKSdOrKOAhq7cCJx5h28/JYetKWBl7eYamTC6m/Qtbu5R8V56aSVtyettW+tIYdl1Uux8o3udB6GtrrmtZ2z4eS7f6JjMmZN5rBxrZoWCbq8gEK01O+852dS7YB+YhaGIFnBu0aPvyWsEFjSOYBS3uyuU9o6Tz23a5mObp7lj8/gdyBXcutZomHzeILwnGUuppDB/h5z03+9T8zU4cpkMyIHZzxDznML+HRPuCJfxSFZ/SjbjldCywKDebCoscnucm1kwvXrtgOFb2CL/QtB6YGTqgw/PDxbn6ja4/Jb8K16b/h2ueZNpq+kmknr2Da9MK0X8htm8PLHFu7Hv8P2r9u2en7O2hpevrKdOn9j9Bf'),
			this.addDataEntry(dt + 'bottom navigation', 358, 48, 'Bottom Navigation',
				'7Zddb9owFIZ/TS5B+SAZuxy0ZRetVGm7n0xykli1cyLnEGC/fnbslK+gditslTokJJ/X5/jErx8s4kVzuVkoVpcPmIHwolsvmitEsiO5mYMQXujzzItuvDD09dcL787MBt2sXzMFFb2mILQFLRMrsIoVGtoKJ2SsKcGk+140Y4IXlR6nen1QWsixom/8p8kNQh03JatNoCAlM82FmKNA1a0V+f6nz8nMpJHCJ+hnKqzA1ma4dp1KlpYrBQtWa2GihRq56Xnb6taNSzLd75jkYquFryBaIJ4yPeG2BYpgc9aaTnK+LAAlkNrqlDXPqLQZUTy1ZSXwonRlE6exxsbFc+nOaD1wXg/7Hv2m7yVJYSzec1huCoPNuJCZGLc8A/wRnjqed59zjhv/hpKNcdpI8cUdN2FtlqhZyqviHnLa878/fRMLtgTxiA0njgeY9AveHyUskQjlEFiu2cwldO2c9t08zc0o0QoahczpJ38JmnAYGlfgj4PY1mx7wcV7VLnf5AFUQWI1BYIRb+Gg/xBp7hEezQZ3/UeBf9B+dMQq5nkDdELq80ZeBe/kBN6HVcPTtxEsuyU+Er/x+wA2mr4IbDA5BbaH+NLA9r0uSmx84et2ifj0oVh9n3dtEr6MbnI9dKdH5PpXIDe5MLlrWNasgP/w/nN4p3/2R+Fq9278dnp1uHt1sen7bza/AA==')
   		];
		  
		this.addPalette('gmdlBottom Navigation', 'GMDL / Bottom Navigation', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLBottomSheetsPalette = function(expand)
	{
		var s = "dashed=0;align=center;fontSize=12;shape=";
		var s2 = "dashed=0;html=1;shape=mxgraph.gmdl.";
		var anc = "shape=rect;fillColor=none;strokeColor=none;";
		var fac = 'shape=ellipse;perimeter=ellipsePerimeter;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library bottom sheets ';
		var sb = this;

		var fns = [
			this.addDataEntry(dt + 'bottom sheet', 358, 320, 'Bottom Sheet',
				'7ZbRbtsgFIafxrcVgbjJLud0Sau12rQ9wETjE4yKwQLSOnv6gSFpFhwJaUsvqiaKxDnnPyfm+4VMQRZtv9K0ax5UDaIgXwqy0ErZsGr7BQhRYMTrgtwUGCP3K/DyTHUyVFFHNUib04BDwzMVWwiZkDB2J2KipqYBL0cFqajgTLr12s0H7RIbJe1P/ttrJ9jFpqGdDzSsrS9zIRZKKD3MIpvh42VWqyfYV6SSEHpr9RL/yQ3YasOf4QeYMN9n4+OCttCf3fKQivtdgWrB6p2TvPDaNkFBynloa4CzJraRyApRExLs0PtK0C0ixHGgJAH6rQPpBTIhe8JqlMkxwJjaeyBgY6MDR4jnyH9PnJnmosPj6PYNEdAuhmUIj8BihFKw/4PrNOH6FaA7i7TtmT9TV6ytxdWTV2bwdfSW02qGqhSyoI8gvivDLVc+rcPuKo+Tr6m4P6m3vK79Mx0En+O8Q8F0dM0lux/m3+C3cewajTh2GcPKxLA7+aj6PMf4IP2wzIeTEc/wZTy7Tjy7pZKprTV5tjVBnWkcWn6aleX7NS73sOF/N26WGPcAxoBk7h2d5Vx7kH8cOi9+w0M3T7xbKcXc3nGV5x0b5L86sTWZ7jls7gr0ft273GvOha+X86H21939Dw=='),
			this.addDataEntry(dt + 'grid style options', 358, 642, 'Grid Style With Some Options',
				'7Vxbb+I6EP41SHseQL7l9ljabc/DVqrOHmkfqwAuWDU4Stxte379sUkChDjFFJuytKxWIo7j2PPNNzMeD+3hy/nLTZ5ms1sxobyHv/fwZS6ELL/NXy4p5z0E2KSHr3oIAfW/h6477sLlXZClOV1ImwdQ+cDvlD/RsqVsKOQrrxomaTGjujvo4WHK2XShvo/V+DRXDQ9iIX+y/3RfiNR1MUszfZHTsdS3GeeXgot8ORZ+WH50N5mLR1rfWYiFemZYzYXmkr50rmfZVC3mhoo5lfmr6vJa3R1AHMZhjKMIwRCGANM+xOUoz2wiZ2U3HMRl24yy6awaOSTV4tOibJiuhl9LUH2phGgWKG4JVIvlAgO3cq375+X0t+WMrnASh11y1mNvdL5efnTnLB2zxfSfSiRk3fSvyPRE6nlViwBb88TqOqeFuvpViRraoorMqO6CDJGyLac8lew3bYx/CIxkT17M5JxX662Rmr9MNa0H0/mED6TI7kdpfpDmY7OMmg9UPACDoKX0JGwLEO4rwOr9d4Kpaa1e3k9Q4/X9qDmCeHgoqGwBsFqFFSZBC5MLzlTDpVgsRF64JZiZOE2W4YRESWRU+o3RtdB2Ua7kV18TSCsBG6f8oprwnE0mekWrFXD6INdP/lheXUWoqYTPMybpT9VFz+BZ6aFnIgbRYXr02uSzU70JHXO5BqChIW3nVqsDshV98KZnMzEamhgdOmF0zbaa0LEHYCLHwNAJs6XuCqtDkLG2vB5x6odHACp2DJSakVS2qzhJsAJ/WFXBuFesEs8RvQ1gYPlR7UI7KamXi8DRg8OaGQf6pBh6QAkC1wEm5TSblWhYxS7XARwGtggke7umWtUPitbtXBNEPgCCLYC+hQH4SzUFQaDeiUkLMCVBuUUg0o79VuTojPTaNNkd+5kCvg2d8YSyeVMGnPCuj7wQr53xuBUjpuRugSZuoxkAck2uzwNNGAAHaNpusSF2bAJn6WIqnmx91PBK/ztQmPYRYOSeJ3VUQbaiitq3uOUN+Yor3MYVsM7HuMWpnSX5hhGu/VYYxcnZ+a1SN8/dcbXTGL9E/nh2buvDwLT2W9Ef5Le6pPmJHFf85bjc2rfV3sgtThaJi1rynBn2uZtibmZgoTPBl8rUSScwQADu5hSKTflAR84n8IANAl8cchv8IeyDQwg6dk3zlPE3jzq6skrvPAIpFW2/RBPxdwZC/KdrDRUYijzj6kiTAPqSzjNOB2MxP7u4/R1o/3lxu6Ei5I7mhVik/Oxi93cAetycE/rKYrh2ZImPLIah1kMhcf9JzOJnSGegT5LOQKeezrCpwvjwfdc7bZyjPRUOvNi4dmLiZhlvv+mQNokAusL2aRW3b7NB6jKzIU9HlN+JgkkmGr6t7v5jq8NISKnsbIc3NNGwUdYWvoc2O/bZkMRW9Y3YUX1jHcXVGpH4OHM21G78XeUGD9eJdZbxNLQCtgMjmFyA4HtXFOVahQwFsoZQlPgp/cGxD5OC23maGyGm+nB76MKsLMe6z/hTcVJqdBR1iQMSWZkcZxqDj6Ex7YzRrRsfdFIuiLxxjmJbx4uP5cYMVggjL1aIJD7qrbGhxIYWRTqlLtSqGulUNKsPHagWOY57M2RKiSvFav7+g9RVBm4VCxtqt3InWqWHORmXFlqr1FF9ncEuQT92ScnFh/qcVPLP7U74tfHArn1x7XUOzQwRHyciOHB8iDVKx4/7HGJ1ZDOsD7Ew2XVIHOwuuyD+fqsX+f+pHg7tk0rqSZYVmioZzZl6iaZa3Xq3bjohAM8fvz2Sgkbj95HoROcGj7pc/0WAsvvmHwz4Hw=='),
			this.addDataEntry(dt + 'grid style all options', 358, 642, 'Grid Style With All Options', 
				'7VtRb9o6FP41SLsPoMR2CDwWOnofVqnaJu1xCmCCVRNHibuW/fprkxgIccAUGyi3VJWIsR37fN/nc3LstOBw8faQRen8kU0xbcGvLTjMGOPFt8XbEFPaAh6ZtuB9CwBP/LfAqOFXf/Wrl0YZTrhJA1A0+BPRF1yUFAU5X9KyYBrlcyyrey04iCiJE/F9IvrHmSiYsYT/IH9lXR+I63wepfIiwxMufyaUDhll2aovOFt9ZDWesWesfklYItoMyrHgjOO3xvmsisrJPGC2wDxbiiqvZMrnRQ0Y9Ipmc0ziedmsi8qZRXlREK/bbswjvpQW0lsL1qwl53wHPbtGU/WzYvi7RgT3sN/rNhlR9r1VebT6yMppNCFJ/L00CdoU/WSpHIgaVzkJb2ecUFxnOBdXv0pT+6aQgfdBBlBRlmEacfIHV/o/BUZ0JOnnfEHL+SqkFm+x1GwnXkxph7P09zjKjkXKyHZQb7tqg2Up9U5QXG9ZFnXrhvWPNWx5/ydGxLDWN2/3QeX27bDaA5vNcsxrwKxnYYRVUMPqjhJRMGRJwrLcrvD0gqpiCvso7IdaMWz1Lo12SIqF7uQ4JQfIJKJ35XgXZDqVE1pPgOIZ3zT8trq6D0GVm69zwvEPUUUO4FXQ07E+g/A0Gi2rMrdKm65liSsAKgSpOzTFBmBq+kBv+j2C9nWC7loRtBKb0nPPATChZWDwlJgqd43VKcgYL7wOcWp3zwBUzzJQYkRcrF35VYIVuMOqDMCdYtV3HMWbAOatPqKcSSfF5XSBd/aYUSnjRJ/U8x2g5Hu2405McTov0DAKXUaBPwhMEegf7ZoU1U8K4s1ckw9cAOTXAPrSDbx/RFEQBOKeENUAExbkOwJC9dBvLY4LR3rHY6p/MvOsqKwNnMisntN4ZGMirGyAHaxjF3hohEb7sKsvcbeNpulztg8tL3jzKInZi6lHGtzLvxONaR7vhfZ1omIItBNDKE9iVzfoM4qwG0X4KvliF6d6SuQLBFB5qW7Y6zvzUpda6Qpu3rrjqictfrHs+ebc1sXANPZb4QfyW03W/B85rt6n47K7vq2fhOziZJCmUJanRPNUu23mar7Vt2b4gkyNcvI6wPMPawr0dNk/S84ncIAN8D41ZDf4A9CFhoBv2TUtIkL3bmw05ZDeueFREO24tBJyt+OB3CdnNWcshHgm5f4l8vBbtEgp7kzY4ubi9neg/fHids2xkCec5SyJ6M3F7hcD1DR2NznccfEg452eyVIAAfpOVFBPSzysnMte99QUNVR8VFw6qV01cHmAYkCjMaZPLCecsEpEoqp/26kwZpyLtbYhhtHJsHJgo1uV0imAr4NKH/WMTu5ASyd31JJVMgICF0d3NIcw/i0fhE/nxOaR+jpY4ddDJb9/5wVfm2Jf2xTSHP3SbMchN7va0I1jredhHhiL5U7OwMaysurrd0pf8qui0Vno0gtQaLTkWGMMPAdj6qmgRzs+6KpcENqTNDQ9ogbP5cY0qxAETlYhBFycCtCcrnnEeR7F2Aatyp6uhVlt3wK10HncmyYtgGwRq3qyGfku4iNYz7kNWbq0wKqJ7OZaKAV2GJUw/VPXDs1ckknr/KCOT5b2QRR/1nxykWiC9dzgSDzhjxl7tsCpmerqiiPuhpXKUQhl+tDmKIIK1PEauySqZyt/vhIucTmdQ7zs6ZNCR72v87EIBK9pJ8lugm5ZaXAoXaeWh1OT1siJs7D9Etw4mjwfs5HUkGQ13kiC8NBGbXD46ANy93Jc6P7dOBiY57pFS5LmUiopzoi4iZSaKn3aFF0RgLePX9ccP+3id0l0wluDR1xu3rsvqm+/lv8f'),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'7Vttb+MoEP41+dgKg9/ysU1397S6laLrnu7jiU1IjOoYC9OX3K8/MLYTx86GbCBbN3FVyWDAMM88MxMYj9Bk9faF4zz5xuYkHaFPIzThjAl9t3qbkDQdQUDnI/QwghDI/xH8vOepVz4FOeYkEyYdoO7wgtNnomt0RSHWaVUxx0VCVHMwQvc4pctM3s/k+ITLigXLxCP9T7X1oCwXCc5VgZOZUI9pmk5Yyng5FlqUl2omOHsi9ZOMZbLPfTUXwgV527uesqpazBfCVkTwtWzySuci0S1QEOtuCaHLpOoW+tXKcKErlk3fjXjkTSWhfmmhjrTUmu8QsCu0uj3X098VInxA4zjcJ0Q19lbjz+WlGud4RrPlX5VI/E3Vd5aridTzqhYBduaJZJmTQpb+qUTtmUIGfw0y6Os6TlIs6AtpjX8KjP6RSp+IVVqtt0Zq9bZUnL1drubprWD5vz8wPxYpI9mhftm1O6wrqt8GurwlWT/sCtY7VrDV+6eMymk1L78Zw9brb6L2CGyxKIjoANOswgiroIPVnXpuk279NGojicZ+NI56KbA1uhLVIQJqtql5KuTpDKd31XxXdD5XC2oWkJKF2HT8syw9RLCtkS4ZGESnKcq6TWSrihFaJnHOyYJIic1IYagTjTMzgiDoh+An1K3F1qJuaIW69TA1c2MHAEW2rSynOFuWBHkP6Highy92wAF+Gx3kAJ3YMjoFwXyWdLDZBmIboAoz3bi2pvBEtIydohc6Y9ZNGLin1tg6eEJID3NWw2cMVuAOK+i7x6q2E1tgfcWZGhZMCX+iWXH+aAaUl6xnKrQQavkQHApuPL8b3DQD2YllXhMqyKNsot73KvXTdXwTWIlvYs+F3ni2SS7Knygm+vEg493wk/EvcnB8aIN6fu55TkKbmn92wYGWwXkuiCk4MVB/p4JjbH5Rj69EluxvAHawcmKAu7s233Apg68syQqWXe3vwO2vV+ujXb3xB8NxdPEc724TTYmiKwQTzNPiyvIPwPKxkzArHAzLg4tneXdL6TsnL0zR/A+cFeRK8qGTvDmvsKs48WBIHl08yceOj6Ttstolp2r5nsgpBFw4TggO41RLPqUZ6dsabsTc3gf2rAleK9NeOoFbCLzDnIJxD6nsYHPj4mgMdreO7jBXITC4J5ncexRXPzlwP4lqM2lXcbrbWncdVZFCETvH3j0wNVuIe2HaTTbpaJ0ZDJ6Vc1Xou9l8hC5QQkOJZvaBcznRTE+u0WMiJXR+A9wc2v0Wi9tnZs+VxGLJ4kZOXHVg+5Sn1K6eWCssr65eNPW/eBavNfy41ImoxwADK6zesSluTn96co/+zlOG55fG6uHHUT50EkfZzn161uplphMNo83kH15aYlpP7tOE5esreQdH3tiJS7adXTVTymXqkU9LjNOqfVHOGHX3oaZcT0MktCgFtCRXcg+N3AFy4ZmRZz1tXM36jPE2Oj7byoud+WsI3PtrBN/TiYDdI4B1q8Mhavm2Np2dwGR7W+oHnj0ZJ5TvP00wZxY8dFgQHM4s9919bhW5/9oK+eaHOrInzQtFlZxwuirTbZra6abqHQH48fELzPHrNX6/E53oo8Eji5svuXXz7Q+9/wc='),
			this.addDataEntry(dt + 'bottom sheet menu items subtext', 358, 360, 'Bottom Sheet (menu items with subtext)',
				'7ZfdbtowFMefJtpVKycGNi4h3Sp1rVRtT2DiQ2LhxJnj8LGn3zl2AoW0Uy82ygWRguzz5eP/+QlExNNye29FXTwZCTriXyOeWmNcWJXbFLSOEqZkxO+iJGH4Rsm3N7yx97JaWKjcexKSkLAWuoVgCYbG7XRnkKIpgMJZxOdCq7zCdYb1waJhaSr3U/2m2DjBfVOImjYWMkdupXVqtLG+Fl/6h8KcNSvoPZWpIORKs+lOwgKtbdQafkAT6pO1axesg+2bV/am7r73YEpwdochGyVdESL4+EtIK0DlRZfGJ0ErJppgyPe5BwVx0Yn4uqB8IGgqrFosQFTenAmnDC4nmuSRao3L3PmbBRMJejSAya/W9I6bIMUMA+Kk3h6caMj2Mh+MfOqfl6Zw2qzN24bOibFhdoMvtR06wCuGJo4bQ/NRuyeY9IMvtznRfJuXUt+qUuQwGDf2xfzzF0B60DQs6TgtFqCfTaO8eohXGNucSFCZ0I8n/lJJSZ3tA2Zdvb2jqUWmqvzR17+L2QnLI9wXrtS0fi93yevc9QnjkLHrgrvtCypHbAjl6B8wORow+SwW2lBVQsAVgJ9IaFbQ4aZt4MP5fGg1SRdPezpHVzrPSef0fHSOB3R2wx854nEDsIJK9rA+GNh9ai6FT99iSnwyEvBK6PkIjSfnQ3QyQPQJcqKQzZV1hRS7CwCyom/xZHrl8YN+z/n5ePw85FGtaPw4TVHWAZ/vVjVOVR7TDUiJ4lwKpfwK6cdAytl/gxS3h7+t3nf0r/YP'),
			this.addDataEntry(dt + 'deep linked modal bottom sheet', 358, 642, 'Deep-linked modal bottom sheet',
				'3Vrbbts4EP0ao08JZMtxnMfGTYoFtkCxLdDHBW1REmGKVEnKtvr1OzOkbr5sncZuiyZILPEynDlnZjhkMooXxe69YWX+QSdcjuKnUbwwWjv/VOwWXMrRJBLJKH43mkwi+BlNnk/0jqk3Kpnhyp0zYeInbJisuG/xDdbVMjQkzOYch0ej+JFJkSl4XoF8bqAh1cp9Et9w7HgC7zZnJb4YvnLYLaRcaKkNyYpT+sJhzug1b3qUVjDnMejCjeO7k/ZQUzDmPdcFd6aGIVuRuNyPiO/mflrORZaHabNpsIxZ35C1czt44CEgdByt+AAttPltHF0WtGa88ervgzh5Fz/MZ6dARNm9wc/0hYNLthIq+ydAMu2aPusSFWn0CkZEe3rG8G64hbcvAerxuZRNfoyyydS3GS6ZExs+kP8aGqcvdPrcFTLY2zBV7DKM2dusSOSt0+W/S2ZeytRZ2MXHsRtOqEOo39759x6y09khsOOXAhvW/6gFqNUufvMwGSx/cz+UoNPUcndATGvFWVzdHXD1gRECOUvgtxRrjp9O44vWa1zfkb0Gfhfa+YfU6AK74CcR1jG14viqcC4w3cpzua4Qp0YAsIOLlYY7Bw+gbrSsnDeymblWfNsNlcI5ic06baX4cStdSVpvxcyKS2/EBnuWnCv44LsSEkDfHur1MrRpmgth7b6CRbXKkficBPn1tqRjBs52C5+fqC0RKF1pty+HQGMIPdooUErKIBvRq8epZ7IXjWhaLtMbtrTaLEnxVS5kB2rGehaATwvDByCTPdCLUsJSdo8RJresxsYkGPJXujcioKdl0gN7G8BWmqZWS3cAd4COqZ3QlW0wWHJIiQg+Tz0kGKwBERdEGxTd+UIfkyC01hVKOQrenl1BG8fW9AnO0XjPop1iq7LUlnfAtrMbO5eEzZecdQp1MHvVXL+zmYcB1BCxVhodWaQHLuQhoUFKUOiUXJfo5gvyOj3QBLs1xAHvMdwCkYmeSwTX3ipaq25w8s1va5a30zz0TTgrn7fQ/cyGKWdbWIOXzCRunEsYO8sc5drDlhASIXyH6JAaPkwG1kPqqBtP8So9qUwKi4quJDdZXTD1htQBn+I+JInQvuCGaxKTCmPd8QjdMuX6K+Ooz6dWbaWXWndw9zwu9ZBRhBpaX3FmKA9R4AeDLCvIwzLeB7/2ju8tYctlTUsjH7YdtvWWtr75tWIG9hgPX8i1wBwoEAClUSE1c0YZjBhGO9s0HxIibGBoVQVJJKkp9FQGwbntVvchpn2KZ5nhnC1l64MgoOhoZqkjR/ImEwU4j8j1mXZLzq6XOql7zl1K5ksXl3s/RVUf6w48vtKkjRcVgPP4o+erLhp8LK2Vh3ubC7K/YEkXHmllMDXdHpQnewXj8UJwWIssnhdPi6ejRRys7fgnKAZR5Bbqmq42xBFYAmGVIlZMvg2lqcOasS1UKVcO6qRr1oXxffS6+qUe1pcXrVdmB/VKClQuJqPH+w06lk9DidjsZyastalIaBibfa20HxDPI/zuN/WcoWlEATeWqvW3MGA8K3f9Gc1qz28gvc9YUXrRswjpMpsjbQhDUA4evX5DnaF5YMk5h6DgK72jxWR6eAQ6x6Ofnxfj6P6oRwfv/ZvWeje+Ozjs7JX1xyLgNS5cDyZ8z6HH48s49E0cz6/g0vcXPi5ttKwKfibJ87vZXTQ9l47ZK09L4bZkeAyNLnNamkfD01JD+kW5ml+YK6g6zCmmho19rvocDgY3MTr5lYSO55chdLpH6MMV+Hw4wueV9osp7BeU2ve2DAVHme/sA8PtDBSg/HpqlziYA7ByZbtys2TWCg2VItVmnCrI27OldRb4UxCT/oog1Gz9Uhe2ZtqU/VmdKjI6C0ANh345wOLsxV9s/k9n1NYQlHVh/bCAdjismgQB8XcAyIporj2+cRYuBzYcSmko9ekOBRs4XLO0ErbMFAg0dTCjuHXwY4P4jUhaiRyOGKbrW8M5uHuDDJBXVjBbhPfdCrboAhNDOFWLgnWrbkTW6M0VHoj8c0oXDnSOLoURrjHFhid0ALCj/il1zvgH65z20vxkneOLmmhYtt+dLNt/n8JnfqHCp934Lpp8mx36an8dOYf9iL4ufvn+MqKm88vwNL0KTeMLFz1Ltlofq2/aQDxF0Q8WOd7PTlY50W1zC/4/hU5zp3+Ne/7761/zj8/4Q2TDFcwUpcVQKbkRsAiGWtP6sWv6jQj88/mLz+fvaPL7lezc/2n0wGv3LwR+eP8/DP4D'),
			this.addDataEntry(dt + 'long list', 358, 642, 'Long list',
				'7Vptb5swEP41+ZjKGAjwMS9NN63VonXSPlYEHLBqMAK6Jfv1szEkEGB1GpxVXYgi4fPZ2Pc8dzZnRvo82t6lbhI+UB+RkX470ucppbm4i7ZzRMgIAuyP9MUIQsD+I7jsqdWKWpC4KYpzmQZQNPjpkhckJEKQ5TtSCnw3CxFXByN95hIcxOzeY/2jlAk2NM4f8W+uq0FWzkI34YUUeTmvxoTMKaFp0Ze+KS6ulqf0GVU1MY1Zm1k5FpTmaNs7n0JUTuYO0Qjl6Y6p/MJ+HgoN3bRFsxDhICybTYxyZm4mBMG+7cE87Ka0ULe19Ja1+JynOhjWaJV+KoZ/bETgWPr0ts+IvO+a8rK4uHLiejgOvpUmMQ6i7zThA6nGVU4CHI1TZ+UUZaz0ozS1JgsZfBtk0BCyFBE3xz9Ro/9zYDROJH2YR6Scb4VUtA24z94EkU9ucpo8rd30VKSkbKd3267ZYFe6+o0pyjXLGpO2YbVTDVs+f0UxG9b+4WMHNh4/tpo90M0mQ3kLmP0spLAyFQeobh86htFezKcX5/8EnAfTrulGg8IyGdiFkhRtELOYhzJZUGzDnABZCMxXIajM1HCUySCOUnVTAQIUAGINDEiG3NQLW1jUDV8HpMRIKFcOAs9Ep9mghpU2UYbV2NLVg2UPDBaPZRf1m35kbHXI6IZ6ZJwWMl8TFHOFuAXRqStJKapWKII2eXu/ZgP+O1q3jCYHBlp0IAAdmy4wTMgDDawcRwFW1TNqYH1BKOnFqeEyz1xTzmOWxswCszZyxF0jsqIZzjGtb9c5MNhzyf1RfYR9n49przAt+9tXlBvy+6L/BbwUDS7FAs1QsRXRtBYNPsdrupXjAS5Ur0TgGvBiRHCUEKGdzPjkxgF9YWujFBdCoS27kC4dyzT/r7AAVbABqgkL7WTNA8oyFAfstVCKDtFe/RoeLhoeoJrw0E773FEaMIPCmRwhgkL9KSEvsptthgV7t79uHc6mhK4mRrSzS48hQrLrRSZ05agAtakxMT4sFbpeyYeiQjPNqKuJDu2M1oJ6kkTwuaYcDYylfbs0rzQ4mwaGmojQzqM9Euwj2YggdCX3C+bM0cCVCudTQU1EaGfpViHNqSQVEqF7XfrPXfpNNY7uvIeDpeIa/GBp15ed7TxmMuxBjpnGVT+DwgTBwKnytes9d51q7L9M6IPojUcbgme9GXRwU51w/uUMVzPUneFa6o9wofY6hhVWrCVOMu4qCUoxewh3tUq6OojeEYAfHz8oj19n8PuX6FgfDR5WPHweJtTrX4/9AQ==')
   		];
		  
		this.addPalette('gmdlBottom Sheets', 'GMDL / Bottom Sheets', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLButtonsPalette = function(expand)
	{
		var s = "whiteSpace=wrap;html=1;dashed=0;align=center;fontSize=12;shape=";
		var s2 = "dashed=0;html=1;shape=mxgraph.gmdl.";
		var anc = "shape=rect;fillColor=none;strokeColor=none;";
		var fac = 'shape=ellipse;perimeter=ellipsePerimeter;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library button ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry(s + 'rect;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;shadow=1',
					100, 36, 'NORMAL', 'Raised Button (Normal)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;shadow=1',
					100, 36, 'HOVER', 'Raised Button (Hover)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;shadow=1;',
					100, 36, 'FOCUSED', 'Raised Button (Focused)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;shadow=1',
					100, 36, 'PRESSED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#000000;strokeColor=none;fontStyle=1;opacity=12;fontColor=#BDBDBD;',
					100, 36, 'DISABLED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#2196F3;strokeColor=none;fontStyle=1;shadow=1;fontColor=#ffffff;',
					100, 36, 'NORMAL', 'Raised Button (Normal)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#2196F3;strokeColor=none;fontStyle=1;shadow=1;fontColor=#ffffff;',
					100, 36, 'HOVER', 'Raised Button (Hover)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#2196F3;strokeColor=none;fontStyle=1;shadow=1;fontColor=#ffffff;',
					100, 36, 'FOCUSED', 'Raised Button (Focused)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#2196F3;strokeColor=none;fontStyle=1;shadow=1;fontColor=#ffffff;',
					100, 36, 'PRESSED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fontStyle=1;opacity=12;fontColor=#BDBDBD;shadow=0;',
					100, 36, 'DISABLED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=none;strokeColor=none;fontStyle=1;shadow=0;',
					100, 36, 'NORMAL', 'Raised Button (Normal)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#999999;opacity=20;strokeColor=none;fontStyle=1;shadow=0;',
					100, 36, 'HOVER', 'Raised Button (Hover)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#999999;opacity=20;strokeColor=none;fontStyle=1;shadow=0;',
					100, 36, 'FOCUSED', 'Raised Button (Focused)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#999999;opacity=40;strokeColor=none;fontStyle=1;',
					100, 36, 'PRESSED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;opacity=26;strokeColor=none;fontStyle=1;opacity=12;fontColor=#BDBDBD;shadow=0;',
					100, 36, 'DISABLED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=none;strokeColor=none;fontStyle=1;fontColor=#ffffff;shadow=0;',
					100, 36, 'NORMAL', 'Raised Button (Normal)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#cccccc;opacity=15;strokeColor=none;fontStyle=1;fontColor=#ffffff;shadow=0;',
					100, 36, 'HOVER', 'Raised Button (Hover)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#cccccc;opacity=15;strokeColor=none;fontStyle=1;fontColor=#ffffff;shadow=0;',
					100, 36, 'FOCUSED', 'Raised Button (Focused)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=#cccccc;opacity=25;strokeColor=none;fontStyle=1;fontColor=#ffffff;shadow=0;',
					100, 36, 'PRESSED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'rect;fillColor=none;strokeColor=none;fontStyle=1;opacity=12;fontColor=#BDBDBD;shadow=1;',
					100, 36, 'DISABLED', 'Raised Button (Pressed)', null, null, this.getTagsForStencil(gn, 'button', dt).join(' ')),

			this.addEntry('dropdown menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 100, 180),
			    	'swimlane;shape=rect;strokeColor=#eeeeee;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('State 1', new mxGeometry(0, 0, 100, 45),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=14;fontColor=#FF4081;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('State 2', new mxGeometry(0, 0, 100, 45),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=#EEEEEE;fontColor=inherit;fontSize=14;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('State 3', new mxGeometry(0, 0, 100, 45),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('State 4', new mxGeometry(0, 0, 100, 45),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Dropdown Menu');
			}),
		    
			this.addDataEntry(dt + 'dropdown button', 100, 30, 'Dropdown Button',
				'xZTvaoMwEMCfJh9XrOkeoHVbv3Qw6BMEPU1YNBJvre7pdzHRam1hY4MFhNz/3C8XGU/Kdm9FLV9NBprxZ8YTawz6XdkmoDWLI5Ux/sTiOKKPxS93rOveGtXCQoXfCYh9wEnoD/Aar2iw00GRiUaCc48Y3wmtior2KeUHS4rcVHhUn853HZPcSFE7wUKKzqy0Tow2ts/F8345N7TmHSaWtF9kOUuFcKxF6rKcCQzpJJbaFaBtOC9YhPZuz70qNLwHUwLajlzOKkMZPCLPJZKgChnCNkEnGi8XY+iFIG0CxNtA+QLo1iqhF1Tp+BjwTShE/SK9a1ClQm8D71JlmQvdNURGVcUBcnfoNb+6gs0fEYz/j+DmhyM5aW0YvrIt3ItaFWWmV0j8q6KHdzWN48zNp7EyFfyS0zygCy9x9ejlGcUlxOBlQQtUJ5ilugU2lH8zik411n4Y8nSDPJQfcpg8bwAXVzO2ceu2SLz8nLz79N/1BQ=='),
			this.addDataEntry(dt + 'dropdown button editable', 100, 40, 'Dropdown Button (Editable)',
				'xVVZboMwED0Nn4mMTQ6Q0Db9aKVKOYEFA1g1GBk3IT19x+AQloRStVItIc1qz7w3xh4L83qveZm9qhikxx49FmqlTCvldQhSepSI2GMPHqUEP48+3fH6jZeUXENhliTQNuHI5Qe0ltZQmbN0hphXGdhw4rEdlyItUI5wf9BoSFRhDuLTxvoU9SrjpVU0RMa6hZShkko3e7GkWTbMaPUOPU/ULPS4gkAbqO821ZhcR3tQORh9xpCTiE3mIkjbOMlApJlLC5yNV62edqlXiFBwKN1GjE0Q22rB5QQ2LN84fHptkmah3TYoIi63DtBcxLFN3VUlj0SRvkBii/bZCOMA9czk0soonjJh4IAp1nnCMepxJJstlgFK/w/Q4PsRnBmqQhUwO08aKoTu+VK0/0tEhgk9fIIZeDRIbsQRBrm3MHPnvSmBZXSHrcYwqySpwExA7spchPvmh1e/N3UXPvI6tX+udZrHcm3wGhRpM8OjW99xMWTJUbeIjWCWDbJ2zZxH+mB+p/xs/oae4eErejn9N3Shen0F2vD+I/EF'),

			this.addEntry('dropdown button selected', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 100, 180),
			    	'swimlane;shape=rect;strokeColor=#eeeeee;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Arial', new mxGeometry(0, 0, 100, 36),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=14;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#CCCCCC;strokeColor=none;perimeter=none;sketch=0;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-22, -2.5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=0.25;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				divider.vertex = true;
				cell.insert(divider);
				var field2 = new mxCell('', new mxGeometry(0, 0, 100, 6),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Calibri', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=#EEEEEE;fontColor=inherit;fontSize=14;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Courier', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('Verdana', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field5.vertex = true;
				cell.insert(field5);
				var field6 = new mxCell('', new mxGeometry(0, 0, 100, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field6.vertex = true;
				cell.insert(field6);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Dropdown Button (Selected)');
			}),
		    
			this.addEntry('dropdown button selected editable', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 100, 150),
			    	'swimlane;shape=rect;strokeColor=#CCCCCC;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Arial', new mxGeometry(0, 0, 100, 40),
					'text;strokeColor=#CCCCCC;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=14;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field1a = new mxCell('', new mxGeometry(1, 0, 40, 40),
					'text;strokeColor=#CCCCCC;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=14;fontColor=inherit;');
			   	field1a.geometry.relative = true;
			   	field1a.geometry.offset = new mxPoint(-40, 0);
				field1a.vertex = true;
				field1.insert(field1a);
			   	var marker1 = new mxCell('', new mxGeometry(0.5, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#CCCCCC;strokeColor=none;perimeter=none;sketch=0;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-5, -2.5);
			   	marker1.vertex = true;
			   	field1a.insert(marker1);
				var field2 = new mxCell('', new mxGeometry(0, 0, 100, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Calibri', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Courier', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('Verdana', new mxGeometry(0, 0, 100, 30),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.bottomButton;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field5.vertex = true;
				cell.insert(field5);
				var field6 = new mxCell('', new mxGeometry(0, 0, 100, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=5;fillColor=none;fontColor=inherit;fontSize=14;');
				field6.vertex = true;
				cell.insert(field6);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Dropdown Button (Selected, Editable)');
			}),
		    
			this.addEntry('persistent footer button', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 300, 40),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#2196F3;fontStyle=0;childLayout=stackLayout;horizontal=0;startSize=0;horizontalStack=1;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Persistent Footer Buttons');
			}),
		    
			this.addEntry('persistent footer button fixed', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 300, 40),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#2196F3;fontStyle=0;childLayout=stackLayout;horizontal=0;startSize=0;horizontalStack=1;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('BUTTON', new mxGeometry(0, 0, 75, 40),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=10;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=12;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Persistent Footer Buttons (fixed)');
			}),
		    
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), 'shape=ellipse;perimeter=ellipsePerimeter;fillColor=#FF4081;strokeColor=none;shadow=1;aspect=fixed;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 20, 16, 16), s2 + 'plus;strokeColor=#ffffff;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'edit;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'star;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'heart;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'reply;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 20, 24, 16), s2 + 'users;strokeColor=#ffffff;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'gps;strokeColor=#737373;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'share2;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'navigate;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'chat;strokeColor=#737373;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(22, 18, 12, 20), s2 + 'voice;strokeColor=#737373;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 16, 16, 24), s2 + 'google;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 20, 24, 16), s2 + 'video;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 17, 24, 22), s2 + 'gallery;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 17, 24, 22), s2 + 'birthday;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 20, 24, 16), s2 + 'cloud;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 20, 16, 16), s2 + 'x;strokeColor=#737373;strokeWidth=2;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(22, 18, 12, 20), s2 + 'bookmark;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'calendar;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(17, 20, 22, 16), s2 + 'attractions;strokeColor=#ffffff;fillColor=#737373;strokeWidth=1;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 18, 16, 20), s2 + 'dining;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'education;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'family;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'health;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'office;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'promotions;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'radio;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'recipes;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'sports;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'travel;strokeColor=none;fillColor=#737373;direction=south;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button mini', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 40, 40), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(12, 12, 16, 16), s2 + 'plus;strokeColor=#737373;strokeWidth=2;shadow=0;sketch=0;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 40, 40, 'Floating Action Button (Mini)');
			}),
			this.addDataEntry(dt + 'toolbar',  358, 64, 'Toolbar',
				'7ZbLbsIwEEW/JstGjkP6WBZaWFWq1EXXVjKJrdpxZBsK/fqOY/MIDxUJVm1BRPadmdxx5gglySdqOTOs4y+6Apnkz0k+MVq7sFLLCUiZUCKqJH9KKCX4S+j0RDTro6RjBlp3TgENBQsm5xCUIFi3klGwnHV+aaDEW45rIeVES236aF73H9StM/oD1pFWt1gzbgwT2Mmeaj/AlRz3GW44K/ncwIx1KIxQ6LRoHZjnBRZa1Ig31a2bMiXkCoVHU3LhsBuLjT6xecMxPSa96bkpfbfcuQ7jRf6IFzy+v/gEmzZaNxJYJ2xaatUHStunTutggcuBSUHH+zbiy5tQ31t8gmAcLE9OoZfiCGagFTiDPuRTVI6HjLy4D2UcBFoF8XYUNGbDvtmUbmeKizjW4yPOfx5xxSyHKj5r7pSMs1mPXi0bT2jaqEqmJVNg2MHEd1nYY+Su/24q3uOh6S4K5M+gQI+jEAtISotQs1oLcb/DCh0dopJFfAxI5sQCBv7H+IktvPpnvPW/yejA/uZheAdd1xbcAX+bg5yF5OjKSC5EBfrUf9A/jBfA+PtZLK7MYsOkBG/+T+PVabw7A0dyiON6pBfjSIY4ZtnlPOJ2+7YX0ndfBr8B'),
			this.addDataEntry(dt + 'floating action button', 50, 156, 'Floating action buttons',
				'7ZfNjtowFIWfJstBjvNTuhxgYFVppC66thIntsaJLdsw0KfvdWwIIUxLBbSqSiQi+/heX8f+ckSiZN5sV5oo9kWWVETJS5TMtZTWt5rtnAoRYcTLKFlEGCP4RXj5wWjcjSJFNG3tJQnYJ2yIWFOveMHYnQiCYUS5JiRyZaA1U1Tzhlqqe/W1l2bGavlG51JIF9DK1uVUXIi9FOFkES+SReqCGSnlO4gxdGpNSg4rP8k1b9QWDPoIOowUbK3piqjIz6Akb6HwywYSTQiqZGuXpOFiB8KzLhi3tIBRjBZkXTO/Thf0Va514Z6OWatgPEue4Qbb5W4uwExqKWtBieJmUsimGyhMF7qsfAloDopkeHZahn93RbBbW9hxqi3dfnhqnRSObEUlbK2GOigkTH3COy8t80rqjxkxyqHuUCPG9+vDPD0Q0AhMnOcj+TUfJTGMlvvTsY0Ih7nnptnWDu9J3ZQCdlDtRogAD3l3jTk56D7jW3hi/H9SgX9KBZpkPmV30j/iJMZjTuLca5oKYvmGDsqfgyes4NVtcV/+KR9Uf5oOJ5BVZagdsXd4jItwTB929e/aVQAjQ3/MvbIbu5fSjvjLkHk41zEg6fXONb2fc32+v3Plf8m5lssUTeOHc/2mcwUUYjQ2qywfg7jXrjGrTzc2q+25/1lVdz1c6eilvM6V8vu50vTmrgTd/tPShx9/ef4A'),
			this.addDataEntry(dt + 'related actions', 200, 40, 'Related actions',
				'7VdNj9owEP01OS4KTvjoEdiFSysh9dCzN5nE1jqZyDYs9Nd3HAfCR3aLWqhWW0BE9pt5jMd+flKCaFZsFppX4humoILoKYhmGtH6UbGZgVIBC2UaRI8BYyH9AjZ/I9qvo2HFNZT2EgLzhDVXK/CIB4zdqgYwglduSERZGRpNK9CyAAu6RZctNDVW4wvMUKFLKLF0nEwqtYMCFmX1xyULnuIrgX2a5JqnklZ+wjUvYBNB85AmgidipWHBKwJitxqUJRV+WhPRNEkZlnbOC6m2BEx0IqSFhKIsfOSrXPh1uqTvuNKJ605YW1F8EE3oQdvlHi7B9HLEXAGvpOklWNSBxNSp88yXoOFRkQGbnpaRP10RVjdgC9X0q/gzqCUaaSWWhCVQes4atJUJV19PEp7RWlpDNOVK5p2MSROwSPszbU6XYrB5UyE11MhjAUjHqKmn8FWmVviM2IsoFCCpq2OMGz/P98xWbjRoFNetvuj36ku5EZDuzr7dup0qi03uLk8vL1LVSzE509+h2E5EOKq/e8aPpmH26SR3kQxYtwwaQtgbeMr2ZH4gk358LpP+0GMaFLdyDUflu7TTrGDptrgt/zA6qv4wPv4DzDID9kx6+zYuUmN898K7F757CcbhmeZvZY2DK1ujqTTwlAh0Te4W+YcWGf+9RQ5vZ5Ffbm+Rw7tF3i3y3UvQH/47jxxd2yM73bFbka0x/n82OPzQNji+ug3StH0j9+mHL+y/AA=='),
			this.addDataEntry(dt + 'floating action button', 50, 456, 'Floating action buttons',
				'7ZhLb9swDMc/jY8LHDmvax5NLh0QYIedVZu2hMqWITFpsk8/ypLzbhtgWzCgjhFD/JMUKflnHRwl83K3MrwW33UGKkqeomRutEY/KndzUCpiscyiZBExFtM/Yst3vP3GG9fcQIX3JDCfsOVqA17xgsW9CkLGrQAXHkfJTGBJPS76NLSC1y6k3BWu/V5RZqq3sWCcD41+hblWmqxFpSsKnOVSqVaKWDKJ3eUnyvRbmJXmyiQ1f5FrXwFT0TbBU7ExsOI1CQMSai0rBPO0pUQbgnJd4ZKXUu1JmJpUSISUvCxe8E0hsOnTBf3QG5O6hQjEmvzDZEo32jF3cwG2V2hdKOC1tL1Ul40jtU3oMvclaHhWZMhml2XkL1eEud4UfwG11lai1BWJKVQ+cAsGZcrV80XAi0akwsmMK1nczJgGB2ralFl4quSD3btkNFLAYgW6BDS0kDgkTHzCm8xQeGXgUYoFSFrYucatt4vDPEfoaBC4u81g0jHYMfgRg/tgxQ9DctAh2SF5B5L90eOYHHZMdkzeweQBtgcwOeqY7Ji8g8mEPY7J8edMtuxRoqytA6QGI6mS25NWXR+lu4DMm9+XBPLktf6v2dy3lF3TOBxd09hqf0Lj5C+fkLsrGgm9cXMdPD/Dslh38v0TusYfnnxxb3h29h3sE9r6N2hrNQOKo9zCWflbCIYO1u4ZHst/Oz95W7OdQOe5Bbwi+LCMW1CTefwi5cNPP1j9Bg==')
   		];
		  
		this.addPalette('gmdlButtons', 'GMDL / Buttons', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLCardsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var anc = "shape=rect;fillColor=none;strokeColor=none;";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library card ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'card', 342, 356, 'Card',
				'5VZdb9owFP01eSzKd7tHPos0tlVlWvvqJTeJNceOHNPAfv2uiSHQJC0UtD0MhLCPr32vzzm5iuWN8/W9JEX2RcTALG9qeWMphKpH+XoMjFmuTWPLm1iua+PPcmc9q8521S6IBK5O2eDWG14IW0GN1ECpNswAZUYKPZQQ4ZGjhDI2FkzI7aqXbD+Il0qKX7Bb4YKDBjMSiwrnDk5MKpAK1r3lbiFT6z2IHJTcYEhFY5XVEZ5vasyAppnZ5gVhDZKyBtL93ub2ODAEdJPhnU1G56VfMTSa6C/iVUYVLAsS6QMqlPxUTtyPceJ8ugInfouTz4SnBB2K6A/CGOhSliQhkrbYwktplvT1aETYkNGU48pPoZTINVOCqyX9raORfKQTyaE8XUCir+CEDYRTu5mNzAGTmwBBCSWe8WTYcHqYzlTOzjFiD+kb81QNgsA29L6ngx/UmARGFH2Bo5SXaBO0tFmIiCiIEVSVFigTK1lqTcQKS3RtkWixNjHfqka5DsxAYzoApAbmWDkjPC538V+hMhH490QY4ArWZg8Ggz7FuwToF/fRcNUh+IFDHL9T6xqZ7/h2/qnUt+GZUpusD4Jy1aQM7OMdIklKUC1r7Gs9yS3hRa1+19C7Gt4VSL5K/75t3XA5Hz5O+0x66C3XzA/69mw2DDy/ceR3URhTvuFuE/G64+U0jnX2ETFAhLyA3BVhSvuId8M3ab3x/ZZx7+yOFuVfxbf7dFc17l1L1unzw+Lb/yns+ljEv6zzO9kvkR2nzWtvHX74VvwH'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card Collection',
				'7Zlbb5swFIB/DY+JbG4hj7n0Mq3dqqZa9zY5wQFUc5EhTbJfPxtMApgkJIGumkZVCR98PZ+Pz/GJok38zR1FkfsY2pgo2o2iTWgYJtmbv5lgQhQVeLaiTRVVBexfUW8PfIXpVxAhioOkSQM1a/COyApnkkwQJ1siBDaKXcyrA0Ubxy6KuJziBet/vPQImYQkpGlVbZk+vFpCwzecfwnCgLUZi6EwTfDm4HRTkZjrHQ59nNAtq7L27MTNamiGlTVzsee4opmpi4mjOBM4u7b71bMXoYB6ZWiSMiCby0gDZ+kEEc8JeDGbXVVHumGMTP2QjpZhkBQq36YPrxyhhRc4z2LF+l70EkZMAEXbmZgjyMveb16EGitTHLPSq9Akb+EmPhGvjeCol8FR9UxGMUGJ945L/V8DTL9w9/obh1tc3/Ft0k/C6NccUZmUOtWGlnnVbtbqFVZusBWG2jeyckGduilrE56rTTH+U+ixae0G7w3V0vC9QbmHcLmMcSLR2K2iESBDAvRC0TsmKSOKkX+WZdVbTBmaCQZTa1y72wv2wLVyytYyw+LT4JC9BSIjYdm+Z9t8vnnNB7zkbAZqwfpJKita2Nr1EjxjLfgE1mz/dWx1xuC6fbItG2+r+8Jsw3AjipeYqWmB44abY+efGundqNf7EXPNdVUyV7MVc827ya3V6oDKoA0qMUZ04UpAitovUhGgssq5tapXImp8vkKzM2C9PGzokpjVBjEfUccLnrMzlh+1j6mAVbPODfFY/3a4FgeefAJnkvtc2V3HHZpptnIEWrADdEPZNTKHowLItg0YrZh6mStBASvMMVq47Ixrm+xeMA6TJPSZuGc1PEnHU/53wKsdcqxVPzoXw1adZtFRFyJdvmPMC6JW68KoFejXR6gQSJi/rfw5poJ0BSlbRnIs4CiG9LoUgFSUBfalPWBD5jNMn1MXhIvDF+uUGzXkc7nenLu6RkAoQXrlq3Uxi1W5BY65BSqqSTicOWNnOvyNV4pXgY34er7EBAW2orLRQM2H+BDrOr0exppfAFNDKKOu7o3rr3utkTNAK+ew1kUoCuUUyOx+9HxziFdRzbW3iJGh6XW3iCOgT90z8vNxwdBgWrnqt08WSlQtIEPV27mHWuUoyVC7YCxndm5+Pj18/0/5wyh/CGY5H/QVBQ5i6VQm/YEIwXz9M7RE1Gs9nPrsYVM1FFD1pjF6S2nCnd8whw39BrRAVy7fuC7x3QQ2SJ9aJbegRthMhbrViuvt6V1cX2EreaA5Wrw1zjcUuVyYdIDHsw6gn6c9jyUe9O4Su4Pu87qwQaooZ8VaelHM7SPC1GODcN+WS5/2ok8E8N/nZzXnV3vi/U06g38NDyvuf/HNqhd/EP4D'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card Collection',
				'3Vpdc5s4FP01frQHCQT4MXacdGeabqbpTh87xMhGU4EYIcfx/vqVQNh82cUBHK/d6QRdJCTOuedefTAy5+H7I/fi4In5mI7Mxcicc8ZEdhW+zzGlI2gQf2TejyA05P8RfDhyF6R3jdjjOBJtGsCswZtHNzizZIZE7Kg2+F4SYFXdGJmzJPBiZed4KZ8/WxFK54wynlY1V+lPVROc/cb5nYhFss1Md4W5wO9Hh5ua9FgfMQux4DtZZUt8EWQ1TORmzQJM1oFuZlt64F6SGdb7toe3lxcagGYwzBoYQI7lzjTOwsSjZB2pYja6KkZzCFw0O4bRikWiUPkh/anKsbck0fq7fmPrYPrBYmkAuu2LHqORl8m/qghMWeY4kaWfGknVYhsQgV/kc1SdrXRCaQtESPXtVoTBjxEGrczGMfUEecOl53ch0fqgR4fva6XCyTr06USw+Nerxzt5stkMTLnBTot0grJyATbLrqMGzkVN9//MiBzWvvPxFJa6HzvlJ7DVKsGihvr+LVoRgWpEPKn3DzcJWZ4lqGahlFW1mIKF3ezkBRkoQP4ksUxPahiKX7L06J0WdEh8X403r/kVrxQtDiyInqa2ooiaNDaksJDTzUV2ZX326hJ2H9qMOV5hCdMSJy2dw34wFmrU7XBHzbifUGqOVUmpdi9KzR+TC9UdgBWnD1YS7PFlUCNEog/vkW3PKqxoorLKuVphR4pah1ZgD0bYOJ8tDMmY2wdjocfXJPqexVgVap9Sg6zmlgwzJgQLpXls1aW1J7dRh7Jfn211IKxH5szyJSdh6CkHcGAvodEFA1A6rVH6T0RJKHOHf0iaRiTRrDItkRJH8syxVFfNbK+a4moaK6bOwpRTcWUfigcHcRtpPndG6f6Z3ny2X1oCGAPNKIFR4+YrSQSOpE0w5Rdsw+WflffGuCRBdSfxTUSiriLFn0dfN6EqbgMcYfn+2SXXl0xSHeF9belQqjw5h+rynKRIT75mKNoaVgjWCX/5NE6R0YtiERpAsQDU3eKvlx+Lb9L27e+fx8g7OqusLtfKjBo18qrqM04QmOt6KQnBvD/+dqUGxQyr9x3KbMJeUqxbTrAIDkEuvGSKzdYcaX5tm3ehg1y7Vd7tklLzxQCqz6GaUyyye4i39X2Yl02MeZhukF15+jtXWAB2y3adgK7vlTywRKQpSQQqHz1jFkugryUP9QVuJS20zUKdsEbDBhRYDh452G49dMzu1b9um7Tw9AJsajUsuawzw8WR9RWoen4/8d6+7njvOnJ/6+5S8d4C4JLxvr4B8cWjyx1TE+x7b5fcXMy3PzHm1/cOFpQSFewf2Yb66l3/t+Hevp5wP72lcG/fWriHxnWH+7sZsNHFpvfIdtqFexN1VwYEN6SMzI+6K+MUsJcVRscPAtocxxjpr3FbqQdnbjlzsdxedpbG1hD7+w1fInxAI6/e8nfTgcz+K41jvHzwVAaeXhUYk/xI+NTJjDXcobcz/Jl3m68Pcq5kSxInSh9yb4PITtTGXG59PpiuiMDb5w+1568x4n0mO86t0SOLhy/hsurFD+X+Aw=='),
			this.addDataEntry(dt + 'card collection varied layouts', 358, 642, 'Card collection with varied layouts',
				'7Vvfb9sqFP5r/JjKgH/lcWmX3Yc7qdom7XEiMYlR7WBhbpvev35gQ+LYbuskuM2cpaoUjsHg853v8IGJg26z7ReO8+Qri0nqoM8OuuWMiepbtr0laepAl8YOunMgdOW/A+cvXAXlVTfHnGxEnwawavCI0/9IZakMhXhOtSHGRUJUdddBsyLBubJzspT3n61omt6ylPGyKlqVH1VNcPZAzJUN28g2M90V4YJsXxxuadJj/UJYRgR/llWeaCySqgbyo6pZQug60c0CTw8cF5VhvWu7f3r5RTug2xmo5Qwgx/IJuUf5BKd0vVHFanRNHyEXzafzl3y0YhtRqzwvP6pyjpd0s/6mn9jbm36wXBqAbvtdj9E1Zfq/KgIky5wUsvRTe1K1eEqoIN/lfVSdJxmE0paILNWXewEGTwMMepWNkxQL+kgO7n8OiN6JEZ1t14qFN+ssTm8Ey38tMD8rklG3Yw4bPGuS3vhVueY2L2h7DRzrNd3/PaNyWLvOJ1N40P0kPLwDW60KIlpe3z1FLyD8FhB3tFgy6bWj6NRNkwan5j6Y+QqYriiv8UB55C2OVYSaKMYohOkSp580pTMax2rMpuq/ZKWACWGN9mlp+0hq+eF5QfJ8yFCrQRHYYGfOyYpINy1J0TNAdhNTL7/73X5/havGVwdcDaxw1dzGUDUaAJXQBioFwXyZtACpe7+OigaqqmzoCs+EqHdyBcFggE2MXhgSsaiF2D0nkxVeqGeSNypOADDDfE0336q0q7Lv19IgqwUHhhkTgmUmRzaYNrtTfy/RUvYbs6daXu7Kw/V87XVk4YXu32Th3Xj8miwyyb6RltuzQ2X5x8TBR8sihKwk7wgMEHRTG2nCSpS9vtBog9wLsujVtA9aOaR78gVW8Jv4QwAIXBsIJjLRi2OZX1+cdJB/Wn4ai5bes8H03NkgGm42AL4//HQAgA1gF4w9SHo+jAvbjpleb4qcj63bWEcZgtkFF1qRZ4l0am9k61dOhfdEaXfJgHvT98C7vQ81x4+MS1HiwCBVqXch19DBupxBGY5lXcFpblfzoQODXulaFXz7ZUFD8HXpr72sA8FrmrCh95oS0Yv6ikBLgm8XqCjwg3ashtOOYDX8vkQNCLyPE4F7u9kHfTdtCNCR4rAT2csWh/44xWEVsVetDoPRqsPzwf3z5WF4VfLwohF/H33Y3vybkUK0tSGmPKUbMqQuNBPxX2F4rDDcNiJ0dEJxeglCUa9b3k8nRqPXiXCkm4jg6ncR4Xh3EcHfbUR4XduI4Or3ETvOs/0Bb4V7aTArO3Jhz1d6gXu5Kuvk425HnK5yy8/pmgjaeK/qRXYkkTfIxGll62yBlw+9j8/UcTkxQ0LvjZUJ9N9Okt5whxTD4c8o9jmPZrCSLeU7FsWPnHAqOyF8b73fmy4IwPHjF/bHrzPjfSQ64djgkcX9Lxeq6vUfNvwG'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card collection',
				'5Vpdb+I4FP01PIIcJyHwWOh2dqSd2dFMpdU+rQwxxGoSR44pZX/9XtsJzecQStItTKoCvvHnPffYPpZH9jJ6+SRIEnzhPg1H9m8jeyk4l+ZX9LKkYTjCiPkj+36EMYL/EX5oeWvptyghgsaySwFsCjyTcEeNxRhSeQgzg0/SgKrsaGQv0oAkyi7oGupfbFgYLnnIhc5qb/SjsknBn2j+JuYxlFlkTVEh6Utrd7Up6+snyiMqxQGy7JkvA5PDdmemWEDZNsiKTZ2s4yQ1hu2x7Ovo4UfmgGZn2DVnWNCXOxud5RMSsm2skqZ3VR8h5M2nizYfbXgsC5kf9KMyJ2TN4u33bMTOq+mRJ2CwsrI/sj6iPM3+VUnLhrSgKaT+yjxpdUUEvw0R7BiboCGR7JmW6r8EJeeNIRu9bBXNJtvIDyeSJ/+siLgoVO1mx5QLHDIWTlyTLrjNmda9Zp3rtaz9b5xBt46Nj+e41PzYK9fAN5uUyprXj6PoBIRbA+KBgtdV54lPxVmkaSZDlTnz6Wym0GmK5UK0Y3SaSYY2KqNCma1JeJfxNmK+r7qc5/yDbhQ4Hi5wO9S2xT5gkv6AbKrVPUQX2AIZhe9AL9e7LFAOZZb2GhjTPhiaCLqh4KY1TTvHh4N1cHTyu9vs95/wNfdVia/TXviaV5PTdTYAKl4fqAAoQL2ghkjR/W2wmBI5Z/GFQHWeZq3pYLCNp+7wuM36wA26IWEue1cqdUbIHQ6gnLNDAjTvA6CIiC2Lv5vVUC2KX7QBss1KhgWXkkdgHjud99/whurHNO7zfbZAmVX099zv1vtvEj3cyzI2swbA1UKngf25Hlrcq7+LNpnzLtwquNlrmO28nsg0L69SmbTs2elWzemPgjyDMq66HrwmG7Zvq4wgle0bdhoUUWWPONdPIwn62OnNT3IEu6iOnoP6ocgQYNWPD77SPRj+5uIJvpZMHrri1rLtruKmxlfFDennRnGrHmz0A1z9qOOeHIx0SxIKg/cnkHoMKHxKGiU0lRpFpqsRZKuF3p6BBzDaxT6LWMz0GofRZqe6Ab5Fq50qJXUtexarhUc1IXci1jklP75O+U4GY0pSqRr+rMrtYcgwblUjeeY7QVahyrkOSLxVP0jsH4s/kvhJiU5t3xIWT9riTkdEWo6IpijJwlAFyrQydTgN4St5odBxkUZVwTm2muO0/5i088ApxuRs1ktMWmiQ2aR+snO3fPz851ewWRdOI+j07O8s3fvFXUHkr8HbVJRCAVWO2QaeYg5tq/y8YS/l9IPt2B1kwnHbscUXYju7MWxR/9i+lMNmWKin76mHsmn1GsTQUQE7uK6Bm+UR/sjyyPsA8sgE26+kj+rHQUAS2LZJxuPr10hteF6zSKqfDz3sYtXK6+Z4Qck6uH6l9D+jN4hUwvVTIJBFWmjszVcK1akvQEcJFr7JVAtAFuUwx5zHRcmSqhIruia6aMR1RT4DgRWvpRnCURntbl3MdAib61Mz2Ppl1UwbnrcjZxruzfwqcuZ8cK9czzRcC+pdz1yTesl3y6fES19bsiG0y5svEZ11XaV1r9UDDlZHEHqaRZ1Blki3D2atyPqpiSdHBrXh8sb7CCZ2WiUnmmD39J0EZ7irX97wN7+63PDJsYKSLEkVPxIqGDSi1qnc+u3V9IEAvH38zj+6+TjoeLcGDyRfL3yb7MX74P8B'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card collection',
				'7Vxtk6I4EP41fnQqIbz5cXR0rq52t7Z2t+7qPl1FjEoJhANcZ+7XX8KLAgkjSuK4e6s1M9BJIHQ/3XnSCTNCs/DlOcHx9iNdkWCE5iM0SyjNiqPwZUaCYGQAfzVCTyPDAOxnZCw6SmFeCmKckCjr08AoGnzHwZ4UkkKQZq9BKVjhdEt4dTBC03SLYy5PiMeuP137QTCjAU3yqmg+419eLUvojlQlEY1Ym2l5K5Jk5KWzu7mo7OszoSHJkldW5eCvsm1RA1lu0WxL/M22bGabZcdxWgg2x7anp2cHpQLkykCCMiDryyMCF+kEB/4m4qdF79o6mpr826WjNY2yWuVF/uGVY+z50eZL+cTmSfSNxkwAy7Zfyz6C6tz/l59CxM4TkrKzP0tN8haHrZ+Rr+w6vM6BgZDJtlkYlMW9DGZcZzDDLGQJCXDmfyeN6w8xonklosOXDffCh024Ch4yGv+9xMkgJCO5YpoNXksnfbCK85raTFvUGrxUa+X9P1Ofdet48/HEaNx+7DSvQNfrlGSC1o9P0csQlmCITzQjqWANpsOs0x1qvlOKRBTXcG4A0YeKT9thxlzCLeh7OHgsXTb0VyverarqB7LmineMmlsHuew9XcdyhoHgtemBSo1uq/C+OCFrwtTkMbT0AEbdxr30bsn1/oYvVrpq+KKtxBery1Su6GqwiqPCKinBibcVDFLXvsRdi8qVuxoDTdQ7eEJbm8HGFR/QaTFXsNgM8wp2wIPPMmFHG370O4kinznLFfYMcbLxoy8FaeHc5WMuKNnFSVDEy6asDIym6IkATGdPnfSGdWRFD7W4LeM6rUjbDtIZ708j6JtCxDZEgmQex47fKkzAdyRF0JnIhnegJLS7UAMkJ+eDSIWzwK/5fgMcj/OZWccBkJqgl47dN6M4lIQER0JDgZKY4DYjgqVjaIVAMMBHzJ+YD04z/hdAp4tddflaTwaU+5MKx7jYaDI3UeQlY1OLmaCSCQgJSLyVcp11/hk0NXEvGF1Fm1Q+M2g61zW2oqYnIVuHicSsxzfKzpcJQzyb8IvDrCgZs/oeDmPewgAbxo3kdQIcZSSJ5IVpSBM+I5KVMb9NMO8Uu8KOZB21Mnog/NHWDAPMxvtYXu2Ak5Dfj3q7jgut/STlhsBMSQbY+ZlGRtHNHtDCglPrpuwBoj7sAfRlD7WAKIuXQ9jDke4aVZw/yycm9v3yCSim2/7aR1iEJ7Nf4QCASvwoxQygBmAPuqiC0I1BawPnyZ3eIeUFd0B5T3M0oydmbfeOMWsOJ8HWxDFdqIgEQ/R/Y8GWhAUn29vQYJZBUOMsl5vtx+PBSlKBzCYkWuWZePU0GKJBPBi62jxpjFoJeqTFRM5ZHswUnQ8jtUMp860XnihvXXrkunWhhOTWi2Xstl7eorX1ovvgs4vFfIqm781n87DVoAb29SPOuXHecW8avPQM82L69TmhHkl8yfqV3kxrfcW3BS7Tsh7tq1Kty/yjaLIE7jLV+vLG2oAMjga656nS5N5o5+XJV32DpXkD2mmIyVcchDTig0voB7trqM2WeLslfZEZ60Ru6sbqGiJ6LbsFeEmCzzT1M5/Wt6dUPv+hVX6kwGdiRBdVlu1AuZgmu+fXUSS4gq4SXBnNdT7L0IErMVvsUY9G+yynN9lVK3u/kPVjIcvVkeSWbO3z9t4+XKqFVJtt9EUTXw10JxML/YKUDkjB6lwtpsSU7SYhJOL3iePgKnL8K1j9YMjSw69MyYaXMF7mtfQsaQNVuTwlXPiuc3mSvZxXeHpAPVx4lY5c3rA1bSjZ4Fc95OBcXmuHH7J0mEhMt84CgnloXpF0pzFr8UaGQsHKWHvRqxWGz+Ui5HNcSXLihqmIY6oM2T2TE7Zxv7kJNZtLFYBt+sS/vcB2t4io9vyfz1bdcfZUsnn1Eznk2f6tvyyIFbsl78YTjqSbbf7Z8xegpgtKV/kyAPv1gbKnPJaIrewHw3qA5pj9tcc8nLcrOHyIBX/wBSXP54sOX7OHGyFVILaLhQNMJFsvKOW9CG8rFtZpJtDHdwqH7+Y7Rk8MQ2AOf9vnkl2prKUfpzwYxCyTz25FkpP080nU642D+XyxMIV0qoKgcI6pWJKd7Zaine1OMx6NoaFjbzsCSl4SCfapzLUc25nDhXTud4WpJm/aqmWsnrwSKsA9gsNe3OwDcZB/dK0UirqSvuxkuormRVqQbKhA8hJ7uzezH112ufLdGgTPsBLDOv9+janv5URH/7uJCGkfNt7TgD+//S7YhyeNeO9pHednMw87Pf3HgqJ6/R8a/Ac='),
		
			this.addEntry(dt + 'card', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 344, 254), 'shape=rect;fillColor=#BDBDBD;strokeColor=#BDBDBD;shadow=1;');
				bg1.vertex = true;
				var part1 = new mxCell('Greyhound divisively hello couldly wonderfully marginally far upon excluding.', 
						new mxGeometry(0, 172, 344, 82), 'shape=rect;strokeColor=none;whiteSpace=wrap;html=1;align=left;spacingLeft=16;fontColor=#666666;fontSize=14;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 300, 230, 'Card');
			}),
			
			this.addDataEntry(dt + 'card', 342, 378, 'Card',
				'5Vhbj6MgFP41Ps5EwNs8Tm1nssnesjPJPrMVlSyKQZzW/fWLSKe12rRjdbIXmlbOgQP4fQfOoRYKs+2jwEX6iUeEWWhloVBwLttatg0JYxa0aWShpQWhrb4WfDjRCnSrXWBBcnmJAWwNXjCrSKtpFaWsmVGUKS6aqiBrNeQipoyFnHGhW9Fi2XyUvpSC/yQHLUSXpiXFEd8oJVBCKjNmqmZqIiTZnly+Vpm1PxKeESlq1WVDI5m2PZBj1pwSmqTGDPlBq8Rlq0hebfdoqIoBZBgc9GZwToNwBFusi9ILUtJf5Lt5nTEIwXEI+a1j2IIwLOkL6Yx/DWrO5agpQ1qUDTwFEVTNRMRe+3WvOsI15/kApHe6jAAQnQXQsfv4OW/Fz8zwlVM1MbR363Fbi7or7gbgcVwS2YP/dZkXMeL2GHmmUnFxTIsCqXHiTUoleSrwulFv1NE0C6YQuX1Q4TSgeu8AqtcD9an6kRIcnYI15rkcctd/Dm40B9x+D+5HQeqUV7kC3I7oCy3VC7BavyFjXD3XvGKR1mx4HhERV0xLGRYJzXErxFio36rguXqQ7ZpVEc2T2+kP+hNMY0aTXImMxHpc1arm/6ilJfD6fuPpovSNS9A1ZvdmBMmL/QDPjbAEtrF/UjGmkdG+xzfjBnqOiWKOcQDoGr86F4MAnCBKB+8QpUeR5/TJe82WZgv7dcfgHAFOcN0BYGa7cYIZtvzdlcQOpwkP0A9DOALw4I2A7xKhzoHrzJE03KA54Af2efwjXKak6W+3eb4mI9smzX3mNskidqsioriUmoWLVoE7gpq7YWq2nTS+7qSnB0SBYOBk8q4/mACYx4G9xWK5+rsd2EPv4cBwCgcWpFCJwqVXEHcVjLrlgj/Tg/s34Pvw+cOXz5P68XGCcw8fXLhLXMwUYCCROQB5KDhfsye6Bid3iD9wL0TeJDvkBriwu0d28XvaPeLMyTDylyHqMxyEwHXD/55h352eYCXu/zxsux/+t/gb'),
			this.addDataEntry(dt + 'card', 344, 420, 'Card',
				'7Zlbb5swFMc/DY+bbHPN40a3dtIulVJpz6wcglUHI+M2YZ9+xpiEFFDpmkzCmqNI9rGPL/+f4SDbcePt/lokZf6Np8Ac95PjxoJz2ea2+xgYcwiiqeNeOYQg9XfI54larGtRmQgo5BwH0jo8JewRWktrqGTNjKHKk7LJCrhXXX7MKGMxZ1zoWjfTSdkrKfgD9GpAp6YmT1K+U0asCmY8EBL2k3PWJjPha+BbkKJWTXY0lXnbwvW81i0HusmNm2cWi5KqNWwOvkcJVMaoMK6IO18R5UjLqlliCYKqkUAcrbdH0zNtCl7AUMiVTnMVIi8q5KERgYxNAEskfYKT7sdEMyPccqoGJqibj9961KfFrgOeZRXIgeaHac7C4A0w3FGpADxnoURqdmUut8zssF1OJazL5L5psVNP1vk0Ja4/FJWcR9TgH4jqD0RdP/7KIUmnZM14Icf26JjGPQTLk9u9hNzBq1+uc14UgU7KLqCiv+Gn0QsfLDedWm9FYRzQe4SxWUuPToSHcDrb38IxNEJ0ARqhLTSIH4WLpxHZQsNHfrR4GitbaIR+t5YF08DIvsBRH95eqPu2WzIhbF8wsYwQsS/AWEbItS/oWEbIszgOechb/ncb9i2OQ3YQCiyOQ3YQCi2OQ3YQGh4WfIjvvvz4/jpO/TuJqVuMibPNhNFNoYoMMt2vqqXF5qsuXakwOTgpDfXP2NdmgrgrK/qd33B3nOkctT5xePHqJDoL/ner4BL8V//5L4R/189b+Kvi8QK0bd6/H/0D'),
			this.addDataEntry(dt + 'card', 344, 162, 'Card',
				'7ZfZrtowEIafJpeVEhsCXEJYVKmbBFKvXTIQq06MHLOkT99xNgJOdIJ6clG1Rgh7PBOPvx8vcWgQ3zaKnaLPMgTh0JVDAyWlLmrxLQAhHOLy0KFLhxAXvw5Zd/R6ea97YgoS3SeAFAEXJs5QWApDqjNRGtKInUxVwR4fuThwIQIppMp76SEvaE+1kj+h0QN5MT0RC+UVjR42yvFAabh15pybyoQ3IGPQKkOXKw91VHjQ0agIi4AfoyrML7NnaWE41rF3BFgpKbQToS8T6Z55FysFKf8F38vp9MZC2rFkDwFvQRpNC5sCwTS/wENwG7hywG+SYx71aB+q51Qh8nBIQVuk6zx7wR9Z8Od7zWVixlHA8Ie++P9c08kyoJZKiUxygWSiG86rwJvNfLTLE9tzbaZK3dJti4oZsep2mYFR7xpxDVuMMYYrLma0RToW7yBuGVDL1pAXMx1mCYwtFXZc42SfyeN09CMd4tpQ/bwYBQzU5LiTp4qjQcL3TMwFPyZojHkYCri7foKDrnztNTMg9QblmvzDInJfXER90fsW+u35RwQs7AHfI33h/9Xsyavs2zewSsJ33b8mlnwbBVkkzwkK6Ib8wlPMWGT5lISQfVSltqo0MJ//qtqq+uMBVJ3ap1Kw+/j1y2sXg+rI6TifniSeBt54HLScNc8LfkDNOi8WE9cWkPp/JuDt4eypbxlkAD1nQ+rpLxbLVctGPCfrMfn39JwOICg2729IhXvzBeo3'),
			this.addDataEntry(dt + 'card ui controls user interface', 344, 162, 'Card with UI controls',
				'7Zhdb5swFIZ/DZerABPSXK507U0jTeukXXvhgK2ZGBm3Sfbrd4yBEAEtKB/SJECR4LUPtt/n4JPEIVG2f1Y0Z2sZg3DIN4dESkptr7J9BEI4vstjhzw6vu/ix/GfBlq9stXNqYKtHhPg24B3Kt7AKlYo9EFUQsFobi4VbPCRDwkXIpJCqrKVJOWBeqGV/AOtFigP08JoLHcoenhTjQdKw35wzqVUTfgZZAZaHbDLjsea2R4kCGwYA56yOiysZk8LK6RN7NECvKhc6HeETHZkeOVDXiko+F/4VS1ntC1+vy2Hk4DPTAruraZAUM3f4SS4z7hqwO+S4zya0b7Uz6lDZJIUoDtON/McZX5wbjo+PJrzQyjnWF0FNCa2zF6FV0rIRceTH1QDKprxwjxb/H7LOjbh4kp75Fa/Yq6hiJlt71umhOVh7Mrphm/TnzI3CemiYgziGyq+Cp5uUcx4HAs4dn2BxKzSC3vzece4hlfsaUbe4faGGtOZuEC6tzxvOJwkuDsxwceCCDsg1nSDwhpTENQIAp4/lsB/DcCfCqB/h6k3r4tuMMsOwxczQ999UhJfItc6NgJlz8tEInPOKLsow8UVUN5/XitiWjCIKwh14cj2qfm6dZdmsbgrNFV91aJ5LYdK+FUKtteDwDuzXtezqyLq8k3IFZCsZiQTkASLGyDx3JnJBCbL1S2YeDOTSVsXuQWUET+FZyhHKMHy8lDw9vjXh+3e/mfkHw=='),
			this.addDataEntry(dt + 'card with segmented buttons', 342, 522, 'Card with segmented buttons',
				'7Zpdb5swFIZ/TaTtIhU2hCSXzUerSa1UtdN27YATrBpcGfcj+/U7BpMmtWmSFVdVV9JUcGxj8z4+B3NIL5zmT+eS3GWXIqW8F8574VQKoeq9/GlKOe/hgKW9cNbDOIBvD5+1lKKqNLgjkhbqkAa4bvBA+D2tLbWhVGtuDGVG7vSupAmccrJknE8FF7IqDScz/QF7qaS4pVsltNp0SUZS8QhGBAemPyoVfWodc2UyAz6nIqdKrqHKI0tVVtcIIzPQjLJVZpoNmtGTsjasNm2fJYAdo4JbkfCtiiyr7VVFlqJQW/a42oz9hv3R50ZBc2z61eJJWkLpbyPDwXJit5zrnQb7xA3xqDZKyoliD3SntUtx0+OVYDCQTXf9zYmaNmK5LKmyGG1GehC2yMI2ISXjLBEWPpBK2RCCatuFgOMXEHS5FpslhJ9ytirAthBKiVzzviMJK1YTczzDz7YLulQNVBviY8YUvYGauotHiAVgy1TOj2Ec7nUZHAcOlwmOhHqoGw0sHtDXUlkwUlJmNDXSNo6VP610RDxZ5Sk/4SKBoYnC8qhCFNR2v+lIf2y+42oDOycLyq9EyeqTzmStxobrxYvynKWpHu2EGOC8gmnNg009B/OOaO422GKLHGjR4G3+ajrrD00wWDcYPXhvvD/o7p8opSLywElydjqdRGF3voVCh/5hJ/o3aI38MfIg//BL/jb5G218yj/6kr9N/ijyL//4S/42+Ru9fcrfBLgv/W39h6N30B9Z+kcnEPWCbwP03SLhXjxvFleti6Lu17MDx5oHH7ucbbvn7t50Bz6eWJDr2Ttq/oI+fH8oWHOSAvauKUzwe0kKewW953Gmlcj2w+bgYz2qOB9A38rWsBwHPljaWYOppPUwtzGmDOJYCTvQK5UQ0fRlw1UDUKBD1L2klVgAu6evNya5Vrj+rwetr18s7ktVtSx0bc6qI1aY8kT8gcuf6ppQjyX65FQpQNuZM29PndCeOnHLRDHVrg3Tqp49xXxMJ0eoiLuZTgh5icl2OsOC19wGOatucu3Zpn/MGrXoelzWCHWjch8NIh8y21mKn6KoRt+4HggZal/QTkseCONkwThTay9hOPoAYfg4vlFXfCMvfDvJKyRcJLcuD9sEytczwA047IsM9rgSincWQv2xF0x2/gEWJKdhcHX5TrcsV7K9SfclwIXK93ZD0yA4QWg3A+FK/jn4d+aYgRfidspj2Eb85duWtwRYN/lDHhpn1eegdzJdzAq8Z1ZEwTj6hNPCTsWAU58G/0Ug2Id8GKDR50OO7ezP9fxmfv1rfiBxPB+OzrBn4h75tsN0vdSJOnoJG3WQ0YDD5x8q1NW3f8fwFw=='),
			this.addDataEntry(dt + 'card slider', 342, 570, 'Card with slider',
				'7Vpbb+I6EP41eWzlSxzgsYVlX4oO2na1j6s0McRaJ+YkYYHz64+dOBTi0KbEKRIiVQUZX+J838x4ZoyDx/H2e+qvopkIKXfwNwePUyHy8lu8HVPOHQRY6OCJgxCQ/w6anmiFRStY+SlN8jYDUDngr8/XtJSUgizfcS3IIn+lvqY0kFM+LhjnY8FFWrTiRXFJeZan4g89aKHFpVoiPxQbKYTyRj+PpjndnlxzIdIL/k5FTPN0J7tsWJhHZQ/s6oVGlC0jPYwMypcFflYKlvuxbxDILxqFZkSwgcizn0jBNPWTgGWBMACSb1IAI5L84PVBcWn5M/tPdUakutejVbvCggU+f+BsmUjZq8hzESvcVn7AkuWjvp+gN9kTXah3hmp8SjM5+y+NjcJ4E7GcPsue6hEbqVtSFuUx/wwF6DwKKgZSyv2c/aVH83ehxTVomQlJixwHoFzoA5YPBvNZKZmJLOdqudk6SXYdCINuC8JiFoactifM1+N4IbscfwCY/Lmf5U8/Yi6YfDICu2M1qEaIxSKjucH3fmGtVIAYKuB5LbkdEPV3zO0ItOA2F6uzidU9XtQUkzuI7bGoUYZQw3zAKmxidS/sYoGeuVWMkfMIph04cEn/9lWjgVinAdzDETaIGAAL3rFmXdsTdFoxr8HHoUDoZxENNU1VXBBvlyp8uV/GIb+PC8/7u/S73dA9HrDHWr49McAe9gf2HQSoB7SHBtoQxKvoDMg3LAn38Ve1jaCmiOzIAj+wzM/tfDWT4/4r5XORsZwJJU5LVmrGikEPptioHqjJJxIr6lFNXXfJVpVlZCiL9DfkfPMMuFiHu0aluamGnHvYi2qQPlSj0rczM7hEJNRwFVpoBqZWaCDIM3fLxmTC6+jB7QINbeyPmTQR2s5bB8XVOmUG7++iXk0XTQZggyUgC3EjRDaAi/yk9Ce1+oNXXKdU2AZ04B57pB6ENODXAB+2k03dVXTZVWiz0iH9HniYtYzn98gfbg3gnK0hkFTQ9AyP/wFztdgRm6SRvnTeLFco/3FN4A7RxcA1CwFIF3+uBFvokouBa6b55LrARcC7GLiDRpd7TeB6o4uBa6bUL2uahf6uC7q4Q65Tq015X13s3R0NOEx60DscdA5WRr3kOWYOLPPSogDpII9XdMoewZ5R79+1OkeTGOJRcR2KvGX5OSXoeBopKmeqepzIpuT62CpTtK9oyuSrKHuqpPM3UT1inU4nQzI5FbH2rZOn8u9q/FOtvV587SFBbyz0wVaZOrJV44PHG25PSozMZP0XDZObk/p6J+XiPvg1awQDbMdJgZuTujmpupPqR4nNes1LtE5vPuqrfdTI64Nds+rjuReJoz59mHhzUXZcFPpCF9WPDrvtzzw4azjgOPx1Wi+nHLDdAQe05ClIL/uAWWab/nx6kpIf3+b//HhpuRloj/H+CSK8hs2gkWJ3aIfiap4uFMvbt1+Wlt0Pf3j6Pw=='),
			this.addDataEntry(dt + 'card', 342, 236, 'Card',
				'7VZNc5swEP01OnYGJELSY4zdXJK2kxxyls0CagRyhWJMf31XH7FNiKdubB8yE80A0ttdafXeCiAsq9c3mi+rO5WDJGxGWKaVMr5XrzOQktBI5IRNCaURXoR+22ONnTVacg2NOSSA+oAVl8/gEQ+0ppcBaCu+tF0NC5xyUggpMyWVdlZWuIZ4a7R6gh0LuGYtFc9Vh2CMg7AeaAPrvTk7KCR8A6oGo3t06URuKu/BkpBoBaKsQhhlqQd564FyE7ulADuBhbcZYSNGHpXOEVEF3kwFeJ/yfkQT7sfRoxqzQ8JX1wL+IP5Y55i9jEN0hGPLiFhweS1F2SA2V8ao2rK35AvRlJMwntItdguF3XmcIqShxdkfA0OW6a4SBh7Q0y7RYYUhVpla/o8Q9H1CJL7oIg2SG7GCwfzHiJOMxJkDySiZXDaw8h3lH9Lu4TCNEteGGtltf2o00Cgs8VMJy2zUh2mSYYQqihbMSNNNYgfJfDGSmee/8PVj0/w8d/s1ZafR9Co6g6bpSNPOO9TAGyTVrtfY9+yTaHKJ2aXS6jrX2CuNIy79/Wy/ixOOXnPAE6/8KY/aWqCgG/sR5/6gGqlFnkv4oDVyonMfs3MUyeWoSG5n1/ffEbr7cT87Rtfkla7xR9O1HwT8U+Wrk6j85WWeY1TG4faH1rvv/u/+BQ=='),
			this.addDataEntry(dt + 'card', 342, 530, 'Card',
				'7VdLb+IwEP4tPeRYlAew7bHQbbfSvqQirfbokkli4cSRYwj01++M7fBKKOwWetpUFHvsefj7JuPBi8b58lGxMvsmYxBe9NmLxkpKbUf5cgxCeKHPYy+698LQx48XPhxYDcyqXzIFhT5FIbQKCybmYCVWUOmVcIIqYyUNFUzR5CjhQoylkMqsRqN7+kN5pZWcwdYKmIdWMhbLGoUBTpw/UBqWB2M2IhfwI8gctFrhlprHOrM7or4LNAOeZk5tENnD+qyygnStu4EABw6FbkSiFiITrhGL0E8lVMajghZIMasyIAu+PfAbiCXmaSFWyILASmShn/krqWMobu78kG1Cjk+ZuBM8LVCmZUmmSjblRTqSWsu8icLKvkJC8ATDjWhCOlaioEJnvxywRBBzhoXRG9UZ1/CMehRAjXmKskzn4m/oDLvpXO0oHCM3im6sUIFgmi9gR7uLcefxp+QYyNrd9dpQoyOTpALdypF1pCelTb+VNs/zF+0ypzNlEDHtCN7Kjlvz7CZCcEoi5DyOBZyeC23mz0F19G9vrqtS7+V26F+A2UGL2bvx5OnHd5QFx4pl9yt+oB7sZULfPHvMBx2Z8TG83QzatPXPQ1vgX4K34WHejl5y/3l7k7flrumL0vjpeIfSefnmy5S6ql6ax6I3L9ekNhUv7OpZ1tX3PeDvKmxR0VS5bSqC81Bx3VDacBEMLsDFTYuLJy8csrw0iEURIZeTU/zoDC+cHg5Gc3SLpn3BZ3QZ5rKiwEspOF5gnBWVXc5osVQy5xWSSfvo0kQ7rGhWp3IuaAkbZYRKkfXfck4gy6IVCDnJ2MLY4Dl9JUgzJo4AKDE267WSIuag7KSQ2jCGhOEhzNG1cfxiI2Izo+evyOmeO7P7hTbH0p18kgGFXkP35lRunOEpyXXMNGGHlQau8PsLrGxgxqHP4tiBSwUJRwXNdU12XkFJ6k613FgzxyXvfs3E7KpBay8WZXtbezKjHtO/jJM5weZFTOnxgJM22QurqxvNhBdNiDVbNVKopvhO9g51QF11cLtW9jcNTGcje93vbGc+qHUJbofnuQQb4+95Y3G6+e1ot2//tPwD'),
			this.addDataEntry(dt + 'card', 342, 386, 'Card',
				'7Vddb5swFP01PHYCO03Sx5auUaV9VEqlPXtwwdYMRsaEsF+/i3G+ClHIyvayOUqCj+/1xzlHF/BomG1XmhX8s4pBevSjR0OtlOmusm0IUnrEF7FHHz1CfPx65OnMaGBH/YJpyM2YBNIlbJisoEM6oDSNdEDJWdFeaohwyodESBkqqbQdpQ+P7Qfx0mj1A45GwLZ2hLNY1QgG2HHrgTawPbtnC7kNr0BlYHSDIbWIDe8i6MxtlINIuUujy3kHsrID0n3ugQK8cCwMM0IvMxKzkkMb7nenO6bnlIZc5dDnLLENcQ2l+Anf3LFG00N+j56FwzRIZsQGTuZ/D2Wz8SbCRFGULScFaIErgT6gLwdoFI97703E2szvk7bDRpPmVnhRAhcm/m4/zpnNaXc3gUqSEkyP8/02R8lw25PhVRgU4K0WSJJ1asEikaefIGmPGviDfqy5MLDGyDa3xjKFGDeZnNaug8yTaZi//QvMz3vMr6vvHFh8BfeJys2Rt+9s+zc0oX9Ck0VPk5WGhqsqR1X8WGxEiQeQjT2hlAr/IyVjC9Qqj0EnlbS9jOlU5KzrJEzjb1WoHP9gG8kqRiE/XHWPGBKQSZHm2JXWEm8MMuCPmW2HyFb8uQtbo2HaPh20z7mb0WDFbW0kIibv3faMmtBtzUnCpdtXQMj7zOeWu9lPNKnflj2/3Yevz1+/IBZceqa66qHhnBGs8m6JqcrE4krhFgM1g5JJasbypGTc7KrTpBrendeQ/NdwAg3n04uI3cPrUhd+/Db1Cw=='),
			this.addDataEntry(dt + 'card', 342, 356, 'Card',
				'7Zdrb4IwFIZ/DR+XYKtjfpzskiW7mLhknzs52GaVktJ52a/fgRaVoREnLlm2GhN429OW5z2nAY+G08WtZil/UBFIj157NNRKGXs1XYQgpUd8EXn0yiPEx79Hbnb0dopeP2UaEtMkgNiAGZPvYBUrZGYpnZBxluaXGsY45SAWUoZKKl300sFV/kM9M1q9wUYPFC3v4SxScxQ7eOPWA21gsXPPheQ2fAtqCkYvcchcRIbbEbTrNspBTLgLo71zK7LMCpNV7BoBXjgK24nQ/UQilnHIh/v26TbxVDEkKoE6s7hoqGvIxAe8uMdqjId8D0/gNA2SGTGDyvzHIOs2TyIMFGmWM0lBC1wJ9FodrqVGHFe51xK1rl+HVmqNobkVhkrgwsQv9+Myc1m9LSdQcZyBqTFfbbORDb2aDc/CoAFfvUBIRaambCySyT3E+aN2/K35OOfCwAhH5rFzPKZQ42Yq203XreRJO+R7P0D+vEZ+9P7KgUUHsI9VYjZyu1+0v+EJPYUnwa89x5eVgH2nep8cZ4lb7aycp1UTLmomXIbPd0+PqHX2vmhgQYwQa06UHurIl2rqFq2c1C3ZVi0FB9oYbCksSloprItKXZ0Fpyis/m5Pyb+nJ/e0PJaP8RRv158YdvjmF8gn'),
			this.addDataEntry(dt + 'card', 342, 386, 'Card',
				'7VZdb5swFP01PLYCTGn32NCtmrQvKZH27IULWDMYGadJ9ut3/QH5wDRZs+xpRpHMse/1zTnHxgHJ6s2zpG31WeTAA/I+IJkUQtlevcmA8yAOWR6QpyCOQ/wF8YeJ0ciMhi2V0KhzAmIb8EL5CixigU5tuQO6ira6K2GJKWcF4zwTXEgzSmZP+kG8U1L8hL0RME2PVDQXawQjfHHrgVSwmazZQK7gZxA1KLnFKWuWq8rOIIkrtAJWVi6MkMSCtLNAOcTuKMCOY8HPCBkxsmAKuYjDUkBnVpQwIimnXQU6Q2j/8CuMFaaNGGtEo8kqRKPm7JcOx1Lcu1tH59bMsSXlj5yVDWJKtDpVS5esKWdCKVH3VVjsExSanijdQQsdYxEJHS723RGrBaIuMTdxngnriimYYyZd0hqdi1ilav4nAsd+gbcHAafkjnpQAqeKvcBBtM8DbsVvgmEhw3I3Q6I+RhRFB2rkmqHSs4yUjIw0X/1QzkteEyFjykm+55d3ph1aIzrHGjXLcw7nu+M6UpO37WV3bl2q7d3DFZS9Gyn7mC0+fv2CWHTq+PRv+okT4sgJiWlHykceZ1xRt8kteh96DuQLN6irzmnYb9ckvIKm6bSmJz+J/zV9g6bpPxD1/vTtxvvhrjelvpHdlnXOb1ftIHF/NhLffSc17UIpDgMmhYnSsTAPf0WXG3K02/rT7hJh8HV3pbXT92+8vwE='),
			this.addDataEntry(dt + 'card', 342, 334, 'Card',
				'7VbJbtswEP2WHHRMocVxmmPsNAvQDYiBokfaHJmEKVGgaCvK13eGpOJFMmq0Tk8VYEuc7Q3ncUaKsmnx8mBYJb5oDirKPkXZ1Ght/VPxMgWlojSWPMruojSN8Rel90e0idPGFTNQ2lMcUu+wYWoNXjKTVgGKlhpqvAkw4G1q26pgUwtW0aOBBaJMcqnUVCttnDbL3YXy2hq9gh0NuIs0gnHdoDAhd13aHaPYXUH+LF8JKM26dUiC9BswVi6YulVyWaLM6opCV2why+VEW6uLYBlknyGnoiTjrWhGPncpGbEQRjmrSSOkhWe0IrgGCUKZsIUKSYe6YQrwcrT2ThQK/wC6AGtaNGkkt8Jb4G69mwC5FMEtHY+9kNVesHzz3VKJD4HNYWazHrPP67kN5A6yijuxfTpu3LVPR5KeQEchOVdwOiMGaoz+I9QmORMF6R9SEGQGFLNyA3vxh2gJEN+1ROQ0br3F1c2+h87zGmyPxrfETmJ21GP2KUrHrKhcTbKMyCoIFH9WYJU/4MNkjbAYOlZyRSeg0DXlWWklkTXJytqrBSkrowtZA3d2dFIwDis77UKvFalwXGFlDEX/qddUVF32EiEQwTYuhizoluPJwnOnACrMzaPWWnEJxi9KbR1DSBBuwm3dOuC5z4itnF/cEugBnLOekzHXYeczAZR6A8PGS70Fw10SNGeWaodjDS7w/gitT8wBxozzUFxdEhAraW0bivMKRtPUtHobzW2X0OOGqdVFV62DXIyfuX5nzp3Tn5AUTrF1yel43OOiT/bG+9rOM5dll2LD2k4K9YKm9pGuH+q13Y7Ptk07OEIvR4Mt7CWPXWcl/66Dk9HHs7TwdfwOLXzVa+Hb6ezp21eUJb972+6/VUs6hMdfwQfDfOSug+H9zqO23XPYoe16gLXRX87dkF2gPkBfdkfhrByOj3OY/ufwDByOz08iLrff1t5899P7Fw=='),
			this.addDataEntry(dt + 'card', 342, 246, 'Card',
				'zZZdb4MgFIZ/jZdtFKhdb2u3Xi1Zsotds3oUUiwGWdX9+qHQD1vNmtQmxZjAezh8vI8YPBxl1VrRnL3LGISHXz0cKSm1rWVVBEJ4yOexh1ceQr55PfQ2EA3aqJ9TBTt9SwKyCXsqfsAqVih0LZxQMJo3VQUbM+Qy4UJEUkjVRvFy1TxGL7SSWziLQFuaCKOxLI0YmAbTmXDVknENnzndNKOXxgKjueWA0lANbqmV3H7WIDPQqjZdSh5rZntg4vbBgKfMpSESWpEWVkiPuSeHTMWZ1G8YvtewpC1Xhu3krvFKQcF/4cvtZCzDUL9hdSfhP/tmxGoKBNV8D53kPkvdhB+Sm3UcZ5scxjmkyCQpQF8xOK7zJizkfywxLRg03X37TbaMsiptzt40zWIxZUCVHiJzgTFsy60AcD+AbsIgDneGOzSCl/touKknAZl3Zp/g8AF4ZmPg+ZZym1G1fUJCAen53fjjEFqgC0DzBwAKxwCkIBf1E9J55Pkhi/GPj2mebgC2+/kF4Q8='),
			this.addDataEntry(dt + 'card', 342, 342, 'Card',
				'7ZZdb5swFIZ/DZeVwE7S7rKQtZrUrZMSaddeOAFrBiNzmo/9+h2DIclwFLI2dyOKZL/nw9Z5jg0BT4rdsxFV/lWnoAL+OeCJ0RrbUbFLQKmAhTIN+DxgLKR/wJ7OWKPGGlbCQIljAlgbsBHqDVqlFWrcKyfUuajs0MCKUsZrqVSilTaNlcdz+yO9RqN/QWcpdQnWWZd45Bw2j9MX8rdNG7Fu7pa09g0YlCuhHpXMStIKmabWGNeVWMkyizWiLpyz015gjZ2Si1RvbXKabHOJsCAfm3xLlSYtx0I5sysALQi7s0VsJFfBZ9AFoNmTy1ammLcefOIql4PMcvxLFHUrZH3sgQkNHBY/Ij5AtJRIxWBhpqFuVjRwJbUehJeatgXFPQlsOoT41DynEGmTlyGirkYRjGYHaWlj5tE9KcKlUY1XbKCmtX84Ah8FmvlB708CLmGP+EMrGlAC5QZOon294Fb8riVtpF/urk/Uxej1ugYcdE+/01ENNRk01OLtJ7qe8jYTVQzHNUI0phGuOM1NL9wGNf+3M+0u1PeynU5uQHY6IPuYLL+8fiMtunRD+O/vo2vDf6WfNoHLHnma4obIzp7Oh9BzJ7P38XO7cwezO6mT8AY4Z+dxXnxN/8d5Fc5Ps4/nSdPDh1zrfvyd9wc='),
			this.addDataEntry(dt + 'card', 342, 216, 'Card',
				'7ZjdjpswEIWfhsusMKYke9kk3b1ppUpbqdfeMGArBiPj5qdPXxuGZGmgi7TJyq0KioQPcxgzn+yMCOiqODxqVvEvKgUZ0E8BXWmlTHtVHFYgZRCFIg3oOoii0P6C6GHkLmnuhhXTUJophqg17Jj8Aa3yTRgJrVqbo0Q1ZTUH5wkDuqw5q5yuYWOTLDMh5UpJpZtQuly704UZrbbQ3SlVCS5YleZF8ENzoP4kfrrH2tw4xvwu5w60ERsmP0qRl1Z7VsaowmWp2EaU+RLH63hxFj9DZtDP0CcbqQuwAnHZcs1SAb2ZJaE727dN1d5F2sGeCwNP1uzmtbfYrMZNIfE2VtPOFQ6jRBoJcTyCKsDoow3Zi9RwjEgWrY2DyDnarNqKrG6F/OQ9A7YXyHiYN73gfYH6z3Sz5hijq6G2DL/jm0yuSDRckWPP8Fp9YtQ0SGbEDnrmoZphwq9K2Hmcss2653QWlWU1mIsin+Y5qe7x63UfXGLFIXd7w11epPKOA9NmdGH1OSXNMRUAHQbQN4ziwD2mR4O8kQamnpE46WWfUXoDPB+ugedZqW3B9NZDQiQe2E/C6xC6J78Bim8AKLkGIA2VPHpI55brJ47eYfnM/3cRvnQRnWEeT/vXvEpXsfCyq5j/813Fvd9dxcLbXfF9ugoSet9WvA3RX99WEOJ3X+HvCrpFX2GH5y8fbfjLDyO/AA=='),
			this.addDataEntry(dt + 'card', 342, 146, 'Card',
				'7ZbbbuIwEIafJpeVHDsguCzpbrXSniR4AZdMsLVOHDlTDvv06xMlIVCoCnc7EhL5Z8Zj/k+DkrC82j4b3ogfugCVsC8Jy43WGL5V2xyUSiiRRcKeEkqJ/ST065ls6rOk4QZqvKaBhoY1V68QlIVEBVYSYCAkW9ypmCx4K8C1koTNWsEbpxtY2lmzUiqVa6WNL2WlD1eGRv+BTgZ8hAMKvbFi6tp1jZ0i4iPqc/nXDaLZ/jneyOXXYFAuuXpUclVbDXXjjm74UtarmUbU1f6+QfsOpbMmHR+khet5SkdW4fEY5atmGyER5rbKjdtYTFYTWKl46eievQJszxLwUrT/GXQFaHa2ZCMLFKGCZZGDALkS+7ZsHETeBmH11nsAar9Epqf5sgHf+esLvofY/hIc4pj66ONI2RU4KlkUCq4ncgvD6UXD6d7bruFxVYgBxVGuoXf+KQhxxG8t7WRKdqFiNO136LJsAQfQ3i52FcdswHEA7v11fPExWMda1/BJW/sNHZMnZOjx5JMex2EP08gvep6O7+D5aOD5Y7749uun1dKL7h+tyUnXz/1jHu1e5uNo19L77sruI1AZvQnUSQ/pQ0buwHR8nunljfrP9MNMj/b0JlDt4+EFKZR335/+AQ=='),
			this.addDataEntry(dt + 'card', 300, 176, 'Card',
				'7ZbbbqMwEIafhstKPhC2uWzobrXSnqTkBdwwxFYNRsbNYZ9+fUoTAjTZ3eSuliLBPzMe839MRELzavukWcO/qwJkQj8nNNdKmXBVbXOQMiFIFAl9TAhB9peQLyNR7KOoYRpqc0kBCQVrJl8hKAthJFiJg4YQbM1OxmDBWg6uFCV01nLWOF3D0vaalULKXEmlfSot/XJpRqsXOIqAX2GDQm2siF25qs1REvIr6nPx2zUi6f4+nsjF16CNWDL5IMWqtppRjdu6YUtRr2bKGFXtzxu0b1A6a3B2kBau5hFPrMLiNtJnzTZcGJjbLNduYzFZjZtKxkNH9+wRYDtKwEvR/idQFRi9sykbURgeMmgaOXAQK74v+5QFkbVBWL3VHoDai8h0mC/t8Z2/Ppv3ENsnMX0cU7+6ODC9AEclikLC5USuYTg5azjBqG94HBWkQTIj1tDZfwhCbPFLCduZoF3ImEy7FaosWzA9aG8Hu4hj2uPYA/f+OD771RvHWtXwn7Z2C45Mxnjord6L/+pybHeHyX2oibbj7Aa2T3q2P+SLrz9/WA2fBXAyKYPGj/1pnoxf6tfJuOHbjstujOv9wOzQ61DtIr1L0Q2YZuNMzw/VB9O/ZjrNrg/V3h6+kUL68SfUHw=='),
			this.addDataEntry(dt + 'card', 300, 224, 'Card',
				'7VbZbqMwFP0aHiuBTTLNY0MXVZpNSn7ADZfYGoORuc0yXz/emoQADTNN3+ZKSPjczZzjixzRrNw9aVbzbyoHGdGHiGZaKfRv5S4DKSMSizyi9xEhsXki8jjgTZw3rpmGCsckEJ+wYfIVPLIUKMFAHDR4Z4N7GZw5azjY1Dii84az2uIaVqbXvBBSZkoq7UJp4cyGoVa/4MQDznyBXG0NmNh0VeFJUOws4Avx2zYi6ds67Mj6N6BRrJi8k2JdGQxVbUvXbCWq9VwhqvJtvx77CoWlJpkeoaXNuU8mBmGhjHRR80CP6QG7QYodFPh9AlUC6r0J2YocuY+gaSCag1jzkEbIrQdZ44H1IfeomHkJovULSDsCLl5f8D0NzZdgl++ZszbfCR3BdynyXMJ4yrdcICwMbgtuzcE3GMdShmMwinBykfDkS9xDeMA0SIZiA636fSKEFj+VMJ1JvPcRk1k7QxVFA9gR7bCxUTqmHR07wr0/by/OOvNWqQo+SGs74ZTkSc+pPoD/ynJod5NMw3gE2s3puT7tkw7td9ny+cd3gyUXBTiblF7ih/6KZ+OXOjsbt+Rzx2U/pOttz+zQ66jalvQmjT9B0+mwppeH6r+mf63pbHp9Uc3yeAny4ad3pD8='),
			this.addDataEntry(dt + 'card', 342, 272, 'Card',
				'zZVdb4MgFIZ/jZdtFLTr9dzWqyVL9gtoPQopFIOs6r8fAv1wtWkT7VISE3gPh4/38YQAp6JZKVLST5kBD/B7gFMlpXY90aTAeYBClgX4LUAoNF+APq5EIxsNS6Jgp+9JQC5hT/gPOMUJlW65FypKyq6rYGOWfM0Z56nkUtkozm0zeqWV3MJZBGzrIpRksjZiZAY1ZRq+S7LplqzNvY1GteA+7I8DSkNz9UpW8vdZgRSgVWum1CzT1M3Asb8HBVZQn4ZevEgqJxTH3JNDpuNNGjYMjzVsbduFYTu5g4nsQTftQXE4YM9BVMCJZnvobTDkmd/jSzKzNQoPJ1q4jLY/PCwg87wCfWH58aB3UYhvU8hIRaGbHrpf0CIRTdGV2rwQGZ9TIEpfA/GH2sK2kQT6Cec8BnBEy0lozBLcw4GXD8CRTIFjLeVWELV9CiJRPFAg09THLIl6RJaPKJDFFEQUlLx9Chz/WCARTsbzMMPTG+6mnz/xvw==')
   		];
		  
		this.addPalette('gmdlCards', 'GMDL / Cards', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLChipsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library chip ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'chip', 170, 32, 'Chip with text and icon',
				'rZXfb8IgEMf/mj5qKli316mbe9gSE5fsmdhrS0ahAdS6v34Hpf5IdXZxNE3gjruDz/eaRnRW1gvNquJdpSAi+hzRmVbKNrOynoEQEYl5GtF5REiMb0RernhH3htXTIO0fQJIE7BlYgON5UPDVmm0vTJpQDZ+Y/ci+E3BKjfVsMYKU6bXK/7tDEmMS2O1+oKZEpiCzqWS6JlmXIjWFBEKfqBdq41MwZ1k5EIrtuYyf4PMnZyMXaCSNmQfUVdM8FziYo23A8w23RXcwgoD3ZYdUkRbYUsRUoYCS9C8BB/hzeHOoC3UV7l5U4C2AIXxeo9bdjy1Rdjx0LCNC+B5EcJoIMpMs84PoUcVcBKEuCwK7YjSUSFlpvDkPPQgSVnnrpGGeZmK4cZ4Qn0EmfjRFwy5CaZlcImLBsEs38JZ+ntgjW/DavlgIK+MA1CddESwnjRJL2hPiXtcU5rKfwrzjNdOkrsongfswyc8TJr1afNNuoxbW2/Gof5ScTzWofigZRrKDx7PM6gsM2A7Gh1u0Uu25D96vO5ohcJkfhw8n4EZ6avM+FdlkjM0XV0uyDL5c5Pj8vgLaOCe/iF+AA=='),
			
            this.addEntry(dt + 'chip', function()
		    {
				var bg = new mxCell('ANZ Bank', new mxGeometry(0, 0, 170, 32), 'shape=rect;arcSize=50;strokeColor=none;fillColor=#eeeeee;rounded=1;spacingLeft=24;fontSize=13;align=center;whiteSpace=wrap;html=1;roundedPerimeter=1;');
				bg.vertex = true;
				var part1 = new mxCell('A', new mxGeometry(0, 0, 32, 32), 'shape=ellipse;perimeter=ellipsePerimeter;strokeColor=none;fillColor=#009587;fontColor=#ffffff;fontSize=14;');
				part1.geometry.relative = true;
				part1.vertex = true;
				bg.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Chip with text and icon');
		    }),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'7VlRb5s6FP410Z4aGUMIeWzTbr3S7lRtk/Y4ucEE3xiMjNMk99fPB0wCARLSwFpNs1QVjo/N4Xzfd7BORvY82n6SJAn/FT7lI/thZM+lECq/irZzyvkII+aP7PsRxkj/jfDHllkrm0UJkTRWXRbgfMEL4WuaW3JDqnbcGHyShhTc0ci+S0OSgF3Shd7/LmCczwUXMnO1g2yAm5JiRYuZWMR6zZ15FJWKblvDzUwm1k9URFTJnXbZMF+FuYc98fJlIWXL0CxzHRM4SXPDcr/28Pb6wiSgORl2LRmWjuXWRpflRMTqG/sfLJat7wlnyxim82iPczbHlje5a8sZbFZy/pgNcE7IgsXLryYDzsH0XSTw5CIQEzPEKWmqw/phMgkem5Ap+k2vA5eNJqG2hSriZroTYPh1gGEnt0nKiWIvtLL/NSA6r2R0tF2CCsfLyOdjJZKfz0RexWS7OTHVBTsj0vEkvy+lzXHrWbMuzZp5/pNgOqz9w29muPL4m2l1BxEEKVW1rO/fohMQkxoQcxElIqUXqalZFVUJPcysB9duZHhJjBid11MunpuybDkN1MHhc3Z3P8Vvq57J9Doe7Koi7BV3tw8BFlmvoF//whRQ4675njTn+4QMrSYZur3IsJBIoUJvADSmfaCR0tjvqMU9QNfA0blGFm9T+bLgfmqkfYSOZQ0Aj1eD57u4oj5qAGg2TgBzskhqZteK5CwblxfJbK+3LJJOL0XSGwL3WR13SV90xjF6JLHWW40ER7gTuTCQTVBHae6ZIcU69jNCWTXQsNNwhD0DotnviUqmU0DlJdh6lxfk4jxextruR/RTdKR5dwDsLdRHTV6nVHYE3s0GkCZNMvbcB2wLu3eDaHZefrgdkWvO8kXJLWXqlutIMfpCeSr+iqRdJHg4kWDk/Q6V4Heikk5dC+vtNFLvWjxx/QnRpiD7nqiQQiSUruAUd0Yxx6S+/Hhx/kjwrvoQPR0SrOK02K8G6s2MRzbCep3LIbnPGl93CVf/aK//1ilEtCGxAtoipU+SaBHSxQq2jCE4IABKKRCCBRC9WEM+iJ9NQr4Swx0VMvi3ThYi0vgdGDTWlz9gA5373C9e5Q4iyHJL/Px2nRQxfCEJgWWfISFoDfuuYrEpBfEBAuBsRYslS7EPd0M/ZEmJSDat2UPli8ZKxOn4Ejo7XeqAMTUREvjHFoTfGoIrOAa30L2d6rnlsWCg9fuY7iDUD9W92RBUn1zXie5S4VE2GmG5JvG7yoKzMHi9oHDjDNEtsHpp3jwTXXJONW/acHllU8c63UZA46NGS+OByRmu2zodvtlqdejzFFjplSxJQR9J6TBqrKXz6TsC8M/Hz+uOX1vn583Qmf5p8Ojbw0+wuXv5F9pf'),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'5Vpdb6M4FP010Tw1MuYj5LFJO9ORZmarnZHmsXKDE9gARuA0yf769TWQQIAEEpN0O0hVwV/c3HPOtX3xQJ8Gmy8xidzvzKH+QH8c6NOYMZ7eBZsp9f0BRp4z0B8GGCPxN8CfG2o1WYsiEtOQt+mA0w5vxF/RtCQtSPjWzwockrgUmqOBPklcEkF5TGdi/Mnc8/0p81ksm+pzeUEzHrMlzWtCFoo+k+xVNOZ002iuLMps/UJZQHm8FU3WnsPdtIVu2mk3l3oLN+tmGZnhJEkLFru++18vbjIH1DtDrzhDE7bc66ibT1jIf3r/Qommi2fie4sQqlNrD302xZptTpp8BoMVGn+WFzSOyMwLF39nHjD2Rb9YBG/ODclsBjtjmgizfmeehBZr1+P0p+gHTdaChKLM5YGfVbcCDJ8HGDbSspj6hHtvtDT+JSAaZzI62CxAhcNF4PhDzqKXVxJfxGS93jHlDttMpEMzfS64zbCqXtO6ei17/zPzhFm7l9+Ncen1d6PyCGw+TyiveH33K1oBYVaAmLIgYgntpKZ6VZQl9DjWHi29luEFMWJ0Wk+peO6KsvXpnO8bfJNPDyN8W/WYo8t4sC2LUCnulgoB5l4voV+dYXKocVt/m/X+PiJDrU6GlhIZ5hLJVWj3gMZIBRoJDZ2WWtwBdAkcrWNk/mtKMwtWEyP1A3Q0rQd47Ao8v9gF8VEAQOV1BJijQVIwuxIkx/LqHiTlWLcMkoaSIGn3gfu4intM34THMXoiodBbhQQHuJN4lkFmopbS3DEjZqvQkYTSKqBho2YJm3V4prEnfiONu4Bnd4+4+YK7CKauRtUjdCBqqwdwNaQi6K4SGrdE1pIXsCKJJD0e5t4GRm8H0fi0vnAzIpcs1vOYWvDUvS8sxegH9RP2R6sA96cCjOxryAC/Exm0yjtotxNBNe/w7ItJQBTN5YzAXQqWULqEddgJSRyytvsC4fSk/q4yCYqmeS1f76nVQDUd8eQNsOhn+eDcV4GvtYC7r6LVP6sELFqTkANtERdrQTRz6WwJQ4ZgHBAAJRQI4c3BerYCfxBHVoK/oow73PXg3yqasUDgt2fQUNz+hgGE79N24TJtwObSt8RJH1dRbsMPEhHo9g0cglYw7jJk64IRn8AA31vSvMuC7cxd00/SKQGR1YI9NH4TWLEwGXahs9EmDmRFdYQE/nkz4t9nBOewkG2gezPV05KnnIHa9ZhuIKSG6va4D6qbl+WSO+0uRV9H8K+ISBEjRSjgsVGz+bfVJOFMqzQH233s/jWrf0wQmtgyAa1iDtDM80AZqZiHR7dar7RzjdV5DanX5K50Nbkr7XAj1Qt97ZoccsjJDAwJSVBNJQsH8tMZjX0YqWQ0DueIV8Y5CyrLINNURfjjqBrVlFcd/fMd80X0r+YkuMxJvLgDA9ENCSKfDsVioo3TjYucnk7MMOxf0JaDMyx0MxD0K6KAz80diGG8KIEoExU2qFlpYc/aQxa3yX3t07g1W12MFKVxDz51aaiHQIU1FVPHpm67tptez/zikfqxEZzyIsSqQFOzDLUVsBy/76n25Gci/eNNtjXHH9L4f0b419t+RUA10T/wHAfG7i3aH0fXNq8Y7Y3/tw5s4+PJoLqNdeUXmRf+Z+lAM9AVhXCVjSpcyvMF21KHkzkcW0kK587ohftKdsCvROQrj53daMLl3BXO8eUnGh6cs6j92mL0d9hq1P9Zq5pzBI2J1TM3CrcE8OPjN26PX9PBj5uhM/po8IjH/QnstHnxgPZ/')
   		];
		  
		this.addPalette('gmdlChips', 'GMDL / Chips', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLDialogsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library dialog ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'dialog persistent footer', 280, 472, 'Dialog with persistent footer button',
				'5VjbbqMwEP0aHlsZcwl5bGmal2w3Uir12Q0OWOvgyLhNsl+/NhgKMXRzASlqiCLBeMYw58wZbCwnXO+mHG2SXyzC1HImlhNyxkRxtt6FmFILAhJZzpMFIZB/Cz53jNr5KNggjlNxTAAsAj4R/cCFpTBkYk+1IUJZgpU7sJzHLEEbZed4Ked/XBFKQ0YZz12dVX4oN8HZH1wbwflRTBCxrTTa8kLfHHOBd50J5Cb99FPM1ljwvXTZkkgkOomgSBIkmMSJDnNHOhWUFYa4iv3CQ55oSNrhcQx4pozFEhkI3sjdMzHAkokoXFRKZInoAyVxKkfWJIponv4GLUkaq/x9hR9LxYL8VcEQlNd6NgUQx5kcfdOpKss2IQIv5CzKZSvrRtoSsaanIArPQ9TXNo4pEuQTN+a/BGXXQHkhYUM0h1Y+diwfqwNojecMr0Qd01rlBUD9mljb9lfoK5MQPvnXBrZzKtj6FnNG5J0h2Dc5KyPYapVhYZBTPdhRfHkGX5PdUrqonDt4qoPvNXQAu1m8WiX0RM54CHJ8U0x4+cGJ2B/brN6ZEGzdTos2PWqXJ69FWF0CvCoKvX4otOEQHI4MDgMA7+2dtE0e5if2wrrsrlpVbk+UjIagJDAomaMs2zIenbsG+OadBcDYD4If2vWgPQQ/Y3MhOwrP7XhVewP/lVW1bLsZ+hxvAPrKmvhuI1LuPShJcbXHKMFVy4iUzdA7LrE09iDf0HIJ7joA3ANvpKPqVLjBcFQMsrqzbXMFkcgtmwKjo+Md7ApNZqjiZc4yIghTguMFFpUQZwfjVa9EWqE0V99lPVUdbXXh58fB29JVdcI+0ijf+ub1pAXfVKz2mWNOJMaY9yzkFh3DC4tn15xmX5bkILKGXbWEok+ULiW4ELCNYj27+aqq2lLOtP1D68wbpGeZH2rCh5dwMjtmP+q0LIy73uidpTLgi70ZsG9c1TgceS1LatgLh3e232TxzoVDsGh+CAp/v7xMwtcbojEYkMZy7j5ZlJdfn6sL9/rX7H8='),
			this.addDataEntry(dt + 'scrollable dialog persistent footer', 280, 345, 'Scrollable dialog with persistent footer button',
				'5Zhdj6IwFIZ/DZdOShHES0XHG9c1cZK5ZqRKs4Wa0hl1f/22UBBScfygG5PBmMBpT9vzPpx+YDlBcpixcBf/ohEiljO1nIBRyou75BAgQiwIcGQ5EwtCIP4WfG0ptfNSsAsZSvk1DrBw+ArJJyoshSHjR6IMUZjFSFYHljPO4nAn7QytRfvjDSYkoISyvKqzyS9ZjTP6B9VKUH4VDUR0L4y2eFCdI8bRoTWA3KRGP0M0QZwdRZU9jnisgvCLIEGM8DZWbk7fLYxhVhi2le9JD3GjJDkvj6PJM6N0K5SB4B33XrEmlghE6iJDwuuQjAjepqIkwVFE8vB34RqnWxm/J/WjKV/hv9IZgvJZtSYFYigTpe8qVGnZx5ijlWhFVtmL90bYYp6QWxSF9ynqKRtDJOT4CzXaf0TlvqbySsgWklxaMeytGFaL0ErPOdrwuqa1N88H8tfU2rZPrm9USDjxnk1s51axVRdLikXPEBybzEoPutlkiGtwqoFdxcvVeE0Pa1FFxtzCqS6+28gD2E7xaTOhIzhDE3A8PZnQ+pNhfrx2svqgnNPkPBZlGqsqE/dMYrUl4FMhdLtBaEMTDAcaQx/AF/sgbNPR8sa5sJ52T51V/Y6QDEwg8TUkyzDL9pRF9+4BLqxZAAw93382Ph3NetA2wWeo8bEGwb0zXjW9gW/Tqtq2/Rh8jmsAX/lOXDqIlGcPglNUnTFKceU2IqXz8AOVWmpnkAtYHtFdOYAX4A6UVx1F3zeHwsjuzrbNo6iOg8ZRHBtt/CcwPdczAUY/rAejRTCdt01z9dXfObP6t01brSuXwdmr6dBKbeCe2TfAx6Cprnt2mU4lxbLhbinq3xSC34vFNHj7QRh9gxjLtrukKB5P3+SK6vVPdv8A'),
			this.addDataEntry(dt + 'message dialog', 480, 480, 'Message dialog',
				'1Zhdc6IwFIZ/DZc6gSjqZau2N91OZ+zMXkc4QrqBOBCr7q/fBAIKQYsVZndxnIGTL/I+OTknWHgeHZ4Tsg1/cB+YhZcWnieci/wuOsyBMctB1LfwwnIcJP+W83Sh1M5K0ZYkEIs2DZy8wSdhO8gtuSEVR6YNPklDUNWRhR/TkGyVPQFP9v+4oYzNOeNJVhVvsktVEwn/BWclkF15Bz7fS6MtH/YhFbDaEk91uZciSFsoIqaL9btBIuBwcX6ZSU/uGXgEIjnKKnvqizCvMZrmGqAQaBCKmpGkuSEo257kkjdasWb1sKHeK+ylIYI0JQHcJKWaJvUIe2A0iKU5or7PMsWkPjQOlCaukpzHYkV/q5Y2Lp71EEq0BFJZ+lNP365BinkMV/kQPTyDjeiIkPNdQrktAUYE/YRK//dQG31zzUeHQPnpMIh8NjyUKhZSO026utnVVincrFS1wVH79XCcP5/paI9MGQtbaxn1+G+cytcqBx/gUWX4waTaA99sUhAGhnIWrciMDTLv3GAjBRQnt3jJ1unJNc60nyL1a3AZ3fSdy9W8cBt95i+ue4zuA6YBuagHQK4BaLVbf6gN7AKlC9IX7tLMsNjO0BWm/z8gG417IDTpYnPTIam6v9lX40ZDkDG96h4qx0qDrxi5404YDdw+GE0NRg8GpFp28FWo0ZIzsgb2xlMqKFdR3JOqQnKWXbzUKgi1B5ZB36heJCNrLgSPqv7soJMHP+ryxQCbPlvGwFq26GVXg8+3WiaTG5eJ0xAbuwmNRdgq1kzRbadrZtaFXxMhiBdGmYbdZy+3EpmZQDoiMqnlKqM+iNioCyRbtkv/BRg9po52oVSBA8/6wGGbucnyddE2Makfo2p7mLOcTJ/OUpY8d0TXzm3GptpjytJ4QmjwuB4iZXE+mNUgdxE55ePpU0he/fxLyR8='),
			this.addDataEntry(dt + 'dialog', 280, 273, 'Dialog',
				'7ZbbjpswEIafhsusjL3N4XJzbKVWqpqtem3BAFaNjYwDoU/fMTgJCVltlG61N4uU2B7PPzOab5AI2CLfbwwvsm86BhmwVcAWRmvb7fL9AqQMKBFxwJYBpQR/AV2/cBu2t6TgBpS9RUA7QcXlDjrLzxLQsNE6lbgZ87wI2DygjM1wLfFK6ohboRVuSzCViFC47sKUtpE+TMzLDFwS4mQZL5zdQIRVzRMh5UJLbVpXlrSPc7NG/4bDjdIKOm2sazyHTqmV3Yo/LlY48+deJNI+TlTwSKj0WWPxy9EYLXUmLGzR7LQ19vvk5YI5Fy5FqvAgIXFVVmCsiLh88mbrgs0zm0tfjG8dusH+xfa3Jt/7DegcrGnQpRaxzTyCaYeIZCDSzMvohHVGXnaG9Kg90cSNB3odLhvA/Qq2BxczysLlKAoHNgYLJhcKepAfcP+cCXedA1dlC13FrmuoQ0RNrncXUxFzy3GxupcKayVQgbuus3ZR+pQZ+4X/ZqcUBn4YzBL2117AHw/hz9rnXvgGSgz9y2MJj5bPByjhHfDpffDDsTcakNjUCs4SXJsIn+O7FsoBbjqPCTlX6CQp3QBcTNCxspuG6nEwVMsv26fNj9XqFm5syI2uJtM1veRGXsVGrryjuYhjl/34LkfIAsyhCF/aG6I8FzRnpx7ma5Qfp/8G2aceHafFZx8dAr8p9k8D7B/M34/59D8gx+Ppu6Nz73+W/AU='),
			this.addDataEntry(dt + 'fullscreen dialog', 358, 642, 'Fullscreen dialog',
				'7Vttc6o4FP41fLSTEED8WPtyv7R3nG1n9+NO1Ci5DcTB3Fb312+AxLeARU1a15WZTvWQQDjPeU6ehKOH7tLFjxzPkmc+JsxDDx66yzkX1ad0cUcY83xAxx6693wfyD/Pf2w4C8uzYIZzkok2Hfyqwztmv0llqQxzsWTKMMbzhBTNgYf68wTPCntORvL6/Qll7I4znpdN0aQ8imYi529En8l4Jvv01a1ILsiicbilSY31B+EpEflSNvmgY5FULVAYV90SQqeJ6hYFauB4Xhmmq77rp5cflAPqnYEMZ0A5llsEDvIJZnSaFV+r0e36CIBuL+o3+WjCM7HR+LE8isYzPKLZ9A/1xMHa9Mpn0gBV3xc1xmJcOZnTf8hfynNFi4+ECvIi+xVNPmTQSVsiUqZOtwLIPw4gP6hsOWFY0Heydf1TQAuOjOB0MS1YdzNNx+xG8NnfQ5yfFLmo3jHbHZaKlDdh9X3DbUFkeg0e6jV1/wGnclirm3d6/tbtO93tK/DJZE6E4fXVU7QCIjSA+Ek+pIG8Fy46hEH1zNilUS+KYx31Ms6l2QefM6iiS6foWeBJR5jdKsKmdDwuhrdiMCMTse75VH67j86OWmH3tCBZbjPUalBENti5MGLCnGs0Fn5bZ4f1zt5DUE1GBwRVs/SKnz0HUHQNKF5u/3ww4JA+E9u0gqgtrcA+VqmWfS4ETzXcW9SKLfEoPCATQwPmCJgwa3Vxah6Otm/e2VUtVoCODaATspzkPP3FMywSnHkBmKaYspuRBOKQxFybn2U0kPJozJwFdtFOTAW1WbQxeL4zvUZW0msMHUDdsyJ+coqzacXRFjNvrzzaOj0+URXBGjaGdsioM+KKjA4A0sPfQOih0kMgwylpkX0RNLPvsDzaZN+hyrZG9vVrs++asPG5qZzYDg0hcqF9ITySiIxmZG9GNTE4xckLTTQQwJ7BNaQZsaVwgB11CWMXfjf3L574SI6TZ22ETfBF1ILgvLnVtYSx3kGxizG6DG7F7rgVO+GWubPymNcIxhpe1UxZUXn8z3gVWMK354RXYQ2+1PNlR/CMi8crsiuQ/7ptMA9NzEF5XC7mPgDOMEducml09gsGv82C4WsWCFBrFo1J4GINB82NmUC9dQCD53Oinsm83VcODnnXGABdByRc7ZvvBIAbUsZXUh69anfEyd5Vc34yP4UuNKdvbpe88qvi/HLFiSIn6MKr4jxjxelklXF0hclVcRbQ6nvZxcTcUQn/K4rz0hWmGxIGVxIerTAdcTC8Ksz981HgO9Eg0dXv+/0eRk7i3dzluGWsc4+XR2SiUUJGb0NeWxe0kv2b6UhlKLNUiOEhYQM+p+Uro3XRpp6znnbON9WIfVb1ouYzBGomUvsyEdaVEkZWsqO+jCapro6wGyzmjshAunFCR9L4InA2xvlYfnylrV6hy+VEs1xpiVxZwHJWSz0Y2qE7coJg76o4jlYcIXJR/4fAabX+7apyFavsToaNtXr1eyCxFWJ0Ahf6A0EbxBji0dveotgmXI4slq1iZ49K0Uz4nvLZTtd9eTtqsZGhsZI96Wxe8GNGcjlHCZKvrYO16YwAvHz8UHv8mupcvw2d7qXB4xW1JPpHblXzzd/A/Qs='),
			this.addDataEntry(dt + 'dialog scrollable list', 280, 270, 'Dialog with scrollable list',
				'7VhRb9sgEP41fmyFce24j43b5WFZF62T9kzji42GTYRJk+zXDwxO4mCnqVpLWxUkS9wHx8F9H+hkL0iKzUSQZf6Np8C84MELEsG5NL1ikwBjHkY09YJ7D2OkPg9/6Rn161G0JAJKeY4DNg4vhK3AIAao5JZZoMrJUncFzNWS4wUv5RP9oxE/1jZlLOGMi3p2sKibwisp+G84GIG66ZGcpHyt/ZVh44OQsOk9Qw3ZA0yAFyDFVk1Z01Tm9hyxOSfKgWa5dcMjC5LKANnOd58S1bFZ6c5Q4GTokZfgZCklVQ7aBZkT1ikrNplm9jorUnYtSEr580pKXh6lMbT2QbJQ3fRSSzKnZfaTL5u1DaAsrE1GnoHNeEUl1eveC3P8sc4onRM2PRovaJrqPY8Jo5kGGCwO599ZeDfP8PjLphp3MRvVTY3ksmBv4RW/zmsXrRYTwIikL9BavotqG2HGqQqMUbOfyHhsjRmG7QX4YlGBdJSy2+ZZ4rlxxJMQxmgl+UVAn01APsIDKCh0FDQh5baA9PIEfT4FhaMBFBQ5CpquSnJRT2uzt1HcUczs8P9ZVXiQd2nkqGqW13UR+qHIlV0l0olCcnRKQL2FZF/peaSMveD8qIlrd6UJFVCpXTT60Mg6pxKelJeeslYXYBgFdJWsYfxGCZxbxsYOX/8qPy4f70n4tuXwavrx+26gjXYVDnHlbt1i8u4xeZg6RKo0HRMYdBFoHzfnhe7S/54kdOqxbaidK15AdNy2D7pHbYdekqMBOLahr/wb1Io+DOk+clj//vXCeC/jQ9zqhvF4AMKVuf/bY6Yf/gz6Cw=='),
			this.addDataEntry(dt + 'dialog scrollable list', 280, 112, 'Dialog with scrollable list',
				'7ZVda4MwFIZ/jZeFqOvXZattGWxjrPsDQY8aFo3ErLb79TvR1I+qUAa9W6CQvOe8nvg+FC3XS88HSfPkVYTALXdnuZ4UQtW79OwB55ZDWGi5vuU4BH+Ws5+o2lWV5FRCpu4xOLXhRPk31IrPioDKEMVQ0ggfsq9bCnXhpqVIaK63EgKsbyORqSP70Yq90mfGuSe4kFW3G1UL9UJJ8QWdClRLVxIailL7bx63NOeOaVEt1ClncYYaB33LbZHTgGWxdo1UTyAVCyjfGFmJHNUyYQqOaNTDSoSAWqJSbm5iskErnCfzrSQT7gFECkpesKVkoUpMxquaAUmAxcnVZpvoaVELceNtceHGEBun5w7oeZs3b/cyIIYvcEvKHUZLyMrd222Wnzokn0wE1QZORgJOWRjq6Q2IABMDeb2EuZr9h8Cd8cD7hkvv1IGxHGExNygkcKrYCXreMT5m+rtgeKlm9MxekN702fyGsYiiAtSAcPMWd0F/Gv5ln4/e5sP/pz5Jff1A6usHQMdj+w2o27ufiF8='),
			this.addDataEntry(dt + 'simple dialog', 280, 250, 'Simple dialog',
				'7ZbZitswFIafxpcNthy7ncs2s9y0MDSFXivWiSVGsowkZ+nT98iSs9lTMmUIFOoQkP6zSP4/b0m+ULsnQ1v+TTOQSf6Q5AujtQsjtVuAlAlJBUvy+4SQFP8JeXwlmvXRtKUGGndNAQkFGyo7CMoSHAorWr10LQ5oVekOe/Vp1u1lTLOctn5ooMKFvqyFlAsttemj+bo/ULfO6Bc4iUB/+AinTG9RzHy5btxS/PINccNhflKU9gfqVIq6QU3C2q9qW1qJpvZNSpxuwDhRUfk5ZjndDr3jxtNj0Q8fvP9QoILn0BkrNvAdbNiEz9ty4WCJyV7YIiHUuFMybjkah0vC7lXzeyk6/wRagTN7TNkK5ngE8CkASjmImscyUkSR2iDUh9ojSxxEnNNo8xHazoJpqIJkntaKCjmrtBqBZdRyYINXkbLa1f4SndWKyZlvc84sK96NmRKM+a1cXlHFw93Hx3J0RTW68cmSrkA+ayuc0L6LCV4eun+9iB9WeStQMg10KChCxT5Myzg9wT2foD1/B9jzSdgp+Y/6NqizPL0Z62LEmjJ2xaMau4jWeitaMAKX9WwH9fko3Rj3ivnfP4b77na3djnC/Rc3cis7O/U6vnhR/4ynQ651rfiza+TcNTIyLSvHpg3aG0zD6fGbqY+dfVL9Bg=='),
			this.addDataEntry(dt + 'simple dialog', 280, 250, 'Simple dialog',
				'7Zlbb5swFIB/DY+puDQheWxol0nL2kidtGcnnIA1gyPj3PbrZ2NDLoYmauFhCKRIcMyxT/x9YMWxvCA5zBjaxD9pCMTyXiwvYJRydZYcAiDEcm0cWt6z5bq2+Fjut5pWJ2+1N4hByu9JcFXCDpEtqMgipimIEMNpxPNTeUPGj0TfkMVoI08ZrMQQ0zUmJKCEsrzVW+eHiGec0T9w1gL5IVtiFNK9CDoynab8Hf+VHYpS1fVZkp0fMmmDVqKiX3QjGgb+KVIkErQEsqAZ5pimIrgSMwCilykiOJIBAmtZ7w4YxytEnnSYyx6n+xhzeBc9ykL2AoeIxTwhuko9SyIVDrUznYf0NM+AJsDZUdyyxyGP9WyPFQ07BhzFOm2oEdkoU4GozD2BEyeaXTVHz+D4WsUuRFkMMsVWHHKQySGS/j1ESUgeGAoxXW45l5N4TscZ3UvHvg2Hqa9fwphftSc4DGXNt+CV9ynbfuupdqv8G+XHJ7i6t7lWYC1iDAjieAcX3Veh1iMsKBYDu3ZRz0hlHNWlf9UBXa8z4IYpZZl3yfNoyBMgQnDGaS9Q1wRyild+owYNDYOecf/+6aI+vteCPiNDnxlKjwmEvUGdM6hcbho1yDcM+o7SiG55JqJyNetF6pxI/rAFkcaGSPNtinp7LoqdjMZj86dfGf+frfKKxahRqyaGVW9LYIJQ71XH3kqe77fgj2MbAi1iuqRZL1DXBHoslqBmBXIMgQx1rjf2zszwPzKjdqOvbmvwCvnJpNxABpkYtQD9VYbHi4Tbe3FfQ6pHGxT9NMvQ3KwNnl6Dl7lBUszTNUGviqBer41nu2o39ETJ/ugxLdiW2695Ebo0p7ln8zKhlrLfAmQ99MAZ2Rejt0Td3Np9+9ETryU+aZH4pAXg4vL0d4+6/fzfoH8=')
   		];
		  
		this.addPalette('gmdlDialogs', 'GMDL / Dialogs', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLDividersPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library divider ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'email list full bleed divider', 358, 642, 'Full-bleed dividers',
				'7Vxdc6o4GP41XtaBBBAvq/06O7uzZ0/PTC93okTJFBI3xNrur98kgIpJrVY4Llg6HSEkJLzP+yYPDwk9OE5f7zlaxH+wCCc9eNuDY86YyPfS1zFOkh5wSNSDNz0AHPnfA3fvnHX1WWeBOKbikAIgL/CCkiXOU/KETLwlRUKEshir7E4PjrIYLVQ6x1N5/dGMJMmYJYzrrHCmN5VNcPaMyzOUUVlmVFSFucCv7zZXJxVtvccsxYK/ySwrEok4zwH9MC8WYzKPi2KBVzQcZXnCfF12c/dypzCA3RjQMIYr23INneNswqh4JP+qFBfKY5SQOVWn89bu2mwM3NAfvWczdbGtzHd6U5kXaEro/EdhAW+T9JMtVM1lQ4o2q3ZynMlmPRWWVDlWMRH4UZZTWVbSCWVaLNKkOH0QYOBzgAEvT+M4QYK84Mr1TwHR+6RHp69zFYX9eRolfcEWf08QP8mTod0w1QJvRZD2/fx4y2xeYFrNPdZqRf3fGZHNWld+NQSV6q8G1Suw2SzDwrD6+i4OAsI3gPhGJ+z1qFiyx0Q1gG6H7m0Arf69FYrA2RNNCkkyRcl1EaopiSLVvHXsJngmNiH2uz66GYDdqLvyzhtU/uA093irxmat7hDUEZcLjmdYmmmKM8M7zPGndAVwqNl9u9n3BGlpqkqQBrUEaXmZMkbDBkAZ1AFKhhGfxnvx2A7ZIorrhejgXtUNGgPsahA2j1j4MWKyAFlk+MDuc43RLzF/QUerVMCpx/xwUDW/6zRg/2EdETON8fTZFjDrsay+gAn3IuZXTBaY4QJMvMLTSVoJzZYZ5dgrE8aMUsYzw6Z7OHZgMyTW2x5v3xnZdxmAUON5Obiva6mM9e7hnDpBE5yMGI8w3wH1FxGDMKiFGIRuAxHluoYvjPiSyhEFOCImmbo9jJ8xlfnvDMeQxrI9dL3L6KoUTsPazHNR7uL7oXIa6A0LqGAjUJlywbceCFC60FaBcKicXZWYYFWMqvawJZc/VN3iRO7HWPaNwImYCizgYM4RjRTI/X7/s+hWonUb2h3CP9RbVyH3mxjvXIsoIgcNJ1XgfowWOAatXaWk0t8CU/XYC3Fd4FVLbEEZNkhlwkagrEUayYRFF5GGH+m/DzXBo/nL0bi4g+YYPhxW+FIzEWcKJ6nsTWU553HKhMh3f8OUEvks3DGm1C4+5AZNCGeuKZU8LtNUYe2MRn+1iAL5HaRApmTyRDLFVSUTcqZsmUT6twzZyVLk53ZYUipTmT7HZoroshXd8N0OUCG/g1TI1F508/n/mwg1CWeHyNGwleTIvzByBEzh6FE+P3Ik064jlGZffOiMfAj4sAnMTYHozyXR4ydpDxkCHdSDLNNHbliu+ai7QC9KBUL0TTdfcqJUinjyJhjNtJTnPOQ52k93QAeVH8t0mOBC6A7ovBYEWqkFgUvTgiyTaH5y/MK47jxphukX3zkj34GlD9QLuqn/jAgXcYTUrc3JTLSI9XRQArLMmnnYpjokwkipOGiSCzyrGAkt8Sj0VO3OAyaRIrAzHcgdoD8dVHssM23cS5F7QOflHtBKuQdcmtwDHcvcECKEknseWCK+2M8Z2Y9XstN6ITfVnh94Sha4HELLqWat4D+wg6oPNFWfJ4VOFhdvv3DOd9S7LHitSA9HQk/6yf5ZIvWubKxfkXGqKVPUCQoEO6gAQcvcn/BCKBDsvAQEWykBwUuTgKApAd2gF6J6ze+IP38xoDMyIN9tZHw19Z97gqhQmsIcqYklrWE/HVR/oKn+XOeyDxVyaVomyonPGcb5FGcRK3a0hnCRaB2PKtA6wXw6KP5Ay1QfeCnMp/PiD2yl+AMvTfzxnI9hKpHZrHlcYE5kJZhvUr9vkg5aEumG5VcWYhSxVQ18xLo+0kTMtyxO9RtanOqCJt5deW4ty7yTpXV9txN6fuB8PoS8/Q8PZaf1Vj08cPXwSR+tOPE7LId4taM3Kw04xbXfdWYr8fbCWgb9K6+JtdUerMN5J8i+tte6GH4bl8869f4+x+nvLPK1ror3mvvWyKD5T414XuMjxTkB7D5+/uH4WXu8c6Iz6Bo88nDzAbI8+/b3yf4D'),
			this.addDataEntry(dt + 'full bleed divider compose email', 358, 642, 'Full-bleed dividers (Compose email)',
				'7ZnbbqMwEIafhstE2AZCLjfp4WYrVdtKe7lykgm4NRgZt0326dfmkIRAUlpgW1W1FCmMZ/AwH78xxiLzaHMtaRLeiBVwi1xaZC6FUPm/aDMHzi1ss5VFLiyMbf2z8NWJXpT12gmVEKs2ATgPeKb8CXJLbkjVlheGFU1DMO62RWZpSBNjl7DU55+tGedzwYXMXMk6a8ZNSfEIZU8sYh0zK4YCqWBzMt3MVOR6DSICJbfa5YWtVJh7ENfPw0JgQViEeU6ROE1zQ7CL3V+9/lMUoLkYpFYMpHP5Qey31UTE6o79NRZE9DHlLIhNd57tcc3mGPnu7FTNzMkOnK+yZpwTumRx8KuogLM33YvEjFwmUuRs8pSQ6rR+F5U0Hi8hU3Cn44zLi74JtS1UES+6WwHD7wOGndwmgVPFnqFy/i4QnXfe0dEmMCocB9GKj5VI/iyo7HQnk+bCVAO2hUjHbn58UDbHq1cNvbVqxfi3gum0doOPprgy/GhSPYNYr1NQtarvrqIVCLcGYi6iRKTwJjU1q6IqocspuvRI4x1+IEZsv66nXDyjQ9lyWKu9w8/s6GKCP1Y97qTbfbCtirBX7l4fAiyrXqFff8KUqHHbervN9T4jQ9QkQ68XGZYSKVXoD0Bj0geNFOJVSy3uAHXB0XqOLK+m8mTB/cyR5IgOQgPg8Wt4QtiupYgeRExVSGPLsYOIMj5eiqhG7uxcqWFA1s5Aap7kzATmNaxkPtUCwnV6mQL9IahOe1mDSEbjwPi3Ep6XtbZF9zsKD9kNRHrSnV3VHRkAUJn+AaF78dHyOlqbLLL2RWWHytm1X6yohvXuafFg8H2z/X9s/ekQbOtbFTeQpjSov0/o0qhvQmfX/YNMqqTbZlKbp5ydtUYsXeq+rQS8RsHxe6EwcoZY8KNeNkAWdPl49v3rFJd3vpeh87sl9vjoXalxTeIMt2EyGX6/BLmvgytZ6UiWpEYfCUimBwG5t97uTZ8I4Nfn57Xnd2rV8WF0Jl8Njz7cf0XJ3Q8/svwD'),
			this.addDataEntry(dt + 'image based content divider', 358, 642, 'Image based content dividers',
				'5Vpdb5swFP01PCbCH4T0sU3XStMqVeukPU5OcMCqCcg4TbJfPxsMCYVkpBCyMqJI4XKNb8655+baxEKzcPsoSBw8RR7lFvpioZmIIpl9CrczyrkFbeZZ6N6C0FZvCz4cuQrSq3ZMBF3JJgNgNuCN8DXNLJkhkTtuDB5JAqrdbQvdJQGJtV3Qhbr/3ZJxPot4JFJXtEwP7SZF9ErzK6topcbcmamokHR7NNzUZGJ9pFFIpdgplw3zZJB5IGeaDQso8wMzbIJN4CTJDH4xdv/t1QcDQD0YqAIGULHcIvs8TKKVfGG/tQUgdU4481f6chbte8xcR7+OYaZvduD8kB7aOSYLtvK/GwTw3vQjivXMeSAmZh2noIkK66dBUntsAibpixqnXTYqCZUtkCE3lxsRBj9GGMSZTVBOJHujpfu3IRF/MKPDra9VOPZDj49lFP+aE9Eqk1E9MOUBOyPSsZOdH8CGJ1XUwLmomfmfI6bCKiYf3cDS9CO3fIdouUyorKBefItGRDgVIm75fB0mZ4mpXhRHqk41wQ+0CO2qnOz0UHZNJVsQfmu0GjLP0+EV4uV0Kfca+5ae3bvwvexG+Lqqctx2+bEri7PTfJh0Icych1JaHFbRw9ww6ZI552kBm1Lg1FNwQrGgTrGTThSbM5ILdnoBgtwuCEooEYugFvWj1NTx2IaixiXWNEflHya7mxKL3DJjwL4AZdMKZU9kV2Ht3Jpa33sU1JysicB+1wJduCIaeN1phdz6Amm37zBuutAJC4lfq4B5epz4lWuD1rbUI+3yJrcKHgBOTS3LjW3Qy3XwieEDEF4TQPDpAYTYviaAcGAChtjtEz40OAH3DCAenIB7BrC6tPy6Vi3Lf9j3oAnsr/EBk4EVTgxgn2nrDq5w9gzgdHCFs2cAh7Z0cRDoET44vKVLzwAOb+nSM4Atn9c12U4vNsWr2+kdNCygWbuCp51sZI/wJTZKYScroDlZvNZlcZGtx3j54H72XxLbHudPbE7tcOPLPZNyL/9IqsnDwZwrNZLFidZHTAVTk1Cxtz7vTf8QgcPnz2nOX23FuyY77tDoUaf7P6pk7of/Y/kD'),
			this.addDataEntry(dt + 'full bleed divider', 358, 642, 'Full-bleed dividers',
				'7Vtbk6I6EP41Po4FCaA+rnpmX3arpna26jyeihIlRyBsEtfx/PrTCeANHG8wsjhszUqaJDT9dSdfmtDBo+jtqyBJ8J37NOzgvzp4JDhX6Vn0NqJh2EEW8zt43EHIgr8Oej5y1TZXrYQIGqtzGqC0wW8SLmkqSQVSrcNM4BMZUF3d6uChDEii5YJOof/hjIXhiIdcmKp4Zg5dTQm+oPmVmMfQZpjdigpF346qa0SZrl8pj6gSa6iyYr4K0hrY7afNAsrmQdbMczLFiUwF803b7dPDSWaAcmPggjFs0OULti6yCQnZPNbFVLtDG1lWb+ANj9loxmO1U/nZHLpyQqYsnv/IntjZin7yBAR21vY109HKy+w/XbQxlAWVUPo7s6RusQqYoq/Qj66zAicEWaCiMLt8FmDoOsCQk8oEDYliv+le/7eA6Fzp0dHbXEdhdx75YVfx5J8JEUX00BgP+t5NHo7LDbbfYJ0Fb9dNyzvmdLyiNe1LrZnd/4UzUGtz86cB2rv9U2+/Bz6bSaoKaGye4iyA3AJAzxTQ0MoTn4qLYq08hg4DbuD1+6X+vxMhyDodfWmoPelY0hizKQm/ZMEeMd/XCm+iP6QztW35zZTGPXTfoHN7t7nJej92K3ULr4q4TQSdUTDTlMqzvcNBeHiu3d1yu78Trbmt9qLVqyRa827yYO3XgEqvClQAFIi9oIDIrvmPwZK2yIMW3QjU2YOs7dUG25Pn1o9bvwrcQA0Fg9eHhtLZCLn1AZTHbJ0ADU4DdBXXhivUHCmoPl9lCDeK/dkWrmQm6ts1QGNbBWzGZJ0SlCSh8PR+F0o/Awr/KxolVCqDHDPdCDI3dGbFwATIWsY+i1jMTLAdQgymVUeQOOAiljlKmIfSpOSQduxSf3dLQ3TR2xaHXCke5SPAHsfRC58SlznLJwYnfQI5JbOiZ9W0IrDtAp4jLmID0oTSmVZfcDllSzAHFOaCA2jdbvcSuPaJ3q6V8zXbruzICu0Y5qfxcj8cLmRVEsFOHYOrXUxr6KC2IA4/FFNUxHRgjhswvXSEvi+8PVQHvLgKdhMRMWfxj3Ry1XPsdyPIcdtKMvzTMfFgFh6O9b+b8gGDd4nQBpxdcpr7d+mUetNQ6XzSkgq83u7XsUK2i5kT4CBCs5BV+iOhO/0DXEDCL9dTG4E/oAuRPtUqxpzHj8FDUmduEhHxSgA0CyzgkZp50Phfvv7jWcelwXotTo1mIMXEia3VFw/HP+6Mbj0EpN8mAnIMofswkM/ESCUp+n4dr25QMTPyvIz17CV4osmAnsPkFNCRD0IxmpbrQHYZR9S0z9wcNCOabUx5BI9hbh1qfX8tGVU6qfWaMkjDHJVpKAkL5ZZikjlhcffxOMp9l9H5FoRqoxl9cpRGoFsLR0GtSpLYTcqSoM8sSSWD2qCWUa2YJXnhYgGSkOv0L0xoSwmvaPRZQOIFAIagU2vBaDghUqdLJmSqcyT5ywHBJg9CZ1DTMiYlu0LGYhnBq7apRlQtxYKuDZJ8GZrNQ5b8tYQnasPbm4vDuYV5lJINKOgxOQpqYR4FtSqPgpqUR3n4DSZ2NYPaANfg97iYRxnBmxzzZJOQS3iPo5fchq5AGcaVx6AfTcum4GI25TUR2h5QRxot0qRIbDb8mFPTwSLmq4ekIC1Mk+BimgQ/KAVpYZoEtypN0qjNJNi57eOy8/YcZyPctVPOuxv67YK1SslGvvK50b+fallBYbcKB4eUyKKMCm5I4jFcrty/j9/n0lYXuaf38Dv1fSjVq/87Keydz+ChJUukjo+ECgY3oWIrfdmKGgRg+/HrXbwCaw46vbbBA8XtV9Vp9d2Prv8H'),
			this.addDataEntry(dt + 'inset divider', 358, 642, 'Inset dividers',
				'7Zttb9sqFMc/TV6mwuCnvEzTbVfT3VW1TtrLiSYkRiUQYdYm99MP/JDYsbs6DczWEleVAgYbn5//h+NjPEKz9faTxJvki1gQNkIfRmgmhVD5r/V2RhgbQUAXI3Q3ghDo/xH8+MpeL9sLNlgSrrp0gHmHZ8x+krwmr0jVjhUVC5wmxDQHI3SbJnhj6iWZ6+PfLiljM8GEzJqiZbaZZkqKJ1Lu4YLrPrfFqYhUZPvqcLOqYqyfiFgTJXe6yQtdqCRvgYI475YQukqKbqFfDBynecVq3/dw9fpHYYB2Y6CGMTw9likCJ9kEM7rippiP7thG8A5N4vA1Gy0FV5XGH7PNNN7gOeWrr8UV+4eqb2KjK7yi70MxRlCW6f+m6CFdliTVpe+FJU2Pl4Qq8qCPY9q86JtQ1yVqzYrdnYDB9wGDfl4nCcOKPpPa8c+B6L/zjl5vV0aFN6v1gt0osfnxiOWp9DoZDLUbrN5hV4j3JsjLFXP6YdOa3qnWLM5/L6ge1v7k4wmsnX4c1Y8glsuUqAaN/VV0AhQ0AE3N/hMU1q6cOig08aNJ1HrXV3QBwduaywU2RhVpM7JUhwb/ZqW7CParqCA67x7Y1YVplXloQ5QbSZZEm2lO0o43wX4+6mT3oN3uv5FiaauaFEMrUiwPUyoxdkAlsuIqJcV8ZdoPAokHWpRhhwjw60iQAySxDSQpwXKeNIBUrV+lUoDKG5eOEp6JqPN05oXONDQOA/cimtghppSeSf6oX+tMKHAHCPruAZUeoULoM+bmsOCeyCfK0/ODj98GGZ7fDDJAtul6w47OMZsWocWaLha5M20GF0fhR5+xRmAl1og9F7w9K4pUWfjfRY13OtgMP3R+wAWnhxmo5fnJcxJmeE6IQBtEfqakK5EYmL9ziXR2kKhlCkOWPGQAjgA5cZHNzMcXnNngs0h4KvggPeSwn8bseEivvI/s8vaHLUh08YJsJknuidLmhmCGJUuvkuxRkhMnc2Q4bEkGFy/JZrbkmyTPwmjyH8xTclVkX4rcp8TtAo+Hrcjo4hXZIfVSMmGUk7aEGMm2RvbLaxXjOVLYliAgKJ+xqk94cQuM2Io4EHAhDthMqkyxNFEJuCVcZ1fU1Rv25A1RqQu7wJtZlWkDsTaKOnrB1oJpny95FdPxm+wS21ybOHOn3TAAKy90oO8m0wJdUBp2pgVefKalZY3J9PGRGCPMEklTRa6RZJ++M3Lx9hsOO90CLz7d0romhRpNCs6FTK967EmPPnQSyww71wIvPtfSsjJlyrTFIPiPsGvus0c9xk7mx2FnWuDFZ1paFrlMuUoEN2Z4UOSZ8Osc2ZcmA+RijkRg2JqcXLomkXfepxtdmOwFZjcXuqt1eEsmvp086Nh3QsFKwuURz586L9escnnnmk3kvZWkDt5et+m7+wwhcv8VAkLdXx7onnSTGn1siKTr7EX8vvb+UDUggH8/P787v1aP1yed6G/Do4uHbxbz5tVPGn8B')
   		];
		  
		this.addPalette('gmdlDividers', 'GMDL / Dividers', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLGridListsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library grid list ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'grid titles', 358, 642, 'Grid titles',
				'7Vttb5s8FP01fEzlF97yMUnXPpNWadom7ePEEgd4BgGBuyb79bPBEF5MShJ7a+moKsUXG5x77r3n2BADr+L9fealwUOyIZGB3xl4lSUJLT/F+xWJIgOBcGPgWwMhwP4NdDdwFhZnQeplZEfHDEDlgJ9e9EhKS2nI6SESho2XB4R3BwZe5oGXcntG1uz6y20YRaskSrKiK94WB+9Gs+QHqc7skh0bsxS3Ihkl+8HpFiYx13uSxIRmB9blKdzQoOyBLbccFpDQD8Qw2xQT9/LS4Ndjj9+efRAOkDsD95wB2VwWGJzlEy8K/R1vlrPr+ggg172FQz7aJjva6HxXHLxz6q3Dnf9JfGPzaPqSpMwAxdjPYo6gaoe/eBNi1s5IzlpfhSf5iKcgpOQzuw7v88SCkNkCGkfi9CjA0GWAIbO0ZSTyaPiTtK5/DYjmhREd732ehTd+vIluaJJ+++5lEvTmDl68uyrCsdxh7QEHkbw3VtluuNO0+96E53pT3P9jErJp1TefzVHr9jOnfYVku80J7aFRf4tRAFnXlRx52nRQwov5nSkNeZ0xDZF9HQyHdm4odbutIi8isu1jwB3umpYN6jOVw9FYh1vPOhzKot5WEvVVRFbeBxq87/S8T5Pc4LeyvZiXXZ/WvmogwnxG25Wcf4suS1jOyryzupQw4zWf+z1ce9FCkFIcbjb84kpK/wBqh9aABoaWrYAH5Ckzs3Sg5vZQWxJvHVwIU5fMXypMqPKlSpz27RDQCttcRanLiZcxqE8VuybrCCJSW//2QxBprIYzB+svhxCogCgmu8exiqDCTA8crj44sNmCA+qQZBAqgcPL/HD3qZRpXK09FAaxXDkalgmlScxLH2rZq8VNYe7gt7zlf0Ngs+lskicxt77mKy3/VeDAdg2VlVhFKhE6c0lgVMYrKQ9qqZ2wvyPw/uH+mwkxuPk/9dWFxYdCSnZCowoBJA8YNBQAMgw77FvvTQxybbVwFyK3uXxuiCs+DXBs1nMDXWIHkipUHMye8I6UA4ksaciey/EQnkny0tCsIupFijHY354Je+FYRSAbGqY5RzUlWcjuQrKj9ePR1EVoXRyndmeqHRbYD7F5cXRCZ7QGgOjKjQGdoqDDQjNXB8Ajtm7OxneMOICLWzReqz1f9k2JfjaBEiAqpVHlNdaSaZYKOZBGj7mOvYIyTAbzpM6MU5li6ttCc/TvoEFbr1xrs2/JZmiQp1+vUtufiJBXqNycIeUGtSi3ExqtHyjmAHxjHoJMXLnZ01du7sSVm/PWldv8TxJSo/5o5h6Nz0fraECO606BfhAYoh+kln5OxcM/ipHWp/nkKQbBaVNMmV1vmGIuflPpopIyzfXN9DgHD3EO/rfkebl89IwmmgQfmRPnI/zW+cia5pJHyZrGshx7JL8A8JL5xX6toqOFqdq3IIf32aeCuvMH3lCtyFUtNoMMKn1f1XTVMKippcC6KnLvu7f+IXsIVQusIVwufDiFnGeSBk3+6dSY1++ufIz7NwGcPH4YjMdPWvH+JjrO1OBhzeOvwcruzR+L/QY='),
			this.addDataEntry(dt + 'grid style', 358, 642, 'Grid Style',
				'7ZtRc6I6FMc/jTPdBzshISCP1V77cvfOzu3O7ONO1ChMkTAh29b76TcRUDG4BiWVW6XTGXNIIJz/+eXEEHtotHx/4iQNv7IZjXvorx4accZE/mn5PqJx3IMgmvXQYw9CIP97cHzgrLM+C1LCaSJMGsC8wSuJf9HckhsysYoLw4xkIVXVQQ8Ns5Ckys7pVF5/OI/ieMRixtdV0Xx9qGqCsxdanklYItsMi1tRLuj7we6uTUVfnyhbUsFXsspbNBNhXgPhQd4spNEiLJp5btFxkuWGxabt9unlh8IB9c5AmjMc2ZcHBBr5hMTRIlHFvHf7PoKPKBh4h3w0Z4nYqTxeH6pySqZRsvi3eGJ3a/rOUmlwirbPRR9BWY7+U0UHyTKnmSz9KDypWryFkaDP8jqqzpsMQmkLxTIuThsJBk8TDLq5jdOYiOiVVq5/jojuiRG9fF8oCu8Xy1l8L1j6c0J4U/WMHIbqHVZtsCrgvcd5ecedrqd702nqzeL+31gku7W5eT+Aldv3/eoV2HyeUaGpsXkKI4GwJtCYvDIuIzFrxFk9P1W5UOD6gV8b+zt0KH8cIy/HrK84UvpGUxI/FKAvo9lMdXhDfkznYtvy73Xp0YeXBQ7754XIqsptqyHhtcFsyumcSjdNZRyZRccmXRn5Hdf7/Q+klr6qkOq1Qmp5mRLUgQVV/DZUySjh01ATZNf7u6oUQuWVS1zhmRIZD62OZ02wvoftKzZoRzEh5LD1oRAZK4TtCVTSalOgQBPogXCWSNOQJol0fKMMqCc1E8HA+pB2pvKTUI8L96eLrp4QN83+p+kPt5L+Bo6FqHDAcW5L6clUKEUsoBk0z29Q93P5ZelMGuHeaOlgG353dBwnE6qeehTyKBM0yWhyQ7LbSDrIsxEbsAtMOs71QamvwsiwVkiyJGE8u+HYcRwDKynS7QSO6PpwxDU4ShdB8A+NM3bLjh3HcbNc2G5UeJ3AEV8fjvqizEMiQpao534W9FVOWW9IdhtJBKxkyEEnkPSvD8ng4hPW7VLqjT8D/rCNlAgtLeIMH9WfMX/Xt4oDnfP2MDQCTOfTZsB77QS869hIOCfvHam+aacxTcPdtz5H3uiOsTPExn4/Yf0EtLBZwRAHaEMWff3kzsPgizRhjOU9kavJJF0oPiZ7WNqD0lzm+k0poBXe+tAKb/oSyFc2iaTjDeREupwYuGN3/Cc5dbE+aHpwKTlN9xjV7GE5YegLSbJgv4SVecAhF5q/Cvfbx6N80+qCvXEQ2MDFu00LjkwLfCvzYH2F4g5BVOYfzx8E1vLPxQYs7xryj77A8IPxl8+XfbyuZ5+g89nHu/bsg4D97LMZD9vNPqtKg2NR7g7aGbJcG9utkNMGKRMyfTHewLiry4m7GPPYOUgPuN/7HlkLkGtvk7hvf484arD7QraM0kzxkVIeyZtQvrV+25o6JODn1w+Z61c74l1SHf+zySOL21+U5dV3f3D2Gw=='),
			this.addDataEntry(dt + 'grid style', 358, 642, 'Grid Style',
				'7VtRb5s8FP01kbaHVGBjCI9N+mUvm1Rtk/Y4OcQJqAYj47XJfv3sAAkU0kBit/mSUFWKLzY25/jca19gACfx6gvHafiNzQkdwP8GcMIZE/mveDUhlA6AFc0H8GEAgCX/B2C656y9OWulmJNEdGkA8gbPmP4huSU3ZGJNC8McZyFR1a0BHGchTpWdk0Bef7yIKJ0wyvimKlxsDlVNcPZEyjMJS2SbcdEV4YKs9g53YyrG+oWwmAi+llVeorkI8xoQjfJmIYmWYdHMdYqB4yw3LLdtd3cvfxQAtIMBG2DYciz30OqFCabRMlHFfHSvMQIP0B+5+zBasERUKk83h6qc4iBKlt+LO3Z2pp8slQa7aPujGKNVlqO/qmhDWeYkk6VfBZKqxUsYCfJDXkfVeZGTUNpCEdPidCfCwHGEASe3cUKxiJ5J7fqnkOgcOaPj1VKp8G4Zz+mdYOnvGeZ92esEGGwHrN5gXYj3DuXlCpyO20TT7otm0f8ji+Swtp0PfVDrfujVr8AWi4yIBhvbu+hEEGoQNMXPjMuZmPXSWbt+6nRB3/F8r3XuV9Sh8DikvFxmQ6UjxW8UYHpfCD2O5nM14K3yKVmIXcuvm9KDBz5WcMg7bYqs67rVOiVcHZpNOVkQCVMg51G32bENV51wR+24v6HUEquaUl0tSi0vUwp1ZIAVTwcrGcE8CBuEVNGvslIQlVcu5QpOpKiza7VdY4QNXWSesZEexoSQbutdRdSZIWSOoFKtJgnyGwTdY84SaRqTJJHA94qAzaDWhTBrc0g7U/FJqNsFr5eLTjMgbpv9T8Mf0hL+RraBWWFbh3VbUo8DoRgxIE2/f3wDTZzLzdKJagSvvKWNTOBuN+U4mxF115OQR5kgSUYS7YvSfQJ8c416k+Q+SdrQNTE3wDlo0ravT5TNLIyc1kqSLEkY179H3DJy099x+vONxETHjP7GD+qvs/7g9ekPnZYSPlFyJie8izSlQIwEHC1JEEEoScPqJvpAgmyK7DHqLIcjciCWhtxvRzkAE7Q0syCfXGR9liaEkOwTOg2aJIRCR/RoquN94skRNLfn+C0tehsCIwGmmSz5xmaRBL4DnbBJJ7KcqTO90XnEIxvb1+H6Qpws2R9hZh1wcmbR0y+PMnHlWK/8oGVALsC6LQvedlPQNuGmQDNH8QkCWMYf1xv5Fxd/8rl24fGn5dWLX4w/XVz0+TAyu0afltc+ziz67IPwiqJPj2wAjVp2P1V/V3+4aHdJxJ4SflYlL8AqI0R1fzRyjTku6JnYqIJbguAQ7r4R3LUkCGIc0c5P46sJgiMfyZ/XaxPv8Yy35b0JGWmDInvtWGSF45SSu4DFl7dyu4bMQctrFo+EZyzB9PJWb+eeOwD+LRq9LQIHmRABtNq83O8rcXP+Fbg5aF/JBtU/cxcHgXkXt9WaXhe3rjU4hKAz0iMHx8SyDmpJE8xw8NRn+b1n09p5+Q0PbkrR4eyBY+6DA8/89wawR+5AtozSTOkjJTySnRC+sz7uTGdE4OXzh7rz1+rxPpId79LokcXd14l59erHi/8A'),
			this.addDataEntry(dt + 'two line grid list', 358, 642, 'Two-line grid list',
				'7Vtdc+o2EP01PMLYMtjwCCS5d9rkTibpzJ32paMLAmsiW1QWAfrrq7VksCNDgNjho3EmBK0lS96z53gRm4Y3jJbfBJ6FD3xMWMO7bXhDwbnU76LlkDDWQA4dN7ybBkKO+m2guy1n3fSsM8OCxHKfAUgPeMVsTrRFGxK5YsYwxklIoLvT8AZJiGdgF2Skrj+YUMaGnHGRdvWc9IBuUvAXkp2JeazGDMxUREiy3Lrc1GTW+o3wiEixUl0WdCxD3cPrdPWwkNBpaIb5bbNwnGjDdD12c/fqjXFAuTM8yxmuWkvfcw7yCWZ0GkNTr+4wH014LHOdJ+kBnWd4ROPpk7nj9sb0B58pg2vGPps1Olmb/gtN11NtQRLV+mk8CSMWIZXkWV0H+ixUECpbKCNmTu8FGDoOMNTWNkEYlvSVFK7/ERDbR0Z0tJwCC1vTaMxaks/+/oXFhyLZK3dMccDKkLTV0e2c29q+7TX3UK+Z+R85VctaT97socL0zaB4BT6ZJERaXl/fxV5AdCwgBoIvEnIQmcpJUmQUSo/SAM9RADk2ve7S4y2XmkAWAJeOMOsbNkd0PIYFr+nNyERuRt6nrZsAnZZVneBj8bEqkrPSePCrIGbm9UJYFIQyPZPFANrX351yf++gp1tGT78SembUydjZrQGNoAo0IiymNH7SVAXGPqQG4/iNQfOqaDOMaSKb0IMb+NnGfrWSMV+YZdmU15bvGSoVMs4NeiWQd71KKNd1awC5a4EMSCDnniYyqQ5vDW+7YMsylW2CuC3Reau7Eq79VnTzmU1nI8LQ9DfNAZeSR9n9FBTe35GXcegpARbU2RaDdtgdKvDBceEWuDWlTT0rVPqxDHkMi7oThEQ4biB1FecvEluRo25UHohz8bmZwrb1kZuH2/007wclSatTCdc9vwauu86pFT2j/LlL+nLHQ/3iJN51beIySUSsV1qrxhvyfrbEdy9E4jUjz0jjXXu357vqEfJ5PE60ut8RRpfq70/AE6aLx+q11WrVoPndz9X8veC4NNH3PlP0LyRlX39oQ929Fd49Y4W3d7RucDyqXNvRBeXv3dOLu3ecuPu9usTd3m97oAKHyvQw+kEo0wL/iOcw6gdd8ivI4/dC4dI03f9MTb/UpP3aRN7ej7tlCiTBYzqqV+mBuuebxp+B0vvnpvQl23oQJ8ullvi+cgSGAU/klb7Cu4tP3f0rlPneV+q+4/sWP7gCVUf2ntwjbMB/Je4nlPPemck5snfwnudms32AYfvlN+WHK8jVe9cn4kfXT/0/c/UrUXV70+2pAVHq4yjVzPQV2Ft/4v6Vt28PTnRuQt8uq4jiL2wVQ9ae9n2WWJit+N/V6NW1bL7vBcalib+943YPK0/W35sMcUQE1trAMlqp5miNj//PHEp9lRO9XnrkTTnEMyNcoLkwDuqrLjEXEXzE24zyp/D3z3mMs1nVjeiJ9akjVGnG8IpAOeRM8KmKhqRQRHd7k9Kajnicswcu/NgR6adHSX1qvn7Vfa/SLs1eclG4X3FrJU811y9WT7rWM01JXUltXjWh3OzVUQ52dHXeAXWaa/23sargM2MJCmUVku1uNSi0a0Ghkqq8X3j0srNGcndF+sG1k8h/hzCo826xc/YlVx3FzkH9tc4llXYWcBlWaiSdJcCPGRFUTQLCmlkfN6YzAvD68evtj1+p4p0SneDa4FHNzX9A6e75f5D6Dw=='),
			this.addDataEntry(dt + 'two line grid list', 358, 642, 'Two-line grid list',
				'7VtZc+I4EP41PCZlST7wI1fmqMlsKknVPm4ZEFg1tuWStQnsr1/JB2AsgwGZIZ6YyqG22pb7U38tt5oeGoWrL8yL/Uc6x0EPTXpoxCjl2X/haoSDoAcNMu+hcQ9CQ/z04EPNWZCeNWKP4Yg3UYCZwpsX/IszSSZI+DrIBXMv8bHsbvTQMPG9WMoZnonrDxckCEY0oCztihbpIbtxRn/h4kxEI6EzzG+FGcer2uGmonysXzANMWdr0eWdzLmf9UBWP1PzMVn6uZpt5gP3kkyw3Ohun178kxtAbQxUMQYQYxkg4ySbeAFZRrKZjW7fRsB17DGss9GCRlxp0NibkWj5nD+xuRW90lgIQK77ko/RKNrkP9kESLQZTkTr79ySUuPdJxy/iOvIPu9iEgqZz8MgP90IMHgeYNDMZAwHHidvuHT9S0A0z5zR4WopvfB+Gc6De07jf6Yeu2gmI7Vhygrr3Envray9YzbTrloNnGq1/P5PlIhhbW5+58LS7e+c8hXoYpFgXrH65ikaAWFdRi1q9yj7EgSu/aCe2m3OXQCMy2BYl31Aq9ntitlfsMdmvpA9YRoL08uQYHuhdPbstzwVCBJIzvCU0GNLEj1nmEnoHlOB6GY3BHHDcXvcN0w/Ch7b40LLaI3brDODkdEStzk6uC3JpsM+OMLidnrsIZSDlnUuDAybWtBWW/AA7QGVw/W10B7cYz23Bffr64DojZIZbozQrlwvTI1jFQCKCG/oiVWOUUatIF+tsLl6PItzQUxJQ+LbgHYViOzW3OoOgfb9qkB9N649TSbirzH+NvhRQUuYcncxPhN2xKwaZB7SQ7F4lmiQmRcM8guEZD4P8F40Mq8dedYlhZIDulV8zb6WZcpdcR29gIIKoM+T0eTn68sfguWq8FUkjpIDdQLeamZh9NfP18Hoz8NXkLzTPXyryZJHOiXy9WIP3cMpo+FYfuoiptCd0/cc5mJ+BHjBFahPKec03L4fFJE6a/1IlcbA3oqGucK4f2CuVadMJvlaAHW9PApwVEtjZGuZJQBZbcySajZGwCUEIxpFlCW776LC6q6D0MZeVYJQmflIwmwX9sY0sQPdmYkFgE6N3ypsoaGJANrIMwDrkwCuQQCrA29djvvhCKGanhpMp1g+6MhnJOE4SnB087TQjAROXsSr8LxtEnA+SeAaJLB5rxduaTYLHjfOA9U8mUgcy0f9Tv0ooV2hAKf76wD3kwJ+xzrgGCV8uKUBrGb4hoxw7gnZVxrwjjCC2/lFAQTHk+nauOBmIrMJ7X4XInOTkqDOoFdLqjVofjxSRbeGphZns00DNnM2x7hldMwuoVPrTDVouR8NLas5WkKTxInEIMaMiJvIDY1C+rQVnVbm1AI61QWHpdgptmw9O8VFecRmLx+0sVesqIE6p7KJMgxPrWFqhtDhHSNYLngAikCkgAhqKIA9u8DohJo9Iz201+zVTmdlhdZNb63pqSGaerNfqhKibbldDS5nlhBB5wjvQOt4GZHZXsmr037Fa5MqogsDxO8EsPP4IePk5djtoON0DR7R3H4PJuu++zWZ/wE=')
   		];
		  
		this.addPalette('gmdlGrid Lists', 'GMDL / Grid Lists', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLIconsPalette = function(expand)
	{
		var s2 = "html=1;dashed=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library icon ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry(s2 + 'edit;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Edit', null, null, this.getTagsForStencil(gn, 'edit', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'star;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Star', null, null, this.getTagsForStencil(gn, 'star', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'heart;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 18, '', 'Heart', null, null, this.getTagsForStencil(gn, 'heart', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'reply;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 18, '', 'Reply', null, null, this.getTagsForStencil(gn, 'reply', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'users;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					24, 16, '', 'Users', null, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gps;strokeColor=#737373;fillColor=#737373;shadow=0;strokeWidth=2;sketch=0;',
					20, 20, '', 'GPS', null, null, this.getTagsForStencil(gn, 'gps', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'share2;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Share', null, null, this.getTagsForStencil(gn, 'share', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'navigate;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Navigate', null, null, this.getTagsForStencil(gn, 'navigate', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'chat;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Chat', null, null, this.getTagsForStencil(gn, 'chat', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'voice;strokeColor=#737373;fillColor=#737373;shadow=0;strokeWidth=2;sketch=0;',
					12, 20, '', 'Voice', null, null, this.getTagsForStencil(gn, 'voice', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'google;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					16, 24, '', 'Google', null, null, this.getTagsForStencil(gn, 'google', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'video;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					24, 16, '', 'Video', null, null, this.getTagsForStencil(gn, 'video', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'gallery;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					24, 22, '', 'Gallery', null, null, this.getTagsForStencil(gn, 'gallery', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'birthday;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					24, 22, '', 'Birthday', null, null, this.getTagsForStencil(gn, 'birthday', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					24, 16, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'x;strokeColor=#737373;fillColor=#737373;shadow=0;strokeWidth=2;sketch=0;',
					16, 16, '', 'X', null, null, this.getTagsForStencil(gn, 'x', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'bookmark;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					12, 20, '', 'Bookmark', null, null, this.getTagsForStencil(gn, 'bookmark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'calendar;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'calendar', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'attractions;strokeColor=#ffffff;fillColor=#737373;shadow=0;strokeWidth=1;sketch=0;',
					22, 18, '', 'Attraction', null, null, this.getTagsForStencil(gn, 'attraction', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dining;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					18, 20, '', 'Dining', null, null, this.getTagsForStencil(gn, 'dining', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'education;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Education', null, null, this.getTagsForStencil(gn, 'education', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'family;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Family', null, null, this.getTagsForStencil(gn, 'family', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'health;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 18, '', 'Health', null, null, this.getTagsForStencil(gn, 'health', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'office;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Office', null, null, this.getTagsForStencil(gn, 'office', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'promotions;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Promotion', null, null, this.getTagsForStencil(gn, 'promotion', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'radio;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Radio', null, null, this.getTagsForStencil(gn, 'radio', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'recipes;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Recipe', null, null, this.getTagsForStencil(gn, 'recipe', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sports;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;',
					20, 20, '', 'Sports', null, null, this.getTagsForStencil(gn, 'sports', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'travel;strokeColor=none;fillColor=#737373;shadow=0;direction=south;sketch=0;',
					20, 20, '', 'Travel', null, null, this.getTagsForStencil(gn, 'travel', dt).join(' '))
   		];
		  
		this.addPalette('gmdlIcons', 'GMDL / Icons', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLListsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library list ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'scannable list', 358, 642, 'Scannable list',
				'7Vtbk6I6EP41Po4FCaA+rnpmX3arpna26jyeihIlRyBsEtfx/PrTCeANHG8wsjhszUqaJDT9dSdfmtDBo+jtqyBJ8J37NOzgvzp4JDhX6Vn0NqJh2EEW8zt43EHIgr8Oej5y1TZXrYQIGqtzGqC0wW8SLmkqSQVSrcNM4BMZUF3d6uChDEii5YJOof/hjIXhiIdcmKp4Zg5dTQm+oPmVmMfQZpjdigpF346qa0SZrl8pj6gSa6iyYr4K0hrY7afNAsrmQdbMczLFiUwF803b7dPDSWaAcmPggjFs0OULti6yCQnZPNbFVLtDG1lWb+ANj9loxmO1U/nZHLpyQqYsnv/IntjZin7yBAR21vY109HKy+w/XbQxlAWVUPo7s6RusQqYoq/Qj66zAicEWaCiMLt8FmDoOsCQk8oEDYliv+le/7eA6Fzp0dHbXEdhdx75YVfx5J8JEUX00BgP+t5NHo7LDbbfYJ0Fb9dNyzvmdLyiNe1LrZnd/4UzUGtz86cB2rv9U2+/Bz6bSaoKaGye4iyA3AJAzxTQ0MoTn4qLYq08hg4DbuD1+6X+vxMhyDodfWmoPelY0hizKQm/ZMEeMd/XCm+iP6QztW35zZTGPXTfoHN7t7nJej92K3ULr4q4TQSdUTDTlMqzvcNBeHiu3d1yu78Trbmt9qLVqyRa827yYO3XgEqvClQAFIi9oIDIrvmPwZK2yIMW3QjU2YOs7dUG25Pn1o9bvwrcQA0Fg9eHhtLZCLn1AZTHbJ0ADU4DdBXXhivUHCmoPl9lCDeK/dkWrmQm6ts1QGNbBWzGZJ0SlCSh8PR+F0o/Awr/KxolVCqDHDPdCDI3dGbFwATIWsY+i1jMTLAdQgymVUeQOOAiljlKmIfSpOSQduxSf3dLQ3TR2xaHXCke5SPAHsfRC58SlznLJwYnfQI5JbOiZ9W0IrDtAp4jLmID0oTSmVZfcDllSzAHFOaCA2jdbvcSuPaJ3q6V8zXbruzICu0Y5qfxcj8cLmRVEsFOHYOrXUxr6KC2IA4/FFNUxHRgjhswvXSEvi+8PVQHvLgKdhMRMWfxj3Ry1XPsdyPIcdtKMvzTMfFgFh6O9b+b8gGDd4nQBpxdcpr7d+mUetNQ6XzSkgq83u7XsUK2i5kT4CBCs5BV+iOhO/0DXEDCL9dTG4E/oAuRPtUqxpzHj8FDUmduEhHxSgA0CyzgkZp50Phfvv7jWcelwXotTo1mIMXEia3VFw/HP+6Mbj0EpN8mAnIMofswkM/ESCUp+n4dr25QMTPyvIz17CV4osmAnsPkFNCRD0IxmpbrQHYZR9S0z9wcNCOabUx5BI9hbh1qfX8tGVU6qfWaMkjDHJVpKAkL5ZZikjlhcffxOMp9l9H5FoRqoxl9cpRGoFsLR0GtSpLYTcqSoM8sSSWD2qCWUa2YJXnhYgGSkOv0L0xoSwmvaPRZQOIFAIagU2vBaDghUqdLJmSqcyT5ywHBJg9CZ1DTMiYlu0LGYhnBq7apRlQtxYKuDZJ8GZrNQ5b8tYQnasPbm4vDuYV5lJINKOgxOQpqYR4FtSqPgpqUR3n4DSZ2NYPaANfg97iYRxnBmxzzZJOQS3iPo5fchq5AGcaVx6AfTcum4GI25TUR2h5QRxot0qRIbDb8mFPTwSLmq4ekIC1Mk+BimgQ/KAVpYZoEtypN0qjNJNi57eOy8/YcZyPctVPOuxv67YK1SslGvvK50b+fallBYbcKB4eUyKKMCm5I4jFcrty/j9/n0lYXuaf38Dv1fSjVq/87Keydz+ChJUukjo+ECgY3oWIrfdmKGgRg+/HrXbwCaw46vbbBA8XtV9Vp9d2Prv8H'),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7Vtbb+MoGP01eUyFAd8ek3QuGs2squ1I+7iiCYmtEmNhpk321y/4Frt2p+4ExtYkrirFnwHjczgf5JjM0Gp/+CRIGn3jG8pm6MMMrQTnsvi0P6woYzMI4s0M3c4gBOp/Bj++ctXJr4KUCJrIIRVgUeGJsB+0iBSBTB5ZGdiQLKK6OJihZRaRVMcFXav2l9uYsRVnXORF0TY/dDEp+COtriQ8UXWW5a2okPTwanfzUNnXT5TvqRRHVeRYXJ3jGxf72EcuCAIPe9ihcwcVrTzHGxkVxZAbFLGIxruobNnD5bORrAjs6uZPAKkPJUb9eKEOXo7q7gKBd8FGWLxL9GnRu5cwwlsUBt5rMG55IhuFP+aHLpySdZzs/i6fGJ9C33mqAk5Z977sI6jO4//0qYIRLQXN1Nk/JZK6xnMUS3qv2tFlntU4VbFI7ll5eRCnsJ/TtwiDuIgJyoiMn2ir/XNIxL846PeHnRbqzW6/YTeSp/8+EPFe9gYBhvoBa1coJQFu3M74x14XTee9aJb3v+Ox6lZ983kIW7ef++0W+HabUdlho36KQQS552Wlftm0WUIh9kO/d8jbHNOufx4Lx7Y0jKLumZBFKuiWKpjWNBvIRD1pDMLd/en80CeGCquWGDwjYqiaqbQQWGDFN8FKRolYRx1Cmug3WSmJKgpX0oBnUjQ4ezmeNcLmnmufscAMY1Kqqfu3imgwQ649giq12iQo7BD0hSS6VXBHxWOcZOfPNt1ZpbnUwt1lHMgPFdfUxWvCFuUacR9vNrob9aKR0a08re2+5me3Phx3rea6Rua1wLFAtwOMCFLmi70hYrxVqwvvw1DEw/fPaKhnsexYmdEcK4Q4Jgj5kdGhhARA/51JyODsiHrmL2QoPbrgBT828qPTdQW+kRyDLzxKMp5c8+NI+dGpxpFZvtGk9ejAixdk17G4o1LBDcGKCJZdJTmiJEMrU6Q7bUnii5dk1y35LugT15r8TJKMXhU5liJr+9Ms4f60FeldvCIH+C4VJyxuGFwNzGl+dKwvx7hPfKiIgKD6NtT8ghf0kBEYEQcCVsTRtVQWROhVCVjSRHkr8poNR8qGqOLGKOGw66ksOhQrUGSbJthDU+2WvErTy7eWFW1rBXGeTodlyNDIqwOI7Rgt0AZL0zZanIt3Wnr2XyweHqgGYRWJOJP0upIcM3f6Nt6zwmnbLfDi7ZaeDSJq+GtN8iTh4vp6aCw9YmhlLTNtrwVevNfSszNlwRRiEPxF2dX7HFGPgZX5cdpOC7x4p6Vnh8sikRFPNAz3kj7R6xaK0TTpIitzZDhtTQaXrkkE7O+ZrQVm1gs9tiq8JRNsxgedYyssGDFcHsj6cfBezSYvv7hhsxg7PzOp3bc3bWJ7W859+zvOERz+8kDVjNNM6yOlIt7nL+Lr6N0pNCEC/3z+0HD+ejPemOz4fxo96vT0E7aiePMXbv8D'),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7VvbbqM6FP2aPLYyNrc8pulcNDpzVE1GmseRm+wEVIKRcdvkfP2xuSRQyAxN7AFNoGpVjM1lLdb2ZtmekPl294nTJPjKVhBNyIcJmXPGRP7fdjeHKJpgFK4m5H6CMZK/E/zxxFErO4oSyiEWXRrgvMELjZ4hL8kLUrGPioIVTQNQ1dGE3KUBTVQ5h6U8/906jKI5ixjPqpJ1tqlqgrMnKI/ELJZt7opLARewO3m7WVFxr5+AbUHwvazyGq5EkNcgjp83CyDcBEUz1y5unKZ5webQ9vj08p8CgHYwSAMMS97LjKB3YUKjcBOr3fzu3mKE78nUd09htGaxqFT+mG2qckKXYbz5VjyxfSz6zhJZYBVtF8U9onI//E/tWkTuc0jl3o8CSdXiNQgFLOR5VJ1X+RLKskBso+JwJ8LweYRhOy/jEFERvkDt/JeQaJ/5Rm93G6XC2812Fd0Klvx8pPy97HUCjLQDVm+wL8R76+T7FThtt4mm9V40i+s/sFDe1uHiN1Ncu/yNVz8DW69TEA02Dk/RiSDnspDTLps6S2Rqe1Ov9ZU3+U473mUs7OvS0Iq6q0MWCYc1SJiWkHZk4tAjdMLdacf9F2IosaqJwdUihvI0pRZ8A6x4OlhJgfJl0CCkin6VlYKovHIpDXwhRZ2jl+UaI+zGdcwz5uthTAjZdf9REXVmyDFHUKlWkwRNGwR9obE6K3oA/hTG6eW9TbNXqaZadjONQ9kmyxV14ZJGsyJH3IarlbqNQ9IYwVocc7t/sr17D/ebqzmOln7NtwzQbSEtghRZstdFjPcyu3A/dEV8+v4ejbQky5aRHs0yQoilg5DnFLoS4iP1cyEhnaMjaem/iKbw6KA3/JiIj1bzk/8rzTD4woI4ZfEYH3uKj1b5Hunlmwxajxa+ekE2HYsHEBJujOaUR+koyR4lOTXSRTrDlqR99ZJsuiXfObwwpcnPNE5hVGRfijzYn3oJ94atSPfqFdnBdyk5icKKwVXBHLKtYX1Z2n3iXUkERuXXUPUDz28hw9ciDoKMiKNpqcwoV1kJuoNYeitijIY9RUNScqOVcNz0VGYNiiUook4TbqHp4JacpOntqGVJ21JCnIXTbhFyqmXoANtmjBZsgqVhGy3W1TstLZMrZo+PoECYBzxMBYyZZJ+x0zMxzoqHbbfgq7dbWiaIyNdfaZLFMePj8FBferSxkVxm2F4LvnqvpWVmyiySiGH0L0Sj99mjHn0j/eOwnRZ89U5LywyXWSwCFisYFgJeYJxC0ZsmHWKkj5wOW5P+tWuSoO7uZ6vqqu7nyTn7AV2xV332p9Uy969tIjjy9TBheX6NihI0vUw0TZdvsJbRLDhlkJ2MV0WAKiVVC1eW+yYiOsbm7+cw/TKitfLmYEMT+EnTNvkMUTJRrqRLt+oZ87+yZA2weqTLpxH887oTE74kaTogi3K+60jTWbMQkIlMnDSNkIWCHyP2LEamzmPKMTEAR/7AkplDfq13KHR/KhdozZJtPcOgN7aRJEzLEpqst+q6VKPKy5nrNYjzuzFq5/drNmxzK8488wvOiNc9e5YtwyRV+kiAh9tsHt6h9OFYNCAC/37+/Mu/fnpjx/vb6JG7x+XpefXq6vX/AQ=='),
			this.addDataEntry(dt + 'item list', 152, 631, 'Item list',
				'7ZlLj9sgEMc/jY+VjLHzOG6y7bZSW1XNoWc2Hseo2ESYzaOfvoPN5lGyqyxZTsVRJBgYHv8ficfjhM6b3YNi6/qbLEEk9GNC50pKPZSa3RyESLKUlwm9T7IsxW+SfXqhlfSt6ZopaPU1DtngsGHiCQbLYOj0XlhDV7O1KSpY4pCzTiv5G+ZSSNW3U+gvbKm4ECf2qr+MR81KuUUjwYqdD5SG3Ytr7k12wQ8gG9Bqj122vNS17VHYhdbAV7V1G1E7FusGw+rge5QAC1aFy4pQR5Gf8lFq6eiCGzB6mK3wJRN3gq9abGl4WZous27NlrxdoSk91r5CZRZLRkYv2eoF/2OGIwXWFXRY+2U3acTa1lzDAj1Nny0eErTVuhFv0TLz07IoBpsCwTTfwNn4t+ibX3/iBG/h1RPnKhZSEpK+URI7xQ/JceYs3Vtl03MPWVUdaEfCw8KuUrVwVL1TnIn/7NDmk/chVAQgNHIIzZngj4pHRj6MSEoDQBpfgNQgIxYheUEqSABIExeSbPjS8GFtF0l5kZpOA5CaXiDVdlKwSMmLUpaPA1B6jmvOMKmOb+K/nh+laYj4gZALlJ4UB4XG77CNrHxY0TxEGEHcx+p7JbE1SxfxFuWLahoimCDu8/4BFSheRVY+rHIaIpwgbu4AB1CrGJ57UpoECSfcXMRnEBswIPpbFVojLp+0BA0SV7iJiS8NyqQjJC9IkyABhZuYcPC8mqdvZZ9K/SdFP+s/Nwp77nAic35B5BtTqHauD8/BsBV9/A4/DKweX7sM3U/fyvwF'),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'7Vtbb+o4EP41PFL5khuPEMqRVnukartH+7hKE0Oik+AocU/L/vq1c4EkDiGADT1VgyqRwXbs+eabGY/TCXaT92+Zl4bfaUDiCX6cYDejlJXfkneXxPEEgSiY4OUEIcD/Jmh15FdY/ApSLyNbNqYDKjv88uJXUkpKQc52cSUIvDwkojmY4EUeeqmQZ8Tn4y/WURy7NKZZ0RSvi0s0Yxn9SepftnTL+yyqR5GMkfej0y1E1Vy/EZoQlu14k1013QdkYxtbtmkYGGEELDKFuBzlLQpYWDbDplPKQhJtwmpky6jW5uWlYLMf/qAg/qXSUb++sKQvyKc7x+AstXlxtNmK23J2XTWCmY3nj8fUuKZb1mi8Ki7ROPX8aLv5q1qxcRD9TVMugFXf52qOoL6P/hO3XI14kZGc3/1TaVL0eAsjRp75OKLNG7dTLgtZElc/j8IU9WN6CjBklLKMxB6LfpHW+NeAaFxo9Mn7RhD1YZME8QOj6b8vXnYueqMUhvsV1u5QUQI8mJL9G5asTXiuNqvnP9GIT2v/8OkMtR4/tdsj0PU6J0xCY7+KUQCZ13mlftp0UXKW7rzX5HXaNETWdTDs2txQqnZLBS/SjKwJ15NP8rFQOIZpgbGKN08qvtZNS++WEuuvh6lRABpQsCUUvosFrqKYa7SLB9cUa/txMfdTMaIMCFPh8YW2I9+L51VISqIgEIP38KKOWjFZs8NYfxZ3SxspChbmjYJFP68sHYg6KniVEy/zQ4lSTf40eVVRrWxco4iuBKHdoQEJtLRRbmpj/ZybqUBIRJ+b+rzjcDj64MCGfjggkPBY0TggWa4+DyguLqfCnTGxKgTGuL+u42TCp7YdrNWTYXc8s1Vcncwc9j5fk7+9MJExTSX+Fppa7Aee5nNtK7xnlObCMlKSRfwhJDtInw6iUdYE50s03sueVr0BZM3XsmtTGafFY4i1AIGUpJTxaz4Y+C6MchAO+tX9zmpgpwUNfTstW/9GC8r1jKeQMnpPP9v0mLbsMfcD9Tvg00lqOwe+c43DUuNGETB1WIdcKPnD23IBT5d4Z4BA3WJwRwINGcWZKT5D+48KpgVljCZiFAk7dMddCsSX4Y2BGry1wG3eKWrujUGV6m8XNmc6cFBSh1kXCbOsbHflPrrXlSeheXXc7K3ROGriJuxUKKGWzMZWAVK0XdMBPkgZzx687rbiKubcZVvf2UdCHQVNKFde3Ix4jBz1a1VG00ZuhAvbn3w1gbEuiXuD8asIpR/qkMZw1AQ0WwtJ5brOkvqviVi06gR3bwHDGa11RkY7zibuXQlQZAG4JqtSC0BAhZsOqC8DbiDHXBl9XvpQbr9wXzobPATv3Yc62uJp58xjqiPlQXLB5pkfJHkBR4Z8cfXDcdWydBiBkmJR3rAbuQqxmi25XjRw9sSLK5+Rs/hIkf6Lrh+MroaW5FrNazTHtqmLpfhoYSo+m6n1yn5Xpp5R2ImjxrlxQ+svxSVpHY6p6OqkiCKGWDqq6z0v1PxIY+oFYulVmR1wBfMWUUA0FN2/HOeVZuHo2JUiJaWj19KSbuk4rfMdp74yH7Rv4Djl+tEPXvRGwPUSknlffP1gfDWRlhqCkreD/NJkbslXRw1f7d+Grxjc4MXhmmlq85zdsRq8Tr5MDR18wVAFX148/2cfKw6V9iO4XMiW0nYGDrXQp38bBCPtB8D3BPDz44fH49fr8e6Jjv3Z4OG3h//jK5s3/83vfw=='),
			this.addDataEntry(dt + 'avatar text icon', 358, 642, 'Avatar with text and icon',
				'7Vxbj9o6EP41PLLyJTceFxYqndNKq/bo9PEoDYZYG3CUuN2lv/7YuUBCHKDE5h60EnFsx5nPM/PNMNkeHi0+PiV+HH5hUxL18LiHRwljPP+2+BiRKOohQKc9/NJDCIi/Hpq0XIXZVRD7CVnyQwagfMAvP/pJ8pa8IeWrqGiY+mlIZHfQw8M09GPZnpBAzD+c0SgasYglWVc8yw7ZjSfsjZRXlmwpxgyLW5GEk4/W5WZNxVo/EbYgPFmJLu90ysO8B7a9fFhI6DwshjlWsXA/zRvm67GbpxdfCgGohYEbwoBiLc8Y/JFM/IjOl/I0X922jADyvBfYJqMZW/JK50l2yM6xH9Dl/GvxxNam6R8WiwZYjP1WrBGU5/S3PIVYnCckFWffC0nKEe8h5eSbmEf2eRebULSFfBEVlw8CDB0HGLLytoREPqe/SG3+LiBaR+7oxcdcauHTfDGNnjiL//vhJwr0Bi5+Hnfa4VgtsPqAVaG8T3Z+XhGn5TSlCf9UmsX9XxkVy1rfvD9Atdv33foMbDZLCW+gsX6KgwCyu5kctdpsoYSfBxNLueVN7mmInG4wrOq6oVXsjg69iBMyI0JOAUkPhcKzbAccKnh7r+BL2dTk7mjZ/eU0JQrAAApuA4Uv8gEnNBIS3cZDSIrX7bhc+z4fkTuEvrT4Uto08KPnwiUt6HQqJ1foRem1IjLjm7k+Z2cvLtLkLOwTOQu1XjkmEPV06FVK/CQIGypV1Z+qXhWqlncuUUQdQagPqEACHWMq13exeZ0b6EBIep+T2rx2ODxzcGDLPBwQNPCYsGhKklQvDyia9pq6bSPJpf2sG1NHwaa3rLCTHVssHCrvb8i2HklabFuLbYW2kb0C9+tuuS/ESBqnEvKYJFTchCSb1tdN00EqDL3CqWoSvQWaki/butIWr6azEBsBAmmhj9HPVOnkhq7jOsd7NAh32tB1FLUjqoKWuajKNR9UwWbu4jVknJ3Kplato9u0jiA7Wo3tfvJZ57Znzl04ekwmAraJndBMgPzlL0WDoEFiMECg7LEz0oBWE8WBLT+74ooCpiHjnC3kLA3s0BmjD4iPwxsDPXgbgds+k4ccIvnRKPrTuciBCRy05FdmGRE2k1i3O/tIZe7F0+Mj4VbmERphMa4OkOhyxnboQ4PdjCaj8WisCCE6ac5ZwvWt+BCaSFTCZkblKwloTB5c5oK5jGtEXwctXEYq8r2TGe/2yAwC10FmvBsnMwheOJnJN8p9kxmErpDMeHdGZhQ1Jd9Z8vZgMhfLZDA24tnasjLy98M7ZzLoBtMy6DrSMujW0zLo0tMy6JGWUVXFXDyTQfeWljmk0KXEJaKV+pSKyMeO/HTkAcWAMuGwKk0SaCqGpyqVAN1rTBUlJeoKrkcBw9UUMFhGTBtuZjT+9QOxTibJH+VCURK/2HyPeOAS4wHLMcEPMWyLB8DdxwMY3F48gNGZ4gGRQ3cmWKPorzsewFgH1Zyy4OBgoIrBkeVNGHUvb/LMxQiDeohgBDbr+iIEDO4sQsDNnMfflAchWWYPsMjeb3wQnUslOraRwlHstP2E+yA62L5BouOeiehMBqMxfNEo+isnOnreSwoJMfOed75P7prTDK6Q09h3xmkscIK3lUs2ovdt5VUbJkqfYnlafEq/nEcvClrqUX74wZtKJdbWrA2XI8M2a1+RCrr511Is82mPcwJ4+/jhw/FTWrxzouPeGjzidPOfgfLu1X8c9D8='),
			this.addDataEntry(dt + 'three line list', 358, 642, 'Three-line list',
				'7Vttc6o4FP41zn7S4R36Ue3rzu5s99qZ+3EnShSmQLghVt1fvzkJqEisVKFat3SqEBII58l5npNw7JjDePlAURr8SXwcdcy7jjmkhDC5Fy+HOIo6hhb6HfO2Yxga/+8Y93vO6uKsliKKE1angSEbvKFojmWJLMjYKsoLfJQFGKprHXOQBSiFcoon/PqDaRhFQxIRKqqaU7FBNUbJKy7OJCThbQb5rTBleLm3u6Io7+sDJjFmdMWrLEKfBbKGaXuyWYDDWZA3c6y84yiTBbN1283T853cAGpjmBVj6LwvfVP7mE1Iwkbhv1Cim/wYReEsgdOyt7s207Qbt+/usxlcbKvyvdigcoomYTL7kVvA2hS9kBTuXHQk7zP0k+KMd+tnbkmosQhChke8HVRZ8EHIywIWR/npWoAZxwFmWLKM4gix8A2Xrn8KiNaRIzpezsALe7PYj3qMpP+MET1pJJtqw5QbrHIn7dnyeMtsllO1mv5Rq+X3fyYh79b65t0bo3T7rlu+AplOM8wqVl8/RS0g7AoQT8mYLD/kS2qf2HWgQf/WUI7vLVc0tMPeJF2nu+20EZ6yTYU/xNGta5zXd2z3tFGwKrtgo6g7TbhfSvEUczNNcKbC2/Ycq66JbbWJ3/G7wiwlv3Ma8bviMoXbeS0A4DYBQIYRnQQVB9y2/jYquWPKyoUDGidCVJsodac1wLqm0T5iXgWxAZ0n3PyGxoIwg4fF+BUnvPp9BUtu2N2gw6nyFyAQTlDUz4sZMF2Z9mxXSaEK5lNU2h0lWGznZUnddBqhSU9vAfObJrx0nmFaUyQ9Df7qWtw7aHFLqxq8KGuWJJ02VErXFPZ3osKT+JnJ2nbOrznMxgaC/GDbLtoCrCiEC3Qz4Yt9XkG30uV2C2cG39wR+bkhSRJCs+LWvNfy7rIOr9Dl/0+/ia6PMfQ/AcOQOeVfCZh+TGhAiM8PfW7FGf/GlKLEzyrk0eO7t0Q2h1IkHrPX69WhFFPBIXHo+xGuHxztBF+O2Mp0sDOr0S0l2zQ0hNXzyGY4w9XaGLR6ZdC+EB+t9gFYxkXIQl6Uq3OJ/70dyK13ILuomeSptNMmzevV9ZXRPI4x+O9g8HcHVmcO086N2KokYu0ljuaDhJ0RlE+V1P6bjzjbaSBYaHPkeM04u6G3MX3WzYsOEXTjgmKEwlbNAmCdOUZgoNb9iINg8M5qowlhTO7+jpMknAKLvBc4/AwzmEM8iZ7OI198x1heYjxnIraI+ScR+2QKMQNZJKrQ4bgQQTKIyq13ld6pFyDUmp+UKMpocEC3GTGYrUQM1TW4v+YQeIrPb5H4RJEwtVY4yrlskbCvXiTcM4vEiE/2KAKh8FF8YCa5Nf0L0BvMJ58RFUTPl9sJD0sTn9ubJJlYaNIeZR3ZAL+JoHWMcVJzGerLC4J9hYKgWGsMKQvELFKbhVP2LQufKwveTRswX/byou5duywY515ffKH4jVBB4knGKftdXciJHiUr8QgYgSSgsZwWLALExMQACAIMoz3i0IcgcipuEEhdKFjkf6IN3vVpg1FdXvyBJ2GKC/SLRIxvdfgsdbBcuw2gjYtWhxopYF9dHcwzq8OAhozBpOGRROzAIhK4fxbk60dYagGsDonL88RFhuHE6NccwWrTULzVoomQE18wR8zhiCIgkBc0IdlpL52+kkgcnct4ySJRXRR9CPmrRIB1hmBx8VsgPlEgbKeNt1aK1L2LEgjr6gWixrJeYXPeMkwzMGqKachvAlYvSp83RbWAuLu7v7d0iahPFg28vVVmcemVHC5bkcNlN5TD5XrlHC69HWZsJPEujeaZiqicW9fW747PsZMjai8867S6M6XZee1n2SnS7FpIRRYR2tFJK8a7yapVr1HnQ3iNSEvXagWFRlamxmjyqvKS9e9P9uFyrPd4B7zHqOE+Vnvp/G772fym1roknRPA68dPr4+fkvHOiY57bfDww81v/GT17Z8A/gc='),
			this.addDataEntry(dt + 'single line item avatar', 358, 642, 'Single-line item with avatar',
				'7Vtdb6M4FP01eUyFzWcek3Q7o9HMqJqOtI8rJzjBGgcj4zbt/vq1+UgImCkkeBtNoKoUX2ww99xzbF/MxF7uXj9xlETfWIjpxP5rYi85YyL/tXtdYkon0CLhxL6fQGjJ/wl8aDkLsrNWgjiORZcGMG/wgugzzi25IRVvtDCEKI2wqm5N7EUaoUTZOV7L6y82hNIlo4xnVe1NdqhqgrNfuDwTs1i2WRS3wlzg19buZqair58w22HB32SVPQlFlNew3SBvFmGyjYpmnlN0HKW5YXtoe3x6+aNwgN4ZdsMZQPZlblu9fIIo2caqmPeu7iPL8mfeos1HGxaLSuWH7FCVE7Qm8fZH8cTO0fSTJdIAirZPRR+tskz+VUVgyzLHqSz9XXhStdhHROAneR1VZy+DUNoisaPF6U6AwfMAg05u45giQV7wyfUvAdE5M6J3r1vFwrvtLqR3giX/rBC/KJJtvWNOG7wVJL1z83LFbY7X9Bro67Xi/o+MyG4dbj6dwZPbT/3TK7DNJsWi4fXDU3QCwm0A8R3vpWEdIdGLUHqi1Fk184JAG+QVGkDwPsVyPk0VYRTAZI3ovGD0joSh6vCB4hRvxLHl16x078OPZZbrXxYjb6cEHTQmvCHImXC8wdJNa5x2jg4ncKyufnf1fv8NVUtfnVDVG4Sq5WVKpgYGUPGHQCXFiK+jBiBV71dRKYDKK5d0hRdC1FlbgWcMsKntmEcsaCD2A69x1g2tvEpfCs2MoCaFXnY0BA14dXUMarMNcG2zC8caRAMDYAC72fts6zsAFqargqC0XQgBcExgAKwGCPPVCqvnWkacpALHKY7PUMHnFPOOg1JgqT9pp2iF6SNLiSCsunAopx9fa+fbpiGt0xUNnatK4HWNhFnvgbHk4ZDcbBkYi4XuwHEChhgalSTDjlHh3C+8+fJCRLqPgxriAn+gcXB2CtDMBD5wFNM+YjozAkIzbzKn0gfQ+o5pykYZrae44O3pqHPdOtoGye0IqTsKaZ/kiGsiYwaa6ZFvKHusLyyKRyVt0ta9PSX1/28lXYXq71JIbkdJg1FJeyipXY48w4LQTLI8YiGVUK7vEafpqKVN4gbXrKXAhJZC68q1NLhxLYVg1NI+WurbJkBo5lh+cvzClJh+RmOeVBMF4OampZq9M1clpW2Q3I6UOt2llJLKu9mKy3F2aMXTpDqCYV7mOeXug2H92kycPEp1JOw5LV7GpuPb2IEAtE28CuyyJ2WcYxxB8I2oUzOrseBECKTmGIyKcYZRiwHv9mYYY16lD09d20SGWrN55QnFIVc8nYdol45ErQVBcHNEta3uRJUtSZIqhyeYk12WojtYH4+meiCAoNy0q4saefWQ7QfgqnZ1ABqIuZrdhO5AuwnLJf0hEWYGs0H2uST0OdVuAF36D/7D+bs984hqhedAog/a8BmY3+9pX/idTrdN0uoYfHXXyhr9UmGY0W/qGEFhkCTHCq1/6Vhy+HiqDZdz2QPfYQ/sQB/H3LcovvlPUWzHwJB0PQD++fhdujvlI9Hx/zR4ZPH4gWpevfr96n8='),
			this.addDataEntry(dt + 'two line item list', 358, 642, 'Two-line item list',
				'7Vptb6s2FP41+ZgKAwHyscnd7SbdTdU6bdqnicAJWHUww06a7NfPNiYETHJpC2uVBSkvPrbhcJ7nwcc2E2e52T8UYZ7+TGMgE+eHibMsKOXlv81+CYRMbAvHE+fLxLYt8ZnYX8/UIlVr5WEBGe/TwS477EKyhdJSGhg/EG2IQ5aCbG5NnAVLw1zaC4jE+RdrTMiSElqops5aHbIZL+gzVDUZzUSfhb4UFBz2Z91VJu3rA9AN8OIgmrzgmKdlC2cWlN1SwEmqu3mudjxkpSE59q3vXvzRAegOhmMEAwlf7h3rVTEJCU4yWSy9a8fIsvy5tzgXozXN+Enjr+qQjfMwwlnyq75jtzb9RnNhQLrvk/bRqsr4H1lEjigXwETpDx1J2eMlxRyexHlkmxdBQmFL+Ybo6l6A2W8DzHZLWwEk5HgHjfO/B0T3jYze7BOpwrtkE5M7TvO/VmHxLiY73YFpdjhokd7NyvJJ2FzPjBp6bdT09R8pFm4dLz6d243LT/3mGeh6zYAbUT/eRS8gZgYQT8C5YCx7lZy6ZdLW1NwLgk6Kn4jARt8XWKmmqZSLhBdHIbnXet7gOJYOHwVOYM3rnt9U6Ytvf6yuZv77GHJoynNQRnhDSDMvYA0iTBGw3uxwA9fqG/dZd9wvCLWKVUOo3iBCrU5T6TQYARXfQOUBMihCYoAjwsY7xpWWpDx1GMJAXltlQWvMQp9tjHKtQbQUoBFQCwzUHgsqiA/y1lPKaR/0vI6soQO1TwWKMwwoyB0DlbmByjINs0SCcqDbQvw8UJpIkBYyGq9HzO2HWEuSc3V0jGlcCrE19l0t4v4YiCPLTHNS+lIDznjIt+ymxsvphj0KNsjA5s8mKBaWXzvM8ErpUIrQAhGqg8wkFIbie8tAhUJE4ibRUWkwG4UGPRY5qlSTYJVBNtNKAQ+oozPsY8YVDRRX3xsjruZ6yY9isKNbeeWMcrwWPOaYZuyWSQ6E4yipJDKXTH5poifY46ByBuWRCrgGot7fW1pVTJmC9F40QG6+ryuFITqiWxurZ9+JyUvk7z0haiRtcal0QdxV6UXZ9g0zySiF6HlF900aGNKvWahqKkbZrYmmnnuScAXkkTIsnT1ZBawe699a9edWFS4OA1oIjm2MDChoycofjtnI+6/muc4440DHihTdZvGH8Vs/LWUKsgHGQjlPuJH72sntVvsMw5LbXFz7Hccg81kmSc4+A8t32iMBPblR/X9A9flsDKqbK5Y/ZTuR231kpsJolaioaKeQqWhGgHcCVen90cUb7a+c9jNvjP00FLxvr77fVok8Bp/mHhodvjtZCgaZLE3dMXZL0HyITaxVGD13ifX4AsU5XEwR93urIri4GW3dVbu1F7a5kDvefrQ//na0bfVfBRI9cc6kPnIosLgIFLX1sTZ9IgCvHz/UH7/OJ95HouNfGzyiWL+kVjY/fYftXw=='),
			this.addDataEntry(dt + 'three line list icon', 358, 642, 'Three-line list with icon',
				'7Vptb6M4EP41+ZgIAwHyMUmv1Um7q2p7p/t4cmASUA1mbadJ7tefbSC8pqUNqN2qSG3i8Ywx88wzjO1MrHV8vGM4Db/TAMjE+mNirRmlIvsWH9dAyMQ0omBi3UxM05B/E/P2Qi/SvUaKGSSij4GZGTxhsodMkgm4OJFcEGAeglI3JtaKhzhVcga+HH+1jQhZU0KZVrW2+lJqgtFHKHoSmkibVX4rYAKOF6erRflc74DGINhJqhyiQISZhjX3MrMQol2Ymzl2PnHMM8HubFs+vfySO6DbGVbLGUjOZWkZr/IJJtEuUc1sdk0fuSt0uzQv+WhLE1FRvtWXUk6xHyW7n/kT26XoL5pKAcptH/I5GkU7+k81kSXbDLhs/ZN7UlkcwkjAgxxH6RxkEEpZKGKSd/cCzHwbYKadyRgQLKInqI1/DYj2GyM6Pu4UC2e7OCAzQdN/N5hdFclWt2PqBqecpLN51q64zXbaXkOv9Vp+/3sayWmdbz5dmLXbT936CHS75SBaXj8/RS8g5i0gHkAIGbH8VXTqpkmdU4u16a6MzhCvkMBELxMsY9NU0UXBG/mYLHM+x1EQqAmfCU5gK0rLb7p145rvy6u5e12EnOr0HDQinCGomTLYgnSTD7xndJzfSr38Pu/2+zNELXxVI6ozCFGLYQqeeiOg4g6BCgfM/LAFSNX7VVRyoDLlgq7mlRD1zqzIGQ2wqWWPj5jXQuxvDkxKfJncGCXtBCu9KToqgkYydPTVSmnIaeZHr1FtoI9WXdjGIFnQQyOgt2iht5auBH1fyREBTPq5D4JOR83XgdyHAsYaBhhkj4EMMrpKFikQIeTsasFkEHgCNYig+rFkSot8pYPTlGtTrFo+TuT/jRomoIeEUBzIhNoDZLsfyA0mL/TVUcQIxd9GseNdCInGmuNCMP1mgeOaYwQOagXOPeb8QFnwReTn60w0HwOP9rbGT/i1jxjohy+QMbZUvTXTvSxdMFd9ur3nDbUmtUuD/q/ZEfnrXIiE352rpj3GIgRZL9e7RYlLokqZWoEH9NXp4jH9iobxq1WMM6xf2xsvd5AAw+SrGh0Kt1FyZXuf5gcV0VZmHRHRRNYwcmWkQkb5yCEFcDVEnV97WnRMuYZ0KRWQnR7LTl1BFeiWwiLXVUTOTn3qWSj3xiod4w3dq5vu0wAL4EVWzqssnbd3OFYd2Rw3rBgnr8D+rJRehZL0TfYsmeYb1r1+CP7jhh7rwdRKGGUst1a8HctigjdA7imPFACVneTiZfCt0X9pZ+rZl0dOJ8tsvU+Q1yCnOxw/Rlx6N/ZKLG+ULNfew3qg+yR4N5Ys94JOM1KUdNABj5OTiGKYya83WGA1cIjZrosiMT5lxuT0RY3PTw17nEVQeyNRBycOguxBdyD4u/IkxhpzooNdzyqk+uXCfQaQ1Gb5RYJPToK5MwoJvOsO1PucZxj6Gnz1caoZvFjTeoPUtFN7jA1ytBjiTGOD/cfeJxpVXN54rJHFzsVzDWNWHKk+d7Rhj3do7I5/Zmwa/Rfn0jJKueJHKvdi5U2AldL7UvSBAPz8+KH++HVmvPdEx/1s8Mhm+UuyTL36Q7P/AQ=='),
			this.addDataEntry(dt + 'three line list avatar icon', 358, 642, 'Three-line list with avatar and icons',
				'7Vxtc6soGP01+dgMgibmY5O+3LuzO7d725l+3CGRRKYKLpK22V+/gJo3aWIbbRNTO/cmIig+hwPHI6SDRvHrrcBJ+BcPSNRB1x00EpzL7Fv8OiJR1IGABh101YEQqH8dePPGUcccBQkWhMkqBWBW4BlHc5KlZAmpXER5QoDTkOjsoIOGaYgTnS7IRJ1/OKVRNOIRFyYrmppNZ5OCP5HiCONMlRnmlyJCktc3q2uS8rreEh4TKRYqywsNZJjlQJ6fFQsJnYV5sZ6bVxynWcJsWXZ19+pLHgB7MFApGI6qyyUC74sJZ/Ke/qdTHKT2cURnTB/OarsdsxF0fG/4Vsz0ydYy35hNZ07whLLZ7zwC7irpgSf6ykVF8jrregqSqmo95pHUOV5CKsm9KqezvKhGqNJCGUf54UqAwY8BBt0sTZAIS/pMNs5/CIjuB1t0/DrTLOzO4iDqSp78M8bioJaM7IHZLLDISdr1sv21sLm9ctSc90Ytv/4dp6pay4tfDODG5S/6m2fg02lKZCnqy7uoBIRXAuInG/PXd3HJzolNAl0PnOsesrbvNSpCsJ9NGXUu1kkbkalcZfjT7F314ddyx+sf1goWmxSsFfVeHfRLBJkSFaYJSUuNoDzMFIjDqmH37GHfwcUiVBtc7NXCxeI0BRX9BkDp1wFKSrCYhDvxWGdmTtZ6IarceTq9xgC76PvNI+bvR0wVoElKKvaSS4w+Jfy56twc8UE94Uf9zfA7oIH4D+pgzCQkkycbYZZDVn2E8XcitsRoF2VgGTO/Hsi2urgmxp2iFawhdhlRlTDijHGRluDbodp7NsyI2XYQa0syaLzoBEeXebLU4qIQEkWrWdcdnl1nHJVq93u1KA/faaIFOHVwdp4SUbFL9YH+q/xgC/aG3LX0mi5oQmUUu/UCUDYThmLOlGaAQIY01TdLyBNhKv9NCRoVO9vT8zaNYhoEuoiFF5+j2SvgaH/gBbVQBzVCnbLz8bMDezhOTFQQGqhPU2JMdDGm68PnQn0wfYtj9T0kilgQBFx3bxAQITALNObdbvdgsLce3AZmO99G4DUygtbinKTSYpsoyIbmb69l+G7d8xYSmyXWZU6/uScDNNjoZWETytQp+yqxIqUqB+4nXMrs6x+EMaqeob9lzxHJHqfXhM/m9I5b93it1z1le+V+HseafGA4/LsBpVO56CeNhl4LJVHZgXmkqZayShmBCZ9Hgfks+t7xXGbHtlRTrFK5OcanWgfzF9ZWTeS1UBMNTlITeWemiWDZ/LlXTx8Cq7TLAMff7s8xySDooSbawHHbP7D19o9lLsmvOTXDHz1Ztwe20O2xzHO54pmjo+8CP2uP5w4L49ipDpIrLcsCdRuctdXPgS30c+BJ+jnw3PwcyzyZB0GeuX56/IFZSthpiJcydY9r0kxN4gUVbaLeRnDcHg5svYdjmSLzSwTGwplwNqUiNuPf6eqYFlo0lkkyDyFmT0spMzWdaP6iSnWWxFSJ57hOBY/bKmf2ow0RODE5c5JWDDw3KwYByyQAKqW2Yn7wSH47MUckZtxCfNbbBI7biUGtd2JQ2Yn5TSY0IeYFhP4vX1JxikoGtdCRQWVH5lGDlYb5eyaCZTGJCl2qb4on0ky3Sf+dY/1WamSEqmjruyXUQn8GnaQ/g87Nn0Flf+YKP9Mg80ifvvXMEekZz2mkdz5ucwa13pxBZXPmlmIm9duIGdYzME5Vy7TQlUFlV+aSLcysYanW9KWymECcEpJNFZah1jpLRJMIL9oqY1o4RQadpC+Dzs2XccF+mApkVisLEyKouogeuYrUu1VSpcHM8YtF1iEO+EsNYsK6CrGMmGdZAuo1tATUgU28FXJrMVKSaG5dRQ181+uBj1PI3f9M1uAq3IIkjXLmwF9HqUIPYDbrmHQIR95khXV8cf1axpcLt4ml0C6qgwVjbF+Ka127vo7LR9kB9yzIhRVW5LrN/QJIv/kfAHHdxoecrwSw/fh51fGz9nhfiU6/bfCo3dXPgmXZ13817H8='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'tVRNc8IgFPw1OepEaKweq7Ze7IwzHnrG5CUwQnCAauyv7yPgt3Y82MxkAssuD3YJCR2rZmrYmn/qAmRC3xM6Nlq70FLNGKRMSCqKhE4SQlJ8E/JxZ7TXjqZrZqB2jwhIEGyY/IaAzEQNnuBA4ceChNxBEWjW7WSkFcxy8JOkCR1ZztYeN8jFbimkHGupTUulZft4mjN6BfuRWmMhOtqAcSJncsaWIOfaCid0jcNKFIUvNmJSVB6QULoT/luED7xS124hfvw6epmvtma5qKtZK5u8EoS2HLe1QNyTtmg6Ytwp6SXYjF5gAWju+tlC0cwpaAXO7JCyFYXjgUGzQZBxEBWPsqwfMGZDvzpIj+lgIwZ0Oyx6FdZjsaim8gesW6lCdnMO+Wqpm3t5XISXDobDjB7IX3Gb5FG7yG27dvFwdrMgObGvd8O9PWZAMic2cFbulqWx4lwLXAhJ9+uLIcTqneH5BLosLbirRA7Lfiikl2eEpMBaVsFVRqd/00VQ/fZ5elDngj9iixfNf8TWoc/PDbvHWzbQTy/hXw=='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'tZRRb8IgFIV/TR81FabbHqduvrjExIc9Y3tbiFAMoNb9+l0KVp118cE1McLhnF56v5aETlQ9M2zDP3UOMqHvCZ0YrV0YqXoCUiYkFXlCpwkhKf4S8nFjddCsphtmoHL3BEgI7JjcQlDmogJvcKDwb1tZkJA5yIPRuoOMxpxZDv42aULHlrON1w16cVoIKSdaatNYadFc3uaMXsNxpdJYio53YJzImJyzFciFtsIJXeGyEnnui42ZFKUXJBTuzP8W5dZX6Motxbffx2Doq21YJqpy3sSmzwSlPccHW6LuTXtsO2rcKekjOIzdwAJQ3+xoI8V2zkArcOaAlr3IHQ8OOnwJMQ6i5DE2HAWN2TAv2+iJDw4iom5c9ArXfVhUXfpXrF+qXPYzDtl6pesrHkhq1Fy/CEZOwfwVH5Pc2y7S3a5DfD37wxA5a9+go3tHzYBkTuzgolxXS2PFhRa4EZIe9xchxOq918sb6KKw4K6ItNu+C9LTIyApsJaV0MWo/Zp+fWUtu8eCugz8gS0eNf+BrUcfzw2np3M22M+P4R8='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'rVTRboIwFP0aHjXYyqaPUzdfXGLiw54rXGhjoaZUxX39bmlBnbiQOAihPT2nt5xTGtB5Xi012/NPlYAM6HtA51op41p5NQcpAxKKJKCLgJAQn4B8PBgd1aPhnmkoTB8BcYIjkwdwyEoUYAkGcnyVICE2kDhaac7S0xJWcrCThAGdlZztLa6Ri91USDlXUumaStP6sjSj1Q6akUJhITo7gjYiZnLFtiDXqhRGqAKHc5EkttiMSZFZQEJqrvhvHm55qSrMRnzbdYwiW23PYlFkq1q2eCUInTh+1gZxSzqh6Yhxk0srwab3AgtA9dDPGvJmLkHlYPQZKSeRGO4YNJo4GQeRcS+LXhzGStfPWuklHWz4gLrDondh9YslrzK7wYZZnsjhoQT9KItfwU1Ce/c1hnQbc/bbcBg5yZVR4/DepwbTIJkRR7gp12Wer7hWAhdCwmZ93m5ffeB/g3YGlaYlmDvz23X3ymP8H3nEHOLdVlU9Mwkn02lEW/KXd5M8mdKt4I/MRh17u8GezGxAf4U2fT4z7F4OU0e/Pmt/AA=='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'rZRfb8IgFMU/TR81Faxzj7NuvrjExIc9Y7ktRFoMRa379LsUqs4/i4mrMcLh3F48P9qIpmUzM2wjPjUHFdH3iKZGa+tHZZOCUhGJJY/oNCIkxm9EPu6sDtrVeMMMVPaRAuILdkxtwStzWYEzWCjxZ1vVoCCzwL2xtgcVjJzVAtxt4ohOasE2TjfoxWkulUq10qa10ry9nM0avYZupdLYik52YKzMmJqzFaiFrqWVusLlUnLumk2YkoUTFOT2zP8W5KMv15Vdym+3j0Hium1YJqti3pZNXwhKe4F/bIm6M+0xdtSELZUrwWFIAxtAczfRVgpxzkCXYM0BLXvJrfAOmox9mQBZiFCWjLzGaj8vjqUnPjgIiG7jole4HsNSNoU7Yv2i5Kq/rcHcY3EBbhy7z6PBkNvBHMJB7Ce+5CyoYXydU6cZUMzKHfxqdyu80HGhJW6ExN3+Qtyhey88CMc76DyvwV6Ff9z3QzyG/8EjE5CtV7q5YoIARu11ASaw8uavkCZ5ktLvgj+YDW6c7U57klmPXkB7fZ4ZTk+vU28/f9v+AA=='),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'rVTLTsMwEPyaHFulNilwJA1wAQmpB86m2cQrnDhylibl67Fjt5Q+UKTWUiR7die7nrEd8UXVPxvRyFedg4r4Y8QXRmvys6pfgFIRizGPeBYxFtsvYk9norMhGjfCQE1jCMwT1kJ9gUfecfKEHm1powKai1aC48QRT1spGocbWNkiaYFKLbTSZkjlxTBcGhn9CdtIrWvLSddgCFdCvYgPUG+6RUJd23CFee6KpUJh6QAFBe3lPwR4l1fompb47fqYJa5aI1ZYly8DLbtlFuokEiwt7pI6q7HFJFXKUew0bN0WgP6sfAMUtHsGXQGZjU3pMCfpM3hy52kSsJSBlsw9Jlq/LnfUXzPsJPhx2ht+5M04W6q+dOdpWla5mnZY4DkvDoybD2OsMOy0MJtw6qaJp+wJxW6OddruyYAShGv4U+6UeKHim0bbCIu3/QW5Q/XJ7OAPuihaoCPxd32P8uPmGn60HdJKunPeNsP1yQrsHSX1kSUJciR3KUa5Fj/eZ8ntha79JfzjIZ+f8DC+ioeTZHZgYny5iXb5+5j69P239gc='),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'rZTLboMwEEW/hmUjYpekXZak7aaVImXRtRMGsGowMtOE9Os7foQ8SKtIqSUkMzOXMffYjvis6l6NaMp3nYGK+HPEZ0Zr9LOqm4FSEYtlFvF5xFhMT8RefsmOXTZuhIEarxEwL9gI9QU+ktIMqX/pMy3uVMhkoi3B6uKIp20pGhs3sKZGaS6VmmmljSvluRu2DI3+hH2m1jVp0g0YlGuh3sQK1EK3EqWuKV3JLLPNUqFkYQMKcjyqfwrhvi7XNS7lt13HOLHdGrGWdfHmZPMpo9C2lAhLituiLflMsRIrZSU0Db9PDaD71UIXCv69gq4AzY5KtjIjl1wFTx68rARZlEGWTHxMtP696KUHIDQJTC7z4QM+12GpusLuqVFRZWq06pGeAyFUEzf6zEf4KXatOeyyObuw+0aJlxyZNY6HXo2DfwaUQLmBk3aXDAwdF1rSQlgc1rdXhO53j6cf0HneAg7875d9FZL7/0DSbiWuLQ/RNu4EzXPZWUnqM0sUaEX6wikiaCs3hucufn6cJ9Mb0Z0K/gDJJ0OQ4b65FeRdckZyv2luQUmvh5vVlx9fvD8='),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'jVPRbsIgFP0aHmcqpLrXtW6+uMTEhz0uTG4LGS0NRa37+l0KrU67RJImcO45vXAOEJZX3dryRr4bAZqwV8Jya4wLs6rLQWtCEyUIWxFKE/wIffunOu+rScMt1O4RAQ2CI9cHCMiKO47IoeUlhGLrzjoWBW8leGlCWNZK3njcwh57ZYXSOjfa2J7Kin54mrPmG4ZKbWrUZEewTu253vAv0FvTKqdMjeVKCeGbZVyr0gMaCnfFf4nwyCtM7Xbqx+9jnvpuDd+rutz0stWSInSSysEOcU86odWISVdpL8FpdAAbQPeviz0ULVyDqcDZM1JOSjgZGCx9DjIJqpRRli4CxtuwLkfpJROcxFimI2J3ET0WS9WV/lrNykromcBUP0Omt4lgVot+jJWPeCr2qDt02p1zvIGzNEiu3BoOcW3WgFnQ3Kkj/Gk35WDsuDUKN0KTYX/LoIjdn+Y3fzBF0YK7S2Dc91QouLy8yUC/frK/'),
			this.addDataEntry(dt + 'line item checkbox', 358, 56, 'Line item with primary checkbox',
				'rVTtboIwFH0afmqQinM/J24mi0tMfIIOLrSxtKStinv6tbTgFy4kDkLSnnsOtznnpgFKynolcUW+RAYsQO8BSqQQ2q3KOgHGgiikWYCWQRSF5guijwfVSVMNKyyB6yGCyAkOmO3BIZ+YgzbQBuSOcuXqSp+Yr2dYEbDqMEALRXBlcQmpabfIKWOJYEI2VJQ3j6VpKXbQVrjgRrM4gNQ0xWyNv4FthKKaCm7KJc0y22yBGS0swCDXF/w3D3e8XHC9pT/2HJPYdqtwSnmxbmTLl8hAR0I1bA1uSUfjtsGILpmVmKU3wTSA+qGRDeRdXIEoQcuToRxppoljoHjuZARoQbwsnjkMK7cvOuk5FrPwyfSnhO5SGhZLWRd2ssZFmbHxXoF8lMVNcPPQvkONifqNOfn5G8dOcmHUNLz3qcUkMKzpAa7a9ZnnO24E5XZe2/N5u333kZ//7g8iz5Wd7xvzu3MPymP6H3lUEnIwLqagBsYya54nY7kW/BHSpGeYW+zJkEboJqXX50My2/O16eiXt+ov'),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7ZxZc5s8FIZ/jS+dQQuLL7M07UU7zSSdfpffKEbYmmKLEcri/voKBHgBp7iWEjB2JjNGlkCc97yPZQkYoevF62dBkvk3HtJ4hD6N0LXgXOp3i9drGscj6LBwhG5GEDrqfwRv93wK8k+dhAi6lG0aQN3gmcRPVJfoglSu4qIgJOmcZtWdEbpK5yTJygWdqv1fRSyOr3nMRV4VRfkrqyYF/0XLT5Z8qdpcFYeiQtLXvd3Ni4q+fqZ8QaVYqSovLJRzXQO5gW42p2w2L5p5uOg4SXXBrGq7Pnv1pghAczBQLRhA9eUSOQfFhMRstsw2de92Y+Q4/sS72hejiC/lRuXb/JVVTsiULWf3xRnjddEPnqgCULR9KProlNvsd7YJkNoWNFVb/xWRzFq8zJmkD2o/WZ0XlYSqbC4XcfFxK8HgvwkGsS4TNCaSPdOt/R8jIv7HjF68zjIXXswWYXwhefL/IxFHZTJqDsx2g1Vh0gtXb2+EDXv1qIFDo1Yc/44z1a3q4OMJ3Dr82N/eA4+ilMpa1KuzaCWEWxNCpSqbpgeZqdkku46aeEHQmOAbFoDg7/bSXhpnZsnEZVMSXxZuXrAwzDpc2TumkVy3/Jpv3fjwY13l+sflx2rbnEbzwTNhzETQiKowTWnaMjuq76RWcXeb4/6GTctYbdnUM2LTcjelSwMLqvgmVFHdkMoE7ypJa4661vQZl9rbFCioCXQppSBTyfjSPEsraeosLYn4lTzS+I6nLOvBG2TcS9AGZOqu7SE38D8WqjgwAtUAWMiOiQn7ko2E2k2TzW/JnVzx87+2wQ/MkDWwQtaJBWmAY0Kbp6RJkir028bJrBTFLPl5iCuCI/kKYMPPMTN8RTvDVGRDJlCT6YYtFZ9Oha2nR1IArfgVmvBrqHOnXUYcRlAADkYocK0htJhYsotQ1A+E7lNmMAytT7p8Cp+mJKfYGaNdxahvY9oHuCY8S6v0sUJSfPhgFPZ7MOr1hKR44CStz8fckgWLV2eMdhWj1QyT2UQITBg20rljhaF+pxjqvwNDJz1hqD9shsL6xMsXSmJ1dmeGdpWhvpVEACYMO9e5Y4OhOlOHxFAI+8HQfcoMhqH1mZfvUcQUYc4M7ShDEbSxwGTmehquc8cKQ9HhDHUarkeCZhgabHsTWNHE7QlE0cAhWp90uRN8wU9q6f4EQepZGfn4Zq5/qvLHCkw9I6v0EFuZGAXQhi5BT2DqDRym9dmXexIyfuZoVzmKgY31JWTkshqRp44VhE6M/KY3hdDgHRCKQE8QOhk2QlF98uWeTllCz4PR7kLUs7G6hIxcWCOK5LGBUQQHNxJFuB8Y3SfNYDBan355SLiQZ4p2lqIusJIIRi6qSXXuWIGoa2YsCq2sL1mZG0V+TyDqDhyi9WmXH4I8qzvgzxDtKkQ9K4Y1clWN1LlzIERDluWR1jzlT/kqfzv3mrmbqVyIMj06dSzohHtyOxMa+P1MGBz3SI92d9xnr0akHsOx1VaDd6LaGNu4axcbuc7lkUx/Nfml+krbp0vdR610wW/fx+JclCvPb9kH23tshW//qRW4xcxIqZVqyZI080dCBVMHoWJdercu6pCAp68fbq9fI/E+Uh3/1ORRm+tnWenqm4+6+gM='),
			this.addDataEntry(dt + 'item list expanded', 358, 642, 'Item list (expanded)',
				'7VvbcqM4EP0aHp1CEjc/5jKZfZjdTU2mdh+3FBBGFXEpkCfxfP1I3IwNZLEtJXZsUklZjQRynz5HotMY6DZ+/ZrjLPozDQgz0BcD3eZpyqtP8estYcyAJg0MdGdAaIpfA96PnAXlWTPDOUn4lAGwGvATsyWpLJWh4CtWGwJcRER2Nw10U0Q4k/ac+OL6NyFl7DZlaV52RWF5yG48T59JcyZJEzHmpr4VyTl5HZ1uaarn+pWkMeH5SnR5oQGPqh7I9qphEaGLqB7mWPXEcVEZFu3Y9bcXH2oHDDsD9ZwBxFyukbmTTzCji0Q2q9lt+8g03blzM+ajME14p/N9ecjOGfZpsvhef2NrbfqRZsIA6rGP9RzNpk1/ySZAop2TQrT+rT0pR7xElJNHcR3Z50UEobBFPGb16UmAwf0Ag1ZlywnDnP4kG9c/BERrz4iOXxeShVeLOGBXPM3+e8L5QZGMhh2zOWBVk/TKrtodt1lO32tgV6/V939IqZhWe/PZHG7cfuZuXiENw4LwntfbbzEJCLsHhAhV6hc7kWmYJNuMmjueNxjgHQpA8P/0qrg0k2SR4FIfs+uazTENAjnhlt6MhHw98lvZunPhx7LKdg+Lj9UmOZXGg6OCmFlOQiLc5JNiYnS0a9Ikv9vDfn+Dpo2vNmjqKKFpc5mGpZ4GVFwVqIhpcEGCd4Vkso7a2vCZNdjrBMjrAXTNeY59TtNEvZa20PS1tFHEb/iJsIe0oHIGbyjjqIIOSGZ3q+J+rIQ6UImEekBDLMxVkBV3wmc7KLpr4lZkuOVPO6IbGZPg8NQoq6dFWecawAKmCrSW2RBII2CUVGI0+0cBMJP1FcABEqnRV7S1TUU6YAJ7wsRoKaA9bEh5DEqoTt1qwu1A3QJIxyIG+nmGO5qIReCzLmBbDxrtI8rpL2zA0sJCpEIsgyqmdnxsnJaXgjuvX8DWtn4123at65f1IevXQWiczaLVT64IwcPPIS7kVAzo4Fg6vvorLE/5MvGjHn7Cx7sonTmgdEeVVbQ8NfkP09YBWj8D8hd5EYbrmOTC/ckFnonw2Fo41U+FPC6LiEr24Ly4gDMNHGTqePIF3mWX3nWypSNDC/r5hS/B0sflPvmSaTrSDTmydOz+oJLsBWnDZ1pQtPvCabvA+e45Jagvp/QOe3IITiOnNIbMuezPB+oq7nFM2eoio8e6b7FMR0cgKMlrhFXs6NBQCM9OQ63T0FB45jmOgQKSPwhmPLpo6NFqqK1FQ5VUjkRV7GjRUPvsNNQ9EQ21z1xD+2mTv8OQCoW5aOiRaqhtQh2BoKR0JK1iR4uG7lEfYg6UFUM1GuptchPoyGmiEykQOfcKEdRPujzkaZxeKvCOW0htU0cwQDVlzG386BBTBJQU20FLS7Ed0LHAIXQaYjoGzdmIqXXYG2fTKnvkofx/e6uNAe+kYjNLRz0eslWw5Qn7z0N8aZewMVz2rPqpYmeUO+ZVkzJ6iz6WvreqXP0vVaEJuZAGKzGSZoXkRybqS8RNSL62PqxNRwTg58fPnY7foOJ9JDruZ4NHNNevWlfdu29i/wY=')
   		];
		  
		this.addPalette('gmdlLists', 'GMDL / Lists', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLMenusPalette = function(expand)
	{
		var s = "perimeter=none;dashed=0;shape=";
		var s2 = "perimeter=none;dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library menu ';
		var sb = this;
		var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=0.25;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
		divider.vertex = true;
		
		var fns = [
			this.addEntry('menu simple', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 170, 168),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Refresh', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=12;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Help & feedback', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=12;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Settings', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=12;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Sign out', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=12;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu');
			}),
		    
			this.addEntry('menu simple', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 170, 168),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Preview', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(0, 0.5, 16, 12), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.preview;verticalAlign=middle;align=left;labelPosition=right;fontSize=15;spacing=16;resizeWidth=1;strokeColor=none;fillColor=#747474;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(13, -6);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Share', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 18, 14), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.share3;verticalAlign=middle;align=left;labelPosition=right;fontSize=15;spacing=16;resizeWidth=1;strokeColor=none;fillColor=#747474;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(12, -7);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Get link', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('', new mxGeometry(0, 0.5, 18, 10), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.link;verticalAlign=middle;align=left;labelPosition=right;fontSize=15;spacing=16;resizeWidth=1;strokeColor=none;fillColor=#747474;html=1;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(12, -5);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeColor=#eeeeee;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
				divider.vertex = true;
				cell.insert(divider);
				var field4 = new mxCell('Make a copy', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker4 = new mxCell('', new mxGeometry(0, 0.5, 12, 16), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.copy;verticalAlign=middle;align=left;labelPosition=right;strokeWidth=2;fontSize=15;spacing=16;resizeWidth=1;strokeColor=#747474;fillColor=none;html=1;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(15, -8);
			   	marker4.vertex = true;
			   	field4.insert(marker4);
				var field5 = new mxCell('Download', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);
				cell.insert(divider.clone());
			   	var marker5 = new mxCell('', new mxGeometry(0, 0.5, 12, 16), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.download;verticalAlign=middle;align=left;labelPosition=right;fontSize=15;spacing=16;resizeWidth=1;strokeColor=none;fillColor=#747474;html=1;');
			   	marker5.geometry.relative = true;
			   	marker5.geometry.offset = new mxPoint(15, -8);
			   	marker5.vertex = true;
			   	field5.insert(marker5);
				var field6 = new mxCell('Remove', new mxGeometry(0, 0, 170, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=46;spacingRight=10;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=15;fontColor=inherit;');
				field6.vertex = true;
				cell.insert(field6);
			   	var marker6 = new mxCell('', new mxGeometry(0, 0.5, 12, 16), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.remove;verticalAlign=middle;align=left;labelPosition=right;fontSize=15;spacing=16;resizeWidth=1;strokeColor=none;fillColor=#747474;html=1;');
			   	marker6.geometry.relative = true;
			   	marker6.geometry.offset = new mxPoint(15, -8);
			   	marker6.vertex = true;
			   	field6.insert(marker6);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu');
			}),
		    
			this.addEntry('simple menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 280, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('', new mxGeometry(0, 0, 280, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=13;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Show all notification content', new mxGeometry(0, 0, 280, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=#EEEEEE;fontSize=13;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Hide sensitive notification content', new mxGeometry(0, 0, 280, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=13;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Hide all notification content', new mxGeometry(0, 0, 280, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.topButton;rSize=3;fillColor=none;fontSize=13;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Simple menu');
			}),
		    
			this.addEntry('simple menu multi line', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 280, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Title goes here', new mxGeometry(0, 0, 280, 68),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=19;fontColor=inherit;fontStyle=1;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Single line text goes here', new mxGeometry(0, 0, 280, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=#E0E0E0;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Two line wrapped text goes here making it wrap to next line', new mxGeometry(0, 0, 280, 70),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Single line text goes here', new mxGeometry(0, 0, 280, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('Three line wrapped text goes here making it wrap to next line and continues longer to be here', new mxGeometry(0, 0, 280, 90),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=hidden;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Simple menu (multi-line)');
			}),
		    
			this.addEntry('menu items', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('', new mxGeometry(0, 0, 320, 15),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Menu item one', new mxGeometry(0, 0, 320, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=triangle;direction=east;fillColor=#666666;strokeColor=none;perimeter=none;sketch=0;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-27, -5);
			   	marker1.vertex = true;
			   	field2.insert(marker1);
				var field3 = new mxCell('Menu item two', new mxGeometry(0, 0, 320, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=triangle;direction=east;fillColor=#666666;strokeColor=none;perimeter=none;sketch=0;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-27, -5);
			   	marker2.vertex = true;
			   	field3.insert(marker2);
				var field4 = new mxCell('Menu item three', new mxGeometry(0, 0, 320, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker3 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=triangle;direction=east;fillColor=#666666;strokeColor=none;perimeter=none;sketch=0;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-27, -5);
			   	marker3.vertex = true;
			   	field4.insert(marker3);
				var field5 = new mxCell('', new mxGeometry(0, 0, 320, 15),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu items');
			}),
		    
			this.addEntry('menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Open', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('Cmnd+O', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-200, -21);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Paste in place', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('Shift + V', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-200, -21);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Research', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('Opt + Shift + Cmnd + I', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-200, -21);
			   	marker3.vertex = true;
			   	field3.insert(marker3);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu');
			}),
		    
			this.addEntry('menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Open', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('&#8984;O', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-200, -21);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Paste in place', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('&#8679;&#8984;V', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-200, -21);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Research', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('&#8997;&#8679;&#8984;I', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;html=1;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-200, -21);
			   	marker3.vertex = true;
			   	field3.insert(marker3);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu');
			}),
		    
			this.addEntry('cascading menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Bold', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('&#8984;B', new mxGeometry(1, 0.5, 200, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-200, -21);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Italic', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				field2.insert(sb.cloneCell(marker1, '&#8984;I'));
				var field3 = new mxCell('Underline', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				field3.insert(sb.cloneCell(marker1, '&#8984;U'));
				var field4 = new mxCell('Strikethrough', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				field4.insert(sb.cloneCell(marker1, 'Alt+Shift+5'));
				var field5 = new mxCell('Superscript', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);
				field5.insert(sb.cloneCell(marker1, '&#8984;.'));
				var field6 = new mxCell('Subscript', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field6.vertex = true;
				cell.insert(field6);
				field6.insert(sb.cloneCell(marker1, '&#8984;,'));
				cell.insert(sb.cloneCell(divider));
				var field7 = new mxCell('Paragraph styles', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field7.vertex = true;
				cell.insert(field7);
			   	var markerTriangle = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=triangle;direction=east;fillColor=#666666;strokeColor=none;perimeter=none;sketch=0;');
			   	markerTriangle.geometry.relative = true;
			   	markerTriangle.geometry.offset = new mxPoint(-27, -5);
			   	markerTriangle.vertex = true;
			   	field7.insert(markerTriangle);
				var field8 = new mxCell('Align', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field8.vertex = true;
				cell.insert(field8);
				field8.insert(sb.cloneCell(markerTriangle, ''));
				var field9 = new mxCell('Line Spacing', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=#EEEEEE;fontSize=15;fontColor=inherit;');
				field9.vertex = true;
				cell.insert(field9);
				field9.insert(sb.cloneCell(markerTriangle, ''));
				var field10 = new mxCell('Numbered List', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field10.vertex = true;
				cell.insert(field10);
				field10.insert(sb.cloneCell(markerTriangle, ''));
				var field11 = new mxCell('List options', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field11.vertex = true;
				cell.insert(field11);
				field11.insert(sb.cloneCell(markerTriangle, ''));
				cell.insert(sb.cloneCell(divider));
				var field12 = new mxCell('Clear formatting', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field12.vertex = true;
				cell.insert(field12);
				field12.insert(sb.cloneCell(marker1, '&#8984;/'));

				var cell1 = new mxCell('', new mxGeometry(320, 344, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell1.vertex = true;
				var field13 = new mxCell('Single', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field13.vertex = true;
				cell1.insert(field13);
				var field14 = new mxCell('1:15', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field14.vertex = true;
				cell1.insert(field14);
				var field15 = new mxCell('Double', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field15.vertex = true;
				cell1.insert(field15);
				var field16 = new mxCell('Custom: 1.2', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field16.vertex = true;
				cell1.insert(field16);
				field16.insert(sb.cloneCell(markerTriangle, ''));
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 18, 14), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.check;fillColor=none;strokeWidth=2;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(36, -7);
			   	marker2.vertex = true;
			   	field16.insert(marker2);
				cell1.insert(sb.cloneCell(divider));
				var field17 = new mxCell('Add space before paragraph', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field17.vertex = true;
				cell1.insert(field17);
				var field18 = new mxCell('Add space after paragraph', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field18.vertex = true;
				cell1.insert(field18);
				cell1.insert(sb.cloneCell(divider));
				var field19 = new mxCell('Custom spacing...', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field19.vertex = true;
				cell1.insert(field19);
				
				return sb.createVertexTemplateFromCells([cell, cell1], 640, 654, 'Cascading menu');
			}),
		    
			this.addEntry('context menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 192, 146),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Show', new mxGeometry(0, 0, 192, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Grid lines', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=2;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 18, 14), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.check;fillColor=none;strokeWidth=2;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(36, -7);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Page breaks', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=2;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Rules', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=2;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				field4.insert(sb.cloneCell(marker2));
				var field5 = new mxCell('', new mxGeometry(0, 0, 192, 8),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=2;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Context Menu');
			}),
		    
			this.addEntry('menu disabled actions', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 192, 146),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('', new mxGeometry(0, 0, 192, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Home', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Back', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Forward', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=#B3B3B3;');
				field4.vertex = true;
				cell.insert(field4);
				cell.insert(sb.cloneCell(divider));
				var field5 = new mxCell('Recently closed', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=#B3B3B3;');
				field5.vertex = true;
				cell.insert(field5);
				var field6 = new mxCell('Google', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field6.vertex = true;
				cell.insert(field6);
				var field7 = new mxCell('Youtube', new mxGeometry(0, 0, 192, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field7.vertex = true;
				cell.insert(field7);
				var field8 = new mxCell('', new mxGeometry(0, 0, 192, 10),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field8.vertex = true;
				cell.insert(field8);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Menu with disabled actions');
			}),
		    
			this.addEntry('scrollable menu', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 270, 420),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Option item 1', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Option item 2', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Option item 3', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Option item 4', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('Option item 5', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);
				var field6 = new mxCell('Option item 6', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field6.vertex = true;
				cell.insert(field6);
				var field7 = new mxCell('Option item 7', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field7.vertex = true;
				cell.insert(field7);
				var field8 = new mxCell('Option item 8', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field8.vertex = true;
				cell.insert(field8);
				var field9 = new mxCell('Option item 9', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=#EEEEEE;fontSize=15;fontColor=inherit;');
				field9.vertex = true;
				cell.insert(field9);
				var field10 = new mxCell('Option item 10', new mxGeometry(0, 0, 270, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field10.vertex = true;
				cell.insert(field10);
				var scrollBar = new mxCell('', new mxGeometry(1, 0, 4, 190),
					'strokeColor=none;fillColor=#dddddd;movable=0;');
				scrollBar.geometry.relative = true;
				scrollBar.geometry.offset = new mxPoint(-4, 125);
				scrollBar.vertex = true;
				cell.insert(scrollBar);

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Scrollable menu');
			}),
		    
			this.addEntry('cascading menu', function()
			{
				var cell = new mxCell('', new mxGeometry(120, 0, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('Bold', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('&#8984;B', new mxGeometry(1, 0.5, 90, 42), 'fillColor=none;strokeColor=none;perimeter=none;sketch=0;align=right;spacingRight=16;fontSize=15;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-90, -21);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Italic', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field2.vertex = true;
				cell.insert(field2);
				field2.insert(sb.cloneCell(marker1, '&#8984;I'));
				var field3 = new mxCell('Underline', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field3.vertex = true;
				cell.insert(field3);
				field3.insert(sb.cloneCell(marker1, '&#8984;U'));
				var field4 = new mxCell('Strikethrough', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field4.vertex = true;
				cell.insert(field4);
				field4.insert(sb.cloneCell(marker1, 'Alt+Shift+5'));
				var field5 = new mxCell('Superscript', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field5.vertex = true;
				cell.insert(field5);
				field5.insert(sb.cloneCell(marker1, '&#8984;.'));
				var field6 = new mxCell('Subscript', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field6.vertex = true;
				cell.insert(field6);
				field6.insert(sb.cloneCell(marker1, '&#8984;,'));
				cell.insert(sb.cloneCell(divider));
				var field7 = new mxCell('Paragraph styles', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field7.vertex = true;
				cell.insert(field7);
			   	var markerTriangle = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=triangle;direction=east;fillColor=#666666;strokeColor=none;perimeter=none;sketch=0;');
			   	markerTriangle.geometry.relative = true;
			   	markerTriangle.geometry.offset = new mxPoint(-27, -5);
			   	markerTriangle.vertex = true;
			   	field7.insert(markerTriangle);
				var field8 = new mxCell('Align', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field8.vertex = true;
				cell.insert(field8);
				field8.insert(sb.cloneCell(markerTriangle, ''));
				var field9 = new mxCell('Line Spacing', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=#EEEEEE;fontSize=15;fontColor=inherit;');
				field9.vertex = true;
				cell.insert(field9);
				field9.insert(sb.cloneCell(markerTriangle, ''));
				var field10 = new mxCell('Numbered List', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field10.vertex = true;
				cell.insert(field10);
				field10.insert(sb.cloneCell(markerTriangle, ''));
				var field11 = new mxCell('List options', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field11.vertex = true;
				cell.insert(field11);
				field11.insert(sb.cloneCell(markerTriangle, ''));
				cell.insert(sb.cloneCell(divider));
				var field12 = new mxCell('Clear formatting', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field12.vertex = true;
				cell.insert(field12);
				field12.insert(sb.cloneCell(marker1, '&#8984;/'));

				var cell1 = new mxCell('', new mxGeometry(290, 344, 320, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell1.vertex = true;
				var field13 = new mxCell('Single', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field13.vertex = true;
				cell1.insert(field13);
				var field14 = new mxCell('1.15', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field14.vertex = true;
				cell1.insert(field14);
				var field15 = new mxCell('Double', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field15.vertex = true;
				cell1.insert(field15);
				var field16 = new mxCell('Custom: 1.2', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=72;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=#eeeeee;fontSize=15;fontColor=inherit;');
				field16.vertex = true;
				cell1.insert(field16);
				field16.insert(sb.cloneCell(markerTriangle, ''));
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 18, 14), 'perimeter=none;dashed=0;shape=mxgraph.gmdl.check;fillColor=none;strokeWidth=2;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(36, -7);
			   	marker2.vertex = true;
			   	field16.insert(marker2);
				cell1.insert(sb.cloneCell(divider));
				var field17 = new mxCell('Add space before paragraph', new mxGeometry(0, 0, 320, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field17.vertex = true;
				cell1.insert(field17);
				var field18 = new mxCell('Add space after paragraph', new mxGeometry(0, 0, 320, 32),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field18.vertex = true;
				cell1.insert(field18);
				cell1.insert(sb.cloneCell(divider));
				var field19 = new mxCell('Custom spacing...', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field19.vertex = true;
				cell1.insert(field19);
				
				var cell2 = new mxCell('', new mxGeometry(0, 470, 290, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell2.vertex = true;
				var field20 = new mxCell('Line Spacing', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field20.vertex = true;
				cell2.insert(field20);
				field20.insert(sb.cloneCell(marker1, '1.2'));
				var field21 = new mxCell('Paragraph spacing before', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field21.vertex = true;
				cell2.insert(field21);
				field21.insert(sb.cloneCell(marker1, '1.2'));
				var field22 = new mxCell('Paragraph spacing after', new mxGeometry(0, 0, 320, 42),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacingLeft=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;');
				field22.vertex = true;
				cell2.insert(field22);
				field22.insert(sb.cloneCell(marker1, '1.5'));
				
				return sb.createVertexTemplateFromCells([cell, cell1, cell2], 610, 634, 'Cascading menu');
			})
   		];
		  
		this.addPalette('gmdlMenus', 'GMDL / Menus', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLMiscPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library misc ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry('shape=rect;fillColor=#eeeeee;strokeColor=none;',
					358, 642, '', 'Background (Light)', null, null, this.getTagsForStencil(gn, 'background', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;fillColor=#333333;strokeColor=none;',
					358, 642, '', 'Background (Dark)', null, null, this.getTagsForStencil(gn, 'background', dt).join(' ')),
			this.addDataEntry(dt + 'keyboard', 358, 224, 'Keyboard',
				'3ZvZbqMwFIafhsupvLBeBjrt1UgjzcVcU3DADdsAbZM+/ZitWQ5RaIuwMFKk5Ngm5ovxf34Ta9RL94+lX8S/8pAlGv2pUa/M87p7l+49liQaQTzU6L1GCBIvjTxcKcVtKSr8kmX1lAaka/DqJy+si3SBqj4kfSD0q5g11ZFG3Sr2iyZeskCc393yJPHyJC/bqpSYlFC7qVaX+Y4NJVmeiTauXxVtq/st3zcndPvvZmXN9lf734b6zj+yPGV1eRBV3nhYx10Nathds5jxKO6bEaJ3Qb/qAtFH2yMO8aYnMk6HAjr/AB7R95ZEntUnJJ7ao4//4e9NZdEj6jZXywM/2SQ8ykQw5WGYtHT6QCCunImzuHGdin7d4wZn4Qc8i9y8rvNUxH6YU+mRcXpDg/7XPgzMuo+nbBFEO8S+Q1YHZN+UIqubssgagCxTiqyNZJE1AdlSrdkA67LQWgBtrRZa3ZaF1gZoD2qhtaWJmAPQviiFlmBpKoYRYMvVYmtI0zGMAdtcLba2NCHD0FAVSrGlWJqSYWjHfLXGrXWG1jKWQwv9WKUUWhNLQwsNWagUWseQhhY6sq1i6zOONLbQkkVqsTWpNLbQk8VqsXXkKRk0Zc9qJQlUmpQRaMp2arE1pWkZgaYsUYutI03LRp5yvauc3eJhqXoJttCU7VVObxdlC11ZoHR+uyhc6MtelU5wF4ULndmT0hnuonChNcuUTnEXhQu9Wap0jrsoXGjO8ES4Tnucw8Xoq3Dn4EguMC5GkUIbRtZK0TClUYSGi66VooOkUYTWSl8rRUx0aRihizJWi9GwpWGEhslcLUZHnsBAa2StV6blKQw0QfZqMZryJAbaHWe1GB15EgONDVorRkrkSYzzxR0T6T5qdnncRWmY3FUx39bX9klcbKrY4I21ceb6R985NwoX4YfrOd9MMcM//tEc4J78YNc4YyYBHsUXcyCFw25Qm1N6w+Peb9GDbkWjD3iyZRlbm8CfW5uYI6e5WDSzrOU2nIztdPKWW9mZ4ynPRUJo6cvRg/7kblXswKqXhZaDp9+e+YbJTrTkRdVQKFjJxVc1AIbo72No0uSne66xcWea/NCF5Joj9+7I5DfEvgXQmEM6gpgFO0BOYNq2x0fJ3/6CyFRw3e97fdK7mTnjMdGYQ3LN6QOv39A5ZVhRT7d0T8TL/CULW+jtgnV3b9Njwcl4nc0VI+PmJIiH8XKWwhif5ik+HjfitmVn+3T/Aw=='),
			
			this.addEntry(dt + 'snackbar', function()
			{
				var bg1 = new mxCell('Archived', new mxGeometry(0, 0, 358, 48), 'shape=rect;strokeColor=none;fillColor=#333333;fontColor=#FFFFFF;align=left;spacing=16;fontSize=13;spacingLeft=8;whiteSpace=wrap;html=1;');
				bg1.vertex = true;
				var text1 = new mxCell('UNDO', new mxGeometry(1, 0, 88, 48), 'text;verticalAlign=middle;align=center;fontColor=#EEFF41;fontSize=14;resizeHeight=1;whiteSpace=wrap;html=1;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(-88, 0);
				text1.vertex = true;
				bg1.insert(text1);
			   	return sb.createVertexTemplateFromCells([bg1], 358, 48, 'Snackbar');
			})
   		];
		  
		this.addPalette('gmdlMisc', 'GMDL / Misc', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLPickersPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library picker ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'date picker portrait', 328, 484, 'Date picker (portrait)',
				'7Zxdc6IwFIZ/DZfdyQfycdlq24vdbjvTzvSa1SjMojiQ1rq/fhNBRQ92/SDZJoNOO3JICJ6Hg74vEYf2px/3eTSPH7IRSx1669B+nmW8fDX96LM0dQhKRg4dOIQg8eeQuwNr8Wotmkc5m/FjOpCyw3uUvrEyUgYKvkyrQBFHc/kyZ0OxyZtxkqb9LM3y1Vo6Xj1EvOB59pvV1rDVQ66Jo1G2EEEsFqrxWM7Zx8F9XoWqHb5n2ZTxfCmaLJIRj8sWlARlt5glk7jq5gZuGYyKMjDZ9N2mQLyostCcEQoy8hK/OUT0Q9fzXPzH9MQUIRR6QSDj2Yz/O3WzbCazFqXJZCYWUzaW2yzm0TCZTWQWvWpTz8kfOSilYlkmNBlG6XXV61fGeTYVK3JWiGavVeYkgUWccPYsNic7L8SRJ2Ixn6bV6mqgl0zEB2gbuKm2OLjyjsVIzsMYemUsZ2nEk3e2s/1L0LoAraDpA5riLfGGlE6T0Ug22cd4t3rsZ877lBnuiWU5zqNswpci5KNzaB3FgZ5ZTkgRh17DScdL+ebtnM/CHcjnaSwIqlXbUCSN5Y0kWjrk3TYyXY3wlCViYIKWu4Wz7pGNxwXjgMxmv46C5QFY4jSYyBZtFM85wDBtArZqUO0HVlZKB/hWHdA37HrVx0MNuSgvs5j7TQU6sblANwCDHvUBQNNqNgD8nk8G11hgNZIBkk/dhVaHEiqDIqpYAZUQUHmwhMrnp791Mo0BhRHUALaRIsH6zGM0KQxIvdpGyiVhaAEpYn9N9XyELSAFHZA720j5GLkWkHKt/Z5X+z6OGj6nTPvqh6HlgVsntdFWX0MKaycXKCEH/Q9iKTk9mDaOUruYoGVBbS8w3WJLETloVri2k9MtvhSRg4ZGz3ZyusWYGnIEGhye7eR0izNF5KDh4bdObueC9f8np1usKSIHDZCgkwBGkIOGSNhJgEsweUowQTdkbeR3GuCLo2uwR3AnAoxAB/0RTDoVYAQ66Jl8MrdR9E3mhYQ1Z3kihpGc1tGnbejg7MfGWY5nHxGbyZP7R4QO/p6LCOSP2udfjXi1FmxqjwfoxGDrrRjt4kINOmjF4F6nLkxAR6EXg71OXlzAiSIlnKDzgv1OXhiBDlovOOjkhRHooPeCw05eGIGu6ec23VUGI9BBP8b++Sq6lYAidA3zVUinBIxAB/0YayexaOKkZDIfhT6J/VNWtCsBNeigT2L/nBXtSkAJOhf6JPZPWtGuBNSgg9YJ8TslYAQ6aJ3YP21FuxJQgw5aJyTslIAR6KB1QlGnBC7hpOTHIS70SfrXP/u3Pw6x2r+LxaGJl+AmPE0AtndMQCcfBnXc7dYg3rlSDT8C/YbL5L2WLpNjb/c6+dV6w+1ShxbL4/eO+EHioULioQLgYnF7A7ayef3+bH8B'),
			this.addDataEntry(dt + 'date picker portrait dark', 328, 484, 'Date picker (portrait, dark)',
				'7Zxbb6JAFMc/DY/dzAW5PLb08rDbbZM22WdWRyGLYmBa6376nYER0YONugzBKTQ1cuaG58fBM38GLRrMPx6ycBk9phOWWPTOokGWprx8N/8IWJJYBMUTi95ahCDxb5H7A6W4KEXLMGMLfkwDUjZ4D5M3VlpKQ87XiTLkUbiUbzM2Fl3eTOMkCdIkzYpSahP5J+w5z9I/rFbCik2WROEkXQkjFjtqPJZx9nHwmAuTOuAHls4Zz9aiyiqe8KisQYlXNotYPItUM9uzS2OYl4ZZ1XbrAvFGeaHZIxR45DV6s4hoh66XmXjF9EQXjYpN2tMFr9mnxQZct0gX0mthEs8WYjdhU9lnvgzH8WImveiorl7iv3JQSsW+dGg8DpNr1ep3ynk6FwUZy0W1X8pzksAqijl7Ed3Jxitx5glbxOeJKlYD3agObq+cY6mR86j5TmnLWBLy+J3t9P8/JG1AUsBzATzxkXiDB+fxZCKr7FO7L7ato15T4cBb51NEWNKX4zzJKnwtTC46B85RHOiZ0YM0cRg1XGOchFcf53wW2wg6ngVBteAaC6exrJFES6e83Yan1QjPaSwGJmi9GzibFul0mjMOyFTHdRQsB8ASV71Y1mgjeM4BhmkTsKKCOg6sLZQO8FUN0DdsO+rboIZchNdlMXebAnRmcoBWAL0RdQHAS4tZD/B7ORlcY4DVSI6LretAq0PxtUERUayBig+oPBpC5fPL38aZFwMKI5jym0aKeJsrz0WTwoDUL9NI2cT3DSBFzI+pkYuwAaSg4HFvGikXI9sAUraxeV4tH0cN31OXlvphKHng1klVc6svQsrTQgrqHcQQUt1gqRSjdrFASYKaFkBdT540kYLig20aqa4nT5pIQUFiZBqpridPekgRKEg4ppHqevKkiRQUJNzWSXkouAnsLzN50kQKChLekJL3khQUJPwhJT8Fi6MFC1QfNsL5kJP3DFWD/ICHpLyXqKD+gMmQlfcSFdQkPlkKKNrGy1zCWbIsFsNILhvr89a0v1iwSvYaFwWefQZUyzT31810wd+xEYH8Ufv81YhXmwmU3vMBKh/YOOmj8+RfDyoofeDRkP33ERWF2gd2hvT/BC4UaeEClQ7sDul/L1FBqQN7Q/rfS1RQ68D+kP73ElXT4ySDKt9LVFD/MG/9RdeZuSZUDesvyJCZ9xIV1D+MWZTRERcti80o1CHMW4LReWauBxXUIcxbg9F5Zq4FlQ11CPMWYXSemetBBaUJ4g6ZeS9RQWnCvGUYnWfmelBBaYL4Q2beS1RQmqBoyMxP4aLl4QIb6hDB9c/g7schNvu/enBoIeDO0/ToAIDtE/boZOz1O8TtxhzeuTMLv9LchtvCo5ZuC2Nn977w1abjdqlDSePp+0D8IHFfI3FfA3Cxu/19rrJ6/ee7/gE='),
			this.addDataEntry(dt + 'date picker landscape', 512, 304, 'Date picker (landscape)',
				'7ZxbU6MwGIZ/DZfu5MTp0q2Hi11XZ3TGa7ZNCyMtDKC1++s3KfT4pWqVoInUcQY+EoLfk6S8LxGHDqbPl0WUx1fZiKcOPXfooMiyqt6aPg94mjoEJSOHnjmEIPHrkIsDR/HyKMqjgs+qt1QgdYWnKH3kdaQOlNUibQJlHOVys+BDccqf4yRNB1maFcujdLz8iHhZFdkD3zrClx95JI5G2VwEsdhp2uNFxZ8PXvMy1FzwJc+mvCoWosg8GVVxXcLFzYXGPJnETTWKWB2MyjowWdfdpEBsNFlQZ4SCjNzFjw4R9bxU/v1/C7E1kVunudhEmB6ZMYRCLwhkPJtVr2dyls1kEqM0mczEbsrH8pxlHg2T2UQm1WtOdZv8k41SKvZlfpNhlJ42taos31S6kztnmInIPE4qfivCsuZc9EIRi6tpegws8ios7AWaYDEASwDxARBx+ZUiK9NkNJJF9klcLD/7CfNeTDt2xb5s51oWqRYi5CMRKngpCtw3ycAt5Zy+L+esngxQwdOoSp74zvk/wsFVTCP1cPkoC3Ymf45jQdDWgBmKpPFCSeIj3bupgH5Q4jVT0fb0hDpMvgeSL2amRJZoYzC8BwCmKgDLAs11YG1D4zVejIQ+4EUY6RCYrxotk28xWkK0+oL9rNESgOTfHp11ZdfewhAg+fNpXVw9JalumMiRSW4avckScS0ELZrTeLs1svG45BWAsr7UN3EKAacr2zgppyIWmMUJI3jDbBsoV8ys5oPCANS9baA87BPzQRH7R5SPUWg+KOgVXNgGKkDMgu8oZv9NXxAGzPibPgyNBNw6qLVI+hqCVAmOhdrArYyhdsFBE4LYDk4pszSCwwjpIAfdCGo7ObXw8kwjB60MZjs5tRIzjhw0N1zbyamlmWnkCHQ7PNvJqbWaceSg/eG3Tm7n2e4XuLVUijfjyEE/JOhFgRHkoEES9qqgZXKr87RLDjomK6O/lwVfHJ3CQ8G9LjACHXRRMOmFgRHooI3ywspAUTfJSwkr50UimpGcVtGbTejg2kHlGsF394j10sP9HtGJvHBdgJ9q8K2bBk9WVqXe7gC9GWy9OdO53NCDDpoz2O31hgnoKHRnsNcLjpbReUwHOmjPYL8XHEagg/4MDnrBYQQ6aNDgsBccRqBT/e9L/yjCCHTQofkGy1y6Fgd60CnWuZBeHBiBDjo09q906VwchDqWBVLopti/1KVzcaAHHXRT7F/r0rk40IKOQTfF/sUunYsDPeigm0L8XhwYgQ66Kd9guUvX4kAPOuim2L/epXNxoAcddFMo6sVBu+jWE1m76KCbMjj9Mzj/fQjf/osqDq3h3HmHAjrAZPNeBXR0z9juAe2yxbuPuAFkX/HGBRe19Xwd7bR+4upYWsigEXP9qyd+kHiokXioAbjY3bwFrS6+/ZK0/w=='),
			this.addDataEntry(dt + 'date picker landscape dark', 512, 304, 'Date picker (landscape, dark)',
				'7Zldb5swFIZ/DZet/AEkXCa068XaNVon7XJCwQlWTYzAa5L9+tlgwoehSZXCJLRUlfCLD3ae1z7GjoX9+PCQBkn0xEPCLHxvYT/lXBRX8cEnjFkI0NDCdxZCQP5b6EvPXZjfBUmQkp24JAAVAW8B+00KpRAycWRayKIgUZcpWctHLjeUMZ8znuZ3sY3Un9QzkfJXUt7Z8R1RYhSEfC/LUBaCLMkfcbehByLbX+q2SSrIobf/uaQ7/0B4TER6lFX2NBRRUcOButMRodtIh2FgF2KQFcL2FFvhkBeaSDcdbNDBFl5g8EFGTv5ROt+Jmr7JP33sAka3O1lcSxQkVbWSYE13WykB/awX+ke16ij+CiNdB2yhw2IahoxUYUsuBI9VbbsSH8lG8YKulPYRFeRF6uqRezkipRaJmGn3LjILnTULuvOBzLINsxZPhlGy8+I9WAb0Pstq+OGsLOt2lD2qoWcFWRylMgNNmF2sLwKMuwEfdYDtFiHngNvget6OwXs1Iu8RYM7AeDDdy/OwDKRJpuAlJKWyJcWtVFeV1JuFOrPNgLNfByCk2ZV8zbF6msR1vCfxGr6zjkzeBhwGWaTWpXz+lrTjw1YtzrfbOGS3QrL9ldD1axffOfCXvm3wrd85Ow3S4mu3Z0HLup+aGKoS+XfNy2tNFaeVmuAnWe2+azWEoGk16JhKoHMhuN7quWE1HCctOaNMIzkYGmyxidb2hklSnkEWTYqshxpkXTwa2XK+1NDa00JrNxOC0zFq3YHYQoOtM62E0FpX5+54bM39ozsptrCZbBEYcdyau8/ZlNiiGfx349bcLM4nxRa75/PtUGuZuTH0JsUWtcZt+SI7BltznwjBtAbu/Ow72FA5wdwjQjjlhItHXMs6NmVoyi8KcMS1zNyW+Ytv/v1jH986HWxSrM4xiqOFHzzRZyJdGJuH0h+zrn4o8bl2tDK04UV5tFf3olwiU8ICQd+aZwddBunWV5zKTp2avoFu8/DjxmmZzDebjAjD4tO3uMh1ZO4Yn7/+d7zXcW9Ax70BDJfF6lfAonr9R8K/'),
			this.addDataEntry(dt + 'time picker', 328, 484, 'Time picker',
				'7Zlbb5swFMc/DY+dfOP2mKZdH9au1TppjxMKTrBqYgRek+zTzwaHS0yadA1MQksUCR/72PD728ccx8HzdHuXR1nyIGLKHXzr4HkuhKyu0u2ccu4gwGIH3zgIAfVz0OcjtbCsBVmU07U8xwFVDq8R/0UrS2Uo5I4bQ5FEmb7M6UJ1eb1knM8FF3lZi5flR9kLmYsX2qqh5UfXJFEsNsoIVSEqsrKfmyXbUnUT1+YGaC7p9uhDlCbzBHdUpFTmO9Vkw2KZVC0wCiq3hLJVYtxIQCpjVFSGVe3bMFEXBks/Imwhwg6eYfBOUACEXhBou1jL0wDXYq3ZRZyt1qq4UChorltl0YKtV8oETF/P7Lce1dV9a4xsEfGZcUtZHHPauF0LKUWqpQCN8Z4uNS9MlGmTMEmflV13uVHTUtkSmXKj3lliob8TK/Q+rhWxtJo9WDqpe5dvsbKYH1OsRR/6+7IZR/PVAz1qxnKnLD64EF/cz9c4qElfuexMB6bYwk9Az1IBH6fvWvSfRqQ/PlqCRkPrnR+nlSPLCo0yozlTI2mKe+tTYzoMUE287gtEH1n5ewevOzH3IbSFrw4CbX4XiQx+TxQ/JBhHRaL3pHLx7nGm25XenT+t0ph/kgrez4wtXvoA1hHe2grrmpOzPq8e+8Qm8cMQQ00Q/2Z4QXywNNwLLQ3vbW2J2xUX2WGnbnPpxRFY2sKLhx1yo78DsX173SAAumyJb8edcBi0oYUWTQotOYhJIRgNLQQWWzJlthiGNltvILbQYutOOSRgzxuPrZ0zelNiC8kB2wCPx9ZONv0psfWDfzdt7dwwmBJajE9H26F2MjvxCycVEbrvtsgNxkNrJ34QTHja9r6ADRUR7JwQwglH2968YSi2PTkZmvJbAsRkPLh2VjaffZ3f3h8D3MaDbYzNwUV1lvBdZOYQpI9j9wT6fdrtT0fh5fXoqmFp4fcczLnGllMeSfbaPTvoE8iM/iSYuql66CvodefClXsgslguCyotieunOEt1ZOeLj1/+K35U8XBAxcMBBFfF5n+/qnn7b8E/'),
			this.addDataEntry(dt + 'time picker dark', 328, 484, 'Time picker (dark)',
				'7Zldb5swFIZ/DZed/MXXZUK7Xqxdq3XSLicUnGAVYgRek+zXzwYTIIY2XQOT0BJFwsc+Nnle+5hjLByk+9s8zOJ7HtHEwjcWDnLORXWV7gOaJBYCLLLwtYUQkD8LfR6ohWUtyMKcbsU5DqhyeAmTX7SyVIZCHBJtKOIwU5c5Xckul2uWJAFPeF7WYoLUV9oLkfNnWtds+ZYqYxxGfCfLUBbCIiu7uF6zPZXjL/XYNBd0P3j/pUnf/C3lKRX5QTbZsUjEVQuMvMotpmwTazfikcoYFpVhc/RtcMgLTaSfDjboYAsvMHgnI7v8KDvfipZ9XX6G2IUJ22xlcSVR0Fy1ysIV226kCei+nthvNartybLCyFZhstBuKYuihDZuSy4ET5UUoDHe0bXihYk07WIm6JO0qy53ckZKWyzSRKt3lljo78TynY9rRQytFveGTvLexWusDOZDirXoQ7cu63EUXzXQg2IsDtLiggvxxf18tYOc9JXLQXegiy38BPQsFfBx+rZB/3FC+tOjJWgytM75IVo6sqxQKDOaMzmSolhbHxvTYIDqDUQfWfm1g9OdmHUIbeE7BoE2v4tEBrcnip8SjMIiVntSuXhrnOl+ozbmT5s0Sj4JCe9nxlbPfQA9ECwDYgBs17w56/Pqb7+xSfzQxFATxL9pXhCfLA37QkvDeV1bYnfFRWbYOba59OLwDG3hNGHHHnfHrMMOAF22xDXjjj8OWt9Ai2aFlpzEJB9MhhYCgy2ZM1sMfZOtMxJbaLC15xwSsONMx9ZMF505sYXkhK2Hp2NrJpvunNi63r+btmZu6M0JLcZvR9uxdjIz8fNnFRG6z7bI9qZDayZ+EMx42vY+gI0VEcycEMIZR9vevGEstj05GZrzUwLEZDq4ZlYWLL4GN3dDgNt4sImxObiozhK+80wfgvRx7J5Av0+7+nQUXl6PrhqGFm7PwZytbTlNQsFeumcHfQLp0R85kzd1HPoKOt25cGWfiMzX64IKQ+LjvzhLdWTmiw9f/is+qLg/ouL+CILLYvPKr2refiP4Bw=='),
			this.addDataEntry(dt + 'time picker landscape light', 512, 304, 'Time picker (landscape, light)',
				'7Zldb5swFIZ/DZet/AEELpO068XatVon7XJCwQlWTYzAa5L9+tlgwodJSZXAJLREkeCYg83z2udwHAsv4/1DGiTREw8Js/C9hZcp56I4ivdLwpiFAA0tfGchBOTPQl9OtMK8FSRBSrbiHAdUOLwH7DcpLIUhEwemDVkUJOowJSt5y8WaMrbkjKd5K17nH2nPRMrfSK2F5B/VEgUh30kjlCdBluT3uVvTPZGDWOgBkFSQ/cmHyE36CR4Ij4lID/KSHQ1FVFzhQD3yiNBNpN0wsAtjkBWGzdG3YiIPNJZuRNhAhC08x+CToADwXc9Tdr4V/QC3fKvYBYxutvJ0JVGQVF2VBCu63UgT0Pd6pX9Ur44EtFAY6Spgc+0W0zBkpHJbcCF4LBtcUBkfyVrxgq407SIqyKu0q1vu5LSUtkjETKt3llioVyzoegOJZRtizZ8MoeTgxUewDOinJKvhh7PyXPejAKuOnhVkcZCWGbgSYNwN+KAdbLdw6QNug8t5OwbvlxF5jwBzBsaD6Z4fjKUjTTIFLyEplT0pbqX1pTK1o1AVlLuizSXLWzsgpOGUAM3JeFyldX5H4yUAZx2huk0wDLJIJZ58gZY44/1GpeDbTRyyWyHh/Uro6q0L4DGMG/nu2NI7z9PisXsywU9NDFWR+rvm5bfWgtOKPfBKa8P9UGoIQVNq0LFWQGekv1xqz5AaXj3u2Hfq28F6wCypHbDjNNhiE63tDxOFfIMsmhRZHzXIung0suV6qaG1p4XWbgYEp2PWugOxhQZbZ1oBoZVXPXc8tmaV6E6KLWwGWwRGnLdmeTmbEls0g/9u3prVoDcpttjtj7dD5TKz8vMnxRa15m35IjsGW7MQhGBaE9frfQcbKiaYNSKEUw64eMRc1lGUoSm/KMARc5lZli3n35b3j6f41ulgk2K1j1FsLfzgid4T6cLY3HX+nHT1TYnrytGK0IYW5d5dXYsyRaaEBYK+N/cOugTSvb9wKgd17PoGus3NjxunJTJfrzMiDImPT3GW6sisGJ+//lf8pOL+gIr7AwguT6v/+orL638F/gU='),
			this.addDataEntry(dt + 'time picker landscape dark', 512, 304, 'Time picker (landscape, dark)',
				'7Zldb5swFIZ/DZet/AEkXCa068XatVon7XJCwQlWTYzAa5L9+tlgwoehSZXAJLREkfCxD3ae9/gYGwv78f4hDZLoiYeEWfjewn7KuSiu4r1PGLMQoKGF7yyEgPxZ6EtPLcxrQRKkZCvOcUCFw3vAfpPCUhgycWDakEVBoi5TspK3XK4pYz5nPM1rsY3UV9ozkfI3UtZs+ZYoYxSEfCfLUBaCLMlvcbemeyL7X+q+SSrIvnf8uUkP/oHwmIj0IJvsaCiiooUD9aAjQjeRdsPALoxBVhg2R98Kh7zQRLrpYIMOtvACg08ycvKPsvOtqNnX+aePXcDoZiuLK4mCpKpVEqzodiNNQN/rlf5RvTqKv8JIVwFbaLeYhiEjlduSC8Fj1dqujI9krXhBV5p2ERXkVdrVLXcyIqUtEjHT6p0lFjopFnTnA4llG2Itngyh5ODFR7AM6H2S1fDDWVnW/Sh5VEfPCrI4SMsMXAkw7gZ80A62W7icAm6Dy3k7Bu+XEXmPAHMGxoPpnp+HpSNNMgUvISmVPSlupfWlMvVmoc5sc8n01g4IaTglQDMYj7O0zu9ovATgrCNVtwmGQRaphSefoCXOeL9Rq+/tJg7ZrZDwfiV09dYFcA78pW8bAOs1J+M8Lf52O8xb2vzUxFCVqb9rXl5rLjit3AOvNDfcD6WGEDSlBh1zBXRm+sulnhtSw3HyjjPsKqkdZDA02GITre0Nk4U8gyyaFFkPNci6eDSy5XypobWnhdZuJgSnI2rdgdhCg60zrYTQWlfn7nhszQ2iOym2sJlsERgxbs3t5WxKbNEM/ru4NXeD80mxxe7pfDvUWmbu/LxJsUWtuC0fZMdga24EIZhW4M5PPoMNlRPMPSKEU064eMS1rGNThqb8oABHXMvMbZm/+ObfP/bxrdPBJsXqHKM4WvjBE30m0oWxeer8OenqhxLXlaOVoQ0tyrO7uhblEpkSFgj63jw76BJI9/7CqRzUsesb6DYPP26clsh8vc6IMCQ+/ouzVEfmjvH563/FexX3BlTcG0BwWaxe8xXN628B/wI='),
			this.addDataEntry(dt + 'year picker light', 328, 484, 'Year picker (light)',
				'7ZhNb6MwEIZ/DcdK/iAEjlnS9rAfXSmV9swGJ1g1ODJuk+yv3zG4SSimLUmQeoAokT32eMz72JrYHo3z3b1KNtlPmTLh0VuPxkpKXZfyXcyE8AjiqUfnHiEIvh6562jFVSvaJIoV+jMOpHZ4ScQzqy21odR7YQ1llmxMUbElDPltxYWIpZCqaqWr6gF7qZV8YictrHpMS5akcgtGDBUbjynNdp1zrkx2wvdM5kyrPXTZ8lRndQ9KwtotY3ydWTc/9GtjUtaG9cH3KAEUrApuRWhLkcfs2SPgh2YbBb+Y9pQIoSgIQ2OXhf5YukIWRrVE8HUBVcFWZsxykyx5sTYqBnaoBf9nglIKdSMoXyZiZr3+Sq1lDg2KldDtj1XOENhmXLMFDGect7DywJbpXPQBRM4DFAW1TTGRaP7CGuNfAs1vQQNO0xYneCXtECvnaWq6vAV0Vz1H8R8laDUP3qWBJ1A3cR5MF70H0xQNxoGeuVHQQBwmLg5+bw6va38JL8pUG4w/Nx+H8F9qtfthT5VtiN+SQ2SC9s1N8+ohV6uS6RaVw8Q+BSpwgZqMoC4BhX1/AFJTF6lgJHURqYgMQCq8ThL6iFTj74QlRaKvRmrSN9W7SR1S1VVJRS5S4binLiI1SJ7CyIUqGlFdgooOkqgwdqCyx88R1bmoBslUuH3sj2e/4tsfXbBOpabvpKTGQQl1EDgenlDvdbCwU8PXI9l02DdqJ5SnyJHk+p6j3kC2oW9wgBrRbyZDZD3cvtp4+D4S7yQeDUg8GgA4VI8Xh3X303vF/w=='),
			this.addDataEntry(dt + 'year picker dark', 328, 484, 'Year picker (dark)',
				'7Zhdb5swFIZ/DZeV/EEIXKa068U+OimVds2CCdYMjozbJPv1O46dDwKkJSlbJ4UoCL/2sc37YB3ZHo2L1YNKFvlXmTLh0XuPxkpKbZ+KVcyE8AjiqUfvPEIQ/D3yqaMWb2rRIlGs1G8JIDbgJRHPzCpWqPRaOKHKk4V5VGwGXd5mXIhYCqk2tdQn5gd6pZX8xbY1pSyZEfMklUsoYyi4oZjSbNU53Y3k5vrAZMG0WkOTJU91bltQEtqwnPF57sL80LdiUllhvovdvz08OAPazaANM57yZ49AHJosFNwx7enOaHMZXZb6QM82V5drieDzEoqCZabPapHMeDk3Lgauqyn/bQalFMrGUD5LxMRF/ZRaywIqwGb9aGL1GuQxAkmxCiJ/ODMNlGXONZtCK9PfEr5D0HJdiD7MyHnMosBqiolE8xdW6/8Sjn6DI6AbN9AZf1r8K3iamibdzCyPJwle3QUnAeEt+7/CgZ65dtBAHEZtHPzeHLbLYQYvytQJMMfGf6iv3Q97uuyG+C45jEzQur5othEyyyqmG1R2E3sTqKAN1OhfgjqA0sbsPwCFfX8AUuM2UsGV1EWkIjIAqfB9ktBrpEIU38Z+nRSJPhqpUd9U305ql6relVTURiq8rqmLSA2SpzBqQxVdUV2Cig6SqDBuQeU2o1dU56IaJFPh5iFAPPkW33/pgnVoNT2RkmobJdRh+37zhHp/B1M3tSO6l5CsB6xrpQPKY9SS5Pruo44gu6FvcIBqo9+Mhsh6uHna8fj5SryTeDQg8WgA4FDcHyPa5oenjH8A'),
			this.addDataEntry(dt + 'date picker landscape light', 512, 304, 'Date picker (landscape, light)',
				'7Zhdb5swFIZ/DZed/AEELjPS9mLtOimVds2CE6w5GBm3SfbrdwzOBwGapoWLSjiKZL/2sc372CG2Q6P19l7FefooEyYceuvQSEmpq9x6GzEhHIJ44tCZQwiCr0PuOmpxWYvyWLFMvyeAVAGvsXhhlVIJhd4JKxRpnJusYgvo8vuSCxFJIVVZS5dlAr3QSv5lJzWsTKYmjRO5ARFDwY7HlGbbzjmXkp3wPZNrptUOmmx4otOqhYftRFPGV6kNo8itxLiohNUh9mgBZKwL7Y7QhiPP6YtDIM4X5vn/KMitTG6aQxZheqVjCIV+EBhdZvqyk5nMjImx4KsMioItTZ9FHi94tjKm+rarOf9nBqUUysZfvojF1EZpmR+Dnk1hhl1QNinXbA6yidzAKgQt1WtxDSxyERb2g4FguQ1YAGTSAALT1y2urHmSmCbnJO7KdG6Y/6bt2IOyGefJNNE7kCYIJMUKaPDbmoF78px+zHO3+jFAiolY81dW6/8zHLw2Du7VHPaLfAEPylQTjDsznxbjh3G5Y2XbAPSNksBGnRhPXbdlsfsDGe+3Ge+Nxn/YeDvqL8lhMgTt6t3sI+RyWTDdAHWY67vYTdrY+SO7ntlNyADsgn5ePJfY1f4rWHYk/ALs9ton2WEUDAAvbIMXjBuv542HvSF2HkZt9MKRXt/0giG2HsYt9OwZdaTXH73D0ahfes3rgmj6M7p96OJ36j594/VWO2ihDijHwxe6emnM7dRw73BtwK5WOqE8QU3I3rXnsDPIdugb7KPa6Df7jvul3rwSefoxEu8kHg5IPBwAOBSPF45V89P7yP8='),
			this.addDataEntry(dt + 'date picker landscape dark', 512, 304, 'Date picker (landscape, dark)',
				'7Zhbj6MgGIZ/jZez4aDWXnacw8UeZpNOstdupZUsikFm2u6v3w+lrVbtTGf0YhNpmsALH+D7gAYcGqa7RxXlyXcZM+HQe4eGSkpd5dJdyIRwCOKxQ+8cQhD8HfLQU4vLWpRHimX6PQGkCniNxAurlEoo9F5YoUii3GQVW0GXt2suRCiFVGUtdYn5gV5oJf+wWg0rk6lJolhuQcRQsOMxpdmud86lZCf8yGTKtNpDky2PdVK18LCdaML4JrFhFLmVGBWVsDnGniyAjHWh2xHacuQ5eXEIxPnCPP9vBbmNyS1yyCJMr3TMK5PRZaZr+rpMLSczmRkTI8E3GRQFW5s+izxa8WxjTPVtV0v+1wxKKZSNv3wViYWN0jI/BT2bwh12QdkmXLMlyCZyC6sQtESn4hpY5E1Y2A9GguW2YAGQWQsITF93uJLyODZNzkk8lOncMP+i7dgQNeM8mSZ6D9IMgaRYAQ1+WTPwQJ7Tj3nuVi8DpJiINH9ljf4/w8Hr4uBezeGwyFfwoExd2CLnxo/jcs/KtgHoCyWBjaoZT123Y7H7IxnvdxnvTcZ/2Hg76k/JYTIE7ZvdHCLkel0w3QJ1nOu72M262PkTu4HZzcgI7IJhPjxvsQtQeBu6TXZk/h+wO2ifZIdRMAK8eRe8YNp4A2887I2x8zDqojef6A1NLxhj62HcQc+eUSd6w9E7Ho2Gpde+LggXP8L7b3386u7TC5+3xkEL9UA5Hb7Q1UtjaaeGB4drA/aNUo3yDLUhe9eew84g26FvsI8ao98cOh6WevtK5OnrRLyX+HxE4vMRgEPxdOFYNa/fR/4D')
   		];
		  
		this.addPalette('gmdlPickers', 'GMDL / Pickers', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLSelectionControlsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;labelPosition=right;align=left;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library selection control ';
		var sb = this;
		
		var fns = [
			this.addEntry(dt + 'checkbox on hover light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#009587;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, hover))');
			}),
			this.addEntry(dt + 'checkbox on focused pressed light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#009587;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#009587;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, focused or pressed))');
			}),
			this.addEntry(dt + 'checkbox on disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#B0B0B0;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, disabled, light))');
			}),
			this.addEntry(dt + 'checkbox on disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#B0B0B0;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, disabled, focused, light))');
			}),
			this.addEntry(dt + 'checkbox off hover light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, hover, light))');
			}),
			this.addEntry(dt + 'checkbox off focused pressed light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, focused or pressed, light))');
			}),
			this.addEntry(dt + 'checkbox off disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, disabled, light))');
			}),
			this.addEntry(dt + 'checkbox off disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, disabled, focused, light))');
			}),
			this.addEntry(dt + 'checkbox on disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#676767;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, disabled, dark))');
			}),
			this.addEntry(dt + 'checkbox on disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#676767;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'checkbox off hover dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#ffffff;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, hover, dark))');
			}),
			this.addEntry(dt + 'checkbox off focused pressed dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#ffffff;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, focused or pressed, dark))');
			}),
			this.addEntry(dt + 'checkbox off disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, disabled, dark))');
			}),
			this.addEntry(dt + 'checkbox off disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'radio button on hover light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#009587;fillColor=#009587;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, hover))');
			}),
			this.addEntry(dt + 'radio button on focused pressed light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#009587;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#009587;fillColor=#009587;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, focused or pressed))');
			}),
			this.addEntry(dt + 'radio button on disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=#B0B0B0;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, disabled, light))');
			}),
			this.addEntry(dt + 'radio button on disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=#B0B0B0;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, disabled, focused, light))');
			}),
			this.addEntry(dt + 'radio button off hover light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, hover, light))');
			}),
			this.addEntry(dt + 'radio button off focused pressed light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, focused or pressed, light))');
			}),
			this.addEntry(dt + 'radio button off disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, disabled, light))');
			}),
			this.addEntry(dt + 'radio button off disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, disabled, focused, light))');
			}),
			this.addEntry(dt + 'radio button on disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#676767;fillColor=#676767;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, disabled, dark))');
			}),
			this.addEntry(dt + 'radio button on disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#676767;fillColor=#676767;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'radio button off hover dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#ffffff;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, hover, dark))');
			}),
			this.addEntry(dt + 'radio button off focused pressed dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#ffffff;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, focused or pressed, dark))');
			}),
			this.addEntry(dt + 'radio button off disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;html=1;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, disabled, dark))');
			}),
			this.addEntry(dt + 'radio button off disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;perimeter=ellipsePerimeter;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;html=1;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;html=1;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'switch on light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=on;strokeColor=none;fillColor=#0E9D57;offTrackColor=#BCBBBB;offKnobColor=#F1F1F1;sketch=0;html=1;');
				bg1.vertex = true;
			   	return sb.createVertexTemplateFromCells([bg1], 36, 20, 'Switch (on, light)');
			}),
			this.addEntry(dt + 'switch on dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=on;strokeColor=none;fillColor=#80CBC4;offTrackColor=#BCBBBB;offKnobColor=#F1F1F1;sketch=0;html=1;');
				bg1.vertex = true;
			   	return sb.createVertexTemplateFromCells([bg1], 36, 20, 'Switch (on, dark)');
			}),
			this.addEntry(dt + 'switch off light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=off;strokeColor=none;fillColor=#0E9D57;offTrackColor=#BCBBBB;offKnobColor=#F1F1F1;sketch=0;html=1;');
				bg1.vertex = true;
			   	return sb.createVertexTemplateFromCells([bg1], 36, 20, 'Switch (off)');
			})
   		];
		  
		this.addPalette('gmdlSelection Controls', 'GMDL / Selection Controls', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLSlidersPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library slider ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;inactiveTrackColor=#bbbbbb;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=30;shadow=0;html=1;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;inactiveTrackColor=#bbbbbb;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=30;shadow=0;html=1;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;inactiveTrackColor=#bbbbbb;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=30;shadow=0;html=1;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=20;shadow=0;html=1;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=20;shadow=0;html=1;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=20;shadow=0;html=1;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=none;handleSize=6;shadow=0;hPos=0;html=1;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=50;html=1;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=100;html=1;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=0;opacity=100;strokeWidth=2;fillColor=#000000;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Discrete slider (normal, light)', null, null, this.getTagsForStencil(gn, 'discrete slider normal light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=60;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Discrete slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=100;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Discrete slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;inactiveTrackColor=#bbbbbb;barPos=1;strokeColor=#BEBEBE;opacity=100;strokeWidth=2;fillColor=#BEBEBE;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;inactiveTrackColor=#bbbbbb;barPos=60;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;inactiveTrackColor=#bbbbbb;barPos=100;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=0;bright=1;dotColor=#000000;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=60;bright=1;dotColor=#000000;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click, light)', null, null, this.getTagsForStencil(gn, 'slider click light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=100;bright=1;dotColor=#000000;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click, light)', null, null, this.getTagsForStencil(gn, 'slider click light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=0;html=1;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=50;html=1;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=100;html=1;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;inactiveTrackColor=#bbbbbb;barPos=0;strokeColor=#ffffff;opacity=100;strokeWidth=2;handleSize=10;shadow=0;html=1;',
					200, 10, '', 'Discrete slider (normal, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider normal dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=0;bright=0;dotColor=#ffffff;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider click dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=60;bright=0;dotColor=#ffffff;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider click dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;inactiveTrackColor=#bebebe;barPos=100;bright=0;dotColor=#ffffff;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;html=1;',
					200, 45, '', 'Discrete slider (click, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider click dark', dt).join(' '))
   		];
		  
		this.addPalette('gmdlSliders', 'GMDL / Sliders', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLSteppersPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library tab ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'stepper', 704, 478, 'Stepper',
				'7VjtbpswFH0a/vsDCPm5srSq1GWVuj2AWy7BmsHIeE3y9rPBNKEkLWrxpFbFimIf+/rjHO7lQkDTcnelWF38kBmIgK4CmiopdVcrdykIERDEs4B+DwhB5heQyzO9uO1FNVNQ6SkGpDN4ZOIvdEgHNHovHNAUrLZVBQ9myotGK/kHUimkMmAlK9N3kXMheiggNG8vg7vZQWnYnd1hC7ntXYEsQau9GbLlmS66EQsUdmYF8E3hzMJF0oGs6YDNk+3hwKbiznz6/HR0fnyWAGPJ68YetwbFzVKgDujtAZpEUUiS6DK0uKz0m6kjr1JHTjDXYwoE0/xxePBTbLoVbiU3CxO0G06zHzb7CWSeN6BHYjxtc5I+4UifNSvBIDJvRYLa/OF337MOYoJvKtMUkGsnzZ2bFJt2oUvhqnOpg5A3eaLYvzzR9PAheEtxxq0mXFYt68oS8Uwe4wT3bZmPZnyK5WU8C80UD2iOfNAce4nS95kt87Ec9Ywe04yXaBaaYzSkOfFA82JEc/pz/et6/Xs1B9024ucvRfyj8LItuIa7mj3YNbYmO5jTF8hYJRr7EIksiAeVkrFK39bp6mbWxOWZRgmy5VNohHtRvIq0HIlE/k9etQRbPlNeRfsH+awC9Y/ElzMr4jGzOhKHtddHz7A8CYVHQtEvV3qbK4XER6zDZIor0S9Xmu5KnoSiH/h1JfLxtkL77Pw9PJvm4YNVN/z4e9Y/'),
			this.addDataEntry(dt + 'editable steps', 704, 72, 'Editable Steps',
				'5VfRbpswFP0aHhcZm5DkNWTtyyZF6sOeXbiAVYORcTvy97PBJGGQlSp41TSsRPaxfbk+xz6AR6KieZS0yr+LBLhHvnokkkKorlY0EXDuYcQSjxw8jJH+efjhRq/f9qKKSijVnAm4m/BG+St0SAfU6sQtUOe0MlUJsQ65r5UULxAJLqQGS1Hqvn3KOO8hD5O0vTRuo4NU0NzMsIVseo8gClDypIf8ZInKuxEbFHTTcmBZbqdtbKq07trZeeplvbpilzy9fDJa/hNws06MYlpUlGWlIQOUYmVW36RGB2VVbYioQDKdBcgLerxAs8gL8Hb9EBhclOoKR+2lcU6fgR9FzRQTpRGm42RPuUmXHDikrVAVjXXW39rWwUc24pNN39ftXBXcVmcphd9VCk8I1WMSOFXsDQbhp9SzdzgKVholmmGY07DZBxBpqnUaiX9Oc9Z+CN4/DgmtczDDDaH9BiiazBzhVVYkfAUJc3NQyDT9dgJarQcEndtX8vhoLE+P3SnPl+Hd++ai8qznuxVnLd9DETTjz21ZbsPv3DGKUTiglPgOKA1HlEYSqAJzH+N9NNF/mRSv1d9xvx2Y4sT9/im3I7+J78TuNkvYXZxD/DJ11M7m1vX8sLzhufyH99sddmd3oXu72/5XdheEyL3d7UaUks/1tY+9AXyqJa3DrXtL6jfTHx9Id36hWGje+/KVVltkipMniT/1ZraUbju8uG66eflI7YZff8P+Ag=='),
			this.addDataEntry(dt + 'noneditable non editable steps', 704, 72, 'Non-editable Steps',
				'5Vddj6MgFP01Pk6DoP14bbszL7tJk3nYZ0avSgbFIDNr//2CYKtru3WyZSeb1bSBAxcu58AhBmRXtk+S1sU3kQIPyJeA7KQQypbKdgecBxixNCD7AGOkfwF+vNIadq2ophIqNScA24B3yt/AIhZo1JE7oClobYoSEj3ktlFSvMJOcCE1WIlKt20zxnkPBZhk3aNxNzpIBe3VDDvIpfcEogQlj7rLD5aqwvZYociGFcDywoWtXKq0sfX8FHpery64JV9ePpks/xm4WSdGCS1ryvLKkAFKsSpvrlKjB2V1Y4ioQTKdBcgzejhDs8iL8Dp+jAwuKjXAUfdonNMX4AfRMMVEZYSxnGwpN+mSPYesE6qmic76a1fbhyayUCU35bnK4JvK4AvC9JgEThV7h9Hwl9RyMxwEqwzz7XiY47jaDyCyTOsyEfuU5iz9o9vbP6VNAaa7IbAXvGxzc2QXeZnyRVJA8joRd3gMbMt3RxueSz+5TL8LQIt4RNCpPpAnxFN5QnQXeR6Wo9kfYg/yxPPdibPuLE00eOne+234DfLGKEZjSknogdLlhFL8ubb2sbviUx2J/CKQF0taTQTaSaAKzDzmMqKp/suleKv/+KbuoSv3zO37xEQ+u/lDP/cLQv7kJMi/nOv/ysKiJfJvYZsJpeTvWNgGzPtPW1i8XPvf8/1m+q2H3ce75nnUQKs1Mq8XrwpDf14Vb/DdddPV84em7T78Dv0J'),
			this.addDataEntry(dt + 'mobile step text', 358, 642, 'Mobile step (text)',
				'3Vhbc6IwFP41POokBAI+Vm37sJfpbDuz+7ZDJUimwTAh2+r++k1IQBGsdMW1Wxwdc5JzEr6LJjholq1vRZSnX3hMmIOuHTQTnEvzLVvPCGOOC2jsoLnjukC9HffmQC8se0EeCbKSfRJck/AcsV/EREygkBtmA3FUpEQPBw6aFmmU67ggC1V/mlDGZpxxUQ5F07l+6WFS8CdS9az4SuVM7VRESLI+uNwyZNd6S3hGpNioIRvTO4JjiHCIQxQELsQQA0RGEJkyLzSWqRmH/NDEUkKXqS2NPXtzUWECy7r+FiH1xYLUDRhqAQbVeq8QeBNuEaPLlW6a1e3jiBAO5vgQjglfyZ3BN+WlB+fRgq6W3+wde9vQA89VANrce7tGULXpb91UMKKpIIVqfbdI6oyXlEpyr+roMS9KqCqWyozZ7l6kut2kHiPM9UxMEBZJ+kwa9U8h0ftL1WfrpXbqeJnFbCx5/vMxEiepHXUD00yw2gdjv6VzD7dRg29Fzc5/x6laVj35aOI2ph8FzQo8SQoiW6jXd9GLCL9FxEyQSJI3manbJE1HeW7o33idAt+xgAuO28t4aaICmlu6iNiVNbPUPbW1GUnkNutz2ZoH7mUd5ePTtLFpGnNQLeAhTJkLkhAF04IUPZWRlFdf3P2juFfYNCyJB7FkVaZiAZyBhaDFwr0kuYqo2wI8UR94cHMmvn4dM2f5/7RnTlBeA5kT4sua0wsHMWd4DlmEHebEUabRYbLERc0KplezT+9IHbi8OsSQ0TjWy7usHjaNhH+kjtEEn0Eek5Y8vl7/eDCiqIWylDVgQ8nDhs6ojGqHvre5HkwbYZ8d4I42IADDa6Pa8tXFBxUHBKcdMvv8SNR/BG0p/H8WreoMywIcYn/1GC2eWpTs7qIO8WIyKl7c3o8DwKv+AOPqCPHKIQl65zskBec/I8Eez2gqrlQmzQvtj5wIqiYhYhu924beEYEfnz/Un7/OX7xLshN8NHpUc/t01Qzfffj6Bw=='),
			this.addDataEntry(dt + 'mobile step dots', 358, 642, 'Mobile step (dots)',
				'7Vldb5swFP01PKbCNh/JY5O0fdiHqrXS9ja5wQSrJiDjtcl+/WwMBBLSQGMarYqjSPj6Xtucc48xxkKzeH3HcRp9SwLCLHRjoRlPEqGv4vWMMGZBmwYWmlsQ2vJvwdsDrSBvtVPMyUp0CYA64AWzP0RbtCETG1YYApxFRLnbFppmEU6VnZOF7H8aUsZmCUt47oqmc/VTboInz6RsWSUrGTMthiJckPXB6eamYq53JImJ4Bvp8koDEWkP5I51WEToMirCPKeYOM60YVnFbu9eXhQAtIOB9sAAci7XyO6FCWZ0uVJVPbtdjBDy/Ll3CKMwWYma821elHOKF3S1/FHcsbM1PSapNIAi9qGYo13W6V9VBUjWOclk7WeBpIp4jaggD7If5fMqk1DaIhGzorkTYfB9hEFH2zhhWNAX0uj/FBKdd2Z0vF4qFV4t44BdiST9/YT5SZmM2oFpBmwKkV65ul6DzfH2UQN9USvGv0+onFY1+GgCG8OP/GYPSRhmROyhXt1FJyLcPSJmnGBBeompXSRNRTlw7N46rQlekwC0j8tLa2kiDYpbusDsuhCzUC2VtBkJxTbqa16b+/C8inK903Jj0xSm0VzwTIgy5SQkEqYFyTpmRpiXrri7R3EvsWlI0jMiybKbkgV7ABb8FhY8HKscZSJHSY5qT69nX4xrNHTV75hG88fUjka9vLRIMqZBoKb3tiqBN6wqN42AYxp1xkY0Opp4A6THeC89vt/8etRJUSXKUlSAmUqP2tbHSB6UG6+dPZOxTPC7PNhrmQBs23wmlE/yqnOjqTA5vl6XLMtAmmYK/5RwKscgfGu935o6LRM4L2aIaNtTtWypzCzfIwc1128wACvAvtDSk5ZyURuUFnChpe+q9RFqgWeipXofGYiWln2FmYcJGH4LCtBFKz1J8T9AKs6FlX6sIPgBrLinHc52IcDOS+t72f/3VlT2Y5YFI2cXT3jxvEdJ/YTiEC86ouQFdj5Gd49opTyee+MAEjjDHUD6w58/An/wRe2cBH5+/sbd+Wtd8c7Jjv/Z6JHV7VdJ7V7/aPkP'),
			this.addDataEntry(dt + 'mobile step progress bar', 358, 642, 'Mobile step (progress bar)',
				'3Vhdb9sgFP01fkyEwR/JY5O0fdiHqrXS9jbRGNuoOFiYtcl+/cBgx26cxm2Juo0okrncC9f3nIOxPbQsttcCl/kXnhDmoUsPLQXn0lwV2yVhzIOAJh5aeRAC9ffg1ZFRvx4FJRZkI8cEQBPwiNkvYizGUMkds4YEVznR7sBDiyrHpbYLslbzL1LK2JIzLmpXtFjpn3aTgj+QZmTDNypmYZciQpLt0XRrk831mvCCSLFTLk80kbnxQOHMhOWEZrkNiwKbOK6MIWtj93evLmwBhouBDorhq1wuEHhVTTCj2UZ3TXbPa4RQFK+iYzVK+UZ2nK/qpp1LvKab7Ju942BvuuOlMvg29tbmCJo+/a27PlJ9QSrV+24rqSOecirJrZpH+zwpEipbLgtmh0cBBt8GGAyMTRCGJX0kvfnfA2LwRkYX20yrcJoVCZtKXv68x+JdTEbDhekH7KxIp6Hpd8oWRIdV819bNbv+DacqrXbxyRz2lp/E/Rl4mlZEHlS9vYtRQIQHQCwFwZK8SkzDIukrKoCz8CoYJHhHAhCclpfR0lwZNLZ0jdmFFbPUI620GUnlPupz3VvF8GMVFUbv48auL0ynXIhciLIUJCWqTGtSjWRGWrexdQ9P1r2pTU+SkRNJNtM0KIAzoBAPoBDhQnOUybpKalWwuFh+cq7RNNS/UxqtH1PPNBrVbUCSBU0Snd7LqvSj86py1ws4pdFg5kSjk3l0BnrMDujx9fLHnSFFS5RMtgVzRY/O0ccJD5qD17MzkzMmxGMe7B0m+AC4Z0LzJG8nd0qFuZv9mmdK7tWiPkjRDV7rG70TeP3QwRXX7YAn3ee6GWn2DM2NZOvrlaexG8za49cLxzHfhwObP3CDYtTf/SfhGTBtcn3ru96YbR7UbXCb//c22WYetyj4LqR1rzQ0JJn2wHMMl76U4Oi3cnBCP3CEgILzvc/E53+d8Ud8KmmwUpG0rLQ+SiKoWoSIvfVmb/qLAPz/8UPj8Rvc8T4Snfh/g0d19x85jXv3G+gf'),
			this.addDataEntry(dt + 'editable steps optional', 704, 72, 'Editable Steps (with optional steps)',
				'5VfRkpsgFP0aHzeDkJjksUm6+9JOM7MPfWb1qsyiWCSp6dcXBDU2pmsnsTud6iQDB7hczoGjemSbVU+SFulnEQH3yEePbKUQypayagucexixyCM7D2Okfx5+vNLq162ooBJyNWYAtgOOlB/AIhYo1Yk7oExpYYoSQh1yUyopXmEruJAazEWu2zYx47yBPEzi+tK4iw5SQXU1wxpy6T2ByEDJk+7ynUUqtT2WaG6HpcCS1A1bulRpaetJO7Rbry64JQ8vn1ws/xm4WSdGIc0KypLckAFKsTwpr1Kjg7KiNEQUIJnOAmSH7jtoFHlzvFo8zg0ucnWGo/rSOKcvwPeiZIqJ3AhjOdlQbtIlOw5xLVRBQ531p7q285GL+OzS93U9VRl3xVFK4TeVwgNCNZgEThU7Qi/8kHpuhr1guVGi6oc59atNABHHWqcL8ds0R+2H+dvHIaJlCqa7IbTZAFmVmCM8S7KIzyBi0xwUMky/G4Bmix5Bbf1MHh9dytNgN8rz0J+9qd5VnsV4t+Ks5rsvgmb8pb7vt+HX0zGKUdCjlPgTUBpcULqVQBWYeYz30Uj/JVIcCg8H3OzriB11MVE1hxYyvtKTIfh2EE3DQ8l+aPSD7uD7RdU1GpNthenARqIzyM72pTCGR3kzq16anbifjIZ7Kf4Nz16DuSfx7H/Ko8kvW3YSk17ew6TDFMLXIYNoLdm2fHW84bH8B7ebNJ7OpIPpTXr1X5n0PEDTm/T6glLyvr72Z+8t72pJi2A1vSU1m+m3j9Ebv6scNO4t/0yrFTL3JE8Sf+h98l66rfHdddPV7tPadj//8v4J'),
			this.addDataEntry(dt + 'noneditable non editable steps optional', 704, 72, 'Non-editable Steps (with optional steps)',
				'5VdRk5owEP41POqERFAfe9q7l3bqzD30OScrZC4QGqKH/fXNElAoWulUetOpjE7yJbvZfF+yKx5bpeWT5nnyWUUgPfbRYyutlHGttFyBlB4lIvLY2qOU2K9HH6+M+tUoybmGzAwxoM7gwOUeHOKAwhxlDRQJz7GpYWtdPhRGq1dYKam0BTOV2bGHnZCygTzKdtXH4rV30AbKqxFWUB3eE6gUjD7aKW8iMombMSczZ5aAiJPabF6HygvXj0+m5/3aRr3ly9tnve0/g8R9UrLlac5FnCEZYIzI4uIqNdapyAskIgctbBSgz+jmDA0ib0YXweMMcZWZFk6qj8UlfwG5UYUwQmUojOPkgUsMl60l7Cqhcr61UX+qemsfLROTSmwPVYbeVIZeEKbBNEhuxAE67i+pVa+wUSJD5suum2O32zhQu53VpSf2KcxB+s9uH/+IFwngdCSwETwtY7yy0ziN5HSbwPa1J277GriRrzVtdCj97DL9tQGZBh2CTv2WPD7ty+OTu8gzCTurT4IR5AmGZycpqrvU0+Cleu534JdkNEYp6VLK/BEoDXuU0vdNa79XK941I7GfBBolJc17Aq00cAO4DhYjHtmfWKt97tFQYqKPxME2Y1Nx6CDkGGvYiebw2165Cc2NaEEt7RsQHUzeago/2CmZ0inHOJ1FNV6I7+BGfT8v2x5dNF9yrFBo5aKyW3eBdYO1cGcLf/j/o4GuVM/bVRItn+v1/XGqJiHjHVJGxj+ki/8qMc9CMn5iXvYoZX8nMS8Bn386MQfhYvwz3xymX2bm++SuYTmqpdWC4DNKrvL98XJVsKR31812z6/Pbnr77foH'),
			this.addDataEntry(dt + 'mobile vertical stepper', 358, 642, 'Mobile vertical stepper',
				'7Vrbcps6FP0aHpMREhf7MXGSTmfanMxJz+ljRzbCaCouFXIT9+srgcBgcIxt5DSZwsSxNpKQ19Lae0tgoVn8/IHjLPqcBoRZ6NZCM56movwWP88IYxYENLDQjQUhkH8WvNtx1S6uggxzkoghDWDZ4CdmK1JaSkMu1kwbApxHRFUHFrrOI5wpOycL2f91SBmbpSzlRVUUFoeqJnj6nVRXkjSRba71rQgX5HnncAuTHusHksZE8LWs8kQDEZU1kDspm0WELiPdzHP0wHFeGpZ1282vl180AP1goA4YthzLFQIHYYIZXSaqWI5uGyOEPP/G24VRmCaiUfmuOFTlDC9osvxX/2JnY/qSZtJg67aPeoygKtNfqmgjWeYkl6WvGknV4imigjzKflSdJzkJpS0SMdOXBxEGjyMMOqWNE4YF/Ula/Z9ConPkjI6fl0qFl8s4YJcizb7NMT9pJqN+YNoN1lqkl25ZbsDmeF3U7ENR0/d/SKkcVn3ziyls3f7Cb/eQhmFORAf1+lcMIsLtEDHjBAtykJj6RdJWlAMn7p3TO8EbEoBgv7xKLU2lQXFLF5hdaTELdaWWNiOh2LT6VJRufPi6inK90+bGui3MUeeCN4YoM05CImFakHzgzKjj0SDc3b24V9i0JOmNIsmqm4oFYIAFv8PCI2FKZ/I+ifrIMktRhWxQYOYxoTUjLy5qWL0fK5WeyApoWhxNk7dU/x9XcYy5Ep68eyg/EkICya7uUg607LWs3ZkLFf1y+DTLFbEZ4VT+UsI31oeN6TA3seUEQHFIO8Nzwh7SnAqaNgP4i6ovoBpf4X0zDY7j/Ktu9EyzATQw1SZjCH4RkcX3DrvdPLPy+HAo/v6LobkOxi8EZxv2eAIwTnBue4IL1wA90/30VIwwWogpoCoil8JIUq5w6PIyL87xVFAh2kQZjYMyaidgNjIR9qrxN3CGr+vsDouIf5Sf8k34KdvuZqlpEtLlipMiLGK2lolgLr+HEkMIRETzKlTuIHJo6qpNW+GluYqzzcQWAIyR5nrnIA2+XfcF/YkJ/wWBEf+FhgN9wIJtHqhzxAnt9y2VRwLaA1tAT0wA3d21mP1z/+Xj/X+3YwCuokH4UjQ4z7K1TjVb8dwzQZMDTCyg7J49jav72e2nMUiqydgiaQLU+S5IqsOBWZa6uw3oPFnXlKjzPWVdzsSIu9u7ExGUCVeMS5MqJjgm1aVVQoXB/KvpOgN1nk19cHq23MwQtd2Vv/NXfMeJz3WMZM/dxf//lDwphohYZapmIvFeFelyfmaVNRTVJ7i3pzIzHELwhldARjZw3Crqj4uzfdrz8SF+q95/7j6+OoWFdavBvodHzmSUh0cXjomYcvRbCq3d5Dnes5m8i5cjN5l3vcpQ7zLDAdvMjrlnwL75R8DwgP2DI3OB1yTw/fPnnLj/85rs+O+NHlncvBhWVm++N/Yb'),
			this.addDataEntry(dt + 'stepper alternative label placing', 404, 50, 'Stepper with alternative label placing',
				'1ZbRboIwFIafhvvS4tRLZdOrJUv2BJ09SrNCSalO9/Q7hSqSSrJkBJ2NevqXUzzf4Y+NWJof14aX2asWoCL2ErHUaG2bKD+moFREiRQRe44oJfiO6KpnNa5XSckNFPY3CbRJOHC1h84WlT0pr1QZL12ImbKsMFqWYGQOFkyrvrXScqsL+y6/XU5McV5Zoz8h1Uq7hEIXbo+tVOosRZQldDZZJT75St/WL9S5krsCtQ1WVt/lAMbKDVcLv5BLIdxPXmY2V+7WGPrq8Eo49hKqJY9nDRqrMCe8xCewWZPxJYXNPLSkkTKQu8x2NV41891lo5Y+Br4Bt5vBgmYsBM73hbT4JcByqare9hjY2JBfItxQ1y1hv2mJlwZiefIFkoBlTMgNmOTvMJMAZi85Jetau0yQ3Uc9hnmMpr4kT2IagohvgIgHADEJQND7WHwObjygxeM5Gc3jT7c9XiHL/2ntc8KEdh7wMa0+fSyrXww2vtdnAQn2oF4f+E86oaM5eB4wTg1wC27bwn2IcX18t4MRScZyPE7bI3G91jkx/wA='),
			this.addDataEntry(dt + 'stepper alternative label placing optional', 404, 50, 'Stepper with alternative optional label placing',
				'1ZbbbqMwEIafhstKxiany4QeriqttPsCLnbBWmO7xukm+/Q7BhNCCWrUIroNSrD/8eDMN8zIEUnLw4OlpnjUjMuI3EUktVq7ZlQeUi5lhJFgEbmNMEbwjfD9iDWurchQy5W7xgE3Dq9U7nnvEZU7yqBUBTV+CJ7CVDDaGW5FyR23nfqjk3aVs/o3T7XUfoHSyvs8CylbKcIkwevFfeJ1rdyZ/lx/gv5T/PUbxxjmVIpcwSSDyOpdXrl1IqNyGwylYMz/5V3hSum9YBiig5X8MEqolgKeB64hCnuEJcGBrBuPP4K5IkBLGqngIi9cX6NVM89PD+rowyAk4HIyyCAZWwbzvRIObow7KmQ1mh7LMzfkmTB/yXOa5JoUBWkilscQIBqwjBG6ABN9HmYygDlKToo61j4TYPdUX9O8RqsQUiCxGoKIL4CIJwCxGIDA85T4hvvrG5R4vEGz1fjyco1XgAFKG6wEcu6jWsq2mnupWr7sdWu4qWp4W1gQx+bQGUHITrw7sX2hz6Rl7u/aOKEVle2uEESzcWN+r+V8oJm8zazT5vreZWgmVP7Lu9zeJBO9AwvcK9A5W9Xq/2pVpwYxf69aD0iQL+hV5z1prHdNfMhI8GwdaDNgnFpOHfePVf6HzXvE+LKDHUrmqniYdkf62tY78f8D')
   		];
		  
		this.addPalette('gmdlSteppers', 'GMDL / Steppers', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addGMDLTabsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library tab ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'5Zldb5swFIZ/DZeJ/AEkuWzSpJu0rlVbqZcTBQNWTUDGa5P9+tlgEghkIQn0a0iR8OEc25zHr20cA8+i1RV3kvA69ggz8NzAMx7HIr+LVjPCmIEA9Qx8aSAE5M9Aiz1PYfYUJA4nS9EmAOUBLw77TXJLbkjFmmmD56QhUe7AwNM0dBJl58SV9U99ytgsZjHPXLGfXcpN8PiZFE+W8VLGTHVThAuy2tvdzKT7ekXiiAi+li6v1BNh7oGtcR4WEhqEOsw2dcedNDcEm9jt28sbnYDmZOBaMqDsywUGR+XEYTRYqmLeu90cAXABpua+HPnxUpScF9mlnBPHpcvgTr+xuTU9xIk0QB17r/sIijL9o4oQyzInqSw96kyqiFBETN++hlSQe1mlcn+V47EtMHQaMGTmNk6YI+gLqdR/DkTzxBEdrQKlwmEQeWwo4uTXk8PPGsm4OTHVgLUW6dDKy6W0mXY9a/DYrOn2b2Mqu7VpfDBBleYHo2oNse+nRNSyvnmLViCsGohbJyDSIqiQJI6RVLNUdnU1nWW6qA/zkhAQOCyyXFETaVCEqeuwCy1poZ5sBM6IL7ZRP7LS5Qi9r64gOHOIrKv67HRI2F1oM+HEJzJPLklbDo3NstQq8dbBxBe5qeTd7kSZRTUFBdADhVGNwveH+bW03Pyc13jITImGtWSfhHYVE1HPU1VtROPKPBPeKNMmqZSUdA68dSWghBLCSZ2lOe5EQoOink7pjffRe3i8eTt6quIbNfEJ9bJj0Nv2wvrnKgqGGFcE00C40NCnITzZS/jb3Xz+HzK2R4cYfzoVQ3Deh1ebZW8BF9PxopHaG86l3UDAfTCAXWxHUuJwN6whKW87ylw0qty5QIK6UUoDEru3ncrAtvrfqkDUDSIh5A79TbeLe5FY/REpxNYrEdz/xAWy6/SJCx05cTV+SH3s5aOTU44nx31uPXGVuZw4e0F8YKFH1sFTEWj2dyoy6v9QBFqHwRWsZCRNUqWPhHAqG1G7ssJ6uzV9IIBfn5/dnl/jjPeedEZfDY8sbv8qyd3L/6T8BQ=='),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'7ZlRT6swFMc/DY8zlAKbj25uepPr1aiJj6bCGTSWQUrV7X7620LZhoBjCjrNXbJkPZzT0vPr/7QwA0+i5RknSXgR+8AMPDXwhMexyH9FywkwZlgm9Q18aliWKb+GNWu4irKrZkI4LESbACsPeCbsCXJLbkjFimmDT9IQlLtp4HEakkTZOXiy//GcMjaJWcwzVzzPPspN8PgRiiuLeAHKOV6IGYkoW0nbObBnENQj+sIN/av6RZZuF7E+zMkTU2PpOwUuYNk428ykp3oGcQSCr6TLC/VFmHtgZ5SHhUCDUIe5tp43SXNDsI7dJE/+0PmrzyWu5FLN5gSbe6WUMBosVDO/u9cpNs0Tc2y/leIt51n2Uc4J8egiuNYztjem2zhRaS8o6Hs0X1HBss0hla07nUn0FtCXkAq4kQOo4Be5uKUtFBHTca1IWu8jadm5jQMjgj5Dqf+P0LXfqZRoGSh1HwWRz45EnNw/EN6TQprU2CrfuD7f5YCVrilHTt7eomG7VRhoXxh6/KuYyttaDz44tkrDD4blHuL5PAVRgbmeRSu+ToXvFQlAWgQVEvA+Eq5n+1rH40mmw3pZadjY3i3qXMEDpFwVY7li2IkuIhH1fXXH66rCYC42ob+z1unQOlAxI9f82AJalYtCpwvG7aIgJBzmIPPkQdpy4axV/RnbqbOTW5HaMrZOZF90U0A0e4A4rED8dTu9kJbLP9MKTpkp0Tq/O6XoySwD//yNtYHpqhSwRRih4ypie9SJMAdFP51CHTVBvb27/CyoqttLVWWFmurIPBjOy2ILx7gkrxrwheK+DfjjRvDn19Ppf/QFene4C/230zwyP/Yk22brnaHZeDTbD2f/m/GeELthiPtAiLo4UaVAuBdWiJZOTltYNencuSBqfS3RZSNRt7fD1sB1+j9tIasbwkLIh5fvdGBuJOr0B7SQeq9Acf9V18w+X1Z1rT2rbu2D7GFvnZ282nog3mPrqruN9WtKL8I7zkiWs/OVF7L7e+U17P+NF3J2cy9Qy0iapEqdCXAqB1En3cJ6tTF1wr+02A5iMfz8teC2Xwu1tfunkB7+NNSyufk7MXff/rfxHw=='),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'5Zhdb5swFIZ/DZeJjE1Cejlo6HbRpVor9dqDk2DVxMh4TbJfPxtMkg5YWPPRtUNCgtc+x/b72MbCIWG2vpE0T29FAtwhU4eEUghVPWXrEDh3MGKJQ64djJG+HRx1lLplKcqphKXqE4CrgGfKf0ClVEKhNtwKCS1SMNWRQ4IipbnRJcQ6fzBnnIeCC1lWJfPyMtWUFE9QlyzFUscEtimQCtad3S0l29cbEBkoudFVNra7Q+wTn4z9kecRTDAaw8AlVZYVS1RaVSOjSaWlwBapzTz27NhoUQmLbfqdQfrBetTuFznOr1ZffjMRoSC89rQuoWA/4dEOy9XKKmUK7nMam5QrPWm0lqqM2+JeBuN2gw+551lNAqeKPcOL/Mc46jUc/fIwvdXK7Ou04a0eWDntxFLda2/MuIl933MwKi+tGytYTPknzhZLXZaxJDGpAmqFWNsCstXrXmaSP85WtzExXffqBNbaBu8E0/3Ytjao89QhYj4vQDVYbPvZC8+oC8/D4+xyeEzimZ73TJnBTtDZVkcHUBuAhsRuAN2E7Yb7fgiPOwl//jad/oeMx/4hxu9uFfvn/2xFbhRMorfeSk/DgJwBweQSJwdzvR4B/ksEpzkoXHIdXL0SQrZemCP6cJElfPidxk8NIvun3y4sVUSNBffFMjmwX9Xf6E0tjJqLxWuCco9cLLb9wcvdsn49KTYXHeZWo9KRLC/M6shBMt2I+bjU6t1O+nf4fXx8bn98rdvdG8LxPxod/br7vVBV3//78As='),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'5ZnRcqIwFIafhkudhCDQS7Xa3ZntttN2ppc7qUTJNBgmZKvu029CQEGwpQpu26VTx5ychPB/OSchWmgcra8EjsNrHhBmoYmFxoJzab5F6zFhzLIBDSx0adk2UP+WPT1QC9NaEGNBlrJJA9s0eMHsNzEWY0jkhmWGACch0e7AQqMkxLG2CzJT/Y/mlLExZ1ykrmieXtpNCv5M8polX6o2o+xWREiyPjjc1JSN9YrwiEixUS4bU9uDfYhc3/WR59nQhS5ApAeR6WZFAxkaPzTwjS0kdBFmXbtO9nA4MYbFtv+dQupLJlK9YKgiGFTjHSLwLt0wo4ulLprR7esIwBCMnEM6zvlSFpyn6aWdYzyjy8Vd9sTOzvTAY2WAWdv7bIwgL9M/uqhkRCNBElV6zJTULVYhleRe9aN9VmqiKlsoI5ZVN4Jq10N9C5jtGJsgDEv6Qkr9nwLROXLWR+uFjtT+IgpYX/L41xMWJ812VC9MuUE290F/UJnnjltVDb5Xtez+t5yqYW1v3ruwS7fveeUe+HyeEFlRffsUjUAMTks/9eGxH0ujcRoL1and5dyF4EQMm3IMtCq7W5H9nmAxC5XtlvBYSa+XDRdHOtjNp65iKgkkR0RKhMWCLu8MM43uOjUoN78hxN3CEuKArwrJrOA0Tq+9pOYUsi0jc7lLij/S0qVnd5b2BsdNHbertOe1kfYSM1P2uSn9h5f6bw9extM45wLbTRV0X90N1GVEWJcR3VYyou2XE6LfQWT6bSB64XRGGhMq2tvF1HgZg6AzaD0HdE/tokLt+8PkWllufk4q/JSQsmbndWhXp6WnM8yGWRKLaBDorrZZbaYwEHHuJLYpNSiyhBdVmI7fymLYc7qgl8++Kr6Hx5vz4dMd3+ilSeqn9cG5ia7z+ESoFDE1iG3w2RDDg4i/3U0m/yFk13sL8ueLY7v7t4kpnI786fFvE+1k03YgoC4YoHO80emr9Te6gwxqN+kfOxJaOeB4wrPnul3k9mXsEJcjd5EQvZGz8uOC13aSTncHIl735yGwwYFIzkq1pHGi4yMmgqqb6AUmt97uTB8I4Nfn5zbnV5vx/iUd76vhUcXdLynGvfhDy18='),
			this.addDataEntry(dt + 'scrollable tab bar', 358, 642, 'Scrollable tab bar',
				'5Zltb6owFMc/DS81fQCUl9PptuTubtlM9nJhWKAZCCm9m95Pf1soCgMmU5iLl8TEHnracn79n7ag4Wm4vmJ27N9GSxJoeKbhKYsinv0L11MSBBoCdKnhSw0hIH4amjfcheldENuMrHgbB5Q5vNnBH5JZMkPCN4EyLO3EJ7I60PAk8e1Y2hlxRPsTlwbBNAoillbFbnrJapxFryS/s4pWwmeiuiKMk3XjcFOTGusViULC2UZUeadL7mc1sDHO3HxCPV+5mboauJ1kBm/ru3t68UcFoD4YuBIMKMZygcGXYmIH1FvJYja6jzEC4AJM9KYYudGKFyrP00tWjm2HrrwH9cT6zrSIYmGAyvdRjRHkZfpXFiEWZUYSUXpSkZQe7z7l5FG0I+u8i0kobD4PA3W7FTB0GDCkZzZGApvTN1Jq/xiI+oEzOlx7UoVDL1wGQx7Fzy82O2om4/rAlB02SqRDIysXwqab1ajBr0ZN9X8fUTGsbecDC5W6H4zKLUSumxBeifr2KVqBMCog7m2PCAunXJD4iqTqpfJRV5NpqovqNC8IAYH9IssUZQmDJEwdO7hQkubyzlbgAXH5zutXWrocodPqCoIjp8imrM9Op4TZhTZjRlwi4uSQpOXU2C5LrQJv7A18HptS3M1OlJk3k1MAPVAYVSjcLGa3wnL3e1bhISLFa9aSJgl9VExIl0vZ1FY0jogzYb2tRsanSRcM4diyShGGlbxrgSpdfdyJqAZ5O53yHDfxXDzdfR9P2fCdTIVcPuwYnAyxrkN8boitCuLF9UwSvr55uPwPGZtWnsXOhzEEFcjz0+q3f5JwD0TUA8R8D5y33S9UeNwBu832Zg7nk/G8VosnXTO70RrugwrqYiOaEJs5fgVSccNZJKXgZZVzSKhTHRWIQLO3PerANPrfpELcDSLOxdnsWw8KjUiM/ojkYuuViN5/KgPpdXgqazg0N+at2iP0z94lGF3o4sV2XlsnriKXA7NXNnc+WWOQsfd9GNT7ex826v91GGzx8iNnJTxpnEh9xIRR0YncoeXW+53pBwE8f36j9vxqM94p6YzODY8o7j6SZdWL39D+AQ=='),
			this.addDataEntry(dt + 'scrollable tab bar', 358, 642, 'Scrollable tab bar',
				'5Zldb5swFIZ/DZepsM1HctmkaTdpXau2Ui8nFwxYhYCM1yb79bPBEAigkASytiOKFB/Osc15/NrG0dAiWt8wnAS3sUtCDS01tGBxzPNf0XpBwlCDOnU1dKVBqIuvBq877oLsrp5gRla8TwDMA95w+JvkltyQ8k2oDC5OAyLddQ3N0wAn0s6II+qfezQMF3EYs8wVedkl3TiLX0lxZxWvRMxcNUUYJ+vO7mYm1dcbEkeEs41weacuD3IPZE7zsIBQP1BhlqE6jtPc4Jex26cXP1QC2pOBGskAoi+XSD8oJzik/koW897t5sg25acrR1684hXn6+ySzgl26Mp/UE9sbE1PcSIMQMU+qj7qRZn+kUWARJmRVJSeVSZlxHtAOXkU9UifdzEIhS3gUahu9wIGjwMGjdzGSIg5fSO1+k+BaBw5oqO1L1V44UdueMHj5NcLZieNZNSemHrARon0wszLlbQZVjNr4NCsqfbvYyq6VTY+mcFa8xO7XkPseSnhjayXT9ELhNkAcY99IiycckHiEEm1S6Wuq+tL+Wkd5hUhQL0pMj27dhU1EwZJmDo4vFSS5vJOKfCQeHwb9SMrXdnw3+oK6CcOkU1dn4MOCWsIbSaMeETkySFpz6FRTrm9Em/uTXyRm1rerUGUWVRTUNBHoGA3KHx/Wt4Ky93PZYOHyBRvWUt2JQTmi2xR2lVMRF1XVlWKxhF5Jmy01agD3qYWUEEJwKzJ0pgOIqFJUc+g9KZd9J6e746kV+qjPz1Z8Z2c+Lh82Kl+bqDrYt1EqCaYFsKFhj4N4Vkn4W8Py+V/yNiy9zH+dCoG+mkvXn2WvXJSblI741w6DAQ0BgMwxHYkJZg5QQNJVXJVLgpV7lwggcMopQWJNdpOZWKZ429VABwGEedih37W7WInEnM8IoXYRiWCzjBxFS9kR05c8MCJq/VF6mMvH4Occrxg57Vt4iqP8bq4HDl7AbRnoYfm3lMRYIx3KmKPfygCzP3gClYikiap1EdCGBWNyF1ZYb3fmj4QwK/Pz+rPr3XG+5d07K+GRxS3f5Xk7tV/Uv4C'),
			this.addDataEntry(dt + 'fixed tab bar icons', 358, 642, 'Fixed tab bar with icons',
				'3Vnvb6IwGP5r+DjTlh/iR3W6XLLbjFvucp8uFSs0q5ZAb9P766+FoiA4EeG2jMTEvn3ftrzP87wtYJjj9fYuwmHwnS8JM8yJYY4jzkX6b70dE8YMBOjSMG8NhID8GWh6ohcmvSDEEdmIOgEoDXjF7A9JLakhFjumDUscB0S5A8McxQEOlT0inhx/tKKMjTnjUeJqrpJLuYmIv5CsZ8M3MmakpyKRINuTy01Meq13hK+JiHbS5Y0uRZB6mLabhgWE+oEOcyy9cBynBn8fe7h7+UcnoDoZZikZUK5laIKLcoIZ9Teqma7uOEcADMHIOpWjFd+InPM0uZRziD268ef6jq2D6ZmH0gB17JNeI8ja9K9qQlO2IxLL1k+dSRXxFlBBnuQ4yudNklDaArFmursWYKgZYMhKbRFhWNBXUhj/GhCthoxeb32lwp6/XrKe4OHvBY6uYrJZnZhiwE6LtGen7VzaLKecNXhp1vT8M07lsvaT3wxQYfqbfnEEvlrFRJSyvr+LWkDYJSBm2CfSIqiQSFwiqWqpHOtqNE50UaZ5TggInBdZqqiBNCiEqYfZUEtaqJ69wBlZiUPUfdK67aOP1RVE7nUU2RX12SolnDa0GUZkRWSePBLXpMZ+W6qVePts4rPcFPLutKLMbJgMBdABCv0SCvPJePLw/NSkUBJGwuCwd+X3m1Mye19VngSCnKy8DC8Im/GYCsoL3tmg90cOCy4EXzfQn/1u+QY96FhuAStYquCwSp9uSxW8WMCztbRKFLdElOnwx+P82/OkCVUCgiNxRBN0PU0khuJRlWChcuGC9pnD96P3QQdEspuwyOmGRV2cAwYlFj1MhvPRrwYU8gL8gQw64sHnKUUucpqUomxzaZlENuyARBBc96Ba55gwhdORO608QV4D02lM4KAMitXK6e3G7AID2MbxLZbbgBeUIMkf0/K4aKhS5wwS1I5yKiBxuqu1jt390Q6idiASQj7R/Nfj9UlI7O4QycTWKSJm94ULJFfzwoUuLFyVD55WO8+d3ZxkYStvhRbYe6lduPK4NKxe0Dyz8SP77FskaHX3Fqnf/UskaJ8HLsNKRtIwVvoISUTlJOo0lllnB9MnAvDr4+fUx6+y4n0kOv2vBo9sHj4tpe75L0//AA=='),
			this.addDataEntry(dt + 'fixed tab bar icons', 358, 642, 'Fixed tab bar with icons',
				'3Zlbb5swGIZ/DZeJfOKQyyZde7NJ1Tppl5NHHLDqADJem+zXzwaThEIUkphmKlGk+PMB8z5+PwPx8GK9eZS0SL/lSyY8/MXDC5nnqv613iyYEB4CfOnhew8hoL8eejhSC6taUFDJMjWkA6o7vFLxh9WROlCqrbCBJS1TZpoDD8/LlBYmLlmsx5+vuBCLXOSyaopX1WGaKZm/sKYmyzPdZ25PxaRim6PTrUJ2ro8sXzMlt7rJtq6dkKlPQhJiH0RRQAIC2QTiepQ3vlRp3Qz7UR1LGU9SO3JA7LXRsg4ku+H3AukfVqN+vXBHL6ine4fBWbJRwZPMFOvZvZcx9M3nmIyrPFMHjR+qwzQuaMyz5Lu9YrIP/cgLHYC277OdI2jK/K8pahnxXLJSl35aJU2Pt5Qr9qzHMW3e9DrVsVStha0exBT1Mz0FDJE6Jpmgir+y1vjXQCQXLvr1JjFGnSbrpZiqvPj1m8qrFjvuF6bdwS59MPU765wEXdXguarZ8z/lXE9rd/LJDLVOPwnbI+SrVclUR/XdVQwC4XdAPNGE6YjiSpM4x1L9Vmn76uHOfHqX+YEREOiaDFTHe0fNdMAQ5jEVd9bSytTsDC7YSu17fa1K9yG6ra8giK5bItu2P50uicCFNwvJVkzrFLNy4NIIqmOo8P5J4RttWroHTpzZDNNQACNQCJ1kSCZYkdZyD2EAwHx2j65ksGmyJQxI1BIKdtIn7DNH5Ch9trMnikagFLmglDIq1Ue6ZPNuPzsPTzAOnjF2t5kLPHFKb0MnQsEl/mnSkWNAGI4ACILrnn7OSmrde45rMB1nAmddKMTJfj/BYzCALlxS6iQWpx0kh6Y45JIdbkoNEkc7Tw+SYLw8Fvjj3wxA5AaRUvoeuLxBMusi8ccj0phtVCL4IxKXfeS5MHGhMxNX76MKcfOkMiFj3H5BJ+8RftP4pS9x7d6lHeNyYfaC+MTGj/yT7x0gGe+9Qzj+awfonwbXsNI9eVEafxRMcn0SJvfRp33oPwL4+fkFw/n1Zrxb0gk/Gx5d3P9fUTc//DvjHw=='),
			this.addDataEntry(dt + 'desktop tab bar', 758, 152, 'Desktop tab bar',
				'7Zhdj6IwFIZ/DZdOSlHBS1GZ2WRnncy4mWsiB2i2iCndUffXb8uXIpBBrWyyuyQmctpzWt6np1+aMYv2j8zdhs+xB1QzFpoxY3HMs3/RfgaUahgRTzPmGsZI/DTstJTqaSnaugw2vIsDzhw+XPoTMktmSPiB5gbPTUKQ1ZFm2EnobqWdwVrEt31C6SymMUurGn76yGqcxT+gKNnEG+Fj500B47Bv7W5qyvv6CHEEnB1ElR3xeJjVMEdW5hYCCcLCbZR33E0yQ1D6Hr9e/MkFaBbDUCoGQlNkD9vEYJCQX/Cef5beVR58nTxG/iUMqMvJB1Ti3yLZ8ErJon0gx/xDEHn0YV8TScg3tefOYlyWFErhrkoZzUpVHU5003HDqLpUtry9l5iIbpSNDbCZuRzyAGcRYt9PgNdkL3vdicTocxJn4/USyU/H9iXpfDEFo4ECUkNhNKlSMO5AYdydAiWpjH9+4A/rkisa9xO9ovh5BCWKmzXFX9wAhIUTLiS/ZAJvnKhrs7o9mw8bJ/DM8lTIKE1+vOFvwij5ofz9JJiTPrLlrbsmm2AVb0XBRBgkY7J26ZSSYCNsXJbYbv5GwedHr6/p29yUI2QXEg5vwi6b3IkpVthCHtEe1hgd35inh+papXSUWCrWqS0DH4ROa0g6jpZyQ9RJePNT4XFDrupjJclahClyFd2BwqRG4ctq8Swsy2+LGg+hFK+mkJix21PoPGMi4nkyVJk0a6EzMEU50oLqUHE4nWTRuE5uaCkhN7Yq5AZFWKXoikW4zm71vuyPnQy8lNMel19rob8Qp24O++Cpt/J8el30mI3/AFFsoT6I1s/yOVFn+f31P1CFQA1r3AfQG+8jumxQHN2xLef6+wg1VO6yDN7jeKcrue9IwGXrsOnsV+4XG87bVx4HWwi1HwcbACnaYg7MUQXRXfaYeoeLkC6IOBdHq173+a1IRvcjgi3lRMTr8f46q356vf0b'),
			this.addDataEntry(dt + 'desktop tab bar', 758, 152, 'Desktop tab bar',
				'5Zldj6IwFIZ/DZdOSgHBS1F0JtkZzbrZuSZSoNkCBrozur9+W74EgYhOYS40MZHTnlLep+eUHiVlERzXsX3wXyMHEUmxJGURRxHNfgXHBSJEggA7krKUIATsK8FVR6uctoKDHaOQ9nGAmcOHTf6izJIZEnoiucGxEx/x7kBSzMS3D9weoz0b33QxIYuIRHHaVXHTD+9G4+gPKlrCKGQ+Zn4rFFN07JxuasrnukZRgGh8Yl0+sUP9rIeuGZmbj7DnF25aPnE7yQxe6Xt+evYjF6BdDEWoGADMgal2iRGjBP9D7/ljyX3lgffJo+RPEiNiU/yBauN/RTL1TsmCo8fX/JMXOOTp2BCJyTc3lytrWrYUSsG+SintStUdKrrJsGVV3Spbfr9thNk0yptNoJ65nPIBLkaIXDdBtCF7OeteJLTrJC7W6y2SV9f2LeF8MwWlhQIQQ0Gb1SkoA1CY9qdAcCrj9y98tSm5oHU/k2uKX44gRHG9ofjW9hCzUEyZ5Lck8NZE3cjq5mKptibwzPJcyMhNbhTSHTNyfiC/rgy2Sj/8zgd7j0PvV3RgDTNm4Izx3iZzgr2Q2ShvMe38iiCXnr1+pFdLna+QTx9TtGN2fstPlmKZzacBGWGPkeEX4/RU36uErhJDxD51iJGLmE57lPRcLeULUS/h9avCw5ZYladCgrUYpohVMACFWYPCu2U2QDCJaD12WKrujp3LUAmw4/ChymjZM4FRLCg4Ohidag7VUGkhphpCiE2NGrFJMaxQZMXmW2G2e95sty9v6/HA8YE3PNlR/qwG+CaWMmhJe4Jgyiocg6bcoPn7ZWltdg/HcjYcSqiBMVA2j+4vr/O19XgoB0yxijpKjm0WHt6s98cDaUwHA6kWL3zDgmyWQ143P62HAzlgRGpglIjsUU25fl6gMbZDjzRP+VcOC1FJUAe966ZqO6O6Ry4aeNIazIoXvSozTQiyiXyxHw5ReJF7VF6+evZfySvTWA0WNLAlaIQAuDwoDKJ/sw5zR8QkyI73fltVrAyOlkrknYWyDkDdhbKW7UnQ4XuiazVEg5y+ZSFFEDYPikNv1ApIJxJtOCLQEE6EXZ7/2cu6V//4+w8='),
			this.addDataEntry(dt + 'desktop tab bar overflow', 758, 152, 'Desktop tab bar with overflow',
				'7Zldb5swFIZ/DZetwIZALksS2krrUrXdulsUDFgzGIHbJvv1s/lKCLCS1DBpa6RI4djn2LyPj8EnClxE2+vUTcI76iGiwJUCFymlrPgVbReIEAWo2FPgUgFA5V8FOD2tWt6qJm6KYjbEARQOry55QYWlMGRsR0qD52YhEt1VBdpZ6CbCnqINj2/7mJAFJTTNu0I//4huLKU/UdUS05j72OVQKGVo2zvd3FTO9RrRCLF0x7u8YY+FRQ/TsAq3EOEgrNyMcuJuVhiC2nd/9/xHKUC3GFCqGKp6pdp6nxgpyvAv9FzeljZUHnCePLC8kxQRl+FX1Ij/Ecn0MyWLtoFY85dB5JHLbUskLt+VvXRWs7qlUgoMVQp2K9V0ONBNAx2r6lTZyvHuKebTqAe7AGbhsisDHEWgvp8h1pK9nvUgEsb7JI7W6ymSH67tU9L5ZAqwg4Iqh4Ixb1KAI1CYDadAcC7j31/4eltySet+rjUUP44gRXGzpfi9GyBuYZhxyU/ZwDs36taubi+WeucGXlhuKhmFyacxe+RGwU8trw+COflHjJy4GxwHTzThDXNuEIzxxiVXBAcxtzHRYrvlFUE+23t9ya+WplghbyFm6JHbxZBvfIvltpBFZIJnjAY+mKe75rNK6iqxZDynkhT5iOu0QdnA1VK/EA0S3nxXeNCRq9pMSrJWYapcVUegMG9RuH1a3XHL+uuqxYMrxZopxHfs/hQ6zpgIe54IVSfNhuuMUkk50oNq13A43GTVWZucbkkhN7Ma5C6qsFLRVQ/hNrun5/V07ETgtdj2mLhbS/0HcWqmPgVPrZfnzcNqwmz8D4gCS52CaPssXxJ11t8ePoFKBAqt2RRA2/WICujt988MlQlUn4MpgLarJSXQx9sfnzwl8jTmk7wTDai5vH+qeEm6qgD1ycHD4nSKqUCY0Reh3rmVgR5CTYdeXh20ZNXH9KPsg2McPrQBtZmPVgcczbEtZ9qMkYLg+AwxRm1Ma5dqzkiXDLnpJvxjynQUK8fMmENCXUki53x+YRoNRKMc0DUpdRI+D4bjYNIiSS8SYzwiwJJOhF/u//wruh/+N/gb')
		];
		  
		this.addPalette('gmdlTabs', 'GMDL / Tabs', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
	Sidebar.prototype.addGMDLTextFieldsPalette = function(expand)
	{
		var s = "dashed=0;shape=";
		var s2 = "dashed=0;shape=mxgraph.gmdl.";
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library text field ';
		var sb = this;

		var divider = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=0.25;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
		divider.vertex = true;
		
		var fns = [
			this.addDataEntry(dt + 'single line text field', 346, 360, 'Single-line text field',
				'7ZhbT9swFMc/yx7yCPKlDenj6AUhcZkGGs+mOU2sOnHleLTdp5+dOJDWDbRAJjRI1IuPfXz5/+JjOwEdZqszxRbppYxBBHQc0KGSUlf/stUQhAgI4nFARwEhyHwCMmnJxWUuWjAFud7HgVQOD0z8hspSGQq9Fs4QsyIFWxwF9LRI2cLaFUxN/aczLsRQCqnKonRWXraYVnIOjRwor6qCWC6NEZuEaxyUhlXrAEqT6/0ZyAy0WpsiSx7rtCpBe2HllgJPUudGw2rkiBWVIXn0fdLD/HGS7JaHevKcSjnPmJrbiuMY4m+eXmYsVho7Kj5l4rvgSW5yMh7HolRgwaY8T6wEoZVQ5vqG/7HOBNdpV5tNKyhM7p0brbUsU67hxtRiiyzNo2Nsqc7EIaKS14laa6pAMM0fYKP+twjd84S+Yhm0aeskvICZbsrYeN4iZO9NeTF9cr2VRrVR+NH0pYfq65r4IblpmaB1VSKKNj3kbFaA9ng8dmwvRH0PEUamu2jE1oX5kTPzdW40I2iogGVt7JpAwo3pQNrJ1hMC+aRRef2nIDHud0AyfDno13Fe8Bwe43lT21xesHuopWyP9z6Vt8juHNAx6oWu000SuOeTIO9Eooc6IHHikZhIEYP6CnyvpBSGHVCKWncBNvDds1ZcX7HuEHYD2gG7wcuxbucGN1sldlN+nGSxONaKszwR4EW6XJbhcWsbfILsva/q0bOhDntRDiMfQf9tBFxbR/XKUBPpAkjd/YOJfC1FDgvBXWzvMPa4/BxfXv8a7xPc6I6Dy1bswjSaTMj2QoSeOykxZ5gaFmZN7DTIrYOW6TbYMd0OPgbtBnm0fUR9H5D+mX48Or/9HBg3Hf4p1DqI4ghttN4RZf/VxOj66pNM1g9AedABZJN8evNXFW++GPwL'),
			
			this.addEntry(dt + 'single line text field normal light dark', function()
			{
				var text1 = new mxCell('Hint text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#eeeeee;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field hover light dark', function()
			{
				var text1 = new mxCell('Hint text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#cccccc;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (hover)');
			}),
			this.addEntry(dt + 'single line text field press light dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;opacity=50;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (press)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (focus, light)');
			}),
			this.addEntry(dt + 'single line text field normal light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#eeeeee;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field error light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#ff0000;');
				part1.vertex = true;
				var text2 = new mxCell('Username or Password is incorrect', new mxGeometry(0, 30, 346, 25), 'text;fontColor=#ff0000;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1, text2], 346, 55, 'Single-line text field (error, light)');
			}),
			this.addEntry(dt + 'single line text field disabled', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), 'shape=line;strokeWidth=1;noLabel=1;strokeColor=#B3B3B3;dashed=1;dashPattern=1 4;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (disabled)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (focus, dark)');
			}),
			this.addEntry(dt + 'single line text field normal dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#cccccc;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal, dark)');
			}),
			this.addEntry(dt + 'single line text field error dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#ff0000;');
				part1.vertex = true;
				var text2 = new mxCell('Username or Password is incorrect', new mxGeometry(0, 30, 346, 25), 'text;fontColor=#ff0000;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1, text2], 346, 55, 'Single-line text field (error, dark)');
			}),
			this.addDataEntry(dt + 'single line text field icon normal light', 346, 35, 'Single-line text field with icon (normal, light)',
				'1ZZNb6MwEIZ/DcdGYAfaPW7Tbi9bbaQe9uyGCbZqMDJuQ/rr14PdJBSnoUk/tIkimbGHmXnmZUJEZ2V7o1nNb1UOMqLXEZ1ppYxble0MpIxILPKIXkWExPYXkV97dpNuN66ZhsqMcSDO4YnJR3AWZ2jMWnpDw1mNSw0Le8vLxmj1ADMllbbGSlV273IppHxl8jcGbaDdm1xn8pndgCrB6LU9shK54e4EnfqMOIiCezeaOhtr3HWxcd2Wahe+2nDl9HDlOWs44PEY6/YYyrbAbk2KMpcTAxJq7go+CCYiNOs+Y+mQMJ21b+zEU9ihlWRDWF4BsQbJjHiCXrgQQR9xroRNZBPuLIn7Lmq5bMAMkG8SHdWF6aAL8w7n61ZYTCi+papMCCfa78QzHk7wGsGKBZM/pSgqbJrIcwnvUC/G+1OzhTBYfooCWHFh4M7aMMrKasDauCklxjyxo94hnQYaehGQf3y6/NMj5S/Fjtj/+kSx/kr9ZvfwQqPP2bbqOsPvx3LyyiTpOGzJB2DLBthu1b2Q3y9Y9dViJSkZYP8Rf45Yz48Uq9GCVUXHsQYtbFzQO+b51vamfA/M8lzgX6NQ2LdGPSKMcYCzNwEnPZEHp30Ad3rasG9fhn3/ETujnzD7L/7jEbRR//4ZFHoYjhhB9nL7Ougo774t/gM='),
			this.addDataEntry(dt + 'single line text field icon focus light', 342, 35, 'Single-line text field with icon (focus, light)',
				'1ZbBbqMwEIafhmMjYwfaHpe06aWVKvWwZzdMsLUGI+M2ZJ9+bewmUJyGJulhQZHM2GPPfPMzISKLsn1QtGZPMgcRkfuILJSU2o3KdgFCRBjxPCJ3EcbI/CK8PDAbd7OopgoqPcUBO4d3Kt7AWZyh0VvhDQ2jtR0qWJkts0Yr+QcWUkhljJWszFy25kJ8MvmNQWloDwbXmXxkDyBL0Gprlmx4rplbQeY+Iga8YN6NJM5GG/dc7Fz3qZqBzzacOTmeeU4bBnY5snl7DGVb2GrNijIXMw0CauYSPgomwiRe3mbLu6l0cJjO1hd25in0aMXpGJZXAFIgqObvMDguRNCf+Cy5CWR33FWMhi5yvW5Aj5DvAp1UhfmoCmmCRoUwkKz01rLSPZiou7z9hf+1iw0AklmsfEXFL8GLypaM57mAb2h3w7iGl5qu7JYbU25jY7oU9oAzi+cdknmgdjcBpaPzlZ6cqHTBe7r+7QM1OWWVfKSv8EFjCPVSIv/EyYsQJ9OwxRfAlo6wPclXbohNU2fW3f+nOnGCR5xv0c+o8/pEdWrFaVV04GpQ3JwLqmd+3tu+1Gu4T6fdZew5t397XNpCNfLNwpgGOP0ScDxQdbCTB3An5zXy9qORD9+pK/IDff3mkj0nPt5z7lN7X1j9h5tO6GU4oeeYx/2nnqPc/xL8Bw=='),
			this.addDataEntry(dt + 'single line text field icon normal light', 342, 35, 'Single-line text field with icon (normal, light)',
				'3ZZNU4MwEIZ/Dcd2QtKgHrV+XHTGGQ+eY9mSjIEwIVrqrzchsQWhFls9KJ3OhE022X32ZSEi87y+0azkdyoFGZGriMy1UsaP8noOUkYYiTQilxHGyP4jfL1jNm5mUck0FGaMA/YOr0y+gLd4Q2XWMhgqzko31LCwW15URqtnmCuptDUWqrBzF0sh5SdT2Bi0gXpncI0pRHYDKgej13bJSqSG+xVkFiLiIDIe3Aj1Nlb5+2zjuk3VDkK2w5mT/ZmnrOLgliOXd8CQ15mr1jTLUzk1IKHkPuG9YCJMkuYaSwcP01mHwk4DhRatOOnDCgpAGiQz4hU6xw0RDCfeK2ED2Rw3iVHXRS2XFZge8k2go6ow61UhoWhCKZ3EtvS9ilhaToNLVZgWVdRcwf4g3tzi2FF2fMWCyXMpssLVTqSphG+IeMWFgYeSLdyWK1t3a+Mml+6AI6sYHOhsoIinA5JHx0ueHih5KVoCfwyBuvwLdcue4INGF6qty1Xifj/LKagR03HY4h/AlvSw3aknYYn9f3Viinucz9DvqPPkQHUaLViRNeBK0MKeC7plvt/avtTrnoadCvf+E8oVqlIvDsY4wMmXgOOOqgdb+gBuelxHrz86eveZmpBfaPCnf7jnbNS/u+kMPQwH9Bx7u/3m85Tbn4Tv'),
			this.addDataEntry(dt + 'single line text field icon normal dark', 342, 35, 'Single-line text field with icon (normal, dark)',
				'1ZZNb6MwEIZ/DcdGxg5pe2zS3V62UqQe9uyGCR6twci4DdlfvzZ2EyikYZN+qJYimbHHnnnmZULEFnl9p3kp7lUKMmI/IrbQShk/y+sFSBlRgmnEbiNKif1F9OeB1bhZJSXXUJgxDtQ7PHP5BN7iDZXZymCoBC/dVMPKHjmvjFZ/YKGk0tZYqMKuzdco5StTOBi0gfpgcI0pRHYHKgejt3bLBlMj/A42DREJwEwEN5Z4G6/8c7Zz3adqJyHb4czZ8cxTXglw24nLO2DI68xVa5LlqZwYkFAKn/BRMBFlq2aMpUOH6WxDYSeBQotWPOvDCgogGiQ3+Ayd64YIhhuXCm0gu+suYtJ1Uet1BaaHfBfoqCpMe1VYNjhfl8JicuJbq8K0cF42I9gf8K/bbBGwuQOLKy5vJGaFKxqmqYT/UO9GoIGHkq/ckRtbcGsTJpfugjPLFxyS6UD1rga0Ts7XenKi1iW2lP07BOryL9Qv/ggvNLpQbV2SZrwvpyBDmozDFr8DtlkP2716RPn16lRWmGgckYR8ilhpQnvYr8nHiPXyRLEajbzIGo4laLT3gm6Zl3vbm/I90rhTdP+DqFzdKvXkYIwDPHsTcNwR+WBrH8CdnNfZ65fO3n3FLtgHNPqrb9yCduo/3IOGXoYTWpB93H/7ecrtT8N/'),
			this.addDataEntry(dt + 'single line text field icon focus dark', 342, 35, 'Single-line text field with icon (focus, dark)',
				'1ZbBbuMgEIafxsdGGOK0Pa7TppdWqtTDnmk8NmixsTBtnH36BUMTuyaNm6SHRYqEBwZmvvk9cUSWZfugaM2eZAYiIvcRWSoptZuV7RKEiDDiWUTuIoyR+UV4dWA17lZRTRVUeooDdg7vVLyBszhDo7fCGxpGaztVsDZHpo1W8g8spZDKGCtZmbU050J8MvmDQWloDwbXmXxkDyBL0Gprtmx4ppnbQeY+Iga8YN6NJM5GG/dc7Fz3qZqJzzacOTmeeUYbBnY7snl7DGVb2GrNijITMw0CauYSPgomwiRe3aaru6l0cJjO1hd25in0aMWLMSyvAKRAUM3fYXBdiKC/8VlyE8juuqsYDV1knjegR8h3gU6qwnxUhUWCRoUwkKz0clnpHsy8G97+wv/azQYASS1Wvqbil+BFZUvGs0zAN7S7YVzDS03X9siNKbexMV0Ke8GZxfMOyTxQu5uA0tH5Sk9OVLrgPV3/9oGanNJKPtJX+KAxhHopkX/i5EWIk2nY4gtgW4ywPclXbohNU+d1N/5PdeIEjzjfop9R5/WJ6tSK06rowNWguLkXVM/8vLd9qddwn153w9gzbv/2uLSFauSbhTEN8OJLwPFA1cFOHsCdnNfI249GPnynrsgP9PWbS/ac+HjPSbpxYfUfbjqhl+GEnmMe9596jnL/S/Af'),
			this.addDataEntry(dt + 'single line text field icon normal dark', 342, 35, 'Single-line text field with icon (normal, dark)',
				'3ZZNU/MgEMc/TY7tECjV52jry0VnnPHwnLHZBEYSMgRt6qcXAraJSW1s9aDMdIYsLOz+9p9tIrLM6xvNSn6nEpARuYrIUitl/CyvlyBlhJFIInIZYYzsL8LXe1bjZhWVTENhxjhg7/DC5DN4izdUZiODoeKsdFMNK3vkojJaPcFSSaWtsVCFXVukQsoPpnAwaAP13uAaU4jsBlQORm/slrVIDPc7yCxExEFkPLgR6m2s8s/Z1nWXqp2EbIczJ4czT1jFwW1HLu+AIa8zV61plidyakBCyX3CB8FEmKyaMZYOHqazCYWdBgotWvG8DysoAGmQzIgX6Fw3RDDceK+EDWR73SRGXReVphWYHvJtoKOqMOtVYU7RhFI6iW3pexWxtJwGU1WYFtW0GcH+IF7dZkuCLBxfsWLyQoqscLUTSSLhCyJec2HgoWQrd+Ta1t3auMmlu+DEKgYHOhso4vmA5NHpkqdHSl6KlsD/h0Bd/oW6ZY/wTqML1daFNuN7OQU1YjoOW/wN2OY9bHfqUVhif1+dmOIe53/oZ9R5dqQ6jRasyBpwJWhh7wXdMt/vbJ/q9UDDToT7/xPKFapSzw7GOMDzTwHHHVUPtvQB3PS0jl6/d/TuOzUhP9Dgz39xz9mqf3/TGXoZjug59nH3zecptz8J3wA='),

			this.addEntry(dt + 'single line text field normal light dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#999999;opacity=80;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#1F9BFD;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#1F9BFD;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#cccccc;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#eeeeee;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field focus light dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;textOpacity=80;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#999999;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;textOpacity=80;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), 'shape=line;strokeWidth=1;noLabel=1;strokeColor=#999999;dashed=1;dashPattern=1 4;opacity=80;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#1F9BFD;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#1F9BFD;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, dark)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#cccccc;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;whiteSpace=wrap;html=1;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#999999;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, dark)');
			}),
			this.addDataEntry(dt + 'full text field', 362, 56, 'Full text field',
				'vVTBboMwDP2aHFvRpLCdR7deNmlSDztHxZBogaCQFbqvn0nSFlQ6Ia2aJST84hc770UhLC27reG1eNMZKMKeCUuN1tb/lV0KShEayYywDaE0wo/QlxurK7ca1dxAZecQqCccuPoCj+yAm73wcGOPKsAZbwT0pIiwp0bwuscN7K1PM91ivuoTa/QnpFpp45gMXJxXPmRmRajNpVKDytxFj+vK7uR33wLn8PmgLnWBOFeyqBBTkLs5ar6XVfHqsk0SI9QKaWGHeL9XizIjJmypwgDh9GAsdDcVdFCQbwu6BGuOWNKGg+AqS4KOAmQhAi1OPMYbnxdn6sUP/AmWTNvDruyZZ0zZFf2VWhZlppYndUby0ymrEhdzdaHTuhzDvVvGnjLQaZVcy3TCDChu5QFG7aa0Cx3ftcRBaBTmOykTui8exxvoPG/AXkl/HnuWG+t7uNH9oxVjwm/GrCeMWd/FmAWLx848/N0ZTC9PpC8fvqA/'),

			this.addEntry('full text field', function()
			{
				var s1 = 'text;strokeColor=none;align=left;verticalAlign=middle;spacing=16;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=15;fontColor=inherit;';
				var cell = new mxCell('', new mxGeometry(0, 0, 360, 298),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('a', new mxGeometry(0, 0, 360, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=66;overflow=visible;;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=22;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 14, 14), 'dashed=0;shape=mxgraph.gmdl.x;strokeWidth=2;strokeColor=#666666;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-40, -7);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 16, 16), 'dashed=0;shape=mxgraph.gmdl.left;strokeWidth=2;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(22, -8);
			   	marker2.vertex = true;
			   	field1.insert(marker2);
				cell.insert(sb.cloneCell(divider));
				var field2 = new mxCell('Aaron Bennett', new mxGeometry(0, 0, 360, 60), s1);
				field2.vertex = true;
				cell.insert(field2);
			   	var marker3 = new mxCell('', new mxGeometry(1, 0.5, 40, 40), 'dashed=0;shape=mxgraph.gmdl.user;strokeColor=none;fillColor=#666666;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-60, -20);
			   	marker3.vertex = true;
			   	field2.insert(marker3);
				var field3 = new mxCell('Abbey Christensen', new mxGeometry(0, 0, 360, 60), s1);
				field3.vertex = true;
				cell.insert(field3);
			   	field3.insert(sb.cloneCell(marker3));
				var field4 = new mxCell('Alli Connors', new mxGeometry(0, 0, 360, 60), s1);
				field4.vertex = true;
				cell.insert(field4);
			   	field4.insert(sb.cloneCell(marker3));
				var field5 = new mxCell('Alex Nelson', new mxGeometry(0, 0, 360, 60), s1);
				field5.vertex = true;
				cell.insert(field5);
			   	field5.insert(sb.cloneCell(marker3));

				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Full text field');
			}),
			
			this.addDataEntry(dt + 'inset text field', 362, 56, 'Inset text field',
				'rVRRb4MgEP41PLZRqGbPs1tftmRJH/ZM9BQyFIOs2v36IdBWq21M2ktMvO/uuOP7AESSstspWrNPmYFA5A2RREmp3V/ZJSAEwgHPENkijAPzIfx+IxraaFBTBZVeUoBdwYGKX3DIHqhKmYMbfRQezmjDoC8KEHltGK17XEGqnZvJ1vhh72glfyCRQipbScDaOfLNM818bs6FGGTm1npcVnrP//oWZg7nD/ISawangheVwQTkdo6aprwqPqy3jSMDtYxr2Bu8X6s1NBuM6VL4AfzuQWnobjJoIU/fDmQJWh1NSus3YqIk9jwy4AXzZVHsMNo4vziXXvQwP16SeXnIRJ5lwpRd0R+pdVFmYt04Ra8FwHNixdaWMoPnmTn6k7eOXMmAqTCeEnXCFAiq+QFG7ebY8x2/JDeD4MDPd+LGd1+9jBeQed6AnpB/HnuRHptn6HGQPJ3eh/tyXN2Up8g0Lrgn2szp9u/Ko6KtyGasWhg8LptxLy+oSx8+sP8='),

			this.addEntry('focus card suggestion', function()
			{
				var s1 = 'text;strokeColor=none;align=left;verticalAlign=middle;spacing=2;spacingLeft=65;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=16;fontColor=#999999;';
				var cell = new mxCell('', new mxGeometry(0, 0, 360, 160),
			    	'swimlane;shape=rect;strokeColor=#EEEEEE;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;shadow=1;');
				cell.vertex = true;
				var field1 = new mxCell('dessert', new mxGeometry(0, 0, 360, 50),
					'text;strokeColor=none;align=left;verticalAlign=middle;spacing=66;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=none;fontSize=22;fontColor=inherit;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 14, 14), 'dashed=0;shape=mxgraph.gmdl.x;strokeWidth=2;strokeColor=#666666;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-40, -7);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
			   	var marker2 = new mxCell('', new mxGeometry(0, 0.5, 16, 16), 'dashed=0;shape=mxgraph.gmdl.left;strokeWidth=2;strokeColor=#666666;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(22, -8);
			   	marker2.vertex = true;
			   	field1.insert(marker2);
				cell.insert(sb.cloneCell(divider));
				var field2 = new mxCell('dessert', new mxGeometry(0, 0, 360, 48), s1);
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('dessert <font color="#000000">bar</font>', new mxGeometry(0, 0, 360, 48), s1);
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('dessert <font color="#000000">shop</font>', new mxGeometry(0, 0, 360, 48), s1);
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('dessert <font color="#000000">restaurant</font>', new mxGeometry(0, 0, 360, 48), s1);
				field5.vertex = true;
				cell.insert(field5);

				return sb.createVertexTemplateFromCells([cell], 360, 250, 'Focus card suggestions');
			})
   		];
		  
		this.addPalette('gmdlText Fields', 'GMDL / Text Fields', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
})();
