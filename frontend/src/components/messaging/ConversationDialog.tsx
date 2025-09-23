import { NormalizedConversation } from "@/types/messaging"

const ConversationDialog = ({ conv }: { conv: NormalizedConversation }) => {

  return (
    <div className={`bg-jb-bg w-full h-full p-2 border-b-1 flex flex-col justify-between`} >
      <div className={`border-b-1 py-2 border-jb-surface`}>
        <h6 className="float-end text-jb-text-muted text-xs">{conv.updatedAt || 'A few sec ago'}</h6>
        <img src={conv.receipent?.avatar} alt="profile image" className={`w-10 h-10 object-cover rounded-full`} />
      </div>

      {conv.messages && conv.messages.map((message: any) => (
        <div className="flex items-center my-2" key={message.id}>
          <img src={message.sender?.avatar} alt="profile image" className={`w-10 h-10 object-cover rounded-full`} />
          <div className="ml-2">
            <p className="text-jb-text">{message.message}</p>
          </div>
        </div>
      ))}

      <div>
        <input type="text" className="w-full bg-jb-surface rounded-3xl outline-none  py-2 px-4" />
      </div>
    </div>
  )
}

export default ConversationDialog;