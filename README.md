# Ballys-tech-task

## Getting Started

First, install the necessary packages and dependencies:

```bash
npm i
```


The GitHub API token can be obtained in the link [https://github.com/settings/tokens?type=beta] and clicking on 'Generate new token' <br />
You will then need to create a .env file with the necessary environment variables:

```bash
PORT = 8000
GITHUB_API_TOKEN = YOUR GITHUB TOKEN
REDIS_URL = redis://localhost:6379
```

You can then run the server by typing:

```bash
npm run dev
```

You will need to run a redis server on your machine, you can run the code in your terminal to install redis and run the server:

```bash
brew install redis
redis-server
```

You can then import the postman collection into Postman to see the example requests you can do.