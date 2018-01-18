(function()
{
	// Adds GCP (Google Cloud Platform) shapes
	Sidebar.prototype.addGoogleCloudPlatformCardsPalette = function()
	{
		var sb = this;
		var n = 'dashed=0;html=1;' + mxConstants.STYLE_SHAPE + '=mxgraph.gcp.compute.';
		var n1 = 'dashed=0;html=1;strokeColor=#dddddd;fillcolor=#ffffff;gradientColor=none;shadow=1;strokeWidth=1;';
		var gn = 'mxgraph.gcp.product_cards';
		var dt = 'gcp google cloud platform card';
		var s = 0.3; //scale

		var fns =
		[
			this.addDataEntry(dt + 'product', 170, 55, 'Product Card',
				'pZRdb4MgFIZ/DZczKq11l539uFqyZBe7XIgclQzFIG3tfv1AsNXpsiZijPByDh6fV0A4KdujJHXxKihwhPcIJ1IIZXtlmwDnKPQZRXiHwtDXNwoPf8wG3axfEwmVeiQhtAlnwk9gFSs06sqdQElTgAn3EX4pVKlr3AW62ygpviARXMguENOu6ZmMcZ7e9axrWs8loUwX1udUogKzUEGouIxW/WBUFU5xFYJU0P75lZ3kPvEIogQlrzrk4tYxERtLwi+A5YVLW6+tRho7zm+pd2a647DNI8QLEBakNiFlm5s/wMvT2ktFWZ8U9M9PqHLWYTJUB7RXON4cdjNUzVwU4/124pHj/RDQ8F+gOPai52GLpnzxynOEJXCi2BlGL5zD7t75JpguJfT7Cp151/GwX0BkWQNq4tqt8IeMXE2MTKwHWtxbF34bqwkqY42o1Dv7NmKA3XhgR+ybS+uEs7zSGofMpBkLWEr41sklo5QvdcgR8nvwwy0QzGwBd0AsNSgaG/QUhMsd0sP7SWjDhwflDw=='),
			this.addDataEntry(dt + 'product', 190, 55, 'Product Card',
				'5ZVdb4MgFIZ/jZczVlpnLzv7cbVkyS52uRA5KimKQdrqfv1AsNVos2ZmV8MY4eUcPD6vqIOivD4IXGavnABz0M5BkeBcml5eR8CY43uUOGjr+L6nTsff35ldtLNeiQUU8pEE3yScMTuBUYxQyYZZgeAqAx3uOeglk7mqcbtQ3UoKfoSIMy7aQETapmYSylh805O2KT0VmFBVWJdT8AL0Qhkm/DJY9YMSmVnFVghCQn33KVvJPuIBeA5SNCrkYtfREWtDwsuApplNW62MhiszTq+pN2aqY7FNI0QzEGa41CF5neo3wE3j0o15Xp4kdNdPKFLaYtJUe7SXKHzebyeo6rkgRLvNyCPL+yGg/o9AUegG634LxnzR0rWEBTAs6RkGN5zCbu/5xqkqxfe6Cq15zXDYLcCTpAI5cu1a+ENGLkdGbgrMGknjSskvOD5CQUbeKohSu8ML+U6/tLhAdtx3pG1Kx4ymhdIYJDpNu0BjzDZWzikhbK5JFpLXse/vAjSxC+w3Yq5HwdCjJ/8vTFqNTIrMRlHizmyV3zkUevr4Hw7NcUQNb78nE97/e30D'),
			this.addDataEntry(dt + 'product', 190, 55, 'Product Card',
				'5ZddT4MwFIZ/DZcujG7ILif7uDIx8cJL09ADNCuUlG6Cv96WFgeBxcWp0dllWfv2nFLeh+4EB4VZtRW4SO85AeagtYNCwbk0vawKgTHHcylx0MrxPFd9HW9zYnbazLoFFpDLcxI8k3DAbA9GMUIpa2YFgssUdLjroLtUZmqPq6nqllLwHYSccdEEItI0NRNTxqKjHjdN6YnAhKqNtTk5z0EvlGLCX3qrPlEiU6vYHYKQUJ28y0ayt7gFnoEUtQp5sevoiIVxwk2BJqlNm8+NhkszTt5Tj56pjrVt3EJ0gYUpLnRIViX6CZgkUTGJeFbsJbS/z5AntLFJu9pxe4aC281qxFU95wdovRwwsn6fZaj3oaEomPiLbvOH/qLZxDosgGFJD9C74Jjt9poPnKqteG67Qwuv7g/bBXgclyAH1N43fhbI2QDkMsesljQqlXyHox3kZMBWmSg1HZ7LR/qqxSmy4y6RpikdM5rkSmMQ6zRNgUaYLa2cUULYpZCsSW7rffcUoJFTYP8jLmXk9xndeN8BaT6AFJqDosS1OSqfIxS4+vM/CH0pEf+6S0jdrxQ/UVFur7Ki+P+vogR/rqKcgHTNFWXxtyrK7yR0CRE1PL7wmPDu+9Ab'),
			this.addDataEntry(dt + 'expanded product', 190, 80, 'Expanded Product Card',
				'5ZZdb4MgFIZ/jbdGpbXusrMf2UWTJbvY5ULkKGQIBunW7tcPBPsR26zZ5s1G0xRezkF8Xjw1QHm9Wyvc0I0kwAO0DFCupNSuV+9y4DxIIkYCtAiSJDLfIFldmY272ajBCoS+JSFxCW+Yb8EpTmj1nnuB4JaCDY8CdE91bfa4iE231Uq+Qi65VF0gIl0zMyXjvDjqZdeMXilMmNlYnyOkALsQxUS+n636zIimXvE7BKVhd/UuO8nf4hpkDVrtTci7X8dG3DkSEQVWUZ+WeQ23blwdUo/MTMdju4wQ/QAhxY0NqXeVPQFhVTRhIetmq6H/fQFRsQ6TpXpCe4Ky2WpxgaqdSzO0nA888rxvApp8CRRlYXp32tIhXzQJp05VwLFmb3B2wUvY/TUfJTNbSaJ+h96o/fmwX0CWZQt64Nph4zcZORkYeY91QY30qGQBbctENbDWMNTWHCn0E/uwYoz8+NSQrhkdc1YJo3EobZo1gRWYz71cM0L4L3oUowuH3peEn1qSnluSjeDIdOBI7p4KIy7dc/E9P7LIfv60H6MYkn5d6/qaxl3Vuv4vMSbSeBSkkzGQzgZIN1uuWcPtIX8QrcbC1J5bznnyL+vO9BdMMcPjK5cLP30j+wQ='),
			this.addDataEntry(dt + 'expanded product', 150, 100, 'Expanded Product Card',
				'7Zhvb6MgHMdfjU+NiJ3tw1u79tElS+7BPWyIoJKhGKBbe6/+QHDV6jaXaXe5jaYpfPnr9wP9tXhwXRx3AlX5T44J8+CdB9eCc2VzxXFNGPPCgGIPbrwwDPTbC7cv1IK6NqiQIKUa0yG0HR4ROxCrWEGqE3MCRjInpnngwdtcFXqNG6CzUgn+QNaccVE3hLhOuialjCVnPa2T1jOBMNULa/qUvCRmoBxh/tQZ9TfFKneKWyERihxffMpaco+4I7wgSpx0kyc3jmmxsE4EOaFZ3nQLnIikFbLnvmfTdMb5Nuwh/ICHOapMk+KYmS3gZ0nlJ7yoDoo0n3tSZrT2ydjasjtemNcrtnb4OHGUmeHbZq78xYCbsR9ZVRCGFH0knSmGPHaz3HOqJw+DZk2OyqlbbAbgaSqJ6iF6XuooalGP2toarsU7a/klRe2ZMhx4qX7RP0YE0JVbXKI6aR0xmpVaYyQ13YzpNEHsh5MLijGbkgkY2ODu+H8USNQFspyBx+LtU9ScFkYHNnj7C2hOR8Esjs5i6U3PUhDstDnB/WbM3g77e3tZp/96b8M5SMTThohKcHxI1D5BAktfKlRindsXKMn/vVARDwWKScjBLrmbOcLEck5ymMqHL0MrvgKt1Zy0Esbl1zlcAFyBVzNHC1g0mpgeilZDROAqXm3BO4lcRLptnS4iYvBaqJMVSmiZuXW60i1XihfeO/7JjIAeDUCf5od3c14a5nPEQgB6zMef0m/mkzOPrsG8f88Avpl/HvPl9Mx18XxtZZu3b7X+Ag=='),
			this.addDataEntry(dt + 'service', 110, 50, 'Service Card',
				'rVRdb4MgFP01vBqVteseN7v1ZUuW7GGPC5GrkKEYpK3dr99FaKvrx5p1ECP3cC5czkEJzapuYVgjXjQHRegjoZnR2vpR1WWgFEljyQmdkzSN8SHp04nZpJ+NG2agtpckpD5hxdQSPOKB1m5UADhrBTh6TOiDsBXWOE9w2FqjPyHTSpueSHnfcKaQSuV7vOgb4qVhXGJh25xa1+AWEozr9WjVd8mtCEioEIyF7uQpeygccQG6Ams2SFmHdRwj8UrEAmQpQtokYKz1cblL3WuGgyDbcQnpFRIK1jhK1ZXuBkRl3kS5rpqlhe37A+pS9jI5VQdq305cP6PqyJ4AXqRl+quWdBZN74ZteigtvYkmHjWgmJUrGG14TPGw56uWWEoabysMHm18OBvn66JowR74tav7IgtvDix81jlDBp6LJs60zLtx4CzqaJ03urZv8suBCQ3xwKtZ7DriTMmyRkxB4dKcERI3ug9wJTlX/+jT9MyVv9KVn1/OX3zAcP+n8/Thj/Ab')
		];

		this.addPalette('gcpCards', 'GCP / Cards', false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();
