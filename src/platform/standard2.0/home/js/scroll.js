
define(['jquery' /*, 'index' */], function ($ /*, index */) {
    $(document).ready(function(){
      if($('li','.small_banner_list').length > 11){
        $('.left_button').show();
        $('.right_button').show();
        scroll();
      }else{
        $('.left_button').hide();
        $('.right_button').hide();
      }
    })


    function scroll() {
      //应用图片滚动
      var marginl = parseInt($(".small_banner li:first").css("margin-left"));//8左边距
      var movew = $(".small_banner li:first").outerWidth()+marginl;//92元素宽度加上左边距
      var pics=$(".small_banner_list");//ul
      pics[0].innerHTML+=pics[0].innerHTML;
      var len=pics.find("li").length;//11
      pics.css("width",movew*len+'px');//1012
      var box=$(".small_banner_list");
      var num = 0;
      var time;
      function goScroll(){
        time = setInterval(function(){
          scrolls();
        },30);
      }
      goScroll();
      function scrolls(){
        num -= 1;
        pics[0].style.left=num+'px';
        if(pics[0].offsetLeft<=-(pics[0].offsetWidth/2)){
          pics[0].style.left=0;
          num=0;
        }
      }
      box.mouseover(function(){
        clearInterval(time);
      })
      box.mouseout(function(){
        goScroll();
      })
      function leftani(){
        pics.find("li:first").animate({"margin-left":-movew},1000,function(){
          $(this).css("margin-left",marginl).appendTo(pics);
        });
      }

      function rightani(){
        pics.find("li:last").prependTo(pics);
        pics.find("li:first").css("margin-left",-movew).animate({"margin-left":marginl},1000);
      }
      $(".left_button").mouseover(function(){
        clearInterval(time);
      }).mouseout(function(){
        goScroll();
      })
      $(".left_button").click(function(){
        if(!$(".small_banner li:first").is(":animated")){
          leftani();
        }
      });
      $(".right_button").mouseover(function(){
        clearInterval(time);
      }).mouseout(function(){
        goScroll();
      })
      $(".right_button").click(function(){
        if(!$(".small_banner li:last").is(":animated")){
          rightani();
        }

      })
    };
    return scroll;
  }
);



