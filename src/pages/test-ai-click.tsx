import React from 'react';
import { AIAssistant } from '@/components/common';
import { CopilotKit } from '@copilotkit/react-core';

export default function TestAIClickPage() {
  // 创建一个简单的测试结果对象
  const testResults = {
    sessionId: 'test-session',
    sri: {
      totalScore: 75,
      zScore: 0.67,
      percentile: 75,
      level: 'high' as const,
      dimensionScores: {
        sosReversed: 1.2,
        sexGuilt: 0.8,
        sexualShame: 1.5,
        sisOverSes: 0.9
      },
      scaleScores: []
    },
    interpretation: ['测试解释'],
    recommendations: ['测试建议'],
    calculatedAt: new Date()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-psychology-calm via-white to-psychology-warm p-8">
      <h1 className="text-3xl font-bold mb-6">AI助手点击测试页面</h1>
      <p className="mb-4">在这个页面上，您应该能看到右下角的AI助手按钮。</p>
      <p className="mb-4">点击按钮应该能打开AI助手弹窗。</p>
      
      {/* AI助手组件 - 始终显示 */}
      <CopilotKit runtimeUrl="/api/copilotkit">
        <AIAssistant results={testResults} />
      </CopilotKit>
      
      <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">测试说明:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>点击右下角的紫色AI按钮</li>
          <li>应该会弹出一个对话框</li>
          <li>如果弹窗没有出现，请检查浏览器控制台是否有错误信息</li>
        </ul>
      </div>
    </div>
  );
}