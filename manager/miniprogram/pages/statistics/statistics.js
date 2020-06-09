var wxCharts = require("../../util/wxcharts-min.js");
var util=require('../../util/util.js')
//定义记录初始屏幕宽度比例，便于初始化
var cpreviousdate=new Array(7);
var previousdate = new Array(7);
var windowW = 0;
var db = wx.cloud.database();
var _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpreviousdate:[],
    count:1,
    number:[],
    cur_number:0
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
    var curdate = new Date()
    for (var i=0;i<7;i++){
      cpreviousdate[i]=new Date(curdate.getTime()+24*60*60*1000*(i-7))
      cpreviousdate[i]=util.formatTime(cpreviousdate[i])
      previousdate[i]=cpreviousdate[i].slice(5)
    }
    this.setData({
      cpreviousdate:cpreviousdate
    })
    var that = this
    var cur_date = util.formatTime(curdate)
    const db = wx.cloud.database()
    db.collection('date').where({
      date: cur_date
    })
      .get()
      .then(res => {
        if (res.data.length == 0) {
        }
        else{
          console.log(res)
          that.setData({
            cur_number: res.data[0].count
          })
        }
      })
    console.log(cpreviousdate)
  },
  getnum:function(dates){
    
    var that=this
    var number = []
    var num_nd=null
    const db=wx.cloud.database()
    db.collection('date').where({
      date:_.in(dates)
    })
    .get()
    .then(res=>{
		var data=res.data;
		for (var i=0; i<dates.length; i++){
			for (var j=0; j<data.length; j++){
				if(data[j].date == dates[i]){
					number.push(data[j].count)
				}
			}
		}
		console.log(number)
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'line',
      animation: true,
      categories: previousdate,
      series: [{
        name: '人数',
        //data: this.get_prenum(),
        data: number,
      },],
      yAxis: {
        format: function (val) {
          return val;
        },
        title: '出入人数统计',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      // extra: {
      //   column: {
      //     width: 15
      //   }
      // },
      width: (360 * windowW),
      height: (300 * windowW),
    });
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getnum(this.data.cpreviousdate)
  },
})