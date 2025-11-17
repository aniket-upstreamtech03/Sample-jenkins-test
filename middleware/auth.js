/**
 * Authentication and authorization middleware
 * For demo purposes - in production, use proper JWT or OAuth implementation
 */

// Simple API key authentication
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  // List of valid API keys (in production, store in environment variables)
  const validApiKeys = [
    'demo-key-123', 
    'test-key-456',
    'jenkins-build-key',
    'ci-cd-pipeline-key'
  ];
  
  // Add environment variable API keys if available
  const envApiKey = process.env.API_KEY;
  if (envApiKey && !validApiKeys.includes(envApiKey)) {
    validApiKeys.push(envApiKey);
  }
  
  // For development, allow requests without API key but log warning
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide an API key in x-api-key header or api_key query parameter'
      });
    } else {
      console.log('⚠️  Development mode: No API key provided - proceeding with guest access');
      req.user = {
        id: 0,
        name: 'Guest User',
        role: 'guest',
        authenticated: false
      };
      return next();
    }
  }
  
  // Validate API key
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  // Set user context based on API key
  req.user = this.getUserFromApiKey(apiKey);
  req.user.authenticated = true;
  
  console.log(`✅ Authenticated request from: ${req.user.name} (${req.user.role})`);
  next();
};

// Get user context from API key
const getUserFromApiKey = (apiKey) => {
  const userMap = {
    'demo-key-123': { id: 1, name: 'Demo User', role: 'user' },
    'test-key-456': { id: 2, name: 'Test User', role: 'tester' },
    'jenkins-build-key': { id: 3, name: 'Jenkins CI/CD', role: 'system' },
    'ci-cd-pipeline-key': { id: 4, name: 'CI/CD Pipeline', role: 'system' }
  };
  
  return userMap[apiKey] || { id: 0, name: 'Unknown User', role: 'user' };
};

// Require authentication (strict)
const requireAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'This endpoint requires authentication. Please provide an API key.'
    });
  }
  
  next();
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions',
      message: 'This endpoint requires administrator privileges'
    });
  }
  
  next();
};

// Require system role (for CI/CD, Jenkins, etc.)
const requireSystem = (req, res, next) => {
  if (!req.user || req.user.role !== 'system') {
    return res.status(403).json({
      success: false,
      error: 'Insufficient permissions',
      message: 'This endpoint requires system-level access'
    });
  }
  
  next();
};

// Rate limiting middleware
const rateLimit = (windowMs = 900000, maxRequests = 100) => { // Default: 100 requests per 15 minutes
  const requests = new Map();
  
  return (req, res, next) => {
    // Skip rate limiting for system requests
    if (req.user && req.user.role === 'system') {
      return next();
    }
    
    const ip = req.ip || req.connection.remoteAddress;
    const userKey = req.user ? `user_${req.user.id}` : `ip_${ip}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    }
    
    // Get or create user request array
    if (!requests.has(userKey)) {
      requests.set(userKey, []);
    }
    
    const userRequests = requests.get(userKey);
    const recentRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    // Check rate limit
    if (recentRequests.length >= maxRequests) {
      const retryAfter = Math.ceil((recentRequests[0] + windowMs - now) / 1000);
      
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter: retryAfter,
        limit: maxRequests,
        window: `${windowMs / 1000 / 60} minutes`
      });
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(userKey, recentRequests);
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - recentRequests.length,
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    });
    
    next();
  };
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userInfo = req.user ? `[${req.user.name}]` : '[Unauthenticated]';
    
    console.log(`${new Date().toISOString()} - ${userInfo} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = {
  authenticate,
  requireAuth,
  requireAdmin,
  requireSystem,
  rateLimit,
  requestLogger,
  getUserFromApiKey
};