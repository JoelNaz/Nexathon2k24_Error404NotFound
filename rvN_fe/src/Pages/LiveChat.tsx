import ChatComponent from "@/components/LiveChatComp"
import { useParams } from "react-router-dom"

const LiveChat = () => {
  const {userId} = useParams()
  return (
    <div>
      Live Chat
      <ChatComponent receiverId={userId}/>
    </div>
  )
}

export default LiveChat
