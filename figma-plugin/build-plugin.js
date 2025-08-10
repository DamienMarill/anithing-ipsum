const fs = require('fs');
const path = require('path');
const { build } = require('esbuild');

async function buildPlugin() {
  try {
    console.log('🔨 Building Figma plugin...');
    
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'src', 'ui.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Build with esbuild
    await build({
      entryPoints: [path.join(__dirname, 'src', 'main.ts')],
      outfile: path.join(__dirname, '..', 'dist', 'figma-plugin', 'main.js'),
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      minify: process.env.NODE_ENV === 'production',
      define: {
        '__html__': JSON.stringify(htmlContent)
      },
      external: ['figma'],
      logLevel: 'info'
    });
    
    // Copy manifest.json to dist
    const manifestSrc = path.join(__dirname, 'manifest.json');
    const manifestDest = path.join(__dirname, '..', 'dist', 'figma-plugin', 'manifest.json');
    
    // Ensure dist directory exists
    const distDir = path.dirname(manifestDest);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    fs.copyFileSync(manifestSrc, manifestDest);
    
    console.log('✅ Plugin built successfully!');
    console.log(`📁 Output: ${path.relative(process.cwd(), path.dirname(manifestDest))}`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildPlugin();