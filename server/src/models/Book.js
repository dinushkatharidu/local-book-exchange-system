import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true, index: true },
author: { type: String, index: true },
description: String,
tags: [String],
condition: { type: String, enum: ['new','good','used'], default: 'good' },
status: { type: String, enum: ['available','borrowed'], default: 'available' },
city: String,
coverUrl: String,
createdAt: { type: Date, default: Date.now }
});
bookSchema.index({ title: 'text', author: 'text', description: 'text', tags: 'text' });
export default mongoose.model('Book', bookSchema);