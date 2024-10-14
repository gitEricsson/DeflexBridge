import { Request, Response } from 'express';
import { NFIDAuth } from './../utils/nfidIntegration';

const nfidAuth = new NFIDAuth();

export const login = async (req: Request, res: Response) => {
    await nfidAuth.init();
    const isAuthenticated = await nfidAuth.isAuthenticated();
    if (isAuthenticated) {
        const identity = await nfidAuth.getIdentity();
        res.json({ success: true, identity: identity.getPrincipal().toString() });
    } else {
        res.status(401).json({ success: false, message: "Authentication failed" });
    }
};

export const logout = async (req: Request, res: Response) => {
    await nfidAuth.signOut();
    res.json({ success: true });
};