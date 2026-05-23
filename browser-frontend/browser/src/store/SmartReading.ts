import { create } from 'zustand';

interface SmartReadingState {
  loading: boolean;
  result: string | null;
  error: string | null;
  analyzeImage: (image: File, question: string) => Promise<void>;
  reset: () => void;
}

export const useSmartReadingStore = create<SmartReadingState>((set) => ({
  loading: false,
  result: null,
  error: null,

  analyzeImage: async (image: File, question: string) => {
    set({ loading: true, error: null });
    try {
      const apiKey = import.meta.env.VITE_SMART_READING_API_KEY;
      const workflowId = import.meta.env.VITE_SMART_READING_WORKFLOW_ID;

      console.log('API Key:', apiKey ? '已加载' : '未加载');
      console.log('Workflow ID:', workflowId);
      console.log('Image:', image);
      console.log('Question:', question);

      if (!apiKey || !workflowId) {
        set({ 
          error: '缺少API密钥或工作流ID，请检查.env文件',
          loading: false 
        });
        return;
      }

      let fileId = null;
      try {
        // 1. 上传文件到Coze获取文件ID
        console.log('开始上传文件...');
        
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadResponse = await fetch('https://api.coze.cn/v1/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
            // 注意：上传文件时不需要设置Content-Type，浏览器会自动设置
          },
          body: formData
        });

        console.log('上传文件响应状态:', uploadResponse.status);
        const uploadData = await uploadResponse.json();
        console.log('上传文件响应:', uploadData);

        if (uploadData.code === 0 && uploadData.data && uploadData.data.id) {
          fileId = uploadData.data.id;
          console.log('获取到文件ID:', fileId);
        } else {
          throw new Error(`文件上传失败: ${uploadData.msg || '未知错误'}`);
        }
      } catch (uploadError) {
        console.error('文件上传失败:', uploadError);
        set({ 
          error: `文件上传失败: ${uploadError instanceof Error ? uploadError.message : '未知错误'}`,
          loading: false 
        });
        return;
      }

      // 2. 使用文件ID调用工作流
      console.log('开始调用工作流...');
      const workflowResponse = await fetch('https://api.coze.cn/v1/workflow/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: workflowId,
          parameters: {
            input: JSON.stringify({ file_id: fileId }),
            promble: question
          }
        })
      });

      console.log('工作流响应状态:', workflowResponse.status);

      if (!workflowResponse.ok) {
        const errorText = await workflowResponse.text();
        throw new Error(`工作流请求失败 [${workflowResponse.status}]：${errorText}`);
      }

      const workflowData = await workflowResponse.json();
      console.log('工作流响应:', workflowData);
      
      // 处理工作流响应
      if (workflowData.code === 0) {
        // 检查不同的响应格式
        let answer = null;
        
        // 格式1: workflowData.data 是字符串
        if (typeof workflowData.data === 'string') {
          try {
            const parsedData = JSON.parse(workflowData.data);
            console.log('解析后的data:', parsedData);
            // 检查不同的嵌套格式
            if (parsedData.data) {
              answer = parsedData.data;
            } else if (parsedData.answer) {
              answer = parsedData.answer;
            } else if (parsedData.output) {
              answer = parsedData.output;
            } else {
              answer = workflowData.data;
            }
          } catch (e) {
            console.error('解析data字符串失败:', e);
            answer = workflowData.data;
          }
        }
        // 格式2: workflowData.output
        else if (workflowData.output) {
          answer = workflowData.output;
        }
        // 格式3: workflowData.data.output
        else if (workflowData.data && workflowData.data.output) {
          answer = workflowData.data.output;
        }
        // 格式4: workflowData.outputs.answer 或 workflowData.outputs.output
        else if (workflowData.outputs) {
          answer = workflowData.outputs.answer || workflowData.outputs.output;
        }
        // 格式5: workflowData.data 是对象，直接取data字段
        else if (workflowData.data && typeof workflowData.data === 'object') {
          answer = workflowData.data.data || workflowData.data.answer || workflowData.data.output;
        }
        
        console.log('提取到的回答:', answer);
        
        if (answer) {
          set({ 
            result: answer,
            loading: false 
          });
        } else {
          set({ 
            error: '分析失败：未找到回答',
            loading: false 
          });
        }
      } else {
        set({ 
          error: workflowData.msg || '分析失败，请重试',
          loading: false 
        });
      }
    } catch (error) {
      console.error('智能阅读失败:', error);
      set({ 
        error: error instanceof Error ? error.message : '网络错误，请重试',
        loading: false 
      });
    }
  },

  reset: () => set({ result: null, error: null })
}));