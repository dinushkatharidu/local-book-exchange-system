import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export async function startConversation(req, res) {
  const { otherUserId, bookId } = req.body;
  let conv = await Conversation.findOne({
    members: { $all: [req.user.id, otherUserId] },
    book: bookId,
  });
  if (!conv) {
    conv = await Conversation.create({
      members: [req.user.id, otherUserId],
      book: bookId,
    });
  }
  res.json(conv);
}

export async function sendMessage(req, res) {
  const { conversationId, body } = req.body;
  const conv = await Conversation.findById(conversationId);
  if (!conv || !conv.members.map(String).includes(req.user.id))
    return res.status(403).json({ error: "Not allowed" });
  const msg = await Message.create({
    conversation: conversationId,
    sender: req.user.id,
    body,
  });
  conv.updatedAt = new Date();
  await conv.save();
  res.json(msg);
}

export async function getConversation(req, res) {
  const { id } = req.params;
  const conv = await Conversation.findById(id).populate("members", "name");
  if (!conv || !conv.members.map(String).includes(req.user.id))
    return res.status(403).json({ error: "Not allowed" });
  const messages = await Message.find({ conversation: id }).sort("createdAt");
  res.json({ conv, messages });
}

export async function myConversations(req, res) {
  const list = await Conversation.find({ members: req.user.id }).sort(
    "-updatedAt"
  );
  res.json(list);
}
