// pages/record/record.js

const db = wx.cloud.database();
const _ = db.command;
let sysdate = require('../../utils/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('ExitAndEnter').where({
      phone: _.neq('')
    }).get({
      success: (res) => {
        var records = that.rebuildData(res.data);
        that.setData({
          records: records
        })
      }
    })
  },

  /**
   * 数据重构函数--重新构建数据内容与格式
   */
  rebuildData: function (data) {
    var that = this;
    var new_data = [];
    for (var i = 0; i < data.length; i++) {
      var each = data[i];
      each = that.addWeek(each);      // 添加星期
      each = that.addAction(each);    // 添加行为
      each = that.deleteOther(each);  // 删除不必要的数据
      new_data.push(each);
    }
    // 将数据按照日期倒序排列
    new_data.sort((a, b) => {
      if (a.date != b.date) {
        return b.date > a.date ? 1 : -1;
      } else {
        return b.time > a.time ? 1 : -1;
      }
    })
    return new_data;
  },

  /**
   * 数据删除函数--删除不必要的数据信息
   */
  deleteOther: function (each) {
    delete each['address'];
    delete each['name'];
    delete each['phone'];
    delete each['identifier'];
    delete each['_openid'];
    return each;
  },

  /**
   * 行为添加函数--在记录中添加该条记录的出行状态
   */
  addAction: function (each) {
    if (each.Exit_or_Enter == 'Enter') {
      each['action'] = '出门且已返回';
    } else if (each.Exit_or_Enter == 'Exit') {
      each['action'] = '出门但仍未回';
    }
    return each;
  },

  /**
   * 星期添加函数--在数据内容中添加日期对应的信息
   */
  addWeek: function (each) {
    var date = each.date.replace('/', '-');
    date = date.replace('/', '-');
    var week = sysdate.getDates(1, date);
    each['week'] = week[0].week;
    return each;
  }
})