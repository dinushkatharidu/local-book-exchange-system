import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signToken } from '../utils/tokens.js';


export async function register(req,res){
const { name, email, password, city } = req.body;
const exists = await User.findOne({ email });
if(exists) return res.status(409).json({ error: 'Email already used' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash, city });
const token = signToken({ id: user._id, name: user.name });
res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
res.json({ id: user._id, name: user.name, email: user.email, city: user.city });
}


export async function login(req,res){
const { email, password } = req.body;
const user = await User.findOne({ email });
if(!user) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
const token = signToken({ id: user._id, name: user.name });
res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
res.json({ id: user._id, name: user.name, email: user.email, city: user.city });
}


export async function me(req,res){
res.json({ id: req.user.id });
}


export async function logout(_req,res){
res.clearCookie('token');
res.json({ ok: true });
}