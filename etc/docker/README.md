Docker
------
After successful checkout, from the project directory run,

```bash
docker build -t draw .
docker run -d -p 8888:8080 draw
```
Now the app will be accessible at `http://localhost:8888/draw/?https=0`
