import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

/**
 * 生成模拟响应（当没有API密钥或API调用失败时使用）
 * @param query 用户问题
 * @returns 模拟响应字符串
 */
function generateMockResponse(query: string): string {
  // 基于查询内容生成相关响应
  if (query.includes("分数") || query.includes("SRI")) {
    return "您的性压抑指数(SRI)是一个0-100的分数，用于衡量您在性相关方面的心理压抑程度。分数越高表示压抑程度越重。这个指数基于四个维度的综合计算：性观感反向、性内疚、性羞耻以及抑制优势。";
  }
  
  if (query.includes("建议") || query.includes("改善")) {
    return "基于一般的评估结果，我建议您可以：\n1. 与信任的伴侣或朋友开放地讨论性话题\n2. 尝试阅读一些关于性健康和性心理的科学读物\n3. 练习自我接纳和身体正念\n4. 如有需要，考虑寻求专业心理咨询师的帮助";
  }
  
  if (query.includes("维度") || query.includes("分析")) {
    return "四维度分析：\n- 性观感反向(SOS)：反映您对性刺激的回避倾向\n- 性内疚：衡量您在性相关方面的内疚感程度\n- 性羞耻：评估您在性方面的羞耻体验\n- 抑制优势：显示您的性抑制相对于性兴奋的优势程度";
  }
  
  // 默认响应
  return "我是您的AI心理助手。我可以帮助您解释评估结果、提供个性化建议以及分析各个维度的含义。请问您想了解什么？";
}

// 定义请求体的验证模式
const copilotRequestSchema = z.object({
  messages: z.array(z.any()),
  sessionId: z.string().optional(),
});

export const setupCopilotRoutes = (app: Hono) => {
  const copilotRoutes = new Hono();

  // 处理CopilotKit的聊天请求
  copilotRoutes.post(
    "/chat",
    zValidator("json", copilotRequestSchema),
    async (c) => {
      const { messages, sessionId } = c.req.valid("json");
      
      // 在服务器端实现AI助手逻辑
      // 获取最后一条用户消息作为查询
      const lastMessage = messages[messages.length - 1];
      const query = lastMessage?.content || "你好";
      
      // 生成模拟响应
      const content = generateMockResponse(query);
      
      const response = {
        id: "response-" + Date.now(),
        choices: [
          {
            message: {
              role: "assistant",
              content
            }
          }
        ]
      };
      
      return c.json(response);
    }
  );

  // 处理CopilotKit的动作请求
  copilotRoutes.post(
    "/action",
    zValidator("json", z.object({
      action: z.string(),
      parameters: z.any(),
      sessionId: z.string().optional(),
    })),
    async (c) => {
      const { action, parameters, sessionId } = c.req.valid("json");
      
      // 根据不同的动作生成响应
      let query = "";
      
      switch (action) {
        case "explain_sri_score":
          query = "请解释我的SRI分数含义";
          break;
        case "provide_recommendations":
          query = "基于我的评估结果，请提供个性化建议";
          break;
        case "analyze_dimension_scores":
          query = "请分析我的四维度分数";
          break;
        default:
          query = "请提供帮助";
      }
      
      // 生成模拟响应
      const content = generateMockResponse(query);
      
      const response = {
        id: "action-response-" + Date.now(),
        choices: [
          {
            message: {
              role: "assistant",
              content
            }
          }
        ]
      };
      
      return c.json(response);
    }
  );

  app.route("/api/copilotkit", copilotRoutes);
};