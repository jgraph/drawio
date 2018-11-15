Docker
------
After successful checkout, from the project directory run,

```bash
cp etc/docker/Dockerfile .
docker build -t draw .
docker run -d -p 8888:8080 draw
```
Now the app will be accessible at `http://localhost:8888/draw/?local=1` (the local URL parameter disables
the cloud integrations as those require some keys to be changed).
