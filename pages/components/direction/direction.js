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

  bindFormSubmit: function (text) {
    const shout = text.detail.value.problem
    
    if(shout == '' && shout.trim() == '') {
      wx.showToast({
        title: '请输入您困惑的疑问吧',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // 获取请求地址
    const url = app.globalData.requestUrl['default'].url;

    // 到时候需要存储到数据库
    const problem = text.detail.value.problem
    // 请求后端
    this.getGrit(problem, url)

    // 清空值
    this.setData({
      problem: ''
    })
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