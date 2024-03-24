import { useProfileStore } from '@/store/store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';



const ChatComponent = ({receiverId}) => {
  const userId = useProfileStore((state)=>state.userId)
  console.log('user:',userId)
  console.log('receiver:',receiverId)
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

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
    } catch (error) {
      console.error(error);
    }
  };

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
    <div>
      {messages.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.content}</li>
          ))}
        </ul>
      )}
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className='text-black'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;

