// SetName.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 使用 Next.js 的 useRouter
import { trpc } from '../../util'; // 确保正确引入 trpc
import './SetName.css';

const SetName: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter(); // 初始化 useRouter
  const loginUser = trpc.user.login.useMutation(); // 使用 TRPC mutation

  const handleSubmit = async () => {
    if (userName.trim() && password.trim()) {
      try {
        await loginUser.mutateAsync({ name: userName, password });
        router.push(`/chatroom?userName=${encodeURIComponent(userName)}`);
      } catch (error) {
        console.error("Error logging in:", error);
        alert("Invalid username or password. Please try again.");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="set_name">
      <h1>Login</h1>
      <input
        className='set-name-input'
        type="text"
        placeholder="Set your User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className='set-name-input'
        type="password"
        placeholder="Set your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button 
        className='register-button'
        onClick={() => router.push('/register')}>Register
      </button>
      <button 
        className='set-name-button'
        onClick={handleSubmit}>Login
      </button>
      
    </div>
  );
};

export default SetName;
