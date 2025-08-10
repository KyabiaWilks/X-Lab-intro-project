// Register.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 使用 Next.js 的 useRouter
import { trpc } from '../../util'; // 确保正确引入 trpc
import './Register.css';

const Register: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const router = useRouter(); // 初始化 useRouter
  const createUser = trpc.user.create.useMutation(); // 使用 TRPC mutation

  const handleSubmit = async () => {
    if (password1 === password2 && password1.length >= 6) {
      try {
        await createUser.mutateAsync({ name: userName, password: password1 });
        router.push(`/chatroom?userName=${encodeURIComponent(userName)}`);
      } catch (error: any) {
        if (error.message === "Username already exists") {
          alert("Username already exists. Please choose a different one.");
        } else {
          alert("Error creating user. Please try again.");
        }
        console.error("Error creating user:", error);
      }
    } else {
      alert("Passwords do not match or are too short");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <h2>Choose a username</h2>
      <input
        className='set-name-input'
        type="text"
        placeholder="Set your User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <h2>Choose a password</h2>
      <input
        className='set-name-input'
        type="password"
        placeholder="Set your Password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <h2>Confirm the password</h2>
      <input
        className='set-name-input'
        type="password"
        placeholder="Confirm your Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button 
        className='set-name-button'
        onClick={handleSubmit}>Submit
      </button>
    </div>
  );
};

export default Register;
