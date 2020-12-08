// pages/components/grit/grit.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grits: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取请求地址
    const url = app.globalData.requestUrl['default'].url
    let openId = wx.getStorageSync('openId')
    let _that = this

    wx.request({
      url: url + 'getGrits',
      data: {
        openId: openId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      timeout: 2000,
      method: "POST",
      success: (data) => {
        _that.setData({
          grits: data.data.grits
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

  }
})