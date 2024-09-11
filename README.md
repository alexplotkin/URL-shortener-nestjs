# URL Shortener API

This API allows the conversion of long URLs into shortened versions that redirect to the original URLs. It is built using Nest.js, MongoDB Atlas for database services, Swagger for API documentation, and Throttler for rate limiting.

## Getting Started

### Prerequisites

Before starting, ensure you have Node.js installed on your system. It is also recommended to install `pnpm` and `Redis` for local development. Alternatively, you can use Docker to manage these dependencies.

### Installation

1. **Install dependencies**:
```bash
$ pnpm install
```

2. **Set up environment variables**:
   Copy the example environment file and make the necessary adjustments.
```bash
$ cp .env.example .env
```

3. **Start the development server**:
```bash
$ pnpm start:dev
```

## Testing

The server includes unit tests for its modules. To run these tests, use the following command:
```bash
  $  pnpm test
```

## Dockerization

If you prefer to use Docker, ensure Docker Engine is installed on your local machine. Set your environment variables and start the server using docker-compose:

1. **Set environment variables**:
```bash
$ cp .env.example .env
```

2. **Launch the server using Docker**:
```bash
$ docker-compose up
```

## Features

- **URL Shortening**: Convert long URLs into manageable short links that redirect to the original URLs.
- **Rate Limiting**: Prevent abuse with Throttler to limit the rate of requests to the API.
- **Swagger Documentation**: Easily test and understand API endpoints through an auto-generated interactive API documentation.

## Contributing

Contributions to improve the API are welcome. Please ensure to follow the existing code style and add tests for any new features or fixes.