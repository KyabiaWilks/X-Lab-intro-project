"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '../../util'; // 确保正确引入 trpc
import { getErrorMessage } from '../../util'; // 确保正确引入错误处理函数
import './UserList.css';

const UserList: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true); // 开始加载状态
    try {
      const result = await trpc.user.list.useQuery();
      setUsers(result.data || []); // 提取数据并设置状态
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false); // 完成加载状态
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await trpc.user.create.useMutation().mutateAsync({
        name: newUserName,
        password: newUserPassword,
      });
      fetchUsers();
      setNewUserName('');
      setNewUserPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUpdateUser = async () => {
    if (editUserId === null) return;

    try {
      await trpc.user.update.useMutation().mutateAsync({
        id: editUserId,
        name: editUserName,
        password: editUserPassword,
      });
      fetchUsers();
      setEditUserId(null);
      setEditUserName('');
      setEditUserPassword('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await trpc.user.delete.useMutation().mutateAsync(id);
      fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (user: any) => {
    setEditUserId(user.id);
    setEditUserName(user.name);
    setEditUserPassword(''); // 清除密码字段
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Management</h1>
      <div>
        <h2>Create New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
        />
        <button onClick={handleCreateUser}>Create User</button>
      </div>

      <div>
        <h2>Edit User</h2>
        {editUserId && (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password (Leave blank to keep current)"
              value={editUserPassword}
              onChange={(e) => setEditUserPassword(e.target.value)}
            />
            <button onClick={handleUpdateUser}>Update User</button>
            <button onClick={() => setEditUserId(null)}>Cancel</button>
          </div>
        )}
      </div>

      <h2>User List</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
