import { create } from 'zustand';

interface RoleWorkshopState {
  loading: boolean;
  result: string | null;
  error: string | null;
  generateRole: (description: string) => Promise<void>;
  reset: () => void;
}

export const useRoleWorkshopStore = create<RoleWorkshopState>((set) => ({
  loading: false,
  result: null,
  error: null,

  generateRole: async (description: string) => {
    set({ loading: true, error: null, result: null });
    
    // 1. 校验环境变量
    const apiKey = import.meta.env.VITE_ROLE_WORKSHOP_API_KEY;
    const workflowId = import.meta.env.VITE_ROLE_WORKFLOW_ID;
    
    console.log('=== 环境变量验证 ===');
    console.log('Token:', apiKey ? (apiKey.startsWith('pat_') ? '有效格式' : '格式错误（非pat_开头）') : '未加载');
    console.log('工作流ID:', workflowId);
    console.log('描述:', description);

    if (!apiKey || !workflowId) {
      set({ 
        error: '缺少API密钥或工作流ID，请检查.env文件',
        loading: false 
      });
      return;
    }

    try {
      // 2. 调用非流式工作流接口（核心修改：url换成/run）
      const response = await fetch('https://api.coze.cn/v1/workflow/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`, // 仍用pat_xxx令牌
          'Content-Type': 'application/json',
          'Accept': 'application/json' // 明确要求JSON响应
        },
        body: JSON.stringify({
          workflow_id: workflowId, // 你的文生图工作流ID
          parameters: {
            input: description // 传给工作流的文字描述参数
          }
        })
      });

      // 3. 校验HTTP状态码
      console.log('响应状态码:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`接口请求失败 [${response.status}]：${errorText}`);
      }

      // 4. 直接解析JSON（非流式接口的核心优势）
      const data = await response.json();
      console.log('接口返回完整数据:', data);

      // 5. 处理业务结果
      if (data.code === 0) {
        // 检查不同的响应格式
        let imageUrl = null;
        
        // 格式1: data.data 是字符串，包含 output 字段
        if (typeof data.data === 'string') {
          console.log('data.data 是字符串:', data.data);
          
          // 尝试从字符串中提取URL
          // 方法1: 正则表达式匹配URL
          const urlMatch = data.data.match(/https:\/\/[^"\']+/);
          if (urlMatch) {
            imageUrl = urlMatch[0];
          }
          // 方法2: 尝试解析为JSON（如果格式正确）
          else if (data.data.startsWith('{') && data.data.endsWith('}')) {
            try {
              const parsedData = JSON.parse(data.data);
              imageUrl = parsedData.output;
            } catch (e) {
              // 解析失败，尝试其他方法
            }
          }
        }
        // 格式2: data.output
        else if (data.output) {
          imageUrl = data.output;
        }
        // 格式3: data.data.output
        else if (data.data && data.data.output) {
          imageUrl = data.data.output;
        }
        // 格式4: data.outputs.image_url 或 data.outputs.output
        else if (data.outputs) {
          imageUrl = data.outputs.image_url || data.outputs.output;
        }
        
        if (imageUrl) {
          console.log('提取到的图片URL:', imageUrl);
          set({ 
            result: imageUrl,
            loading: false 
          });
        } else {
          set({ 
            error: '生成失败：未找到图片URL',
            loading: false 
          });
        }
      } else {
        // 工作流执行失败（如文生图模型报错）
        set({ 
          error: data.msg || '生成失败：工作流执行出错',
          loading: false 
        });
      }

    } catch (error) {
      // 捕获所有异常（网络错误、JSON解析错误、业务错误）
      console.error('生成角色失败:', error);
      const errorMsg = error instanceof Error ? error.message : '网络错误，请检查网络或Token';
      set({ 
        error: errorMsg,
        loading: false 
      });
    }
  },

  reset: () => set({ result: null, error: null, loading: false })
}));