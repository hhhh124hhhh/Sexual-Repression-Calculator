import React, { useState } from 'react';
import { 
  CopilotKit, 
  useCopilotAction, 
  useCopilotReadable
} from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Sparkles, 
  Brain, 
  Lightbulb,
  X
} from 'lucide-react';
import { AssessmentResults } from '@/types';

interface AIPopupProps {
  results?: AssessmentResults;
  isOpen: boolean;
  onClose: () => void;
}

const AIPopup: React.FC<AIPopupProps> = ({ results, isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // 调试信息
  console.log('AIPopup rendering with isOpen:', isOpen);
  console.log('AIPopup rendering with results:', results);

  if (!isOpen) return null;

  // 如果没有结果数据，显示默认内容
  if (!results) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-96 h-[500px] flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-psychology-primary" />
              <h3 className="font-semibold">AI 心理助手</h3>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden p-4">
            <p>欢迎使用AI心理助手！完成评估后，我可以为您提供个性化的建议和解释。</p>
          </div>
        </Card>
      </div>
    );
  }

  // 向AI助手提供评估结果信息
  useCopilotReadable({
    description: "用户的性压抑指数评估结果",
    value: results
  });

  // 定义AI助手可以执行的操作
  useCopilotAction({
    name: "explain_sri_score",
    description: "解释用户的SRI分数含义",
    parameters: [],
    handler: () => {
      // 这个操作将触发AI助手解释SRI分数
    }
  });

  useCopilotAction({
    name: "provide_recommendations",
    description: "基于评估结果提供个性化建议",
    parameters: [],
    handler: () => {
      // 这个操作将触发AI助手提供个性化建议
    }
  });

  useCopilotAction({
    name: "analyze_dimension_scores",
    description: "分析四维度分数的含义",
    parameters: [],
    handler: () => {
      // 这个操作将触发AI助手分析四维度分数
    }
  });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <button 
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 p-0 shadow-lg bg-psychology-primary text-white"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      ) : (
        <Card className="w-96 h-[500px] flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-psychology-primary" />
              <h3 className="font-semibold">AI 心理助手</h3>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <CopilotPopup
              instructions={`你是一个专业的性心理健康助手。用户刚刚完成了性压抑指数(SRI)评估，得分为${results.sri.totalScore}分。
              请基于以下评估结果提供专业、温和且有帮助的解释和建议：
              
              SRI总分: ${results.sri.totalScore}
              等级: ${results.sri.level}
              四维度分数:
              - SOS反向: ${results.sri.dimensionScores.sosReversed.toFixed(2)}
              - 性内疚: ${results.sri.dimensionScores.sexGuilt.toFixed(2)}
              - 性羞耻: ${results.sri.dimensionScores.sexualShame.toFixed(2)}
              - SIS相对SES优势: ${results.sri.dimensionScores.sisOverSes.toFixed(2)}
              
              请以温和、非评判性的语言与用户交流，提供科学、实用的建议。`}
              defaultOpen={true}
              className="h-full"
            />
          </div>
          
          <div className="p-3 border-t bg-muted/50">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Brain className="w-3 h-3 mr-1" />
                SRI: {results.sri.totalScore}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                {results.sri.level}
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

interface AIAssistantProps {
  results: AssessmentResults;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ results }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 调试信息
  console.log('AIAssistant rendering with results:', results);

  return (
    <div>
      {/* 简化的AI助手按钮，确保始终显示 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-105 transition-transform bg-psychology-primary text-white flex flex-col items-center justify-center"
          style={{ backgroundColor: '#8A2BE2', color: 'white' }}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-xs mt-0.5">AI</span>
        </button>
      </div>
      
      {isOpen && (
        <AIPopup 
          results={results} 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};