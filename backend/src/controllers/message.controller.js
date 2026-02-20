import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"

export const getAllUsers = async (req, res) => {
    try {
        const logedUser = req.user;
        const allUsers = await User.find({_id: { $ne: logedUser._id}}).select("-password");
        res.status(200).json(allUsers);
    } catch(err) {
        console.log("Error in getAllUsers controller",err);
        res.status(500).json({message: "Internal Serval Error"});
    }
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id} = req.params;
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: id},
                {senderId: id, receiverId: myId}
            ]
        });
        if(messages) {
            return res.status(200).json(messages);
        } else {
            return res.status(200).json({messages: "Looks quite Empty"});
        }
    } catch (err) {
        console.log("Error in the getMessagesByUserId Controller");
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const myId = req.user._id;
        const {id} = req.params;
        if(!text && !image) {
            return res.status(400).json({message: "Text or Image is required"});
        }
        if(myId.equals(id)) {
            return res.status(400).json({message: "Cannot send to yourself"});
        }
        const isReceiverExists = await User.exists({_id: id});
        if(!isReceiverExists) {
            return res.status(400).json({message: "Receiver doesnt Exists"});
        }

        let imageURL
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId: myId,
            receiverId: id,
            text: text,
            image: imageURL
        });
        if(newMessage) {
            await newMessage.save();
            return res.status(201).json(newMessage);
        }
    } catch(err) {
        console.log("Error in sendMessage controller");
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const getChatUser = async (req, res) => {
    try {
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [{senderId: myId}, {receiverId: myId}],
        });
        const myContactsIds = [ ...new Set(messages.map((item)=> {
            if(item.senderId.toString === myId.toString) {
                return item.receiverId;
            } else {
                return item.senderId;
            }
        }))]
        const myContacts = await User.find({_id: {$in: myContactsIds}}).select("-password");
        res.status(200).json(myContacts);
    } catch(err) {
        console.log("Error in getChatUser controller");
        return res.status(500).json({message: "Internal Serval Error"});
    }
}