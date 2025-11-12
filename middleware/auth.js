const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req,res,next) => {
    // Get token from headers
    let token = req.headers.authorization?.split(' ')[1];

    if (!token){
        return res.status(401).json({message : "Not authorized, no token"});
    }

    try {
        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to request object
        req.token = token;
        req.user = decoded; 
        next();

    } catch (error) {
        res.status(401).json({message : 'Not authorized, token failed'});
    }
}; 
// Export the middleware
module.exports = protect;