import jwt from "jsonwebtoken";// 签发token, 验证token 
const secret = "bld1235swsad!" // 安全 
export default [
  {
    // restful 一切皆资源
    url: '/api/auth/login',
    method: 'post',
    timeout: 2000, // 延迟时间
    response: (req, res) => {
      let { name, password } = req.body;
      name = name.trim();
      password = password.trim();
      console.log(name, password, "////");
      if (name === '' || password === "") {
        return {
          code: 400, // Bad Request
          message: "用户名或密码不能为空"
        }
      }
      if (name !== 'admin' || password !== "123456") {
        return {
          code: 401, // unauthorized
          message: "用户名或密码错误"
        }
      }

      const access_token = jwt.sign({
        sub: 1,
        name: "admin"
      }, secret, {
        expiresIn: '15m'
      })

      const refresh_token = jwt.sign({
        sub: 1,
        name: "admin",
        type: 'refresh'
      }, secret, {
        expiresIn: '7d'
      })

      return {
        access_token,
        refresh_token,
        user: {
          id: 1,
          name: "admin"
        }
      }
    }
  },
  {
    url: '/api/auth/check',
    method: 'get',
    response: (req, res) => {
      const token = req.headers['authorization'].split(" ")[1];
      // console.log(token);
      try {
        const decode = jwt.decode(token, secret);
        return {
          code: 200,
          user: {
            id: decode.sub,
            name: decode.name
          }
        }
      } catch(err) {
        return {
          code: 400,
          message: "invaild token"
        }
      }
    }
   }
]