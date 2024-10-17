import { Request, Response } from 'express';
import { NFIDAuth } from './../utils/nfidIntegration';
import jwt from 'jsonwebtoken';

const nfidAuth = new NFIDAuth();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const login = async (req: Request, res: Response) => {
  try {
    await nfidAuth.init();
    const isAuthenticated = await nfidAuth.isAuthenticated();
    if (isAuthenticated) {
      const identity = await nfidAuth.getIdentity();

// JWT Authentication? Here you have it
//// For when e-mail will be integrated
    //   const token = jwt.sign({ principal: identity.principal }, JWT_SECRET, { expiresIn: '1h' });

      const token = jwt.sign({identity: identity.getPrincipal().toString() }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token, identity });

    //   res.json({ success: true, identity });
} else {
    res.status(401).json({ success: false, message: "Invalid credentials or session expired" });
  }
} catch (error) {
  if (error.message.includes('AuthClient')) {
    res.status(500).json({ success: false, message: "Authentication service unavailable" });
  } else {
    res.status(500).json({ success: false, message: error.message });
  }
}
};

export const validateJWT = (req: Request, res: Response, next: () => void) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ success: false, message: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
      }
      req.body.principal = decoded?.principal;
      next();
    });
  };

  export const refreshSession = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
  
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        
        const newToken = jwt.sign({ principal: decoded?.principal }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token: newToken });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const logout = async (req: Request, res: Response) => {
  try {
    await nfidAuth.signOut();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Phase 2

// // New endpoint to retrieve user profile
// export const getProfile = async (req: Request, res: Response) => {
//   try {
//     const identity = await nfidAuth.getIdentity();
//     res.json({ success: true, profile: identity });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // New endpoint to update user profile (e.g., email)
// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     const identity = await nfidAuth.getIdentity();
//     identity.email = email;
//     res.json({ success: true, updatedProfile: identity });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
