# Anything Ipsum 🎯

Angular SSR application with Mistral AI integration for generating Lorem Ipsum-style content.

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/damienmarill/anything-ipsum.git
cd anything-ipsum

# Set your environment variables
export MISTRAL_API_KEY=your_mistral_api_key_here

# Build and run
docker-compose up --build
```

### Using Pre-built Docker Image

```bash
# Pull and run the latest image
docker run -p 4000:4000 \
  -e MISTRAL_API_KEY=your_mistral_api_key_here \
  -e APP_URL=http://localhost:4000 \
  ghcr.io/damienmarill/anything-ipsum:latest
```

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod

# Serve SSR build
npm run serve:ssr:anything-ipsum
```

## 🌐 Access

- **Application**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MISTRAL_API_KEY` | Your Mistral AI API key | `your_mistral_api_key_here` |
| `APP_URL` | Application URL | `http://localhost:4000` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `4000` |

### Setting Environment Variables

#### Docker Compose
Edit the `environment` section in `docker-compose.yml`:

```yaml
environment:
  - MISTRAL_API_KEY=your_actual_key_here
  - APP_URL=https://your-domain.com
```

#### Docker Run
```bash
docker run -p 4000:4000 \
  -e MISTRAL_API_KEY=your_key \
  -e APP_URL=https://your-domain.com \
  ghcr.io/damienmarill/anything-ipsum:latest
```

#### System Environment Variables
```bash
export MISTRAL_API_KEY=your_key
export APP_URL=https://your-domain.com
docker-compose up
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |
| `npm run serve:ssr:anything-ipsum` | Serve SSR build |

## 🏗️ Architecture

- **Frontend**: Angular 20+ with SSR
- **Backend**: Express.js server
- **AI Integration**: Mistral AI API
- **Styling**: Tailwind CSS + DaisyUI
- **Containerization**: Docker with multi-stage build

## 📦 Docker Images

### Pre-built Images
- **Latest**: `ghcr.io/damienmarill/anything-ipsum:latest`
- **Tagged Releases**: `ghcr.io/damienmarill/anything-ipsum:v1.0.0`

### Building Locally
```bash
# Build production image
docker build -t anything-ipsum .

# Build with specific target
docker build --target production -t anything-ipsum:prod .
```

## 🚀 Deployment

### GitHub Actions CI/CD

The project includes automated CI/CD that:
- ✅ Runs tests and linting on every PR
- 🏗️ Builds and pushes Docker images on master commits
- 📦 Creates releases with tagged Docker images
- 🔄 Uses GitHub Actions cache for faster builds

### Production Deployment

1. **Using latest image**:
   ```bash
   docker pull ghcr.io/damienmarill/anything-ipsum:latest
   docker run -d -p 4000:4000 \
     -e MISTRAL_API_KEY=your_key \
     --restart unless-stopped \
     ghcr.io/damienmarill/anything-ipsum:latest
   ```

2. **Using docker-compose** (recommended):
   ```bash
   # Set environment variables in docker-compose.yml
   docker-compose up -d
   ```

### Health Checks

The application includes built-in health checks:
- **Endpoint**: `GET /api/health`
- **Docker**: Automatic health checks every 30s
- **Response**: `200 OK` when healthy

## 🔧 Configuration

### Mistral AI Setup

1. Get your API key from [Mistral AI](https://mistral.ai)
2. Set the `MISTRAL_API_KEY` environment variable
3. The application will automatically connect to Mistral AI services

### Customization

- **Styling**: Modify Tailwind classes in components
- **API Routes**: Add routes in the Express server
- **Environment**: Update docker-compose.yml for your environment

## 📋 Requirements

- **Node.js**: 20+ (for development)
- **Docker**: 20+ (for containerization)
- **Mistral AI API Key**: Required for AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: https://github.com/damienmarill/anything-ipsum
- **Docker Images**: https://github.com/damienmarill/anything-ipsum/pkgs/container/anything-ipsum
- **Issues**: https://github.com/damienmarill/anything-ipsum/issues

---

Made with ❤️ by [Damien Marill](https://github.com/damienmarill)