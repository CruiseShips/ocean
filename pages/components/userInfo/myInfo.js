// pages/components/userInfo/myInfo.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    text: '',
    modalName: ''
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
    let _that = this;
    wx.getUserInfo({
      success: function(res) {
        _that.setData({
          userInfo: res.userInfo
        })
      }
    })
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
    const url = app.globalData.requestUrl['default'].url;
    let _that = this;

    if(userInfo.detail.userInfo == '' || userInfo.detail.userInfo == null || userInfo.detail.userInfo == undefined) {
      
    } else {
      let data = userInfo.detail.userInfo;
      _that.setData({
        userInfo: data
      })

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

  // 检测是否登录
  checkLogin() {
    let openId = wx.getStorageSync('openId')
    if(openId == null || openId == '') {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      });
      return null;
    }
    return openId;
  },

  getTop10() {
    const openId = this.checkLogin();
    if(openId) {
      wx.navigateTo({
        url: '/pages/components/shout/shout'
      });
    }
  },
   
  //确认
  confirm: function () {

    if(this.data.text == '') {
      wx.showToast({
        title: '请输入要提交的内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(this.data.text.length > 20) {
      wx.showToast({
        title: '提交内容太长，请简写',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    const url = app.globalData.requestUrl['default'].url
    let openId = wx.getStorageSync('openId')
    let _that = this

    // 返回后端
    wx.request({
      url: url + 'addGrit',
      data: {
        text: _that.data.text,
        openId: openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        if(!data.data.success) {
          // 告诉他错误
          wx.showToast({
            title: '添加失败，可能重复',
            icon: 'none',
            duration: 2000
          })
        } else {
          _that.hideModal()
          _that.setData({
            text: ''
          })
          wx.showToast({
            title: '添加成功，请等待审核',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    this.setData({
      modalName: null
    })
  },

  formText(e) {
    this.setData({
      text: e.detail.value
    })
  },

  getMyGit() {

    const openId = this.checkLogin();
    if(openId) {
      wx.navigateTo({
        url: '/pages/components/grit/grit'
      })
    }
  },

  showModal(e) {
    const openId = this.checkLogin();

    if(openId) {
      this.setData({
        text: ''
      })
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
    
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  }

})