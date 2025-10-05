import OpenAI from 'openai';
import { AssessmentResults } from '@/types';

// 初始化OpenAI客户端（如果提供了API密钥）
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * 生成AI助手的系统提示
 * @param results 评估结果
 * @returns 系统提示字符串
 */
function generateSystemPrompt(results: AssessmentResults): string {
  return `你是一个专业的性心理健康助手，专门为完成了性压抑指数(SRI)评估的用户提供建议和解释。

用户评估结果：
SRI总分: ${results.sri.totalScore}
等级: ${results.sri.level}
四维度分数:
- SOS反向: ${results.sri.dimensionScores.sosReversed.toFixed(2)}
- 性内疚: ${results.sri.dimensionScores.sexGuilt.toFixed(2)}
- 性羞耻: ${results.sri.dimensionScores.sexualShame.toFixed(2)}
- SIS相对SES优势: ${results.sri.dimensionScores.sisOverSes.toFixed(2)}

请基于这些结果提供专业、温和且有帮助的解释和建议。你的回答应该：
1. 使用温和、非评判性的语言
2. 提供科学、实用的建议
3. 避免提供医疗诊断
4. 鼓励用户在需要时寻求专业帮助
5. 保持专业但友好的语调`;
}

/**
 * 生成AI助手的用户提示
 * @param query 用户问题
 * @param results 评估结果
 * @returns 用户提示字符串
 */
function generateUserPrompt(query: string, results: AssessmentResults): string {
  return `用户问题: ${query}

请基于我的评估结果提供相关回答。如果问题与评估结果无关，请礼貌地将话题引导回性心理健康主题。`;
}

/**
 * 使用OpenAI API生成响应
 * @param query 用户问题
 * @param results 评估结果
 * @returns AI生成的响应
 */
async function generateAIResponse(query: string, results: AssessmentResults): Promise<string> {
  if (!openai) {
    // 如果没有配置OpenAI API密钥，返回模拟响应
    return generateMockResponse(query, results);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: generateSystemPrompt(results) },
        { role: "user", content: generateUserPrompt(query, results) }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || "抱歉，我无法生成响应。";
  } catch (error) {
    console.error("Error generating AI response:", error);
    // 如果API调用失败，返回模拟响应
    return generateMockResponse(query, results);
  }
}

/**
 * 生成模拟响应（当没有API密钥或API调用失败时使用）
 * @param query 用户问题
 * @param results 评估结果
 * @returns 模拟响应字符串
 */
function generateMockResponse(query: string, results: AssessmentResults): string {
  // 基于查询内容和评估结果生成相关响应
  if (query.includes("分数") || query.includes("SRI")) {
    return `您的性压抑指数(SRI)为${results.sri.totalScore}分，处于"${results.sri.level}"水平。这个分数是通过标准化四个维度计算得出的：性观感反向、性内疚、性羞耻以及抑制优势。分数越高表示在性相关方面的心理压抑程度越重。`;
  }
  
  if (query.includes("建议") || query.includes("改善")) {
    const suggestions = [];
    
    if (results.sri.level === "high" || results.sri.level === "very-high") {
      suggestions.push("考虑与专业的性治疗师或心理咨询师交流");
    }
    
    if (results.sri.dimensionScores.sexGuilt > 1) {
      suggestions.push("探索性内疚感的来源，可能与文化背景或家庭教育相关");
    }
    
    if (results.sri.dimensionScores.sexualShame > 1) {
      suggestions.push("练习自我接纳和身体正念");
    }
    
    if (results.sri.dimensionScores.sisOverSes > 1) {
      suggestions.push("学习放松技巧和正念练习，减少性焦虑");
    }
    
    suggestions.push("与信任的伴侣或朋友开放地讨论性话题");
    
    return `基于您的评估结果，我建议您可以：\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
  }
  
  if (query.includes("维度") || query.includes("分析")) {
    return `您的四维度分析结果：\n` +
      `- 性观感反向(SOS): ${results.sri.dimensionScores.sosReversed.toFixed(2)} - 反映您对性刺激的回避倾向\n` +
      `- 性内疚: ${results.sri.dimensionScores.sexGuilt.toFixed(2)} - 衡量您在性相关方面的内疚感程度\n` +
      `- 性羞耻: ${results.sri.dimensionScores.sexualShame.toFixed(2)} - 评估您在性方面的羞耻体验\n` +
      `- 抑制优势: ${results.sri.dimensionScores.sisOverSes.toFixed(2)} - 显示您的性抑制相对于性兴奋的优势程度`;
  }
  
  // 默认响应
  return "我是您的AI心理助手。我可以帮助您解释评估结果、提供个性化建议以及分析各个维度的含义。请问您想了解什么？";
}

/**
 * 主要的AI助手函数
 * @param query 用户问题
 * @param results 评估结果
 * @returns AI生成的响应
 */
export async function getAIAssistantResponse(query: string, results: AssessmentResults): Promise<string> {
  return generateAIResponse(query, results);
}