(function()
{
	// Adds Floorplan shapes
	Sidebar.prototype.addFloorplanPalette = function()
	{
		var w = 100;
		var h = 100;
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;align=center;' + mxConstants.STYLE_STROKEWIDTH + '=1;shape=mxgraph.floorplan.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;align=center;' + mxConstants.STYLE_STROKEWIDTH + '=1;shape=mxgraph.floorplan.';
		var gn = 'mxgraph.floorplan';
		var dt = 'floorplan ';

		var fns =
			[
			this.createVertexTemplateEntry(s + 'wall;fillColor=#000000;', 
					w, 10, '', 'Wall (Horizontal)', null, null, this.getTagsForStencil(gn, 'wall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wall;fillColor=#000000;direction=south;', 
					10, h, '', 'Wall (Vertical)', null, null, this.getTagsForStencil(gn, 'wall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;', 
					w, h, '', 'Wall (Corner NW)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=south;', 
					w, h, '', 'Wall (Corner NE)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=west', 
					w, h, '', 'Wall (Corner SE)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=north', 
					w, h, '', 'Wall (Corner SW)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallU;fillColor=#000000;', 
					w, h, '', 'Wall (U)', null, null, this.getTagsForStencil(gn, 'wallU', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'room;fillColor=#000000;', 
					w, h, '', 'Room', null, null, this.getTagsForStencil(gn, 'room', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'window;fillColor=#ffffff;', 
					w, 10, '', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dimension;verticalAlign=top;', 
					w * 2, 40, '100', 'Dimension', null, null, this.getTagsForStencil(gn, 'dimension', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dimensionBottom;verticalAlign=bottom;', 
					w * 2, 40, '100', 'Dimension', null, null, this.getTagsForStencil(gn, 'dimensionBottom', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairs;', 
					300, 100, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairs;direction=south;', 
					100, 300, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairsRest;', 
					300, 200, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairsRest', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorLeft;', 
					80, 85, '', 'Door', null, null, this.getTagsForStencil(gn, 'doorLeft', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorRight;', 
					80, 85, '', 'Door', null, null, this.getTagsForStencil(gn, 'doorRight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorDouble;', 
					160, 85, '', 'Door, Double', null, null, this.getTagsForStencil(gn, 'doorDouble', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bathtub;', 
					180, 60, '', 'Bathtub', null, null, this.getTagsForStencil(gn, 'bathtub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bed_double;', 
					200, 180, '', 'Bed, Double', null, null, this.getTagsForStencil(gn, 'bed_double', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bed_single;', 
					100, 180, '', 'Bed Single', null, null, this.getTagsForStencil(gn, 'bed_single', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bookcase;', 
					120, 30, '', 'Bookcase', null, null, this.getTagsForStencil(gn, 'bookcase', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'chair;', 
					41, 52, '', 'Chair', null, null, this.getTagsForStencil(gn, 'chair', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'copier;', 
					110, 60, '', 'Copier', null, null, this.getTagsForStencil(gn, 'copier', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'couch;', 
					150, 80, '', 'Couch', null, null, this.getTagsForStencil(gn, 'couch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'crt_tv;', 
					60, 40, '', 'CRT TV', null, null, this.getTagsForStencil(gn, 'crt_tv', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desk_corner;', 
					150, 150, '', 'Desk Corner', null, null, this.getTagsForStencil(gn, 'desk_corner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desk_corner_2;', 
					150, 120, '', 'Desk Corner 2', null, null, this.getTagsForStencil(gn, 'desk_corner_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dresser;', 
					100, 65, '', 'Dresser', null, null, this.getTagsForStencil(gn, 'dresser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'elevator;', 
					100, 100, '', 'Elevator', null, null, this.getTagsForStencil(gn, 'elevator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'fireplace;', 
					304, 200, '', 'Fireplace', null, null, this.getTagsForStencil(gn, 'fireplace', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flat_tv;', 
					70, 10, '', 'Flat TV', null, null, this.getTagsForStencil(gn, 'flat_tv', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'floor_lamp;', 
					50, 50, '', 'Floor Lamp', null, null, this.getTagsForStencil(gn, 'floor_lamp', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;', 
					40, 35, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'office_chair;', 
					40, 43, '', 'Office Chair', null, null, this.getTagsForStencil(gn, 'office_chair', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'piano;', 
					135, 143, '', 'Piano', null, null, this.getTagsForStencil(gn, 'piano', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'plant;', 
					47, 51, '', 'Plant', null, null, this.getTagsForStencil(gn, 'plant', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'printer;', 
					40, 47, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'range_1;', 
					50, 62, '', 'Range 1', null, null, this.getTagsForStencil(gn, 'range_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'range_2;', 
					75, 62, '', 'Range 2', null, null, this.getTagsForStencil(gn, 'range_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'refrigerator;', 
					60, 62, '', 'Refrigerator', null, null, this.getTagsForStencil(gn, 'refrigerator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shower;', 
					100, 100, '', 'Shower', null, null, this.getTagsForStencil(gn, 'shower', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_1;', 
					40, 35, '', 'Sink 1', null, null, this.getTagsForStencil(gn, 'sink_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_2;', 
					40, 35, '', 'Sink 2', null, null, this.getTagsForStencil(gn, 'sink_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_double;', 
					80, 35, '', 'Sink Double', null, null, this.getTagsForStencil(gn, 'sink_double', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sofa;', 
					90, 80, '', 'Sofa', null, null, this.getTagsForStencil(gn, 'sofa', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'spiral_stairs;', 
					200, 200, '', 'Spiral Stairs', null, null, this.getTagsForStencil(gn, 'spiral_stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'table;', 
					90, 50, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'toilet;', 
					50, 67, '', 'Toilet', null, null, this.getTagsForStencil(gn, 'toilet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'water_cooler;', 
					40, 40, '', 'Water Cooler', null, null, this.getTagsForStencil(gn, 'water_cooler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workstation;', 
					50, 40, '', 'Workstation', null, null, this.getTagsForStencil(gn, 'workstation', dt).join(' ')),
					
			this.addEntry(dt + 'kitchen table small', function()
			{
			   	var table = new mxCell('', new mxGeometry(0, 20, 80, 80), 'shape=rect;fillColor=#ffffff;strokeColor=#000000;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(20, 0, 40, 52), s + 'chair;fillColor=#ffffff;strokeColor=#000000;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(20, 68, 40, 52), s + 'chair;fillColor=#ffffff;strokeColor=#000000;shadow=0;rotation=180;');
			   	chair2.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, table], 80, 120, 'Small kitchen table');
			}),
			this.addDataEntry(dt + 'kitchen table', 140, 140, 'Kitchen table',
				'5VZdb8IgFP01vJoKuvi61c2XLdnbnrG9FjLa2wBq++93W6gfmWZbXIyJJE2453I/OCdQmEjLZmFlrd4wB8PEMxOpRfRhVjYpGMN4onMm5ozzhD7GX854x703qaWFyv8mgIeAjTRrCEgAnG9NBDZgvc6keZVLMO/otNdYkWuJ3mPJxJPyJfU9H9N0WPtodNGt8VgTKqOVUVNgCXDe4id86NyrGOiUrLt6ZVN0XIxWBtHWRlajTEndxay0MSkatH1XYtWPXa4DT9KPkDPHLYGdEfdJ/UFzlqseikQtAEvwtqUlMWAaqEy2sW+yJhFSoAsVk0wjhdIFu9gl2utAkyjFaVnEvciSawtZ7HwLzv+vUm0wZ7OrCTe5R+EqtF3hi5Rrz56xQZZDqQb5LpFqeo9SOVxT4ctP2HCkri/bw8+yDYx2276JPwc/vo/4d7bGyYkLaQf+gS8y96+H3nf0uPgC'),
			this.addDataEntry(dt + 'round kitchen table', 140, 140, 'Round kitchen table',
				'5ZZNb8IwDIZ/Ta6oJDBx3crGZZN22zm0pomW1lUSoP33c5uUDw20TUwIiUqV4tex4/pR0jCRls3Cylq9YQ6GiWcmUovow6hsUjCG8UTnTMwZ5wm9jL+c8Y57b1JLC5X/TQAPARtp1hCUIDjfmihswHqdSfMql2De0WmvsSLXEr3Hkokn5Uuqez6m4TD30eiim+OxJlVGK6OiwJLgvMVP+NC5VzHQKVl365VN0fVitDKItjayGmVK6i5mpY1J0aDtqxKr/tnlOvAk/RNy5rglsTPid1J90JztVS/FRi0AS/C2pSkxYBpamWxj3WRNoqRAFyommcYWShfsYpdoz4EGEcVpLOJesOTaQhYr34Lz/0uqDeZsdjVwk3sEV6HtFr6IXHt2jw1YDlEN+C5BNb1HVA7XtPDlO2zYUtfH9vAztqGjFKhrBzfx8+DHRxL/3rBxcuJM2ol/aBmZ+wtE7zu6X3wB'),
			this.addDataEntry(dt + 'kitchen table large', 200, 140, 'Large kitchen table',
				'5ZZfb4MgEMA/Da+NQtv5utmtL1uytz1TpUKKngHa6rcfCPZP1mZb2pklkphwd9xx3A8ERNKyWSpa8zfImUTkGZFUARjfK5uUSYlwJHJEFgjjyH4Iv1yxxp01qqlilfmJA/YOOyq3zGu8QptWBsWOKSMyKl/pisl30MIIqKxpBcZAicgTN6XNexHbbj/2UYrCjTFQWy0NUmaTYsoqtFGwYR8iNzw4ak5rN1/ZFK4Wk7UEULWk1STjVDiftZAyBQmqy4qsu3aIdWKJuuZj5rC3SieEddr8WHO1Vp0qFGrJoGRGtXZIcJj5Ukb7kLeVpkHFmSh4CDILJaTay8Uh0JGD7QQUl7GQsWDJhWJZyHzPtLkvqdaLSTIYuOkYwVWg3MQ3kWuvnrEeyymqHt8tqGZjRKVhaye+/YTF0+TsiA3IbT4WbvfAFA93Zz2Mhcvf3FkHVMNfWsn35PqiupX/i52Nz6uFv+7zeH6hXHH0+z+QFY8P8s529l7/BA=='),
			this.addDataEntry(dt + 'kitchen table large', 200, 140, 'Large kitchen table',
				'5ZZNb4MwDIZ/Ta4VH23HdaNbL5u0284puBA1YJSkLfz7GRL6obXapnZoEkhI8es4MX4SEhbGRb1UvMrfMAXJwmcWxgrR2FZRxyAlCzyRsnDBgsCjlwUvV7x+5/UqrqA0PwkIbMCOyy1YxQraNNIJO1BGJFy+8hXId9TCCCzJtUJjsGDhU24KynvhU7Pv+yhF1vYxWJHKnZVQUqBI0EbhBj5EanIXqHNetfMVddbWYrKWiKqSvJwkORdtzFpIGaNE1WUVrrvnMNaJx+seO2aKexJbw30n5Qf11Vp1kivUErAAoxrq4gJmtpTe3uVN1tRJOYgsd4PMXAm5tnZ2GOjIgRoOxWUs4ViwpEJB4jLfgzb3JdVYM4oGAzcdI7gSVTvxTeSaq3usx3KKqsd3C6rZGFFp3NLEt+8wfxqdbbEBuc3Hwu0emPzhzqyHsXD5mzPrgGr4Qyv6nlxfVAoUlYZ/sbiD84IFX5e6P79QMd/7/U+IzOOdvPOdXdk/AQ=='),
			
			this.addEntry(dt + 'office table', function()
			{
			   	var table = new mxCell('', new mxGeometry(0, 20, 80, 50), 'shape=rect;fillColor=#ffffff;strokeColor=#000000;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(20, 0, 40, 43), s + 'office_chair;fillColor=#ffffff;strokeColor=#000000;shadow=0;');
			   	chair1.vertex = true;
			   	var item1 = new mxCell('', new mxGeometry(15, 30, 50, 40), s + 'workstation;fillColor=#ffffff;strokeColor=#000000;shadow=0;flipV=1;');
			   	item1.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, table, item1], 80, 70, 'Office table');
			}),
			this.addDataEntry(dt + 'office table', 140, 140, 'Office table',
				'5VZdb8IgFP01vBoE3bLHrW6+bMne9rhge1vIaG8DqO2/HxTUmWm2RWOWSNKEey73g3MChfCs7uZGtPIFC9CEPxKeGUQXZ3WXgdaEUVUQPiOMUf8R9nTEOx68tBUGGvebABYDVkIvISIRsK7XCViBcSoX+lksQL+iVU5h410LdA5rwh+kq33fs7Gfbtbea1WFNQ5bj4pk5b4pMB6wzuAHvKnCyRRopWhDvbqrAhejUiOaVotmhGWpcnjPpVAhtFRaZ6jRDM3xchjblF88dBgxdYFrDwYjbde3Cd1RygYo8TUHrMGZ3i9JAdPIKF2n9r01SZAEVcmUZMIjJmy0q22inRx+khQ5rA6/MnUKZSBPG1iDdecVrI/m3e3F9JtcsX4NmlD/JAH74yeOH1CMnq7Y9IoVs7j09U8/b5sDdnn1bn5Wb0Ns2Pa/+J2w/duJfWdrTA9cT1vwD3x5c/eyGHx7D49P'),
			this.addDataEntry(dt + 'office table large', 200, 140, 'Large office table',
				'5ZZRT4MwEMc/TV8XaLehj8p0L5r45qPp4IDGwpG22+DbW2i3ubhFzSYxgYSk979ee70fpSUsLpul4nXxjClIwh4IixWica2yiUFKQgORErYglAb2JfTxjDfsvUHNFVTmJwHUBWy4XINTnKBNK72wAWVEwuUTX4F8QS2MwMq6VmgMloTdF6a0eS9C29z1vZMi7/oYrK3KvZXYpEBZQRuF7/AqUlP4QF3wupuvbPKuFpNMIqpa8mqCWSYSeEsKLrrQTEgZo0TVJ8ey/tkP+ckT9I8bOsWtFTvDL9emCc3ZkvWSr9cSsASjWtvFB8xcRYOtT99aUy8VIPLCDzJlTuPa2fl+oAMO2/BETtNhI6OTCgWJX8AWtLkusNaZt9Fg/KYj5leh6ua/CGB7fsexE8SCy4nNRkxM49rOf/l+C2fR0YYbEN98ZPiuQSsc7jyLRobnb86zPbHhD7Sb7wHuatut/F984PS4WvTr5x7OT5QrDH7/P7Lm4ere+45u9h8='),
			this.addDataEntry(dt + 'office table large', 200, 140, 'Large office table',
				'5ZbfT4MwEMf/mr4uQPdDH5XpXjTxzUfTwTEaC0faboP/3oN2m4tb1GwSE0hIet/rtdf7tBTG46JeaFHlz5iCYvyB8VgjWtcq6hiUYlEgU8bnLIoCeln0eMYbdt6gEhpK+5OAyAVshFqDU5xgbKO8sAFtZSLUk1iCekEjrcSSXEu0FgvG73NbUN7zkJq7vndKrto+FitShbcSSgo0CcZqfIdXmdrcB5pcVO18Rb1qazHKFKKulChHmGUygbckF7INzaRSMSrUXXI86579kJ88Qfe4oVPcktgafrmUJtRnS9ZJvl4LwAKsbqiLD5i4igZbnz5ZYy/lIFe5H2TMnSaMs1f7gQ44qOGJnKbDB0YnlRoSv4AtGHtdYI0zb2e98RsPmF+Jup3/IoDN+RPHTxALLic2GTAxg2ua//LzFk5mRweuR3zTgeG7Bq2wv/tsNjA8f3Of7Yn1f6HdfA9wV1sKlJWBf7HHo+OCRV93fDg9UbEw+P0niczD33vnO/q5/wA='),
			this.addDataEntry(dt + 'office table large', 320, 140, 'Large office table',
				'5ZhRb4MgEMc/ja+NQjvbx81ufdmSve1xoYpKhp4B2uq3Hwq1a9YmXWrtEkxMuIOD837+A8HDUVGvBKnyN0go9/CzhyMBoEyrqCPKuYd8lnh46SHk69dDL2d6g67Xr4igpbokAJmALeEbajzGIVXDrWNLhWIx4a9kTfk7SKYYlLprDUpB4eGnXBU672Wgm/uxj5xl7RgFlfYSa8U6KSq0QyoBX/SDJSq3gTInVbteUWdtLSYpBxAVJ+UE0pTF9DPOCWtDU8Z5BBxElxxOu6ef8keP3z1m6gR22tka9nN1mrQ+W7LOZeu1olBQJRo9xAbMTEX9nU1fW1PryinLcjvJFBsfkcbO+okOOHTDEjlNBztGJ2GCxvYDdlSqYYE1xlyEo/GbOsyvBNGufxXA5rzi8Ali/vXEZg4Tk7DR61+vNxSGR4IbEd+DY/gGoBUE4+1noWN4brOf9cTG39DmjgEcglY4nr4WjuG5kb7Cu+lrr2xnCA5x3MDjCSwIHONzG4X1yO6gsAtuPPbF1ZGskvR//OXHFUO//3k0P1GywP/7qVqbhwuoru/ofuob'),
			this.addDataEntry(dt + 'office table conference large huge', 560, 140, 'Conference table',
				'7Zpda4MwFIZ/jbfDJO1cL7fu42aD3e1yZBprWPRITL/+/aJJ25W10NI0DqJQ8Jx8eh5fAm+NyLRcvUhaF2+QMRGRp4hMJYAyd+VqyoSIcMyziDxGGMf6F+HnI62oa41rKlmlThmAzYAFFXNmMibRqLWwiQWTiqdUvNIvJt6h4YpDpZu+QCkoI/JQqFLv+xHp203fe8FnbR8Ftc5SG6V6U0zqRKMkfLMPnqnCDmwKWrfrlatZW4ubXADIWtDqBvKcp+wzLShvh+ZciCkIkN3mSN5d2yl/tcTdZabOYKmTbWAfV2+TrY6WrEvZer0wKJmSa93FDhibisZLu30djWyqYHxW2ElGxORoY+LZdqIdDn1jiRymQwKjk3HJUvsAS9Yot8DWJpwk3viNAuZXgWzXvwjg+rjiyAFi8eXExgETa2Cu13egN5TsCc4jvtvA8DmghZC/8ywJDM91zrMtMf8H2l1gAF3QSvzpaxIYnivpK+lNXxtlB0PQAS49tT8+KDA+11HYFlkPChscj/NxTTwqbPA8nCLrQWGhuR4OcBGPpiIK2eNwpzDSn62IBpvjbFwjjzYHGnwOp8h6UNhgdJyPy6PRgQanwyky/wrDJzgdm+Lqkbxu2L94y/F+xfDfd36MD5QMxef/u6HD3YcAXdvedwI/')
		];

		this.addPalette('floorplan', mxResources.get('floorplans'), false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
