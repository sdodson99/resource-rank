# Resource Rank

A platform to rank resources for various educational topics.

# Table of Contents

- [Description](#description)
- [Features](#features)
- [Technology](#technology)
  - [API](#api)
  - [Client](#client)
- [How to Run Locally](#how-to-run-locally)
  - [API](#api-1)
  - [Client](#client-1)
- [Contributing](#contributing)

# Description

Need to learn something as efficiently as possible? Looking for a new skill to learn? Rather than sifting through the web for the best courses and information, check out Resource Rank to instantly find the best courses and find new topics to learn about!

# Features

- Instantly find the best resources for learning about a specific topic
- Explore topics to find your next learning journey
- Rate resources based on helpfulness for learning a topic
- Add new topics and resources that are useful

# Technology

## API

- NodeJS
- MongoDB w/ Mongoose
- GraphQL w/ Apollo Server
- DataLoader

## Client

- React
- Gatsby (planning to switch to NextJS for SSR)
- Unit Testing w/ Jest
- Reactive Extensions

# How to Run Locally

Follow the following steps to run Resource Rank locally after cloning.

## API

1. Start the Mongo database.

```
docker-compose -f "environment/docker-compose.yml" up -d --build
```

2. Change directory to "api".

```
cd src/api
```

3. Install packages.

```
npm install
```

4. Create a file named '.env' with the following environment variables. Replace &lt;VALUE&gt; with custom values.

```
MONGO_CONNECTION_STRING=mongodb://res-rank-admin:res-rank-password@localhost:27017/?authSource=admin&ssl=false
PORT=4000
```

5. Start the application.

```
npm run dev
```

## Client

You **must** start the API first (see above) in order for the client to get data in development.

1. Change directory to "client".

```
cd src/client
```

2. Install packages.

```
npm install
```

3. Run the application.

```
npm run dev
```

# Contributing

Please create a new issue if you have any questions, problems, or suggestions. Feel free to open a
pull request if you have a feature or fix you want to contribute to the project.
