import { Chat } from "../models/custom-design-chat.models.js";
import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrGetChat = asyncHandler(async (req, res) => {
  try {
    const { productId, userId } = req.body;

    let chat = await Chat.findOne({ productId }).populate(
      "messages.sender",
      "name email"
    );

    if (!chat) {
      chat = new Chat({
        productId,
        participants: [userId],
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const addMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId, userId, message } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    chat.messages.push({ sender: userId, message });

    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const getChatByProductId = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const chat = await Chat.findOne({ productId }).populate(
      "messages.sender",
      "name email"
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export { createOrGetChat, addMessage, getChatByProductId };
