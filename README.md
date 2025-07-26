<div align="center">
 <img src="public/a_ipsum_512.png" width="150"/>

<h1 style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Anything Ipsum</h1>

<br/>

<!-- Badges principaux -->
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/damienmarill/anything-ipsum?style=for-the-badge&logo=github&color=8B5CF6)](https://github.com/damienmarill/anything-ipsum/releases)
[![GitHub stars](https://img.shields.io/github/stars/damienmarill/anything-ipsum?style=for-the-badge&logo=github&color=F59E0B)](https://github.com/damienmarill/anything-ipsum/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/damienmarill/anything-ipsum?style=for-the-badge&logo=github&color=EF4444)](https://github.com/damienmarill/anything-ipsum/issues)
[![License](https://img.shields.io/github/license/damienmarill/anything-ipsum?style=for-the-badge&color=8B5CF6)](LICENSE)

<!-- Badges techniques -->
[![Angular](https://img.shields.io/badge/Angular-20+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mistral AI](https://img.shields.io/badge/Mistral-AI-FF6B35?style=for-the-badge&logo=ai&logoColor=white)](https://mistral.ai/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<!-- Bouton Test it -->
<br/>

[![Test it Live](https://img.shields.io/badge/🚀_Test_it_Live-Visit_Demo-10B981?style=for-the-badge&logoColor=white)](https://ipsum.marill.dev)

<em>Lorem ipsum dolor sit amet... but make it</em> <strong>AI-powered</strong> ✨
</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=8B5CF6&height=120&section=footer"/>

## 🌟 What is Anything Ipsum?

Forget boring "Lorem ipsum dolor sit amet" - **Anything Ipsum** generates engaging placeholder text about literally *anything* you can imagine:

- 🦸 **Superhero adventures** for your comic book mockups
- 🍕 **Pizza descriptions** for restaurant websites  
- 🚀 **Space exploration logs** for sci-fi projects
- 🎮 **Gaming reviews** for entertainment sites
- 🌿 **Botanical studies** for nature blogs
- 💻 **Tech startup pitches** for business presentations

And literally **anything** else your creative mind can conjure!

## ✨ Features

- 🤖 **AI-Powered Generation**: Leverages Mistral AI for intelligent, contextual content
- 🎨 **Thematic Variety**: Generate text in any style, tone, or subject matter
- ⚡ **Real-time Generation**: Instant placeholder text at your fingertips
- 📱 **Responsive Design**: Beautiful interface that works on all devices
- 🔒 **Privacy-First**: Your creative prompts stay between you and the AI
- 🚀 **Lightning Fast**: Angular SSR for optimal performance

## 🚀 Quick Start

### The Easy Way (Docker)

```bash
# Clone the magic
git clone https://github.com/damienmarill/anything-ipsum.git
cd anything-ipsum

# Set your AI key (get one at https://mistral.ai)
export MISTRAL_API_KEY=your_mistral_api_key_here

# Launch the generator
docker-compose up --build

# Visit http://localhost:4000 and start creating!
```

### The Developer Way

```bash
# Install the dependencies
npm install

# Fire up the development server
npm start

# Build for production
npm run build:prod

# Serve with SSR power
npm run serve:ssr:anything-ipsum
```

## 🎪 How It Works

1. **🎯 Choose Your Theme**: Enter any topic, style, or concept
2. **🎛️ Customize**: Adjust length, tone, and complexity
3. **✨ Generate**: Watch AI create contextual placeholder text
4. **📋 Copy & Use**: Grab your content and paste it anywhere

### Example Generations

**Input**: *"Write about a mysterious coffee shop"*
**Output**: 
> *"Café Obscura sits nestled between forgotten alleyways, where baristas craft drinks that taste like memories and the aroma carries whispers of untold stories. Each cup holds secrets brewed from beans that grow in places that don't exist on maps..."*

**Input**: *"Tech startup elevator pitch"*
**Output**:
> *"We're revolutionizing the way people think about thinking. Our platform uses quantum-inspired algorithms to optimize decision-making processes, reducing cognitive load by 300% while increasing productivity metrics across all verticals..."*

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MISTRAL_API_KEY` | Your Mistral AI API key | - | ✅ Yes |
| `APP_URL` | Application URL | `http://localhost:4000` | No |
| `NODE_ENV` | Environment mode | `production` | No |
### Getting Your Mistral AI Key

1. Visit [Mistral AI Platform](https://mistral.ai)
2. Create an account
3. Generate an API key
4. Add it to your environment variables

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```yaml
services:
  anything-ipsum:
    image: ghcr.io/damienmarill/anything-ipsum:latest
    ports:
      - "4000:4000"
    environment:
      - MISTRAL_API_KEY=your_api_key_here
      - APP_URL=https://your-domain.com
    restart: unless-stopped
```

### Using Docker Run

```bash
docker run -d \
  --name anything-ipsum \
  -p 4000:4000 \
  -e MISTRAL_API_KEY=your_api_key_here \
  -e APP_URL=https://your-domain.com \
  --restart unless-stopped \
  ghcr.io/damienmarill/anything-ipsum:latest
```

## 🏗️ Architecture

Built with modern web technologies for maximum performance and developer happiness:

- **🅰️ Angular 20+** with Server-Side Rendering (SSR)
- **⚡ Express.js** for lightning-fast API handling
- **🤖 Mistral AI** for intelligent content generation
- **🎨 Tailwind CSS** for beautiful, responsive design
- **🐳 Docker** for consistent deployments
## 📊 API Reference

### Generate Content

```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Write about space pirates",
  "length": "medium",
  "tone": "adventurous"
}
```

**Response:**
```json
{
  "content": "Captain Stardust and her crew of cosmic buccaneers...",
  "timestamp": "2025-07-26T18:30:00Z",
  "tokens_used": 127
}
```

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "uptime": "2h 34m 17s",
  "ai_connection": "connected"
}
```

## 🚀 Performance

- **⚡ SSR-Optimized**: First contentful paint < 1.2s
- **📦 Lightweight**: Bundle size < 500kb gzipped
- **🔄 Caching**: Smart HTTP cache for repeated requests
- **🎯 SEO-Ready**: Perfect Lighthouse scores out of the box

## 🤝 Contributing

We love contributions! Whether you want to:

- 🐛 **Report bugs**
- 💡 **Suggest features** 
- 🎨 **Improve designs**
- 📝 **Fix documentation**
- ⚡ **Optimize performance**

### Development Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/anything-ipsum.git
cd anything-ipsum

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Create your feature
git checkout -b feature/amazing-new-feature

# Commit and push
git commit -m "Add amazing new feature"
git push origin feature/amazing-new-feature
```

## 📜 License

**Anything Ipsum** is open source and available under the [MIT License](LICENSE).

<div align="center">

**Made with ❤️ by [Damien Marill](https://github.com/damienmarill)**

*"Lorem ipsum dolor sit amet, consectetur adipiscing elit... but why settle for Latin when you can have* **anything**? *"* ✨

[🚀 Try It Live](https://ipsum.marill.dev) • [⭐ Star on GitHub](https://github.com/damienmarill/anything-ipsum) • [🐳 Docker Hub](https://github.com/damienmarill/anything-ipsum/pkgs/container/anything-ipsum)

</div>
