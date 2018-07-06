
define(['jquery' , 'layer' ], function ($ , layer ) {

  $('body').delegate('.nav .favorite_button' , 'click' , function () {
    addFavorite();
  });
  function addFavorite() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
      alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }
    else if (ua.indexOf("msie 8") > -1) {
      window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
      try{
        window.external.addFavorite(url, title);
      }catch(e){
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
      }
    }
    else if (window.sidebar) {
      window.sidebar.addPanel(title, url, "");
    }
    else {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
  };
  var wrap=$('.notice_list');
  var interval=3000;
  var moving;//定时器执行的函数
  wrap.hover(function(){
    clearInterval(moving);
  },function(){
    moving=setInterval(function(){
      var field=wrap.find('li:first');
      var h=field.height();
      field.animate({marginTop:-h+'px'},600,function(){
        field.css('marginTop',0).appendTo(wrap);
      })
    },interval)
  }).trigger('mouseleave');

});
