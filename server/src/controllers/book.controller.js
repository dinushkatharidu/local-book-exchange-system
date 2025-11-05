import Book from "../models/Book";

export async function createBook(req,res) {
    const book = await Book.create({...req.body,owner:req.user.id});
    res.json(book);
}

export async function myBook(req,res){
    const book = await Book.find({owner: req.user.id}).sort('-createdAt');
    res.json(book)
}

export async function updateBook(req,res){
    const {id} = req.params;
    const book = await Book.findOneAndUpdate({_id:id, owner:req.user.id}, req.body, {new:true});
    if(!book) return res.status(404).json({error:'Not Found'});
    res.json(book); 
}

export async function deleteBook(req,res){
    const {id} = req.params;
    const del = await Book.findOneAndDelete({_id:id,owner:req.user.id});
    if(!del) return res.status(404).json({error:'Not Found'});
    res.json({ok:true});
}

export async function listPublic(req,res) {
    const {q, city} = req.query;
    const filter = {status:'available'};
    if(city) filter.city = city;
    if (q) filter.$text = {$search: q};
    const books = await Book.find(filter).populate('owner', 'name city').sort('-createdAt');
    res.json(books);
    
}

export async function getBook(req,res){
    const book = await Book.findById(req.params.id).populate('owner','name city');
    if(!book) return res.status(404).json({error: 'Not Found'});
    res.json(book);
}