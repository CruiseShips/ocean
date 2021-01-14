// pages/components/direction/direction.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    problem: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  userInfoHandler(userInfo) {
    let openId = wx.getStorageSync('openId');
    let _that = this;
    if(openId == '' || openId == null) {
      const url = app.globalData.requestUrl['default'].url;

      if(userInfo.detail.userInfo == '' || userInfo.detail.userInfo == null || userInfo.detail.userInfo == undefined) {
        
      } else {
        let data = userInfo.detail.userInfo;

        wx.setStorageSync({
          key:"userInfo",
          data: data
        });

        // 拿到授权，获取openId
        wx.checkSession({
          success: (res) => {
            // 判断是否存在openId 如果不存在需要再去拿一次
            wx.getStorage({
              key: 'openId',
              success (res) {
                if(res.data == '') {
                  _that.wxLogin(url)
                }
              }
            });
          },
          fail: (res) => {
            _that.wxLogin(url)
          }
        })

        _that.saveUserInfo(data);
      }
    }
  },

  // 微信登录
  wxLogin: function (url) {
    let _that = this;

    wx.login({
      success: (data) => {
        // 获取到code
        const code = data.code;
        // 请求后端获取一下openId
        _that.getWxOpenId(url, code)
      },
      fail: (data) => {
        _that.showText('登录失败，请关闭小程序从新登录')
      }
    })
  },

  // 获取OpenId
  getWxOpenId: function(url, code) {
    let _that = this;

    wx.request({
      url: url + 'getOpenId',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        if(data.data.success) {
          // 为了以后，顺便缓存一份
          wx.setStorage({
            key: "openId",
            data: data.data.openId
          })
        } else {
          _that.showText('登录失败，请关闭小程序从新登录')
        }
      },
      fail: (data) => {
        _that.showText('亲，请检查一下网络哦~~~')
      }
    })
  },

  saveUserInfo: function (userInfo) {
    let openId = wx.getStorageSync('openId');

    // 请求后端进行存储数据
    const url = app.globalData.requestUrl['default'].url;
    wx.request({
      url: url + 'saveWxUserInfo',
      data: {
        img: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        province: userInfo.province,
        country: userInfo.country,
        city: userInfo.city,
        gender: userInfo.gender,
        openId: openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        return true;
      }
    });
  },
  
  // 输出text
  showText: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500
    })
  },

  bindFormSubmit(e) {
    const url = app.globalData.requestUrl['default'].url;

    let openId = wx.getStorageSync('openId');

    const problem = e.detail.value.problem;

    if(openId != '' && openId != null) {
      
      if(problem == '' || problem == "") {
        wx.showToast({
          title: '请输入您困惑的疑问吧',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      // 请求后端
      this.getGrit(problem, url)

      // 清空值
      this.setData({
        problem: ''
      })
    }
    
  },

  getGrit(problem, url) {
    let openId = wx.getStorageSync('openId')
    wx.request({
      url: url + 'addShout',
      data: {
        openId: openId,
        text: problem
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        let text = data.data.grit.text;
        wx.showToast({
          title: '提示: ' + text,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})