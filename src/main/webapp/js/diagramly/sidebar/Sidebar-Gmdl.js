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
		var fac = 'shape=ellipse;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library bottom navigation ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'bottom navigation', 358, 48, 'Bottom Navigation',
				'7VfbctowEP0aP8IIG6f0kUvgJclk2v6AkNeWJrLlkQSBfn1XlgymNh06mTw0DQwe7X3Zs8eGKFmWh42mNX9UGcgouY+SpVbK+lN5WIKUUUxEFiWrKI4JfqJ4fcU6aaykphoqe0tA7AP2VO7Aa7zC2KMMiowaDs6dRMmCSlFUeGaYHzQqclXZ7+Kn853EKBtOaydoYNaZhZRLJZVuciV583JuVqsXaC2VqsDHZuo1VDIvYBl3aVHglPGdhg2tUTFFRa2Ea+B+j32YEOFaWdNSyCMq5ppxYbEJg99mRXcF7/Srdpq5Jrm1NdrTZI4XnJG7OAczLpQqJNBamDFTZWNgpnFd574EHi+KpPGiUyaMFbSFw1VoGlXAZQOqBKsxL3kVmeXeI0lnPoyDwNReOQ06arxcnELPQOMhYD2Me9LD/RuwZpZ/hJ/bUgZIWqDLQ+G2d1yUmRzrkKQH/Iy49zXg3cyHnN38BKNyHrbOqtqlqCkTVfEAue0g3y6hkyXdgnxWRlihLra1Tfjwm8NWWYswD+x3KLYIDn41ve6H62Y1uusuK/mwyxoPL2sIIONJ6mOOrSLInW0O96KLZW51GiS1Yg8X9Yc2PLTw7GZ6rj+akIvyo7adNoXKcwO2R5HTN7mJNdMea9Z0rzRO9Y284UD1wO2SkC9f7xY3subk/E+wJv1kTYckf0mayeydSDN9B9KkPdI84bZvj29jTOVzfD5o/jvKzD7egwbF809+7979R/AL'),
			this.addDataEntry(dt + 'bottom navigation', 358, 48, 'Bottom Navigation',
				'7VfLbuIwFP2aLEF5kAyz5FHYtFKlmf3IJDexhZMb2eY1Xz927JQAQW2ndAVIRL7H9xXfcwjxolm5XwpS0xfMgHvRkxfNBKKyq3I/A8690GeZF829MPT11wsXV3aDZteviYBKfSQgtAFbwjdgEQtIdeAOyIikYNx9L5oSzopKr1OdH4QGcqzUL/bX+AahtiUltTEEpMpsM85nyFE0uSLf//EzmRo3JXAN7U6FFdjYDHeuklyDSqkzKEnpRsCS1BoYaaBGZhp42uo+pHMyrSxIyfhBAxORUqZ0E1LfzZxsCtrpFzciNU1SpWq9H0cTfdFnZC7GQQ4LxIIDqZkcplg2G6lsXBe5LaGXJ0XicNop444VhIL91dE0kJvLErAEJXRef8cyRa1HFI9tGAWmU1tw5DAirV28hR4HrRdu1v1zjz45d6pKbkbcmXC5Lwxth0WZ8eGWZYB/wsuJ583n2sTNYfc5m4NjKeETRzeFtUlRk5RVxTPkqjPyln3G5mQF/BUlUwxPaNomfD5zWKFSer49xHbFps7BctJiv00380GiETSIMoRL7oS0YT9pXYA/DGIbc2gBZ3dY7X6TTkgdJBYTwIliWzip38d018KrOdNj/UHgn5QfnGkF81yCulDK2418SDyjC/G8bCRLv6agsklxT/qJH4Ix+ojG7womGF0KphXRrQXT1rqpYuIbP25WiOu70srjWdMnnSR8XzrJ90lnfKYc/xuUk9xYOTtY1aSAh3juXjzj//uj9m3Pnfjr6tHm8dXZunffrP8B')
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
		var fac = 'shape=ellipse;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
		var gn = 'mxgraph.gmdl';
		var dt = 'gmdl google media design library bottom sheets ';
		var sb = this;

		var fns = [
			this.addDataEntry(dt + 'bottom sheet', 358, 320, 'Bottom Sheet',
				'7ZbRbtsgFIafxrcVgbjJLud0Sau12rQ9wETjE4yKwQLSOnv6gSFpFhwJaUsvqiaKxDnnPyfm+4VMQRZtv9K0ax5UDaIgXwqy0ErZsGr7BQhRYMTrgtwUGCP3K/DyTHUyVFFHNUib04BDwzMVWwiZkDB2J2KipqYBL0cFqajgTLr12s0H7RIbJe1P/ttrJ9jFpqGdDzSsrS9zIRZKKD3MIpvh42VWqyfYV6SSEHpr9RL/yQ3YasOf4QeYMN9n4+OCttCf3fKQivtdgWrB6p2TvPDaNkFBynloa4CzJraRyApRExLs0PtK0C0ixHGgJAH6rQPpBTIhe8JqlMkxwJjaeyBgY6MDR4jnyH9PnJnmosPj6PYNEdAuhmUIj8BihFKw/4PrNOH6FaA7i7TtmT9TV6ytxdWTV2bwdfSW02qGqhSyoI8gvivDLVc+rcPuKo+Tr6m4P6m3vK79Mx0En+O8Q8F0dM0lux/m3+C3cewajTh2GcPKxLA7+aj6PMf4IP2wzIeTEc/wZTy7Tjy7pZKprTV5tjVBnWkcWn6aleX7NS73sOF/N26WGPcAxoBk7h2d5Vx7kH8cOi9+w0M3T7xbKcXc3nGV5x0b5L86sTWZ7jls7gr0ft273GvOha+X86H21939Dw=='),
			this.addDataEntry(dt + 'grid style options', 358, 642, 'Grid Style With Some Options',
				'7VvRbuI4FP0apNkHUGI7BB4LHToPU6naXWkeqwAmRHVilLgzdL9+HRIDwQ44xAbKDFUlYuwQ33PPvdfHpgPH8fopDVbLZzrHpAO/duA4pZQV7+L1GBPSAU4078DHDgAO/++ASc2n7uZTZxWkOGE6A0Ax4GdA3nHRUjRk7IOUDfMgW+K8u9OBo4BEYcLfz/j9ccobFjRh/0T/5X1dwK+zZbDKL1I8Y/nHESFjSmi6uRdcbF55N5bSNyw+SWjCx4zKZ8Epw+va+Wyaysk8YRpjln7wLr+iOVsWPaA3KIYtcRQuy2F9VM4syIqGcDt2Zx7+prSQ2lpQslY+5wfomDWa6J8Wj39oRPAIh4N+nRHze+91nmxeeedVMIuS8O/SJGjX9C9d5Q8inquchHPwnJBfpzjjVz9KU7u6kIHzIAOoaEsxCVj0E1fu3wZG1NDplywm5XwFUvE6zDnbC+M56TG6ep0GaSu3hmobVQd8lJTuecX1ngVRXzag29SA5fe/0Ig/1vbLu0NQ+fquX70DXSwyzCQAtrPQwsSTMHkgEW8Y0yShaWaWYGriVFkGh8gf+kqn37t7brRTlCv41c0JlDtBNAvIQ/nAcTSf5zPazoDgBduN/L65evSBZaZ5fjtH+agS1qhj9A2TVVi44gJyahJ4a5veU5v+CGVdFWX7Rigr6CQYO7AAjG8YGDyPdLm5xaoNMtqh1SJO3f4FgBoYBoo/EePBKbtJsDx7WJWltFWshg2xspH5nM2Lt9M8C7F8usC5ePUnmNEyJw1cCyi5jmFKMUzwalmgoVWcTDx35OkiMGycmoSrtyrH9VKTC2wA5EoAfel7zl+8yfM8/p0QSYBxC7IDAiG5uNuSo7aUk2liqLhrDqN6WeUYIVb3cIgZ4GRB4plOI25YDbigDJfnoAmafBK4XE9Fu6Zw6a6CXVnNaBfElkES0nfdLDN6zP9aGlO/hvPNE0HUBeigLhDZwSwxmooWfyqDEwHMFZKJWZxkIeMLBFBknr4/GH6+zFM4372nHllp+EHTt8+XeK6GlnbmMS0d2Mw8ddb8jVJPUwHhflOPoQC2XZ+YxUlDPBCWJ5Firblv5qoK6hozfOFMtXRyesBxT3MKDFSanKHs4lnABjRVDO6XQ4bKNwBtcAjIwkG71BQHETm63VCn7Jy5DVE4WjOxBym4ZGgfAlXzkw3JVCC0Bxknz6zcN0QOXgfxiuDejMYSlDdfeZ8B5+ervBXnKl5wmtEkIDqI3Vb1fQZil9V9Gh9/+JOKTqWioQ0lQXEkgiPxei+Brfki1QxNLhrY7kVSuBpa2kFNQ1K4+trnzChlaF0DPStRShYHnjY179GUsu/pTl3pHJa186G7s/w81YgEU0xeaBaxiFayk+j+/aDDlDLGI2VNPlPxrHJ+q98S5e0C10UDiSyq03tii7L1sYWyuhJuIE7zmXUDWXv4Vopy7R1hJ+/dhiu4cj3jDh8c72td8WPEbxRnPhURFtk57AIHNoIHlFWRJ0rDfLd3ZCKAbO71uiLv2U35jj0fGXjI1wouxtwEXsJNZFHm2UyKuakMg45sVegeV4VWs5Qi3kBgJd6goY2zxOJh9x0JZ1kQysdLzvCl8k634k5dRZpq7E/IYvZSyI7IlDeBqjeJTXez3iTLVs80NeJK+W1uxY/cvrYf2U9ligjk2olA3Bg2fOamxDez69iPyoBTq1qRX9oKN8jGngKUtbfjMJ3aBpoGs7cm20A1WoS2YAOPn1pwegfHcJUKjmpfyNCi1K98u5VflEGNXw4JrPjIaJUpVaGrIXT/ADXQ7JTR7Zro+PcGD7/c/ey86L7/q/T/AQ=='),
			this.addDataEntry(dt + 'grid style all options', 358, 642, 'Grid Style With All Options', 
				'7Vvfj+IqFP5rTPY+aFqg/ngcnXXuw04yuXeTfdxURW2GlqZldvX+9RdsUSvUoRZWx10nk1gEWs73Hb7DgXbgJN48ZWG6fqYLTDrwcwdOMkpZ8S3eTDAhHeBFiw587ADg8f8OmNb86u9+9dIwwwkzaQCKBj9C8oaLkqIgZ1tSFizCfI1Fda8DxyGJVgn/Puf944wXLGnC/o3+E3V9wK/zdZiKiwzPmfg5ImRCCc12fcHl7iOqsYy+YvlLQhPeZlw+C84Y3tSOZ1dUDuYJ0xizbMur/IwWbF3UgMGwaLbG0WpdNuujcmRhXhSs9m0P5uFfSgvprQUVa4kxP0DPrtFk/ax4/FMjgkc4GvbrjCj6Pqo83X1E5TScR8nqn9Ik6FD0labiQeRzlYPwTp4T8usM5/zqW2lq3xQycBlkABVlGSYhi37gSv9tYEQNSb9mMSnHK5GKNyvhs71VvCA9RtPvszBripSR7aDedtUG29LVe0FxfWRZ1FcN6zc1bHn/Fxrxx9rfvDsCldt3B9Ue6HKZY6YAsx+FEVaBgtUDiXjBhCYJzXK7jqd3qCqmcIQGo4HWGY56F0Z7zxULv+sKxxIkiOYheSgfOI4WCzGi/QgIXrJDyy+7q8cBcOyBwaAdUbZVR7ZKjL5lJ5YWrlBAlSyJt7HpA73pz7isr3PZvhWXle4kPXboAJiBZWDwIjL1zT1WbZAxnlod4tTt/wKghpaB4k/E+OSU3yRYgTusyhDbKVajhli5UD5v9+HlVKgQE8MF3i+PCqVntNSkoe8AJd+z7FIME5yuCzSMgpNp4I8DUwRGjaVJUr1VmG4mTT5wAZCvAPSpH3h/8aIgCPg9IVIA4xZkJw6E1OBu7xyuQ7nmoOkXV54VN+qeNrEDk5qWeKaziJvRAByoghN4aIqm58BR57APDpfpWthXcxrtpqx1mKzom6mmjB/FX0tjmkdsA/uOIKMAdBIFSC2w6xhNUxd/4oB3JjBfJkjs4qSmLT5BAKXO9AfDkTOdcTaVFeS7d+lR8wrfaPb68YTnamgZK4/tRIFL5amz5m8kPU3TBfcrPZYmsP1qxC5OBqkCaXkSaVaWx2au5jx9a4YvyFTrTl4PeP77PgWGugycJXUJHGADmuYH7teHLIVvALrwIaCmCdpJUxxG5OzmQl0e58JNh4JozVI7SONLlnYdUFWfXCRIJUJHkHHnmZe7hMjDmzBOCe7NaaxAefOR9wVwfrzIW3O64gVnOU1CYoLYbUXfV0PMNPo2OQRx9TDhQm2xFAKAkROaq6mBp508nBWYOt2vqMyqlJlTujNx0GBMwhkmLzSPWEQrMYWs/uWkwowyxmfLmihE52eVgw39lijvY0EfDRVn0R1rkbn71vt5sCJXELg416I5v/B3uX5tT4TDSvg2qOCrEY4/evCCz3UhqxXeaA5DabavkJtdYOhGI9WcyROlK7ExMrYxgez6+p6St/ymuOOOI8MADYwmF2s0OZ1cnNBEzdU825GYm1IYdCarZ3qOCzpVKc18A4GT+QbJ+M0ukdRk0jPO83Cl7sRewKWyp1uhU1cjU435hByql2aFjmyxCVTZ5LuIeaCa/prQdGuBSnPRza3wCJzQKNGd31G5ZZ1BWm2DOhJZ2oeQpNmTyEWiB6q5uWk4xzNK1U265kRayq5uhUzmc5LNsMh0yeUoKgrkqRS7zFFThF9/RkyA0Z44rOzp9+aN2fsnH4s1TQ9IOd2zsZtI21YavJdWk3NC2+wxciILtl/qmoXz1yZbNjXJUOOMMTz/ppfXOzkgqz1koNvDsZQVq2q7k3e9oJoaVTCUWPGWUZpr46qrIXT/ABm8dHV2drsmOoN7g4dfHl4UL6ofv0f+Pw=='),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'7Vtdb5s8FP41uUxlbALJZZruQ9MmVe827XLyEiegEoyM2zXvr5/NV0JsGrPYLV1DVQmM7djnOc85h8NhhBbbxw8MZ9EXuiLJCL0boQWjlJdn28cFSZIRBPFqhG5GEALxP4LvO+56xV2QYUZSbjIAlgMecHJPypayIee7pGpY4TwisjsYoWucxJtUnC/F/ISJhjVN+df4f9nXg+I6j3AmLxhZcnk7TpIFTSgr5kLr4pDdOKN3pL6T0lSMua7WQhgnj537KZqqzXwgdEs424kuv+MVj8oeaDIth0Uk3kTVsMCvdobzsmHTjN2LR5xUEtJLCynSknueI2BXaHV/Vi7/WIjwBs2mQZcQ5dwHnd8Xh+yc4WWcbv6rROLvm77RTC6kXle1CXC0TiSuGcnF1Y9K1J4pZPDvIIN+2cZIgnn8QFrznwOj31PpI75Nqv3WSG0fN5KzV5vtKrniNPv5C7O+SBnJDull1x6wq6h+NSmvDyTrB6pgvb6CrX7/lsZiWc2Pj2ew9fPjsD0DXa9zwhVgml0YYTVRsJrL+zbppqdRG0k088NZqKXAwexSVKcIWLJtLOkkoY+XOJlXC97Gq5XcUbODhKz5fuTn4uomhI55NwnPU49dm75W1SGwTN2MkTUREluS3FATGhdmBMFED8EThK3F1iJsYIWw9TQ1X6cOAApt21YW43RTsGII6HhAwxc74AC/jQ5ygM7UMjo5wWwZKdgcAnEIUIVZ2bm2ocbmrAMtY1fo6VyhHWaNg4l7as2sg8e5cCvPaviMwZq4wwr67rGq7cQBWJ9wKqcFt4TdxWn+NHYuYhhQHKKdyniCy+1DcCqk8Xw1pGkmGmoAc6ZFrhRj6rlQDM82i3nx5GGiADcijA3eGT9og97esX5Abj3FeXbc41HsUhPMLjh90yGnwLnPiSk4UyD/zgXH2L4ijTNElgzsBBxh5cTCqsmYL7iQwScapTlNLwZ26AbWqxXOrmLYTu+4I/G5yZ3XT2I1vXNLJB8hWGCW5BcavwYaz5wESrZTPe5ofO6zzuunsZr1+cbIA5U8/ojTnFxYPHgWN28K7GqG7YyTOxaHb57FfRNML0tbl5yq5XsmpxBw4RmhmltScKoln8QHGVedmNu5WM+a4Etl6qQTuILAO80pONWQyg42Yxevp6Ca3ZljJoNYcE3SlHA+ZEZdHGExd20H7WqGmlqaK7oghMLbOEANDk0arxOH4zoORa3MYOgoten58rJ3GYdhAhC6QElNKg00XOkC5+2EK5oynq+RkNDzW9jmzdjFpHaY1NCJs1WTR+eRNS/URxMtBcWhAt+0/+Ub7VKF+xUghBoLC6zQ9shouHnFoqng+Z4lFK8utB0cbX3oJBKyXSJ0X+qPGegNZc3kH1gJgV5R/ZamRGhBs92FncNj59SJU7VdZbSU2mPqU88rECt19025U6Tmgm5ZuQwexXkhoM0lJB4eeyfIhW9FtquLskKZnjEkRv2rjjxdAteOx4VHD7IuPC5SM0PPz9eGdXbz7LvWgFPU8m1ldp3AZDs19Asv73TM0lZOd6fszZnVgdE+I9+uYdZSTRfcWvqaKGxTzcXHRMigNKjGSoyMs1ybDngxhP59gAxSOk9at5dEJ/zX4BGX+y+Ry+6HHyr/AQ=='),
			this.addDataEntry(dt + 'bottom sheet menu items subtext', 358, 360, 'Bottom Sheet (menu items with subtext)',
				'7ZfdbtowFMefJtpVKycGNi4h3Sp1rVRtT2DiQ2LhxJnj8LGn3zl2AoW0Uy82ygWRguzz5eP/+QlExNNye29FXTwZCTriXyOeWmNcWJXbFLSOEqZkxO+iJGH4Rsm3N7yx97JaWKjcexKSkLAWuoVgCYbG7XRnkKIpgMJZxOdCq7zCdYb1waJhaSr3U/2m2DjBfVOImjYWMkdupXVqtLG+Fl/6h8KcNSvoPZWpIORKs+lOwgKtbdQafkAT6pO1axesg+2bV/am7r73YEpwdochGyVdESL4+EtIK0DlRZfGJ0ErJppgyPe5BwVx0Yn4uqB8IGgqrFosQFTenAmnDC4nmuSRao3L3PmbBRMJejSAya/W9I6bIMUMA+Kk3h6caMj2Mh+MfOqfl6Zw2qzN24bOibFhdoMvtR06wCuGJo4bQ/NRuyeY9IMvtznRfJuXUt+qUuQwGDf2xfzzF0B60DQs6TgtFqCfTaO8eohXGNucSFCZ0I8n/lJJSZ3tA2Zdvb2jqUWmqvzR17+L2QnLI9wXrtS0fi93yevc9QnjkLHrgrvtCypHbAjl6B8wORow+SwW2lBVQsAVgJ9IaFbQ4aZt4MP5fGg1SRdPezpHVzrPSef0fHSOB3R2wx854nEDsIJK9rA+GNh9ai6FT99iSnwyEvBK6PkIjSfnQ3QyQPQJcqKQzZV1hRS7CwCyom/xZHrl8YN+z/n5ePw85FGtaPw4TVHWAZ/vVjVOVR7TDUiJ4lwKpfwK6cdAytl/gxS3h7+t3nf0r/YP'),
			this.addDataEntry(dt + 'deep linked modal bottom sheet', 358, 642, 'Deep-linked modal bottom sheet',
				'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'),
			this.addDataEntry(dt + 'long list', 358, 642, 'Long list',
				'7Zpfb5swEMA/TR4bGQMhPOZP001rtWqdtMeKgAOoBiNwt2SffjaGFGJonQZnU1aiSNg+G/t+vrM5MzIXyfYm97LojgQIj8zrkbnICaHiLtkuEMYjCOJgZC5HEAL2H8FVT6lRloLMy1FKVSpAUeGnh5+RyBEZBd3hKiPwighxcTAy5x6Ow5Td+6x9lLOMDUnpQ/ybyxqQpYvIy3giRz7lxTHGC4JJXrZlbsqLi9GcPKG6JCUpqzOv+oJyira94ymzqsHcIJIgmu+YyK84oJGQMO2pqBahOIyqahOrGplXiIxwX/dFPeym0lC3tkxJW3zMMxMMq7RaPhfdP1QicB1zdt2nRN52Q3hVXlw48/w4Db9VKrFesr6TjHek7lc1CHDQT5Olc1Sw1I9K1YYqMvg+ZNASeTnCHo1/olb7p2C0jpz0EU1wNd6aVLINuc2OwyTAY0qyx7WXH0tKSXdmt+7aFXaVqY9tkW5o1prIijWOVWz1/HsSs27tH37lwtbjr5x2C2SzKRCVwOxHocTK1uygum3oEON0uZidff5PwGmYdm0zGhTLZGATynK0QUxjPipUoUwtewJUEdhvIqjV1DKUySCGUjdTAwEagDgDAymQl/uRxKKp+CaQipEQrg0EnkinXaHByuhyasOwunJM/bCmA8PivuysdtNPpsOPDUXGtPSTcSUyXzOUcoFUQnTsSlJl1SsURhsq79emgP8O1i1ruJUGAiATgieuNHWHQAuQ62oAVD+jQegLQlkvnJadPHFJNTNZWXMHzGVc2FsjfE+KmMakuUfnYGLfw7cH5UkcBLxPe4FZ1d6+oNqF35btL6FW9udCb1g6Nh2GIbH/nK7JVg1+XIr+x/Th2ei7WujLsYpPXhqSZ7b0KU2ASEirrpMr17HtC5sCXQ4A6pgCUI8DkAMwd6goUBqyVz2lOZDsxT8cgX5HAPU4Ajl+c0NIyLQI52qzICzFHzP8rLprZgDYS/qFzYOzbQdMPd5Ajg09RAipLgeFkFXjD42ZNbEui3/XW/RQ/GGbvx4/IAehlsRXpB9wSTX21mp6vbow2z8fe0uP7cvxrgccB0jV9oWs4h7AnrsG+OD/Tv56bF8Ood1HhBJF/pmQvSik51vObT0mLcfeJJj6j3rKa/Cjnl2rwlsHP9b0NGr1eVzdzqCYoByAex3TW8Hrtec/dZ0z7L8V6EP0zsMGMc96Y9pgXJ85vnKqWr+C6DhVdVpP13KoCuVAWq/fZDXjrED/FKHLByTHunoBdXq3v0nHuTQ8LPnyRZYQb36w9Qc=')
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
		var s = "dashed=0;align=center;fontSize=12;shape=";
		var s2 = "dashed=0;html=1;shape=mxgraph.gmdl.";
		var anc = "shape=rect;fillColor=none;strokeColor=none;";
		var fac = 'shape=ellipse;dashed=0;strokeColor=none;shadow=1;fontSize=13;align=center;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;html=1;aspect=fixed;';
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
			this.addDataEntry(dt + 'dropdown menu', 100, 180, 'Dropdown Menu',
				'7ZVLT8QgEMc/DXcKXbMetdq9aGKyB8+kTFsiLQ3Fffjp5bXPbuPGVaOJJE2YYWZgfn8aEM2a1Uyzrn5UHCSi94hmWikTZs0qAykRwYIjeocIwfZDJB9ZTfwq7piG1pyTQELCgslXCJ7g6M1aRgdnfQ0uHCN6y6SoWjsvbH3Q1lGq1szFm4tNiLX7mnXO0FAYtyykzJRU2teipR8uzGj1Ansr4EcowNXSlbNGPB1oA6vRDr0rtjcD1YDRaxuyFNzUMQIHCrgGUdWbtGl0sj44qm3uDpidRGan+dEBv7lhBqwrGYC0PZhIbK/xPE/x1PXquhQFkzcRcSM4l55IxwrRVg9QupMn9Ih6am0NvbWeY8dnkyOfI5dOgk+DZEYs4KD+JTTTUZrDa3maJvbjQppHl3Z7NX855bjFkxJ2Z4LXh2U2GaosezADVbYHO0uoyahQ9CeF+pOCXONvEORqVJD0X5APBEnoF/wi1ty92iF8/1F/Bw=='),
			this.addDataEntry(dt + 'dropdown button', 100, 30, 'Dropdown Button',
				'xZTdTsMgFICfhksXBvMBtqq70cTEJyDlFIhQGoqz9emFQrt23RKNF5I04fxyztcDiBamOzrWyBfLQSP6iGjhrPVpZ7oCtEYEK47oAyIEhw+RpxvW7WDFDXNQ+58EkBRwYvoDkiYpWt/rrOCslRDdMaIHppWow74M+cEFRWVr/6a+ou+WBLmVrImCg9JHs9K6sNq6IRethhXdvLPvMLOUwwqWXBA4D93NpgZV7ugI1oB3fXD5VNzL7IFT41iCEjKH7bKOtUkWU+gZUdhkSteJ0RWxvVNMr7CF8n3mM2sTDyvoY4OqZHqfgRrFeQw9tA0rVS2eoYpFb+kF491PEZH/Q7T75VBJb3TsbTY+phPxTmyE4XrjA+BaDHQu5mmamuU81baGP3JaBvT5Lm3uk7yguIaYvRxo5tUJFqmugc3Hv1oVqprOvhvz9KM8Hj/msFXVgl/9mqmNa38riOfnJbnPX59v'),
			this.addDataEntry(dt + 'dropdown button editable', 100, 40, 'Dropdown Button (Editable)',
				'xZT9boMgEMCfhj/bINgHaN3W/bElS/YERE8lQzDIOrunHyi1frTOpU1GYsJ9yd3vDhCNinqvWZm/qgQEoo+IRlop0+6KOgIhEME8QfQBEYLth8jTFWvQWHHJNEizJIC0AQcmPqHVtIrKHIVXJKzKwbljRHdM8EzafWz/D9oqUiXNO/92vgGxcpWz0gkaYuPMXIhICaWbf9G0Wc7NaPUBPUvcLGvxCYE2UF8tqlH5ivagCjD6aF2+eGJy74HbwnEOPMt9WOh1rGrlrAs9I7IbT+kyMTohttWciQk2m77xfHpl4mZZvSuQx0xsPdCCJ4kL3VUli7nMXiB1SQd0xDhcioj8H6Lw96GaGROpJMxOiIbKwng+JR3cSGQY0OMTzuDRIJjhBxjEXmLmz3tT3KbRHbYaY1ZpWoGZQO7SXMR988fLnJtCeICnfhR15t6idVYkYm3sYMusmcrRPe56MeySb92iboSz3cBrX8xxJA/md9qfzX3aMzx8RU6n39IuK57f9da9/+z/AA=='),
			this.addDataEntry(dt + 'dropdown button selected', 100, 150, 'Dropdown Button (Selected)',
				'7ZbbTsMwDIafppdMbbMBt1uB3YCEhATXoXHbiLSZ0uzE0+McukPL2AYbEhKRJtVO7MTfH3cNSFIuxopOigfJQATkNiCJklK7p3KRgBBBHHIWkJsgjkP8BfHdjtnIzoYTqqDShwTELmBGxRScxzlqvRTewWhdgFkeBmREBc8rfE4xPyh0ZLLST/zdrI1itOuCToyhINVmmguRSCGVzUUyO8wyreQbbMykdrgETM5NOjT86UBpWOys0Lp8eWOQJWi1xCVzznThV4SOQlgAz4smbOCdtHaOfBW7BoYPntnn/EiH31BxKjoQ21iQ2kbxoR3oN5XylIqhx1xyxkyKUT2hKa/ye8jM6SPSIt//EmkjmrDRIwU1hr14PAdjjr+Hue99CgTVfAZb+X+Cvn/k1S10KXy9jRrlIjed18tLJnoahatyS7t1a9d3cwtxJSs4FB75HN52wNJ3bG/g7C20XbKDI8H67R8lx1Ot9r5o8iwbu9m+ySGzrAbdkWZVxkFqDTpqJXgtXxXf1yqty3uOzmnJDXbskvt3u4cc2z0tkb2o7VfdSSS97Eoqp4rj30JbUgRzLu3+pBzX55DjqiPHMyhGK/ovxx45ougEeqC5/mxzyze/6j4A'),
			this.addDataEntry(dt + 'dropdown button selected editable', 100, 150, 'Dropdown Button (Selected, Editable)',
				'7ZZRT4MwEMc/DY8uQJn66lDngyYmJvpc6QGNhS6l6uan90rLNkARFX1aE5L2endtf/9y4JG4WC8VXeU3koHwyIVHYiWltr1iHYMQXuhz5pFzLwx9fLzw8pPZoJ71V1RBqccEhDbghYpnsBZrqPRGOAOjVQ7G3ffIggqeldhPMD8oNKSy1Hf8zfgGIY6rnK7MQEGizTQXIpZCqjoXSetm3LSST7A3k9TNJmDy1aTDgdsdKA3rT09Ym9zxliAL0GqDLq+c6dx5+JaCnwPP8iZs7oy0soZsG7sDhh3H7GN+pMfvTHEqehC7WJDa3uH9uqHdnJQnVJw5zAVnzKRYVCua8DK7htTsPiAd8tEg0kY0UUcvFFQY9uDwjMYc/gxz5GwKBNX8BVr5f4M++vrqDlzGUpYwCM1SumpOMhoT+RhTO2APWjQFM7fereS4je1iR1Hnhss0rUD3IG+3OYr7/JslI9eFcAAbPYp1ZireLCuYmGl8YcqsvuWdarGrCS2VnHSj1IgG1fBn7jCbzrh1qfv6zKeRp734UdisPqlcxz25YqwHj4r3VEOOf1Wb/rfkkF++Pk6Q7vdhEjlO+nLIZ8XxW3qQY1iO07+Q47Qnxz0oRkt6kOMLOYJgAj1wuPvXte77v8Lv'),
			this.addDataEntry(dt + 'persistent footer button', 300, 40, 'Persistent Footer Buttons',
				'3ZXRTsMgFIafhnsK64y3q25X6oXzAYicDSLtaQBd59NLAbdVXabJ3EVJSM75f/4WvpBAeFV3CytadYcSDOG3hFcW0aeq7iowhjCqJeE3hDEaJmHzI24RXdoKC43/TYClwJswr5CUJDi/NVlwSrR9aeE5fHK20sZUaNBGl6/iCLrzFl/gwIE4ekcJiZsg0tDk/4H10B3dc5TyhheANXi7DUs2WnqVVnCazkUV6LXKsUnWhEv9ehfdEwhFhvAzEP4NyOxpuXy4P4VlePwGG/jC6lPCxj/q9z5ZsNwfQGPF9XTOgy6FUyD/Ao2dhHZV/g+zydiYdUNeF0BYjhRhUdKLMZyOlOHudpyfYWj3b030Bk/RBw=='),
			this.addDataEntry(dt + 'persistent footer button fixed', 300, 40, 'Persistent Footer Buttons (fixed)',
				'7ZXfboMgFMafhnuEtstu69buZn+SdQ9A5rGQoRhgrd3TDwWtrjN1aXcniQnnO5wD/D4TEI2zcq1ZwR9VAhLRe0RjrZT1s6yMQUpEsEgQvUOEYPchshrIRnUWF0xDbscUEF+wY/ITvOIFYw8yCIazoppqeHctl6mQMlZS6TpL03o43VitPqCTgXpUGc4StXcidkHYD7SFcvDMtRQOvAaVgdUHt2QvEsv9Cor9vTAHseWhbBY0Zny8bUuPBNwkQPgdCD0BsnzbbJ6fzmHpXz9XOfxg1Ugqt6/iq6qMSIg70Eh0u1hRpyfMcEgCNA3GlTw0V43GciRnOd7MhzFqkMyKHfTaX8J2NrH9M9uww4sSbmOCy37rpkKlqQF74kV7rlH2zCd7rmRPNMf/4M9i8udK/rT/+iX+uPD4Tvvl3Wf8Gw=='),
			
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), 'shape=ellipse;fillColor=#FF4081;strokeColor=none;shadow=1;aspect=fixed;sketch=0');
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
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'edit;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'star;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'heart;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'reply;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 20, 24, 16), s2 + 'users;strokeColor=#ffffff;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'gps;strokeColor=#737373;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'share2;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'navigate;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'chat;strokeColor=#737373;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(22, 18, 12, 20), s2 + 'voice;strokeColor=#737373;fillColor=#737373;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 16, 16, 24), s2 + 'google;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 20, 24, 16), s2 + 'video;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 17, 24, 22), s2 + 'gallery;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 17, 24, 22), s2 + 'birthday;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 20, 24, 16), s2 + 'cloud;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 20, 16, 16), s2 + 'x;strokeColor=#737373;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(22, 18, 12, 20), s2 + 'bookmark;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'calendar;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(17, 20, 22, 16), s2 + 'attractions;strokeColor=#ffffff;fillColor=#737373;strokeWidth=1;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(20, 18, 16, 20), s2 + 'dining;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'education;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'family;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 19, 20, 18), s2 + 'health;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'office;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'promotions;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'radio;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'recipes;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'sports;strokeColor=none;fillColor=#737373;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 56, 56), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(18, 18, 20, 20), s2 + 'travel;strokeColor=none;fillColor=#737373;direction=south;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 56, 56, 'Floating Action Button');
			}),
			this.addEntry(dt + 'floating action button mini', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 40, 40), fac);
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(12, 12, 16, 16), s2 + 'plus;strokeColor=#737373;strokeWidth=2;shadow=0;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 40, 40, 'Floating Action Button (Mini)');
			}),
			this.addDataEntry(dt + 'toolbar',  358, 64, 'Toolbar',
				'7ZbLbsIwEEW/JstGjkP6WBZaWFWq1EXXVjKJrdpxZBsK/fqOY/MIDxUJVm1BRPadmdxx5gglySdqOTOs4y+6Apnkz0k+MVq7sFLLCUiZUCKqJH9KKCX4S+j0RDTro6RjBlp3TgENBQsm5xCUIFi3klGwnHV+aaDEW45rIeVES236aF73H9StM/oD1pFWt1gzbgwT2Mmeaj/AlRz3GW44K/ncwIx1KIxQ6LRoHZjnBRZa1Ig31a2bMiXkCoVHU3LhsBuLjT6xecMxPSa96bkpfbfcuQ7jRf6IFzy+v/gEmzZaNxJYJ2xaatUHStunTutggcuBSUHH+zbiy5tQ31t8gmAcLE9OoZfiCGagFTiDPuRTVI6HjLy4D2UcBFoF8XYUNGbDvtmUbmeKizjW4yPOfx5xxSyHKj5r7pSMs1mPXi0bT2jaqEqmJVNg2MHEd1nYY+Su/24q3uOh6S4K5M+gQI+jEAtISotQs1oLcb/DCh0dopJFfAxI5sQCBv7H+IktvPpnvPW/yejA/uZheAdd1xbcAX+bg5yF5OjKSC5EBfrUf9A/jBfA+PtZLK7MYsOkBG/+T+PVabw7A0dyiON6pBfjSIY4ZtnlPOJ2+7YX0ndfBr8B'),
			this.addDataEntry(dt + 'floating action button', 50, 156, 'Floating action buttons',
				'7VdNj9owEP01OS5ynI/S4y7ZcKpUqYeercSJrXViyzYs9Nd3HJuPELalAqpKJRLRzJsZj+N5PEiULLrNUhPFvsiaiih5jZKFltJ6q9ssqBARRryOkiLCGMEnwuUH0XiIIkU07e0lBdgXrIlYUY94wNitCIBhRDkTCrkyYL0Yq+UbXUghNeC97B3YcCF2UISTIi6SInXJjNTyHcAYnFaTmsPWTmrNG7UVAx+Bw0jFVpouiYr8Ckry3lL9uoZCE5Ia2duSdFxsAXjWFeOWVhDFqCCrlkF6SPomV7py22fWKohnyTPc4DzczSWYWStlKyhR3Mwq2Q2BygypZeNbgDlqkuGX0zb8h2uC3d7CkVJt6ebDsQxQmMmSyo5aDX1QKJj7gndeW+aR1M8RMcqh7xgjxvvtfp3DxMEIQz9PgOT3BKiJYbTeTcd2IgxzR4xu0zr+ztquFnCCajuhCPAhH64pT/a4r/genhj/n6zAv2QFmmW+ZHviH/EkxlOexLnHNBXE8jUdtT9HnrCDr+6ID+2f8lH3p/l4Adk0htoJ9/aPcREd04ce/cN6FCafob8mT9mN5UlpR+nLKPOQpmOCpNdL0/x+0vT5/tKU30uayjJF8/ghTX8oTWHWMZqqUZZPmbbDrlGjTzdWo825f0rNcD1k5+hbd53snCHDrWRn/Lt4C9kB9/D259OPXw5/Ag=='),
			this.addDataEntry(dt + 'related actions', 200, 40, 'Related actions',
				'7VdNb6MwEP01HIvAEJI9tmmT00or7WHPFh6wVYOR7aTJ/vodY+eDhGqrbrKK1BCBPG/mZYzn6UlE2bzZLDXt+HfFQEbZS5TNtVLWr5rNHKSMSCJYlD1HhCR4R2TxTjbts0lHNbT2IwTiCWsqV+ARDxi7lQEwnHZuiUTRGVw9GavVK8yVVBrxVrUOrISUOygiWdVfrphTpt4QTDGoNWUCt3bCNa9gS45xggGnJV9pWNIOgRyBTonWgn5ZI9GEokq1dkEbIbcIPOqSCwslZknyTFc1x/JQ9FOtdOm2z63tMD/JHvGB5+EersDEtVK1BNoJE5eq6ROl6UsXlW+By0GTCXk6bSN+uybE7S0cKWgLm3fH0kNhJktQDViNfZI3wSz3FbmfXMJBYKchRo2P6z3zMGNchDGPjzz7+8gZNRzYbh62kWF8Oyk0m9opNq4bJmOmyjNNHAvgRBjT/rdn/AovTL6mDMi4DAIhiSeesj2Jj2SS5ucySQuPaZDUijUM2o9pJ+zghzviQ/uH6aD7w2z4B6qqDNgz6e1f40NqzO8GdFMGFAiz5Exo1/KjyYX9yHQaKEMCavPuS59UR/7vvlRcz5e+Xd+Xirsv3aIvpcX/M6bppY1p1JLGVXJwo6+ngOKmvWd2ce/B8PDB58uPvwf/AA=='),
			this.addDataEntry(dt + 'floating action button', 50, 456, 'Floating action buttons',
				'7ZdRb9owEMc/TR6HjEOA1wKFp0mT9rBnK7nEVp04sh0a9ul3jp3QFLp1WoVUFiIi3//ufGf7J0uJ4m3ZHjSr+VeVgYzixyjeaqWsH5XtFqSMKBFZFO8iSgn+I7p/wzvvvKRmGir7ngTqE45MNuAVLxh7kkHImOHgwkkUb7gtscfdHIeGs9qFlG3h2p8VZSZnjQHtfFarJ9gqqdDaVarCwE0upOyliMZr4h4/Uaaew6w4Vyaw+Ve55glsyvsmWMobDQdWo7BAoVaisqAfj5hoQlCuKrtnpZAnFB50yoWFFL2U7FhTcNv16YK+q0anbiHc2hr9SfyAL9wx93IBZlYoVUhgtTCzVJWdIzVd6D73JXA4KpLQzesy4qcrQl1vYdNBW2jfPLhOCqd2AFWC1ViHhIS1T3gWmeVeWfiTJhwE1h1rzHi7GOY5M4GDgMV1ROIJkU+NyClY5GbELCZi7oGY+fJ2yCQTMveAzMDCDZBZTsjcAzIxvR0yqz8j06OBiaI28E4g8u43AfGXQJz6o71EIFleItBr/4LA+oNvjfaCEMRh1T2D50dYFv0/D3/129uAzJLRfTDYL2CYX4Gh1zRIZsURRuWvERI6+Oa2+Fz+y/g26s1+ApXnBuwFYMMyrjGH5vkD3oe//L7/BQ==')
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
				'5VZdb5swFP01PDbiu91jPhtp2VY107pXDy7BmrGRcUqyX7/r4ISkQEsXtD0sURT7+Nr3+pzDFZY3zXb3kuTpJxEDs7y55U2lEKoaZbspMGa5No0tb2a5ro0/y110rDqHVTsnErjqs8GtNjwTtoUKqYBC7ZkBipTkeighwiMnCWVsKpiQh1UvOXwQL5QUP+G4wgUHDaYkFiXOHZyYVCAV7DrLPUCm1nsQGSi5x5CSxiqtIjzf1JgC3aRmmxeEFUiKCtic9ta3x4EhoJ0M791ktF76BUOTmf4iXqZUwTonkT6gRMn7cuL+GSfOhwE48RucfCR8Q9ChiH4jjIEuZU0SImmDLbyUZklfj0aEjRndcFz5IZQSmWZKcLWmv3Q0ko90IjmUb1aQ6Cs4YQ3h1K5nE3PA7CZAUEKBZzwZNno7rYPVvXlsRkFgG/7eItoPKkwCI4o+w0XKa8gPGuSvREQUxAiqUiuQiq0sNOliiyW6tki0GvuYH2ShXAemoDEdAFIDS6ycER4Xx/jPUJoI/HsiDHAFa7NHo1GXpG1e7lbv0XDVouiZBRy/VcwKWR75/gf63obv1NdkfRCUqzplYF/uEElSgGr44VRrL4uEVzXwY5tua2MDkDxIV75t3HC9HD/Ou5x5bijXzM+68WIxDjy/tuFXkRsnvmJpE/Gyj2U0jnX2CTFAhLyAPBZhSutt2PBVLm98v+HWO7ulGfmDmPWUblC33jW0nH9/WH35j9TcXSr3l8V9I/s1WuO0fm2tws/fan8D'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card Collection',
				'7Zlbb5swFIB/DY+JbG4hj7n0Mq3dqrZa9zY5wQRUgyNDmmS/fjaYBGLISAJrVY0oUnywsX0+nwsnmjEJNzcMLf176mKiGVeaMWGUJtmvcDPBhGg6CFzNmGq6DvhX069r7sL0LlgihqOkyQA9G/CGyApnkkwQJ1siBS6KfSy6A80Yxz5aCjnDc/78sRcQMqGEsrSr4aWX6JYw+orzOxGN+JixnAqzBG9ql5uK5FpvMA1xwra8yzpwEz/rYVhONszHwcKXw2xTLhzFmWCxG7vfPf8hFVCtDENRBuRrGRngJJ0gEiwi0cxWd6gj07JGtlmnI49GSaHzdXqJzks0D6LFo9yxuRc90yUXQDn2Sa4R5O3gt2hCg7cZjnnrRWoSNiWin0dENzMZwwQlwRsuPf8SSuaZRzbcLISZ9RehS/oJXf6aIabi0afG0LEvOsJGtcLKA7bSOvtW1i6o07RVbcJTtSnnf6ABX9Zu8t5QL03fG5SfQD0vxolCY7eLRoAsBdAzQ2+YpIwYRuFJ5lRtJmVoNhhMnXHlES8YgdDK3wwss6aeMBdBOZgjMpL2HAauKxacd73DnoAz0As2T1JZp3ZlDS47CduyebZK3m7DNJcMe5iraY7jhvh3YaeR3q1qvR8xyFxXJYO0WzHI/DG5PTodUBm0QSXGiM19BUhR+0UqElTWObdH/UJEjT0orPKg7QDr5dlAl8ScNoiFiC2C6DHzosKZ3qcC3s05NXPjz3fpWnpU1cdmkttc2V1nFoZ9IUqJzoEdoBuqwY+HFB1AfmzAaMXVy2MFinhjhtHc5z6ubbJ7wZgmCQ1FPHMaetLxVHy4fO0HCX7igU5MvuZTHwmdh4FyJqc9jIrFUFxIYMWJsZseGee8I6MDs/50NE08IVDYfluFM8wk3gOOfBvJsTSimJ4X1CHTigMNgX1rT9VSoQzT6/xkv0a/e19rqd622ki7Sv8hVCi8iMPqY55jCrsaC7vSRC5iQKE2cTdeRS4SG/kSExS5ms6nARU3VGuUFKvsoR5Y/pqWnusyxEPq783JAq34UqOLdBKq1Ymn29HjVR2kom4rc/2RZShvzuA4Xdmj1opzHzfnaDA7eAtvCSdUUDpAJWm284rolNMbS+8CrFppufr5cPf9P9pu0f4Ttmp95iuKFohRyqU/ECFY7P8JeYgFrSc/Hz3JOYzhenUMaDmj3oUFe9gwLEDn1LjQOH6r5aFmp+CEehBIr9ZLnrU2W6lC02klsvbMLt4wYSulmhmavzYuCRS5nFkXgMcLA6Cf1x6P1QaqijktVVcHZf/aRXEVNqjm5Kz4yGAZ4w9F6PMDalC8OerS3pPO4LPh4c39n6lZ9+J/rX8A'),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card Collection',
				'3Vpdb6M4FP01eUyE+e5jk6adlaazo+ms5nFFwQloDEbGaZL99WuDnQAGhgToV6oq+MbG5hzfc69tZsYqPjwQLw0fcQDRzFjPjBXBmBZX8WEFEZrpWhTMjLuZrmvsf6bft/wK8l+11CMwoX0a6EWDFw/tYGEpDBk9ImEIvCyEvLo2M5ZZ6KXcTqDP7r/cRAitMMIkr2ps8g+vRgn+DeUvCU5Ym6XoChIKD63DzU1irA8Qx5CSI6uyjwIaFjUMyy2ahTDahqKZbYqBe1lh2J7anp+eXQgAmsEwFDAAG8utoV2EiYeibcKLxejqGK104FrLNow2OKGlyvf5h1dOPT9Ktj/EE5tn00+cMgMQbZ/EGDVZjv7jRWCwMoEZK/0SSIK+jOjXMaKbhY1A5NHoBVbuP4Ql88opGx+23M0W2zhAC4rTf589MmiqGs3AVBschRcurKJcgs20VdTApaiJ/r/jiA3r1Pn8Rq90P3eqd8CbTQapgvrpKXoRYSlEPPLnj3dZ5F/kMc2eUHWb9Q1Y282zuDTPOSB/8qHCYeb8XpzgyPfQrXDZOAoCPmBZ9SvccF4cveTWKLdN6jqWM2wSHKseOCrp9hjelxK4gQwmH2Y96bfvtTUfdT/crWbcO3xRYlXxRXsUX5S3ka7oTsCKMwYrGfSIHyqEMPT1O8u2lzVWBFFFZemP+kCKeosnaBLPcQiby4A/JWPuGIzFHtlGyY9CRbmYPuYGVs2tGJaYUhxz1TNV1zqR2+iHrN8A74XSqtpbWL5IEqZOKoCjjyKNLpiA0huF0n8SFMURZSSewqKWMDTrTDOkOIP7kNV9YqGHm/eM5o5gVg9dz4LiepwqB8dS1si5ss/F8wRxr08U3T9zKrP0SuquXUhp30QRaAohX6OMwoTZKOaTAe8I+9p4L5gw5Hl3DNSMZvwq4aR56HkX8+I+hAlkz19cEnGJGb8JPNVms4iXF5fwW800ypzIXL9sa8jszY5J8rpEWpcS2eybljWBbwKgzoW/nn6uvzHbt79/tTHWmiDW11ZVGjWFsbqfaR2sSQ/2GSGQDCTtWGlQDqBiZ6BK4UB5PVSCm4yf8q7jMnrt1sVVEVQsGswLwqruWK7dK6wOiZgy17fUFKk5glr2CMqq7pQ87VJI4nwL651Ht15ogx4JSlcwG4SuusNxjzOaRxwa8nDzHeKUoftewswgRGuq3zfIDAJY3bkYVTr0qkxIhF1VJJZ3/G/YhmkLrrLFjalKv9202u0ShpaFEqhP93GUfZQ9humU3XXA2r59LWU3gRq7J1R2dSfhi4f8I+ZJ8513zD6HuttvqO7qyn+NUMRl/QHvUMAf8GMJewuYbyHs6hL8Awt7C64fV9h1dUH+roT9dgls69VSdst2+gm7YbXz19czdHX9+3E9o5hHwz2jC9jXdYxr17IXHKBp+ef6TaHuydwzRzGFbeAW0dycYku+4fz/Ch959vzfTWcop3cj2ni58iCljRjRQlvIc9quw5SmsDHSSbRT6X2Sg+g+rwRIrljLKM3gu2Lo8xPUY8HdKWlvyY7z2ehhxfMLZkX18vtn/wM='),
			this.addDataEntry(dt + 'card collection varied layouts', 358, 642, 'Card collection with varied layouts',
				'7Vtdb5swFP01PKbCGEjyuLRL97BK1TZpj5MTnGCVxMiwNt2vnw12woeTEWIoTUdVKVxsMPfce3x841jwdrO7ZygOH2iAIwt+tuAtozTNP212tziKLMcmgQXvLMex+b/lzI9cBdlVO0YMb9MmHZy8wzOKfuPckhuS9DWShgAlIRbNbQvOkhDFws7wkt9/tiJRdEsjyrKmcJUdolnK6BNWV7Z0y/vM5KMwS/Hu6HAzkxzrPaYbnLJX3uSFBGmYt4DeJO8WYrIOZTfflQNHSW5Y7/se3p5/kA7QOwPWnAH4WD5B+yyfoIist+I0H13VR9CG8+n8mI9WdJsWGs+zQzSO0ZJs19/kG7sH0w8acwOQfb/LMdrqnPwRpwDyc4YTfvZTehI0RcRph4jj5jaGI5SSZ1y6/yUouS1DdrNbizS7WW+C6Cal8a8FYheFKtQ7ptzhVWbhjZefF9zm+nWvgXO9Jp//SAkf1v7ho6lTevxoXL4DXa0SnNa8vn+LRkB4NSDuSLKk3Gtn5Ys+DypJM/fAzBPA6MK4EOjCI/9KojxjRiIlBMJkiaJPMmc3JAjEmFXTr3glgBk7hbyOMlunueONL4uC13IKGkXdN5F+McMrzN20xEnDCNhPLY387un9fiIZla9KyegbSUZ1G5WLkw5QGZtAJcGILcMaIEXvF1GRQOWNVT46F0LUmD2Bjj3NADZSM36XiE1qiD0yPFqhhXgnfqOkBYAbxNZk+y3nVUGvD5mBN/NLhhlNU7pRJFjJtNmd+DuWlvy5AX0pEK+OaIuE7GpodiGfr2h2Px6vIGwUm1d4t07/ueWLioPOhQ2ERth5AjqIqqkJHjASRqfXAi216OQkr4MaSehnV2AEv5HXBYDANoFgyJlcs/Y4ndrF9YMmu6fZUVlXNKb76aV0rwHSFN0Dz+ue7wEwAeyC0ieenk/Xha1mKpd1i8uxtSsrIZVgZsFtW0cp66+QO7UxssUrbeFtqd2GDLg77QPveqlojp4pIym2xAoJAgEyoyjgjVJGYrNqDpYMcpFqVModBH9Fyr2E/B2/c4UmLC98sCXBBvxTaq+i5Kriz530Ie/2YQl9z69H5niqCU2VzUNUfMBIPayd5DvYVWGyNyUIjlTfjkpBLbLDloL1AlsLZIcnBfOI/dBa0EgRbZBa8HJw378YNFOMey9icNCI96MG67W8GU7SghJEhEVka7imp5+B/8vARjJwV4nHq5OFb1gJrC1N+lOF5xYI358qdK60QAg+fIVQjesaVeGQK0b9qEIF5kdRhUNGvBdVqNlO1tsM3F4A9ld/Gzf8us6/EPQuVVbrzWhn7H2ys6O9JjqNQ0MQ3IkREEZuJxOnkULZAi2fdAyq3ftSxKUlQzqn1832jVNdmmhIUrdrydAWwnGZI7vYQdhkM5nCivckcYIHhdD1A9SglHWS0t4SnfG1wcNPD78MyJsXfzjwFw=='),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card collection',
				'5Vptk6I4EP41ftSCAKIfR+dmb6tu9652rbraT1dRoqQGCAVx1Pv110mAAQMzKLA7emztaJp0XvrpTvqJGVnL8PgpwbH/hXkkGFm/jaxlwhhX38LjkgTBCBnUG1mPI4QM+D9CTw1vTfnWiHFCIt5GASmFFxzsiZIoQcpPQSbwcOoTUd0YWYvUx7GQJ2QD7S+2NAiWLGCJrGpt5SOq8YQ9k/xNxCLQWWRdkYSTY+NwpSgb6yfCQsKTE1Q5UI/7qoblzJSaT+jOz9SmdjZwnCrBrtB9nT18yQxQbwxLM4YJY3mwjItsggO6i0RRje7cRobhzqeLJhttWcRLlZ/kIyrHeEOj3bdsxvaraMViEJiZ7vdsjEZepv+KomlBOSEplP7OLGm2RQRdhwiylSwhAeb0hVTa74KSfaXLhsedCLPJLvSCCWfxP2ucdHJVq94wVYVTFoUTR5VLZrOnutXMS62W9f8XozCsovPxHFW6H7vVFth2mxKuWb2YRSsgHA2IJwJWF4PHHkkuCpr6YDiPnPl0NhPo1PlyyduR8X4kqbAZi7gQMNMNDh6ywA2p54kx51X/IFuBjotKwR1I2aAB5LjdXOFUjcNeoZ/2EYNxQrYEzLQhaWsPsJGEv5XdnXq7vxGRua0qETntJSLzZvKAnA2AitsHKgAKBJevIVI2fxMsSiOPStQRqNYLqVm3kPYD23jqDI/brA/cYBgcFqufGkqtEXKGAyiP2SEBmvcBUIiTHY2+qf1ObHtfpACqzSqCBeOchWJzsltn2PCGyEd17rFDtiuqffL33O5m7dY55C6GXNTLNjYzB8DVNN4H9m3Gs3gU/zqlkfM2sVUys1uz2rk9BdO8uktl5LFno5ua0VcJfgHue256sBqvyc/WWYCc5WfIruE8Z1ngXD7XB0EDVuUUwjF0eGyjnxgYAg39BOArOYDgB0ue4WNJ+aktMA2J8zkwYn7nwBjyuVVgzg8f+kFGP454xCdFr+KYwOS9CZRWPoG/nIQxSbmEicpmEryTZOxAwQLI2EceDWlE5S6FjO1eDANsa6z3QovLVg40EluH6ILvk0jW5Kx4nbI998cEp1x0/FnoHWDKMG/RIn5h+wSvA1Fz4+NoJ77gyCvUVzh6FsRQyneYRpMmxzr4lBPhREJ8gC00l32vyjI/E44yPQt+u8Y/OSspFdusoZFCc1BHtHJvKTvibNaLI5rGIGuEfuTysFx9/vMryMyOi0PdQdXZ2mAvncfFQ4l8b8DaJKngXzSTjaMrXqeKQgm9eU2OY/cD3tgZZBnRj2kK8PRs5zLwZkOBNwhydet/R+SOVacYFsheDl3aspBsKbwFClLwThvpzLOelOSm+5CkpMUxzuCkRDnb/4mV6IcwECSQanHKorbL5C9kJk2A3TI10Y9dnvaR6OU1Y10QvPE77mI/g5/8YngGIShIPz0BMiLT+4P6SKE58QHmFzSBbTOuAJiEOY4RY1GZKKRCY002WKqGTDbkUaA10YarKRR8ZH+XFKKFr9weh0D6qc/dcIgmwO6HROQpyN2RiMuhu3EWUXPJRcOvK4u4Jc6Q56jvUYa+8qQhGMPVV2IuunzRLQF6Gwc9zupB6GmNtAfZ4fSDlisia403z3VxUkRQEy5X/vaufKeR6BkTVP0BvPb397prEz1dZHKra+IQ95ja3GbJsQJNGqfkQyF0/wBdfiLycdBx7w0eKL7eT1bVy9eX/wM='),
			this.addDataEntry(dt + 'card collection', 358, 642, 'Card collection',
				'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'),
		
			this.addEntry(dt + 'card', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 344, 254), 'shape=rect;fillColor=#BDBDBD;strokeColor=#BDBDBD;shadow=1;');
				bg1.vertex = true;
				var part1 = new mxCell('Greyhound divisively hello couldly wonderfully marginally far upon excluding.', 
						new mxGeometry(0, 172, 344, 82), 'shape=rect;strokeColor=none;whiteSpace=wrap;align=left;spacingLeft=16;fontColor=#666666;fontSize=14;');
				part1.vertex = true;
				bg1.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg1], 300, 230, 'Card');
			}),
			
			this.addDataEntry(dt + 'card', 342, 378, 'Card',
				'3Zhtb5swEIB/DR9Tgc1bPzYkrSbtTWulfXaDAWsORsYkYb9+h3GaEohCG9JpIy9wZ59tnjt8NhaO1rsHSYrsi4gpt/DSwpEUQrVX611EObeQzWILLyyEbPhZ6P5EqaNL7YJImqsxBqg12BBe0VbTKkpVc6MoM1I0l5KuoMl5wjiPBBdSl+L5ovmAvlRS/KKvSqg+mpKMxGILSgcE0x+Viu5OjlmrzIAfqFhTJWuosmWxytoa2DUDzShLM2OGg7BVkrJVpC+2BwRwYSgME8FvJnL6zo9YJfoAvaQl+01/mtsZjQW9D0vQhoAtKSeKbWin/UtQueNRgSErStqjlYt8ANStPsZiwWexuHafivtWKqaH74JBx8jej8drLequuG9AJElJVQ/qyzBHcfZ6nJ+YAsLHsAGSmg4awl6fGpqGmv8B1PwetcfqOaMkPsUtEbm6YhB+IE98DZ5Bj+eDpHUmqhyI2jHbsBJugNf6DjkXcF6JisdasxV5TGVScS2tiUxZTlohIRL+q0LkcKK7Fa9ilqc308+68N1mTNHHgqyahraQdUFHOEtzEDlNdLtQCv1/1tLC8fuB4esD9E1IsBXhd6YFJYpDA0+NsHBsY/8IE34j40ONHyYMdB+XJADjdeSZYDqXEBw0QZ4MPyBPvstjbt9jL4uUaRNv3TE4R90NL3vUTW8z98h5kzzctxd6cziP36MgitBYyuEbKe/XH5351L1GVp/hazB37PPQY1JmtKlvtwtp7YH1Lm02DDfpOuY3kNHkWH/MPbwMvbH+uB32x66zTq47S8FX3nHCgYnHv3zecZzrhKo/ny+W/2Co+l1HXClUR+wTz4eqpAVk/LFbAG8Zjt8wntgx/u1Y7W8m76KnT9++Thqxx8uTO3Tvof2yw3ThDCxDLon0rsHJuA8GNl7YnyTuZ46HupG/T7rTRn5/kzuhC3GwiHDfhWHkeF70/7sw8Kb3IIiH12dt9ddv1/4A'),
			this.addDataEntry(dt + 'card', 344, 420, 'Card',
				'7Znvj5sgGMf/Gl9uQdRqX27edluyX0kv2WvufKxkVAxy13Z//ShibYfm7K69VDLaJvDgg/D9WB4BL0hXm1tBquIrz4B5wQcvSAXnssmtNikw5mFEMy+48TBG6ufhjwO1vq5FFRFQyjEOuHF4IuwRGktjqOWWGUNdkGqXFfCgmnyfU8ZSzrjQtUGuk7LXUvBfcFADOu1qCpLxtTL6qmDuB0LCZrDP2mQ6fAt8BVJs1SVrmsmiuSIIw8atALosjFtoBotI3RiWe99OApUxKvQrEoxXRDnSqgZr8CUvwVZqrtNYCfCzEoSoRwFjE8CIpE9w1HyfKuYOPzhVN8ao7U/UeGyPi20DPM9rkJao+26O0jm0dL6jUin8t9hKJHk+0XAQ2arh86g2ewXVIku1xeN9ASQb0i3npbzgQ/iKegaX0HN28vw35q8+00nZBdT0N/w0evl7y6dWrdFT4gAK44DeIt83Yzmgk/g2nNb2r3AMjRhdgEbsCg0cJfHkaSSu0IhQlEyextwVGnHUjmXCNHzkCo4ucGz3sxdq386mTMh3hVAXTBwjdPri80oJdQHGMUInLIavm1AXdBwjZC+jJ0qoJw6FKJz+e5tvL9knSqgnDrlByJlNgJ445AYhZzYGeuKQG4TszYJ36d3n799O43R4bDB00KC+64JKWFTkYdfQWpBK2Qijy1IVGeS6XVVLy+UXXbpRYdLaCo31x9gXpoN+W1b0Wz/76XjJo7A9cnj2SCM5C/M389kloNt7Ev+hXxH0tp2XQFfF7jSyufzwsPIP'),
			this.addDataEntry(dt + 'card', 344, 162, 'Card',
				'5ZfbjpswEIafhstKYAeSXCbOQZV220obqdduGIJVByPjZEOfvgYMIWtQQbtIVUsUYY9n8Mz3Y1s4mJxve0nT+FmEwB28dTCRQqiqdb4R4NxBLgsdvHEQcvXfQbueUa8cdVMqIVFDAlAVcKX8ApWlMmQq58aQxTQtmhKO+pHriHFOBBeyHMVReWl7pqT4Ca0RKK9iJKaheNVGT3fMfCAV3HpzLk0m4T2IMyiZa5dXFqq48sCzWRUWAzvFdVhgsqdZZTg1sXcEumEodBPBo4n0V97HSkLGfsF3U85gLKgbS/4Q8CdIs0Vlk8CpYld4CO4CZyb8JpjOo5ntU/2cOkREUQbKIt3kOQj+zIK/OiomkmIeCVTf8Mj3c4fnG4ItlRKRlAKJRLWct8RbLgNtFyk9MlWUil3j9qIVK8Rq+iYD7z3SmYBGlJZ4Oo9pXnDfYnxgSpfylqsuRz3WjlwbWVBeBd8CWXI6iLSmVCBhR8pXnJ0SbTyzMORwd32CSNW+H7siWhgbtA9rwB25BoayDSy2L5cfMdBwAF0PDaX7d8NFY+F2bzC1Rh+6v8wtffYS8lhcEq2QG7Iry3TGPC9L4lwMkQ3bsmFS/P5L2QJ/AtkW9rFADp+/fhl3Mtd7fs8B8UbDBfF8n1ibvb1kJzm6566tEA7ep9DtYf9vznE0gWDLKQUL1uvNtmOvXKGdj/5BwRYTKKa794+Myr39DfIb'),
			this.addDataEntry(dt + 'card', 344, 162, 'Card with UI controls',
				'7ZhNb6MwEIZ/DcdWgAlpji3d9tJIq7ZSz24YwFoTI+O2yf76HWNDiIAtKB9aaQOKZMYeGD/veExwSJRvHiUtsqWIgTvkh0MiKYQyrXwTAeeO77LYIfeO77v4c/yHgV6v6nULKmGtxjj4xuGT8g8wFmMo1ZZbQ5nRQjclrPCWdwnjPBJcyKqXJNWB9lJJ8QtaPVAduiejsfhCo4cX9nkgFWwGY65MNuBHEDkoucUhXyxWmRlBgsC4ZcDSrHYLbfS0NIa08d0hwIal0E+ETCYyPPMhVhJK9hve7HRGY/H7sWz3HL6DFNwYmwROFfuEPec+cPaBPwXDOJqnXdX3qV1EkpSgOqSbOEfBDw5Nx7t7ff5VlENQW4cGYgv2IjxRQs46TJ6pArSojJX63vz9I+9gwslVeMRavWCuoREz21y3oITVoXEVdMXW6asodEK6aNGA2IryW87SNRpzFsccdkOfINGz9MKj53MLagN6L4PdiRk8lnTYIb2kKzQsMcdAjkDs+WMR/9uE/amE+2tEXX6OWiLmHZGedIS++yAFLgP3BeHBGK16lgOJ9PlfahXOTqDVzfflPKZlBrGlXNf2fJPqN6LrNI/5damo7CvozcIa2mVPsqd6PRJ4B26pdXTWo95hCTmBJIuLJBMkCWZnkMRzL5pM0GS+OIcm3kWTSaWLnEOUEf9WL6LsRAnmxxcFL3dfJ8zw9seLPw=='),
			this.addDataEntry(dt + 'card ui controls user interface', 342, 522, 'Card with segmented buttons',
				'7Zldb9sgFIZ/TbTtIhHYztdl89FqUitV7bRdU5skqMREmDTJfv0ONnaSgpt0Mb2oaieSfQCD34eDOdAKx8vtjSSrxZ1IKG+F01Y4lkKo4mq5HVPOWwFiSSuctIIAwb8VXNek4jwVrYikqTqnQFAUeCF8TQtLYcjUjhtDtiArfSlpDI8czRjnY8GFzFPD0USfYM+UFM/0IIXmh05ZkERswIjhxtRHpaLb2jbnJtPgGyqWVMkdZNmwRC2KHGFkGrqgbL4wxbpl60lWGOZV2b0EcGFUcCsSXqrILD/eVGQmUnVg7+WHsT+yv/rZGJX3pl4tnqQZpP4xMpwtZ+CWc3dU4JS4YTAojJJyotgLPSrtUtzUeC8YNKSqrl09qCwjZrOMKotR1dKzsEUWthHJGGexsPCBVMqGgPLjGELQewVBp2uxWUz4FWfzFGxPQimx1LxXJGbpfGTuJ8HedktnqoT6nxDDkz4R9JDDJ9A7qZ3rJ11LcKhrpiy1E5ItaGK0Kz1nuZ3rIa8zXya8w0UMTROp5TKpSKntX+OBPm2Aw/wAOydPlN+LjBUPnchCjQrc7av0JUsS3doRMUR5TssCXeVzQL0E4XGBA6DYwRN3L/NCU1m7b1x8V7Lz4JO900Pp6d6RKSLP7BnXV+NRFDbnUDh06B82on+J1sjfwx7k73/JXyd/qY1P+Qdf8tfJH0X+5R9+yV8nf6m3T/nLAe5Lf1v//uAD9MeW/lEHRj30vYt/WCTcU+JqRlU7E2pI665johO8d+Ja96E9/tJ2fQQf2BVGR+UPteH/U8HskqRw9UChV68lSe258onIpBbDYdzY/eCowxksXgrPwBoiH7DsCH8sadHMQ04Jg9EpgwuolUoYp/Rrw1sDMZCfqLWkuVhAs6Xft0eWq1xWpO+leFpnKi+T6nyc5XcsNemx+AsvPtY5IR+L9WOpUkCtMec87BWh3St0bLtZMEUfwa4zbWDc3Wd7MDTzfB57j8P1e830Hoy9DKz2SoNFrPyWcZZ/qeoXgprV9X0LOrgZldu4G/mQ2V5f+CVS3fpv2ifJC2EQ5zPO1M7LMBp9xDD6PmBRU8AiL8AaifZjLuJnl8tUw93bq60lmcAXmcDjVKV3NFNpD71gslcFYMZwFaL7uw/68LgWtsuVtxi4UNm4n5kCqIPxceDvWnNzAG7M85AXpPZKQ78O6euti0uGSDfac2K1SX563+CosEdoGH1C7vYSB7jlFfocrnyKaR/hwedjGtjLJg/Tx+nD7+mZSINpf3AdeEZ6CcB6Wq7tjqihTceogbAfbvcb80X2w337fw=='),
			this.addDataEntry(dt + 'card slider', 342, 570, 'Card with slider',
				'7Vpdb5swFP01PLbyB5DksU2WvjRatHXa48TACdYMzoCsyX79DBiaYGelwV7UrlRV4PoDc871se8FB0+T3V0WbOIFjwhz8AcHTzPOi/os2U0JYw4CNHLwzEEIiH8HzU+UwqoUbIKMpEWfBqhu8CtgW1JbakNe7Jk05HGwKU8zEooub1eUsSlnPKtK8ao6hD0vMv6DHJSQ6ihL4iDij8IIxYW8H8kKsjs55sokB3xHeEKKbC+qPNKoiOsa2JUDjQldx7KZN6ofFgR5bVi3bZ8gECcSBT0iWEHkc5AKwzwL0pDmIVcAEk9SAcPT4uDxQXVI+2f6u6yMvOZati7LSyxoGLAbRtepsH3nRcGTErdNENJ0fSuvZ+jJdk9W5TPDsn1GctH7V4lNb4zReRg3EGeEBQX9RY76H4K7q+C+4AJ30Q5AMdAbLG4MlovasuB5wcrh5ts03Q9gBLo9GEloFDHSn5FAtmOVzSJBAKgEuS8lSN5iyam4MwL7Y56bFny1ykmhENoOrBfHnsKx7/ckb+SVf8fkTUAP8gq+OZs5WeOh7GJ2Bb2B1EloIZTYHlAJdVS2xiHzylcVfoqcWzAfALzbR8cGzho72INrOMEK+iMN+C8Wus482p3g0MhEGj2/bEdBHpNIctOs4cluXW41rtdJxK6TSkS/1RI6DN3jBi3W4uk9BeyxPbCvIEAW0B4raEOQbOIzIH+kadTulZoVAel2T0fT7pnp+LJFrDPPWPCdsCXPaUF5ac5qVjozFANT80/rE0infp4Rn2i67oqvUQ+ZKB4iRMY7f06GjG+jvdZT/l9/GFvxB8+GPzROdmZclfKUKKIgjWZ3ky0NHvLVdVEbAfgDtdos0NDESpiLeUH66XJYHb0DWfD39dLv+KLKANTMBGRgWwh7RP7PAxcHaS0inayAXx2nXNgEdOAa+153u6HBTwMfNhMhXTV0mXVoNf8gdA/cLBR29Nv1FvnD9aBPnKSsB6GggmSG6OpsDbHKlGfL0dXEQikarx7RMboYomoYX14uXzmg0PUuhqgapHtvAFEE/IshqkbI47eAqD+5GKJqFPywJXkU9E2/aiHFAyKVTg7Jt7U5hgrG2vgEmdpWTKxEJGqIKsLGKhPoIJ81fIkaYUuZ/3NbvocSGOJJdRya/HX9O/fQcTfCVPfU1DgR94jx0U2u2TzO57OxNzu1ebTtVafi36b9fae8m+Y8DJDjImEG/FCbXdN4pQWnbBNr8HhxtOSlSI2bv5IofZcZCzLjYhsEqvH4CJuRGfAuM/+hzNjxUjX58RBvs3eVMa4yE98GfWqOxHcvspd58Uu2dw0yo0HoH2qQHR9W01InlzBGNa8DDr+w+kdKoX0dAA0phWdF6NVU1fzL/b2wfPqw/PjpoafaS8X4+0s2+CrUXsuhO/DVWsNh088QDsXl0+ePdfXDryP/AA=='),
			this.addDataEntry(dt + 'card', 342, 236, 'Card',
				'5VbJbtswEP0aHgtQpOKkx1h2cslSpIecaXNkMaFEh2Jsq1/f4RIvVYMKtQMECAHJnDcLh++Zkggv6s21Fcvq1kjQhE8JL6wxLs7qTQFaE0aVJHxCGKN4EXb1jjcLXroUFho3JIHFhJXQrxCRCLSu0wloK7H0UwtzLDkuldaF0cYGLy/DQLx11jzDngfC8J5KSLNGMEMjrQfWwebdngOUGr4GU4OzHYaslXRVjOB5arQCtahSGuOjCIo2Aott7o4CnCQW/s4I7zHyaKxExJR4cxXgfSK6Hk24n0CPadweCd/DSPhP9csHZ/zNTtkUbc+Imgt9qdWiQWxmnDO1Z28p5qpZjJM9YTvsBkq/82yEkIUWqz8mhgYzzf6P6Tz+q6gFLZxawUH9Y9jPe+zPgBSMjM8bWMWJiT/a72GYCHkYhyL4bX81EdISP4zy1NEulckPM0xZtuB6om0bG6TjWU9HIZ/wAeLb/NInh59GtAv6AaKNeqKtY0ANokHW/HqNfxQ+q0Zq7A4TeEYDY6OXV//OGgt0zwAPq4kHlLa1Qqm2/iOO7CD1ayWlhs+q/omObMY/Qv7znvw308uHO4Ru7x+mxwiX/yFc9umE6w4S/injxUlk/PZW5xgZ0dx9Lsbw/a/J3w=='),
			this.addDataEntry(dt + 'card', 342, 530, 'Card',
				'5ZdZb+IwEIB/Sx8QT0U5gG0fC912K+0lFanaR5dMEgsnjhyHQH/9ztgORxMWtIV92VSUeMZzeD5f9MJptnpUrEi/yQhEL/zcC6dKSm3fstUUhOgFHo964X0vCDz89IKHA1rfaL2CKcj1KQaBNVgyUYGVWEGp18IJypQV9Kpgji4nMRdiKoVURhtO7ukP5aVWcgE7GjAPaVIWyRqFPjZcPFAaVgdzNiKX8CPIDLRaY5eaRzq1PcKhSzQFnqTObBTawXqstIJkY7stAb64KnRXJGxVZMY11iLwEgmliaigVaSIlSmQB88O+A8Vi83TqlgucypWLHP9zN/IHFNxbReHfFPl+JyJO8GTHGVaFuSqYHOeJxOptcyaLKzsK8RUHn+8Fc3IxkoUlBjsxRWWADHnWBi703gF3bzWewbH6IXhjRUqEEzzJexZdyF1EX9Kjolswl1vHDU2Mo5L0K1JsMn0pHkxbM2L5+pVu6nROSewYtoR3MF/a5590v4ppDMeRQJOh91GexLL8O/WnttnPgpv7F0A3aiF7m46e/rxHWX+se2ue5EeWNHvUA/N8w6t34H+TGBuRm0uw/Nw8b1LgBkfBnP0HPrfwaz2XV+U06fjt4TOAzBbJXSzGSRZJAZVsaHWbEpB171hs0F+pPj7Bjsomn1qF4V/HhTXDdKGhT+6AIubFounfkZB8KNTPAMG+DKpMAy68gRf0PmUyZISLaTgeKZwlpdWnZKyUDLjJcKjfnSOoR+WN9q5rASp8HKKpVHk/ZesqKgy75PTlC2NDc/oK0aMODEEQIG52CilFBEHZRu51IYIAsGkzdC0CfRqM2ALY+etZdU32ldSRtKNbJYCpVaDVSZy6wyzJtcR01QL3ArgCr+/wNoGXpusWRS5YtGOgW85tXVNft5ASbrhabn1ZoZTU8+aicWVHX1f2fugzdR0j+hfyslcsCqPCOcDNp76S9tXNz1jnjcp1GzdSKGc45oZHLpE1CnX8IyHPIlrXFTvNqvh9g7Qedm7Hv7zG4F/Oz7P0dM4/8gywub2R5Xtvvub6zc='),
			this.addDataEntry(dt + 'card', 342, 386, 'Card',
				'7Zddb5swFIZ/DZebAKdJe9nSLZq0LymVdu3hA1hzMDImhP36HYxJQgGFJHQX0xwl4Nffz3mxg0OC7X6taJZ8kQyEQz44JFBS6uZuuw9ACMd3OXPIs+P7Ln4d/+NIqWdK3YwqSPWUBn7TYEdFAY3SCLmuhBXyhGb1rYIQu3yKuBCBFFKZUvL0XH9Qz7WSv+CkBEyqSxLKZImihxk7HigN+9E5G8lOeA1yC1pVWKXkTCdNDbKwE02Ax4ltRu6XjUjzRogPbY8I8MZSGCZCzhNhNE+gru42qzvF08WQyhT6zCKTUFeQ89/wwy5rMh7/OjwrqykQVPMddPq/BdliuomwIc9ymAjqYK6ZsCzcPpVWm0zFjvBdchzYd9v5WOtV3WzbgYyiHHQP6mGakzjf9Ti/cI2EX8NGSMaKGQ15Gn+GqF6q576l4QbR+vOgvfsLaJc9tJviZwKUXQA3kqk+Me+DSf8IdPIW0Fc96GsFVSKLFLG7jO94jgsQlVmhEBKvoRTMCKVMGaioECa3pSrmKW0yEVX4W2QyxQvsQ1EwjNT7i7bxMuEaNhjjWivxeEaNCh6nmBUm5q8cMGCAhUnHmnXwl7baBh1R58mgP8bOi8E9s7YRD6l4tNPTMrvRYlWnwbljxWu3+2sdZ4d7d+hoVpPd90z2GLx8+vYVNW/0mLrmMB+Lvgm3HWLyw7+6MDKrgZ2A3BiXfQdgG6V2z5k1SA/jQTr7h/R/kOogLeePEmaPLyJN9dP3lD8='),
			this.addDataEntry(dt + 'card', 342, 356, 'Card',
				'7ZZdb4IwFIZ/DZdLgKrMy4mbWbKvRJNdd+MgzSolpSrs16/QoiASYOqSLasxad/2tOV5T5sayF0lM46j4JF5QA10ayCXMyZUbZW4QKlhm8Qz0NSwbVP+DfuuodfKe80IcwhFlwBbBWwwXYNSlBCLlGohDnCUVTm8yyknPqHUZZTxvBdNptlP6rHg7ANKPZCXrCfAHttK0ZINvR5wAUnjnnNJb3gGbAWCp3LIlngiUCPQQG80ALIMdBgajpSIYyUsd7F7BLKiKRwngtqJeDgOIBtuqq8r46liCFkIdWZ+XqTOISaf8Ko/qzMe+3t4HK1xoFiQDVTmPwXZoHsSyUASxdAR1C65zoRlYNapFFpnKnqFF0bkwrZZ7EenXlptFhMw349B1KDuttmJ87DGeUGEJHwIW0LKUzHC7yRcPoCffaplXjLhjqK1z4N2+ANoRzW08/VbANjrAddnoSgl7zgvfwQ6ugR059detWkloO3iHfe9eA8s0atdFfOc1YTrmgk37uL++UlqVuM1XrwFZMbPJdaMKOrryMFxGeSlmFQv2dknp6dPzpGTg060KakALUxzLnFyxs2mtT/g/k1rNa24WE8xTTb373g1vPzM/wI='),
			this.addDataEntry(dt + 'card', 342, 334, 'Card',
				'7ZZdb5swFIZ/DZepABPSXTa0jSrtS2qkXXvhANYMRsZJk/36+QvygVlQWHs1R5HgtY998j4+jj2UlPsVx3XxhaVAPfTkoYQzJsxTuU+AUi/0SeqhRy8Mffn1wueB3kD3+jXmUIkxAaEJ2GG6BaMYoREHaoWmwLV65LCRUy4zQmnCKOO6Fy0f1UfqjeDsF5z0gG6qp8Ape5NiIF/sesAF7Adz1pJNeAWsBMEPcsgbSUVhRqDIJloAyQsbhlBkRNwYIe9ijxbIB+uC2xHUc2RNhPQi9HMGjV6RQ8+kFDcFqBl884P/4limW8+xilXKrIxV4pX8VuEyFftu11FzK+fIBtMHSvJKaoLVaqoab0iVL5kQrGyzMNpnyJQ9QXyU1irGKBwaudgPa6wChO3EVMc5BowiGLoJHs4CrvEMWpEDxYLs4CzaBdmu+J0RmUi33KybqI1hWdaA6G2LLtNROyXq7ZTX7U9hN4tzl0jHhGV6siE+6XbOPhjDviRpSmE8/htZotuq0Z48U+HN798B3byH7iFZv3z7KrXg2gHoLtuBGr9AHel2gTZwoJ8CZrDIFr7jzJxYYjY7C6ktuMh/B2jxMLSr/1r/obmgxR9AbXH9huH88yz3uboV3eVlSu+2dcewPb6Q684R6zYRxXnAIJgg7oO5/ydcZuiinNrzagoY+Xq8Vprhp7fOPw=='),
			this.addDataEntry(dt + 'card', 300, 266, 'Card',
				'7VbJbtswEP2WHASfUmhxnOYYO80CdANioOiRMUcWYUojUJQV5es7Q9LxjhpNcisBW+LsfE8zUpRNyuc7I+riG0rQUfYlyiYG0fq78nkCWkdprGSU3URpGtMvSm+PaBOnjWthoLKnOKTeYSl0C14yVVYDieYIDV0KMOBtGtvrYNMUouZbAzPKMs6V1hPUaJw2y90ieWMNLmBDA26xphASOxIm7I6V3TCK3QryR/XCidJstQ9FsH4JxqqZ0NdazSuSWaw5dC1mqpqP0Vosg2WQfYWcQUlGa9GUfW5SNhIhjHZW4wAM5YDno+A6UUD2DrAEa3oy6ZS0hbeg43i3AtS8CG7paOSFovGC+avvmiu6CXQdpi7bo+6xfbKBvYO00UnsPt5Xbm3jnaQn4F0qKTWcDrmBhqL/Ctgkp2Kc/iPGQWZAC6uWsBX/EO4hxU9UlDmNe29xcbXtgXnegN3j6bWwk6gb7lH3MCg5Cf1sQbB9optxS2koVKzVgiktseG6atSKaFCiary6YGVtsFQNSGfH1FMcUa20M2w1q2jAEBKGo//GlkHEasBBC7F0PqrkS06PBj04GqCmWnyWBrVUYPymQusYIAKoaHc06xI9+QrEwvnFPbYDp31ipcRwsmkBXFoHXjnHdTCqmkNLYRkLGixwRtd76H3i3lUtpAxgYcWBRcV723GcFzDIc8viOpo7TseWndCLM3/6gfFTzlfqzCX/FYrdtWgryXTe0uZhsPS2dmWZq2pVQif6lRSaGc/FI23XFcrCI7UFizua+Dstl6275uCQOh8e7CEvuV89+R/dVsnw87v01WX8AX11sddX15Ppw4/vJEv+9hLbfllV/GQdf7PtjNChWzsj861M9FsOG7xcHqBl+MZpF6oL3IbU5yuu35Wk0XGS0v8knULS6P1Zou36o9Obb36T/gE='),
			this.addDataEntry(dt + 'card', 342, 246, 'Card',
				'zVVNj4IwEP01PWqgRVyvoutpk73tubsMlFgsKV2F/fVb2vqBQiQRE0tIypu+zvAeQxGJ8mojacE+RAwckTUikRRC2VleRcA5wl4WI7JCGHv6Rvi9J+qbqFdQCTs1hIAtYU/5L1jEAqWquQNKRotmKuFHb7lMMs4jwYU0UbJcNZfGSyXFFi4iYEYTYTQWBw36+sHlA6mg6q3ZQK7gDYgclKz1kkMWK2ZXkMAVyiBLmaPhILQgLS2QnrhnCfTEqdCtCHlUkcSMG0V2YteIIaHM/uDLvclgRXC3InWLcE+fWWAxCZyqbA8tcpdmLuGnyHQdp2yT4z5HikiSEtSNyKc6B+ke3Nc9piWDZrlnvypjQl6lTfdM0zzmUwZUqj7pr3wKzRhqAOk2oE3otcN1YcsN/+0xN1zqiR/MW9knJHyCPbMx7PkWYptTuX1Bh/yg43/ijePQAl8ZNH+CQeEYBkkoeP2C7jyzf4LF+O2jH89nuF1+ecT/Aw=='),
			this.addDataEntry(dt + 'card', 342, 342, 'Card',
				'7Zbfb5swEMf/Gh4rgZ1k3WMha1VpbSc10p69cAGrBiNzTZP99TuDIWE4Cm3WtxFFMt/7YXMfnyHgSbG7M6LKH3QKKuDfAp4YrbEdFbsElApYKNOALwPGQvoH7PaENWqsYSUMlDglgLUBW6FeoVVaoca9ckKdi8oODawpZbyRSiVaadNYeby0P9JrNPoFOkupS7DOusQj57C5nP4sf9u0Eevu3ZTWvgWDci3UjZJZSVoh09Qa47oSa1lmsUbUhXN22nfYYKfkItVvNjnduCekjLA7WaVGciW6A10Amj25vMkU89aDz1xpcpBZjn+Jom6FrI89FJ0Gru5+BnzEYCWRnpaFmYa6mdHAO7H0lfZi0bZiuCeBzceUbptrSIkWeZ4S6moSomhxkFY2Zhl9IUW4NKrxig3UNPdPR2AySeYnuR8EnOMa8etWNKAEyi0Mon2w3Yw/tKSF9NNd9Ym6GL3Z1ICj7dGvdNKOmY12zPPrL3SbxrtbqGI4jXQ0hfQ7+rGB/UGW/GNd6c68S+HNZ5+Abj5Cd5Os7p8eSYvO9bj/iD1qfP+pO6Tsskce6pcwOdlf16Hn2GSXAXKrc63V9dos/ARei9O8zr4q//Ma8vq6+PfA6PbwtdS6H39M/QE='),
			this.addDataEntry(dt + 'card', 342, 216, 'Card',
				'7VjBbqMwEP0ajqkwpiQ9bpJtL11ppa3UsxsGsGIwMm6a7NfXxkNSNtAiNYnoqkaR8PM8xszTOE94dJFv7xQrs18yBuHRnx5dKCm1u8u3CxDCC3wee3TpBYFvfl5w27NK6lW/ZAoKPYQQOMKGiWdwyAPXAhxa6Z1ANGZVBpbje3ReZay0uIKVSTJPuBALKaSqQ+l8aS8bppVcQ7NSyAJssCz0m+DbeiD+h/+1jzW5cY75bc4NKM1XTPwQPC0M9iS1lrnNUrIVL9I5zpfh7ADeQ6KRz5AnaqgJMACx2VLFYg6tnUW+vdzbxvLFRpoJlstsBra9Ja8hrPcdyBy02pmQFx7rDCOimaNlwNMMaQZ1IKsckO65BwXNDYrYLSg9EvRIy/flS+rRJ5+Cyoj0iG8yuCJBd0V2LcJH9QkRUyCY5htokbtqhgl/S272sc82aZ7TUGSSVKCPirzf56C6hx/XvbOH8m1qm/8qzWNxlQFTurdz2jpF9RgqAO0WoE3olQMPkZYa5JNqYOoJCaNW9gmlZ5Dn+hTyPEm5zplaj1AhEnacJ/5pFLoh/wgUnkGg6BQCKSjFboTqnLN/wuAC7TP9tgkXswkNYRoO+1s8iW2YjdI2TP9723AzbtswG+2xdxnbQPzR+4bPSfTlfQMh4zYO4+2gcxgHMz18u3Dhbz9tvAI='),
			this.addDataEntry(dt + 'card', 342, 146, 'Card',
				'7ZbZbsIwEEW/Jo+VHDsgeCzpokrdpPIDLpkQq04cOYZCv77eKAlmSUV560hIyZ0ZTziXQYlIWq7uJa2LJ5EBj8htRFIphHJX5SoFziOMWBaRmwhjpD8RvjuQjW0W1VRCpfo0YNewpHwBTpkyxUFLBUhwyUatuU9mtCnAtKKITJqC1kaXMNOzJjnjPBVcSFtKchumTEnxAa0M2HAHZOJTi7FpF5VqFSEbXn9jX2YQTjb3/olMfglSsRnl15zNK60pUZujazpj1XwilBLl5nmd9gi5QRMPt9LU9NzEA61Qfwy3VROPR8+A1UHEVvJ870GUoORal3yyTBWugiQedAFsXmzakqETaeOE+U/v1jF94U3bbyAJDHxbvKtjHupvokLeYxtd3jHpwbtkWcahP/JeRPFJongDr03U/9iRBE4VW0Ln/H2U/YhXwfRkjNauYjDudog8b0AFrvw8WC+jksCowJnjC/VuI1ioSlRwJtZuQwvyCIWMR2cy9sOuxt4/zzweXoD5IGB+nU4fXp61Fp+kv7MHe6kf+s/bWa7Exs4yxWe6tv6NawT/iWujjmdXCbqAacPDpp1emX/TQtN2Nu1PXNO325cUV95+h/kG'),
			this.addDataEntry(dt + 'card', 300, 176, 'Card',
				'7VbbbqMwEP0aHiv5Qmjz2NBtVKl7kZofcMMQrBqMjJsm+/XrW5oQhwZt07eOhITPzPGYcxhEQvN6M1esrX7KAkRCfyQ0V1Jqf1dvchAiIYgXCb1LCEHmSsj9QBa7LGqZgkaPIRBPWDPxCh5ZcC3AQBUo8MlOb0VIFqyrwFJRQmddxVqLK1iaXrOSC5FLIZUrpaULW6aVfIGDDLjwGxTyzYDY0mWjD4qQi4A/8b+2EUl363Aim1+D0nzJxK3gq8ZgWrZ265YtebOaSa1lvTuvxx6htNLgbA8tLOcOTwzCwjbCVc2CPKYHbAYldlDQdw6yBq22puSNF7ryFTQNQlfAV9WOdp15kHUeWL1z946Zm2DaaQNpZODT67P+yEPzJDrWe+qirzemI/SueVEIGC/5KEXJWUVJmsWKhpcdKRBM8zX09j+lcmjxR3LTmaCtr5hM+wxZlh3oyJX3g40yKo2Mipz5eKCeXUQD1cgGPilrn3AgMsanXtsd+L8qh3ZXmNx4TpAdZ18g+ySS/TZfPPz+ZTB81oCjUTgp/NBn72i+UhdH84Q/adx2yLgbFPtGL2Nb37OrFH2Badmwaeen5tu02LRpdnnXzHL/n+LLD39j/gE='),
			this.addDataEntry(dt + 'card', 300, 224, 'Card',
				'7VbbbqMwEP0aHiv5QlDz2NCLKnW3lZofcMMQrDUYGTdN9uvXtyYhhgb18rYjIcGZOR5zjgeR0Lze3inWVr9kASKhNwnNlZTa39XbHIRICOJFQq8TQpC5EnI7ksUui1qmoNFTCMQTNky8gkeWXAswUAUKfLLTOxGSBesqsFSU0EVXsdbiClam16LkQuRSSOVKaenClmkl/8BRBlz4BQr5ZkBs6bLRR0XIRcCf+V/biKTvz2FHNr8BpfmKiSvB143BtGzt0i1b8Wa9kFrL+n2/HnuA0kqDswO0tJxrPDMIC8sIV7UI8pgesB2V2EFB3zuQNWi1MyVvvNCVr6BpELoCvq4CjZBLD7LOA+s99+CYuQmmDRtIIwOfX1/0Rx6aN9Gx3nMXfb0xnaB3zYtCwHTJJylKzipK0mxAUX/YkQLBNN9Ab/0hlUOLJ8lNZ4J2vmI27zNkWXagI1f2G5tkVBoZFTnz8UC9uIgGqpENfFHWPuFIZDwbOLZ78LMqh3YXOAvnP8iOsx+QfRbJfpUv7x9/GwyfNeBkFAaFH/vsncxX6uJknvAXjduNGXeJYt/o99jW9+wiRT9gWjZu2vmp+W9abNo8+37XzOPhP8WXH//G/AM='),
			this.addDataEntry(dt + 'card', 342, 272, 'Card',
				'zVXbboMwDP2aPLaCBLo+j219mrRfSIchqAGjkLXw9wtJemGlaqXSqZaQkmM7ds7BCmFJ2a4Ur8UnpiAJeycsUYjarco2ASkJDYqUsDdCaWA+Qj8ueEPrDWquoNK3JFCXsOXyBxzigEZ30gON4HW/VPBtjnzNCikTlKisl2XWDN5ohRs48YC13iN4ijsDhmbj64HS0F7s2UK+4RVgCVp1JmRXpFq4CBb5RgUUufBp9MWDvHFAfsg9UmAWnoVxRti9jKytnTFSYQW33p9evT+NgpH770EFkutiC4MCY6T4Gl9YmNI02He0cBndcLs/ALOsAX3G6aHRm2iOrtOc8kZAHx64n8hyXrZ5PyzzvEzlXABX+hLTf2RZWLtTgWHCqR4jcoTLSdSYxWwgB1s+QI54CjnWiJuSq81TKBJGIwMyzXzM4nCgyPIRA7KYQhEFteyeQo5/HJCQxffrYbbHV9iFnz7Svw==')
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
				'rZRfT4MwEMA/TR+3sHZMXx3T+aCJiSY+N3BAY2lJ203mp7cthY0wHWaWkPTuen/6uwNEkqrZKlqXzzIDjsg9IomS0rS7qkmAc4QjliGyQRhH9kX44QfrwlujmioQZooDbh32lO+g1bwp2EtldY9UaBCtXZsDD3Zd0tptFaQ2w5qq9JV9OUUcWVEbJT8gkdyGIBshhbWsc8Z5p0KYgF9Wr+ROZOAqWTjXmqZMFE+Qu8rx0jlKYUL0BXHJOCuEFVJ7O7DR1qF6UAaaHwl4Vbj+FmQFRh3skU+WmTKcuGkpRSWwogxuJLChupWL3vXI024C0vN4yQjviGdGdekZeHwBbtUUbiTmRZXx+U77u05Bu/JrKhh8EUzH4BwXBZwatodB+GtgLS/D6vhYR1ZrmEjlLnaPmx9d+6nd5KxxzK/CNHQ4hK9tHrfy6XStxhA73WSIIf+LZLasPvmsgxbSz26HEWSeazCjJvS3mNSX+D+GuBn1yjYm96u3vAdmeGpnlr92Jh6gGfflTFtWf55iKx7/1i3c05/5Nw=='),
			
            this.addEntry(dt + 'chip', function()
		    {
				var bg = new mxCell('ANZ Bank', new mxGeometry(0, 0, 170, 32), 'shape=rect;arcSize=50;strokeColor=none;fillColor=#eeeeee;rounded=1;spacingLeft=24;fontSize=13;align=center;');
				bg.vertex = true;
				var part1 = new mxCell('A', new mxGeometry(0, 0, 32, 32), 'shape=ellipse;strokeColor=none;fillColor=#009587;fontColor=#ffffff;fontSize=14;');
				part1.geometry.relative = true;
				part1.vertex = true;
				bg.insert(part1);
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Chip with text and icon');
		    }),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'5Vldj5s6EP01qE8b2YYk5HE3u+1WaquqrdTHKzcMwY2DETibpL++HgNJCCQhG6iqXqTVwthjhjnnjD/iuNPl5l3Kk+ijCkA67pPjTlOldH633ExBSocRETjuo8MYMX8Oe3uildpWkvAUYt3GgeUOL1yuILfkhkxvZWEIeBYBdieO+5BFPEF7CjMz/kMopJwqqVLb1Q3thd10qhZQtsQqNj4Pxasg1bA5Ga41FbG+A7UEnW5Nl7UIdJT3cId+7haBmEeF28grAudZbpjvfPdfb26KBDQnw60lg5pY7l1yXU5UrL+KX2ihrnnmUsxjbM6jPc7ZlFF/+HAqZzjYQee39sLOCZ+JeP6lyIC3N31TCb65DKSIGeNMITNhfS8ySdsiwl6HCPNyWwqSa/EClfFvQcl7JWWXmznKbDBfBnKgVfLfD57eRFW3OTFVh22hwsEwfz5ImzeqZ41em7Xi/Z+VMGHtXn43YZXX342rI6gwzEDXsr77ilZADGtATNUyURlcJZdm2lc18jShTyO3kcIHamPksmByddwd6lJCqPcdPtinxzHrWR7D8W1Ab6sq6xTYURcKK9Nagbc+R5RYts73sDnfZ3RGm3Q26kRnpQZKmfk9oDHuAo0M4qCl2HYA3QJH6yJYfk1l6mDdFEH3CB1Ke4DHr8HzTd1QAA0AYK8zwJytgobZtSo4sdf1VdCO1WsVvHG6K5D1+wB2Ugc2hReTUkaeeWwEVUP5CFiezgpMhqSl9nbQp2oVB5YxtIYK8xpWma1Q8q+vneXi9xA1txt9jsmRPEc9oEhJF+VzlcHJteIRhCN7IfxZYnnwGIoNjt4OosllITVUzNJ2y7q6rI4HmbqXJlJGPoHM1P+D7qw/ujPi/wm+v3ZH3zXfW232W+z2+2J7fbP/WZqybkyhrfE6AowEYIFLpwvcP6bn9XP65Xn4z27fO5qZabkG65bk9TOAZ+Ew42ck5VKk9XvT/HOVYShrHmskJNFmYUZmEcwWOFaMUSG0JAOEWoQYtlphInhgGzFRScEKHQn8t0pmammQ2XNjYG6/4wAm6Xm/eJF3UKFNKg/yx1VSxvCJJxzdPmAmyArHXcRqfRDEGwxAigWULnO1C3cNb2w2ltw2G15A+mJAUnE2uIaoXhuFF6Z1JDR8NaREz7UpFMaGxBMzLu8L6mpcVZ4g8mkS55bnknp989ojpBti+5M+iF0/U2lXva84TCH26rygbCsOF2HwO0Hhzutjx007OQD5wU2dOXcAcgqXVx6M0PNbcTI4OqxoXP94dai6OpIcV1c/fZxI0hZnJSVWxlMkGfxVCP37ANVPSy7NWH8POuN/DR7zuP+lMe9++EPkbw=='),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'5Vpdb6M4FP01aJ4aGUMIeWzSznSl2dnRzkjzWLnBCWwAI3CaZH/92gaSgE3Ch2k1XaSqibGdm3POvb73BsNaRocvKUr8P4mHQ8N6NKxlSgjNX0WHJQ5DA4LAM6wHA0LA/gz4ueGuKe6CBKU4pm0WwHzBKwp3OB/JBzJ6DIsBD2U+5tOBYS0yHyV8PMUrtv9iHYThkoQkFVOttbj4NJqSLS7vxCRmaxbFR+GU4kOjuWKosPULJhGm6ZFN2Qce9fMZ1tTNl/k42PjFMscuDEdZPrA5rT1/e/aiAEANhiWBYTJb7i3QDRMS0x/Bv3zEtNh7FAabmN/Ora1jtoSmO100YcY3u5j8WVx8coJWQbz5u0DAPg/9JAn/5NKQwmZuZ4ozZtavAkmzLSOwHyPQzsdSHCIavOLK/kNYsntKNjpsuJtNNpEXTihJnl9QOkiqlhqY6oJj4YWTaf7+AjbbkVEzu6JWfP53EjCzTh9+N4eVj7+bVXcg63WGqYT66Vu0ImIqEbEkUUIy3Mld1LKv+sjj3Hx0LKWEL7wNgtsOk3vH3aVfhnhNzxO+incPMziye0xnw4g+Vr1MK7GODg8rYa3QK58RJZet8Z6q8b7iZ6bKzxwtflb6QOlm7ghszHSwkeHYa+lsJ4KG0NE6CJbfpnJ0QD1B0KqxY5oj0ONK9PwkAwIgIwCL6woxV6MgU7YUBefi6h4FxV6jRsGBx13BrDsGsXOZ2BS/MkgheEIxcyiJ5RqxKF0VnExBS987UZ+SXewJxZgSK9BWZJmtWHK7x84y+b1kzdLjnzNQc09nBBZNoCN87jLcmCvWKHTExenPEqGDh3Vw4Lu3o2h+25EUEbMcG5JXl9HxAqn7kFkKwTccZuT/IXc4ntwhcN9C730ret16b1Xst6j2x1K7XOx/D1lYZ0NrEeOpj7klGG956nRD+3V5dj/Tb5/Db1u+azqZzTIH0ytyuQfwFBiQrWMuZZlc1n+w2//sMm7KHsWUCxJQlpiBlY9XW75XzK3i1IIMc6qDNTeb7DgQyBM3OVBJoQrqB/zfLlmRiDFz1saEvfzFN2Cg5/PibT6BrAWoyMvf7pLShm8oQXzZV44E2PF9tzHZXxjxiRsQBltcLtmQk7l7/EmgESFxm+kCp6+MJBJnky5Ctdt4eDG09wOKfzBR8pV7FijYGBdesELhfSFdyrPKBiE3izgfeSqlN7aubQD0CNudjyFsuafSLnp3aKacC3Amcya6SxpGiC5wbsssmK6ePtfUqRyp7hj1t9m3HdKBEwAWrmjitjs2G4ruW6jPdJybWtoRffKLdtA4nXM+S9EesvS0h8x6hTOKPuUOxJJFebTihsQoktuxDMD6WaBoGpzjhNQ0qEf+F0IpiaS0ZTrVRJstkabUd1mrDtK3XPZTUfY/+4YN8AFFSYgnLAdog6o9CNX8POXb/sXnUg6GA8ZD2XpDmGHfspxtEyQZHqWX2YRP+2amonqEA/ONUzMT1mJJjQUtsQTKPYAe0f2gqoBOR1zPvn+OYyM51UTAkahRpIJuMwetZfxu1fagROEsYevjnYeKn/HzCN4jgFtte+lAEb+jwPNCPCReX6fPVQSg0eK1ll/d30/orny2/fY6l2tFX/wu8Uw/mNBNG7yh0t+k3OOX9qr7WFlwsxPiDtN6KW57FHFrKTNf0Gp79RmEJl765ijXE0gwqT0voPwJQtUu0fRU0KwalsZ4KEjxe7hE3K1c/j0Z+vgEyQVuI0FNTyi8Gzuzj0YPe3t+2Deffvks8H8=')
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
				'5ZhdU6MwFIZ/DZd1QigfvVSsvem6ndEZr2NJS2ZTwoSo7f76TUJAaMCtCnXWxXGmnHzAed5zThIcL97tFxzl6Q+WYOp4c8eLOWOi/LXbx5hSBwKSON61AyGQ/w686Wl1dSvIEceZOGUALAc8I/qES0tpKMSBGkOCihSr7sDxrooU5crO8VrOf7UhlMaMMq67eht9qW6Cs1+40YL1VU6QsBdpdOWNeTjmAu97HdAm8/YLzHZY8IPs8kISkRonotJJkGKyTc2waWhcQUVp2NZjX3nIHwZJNx7PwrNgbCvJQPBAJjfEgiUdUVyUS2SN6CUl20y27EiSUO1+jtYk2yr/A8WPZeKO/FaDIajuzWwKEMeFbH0wrp6MDH4MWWBsHFMkyDNuzf8ZjFML453kgqhmJ197K1+rh6QBtsQb0YTWCK0IqL82TNd9HXrPcmkJzk7Tey9N84gVI/LJEBzaolQj2GZTYGHRr1/sJEF8S5D5fi27KJ97hGjS9VuRDPtl+rpYHoj+bAz6gZ0OeP3EiTicWk8emRBs183dmK5Ml2u/IzX6Uui8GvnDaOTCMUQKLZEiAC/cvbTNL1fvLFfNxPnavJgOxDwcg3lkMV+honhhPPnoQvvGugHALIiif7UwQXcMAWaWAE4Yf7Qo1RUI/DUx6s3P99HH80fQpxL9rf16tUWnJMP1Vryip9bqjC3RozpqaJbWVn0k7mYAuAB+aEY1pZhG40kxyhbKde1VPJUnGwWjp2YdHZ5sZajSZcUKIghTGcVLFnWmLY/a62qHTApSnV6fq4rq6oqLQF9HC9pUxQl7yhJ9QtTxZDJ6wDTtyFL4ydDYt6c5VAE3StLah2wTKSh5RtlaooOA5UrT4r+PmbroaKWHLPbniyJ/lHpjf4uIL2/j+bJveW4i9zr2nX3LbW8gDFD93RYoexkIfVukKRxEpIkbtGWaVBMPK5P9rSP+eXs7j++/k07RiDpVcw8pk7x9/aZadm9+cv0D'),
			this.addDataEntry(dt + 'scrollable dialog persistent footer', 280, 345, 'Scrollable dialog with persistent footer button',
				'3Zjfb6owFMf/Gh5dShHER2XOF6/XZEv23EmF5lZqSjf1/vW3hYKYwuYcdbnDmMBpz2nP50t/4XjR9jDnaJf+YjGmjjdzvIgzJsq77SHClDoQkNjx7h0Igfw78KGj1C1KwQ5xnIlLHGDp8IboKy4tpSEXR6oNMcpTrKoDx5vmKdopO8drGX+6IZRGjDJeVPU2xaWqCc7+4EYJLq4yQMz20ujKB9045gIfOhMoTLr3c8y2WPCjrLInsUh1EmGZJEgxSVLt5g390ojy0pDUvice8kYjacfjGXjmjCWSDATPZPBADFgyEcVFpUTWiE4oSTJZsiVxTIv0d2hNskTlHyh+LBOP5K9yhqB61tEUII5zWfqsU70YGbwOWaBtHFMkyBs+i/8VjEMD46PkgmjBTnY7kd3qIKmBLfBGNKE1Xq0QqN85TNc9uT6xnbQEN6fpfZambmLFiGwZguO5KJUH22xyLAz6dccuEsQ3BJkd1rKKyrlDiCZd/+xNht0yfd+73BP9sQ36gTkc8PqVE3G8dD55YUKwbTt3bZrqKvd+y9DoGkK31cjvRyMX2hBpZIgUAnjnHqRtNll9crpqDpzvHRfDnpiPbDAPDeYrlOd7xuNrF9p31g0AxkEY/q8TE3RtCDA2BHBG0bWTUj0DgQ8HRr35+Tn6eL4FfSrR39uvV1t0SjJcb8UremqtztgCvaijRsHS2Kpb4q4dwB3wR9qrKcUwtCeFlS2U69qXoj41WZfieBbjRsIM/MCGMOaZNposo9miax5rLtBeywLdNS91rj09aPORLCO/ZWmHX1NFNz1wq/FSyVQF7lcm82wd/V4uZ9HTT9IptKhTFbtPmeTj6eNTWb35beof'),
			this.addDataEntry(dt + 'message dialog', 480, 480, 'Message dialog',
				'1Zhdc6IwFIZ/DZc6gSjqZau2N91OZ9qZvY4QIbuBMBCr7q/fhCQoBC1WmNnFcUZOvsj7nJNzxIHL5PCcoyz+wUJMHbh24DJnjKtfyWGJKXU8QEIHrhzPA+LreE8XWt2yFWQoxynvMsBTAz4R3WFlUYaCH6k2hKiIsewOHPhYxCiT9hwHYv7HLaF0ySjLy65wW16yG8/Zb3zWgstLTRCyvTC64kYvjnOODxc3UJr00z9jlmCeH0WXPQl5rHpM5mqTIMYkinnDiApliKqxJz3EDy1JuzzQkucV74UhwUWBInyTVnKbJED0gZIoFeaEhCEtJclQQNJIauJLTVnK38kfOdKF5l4vIUXLcSFaf+rtuw0KKUvxVQBIL0/xlndF4H0XgbLlmCJOPnFt/nuwTL7ptckhkpE2jpKQjg+VTEZLr004v7y6KgXblaoPOOrIHE/V/ZmO7sSW0dg6y6jXf2NEPFa1+AhOasuPZvUZ2HZbYG5hqHbRiczUIvPBLDZCQH7y+5fSEU++f6b9HMhPS0zooR8sExa/NSiGdGwI7iOiCfhgAAK+ReB9t/klj6ALGC5oa+KhHZI5kMAVaP8BARdMB0Aw6+N40lmjfkK5V4/2ljzQb1wcawO+YuRPe2E08odgNLcYPViQGgn8q2ShJadog+kbKwgnTCbaQKiK87MC4KXRgctTrMrLVndTL2wY5yypB6wHTiH6qNtXI2gHZZXFGhVbUF4tQd3JTWY3uonXkt36SW4m8RifMdP26jOLPuIacY6COCk17L/+uJXIwgbSE5FZo9qYDEHEBX0gyeiu+BdgDFj8uUYpgwMuhsDh2sXH+nXVtfJo/tNpnGHeejZ/OqtJVPUHrv21sg7Ve7JfaxHfElIDpEJTwi8aFPtIjeL29L5BdT9/HfEX'),
			this.addDataEntry(dt + 'dialog', 280, 273, 'Dialog',
				'7ZZRb9owEMc/TbQnKifpgD4WCmzSJk2j056t+JJYc+zINgns0+8cmxAI1VC77WmWIPbd/e+s+12kROmy2m80rcvPioGI0lWULrVS1u+q/RKEiBLCWZQ+RUlC8Bcl6xe8ceclNdUg7S2CxAsaKnbgLd8MoGGjVCHgncGtUBm1XEncGtANzzBw7WXGHkSQMWpKcElJlC5MSWtn15DhLRY5F2KphNJdaJp3y4VZrX7A0SOVBK9lqsVz7JRK2i3/6XLFD+E8yES65UQ1zbgsnlWNjskULW3JLWzR7LQt9vcU5ZK5ECp4IfEgIHe3bEBbnlHxGMzWJVuE/qAP9i/2uDOFBm9AVWD1AUNazmwZ+jz3HEgJvCiDLJml3kiNNxS99oQMN4HadYLpiOAnsD3BrqKoXY26djQZWNAVlzAge4f755I7dwVUmo60ZK5VqEMuh0rtLkaBUUvxYdWgFN6VQAPO3ZbdQ6pTZewX/uudlJj4bjRA2F97QXw6Jv7QrdcS12Aw9feAJe4tH45Q4luJJ68jHk+DUYPATjZwVuDaGIQaXxSXjurBR8zIuULluXHUL8amv9lNk3Q/mqSnj9vHzdfV6hZY6RhWsprN18klLPJbVuTK21hxxlz1/q3NkAXo4yXC1d7K71xwODsN2F5Dez9/G9lQetKPSKg+OSb+o6zfj1j/B/2PQc//Amc8nr4dfPjw0+IX'),
			this.addDataEntry(dt + 'fullscreen dialog', 358, 642, 'Fullscreen dialog',
				'7Vtdk+ooEP01eXQKQhLj43zel5mtqZ2p3cctVFTukGDF7FzdX78kgWgEvajgfFI1NZFAQvr0aU7aNkDX2fJHgeezBz4mLEC3AbouOC+bo2x5TRgLQkDHAboJwhCIvyC823EW1mfBHBckL20mhM2EV8z+JU1P07EoV0x2jPFiRqrhIEBXixmeV/0FGYnrX00oY9ec8aIeiiZ1q4aVBX8h6kzOczHnSt6KFCVZ7lxu3SXX+oPwjJTFSgz5RcflrBmB4rSZNiN0OpPTkkguHC+ajmk7d/304kAawGwMpBkDirVcInCQTTCj07z62Kxu20YA9AfJ1S4bTXhebgy+q1s1eI5HNJ/+KZ84Wnc987nogHLuk1xjta6CLOh/5G9pOWiLQHgcAmHU9BWE4ZK+ks71T0ElOtJFs+W0otXFNBuzi5LP/xni4iTXRGbDdCesJOsu4ubzhtmiRLcaPNRq8v6PnIpltTfvDcLO7Xv97hX4ZLIgpWb19imsgIg1IP4gv0QHea1MdAhFzK6/zZNBkqbKrYUji+4Q/J4iDR961cwKTzrC7FIyMqPjcbW8lqKMTMr1zPv6001yfu7E/dO8YNWloFPUExf0W2qg67uFMnZoa+zYbOw9DFRs88BAuc+2BBx4gKKvQfF0+detBoewWdnlDUS2vAH7aCNHXvGy5JmCu8Od9ETsjLEUajgmQMdRCYBTI2nSvXlvW1g4QTLVkJyR1aTg2U+e43KG8yAC0wxTdjESlj4ktBojrICb1G1n7KucJNlymsgYB3d6h9cAmTgJkCn0gOXAiT4pKM6nDcssNsdB3WyNnp4oXKCBbrEbtqmY1rLNA0Bq+RsI3TaSBeQ4IxbxE0E9fg7rZhM/hzJeavEzNMbPNSPTswuR1A3PIPKhPyE8kmmM5jqxNmOiWyMvFZNABAcamZBy+Y4IAU7sHsLUh931JME9H4l18txGe0Rn4g4Eb0yeviMQVR7CLYh6cuNDksdgd1fkSb2QR09f3BUGTWcgjmHTSer22YgTOQJw4IU4etrjrqBBKCaCB1w9XhUfgfjXtwE11kEFdfvAoIbA9D7mBlTkJxo6yWp4Fe3746P+TuxRpEMlKxQmkY/3KKinNyKZfQePD++JWzq1uql3H/D2PVCsTR5vweuHcnrO45tytu/Fnhh3bOriy2jCVq44tXuoJySeuU2A+1aEB8KXeIFPz0N8K8IzKkIvMl+Fvu/t6RhFGKl7ucVEz1nEH0URekH0nCLQD8vcFHN8EZZtiUBPJNPzG3aQfBkRGIVeVMSxKYgvY/c48eLveprhkrHeDV4dEYlGMzJ6GXJjeUurzDfDkYxQesULw0PCHvmC1l+rrKsH1aZ0v3V+Vy3T74o35IaFgGGnPMVNNiOiqc7txC8Wl93LKGaqugC3HqJnKh6F7SZ0JDqfSpyPcTEWh8/U6stj8RawW4RYwlXXZpz3FQyeuIkpEiMvEL3/oov3qyNi5KM4DelJDTtIDqoJlbRxS4WddWbm3ETqhBi9yIeqQMfWSHSIMcSjF9OW1lZs7sLlyErOxnf2aA/FhLep7extFSn5KG5BFvkHhZWYSecLowh8M4Q+P0AWBRR7Q9pbotP/bPAEVRWF+pFUM3zzN1T/Aw=='),
			this.addDataEntry(dt + 'dialog scrollable list', 280, 270, 'Dialog with scrollable list',
				'7Vhdb9sgFP01fmyFce24j43b5aFpF62T9kzjGxsNmwiTJtmvHxjy4eAkrlpLWxWkSObA5cI5B3QVL0iK1UiQef7EU2Be8OAFieBcmq9ilQBjHkY09YJ7D2Okfh7+dmTUr0fRnAgoZZcAbALeCFuAQQxQyTWzQJWTuf4UMFVLDme8lC/0j0b8WPcpYwlnXNSzg1ndFF5JwX/D3gjUTY/kJOVLHa86Nj8ICaujZ6ghe4AR8AKkWKspS5rK3J4jNudEOdAst2F4YEFSGSDbxu4oUR+WlXaGAoehZ16Cw1JKqhx0CDInrCkrVplW9jorUnYtSEr560JKXh7QGNr+HlmobnqpOZnSMvvJ53btZU4lvChUhy7V8rtJCsB6CiOvwCa8opLqXPfCUDLULNMpYeOD8YKmqT7HkDCaaYDBbH/+nYW384y2vyz9uE3tqG5dBcbnBW7T12ICGJH0DRrLt2luM0w4VYkx2uwnMhFr0w3D5gJ8NqtAOpbZbrOTi24cFyWEMVpJfnHSl3WSj3APVgodK41IuS4gvTxKX9hK4aAHK0WOlcaLklxsdMZGCN1GcUvts8X/O3vhXl6qgWOvSV7XTuiHUlS2lVEnis3BKScdLTaPlacHdti5zI82ee2udJUqoFK72Jiic93aQeK2ujWM36lx11o2dgT5VwX4XMLXjYCz9OOPXTGb7Srs407duoXk3XPyMHaEVDQdChi0CWifrHe+xejUE7qRdqp0AdFynT6iZTPgqLJRD8La1Ff+DWpk70dpHzlSf3+8yNyUuY/7u5E57kFl1d39uWOm7//38xc='),
			this.addDataEntry(dt + 'dialog scrollable list', 280, 112, 'Dialog with scrollable list',
				'7VTLboMwEPwajpEMbl7HFJKoUltVTX/AwgtYNRgZNyT9+q7BISEQKZfcagnJO7vDrmfAHg3zw1azMntTHKRH1x4NtVKm3eWHEKT0AiK4RyMvCAg+XrC5kfWbLCmZhsLcQwhawp7JH2iRSFQx0xxBrlmCL9m0JZU5SldSZay0Ww0x5p8TVZid+LWIv7CxkDJUUummmibNQrwyWn3DRQaaZTMZ46q2/KvXzV18QZo1C3EmRVogJsFO+VyVLBZFalkj2T1oI2ImVw42qkTUHR5zcLgpYAM59bagcjD6iCW14CZzIi5akUkGIs1ONN9py6oWSDvu2Q/cOEvG7aEDe8LVe7h+HViCB7i2gg61I2RBN/5ZrC+rQkQQqDNhYIeopdb4OfYUJSMK5oJz271TOkbFQJ+GcKP596ocjKvcJxx70YUD8xEDpk5/DZIZsYced8wU1/1DCRyqaz3xZ6TXfTK9MlYlSQVmYGt3irucfhr+iC+7cPUZ/Vvdt3r5QKuXD3Aaw/N13pZf3vZ/'),
			this.addDataEntry(dt + 'simple dialog', 280, 250, 'Simple dialog',
				'7ZZdb9sgFIZ/jS8XYRx77WWbftxs0rRW6jUxJzYqGAtwmuzX92DIp50qm7pIk0YUCd7DOeD3wR9JNlOrR8Pa+rvmIJPsPslmRmsXemo1AykTSgRPsruEUoL/hD6ciKZ9lLTMQOPOSaAhYclkB0F5AofCnJWvXYsdVpa6w1r9NOvWMk6zNWt910CJC90uhJQzLbXpo9mib6hbZ/Qr7EWgbz5SM67fUEx9um7ck/jlC+KGw3gvifQNdSZF1aAmYeFXtS0rRVP5IgUOl2CcKJm8ibOcbje148bJLunZB+++5KjgNXTGiiX8BBs2QaItWBBWJ63tpejrI2gFzqxxypvgro72XsVKNYiqjmk0jyKzQai2uTtS2ImwxsFlA3CdBdMwBcmUVIoJOSm1GmDjzNbAN05EhmpV+QM4qRSXE1/mkEiafxoRJTj3Wzk+L/n99deHYnBeGt34yZLNQf7QVjihfRUTvNxW/3YU365yFkU6TnGTkIeMdRgWcbjHeDqCePoJhKejhAn9z/cv8k0zcjHA+QAw4/yMRy5WEa2Fi0Occ//7FyBeX+4uLQYQ/+CebGVnx16WR6/Rl3g59FzX8o9do4eu0YFpaTE0baP9hmk43H3R9LGDD553'),
			this.addDataEntry(dt + 'simple dialog', 280, 250, 'Simple dialog',
				'7Zldj6IwFIZ/DZdO+BhBL0dm1k3WnTGZTfa6yhGaLdSU+rW/fltaUCyOJsrFEpqYlHN62uN5H9pYLS9M91OG1slPGgGxvDfLCxmlXPXSfQiEWK6NI8t7tVzXFh/L/XbB6xRee40YZPyWAFcFbBHZgLLME5qBMDGcxbzoygE5PxA9IE/QWnYZLMUSkxUmJKSEssLrrYom7Dln9A+ceKBo0pOgiO6E0ZHhNOOf+K+cUKSqnk+C7KLJoDVaiox+0bVwDIKjpQwkaAFkTnPMMc2EcSkqAGKWCSI4lgYCK5nvFhjHS0RetJnLGSe6DMIH+4ulLEy6jlOgKXB2EEN2OOKJLudIldtOAMeJDhtqDWyUK0NcxR6VER0tTrNQniHUe5M4EcoTkCG2KnShVLqPJWBPcRqRJ4YiTBcbzmWVTsvv+LeW375efaa+flXt2Zk/xVEkc76mTjVO4fRbl9ptAswv2q1iutfFbNCytDEgiOMt1KZv0levMKdYLOzaZT6+ijiox+BsArpa5cANPKo0byLm2SAmRITgnNOemk5Q45S790OxGRrYvOJ+p+kMM4HXAjO+wcwUZYcUoh6bbmBTnSYPxSYwsPmOsphueC6s8rDq6ekGPcGwBXpGBj2zTYZ6ZGrJjv3RyPyRVtn/O5S88qx5KEpjA6WPBTAhSw9TF/YfLwhagMaxDWrmCV3QvKemE9Q8lyfMY6lxDGoMXs5v2E5wCL7C4eKN26U7ujOdj/gU2DHIxaqlus6dGh5qAdfvzO6TVK82KOd5rIbmrWn48h6+zQwlRZ3OFfSaFNTHsfFC7xLM4VNYZehO7Bc1leyv3s1S2+oetEhCp3avmPWAi9IGLSirlx44vl1bvSWpzXvXjx+9zHWZxy3KPG5BZfF4/IdFDT/9A+Yf')
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
				'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'),
			this.addDataEntry(dt + 'full bleed divider compose email', 358, 642, 'Full-bleed dividers (Compose email)',
				'7Zldj6IwFIZ/DZca2gLi5eo4c7OTbHYm2ctNlQrMFEpKZ1b312/Lh4pFRS1jdnabmMjhlB7Ow9seioWmyeqB4yx6ZAGhFppZaMoZE+W/ZDUllFrQjgML3VkQ2vJnwfsDZ0Fx1s4wJ6no0gGWHd4xfSOlpTTkYk0rQ4DziCh320KTPMKZsnOykNefLGNKp4wyXriiZdGUm+DsldRnUpbKPpNqKMIFWR0MtzBVsT4QlhDB19LlVxyIqPRArl92i0gcRlU3z6kCx3lpCDd9t3cv/1QJaE8G0pIBZCxfkH1eTlgqnuLfygKQPMY0DlN1uox2P2dTCHx3cihn6mI7zvdFU84ZXsRp+L3KgLM1PbNMjVwHUsWs4uQkl2H9qDIJuhKBlxGBTmnjhGIRv5PG9a+h5Fz4yCarUMlsGCYBHQqW/ZxjftWjitoT0+ywrlQ4dMvjnbQ5np41cG7WqvG/sViGtRl8MIaN4Qej5hXYcpkToWV9cxedQLgaiClLMpaTs+TS/tg3NTIbg5mHWh/hHbVB+7RgSnUMdnVJyVJsHb4WR3cj2LM83NF1oNdNlRkF65lQWJ3WBl59jahZds63257vIzoDbTrzjOis1kAtM78HGiMTNHKSBh3FtgF0DY7Ok2B9N42lA5qZBNEeHQB6wONreCKyXnKWvLAUiwinlmOHCY7pcMESjdzRyVDCIEU7Aql9FlOTo9dSi3xsCeBeuZhV3Pw+sI2NVBE8xmmo/Dspyyta16T7VyoL2C1EDAnLbgoL9QCoDn+H0DO7tX72qot50f5WXYF6fjTLDWjcnt7mL4rPf3gG4fnjPuDp+wGPJM9xqNf0MjXi30YAnV7mPX0XotvKdMb7lF0043lfNzqcouD4RigMnD6KbmBkl2GOF69H34EOcbnw3Qgc35Kwh3vvK61lg6OjMrUrMWqWDX1sSgB9V+LguiN7xlmuV2+3JPT5AXXYXThVGNyMzuiz4ZGH248Npfvut4g/'),
			this.addDataEntry(dt + 'image based content divider', 358, 642, 'Image based content dividers',
				'3Vpdj6IwFP01PGpoC+I8qrMzyWYn2exuso+bKhWaKUIAZ2V//VIoKLY4KB9+YEzk0tLLOfdce1s0tPB2ryEO3DffJkxDXzS0CH0/zn95uwVhTIM6tTX0rEGop18NvtRcBdlVPcAh2cRNOsC8wwdmW5JbckMUJ0wYbBy5hDfXNTSPXBxwe0hW6f3na8rYwmd+mDVF6+zgzeLQfyfFlY2/SfvMxVAkjMmu1t3MJHx9Jb5H4jBJm/ylduzmLZA5zbu5hDqu6DYxhOM4yg1O2Xf/9OkPAYAaDCSBAVJfZkg/DxN/E/+k/7gFoPQcM+ps+OXc22PMLJN/6jDjNzto/JIdvHGAV3Tj/BAIGHvTLz/gIxeOCJ+5nyGJUrd+CyRBU0bgZYxAI7eFhOGYfpDK/duwZFwYst7O4TIbO57NxrEf/FnisFWoIjUw1Q6JUOHYzM8PYDMmMmrgXNTE+N99mrpVDj56gpXhR1b1Dv56HZFYQr18ikZEmBIRM7bcetFZalFHfU1akSP4QGxQl/WiZ0dq51TSFWYzIUaP2jZ3r1QnI+t4L6Jv2dmzBY91NTJ6lo1ptQuApKq+TgmfdKG8AugK74d58JB8EQ9544J32JQCU03BCUkClSQnnUiyYKRQ5LQHgqwuCIoIDleuEvVaalQ8tqGocQ4V05vqP4/eTQ5FVpUxoPdA2VSi7A0nEmvnJk317KGk5mTSA3o1r4K2KU/gZ00l9tQZUK9nqukc4akLIVAPO8oQX2bHif+pNmjtKrOcpJiHyuABYCqSVWFsg14R6HcMHyhcvg6A4O4BhIZ+TQAvrUtvB8CqgKFhDQmfXMneG3zHAh4YwE6KzJsS8MAAysXh1206J3nEiQ2aQAnZ3mY2oJMi7IYyowFk9HqMy05KpJvKjAMDKBcs9wbgcWYcGMBHq01MBAaEDz5ebTIwgI9XmwwM4KW1yRkr3uW6dbd7Nkmlw2fTFUPYWi5Fj4w+ljoVm3UXhPESr95VUVxGax0vF65IfxLY+rjYVDm1Rm0oArujbaOjFc8+do2a7N8VXKU9aRAp88zVGHp8guTSrZYgZUq7JjvWo9GTnu7fBsmbH74s8h8='),
			this.addDataEntry(dt + 'full bleed divider', 358, 642, 'Full-bleed dividers',
				'7Vtdk+IoFP01PraVgJ+Po07Py07V1HRX7eMWGkxYk5ABHNv99XshSWsktjEm3Y52umwFgdzcw4XDETp4Gr18EyQJvnOPhh38tYOngnOVfopepjQMO8hhXgfPOgg58OqgxyPfuuZbJyGCxqpKBZRW+E3CNU1z0gyptmGW4REZUF3c6eCJDEii8wVdQPuTJQvDKQ+5MEXx0ly6mBJ8RfNvYh5DnUl2KyoUfTlqrsnKbP1GeUSV2EKRDfNUkJbA/VFaLaDMD7Jqg15mOJFphv9ad/f08CFzQLkzsOUMF2z5gp2zfEJC5sc6mVp36CPHGY4Hk2M+WvJY7RV+NJcunJAFi/2f2RP3dlnPPIEMN6v7lNno5Gn2n066GNKCSkj9nXnSrYoIqocI6qV5goZEsd+00P4lKPVqdtnoxddh1vUjL+wqnvwzJ8KGB83weDS4qAvjcocVK2yz6Oz20/SeO3sD25vuud7M7v+DMzDr9eYPY1S4/cOw2AJfLiVVFhqvT1EJoL4F0CMFNLTxxKPirGAqD5LDiBoPRqPSDr4XAsg5HV5pLD3oYNEYswUJv2TRHDHP0wa/hndIl2pX8y+Tmg1Ry1HVH17WD7bF4GwU90ETgZkIuqTgpgWVleHvITyp6vd+ud/fCMfcV4VwHDQSjnkzeTSOWkBl2AQqAAoEV2Ahsu/+Y7CkNfKorBwgR4CqPIq6ZaNoM7A9DPrt4zZqAjcwQ8Ho9K6hVBmhfnsA5THbJkDj0wDVYsvwDTVXCqrHNxnC78vfXAc3MtWM3BZ87zqW82dkm1KMJKHw9F4XUs8Bhf+KRgmVykDDTDOC+IaQbBi4ADnr2GMRi5mJpkMMwbUau03AFH2CyV5nbyDCbDbhmKuEOyhNKw6Jwz477++IhE4OdskJV4pHeYgXWIpem9TtE+OTfQL1Sqa9gXNml6jK6V3XwnPKRWxAmlO61OYLLhdsDe6AhC84gNbtds+Bq0jV9r2cL6v28zrli6hjmJ/Gq//ucKFz4SqP4F4bo6drKw86qB2Iw3fFFNmYjs1125gOURuY2gJKDc4SEeGz+Gc6ZeqZ87vJyMHa5WSgpwPhwdw6mem/i5bxRwB6OQBnn3Lmnbp0Hr1ofKwgenySDagwamNh69qKBjALobnFJn2T0Jx+gxlewjvXExaBF5CASH/UJsacnzW0/bnsIu2t10QvbGniOTDrImCHmk/Q+F++vQ8uURecqyYTtsjhavNtrfEmqcQHQ9oOl2hE/7gWLnEMoY8hE5/KRaV+jUZt/DqCbOnicR3riUjwRM/rejqSC3C/vBO2cG1iBLLFiFRIis3NwTKiicOCR/AY5tahtvfXmlGlVaenlAwaEqhMRUlYKHdskfiExXciXdRFt6G5Kf/tvtkQLtEu7olu3KB0UbL340+mG9ekXVTZsPFJN6DxcStjla1d/OBiBTkh11IrzE1rSXwzSwUkXgEiCBp1VoyGcyK1iDEnC61c5EK8YPM7YSbo2nSMki0WM7GOJPhRI6rWYkW3Bkm+Ds1WG0f+WsMT3c0vJXUhu2Z1o2QLB7ojuvHBkLZDN25K3TiG0MfQjZtXN9xmhqrxgbMb6djYVjemARXmyeYhl5JHeiFsmAekYbS4DyZxbRoHtjWOp0Rof0AZaaxIpYrYM7qF/mgaWMV8cz9s4gbFC2yLF/ie2MQNihf4psSLq9p4geueNjnr/EI2ljVLJLaFCqdoRb5yubB/P7SyAsK2iFGjg88JrJJLWN0r3zuGS80d7PhtWux0UXEbeeku9rLDBw2dBRoW7t7KUSBc4UxIjhXUZImkV4XQ7QNU4XjIm0PaR6IzvDV4ILk7+psW3z8Z/D8='),
			this.addDataEntry(dt + 'inset divider', 358, 642, 'Inset dividers',
				'7Zvvb9o4GMf/Gl5SOXZCwktKt52mbapuk+7lyQVDohobOV4P7q8/5xck2HQG7FtaSFUJO3YSnk++j51vzABNV5tPAq/Tr3xO6AB9GKCp4FxWn1abKaF0AEE2H6CHAYRA/Q/gxyN7g3IvWGNBmLTpAKsOL5j+JFVNVZHLLa0r5jhPSdEcDNB9nuJ1US/ITB3/fpFROuWUi7IpWpRb0UwK/kyaPYwz1ee+PhURkmyOXm5ZVV/rJ8JXRIqtavJPNpdp1QJFSdUtJdkyrbuNwvrCcV5VLHd9999efagDYA4G0oIRqGuZIHBSTDDNlqwoVld3GCP4gMbJ6FiMFpzJVuOP5VY0XuNZxpZ/1t843Ff94GtVEdR9v9fXCJpy9m9RDJAqC5Kr0l91JANbIvA8IjCs6gShWGYvpHP8SyiFZ96yq82ykNndcjWnd5Kv/37C4lQ8VgFD5oB1O2xrdd5FVbkVznCkRzM4NZr1+R95pi5rd/LhGHZOP4y7R+CLRU6kRmP3LawARRqgSbH/BAmZpdEFhcZhPI6Nt3Xrxofg16KqFDRELe1SspD7Bl/K0kMMPUsmii+DvO0qzynUkQvVrQVZEBWmGcktKe9GFKu4R+a4v6K1JlYdrY2caK05TCO1xAOV2EkuFBlmy6J9L5AEwKAMN0RA2EWCPCBJXCDJCRazVAPSjn6bSg2qatxkQutsdQSR9XgVmMYrNxoajiL/Ihq7ISalGir+17xmTSjyBwiG/gE1GaFF6DNmxWHBIxHPGcvtgL02u3h1FhGE+iwClJuqL9hlM0wn9dxhlc3nVTLVZw8H8wsr+OdOJi7MmTXQJPABNHAiOVlO4G3k9qCmi6MP1s+g4ORBq3l27DwBBW5GrYN5ROCFyLlGQIfIz5zYEklA8XcpEesMiAxjFHKUAiNwAMhLDtTNia+4jMFnnrKcs16mwN/8POUmBQbNjeIWqBMfw5/iLnUx3r7idB/jkUgVbgimWND8pjmfmht7GeWcuBj+NHfpPP/ta043NH4I8sIL0f2BWU5ukvMmuZ3v7JaoEz/En+Tiq5echf3RMKFZy2dqxZyUm+ZABc5fOm0aEBA0j0Hth7DEACNxIg4EfIgD6sbGBItiXgHuCWNEylu685XuUHPjuyWqOxsTjaEKijx4TWXgsPMsjnI4fOHbcJmpEJf50g7DGW6H4a3Jye97Ld0O6INSv92OY0SuZ1AyLMWYPD2RIgjTVGS5JLe5oNfkGPt4h+xm6YY/2V295WFcupEVouOMcdHP1yzvQnAh9DIb6bffcfF7zbcvON3vmFAVMQi+EXozGH0KLvEywvXb7YBX73YYFntMmEw5K8LwXZIX0tPFBO9CdBHyMcoh3UXplejG1y46dO5yjxOWA+8U5NZw3HY6/EomoRuzcRh6oeDE9HjCs2eTBWxcl9jmcubiRHTkByF7J7i7QtC4QNG0yNfRgvq4qx8f6+mRboZo4BpWqme2zkmvCL1/QBa+xqsp7XfSid8bHlXc/36uat7+ed1/')
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
				'7VtRb5swEP41PKbCNgTymKRrN2mVpm3SHieWOISVxAjcNdmvn41tAhhSmpi2oaOqFB82XO67u+98EAvNN7vbNEjWd2SJYwt9sNA8JYSKT5vdHMexBe1oaaFrC0Kb/VvwpuUsyM/aSZDiLe2yAIoFf4L4AQuJEGR0H0vBMsjWmE+3LTTL1kHC5SlesOvPVlEcz0lM0nwqWuUHn0ZTco/VmS3ZsjUzeSucUrxrVTcXSV1vMdlgmu7ZlMdoSddiBnJ9sWyNo3Atl40dqXiQCUFYrD18e/ZBGqDZGEgzBmC6TJH9LJsEcRRu+VBoV7eRDX3/GrTZaEW2tDT5Jj/45CRYRNvwq/zGzkH0nSRMAOTab1JHW42jv3wIEBunOGOjH9KSoCsi8DREoCNkKY4DGv3Bleufg5JzostudiEPs6tws4yvKEl+/grSBngmHpp+OMuFUbPBqgv2MjqvXDEumdMZ69YEz7WmvP8XEjG1ipuPJrBy+5FXvQJZrTJMNTSKb9EJIPe8nNIcFzWU0HRy47y4TwM4Pg+GfTU2jJp9bCIuYrzSMeAG9x13bBdnlMFhV4O7TxocNHn9meaW+iiPVNa3e7C+p1mfkszitxqHtLBSCQtmLVpN0lz/OgG43ty5cevZfsTTObd4tAjiqeSbTbRcxp2TVAsg+8qCEjxuAzzPTvHN0TBy+wDE1wCZ4WCxPhGHOhG/Gg5QGcskELsqxr3iMjGRpjIcpAzLY4mqzBiSRMzmrl0bRD1mspGH+k9lwDYB0QZvH7qyucKsHziaiNwQHMipwAH6KKcAMAJHkIbR9qsosXildZcLLLGXOAhmhFKy4bkNVuRq55GLa/jNrvlfG9hMnSV5lLrp9ZqQfFTgGCzhgDdpQF4JzyQt0EtyBPp+/NPd7U8HIPvqdxKaw/1zXufVsFcYw2aPgG0IP64jir8xYuR3f2T31vmz6Ay0sqXaNssKtLx5LdU/XA37MCx0K8kENdcpgKeZ/GBywidSDiR0T99DgJZWRSt1N/qjcqM3WUMBvSMSaT6o3I4tjZKsIb0v8uNYx0N1LYDuOJP8qDlEZ+oGLVmi8168Ty6vkcfI7wPBDt0SHcAupA2m17B7DfV0tnYa6lrnzOBQ+vhVlka9xMqpbY9Kuk7ih6yP/bfwg9ZAKFz/WCg4DaFgqC3lVSOhlzLKSH+kvYyqkqYgoeYS6o1XUHWXuPCKSm/MyIoK9FJRHamddE9wWoqnLo8GhlhRjYdfUeltqQurqLz3XlEZaWB15ZFSVnnDlFHADT3fHwJrQL0FJlkDmmWNY4D/Z4ZD1pkMnhmg3ua7LGYQMfOOmUERwcsww4XuJoZHFXqPTFIF+r/BeGM08kT9Mgga0Rt+F0Yj574+dfE0YqSRONANhut6446sYZsJ055Y40W7kSZrhQqmZl+/a29GDwV1vRnZDfXnvBqpKNMsNq0U2fiipOOboUinlwSr9+BOiL1fweK+6UlNUTa14XLiExx4vPHGCurBP8Lp8u7YUw8zXxOhwQOEOrw5djSlvSY63tDgYcPDD4nE9PLvjP4B'),
			this.addDataEntry(dt + 'grid style', 358, 642, 'Grid Style',
				'7VvRb+IgHP5rTHYPW1oorT6qO/dyu1xul9zjBRVts1oayjy9v/7Atmql3Wgtuk27LBGEFr6Pj6/8wA4cLlYPDMf+I52SsAO/duCQUcrTT4vVkIRhB1jBtAPvOwBY4r8DRhXf2ptvrRgzEnGdCiCtsMThC0lz0oyEr8MsY4oTn8jiVgcOEh/HMp+Ribj/YBaE4ZCGlG2KwtnmksU4o88k/yaikagzyB5FGCeryuZusrK2PhC6IJytRZG/wZT7aQmIumk1nwRzP6vmOlnDcZJmzLd1d70XHzIAysGAChi2aEsfWrUwwWEwj2Qybd0hRuAe9rpuFUYzGvG9wqPNJQvHeBJE859Zj51d1i8aiww7q/uUtdHK08E/mbShSDOSiNTvDElblxHQjBHgpHmMhJgHS1K4/zEsOQ2H7GI1lzK7my+m4R2n8Z8xZnXp0QIMlgNWrLDO1HmH0vQenI6romnXRTN7/g8aiGZtH37bA4XH33rFO9DZLCFcYWPbCy2CkELQCC8pCzhJagmpXCBFumDP8Xpe6eDeG/4Sj7ekleroVgpF8htMcNjPlLwIplPZ4K20QzLju5rfNql7DxhWFPKOGwProjBb5dxtQ5QxIzMiYJqIgaJH/9ZwtHBH5bi/IsUcq4IU3VakmN8mV2LXACteG6wkBLOJrxCyj/4+KxlRaeFcj9rSqKBIe+60y+bOdgi7dZF5xrrtMMa5mJdOKiJthpA5gnK1miSopxDUx4xGImtAokgAX8viVNfSIczaXCKfSgPisrvg8IXPUR1vW+29+htqxd+6tgHabettYebc4gmXkBvQXq++gQEV53w9c6TcwMF0aCMTuNuq3sZjIns99FmQcBIlJLpq7syas6FrgnyN6IR50dkVIYnPrDo1EiLGrdQcjSLK6i3jrnozoLeeEZPTCK2cQG8V8ZPPrDc1ZNIPBUTA+k7ChF797dx628bk2qVdI2pyAr01CIt8dL2pgZF+xH0ayX4/cbIUb5VXzZ1Zc9Ay4nEaEZYTaM67PM2VRE5O/E65i1deBba5twlTA4YiJYN7+actsMsLlQA1VFJLU7UUdNq9ZLedAe/YJhwlh/nIDWkSktjf3zt5Y+NzhOwB0sa9QQzDUnmovaevKQdgghY1hnHjIuuLyEIIiWdCR6FJQMhPYw9N9VOfx/LDGUfOazlzh1XaYU4NQzzScSCQ1eALqnwhyxk5o9f4Utloy+DPxZfuYZqSwxoNJi8fR3P6omsi9Zy8CkL9LWGv/fGf7zg61sFMZpnQQ9PDFZdj7J6RN1k1SnADAcwdxPW6PWMOYm5Gci/BQdRF/m/Knj+gf9Rny0ZlL27G/ENd1b83/6iA8HL8A2qsyI/1j+2M1q5/rAsV3pqTnG47c5Jj4uAQbLo8LyhljCfPCiVVR/H2eWl4Hi8dO5Xqse4O1nKlAio7RNnSeWavqB8Tx5mhxvo+50rUDOJEXcOfk6HPT5C60q8kqHRKOyc73mejRyR3P19Ki+//uuk/'),
			this.addDataEntry(dt + 'grid style', 358, 642, 'Grid Style',
				'7Vtdb6M4FP01kWYfWoHNR3hs0sm87Eij3ZXmceQQJ6AajIynm+yvXxM+CjE0JrHbNClVpdixwZxzz73cizOB82T7jaEs+k5XmEzg1wmcM0p5+SnZzjEhE2DFqwl8nABgif8JWAx8a++/tTLEcMpVJoBywjMiv3HZU3bkfEeqjhXKI1wMtyZwlkcoK/oZDsX5Z+uYkDkllO2HwvX+KIZxRp9w/U1KUzFnVl0KM463g8vdd1Vr/YZpgjnbiSH/xiselSOgOy2nRTjeRNU0z6kWjvKyY9PMfbl78aECoB8MKIFhi7U8QGsUJojEm7Rolqs7xAg8wmDqDWG0pilvDV7sj2JwhsI43fxV3bHz0vUPzUSHXc39u1qjVbfj/4qmDUWb4Vy0flZI2qqMgNMYAU7ZxzBBPH7GnfOfw5Jzoskm200hs/tNsiL3nGa/loiNpUcJMNgPWHfCrlLnvVu2W3A6noymPRbN6vo/aCyW1Vz8LgCdy9/53TPQ9TrHXGKjuQslglyJoAV6pizmOB8lpH6BdOmCgeMHfq9xt8y/wOOYtEod3RVCKfiNQ0QeKiUn8WpVLLiRNsFr/jLzz33r0QeGFeX659nAritMrZx7OkSZMbzGAqZQGIoa/U3AUcLd7cf9FSnWWHWk6GmRYn2aWolTA6z4OljJMWJhJBHSRr/NSkVUObjWo7I0BihS9p12n+/UQ9id55pnbKqHMc6FX3pTESkz5JojqFarSYICiaAHxGgqumY4TQXwo0KcHLVUCLP2h+inRQDixe2Cwwc+R454zbRLjW+ulvg2tQ3QblvHhVlzi0JeQG5Ae8H4AAZknOt85ky5gQN3aLsmcLdlvS2XuLjrecTinOM0x+kozZ2jsFefMm9Yczb0TJCvUJ0wLzp7oCRxzaqTKyHCbgvN0TSlTH8a1zDyKbABgQVGoppCLeUUgc0eiz9lgQ0UTK5ZYHKN5C01ZdLgPT0G31TB9OKupU7BMcFZ1M5zjxSpFq49c5XlcEKZwpJ5GF1/VZQDMEGLXKj44rnWH6LLdV1xTehINAkIuY7wIKtDU8A4gcf+QvqZfq1m7nCKHubkgsV3uowFsgp8QZkv13IWzuK2+FJ98WHLtYcTnFeE0g39rRpERkbys8t3vn77r6tDjnXgySwDegAKdYLbDuzQNuGHgFwn+AIBrCOI50+DjxdBSmO68ghSC6TF3E/Knj5e/Hg3tlTjR8/+hguLH0MQ3lD8GJGRk7gnA2l7rO47OFulnHlOANnWvACr9vHtHGXa82pOk2eCvolksWcjw2cs7+IeGMFdS5KeoJgov7RuJ+knvrm+rN0Fb/EqtGd7gQilYVUidiy8RUlG8H1IE5VofmHPXreQvfdsN/iBWU5TRFQYu7Dnr0vP33v2DnzGk46VO64JK4dyTi5M7te1OKrxmwI+nqOCcnr/QZPE92JLeQ+8nI5rd1KNWvQ6qV1nwjEEnakee3dMPFpBLan6EoVPYx6BBxJHZeOGRxPD7suk3gy+75lY0+Z3v3N1I3vf4Yj8XcyMs7w3hX83hq6fIIWk/lWX9p7s+NdGj2i+/NatHN7+Kdz/'),
			this.addDataEntry(dt + 'two line grid list', 358, 642, 'Two-line grid list',
				'7VvRcto4FP0aP8LYMtjmEUjTzm7SySSd6ey+7KhYYE1ki8oiQL++kiUDjgxriA2YqTtt0LVkyffcc3S5VSx3HK8+MziPHmmIiOV+stwxo5SrT/FqjAixgI1Dy72zALDFXwvc77nrZHftOWQo4VUGADXgDZIFUhZlSPmaaEMI0wjJ7rbljtIIzqWdoYl4/miKCRlTQlnW1bWzS3bjjL6i/E5CEzFmpKdCjKPV3uVmJr3Wz4jGiLO16LLEIY9UD7cfqGERwrNID/N6euEwVYbZZuz27cUH7YByZ7iGMxyxlqFrH+UTSPAskU21uuN8NKUJ3+k8zS7ZeQ4nOJk96zfubU3f6FwYHD32Ra/Rztv4l2w6rmgzlIrWd+1Jpyoi4DREQE/ZGCKQ4zdUeP5HUOqdGLLxaiZp1p3FIelyOv/vB2QfClW33DHFAWvNwm5ftXfc1vNMrznHek3P/0SxWNZm8s4AFKbv+MUn0Ok0Rdzw+uYtKgHRN4AYMbpM0VFsKWdBkTIgu0ojeCfGgW3y5z673pOlI9kgwcUTSIaarjEOQ7ngDX8JmvLtyIesdeeDhmnT9z8WAOsi+2oF3KuDeblbC7gXpC67k4Nc2d/9cn8f4J9Txj+vFv7l3MjpFzSAhl8HGjFkM5w8Ky5KSj5mBu34rUERp2jTlOgAk7GjO/lnH73FSkK61MsyOa0sX3JUatyoHH9QAnng1kK5wGkA5MAAWSIB7Aec8rQ+vBW8vYItzzUkvMsIc/QilFA+cCkedyBVeS+sXD77varu5ib9rcrKprdtjijnNM7fpyDh3oHMisqeXMIC+vti8MRkyD8txnynoWRoYMTHMOERTeSi7hlCMUwsIJ5i/4sSI1zEi/IjwS3uhhlWezfSXYydZl3umy7XX3w+ymrXa4DVjn1p7c7Jfe3ivTqwfbdOzB3HZCvhiCVqpY2quWbsucU8uGYxVzS8IjV3zHLMF9EjooskTJWO3yOCV+LndwminC4Jxb/dbrcBdQ/OoO6VMGibvJuFpAblvSVp+OaLGAgqa/mxPDunlptlqDuYTGpX8fJt+zpz8uBCMr6nEPd/8eUNmpJxszL2iBmMhOlx8hVhoqT8CS7kqK94Rduam1dyfdvUu5YyV1X1bmsifmtyblbTPhEBEqMJnjSr6ZKv15uaX0rTvWvT9JJKnAyO1UqJ+VC8PZQDntEbfpOf2pmOV/F72wTdLJI1KOhtS8f7nn8D+g3MitqTLJT/ScbPLdyDKxNuYBbdXha6KD6Csnjyl3j5BuT6LPl3FW+3TK5zdf6Tf1fKv29Ev82S2bMlo9SD8TxznT1qVs2vukB+ITHfF4yXE3Oz6jZilL6SdSJz8KzvC4dMF8v/FqPlettbHq+EQNsE3iyPPciVp1b+3xljGCMGFf9JTiDRnGxA8X4u5BFZ4UR3kF27ph2Yc6N8QGepHTQUXRLKYvktbTvKm8mf/ywSmM8qXkRNrG6doD9zAteImSHlZde7MHHztp7BMYWkJMWIeEwKW05dBzw3O47jgcKe4xj7jRAjMwT79YRgZ9DE4amTz7IdcWxxo9D14rIfhbLzhL2gHhR6jaBQyxm2H3DyakCyq9uHT2AffdIQ7KmRbAgDjBzNzNB6JQlaTWd//cLsjRz9LTmXZgCXYyVG4nmKrgqh2weoQs3roKRdEh3/1uARze2v9Kjuu7/x8xs='),
			this.addDataEntry(dt + 'two line grid list', 358, 642, 'Two-line grid list',
				'7Zttc6I6FMc/jS/bIQmCvlS0u/fOdm+n7cy+3EGNklkgTshtdT/9hoegkGARsGuZ4nRajgkP55f/OeGQDpAT7L4wd+vd0xX2B2g+QA6jlKd/BTsH+/4AGmQ1QLMBhIb4GcC7im9B8q2xdRkOeZ0OMO3w4vr/49SSGiK+9zPDyo08HDc3Bmgaee42tjO8FMefronvO9SnLGmK1skWN+OM/sLym5CGos80OxVmHO8qLzcxZdf6BdMAc7YXTV7JintpCzQcpd08TDZe1s0yswt3o9Swyfse7l78kTlA7wykOAOIa5kg4yyfuD7ZhPFuenVlH4Gxbc1glY/WNORah27dJQk3j9kdmwfTM90KA8j6PmXXaMh98jveBUjsMxyJvR+ZJ0FdIrAZEWimNoZ9l5MXXDh+G0pmwyEb7DaxzG43wcq/5XT7c+GyVkMV6R1T7LDPVHg7TPeP3GZaqtfAuV7Lzv9Aibis/OQ3Y1g4/Y1dPAJdryPMFa/nd1ELxLBd7NCP/6JYIBhbd+8/dgEw2mHYFzXQqdstxe1P2GVLT9geMN0K18cx33KDbeIl48F3lzhqoJHAZRsSPqa0Ymj3iUE0s2riy8NXKaxNk48mRJXC3NBojn7YMJGcS75u2LK7CFtRSrrsfeFSK9lKCDIqaWPpQVjXg5begyciGtBpadRJRIOlgDa+gLJGXSB6oWSJaxM6tneLqXYaAkCTvFvGP5mGbKNITcbVTrGNu1EW5yLyRDUjWw7tXRDpJgrdyOoGFc9+EV1J6scp62E+F7+N2T+Tbwot4crjifRS+BEzNYvcJZtm4hvTIEvXn2QHCMhq5eNSujE7Ty37QoeCwsYqQLMlQAlMHqdbYkAh9jh35t+fn/oCayfVhsRWkEAv+KnP9c5/358nTg8Bijhs9w+gWou4pwsST+5L+E5XZKaz+FOV1ETfFX3NOMoB4OM112BdUM5pcJijy2Sa7n1LOs2AdTBNsw6z0YnBpI6J1PJVgurwUQ/YuukpsjoZBgANLzEM1GKH4CEMDg1DyqLiox4a2wjl/lIl/uoRjp8Endj8KuY+bxecjrnWFrrHA79A82zNg4raSrXCdWzbzmJzhV/iMR6o5ZNPhTdReJ4INI82tibuX7ni1fLOZLHA8Y06HiMRx2GEw6vXfT2Vnz2R1vG8bpWrZZ9PlTdRef50LHRn1gv/Vy50tdp07ya3+i/1woj2ReN2/zO5WoD61HgXmfwtzX+45A7VQtiUEc5dYftKfd4TyY97n9ahWh+7nNjfL7ea0Br1IbdKGv3AUxkWK3B9vLCoFrs+MK4cj2UasJ6a7G5i3YXo1Fhw83HoVIqpgpZGTNdNq8aqHElL9CTbCFeBqVqLcwH3q3OCoead57BlEJPvPOWL/vyttJzBd0tCreQoJGoswqEMV68WrFhuU4/Q6RcrsPjqHmgyjQaRvMc2K2UaL5U5Y2GZkWzNC9SnY786nLVrja76DVQ3q2EW7vKXgqSwMqyCS8PFMLCi3JDHHViO+5qqsami6mpdZvFN5UWWZdZZD/NWBvibhHoPCKlVgEpA2pD2N+nYfcMjdg//bpE2P/5vjD8=')
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
		var s2 = "dashed=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;align=center;shape=mxgraph.gmdl.";
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
				'7Vtdk+IoFP01PraVgJ+Po07Py07V1HRX7eMWGkxYk5ABHNv99XshSWsktjEm3Y52umwFgdzcw4XDETp4Gr18EyQJvnOPhh38tYOngnOVfopepjQMO8hhXgfPOgg58OqgxyPfuuZbJyGCxqpKBZRW+E3CNU1z0gyptmGW4REZUF3c6eCJDEii8wVdQPuTJQvDKQ+5MEXx0ly6mBJ8RfNvYh5DnUl2KyoUfTlqrsnKbP1GeUSV2EKRDfNUkJbA/VFaLaDMD7Jqg15mOJFphv9ad/f08CFzQLkzsOUMF2z5gp2zfEJC5sc6mVp36CPHGY4Hk2M+WvJY7RV+NJcunJAFi/2f2RP3dlnPPIEMN6v7lNno5Gn2n066GNKCSkj9nXnSrYoIqocI6qV5goZEsd+00P4lKPVqdtnoxddh1vUjL+wqnvwzJ8KGB83weDS4qAvjcocVK2yz6Oz20/SeO3sD25vuud7M7v+DMzDr9eYPY1S4/cOw2AJfLiVVFhqvT1EJoL4F0CMFNLTxxKPirGAqD5LDiBoPRqPSDr4XAsg5HV5pLD3oYNEYswUJv2TRHDHP0wa/hndIl2pX8y+Tmg1Ry1HVH17WD7bF4GwU90ETgZkIuqTgpgWVleHvITyp6vd+ud/fCMfcV4VwHDQSjnkzeTSOWkBl2AQqAAoEV2Ahsu/+Y7CkNfKorBwgR4CqPIq6ZaNoM7A9DPrt4zZqAjcwQ8Ho9K6hVBmhfnsA5THbJkDj0wDVYsvwDTVXCqrHNxnC78vfXAc3MtWM3BZ87zqW82dkm1KMJKHw9F4XUs8Bhf+KRgmVykDDTDOC+IaQbBi4ADnr2GMRi5mJpkMMwbUau03AFH2CyV5nbyDCbDbhmKuEOyhNKw6Jwz477++IhE4OdskJV4pHeYgXWIpem9TtE+OTfQL1Sqa9gXNml6jK6V3XwnPKRWxAmlO61OYLLhdsDe6AhC84gNbtds+Bq0jV9r2cL6v28zrli6hjmJ/Gq//ucKFz4SqP4F4bo6drKw86qB2Iw3fFFNmYjs1125gOURuY2gJKDc4SEeGz+Gc6ZeqZ87vJyMHa5WSgpwPhwdw6mem/i5bxRwB6OQBnn3Lmnbp0Hr1ofKwgenySDagwamNh69qKBjALobnFJn2T0Jx+gxlewjvXExaBF5CASH/UJsacnzW0/bnsIu2t10QvbGniOTDrImCHmk/Q+F++vQ8uURecqyYTtsjhavNtrfEmqcQHQ9oOl2hE/7gWLnEMoY8hE5/KRaV+jUZt/DqCbOnicR3riUjwRM/rejqSC3C/vBO2cG1iBLLFiFRIis3NwTKiicOCR/AY5tahtvfXmlGlVaenlAwaEqhMRUlYKHdskfiExXciXdRFt6G5Kf/tvtkQLtEu7olu3KB0UbL340+mG9ekXVTZsPFJN6DxcStjla1d/OBiBTkh11IrzE1rSXwzSwUkXgEiCBp1VoyGcyK1iDEnC61c5EK8YPM7YSbo2nSMki0WM7GOJPhRI6rWYkW3Bkm+Ds1WG0f+WsMT3c0vJXUhu2Z1o2QLB7ojuvHBkLZDN25K3TiG0MfQjZtXN9xmhqrxgbMb6djYVjemARXmyeYhl5JHeiFsmAekYbS4DyZxbRoHtjWOp0Rof0AZaaxIpYrYM7qF/mgaWMV8cz9s4gbFC2yLF/ie2MQNihf4psSLq9p4geueNjnr/EI2ljVLJLaFCqdoRb5yubB/P7SyAsK2iFGjg88JrJJLWN0r3zuGS80d7PhtWux0UXEbeeku9rLDBw2dBRoW7t7KUSBc4UxIjhXUZImkV4XQ7QNU4XjIm0PaR6IzvDV4ILk7+psW3z8Z/D8='),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7Vtdb9owFP01PLZK7ISER0q7TdM6VWulPU4uXEhUYyPH7WC/fs4XJHVoDdgdGqSqhI3tOOfkXDsnlx4ezZefBVkkt3wCtIdvengkOJflp/lyBJT2kJdOevi6h5Cn/nvo05Zv/eJbb0EEMGnSAZUdXgh9hrKmrMjkilYVE5IlkDf3evgqS8girxcwVuNfTVNKR5xyUTTF0+LIm0nBn6D+hnGm+lxVpwIhYbl1ukVVNdfPwOcgxUo1+Z1OZFK2wGFcdksgnSVVt35QTZxkZcVs3Xdz9epDBUA3GFgDw1dzGWJvJ0wITWcsL5aze40RusaDuL8NoylnstH4U3HkjRdknLLZj+qKg03VA1+oCr/qe1/N0avL6Z+86GNVFpCp0s8KSd+UEbQfIygo6wRQItMXaI1/CEvBnrfsfDnLZXY5m0/opeSLX49E7EqPEWC4G7B2h1WlzsuwLDfgDPo6mv6uaFbnv+Opmtb65BcD1Dr9RdQegU+nGUiNjfVVGBEUHhZTunXRZgkPgmgQffg9HUaHsbBqS8Mq6n0bslgImIKCaQyZIRPrkG+Ee9iN+xtiqLFqiaFvRQz1MLUWYgesRDZYyYCIcaIR0kS/yUpFVNm4lgY6kCLj6OV3RS87hF30Q/eMxXYYk1KtzR8qImOGQncE1Wp1SdBAI+grYfmo3h2Ip5Rlh682+qrS3EsF+j7NKw5Vn1OXjgkdVpvAeTqZ5NNY7wopTOVm8/atKF1Hxurcd+EKrSxcse+AT9+zojhZ7OZM1Hattg/9G1PEB7svWVgnoB7Z8pLlOyHEt0HIcwamhMRe/ncgIcbhD3csUNhS/Au9V/y4CIC+/tB+SwoMvvKEZZydA6CrAOjXN4pdQnXj4ZgE52/B/IQUp3sOdyAV3MgbEUGzs+Zcam7gZJHb16X4IM0FJ6853dB4EPDCc9F9ISyDs+ScSW5tQdpl1IoZ4k5y/ZOXnIH3UXNC04bJ1MAcikOzn3zrXu2yJgJ59QNL8xks7iAjtiIO7DkRh25rDInI9xXeFTAGUp7Dnatwh2vwrTKKdF9jqHGoQJFtHlAHD2vHYisPr9/91byMFcRFvDQLgXuYHR3+/M6v/gzNDuSCpeM2O7YxcjqLUs1HU0aPj5CDMEpEmkk47wWdBsfIxdvKjlyLY5LdO5uOU5Cdbnmo+zsXHWeMi/NLFmeCC5CT3chx+x3o5P2OjgSOIVWIIe870LPB6FJwsZMV7rjdDnTybkdHpseQyYSzHIZ7CS9wTiVwJ7oQO1nldBflqEQXn7ro8L7JHjskh64VZNdwXLU6vCeTwI7ZeBE4YcGK6fFIxk9dFnBnUmKTlz0zE8t75y0nuJ0e2Jmd2JVOaim3Omrrx0VqNdbNEI24mivVM11kcFQM/f8EGfgab4a0f8lO9L/Ro4qbn1KVzZu/tPoL'),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7Vttb9sqGP01+dgKg9/yMU33ommbqnXS/XhFkyexVcdYNu2S++svfiG1i92RBLposatKAYONz/F5wAeYkPlm+ymnWfSNLSGZkA8TMs8Z4/WvzXYOSTLBKF5OyO0EYyT+J/jjwFmnOosymkPKdSrgusIzTZ6gzqkzCr5LmowlLSIoi6MJuSkimpX5OSzE9W9WcZLMWcLyqihZVUdZjOfsEeSZlKWizk1zK8g5bAebW2U1bf0EbAM834kiv+Ilj+oSxAvrahHE66ip5rtNw2lRZ6z3dV+eXvxoAOgHgyhgOKItM4IOwoQm8Totk3XrXmOEb8k09IcwWrGUtwp/rI6ycEYXcbr+0Tyx+5L1k2Uiw2nq3jdtRDId/1cmHSLSORQi9U+DpKPLCD6OEezWeTkklMfP0Ln+KSy5R76ym+26lNn1erNMrjnL/n2g+aH0aAFG+gHrVtg16rz26nQLTtdX0XQORbO5/x2LRbP2N7+a4s7tr4LuFdhqVQBX2Ng/hRZB3mkxpV8XXZbI1A2mwbu/015wGgu7rjSMou6bkEWWwwoETAsoNJnYh3wt3L1+3N8Qg8SqIwbfiBjkZaQWQgusBCZYKYDmi0ghpI1+m5WGqLqwlAY+kSLt6OX0RS8zhF35nn3GQjOMcS765ncVkTZDnj2CpFptEjRVCPpC0/Kq6A7yxzgtTu9t1F6lPZZy1XEaqg6RX1IXL2gyawaBm3i5LJuxHxUmsOIvg7evVeo20FbnsR2XZ6TjCh0LfDrIiOJ4NZrTUdutGD74H3QRnx7eZRGVAHllw12WY4UQxwQhTwXoEhKi8u9EQrTDH+npoIih+OehV/zYCICO+tH+jVYYfGFRWrB0DIC2AqAjXxSzhKrGwzkJzhnA/IIUp3oOd8AF3BjNaZ4Uo+Zsam5qpZM71qV4J825F6851dD4mcMzK0X3maYFjJKzJrm9BWmWUSNmiD3J+RcvOQ3vQ3KSxC2TqYU5VIdiPznGvdqtJAIj+cHS/gYLe8gIjYiDICviUG2NGc3LcQW6gTQFzsdwZyvcEQm+UUax6mvMFA4FKLzLA+7hYe9YDPLweu5P8rIQEFfxUi8EHmF29PjzB0/9aZod2AZL5212DDFyOZ2S5KMto4cHKEGYR3lccBjHglaDY2BjtrJnrcU5ye43g45LkJ1qeYj3uxQdS1OWj5Ms1gTnYiujkfP2O/DF+x09CzhmiUAMo++QjAajTcGFVnq483Y78MW7HT0rPWYpj1hawnDP4RnGpQT2ROcRK72c6qKclejCSxcd0Vjs8aas2hbj4OrziC7Zr4kxj1G1Fx2/b8UzOtFglEw4QdihQoJmlgnV+PgBKxGuIoWQxqQaDEhNBJKS6sQjx38V8rzjneAahzdDVi8xHj6QF+0NA6o38RmSbFJafz7dZNWDoRXA8oEuHkdcB7oCbOP1Vg2Ge7koc+ShlwcH2RgHE9VIuC/xxYg9qXMaIxV1Bc/GHBN5h50Z++Gr2dm+XafC78aorpmZvivXyhDIyE6NqkPR3RHQ5uXIbQHk7VXn6Bp31+b3bg3o28thaGNT0Lm7lX1NROOLXnIlasZZAWfF0N9P0AHrF4Y+Lv4YO8HfRo9Ivuxjrou3tzn/Dw=='),
			this.addDataEntry(dt + 'item list', 152, 631, 'Item list',
				'7Zldb9sgFIZ/jS8nGWMn8WXjrt2kbZrWi13T+NhGwyYCmo/9+mGb5qPgKlvKLiocRYIDB/D7oBwOiXDR7u4FWTdfeQkswh8jXAjO1VhqdwUwFiUxLSN8GyVJrL9RcjfRiobWeE0EdOoSh2R02BD2BKNlNEi1Z8YgG7LuiwJWesilVIL/goIzLoZ2DMOjWyrK2Im9Gp7eoyEl32oj0hUzHwgFu8k1Dyaz4HvgLSix1122tFSN6ZGZhTZA68a4zbAZi8jRUB98jxLoglHBrQi2FPnBH7nili76BXo9+lehK8JuGK073dLSsuy7LOWarGhXa1N8rH2Bql8smvV68U490N/9cCjTdQFS136al7xYrOTfxMqy0SaAEUU3cDb+NQKml28pRjt4dUv9X0lQ/JeSmCm+c6pnTuK9UTY+9+BVJUFZEh4WdpGqmaXqjaCEvbddmS7eBkHmAcHMQlAQRh8FDRCcEFCMPVCYOyi0GgIJFNwUMuSBwsKmwFu66gGQTgYUbhR57gFF7kDRSc5IwODGkKRzDxieDw9nHISkm/DDNIEh9xGkEXJgeBIUhDZ+g22A4YSBUx+xGtnp5a3gujWJH0KYmGSR+4jYyE5sDyxA0CrAcMJIsY+YjewkWQ8g6nCKncKw8BKz7az6E7AN9EoP4UJbAw9ngo29BG87xf7cagVVoOCmsPASte0U29L/1Uvhjg/Xei/ug5fD50phzx1OZE4dIl95nWfm+vB8pDSiz99g5+vq8Y5/7H76F8Af'),
			this.addDataEntry(dt + 'list style', 358, 642, 'List Style',
				'7Vtbj5s4GP01ecwI21ySx4RMKlWtVG232scVA06CSmIEnjbZX782lwSwIQRsRh0N0UixYxv4js/5LjAz5B7PnxIvPnwlAY5m6HmG3IQQmn87nl0cRTNohMEMbWYQGuxvBrctv4LsVyP2EnyifSbAfMIvL3rFeU/ekdJLVHQEXnrAfLgxQ+v04MW8P8E+W3+9C6PIJRFJsqFolx18GE3IT1z+ciInNmddnAonFJ9bLzfrKq71EyZHTJMLG/I7DOghH4GsRT7tgMP9oZhmm8WFe2nesb/Ovd09+1IYQG4MJBgDsGtZIeMhm3hRuD/xZn51TRsZSwetnttstCMnWhm8zQ4+OPb88LT/q7hj89b1N4lZByjmfi+u0Sjb4X+8CRBrJzhlrX8KS4K+iMBhiEAz70tw5NHwF66tPwYlc+CWPZ73nGZP+2MQPVES//viJY/C08tgSG6w+oRLwc4nK29XzGnaojXBo9Yszv+NhOyyriefL2Ht9HOnvgLZ7VJMBTSud9ELIGucpsh50URpsXFXk+9pAO1xMFzq3FBqdlsFL+IE7zCzk4/TvlAsTMs2+hreumv40jY1u480+7m+TImCoQEFR0DhK7/BbRgxizbxYJaidaHm137PCeSKP+eSzq0d+l60KnzOMQwCvriEF6VbivCO3tb6krU2DlQHoBpvICeOrQOyhQripNhL/IPAmSpBqsQpuJQPLmEaC0J9QgUSIPMoajg1d5B+Ui1VIMTdy6Si1g6HzLUoggOZ+uEAhoDHlkQBTkSFG+3os4P1E65XlN8VNProW1MZKRfNuoLakhi5Ib12djRiayA9/1BBHRiKWJYSQQWWlg0C7hO23AxsZhinuOd+AKsN7K+T921rGqJpy76x0caixkSAtFh6aAJfj/qiV1EZqzI40E+Blmy+mHFNfjqSISALBxUlQ07t7FpyISDWFL4dCCVvqZRVzXNEzbsuJJfQ+3FkPUzVnZPZaoQQGpYO+MVixWfvxDpYRMMmG9AoR3RmBcAUYVpa/NOVAxQ4rAml5MhXEcCBOjMF0FIHuQcoGim/JaBa8OxR2xjm2K5wqrLtdJ5tqcPQSqoZuywqFY3tbt1nd1yRD3QH/X1cm7TSsVDj2sq4oPRtQEvwIRY7BoAUnnakgw9CUHIFrxm7j2LOm+TOjWSt9AVqQRLLG26CPYpbhasIOurI9ZCw69OfKjD2EM/V6YEyZzht3dccycrSJTlaWChWRzbEfz3ym1YdZF4h7o4qJaC3RpX9QNeeTyuCGJV0UwoxFAsuA4Q2IL6IqAkX1taU6eyt7Dww+VvKkehK9mSFMTUesVH7n+sIWqBY9vgeM60NGDL4g4zTk9G2daCspOSSVjaGmMtvlxtmFw2kbHu/4h2TUqzA5MXqDz5OzUdTS4Cr5oWQtlRxveEfLVRsyUS6Mkb4Z1PxgepJFFYekFas/pIdgtVBn8KnToooYoitowgteTXkRxwRL+C3XlSjDWZgNiIMsIba9Icy3sN9oSMzlLyMMkAZX/OtMqUy2o8ro75aGmg8JtKijGKR5keKWYfrHXHifRByakJaUEser+RFFj/fE1MScqGGkM4fQ0g0tOIy5Imt2kjlUpswEV/mpg6+oB7vkdzny4vn/5Sx4lavbsFlIFvyvdPxaAi++9ceUI8ayb3npG+J0PsHSKyKtAIklbS3RMd5b/Cw5u1fvvLh1f8I+x8='),
			this.addDataEntry(dt + 'avatar text icon', 358, 642, 'Avatar with text and icon',
				'7Vxdj+I2FP01PDKK43zxODCwUtuVVtuq+1hlgyHRhBgF7xb662sn9gzBDngTm68haKSJsR3nnNx7j29sBnCy2n4q43X6Gc9RPoDTAZyUGJP6v9V2gvJ84DrZfABfBq7r0L+BO2v5FlTfOuu4RAXRaeDWDX7G+Q9Ul9QFG7LLecE83qSIVXcGcLxJ4zUrL1FC+x8vsjyf4ByXVVW4qA5WjZT4FYlvClzQNmN+KVQStG0dblXEx/oJ4RUi5Y5W+Tebk7SuAf2obpaibJnyZoHHBx5v6oLlW9v3u6f/cADUYEAJDEDH8gydX8IkzrNlwU7r0R1i5LhR9ALaMFrgguxVnlUHq7yOk6xYfuV37L0X/YXXtADwtn/yMTriPPuPnQJIz0u0oWffOJJAlxG3GyOuV5eVKI9J9hM1+u/DktfxkV1tl8zMnparef5E8Pqf73GpoGcUwudpr0cYqgFrNthx63zy6/M9OL1ARhP8Kpr8+l9wRof1dvHhyG1cfhg2e8CLxQYRiY23u9AiyO/nU9R2ccASfB7NvLM/08AN+tGwa9qGUdgDE3axLtECUZwStNGlIvL8wNEF3j8JvMCmgXtP2LfNbgQLjgUWQomFz+wGZ1lOET3kgyJFmo6ajf1UEKg9/pC5dIZ2lsT5M485q2w+Z50r7EKEpRwtyHtff1RnL6FrjkAz0UBtOIENyiIThrNBcZmkks3sG8i+4XBbqisLmvqS0GywRwlQRRQzNjUMoX2jGplgiIWXszq1djpUocUQHdCzTwdwJD5mOJ+jUvZwvQI9Lzrpyw69IGEOsuktA4UePnCzQXUc6GigvH5X59lRdvi+EecJfCsPAzhtnIJ42jJbb5CmEYKIxz1D2HqODK0o66ssoobVAWgF6a6T9abCy3/IXpC5vHEYhEH3mARaZu68xdtE58jEB6ikn6GJT9i4upV5D5DzB19STPC5vOK+fwtl/+ZUR6u7PK0Pm/LT9lwrMOP0XMe3QbWchPgtLmgBVSq0seM6osZRtQ88maaRzz7HtD3nYYwJwSvWi0SOa3MGAFryG6cIhT1drSDUCp8aOYtuQWzsso9BbM8XxUY2gDaSpVhUatNO/vm4mNcJY8oMRmQmjAkNIOIYsCI05CRGB5KyYoGP2IMkQCazyXQyVej0XpZzkTnxwSRMxAKzJMlpi68oydaKNNNDbpxPboRWDFJOgNRyg1nq3euN6P70hitnUC6jN05je9t6w9XITlxUb9RPwsfWG4KTm9IbLZZzt3pDsTriGy5fH2LjcmIDQiuxqS23wV6U3bvYaFu8cdNi40qSGxrY3rjYuPbkxok3lR9DbNxgckNvSdk9iQ2NNRmClzwrZH9FIZ8G7NMzkvMGYla/Ey7JkQ0jUr3Vd9rh1V3vqFj9oF5N9HjXfj3v2j0rvgvKaYO/44SOEzN9lhFqCWXMn66HJr+IJvcCGxIOymkMrsmd+9fksCVFcsuaHGqkPLppcheMgpm2stDA9rY1OZTTFnrusSH35jjRFuT7HHRcSwOPqxGttTQqNWJIp48aVx9aoc3ILo/zqvQ2W7pblQ7lxMLvGUlSVFQ3sKo2tD20yMW0iG9lGSKUsxz8ZeRH0CId9z9ctRbRyIh00yKz0WQKXgxie+NaxMxOkxQhO3tv6wfhQ8sOIztNziw7rmk30Dlkh6exeKL3BlMhGMxuMN21caIMGl5PwxGWIvoxy4KRlRXf4+RVZRJv3qyNl44zK+/UcgtXw8fd9jYF8UsJfcL9JRm6f4I0UhZHXdol2QnvjR56+v5zLHX1/V9r+R8='),
			this.addDataEntry(dt + 'three line list', 358, 642, 'Three-line list',
				'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'),
			this.addDataEntry(dt + 'single line item avatar', 358, 642, 'Single-line item with avatar',
				'7Vtdj5s4FP01PGaEMQHymGR2WlVtNWor7ePKCU5AdTACz9f++rX5CsSmhYk9zQ5hNFLs2GDuuef45nKx4Prw/CFDafSFhphY8C8LrjNKWfnp8LzGhFiOHYcWvLUcx+b/lnPX8y0ovrVTlOGEDZnglBMeEXnAZU/ZkbMXUnWEKI+wGG5bcJVHKBX9Gd7y8692MSFrSmhWDIW74hDDWEZ/4vqbhCZ8zqq6FM4Yfu5dbtFVrfUDpgfMshc+5CkOWVSOgPOgnBbheB9V0zy3WjjKy459M/d49/xDZQC1MaBkDMDXsoT2KJsgEu8T0SxXd2oj2/YX3qrPRjuasNbgu+IQg1O0jZP9t+qO3WPXD5ryDlDN/V6t0a7b8b+iCSBvZzjnrb8rS4KhiDivQ8Rxy74ME8TiR9w5/zkoua902cPzXtDsZn8IyQ2j6T8blJ3lqlBtmO6El4qFN/Oy3TKb68lWA2OtVl3/nsZ8Wc3FZwunc/mZ3z0D3e1yzCSrN3cxCIi5BMRX/MQ7thFioxijZsIpbRZeECi9uOXnDvg9h0rCzAQjBMDxFpFlRdlDHIZiwQ2HCd6x48zPRevWdwxTZ+6f5wQvXQZqBd3Twb40wzvMzbTF+WD43cC1h9p9rrb7L7hY26rDRU8LF+vT1FQMDKDi60AlxyjbRhIgbeu3UamAKgfXfBxMjR6IBosnUImnHsBm0DWPWCAh9g1vcbEMpX5yWzLFnn6idV5xSIoFvFP5C07iBfDm8YFraxG5ABgAZ/F7Oo3dwqqut7Vx3XemjYFrwsjAlqy83GywuK91lMU5w0mOk1fo2EOOewO7k20lsMUf7ydog8k9zWMW03bwXkcIn0++74sUeiMKBSHbXPaGesJi9NZWE00n+Xq2turHpmY/ATo2NyGqzkCvcG9X3nJ9JiLDdzIFccGZEWCzky26AC1M4DMghzAptVwYsbKcnFgSbgPH/opJTq86eeIDoMcJ3rNQasmMmBPKPkimo5RyxmTSStkkOvRaWU5RfEHFbX2iUXKVSpmX49Ml/3up1JIwGSOVm1D8nQvJdKRSzo9MWiphvXfotbKc6LjHjEsd/wmOMpJfxVJmZnDJYglMiKUjJ2ouSyx7IJmMWDoDMiSTEksfmrCynOf4keFHKtTyI7rmKhVe0FPMcRlaaSSwVNSQXJRW9kEyHa0ckCSpMSFx6wlny+S4ON5cHYGeJ2Zu/Qxfr13l3MY9V8eYPuRW+Ugzl+x8fabZgxA08bxtSOnGlKIE1zeiL3JmYZXFjCERJVAysDBqQjGCN70Y4Zrb6BBxDk2kgRVFHN9REmaCiMsQHeTtaOpMvOjMhhEmwgGZjdoR+Mw4zRVIg6CuL1W5BZ8e0icNZFRG6ECCZK6oi5trqourf1Y32SYzoGip90jJg1xbKkoZ1/6df0RrdN1i6TK98DQs+UOli0EXIROVi1DOgwzDZ1S1tzi0b2i9rFFH83q2t5lrBAUtiYYN2v5UsaR5kacPl9ey59fiZt84A+ijKtXW9NqE36WPibgEjkhAHPecy0Ho/QN0bpXGn0THf2/w8ObxbchyePtlyf8A'),
			this.addDataEntry(dt + 'two line item list', 358, 642, 'Two-line item list',
				'7Vpbb5s6HP80PKbCQIA8NtnWHWnnqNqONu1pcsABqw7mYCdL9umPbUwImLSkhUbrgtQmvsGf38XXWO5ivbsrYJ7+TWNELPe95S4KSnn5bb1bIEIsx8ax5b6zHMcWf5bz4UQpUKV2DguU8T4NnLLBFpINKnPKDMb3RGfEkKVIVrctd85SmMv8AkXi/vMVJmRBCS1UVXelLlmNF/QBVSUZzUSbuX4UKjjanQxXZelY7xBdI17sRZWfOOZpWcOdhmWzFOEk1c18TwcOWZmRHNrWby++aAC6wXANMICI5da1z8IEEpxkMllG18bItoOZPz+F0Ypm/KjyB3XJyjmMcJZ81m/s1Vn/0lxkAN32i47RrtL4l0wCV6QLxETqm0YS9GXEeR4jjlfmFYhAjreocf+XsOQ9U7LrXSJtdpOsY3LDaf5jCYsXSdXtBqbZYK9deDMt00eweb6JGjgXNf38e4pFWIeHT2ZO4/GToHkHuloxxA3UD2/Ri4ipQcQXxLmQJDvLL90+aJtm5odhp4aPVO6Apx1U2mUi/SDpxREkt9qwaxzHMuCDgwla8brlJ5V6FzgjG2cavEwC+6b/BqXcH8J7eYFWSMAUIdabfi/07L64T7txf8SJFVYNJ/qDOLG6TWXEcARWAoOVO5ShAhKDHAEb7xgZWp7x1WUoH/htG4WtUQe8+ijj2YOYJQQj0BIatNwXVCgbyVdPKad96PE7BvYOWl4XdXcY1IE3BuwzA/ZFCrNEor6nm0J83FGaSBbmEo3zKfH6UdIy1UxdHcMOl1ZqDU+/L6XBGJQC25xqpPRnzSjjkG/Maccf5iejyTDgAwP8703UbSz/bTHDS+UkaSMbCaj2cjRXJIn/G4YUFAKJq8lexvN0FJ577AVU8zmC1TStOXcT+CN1vTquYCBcA38MXM1thY9iPKIb+eSMcrwSQuWYZr36r+t0TT59lPkaMHcW/mnSI+ThgnId4pOKmQZl/n8bWhVMmOLsVlQAXr6rC0VGdKCvzqx6r6MsP5Gft4Sowa4lljIE8VZlFGVdQ0NPr8eiFEUPSyrInqd8TbQMDG/XMlMllWSc1nJNr+AIXCJyTxmWwVr1bljVMX9qlZ9afD/akWulu47Rt4Ow5ZtgOGWDrn2bUVaL7jgdfcfGDd1k8cX0rbtDOYlYI8agnKtfxf3Wxe1V++3DitvcovqKYyRnpEyK/HK9+JHKtzoiQT25Sv0PkPpsOobUzX2/v7It5uiSMxVGq4mKQjtFmUIzQngrWJXRH0K8yv6Ny37qj3HsBMx91X6qOeu8SV6DL4/2jQZPLpbCQRZLE2+MMwdgbrM+w7tLGD10mfXwQ4JTvJgm7sVLqZ2TZ7b2TXWo+chhUbVMHOPYNmg8fZRTW8fcSzWIq7gSLXHOOnd6LsbQ2yfI3G89SVBnl3ZJdoK3Ro9I1r/GKqsf/1jrfw=='),
			this.addDataEntry(dt + 'three line list icon', 358, 642, 'Three-line list with icon',
				'7Vpdb6M4FP01eUyEgUD6mKTTaqWZUTXd1T6uHLgBVIMZ4zTJ/vq1DYQPk5a00Gqyg9Qm/jbn3HN9bWdirePDPcNp+I36QCbWl4m1ZpTy/Ft8WAMhE9OI/Il1OzFNQ/xNzLszpUiVGilmkPA+Dcy8wTMmO8hz8oyMH0mR4eMsBFndmFirLMSpzGfgif5X24iQNSWUqarWVj2yGmf0CcqShCaizaoYChiHw9npqqxirvdAY+DsKKrsI5+HeQ1rvsibhRAFYdHMsYuJ4yzPCE5tq7cXXwoAusGwNDCQmMvSMi7CBJMoSGQyn10bI3eF7pbmOYy2NOG1ynfqkZVT7EVJ8KN4Y7vK+pOmIgMVbR+LORplOvpXJpEl0gwykfq7QBL1ZcR8GyOmnecxIJhHz9Do/z0s2W802fgQSJnNgtgnM07TfzaYvctUrW5gmg2OhQpn8zxdg812dNTQpagV4z/QSEzrNPj0xmwMP3WbPdDtNgOuoX56i15EzDUiHoFzYZLZRXrp1kFTNDdr010ZnTZcs3ITva6gXC5TqQdJb+RhsiwEG0e+Lyd8UjCBLa9aflWpW9ccWThz930mcGzqb1DKnSG0lzLYgoDJg6wn/ad1pRfu827cX1BiiVVDic4gSiy7KYW4GIEVdwhWMsDMCzVC6ujXWSmIyiuXeuwtjTMU9XadqMt1DkPY1LLHZ2yhMfZXBkzkeMJ7MUp0DyrQ5B1resvbOerRfBZy2g5w0YoX0IfHB7YxiJtboBHoudHoWQusQI0rRMCBCSD7UOR0hGUd1Hws8tYwyCN7DOiR0RVViAweQqEPjQeDwDPITjhVryWcUuTJOjhNM9UUy5SHE/F/I7vx6T4hFPvCJfZg0e7HYkuLN+rpiDO4VGArHpF63IcRh0eRLcfYC8+sx/2/sLW45hjWgjRrecBZtqesF7HXLE8TzccAXD8w+AE/dxED9fIl9MaWytUs3YmQAmeyTKV3WataW7BVg/7L34iqdM6o8tc0CHuMHQHSD0008sp4k0S1mLHGCajnw3FFw+Bqlf0Mi6t+zHEPCTBMLtHG/zo0tMbxgPqxx3fKo63wJTyiiYg3xD5E2oTEyCElMw3KnJ87WhZMM8XZUlRAdnqoClW0U9JXZZYerJblBPJTzULCG0snizd0JwfdpT7mkJW+toiIlDcOcCwL8jluWNlPES39UQuTykoCm/xd8pqaJb6+y/RC8J42VJjMKuQxKYxJ8wiVsWr7y45NKMEbIA80iyQBk+rktXTxX1vl5w56XlwSCr1YprZKoEVLfe5w+hhxo9s6mbAWo7gx/cToke4S/9NUstxxOs1FUclBGTxOjjyKYSa+3mKOZcchZkGXRGJ8zBuT429pXL807HH2LvqxnTJO7Pv5iwbAP281kVOJseKcKGNXswqpWlwyjwEkjVn+FsGVi2DujCIC/SS0n9VccHlkqGfwKPbYaPBqTLsYJKad2mMcRyP9wPMN2t1g76n3/UGdlzdeIuS2c/YWwZiVN5QvXSR03fwMdAfrNkYf5QrW1E9LNeJKrkTLKM06N+CfxtD1E6QfUJ4lqNOlfSY77rXRI5LVT6vy6vVfXv0H'),
			this.addDataEntry(dt + 'three line list avatar icon', 358, 642, 'Three-line list with avatar and icons',
				'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'),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'tVRNc4MgEP01HJMxUtPk2Jg2l3QmMz30TGRVJiAO0NT01xeEmC/T8ZA64wi777HLewjCqWhWitTlu6TAEX5FOFVSGj8STQqcozhiFOEliuPIvih+u5OdtNmoJgoqM4QQe8Ke8C/wkTWrwAEMCPvRwCEzQD1MmwMPMEp0CW6RCOGFLknt4spi7TRnnKeSS9VCcd4+DmaU3MExU0lbCC/2oAzLCF+TLfCN1MwwWdm0YJS6YgvCWeECHHJzhn8J4Q6Xy8p8sB/XxyRx1WqSsapYt7Tlc2xDYbN2BWjuCtaGglorkAKMOljIN6Om9AiczDytBFaUgZZMfYxoPy866kl+OwgO9LuBb9wYprtoCneCxoWgfJyVkO22srkn+JU70Ww+T3AH/gzbHCxX3C/XIZy+ceIpZ/JNetQ7xhRwYtgeLsr1SRoqbiSzjcTRsb9gQqg+ml8uIPNcg7lxpGt7kElPjzBJgNakgBuPzn+XK6Om7fNwoy4Jf9gWbpL/sG2EH++bnZ6uUQ8/v2V/AQ=='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'tZRBb8IgFMc/DUdNhdVtx1k3Ly4x2WFnLK8tEUoD6Oo+/aBg1VkXD46kaXn8Hw/+PwoimWwXmjbVu2IgEHlFJNNK2fAl2wyEQDjhDJE5wjhxD8JvV0Yn3WjSUA21vSUBh4QdFVsIkSWvwQssSPfa1gYE5BZYEBq7F1HIqKnAT5MgMjMVbXxcO63rFlyITAmlOykpuuZlVqsNHEZq5UqR2Q605TkVS7oGsVKGW65qNyw5Y77YjApe+oCAwp7oX2K41xWqth/8269jkvpqDc15XS67tPkjdqG4XTcDtFct60LRrwUoCVbvneSLM1sFBUmfQloFvKxiWjoNMWpCv+xTjwDcR2QwzINc8LjNd9mW/gyNS8nEOK8g36xVe2G4QzHt2i9EEUQQf8Zt3mwXHrZrH8/fOA0pJ/ZNBtw7xDQIavkOzsoNWRorrhR3C8HJYX0RQqw+ej6fQBWFAXtBpF/2TZAe7gFJgjG0hCFG/e/y6zfq2d0X1HnCH9jiXfIf2Ebk/txc93iRBvnpPfsD'),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'rVTRboIwFP2aPmqwlU0fJ26+uMRkD3uu9AKNhZJSHe7r19KCOmEhcRACPffc3ss5N0UkyuuNomX2LhkIRF4RiZSU2n3ldQRCIBxwhsgaYRyYB+G3geisiQYlVVDoMQnYJZyoOIJDtrwAS9CQm1cFAmINzNEqfRaexmiVgd0kQGRVZbS0uDJcs0y4EJEUUjVUkjSXpWklD9BGCmkKkdUJlOYxFVu6B7GTFddcFiacc8ZssRUVPLWAgERf8V883PESWegP/m37mIW2WkljXqTbJm39jA3kf9bsAPWgYA3k1dqAzEGrs6F8caYzxyDhwqVlwNPMp4VPDqOVW6dd6kV+8+Ed6HeD3LkxTve8Tu0ETdOciemxAjUk9i9nFoG9xwqD+4U5+zmbhi7lSqh5cK9TiykQVPMT3JTrE89X3EluGsFB25+X21ef+DnvdpBJUoG+E7/re5Qf8//wI84gPuxlPdKTYLFchqQjf3o1R4/vgEu3CX94NuuZ7RZ70LMJ+WXa8nHPzPJyWjr69WH6Aw=='),
			this.addDataEntry(dt + 'line item primary checkbox', 358, 56, 'Line item with primary checkbox',
				'rVTRboIwFP2aPmqQinOPEzdfXGKyhz1XeoHGQklbHe7r19KCTmQhcSWE9txze8s5N0U4LuqNJFX+LihwhF8RjqUQ2s2KOgbOURgwivAahWFgXhS+DURnTTSoiIRSj0kIXcKJ8CM4ZMtKsAQNhfkcSwUcEg3UEZU+c0+kROVgtwkQXqmcVBaXhmuWKeM8FlzIhorTZlialuIAbaQUphRenUBqlhC+JXvgO6GYZqI04YJRaoutCGeZBTik+or/4uGOl4pSf7Bve45ZZKtVJGFltm3S1k+hgfzvmh2gHpSsgbxeGxAFaHk2lC9Gde4YOFq6tBxYlvu0aOEwotw661IvBpiJ9+C+H7jnxzjdizqzPTTNCsqnRwVySOwbZ5aBfcYKE94X5uw7bRq5lCuh5kFfpxaTwIlmJ/hV7p54vuJOMHOQMGjP5+X21Se+07sdRJoq0D3xu3OP8mP+H34kOSSHvah7nhgDFs24McZ75cifXs3R7Tvg0u+EPzyb3entFnvQswm+Me35cc/M8nJfOvr1dfoD'),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'rVTLboMwEPwajonADkl7LJDkkkqRcujZhQVWNRgZNyH9+trYeTSPCimxhGTP7njXM8YejatuKVlTvosMuEfnHo2lEMrOqi4Gzj3iY+bRxCPE159HFneiQR/1GyahVkMIxBK2jH+DRT5wtECLtmrPHZqxtgTD8T0atSVrDC4h1UWiHDmPBReyT6V5P0yakuILDpFa1JoTbUEqTBlfsU/ga9GiQlHrcIVZZopFjGNhAA65Ost/c/AxLxe12uCP6SMITbWGpVgXq56WzIiG3Nn0DtDd1aeHnDhLEBUoudcpO8xUaTNo+GJpJWBROlo4tRhr7bo4Uk9q64kT/Lb49Er8YbpXXWEuzLioMj7eYY73xL5wZtqPocKQ28Ls3bUah5ZyJhSZXOt0OJMEzhRu4U+5W+K5imuBuhHiH/pzcrvqo+BiB5HnLagr8Y99D/Jj8gw/2h2qtDQXuW36/yPJsTOUyEY2iilDMrd+kGv+/DUJZw+69pfwj4d0esND/ykejsLgwkT/cRP18vRa2vTzx/QX'),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'rVRdb4IwFP01PGqgHTofBzhfXGLiw54rXKBZoaR0ivv165f4gS4krglJe889vZdz2no4rrqVIE35wTNgHl56OBacSzuruhgY85BPMw8nHkK++jz0/gANDOo3REAtxxCQJewJ+wYbidRMqvqlRVp5ZA7JSFuC5vkejtqSNDouIFWFopwyFnPGhUnFuRk6TQr+BSek5rXiRHsQkqaErckO2Ia3VFJeK7iiWaaLRYTRQgcY5PIi/82F+7yc13JLf3QfQairNSSldbE2tGSOVMj9n9oBuocamZATaAW8AimOKuVAMyWDycDhq6WVQIvS0cKZjZHWroueelZcTZzo9w3AAwPG6V51hT4006LK2HTXe3aruPJiZkaPfLqfGi0Oui/O0R2vaWgpF2IF/lCrwOkngBFJ93BV7p6AruKGU9UI8l1/J4arPllcb8DzvAU50L9ve5QlL/9hSXugMtV+kLYxVyTJaacpkUW2kkhN4neuiTJtZ8bwYvnLRRLOn7TumvCHkXg2NNI9KM8aOQlvnDwdmmesVMvz02nTL1/WXw=='),
			this.addDataEntry(dt + 'item list', 358, 56, 'Item list',
				'jVNBbsMgEHwNx0YOyEmvtdPmkkqReuix2oa1jYqNBSR1+vqCwY6buFKQkGB2h11mgLC87rYa2upVcZSEPROWa6VsWNVdjlISmghO2IZQmrhJ6Ms/0WUfTVrQ2Nh7CDQQTiCPGJANWHDI0UCJIWjsWcYgB1OhpyaEZaaC1uMaD65WVggpcyWV7lNZ0Q+fZrX6wiHSqMZxshNqKw4gd/CJcq+MsEI1LlwLzn2xDKQoPSCxsJP8pwiPeYVq7Jv48X0sU1+thYNoyl1P26ypg+IV3QnY/StTD0WNtqhqtPrsUr4Ft1XIYOljoFUoyirS0lXAwIR9OVIvortF1H3eA3bjwX26113p382irLlccGfbRzDtWnJnxqofY+Q93ordqw6dV+ccn9giDZSJWsMlpmINmEYJVpzwT7k5BWPFvRKuEZoM/a0DI1Z/WF6doIrCoL1xYOx7zhS3vXy6kD79k78='),
			this.addDataEntry(dt + 'line item checkbox', 358, 56, 'Line item with primary checkbox',
				'rVTtboMgFH0afraxUrvu57Rbk6VLmuwJmF6VFMEA7eyefiBov+xi0kFM4Nx7uHjODQgnVbOWpC4/RAYM4VeEEymEdquqSYAxFAY0Q3iFwjAwHwrf7kRnbTSoiQSuxxBCRzgQtgeHvBMO2kBbkDvKlYsrfWQ+nhFVgmUHCMeqJLXFJaSmXJxTxhLBhGxTcd4Om6al2EEX4YIbTnwAqWlK2IZ8AdsKRTUV3IQrmmW2WEwYLSzAINdn+S8e7vNywfUn/bH3mEW2Wk1SyotNS1s9hQbyf2lOgOauUi3kZVqDqEDLo0n5ppkuXQaOlo5WAi1KT4sWDiPK7YueetLdLLz0wzbgGxvG6V41hW2daVFlbLpXIO+JfeXMMrBzrDDhsDBH32DTyFHOhJoHtzp1mARGND3ARbkh8XzFraDcNmR3Py+3rz7xDd6fIPJc2Qa+Er+/9yg/5v/hRy0hB6NiCmqkLYt2PGjLJeEPk2YDzdxhD5o0wVcuPT9uktme3kWXfv5s/gI='),
			this.addDataEntry(dt + 'item list', 358, 642, 'Item list',
				'7Zxdb6M4FIZ/TS5TYUyAXPZjOnsxq61mRruXKxdMYg2JkaHdZn/9AgYSMM5CYkMTkqpScDCY8573iXUwmcHHzcdXhqL179TH4Qx+mcFHRmnC320+HnEYzkyD+DP4NDNNI/2fmc+ST0H+qREhhrdJlw4m7/COwjfMW3hDnOzCosFH8Rpnuxsz+BCvUZS1M+ylx38ISBg+0pCyfFcY5K9st4TRX7j8ZEu3aZ+H4lSYJfhDOty8qRjrV0w3OGG7dJd/iJ+s+R5w4fJua0xW66KbbRUDRzFvWFV991efvikC0B4MKAQDpGO5h0avmKCQrLbZJh9dM0aG4SztB1mMArpNDnZ+zl/ZzhHyyHb1vbhia9/0k0ZpAyj6/ijGaJTb5N9sE8B0m+E43fqriCToqoh5miKmxdsYDlFC3nHt+OeoZJ2YspuPVWazu9XGD+8SGv39ithZqQrbA1PvsCtceLfg2wdhs2wxaqBv1Irzv1CSDqs6+Xxp1k4/d+pHoEEQ40SIenUVnYRYCEKkuUi8uJdb2l3QtMzSdt3WDD7IcRP8v3+4WeaZGzJxiYfC+8KuG+L72YAr/4Y4SPY9v+VbT46p2TYL57wE2NXdp1RwW4XzIoYDnIbJw3FH+atvlU5xX7TH/YgPy1jVfGgr8WF5mNKGrgZVHBWqpMNI0iwfVJLOoFxo02deaq9TIFcQ6D5JGPISQrfqYVlJI8KyRN439IrDFxqTbARH0CdFZAsT+dAkaAaOZmparhJqukCD/EsV/kQHGdPMg8PvuUYyOPlf1+C7atB5phYSdC41SAMMFdq8RW2SVKGvOyPzShCS6M8+U3CJMJ0BCkxRJkUAhY2JJtQhExBkeiLbFEDXAs8LRCUwtRjy1HpEzZA+T45ukvdDJJDUJ46Zr236ooaRRXFHLyPFqsinZKRMmclAUqyLfPHfPJRj6sbJ0Tjp6Ci9ALH2coIpcZUfWlBp9Ual2WLBS5pOKimQDIBKiTKTQaVYMnlGGxLubpwcjZNVlUet0mLt5QRHBjw5tEDS+VSQdAaApJJ6yACQlCgzFUiaYm3kN4zC9OpukBwNko4WpcXyygmOXPPk0AFJnopTgmQ5/M8OSZkyk4GkWBz5IwiIh2+QHA2SsNlFjdJKlp1QnhxaIClZjnIMkoYoQnlZ50LSrZsPaNFESRVkAEqeu1Lo0ikp1kVeGN3Qq7oBfomktLXMXZQsSIn2CaKFlnZ/Wrbc6+69yLFbcbL0u1pdlNRCBqClRJrJ0FIskHxHPqE3UI4GSgvouIkDlaw+YXluaGHksj8jW6ynipHNGaUORkIlpZABGCmRZiqMLM9xyEjskQjfppMjUtLWcQsHKll/wors0MFJKAn7Fc8loZJqiH5OyqSZDCfFCsmPiLLkhsnxMLkAWpRWsvYk5smhhZInPJjTNps01VCycRNHS30SKqmEDEDJcx/QuXRKipWRnwy94/BGyfEoaWtxpJLFJwlPjp6U9EmWKFzUmL7l98q72VPNcznl3R7V80tDg07WhTyYI5NmKuS0Tq2X9Hr6O3u1MvMcju1qHQai2rw8jloVTBVueUXerza/VN9ZMl1EH3XSxTr+wIZxV97ePWaftucPFf2EQmOGqKMCbHWobZRapT1JFONPpdD1C9ShznEUaWOq41ybPOnm/peR+O6HP5z0Hw=='),
			this.addDataEntry(dt + 'item list expanded', 358, 642, 'Item list (expanded)',
				'7Vtdj5s4FP01PGYEGAJ5nI9O96G7O2qr3ceVB0ywxmAEpJ3019dgIARDFoidaJIwGil2bDD33HN8fWNr4DF6/5zCJPyT+oho4JMGHlNKc/4pen9EhGimjn0NPGmmqbN/zXwe+NYov9UTmKI4H9PB5B1+QLJBvIZXZPmWVBU+zEJUNNc18JCFMCnqU+Sx+z8EmJBHSmhaNgVBeRXN8pS+ofqbmMasz0P1KJTm6H1wuGVVNdbPiEYoT7esyU/s5yFvAWyXdwsRXodVt6VVDRxmvGLd9N29PftQGaDfGEAwhsHGcg/0STaBBK/joshH17WRrjur5cOQjQIa563Gz+VVNE6gh+P11+qNrV3Vd5qwCqPq+60ao16X8a+iaABWTlHGSv9WljTGImLOQ8S0eF2KCMzxD7R3/2NQsma6bPS+Lmh2t458cpfT5L9XmB7lqqDfMPsdthUL72xebpnNWopWM6ZarXr+C8VsWM3DFytz7/ELZ/8ONAgylAtWb95iFBC2AATzRexlk9jSz4IuZVZL1+314JaPm8b/84eTZVGwoQAXe5DcV3SNsO8XA274S1CQ73p+KUtPjqmYNrZznANs99knFfClDOYlKQoQM5OHspHwN7PKKLvb/XY/wMPaVns8XErhYX2bmoauAlQcGaiwYeTMy08KyWihtJXhs6ixVwmQKwB0n+cp9HJMY/li2UAjimUteV/gKyIvNMPFCA5I36BE9mhiO9hwFGvk0pSika6hAOyVDDbCln90UW/Pah3onfKv6TE50nPlSKerRDpXCsAydBlobZI+kAbAKLlCcPKPBGBGC6hh9pBIjoCCTqAJVMBkzISJ4FIhBWxQeZ18SVS725G6ZQAVs1TtIy0jP+GYqfylzlCdpUKzyPgAM5dhKaGZmP+YoYY+d5qJK7tRRjcGrH5I+fpiRzkTVB14K52gpCQ7Jk9QR6FxNbOSmP9gigbfApgVQ9HMJYyS0pj6a7qJvVBAjll3ioh1c3rOyScw60jm1MkJ3VaBh5ie+Av9ZBX3EUqZfeOb/Wv720r4ICYivm2yEBf+D1NxoXut1ge6inWnIWYZxs0UlxkjA0tFAtQQV/ef/I0Hyyj1QsNklWBLCoeBpSL2MqUkB1DjH+NQb6KyUXbnDjktZdMTdclK2ZwgIjbn5gJOnLIZQuZaouMalhZOzzDCZHvTybNFHpa+VIG0lLRBwJ1DhUgOWf2CRfI8aYPJIjmEzNWIpJhC+ANBkoupgptInkwkbSUiKWXvRMidQ4lIztg38cFFUsrGiROI5LHbJz66SIqZjb+DAHvoJpJnE0lbN1UgLWXzBOXOoUQkZ+yQ0EUQ6tc6ViTdffIZKvKK4INskbj2PRJAzIu8pDSit01mZ1ZKW1eBtphdmcHKZOcgKtQSDJzlmLifbPJBggG17Ownq/kuFxcpuRD1ajkEzdWo5dwEyaRTC8Ul/Qe07V6HE6nYwlKx5QyI6Y8ZbHmF3lsfX5o5agiXmfteuO8Mcke/q7M6h+jTt29W0tGfztJZxckfMCKbUWPFeuIkE+PxcyJ0+QCNyG0clLRzouNcGjysuDvRy5u3D/z+Bg==')
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
		
		var fns = [
			this.addDataEntry(dt + 'menu simple', 170, 168, 'Menu',
				'7ZXLbsMgEEW/hr2DEzfbxm3TTaWqWXRNzdigYGMBefXrOxjykhPJ6mPVWLLkuXNnYA6WIGleb+eGteJFc1AkfSRpbrR24ave5qAUoYnkJH0glCb4Evp0JTvqsknLDDRuSAENBWumVhCUIFi3U1FowcgaHBgMG92gOuPMCvAdEgysYK23GihwyVkplcq10qarTsvu8TZn9BJOMtA9oQHXGxRHGMT9gHGwvTpTJ8WB5qBxd2aHlo3kTkTHXZg7ESArsS/LpkFkNgjVofaICD8ipcvE0h6xNygNWNEDhxN4IH4WWTB1r2TVYKaWnHvLrNSNW8hP7x5NPIeWFbKpfJhhiD0x+R5nGsyGfo/NOB68AcWcXMNZ/0u84hKvWuLKR4suSwuuB/Swk0GMxz3Gz6Ba4v/ljNVthyIpAfgHK5b/m/vuvM2vHsOkdwwLcA5R2RtzlKfjP2Ce9Zl7lDTRK3ej7gv2iH6CHcPjHRvsp1fwFw=='),
			this.addDataEntry(dt + 'menu simple', 170, 272, 'Menu',
				'7VhNb6MwEP01XCtjEmiPJd3mVClqD3t24wGsGIyMm4/++rWxSUkharQxpxSEhMf2jOe9NzYiiBblfilJXbwICjyI/gTRQgqh7Fu5XwDnAUaMBtFTgDHST4Cfz/SGbS+qiYRKXTIB2wlbwj/AWqyhUQfuDDVIVoICqZuVqLQ1paQpwHhAutEUpDZDJax1yDRjnC8EF7KdHWXtZYYpKTbQ64H2sg6o2GljqBtuPSAV7M/m1JpcQksQenXyoIfsGFWFG5HYvFEBLC/cNJy47EhjDflx7hdE+sWhNI5YNEBsJWHLYPffwJX73PB/l5eU39XOWZQaDNia8EfO8soMY5Qa1ylxBg6ZAZyTd+Ar0TDFhDFLm3CaiUq9sU8TIZybcDVZsyo3zVg3JTS686+DLBww5Fb8jc5kZu5LecI/8xQPaQodSxI4UWwLJ+7HqHMRVoLpwBh160nsjMNppM6ByLIG1ID54zIvEsNsIIa3QufvRwqNcRXdjBLuR5Qw86OE+EQJ82QCJcwHSlgan4izauNHDq2nWxYDmkIMIQonUEP887HacaxphVHcR0Ry/gz1hfvYsXkt8B3SeIodOBkg/UI2YKLoZy3qg5/iaz1dX3yWwI5lfH059muvX5MuMV+ywCOqiL2Uo/s+PYpkjiYQyf1AJE9iV3FBqB910M7brWzP0+nh+/b8gCfQw8Pv9jzYno+V6BXpbnE9qF+hFFtPn8jS+votO89lh2ceyk43v35k2OH9/xz/AA=='),
			this.addDataEntry(dt + 'simple menu', 280, 160, 'Simple menu',
				'3VVda8MgFP01vidxLXtts7V7GQz6sGeJN1FmNKjrx379rh9ru6aFMgqDGgJ6rkeP5yASWvfbpWWDeDUcFKHPhNbWGJ96/bYGpUhVSE7oE6mqAn9SLS5Uy1gtBmZB+2sIVSKsmfqEhCTA+Z3KgBNsCF0LDS45b6VStVHGxipdzMKHuPPWfMBRBWILFcG42SBY4iDvB9bD9qLmCGXBSzA9eLvDKRvJvci6H9O5CgGyEz+0aQaZS0C35x4swE524bwjdOTISqB6XDRO08bLVjbMS6Nx2Bjtg+xT0/B00Swsr+RXAEuax0cWFbEhzpTsNGIK2kBzA2uk7gJrOrZ8b2xwEaWoWWb3kvMgYG7B4abv2a6rba/+ZvskYxYU2rKGX+ufiyJv8WZkcK7YZcJJeKZtHfhRdHthV6X5MErzRXIIWYF2Mqr9n0zvK7vTi3eT7CaXsvu/m3hfqZW3uHI4PDxXafrxa/YN'),
			this.addDataEntry(dt + 'simple menu multi line', 280, 328, 'Simple menu (multi-line)',
				'3VZbT8IwFP41e+86uT0qKk8mJpj4XNnZ1tC1S1cY+Os9vXDRiQHkYiwhtN+57vt6yKJkWC5GmlXFk0pBRMlDlAy1UsbvysUQhIgo4WmU3EeUEvxG9HGHNXZWUjEN0uwTQH3AnIkZeMQDtVmKANQFq+xWwwRT3mVciKESSjtrkrmFeG20msKWBdyyloKlqkEwxkOoB9rAYmfPDgoNj0CVYPQSXRqemiL03ffPRQrgeRHCEtr3IKs9kK9jNxTgJrDwPSNJi5EXbpALSnIFtauooUUSPo0jR0kz5u8WjAfhvEUJcQtxJnguEROQ2bC6YhMucxvVxaNlh0+YuA1eJU9TW8inD0UtmRpqLPYaaNmbXnocvd3ArgbBDJ/Dp/y/ofymRfkY2XCcCy7tj6P3YAU6Ryvw5ZIDsZ+flLmsEh1yoBKhxLPi0vK4/CzoKkJlWQ2mpdy6sb3E7LTnp1EbJRv8q6sg3aEpKdnUyoDpTHC2njZeenef5pza79S4KbiBMTrbAq61S+veO43ucXwO4bt/bor/17TG/XOo1muPa6FhS7TTDCxh0qaYoI5czlwCoWQOeuX9Bte9Etcf7sFprglNTnBN8Lh5B/Xu26+oHw=='),
			this.addDataEntry(dt + 'menu items', 318, 126, 'Menu items',
				'3ZZLb8IwDIB/TY+gPihwHWzjhDRph50zatpoaVyl4dH9+jlNeIPoBkiDSIjasZ34s63Wi4b5cqRYkY0xAeFFL140VIjaPuXLIQjhhT5PvOjZC0Offl74emI3qHf9gimQuolDaB3mTMzAaqyi1JVwigIUz0GDIlGiJO0gYWUGJoJPQpmxwpgqmNCRgykXYogCVe0dTetlzLTCL9jagXrZAAkuSBmQ4O4DSsPyZE61yiU0AqTbqYpMFjzRmbWIgr51y4Cn2cot7FolK60iXftuENGDo3ScWHRAbAxyZgw05PRnCO0jpFwMGpMVnzDxJHgqaUdjYYCh1O/825gGscFRsAmXqRG7JCooafPDpdYYUfg3RB1XfwWCaT6HnfiXYOtcr9HyZWrmpZ3miWhrxZlMBRx0mIuw147depnI3PQrR1mbKgOlGdjoONhdh8rNXju28hb2+Ehf+r+E7o5/Q063Wp/dCnu7LjidlqAPqrS+daPCxWf6XS+wab/nPEnqSt13y+/Rr3bDXBV+91GmJv7/U+NOb8U3qGPv3BBlChq/Nj5Ra8wfdIz6nRvg7z/KGPXuZ4xWcS8pJImbT2Frvv2l/AM='),
			this.addDataEntry(dt + 'menu', 318, 126, 'Menu',
				'7ZbbboMwDIafhstNHHq6XdlBkza1WqXtOgNTooUEJdlW9vRzSEpLaSW0w0XVIrXCju3En/kFXhQXqztJyvxRpMC86MaLYimEtnfFKgbGvNCnqRdde2Ho488Lbw+sBvWqXxIJXPdJCG3CB2HvYD3WoXTFnKMESQvQINHkgqN3mhKVg6ngo6FyUppQCQluOc0oY7FgQtbZUVZfJkxL8QZbK1BftkAqPtEZoOHOA1LD6mBPtcs1dAcCTycrDPmkqc5tRBRMbFoOdJmv08KRdRJlHcsmd4MIbxyl/cSiDrFZCbxDDY9vaJhGaELYFaNLjisFTVNWN12ShPLlmqG1HiAzRw1GhqPgekG/TLlgiLYEhdaLa7E3qvBnqAbuOZDAiKYf0Kr/G3yDDr644KkXTmeHEDLyCmwuFNVUGIQJ9mYexobtw05Aw5g46NL2dXgYu6x7kY32k20nVE6El0Nrb3EP/FGXu5Nrf+7uAHNB8VzN7hfBulC1dvjtGiLLFOjO5JpGeg1z2BnmnCgNJoIbWowkcPLK2JlQ1S7zp/MYdeaxyGlmdkWB4f/zsWlseNbYuDPTJ1BAZJKflbVXWZPBP0xhsuetv9FVW2X2heaM+2OT3PjkJIfm5oPbhm9/j38D'),
			this.addDataEntry(dt + 'menu', 318, 126, 'Menu',
				'7VhRb5swEP41PBYBhpQ+LllXTeq0aJO2Zw8fYM3YyPaaZL9+NnZpAomasqaqlCAhuPPd+e777oxEgBbN+k7itv4iCLAA3QZoIYXQ7q1ZL4CxIIkoCdDHIEkicwfJpwOrcbcatVgC18c4JM7hAbM/4DROofSGeUULkjagQRqRC260c4JVDTZCZARV49aaSijMlvOSMrYQTMjOG5XdZc20FL9hawW6ywUgYmWUsRF8PiA1rA/W1Kl8QXcgTHZyY0xWlOjaWaA4d2410Kp+dEtmTomVU1S97xNE5sWjtB8xNELsawt8hJpJ36JhC6EFZh8YrbhZaSghrCu6xQXl1SOGTrqH0qYazyyOguvv9K8NF2dGlqCM9NOXeDRUyTSoUt8HEhjW9AF24v8PfOkYvskd16wrOzhh1RAWFqJpMDcmc4Z/AVsKRTUVFnPpyuq5uB+s95xgTxLraDjM3ZCao4hA+4nYddj4mQ0zJ2/RFCf7GvqFLPn9l4KatPrNr9Ld7a8GYyLKUoEesdxXcRTx2Yj4JVYarAW3UDFcwNlP0YCfzW6YV+VjNuLjx3kMYnbmg3j9/Cd/yCuWUqxU4p62Caj92DvSuJAWmTmxOUehHTpiy0nD/NICE1oguz59C+SjFvgGCrAs6ssJvPcEztMTsHAzYuHzeZzA+TseP4ROP35xdDmC33MPpDdv0APx8z0wafhFqy+kTyB9lr066UZ8+pPjzLd/9PwD'),
			this.addDataEntry(dt + 'cascading menu', 636, 632, 'Cascading menu',
				'7VxRb6M4EP41eWyEMSHZxya7tzqpu6oUne7ZCSZYNTgyZLe9X382hrRhoCUJVts1karGBhs8H9+M52OUCV6lj98l2Sc/RET5BH+b4JUUojDf0scV5Xzieyya4K8T3/fU38T/q+MoKo96eyJpVvQZ4JsBvwg/UNNjOvLiiVcdeypZSgsqVTMTmepdRiRPqJ7BU408IXt9qqRbdcllzDhfCS5kORrH5UefVkjxQF8coeXHTBCJ36oTqUZ1P1QW9LFzTWVXtaDvVKi7k0/qlN8sKhJzBkYLMyyhbJdUw2Z+YDpJbjp2x7HPJlJfKiu1WwwDiy0Fj4DV1O1ra+iFsC3ht5ztMnUkZVHEy0XvyZZlu9qGpnVHY32rKNR2FFmxZv/p6dBMtSXNVevfaonaVC3A9LKef5n1gurRkJSTgv2iJ/NfY9EAWvTihzB93GkuTXdpxKdbkaYkU6csOdlQfi9yVjChYZBmWUd47hrHjzCRCjdeItMNZxOtXkDgdiBOBzxVNJ7OTPsFTMiHKKFzUaqufy+Yuq3jxW+C08vfhKcziDjOaQFQPq6iF/AzAPzfhTL4diTTmzA9nU4zKCwhhMUNPs4c5+McAP9PFlHJmcJ3pGRPSi4CC8gsIDJuUHLuOCW/AODXhWQPagJx2CUjK/uyEvk20EEegOeWq0mX64TF+v+sC6Em27bKTtqk/enW5OebfLsUuC/XUtALIaxVWno1B1E9UU3CGpJhcUaQhgdlz3wr2b4YWdibheHCBjpQxJi6ER1RhxDiTHhEUI1ZHzYjLc+jpW/HaUJdZ+KvHCGm69IOgtoOQL5GtswvXxOI351n6MrdSs2zmQ25BkG95p5IUrKlNnh+tjNsPvbPzrF0he8OyVCuL7QCCVRShvF7Kvcj2Y5DulQzNF6+hOVHz8z02xnjATMhtWV7OrLwSkc2G55NtR/Di1M/NrOBJFReDFVGPrXyCXs25C8EZZDPyqeF23zyoWJyV8rL3roixMDEaiD4cfYUQxEusLF986Hg8UkJZx44hwkHxZGfh3RDpcLJ9+5Yfn6e7EooW9gQq1rqRz4rszrgcYZZUN8wdPLEXttzzLm6ihawDbmppZrksxIrcJxYUNAASDqnHQVzG0JFS8nHilMiVVcsZEqK4pItubNCerCwAhLUIPR0gzi3jy6kO18A0lIB0ukMqwrsbmfYWZv9sgL7Uuq9/i7ySLtm3voWNf1F2A1M76JtKDusWRnUB96jnTo75bMHdW4dpRjvVrmNoUyApqiz6MVto3aEDBsRA8Ok/6s4bMbH/d0LOTFM/1eHvBDpBN+qbjSF3n2EqBMiO1V9uK1wYZDNVkK3D40wXA02MbuGxG+L4sfEshcyuKMC4bWtUlv2ElwHVB39w5PgfzO3AdsfIwB0YeeKAIA/qABwobMbSAGwUzyJoQJwG0Xa1ipu6PdyGxoLSY0p6qISmxFqaKnzQtDqLdS1oM2tgNZSlXACGom1pUbMLsLMTjkkPiORd8ep2cl/ApjuV7tsQxH15E6nsEb8j+TElRu4IUsXVfP5lw3M6S9/+OB/'),
			this.addDataEntry(dt + 'cascading menu', 192, 146, 'Cascading menu',
				'7VZdb4IwFP01PM5AQXCPm9t82RIzH/bcwYU2FkpKVdyvX0vr10Dn5kwWYxOS9tx7295z0hMcf5jXI4FL8sITYI7/6PhDwbk0s7weAmMOcmni+A8OQq76HPS0J+o1UbfEAgp5TAEyBXPMZmAQA1RyySxQEVzqqYBYbXlfScGnMOSMiybuQzNUJKWMbeFpM3QFwQlfKNBTixIEzUGCTip4oevsFUBIqPe20UC2hxFwtYVYqpQFTSSxGbf27gRoRlZlQWhAXBkgW9duWFETS0w3SX6LpAlRDX0lSl1fE6QboTFmd4xmhYrkNElYww8v5IR+6Gyvr3kpcUyLTC/DzfIZUrmCBFQq/832eAp96Hf0BRYTwLCkc9jZ/xRKgxalI6FiyGW0gOqvqLVcRug/cOn/lEt7xJhTdTJyl7uSrCp4mlYgW9yvL3aUHP3vbaCDrQRXBPQOrnnljU3kdabdrJflCevFBOLpF2uwxcZHVnqgLmcJm3GsLEG3LJY2t2d73JZp0GUYp6lk7+db27Gn30RnEC1siTbGGSjkXQCeXh/RgUcUBWfQI2rp8TpjVzM7pIPnhmcQYnABbhZduJup5eYv16Rv/wR/Ag=='),
			this.addDataEntry(dt + 'menu disabled actions', 85, 190, 'Menu with disabled actions',
				'7VZdb4IwFP01PM5AQXCPm9t82RIzH/bcwYU2FkpKVdyvX0vr10Dn5kwWYxOS9tx7295z0hMcf5jXI4FL8sITYI7/6PhDwbk0s7weAmMOcmni+A8OQq76HPS0J+o1UbfEAgp5TAEyBXPMZmAQA1RyySxQEVzqqYBYbXlfScGnMOSMiybuQzNUJKWMbeFpM3QFwQlfKNBTixIEzUGCTip4oevsFUBIqPe20UC2hxFwtYVYqpQFTSSxGbf27gRoRlZlQWhAXBkgW9duWFETS0w3SX6LpAlRDX0lSl1fE6QboTFmd4xmhYrkNElYww8v5IR+6Gyvr3kpcUyLTC/DzfIZUrmCBFQq/832eAp96Hf0BRYTwLCkc9jZ/xRKgxalI6FiyGW0gOqvqLVcRug/cOn/lEt7xJhTdTJyl7uSrCp4mlYgW9yvL3aUHP3vbaCDrQRXBPQOrnnljU3kdabdrJflCevFBOLpF2uwxcZHVnqgLmcJm3GsLEG3LJY2t2d73JZp0GUYp6lk7+db27Gn30RnEC1siTbGGSjkXQCeXh/RgUcUBWfQI2rp8TpjVzM7pIPnhmcQYnABbhZduJup5eYv16Rv/wR/Ag=='),
			this.addDataEntry(dt + 'menu disabled actions', 170, 222, 'Menu with disabled actions',
				'7ZZLT4QwEMc/DXce+/Io6K4XE6MH47ELAzRbGFK6Lz+909J9hV3dqJiYACFhpvNvO78hQ50gKjYzyar8ERMQTnDvBJFEVM1bsYlACMd3eeIEd47vu/Q4/vTCqGdG3YpJKNU1Ar8RrJhYQuNpHLXaCuuoQPICFEgySyzJGyaszkHP4JJR56zSoRJiWjJMuRARCpRGHaTm0mFK4gKORsBczQQJrsnpkWH3A1LB5mJOxmUTmgHS7uSWQtY8UbmNGDd5uznwLLeyfbqsbhzZXntARC+W0nliQYvYA03Sokbb1zR0Ijxm4lbwrKSRgieJDglTLNULf9fR3lBDqFjMy0ybIzIl1DT4ahO6Goz/PTCB5SJBMMVXcDL/OVh2iSfktLLvbq3APVVgmtagWnD3G7uK96DFO2Txouet0fgd8B62eE9RrplMukeuBUcNYm7u/1GK8aCDUoy+bs675iu4acyXm+zffuC7TvDjhjLqAOu4hfUZYspY6MxigTX03/qnVfG6qMqkVZUZYib6P6sRDCYdIL9pIX/DpVrOe+ZGMPmF4wyZh8N8E3581v8A'),
			this.addDataEntry(dt + 'scrollable menu', 272, 420, 'Scrollable menu',
				'7ZhbT8MgFMc/TR9NoLS7PLqpe9Fo4oPPZD1dibQ0FHfx0wstuwmui7MxxpI0hQMHDv9fF3YIyDRfzyQtsweRAA/IbUCmUgjV1PL1FDgPQsSSgNwEYYj0E4R3X/TiuheVVEKhznEIG4cl5W/QWBpDpTbcGqqMlqYqYa6nnFRKileYCi5k3U+gLronZZwf2NO6GI+MJmKljVg37HogFay/jLk22YBnIHJQcqOHrFiiMhv30AaaAVtk1i2ym0W0agyLne9eAl2xKvgVIY4ij6ViojBDFOT6hR2J9F6MNGZXbE75NWeLQvfkLEnMkElV0jkrFtqE9q17SE3ceGCkE4V6Zu9mOhzrtoRKt17sfs/WLfyubo1NAqeKLeFo/ku0jFq1dD+3/6alXeJJML1yiDbH02w9RJpWoBztd4GdhSNuxUF6HF4co6gDHINWHFGPw4sDb7X7UR7DVh5xz8PPYzDqgMeolceg5+HlEWLUAY9xK49hz8PPI+7iON9CPgFk1APxAxl3caBj3Apk/BtAPiVmu4TtD4AipIuTHrtpr5Pkof6n4ycy7OKsx27a7eh/8iKiEIXnDiKpy4XCHjscyBy5IuMxukxlu9iVnXv3hze+XHTd3F8sNcMP750+AA=='),
			this.addDataEntry(dt + 'cascading menu', 604, 590, 'Cascading menu',
				'7VvRbqs4EP0aHoswTkjuY5O7e7VSd1VttNpnEpxg1eDIkHvb/fo12NDAQEoDTtVCpKrBYIPPmTP2zBALr6PnH8I/hn/ygDAL/2bhteA8Vd+i5zVhzHIdGlj4u+W6jvyz3N9bzqL8rHP0BYnTLh1c1eGnz05EtaiGJH1huuFIBI1ISoQ8jHksW1eBn4QkG8GRB0noH7NLBdnJW672lLE1Z1zkvfE+/2SXpYI/kbMzJP+oAQL+SzYieaCfh4iUPLfOKW/SE/pBuHw68SIvKTogT3X5RYM0VG0YLVVbSOgh1MPMsL7QT1TDoRzrFTL5RaPWjCAGCK44CwCKcjoZOtnE6M5n94weYnkmokHAchCO/o7GhwJTdfRA9tmjyvlIXHmcbuh/2XBoLo8FSeTRv3qKnaFzm6F7EyptF4IwP6U/SWX8PvDNIHxXW2D0fMiEZB+igNk7HkV+LC9ZMX9L2CNPaEp5hrlQ0yq5eKidLznxNUksp6Gduzo1nYjAl21YdXjRGrbnwKKRC1lC72VJ3/+RU/lY5c3vZtXb39Vkwvf7hKSA5XIWnYifA+L/SCXgu9Erp8bJS3WYQTnwIAfjEN985OJbAOL/iQMiGJX8Tvpr0t9yZoCGJaRhHPpbjFx/3wDxm1TQJzkAPx3CSYKNEkSuCSqQA7i4Z3LQ1Sak++z/vI2OurR2EqdMpt21VRfjMOL61ldcjgc51HFkb3WhYqBCXgX+w5KKoMBO0pMmO0GP6aSvZn15SxNUwBSDPY5FDr2RpvjyqxyCuZHNaTtp8IIGXTPuEGZZLHc9EhWOPdGCYKYFMF8wmweAl3K1txUV6rnpKEQ1N5E8QTB78ugLP5dGgW7ybjdXt/FXt5c7uc/p1Dwj+MMkxjAeTUZifnxgUAh6hFqFw8s/2cg0K4Eo3xZzkSHb0UV5PV3UfHjpFB4KL6seam6CSZgHecgzUU5h/S0qqjFReqlRqQs7JlJTCKYo/jpFWyKkdlyH0eT9O7gvCf7MxJLtwpzEQ464w4+Zg5mWlXzspYl41YWpA4D2194uzVwTMUgBYxdc9asE7bi2vmQw8KsE7tKrLH+lr32LirJjn9p4w7sFG5rvTAaWfzWaXrg9LPdWLqEzhjD0RTZqzemOCMEb1pkbiv3f+Wk7GXIrDUbKjQ31/vUpSXlk4XvZjGzokYfno23P/jl5MlOTaqjPA2auS9aFZPdUI0F3Vottgb/btPyWkW43Zlqi2kuptqZNzawfUfoBcXUhv1uYoA3GscPQdvOMRBt3Y8lINBToAZPGg4CPjQLMVANxQ7U9CCyV6ckyPluy54IoKIpcqsk1qVf4eyVDeKC1Z2GEIRj/Vhny95n3mgj6qGJe8XAj9k1mohQMw229PS4T0bYN3134/Nbec4dltMqGYfzeau0fnzYqg2gN8xn0ZUaoWkdetsPc+RcoMLruVj65wmRb3r240mIVuRcttsyF3yRbhGGEPGxUfIbf33o+OYD1NwJ7wVftcQam12CCfQPhYlvumQiEMQyEKzX2wr7LbePYDf2GST0Mo91JK+/TilF6YAjbLB29n5+Uc7M87AwGwcgesiQxGuUMQY88fP29tbr8/OfY/wM=')
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
				'1dvLcpswFAbgp2GbQRLXpU2arLrqomsCsqHmViCJnaevuCi1OXhKYw9njmcyYwvkwGfQ0Y+xIYL8+FyHVfK9jGVmiG+GCOqybIdn+TGQWWZwM40N8Whwbqo/gz9dWcr6pWYV1rJol3TgQ4e3MHuVQ8vQ0LSnbGyIwyaR3eqmIbZNElZdey0j9f7bXZplQZmVdb+q4I7gwutWa+vyIPWSoixUn23YVH2vx1167N5wO/5vWbfyeHX7+6Zx459lmcu2PqlV3tO4TYY1hO0N3RKZ7pOxG+fW0Bg2Q8P+s+9fDvVkFJnXEUDnN+BR295LlEV7JvHSP8b2H+lHt7LaIrHt9jaNwmyTpftCNeZpHGe9ztgQqT2X9VIdPq+jO4yf5kmbDC/P7UxIp9tukbOA3DspOcvBkrOBnCQl55lYcg6Qq0nJMWZh0bmArqVFZ3lYdB6gO9Gi89CKhA/oXknRcYZWJZgJ7FJadjZanWAM2JW07Dy0QqFnlGd2FSk7wdAqBYNxIiRlp6cJI51rr0cH80RDis5haHQwUMSk6HwbjQ4mih0pOqanWAh2MFLsadk5As0OZoqElp2PVylgqPhFyk7NULDsOAwVB1p2Dlqt4DBUZLTsfLRaoefgZ3YfpOwmszumL0WuYQdDxZGU3WR6t6odTBURKbvp/G5VPJgr3mjhTSZ4q+LBZPFCC28yw1sVD0aLghTedIq3Kh7MFjktPAexYMBwwRbi+f3jEo+Zq+Pxid1qdAJmC06KznbQ6GC0EKTofBONDiYLixQd4xaaHUwWNi0720Ozg8nCoWXn41UKGCxcUnafnzWCHcwVHi07B69WwFjh07Lz8WoFTBUmKTvB8WoFDBWAbvYe7Py47+4bf9jncfbQJOmu052983pym/aGbdyNf6eDbhJlBbxsrPfn8vbs2+EsGCm+APcSRoemCiOJgCfYZLQT8LDTxeRcT39BeJMeTBWGeGKLo8Xc1QC2/nWoyWUo113tvLVgtjB4cIMewvcWk0mea62nB9PFAyk7cB3KNdfDg/EC2OnBTvVMq2bp6GYFW3uzvdPoZk5qqjNzcs6MbrrtJiEYIr5QG6JERgcgp5h2/eNzyc9xh/hSuOEDvD6q/XMSzOaqwj1qKgwQV4+s8TdgSw4rEViuFaj2unwt4h6ddV2Hk1fcqRaY0zMSDmdMHxgXkxH7v+HUy78/0uuXXfyG7w8='),
			
			this.addEntry(dt + 'snackbar', function()
			{
				var bg1 = new mxCell('Archived', new mxGeometry(0, 0, 358, 48), 'shape=rect;strokeColor=none;fillColor=#333333;fontColor=#FFFFFF;align=left;spacing=16;fontSize=13;spacingLeft=8;');
				bg1.vertex = true;
				var text1 = new mxCell('UNDO', new mxGeometry(1, 0, 88, 48), 'text;verticalAlign=middle;align=center;fontColor=#EEFF41;fontSize=14;resizeHeight=1;');
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
				'7Zxdc6IwFIZ/DZfdSQgiXHbtx8VutzvTzvSa1SjMojCQ1rq/fhNBiz3YVsuJe5jVqSMhATyPoed9OeiI0fz5uojy+CabyNQRl44YFVmmqnfz55FMU8dlycQRF47rMv3nuFd71vL1WpZHhVyojwxwqwFPUfooq5aqoVSrtG4o4yg3bws51pv8Ok3SdJSlWbFeK6brh24vVZH9lo01cv0wa+Joki11I9cL9f5koeTz3mNeN9UHfC2zuVTFSndZJhMVVz2EG1TDYpnM4nqYF3hVY1RWDbPt2JcQ6Dd1FNojIkBE7uNHx9Xj2Hle6FcuDgwRY6EfBKY9W6j3Q7fIFiZqUZrMFnoxlVOzzTKPxsliZqLo15u6S/6YnQqhl01Ak3GUntejfmVKZXO9opCl7vZQR+7DBNzjCIR+1VbINFLJk9zZ/meoeICKBjEEIPRHUi3RmCeTienymsDV+vES3fss1yv8N8PNB3rZ7OfWdFEr3TRkxwdaHPlVZ0iBHrScEPxUbT/O8cH2LszzsGC7rDETxjpossD8TntdRLrew88s0Tt22Wp3ZmxGZNNpKRUgsz2uD8HyASx9ikpMjy5mxzHAuGgDtu5QHwfvHGA9gH3hnl+fmxtM9fyhBXXYNgNnfZ6BW4DBQAwBQGqTMgD87g4G1zqDGiQDZp6op8IQLep6miKEPQRhv6ES9rdPYJtokSHBGUBxTw6FG2xODqRRcIDigRwKzw3DHqCAUpverBgMGe8BCqjxr8ihGHLm9QAFFPZksqVG2spa/ldQS6A4lP68cxRbCWJJElpHE6CggULfpYrGDoetN9ItB6jNoRlMhMPJRAcSGii7PfJobIsQJDRQmg/Io7EtSnDQuFCq++TR2BYpSGigdD/c0X8Pzc6lSQtobIsWJDRQygfkZ43tTBkJDZT2IVU0ljj4KBygrt/YwvRAnC5VxmHTIvTpK33ruTIOG6j0N8YxYTbWk2UcNlD9v1ELpscmeWlo7CsHay37OprptprsNdNOCPoecyFB1j3Beo9nG2WCSxSaBpy+a2A9ycZhA10DTt82sJ5lo7AR0DbgZH0DOyAEQwEBTYIj6v7+ERAnS7OR2ECXgNO3CWyn2UhsoE3AyfoEJ0uzkdi01fqTZ2PblEZiA62DHhQJ2E6Ykdi0FAnQtw5sJ8xIbKB1QLdywBIIlCInARV/D+oErCfMOGyg4u9BoYD1hBmFjQcVfw8qBawnzDhsoAmAUCrQ+4QZhw00AXpQK2A9YcZhA00AusUCp0uYcdhAE0CQNQEsgUApPfeg4h+d/xhdft8H4/XN4PsqznbuQTY3ZyzjRMk73WqGLosod5r3JbODOXd8DbQesNpZapAdtlwMHXR0MZT7u1dDzzYb7hY1NBBuv/3HvIs5RMQcIlDWiy+/JlR1b/7Y0F8='),
			this.addDataEntry(dt + 'date picker portrait dark', 328, 484, 'Date picker (portrait, dark)',
				'7Zxdc5pAFIZ/DZfp7LKIcJnSJBdtms4kM7mmugpTFAZIjP313QVU9GCqlrPmOCWTDOwH4Puw5LycRUsEs7e7PMyi+3QsE0vcWCLI07Ss12ZvgUwSy2bx2BJfLNtm6teyb/fU8qqWZWEu5+UhHey6w2uYvMi6pC4oymXSFBRRmOnVXI7ULj9P4iQJ0iTNq1rh2PpHlRdlnv6SrRpZLbomCsfpQhVytdEcT+alfNt7zlVRc8J3Mp3JMl+qJot4XEZ1C2F7dbdIxtOo6eZ4Tl0YFnXBdN13I4FaaVToVkQARZ6iF8tW/dh1lqu/XBwp0aBadHk6L1vlk2oB0s3TuVYtTOLpXG0mcqL3WWThKJ5PtYpus6vH+Lc+qBBqWwsaj8Lkuun1My3LdKYqclmoZs+NcgcTsE8j4Lt1WS6TsIxf5db+/4WKA6goEEMAQn2kskONWTwe6ya7BG6rZaPuU5qpCvddubkmqY/zoJuUS1U0ZKcLLU681BmS0IOOG4KblOuPc7rYm8v9cLFt1hoJIyWazDGvaacPpZsj/EhjdWCbLbdHxqpHOpkUsgRk1ud1ECwXwFK3qFi36GN0nAKMiy5gVYPmPHjvAJsO7BN33Obe3GKqxg8tqMOuETi95BG4BugNxBAApDYoPcDv8WhwnSOoRXJULai3Qh9NdTVMEWT3gez3VGR//wa2UosMCc4AiidyKGxvdXMgjYIDFM/kUDi2718ACmi16Y2KwZDxC0ABPf4tORRDzpwLQAGNPZloqRW2so7/FdQCKA6tP+8dxdqCXAoKDwUFNPY2FRRmdF8/++hXd+i94cPeD6r72UwEEgpoox1yKEybCCQU0FoPyKEwbSJwUNjQWrvkUJg2EUgooLU+/on731B4LPgcOJdjIpBQQGvtkRsVpiNXJBTQWvtUUBjS3UXRHfro1WPYjy/8+UJXHBYdRpqekzYeu+KwgE569SCWEAvjwSsOC+iu35lLpfrGWaHV35lOtY6JOqdNncxwPZFtd7JCLwRdh9mQIOufYHPEq5VTwCUKTTqn59KNB8E4LKBL5/RsuvEoGIWFgDadk/HpZoQXDEV4aMpPmAd37kFgOgxGYgFdOadny02HwUgsoC3nZHz52cJgJBZdc9nJsTD9EBeJBbTqBJPepgNYJBYdSW96Vt10AIvEAlp1OplwQ8KjTMIR0FETzHsbD2BxWEBHTTDxbTyARWHhQEdNMPNtPIDFYQFNNkLq++ICWBwW0GQTzH0bD2BxWECTTSf5fb4AFocFNNmCjMk2JDzK1GUHOurg+ntw822f+LsvD++bAbX1zqp+KXURxaV8VKW66yIPM6v9His7mmvPOb+mw3Jrq0V22JH8G/SU/OPudvbvarXjflFDw/7w9T/mbcw+ImYfgbLa3Hz7TN28/eU0fwA='),
			this.addDataEntry(dt + 'date picker landscape', 512, 304, 'Date picker (landscape)',
				'7Zxbb9owFMc/TR47+ZLrY0cvD1vXSa205wgMiRYIStJS9ulnE0OBY1pgsdeTjaoScexc/r/EnPPnBI8Ppi+3VTrP7sqRKDx+7fFBVZZN+276MhBF4TGSjzx+5TFG5L/Hbg6spau1ZJ5WYtYcM4C1A57T4km0LW1D3SwL3VBn6Vy9rcRQbvLzOC+KQVmU1WotH69esr1uqvKn2FojVi+1JktH5UI2Urmg9yeqRrwcPOZVkz7gW1FORVMtZZdFPmqytkdA9YFmIp9kehgnftuY1m3DZDP2VQL5RqtgVoQDRR6zJ4/JcaE8KUrkOVzOK9mD8hOlIiQJ41i1l7PmfQln5Uyplxb5ZCYXCzFW26zn6TCfTZSaod7UQ/5L7ZRzuayEzYdpcalHNeX8ddCjWrii/rEY2LsYaBhbwuADDFLxCCguD78xnPY0H41Ul32pb1avfUXCN3WlgVxW+7lXXZqlbIrUVVCJWnb4ocU4+trm54nqt/cxqUSRNvmz2Nn+nwgdGGaAsGg2p3O+2P6V+jtNbEa2LvmhFE1U50t94PrVA8gnzkI9i2zPLMSh+CEQX84tuerRxdV+DgDKTQBWHfRxUHtAfJZEAAjzDVO9NSKR6XaY/BO3Q0LWH35/63aIgfgPJ6tuvHa3MMRE/bmeVEzRCjtRRb3T72Uuj4WRpd5MuDuiHI9r0QDVN4d6FIgEgLhDB8I4mfimeOUDg6AEkHhERyKQkx9+EhSQ+IGOREgjODmhIwGTVnz3RERJgp8ETJZv0JGIid+DzwmYL+MLneIkhp8T2EInChNq2jmJTS7hKDEzkvETa2TWDki3ZGC2zdCTMaYbFslQQmyggWk3dFexoTEnICE2NDAp99GjMWck6NDAND1Aj8acomBDw2DeHqJHY85Z0KGBifzpTvt7aHa+63MRoBmTGHRoYGYfo79rXMfOltDAVD9Bj8Z58LzeTrdoYO6/to0Rs3EePdthY3AD8NsBzsNnO2ygH7C2lhGzcR4/22EDDYE36q3k2HxeKxqHSq6MpVVnM91UbO0z7YRgFAQA4FrkLgHqHV6sfTG7QKGNQPH7CM7DbjtsoI9A8RsJzuNuK2w4NBIofifBeeAd+jbYQCfhjKK9j8bGeeBthw2DbPB7Cc4DbztsoJdA8ZsJzgNvO2xMhffo2Th3ru2wgWZCH2oLXMfQdtgYigsYfjauY2g7bKCZ0IPyAucxdGKjXIpDX6AH9QXOY2g7bKAv0IMCA+cxtBU2PvQFelBh4DyGtsMG+gIWSgx6H0PbYQN9gT7UGLiOoe2wgb5AD4oMnMfQdthAX4Dj9wVcx9CbuaZbNtAXGFx+G1x/PcRn/3nvQ8VrO08qqwc/FlneiAfZqoYuqnTrxyV0j9PQd/zdqR6w3FnaIhsZHmYOTn2Y+eC3qGRn7xeBjTIsH9oM91/+Y97FnFjEnFigLBdff/Gn7b79g0C/AQ=='),
			this.addDataEntry(dt + 'date picker landscape dark', 512, 304, 'Date picker (landscape, dark)',
				'7Zxdb5swFIZ/DZed/MFHuOzox8XWdVIr9RolTkAjIQLaNPv1s8FJkxynTTLs9nSjqgTGBvM+xpwXm3g8mT5fV+k8uylHovD4pceTqiybbm36nIii8BjJRx6/8Bgj8t9jV3v20nYvmaeVmDWHFGBdgae0eBRdSpdQN8tCJ9RZOlerlRjKQ34d50WRlEVZtXu5z9SfTK+bqvwlNvaIdlF7snRULmQilRv6fKJqxPPeOrdJusLXopyKplrKLIt81GRdjoDqimYin2S6GCd+l5jWXcJkXfZFArmiVTArwoEi99mjx2S5UF4UJfIazueVzEH5kVIF7aLSy1mzkT5uFyDhrJwp9dIin8zkZiHG6pj1PB3ms4lSM9SHust/q5NyLreVsPkwLc51qaacvxS6VxsX1D8UA3sTAw0HljD4AINUPAKKy+o3hsue5qORyrIr9VW77CoSvqorVcjUeW5VlmYpkyLVCipRywwPWoyD2zY/TVS/u49JJYq0yZ/E1vH/RujA0AOERbO+nNPFfmnXh4vNyEaTH0rRRHW61Hvary5AvnAW6l5ks2chDsUPgfiyb8lVjj5a+ykAKDcBaDPoelB7QHwWRwCIery4IxKZbofJP3E7xGT18Huv22EAxL87WnVj293AMGwX152KKVphR6qoT/qzzGVdGFnqw4TbJcrxuBYNUH1d1YNAxADEDToQxs7EN8UrHxgEJYDEPToSgbQJ+ElQQOIBHYmQRrBzQkcCmlZ890RESYyfBDTLV+hIDIj/CZ4T0C/jC50G8QA+J7CFThQaato7ibWXcEnCj62RWL3x6JcEdNcMHQmjnbBIghJiAwW01fDt6UdHYTYUITYU0GT76FCYHQU6FNBmB+hQmC0FNhQM+uwQHQqzp0CHAhrt49+Ev4ViQJKvie/aVKBDAZ32AN1d4TqWtYQCWu0YHQrnwezqOP2igF579ZoWEQvn0awdFga3jc9uOw9n7bCAfnv1qhYRC+fxrB0W0HC/Ml9Jls3ntVJ/Z8rSOkwyTk06meF60tjuvIJeCEZBAACuRO4ToD7h2eo9k12g0LZTfL7deVhshwX07RSfcXceF1thwaFxp/icu/PAOPRtsIDO/YRJbO/NwnlgbIcFgyzweXfngbEdFtC7U3zm3XlgbIeFaWI5OhbO3/TaYQHNO8axctcxrR0WhsFyho+F65jWDgto3hEOlzuPaWMb03k49N0Ix8udx7R2WEDfjXDA3HlMa4WFD303whFz5zGtHRbQd1sYMv90Ma0dFtB3Yxwzdx3T2mEBfTfCQXPnMa0dFtB3c3y+23VMu+47+mUBfXdy/iO5/L6Px+73wfsmU2192ao+XV1keSPuZKoquqjSjR8j0DmOQ93zWKEusNza2iAbGT5+DY79+HXvqCHZOvtZYGPakA9t/e23/5i3MccWMccWKMvNl1+I6bJv/oDMHw=='),
			this.addDataEntry(dt + 'time picker', 328, 484, 'Time picker',
				'7ZnbbqMwEIafhstWNuZ4maaHi2231XalvVyh4ASrECPwNsk+/drYCYchTdqGqEibKBKMPTZ8/3jwEItMs/VdEeXJA49papEbi0wLzoU+ytZTmqaWjVhskWvLtpH8WfbtnlZctaI8KuhSHONga4fXKP1DtUUbSrFJjaFMolwdFnQmh7yaszSd8pQXVSuZVx9pL0XBX2ijhVYf1ZJEMV9JI5YnUZlX41zP2ZrKi7gyF0ALQdd7b6IymTu4ozyjotjILisWi0T3IHag3RLKFolxcwJHG6NSGxY735qJPDBY+hERgIhYZELQO0EhFHpBoOx8KQ4DXPKlYhelbLGUpzOJghaqVx7N2HIhTciM9cz+qlldNbbCyGZROjFuGYvjlNZuV1wInikpUG28p3PFizjHqmF/TI3Q+7wYDhBj8gCEkNcu3oIBoO6TpIEX+9tzM48CqCZ6VBDFRlp8dCxA0g/QOMiw1S4bM4A5bfB1UE+wo8/jdQHepzPiHYCdY5+NnXd8KpWOLC8pTBJ1zuxLBp9ZnFsHrx1a2zTW4LNbp01AJ1m8fk8m7SKKozJRz4VqfW15ZeuFekJeLrI4vRQso79zNnvRsbUny4LH0a7lYNwW+rYPJOpfhphdJ9IfhhcmneB2jxXPe1s8x22rZ8PMsOtz6vAOgHj45JnBuVbfj8J7O/JthNrwHB+mhnAYdiFgB3PDl2bndNJGCNPGUOwwAvCcUcMjOITwelLuSeBhAM8dF7zOqiWedz54sDjyRgUPOx14ATkfPFg2+aOC57c3kmcNPFjlBKNiR8jhjDfU4wKWMOGo2OH2Hs92e6q/odjBEgbD1xxfGV4n8Hr3KUMtWljd4HHtkDsZr3eDPBS8nupiXFvk7rMWE+d89GB9MZ18n97c7yPYvH8COdVFtK5rf/Lc0gX5KmGCPkurcl3Jmhy8kXyfONuXafhEIrQlAAL4Pa9+XGMraBoJ9tqubftUMbM/cSYvajf1BfbaAXDhdpTl83lJBdB1dxdHSW3Daujx23+Z2zKHA8ocDqCyPK3/8dHdm38I/QM='),
			this.addDataEntry(dt + 'time picker dark', 328, 484, 'Time picker (dark)',
				'7Zldb5swFIZ/DZet8AdflwnterF2rdZJu5xQcIJViBF4TbJfPxs7CWCS0jWgIi1RJHzsg+F5jw8+xEJhtr0rojx5YDFJLXRrobBgjKujbBuSNLWgTWML3VgQ2uJnwS8nekHVa+dRQda8jwNUDq9R+psoizKUfJdqQ5lEuTwsyEKccr6kaRqylBVVL8JQfoW95AV7IfueNVsTaUyimG1EG4hGVObVKW6WdEvE/HM9Nyk42Z68/sqkL/6OsIzwYieGbGjMEzUCQV+5JYSuEu2GfayMUakMq4PvEYc40ES66SCDDrLQDNnvZORUH2lna16zL6vPKXZRSldr0VwIFKSQo/JoQdcrYbL1uZ7pHzmr44u2xEgXUTrTbhmN45Qc3eaMc5ZJKeyj8Z4sJS+E+6oB/02NwP24GNgQY/ZgCCGunZ+DYUA9JUkNL/D2bT2PBCgnepQQ+U5YPLsvQNQNUDuIsFUuO30C3azxxXZHsNsfx+sYeJ9GxDsAOwxHY+f2z6LCkeYlOZMkOpPBRxbn3sFthtY+jdX4HNZpHdBFFq/XkUnbiOKoTORzoVpfe17ZdiUfjterLE6vOc3Ir5wuXlRsNQH6djgPsQGw3vNm3Bbqtt9I1D81MXhMpN81L4Bawe30Fc89Lx52mupBMzMcxlw6vH1DPDBOZugN73zkQ9tuwsOemRqCYdgFBjszN3xqdriVNgIzbQzFDtgGPDxpeAgEJryOlHsReMCA50wLXmvVItcdD55ZF7mTggdwC56PxoNnlk3epOB5zY3kqIFnVjn+pNgh9HbGG+pxYZYwwaTYgeYeDzod1d9Q7MwSBpivOT4zvFbgde5Thlq0ZnUDprVDbmW8zg3yUPA6qotpbZHbz1qA8Hj0zPoinH0Lb+9PEazfPzI5HYtoVdf+YLmlCvJNQjl5FlbpuhE1ufFG8n3i7F+mgQuJ0JTAEMDrePXjaFtB0ojT12Zt26WKnv2JUXFRh6mvgNsMgCunpSxbLkvCDV0Pd9FLamhWQ49f/8vclDkYUOZgAJVF8/hnjxpe/y/oLw=='),
			this.addDataEntry(dt + 'time picker landscape light', 512, 304, 'Time picker (landscape, light)',
				'7Zldb5swFIZ/DZet/AEkXCZp14u1a7VO2uWEghOsQozAa5L9+tnghI/jNKlSsiKNKBIcc7D9vPaxDzh0lm7u8jCLH0TEEofeOnSWCyGrs3QzY0niEMQjh944hCD1d8iXA6W4LEVZmLOVPMWBVA6vYfKbVZbKUMhtYgxFHGb6NGdz9cjpgifJTCQiL0vpojyUvZC5eGGNElYeuiQOI7FWRqwuwiIrn3Oz4BumGjE1DWC5ZJuDnShNpgd3TKRM5lt1y5pHMq7u8LBpecz4MjZuFLmVMSwqw3LvWzNRJwaLHREFiKhDJxS9ExRCgT8ea7tYyeMAV2Kl2YUJX67U5VyhYLm+KwvnfLVUJmSe9cz/6Fo9BWiqMfJ5mEyMW8qjKGG121RIKVJV4KPaeM8Wmhf2T1WDHFUD++Oe1HCBGpMHoIRqvHyLBqB6SJMGXzzaXZt6NEFd0aOmKLfKMkKnEqR2glvj4PqVyzGiLjofqAeAPl0Q6EfQGqHL0fJPj5fKkWcFg5GgDoy2GX/ODDQOhJje7wjB4bSfSE1Ae+M5hEaWcNlFFIVFrIN/OYd2vNLNUi+D18s0Sq4lT9mvjM9fqtF0IJSCNWdfcnSk5lW3j0Tjn4YYqaPld8Mr6IxmrxMe8Kla+m9qiTFqa4ksox1Zo+35Wo6BlvjDQ4N7o38WmB8wEajnteBRyM4N+gkUAUAHI8WnRheQFjqfXgzdbsQ32LkDY+e256xnGXd+T/AwgOcNC57XWbzGcPXqDR5Mh/xhwcPtgEcsq0Vv8GCiNBoUPDLC/27kwbxmPCx41D8e8/paMGAOEwwLHumMvN2G7hLwYEqD4buNT02PtlcM21alr2kLsx08rC1yN+jZtsh9wbOkFwPbJHeWW0ui3Rs8mGDMJt9mt/eHADa7TyGmOqeu0twfInOq/Hwdc8melVW7rlWKDt5Cvk+bdyfIb2vQiZxAgN3boaYAu7UpZ0ko+Ws7t7WpYmp/Elw1al/1FfbbyfmV11FWLBYFk0DXfS9OkprAfOjx63+Z2zIHPcoc9KCyuqy/8lS3Nz8C/QU='),
			this.addDataEntry(dt + 'time picker landscape dark', 512, 304, 'Time picker (landscape, dark)',
				'7Zldb5swFIZ/DZet/AEkXCa068XatVon7XJCwQlWTYzAa5L9+tlgEsDOl1KyIi1RJHzMwfC8x8c+xMFhun7Ioyx54jFhDr53cJhzLqqjdB0SxhwEaOzgOwchIH8O+rKnF5a9IItyshSnOKDK4T1iv0llqQyF2DBtKJIoU4c5mclLTueUsZAznpe92EXqK+2FyPkbqXuWfEmUMYlivpJtKBtRkZWXuJvTNZHjT/XYJBdkvff+S5O++QfCUyLyjTxlRWORVGd4UN90Qugi0W4YuJUxKirDYuu7wyEPNBE7HWzQwQ6eYHAmI6/8KDtfioZ9Xn72sYsYXSxlcyZRkFydlUUzulxIE9DXeqV/1Kie4q8w0lnEJtotpXHMyM5tyoXgqezwwc74SOaKF/RPVQMdVQP6457UcA01Jk+GEvLmxSEaBtV9mjT4wlHd1uMogmqgZ0VRbKRlBE4liO0EN9rB9SuXY0RdcDlQzwD6ckWgH0FrBK5Hyz89VUpHmhXkQCawzvhLZqB2QEg/fU3IDKftRGoC2hovITSypMsuojgqEpX8yzlU80rXC7UC3i7SmN0KmpJfGZ29VdHUBjgG4TR0DYDNnqORmleP3Q3UjjY/NTG0y5bfNa+gE81eJz3AU7X0D2oJIWhrCSzRDqzZ9nItx4aW8DqpwfuYiSDlbMHDJjs36CdRBAY6M1N8anQBaqHz8dXQ1RHfYOcOjJ3bnrOeJe78nuBBA543LHheZ/Eam6tXb/DMSsgfFjzYTnjIslr0Bs8slEaDgodG8N9FnlnXjIcFD/vHc15fC4ZZwwTDgoc6kVdv6K4BzyxpoPlu41PTw+0Vw7ZV6WvamtUOHNYWuZv0bFvkvuBZyouBbZI7y62l0O4NnllghJNv4f3jPoDNx8cmpl1NXZW5P3jmVPX5KqGCvEqrcl3JEt14C3meNmcXyIc16GROQ4D67VBTgHptygmLBH1v17Y2VfToL5zKm9oOfQP9dnF+43WU5fN5QYSh6/YpTpIamfXQ89f/MrdlDnqUOehBZdnc/cFTnd78/+cv'),
			this.addDataEntry(dt + 'year picker light', 328, 484, 'Year picker (light)',
				'7Zhbc6owEMc/DY+dyQURHj308nAu7YydOc8ciZJpJExIq/bTnw2kKiVSsaVP4OiQ3Ww2/n9x1sWj8Xp7p5Ii+y1TJjx649FYSanru/U2ZkJ4BPHUo9ceIQjeHrk94cWVFxWJYrk+J4DUAS+JeGa1pTaUeiesocySwtwqtoAlfyy5ELEUUlVeuqwusJdaySd25GHVZTxZksoNGDEMbD6mNNue3HNlshu+Y3LNtNrBlA1PdVbPoCSswzLGV5kN80O/NiZlbVjtYw8SwI1Vwa0IbSnymD17BOLQrFDwiWlPiRCKgjA0dpnrj6XLZW5USwRf5TAUbGnWLItkwfOVUTGwS835q0lKKYyNoHyRiJmN+ie1lmtwKFbCtL9WubMJkMsIREFtU0wkmr+wxvqfoeK3qACIaQsEfCXtUGPN09RMeU/gtroO6j7KAhxBp9x4AmOT595M0TswTdHlQtMLjzoaSOiJS2i/t9Bvp3cBX5SptvL+tXk5lP3e8+qHPWW0KR4kh8wE7ZrH/i1CLpcl0y3Z9xs7i0TgIjEZSXSSwL4/AIqpC0UwouhGEZEBUIRfUwg+QtGo2RYFib4dxaRvPXWj2JeLL0URuVCE46+iG8UgtQIjF4toZNHJgg5SLDB2sLBt2MjiJItBqgVu97fx7E988+sUjWMtaUdZaDQM5u//JuOazcFqQjfQzzeaCNQb9Nxu7bP4mgG7xugI7RQ5ik/fHuMdWZv6Cgeokf1qMkQ1wu3G/f7niLmJORoQczQAZRgenoXV048flf0H'),
			this.addDataEntry(dt + 'year picker dark', 328, 484, 'Year picker (dark)',
				'7ZjLbuIwFIafJstKviQhWdK008VcOhKVZp0hhlhj4shxC8zTzzE2lDSXIS3pKiBQ/NvHdv7P6HDi0WSze1BpmX+XGRMevfdooqTU9mqzS5gQHkE88+idRwiCj0e+dPTiQy8qU8UKfUkAsQEvqXhmVrFCpffCCVWeluZSsSVMebviQiRSSHXopT4xb9ArreQfduwpZMGMmKeZ3EIbQ8MtxZRmu87tHiS31wcmN0yrPQzZ8kzndgQlkQ3LGV/nLsyPfCumlRXWp9jXu4cLZ0C7GbRhxlP+7BGIQ/NSwTemA90JDi+jy0Kf6avDq8u1VPB1AU3BVmbOqkyXvFgbF0M31YL/NYtSCm1jKF+mYu6ifkut5QY6wGb9aGL1HuQZAkmxCiJ/OTMvhkLeByUOraaYSDV/YbX5PwLKb4ACNrMGG2NAi0EbnmVmSDcUa/iTLKEj7CWAj3CvYzR95+lHIxkdtBntDzb6eKCXcKNM9Tj/1tnPPa9+NNBGt8RPyWFlgvb1Y3+MkKtVxXTD9tPGLiIRtpEIJhK9JLDvj4Bi1oYinFD0o4jJCCii6ySC/6GIUHKb+HUUJP50FMHQfNqO4pQurooibkMRTb+KfhSj5AqM2ljEE4teFnSUZIFxCwtXlE0sOlmMki1ws9pN5j+S+29dNM69pD1poVYwmL//25xrtgDVhG6huq8VEWgw6IXb2kfx1QP2tdYZ2hlqST5Da4w3ZN3SNzhEtdVvgjGyEW7W8o9fJ8x1zPGImOMRKEPz9cmYHX7+4Owf'),
			this.addDataEntry(dt + 'date picker landscape light', 512, 304, 'Date picker (landscape, light)',
				'7ZhNb6MwEIZ/DceubAwEjlnS9rDbdqVU2rMVnGCtg5Fxm2R//Y7BSSCQJrRB2gNEkZjxjD/exwYNDonX20dF8/RJJkw45N4hsZJSV3frbcyEcFzEE4fMHNdF8HfchzOtuGxFOVUs09ckuFXCOxVvrPJUjkLvhHUUKc3NrWIL6PL7kgsRSyFV2UqW5QX+Qiv5h9VaWHmZlpQmcgNODIYdjynNtmfnXLrshB+ZXDOtdhCy4YlOqwgf24mmjK9Sm0aQVzlpUTlWh9yjBHBjVehWhLQUeU3fHBfyAlgURrCGaa4gApOeUiEUBWFo/DLTlyXMZGbUo4KvMjAFW5o+i5wueLYyaga2qzn/awYlBGwjLF9QMbVZWubHpFdjzLB3LQb3IgYchANh8FoYQPFJS3GYvu5Y9poniQk5lfqhvE4VCT7UFftgm3FeTIjegWtidoFiBQT8tmJcvbfJ50T1qnOMFBNU83fW6P8rQvtdQnu9hd5v0wUslKm28t7M/DqU/aSMZ/amTUDfiBvarJqyxPM6tmswkLJBl7L+qOx5Ze2ovySHybho1+xmnyGXy4LpFonDXK+CM+mCE4xw+sKZuAPACW/z8L8Ep/FCtnDc6H+As/d9EQ5G4QB0oi464Xh0etPxhzg7GHXhiUY8vfGEQxwejDvw2CJtxNMDz6FEuC2edkEcT5/j+5/nANXlJR+8YhoFhykfNinXbA5ek7pRtFan2Yh+7Od2ajciahN2DauGdoLaZP2+NcoJWTv0HQ5QY/S7fce3Rd2u9F9+jJibmKMBMUcDUAbz+PGsCq9/W/sH'),
			this.addDataEntry(dt + 'date picker landscape dark', 512, 304, 'Date picker (landscape, dark)',
				'7ZhLb+IwEMc/TY5d+ZGEcKTp47CPrkSlPVvEEGtNHDlugf30O04MTUigpCVSDzFCiscz9vj/s0ETj8br7aNmefpTJVx69N6jsVbKVE/rbcyl9AgSiUfvPEIQfD3ycGIUl6MoZ5pn5pIAUgW8MvnCK0tlKMxOOkORstw+ar6AKW+XQspYSaXLUeoT+wF7YbT6y2sjvGx2JGWJ2oARQ8etx7Xh25M5lyaX8CNXa270Dlw2IjFp5RFgl2jKxSp1YRT5lZEVlWF1iH2TAB6cCt2K0JYiz+mLRyAuhE1hBHuY5Ro8MO0pVVA2a1eZqdmXZWtJmKnMqsekWGXQlXxp5yxythDZyqoZuqnm4p9dlFLoW2HFgsmZizIqfwt6tp077F+KgbyLAYfRQBj8FgZQfNJSHNI3HdteiySxLsdSP5TtWJHwrK7YIrPrPFkXswPTxJ4CzQtw+OPEuPhs04+J6lf3GGkumRGvvDH/Z4QOuoT2ewu9P6YL2CjXZw75sbIflPHE2XQB6BslkYuqKUt9v+O4hgMpG3YpG4zKnlbWrfpbCUiGoF1zmn2EWi4LblokDrleBGfSBScc4fSFMyEDwImu8+P/HpwIxbex34RDpl8Bzt72STgYRQPQmXbRicar05tOMMTdwagLz3TE0xtPNMTlwbgDjyvSRjw98BxKhOviaRfE8exXfP/jFKC6vPTMX0yj4LDlwyYVhs/BakM3mtXqNOfRj/3cpXYloi5g1+jV0E5Qm2zQt0Y5IuuWvsEhaqx+s5/4uqjblf7T9xFzE/N0QMzTAShD9+3lWeVef7f2Hw==')
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
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#009587;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, hover))');
			}),
			this.addEntry(dt + 'checkbox on focused pressed light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#009587;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#009587;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, focused or pressed))');
			}),
			this.addEntry(dt + 'checkbox on disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#B0B0B0;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, disabled, light))');
			}),
			this.addEntry(dt + 'checkbox on disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#B0B0B0;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, disabled, focused, light))');
			}),
			this.addEntry(dt + 'checkbox off hover light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, hover, light))');
			}),
			this.addEntry(dt + 'checkbox off focused pressed light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, focused or pressed, light))');
			}),
			this.addEntry(dt + 'checkbox off disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, disabled, light))');
			}),
			this.addEntry(dt + 'checkbox off disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, disabled, focused, light))');
			}),
			this.addEntry(dt + 'checkbox on disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#676767;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (on, disabled, dark))');
			}),
			this.addEntry(dt + 'checkbox on disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=none;fillColor=#676767;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (on, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'checkbox off hover dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#ffffff;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, hover, dark))');
			}),
			this.addEntry(dt + 'checkbox off focused pressed dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#ffffff;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, focused or pressed, dark))');
			}),
			this.addEntry(dt + 'checkbox off disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Checkbox (off, disabled, dark))');
			}),
			this.addEntry(dt + 'checkbox off disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'checkbox;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Checkbox (off, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'radio button on hover light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#009587;fillColor=#009587;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, hover))');
			}),
			this.addEntry(dt + 'radio button on focused pressed light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#009587;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#009587;fillColor=#009587;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, focused or pressed))');
			}),
			this.addEntry(dt + 'radio button on disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=#B0B0B0;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, disabled, light))');
			}),
			this.addEntry(dt + 'radio button on disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=#B0B0B0;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, disabled, focused, light))');
			}),
			this.addEntry(dt + 'radio button off hover light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, hover, light))');
			}),
			this.addEntry(dt + 'radio button off focused pressed light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, focused or pressed, light))');
			}),
			this.addEntry(dt + 'radio button off disabled light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, disabled, light))');
			}),
			this.addEntry(dt + 'radio button off disabled focused light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#B0B0B0;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, disabled, focused, light))');
			}),
			this.addEntry(dt + 'radio button on disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#676767;fillColor=#676767;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (on, disabled, dark))');
			}),
			this.addEntry(dt + 'radio button on disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#B0B0B0;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#676767;fillColor=#676767;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (on, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'radio button off hover dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#ffffff;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, hover, dark))');
			}),
			this.addEntry(dt + 'radio button off focused pressed dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#ffffff;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, focused or pressed, dark))');
			}),
			this.addEntry(dt + 'radio button off disabled dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;aspect=fixed;sketch=0;');
				bg1.vertex = true;
				return sb.createVertexTemplateFromCells([bg1], 16, 16, 'Radio button (off, disabled, dark))');
			}),
			this.addEntry(dt + 'radio button off disabled focused dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 48, 48), 'shape=ellipse;labelPosition=right;align=left;strokeColor=none;fillColor=#666666;opacity=10;sketch=0;');
				bg1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(16, 16, 16, 16), s2 + 'radiobutton;strokeColor=#666666;fillColor=none;strokeWidth=2;sketch=0;');
				part1.vertex = true;
				bg1.insert(part1);
				return sb.createVertexTemplateFromCells([bg1], 48, 48, 'Radio button (off, disabled, focused, dark))');
			}),
			this.addEntry(dt + 'switch on light', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=on;strokeColor=none;fillColor=#0E9D57;sketch=0;');
				bg1.vertex = true;
			   	return sb.createVertexTemplateFromCells([bg1], 36, 20, 'Switch (on, light)');
			}),
			this.addEntry(dt + 'switch on dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=on;strokeColor=none;fillColor=#80CBC4;sketch=0;');
				bg1.vertex = true;
			   	return sb.createVertexTemplateFromCells([bg1], 36, 20, 'Switch (on, dark)');
			}),
			this.addEntry(dt + 'switch off light dark', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 36, 20), s2 + 'switch;aspect=fixed;switchState=off;strokeColor=none;fillColor=#0E9D57;sketch=0;');
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
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=10;shadow=0;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=10;shadow=0;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=10;shadow=0;',
					200, 10, '', 'Slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=30;shadow=0;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=30;shadow=0;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderFocused;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=30;shadow=0;',
					200, 30, '', 'Slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=0;strokeColor=#bbbbbb;opacity=100;strokeWidth=2;handleSize=20;shadow=0;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=50;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=20;shadow=0;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=100;strokeColor=#3F51B5;opacity=100;strokeWidth=2;fillColor=#3F51B5;handleSize=20;shadow=0;',
					200, 20, '', 'Slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=none;handleSize=6;shadow=0;hPos=0;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=50;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=100;',
					210, 20, '', 'Slider (disabled)', null, null, this.getTagsForStencil(gn, 'slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=0;opacity=100;strokeWidth=2;fillColor=#000000;handleSize=10;shadow=0;',
					200, 10, '', 'Discrete slider (normal, light)', null, null, this.getTagsForStencil(gn, 'discrete slider normal light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=60;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;',
					200, 10, '', 'Discrete slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=100;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;',
					200, 10, '', 'Discrete slider (normal)', null, null, this.getTagsForStencil(gn, 'slider normal', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;barPos=1;strokeColor=#BEBEBE;opacity=100;strokeWidth=2;fillColor=#BEBEBE;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;barPos=60;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscrete;barPos=100;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (focused)', null, null, this.getTagsForStencil(gn, 'slider focused', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=0;bright=1;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (click)', null, null, this.getTagsForStencil(gn, 'slider click', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=60;bright=1;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (click, light)', null, null, this.getTagsForStencil(gn, 'slider click light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=100;bright=1;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (click, light)', null, null, this.getTagsForStencil(gn, 'slider click light', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=0;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=50;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDisabled2;strokeColor=#b0b0b0;strokeWidth=2;fillColor=#b0b0b0;handleSize=6;shadow=0;hPos=100;',
					200, 20, '', 'Discrete slider (disabled)', null, null, this.getTagsForStencil(gn, 'discrete slider disabled', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'slider2;barPos=0;strokeColor=#ffffff;opacity=100;strokeWidth=2;handleSize=10;shadow=0;',
					200, 10, '', 'Discrete slider (normal, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider normal dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=0;bright=0;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (click, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider click dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=60;bright=0;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
					200, 45, '', 'Discrete slider (click, dark)', null, null, this.getTagsForStencil(gn, 'discrete slider click dark', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'sliderDiscreteDots;barPos=100;bright=0;strokeColor=#0F9D58;opacity=100;strokeWidth=2;fillColor=#0F9D58;handleSize=10;shadow=0;fontSize=12;fontColor=#ffffff;',
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
				'7Zhvj5sgHIA/je/5o619uXO9y5KtW7LtA3gTKxkVg+zWfvuhQK8W2dwOlt1ykqb6U1CeBxBMcHE43omya97xirAEbxNcCM6l3jscC8JYggCtEvw6QQioX4JuPWfheBZ0pSCtXJIB6QwPJftGdEQHenliJtA3ZTfsCvJFFXnTS8G/koIzLlSw5a06d1NTxmwoQbgeNxU3pRMhydH7hGPIPN4d4QcixUld8p1WstFXrEGqszWE7huTLV3nOlj2OrA/532ssNoxdZ6vP3bqD70AVE7a9WQhgxTl2W06xHkr/5gN+iUbNIPGxgRhpaQP05rN4TJ3+MCpujECx2kxp+mhLYDXdU+kQ/v8mIsEpI6AXXkgKsLr0QLp1J/fydJGaUIlo/tWHTJSS6PmoykUBlQCQDQn2Sq+k2z5oMDoyLWigwjK2xG1GEBcOVEt/35M4TDDOcqbVRDMGE4wZzEwr6KMvffVkMJRzizRS8xwA4JgXoEp5jwC5rWDuXi/+/Rm93kbAvcwzNd/YZiHALkacJjGfmUBrVEEDbmr4dWu2L4NIeEM+0pCDob0PCRASz2qhY1jwT/o/N58Z0OG9D/Nd7B91wY1YN9aP5/xPP1V4J/xXMgpx+1Zznwi2YGOHfzSQTwdJLWDR1gF7pp0poP4rbx0kKh23BWz18Q/tzjIgnC+WhtgOxd+Cmd1+PjRR19++U3oBw=='),
			this.addDataEntry(dt + 'editable steps', 704, 72, 'Editable Steps',
				'5VfRbpswFP0aHhcZm5DkNcnal1aq1Ic9u3ABqwYj43bk72djk4ZBVqpgbdKwEtnH9uX6HPsAATmU7b2kdfEoUuAB+R6QgxRC2VrZHoDzACOWBuQYYIz0L8B3V3rDrhfVVEKl5kzAdsI75W9gEQs06sQd0BS0NlUJiQ65b5QUr3AQXEgNVqLSffuMcd5DASZZd2ncRQepoL2aYQe59O5BlKDkSQ/5yVJV2BEbFNlpBbC8cNM2LlXa2HZ+nvqxXl1xS55ePhkt/xm4WSdGCS1ryvLKkAFKsSpvrlKjg7K6gZnsRHi7vosMLip1gaPu0jinL8CfRMMUE5Vh3i56T7nJhxw5ZJ0SNU10Wg9d6xgiF/HZ5RfO5R9/yj+eoL/HJHCq2DsMwk9p4u7wJFhl+G2HYU7DZh9AZJlmfyTpOc1ZKkefb/KUNgWY4YbFXtayzc3BXOVlyleQMj/bn0zT7yag1XpA0Ll9IU+IxvL02I3yfBvevW8uKs96vgdxVo1PmWb8pSvLbfidP0YxigeUktADpfGI0oMEqsDcxzgaTfVfLsVbvZCn7cAUL57273sY+U1SLya2WcLEkgKS16kDdLYs2/PD8Ybn8h/fbmLYn4kN5fFiYtv/ysSiGPk3sd2IUuLZrb724P6rnrOOt/49p98tf3yO3Pi54KB577YXWm2RKctpFU69RS0l1g4vLpZufnwm2uGXX5G/AA=='),
			this.addDataEntry(dt + 'noneditable non editable steps', 704, 72, 'Non-editable Steps',
				'5VdNb5wwEP01HLMyNuzHdXebXFIpUg49OzCAFYORcVL239fGZgMFukQFVVWwdoXHnvHMe/az8Mgprx8kLbPvIgbukW8eOUkhlH3L6xNw7mHEYo+cPYyR/nn4fmLUb0ZRSSUUao4Dtg7vlL+BtVhDpS7cGaqMluZVQqRDHislxSucBBdSGwtR6LFjwjhvTR4mSfNou4sOUkE9mWFjcuk9gMhByYue8pPFKrMzdiiwbhmwNHNuO5cqrWw/vbp+1KtfXMnj5ZNB+c/ATZ0YRTQvKUsLAwYoxYq0moRGB2VlBTPRCfA+vA+MXRSqY0fNo+2cvgB/EhVTTBQGeVv0kXKTDzlzSBomShrptB6b3tlHc/HGN/HGI3C3NgmcKvYOvfBjHLgVngQrDJ51P8yl320DiCTRaA8ovKY5i9Xg9qaOaZWBmW5Qa2nM69QcxE2ax3wTZRC9Dhjtbm478sPBhufCT8bhdw5oE/YAuvY79Ph4SI+PFqHnbttb/S5cgZ5wvuZwVgxPlebgpWnLbfgDWg1RjPqQEn8FSLcDSKcxXUasPifx/1RyyG8MrKI5uwEDJwlUgVnH3CE01n+pFG/lX1+wrWni9rh9SxjPZ7e+vyCFaOQULcUhQetzuP9SwhRs+5CuIkyHAaRkIWE6gGn/tTCF2/36m7rdLX9UpmUUaZ7ydLjaI9OW48r311Og8IAXJ0t3Pz717PTul+Av'),
			this.addDataEntry(dt + 'mobile step text', 358, 642, 'Mobile step (text)',
				'3Zhdj6IwFIZ/DZeaQvnQS8VxLvYjm51Jdu82HSkfmUJJ6c7q/vottCAIjKiwMxmMxh562vI+ffWABt14f89QGn6hHiYavNOgyyjl8lu8dzEhmgEiT4MbzTCAeGvGtuesXpwFKWI44UMSDJnwgshvLCMykPEDUQEPZSHOuwMNrrMQpXmc4Z0Yf+1HhLiUUFZ0hetN/sq7cUafcXkmoYnIWaupMON437vcIqTWeo9pjDk7iC5/Io+Hsge0FjItxFEQqjTbVAtHmQwEVe7x6sUXJUC3GLAlhi7WsoLgIk0QiYIkb8rVnWoEoe1s7D6NfJrwWudtceSdU7SLkuC7umLzGHqkqQjoKvdBrRGU7ehv3tShaDOcidYPpaQ+lIhxHRHDlDGGCeLRC26Mfwsl88otG++D3GbzIPbInNP01xNiN21V2C1MM+GgXDi3ZLsmm2m3VdMvVU3N/41GYlnV5LOl0Zh+5jRHoL6fYd5SvbqKQSCsFgiXYcTxRW7pdkHTMqaxsLZm5w6u7XEDnPePNMtSBHK20Q6RlXIrz89U3iXY58esz0Vr4xgTW8ayb4N/aDpvVNj2GK5LGfaxkGmHs4Ho/eIYqrt1VvdSm4bnbpR93xympAAmoOC0KDxwnIqIuCxAffFhj+4+38pf59xX/MOcuA8Ux0ju0+2J3WcuRnHfYgruiw732YQXioj5wHrlfnpH4O3i6OAcR56XL29i1IdGwn8CP1vaE5Bftsh/vfv5KKmLPRDwSqqxyKvQhNDLyvikqB2OfTGk8qph1wEYH3tZalWDj8pdB1f+4V5g8Or3edw7g7dxXznOuBT0McqeJ7R7biGpFzd9XGRGyWVw+Sn3Tq8/wLws3V+5OdG7CqWRbk6cxuyT3JvoAx5slKxEZpRm+F0R+viA2g9begF1/qS9JR3no+ERzeMzR9m9/kjyHw=='),
			this.addDataEntry(dt + 'mobile step dots', 358, 642, 'Mobile step (dots)',
				'7Vlbb5swFP41PKayMZfkMZemD7to2iptb5MbDEF1YmS8Ltmvn8GGQCANSUwitXUUCR98bPN9/ozPwULT1eaB42T5hQWEWujeQlPOmFBXq82UUGrZIA4sNLNsG8i/Zc8P3IX5XZBgTtaii4OtHF4w/UOURRlSsaXaEOB0SbLmwEKTdImTzM7JQvY/CWNKp4wynjdFk1n2y5oJzp5JcWfN1tJnoociXJDNwenmJj3XB8JWRPCtbPI3DsRStUDuULktSRwttZvn6InjVBmi0nf39PJCA9AOBmqAAeVcxgichAmmcbTOqmp2+xgh5Pkz7xBGIVuLSuN5XrLGCV7E6+i7fmJnZ3pkiTRA7ftDzxEU9fhfVoVI1jlJZe2nRhJ2ZcQ+jxHbUTZOKBbxC6n1fwlLzplLdrWJMpndRauA3gmW/H7C/KKlitqBqTtstQrvXFWvwOZ4TdTgqajp8b+xWE6rHHwwsmvDD/x6DywMUyIaqJdP0YkIt0HElBMsyElqaVdBXTKOPXTnTusKrqxxGxzXjxLLSBoybuMFpmOtVpHdKbVLSSh2Xp/z2sy3e5aM611G/rauPKNkeyZUl3ASEgnTgqQdqQ/z0hV39yjuBTY1zV0I+6beTcEC6IEFv4UFj4ocHzkemIynn4zLL3Sz3zH55a+YPfl5eWlR2yoOgmx6rwsOehcKbltzOCY/Z2hEfoOR1wPzwwbzX+9/PSrW5RqIRAmVKeYrJxIjFBfnob2jTHeS/S7v2wrJEADzJBcv2LJzoyyPju+yBY3SMU5S0lHDOC9mkG47y7QcZczsqgMH1bdV2APsEHzgvo97seP0ijv8wL2xsVxjvXcI+8/DvTyq94R7y2vbzIZeD9d6ObzBZn7hva926F9hsXdIGLwz2JF9Bdib6YEG7JdGJiAvxlNbtwkbin7MsmAkbn/Ci+cGJdXo/BAvyqPgpXP+BB4I5EutFLmnV7JrsC3SN5Rdq+9avSTXYFuof+KudUuG3j5BzYj8IEGtW9ot2fHfGj2yuvtopppXv6n9Bw=='),
			this.addDataEntry(dt + 'mobile step progress bar', 358, 642, 'Mobile step (progress bar)',
				'3Vhdj6IwFP01PGpKy4c+Ko7zsB/Z7E6y+7bpSEEy1ZLSndX99dvSgqCoqDUzGYwJvb23vZzT015wULTaPHKcL7+wmFAHPTgo4owJfbfaRIRSB4IsdtDMgRDIvwPnR3rdshfkmJO16BMAdcArpn+ItmhDIbbUGGJcLIlyBw6aFkucKzsnCzn+NMkojRhlvHRF05n6KTfB2QupetZsLWOmZirCBdkcTbc0mVwfCVsRwbfS5W8Wi6X2QP5Ihy1Jli5NWOCZxHGhDWkdu3t6eWMA6AYDHYDhylwmCFyECaZZulZNnd0+RggF4Sw4hlHC1qLhPC8v5ZzjRbZOv5sn9namJ5ZLg2tif5gcQdXO/qmmi2Sbk0K2fhok3b6MwOsYgZ62cUKxyF5Ja/xbWPKuXLKrTapkNkxXMR0Klv9+xvympYq6gWkHbI0Kh75uN2DzgkPU3EtRM/N/Y5lMq558MIat6QdhewSWJAURB6jXT9GLCP+AiIgTLMhFaulWQVsyHhz5c69zBTfWOATn9aPFMpYGxW22wHRi1CpUT61dShKxi/pctmYhvLNk/OA28rdt5VklO7ChupyThEiYFqToSX1SXn1x98/iXmHT0tyNsG/aw1QsgDuwEHawEFBR4iPnA9NJ9Mm6/BJf/c7Jrzxi9uQXlFeH2lZZHKv0TgvODW4U3LYVcE5+3siK/Abj4A7Mjw6Y//rw60mzLtdAKmqobDHfqEisUFzVQ3ulTH+Swz7nbYNkFwD7JFcHbD24VZbHdnZZlkqpFtOO+qZ5muqeSs6K23jjqoGHoR1K6qLnRBHkurBjRwZ2SAraW/LAvwNlVa7XvkL12YFBeVkv4d9me6zGscuCa0M5z3jx0iWZugo5xktbSr3rRL12TugH9hBQV0Vj6S0ibMvnHi8RlfxPEVdxJSOzvCDviqGPT9DhV5GjBHVuaW/JTvjR6JHN3cdB7d78dvgf'),
			this.addDataEntry(dt + 'editable steps optional', 704, 72, 'Editable Steps (with optional steps)',
				'5VfBjpswFPwajhsZOyHJsUm6e2nVlfbQsxceYK3B1Dgp6dfXxoaEQrpUAVVVgxLZY/v5vRkzAY/ss+pJ0iL9LCLgHvnokb0UQtlWVu2Bcw8jFnnk4GGM9NfDjzdG/XoUFVRCrsYswHbBifIjWMQCpTpzB5QpLUxTQqhD7kolxRvsBRdSg7nI9dguZpw3kIdJXH807qKDVFDdzLCGXHpPIDJQ8qynfGeRSu2MNVraZSmwJHXL1i5VWtp+0i691KsbruTh8kmv/Bfgpk6MQpoVlCW5IQOUYnlS3qRGB2VFCSPZWeLN6nFpcJGrKxzVH41z+gr8WZRMMZEb5m3RO8pNPuTAIa6VKGio0/pU9w4+chFfXH7+WP7xu/zjAfobTAKnip2gE35IE7fDs2C54bfqhjl3u00AEcea/Z6kbZqjVF6+f8gjWqZgphsWG1mzKjE35iLJIr6AiM1z/Mkw/W4BWqw6BLX9K3l81Jenwe6U56G7e9OdVJ7VeA/iLO/fZZrx1/qa7sBv52MUo6BDKfFnoDToUbqXQBWYfYyj0Uj/JFIcCw8H3JzriJ10M1E1hxYyZtKRIfh2FM3AQ8l+aPSDnuD7RXUZNNbZCnMBG4muILvbl8K4HOXNrro0u3E3GQ13UpzEibdgrlmcOFUZ/2dMmPxyJmdx4fUULhymEL4NOUDruXbkq+MNj+U/uN+F8Xwu3JVnFhfe/FcuvAzQ/C687VFKZjauP3vy+Kueswo283tOc1p++0d45/uOg8Y9nF9ptUHmmk4rf+gxcCqxtnhysXT38p5rp1+/Bv8E'),
			this.addDataEntry(dt + 'noneditable non editable steps optional', 704, 72, 'Non-editable Steps (with optional steps)',
				'5VfBjpswEP0ajomMHUhybJLuXlp1pT307IUJWGswNU6W9OtrY5OFQhqqgqqqQYnsZ88w894wDh7ZZ9WjpEX6WcTAPfLRI3sphLKjrNoD5x5GLPbIwcMY6a+HH26s+vUqKqiEXI0xwNbgTPkJLGKBUl24A8qUFmYoIdIud6WS4hX2ggupwVzkem13ZJw3kIfJsf5o3HkHqaC6GWENufAeQWSg5EVveWOxSu2ONVpZsxRYkjqztQuVlnaeXE3f89UDl/Jw+qSX/jNwkydGEc0KypLckAFKsTwpb1KjnbKihJHsrPAmeFgZXOSqhaP6o3FOX4A/iZIpJnLDvE16R7mJhxw4HGslChrpsD7Vs4OPxvKN7/KNB+huMAmcKnaGjvshDdwdngTLDZ9V182lO20ciONRs92T8BrmKFVX94s6pmUKZrthrZExqxLzIC6TLObLKIXotadou7jtyldHGx5LPxmm3xmgZdAh6DpvyePjvjw+mkSeRdi5+yKYQZ5gfM/hLO8/VVqDl/qaruC3aDZGMepSSvwZKA17lN7mdJpm9Xst/q+2HPKTArP0nHVPgb0EqsDcx5whNNY/iRSnwsMhN+07Zmc9TFTNoYUMx+boudIcfjsJu6Ep+RbUErcBjYPFm6Pwg96SC5lRE6e1qNdL9h3squ8XVdujjeZLYc4dY2Wj0qnbwLrBariTwh/+bWigG2fi/bPPWD67+/t6nqqMu+FUNYoG2sRURUrQ/EW6+a867yrsUjpL5932KCUTdd4tmOuf7rxBuJm/qJtq+WXrnaY5jWtCLa02yFzTaeX783WgYIsnF0tP399l7fb2q+4P'),
			this.addDataEntry(dt + 'mobile vertical stepper', 358, 642, 'Mobile vertical stepper',
				'7VrZcpswFP0aHpMREov9mDhJpzNt2mm6PHYUI4ymYinIrd2vr4SAgAUxDqJNM4WJg65WztHR1YKFVvHuVY6z6G0aEGahawut8jTl6inerQhjFgQ0sNCVBSEQfxa8GYi1y1iQ4ZwkfEwGqDL8wGxLlEUZCr5nlSHARURkcmChyyLCmbTnZC3KvwwpY6uUpXmZFIXlJZPxPP1G6pgkTUSey6oqknOyG2xuaara+oqkMeH5XiT5SQMeqRTIXahsEaGbqMrmOVXDcaEMmybvw9uLhwqAfjCQBoYt2nKBwEmYYEY3iQyq1h1ihJDnX3lDGIVpwluJb8pLJs7wmiabD9UbOw+mj2kmDHaV965qI6jD9JcM2kiEc1KI0JcKSXssI/BpjEBH2XLCMKc/SKf8KSw5T+yy8W4jZXa+iQN2ztPs6z3OJ3VV1A9MN8O+UuG5q8It2BxPR80+FbWq/vcpFc1qKj9bwk71Z363hDQMC8I11Ju3GEWEqxGxygnm5CS19KugKxkHLtwbp7cHt/o4BMf1o8SyFAbJLV1jdlGplcuYRruMhPwh15sydOXDmSXjetPI33eVZ5Rsz4TqspyERMC0JsVI6huPMgp39yjuNTYdzU2EfdctpmYBzMCCr7FwR5gUkqgnkT9ZZkmqkA1KzDzGK1GIyHUDq/d9KycYIgFallfb5G3k/7ttHONcKkvUHoqfhJBAsFsVKRqqSlWptb5Q0y+aT7OCnCr0AxmD8hJ2hu8Je58WlNO07WMf1W2JRcRjZtbr9XWlk51ef1eqi6m6kg3gDH1pYULR64isv2ns6lPBeswePYT6jzrXxp0+4l5t2CN1YMa9dqV+5s5Az/I4PTUjjJZiCqj0qUoYSZpLHHRe7svbnApqRNsoIzMoo+4UykZz+LW6/S2ch4E2M5qd5tOe1UDkzzEQ2bZGwSpNQrrZ5qR0bJjtxVytEM+hwBACHtGidnYDTI2dXVamA//RXkmZ9BigRyyGmHK9P8HUiO2C5zooQX8xx6gEwSyjkr4VMbmrS5wDeRvs0H7fEtYQ0B44AHoxB9D6bsLq3e3H17efrk0ALl1A+AdcQDND7LhhM+uaAx4cMMfCxu7ZTLi4XV2/McFCg/YBCwsg73+DhWZAn5cGfZmPBhk4bTa0JPJ+SbMhZzHLiHR0jR+oiVCMlUkGExyTOmqbUD5ZNcPzovboFsj7n5wfzcSdvqZ2/stnQD7u4ZGNGQr0dfNnSn5KCgjfZjJlIvDelnPS4r9OjuhkHpKgvugeZOLZrSNm2dxwa89rFmd9Za3hPPVwptmbNXu8uO9kOHZy4kxcctQbec4cXqEGfdpO6z0+stE6xMsTN2CHTuKbHVg4Ygu277TF0Amn36l9lgPOng8CTvbmf5Ohl0/QiG8BHh3S/iY7/kujRwQfPlxSydvfNf0G'),
			this.addDataEntry(dt + 'stepper alternative label placing', 404, 50, 'Stepper with alternative label placing',
				'1ZbfboIwFMafpvelxamXyqZXu9oTdPYozQolpTrd0+8A9Q8pJCY6dDRo+x1O0/OjXyjhSbZfWlGk70aCJvyN8MQa45petk9Aa8KokoS/EsYo3oQteqJRHaWFsJC7axJYk7ATegutKUp30F4pU1FUXcxURYm9+drk7kP9VGLEcFw6a74gMdpYlHKT1w8prY8SYTxmk9Ei9skX+rq+UBdabXLUVrh0wOB8B9apldAzH8iUlNWa5n7NGIZ9b9215ItegsnA2QM+4hP4pMn4VtKlHkXcSCmoTeramiib8eY00ZkpdjzWbsQ8QDyTON7myuGfBCeULnuhW1i5EFosq6Yv3wO/5j146RaAB18VDQBGlHYQpLcTjAOCvbi0qgtsg0Bgn3W7z94Z+5I8iXEIIuoAEd0BxCgA0U/iNrdOoWrP4tZoGu62v7LrS7ddSwT4j1x6TBix1l4d0rXj53LtySvD23YSkOCPsu09Pp0xG8yM04BcYkE4qKbNqx85rCWHPaPQeCjz4vB85qxjrSPpLw=='),
			this.addDataEntry(dt + 'stepper alternative label placing optional', 404, 50, 'Stepper with alternative optional label placing',
				'zZbNcoMgEMefxmNnFMzXMTFtTz21L0CFKFMEi6RN+vRdFJM46DSdJE7CROG/gOwPdocAJ8XuWZMyf1GUiQA/BjjRSpmmVuwSJkSAQk4DvA4QCuEfoKcBa1Rbw5JoJs05A1Az4IuILetMUZm9cEqVk9JWYSQvK6itKqPVB0uUUBp0qaQVN1yIVgoQjtF88hRbXUlzom/qn9Nf+Y+dOULQJoJnEhopLJ1B59UX04anRCydoeCU2jWt3JrBzHaDfteSc/qZqYIZvYcubgCeNyO+OTW5QxE3Us54lpuuRqqmnR0mOjKFisPajxh7iJcU2lvJDbwoM4SLahC6ZqnxIcbUFnGKEJ+zL066BODeeRV6AKMw7CEYXk4w9ggO4hJc+gcUgL3X5TpnZ+ZcciRmPoioB0R0BRATD8Qwif9F64LZcq/RGi3803arcJ32h2sFvkOUghXDTlqvpqINzM4GTD+3qjU8VDWxJXSIonJ3NIKQHiAfxfaYnkjTzL5VabiSRLRfBSeaDzfmv7LHuXkhN4WwG9yznUaV56ehkqRcZm92yPohvtIZmKBO2I2ZgGb3lYAOYT9+Bpp7JPAtMtBpphnKSNe4BcRotLyy8MglmhHD7LTSPui4d4Bxr1thPFbwQvN4fa5tndv1Lw==')
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
				'3Zlbb9owFMc/TR5Bdhxuj4VCN2kdVVepj5ObOBfVkMjxOtinnx07kJCkDeDQSyQkfOLjOOfnv304WGi22twwnIS3sUeoheYWmrE45urbajMjlFo2iDwLXVu2DcTHshcNd2F2FySYkTVv42ArhxdM/xBlUYaUb6k2eDgNiewOLDRNQ5xIOyOuGH/qR5TOYhqzrCvys0t24yx+JvmddbwWPlP9KMI42TRONzPpud6QeEU424oufyOPh6oHGoyVW0iiINRuQ0dPHKfKEOx8928vvugA1AcDVYIBxVyuEDgqJphGwVo21ewOYwTAFZg6TTHy4zUvdF5kl+ycYDdaB/f6jZ296SFOhAFq3196jiBvR/9kEyLRZiQVrUcdSdiWiH0aEdtRNkYo5tELKY1/DiXnxCW72gRSZv1g5dE+j5PfT5idtVRRfWDKDlutwv5AtQthc4bVqMFjo6affxdHYlq7h/cmdunxvVF5hNj3U8IrUd+9RSsQgwqIOxwQYeERFySO0Uy9Fg6FM51lC7+6jgsr3QZvq0hJZiIMknDkYnqlNcvlnZ2CKfH53utH1roe2R0LB4Iz18C2LECjzIcmxJcw4hMRJ5ekLdnvDpZWgR+8Gfg8NqW4D41ILx8mpwA6oDCqUPj+ML8VluXPeYWHiBSvOQ2aNHIoiVXkeXKonSpcEWfCTj9PGuhsSw4FVhBOqrCcsRGN9PJxjOIZN+F5eFxeDo8ceCm3Li5fdgyME9vkRxtCpSVfgzBXwadBOGlE+O1+fkGNXQ7icPQWxE+nQwhOPK2OyEoWcDEdL957NzQDAXXBAJrIGFKCmRtWkBQzgyIXjUp1zpG0ztteV0oNkro83kwy0RsOus8m4KlFgANEnIss+aIZXSOSQXdEcrF1SqRaiTC+cYHsMl4WaNy4an/rfOzjw0il4Qm7z603riKXE3cv+HpZAvTt8pZSV5mAdT+PDFUmymlGJ4UJWK1MVMDlrIRnlKTkQxH6+oBalBFe3dLek87oq+ERzf0fDqp78f+I/w=='),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'3Zlbb9owFMc/TR5Bdhxuj4VCN2kdVVepj5ObOBfVkMjxOtinnx07kJCkBOrQSyQkfOLjOOfnv304WGi22twwnIS3sUeoheYWmrE45urbajMjlFo2iDwLXVu2DcTHshcNd2F2FySYkTVv42ArhxdM/xBlUYaUb6k2eDgNiewOLDRNQ5xIOyOuGH/qR5TOYhqzrCvys0t24yx+JvmddbwWPlP9KMI42TRONzPpud6QeEU424oufyOPh6oHGoyVW0iiINRuQ0dPHKfKEOx8928vvugA1AcDVYIBxVyuEDgpJphGwVo21ewOYwTAFZg6TTHy4zUvdF5kl+ycYDdaB/f6jZ296SFOhAFq3196jiBvR/9kEyLRZiQVrUcdSdiWiH0eEdtRNkYo5tELKY3/FkrOmUt2tQmkzPrByqN9Hie/nzB701JF9YEpO2y1CvsD1S6EzRlWowZPjZp+/l0ciWntHt6b2KXH90blEWLfTwmvRH33Fq1ADCog7nBAhIVHXJA4RTP1WjgUznSWLfzqOi6sdOQcV5GSTA/KrpJx5GJ6pVW7ijxPzngnY0p8vnf9kbWuR3bH6oFD8LaFsC2r0Cj4oQkFJoz4RMTJJWnLBbA7XVoFfnA08HlsynE3or98mJwC6IDCqELh+8P8VliWP+cVHiJSvOZIaBLKUVW4Is6EnX+oNNDZlhwKrCCcVGE5YyMa6eXjGMUzbsLz8Li8HB458FJuXVy+7BgYJ7bJzzeESku+BmGugk+DcNKI8Nv9/IIauxzE4egYxE+nQwjOPK1OSE0WcDEdL957NzQDAXXBAJrIGFKCmRtWkBQzgyIXjUp1zpG0ztteV0oNkrpk3kwy0RsOus8m4LmVgANEnIss+aIZXSOSQXdEcrF1SqRajjC+cYHsMl4baNy4an/rfOzjw0i54Qm7z603riKXM3cv+HptAvTt8pZSV56AdT+PDJUnymlGJ9UJWC1PVMDlrIRnlKTkQxH6+oBalBFe3dLek87oq+ERzf2/Dqp78U+J/w=='),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'3ZdNb6MwEIZ/DcdGgElCjwsNbQ/drLqVevbCBKwajIzbTfbX18YmTZagoITSD0uR8HjG9rxPxgYLhfn6muMyu2MJUAstLBRyxoR+ytchUGq5NkksdGW5ri1/lht1jDr1qF1iDoXoE+DqgBdMn0FbtKESG2oMCa4yUO62hYIqw6Wyc4jl/MGKUBoyynjtilZ1U26CsydoRgpWyJjALAVcwLpzu7XJ7PUaWA6Cb6TLX5KITHugqa/DMiBpZsJmntk4rrQh3ca+ZS8fjACHxUDniXEw6f8Usu0gvPKknUNF/sGjScvpK497mjyesXGgWJAX2Jv/HMm8lmS3D4s7aVn+XLTEk4nVfxpWiN8yeZU3Mv0diaK6SbuSgsSY/qAkLeRYTpJETRVgY4ilLMBPFxMdFnOzF7AjreNcDiCtWfAXI3If29UumnmaELZaVSBaLLb77IVn2oXn4XE5Hh418bLEMREqWd8enJgJsCfIlHA3QnMefh2Es06EN/eLEWtsPIiz+TGIX64O5+9/s0ROFPjRRx+GwzBA74DAH+NyV23wy70TwTBX/Zh1cHkihHydqlfkSZondPIHx08tIrtvn11YdESDxe2LxT9yXjW37KYxTNvF4rVBOWcWi1n/Yv+0bLqDYnPs49waVDKSlBV8JkDfn4/Tn8/B8+wD4cy/Gx3Zfft+1+67n/ev'),
			this.addDataEntry(dt + 'fixed tab bar', 358, 642, 'Fixed tab bar',
				'3Zldb5swFIZ/DZeJbEwIvUzSpJu0rlVbqZeTCw5YNRgZr03262fzkUCAjiaQdiWKFB/OAfM+PsfGMdAi3FwJHAfX3CPMQEsDLQTnMvsVbhaEMcME1DPQpWGaQH0Nc9VyFqZnQYwFiWSXADMLeMHsN8ksmSGRW5YbPJwERLsDA82TAMfaLoirrj9fU8YWnHGRuqJ1emg3KfgzKc5EPFIx8/xWREiyae1uasr7ekV4SKTYKpdX6skg80ATJwsLCPWDPMy28o7jJDP4u9j906sfuQDNYqCaGFD1ZYbAuzTBjPqRbma9O9QIgBmYW20arXkkS86r9NDOMXZp5N/lT2ztTQ88VgaYx97nfQRFm/7RTYhUW5BEtR5zJWFXIuZxREwrswnCsKQvpHL9UyhZRw7ZcOPrNBv7ocfGkse/nrA4aaiiZmGqAds8C8eTrF2SzbLrqsH3qpbf/5ZT1a3dzUcXZuX2o2n1Cny9Toisqb57ik4gJqfVjubxf5gs80U62M87diE4EcO2mgO9ym7XZL8nWLiBst0SHivpdc23cRinKoFbhl2SHJEjIRY+je4yWhradWpQbk5HfPv5IMAefy3VqZLTIj0O6pVVKqSMrOW+3v1IW5dT8/hRMTl2jhmook37qGhJNggOwSiBZ5f6c0AnB5Y5FwqaXRW0mxV8o9jBpmJn91LsTKda65wBks7pA9ELpy7pTKhs7xdT5xkKgsGgjSwwPLWLGrXvD8trZbn5uazxU0LKhlVT24pMS09dzGZ5lQqp5+lL7cqWqzAQ0XuV2lYCyrDgRZ2W5fQykY2sIfAUw6vO5+Hx5nx89IVv9OQi9dM6oHdkmyLDEKqM+QaGZkPGfW6GsJXht7vlGbPsfBTt6b8o/n+ZeOI+QJfF4Aqu5s7qo+thPxDQEAzq2w+9MwDp0fv7VCuDxnX0586EXrYXnrD73LTQ270QtXE5cqEH396LAOPiZf2txZ5VR9XXdkS1Yg6yGwE7bEcUrFQkjZPGpfiHEfr6gOobF62AGkvaR9KZfjU8qrn/lyFzL/8J8Rc='),
			this.addDataEntry(dt + 'scrollable tab bar', 358, 642, 'Scrollable tab bar',
				'3ZnbbqMwEIafhstENpADl02atJW2m6obqZeVC+agkhgZbzfZp18bmwRq2BICbRWkSPHgMWY+//bYGNZ8s7uhKAnviYdjw1oY1pwSwuS/zW6O49gwQeQZ1rVhmoD/DHNZcxdmd0GCKN6yJg6mdHhD8W8sLdKQsn2sDB5KQyyqA8OapSFKhJ1il7c/86M4npOY0Kyq5WeXqMYoecX5nS3Zcp+ZehSmDO9qu5uZVF9vMNlgRve8yp/IY6GsYY2m0i3EURAqt7GtOo5SaQgOvse3539UAKqDYWnBgLwvVxY4KSYojoKtKMrevY8RAFdgZtfFyCdbVqi8zC5ROUFutA0e1RvbR9OaJNwAle8v1UeQl6O/oggtXqY45aUnFUnYlIjZjohpSxvFMWLRGy61fw4lu+WQ3ewCIbNhsPHiISPJ8wuiZw1VqzowZYe9UuFwJMuFsNljPWrw1Kip5z+QiHfr8PCBY5YeP5iUWyC+n2KmRf3wFo1AjDQQDyjA3MIixkmcoplqLbwXzmyeDXx9HBdGugk+VpGUjMMNgnDkovhKaZaJOwcFx9hnR68fWel6YvYsHAjOHAP7sgA7ZT7uQnwJxT7mcXJx2pD9YWFpFPjRh4HPY1OK+7gT6eXN5BRADxQmGoW79eKeW1Y/FxoPHilWsRrUaeS9JDaR54mmDqpweZwxbb+e1NDZ5RMlnDpOKYRQmzkdoOOzp52oZpC30ymwaR2w9dPq84CJhldiMmPiZaegP4a2Da1LY+hoDNe3C4Hw9u7x+hIhjp18orkciBBoFJdfq8AOUMEPKJk9UMoTzbztfqlBjZrG7Nz0cgmXs+ny+y1r3YjJ6oNK28ODUjKYYkTdUINUTPqKpBQ8WTmH1Dglb6SjAhFYtUXrJk8cjEel4dBLogj1I41WiBjjG6BPTdZrkYz6I5KLrVcibY8vTtopi6vzE5/aeatyG/u90wD97KKFLl6Q+9p44ipyaTl7ybHznzXGLE8pVYdOsGrn29GhUzlb7OXMCTY4gMhZcc8oSfG3InT5gPSziVpAlVPaV9KZXBoeXjx+S5LVi5+a/gE='),
			this.addDataEntry(dt + 'scrollable tab bar', 358, 642, 'Scrollable tab bar',
				'3Zldb5swFIZ/DZeJbBzycdmkaTdpXauuUi8rFwxYdQIyXpfs188GQyBAS6hZP4gi4YOPMefxa5uDhVab3SXHcXgVeYRZaG2hFY8ikZ1tdivCmGUD6lno3LJtIP+WfdFyFaZXQYw52YouDnbm8IzZb5JZMkMi9kwbPJyERFUHFlomIY6VnRNXtr/0KWOriEU8rYr89FDVBI+eSH5lG22lz1LfinBBdq3dTU26r5ck2hDB97LKH+qJMKuBnHnmFhIahNptOtEdx0lmCArfw9PLEx2A5mCgWjCg7MsZAifFBDMabFUx691xjGaO+rXFyI+2olT5Ij1U5Ri7dBvc6ieeHEx3USwNUPv+0n0EeZn+VUWIZJmTRJbudSRhVyJ2PyL2JLNxwrCgz6TS/lsoTXoO2c0uUDIbBxuPjUUUPzxi/qahipoDU3XYaxWOnaxcCttkWo8aPDVq+v43EZXdKm4+WtiV249m1RYi30+IqEW9eIpOIJwaiBscEGkRVEgSp2imWQtV4VycqV/jOC6NdBvUVQTS41gyC2lQhKmL2ZnWrFBXCgUz4ouD14+0dD6zBxYOBG8cA/uqAI0yn5oQX8yJT2ScXJJ0ZF9Mmp0C77wa+Dw2lbhPjUgvbyanAAagMKtR+H63vpKW65/rGg8ZKdGwGhxrBC5X6bJyLIkN9TzVVKEKV8aZ8P7rSQudfcWhxArCRR3WZG5EI6O8HaN45m147u6ve+IpBNAdj2r4Wk1dQj3sHBgntsuXNoQqQ74BYa6CT4Nw0Yrw2+26r8Y+NMTp7DWIn06HEPRcrU7YlRTz5rvOhmYgoCEYQBM7hoRg7oY1JGVNlbloVFnlHEnnfdvLSmlA0rSPN7OZGE2d4XcTsG8S4AiREHKX/F93dK1InOGI5GIblEg9E2F+4spfisymBVonrsZ3nY+9fBjJNDxi96lp4ipyZW1ces5e8OW0BBjb1SmlKTMBm16PDGUmqtuMQRITsJ6ZqIHLWUlPGifkQxH6+oA6pBFenNLek87sq+GRxcMHh6x6+XvEPw=='),
			this.addDataEntry(dt + 'fixed tab bar icons', 358, 642, 'Fixed tab bar with icons',
				'3Vlbb5swFP41PDayuYU8hjSpJnVtlVab9jQ5xIBVJ0bgdcl+/cw1EENKuKxTkSLFh3OMOd/3HV9QtMXucBeiwP/Ktpgq2lLRFiFjPP23OywwpYoKyFbRbhVVBeKnqKuGuzC5CwIU4j1vE6CmAW+I/sKpJTVE/EgzwxZFPo7dgaLZkY+C2B5iR/Rvu4TSBaMsTFw1N7liNx6yV5zf2bO9iLGzR+GQ40PjcBNTNtY7zHaYh0fh8ptsuZ96aIaVhvmYeH4WZurZwFGUGrwi9vT24k+WgPpkaFIyoBjLXANX5QRR4u3jZjq68xwBMAe23pQjl+15yXmVXLFzgByy99bZG+sn0wsLhAFmsc/ZGEHeJn/iJtREO8SRaH3PMgnbIqJ2Q0TVU1uIKeLkDVf674OS3pGyu4MXy2zi7bZ0wlnwc4PCXlTV6hNTDThmKpwYabuUNt2UswavzVr2/CdGxLCKh9/M1Mrjb6bVHpjrRphLWS/eohUQhgTEE/KwsHDCBRLXaKZeC+fCsRcJ8WUel5iugvdVlEpmJgwxwsRBdJ5plsd3CgVT7PJT1H3Sup2qIwsHqlY/DhyrAhwUc3MI8QUhdrHIk4OjltgXE0urxBvvJj7PTSXv5iDSy7vJUQAjoDCVUFgvF8uHl+culRBTHPin2ac8YzTp6LJsHAEEbiytFG0wfWIR4YRVvPNO788cNoxztuuJ/SEvw9DUrQpAUKrLsE6UPTVZ1OVqWc7HMig7LIkdq/m3x/WXl2UXfvgYhfyMG2p/bggM+WNcWHmcCwsMTxdW9D4FQ7HH6EKdYeqKRJ0xpvSZRJ2H5Xxt/+jAG8dHH0ibM/A/uOhYqtml6ORzx8DMMeAIzIGg48rgihXgCq5sa9V9J9MAUzMmcCaD0nOBnoOgjYEB7IhBRbiRKPiOL0FSXoWVccmgSp1zSFqvkS8rpwaSuj3TQAXWrFb3UVZusOuByxlEnIsdyT9dPTdCYoyHSC62URGRT30GL1wguQY/gmksXLX7Sn2YbeU4a1Y4yKnOBjmvrQtXGZeO1QtePgICE7VaUupOgWDdVnSgU6BpdeIfY8UI5VMgCbgcKxFJggj/Vwh9foBaHNlcLGkfic70s8EjmqePO6l7+dvPXw=='),
			this.addDataEntry(dt + 'fixed tab bar icons', 358, 642, 'Fixed tab bar with icons',
				'3ZnbjpswEIafhstEtjkkucyh2ZtWWrWVell5iTloHYyMu0369DVgCMSwJcQ00hJFigcPmPn8D2PHsrfH0xPHafSFHQi17E+WveWMifLX8bQllFoIxAfL3lkIAfm10L7nLCzOghRzkoghDqh0eMP0FyktpSETZ6oMB5xFJO8OLHuTRTjN7Zz48vqbIKZ0yyjjRVc7KI68m+DslVRnEpZIn426FeGCnHqHW5jUWJ8IOxLBz7LL7/ggorKH7S5Lt4jEYaTcPEcNHGelIax9L08vf6gAdAfD1oIB5VjWNrgpJpjGYZI3y9Fdx2jh5p++GAUsEY3O++LIO6fYj5Pwq3pi52L6zlJpgMr3mxojqNrxn7wJbdnmJJOtHyqScCgRNI4IckobJxSL+I20rn8PJWfklD2ewlxm8/B4oHPB0p8vmN81Ve3uwLQdzkqFc7dsN8LmeHrU4K1RU/d/ZrEcVn3z2Qq1bj9btK/AgiAjQot6/RSDQLgaiGccEmkRsZAkbtFMtxbawtmv80/nPG7MdAR0FYHiuJbMShpywrGP6VppVuRnagVTEoiL1+eitVugiYUDwfK+OXBuC9Aoc8+E+FJOAiLj5JNsIHuvOIYG3v1n4KvYtOLuGZFedZmKApiAwsJICiSUpFEZ7iEMANisdoMnfw+DU5UOoecsW4GCWn6EXeK4Uxt1fmynR7ScgNLSBKWIYD40QxpRSU3IHYPHjIY0PFO8vlYm8PgRfgydJfLG6KdKR4YB2XACQBCMJHRDUVEntZHFcQ+mfiZwpUO5s+arIUzBAJpQSSaTmB9pSJqiaHJJmi+lComhN08Hkq4y3FAe89pJdJJiAI5dw18hEkIWuf+1IOtF4k5HpBLbpET0jYQJEpda05hd1fcmrs6limNmpTJzpii/oJGNghfsv3Ylrnqrq4/LyOwF399VAHPUTildGwuwa3VjaGNh0X7xT1GYQX1jQQNXsZKecZrpS5hHEvr4gAbsAryb0h5JZ/HR8Mjm5f+Csnvz74S/'),
			this.addDataEntry(dt + 'desktop tab bar', 758, 152, 'Desktop tab bar',
				'7Zhdb5swFIZ/DZepjEkCuQxJaCetS9Vl6rUFBqw5gIzXJfv1s/lKCKCSxDBtGlKkcOxzMO/jY/ugGav94ZGhJHyOPUw1Y6MZKxbHPP+3P6wwpRoExNOMtQYhED8NOh2tetYKEsRwxPs4wNzhHdEfOLfkhpQfaWHwUBpi2R1ohp2GKJF2hl0R3/YJpauYxizravjZJbtxFn/HZUsUR8LHLh6FGceHzuFmpmKsjzjeY86OostP4vEw72HOrNwtxCQIS7dZMXCU5oag8j29vfhTCNAuhqFUDACWwJ52icFwSn7ht+K19L7ywNvkMYo3YZgiTt5xLf49kk1vlGx/COScfwj2Hn04NEQS8i3ttbOZVy2lUrCvUka7UnWHM9102DKrrpWteN5LTMQwqodNoJm7HIsAFxFi308xb8hejboXidnHJC7m6zWSn8/ta9L5agpGCwWghsJsUadgDEBh3p8CJZmMf37iT5uSK5r3C72m+GUEJYqbDcVfUICFhRMuJL9mAW9dqBurur1aT1sX8NzyVMooTX4c8a/CKPmB4v4smJNd8skJckkU7OJENCyEQTImLqJLSoJI2LhssVFxR7HPT16fs7u12XuG3LiJ6PDORDzWNyOl08BSsRElDPtY6OTitOd0qE48vYQ3PxQetiSjPleSjWWYMhnBABQWDQqfdptnYdl+2TR4CKV4PUfEktydI5cpsSeeJ0NVWeEKnTG7k8Wx5nC+TIJ5E83UUoJmbtXQTMqwStmU22gTzu5tOx4cGXgrFy4u39YCfyMv3ZyOAUzvBPb0uhkxn/4FZNACYyBr1tMFMmf77fU/sWuIGdZ8DGJ3Fv19DgmO7tiWc3vRr4bKIDvVEDWUruSjQooRc8O2Aqs6s7UUtTfWXB2EumuuFkCKjnkTc1ZDNMg5T+/xtaEPIs5F/TLqWbsTyWw4ItBSTkTcnj4S593PvyH/Bg=='),
			this.addDataEntry(dt + 'desktop tab bar', 758, 152, 'Desktop tab bar',
				'3Zldj6IwFIZ/DZdOSgHBS1F0TNbR7Gx2rokUaLaCKd1Z3V+/5XPAQkQtbiKJiZz2lPI+Pf04KNpsf1xS9xCuYw8RRXMUbUbjmOX/9scZIkSBAHuKNlcgBPynwEVHqZqVgoNLUcT6OMDc4dMlv1FuyQ0JO5HC4LlJiNLqQNHsJHQPqZ2iHW/f9jEhs5jENKuq+dmVVmM0/oXKkiiOuI9dPApRho6d3c1MRV+XKN4jRk+8yh/ssTCvYRpW7hYiHISlm1F03E1yQ1D5fr09/1MI0C6GJlUMAKbA1rvEoCjBf9FH8VpqX3ngbfJoxZtQRFyGP1Gj/Xsk02+UbH8M0jH/Euw98nIUROLyTe35whlXJaVSsK9SWrtSTYeabipsGVXXylY8bxtj3o3qYSNo5i6nooGzFmLfTxATZK963YuEcZnE2Xi9RvL62L4mnK+moLVQAHIoGJMmBW0ACuP+FAjOZPz/A18XJZc07idqQ/HzFqQobgqKb90AcQvDjEt+zQTeOlELs7o9m+utE3hueS1lTE1+HLF3bkz5geK+1tgiu9InH9wdjoIf8YEXTLghZYx3LpkSHETcxtIS2y3uCPLZl9e37G5u9h4hNy4iKrwzEE/NxUjqMLBkLEQHinzEddqhpOdwqHY8vYQ3LwoPW4JRHUuJxrKZMhjBABQmAoUPxxZAcIlYMzj4XNwdHOexsMeelzZVhcOOC4zonRBODYd6LLQg0S0pSMZWA8mobFYqk3L5rEF5f91st6u35ePIpA1v0umKpe9qgaFgqaBl4pJES9XhI3CpAq6fq7mzeX8+WJPhWEEDPIKVeHxeradL5wlZDTgLavpDpkHxdP/mfDwhKWs8GCm93FUNS0pMKqw3353nIzVgTBngITHVI+lwedfNKHajgIiH4Qtb7rhCZPZGlI+tS6fjQjTwYgjMyt1UnZkhBdlIPVuyhshPqD0SFPcekRfqwrYWgwUNbAkaKQDOd+OD6C+mK26ImAS5dBe2JY+q4GhJ2N2YT+oA1J1Pall/JB1hR6bRQDTIGVaVkkrg/WA4Ch6aR+hEYgxHBFrSifDbrw9gefX697F/'),
			this.addDataEntry(dt + 'desktop tab bar overflow', 758, 152, 'Desktop tab bar with overflow',
				'7Zldb5swFIZ/DZetwIZALksS2krrUrVdu1sUDFhzMAK3S/brZ/PVEGCFxDBtaqRI4djnYN7nHGM7Clxsd9eJG4d31ENEgSsFLhJKWf5ru1sgQhSgYk+BSwUAlX8V4HS0almrGrsJilgfB5A7vLnkFeWW3JCyPSkMnpuGSHRXFWinoRsLe4I2PL7tY0IWlNAk6wr97CO6sYT+QGVLRCPuYxe3QglDu87hZqZirNeIbhFL9rzLT+yxMO9hGlbuFiIchKWbUQzcTXNDUPm+Pz3/UQjQLgaUKoaqXqm23iVGglL8C70Uj6X1lQecJg8sniRBxGX4DdXinyOZfqJk210gcv4y2HrkctcQict3ZS+d1axqKZUCfZWC7UrVHQ5000BLVg2VrbjfPcV8GNXNLoCZu+yLAEcRqO+niDVkr0bdi4TxMYmjfB0i+WFuDynnwRRgCwVVDgVjXqcAR6Aw60+B4EzGv5/4elNySXk/12qKH0eQorjZUPzeDRC3MMy45EMm8NaJujGr24ul3jqB55abUkZh8mnEHrlR8FOL64NgTvYRd47dDY6CJxrzhjk3CMZ445IrgoOI25hosd3iiiCfvXt9ya6WZu8MOfElooEzC3FffxlJTQNLxosoTpCPuE4blPZMh2rF00t480PhQUsxajMp1ViGKYtRHYHCvEHh9ml1xy3rr6sGD64Uq9cIn5K7a+S4JLbY80Soqio2XGeUnMliX3M4nCbVWRONbklBM7NqaC7KsFLZlK/RJpynl/V0cETgtZi4mHhaS/0XeWmmPgUwrRPYzcNqwnr6H5ABS50CWXM/XSBz1t8ePokNIQat2RTEmpv+ktjt82eNDSKmz8EUxJpnDgWxx9vvn8CGADPmkyw8ehxNfLw2f43bNsvV+tvDYhOHqWCU0leh3qkb6A5CdYdOXi20ZB0j6UflBcdYwms9jjDO3UQ7mmNbzrQVIwXB8UJ9jCMkrXmicUK5pMhNNuEfS6blTG/Mijkk1FYkcna5F6ZRQzTKNleTctrAx8FwFEx61NCJxBiPCLCkE+GX7/+R5d0P/0L7DQ=='),
			this.addDataEntry(dt + 'desktop tab bar overflow', 758, 152, 'Desktop tab bar with overflow',
				'7Zldb5swFIZ/DZetwIZALksS2krrUrVdu1sUDFhzMAK3S/brZ/PVEGCFxDBtaqRI4djnYN7nHGM7Clxsd9eJG4d31ENEgSsFLhJKWf5ru1sgQhSgYk+BSwUAlX8V4HS0almrGrsJilgfB5A7vLnkFeWW3JCyPSkMnpuGSHRXFWinoRsLe4I2PL7tY0IWlNAk6wr97CO6sYT+QGVLRCPuYxe3QglDu87hZqZirNeIbhFL9rzLT+yxMO9hGlbuFiIchKWbUQzcTXNDUPm+Pz3/UQjQLgaUKoaqXqm23iVGglL8C70Uj6X1lQecJg8sniRBxGX4DdXinyOZfqJk210gcv4y2HrkctcQict3ZS+d1axqKZUCfZWC7UrVHQ5000BLVg2VrbjfPcV8GNXNLoCZu+yLAEcRqO+niDVkr0bdi4TxMYmjfB0i+WFuDynnwRRgCwVVDgVjXqcAR6Aw60+B4EzGv5/4elNySXk/12qKH0eQorjZUPzeDRC3MMy45EMm8NaJujGr24ul3jqB55abUkZh8mnEHrlR8FOL64NgTvYRd47dDY6CJxrzhjk3CMZ445IrgoOI25hosd3iiiCfvXt9ya6WZu8MOfElooEzC3FffxlJTQNLxosoTpCPuE4blPZMh2rF00t480PhQUsxajMp1ViGKYtRHYHCvEHh9ml1xy3rr6sGD64Uq9cIn5K7a+S4JLbY80Soqio2XGeUnMliX3M4nCbVWRONbklBM7NqaC7KsFLZlK/RJpynl/V0cETgtZi4mHhaS/0XeWmmPgUwrRPYzcNqwnr6H5ABS50CWXM/XSBz1t8ePokNIQat2RTEmpv+ktjt82eNDSKmz8EUxJpnDgWxx9vvn8CGADPmkyw8ehxNfLw2f43bNsvV+tvDYhOHqWCU0leh3qkb6A5CdYdOXi20ZB0j6UflBcdYwms9jjDO3UQ7mmNbzrQVIwXB8UJ9jCMkrXmicUK5pMhNNuEfS6blTG/Mijkk1FYkcna5F6ZRQzTKNleTctrAx8FwFEx61NCJxBiPCLCkE+GX7/+R5d0P/0L7DQ==')
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
		
		var fns = [
			this.addDataEntry(dt + 'single line text field', 346, 360, 'Single-line text field',
				'7Zhbb5swFMc/yx54bORLSsnjcqsq9TJt1frsBgNWDI6M1yb79LPBJBCHNllCtVUBheBjH1/+Pzi28fAoXV5LskjuREi5hyceHkkhVHmXLkeUcw8BFnp47CEE9M9D05ZcWOSCBZE0U/s4oNLhhfBftLSUhlytuDWEJE+oKQ48PMwTsjB2SWe6/mHEOB8JLmRRFEfFYYopKea0lkOLo6wgFK/aCHXCNk6losvWARQm2/trKlKq5EoXeWWhSsoSuO+XbgllcWLdsF+OHJC8NMRr340e+sZKslse7MgzFGKeEjk3FYchDb84eumxGGnMqNiM8K+cxZnOSVkY8kKBBZmxLDYS+EZCkakf7LdxRrBK29pMWtJc5z7Z0e6tGvo71SrRJOVEsRfaqP8YJfuOkvckpW3iWY1uaaTqOtUeqACYs6kfxBvXR7HQFv/DBcSHCmib+CaYbhmBVVkiCJoeIopyqhzB1x3bi8GlwwAC3V0wJqtc/4lIX25mGgoYSUrSNjh1xf3GA43a0VWPNHBRguL4X0lBeNkBKv/9uFyFYs4yug65dfEycUuezZRSpNpD8mlltw6gB/q+7XSdBOy7JNCJSPRBBySuHBJTwUMqz6GrDYPvd4AhaJ2JTeh6Jq08ztGqAWeAO4AzeD9a7VxFpsvYrHx7cRrynpKMZDGnTqzKRBHgttaaV8Cc+6oevBmsoBOnIHARXB5HwLZ1UcX2ikgXQKruH0zkPJlYLAh2sQKD0OHyfXL38HOyT/TCO3YHW8EJ4mA6RdtTCXhrO0KsYaZZ6FntOF4rr+V9Gux4nw7ea+wmdbG90TsNKXdnPBnfPH4STk2HD6VWhUEYgEbrHWF0d/Djh/vP8rr9AxgHHVDUyc0XsLJ4/QPZHw=='),
			
			this.addEntry(dt + 'single line text field normal light dark', function()
			{
				var text1 = new mxCell('Hint text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#eeeeee;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field hover light dark', function()
			{
				var text1 = new mxCell('Hint text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#cccccc;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (hover)');
			}),
			this.addEntry(dt + 'single line text field press light dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;opacity=50;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (press)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (focus, light)');
			}),
			this.addEntry(dt + 'single line text field normal light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#eeeeee;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field error light', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#ff0000;');
				part1.vertex = true;
				var text2 = new mxCell('Username or Password is incorrect', new mxGeometry(0, 30, 346, 25), 'text;fontColor=#ff0000;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1, text2], 346, 55, 'Single-line text field (error, light)');
			}),
			this.addEntry(dt + 'single line text field disabled', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), 'shape=line;strokeWidth=1;noLabel=1;strokeColor=#B3B3B3;dashed=1;dashPattern=1 4;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (disabled)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#0C8CF2;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (focus, dark)');
			}),
			this.addEntry(dt + 'single line text field normal dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#cccccc;opacity=50;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal, dark)');
			}),
			this.addEntry(dt + 'single line text field error dark', function()
			{
				var text1 = new mxCell('Input text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#ff0000;');
				part1.vertex = true;
				var text2 = new mxCell('Username or Password is incorrect', new mxGeometry(0, 30, 346, 25), 'text;fontColor=#ff0000;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1, text2], 346, 55, 'Single-line text field (error, dark)');
			}),
			this.addDataEntry(dt + 'single line text field icon normal light', 346, 35, 'Single-line text field with icon (normal, light)',
				'1ZbfT4MwEMf/Gh5dSjtQH3X+eNFo4oPPddygsVBSqjL/enu0zjG6jUyNkYWkvfbo3ee+3IjYrGyvNa+LW5WBjNhlxGZaKeNGZTsDKSNKRBaxi4hSYu+IXm1ZjbtVUnMNlRnjQJ3DK5cv4CzO0Jil9Iam4DUONcztI88bo9UzzJRU2horVdm184WQcsPkHwzaQLs1uM7kI7sGVYLRS7vlTWSmcDvY1EdUgMgL78YSZ+ONm+cr169U7cBnG86c7c88400BuJ1g3h5D2eZYrUleZnJiQEJduIT3gokoS7trLB0aprP0hZ14Cmu04nQIyyuAaJDciFfoHRci6E+8V8IGsjruKCZ9F7VYNGAGyFeBjqrCdFCF+w7nZiksJhTfQlUmhBPtD+IdN8c4R7BizuWZFHmFRRNZJkcVyZvwvLuaz4XB9BPyzZJ5h2QaqNhJQN9ke3XG6js5UN9SrKn50QcaW0ulbvgTdqhu1gdpa3GZ4u9nOXnp0ZDQA9g2FXoItnSA7VY9Cfn3ilQ/rkaa0AHXU/I7ajw+UI1GC17lHahd+tvTbTOBf15CIfhGvWCy4wCmOwHGPZUG+3EAZ/K9dtx+tuP+O3LEfqE7n/zjHrJS9/YmEhL7AT3ETr8+2Bzl9e+5Dw=='),
			this.addDataEntry(dt + 'single line text field icon focus light', 342, 35, 'Single-line text field with icon (focus, light)',
				'zZZRb4IwEMc/DY+a0gpzj0OnLzNZsoc9d+OEZoWaUh3u06+lnVMpypxLBiEp1x69+92fg4BMinou6SpfiBR4QO4DMpFCKDsq6glwHmDE0oBMA4yRvgI865gNm1m0ohJK1ccBW4cN5WuwFmuo1JY7Q5XTlRlKeNWPTColxRtMBBdSG0tR6rlkyTg/MrkHg1RQdwbXmFxkcxAFKLnVS95ZqnK7goxcRDmwLHduJLI2Wtn7bOf6naoeuGz9mZPzmae0ysEsRyZvh6GoM1OtYVakfKiAwyq3CZ8FE2ASzm6T2bQvHeyns3WFHToKe7TCuA3LKQBJ4FSxDRxs5yPodnwUTAey224QokMXsVxWoFrId4H2qsKoVYU4Qq1CaEhGektRqj2YqDmc/Yl9mMUaAEkMVvZK+R1nWWlKxtKU9yrRT7TbUR3nEI08xRl7pIy6C9FXytGFUuZsT7jPLlCdU1KKB/pimtE0bFG7loqPODmVYZ+mPdiOxXgJtriFbSFemCbWT35Jc/5T+eEIt0Deor+R382F8lOS0TJryJwSnL+Txs2h7SkzHyYmDOlKrE2y/QDGJwGGB7L09loPzuh3rbb+arWHL8WA/EHnHV+zaYTnm8Z9bM4rq7u7a/jEfkHT0LffP2OW8v6/2ic='),
			this.addDataEntry(dt + 'single line text field icon normal light', 342, 35, 'Single-line text field with icon (normal, light)',
				'3ZZNU4MwEIZ/Dcd2QtKgHrV+XHTGGQ+e07KFjIF0Qlqpv96ExFoktFjtQWGYSTZZsvvs2y0RmRb1nWLL/EGmICJyE5GpklK7UVFPQYgII55G5DrCGJknwrc9q3GzipZMQamHOGDnsGZiBc7iDJXeCG+ocra0QwVz88qrSiv5AlMppDLGUpZm7WrBhfhi8i8GpaHuDa4x+cjuQBag1cZseeWpzt0OMvER5cCz3LsR6myscvNs6/qZqhn4bMOZk8OZp6zKwW5HNm+PoagzW61xVqRirEHAMncJHwQTYZI011A6OExn4ws79hR2aMVJF5ZXAFIgmOZraB0XIuhPfJTcBLI9bhSjtotcLCrQHeTbQAdVYdKpQkLRiFI6ik3pOxUxtKwGF7LUO1RRc3n7E3+zm2NL2fLlcyYuBc9KWzuepmJQrb4j4p4yeQc6CVTpPKBp1F+RoZqmR2pa8B0FP/tAY2Mp5T2b2a7UzNrUDPibxN6/y8nLDYfEHcD2VZXHYEs62B7kjBti/0B+mOIOyAt0GvmdHSk/rTgrs4bMPsEdaKkpt/9QXFrSlVzZZIcBTPYCjFuyDDbdAE76s55bf/Tc9o9iRE7Qgs//cNPYqru/a4TEfkTTMNPPrzJHefej7R0='),
			this.addDataEntry(dt + 'single line text field icon normal dark', 342, 35, 'Single-line text field with icon (normal, dark)',
				'1ZZRT8IwEMc/zR4lXcsAHwWVF01IfPC5sGNr7Nalqzr89LZrRcY6mAgxNiFpr7317nf/HQvILKvmkhbpo4iBB+QuIDMphLKzrJoB5wFGLA7IbYAx0r8A33fshvUuKqiEXPVxwNbhjfJXsBZrKNWGO0OZ0sJMJaz0I6elkuIFZoILqY25yPXedM043zO5B4NUUHUGV5tcZHMQGSi50UfeWaxSe4IMXUQpsCR1biSyNlradbJ1/U5VT1y2/szJ8cxjWqZgjiOTt8OQVYmp1iDJYj5QwKFIbcJHwQSYrOrRlw7209m4wg4chR1a4agNyykASeBUsTdoXOcj6G5cCKYD2V53FaKmi1ivS1At5NtAe1Vh2KrCosa5XwqNyYhvLXK1g3NcD2d/Yh/msEZApgYsW1F+w1mSm6KxOOa9ivQT9XbUxzlEQ095Jh4xo+5S9BVzdKKYOduR7rMLNNSWXDzQpWlH9apJTYOP6nFeTk5n2KdqD7Z9OZ6CbdTC9iiWjP+9/ERBV0wZIhE6D2Uc4RbXa3QZNY5PVKOSjOZJDeqQ/o601piZfyomDPhSvJpk+wEcHQQYNlTqbb4enNHvem/11Xub78gVuUArnvzjHrJVd3cT8Yn9hB6il99fZ5by7sfbJw=='),
			this.addDataEntry(dt + 'single line text field icon focus dark', 342, 35, 'Single-line text field with icon (focus, dark)',
				'zZZRb4IwEMc/DY+a0opuj0OnL1uyZA977uSAZoWaUjfcp19LO6dSlDlN1oSkXHv07nd/DgIyLeqFpKv8USTAA3IfkKkUQtlZUU+B8wAjlgRkFmCM9BXgecdq2KyiFZVQqj4O2Dq8U74Ga7GGSm24M1Q5XZmphKV+ZFwpKd5gKriQ2liKUq/FKeP8wOQeDFJB3RlcY3KRLUAUoORGb/lgicrtDjJyEeXAsty5kcjaaGXvs63rT6p64rL1Z05OZ57QKgezHZm8HYaizky1hlmR8KECDqvcJnwSTIBJOL+N57O+dLCfzsYVdugo7NAKx21YTgFIAqeKvcPecT6C7sQnwXQg2+MGIdp3EWlagWoh3wbaqwqjVhXGEWoVQkMy0ktFqXZgps1w9mf2aTZrACQ2WNmS8jvOstKUjCUJ71Wi32i3ozrOIRp5inPjkTLqLkRfKUdnSpmzHeG+uEB1TnEpHuiraUazsEXtUio+4ORUhn2a9mA7FOM52MYtbI/ilWli/eQ3acY/lR+OcAvkLbqO/CZnyk9JRsusIXNMcP5OumyGtifMfJiYMKQrsTbJ9gM4Pgow3JOlt9d6cEZ/a7X1d6vdfykG5Aqd9+aSTSM83TSiZlxY3d1dwyf2M5qGvv35GbOUd//VvgA='),
			this.addDataEntry(dt + 'single line text field icon normal dark', 342, 35, 'Single-line text field with icon (normal, dark)',
				'3ZZNU8MgEIZ/TY7tEChVj7Z+XHTGGQ+eabNJGEnoENTUXy8EbJuG2FjtQZnpDCxs2H32zTYRmRf1rWKr/F4mICJyHZG5klK7WVHPQYgII55E5CrCGJlfhG96duNmF62YglIPccDO4ZWJF3AWZ6j0WnhDlbOVnSpYmkfOKq3kM8ylkMoYS1mavVnKhdgz+QeD0lD3BteYfGS3IAvQam2OvPFE5+4EmfiIcuBZ7t0IdTZWuXW2cd2maiY+23Dm5HDmCatysMeRzdtjKOrMVmucFYkYaxCwyl3CB8FEmCybMZQODtNZ+8KOPYUdWvG0C8srACkQTPNXaF0XIuhvfJDcBLK5bhSjtotM0wp0B/km0EFVmHSqMKVoRCkdxab0nYoYWlaDqSz1DtW0Gd7+yN/tYUOCzCxfvmTiUvCstLXjSSIG1eo7Iu4pk3egk0CVzgOaRv0VGappeqSmBd9R8JMPNDaWUt6xhe1KzapNzYCnzfhdTl5uOCTuALZ9VR6DbdrBdi8X3BD7B/LDFHdAXqDTyO/sSPlpxVmZNWS+EtyBlppw+w/FpSVdyReb7DCA0y8Bxi1ZBptuACf9Wc+tP3tu+6UYkRO04PM/3DQ26u7vGiGxH9E0zHL7VeYo7360fQA='),

			this.addEntry(dt + 'single line text field normal light dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#808080;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 25, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#999999;opacity=80;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, part1], 346, 35, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#1F9BFD;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#1F9BFD;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field focus light', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#cccccc;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#eeeeee;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, light)');
			}),
			this.addEntry(dt + 'single line text field focus light dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;textOpacity=80;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#999999;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;textOpacity=80;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), 'shape=line;strokeWidth=1;noLabel=1;strokeColor=#999999;dashed=1;dashPattern=1 4;opacity=80;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#1F9BFD;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#ffffff;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=2;noLabel=1;strokeColor=#1F9BFD;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, dark)');
			}),
			this.addEntry(dt + 'single line text field focus dark', function()
			{
				var text1 = new mxCell('Label text', new mxGeometry(0, 0, 346, 30), 'text;fontColor=#999999;fontSize=12;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text1.vertex = true;
				var text2 = new mxCell('Input text', new mxGeometry(0, 20, 346, 30), 'text;fontColor=#cccccc;fontSize=16;verticalAlign=middle;strokeColor=none;fillColor=none;');
				text2.vertex = true;
				var part1 = new mxCell('', new mxGeometry(0, 45, 346, 10), s + 'line;strokeWidth=1;noLabel=1;strokeColor=#999999;');
				part1.vertex = true;
				return sb.createVertexTemplateFromCells([text1, text2, part1], 346, 55, 'Single-line text field (normal, dark)');
			}),
			this.addDataEntry(dt + 'full text field', 362, 56, 'Full text field',
				'vVTLboMwEPwaHxMRG2jPJW0urVQph56tsGCrBiPjJqRfX79CQJAKqVFXQvKOd9j1jGVEsqrbKdqwN5mDQOQZkUxJqf2q6jIQAuGI54hsEcaR+RB+ubG7cbtRQxXUegkBe8KRii/wyB6oOjAPt/osApzTloElRYg8tYw2Fldw0D7N5cnkG5toJT8hk0IqxyTgot/54LlmobbgQgwqCxcWl7Xe82/bwszh80Fd5sLgVPCyNpiAws3R0AOvy1eXbdPEQOF4oDR0NyVyUNBnB7ICrc6m5BQmNbskDUIx4CULtCT1GG19XvbUq+BmETSf159M9F+mfNWV9s6syyoX68vxR/riOS9SF0t1wfO6nMPFWieeMtBpk05lumAKBNX8CKN2c9qFju+Sm0FwFOa7KBO6rx7HP5BF0YKeSN+PvciN+B5udP9oxZjwmzHxjDHxXYxZkWTszMPfnTHp9Q305cMn8gc='),
			this.addDataEntry(dt + 'full text field', 362, 294, 'Full text field',
				'7VjRbpswFP0aHhsZQ2jzmCZbX7ap0ibt2Q0XsGZsZLsp2dfPGJPAICpdoarWWIrEPb4XO+fkXCv2gk1e3klSZF9FDMwLPnnBRgqh66e83ABjHkY09oKthzEyHw9/PjPr21lUEAlcjynAdcGesEeoEVIjSh+YQ2KiMqjykRfcqowUFS5hp+swFk8m9qtAS/ELNoIJaSsDsOM485PGOnO5CWWslZnYUeGC6+/0d7WE2Ucdt/KQHQYnjKbcYAwSu4+C7ChPv9hoGy0NVG37nmgNkts1MQoNugep6Y6wtavXojiV/6iCbWQAR4tJhvIstRZyvN6ByEHLg0l5cl/TzAaRIzgDmmauDK/CGiSqBtJj7Ukp8+DEGhYu6Ak3Tre8TKsf2yLNY7ZoyOuog4eUjOwYSwx+lhg/6vPSYBIY0XQPndcPceVWuBfULIyR20/DxMGFqPsCkSQKdI/q4zZHsR9OwX75htR3C9pChANChJMIcRUsu0rgGZRY/qMSjPLhxnS+iUlQpjG1cycyw2CX8NHrRHCkh6sZSI96pK+JFNxAt8A5aP2yM6TDOBdWmPb54KC/Wn7rpPCj4SMg0zlzUr2teNE04i3DGcS7nqJ3PSqQY6R7cf+KxvQvRw9aLHv9LER9NcJXqtH0s0ZVt/zVLEfLTd9bDw9QcbDJJFUauAJ+8dck/vL9OQy2etcGu/noBmsO1rbDGKOVwQTnQqqLuaYx1/Uc5vL9d+2u+sf1oe3Vv1JYM8MYRt+AKXE5uqZxFw5mcdck1wrzuWvUv9v/yF0mPN0F1untq8I/'),
			this.addDataEntry(dt + 'inset text field', 362, 56, 'Inset text field',
				'rVTBboMwDP2aHFtB0qKdR7deNmlSDztHYEi0QFDIWtjXLyQphUIrpNYSUvxsY/OeCSJx0ewVrdinTEEg8oZIrKTU7lQ0MQiBcMBTRHYI48A8CL/fiIY2GlRUQamXFGBXcKTiFxxyAKoS5uBat8LDKa0ZdEUBIq81o1WHK0i0c1N5Mn7YOVrJH4ilkMpWErDWR755qpnPzbgQg8zMWofLUh/4X9fCzOH8QV5szeBU8Lw0mIDMzlHRhJf5h/V20dZA/vNAaWhuUmQhz88eZAFatSbl5Cc1URJ5ohjwnPmybeQwWjs/70svhJuD53yefzLhfxnzRZN3O7POi1SsayfZNcN4To3I2lJm8DwzrV+t9daVDJgKoylRZ0yBoJofYdRujj3f8UtyMwgO/Hxnbnz31cv4BTLLatAT8vuxF+mxeYYeR8mT6cLfl+PqV3iKTOOCe6LNbLe/OB4VbUU2Y9XC4HHZjHu5Il368Ab9Bw=='),
			this.addDataEntry(dt + 'focus card suggestion', 362, 246, 'Focus card suggestions',
				'7VfBjpswEP0ajl0ZA25y7CbtXlpppVbq2Q0DWDWYGieb9Os72CaBhmijLqSXWIrCPM/Y5r1hBoJoVe6fNK+LLyoFGUQfg2illTLuqtyvQMqAEpEG0TqglOAvoJ8uzIZ2ltRcQ2WuCaAuYMflFhySQtOANg5vzEF2OG8KaKNIED02Ba9bXMPGODNVL2iHrWG0+gkrJZW2kRHYcZz5LlJTeN9MSNnzzOxocVWZr+J3uwWew9k9P2IH4lyKvEJMQmbPUfONqPLP1lqzBKH22M/cGNCV3ZOSGNEd3qHYcPnBxxtVn8K/tcaaIeDJQWfYXyTYQp7dJ1AlGH1Alxd/mzgbMU9zASIvfBiNmQN544D8GHvSCy+8ZOPyRWfyXadbuc/blHvIy1Q+dOQN1KFjSjI7riWGvkpMyM556TANkhuxg8HyY1z5HZ6VwI0p8efpmDh4kwwXUFnWgDmj+njMq9iPp2B/f0PqhwF9IeIRIeJJhHgXJUMl6AxKJP+ohBTVeGG6XMQ0NFiY+r4TPQyjVSIkbxPBkx4vZyCdTdM7BkxXygrS7wse+qvU9zpEyMZLf2FK2fWZYf9Y2nFzMePFJGIm8Qxivr8sJqYgkx3naG6ORLJf2/ZF5fHUknsQy9v/H1x34XgEt4KbuWfJrFkSkjkK7WKmNGkKfOm658n/yJNkjlej5Ux5ghQbvtXcpsc9W26fLcvF27MFzdMXrnPvfwD/AQ==')
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
