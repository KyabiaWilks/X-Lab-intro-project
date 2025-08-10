import React, { ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode; // 接收子组件
}

interface State {
  hasError: boolean; // 用于标记是否发生错误
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false }; // 初始化状态
  }

  // 当子组件抛出错误时触发
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }; // 更新状态以触发备用 UI
  }

  // 可以用于记录错误信息
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 可以渲染备用 UI
      return <h1>发生了一个错误。请稍后再试。</h1>;
    }

    return this.props.children; // 正常渲染子组件
  }
}

export default ErrorBoundary;
