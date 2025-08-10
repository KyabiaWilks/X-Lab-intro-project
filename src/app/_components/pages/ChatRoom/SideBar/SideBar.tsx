import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 导入 useRouter
import { trpc } from '../../../util';
import './SideBar.css';

const SideBar: React.FC = () => {
  const router = useRouter(); // 获取 router 实例
  const logoutMutation = trpc.user.logout.useMutation(); // 使用 tRPC 的 logout API

  // 处理注销逻辑
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync(); // 调用 logout API
      router.push('/setname'); // 注销成功后重定向到 setname 页面
    } catch (error) {
      console.error('Failed to logout:', error); // 错误处理
    }
  };

  // 处理点击事件，调用 API 删除 cookie 并跳转
  const handleClick = async (href: string) => {
    if (href === '/setname') {
      await handleLogout();
    } else {
      router.push(href); // 处理其他页面的跳转
    }
  };

  return (
    <div className="sidebar">
      <h2> </h2>
      <ul>
        <li>
          <Link href="/setname" onClick={(e) => { e.preventDefault(); handleClick('/setname'); }}>
            <span>Set</span>
            <span>Name</span>
          </Link>
        </li>
        <li>
          <Link href="/chatroom" onClick={(e) => { e.preventDefault(); handleClick('/chatroom'); }}>
            <span>Chat</span>
            <span>Room</span>
          </Link>
        </li>
        {/* <li>
          <Link href="/userlist" onClick={(e) => { e.preventDefault(); handleClick('/userlist'); }}>
            <span>User</span>
            <span>List</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default SideBar;
