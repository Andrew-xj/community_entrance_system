// pages/statistics/departure/departure.js
var util = require('../../../util/util.js')
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
  * 页面的初始数据
  */
  data: {
    records: []
  },

  get_records: function () {
    var today = new Date()
    var that=this
    var records = []
    var curdate = util.formatTime(today)
    db.collection('records').where({
      date: curdate
    })
      .get()
      .then(res => {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < res.data.length - 1 - i; j++) {
            if (Date.parse(res.data[j].time) > Date.parse(res.data[j + 1].time)) {
              var temp = res.data[j]
              res.data[j] = res.data[j + 1]
              res.data[j + 1] = temp
            }
          }
        }
        for (var i = 0; i < res.data.length; i++) {
          records.push(res.data[i].name + " " + res.data[i].time)
        }
        that.setData({
          records: records
        })
      })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    this.get_records()
    console.log(this.data.records)
  }
})