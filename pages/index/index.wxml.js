// pages/index/index.wxml.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: ''
  },

  // 判断是否授权
  verifyIdentity() {
    if(this.data.canLogin) {
      wx.getSetting({
        success: (data) => {
          if(data.authSetting['scope.userInfo']) {
            // 说明用户已经授权了，先把名字显示了
            this.getUserInfo();
            // 再等待一下页面渐变，进入主页
            const timeout = setTimeout(function() {
              wx.switchTab({
                url: '/pages/components/direction/direction'
              })
              clearTimeout(timeout);
            }, 1500);
          }
        }
      })
    } else {
      this.showText('登录失败，请关闭小程序从新登录')
    }
  },

  getUserInfo() {
    const date = new Date();

    wx.getUserInfo({
      success: (data) => {
        this.setData({
          userInfo: data.userInfo
        })
        // 保存用户信息（每个月1号可以进行获取）
        if(date.getDate() == 1) {
          this.saveUserInfo(data.userInfo)
        }
        
        const timeout = setTimeout(function() {
          wx.switchTab({
            url: '/pages/components/direction/direction'
          })
          clearTimeout(timeout);
        }, 1500);
      }
    })
  },

  saveUserInfo: function (userInfo) {
    let _that = this
    if(this.data.openId == '') {
      let openId = wx.getStorageSync('openId')
      _that.setData({
        openId: openId
      })
    }
    // 获取请求地址
    const url = app.globalData.requestUrl['default'].url;
    

    // 请求后端进行存储数据
    wx.request({
      url: url + 'saveWxUserInfo',
      data: {
        img: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        province: userInfo.province,
        country: userInfo.country,
        city: userInfo.city,
        gender: userInfo.gender,
        openId: _that.data.openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let _that = this;

    const timeout = setTimeout(function() {
      wx.switchTab({
        url: '/pages/components/direction/direction'
      })
      clearTimeout(timeout);
    }, 2000);

    // const timing = setTimeout(function() {
    //   wx.switchTab({
    //     url: '/pages/components/direction/direction'
    //   })
    // }, 1500);

    // let _that = this
    // // 获取请求地址
    // const url = app.globalData.requestUrl['default'].url;
    // // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html
    // // 检查登录状态是否过期
    // wx.checkSession({
    //   success: (res) => {
    //     _that.setData({
    //       canLogin: true
    //     })
    //     // 判断是否存在openId 如果不存在需要再去拿一次
    //     wx.getStorage({
    //       key: 'openId',
    //       success (res) {
    //         if(res.data == '') {
    //           _that.wxLogin(url)
    //         } else {
    //           _that.getUserInfo()
    //         }
    //       }
    //     });
    //   },
    //   fail: (res) => {
    //     // 如果失败就请求wx.login 从新登录
    //     _that.wxLogin(url)
    //   }
    // })
  },

  // 微信登录
  wxLogin: function (url) {
    let _that = this
    wx.login({
      success: (data) => {
        // 获取到code
        const code = data.code
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
    let _that = this
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
          _that.setData({
            canLogin: true,
            openId: data.data.openId
          })
          // 为了以后，顺便缓存一份
          wx.setStorage({
            key: "openId",
            data: data.data.openId
          })
          // 判断是否有权限，然后进入
          _that.verifyIdentity()
        } else {
          _that.showText('登录失败，请关闭小程序从新登录')
        }
      },
      fail: (data) => {
        _that.showText('亲，请检查一下网络哦~~~')
      }
    })
  },

  // 输出text
  showText: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 1500
    })
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

  }
})