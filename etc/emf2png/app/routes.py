from flask import jsonify, request, send_file, abort
from PIL import Image
from io import BytesIO
from app import app
from urlparse import urlparse

@app.route('/convertEMF', methods=['POST'])
def get_tasks():
	hostname = urlparse(request.referrer).hostname
	if hostname.endswith(".draw.io") == False and hostname.endswith(".jgraph.com") == False:
		abort(403)
	
	img = request.files['img']
	pngImg = BytesIO()
	Image.open(img).save(pngImg, "png")
	pngImg.seek(0)
	return send_file(pngImg,
                     attachment_filename=img.filename+'.png',
					 as_attachment=True,
                     mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)