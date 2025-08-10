import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import ErrorBoundary from './pages/ChatRoom/ErrorBoundary'; // 导入 ErrorBoundary 组件
import './App.css';
import SetName from './pages//SetName/SetName';



export default function App() {
  const queryClient = new QueryClient(); // Create an instance of QueryClient

  return (
    <QueryClientProvider client={queryClient}> {/* Pass the instance of QueryClient */}
      <ErrorBoundary>
          <Routes>
            <Route path="/setname" element={<SetName />} />
            <Route path="/chatroom" element={<ChatRoom />} />
          </Routes>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}