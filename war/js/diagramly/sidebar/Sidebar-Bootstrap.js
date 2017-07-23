(function()
{
	// Adds Bootstrap shapes
	Sidebar.prototype.addBootstrapPalette = function()
	{
		var s = 'html=1;shadow=0;dashed=0;shape=mxgraph.bootstrap.';
		var s2 = 'html=1;shadow=0;dashed=0;fillColor=none;strokeColor=none;shape=mxgraph.bootstrap.rect;';
		var gn = 'mxgraph.bootstrap';
		var dt = 'bootstrap ';
		var sb = this;
		
		var fns = [
			this.addDataEntry(dt + 'button bar dark', 800, 40, 'Button Bar (Dark)',
				'5ZhRb5swEMc/DY+NDKaEvIZ2fdm0qpH27gUDVg2HjNuQfvod2EnJnGxRWqJUsRQJn332+ffnbBOPJmX7oFhd/ICUS4/eezRRANo8lW3CpfQCIlKP3nlBQPDnBd8OtPp9K6mZ4pU+xiEwDq9MvnBjMYZGr6U1FLrEsO58j86bgqWwwgrBSsqagqe2gi11179s824tk9+4gkbj40TxJUYyz4SUCUhQ/aA06EvnqBU8801LBRWOMl8VQvNFzZbdkCscBW02UK40bw8utjfZlT5wKLlWa+yyEqkuTI+YGCCk4CIvrFtobawx9Xzr+o4OHyy9/SSpQzKBsmbV+jSgQ16Wyl5U/wcPlR6An/XF2hfirfP1w48wD45gPg7y0EH+yKFGzGd5hUlfDunyF/asL11nJCyq/MmSoGQE9O0u9oESs5GUuHWUiMNPV8HKoOxbG7uSZNkpkpyMP/wnfuuwttvw5NZRY4NtqIYfGZvikmnxynfG2ieRnf8RBIa1nfyGkp3pb+LdESDLGq4diberOEr1yFH9l4AubKiaC931zph+/tTNP98fKQGnjhTh55/kF5eA0ZUnYOyovtAYdKPF8lITcKRk23fYjXXtmLnUuda4q1wZcxq5zKcjMd/sm8O7ngIkd+Jl76syj87J3HeYf4ccDT9f9HVRn9LRqGP1/WvfHAHDPwP+AA=='),
			this.addDataEntry(dt + 'button bar bright', 800, 40, 'Button Bar (Bright)',
				'5ZdRb5swEMc/DY9FBhNCXkPavmxStUh798IB1gxGxmvIPv0OcBKoSZetpYpUIyT77DP278+dwaFx0TwqVuVfZQLCofcOjZWUuq8VTQxCOD7hiUM3ju8TvB3/4UKv1/WSiiko9TUOfu/wzMQv6C29odYHYQy5LnBZG8+h6zpnidxjg2AjYXUOiWlgT9WOL5qs3Yv7A3dQa6y6Cna4knXKhYilkKqblKZhe7WOWsmfcOwpZYmzrPc517Ct2K6dco+zoM0sFJSG5uJmO5PZ6SPIArQ64JA9T3Tej4hID4TkwLPcuAXGxuq+nZ1cz+iwYuhNk6QWyVgWFSsP/wd0yMtQmUT1d/Cy1APwSVeMfct/t75e8Bbm/hXM50EeWMifQFaI+WNeYdJel3R5gX3VlXYwEuZl9s2QoGQG9M0Y+0CJ1UxKLCwlouDdVTAyKPPWRhOSpATLlZKkXXkL/uBV/MbhYNKwu7DUOGIbquGFvU2BYJo/w2iuKYnM858kx2WdHn5Hyejxd9F4BpmmNWhL4tMurlI9tFT/zmW7bFnWN5r1PjD8vKUdf543UwAuLSmC9z/Jby4Aw08egJGl+lbjomvNd7cagDMF29RhN9dnx8qmDlpjVvlkzGloM1/OxPyYN0fQmdrlruvOnecWU3nOpK6xUC+/r6fsTPCsRJuAVJ8PpC9da+PNeB6Fi3FGstOhRyfUo/+uHjbPf7B9Whv+4P4B'),
			this.addDataEntry(dt + 'button group vertical', 100, 150, 'Button Group (Vertical)',
				'7ZdRT8IwEMc/zR4hZXOojzKUJxMSHnyu9tgau3XpDgZ+eq9b0c2hEmEmRpqQtNe7Xu//y43NC6J0MzM8T+61AOUFt14QGa2xnqWbCJTyfCaFF0w932f08/y7T3ZH1S7LuYEMDwnw64A1VyuoLbWhwK1yhgRTutZ05AWTIuFCl7RgtBC8SEC4Be3k1j/dxLaW4SNVUCBNh8bAE11lYhbyxXqE1huNfoZIK22qHIGoBu00kpWJRFjk/MlGlXQU2ZZSqUbYshpkd1WAQdh8qkRlcjLMQKeAZksupRSYOA9Wq8USkHGyCwudkRe1IX6LfReWJk7b/ToHHZ1vhcRTa406n6wQdfZB76Zsmc7gSwQ5GEn1QcN5HwoDBSV4cOKNDoXg/wxC4GwGFEe5htb5x4C56ICJDHCEk7dB3QX/kIRLMdeSMvts2z5mF6GXywKwQ+7tYgfBDL9/mu0IoZE8i611IqSFI23XTAu9stV/fNCwanRgOSh7OB1E4GI/gXaA04sNXXEtPl084XF0XO7BKGxlH/i79CflNe7wmoKCc/P13XzjPprvsgPzJs8hE2eY/cK87gPmVQfm3EAfNB81va+kf/StZdsK+CXeg1P8ddLy/SOjdm9+g7wC'),
			this.addDataEntry(dt + 'button group vertical', 160, 160, 'Button Group (Vertical)',
				'7VbfT4MwEP5reNQw2Ja9CuheNDFZ1OduHNBYWtLefvnXe0Dd2GBuMZtGI8mW3nd3vd73XQqOH+arsWZF9qBiEI5/6/ihVgrrVb4KQQjHc3ns+JHjeS79HO/ugLdXed2CaZB4SoJXJyyYmEON1IDBtbBAhjkdK+o5fmAyFqslGS4ZMTMZxNYgT1HG56u07OV6Sh0YpOW11jCjowR6wt/KiEEZjVq9QqiE0lUNP64e8jSKLTOOMCnYrMxa0laEJVyIRlpSPYTbLkAjrA4yUUGWhjGoHFCvKWTJY8xsxLBmy82ApxnugczUQLrJ3RJLC8ttN89+i+dn0DzhROC5+a7pbjIllYRPWTfEMpfpPSRlz72yABM8lWSICgsKOi01DY3tuvTRYEjlF8to71RlvK8p07eYBsGQL2Bn/y61bIlHxamy5653t/nIUEliAFvqbg52kuD9luABk/Jf7p+Xe3QJuQctuSMQRODZ9Z4qRJUHc/qXe7fqX5iB9U7CN03E1UVugGFrJG4q/5MBbc49FqiKozNB8vvRKAijrsHYeBIlsesVe3xgfuENceD1Teb2E6yWvvmF9g4='),
		    
			this.createVertexTemplateEntry(s + 'topButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Top Button', null, null, this.getTagsForStencil(gn, 'topButton', dt + 'top button').join(' ')),
			this.createVertexTemplateEntry(s + 'bottomButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Bottom Button', null, null, this.getTagsForStencil(gn, 'bottomButton', dt + 'bottom button').join(' ')),
			this.createVertexTemplateEntry(s + 'rightButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Right Button', null, null, this.getTagsForStencil(gn, 'rightButton', dt + 'right button').join(' ')),
			this.createVertexTemplateEntry(s + 'leftButton;rSize=5;fillColor=#3D8BCD;strokeColor=#0D5B9D;fontColor=#ffffff;spacingLeft=10;align=left;whiteSpace=wrap;', 
					160, 40, 'All Users', 'Left Button', null, null, this.getTagsForStencil(gn, 'leftButton', dt + 'left button').join(' ')),

		   	this.addEntry(dt + 'dropdown large', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 140, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=16;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Large)');
			}),
		    
		   	this.addEntry(dt + 'dropdown normal', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 120, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=14;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Normal)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 100, 22), s + 'rrect;fontSize=12;rSize=5;strokeColor=#dddddd;spacingRight=10;perimeter=none;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown tiny', function()
	   		{
			   	var bg = new mxCell('Dropdown', new mxGeometry(0, 0, 90, 20), s + 'rrect;rSize=5;strokeColor=#dddddd;spacingRight=10;fontSize=10;whiteSpace=wrap;fillColor=#ffffff;align=center;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#000000;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);
				
		   		return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Tiny)');
			}),
			this.addDataEntry(dt + 'button group justified large', 240, 40, 'Button Group (Justified, Large)',
				'5ZXBbsIwDIafJlfUNoB2pmxcxmU8QUZcEi1tqtRby55+bhJGUYfGYYwDkSLZv20l/hwpjOdlt3KiVmsrwTD+yHjurMVglV0OxrAs0ZLxJcuyhDbLns5EUx9NauGgwksKslDwIcw7BCUIDe5NFBSWdK1lyviiUULalpyEHCkaBTI6FKn7/LLb9b1MXqmDBsmcOAdbusrCbfRnnzHrs9HZN8itsc6fwaVfFCm0MQO98Iv0eE1wCN3ZVr0U+1yBLQHdnlJaLVHFdqcBR6JA71QsO2iiCf7uu/QIjozI7meOfMTxGQr8c5YB5RBSZSsYEY1iDU5TJzCQClthHEQ6J79VGmFTi22vtHTGpayzX1k/XAn1dIR6raUkwjeCPXy+NyDendL+hwHMRgN48Qfc3WM/FMyvxp7c41/gYydfxRc='),
			this.addDataEntry(dt + 'button group justified normal', 180, 30, 'Button Group (Justified, Normal)',
				'5ZXBbsIwDIafJldUEph2pmxcxmU8QUZcEi1tqtRby55+bpKNog6NwxgHIkWyf9tK/DlSmMjLbuVlrddOgWXigYncO4fRKrscrGU8M4qJJeM8o83444noNESzWnqo8JwCHgvepX2DqEShwb1NgsaSrrWcMrFotFSuJScjR8lGg0oOReo+v+x2fS+TF+qgQTIn3sOWrrLwG/PRZ8z7bPTuFXJnnQ9nCBUWRQpj7UAvwiI9XRM8Qney1SClPlfgSkC/p5TWKNQp4z7iyDSYnU5lImmyif7uu/QAjozE7meOYsTxCQr8c5YR5RBS5SoYEU1iDd5QJzCQCldhGsR0Rn6rDcKmltteaemMc1nzX1nfXQj1bIR6bZQiwleCPXy+VyDeHdP+hwHMRwN4Dgfc3GP/KuAXY0/u4S8IsaOv4hM='),
			this.addDataEntry(dt + 'button group justified small', 150, 22, 'Button Group (Justified, Small)',
				'3ZTBbsIwDIafJlcUkvUFKBuXcYEnCMRtoqVNlWZr4ennJmEUdWgcBpMWqZL9267tT1EIz6t+5USj1laCIfyZ8NxZ66NV9TkYQxjVkvAlYYziR9jLleg8RGkjHNT+lgIWCz6EeYeoRKH1B5ME5SscazknfNEqIW2HDkVHilaBTA5GmiG/6sthl9kON2g9mjPnYI+jLNxWH4eMbMj2zr5Bbo11oQeX4WCk0MaM9CIc1NOY4Dz0V1cNUtpzBbYC7w6Y0mnpVcrIIg6qQJcqlZ12Fm30y6/SMzg0ErvvOfIJx1co/K+zjCjHkGpbw4RoEhtwGjeBkdQp7WHbiP3QoMN/3sqW/cj2XmifJmjXWkok+kdwx9f1AYT7S7oPAJ5NgG9Cg39/mU8F9G6s0T2/7SF28fR/Ag=='),
			this.addDataEntry(dt + 'button group justified tiny', 120, 20, 'Button Group (Justified, Tiny)',
				'5ZXBbsMgDIafhmuVQCvt3HTrZb2sT8CKU9BIiIi3pHv6GcLWVFm1Htb1MCQk/NuW7Q8kmCiqfu1lozdOgWXinonCO4fDqeoLsJbxzCgmVozzjDbjD2e8efRmjfRQ4yUJfEh4k/YVBmUQWjzYJGisqK1VzsSy1VK5joyMDCVbDSoZ5GlCfNXvwyyzZ5qgRTrOvIcdtbL0W/MeIhYhGr17gcJZ52MNoeIiT2msHellXKSnNsEj9GdHjVKacw2uAvQHCumMQp0iEo5Mg9nrlPapyXaw91+pR3B0SOy+5ygmHB+hxF9nOaAcQ6pdDROiSWzAG5oERlLpakwXkYdanTYI20bugtJRjUtZ8x9Zz6+Eej5BvTFKEeEbwR4/3xsQ709p/8EFLCYX8BQL/LvHnhLuroaezONXEH0nP8UH'),
			this.addDataEntry(dt + 'button toolbar', 260, 30, 'Button Toolbar',
				'5ZfdboMgFICfhttGpb+32q1Xu+oTsIpChmKQTrun30HZ2oZ280Jd40hMOH+B84HnBISjrN4pUrAXGVOB8BPCkZJSt7OsjqgQKPB4jPAWBYEHHwqe71j9xuoVRNFcdwkI2oB3Io601bSKUp+EVTCdwba2PsJhyUgsKxA8EGJSMhpbASyF8c/q1OQye4UMSg3TmVL0AFsJ1Z5/GI+F8dZKvtFICqmaNXDcDLDY7VClaX03pUZl89lRmVGtTuBS8Vgz62HT9hjlKbNh2OpI2crpd+gZEEwso9u8sMPL7xuYoIkOj1rLvDO1gioOqVCjz2UOAWEic21j/TnIFeOa7gtyMJoK1ukKO/gVNh6I9dxh3f/lbO/mQ5GtrwmOAHrhgMb/CPRyPNBLB/S8d9Bmx49fPmzAZjz2qwl1uq+AGzViMxC+tYNvMfHGt/qzxrdxWC8nVY/vkB2/8fmeQ3o19YL8M/wRm6HvO/DXQ5XkS3qQfUgET+E4tgfAYih3PJdb0BMuxIVv0ox+6vuAvwKI50dmY7t6g34C'),
			this.addDataEntry(dt + 'button group nested', 160, 30, 'Button Group (Nested)',
				'zZVdboMwDIBPw2MrIKUHALY+TZrWE2TFQLSQoOAWutPPgfRP0LUP69RISPEftj9HiceSqlsZXpdvOgPpsRePJUZrHHZVl4CUXuiLzGOpF4Y+fV74esUa9Fa/5gYU3hMQDgE7LrcwaAZFg3vpFCVWVFYaeCxuSp7plgSfhIw3JWROIEtt/auusL3MP6mDBmk7NwY2VEps1uLbekTWG43+gkRLbfocLOsXWVw5YBC6qy31KtfPCnQFaPbk0ooMS+exHNr2SxBF6cKY0/FmkItj6AkQbRyjaV5sxCv4a2AScoy3iFrdTa0GI6gVsHqlFQXEuVboYoMFyW0pENY131hNS3nuhR3ehM0exHoxYv33h3M4m09Ftrsk+A+goxHo1OiaYKpn5N0QaqGKD8cg8B83g+V4BoH/oCEsb9/EB65oBFeF1caZsEiFvSvSRm9tlXEupDxj6/drRN3RnQB+F7joV3AuYO+eoHk0wXGM0XkZkBzF7vJ+nULr0r9rQVUdc8+C6CL7LDykP/xD53kDOBrOsY2peZF4epUH9/NH+wc='),

		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=16;whiteSpace=wrap;', 
		   			80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=center;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
		   	
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#3D8BCD;align=center;strokeColor=#3D8BCD;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#58B957;align=center;strokeColor=#58B957;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#55BFE0;align=center;strokeColor=#55BFE0;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#EFAC43;align=center;strokeColor=#EFAC43;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=16;whiteSpace=wrap;', 
					80, 40, 'Button', 'Button (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'button large').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=14;whiteSpace=wrap;', 
					60, 30, 'Button', 'Button (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'button normal').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=12;whiteSpace=wrap;', 
					44, 22, 'Button', 'Button (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'button small').join(' ')),
			this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#DB524C;align=center;strokeColor=#DB524C;fontColor=#ffffff;fontSize=10;whiteSpace=wrap;', 
					40, 20, 'Button', 'Button (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'button tiny').join(' ')),
			
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Primary', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#3D8BCD;strokeColor=#3D8BCD;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Success', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#58B957;strokeColor=#58B957;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Info', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#55BFE0;strokeColor=#55BFE0;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		    
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Warning', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#EFAC43;strokeColor=#EFAC43;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),
		   	this.addEntry(dt + 'dropdown small', function()
	   		{
			   	var bg = new mxCell('Danger', new mxGeometry(0, 0, 100, 22), s + 'rrect;align=center;rSize=5;fillColor=#DB524C;strokeColor=#DB524C;fontColor=#ffffff;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var marker1 = new mxCell('', new mxGeometry(1, 0.5, 10, 5), 'shape=triangle;direction=south;fillColor=#ffffff;strokeColor=none;perimeter=none;whiteSpace=wrap;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-20, -2.5);
			   	marker1.vertex = true;
			   	bg.insert(marker1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dropdown (Small)');
			}),

			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZRtboMwDIZPw89VQNoLAPv4M2laT5AVA9ECQcEU2OnnQGhpoR3SGgkJv7YT248Sh4V5+6p5mb2rGKTDnh0WaqVw+MvbEKR0fFfEDosc33fpc/yXG16v97ol11DgmgR/SDhyWcOgRJDwWuKgV9hJq2eYU3WR57CgynisGjJcMmJeZRBbgzylic/b1LS0+aJGKqTfjdZwoIqCREgZKql0vytL+kU6lyItSDtQ4UDOQO/Fj9lqZ7ZFrb5hkhb3y3hKfhBF+inSzPTrmyISVaBN9rZkN5lA2FOgURoqhjTbNmiE9uboesnO7RVUDqg7CmlEjJmNsON1M7AVkMmsxqvBTk+pZxD0Y1ksc2EzLg8HYgoOakRVXE17iqhQBdwFUIIW1B1MgjVUtNnbOBFv7bj95XFfJkyGz+7MXoPkKI5wkbsExJ73oQSVcTrs6ZqhSpIKcEbwVOYqqNu/oY68UAtepEYNYmGujjCYokrVpvvrW+T2a8bJ8lhAtIoHW8Ojs6/MZjfj4y3w2T0Gz3jtutEej/8PLzLPD+8QPn2XfwE='),
			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZTdboMgFMefxss1KjXZbtWtu1nSrE/A6lHIUAzSqnv6HRStbW1nspqYcL7g8P8BDonyZqNoyT5kAsIhrw6JlJS6H+VNBEI4vssTh8SO77v4O/7bjajXRd2SKij0kgK/LzhScYDes1U8p6rt/ZVuhfUznWN3seeQsGI0kTUaLhoJrRgk1sBIafLzJjNbWn3hRiqNw5VSsMeOQip4VmDGHhsEhQ614z+mJMBxyoWIpJCqW5KQ+DmMYjOtVvIbJhE3DsKXLlLSPS+yT54xs1/fNJHKQttJvbW1J7Vp96G/ZlzDDicwmTU2iT4rBygNzU1JO5fVcwMyB230cmueaGYzrOwuA9sZmsT6aNXb2Vh6AoQDy2ieF7ni9XBQpuHwoLUs7tApZAF3wZSA5wg6xEOyggonex8U8ZbK7c/LfV4wEZ/c0V6BoJof4ax2Dohdbys5tjEu9nTJUKZpBfqK4NjmIqjrv6EOvLTitMiMN0y4uVLcYIoreTC7v7xA41E/52R5zCBaxIMs4dHa12cVXPHxZvgEj8EzXLt2sIfl/8MLzdOD3KdP3+tf'),
			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZRRb4IwEMc/DY8z0Eqmr+jmXpYs8xN0cECzQklbFfbpd4WiqOhIpglJ73937d39bD26KuqNYlX+LhMQHn3x6EpJabpVUa9ACI/4PPHo2iPEx88jrze8Qev1K6agNFMSSJewZ2IHnbLdxTFo3enaNMLpuSmwunXg0UjnLJEHNHw0EqZzSJyBnsrGF3VmW5p9YSPa4HKmFMRYUcQEz0qMiLFAUCioLf+xKSGuUy7ESgqp2iNpuIiW4bPd1ij5DQMPWSyWpPVULOZl9smz3PZLbBGpLI3bNJg7e5Cbtj/UDzk3sMUNbOQBi0TNjQOUgfrmSFvJzXMDsgCjGgw58MTkLsKN3c/BVYYmdRrTnZ0dU0+AcOEYjfOiV7weDsoWHO2MkeUdOqUs4S6YChTH7mAQrEDjZm/9RIKp4ybj4z5PGAyf3pm9AsEM38NZ7hgQd96H5FjG8bCnS4YyTTWYK4LHMidBnf8NtedlFGdlZtUo4fZKcYtpreXOdn95gY5/9XNOjscIokk86BQejXt9ZuEVn2CET/gYPP21a3q7P/4/vNA8Pchd+PC9/gU='),
			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZTbboMwDIafhstVQIq0a+hhu5g0rU+QFUOihQSFtMCefg6ElrasQ1orIcW/7cT218QjSdFsNS3Zm0pBeGTtkUQrZfpV0SQghBf6PPXIygtDHz8v3PziDTqvX1IN0sxJCPuEIxUH6JVXmalerEwrnMhMgaWtAo/EFaOpqtHw0UhpxSB1BnpKG180ue1n8YldVAaXC61hj+XEVPBcYsQeqwONgt7xb5sS4TrjQiRKKN0dSaIo3qy7bY1WXzDyhNHzJu48Jd1zmX/wnNlmQ6tlShq3abB09ig3636o14wb2OEGNrLGIlFzswBtoPl1np3khrkFVYDRLYbUPDXMRbiZ+wxcZWgSp9Gqt/NT6pkOLhygaVjkBtbDQdmC44MxSt6hI5WEu2BK0By7g1Gwhgo3exkmEswddzg97suE0fDJndlrENTwI1zkTgFx570rjmWcDnu6ZqiyrAJzQ/BU5iyoy7+hDryM5lTmVo1Tbq8Ut5hWlTrY7q8v0OmvfsnJ8ZhANIsHmcOjdU/PIrrhE0zwiR6DZ7h27WAPx/+HF5rn17gPHz/WPw=='),
			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZRdb4IwFIZ/DZczQDW7HvixmyXLvNh1JwfarLSkVIH9+p1CUVR0JNOEpOerfc95bD0S5/VG04K9qQSER1YeibVSplvldQxCeKHPE48svTD08fPC9Y1o0Eb9gmqQZkpB2BUcqNhD5/mkWnKZdf7SNML5mclR3TLwSFQymqgKDR+NhJYMEmdgpLD5eZ3ZlmZf2EhpcDnTGnaoKKKCZxIzdigQNDr0lv/YkgWuUy5ErITS7ZFktX6J58Rua7T6hkEkWj/HQRsp6A7VfvCM2X5DKyJV0rhNg7mzB7Vp+0N/xbiBLW5gMysUiT43DtAG6psjbV1unhtQORjdYErFE8Nchhu7z8ApQ5M4Hy07OzuWngDhwjEa50WueD0clBUc7Y1R8g4dqSTcBVOA5tgdDJI1lLjZaz+RYOq4w/FxnxcMhk/uzF6DoIYf4Kx2DIg7711xlHE87OmSoUrTEswVwaPMSVDnf0PteRnNqcysN0q4vVLcYlqWam+7v7xAx7/6OSfHYwTRJB5kCo/GvT6zxRWfYITP4jF4+mvX9HZ//H94oXl6kLv04Xv9Cw=='),
			this.addDataEntry(dt + 'dropdown split', 120, 30, 'Dropdown (Split)',
				'rZTrboIwFICfpj9noJUHGLC5P0uW+QSdHKBZoaRUgT39TqEoKjqSaULSc+u5fJ4SFhXtRvMqf1cJSMJeCIu0UmY4FW0EUhLqiYSwmFDq4Ufo6w2r31u9imsozZIAOgQcuNzDoIl5mYEe1LXppFPnpsDiYp+wsM55ohoUPBQSXueQOAEtlfUv2sx2tPrCPmqDx5XWsMOCQi5FVqLHDuvDLCzUW/FjQwI8p0LKSEml+5QsDgO6juy1RqtvmFieQ2y1t1R8J8rsU2S5bZfaIlJVGnepv3byJDbtf6hvcmFgixdYzwaLRJ2bBmgD7c2J9io3zg2oAozu0KURicmdh5u6l4OrDEXmdLwe5OwYeuKDB4doHhe7wvVwULbgcG+MKu/QKVUJd8FUoAV2BxNnDTVe9jZOxF86bjo/7vOAyfDZndlrkNyIA5zFzgFx+T6UwDKOyZ4uGao0rcFcETyWuQjq+m+oIy+jBa6n1YaJsCslLKa4Vnvb/eUCHf/q55wcjxlEi3iwJTw69/isgis+/gyf4DF4xrXrRnlM/x9eKJ7e48F9+lz/Ag=='),
			this.addDataEntry(dt + 'dropup split', 120, 30, 'Dropup (Split)',
				'rZRtboMwDIZPk5+rgLQXgO7jz6RpPUHWGIgWEhTSAjv9HAgtLbRDWiMh4dd2YvtRQmhSNK+Glfm75iAJfSY0MVrb/q9oEpCSRIHghG5JFAX4kejlhjfsvEHJDCi7JCHqE45MHqBXtkaXh7KXK9tKL+e2wOK2IaFxlTOuazQCNDircuDeQE/p4osmcx2tvrCPyuLvyhjYY0FxKqRMtNSm25Wm3UKdSZEp1PZYN6AzNjvx47bauG2t0d8wSuPdcp6S7YXKPkWWu3YjV0SqlfXJ4RrtOhcWdhjolBqLQc13DcZCc3NyneTH9gq6AGtaDKkFt7mP8NMNcvAVoEm9xqrezk6pZw7441HMY6ETLA8H4gqOD9ZqdTXtMSKlFdwFUIIR2B2Mgg1UuNnbMJFw6bij+XFfJoyGT+/M3oBkVhzhIncOiD/vQwss43TY0zVDnaYV2AnBU5mLoK7/hjrwskYwlTk15sJdHeEw4YSN6/76FgXdmnDyPGYQLeJBl/Bo/SOz2kz4hDN8No/BM1y7drCH4//DC83zu9uHj5/lXw=='),
			this.addDataEntry(dt + 'dropup split', 140, 30, 'Dropup (Split)',
				'rZTbboMwDIafhstWQFppuwV2uJk0rU+QFQPRQoKMu7Z7+jmQtnRlHdKKhBSfYuf/IIFI690TyqZ6sTnoQDwEIkVrqV/VuxS0DuJQ5YHIgjgO+Q3ix1+iURcNG4lgaEpB3Bd8Sr2B3vOmyorYlaNtNk0fbmmvfbiimofMokAkbSVzu2UjZCOXbQW5NzjSuPx6V7qTzd/5PC3xco4Iax4skVqVhjPWPCcgO3ClvlzJkteF0jq12mLXUojsLkkzty2h/YBBJMyWyX0XaeRambKfXWSxG6Kwhvym0cLbg9qie9i/rRTBijdwmVsekn1eFUCC3a/Kdi4v6xPYGgj3nLJVOVU+Y9GrH1bgJ2NTeJ9se7s8lp448cKjGscmLrDdHJQbONkQWXOFjrEGroJpABWfDgbJCC1v9nxQJJoqdzwu93nBQHxxRXsELUl9wlntGBDf79UqQ6dms58MbVG0QBcEj2NOgrr4G+qBF6GSpnTeJFful1IOEyuM7vQ/f6Djp37OyfMYQTSJh5jCY+8vofnygk80wmd5Gzz+0jt0n8WH9v/hxebpXu7Th9f2Nw=='),
			this.addDataEntry(dt + 'dropdown menu', 160, 90, 'Dropdown (Menu)',
				'rVTbbtswDP0aPzaw5TTYaxKv3UMLDOt+QItoS5gsGbKay75+pCQ7bu0CGToHAcw7eQ7prNy350fHO/lsBeis/JqVe2etj2/teQ9aZyxXIiurjLEc/xl7+MBaBGvecQfG3xLAYsCR61eImsrZTtiTiYbeX3QySN9ie1WRlbtecnRBIUdB8F6CSAJaOvJvzw3NtPqFk/QeX1fOwQFb2nGtGoMeB+wQHCrci/pDIfcU7p39DXurrQtFSxEesnT8oEzzQzWSBiuoWG2NT8HFBmUsKRSmncTDmn4TW6WoD2WpBWOdl2g7SeXhBQtQphM2i7qECzgP5w+xDaoE7CPYFry7oMtJCcobPNYR/1xC6hzFQcf7KDdj6JUpfElkLRNXzoibETZw4Z3ipiHtTkym7+1rmL5WWk8Qy8Mz48JYQwk6cAp7hYnqJqTYMlJvAy5pY1f3UZ7iuABj8nKguVdHeJNqCdpU/rtV2NVY+y5dyFD9jg3lhxy2rnvwM3LGMW7iaz3jaxuJYBsEPazz1lgvEVmWD6b/fIHxAN/xXYfn3TWxJC/tBekfeKs0AfYN9BG8OvAhQep2vkALx/wE9XjL40DF5Buhg8OOdgtL6G1Se9tdk/wkoSo/ebKJ/DWbb95m6YK//PMFo3j9rMcFmn71/wI='),
			this.addDataEntry(dt + 'dropdown menu', 160, 200, 'Dropdown (Menu)',
				'7VhRb6MwDP41PK4iQLne47W97WWTTteHe86GgWhpgkK2tvfrzyGhZQXaSgztOi1SJew4tvN9thXVCxfr7Z2iRf4gE+Be+NMLF0pKbb/W2wVw7gU+S7xw6QWBjz8vuO3ZJdWuX1AFQl9yILAHXil/AatZKlkkciPsRql33G3keo3pLYkXzsucogkKPgoJLXNInIA7hbFfbzNzp8kj3qTU+DlRCp4wpblasb/GYmqstZLPsJBcqipGmFTL7BT0iYnsN8tycw9ifKdSaHeYxEZmnDfO3lYL9ZSzTKCOQ6oPru4ryXra5EzDCvXG1wazQ50DApSGbS+YlcoheQdyDVrt0GTDEp07C2IB93NwuaMYOR0trZztjx6owQ/HTjdTYYupFkM1+FoxKjKjnSfMwM6kwaOULybLY9z8arXYEFIYBwUohrlCQ3URUkE3Um8P7FyJTqZWbuLYAaOzUsCpZq/wxlUXtC78L8kwq33sG9cSdfSboA5f+5BpWoJukbO/xkV8Ref5GtpRtqGO6Eyrdbq56mBkYN07BKOgTV/cwR+Zzob3wfTExMJoNMFSHQfozv7omC5H86fJT39TmeHWxVVz6JGe0aWgRIs/Dv2LSY3OD7NOFuNhbeiK5qgU3qXn4lZt/LDD7woL4uOJrufkQKJHYfpbm2khdW5636dfnH8059EYnM/ak5+V9JEjeYHPmXj+7ynvG/KfuRTiMUrh+/nHVU0rFgacfA11gH+VQM/GALp+hn89t678uUX8UcqDtMpjBXhpqq9nKH/m4Uve4/GF4uEPKWve/L/qHw=='),
			this.addDataEntry(dt + 'dropdown menu header', 160, 150, 'Dropdown (Menu, Headers)',
				'7Vffb9sgEP5r/NjIxk6WPS5J25dNmpaHPdP6bKNisDBtkv31OwxO3EBbq2mmtSpSJO64X3wfR3CULuvttaJN9UPmwKP0MkqXSkptZ/V2CZxHJGZ5lK4iQmL8ReTqidWkW40bqkDoMQ7EOjxQfg9Ws1KyyeVG2IVW77hbqHSN5a2SKF20FUUTFGIUctpWkDsBVxpjX29Ls6fJDe6k1TidKAW3WNJCrdkfYzE11lrJO1hKLlWXI827YVYaestE+YuVldlHYmIXUmjnnMyMzDgf+F51A/WUs1KgjkOhD6G+d5KNtKmYhjXqTawNVoc6BwQoDdsnwexUDslrkDVotUOTDct15SwSC3hcgasdxczpaGvlcu96oAYnjp0wU6nHlMdQD75WjIrSaBc5M7AzafBo5b2p8hi3uBseG0IKE6ABxbBWGKhGIUXCSD122LkjOplaeYhjAEZnpYBTzR7gUagQtC79T8mwqn3uC9cSffYL0qfvY8iiaEF75Oy3MYqv7GW+Tu0o21BHdBbdeL65+mTJiefeIZgRn75ZgL8knp/eB1MP12/2gJ8H3WBTBK6Uo0tnSIpzCl06Clq80H473EbTkb18DYXw7w/+axvI0X1E4pt0y8xnVUhd4bWDiT75/af8noXgL/5Dg7X0hiNTJOZM3P33/JrnR+g2/TC8Z+fgfT7+2YKnAJ793wq8Rd4l0LNzAP3VA3oNuGWq30+HBfj9MM01fwPOUTx8GVrz4YfjXw=='),
			
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('Username', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=50;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('@', new mxGeometry(0, 0, 40, 30), s + 'leftButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg.insert(bg2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
	
		   	this.addEntry(dt + 'input group', function()
	   		{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 250, 30), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;spacingLeft=10;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('.00', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;whiteSpace=wrap;resizeHeight=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-40, 0);
			   	bg2.vertex = true;
			   	bg.insert(bg2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Input Group');
			}),
			this.addDataEntry(dt + 'input group', 250, 30, 'Input Group',
				'1VTrToMwFH6a/nQpFF5gTOcPTUz2BHUcaGOhpJwN5tN7CnUXx3TR/bGE5Nwv35eWiazql0426tnmYJi4ZyJz1uIoVX0GxrCY65yJBYtjTj+LHy54o8HLG+mgxmsS4jFhK80GRstoaHFngkFhRWMtIibmrZK57UjhpOSyVZAHhTyNj6/60u8ye6UNWiRx5hysaZS5W+l3H5H6aHT2DTJrrBt6iHw45Cm0MUf2Yjg+o5FrXZdPUPi1Ut+ysDWGmlFCujS6rEkxQ8zgnurQKY2wonI+saMJyRZAAIfQXwRyMAUUl2ArQLejkE7nqAKY6Qg2V6BLFdJEsMl21Mt96oEWEgIz0yyJCZaSWxPlcZtvEG39a7a4/y5g7KClko+fyETXwh7/CHvyDeoOjES9hZPyf6EiOaNixvnN74xf5P9wcZpwa2ZCvxeraYx9s7vky72yRdECnlG5H3OKXVIPT+0YfvwSfwA='),
			this.addDataEntry(dt + 'input group', 250, 30, 'Input Group',
				'tVRdb4IwFP01PM4AFbNncXMPW7LE7AdUuNDGQkmpgvv1u6VFceJG9lFC0nO/7zlJPRIX7VrRir3IFIRHHjwSKym1vRVtDEJ4oc9Tj6y8MPTx98LHG96g8/oVVVDqKQmhTThQsQdreatBlbQA66j1UTgH0wWOtwo8sqwZTWWDwEeQ0ppB6gB6KhNftLnZabbFTWqN15lSkOBIS7Xh7yYiMtFayR3EUkjV9SBpd9CTcSEG9qw7JqOiCS/zZ8jMepFpmclSu5rBHDEVPC8RiC6mc491aBjXsMFyJrHBCdHmyAClob1JaGdybK5BFqDVEUManmrmSI0s6T4DnjOXRpyN1hbnp9SzPHhxCo2rRa7U+muVDGnLvday/LFUvvluEKygxpJPPS3BVM7Dbzmff0G5AkE1P8BF+d/oMP93HRIGyW4r24EKZEyFRXem0kjGaXQJ/iyyKcdPeEBzsLimubdNptlN8Co5DnZqf3d/0b2HfQGZZTXoK5VOa4wJh/D8lNrw4Uv7AQ=='),
			this.addDataEntry(dt + 'input group', 250, 30, 'Input Group',
				'tVTtToMwFH2a/nQBOhZ/j+n8oYnJ4gPUcYHGQknbDebTe0vLPoQp8aOEpOd+33OSEpqU7VqxuniSKQhC7whNlJTG3co2ASFIFPCU0BWJogB/Et1f8YadN6iZgspMSYhcwp6JHTjLiwZVsRKcQ5uD8I7ClDjeKiR0qQuWygZBgCBluoDUA/TUNr5sc7vT7BU30QavM6VgiyMt1Ya/24jYRhsl3yCRQqquB027g56MC3Fmz7pjM2q25VX+CJldL7YtM1kZXzOcI2aC5xUC0cV07rEOTcENbLCcTWxwQrR5MkAZaK8S2pk8m2uQJRh1wJCGp6bwpMaO9KAAnhc+jXob0w7nx9STPHjxCo2rRQdq/bVKlrTlzhhZ/ViqwH5XCFagseRDT0s4lfPoW87nX1CuQDDD93BR/jc6zP9dB8VSLgdC0DEhFt2ZyiQdZ9InBLPYpRw+4TOmw8WQ6d42mWk/wbPkONix/c3tRfce9gVklmkwA6GOa4xph/D0mrrw88f2Aw=='),
			this.addDataEntry(dt + 'username large', 250, 40, 'Username (Large)',
				'tVTrboMgGH0af65BafsAtVv3Y0uWNHsAVj+FDMEArXZPvw+ht9Vu3Q1jwvnunKMkNK+7hWENf9QFyITeJjQ3Wruwq7scpEwyIoqEzpMsI/gm2d0Fb9p7ScMMKHdNQhYSNkyuIVieLRjFaggO67YyOrircbx5mtCZ5azQLQKCoGCWQxEBehofX3eVP9PoBU9iHW5HxsAKR5qZpXjzERMf7Yx+hVxLbfoetOgXekoh5ZG97JfPaNhKqOoBSn+8qW9ZauVizXSKmElRKQSyj+ndQx1aLhwssZxPbHFCtEUywDjoLhLamyKbC9A1OLPFkFYUjkdSJ4F0wkFUPKaNo43ZgKt96kEe3ESFhtWiZ2r9tUqetNnaOa1+LBXxzwWCDVgseb+jJb2W8+xLzj+j3IBkTmzgpPxvdBj/uw5r/As/VUBpBefkk35dyyodZjUmkNEkpGw/4OMvfYD17LusxwmetMDB9u1vUnLSfo93JXRZWnBnsu0PMqQkwsPdGsKPr953'),
			this.addDataEntry(dt + 'username normal', 250, 30, 'Username (Normal)',
				'tVTJboMwEP0ajo0MDuo9pE0PrVQp6ge4YQCrBiPbCaRf3/GSpYG0qIsRkmd5s7wniGhW9yvF2upJ5iAiehfRTElp/K3uMxAiSgjPI7qMkoTgGyX3V6Kxi5KWKWjMFEDiATsmtuA9LxpUw2rwAW32IgQqU+N4yziiC12xXHZoEDRypivIg4GR1ubXfWl3mr3iJtrgdaYUbHCkhVrzd5uR2myj5BtkUkjletDcHYwUXIgzf+GORbRsw5vyEQq7XmpbFrIxoWY8R5sJXjZoCJfjwmMduoobWGM5C+xwQvQFMkAZ6K8S6lyBzRXIGozaY0rHc1MFUlNPOqmAl1WA0eBj2tvlEXqSBy9BoXG16ECtv1bJkrbYGiObH0tF7HOFYAUaSz4caImncp58y/n8C8oVCGb4Dj6V/40O83/XYYtf4ZcKNLKBIfnEnams0nFWA4DMUg/ZX9hnrMfpkPWDbzLrYYJnyXGwY/ub24v+J8ehiCwKDWYg3HGVMS3RPP1dffr5z/cD'),
			this.addDataEntry(dt + 'username tiny', 250, 20, 'Username (Tiny)',
				'tVRZbsMgFDwNn42wSS6QpMtHK1WKegAaPxtUDBaQ2Onp+8Bka5w03bAsMbx9xoawWd3dW96IJ1OAIuyWsJk1xve7upuBUiSnsiBsTvKc4kvyuzPWLFppwy1of01A3gesuVpBf/LiwGpeQ29wfqOSQfga25tnhE2d4IVpEVAEBXcCigTQ0gT/uqvCTKNXnMR53I6shSW2NLUL+R48JsHbW/MGM6OMjTVYERdaSqnUwXkZV4ho+FLq6hHKMN44lCyN9ilnFjBXstIIVPSJ5qEKrZAeFpguBLbYIZ4lMsB66M4SGo8Sm/dgavB2gy6tLLxIpE560qkAWYkUloSg3PW42oXu5cFNUmhYLXai1l+rFEibrrw3+sdS0fCcIdiCw5QPW1qyqwjPvyScXeDbguJeruEo/W9EGP+7CCv8BS/Sr42GU+ZpXNd+xmyY1RRAR5M+ZPMJH7CeDbCefZf11MGzkdjYrvzNcfUt3CYwZenAn4i2G2NIR4T7a7V3P7x1PwA='),
			
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=16;align=left;spacingLeft=10;whiteSpace=wrap;', 
		   			250, 40, 'Johnny Boo', 'Full Name (Large)', null, null, this.getTagsForStencil(gn, '', dt + 'full name large').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=14;align=left;spacingLeft=8;whiteSpace=wrap;', 
		   			250, 30, 'Johnny Boo', 'Full Name (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'full name normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;rSize=5;fillColor=#ffffff;strokeColor=#dddddd;fontSize=10;align=left;spacingLeft=6;whiteSpace=wrap;', 
		   			250, 20, 'Johnny Boo', 'Full Name (Tiny)', null, null, this.getTagsForStencil(gn, '', dt + 'full name tiny').join(' ')),
			
		   	this.addEntry(dt + 'final price large', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 40), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=10;fontSize=16;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 50, 40), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=16;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-50, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Large)');
			}),
			    
		   	this.addEntry(dt + 'final price normal', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=8;fontSize=14;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-40, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Normal)');
			}),
		    
		   	this.addEntry(dt + 'final price tiny', function()
	   		{
			   	var bg = new mxCell('Amount', new mxGeometry(0, 0, 200, 20), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;spacingLeft=6;fontSize=10;align=left;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('UAH', new mxGeometry(1, 0, 30, 20), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=#f0f0f0;fontSize=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-30, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Final Price (Tiny)');
			}),
			this.addDataEntry(dt + 'segmented button large', 400, 40, 'Segmented Button (Large)',
				'vZXdTuswDMefhYteUvWDIrjddhgX50hIEw8QVreJTtpUicc2nh6nSUdHu1HERKRKsWM7zv+npEE6r3ZLzRr+T+Ugg/RPkM61Uuhm1W4OUgZJJPIgXQRJEtEXJA8nVuN2NWqYhhqnJCQu4ZXJDTjPCphe8zAM3YrBvfQrHCvqbxEH6cxwlqstGREZOTMccm/QSmPjq11pDxW+0FEM0jTUGtbU06wQUs6VVLqtmhbtIL9eiTebmdkqqNV/6EXl7bDZqkYfGN96eyyOSVHW5JNQ2E1Nw9aiLv+21uLedrrlAmFFfltrSx2Sz6sBGmF3UtHW5eVcgqoA9Z5CtiJH7iJuIqd6xEGUHDun8zHj7PKQ+sGHJh7ROK50gOvZgDaXRmVFm20QVT2dS49qrWoYQXUWSXwKiQZDNR47IeOplJIvKd2dgaRBMhSvcFT+J+RuBuQG0DoeqAWrS+ud5cJeGmE5LIza2M4/35+oHQM2nkEDWlCv0HNNUi8dV+84Ye9fmDBzdk/beETb7JvS+u2flKCuDntf+xet2/066bbvaqiiMIADOIdjTOKVDXgt1dXFn0QrzuUv2i9co+OEHvjsEpfqBPks+jloMj/+ri68//N9Bw=='),
			this.addDataEntry(dt + 'segmented button normal', 400, 30, 'Segmented Button (Normal)',
				'vZXfT4MwEMf/Fh94lADd1OdtOh80MVn8A+o4aGOhpO1++dd7pWVjwiZmi01Iete76/X7SUtApsV2rmjFXmUKIiCPAZkqKY2bFdspCBEkEU8DMguSJMIvSJ5OrMb1alRRBaUZkpC4hDUVK3CeBVC1ZGEYuhVtdsKvMFNgf7M4IBPNaCo3aERopFQzSL2BK5WNL7a5PVT4gUfRBqehUrDEniYZF2IqhVR1VZLVA/1qwb9s5thWMUp+QisqrYfNlqXxgfHI231xVPC8RJ+AzG6qK7rkZf5SW7MH2+mGcQML9NtaG+wQfV4NUAa2JxWtXV7OOcgCjNphyIanhrmIUeRUjxjwnPk04n1UOzvfpx744MQj6sdFOrjeNSh9bVRWtMnKGFkO59KiWsoSelCdRXJ3gogCjSWeGx3joZCSXyHdn2GkQFDD13BU/hJwow64DrMGh1Gclrn1TlJu7wy3GGZarmznP69PVI8OGo+gAsWxV2i5BqlH+tU7Ttj5ByYcO7ulbdyj7fiP0vrt3yTHrvZ73/oHrdn9Nmm2b2rILNNgOnD2xxjEa9zhNZc3V38RrTjXv2f/cI2OE45evitcqhPkR9HloNE8/FxdePvf+w0='),
			this.addDataEntry(dt + 'segmented button tiny', 400, 20, 'Segmented Button (Tiny)',
				'vZXfT8MgEMf/Fh/6aEOL0/dtOh80MVn8A3C9FiItDbBf/vUehc7OdlqzRZIm3HF3HN9PoBGdlbuFZjV/VhnIiN5HdKaVsn5W7mYgZZQSkUV0HqUpwS9KH06sJs0qqZmGyo5JSH3Chsk1eM8SmF7xOI79irF7GVa4LbG/eRLRqeEsU1s0CBoZMxyyYOBK7eLLXeEOFb/hUYzFaaw1rLCnaS6knCmpdFOV5s1Av16KD5c5cVWsVu/Qicqa4bJVZUNgQoI9FMekKCr0ScjdpqZmK1EVT401v3OZWy4sLNHvam2xQ/QFNUBb2J1UtHEFORegSrB6jyFbkVnuI26IV51wEAUPaYEEYcbbxSH1iw9OAqJhXLSH69WANpdG5USbrq1V1XguHaqVqmAA1Y9I6AkiGgyWeGx1TMZCSn+FdPsDIw2SWbGBo/LngLvpgesxa3FYLVhVOO80E+7OCIdhbtTadf79+pBm9NAEBDVogb1CxzVKPTqs3nHCPjww8cTbHW2TAW0nf5Q2bP+iBHZ12Pu6RbRv7Xb7tobKcwO2B+dwjFG8Jj1eC3V18RfRiXP5e/YP1+g4oQOeXuJSnSBPyfmg0fz6ufrw7r/3Ew=='),
	
		   	this.addEntry(dt + 'search button large', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 40), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=10;fontSize=16;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 50, 40), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=16;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-50, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Large)');
			}),
	
		   	this.addEntry(dt + 'search button normal', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 30), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=6;fontSize=14;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 40, 30), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=14;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-40, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Normal)');
			}),
	
		   	this.addEntry(dt + 'search button tiny', function()
	   		{
			   	var bg = new mxCell('Search...', new mxGeometry(0, 0, 200, 20), s + 'rrect;fillColor=#ffffff;rSize=5;strokeColor=#dddddd;align=left;spacingLeft=3;fontSize=10;fontColor=#dddddd;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg1 = new mxCell('Go!', new mxGeometry(1, 0, 30, 20), s + 'rightButton;rSize=5;strokeColor=#dddddd;fillColor=none;fontSize=10;whiteSpace=wrap;resizeHeight=1;');
			   	bg1.geometry.relative = true;
			   	bg1.geometry.offset = new mxPoint(-30, 0);
			   	bg1.vertex = true;
			   	bg.insert(bg1);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Button (Tiny)');
			}),
			this.addDataEntry(dt + 'dropdown menu', 300, 300, 'Dropdown (Menu)',
				'7Zhtb5swEIB/DR8b8Za3jwnpKq3tNDWdpn104QAvBCPjvO3X7wyGkEFWJEpTqSGKxNlnn33P3cWxZjnr/R0nSfjIPIg061azHM6YyN/WeweiSDN16mnWQjNNHb+a+eVMr5H16gnhEIs2A8x8wJZEG8hbFpsXQjXTwdYfs9u8OxWHSHWHYo2LXBiaNU9D4rEdCjoKHklD8JSAPYnUX+8DubPBC+4nFfg64BxcXNicL+kfqTGU2oKzFTgsYjyzYXnZI3sS4tI4eKJBKHdjyLl9Fgs12BihjBY8irutjAdbfip9CyrNUhZjf8y4CI9zP4BfTk0iGkiVKGub70IqYIlq0tYOV49tyl3ABezPujxrUv6+A7YGwQ+osqOetCw1LD3Hooeg9oairdpImstBOfQIEF8Uw2aeVo1njWABR3BK4kC2zr2Kf1K2yfzj0yiq+FTPnhqtmMVyggQ4xbVCpamVp8xmT50OOKhAHgxzueJHo8GNSotDRATdwslUTa5V5r8ziqsqbd8YwxPrN2ZhvpiD+X4Kogan3EYrXvbrvLpmXJ5w/+D0s6dN8lUTpLRv1LNFkqYuiWaqWbDkOMmzFBZWh0g5k1OKjm3WQqMxxczhpHuODWvMlkC4Gw4Ggw9RLv9T0mTxbBrZVOo4pGj0p/Ko0RaU/WrxMycNZCz9TdK2KAgqLqY9pOyohn8O9Df6Pf/RdEIak56SuBP6SgE4X7XfNRAaU7RrIBQVYdID+vF7n5beALs8LqkFGZ8vDMZ9hMGk9x9tNwR3VZIvfG41xcIoe9rSGPdw4Jr0c+CyeyA3rZG7p7BV+bvihGL0f8Ac/lw5a+h9JG0RuRX2Dyz28D9PTv/+Cv7i4K1ewBs18I8sdRFnBv5pk6b0emC7PPxRL/DrF1zfAMnrvxhfqcxfzq70L05/2gv9+nXYM1sdWA7+K0lIfEV/afTlAbILehSPl+a5evVO/S8='),
			this.addDataEntry(dt + 'dropdown menu', 200, 252, 'Dropdown (Menu)',
				'7Zhtb5swEIB/DR8b8ZYs/ZiQrtLaTlPTaepHFw7w4mBknLf9+p3BISQQjS5hmbY4isTd2Xf2PT4bYTjefH0vSBo/8QCY4dwZjic4l8XTfO0BY4Zt0sBwJoZtm/g37I9HrFZuNVMiIJFtBtjFgCVhCyg0k8UboYbtofbr6K4wZ3LDtDmWc5zkxDKccRaTgK9QMFEISBZDoAW0pKr/fB2plfXecD2ZxMeeEODjxMZiSn+oHn3VWwo+A48zLvIYTpA3ZUmJT5PomUaxWo2lfIc8kXqwNUAZIwQUV1sZD676VWwTqsJSnqA94ULGO9+PEJauCaOR6sJy3XgVUwlT7KZirXD2qNPpAiFhfTTluUrn+x74HKTYYJcVDVTkPO1mgcWMQa8NRVfrSFbIUTl0BxAfNMNmnk6NZ43gFo4UlCSR0o6DSn4yvsjzE1LGKjk181ajlfBEOUhBUJwrVFStMmU3Z2p/wEZv5F6/kCt5tBrSqHsJYETSJey5akqtDv+FU5xVGfvG6u9Fv7G34bc+eBhmIGtwymW04uX+mtepFVcU3AHOMG9tiq9aIGV8q14tijT1CRtpteTpzsmLEibOCTvlSE1pOq5d2xqNJVZumFNqrF9jNgb6HVdZnJpeTBPSEcV30ToAVN0Bx8u26dATkOGB+03n1mqLzP29Y9Ax31nAbbkN/vRddwZm6rLTE7L+ZYYHh/Bm381Zj9wPnR+5fgz+rCS/zbnTtBcGeWtLY9DBdTns5rp0OyA3rJF7oLDU9TsThOLu/wtr+P+q2UEXNXtbI//IkwDfVwv2D1fsl8Z+2wX27XlV4f7EMx9p5tyfF1lGr69aF2dv2Z3At2rwPwOSN1+5mOnCn46u9C9Ov98J/fqXqRc+2/AC/CeSkuSK/uLoh2dAj+Lue2fRvfo59Cc='),
			this.addDataEntry(dt + 'context menu', 140, 128, 'Context Menu',
				'7VfLbsIwEPyaXJHjlEePBVourVSJQ88u2cQWjh05Lo9+fdexeTWgogokQCAh2eNdr3dmEjlRMigWI8NK/qZTkFHyHCUDo7X1o2IxACkjSkQaJcOIUoL/iL4cWI3rVVIyA8oek0B9wozJL/CIByq7lAHgtsBjDeMo6VecpXqOE4KTlFUc0jDBldLFF4vc9dL6xA4qi8OWgQmepJ8JKQdaalNvmmT1zyVao6ewtZLWv+1irvKcCwvjkk1ckTnui1g4OhgLi4Pt11DofQS6AGuWGDIXqeUh4sFTRDiInK/SaM+DrPJAvs7dsImDQOh+cpMGuUOjS2xK1dVYCuZMbO+yqrQCByJ9QuWvkLkmO4gwKXKFY1lDOxqFnBKMwL5hC8q0svv0cvhYfLtzxeSAZAYqjPgI5MfHikj/KWLHYwYks2IGO/vvEzaUeNcCK1Oy9BG/nKCzrALb8MH6XEdZ46FhjaeJFVpdqR9uUveVSCcVvt0UXmnL3ZuAsLsFLswCq61PaoFOwwJjl85RCIRBVlA3Y+DuhMtxQrtzBid0/759rdSUwst08Lq0R4yrJLpLz0B0734Tu4WHsHeOq9hj83UM2DKzKDIl+NxNr9QaN2mBmJzgVobTzSe2D9/+Av8B'),
			this.addDataEntry(dt + 'context menu', 140, 96, 'Context Menu',
				'7VZRb4IwEP41vBooE7fHiZsvW7LEhz13ctDGQknpBPfrd6VVIWhmNk1cIglJ7+td7+77rgEvjPNmrmjJXmUCwgufvDBWUmq7ypsYhPCIzxMvnHmE+Ph65PnIbtDu+iVVUOhTAogNWFPxCRaxQKU3wgFM51jWLPDCacVoIms0fDQSWjFInIE7pfHPm8z0MvrADiqNy5GCJVYyTbkQsRRStYeGafuYQK3kCjo7Sft0k5nMrkxQGpqjrbaQ63MOMgetNuhS80Qz53Fn6fAZ8Iy5sIfIYrSydrYL3ROHC8fdYR7DAY+PS81lcSE2+6wVsgADlnTJi+wFUtNYhAgVPCtwLVqop4GLKUFxbBY6UCoLveBfJn9giqkZ17DAsw1SYxGIKajQ490Re7JA5HcCBU4gBYJqvobe+YdUcyneJMfMxN9Yj/t+gEzTCvRA5F1dJ+l+N9S9kJohn5joNgFXNgFbuc46AuPBCCxMOEMhEAZRQduMgtskXM8kbI8+6yREP39Mt2oKbmU6+vU7IMa/JHocXYDoyfDKAbZMNd4a4iO3q9tdu54RmJC/jwCa+59i6979Z/4G'),
			this.addDataEntry(dt + 'pagination', 330, 30, 'Pagination',
				'7ZjBcoMgEIafhmtGJTHmqrY59dQnsHEjTlEcJNW8fRHUJEUnnWlCLzqTCeyyyP4fHnYRjop2z5OKvLEUKMIvCEecMaFHRRsBpchz8hThGHmeI3/Ie53xusrrVAmHUvwmwNMBXwk9gbZoQy3OtDcQUchjxS7CYU2SlDVy4shJmtQE0n4iPVW3vmizLpfVh8ygFnK44hwO8ijhMac0YpRxtSs+qqeLFJx9wpUnVY/0NCQX8F4lh27jRu4lbf1xgQtoZ1NWpj7fPbACBD/LJU2eCqJXYKxlcQjkGenDBltS63k2hl4ElINew2k98YSePhXq5MP/Y/WlcBThSQhWGmKWrIQfyg8mVooryXEchFH8F8m9+5I/SfG1obj78Cusb/D8TZ1QuAKey1zgH0Rvb8W1wGBjMMALg867s8fANxisFwYqwLMHYWtA2CwQVMDGHoTAgOAvEFRAYA/CzoCwXSAor2sPwvCqKwrBQkF51xYpuAaF3UJBebcWKUyVun7Wl2bZM0oz3mUwU5vdYWO9VrAIwqyRH990mPkcRh1/dCNG+/1vYmxcPAmF/zQScnppLCnfTd/pGw=='),
	
		   	this.createVertexTemplateEntry(s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;whiteSpace=wrap;', 
		   			100, 30, 'Previous', 'Button (Previous)', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),
		   	this.createVertexTemplateEntry(s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;whiteSpace=wrap;', 
		   			60, 30, 'Next', 'Button (Next)', null, null, this.getTagsForStencil(gn, '', dt + '').join(' ')),

		   	this.addEntry(dt + 'button older', function()
	   		{
			   	var bg = new mxCell('Older', new mxGeometry(0, 0, 100, 30), s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#dddddd;spacingLeft=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(0, 0.5, 16, 4), s + 'arrow;strokeColor=#dddddd;flipH=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(12, -2);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (Older)');
			}),
	
		   	this.addEntry(dt + 'button newer', function()
	   		{
			   	var bg = new mxCell('Newer', new mxGeometry(0, 0, 100, 30), s + 'roundedButton;fillColor=#ffffff;align=center;strokeColor=#dddddd;fontColor=#3D8BCD;spacingRight=10;whiteSpace=wrap;');
			   	bg.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 16, 4), s + 'arrow;strokeColor=#3D8BCD;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-28, -2);
			   	bg2.vertex = true;
			   	bg.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Button (Newer)');
			}),
			this.addDataEntry(dt + 'tabs', 460, 45, 'Tabs',
				'tZZRk5sgEMc/jY/JoCTWPjaxvT70Zjq9fgESN8ocigPkkvTTd1FMTDA3uVaZcQaWXRf+P1YJ6Lo8PilWF88yAxHQrwFdKylN2yuPaxAiiAjPApoGUUTwCaJvd2bDZpbUTEFlHgmI2oA3JvbQWr7LElqjNifhjIUpcWlpGNCVLlgmDzggOMiYLiBzA5yprX95zO1+5hvchTbYnRu2+S1rdNlxIdZSSNW8lu6ahnYmeF6hbYvLBmUdZWV6jqRpNodR8hV6M1nTcEa98D82+xL7h4IbeKnZ1hoOuAK0uY2CMnC8K1Zjcko9ASph1AldDjwzReuxTNqoAnheuKhFqzFhuh3n58iL8thx4g+DoB6IlGu2EahuRH7w6nV0JrJe7Y2R1TtYrtWuZAU3Qt9gOsMYG4ALiN1x7fEICZkGyMID8gxasxz0lCT8QhgJDU2T1Tq1gUiFV/kvpxYl0+EK49jnFcbT8Fp6vDqE45FSCramp3PiA/rctHuAbqCcadagOO4Yeq7/zGTxPpM24OR+DvOlR6hTsg+og6ZAMMPf4OpdQ9Rc/p+S47LOyWc0vko/S67fIHc7Dcajft7FQwch9g7Cl63hWF34HZX5pNU7dbFGExZrlAwUK5moWD95jDwsneJGcVbl1rrKuK0/i5KmWu7tKm8lvyg3JPlAmT2kXPyfJRUO/KOW41TUTfZZ1KUftaaSx3kJ3uh6/6I2wlntLmFu09RXfEGiga/Yx08uDi+X8Va4/l39Lw=='),
			this.addDataEntry(dt + 'pills', 392, 45, 'Pills',
				'3ZbdbpswFMefhstEgANjlwO27mKVpvUJ3HACVg1Gttske/odg6Ekhipdx80sIdnH5/jj//Mx9khWn+4kbat7UQD3yFePZFII3dfqUwace6HPCo/kXhj6+Hnht4XeoOv1Wyqh0bcEhH3AC+XP0Fu+ixp6o9Jnbo2VrnFpeeCRVFW0EEds+NgoqKqgsA3saY1/fSrNfraPuAulsbqVEva4nJRyVjboscfVgUSDfGC/TUhkwrUUT5AJLrAnb0SDHemBcT6YvJCQPEmz3NhFoyf2Q1euBjxWTMNDS/fGcMR1oM1uF6SG06JkncnqdQeoh5ZndDmyQle9R5T0URWwsrJRu15pn6q+XY6Rr/pjxSKYx0EcHDlT9JGjxqH/gzVPa5G50nnU801iS9CmPlegiq6sAMcGxPZAT1gFvr8OrJ0D6x6UoiWotShdCHsrsfciGnNMIR3WlL+sasRfD1sQxy63IF6HW+RwG1CuRyxxiX3uyuLFt3DBtSAZ7hgmrn/NZPc2kz7gbH8j28ghNCg5BTRAk8CpZi9wMdYcNTv/T8FwWePkGxJfTL9JLkcQh4MC7VAfd3HTQYidg/Blr5lozF0ryv8zi8MVszhMZrLYXymLPznwHF4DCi0ZbUpjTQtmIBjGJFfi2axy8Y0xK/lM/t2kXPzBXAtmfmLRv0m1q9k34TD9R5INm6+v2N59+sj9Aw=='),
			this.addDataEntry(dt + 'breadcrumb', 460, 30, 'Breadcrumb',
				'7ZZdb4IwFIZ/TW8NtH7sGph64ZIl/oIqB2lWKCmd4H79Tm39irqZTI1LhJC0b8+hp+/DSSAsLtqR5lX+plKQhL0SFmuljBsVbQxSEhqIlLCEUBrgQ+jwzGq4Xg0qrqE0lyRQl7Dk8hOc4oTarKQXclNgWUlIWFTnPFUNTgKcpLzOIfUTXKlsfNEu7Fk6MzxBbXDY0RrmWEqkp+LLRvRstNHqA2IllUalVCUuRJmQciMRyrK+vVH3FYI20J495VryRxyBKsDoFYY0IjW5i+j2nRNBDmKR+zTmNV67+WKbuvMMB9620xayIwvH+JKr2+hcrEALrBD2fPvVzI2kSrPnL0teojix+RWfi3IxgcyaEtoymlwYmKJua2lwe8sPagQ43pgXXkqG/kqm9wMYDZIbsYSD1/+FVvfEBz98eFjp+ro7GXoNMn6HdyVwYxq0h9A3GSrLajBHJLd1XQS3dwR3Imaa+y/kkQFvu/Eftt5pwINbAO4/u/chujekt6A7OKKbcMOfeO/eu2H3CnhxuvuPdeH7v7nf'),
			this.addDataEntry(dt + 'pills vertical', 200, 158, 'Pills (Vertical)',
				'7Vjfb5swEP5r/NgI7MCS18DWPbRSpTzs2S0HWDU4sr0m2V+/Axza1KRjnZiippaQfJ9/3d33nS1BWFLtrjXflLcqA0nYV8ISrZTtetUuASkJDURGWEooDfAj9NuJ0bAdDTZcQ23HLKDdgicuf0KHdICxe+mA0lboVhoStjIlz9QWjQCNjJsSMmfgyKaZX+2KJpbZPUZgLHZnWsMDurLSa/ELomZLnG21eoRESaURqFWNS1e5kPIAEcrytiHuPARtYXcyyhZyIV6DqsDqPU7ZisyWLtKgy0RQgijKw7Jo0YHcdEDRr31OGnZc3oZzyLwcfsdNJs0jzohG5pGli1XSJD1XtR3KL5eiqBGTkDf7mw1/EHVx01pp2Di1LYWFNeLNuVt0pnEDDPrxw+U3HMsTfR9PzGEaJLfiCY72/xfu5h5382krAGcs3hD7MKPHzPWMDvEyigU2zMLxgr27P2ZRZ7/kKBoopfgvKXLn3ymBbvWHXzF2dPzVqwJVeW7AehT3UYxiPfJYv9MKKZmsaE/R/ediPkH9hyzaV4pwCmB0AgXEngJuwRhegPmUwPlJIJ5PIIEvngQOr8F/vfqXbRtJfq+ad1/98YVf/QuP9VQYfi+RTBrciPrx3Os/a9tl1f8ynkAJS08J672xUCG2Bmsxl59vwRlqIaRTXAth4Kkh/PiPwfKyHgM0n/+sdNNf/nj5DQ=='),
			this.addDataEntry(dt + 'navbar', 720, 100, 'Navbar',
				'3ZjdjqIwFMefhksJBXX0Vt2dm9lkMz5BBw7QTGlJqaPu028LFUFgcCKwk8WYtKenX79/21OwvG1yehY4jX/xAKjl/bC8reBcFqnktAVKLdchgeXtLNd11N9yf3aUorzUSbEAJu+p4BYVPjA9QGEpDJk8U2OIZaKGtUOWt8liHPCjyjgqE+AshsBkVEmq/ZNTpOdiv6kZZFIlbSHAV0PZiD35oz0WKh0SSreccpH34IVL/dOtSMHfoVIS5I+uDf5BZOQDXiEr2tG9msGDkHDqBJCbzOyfgScgxVm5HEkg48LjyUByYiBRfKnmGCPOCkNU1r3yVAmDtB2v18C7EZgFgzMuENfxMc7ghvXFxJmsQF7nj7EbldBc5Y8xkbBPsa8tR9XRvcjdXuSrFuLzAYDPG8BfCHsfiffNMi4Xa7sOHdCHhnyqA64wX47EfDEl80fX+Ei40Xw63ssG753gqQLKvinzTOEmLHo1GJAzng6u09ShPMmHFuKpP3he2EpBMIvoLbgapTbKAdEaEM6UKeMHPaVNCoKosULF7S5yy89XcFHhbG4N9qLBcdWkaJwEUCxVcK611EbW9P6bEzWosusZWtc6n3n1FngYZiAbypRzuEusVUOsPWDhx7ZtT3Hl6b7a3Oya0o4pibTsFEJ53UQveW7UPeQ5i5oczZXgtu0ob4AdtW6KdHhLiPy3Co3EeYGcHs5tt6QhMF86HjlkY+bHGubkwbiGFX0pMD98lK3qos5uA80ghxlCk90BekWcMLr3CftppH9YWXcSZe94I/9OlwrU8Xr9f94qVPb6baZwr366+Qs='),
			this.addDataEntry(dt + 'navbar form', 720, 40, 'Navbar Form',
				'xZVvb4IwEMY/Td+SUmTTt+LmXmzJEj9BlYM2K5SUKrhPv4PW/3NzmVGMSe+5O3p9fhBIlBTt1PBKvOkUFImeSJQYra1bFW0CShFGZUqiCWGM4p+w5zPZsM/Sihso7SUNzDWsuFqCU5xQ27XygrAFjjUJSTSuBU91gwHFIOW1gNQHmKm6+qLNu7MEczxBbXEZGAMLHGVsZvKzq4hxnUmlEq206XeIsofu193FGv0Be5m0vzDjxwRjoT171F7y55yCLsCaNZY0MrXCVTx6O6gAmQvfNvAar12cb1t3xuHCe/e9j9GJj2PDy/TqZjovD30qdQlHpm4kXdo9N0f95XWPIxxg3AhpYVbxRac0uFHHC2qseNn4FF4Kgf0KYfgDAwOKW7mCg9v/B8zgBMwMuFmIIAhu8aSff6KP2Gx1rmReoqYg61EjFVnmr300CenNaTH6Da7or7j8Fu9a4s6M+oGGsetYuzA+7NdZVoM9gb0d8yL+8Sn/5byQ9r7w7//CXYkgG9FrI8Rw9/1z5fufxy8='),
			this.addDataEntry(dt + 'navbar button', 720, 40, 'Navbar Button',
				'vZRbT8MgFIB/Da9LW7apr+10vpiY7BfgOC1EWhrAtfPXeyi4S7bqFi80Tc6dcz4IhBZ1vzSsFU+agyL0ntDCaO2CVPcFKEWyRHJCFyTLEvxJ9jDiTQdv0jIDjbskIQsJG6beIFiCwbqtigbhamxrkRKaW8G47lBJUOHMCuBRQU/r4+u+8rNMXnAC61CcGANrbCU3K/nuI2Yol1KpQitthh1oOfefr+KMfoUDDx8WejohHaxatvYlOqyLttg6GAf96PiDKc6+BF2DM1sM6SR3IkTcRESJAFmJmDaNNmaDXu1S9zBRiDzPs6UnbHPDGv7bgFmzFp5XXurGHbC7G1a0R/jpdISlAYsRj58E0kvxZt/ivf2CrgHFnNzAUfmfIJ+eIF/JqvEBzX/c6+vu798xn59hTq9lHnd41hI3zpL++Di3QZ0d5+uytOBOTmzX5blDRHX/3oXww+fwAw=='),
			this.addDataEntry(dt + 'navbar text', 720, 40, 'Navbar Text',
				'vVTbboMwDP2avFYhtLu8QrfuYdUm9QuyxpCoIUEhK3RfP0PS27pulVYNhLCPL7GPrZA0r7qZ47WcWwGapA8kzZ21PkhVl4PWhFElSDoljFH8CHs8Y00GK625A+MvCWAhYM31OwQkAI3f6AhIX2FZ04SkWSO5sC0qFBXBGwkiKmipe/+qK/teRm/YQeNRHDkHSywlcwv10XtMUC6U1rnV1g0npMVN//ZZvLMrOLCI4UFLK5WHRc2XfYoW8yIWSwfnoTvb/gDF3mdgK/Bugy6tEl4Gj9tIEZWgShnDxhHjTdDLXeieTBQin99zm55wmzluxLUJ5mYpe76ywhp/wN398EQ8kp+Mz3DpoEGPpy0DyaX0sl/pvfuBXQeae7WGo/R/oXx8QvlClQZJRBcTcjM6526Fvxfv7dWXPez68R4ba+DL0m+hMxPjGqtGTEMxpMNZKVM+D9o0of8+w2RyjSHGI16twpMZ7Y73Yxthi6IBfzL0XWHf7QGq+yszuB/eqJ8='),
			this.addDataEntry(dt + 'non nav link', 720, 40, 'Non-nav Link',
				'vZRfb4IwEMA/TR9noDi3vaKbezFb5ifo5KCNhZK2E9yn35VWxKibyYwQwv3v3e+SkmRatnPNar5QGUiSPJNkqpWyXirbKUhJaCQykswIpRF+hL6c8cadN6qZhspekkB9wobJL/AWbzB2K4OB2xLbmsUkSQ1nmWpQiVDJmOGQBQU9tYsv28LNMvrECYxFcaQ1rLCVVC/Ft4u4RzkXUk6VVLo7Ickn7nVVrFZrGHiy7kFPaBO0hfbsqJ0pzDkHVYLVWwxpRGa5j3gIOCIOouAhbRxszHi96FP34FAI7E5zTI44pppV2bVhsmrFHZs0V5UdcHrqnmAPoOMx6g0XFpY1WzlLgyXcJsBgxOuOQHwpXvon3sdf6GqQzIoNHJT/D/LxEfKlKCqEiCGVr02jBdNr/L1Zq26+CyaxH7RpDyM1uAZRFR+BDY1us5/DhMG24sk11hUOfFcC++hPu+uL73JUnhuwRwvuGz21c1T3V6EPH96UPw=='),
			this.addDataEntry(dt + 'navbar', 720, 40, 'Navbar',
				'7ZZrT4MwFIZ/Tb8upWxTv47p9kETk/2COg5rs0JJqYP56z3QshtOl4iXGJuQ9Lw9p5f3AVISRmk1MzwXDzoGRcJbEkZGa+t6aRWBUoRRGZNwShij+BB2d2Y0aEZpzg1k9pIC5go2XD2DU5xQ2K3ygrApbmsakHBSCB7rEgOKQcwLAbEPcCSv89NqVZ9l8IQnKCx2B8bA0tYZ1ug1RFppg3mZzjB9YhbypS4bYT+RSrXDhIWsaaj7HYKxUJ09ZSP5I85Ap2DNFlNKGVvhMq68E1SAXAlfNvQaL1y82pXuPcOOt+1tC8OOhRPDs7h3H9+x8dC6VtKZPXDzpmle96YHQ4xLIS0scr6slRIXqqlAgRnz1qfgUgjsQwjX7zAwoLiVGzia/jNghh0wc5zki7icvL20aWd5HcNJmvbtMMZ9wPArPGqJCzNaHXNuK3SSFGA78Hb7uojnqMPzXmbrX/qd/RmUwek/sheW43+WP8CS0R5YYri/n7j0w+vLKw=='),
			this.addDataEntry(dt + 'jumbotron', 800, 500, 'Jumbotron',
				'vZXNjtMwEMefhYOPRI5DS89J2eUAp+UFvM0kNvgjctxtytMzE6fslqRSkQKtWo3nw7F//7HDisoOj0F26quvwbDiEyuq4H1Mlh0qMIYJrmtW7JkQHH9MPNyI5mOUdzKAi/cUiFTwIs0Rkic5+ng2k0NFi8va56woeyVrf8IBx0EtewX1NMBIR/l2aGkv2TPuoI9oZiHAAZdShif9kzI2aDfamMobH8YnFA2nL80Sg/8Bl4jzDgvKaYUQIgw3dzm6pi0+grcQwxlTTrqOKmXseCLBFehWTWWbi1P2ydH+rn2FhsbEbZlhMWP4GRM8ExWtwAdTv1sbqnQHRYzKxrs4gd1RiTS6dTgw0BD0k9IRnjp5oIQTVt7LUyzznAq2E7XzBW0avqG93S3Q3q0A+8MM9jele0qgP0mUte0QMz06oAj86HRMWlxFvx/ts8d+c++TLIIfvO2w5RCB4A3SRY80RrsWLRiQO00RIyZo79CONHsDMh4DSkb1LqbqsVg7nMRKSs7+h/6IZlnwP3piff3zpQbYLjRAvsZx28w64AvIQIJYH+BfXV8E+s2V9TB+5lcZHsOy2t+6yu5RawV5eMY/bq4U4tl2plC+dEQvqgUw2LkvcLWCv1ANh68vsTF29Y77BQ=='),
			    
		   	this.addEntry(dt + 'page header', function()
		   	{
			   	var button1 = new mxCell('Example page header', new mxGeometry(0, 0, 360, 50), s + 'anchor;fontSize=35;align=left;whiteSpace=wrap;');
			   	button1.vertex = true;
			   	var button2 = new mxCell('Subtext for header', new mxGeometry(360, 10, 300, 40), s + 'anchor;fontSize=24;align=left;fontColor=#999999;whiteSpace=wrap;');
			   	button2.vertex = true;
			   	var button3 = new mxCell('', new mxGeometry(0, 50, 750, 10), 'shape=line;strokeColor=#dddddd;');
			   	button3.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([button1, button2, button3], 700, 80, 'Page header');
			}),
			this.addDataEntry(dt + 'thumbnail custom content', 330, 400, 'Thumbnail with custom content',
				'1VbdkpowFH4aLuvEoNZeVmz3qp3ObF8gQjCnDYSGgz99+p5AUBDcsVPt7OJIcn6TfOdLQhBG2eHJikJ9MYnUQfgpCCNrDDa97BBJrQPOIAnCdcA5o3/AP1+xTmsrK4SVOd4SwJuAndCVbDSNosSj9gqFGU1rPQ3CValEYvYkMBISUSqZeIEshfPPDlu3lsmGVlAidSfWypimskpB68hoY+usYVo/pLfP8NtFzl0WtOan7Hgl9UMWP01pUR6uLrVW+XU+SZNJtEdy2UOCqvEIwwYOpiRslQ+bMa8UZaPYnmLPyFHHgzcOZDgAMuTswNvUHTxbqFpcTI4eAj4bwYm53wCb3OTSB3ecP9QP6fcKUD4XInZp91SGWyHk4xD6gHkTcOxJXXj5CLz8HvDOBvB+V1W2yQU4Ly02tHXuTFyRx8oB26vQgmShYZuToGWKj8N62ge73cg9uNkom/8d7fkA7chSPs5+VCUaak0C1FAelogCNpWziZheqYhBQwlOAXnjIreyxDqcekjNr0pkE2rXROK4GZZsGpyNiE3vDBxWxqKglgqzg8T1BJ6T0KKq0mX5WmktsjZNUu8GL+SwUdRUGi3EIMu6JgriSrtsFXbHnjyMP9dPtTHqXLDLcQhioT96NZqiT8np7P9xcHEjB5d34OBiwMFVhejY8Zj7qXsPdeFdDM/kcL1cResbz+TTRXfvGh17AZ2SLF84FazUAmEne7FjZfLjfTOQ41VCvFtcFNqkael250WZT7O+qfLvX1Hl/27vvrlytpv3nvUk8fz92rh3P2//AA=='),
			   	
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#999999;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#0D5B9D;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#55BFE0;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#EFAC43;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;', 
		   			60, 30, 'Label', 'Label (Normal)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#999999;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#0D5B9D;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#58B957;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#55BFE0;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#EFAC43;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rrect;align=center;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#ffffff;fontStyle=1;whiteSpace=wrap;fontSize=10;', 
		   			40, 20, 'Label', 'Label (Small)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),

		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=30;align=left;spacingLeft=10;', 
		   			250, 40, 'Header Text', 'Header Text (30)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=25;align=left;spacingLeft=10;', 
		   			250, 35, 'Header Text', 'Header Text (25)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=20;align=left;spacingLeft=10;', 
		   			250, 30, 'Header Text', 'Header Text (20)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=16;align=left;spacingLeft=10;', 
		   			250, 26, 'Header Text', 'Header Text (16)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=12;align=left;spacingLeft=10;', 
		   			250, 22, 'Header Text', 'Header Text (12)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	this.createVertexTemplateEntry(s + 'rect;strokeColor=none;fillColor=none;fontSize=10;align=left;spacingLeft=10;', 
		   			250, 20, 'Header Text', 'Header Text (10)', null, null, this.getTagsForStencil(gn, '', dt + 'label normal').join(' ')),
		   	
		   	this.createVertexTemplateEntry(s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;', 
		   			150, 150, 'Image', 'Image', null, null, this.getTagsForStencil(gn, 'image', dt + '').join(' ')),

		   	this.addEntry(dt + 'image', function()
		   	{
			   	var bg1 = new mxCell('Image', new mxGeometry(0, 0, 150, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Image', new mxGeometry(0, 80, 70, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	var bg3 = new mxCell('Image', new mxGeometry(80, 80, 70, 70), s + 'image;align=center;rSize=5;strokeColor=#f6f6f6;fillColor=#f6f6f6;fontColor=#999999;strokeWidth=2;whiteSpace=wrap;');
			   	bg3.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3], 150, 150, 'Images');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Well done!</b> You successfully read <u>this important alert message.</u></td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#59B958;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Heads up!</b> This <u>alert needs you attention</u>, but it\'s not super important.</td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#D9EDF8;fontColor=#55C0E0;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#55C0E0;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Warning!</b> Better check yourself, <u>you\'re not looking too good.</u></td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#FDF8E4;fontColor=#F2AE43;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#F2AE43;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'dismissible alert', function()
		   	{
			   	var bg1 = new mxCell(
			   			'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;margin-left:14px;"><tbody><tr><td align="left" valign="middle" width="50%"><b>Oh snap!</b> <u>Change a few things up</u> and try submitting again.</td></tr></tbody></table>', 
			   			new mxGeometry(0, 0, 800, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#F2DEDF;fontColor=#DB524C;overflow=fill;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('', new mxGeometry(1, 0.5, 10, 10), s + 'x;strokeColor=#DB524C;strokeWidth=2;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(-25, -5);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Dismissible Alert');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#59B958;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#55C0E0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#F2AE43;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#DB524C;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar');
			}),
	
		   	this.addEntry(dt + 'progress bar low percentage', function()
		   	{
			   	var bg1 = new mxCell('0%', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;fontColor=#000000;align=left;spacingLeft=5;whiteSpace=wrap;');
			   	bg1.vertex = true;
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Low percentage)');
			}),
	
		   	this.addEntry(dt + 'progress bar low percentage', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('2%', new mxGeometry(0, 0, 30, 20), s + 'leftButton;rSize=5;strokeColor=none;fillColor=#55C0E0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Low percentage)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#59B958;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#55BFE0;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#EFAC43;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
	
		   	this.addEntry(dt + 'progress bar striped', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 20), s + 'rrect;rSize=5;strokeColor=none;fillColor=#f6f6f6;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('60%', new mxGeometry(0, 0, 500, 20), s + 'leftButtonStriped;fillColor=#DB524C;fontColor=#FFFFFF;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Progress Bar (Striped)');
			}),
			this.addDataEntry(dt + 'progress bar', 800, 20, 'Progress Bar',
				'vZXNboMwDMefJtcqTUjVHgf9OO3UJ8iKadACQSEddE8/Q7K121q12qBCSPbfdmT/MArhSdFurKzUs0lBE74iPLHGOG8VbQJaE0bzlPAlYYziS9j6SnTaR2klLZTungLmC96kPoBXvFC7ow6CcgW2tZwSHtdKpqZBh6KTylpBGhyMVF1+0e67WSYvOEHt0JxYCztsJbbb/L3LEF22s+YVEqONRaU0JQbiLNf6UyKMZ7PuQb1RuYNtJXdddYNHoha6BuugvTp5L4WxN2AKcPaIKU2eOuUz5tTToQryvQplgRiVtff3X6UnjmgElJex8tGxashcfHDOlH9gu4wFi5L/sGU32U7FSGyj22zDyt2DYs2eVhFH/ex7DE2l/UHkjBIbawPFoJTEIl6I+UMo8QuUxlql2bCQREJX9CGQIvob0lA/HLqn+6ePfbuePgA='),
			this.addDataEntry(dt + 'default media', 700, 290, 'Default Media',
				'7VjLcpswFP0ath5eIc2yxk1WySZfIEsC7lRIVEjY7tf3SsiNHdtNZmq8aMGDka50Hzr3cBZEWdlunzTpmmfFuIiyb1FWaqXMOGq3JRciSmNgUbaK0jTGO0ofL6wmfjXuiObSfMYhHR0GIiwfLUW+LfLR2pudCNbGtFjbKomyZd8QpjY4iXHCSN9wFia40rn97bZ2B1qs8Ri9weFCc4rlLImAWuIGitVx7TyMVt95qYTC2Uoqie7LCoTYm6I0qwr3c3YlzYH9wV9o3zRg+GtHqMu9wXRoC8fi2vDtRWi8KeDyxFXLjd7hlg0w0+zBGL0aDnVjjm2kH+f1b883nHEQoD4Pe3YC+zNnQHwmwkDW124AkbRxwHkQX+Gn25XmBy0RvDITYBkc7kcWHkKbxvEptln899jmJ9iWGuMhmmBcaAyIDwnrBh8C1lyrKC1dAIl/CNwAzHVCWiHIAgcvbuARcGnQ3fpolAuuof+BWTAqEtoZlRBAwVjmg1HVtoopFyTU0FntvRWDkHXgvYG1FbbdlzBY0VlDfEBixl2Gt513HAAboV05xuoOehf70WIxPp1k0GJLfCxpJXURqD9tD+8iVxppBuGIK3zz3D5BKEjPQ4xV+5NVXEC/L60ilmKxLutE/HzHR8c6oER8DWajugssPSB2kk/P5N0xYQ81IztD7OIKxL6btfqkK6ENSXymDxNpd/GfavcfoJ5My+9nLZ+1/GbMvqWYf5nF/JNtSW+o7Q8nXXnBVxpxdlrxL4t8kn8MejaVyifxLPOzzN+O22d0/q64js7j9O3jjV87+rbzCw=='),
			this.addDataEntry(dt + 'media list', 700, 460, 'Media List',
				'7Vldc6MgFP01vmYErG0eN2a3T+1LfwEREpmiuIj56K/vBU1rotlmZkMfrMkkwoV7wXMPZ5xrQJJ8/6hpmT0pxmVAfgck0UqZppXvEy5lgEPBArIMMA7hF+A/F0aRGw1LqnlhrnHAjcOWypo3ljjax1FjrcxBttbM5LC3JQrIosooUzvohNBhtMo4azswUtr5+X5jb2i2gtuoDDRnmqewnQWVYlPAhBR2x7X1MFq98kRJBb1loQpwX6yFlEdTgMk6tl9rV4Xp2OfuA/ZdJgx/KWlq197BcmBrb4trw/cXoXGmFpdHrnJu9AGm7AQz2RGMxivjYpOZUxutmv7mw/MTZ2i0UA/DTnqwP3EmqFuJMlFsbp0AWqSZBc6B+CLe7CwcdVIi+dp4wLJ1uG9Y2IUWh2EfWxL+P7ZRD9tEQzxAUxgbGgLCpRCrDC5SrLhWAU5sgAL+ALitYDYTRS0lnUHj2TYcAnYZcK9dtJRLrkX1F1aBqEBoa1RSilSYmrlgqcpzxZQN0u6hrLXzVky0q255ZcSqlnV+3MK2lmVtqAtITTPL8Lx0jlsBidB2O6bWpahm3phyxgybf5FS+as1G1Ve4EuHYijyz6nDKXW6p5cMUCy+AcXuJtW8Mivzgax40tS4l5RnOFoAMw7HLa4o+hJz4kts7yex/RFie84xhPsku4s9ye3DJLdX5+Xh+wR3fllw81ELLkZfg+5NcY9rT5I7csk9Z9lHv8OyaO5JchGaNPfKR1z8jZKL+vWaH/qQO4S6P83t12smzR2j5p6zjAxorrfHXNSvXE2a2zrEJD5NzEBF0Zvo9ss9I9Xaf4DrrVyL+nWbSVtHpa0tq6Jw4MjeqEIL3c93Zm7s5JXaOw=='),
			this.addDataEntry(dt + 'linked item custom content', 400, 240, 'Linked Items (Custom Content)',
				'7VfJbtswEP0aHWvIopP4WllpLglQIIeeaXEkEaVIgaS3fn2HS700diI7aho0FWCRHM4MZ3l6shIya9d3mnbNg2IgEnKbkJlWyoZZu56BEEmWcpaQIsmyFH9J9uXE7tjvph3VIG0fgywYLKlYQJAEgbEbEQWNbTGsYpyQ3DSUqRUuUlwwahpgcYE7ndNv17XLZTTHDIzF6UhrKDGUXD/yH07jCucVF2KmhNL+BFL5y3mxWn2HvR3mL9xZNdzCY0dL52KFflEWQwdtYX0yfS+Kud+BasHqDaqsOLNN0JikoURpA7xuohlKg5CaIKi3trtq4iQW9HhxyZPiFkpCGTSyFAS3OEgl8d5yF7jSluKINVxy5mbUaUANbsDzF2aUZNdYmLEr+gOFEiRGiP0C55Fx2u70NTcL48/X3E/mgkrG7WjwFocO73cVk4JnG9qB5pgQ7Ctje7ms76FyTfAZUsFriQvhZXmlpI0wGk9OoMLhgZdUfI6mc2Wtanfu87gOB2gw6O9bRMO4L6qyy1A1jTINglq+hAP/x5AWj/iquHQd3Ry6+WWhqsq4jv+GzG1gvcA6eQLWe26sB6NadE7RQuvzoQzLODSGqCwbB5IzUTA9gYIL+0ou6+vk3L72ZZCrD8Ig4SHNF3iXz7wrXmSV8ynkCA+9jlXI4KyyOTB4I4759EdI5vo/ycSH+h2RzM0HIRmruhcZBmMmxTSfFcdoZrvjwHH0/+u/SD+DE05fXE7fCVkM0+2BSeTm75IILncfqeFFsP8N+xM='),
			    
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#E0F0D6;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#D9EDF8;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#D9EDF8;fontColor=#55C0E0;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#FDF8E4;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#FDF8E4;fontColor=#F2AE43;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#F2DEDF;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#F2DEDF;fontColor=#DB524C;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
			   	
		   	this.addEntry(dt + 'panel', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#3D8BCD;fillColor=#ffffff;fontColor=#f0f0f0;spacingTop=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 0, 150, 30), s + 'topButton;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontColor=#ffffff;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel');
			}),
			
		   	this.addEntry(dt + 'panel footer', function()
		   	{
			   	var bg1 = new mxCell('Panel content', new mxGeometry(0, 0, 150, 200), s + 'rrect;align=center;rSize=5;strokeColor=#E0F0D6;fillColor=#ffffff;fontColor=#f0f0f0;spacingBottom=30;whiteSpace=wrap;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Panel title', new mxGeometry(0, 1, 150, 30), s + 'bottomButton;rSize=5;strokeColor=none;fillColor=#E0F0D6;fontColor=#59B958;fontSize=14;fontStyle=1;align=left;spacingLeft=10;whiteSpace=wrap;resizeWidth=1;');
			   	bg2.geometry.relative = true;
			   	bg2.geometry.offset = new mxPoint(0, -30);
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Panel (Footer)');
			}),
			this.addDataEntry(dt + 'table', 800, 280, 'Table',
				'7Ztbc9o6EIB/jR+b8SWkyWMhp+10mk5mMmfOs8ALVipLVJILOb/+rGRBITIHkljmEsxksNa6eT+vvLsRUTYo518kmRZ3IgcWZX9F2UAKoeuzcj4AxqI0pnmU3UZpGuNflH7ecDWxV+MpkcD1Lg3SusFvwiqoJbVA6SfmBIUucVq3SZT1VUFyMcNCjIWcqAJyV8ArU1O/nE/MvVwM8Q6UxtMLKWGEU+nLB/qvqdEztbUUP2EgmJB2jCy3B14ZU8ZW5GN7oHxWUA0PUzIyXcywX5S5qYPUMN94+1bk7v0LiBK0fMIqM5rroq5xHdcqigugk8I1Q2ktJKoWTJZt/2gTT5xCm5Wbecq9JxxMDU01qrdlTWsx7VdaC/5qbefmY+SC6xX5jT2c3HWcXC7Kbv5m1oTRCY5+y2BskCvkRfnkuy3dJvEGjhIU9vmPI5LsSjZ9HdlLJ5PAiKa/Ya3/t9C+9Gg/YCcoyWFMKqbt9Gv8I9SbuQ8zMwkX+P2jYoyY1lQT0wYYNZcZHYIUUTowczMdFKgAhG2K1aSyTT8BB8JNZaNtaq4NsRnPqxJPuetY4QNkB1ZojqArudYUKtMecKT4V0VKc+0e7w7nCOpXZSYkJMehbUfl2limvoXFgaNClT1Xmg4rVpXLWytrRaEy7GPlCpwOC/xC5Ug6olC3LeioYsS0bH0pqlei3eyBCw5H8khfv/SRdkPcC2ofwqd1y1i0EOOxAu2ZwHJiO1lFL/wL5iVUV1e5/YN78VrUDC5JQ5C7aiCXdQLPmV6DNW57AW1G+nWh9p2Z9rYy7XX5evno4fhMpTJPwQ9Stu5LtMzl2SraLaakFU7PTG++vvS2annXHurv5Ex6z6TTLATqGw/13wrQ1Tpz3hfnLIhJJ7EH+tPIzvKMeTPmED6Tm1DvKgjmxMPcF0qdIe8H8sc4COQOkmaviFRPJ5wJY5p+Ni45MLts0/CS7Qw7DV8SPz32TRT8wAgEXAl3AHJ0gUriZ3f6QpyZHnVIkviJn0e0VP50fWjr5emSDRSE+DmktomOChj9HIp5k/NyZY+3EnBOQnzh1p4VImkDkLTlcMEN/yEJAsjP/HiAFrrHlnSq4H8VvQLzCHW+9N7D6txPwXSyzL0Xbz4NEoOlfj6lG2x78uZvtjLs1JtP/TzHHXFdHA6BkP7BdiBH580vLGjVm5di9p5itP1SDePPN2xDKqlS5dlej92fb9hy1DbRFv35DQRO2Z/vYvcLyalYbvs7KUbd+P+N+1zaZTQUiKd8w97Mk4sJgmw1a9gic2j7ldp8pdUP7gHFBH7y4hsp4dD++RnQydiByPEFBX565E4ISd6R77hnrGGigsxPoDzSx7O9Hn1QkPmpmdaJPvtJT/Z2z3MTilOODjI/3+KRCpntPyydB/H2sfjnt3R19dWf2v0H'),
			this.addDataEntry(dt + 'table', 600, 320, 'Panel (List Group)',
				'7VhNc9owEP01PjZjbEKTY4E2l6aTmcy0Zxmv8bayRPQRoL++u7IggMkMSUjJATNgabUrrd57kmWSfNQsboyY1be6BJnkX5N8ZLR2balZjEDKJEuxTPJxkmUpfZPs2zOtvdCazoQB5Q4JyNqARyE9tJbWYN1SRkPtGkpr3Evyoa1FqedUSalSCltDGSvUMmP/ZjHluVwUNAPrqHhhDEwolaG5x7/sccnezug/MNJSmzBGXoaLWiqUcsNehYvsMU0wDhbPTjWY4jxvQDfgzJJc5li6uvUYpC0caQ04rWNYHjFKhW0N03XsE3JUiODtBzLvAHknFLCHQ0dQHhlVp2dD75xWr0a25A/btXIb9utwRXvsuNdf1WP+nLWQOKXRxxIqptfOxATV9HuojXuc/bxGB/dk55A5Zc25gqU+f0VGeocym72O2X60GZDC4SNs9f8Wtvsdtu+pE7KUUAkvXUi/pX9CuPE8ODMDF3T/4aUUHI1OcAxI5GaJBRidZCPOjTuoCQAim6t+6kPoF1AgFDsz2shtBYWp0jdUVLFjSwIKA1taeuC82QoFz/FAI6UPXjTcdkezoxzBPnhOSBtFQ4eOmq2x2D+QpUARoDaUrcPCS9+sp9a0QBEYQVaxorCo6UbgGJwgtLE1TrwUHHn0bafddQ5bD0oreLWkdxfK6WV/9VLZxyHuNAahLrdXzypCV5UF11km68QOWjmXnZUzMoLF8Ntbx5rUJeqPIIY97O8yvaOX0xP/4v1uP/G93QfiUZgfdJgfixltHUy+mNBPRYBLtGFbQXXWwGk1MHgPDXzuaOBWmwLXDySDlvVwZv6EzGfpezB/1T0fa+PEau1vHFai6ayBU2rgXZ791x0N/FyfHnksToCOwEffAApNb0rNG96XPrAgllsB/0ken44hD6o+/c/Rum/+DfIP'),
			this.addDataEntry(dt + 'table', 800, 160, 'Table',
				'7Ztdb5swFIZ/DZerMORrl0u6dqqaaVI17doNJ8Ep4Mh2G7JfPwMmTWqyoAYHSKCqhA822O+DyesTYrmTML5neOVPqQeB5X633AmjVGR7YTyBILAcm3iWe2s5ji3/LefuwFGUHrVXmEEkyjRwsgZvOHiFLJIFuNgEKuCLUHbrFlnumPvYo2tZsGXBw9wHTxXkkVVSP4wXyVhunuUIuJC7NwxmIqkgGH2BCQ0ok9UiGsna4zkJgjxkOe483WRcdQqYgPjgwNKQGtU90BAE28gqa+IJP6sxsrPB2z6QhZ83G6gg5llgsW37rpPcUVIVy+Yal82n7JFEwDXppE5euhXo5yV/Ms6Ak7/wRymByirqfE7RnooxCLAgb7B3/lNU7hWo7NZ1f+YhGoknKW5yxV5eVp1JurD2iYCnFZ4lgbW8wBbHj1yy0jzcozz658TR13DcEcaFDP3EITScCw7IIpL7AczF2TGhSjipS/yiJEpEj/Mpud+CzucchMZ127FSqAca6kfcka6ZtOOaQD3UUP/mwKKOc22cXSNTeqRx/jZLO9lRPky5ErtTTLn/0YdWQvmrRnlMOe8Y18N4aJtgjOwCX1zz6kORbvjC4wOlzf5pqoWENEioYdOwynmW3ZPNWasgPbHxQP2oYQQMPvhKAGndqgTpaZcxpR3TVq8/kJ7lWcqZGm1GTXteXi5ZMysOpCeMqiY682H28kzjIp8ySLdTCSiPYN+owewQcQqAOBUvDtTlvyAjgPQ0jwYo1162JCsO/xV6B2YLNd+adbOa6/mWqifFVZl3M08uPVlSOaUmmffhUYTnNe96FmOK1SmaQ8CkHTgOpHXmPX9K75p3RtfXtCSrl6oZ++7oeY6QcB5287Xt9j3/yGuHfT9A4JLt+xneQmHYI3T8KgSNLo3Reex+4Tssnd3/tN1HjhFKeqaiae8ZVflxld2UzfH7Ba+bPOAQmva1pUEDUYJI+wy/numYUsrwFfnCmrEacvx6cmRJlt18bb/h19MulRNVSJni5J7uKg+huGTnn8/ruhL3zdLciJOXxfdfYWTVd3+k8Q8='),
			this.addDataEntry(dt + 'table', 800, 360, 'Table',
				'7V1db6M4FP01SLsPU4GBfDwmaTuj0XY1mmh3n2lwAirBWSBtsr9+bbDzZUg9qZ3i4IxGhRvjmHuurzmXQ2K5k+XmaxasoicUwsRyHyx3kiFUVFvLzQQmiQXsOLTcewsAG/+3wGPDu075rr0KMpgWIgeA6oDXIFnDylIZ8mKbUENULPGw7h3LHedREKI3vGPjnTDIIxjSHfzOirRfbhbkXO6e8RnkBd68y+CsIA2KDL3ACUpQhpulKMWtx/M4SZjJAu68fGH7WxQXcLoKZqTLN9wLttGBwqyAm8aTLU30TL9CtIRFtsVN3uKwiKoWA7tyiB3BeBHRw9weNQZ5ZVjsjt37Dm9Q99W70lXuyghlf8QpzDl3Yt+F5avGpyH5h+0ZzOP/4D/UE46oR8FlHvWoLYNJUMSv8Kj/j3jZ47z8Z7CEnxW0zITSYoq9Sz7RY/t0MGQIQRIvUrydwHnREN4VPN+YC4Xxcd/Fx/Fl4EM/4geK8ScDmw7IP5k3aD7PYcHhuRuYEMQ+B/E9Wj8n8AsJfgv0cFQ7BL5vMAhhZqD/HOjVYN/jsP+JB5kuDMqfg7KnBOU+h/IU+w/DBuy/VgbqM1BLWWvroe4BFVAP3r8qYtAVWRykC2IdhzFBLUbE0Tlak9MXuoK0y5eov/v1/j4+YFvt2Xd0WTpCgwfDl4LFF9bPlu2zj5cKzvB9cK59yUpxbfnV6glq2+NupGLEgkxkBuEj41UOBSfLzv8HGAt5eVjv5TMzBdQ4HchJW87JTHGUgOAonynrHF/LigE3LF/CnNg+m+Z2cJ1LdB4PnwPkZLr+MXw9FejxVY7vKEqxZYxQyy43FF5eNExbnamiwxdd0It0RCmkGcXJFZym/mA89PsnGIOaS0qyL7UM9usJ2lWXoHfIq83QfGFIehxUTFQM/IfH0cQjkQKXq2L72LDy4o8IWUhV3U9nQTlcf2+hJ5AXQaYuAGqnPnOqLBLJIqCvIgD4spEFegmZuEXwjD0I7Bk+YhWEYYkibtD7d03q7GN7v0lb5XjSnW+1DytmpM4clRyNwMc8ubcc9tBb0L/VEDPOQtgwWw32B84wxqTodTCUV77VMg5DcsoHrfZYM6NfjoobEnGkPYWYh2Of2wM8fh8vyvboySIJoRocyVjEVbuQ3nfCgpvr9zdgO+7vrAcMZ9XJ8VljMzlx3sj5hxgrXJm9zes4whN2npRjIAdff2Xv6VY4cPhSoGyIO0VOB0pA4it5HEhXJqdV3HSLnQoU2VrLTs8X4brATvkq3FM8iwJIGv1Ez3Gao7Tdq5vMtaxp/upMU1kyMTT1o6lae54K1FcSFfLUA1YqhadeEAHaE1UGuCGqUolqn4wfGKLaaqIqsrhrx1TbqPzTmak6alASKBBfmao2CT5umKrWiPtkzxVlVLWKoC5T1Rp53iiBmyAtdZiErHaKqt6i+LZGmzdO0OyFiPPawVd3k/bqfPWCfN3Xnq/W1RYNW/koW8GZaeQattJutiKS3/VjK0b0KQel7UkESEWJ1TnbxFa6J/t0NZZ9up2Xfbp8ofU7TNN4XpKVH3Gav7Tu8TGVbOUG9Z8uX3rbsRUbeJF0dPXjLL+etYe6cxa3rtRnOMtHOQsGdWQPDGdpN2e5RS2gq75q3CnOAmwlKAkoNq/MWarA6RZnEZBktpazNNwe7hBn4cutY/Rsde/eStPM1Zqt8KU3IwO8KElrLwNkYaqnDJAMSaYM8III0F4G6NXVFg1JNc+rtWIpV0tSRRZ37Uiqx5ebZWPcLZKq5OtUPAGx5pVJqtfg5xsmqZ76p/WVkVSvQRXQHZLq8eW4Lj+x1jR/daaqHl/Lm67zFcGgLXzVHz8+2J/BVy/I19rLAD31VUWFfNWTzFcviAD9+aoRgprH1lq7nqvlqyIrvH581QhB5aDE+KqSb1hhqb1NfLV7QlBfYyGo33khqM9X5rosBG2avzrzVd98EaikVK39rVXfqD+VPbHmGaLSbqJyi+pP36g/5aBE066rBqX2qT/97qk/fY3Vn37n1Z8+X2Pt4g8VNM1brQkKX237O0ZknApulV7IU+7HPvAmn8FTLsjU2t9SY9dhet5SI2Eh85baBRGg/S21npGAmucUW7uiq2WqImt825kq3t3/UnfVPDv4Ie//AQ=='),
			this.addDataEntry(dt + 'table', 800, 340, 'Table',
				'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'),
			this.addDataEntry(dt + 'table', 800, 430, 'Table',
				'7VpNU+M4EP0te8hxqdgBhj0OgZ05zGxNFbO1Z0XuJF0jW0aSQ9hfv90tOSE47ASSQAYIRWy1pVbrPX08d6U3GJbzT07V06+2ANMbXPYGQ2dtiHflfAjG9PI+Fr3BRS/P+/Tfy/984GkmT/u1clCFTRrkscFMmQaiJRp8uDXJMA0lhXWR9QbnfqoKe0OFPhUK5adQpAI9qbl+OZ/wWI5GNAIf6PbIgQ5cITj7A4bWWEfVKltR7fMxGtOaevlgLB+yp6DABZg/ODAxpVF9AltCcLdU5QaLMI01zvpx8P0p4GSamh0PklH5aJgs2i5xopsE1XrYBnuHbWrdF6zAd6AjnAr5rMGv4D+yO/D4L/yTkMg2RTR/IqLJ5sCogDNY8b8NyscdlL9DWVMnQNa/VAkvNVdbk63CFQHNPR635RQMh6AMTiq6NzAWt7XSWE2+SOki41Buphjgiuzc5IZCWJD3uQV4Y/YGP2Uvf1b2TjrsfQXv1eQ1s3Z3yR06j6mLbxap57w/v+e7bWLHYw+hQ/wiso3mwunh7ZdpNjzvVpkNtmTpdpXsnZL0oUPS35W2tOFCIALy/jdnCcCXXr5PW54bkXp6YDvoWYeQz1TB/ka2jyEOx9IFrOdvtiitG6/KZmHAxgeuYwvkS0HYofdYSpOi0RjrXjdI3yOjqgIDIptqp8ATNNiUXBUMVPSI+wjXDR/A2jrX1GK6bqI/ZgpkIpJJsam0BnxAuYe5hjo0jlv4OJ2t1gq0Eie6qZF6j6c7kS0x2BkWzE8+lEYlGoy9+0YcYCUtTa0Wo6C1gBqVBO3BxXoUh6Hw2aoqchMdIk9ris+okXUyToldxiHFcTNRR3S9ZPNURSN1U0AphKdaNAWNgEa+Wicwr4GHI6gTBJUOaI8WwqVvcBTpC6RpCLYYkRaH3ppGWlZ2dNcvTX0ghiyhbmPlCEaFU5SJU0qfkZGjw1qos7YcbL1+3fLqRK3Mx3UVv3Ph4nTj03dHC/54L7v4Xs/aPzq7xqXMiR1PhjQbXJJSJ496UWlf9Ha9Va82uMPjyRoad8Ti71l7AKTDOTvZA6tZv0PrBfDJ/MaJPd0jsWfPwWv2Lo3TBN+NNM4+7GNTzbqJMprdfFZfNb7mFXNQh+0uVXH280Tb88rirJt9E10cFdRjlGqr1V5IrD5Bqe5Pkz6oNnnkK4JzrdrkyLGSlwmJlUx8KdUcRe7WhmaeCu+idBfrbb0q3XYD3asqzbrJ3FcoSx/i7hXr0m6a91Xq0kcz+8sL0/ecbQvEboRpvh9h2s3aLvK0/XNj9Q/O3R7SmbtTbbplynYrGfo/6dkrSZg3zH4Nztcs84Joq6YqmBlbVlIkFSYKUoWYs3WOkGPxKPlda0i2ksZkcRZTu4t8rAjYlP4zqinaJywWgw0qakFpSBGgSo9AxSZYe7pTfKtGXBb9TAp1RthKNpKhZ4GLKypZZLXTzJeWxPKIRJ24mWG8FqhFYCbNS5LTkH4aRZkJpSSsSdemGMr7wyQhq5Y2H7FQ9IrlGCPGRgmsNirPWCBJjK3shmLpRdvKw3VDkUjLUk0q7K2of7vMfjsaK0/YewGxA35M+5RG8hTHEVGs6cXCRgee0Clb7TyMTRJJcajNndHJgwXNqoQUvMSrA0i4bFAF1kj9Ch1m7Rjjy0fFyjwGgE18lxHlHpPLSqjVWEROBDPJeUPLbQqVABInit9cVIxYASGzRIVqvYv4XWxM60X8tofNfkX8m8gtP8Td6xXx+RtJLj+a2V9MxFNx+dPBWP3uLwv/Aw=='),
	
		   	this.addEntry(dt + 'table', function()
		   	{
			   	var bg1 = new mxCell('', new mxGeometry(0, 0, 800, 80), s + 'horLines;strokeColor=#dddddd;fillColor=#fdfdfd;');
			   	bg1.vertex = true;
			   	var bg2 = new mxCell('Group Name', new mxGeometry(20, 20, 500, 40), s + 'rrect;rSize=5;strokeColor=#dddddd;fillColor=#ffffff;align=left;spacingLeft=10;fontSize=18;fontColor=#999999;whiteSpace=wrap;');
			   	bg2.vertex = true;
			   	bg1.insert(bg2);
			   	var bg3 = new mxCell('Create Templates Group', new mxGeometry(540, 20, 240, 40), s + 'rrect;rSize=5;strokeColor=none;fillColor=#3D8BCD;fontSize=18;fontColor=#ffffff;whiteSpace=wrap;');
			   	bg3.vertex = true;
			   	bg1.insert(bg3);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Table');
			}),
			this.addDataEntry(dt + 'edit template', 800, 720, 'Edit Template',
				'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'),
			this.addDataEntry(dt + 'business contact', 800, 270, 'Business Contacts',
				'7VnRbtowFP2aSNtDke0kBB4HlD6s1Sox7d0Qh1g4GDlugX39rpNAAw6MiSRlW4MQ8Y3t2Of4+lxfHHeYbB4UXcVPMmTCce8dd6ik1PldshkyIRyCeOi4I4cQBF+HjE88xdlTtKKKLfUlDUje4JWKF5ZbckOqt6IwxDqBYY2w4w7SmIZyDQUEhZCmMQuLAjxZmfrJZm7m0pnCDFINt51Yqke+ZKmppJVcsKEUUmVdu2F2wZOIC1GyR6H5gL0YHVOabU7OMDMV03tgMmFabaHKmoc6zmv0UI4Cihmfx0Uzv7DRNC/P903f8IKbArJq+FwLPlOMOBNhalBkgs00gFQzprOYzRZTubkY06VcQk8DKvh8CUXBIgBhIOiUiWeZcs2lMascnEG6ojO+nD9mtUbYjCWSSz0pxo8vJYZUE7MtFmbHz5uUiMKezdPOppigmr+yg9dVkVe88VlyGAhBu/EVXBVvvwsOO5BRlDJtcb8f9kXLwbOWwxNVi/wtBH37Wvc6UAqWF9RQE/7T1PDPLogKP8susK9jrtkEaDe9rKHr5ijuV7iii+qheOfSO46x3wDJ/lmSf3Bp5gD+9ME1waQ5skkrZHdPkp1V+9/8+rDBOearFLcm5u8wboP6wKL+OTYyWjfXOdWH9BZ6XSHhRohLTPezy5b2Qwn3r1kKJ8KrooF3SEWALlsKpIbgq2cR1GactUf+lO/VAO5RzIKR+0cR0zXg9ivAHbgAOfqEut3P8NsLwOtQF9wE9YN32QF/S8GRU2RBbN4f7lbHue14Sd/2kq5X4SVeDV6y2ytLTMpFU3TtAJ8BLkyV+HMv2eKAOr836PvBEVek4gBytA9er3jnCQzQIYP7Ta1EodvQPoexxeDgJTVnahN9sIRy8SFK59wNey2qEm4+pXJrshS0J0vYzrikTDoeoquVYJ2ZTG5Kicajce/eu2Elwt02pcjOj3yXUDaZT0V1/aF1Xap0P/4y9Ny/QJUqwu+qfEst+5ydB5kstquP89FZf9uHY61IkZ29aHp3tD3qfTSJeC1qkp0poIJtOkpOp9ubkqObPxjtY+hW5MhOIDR3Mio7iKVH/9LJiFQE2zWdjKD49s9ontEr/3H6Cw=='),
			this.addDataEntry(dt + 'experience', 800, 270, 'Experience',
				'7Vpdc6IwFP01PLYTCGh9Vbt9aWc7687sM5UomQbihFh1f/3e8GGFRBdbwH5Apw5ckpCcc8+98YqFJ9H2Tvir8IEHhFn41sITwbnMzqLthDBmOYgGFp5ajoPg33J+HLlrp3fRyhcklnU6OFmHF5+tSWbJDIncsdwQygimNbUtPE5CP+AbuEBwEfhJSIL8Au6sVPtou1RruX6CFSQSTq9DLu5pTBLVSAr+TCaccZEOjYP0gDsLytiBfRGoP7DnsyNCku3RFaamfHl3hEdEih002dBAhlmLG5ShgEJCl2HezcttfpJdL/ddX/GCkxwyM3xYg29GGJlLsC0oYUECJ5LDx3oV+JKkwPpynTQNshDqoXgsZvSvaoHPQjs9wO4zuozBxshCDcb8J8IeeUIl5cosMuzGycqf03h5n7aa2mpmCx7LWb4auy5vjpm3Xe63117W5YBH29VpLGyCMF/SF1J6nInb/ImPnMaKp2J+OZX506+G5QH4YpEQqbnGftq1vMXVvGWPbtP+kLlD2QViHpMK+4UJ6DtwiFF66A5RJt4DyyakkszArKaxgSe/U7N5BxeVyBgi3RNMinYaULTXekCspdU9Bce02gDKFZe3ET5LcO9BeWCImzGFRTroNl5CuiCibdi9N8FeUUQa97Lx7IE5NHYjkZEukYFrkIjbgESGGnn8uQuRFNjPASLwjxrhDZjzbsYjb1ihyjGkrEoM3DPeEn9DVCZwH9AOGMQtxbgbjcAJj1Z+vOvT0CmN2W6HeWj0SfJQS9BXc9Owu9xkIw363yRhPpgeuOSi9c3718pM9qDD1GTbfW5qITcZNuBt5SZbr0j84eIZXFd9pxY86nPUKbXto1cXOcrWyx8fM0k1n5Act8OEpNcNfs4lf+q/I52pDWzQhimONZKJahQSCiKkoH68VNZxQBUFWb0t4Ws1zSrOKD2OhawVERQmSw5Mb0fXPS2JErrGep2p7Go1Ua67wmVur3B5hEbqdbZepnBQscXoVXfMLUaXlJ1enPh8sht8c9np9YnXLaD6NaXfAJaS3CV3gHqZYrIW6dSBKlDEhckqSKn8dPUrR8HT+fS8CbptMTp6NxekqxijTnRkNEUwQ/pPPjnnJG0NwIOrezZDzc1UPGgEHb14MCVzEvUb7bNjUJcpv/DhD5Dya0H5v+3TV0/vhpcmYFfdeuXgk0vM8y4pMb0C8bElhr+5xPTiQ18Gf3cZ3LQXaagMDpev7/xlhB++EvgP'),
			this.addDataEntry(dt + 'skills', 800, 480, 'Skills',
				'7Zpbc6IwFMc/DY/tEAJeHtdbH7ad7Yw70+e0HCRjJE6I1e6n3wSi1Sa1WoV1R+jYIYfcOP+cH+Soh/uz1Z0g8/SBx8A8PPRwX3Auy7PZqg+MeYFPYw8PvCDw1ccLRp9cRcVVf04EZPKQBkHZ4JWwBZSW0pDLN2YMqZypaQ2Qh3t5SmK+VAVfFWKSpxCbgroy1/Vnq4m+l9tndQe5VKe3KRf3NINcV5KCT6HPGRdF1zguDnUloYxt2ZNY/ym7mR0ICatP77Awmdu7Az4DKd5UlSWNZVrW6PilF/wU6CQ1zSJjI3lZnmyavvtLnRiXud2HLfeNgcGLVLaEAotzdSK5+reYx0RC4VgiF/m5nSyEHhT3xJj+0TXwUd4uDmUnjE4yZWOQ6M4YeQb2yHMqKddmUfqul8/JC80m90WtAdIzS3gmx+Zu0KG6BW7d3sy6vY3KJls6otCWcW0TwIikr7AznEtbM+Ijp5nWaT0/I6UZ/aa92wFPkhyktTQ20z5otYTWankgYqpHKaoRvVp+/ax6bUTfisRlSiWMlfK6i6Xq90SVdxvs09wVu9g/i+g3yOBxIzuKKtA9qhyyB8V/tzj2xP8ptHWHEfLxUUF8CotblpeH2UQ9eUAoWP2ToPrS4R+AW1C07A+13KD9dhjuly3cDYOub6nWCh1hGJ7hEdq2ZOPTqtRa+/tFuQXE3njJeAa2clGn143aH6QKHA9AXXYpXpF+bX9XwA00txTEDgGDMwjYuV66teujW9fy8u+UZtNLQ9toMOoMwwtGG2rVyDbk26rp3YDe6oliP3ChnBuOfvRD/B9wrm2r2a2IcwhdLeiCsD7QITsl8cTFxYHu4t/hNs/7WkBnJ0Kat7iT6baRpoa3OGQnJ66FbhjVSDc7FzBmAPMGb0fiDTt2ONXhzc4tNHg7GW8Y1Yg3O81wNXjr1Ig3OxkwJLKB27Fwc2xrqoObnVpo4HY63Dr1wS2w0wzXArcwqg9ugZ0AeCKs2ZkeS7fQsa2pjG7rUGjodk66hVFldFPF95+/lF+2bv865i8='),
			this.addDataEntry(dt + 'chat', 400, 660, 'Chat',
				'7VpRc+I2EP4tfWD6BCPbmCOPCSTX6TTTm+ShzwIvWHOy5ZNkQvrru5JlDrDvoI2VGKZmQqy1JMv77bf+tMMgmmXbz5IW6aNIgA+i+0E0k0Lo6izbzoDzQUhYMojmgzAk+DcIH35wNbBXSUEl5PqcAWE1YEN5CZWlMij9yp0h1Rkuax4MojuV0kS8YINgI6EqhcQ18Eph+mfbtXmW0QKfQGk8HUlYatNBS/EVZoILaaeNqgOvrBjne/aVPdD+kjINzwVdmnlfcCq0udWC1LD94RNbk3vczyAy0PIVu7ywRKdVjzGpvEJSYOvUDZtMnJGqyrDejf3uQDxxPmz3Z9Q7f+7sbf6UoNjf8JfzTHCuh8P/5uHY2SRwqtkGDuZ/i9fHDa//LtIcLXdCNPxfuxanYIWChi9zkUNLWBLzQTunC+BfhGKaiRyvyer57ihna9PmsLL4oKNZvv7DtuaBGbkSuW6bcS8gzvJ+1O79V8f3UVwN2UMjagEj+rdguDt+EQwXEpJ6fe5u7u7Dul3PIFYrBboB5m7dZ+Ebe2dVqUCeGQk39jgXrHE7WNsjsH4CXtgCXtgNeMOAHKFHPKA3aaD3yJYpBdPnSSxYrpBInlnqWFmTtCatY+mT8+x70PRwwMeQdjh+D9Z+ulzWTv5n7bSBngkS8gyFhmyBfg9JSIKoc3nj9I18RmGCPeJzmZ+YT5O+O9w/Xv68lbwO7k8+uHrTQPs3hu2M5r/0BeF78kDmk5NKK37L1uE0stMWYMfd8Do8pHUQ+QC6zhV7SE8H0W2Mjr0NUKyQ28fOAW/bsbRgXJsOCZzYw9ldyNj39FEYeMQ8aGNzR8n8GHQv7A6CJr2xB+6NiE5Bwmg06gvL5zf384fpGVLNB88PB5yKgI5oPwyOY+DGSww0Sz0XTvw6Mj42CjoTdUdREPpJ/80C1bxkytym1GA65qU0/xMLhGnbZyskpJAnIJmujRvBy0JTO2oD3F4ApUxzyTgrs3oWY4ESv1blmlHTLS85pxUYaChlb7LPCY3xDvpil1X2Y2zq5V0Txl4irFmMu/A8c1UCI/KTVpoVuiegnOPwB9xAkBnNfzVrWmCegA1Y3WEywaxne4xT6uPdhUfoU3g0YsNPQmjW/y48IVy38Ij8yM9mNfA2T4wy2IBREzk1eoGzBUi7LYGssMrBZIil1RIK9YY2qiEXC6tYQFnJgaCgMjHVClFoJqr+30qTZHKWMruIrIDECpRvpemQocpR1eKsKbFpaMsyM6jgCKiVKSs8seqlEEqxzAwxyxFZbu/vBJCiSpUZLoHWa9rvZBVQb/JbT/XNLr67fdeNvZS1g2Zl9MLz2VUJnNgP6M0C6Z9fcdtC5ihzekPv3skXj9XS4S6mauC9KNvw6uql161eYi8F1LClgFqm/amavuG97jHrT/yx/xh1L5o1vLqS6VW96SddJHxsfv+1ZdV9/8eY/wA='),
			this.addDataEntry(dt + 'log in', 240, 220, 'Log in',
				'7ZhLj9owEIB/TY4gJ04CHAtst5W2EupW6tmQgVjrxMjx8uiv7zgxgZAAUZVsD60RUmbs8WO+mbESh86Sw7Ni2/ibjEA49MmhMyWlLp6SwwyEcDzCI4fOHc8j+He8zzd63byXbJmCVLcx8AqDHRPvUGhmMtVKmjELluKG8v5MH4Xtj3WCu5y7Dp1mMYvkHgWCQsSyGCIrYM/WjE8OG3O04RIPlGl8HCoFK9zZdM2FmEkhVT4rXecN9UzwTYq6FR4AsHOqXvkvM1VgpsWdvcGFGckb9uxAab5i4pM113Jrxm/ZiqebH0aYe2bcGk9nJ3T9k2wPZ460j7mGVzQzij1uGHXWRbgCHG66OVdZHz+DTECrIw7Z80jH1tV+gYLEwDexNTvxISwrFJvS9kwNHyy4Zoi0BvEpYbw3dHeJTPJ2B3ATgYtxUd4uAkHAWp9RvuTS3Cc3WCnIcO6f1utuW3reQ3rupIEetToFgmm+g8r8TUTtEgvJcWWPHKrTHAsxvAoJuV5noGsBUe6zVYz4tRjpOjwMqOm71jL94xiJzK+k+OXk6dYY6UOMtAuKbfMy6N3neZo3eLj05JWHS88XFmWeDGlbF/vNLrYGZBhUQrmULzMprCNwvU4SaTCurD4Ie0iksAZ1wbJsL1X00Vdlyxz7X28f1FuX9FFwR/9CwQ0/puBeYeyU07h3TttTfbhHplqQW5fjUT/lOOylHI97SLNJDd93SCBZ4ruDRxLomuUqhtXbUh4uMo42cQ3zdqd4C7YEsZAZ19zk71wV3r9fhoOrek46rLd+Qxj4nYTBiFbLrd9HHLikFggvcoOKr2lf9/LtkpvKFOrsg/F0EozqV/DdV6NHL6fdXsDHisHfuY4HQQfXMYrnjyjF8MtvLL8B'),
			this.addDataEntry(dt + 'log in', 240, 260, 'Log in',
				'7Vhtb5swEP41fJnUyJiXJB+b0HaVOilaJ+2zAw54NTgzbl7263cGE0ghadRCVWmjqorPd+Z8z/OcC5YzT3d3kqyTbyKi3HJuLGcuhVDlXbqbU84tjFhkOYGFMYJfC9+emLWLWbQmkmbqkgBcBmwIf6alZS4yJYX2WZAMEirmc7XnZj5RKWQZ2JYzyxMSiS0MEAwikic0MgOYWWv/dBfrrY2WsKFcwe1IShpCZrMV43wuuJDFqs6quMBOOIszsIWwAQqTM/nI/uilPL0sZPZEG2GouGBmQ6ViIeHXJlyJtfZfk5Bl8Q89CLD2W8HuzIK2W43N5vSWtglT9BHCtGELCYPNlAieQHcny1yYTI3vqEipkntw2bJIJabUbgkFSiiLExOGfWMkeWmID7E1anBjgOsG0WmBaGGf6yorsoStYRRCwJpEERSjcPB/P2uGzVB9a7xMyc541VyojGaT1zZAgTVO1Q5rS3MFPzZ/yxRlyxLpehgg60DDiGYqm7ZXyqJIb7nhVWNQGb0iq1ZK91koSn5q1ZTJLKvJm5QwXlkBkWWdNgI6dkQsSJ5vhYy6gw42vd22sVUVbSzRrOzDCPO03jKR0bZyb3FwE9waKTXswczD7hzsApSz4kU6OvSEyCTN4bk/DVT2pbLDr8rOnnbIrpKipJwotqFH63dJ0TxiIVim2WEScswy+3LovdCyWK1yqlpKPuR5kbjdlrh/iSSzXBRrQo5CkX48EwDeaXF1NPJI/3R02kqqnK5U3ZofilHgok9BC2cQWhRNsHdeeB1Nv18eaKRmz0qJ7M1kqE71EsavVakvxtF9FUenDxgvPWj9wWteHDIdFa5ldVzhQ+XLiINQRs6lJfa6S2wC0Mg74vJh3JSS34bAxr0o6Wpy9PQrfwAhjVugfjHX/8b6yRurO0RjnfwLjXX8uRrrdPCar6t/xs9V+biJXtxCJ8O0UH+QFjoZQDI2auH3naY0Xer3NZTSvsEMExo+LcWuIR+nC1i/uM7Ih5Ml5QuRM8W0GANZlv98T/VeNGH0zua5PwpossLtYIXbCyvGzjErxngIWtgtWjyIGAz32ccfrd1vr95kNvXG7bfXA0Pe8sGo37P1ND0+7qS96uPVFob1h83Svfnd8y8=')
		];
			   	
   		this.addPalette('bootstrap', mxResources.get('bootstrap'), false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
