import React from 'react';
import './LeftSidebar.css';

// 单个聊天房间组件
interface RoomEntryProps {
    roomAvatar?: string;
    roomName: string;
    lastText: string;
    lastTime: string;
    onDelete: () => void; // 删除房间的回调
}

function RoomEntry({ roomName, lastText, lastTime, onDelete }: RoomEntryProps) {
  return (
    <div 
        className="room_entry"
        onContextMenu={(e) => {
            e.preventDefault();
            if (window.confirm(`Delete room "${roomName}"?`)) {
                onDelete(); // 调用删除函数
            }
        }}
    >
        <div className="room_avatar"></div>
        <div className="room_entry_content">
            <div className="room_name">{roomName}</div>
            <div className="last_message">{lastText}</div>
        </div>
        <div className="last_message_time">{lastTime}</div>
    </div>
    );
};

const LeftSidebar: React.FC = () => {
    return (
        <div className="left_sidebar">
            <div className="left_head">
              <div className="logo_text">
                <span>Chat <span className="colored">App</span></span>
              </div>
              <div className="room_add">
                <button id="room_add_icon_holder" className="room_add_icon_holder">
                  +
                </button>
              </div>
            </div>
  
            <div id="active_rooms_list" className="active_rooms_list">
              {/* 示例房间 */}
              <RoomEntry roomAvatar='' roomName="General" lastText='111' lastTime='20:38' onDelete={function (): void {
                    throw new Error('Function not implemented.');
                } } />
              <RoomEntry roomAvatar='' roomName="Random" lastText='222' lastTime='20:40' onDelete={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            </div>
  
          </div>
    );
};

export default LeftSidebar;