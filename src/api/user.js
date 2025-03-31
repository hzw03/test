import request from '@/utils/request'

//注册接口
export const userRegisterService = ({
  userAccount,
  userPassword,
  checkPassword,
  userPhoneNumber,
  captcha
}) => {
  return request.post('/api/user/register', {
    userAccount,
    userPassword,
    checkPassword,
    userPhoneNumber,
    captcha
  })
}

// 确保userGetInfoService使用正确实例
// api/user.js

//登录接口
export const userLoginService = ({ userAccount, userPassword, captcha }) =>
  request.post('/api/user/login', { userAccount, userPassword, captcha })

//获取用户基本信息
// 获取用户信息的接口
export const userGetInfoService = async () => {
  return request.get('/api/user/get/login')
}

export const userGxyhxx = async (data) => {
  try {
    const response = await request.post('/api/user/update/my', data)
    return response // 返回响应数据，调用者可以根据需要进一步处理
  } catch (error) {
    console.error('更新用户信息失败:', error)
    throw error // 抛出错误，让调用者能够捕获和处理
  }
}
// userAccount（用户名）
// userPassword（密码）
// checkPassword（确认密码）
// userPhoneNumber（电话号码）
// captcha（验证码）
