import { verifyToken } from '../utils/tokens.js';
export function requireAuth(req,res,next){
const token = req.cookies?.token;
if(!token) return res.status(401).json({error:'Unauthorized'});
try{ req.user = verifyToken(token); next(); }
catch{ return res.status(401).json({error:'Invalid token'}); }
}