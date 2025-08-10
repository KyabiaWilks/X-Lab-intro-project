import React from 'react';
import './ChatArea.css';
import useSWR, { mutate } from 'swr';

  // 单个消息组件
  interface MessageProps {
    messageAvatar: string;
    sender: string;
    content: string;
    sendTime: string;
    isMe?: boolean;
  }
  
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function MessageItem ({ sender, sendTime, content, isMe }: MessageProps) {
  return (
    <div className={`message_holder ${isMe ? 'me' : ''}`}>
      <div className={`message ${isMe ? 'me' : ''}`}>
        {!isMe && <div className="message_avatar"></div>} {/* 头像在消息内容左边 */}
        <div className="message_content_wrapper">
          <div className="message_header">
            {!isMe && <div className="message_sender">{sender}</div>}
            <div className="message_time">{sendTime}</div>
            {isMe && <div className="message_sender">{sender}</div>}
          </div>
          <div className="message_content">{content}</div>
        </div>
        {isMe && <div className={`message_avatar ${isMe ? 'me' : ''}`}></div>} {/* 头像在消息内容右边 */}
      </div>
      
    </div>
  );
};

export default function ChatArea() {

    return (
        <div className="chat_area">
            <div className="chat_bg">
              <div className="chat_head">
                <div className="room_avatar"></div>
                <span className="room_name">General</span>
              </div>
              <div id="chat" className="chat">
                {/* 示例消息 */}
                <MessageItem messageAvatar='' sender="Alice" sendTime="23:27" content="Hello, everyone!" />
                <MessageItem messageAvatar='' sender="Bob" sendTime="23:29" content="Hi Alice!" isMe />
              </div>
  
              <div className="chat_input">
                <input
                  type="text"
                  id="messageInput"
                  placeholder="Enter message"
                />
                <button id="send_message_btn" className="send_message_btn">
                  SEND
                </button>
              </div>
            </div>
          </div>
    );
};