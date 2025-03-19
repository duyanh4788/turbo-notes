# Notes Microservice

![Project Banner](https://miro.medium.com/v2/resize:fit:1225/1*wjMYBqqJKgYxLYMkXL2Ahg.jpeg)

**Notes Microservice** is a demo project showcasing how to build a microservices architecture based on the `turbo-mono` source structure. The project is designed to simplify the management of shared packages, such as database connections or services, within a monorepo.

## Purpose

The project aims to:
- Demonstrate a microservices architecture using [Turborepo](https://turbo.build/repo).
- Facilitate easy management of shared packages (e.g., `connection` package) across microservices.
- Ensure scalability and efficient maintenance for distributed systems.
- Apply new technologies like elastichsearch, rabbitmq, gRPC, redis.

The project includes three main microservices:
- **users**: Manages user information.
- **notes**: Handles note functionality.
- **notifications**: Sends notifications.

## Applied Technologies

**Architecture**:  
![Flow 02](https://storage.googleapis.com/4p_backup_bucket/cms_content_media/flow02-1740224718567.png)

The project utilizes the following technologies:
- **PostgreSQL**: Relational database for persistent data storage.
- **Redis**: High-speed caching for optimal performance.
- **RabbitMQ**: Message broker for asynchronous service communication.
- **gRPC**: High-performance RPC protocol for microservice interaction.
- **Elasticsearch**: Powerful search and data analytics engine.

## Build & Deploy

The build and deployment process is automated using **GitHub Actions CI/CD** and **Docker** on **Server linux**.
![Flow 03](https://storage.googleapis.com/4p_backup_bucket/cms_content_media/flow06-1740465581249.png)

### Installation and Running Instructions

1. **Clone the repository**:
   ```bash
   git clone git@github.com:duyanh4788/turbo-notes.git
   cd turbo-notes
   ```

2. **Set up the environment**:
   - Node.js v20+
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start services:
     ```bash
     docker compose up -d # Ensure service volumes are set up with the correct permissions
     ```
   - Run database migrations:
     ```bash
     npm run pris:mgr
     ```
   - Execute SQL trigger setup:
     ```bash
     psql -f prisma/trigger_note_details.sql
     ```
     
3. **Run the project**:
   ```bash
   cd apps/**/ + insert env for apps/** follow env_tmpl
   npm run start:dev
   

4. **Contact**:
    - Email: ```duyanh4788@gmail.com```

    - Github: ```https://github.com/duyanh4788```