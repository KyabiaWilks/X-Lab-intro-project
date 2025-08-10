"use client";
import React, { useEffect, useRef, useState } from 'react'; // 导入 React
import './ChatRoom.css';
import './LeftSidebar.css';
import './ChatArea.css';
import { skipToken, useMutation, useQueryClient } from '@tanstack/react-query';
import SideBar from './SideBar/SideBar'; // 导入侧边栏组件
import { useRouter } from 'next/navigation'; // 导入 Next.js 的路由器
import { trpc, getErrorMessage, postFetcher } from '../../util'; // 导入 fetcher 函数
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation'; // Use Next.js router instead of useLocation

const formatTime = (timestamp: number, includeDate: boolean = false) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'Invalid date'; // Or handle it in a way that suits your application
  }
  const formatString = includeDate ? 'yyyy/MM/dd HH:mm' : 'HH:mm';
  return format(date, formatString);
};

// 定义房间条目的属性
interface RoomEntryProps {
  roomAvatar?: string; // 房间头像
  roomName: string; // 房间名称
  lastText: string; // 房间最后一条消息内容
  lastTime: string; // 最后消息发送时间
  onClick?: () => void; // 点击房间的回调
  roomId: number; // 房间ID
  onDelete: (roomId: number) => void; // 删除事件
}

// 房间条目组件
const RoomEntry: React.FC<RoomEntryProps> = ({ roomName, lastText, lastTime, onClick, roomId, onDelete }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(true);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownVisible(true); // 显示下拉菜单
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false); // 鼠标移开时隐藏下拉菜单
  };

  const handleDelete = () => {
    setDropdownVisible(false); // 隐藏下拉菜单
    onDelete(roomId); // 调用删除事件，传递当前房间ID
  };

  const formattedLastTime = formatTime(new Date(lastTime).getTime(), false);
  return (
    <div className="room_entry" onContextMenu={handleContextMenu} onClick={onClick} onMouseLeave={handleMouseLeave}>
      <div className="room_avatar"></div>
      <div className="room_entry_content">
        <div className="room_name">{roomName}</div>
        <div className="last_message">{lastText}</div>
      </div>
      <div className="last_message_time">{formattedLastTime}</div>

      {isDropdownVisible && (
        <div className="dropdown_menu">
          <div onClick={handleDelete}>删除</div>
        </div>
      )}
    </div>
  );
};

// 定义消息条目的属性
interface MessageProps {
  messageAvatar: string; // 消息头像
  sender: string; // 消息发送者
  content: string; // 消息内容
  sendTime: string; // 消息发送时间
  isMe?: boolean; // 是否是自己发送的消息
}

// 消息条目组件
const MessageItem: React.FC<MessageProps> = ({ sender, sendTime, content, isMe }) => {
  const formattedTime = formatTime(new Date(sendTime).getTime(), true);
  return (
    <div className={`message_holder ${isMe ? 'me' : ''}`}>
      <div className={`message ${isMe ? 'me' : ''}`}>
        {!isMe && <div className="message_avatar"></div>}
        <div className="message_content_wrapper">
          <div className="message_header">
            {!isMe && <div className="message_sender">{sender}</div>}
            <div className="message_time">{formattedTime}</div>
            {isMe && <div className="message_sender">{sender}</div>}
          </div>
          <div className="message_content_background">
            <div className="message_content">{content}</div>
          </div>
        </div>
        {isMe && <div className={`message_avatar ${isMe ? 'me' : ''}`}></div>}
      </div>
    </div>
  );
};

export interface Message {
  messageId: number;
  roomId: number;
  sender: string;
  content: string;
  time: string;
}
export interface RoomPreviewInfo {  
  roomId: number;  
  roomName: string;  
  lastMessage: Message | null;  
}





interface ModalProps {
  isOpen: boolean; // 控制弹窗是否打开
  onClose: () => void; // 关闭弹窗的回调
  onConfirm: (roomName: string) => void; // 确认创建房间的回调
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [roomName, setRoomName] = React.useState<string>('');

  if (!isOpen) return null; // 如果弹窗没有打开，则返回 null

  const handleConfirm = () => {
    if (roomName) {
      onConfirm(roomName); // 调用确认回调
      setRoomName(''); // 清空输入框
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='add_title'>新建房间</h2>
        <input className='add_input'
          type="text"
          placeholder="输入房间名称"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)} // 更新房间名称状态
        />
        <div className="modal-actions">
          <button className='modal_button' onClick={handleConfirm}>确认</button>
          <button className='modal_button' onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  isOpen: boolean; // 控制弹窗是否打开
  onClose: () => void; // 关闭弹窗的回调
  onConfirm: () => void; // 确认创建房间的回调
}
const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [roomName, setRoomName] = React.useState<string>('');

  if (!isOpen) return null; // 如果弹窗没有打开，则返回 null

  return (
    <div className="modal-overlay">
      <div className="modal-content-delete">
        <h2 className='add_title'>删除房间</h2>
        <div className="modal-actions-delete">
          <button className='modal_button' onClick={onConfirm}>确认</button>
          <button className='modal_button' onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};


// 聊天室组件
export default function ChatRoom() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams(); // 获取 URL 查询参数
  const [userName, setUserName] = useState<string>('User'); // 初始化用户名状态，默认值为 'User'
  
  const [inputValue, setInputValue] = useState<string>(''); // 定义输入框状态
  const [roomId, setRoomId] = useState<number | null>(null); // 定义当前房间 ID 状态
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制新建房间弹窗是否打开
  const [isModalVisible, setModalVisible] = useState(false); // 控制删除确认弹窗是否显示
  const [roomIdToDelete, setRoomIdToDelete] = useState<number | null>(null); // 存储待删除的房间ID
  const chatAreaRef = useRef<HTMLDivElement>(null); // 创建一个 ref 引用
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 创建一个 ref 引用
  
  const router = useRouter();
  const { data, error } = trpc.room.list.useQuery();
  useEffect(() => {
    let previousCookie = document.cookie;
  
    const interval = setInterval(() => {
      if (document.cookie !== previousCookie) {
        previousCookie = document.cookie;
        if (!document.cookie.includes('token')) {
          router.push('/setname');
        }
      }
    }, 3000); // 每秒检查一次
  
    return () => clearInterval(interval); // 清除定时器
  }, [router]);
  

  useEffect(() => {
    const queryUserName = searchParams.get('userName');
    if (queryUserName) {
      setUserName(queryUserName);
    }
  }, [searchParams]);

  // 请求所有房间列表数据
  const { 
    data: roomData, 
    error: roomError,
    isLoading: roomLoading,
  } = trpc.room.list.useQuery(undefined, {
    refetchInterval: 3000, // 每秒刷新一次数据
  });

  // 请求当前房间的消息列表数据
  const { 
    data: messageListData,
   } = trpc.roomMessage.list.useQuery(
    roomId !== null ? { roomId } : skipToken, // 只有在 roomId 不为 null 时才传递参数
    {
      enabled: roomId !== null, // 如果 roomId 为空则禁用查询
      refetchInterval: 3000, // 每秒刷新一次数据
    }
  );

  const addMesMutation = trpc.message.add.useMutation({
    onSuccess: () => {
      // 发送成功后手动刷新消息列表
      if (roomId !== null) {
        queryClient.invalidateQueries({
          queryKey: ['roomMessage.list', roomId],
      });
      }
    },
  });
  
  // 发送消息的函数
  const sendMessage = async (roomId: number, content: string) => {
    try {
      await addMesMutation.mutateAsync({ roomId, content, sender: userName });
      setInputValue(''); // 清空输入框
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // 重置 textarea 高度
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = getErrorMessage(error);
      alert(`Failed to send message: ${errorMessage}`);
    }
  };

    // 定义 useMutation 钩子
    const deleteRoomMutation = trpc.room.delete.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['room.list'] }); // 手动刷新房间列表
      },
    });

  // 删除房间
  const handleDeleteRoom = async (roomId: number) => {
    try {
      await deleteRoomMutation.mutateAsync({ roomId });
      setModalVisible(false);
      setRoomIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete room:', error);
      const errorMessage = getErrorMessage(error);
      alert(`Failed to send message: ${errorMessage}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto'; // 重置高度
    e.target.style.height = `${e.target.scrollHeight}px`; // 动态调整高度
  };

  // 发送消息的处理函数
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault(); // 阻止默认表单提交
    if (roomId && inputValue) {
      sendMessage(roomId, inputValue); // 发送消息
    }
  };

  // 处理点击房间条目
  const handleRoomClick = (id: number) => {
    setRoomId(id); // 更新当前房间 ID
  };

   // 处理请求删除房间
   const handleRoomRightClick = (roomId: number) => {
    setRoomIdToDelete(roomId);
    setModalVisible(true);
  };

  // 取消删除房间的处理函数
  const cancelDelete = () => {
    setModalVisible(false);
    setRoomIdToDelete(null);
  };

  const addMutation = trpc.room.add.useMutation({
    onSuccess: () => {
      // 成功添加房间后，手动刷新房间列表
      queryClient.invalidateQueries({
        queryKey: ['room.list'], // 指定查询键
      });      
    },
  });
  
  const addNewRoom = async (roomName: string) => {
    try {
      const newRoom = await addMutation.mutateAsync({ roomName });
      console.log(newRoom);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error);
      alert(`Failed to send message: ${errorMessage}`);
    }
  };

const sortRoomsByLastTime = (rooms: RoomPreviewInfo[]) => {
  return rooms.slice().sort((a, b) => {
    const timeA = a.lastMessage?.time ? new Date(a.lastMessage.time).getTime() : 0;
    const timeB = b.lastMessage?.time ? new Date(b.lastMessage.time).getTime() : 0;
    return timeB - timeA; // 从最近到最远排序
  });
};

  // 渲染房间条目的函数
  const renderRoomEntries = () => {
    if (roomLoading) {
      return <div>Loading...</div>; // 可以显示一个加载状态
    }
    
    if (roomError) {
      return <div>发生错误，请稍后再试</div>; // 处理错误情况
    }
  
    if (!roomData || !roomData.data) {
      return <div>没有房间</div>; // 没有房间时显示空状态提示
    }
    const sortedRooms = sortRoomsByLastTime(roomData.data);

    return sortedRooms.map((room) => (
      <li key={room.roomId}>
        <RoomEntry 
          roomId={room.roomId} 
          roomName={room.roomName} 
          lastText={room.lastMessage?.content || ""} 
          lastTime={room.lastMessage?.time || ""} 
          onClick={() => handleRoomClick(room.roomId)}
          onDelete={handleRoomRightClick}
        />
      </li>
    ));
  };

  useEffect(() => {
    if (roomData) {
      renderRoomEntries(); // 数据更新时重新渲染房间条目
    }
  }, [roomData]); // 当 roomData 发生变化时触发
  useEffect(() => {
    // 当消息列表数据更新时，滚动到最下方
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messageListData]); // 监听 messageListData 的变化
  
  return (
    <div className="app"> {/* 主容器 */}
      <SideBar /> {/* 侧边栏 */}
      <div className="chat_app"> {/* 头部 */}
        <div className="left_sidebar"> {/* 左侧边栏 */}
            <div className="left_head">
              <div className="logo_text">
                <span>Chat <span className="colored">App</span></span>
              </div>
              <div className="room_add">
                <button 
                  id="room_add_icon_holder" 
                  className="room_add_icon_holder"
                  onClick={() => setIsModalOpen(true)}>
                  +
                </button>
              </div>
            </div>
  
            <div id="active_rooms_list" className="active_rooms_list">
              <ul>
                  {renderRoomEntries()}
              </ul>
            </div>

        </div>
        <div className="chat_area">
            <div className="chat_bg">
              <div className="chat_head">
                <div className="room_avatar"></div>
                <span className="room_name">
                  {roomData?.data.find((room: { roomId: number | null; }) => room.roomId === roomId)?.roomName || ""}
                </span>
              </div>
              <div id="chat" className="chat" ref={chatAreaRef}>
                {messageListData?.data.map((msg: { sender: string; time: string; content: string; }, index: React.Key | null | undefined) => (
                  <MessageItem 
                  key={index}
                  sender={msg.sender}
                  sendTime={msg.time}
                  content={msg.content}
                  isMe={msg.sender === userName}
                  messageAvatar={''}
                />
                ))}
              </div>
              <div className="chat_input">
                <textarea
                  ref={textareaRef} // 关联 textarea 引用
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                />
                <button className="send_message_btn" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
          <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={addNewRoom}
          />
          <DeleteModal 
            isOpen={isModalVisible} 
            onClose={cancelDelete} 
            onConfirm={() => handleDeleteRoom(roomIdToDelete!)} // 确保传递的是函数
          />
        </div>
    </div>
  );
}