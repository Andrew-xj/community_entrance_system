var wxCharts = require("../../util/wxcharts-min.js");

//定义记录初始屏幕宽度比例，便于初始化
var previousdate = new Array(7);

var windowW = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  adddays:function(dateStr,dayCount){
    var strdate = dateStr;
    var isdate = new Date(strdate.replace(/-/g, "/"));
    isdate = new Date((isdate / 1000 + (86400 * dayCount)) * 1000);  
    var pdate = isdate.getFullYear() + "/" + (isdate.getMonth() + 1) + "/" + (isdate.getDate());
    return pdate;
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

    //var date1 = Date.parse('2020/05/14');
    // var currenttimestamp = new Date().getTime();
    // var idays;
    // idays=Math.floor((currenttimestamp-date1)/(24*3600*1000));
    // console.log(idays);
    var mydate=new Date().toLocaleDateString();
    console.log(mydate)
    mydate='2020/3/2';
    //console.log(mydate.replace(/-/g,"/"));
    //var isdate=Date.parse(mydate);
    //console.log(isdate);


    for (var i=0;i<7;i++){
      previousdate[i]=this.adddays(mydate,i-7);
      previousdate[i]=previousdate[i].slice(5);
    }
    console.log(previousdate);
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
      categories: previousdate,
      series: [{
        name: '人数',
        data: [65,54,86,71,56,93,20],
        
      }, ],
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
      // extra: {
      //   column: {
      //     width: 15
      //   }
      // },
      width: (375 * windowW),
      height: (400 * windowW),
    });


  },
})