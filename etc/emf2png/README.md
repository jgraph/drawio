# emf2png service

It uses Python 2.7 and virualenv (pip install virualenv)

Create a virtual environment to include needed packages
* virtualenv venv

On linux
* source venv/bin/activate
On Windows
* venv\scripts\activate

Install the following packages
* pip install flask
* pip install Pillow
* pip install flask-cors

To run the server (development)

On Linux
* export FLASK_APP=emf2png.py
On Windows
* set FLASK_APP=emf2png.py

* flask run

To deploy the app

http://flask.pocoo.org/docs/1.0/deploying/
https://cloud.google.com/appengine/docs/standard/python/getting-started/python-standard-env