import React, { useState } from 'react';

export const DebugAIButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {/* 调试信息 */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        zIndex: 10000, 
        backgroundColor: 'yellow', 
        color: 'black', 
        padding: '10px',
        borderRadius: '5px'
      }}>
        <p>调试信息: AI按钮应该在右下角</p>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? '隐藏' : '显示'}按钮
        </button>
      </div>
      
      {/* 简单的AI助手按钮 */}
      {isVisible && (
        <button 
          onClick={() => alert('AI助手功能正在开发中！')}
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            backgroundColor: '#8A2BE2', 
            color: 'white', 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            fontSize: '12px'
          }}
        >
          <div>✨</div>
          <span>AI</span>
        </button>
      )}
    </div>
  );
};