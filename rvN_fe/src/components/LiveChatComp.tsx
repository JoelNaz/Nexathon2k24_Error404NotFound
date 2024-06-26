import { useProfileStore } from '@/store/store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from 'react-hot-toast';


const ChatComponent = ({receiverId}) => {
  const userId = useProfileStore((state)=>state.userId)
  const [alarm,setAlarm]=useState(false)
  console.log('user:',userId)
  console.log('receiver:',receiverId)
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  useEffect(() => {
    // Load initial messages between sender and receiver
    loadMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/data/messages/${userId}/${receiverId}`);
      setMessages(response.data);
      console.log(response.data)
      console.log(messages)
      const arrayOfMessages = messages.map(item => item.content);
      const inputText=`Reply with only a "yes" or a "no". You have to act as a chat monitoring system. In the list of messages check if any personal messages are asked like "what is your name or location? or some other personal question. Here are the array of messages ${arrayOfMessages} you need to examine. Strictly reply with only a "yes" or a "no".Strictly reply with only a single "yes" or a "no" The response should be only a word that is "yes" or a "no". Don't return the messages`;
      const result = await model.generateContent(inputText);
      if(result.response.text().toLowerCase()=="yes"){
        setAlarm(true);
      }
      else if(result.response.text().toLowerCase()=="no"){
        setAlarm(false)
      }
      console.log("gemini response :",result.response.text())
    } catch (error) {
      console.error(error);
    }
  };
  console.log(alarm)
  useEffect(()=>{
    if(alarm){
      toast.error("Personal questions detected. Please don't ask or share any personal info")
    }
  },[alarm])
  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/data/sendmessages', { sender:userId, receiver:receiverId, content: messageInput });
      // After sending the message, reload the messages
      loadMessages();
      setMessageInput('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='bg-white p-10 pb-0 rounded shadow-lg w-2/4 h-3/4'> 
      <div className="overflow-y-auto h-3/4 mb-4 border-4 border-double p-4 border-slate-700 text-black">
      {messages.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.content}</li>
          ))}
        </ul>
      )}
      </div>
      <div className="flex items-center mt-10">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className='border-2 border-gray-300 px-4 py-2 mr-2 w-full rounded-md focus:outline-none focus:border-blue-500 text-black'
      />
      <button onClick={sendMessage} className='bg-green-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline-green hover:bg-green-600'>Send</button>
      </div>
      </div>
    </div>
  );
};

export default ChatComponent;

