/**
 * Setup script for initial project configuration
 * Run this once after cloning the repository
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Sample Test API Project...\n');

// Check if .env.local exists, if not create from .env.example
const envExamplePath = path.join(__dirname, '.env.example');
const envLocalPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envLocalPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ Created .env.local from .env.example');
  } else {
    console.log('⚠️  .env.example not found - creating basic .env.local');
    const basicEnv = `# Environment Configuration
NODE_ENV=development
PORT=3000

# API Security
API_KEY=demo-key-123

# Monday.com Integration (Optional)
# MONDAY_API_KEY=your_monday_api_key_here
# MONDAY_BOARD_ID=your_board_id_here
# MONDAY_ITEM_ID=your_item_id_here
`;
    fs.writeFileSync(envLocalPath, basicEnv);
  }
} else {
  console.log('✅ .env.local already exists');
}

// Create necessary directories
const directories = [
  'logs',
  'coverage',
  'reports'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Display next steps
console.log('\n📋 Next Steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start development server: npm run dev');
console.log('3. Run tests: npm test');
console.log('4. Check health endpoint: http://localhost:3000/health');
console.log('5. View API documentation: http://localhost:3000/');
console.log('\n🔧 For Jenkins CI/CD:');
console.log('1. Set up Jenkins credentials for Monday.com integration');
console.log('2. Configure webhook in GitHub to trigger Jenkins builds');
console.log('3. Monitor builds in Monday.com board');
console.log('\n🎉 Setup completed! Happy coding!');