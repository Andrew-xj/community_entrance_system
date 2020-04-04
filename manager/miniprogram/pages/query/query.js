Page({
  /**
   * 初始化数据
   */
  data: {
    build: '',
    room: '',
    unit: '',
  },


  searchbuilding: function (e) {
    this.data.build = e.detail.value;

  },

  
  room: function (e) {
    this.data.room = e.detail.value;
  },

  unit: function (e) {
    this.data.unit = e.detail.value;
  },
  /**
   * 监听登录按钮
   */
  chaxun: function () {
    //打印收入账号和密码
    console.log('楼号: ', this.data.build);
    console.log('单元', this.data.unit);
    console.log('室: ', this.data.room);
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})