var wxCharts = require("../../util/wxcharts-min.js");

//定义记录初始屏幕宽度比例，便于初始化


var windowW = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    // 屏幕宽度
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth
    });
    console.log(this.data.imageWidth);

    //计算屏幕宽度比列
    windowW = this.data.imageWidth / 375;
    console.log(windowW);

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


    // columnCanvas
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'line',
      animation: true,
      categories: [1,2,3,4,5,6,7],
      series: [{
        name: '人数',
        data: [65,54,86,71,56,93,20],
        
      }, ],
      title:{
        name:'出入人数统计',
      },
      yAxis: {
        format: function (val) {
          return val ;
        },
        title: '出入人数统计',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: (375 * windowW),
      height: (400 * windowW),
    });


  },
})