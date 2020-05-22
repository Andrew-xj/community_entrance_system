// pages/userinfo/info/info.js

const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    file: '',
    ImagePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (data) {
    var that = this;
    var fileID = data.fileID;   // 获取文件ID
    that.setData({
      fileID: fileID,
    })
    // 获取二维码图片并保存临时图片路径
    wx.cloud.getTempFileURL({
      fileList: [that.data.fileID],
      success: res => {
        var tempPath = res.fileList[0].tempFileURL
        wx.downloadFile({
          url: tempPath,
          success: res => {
            that.setData({
              ImagePath: res.tempFilePath
            })
          },
          fail: console.err
        })
      },
      fail: console.err
    })
  }
})