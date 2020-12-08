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
    wx.getUserInfo({
      success: (data) => {
        this.setData({
          userInfo: data.userInfo
        })
      }
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

  },

  getTop10() {
    wx.navigateTo({
      url: '/pages/components/shout/shout'
    })
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
    wx.navigateTo({
      url: '/pages/components/grit/grit'
    })
  },

  showModal(e) {
    this.setData({
      text: ''
    })
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  }

})