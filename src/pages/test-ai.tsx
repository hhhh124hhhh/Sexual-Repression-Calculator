import React from 'react';
import { AIAssistant } from '@/components/common';

export default function TestAIPage() {
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
      <h1 className="text-3xl font-bold mb-6">AI助手测试页面</h1>
      <p className="mb-4">在这个页面上，您应该能看到右下角的AI助手按钮。</p>
      <p>如果看不到，请检查浏览器控制台是否有错误信息。</p>
      
      {/* AI助手组件 - 始终显示 */}
      <AIAssistant results={testResults} />
    </div>
  );
}