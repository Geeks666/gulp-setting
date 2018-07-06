
define(['jquery' ],
  function ( $ ) {
      var wrap=$('.notice_list');
      var interval=2000;
      var moving;//定时器执行的函数
      wrap.hover(function(){
        clearTimer();
      },function(){
        setTimer();
      }).trigger('mouseleave');
      function clearTimer(){
        clearInterval(moving);
      }
      function setTimer(){
        moving=setInterval(function(){
          var field=wrap.find('li:first');
          var h=field.height();
          field.animate({marginTop:-h+'px'},600,function(){
            field.css('marginTop',0).appendTo(wrap);
          })
        },interval)
      }
      return {
        setTimer : setTimer,
        clearTimer : clearTimer
      }
  }
);