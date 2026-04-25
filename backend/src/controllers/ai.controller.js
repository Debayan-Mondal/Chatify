import { summarizeText } from "../lib/LLM.js";



export const summarizeMessage = async(req, res) => {
    try {
        const {text} = req.body;
        console.log(text);
        if(text.length < 120) {
            return res.status(400).json({message: "Too small a message to summarize"});
        }
        const summarizedMessage = await summarizeText(text);
        res.status(200).json(summarizedMessage);
    } catch(err) {
        console.log("Error in summarizeMessage", err);
        return res.status(500).json({message: "Unable to Summarize Message"});
    }
    
}