// 模拟聊天机器人 响应

// 流式输出本质上是边算（llm token 生成）边返回结果，而不是等所有结果都算好再返回
// AI 场景中，模型生成文本是逐个token 生成的（模型每次基于已经生成的token 序列，
// 通过自回归的方式预测下一个最可能的token）
// streaming:true
// http chunked 数据块来传，res.end() 不用这个
// res.write(chunk) 写入数据块
// res.end() 结束响应 
// SSE 服务器发送事件（Server-Sent Events） text/event-stream

import { config } from 'dotenv';

config();
console.log(process.env.VITE_DEEPSEEK_API_KEY);
export default [
    {
        url: '/api/ai/chat',
        method: 'post',
        // rawResponse 用于自定义原始HTTP 响应（如流式输出）
        rawResponse: async (req, res) => {
            // node 后端 原生的去拿到请求体
            // console.log('//////////////////////////////');
            // chunk 数据块 （buffer）
            // tcp/ip tcp 可靠的传输协议
            // 按顺序组装 失败了还要通知重传 html
            // on data 事件被触发 每次收到数据块 就会触发
            let body = '';
            req.on('data', (chunk) => {
                // chunk 二进制流 也就是一个buffer
                // chunk 拼接 成字符串
                body += chunk;

            })
            req.on('end', async () => {
                // 都到位了
                // console.log(body);
                try {
                    const { messages } = JSON.parse(body);
                    // console.log(messages);   
                    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
                    // 响应头先告诉浏览器 流式，数据会分块传输
                    res.setHeader('Transfer-Encoding', 'chunked');
                    // vercel ai sdk 特制头
                    res.setHeader('x-vercel-ai-data-stream', 'v1');
                    const response = await fetch('https://api.deepseek.com/chat/completions', {
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`,

                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: 'deepseek-chat',
                            messages,
                            stream: true // 开启流式输出
                        })
                    })
                    if (!response.body) {
                        throw new Error('No response body');
                    }
                    // SSE 流式输出 二进制流 对象 跟接根管子一样
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder(); // 用于将二进制流解码为字符串
                    while (true) {
                        // 解构出 done 是指是否读取到了流的末尾 一个标记
                        // value 是指读取到的数据块 （buffer）
                        const { done, value } = await reader.read();
                        // console.log(done,value,'===================');
                        if (done) {
                            break;
                        }
                        const chunk = decoder.decode(value);
                        console.log(chunk, '------------------');
                        const lines = chunk.split('\n');
                        for(let line of lines) {
                            if(line.startsWith('data:') && line !== 'data: [DONE]') {
                                try {
                                    const data = JSON.parse(line.slice(6));
                                    const content = data.choices[0]?.delta?.content || '';
                                    if(content) {
                                        res.write(`0: ${JSON.stringify( content )}\n`);
                                    }
                                } catch (err) {

                                }
                            }
                        }
                    }
                    res.end();
                } catch (err) {
                    console.log(err);
                }
            })
        }
    }
]