define(['jquery' ],
  function ( $ ) {
    $(document).ready(function(){

      function submitfrom(){
        $("#submitfrom").submit();
      }

      $("submitfrom").keyup(function(event){
        if(event.keyCode ==13){
          $("#submit").trigger("click");
        }
      });


      //隔行变色
      $(".discipline_list:odd").css("background","#ededed");
      //视频资源鼠标滑过
      $(".video_content_box dl").each(function(){
        $(this).mouseover(function(){
          $(this).addClass("video_active").parent().siblings().find("dl").removeClass("video_active");
          $(this).find(".mask,.play").show();
          $(this).parent().siblings().find(".mask,.play").hide();
        }).mouseout(function(){
          $(this).removeClass("video_active");
          $(this).find(".mask,.play").hide();
        })
      })
      //返回顶部
      $(window).scroll(function (){
        var st = $(this).scrollTop();
        if(st>700){
          $(".backToTop").show();
        }else{
          $(".backToTop").hide();
        }
      });
      $(".backToTop").click(function () {
        var speed=200;
        $('body,html').animate({ scrollTop: 0 }, speed);
      });
      //登录
      //资源排行tab切换
      $(".ranking_type li").each(function(){
        $(this).click(function(){
          var index=$(this).index();
          $(".ranking_content_box ul").eq(index).addClass("show").siblings().removeClass("show");
        })
      });
      var ranking_li1=$(".ranking_type li").eq(0),
        ranking_li2=$(".ranking_type li").eq(1),
        ranking_li3=$(".ranking_type li").eq(2);
      ranking_li1.click(function(){
        $(this).addClass("ranking_type1");
        ranking_li2.css("background","none");
        ranking_li3.removeClass("ranking_type3");
      });
      ranking_li2.click(function(){
        $(this).css("background","#3598d9");
        ranking_li1.removeClass("ranking_type1");
        ranking_li3.removeClass("ranking_type3");
      });
      ranking_li3.click(function(){
        $(this).addClass("ranking_type3");
        ranking_li2.css("background","none");
        ranking_li1.removeClass("ranking_type1");
      });
      //教研中2,3屏内容鼠标滑过
      $('.research_two_right_type dl').each(function(){
        var that=this;
        $(this).mouseover(function(){
          $(that).next().show().parent().siblings().find("div").hide();
        }).mouseout(function(){
          $(that).next().hide();
        })
      });
      $('.research_three_type dl').each(function(){
        var that=this;
        $(this).mouseover(function(){
          $(that).next().show().parent().siblings().find("div").hide();
        }).mouseout(function(){
          $(that).next().hide();
        })
      });
      //应用中tab中每项鼠标停留状态
      $(".application_content_list li").each(function(){
        var that=this;
        $(this).mouseover(function(){
          $(that).find(".bg,.content_add_button").show();
          $(that).siblings().find(".bg,.content_add_button").hide();
        }).mouseout(function(){
          $(that).find(".bg,.content_add_button").hide();
        })
      });
      //资源页课件tab切换
      $(".head-list li").each(function(){
        var that=this;
        var index=$(this).index();
        $(this).click(function(){
          $(that).addClass("head-active").siblings().removeClass("head-active");
          $(that).parent().parent().next().find(".list2-con").eq(index).addClass("show").siblings().removeClass("show");
        })
      });
      //试卷tab切换
      $(".level-type li").each(function(){
        var that=this;
        var index=$(this).index();
        $(this).click(function(){
          $(that).addClass("level-active").siblings().removeClass("level-active");
          $(that).parent().parent().next().find(".list2-con").eq(index).addClass("show").siblings().removeClass("show");
        })
      });
      //资源页中微课简介截取字符串
      $(".class-msg").each(function(){
        var html=$(this).html();
        var newHtml=html.substr(0,21);
        $(this).html(newHtml+'...');
      });
    });
  }
);
