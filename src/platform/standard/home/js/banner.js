define(['jquery' ],
  function ( $ ) {
    //banner();
    function initPicWidth( index ){
      var $slidePic = $(".slide-pic").find("li img");
      if( $slidePic.length > 0 ){
        $.each( $slidePic , function ( index ) {

        })
        var loadPicTimer = setInterval(function(){
          if( $slidePic.eq(0).width() > 0 ){
            clearInterval(loadPicTimer);
            if( $slidePic.eq(index).width() < $slidePic.eq(index).parent().width() ){
              $slidePic.eq(index).css('width','100%');
            }else if( $slidePic.eq(index).width() > $slidePic.eq(index).parent().width() ){
              $slidePic.eq(index).css({ 'position':'absolute','left':'50%','margin-left':-$slidePic.eq(index).width()/2+'px'});
            }
          }
        },10);
      }
    };


    function banner(){
      var bn_id = 0;
      var bn_id2= 1;
      var speed33=5000;
      var qhjg = 1;
      var MyMar33;
      $(".slide-pic li").hide();
      $(".slide-pic li").eq(0).fadeIn("slow");
      if($(".slide-pic li").length>1)
      {
        $(".slide-li li").eq(0).addClass("cur");

        //initPicWidth(0);
        function Marquee33(){
          bn_id2 = bn_id+1;
          if(bn_id2>$(".slide-pic li").length-1)
          {
            bn_id2 = 0;
          }
          $(".slide-pic li").eq(bn_id).css("z-index","2");
          $(".slide-pic li").eq(bn_id2).css("z-index","1");
          $(".slide-pic li").eq(bn_id2).show();
          $(".slide-pic li").eq(bn_id).fadeOut("slow");
          $(".slide-li li").removeClass("cur");
          $(".slide-li li").eq(bn_id2).addClass("cur");
          bn_id=bn_id2;
          //initPicWidth(bn_id2);
        };

        MyMar33=setInterval(Marquee33,speed33);

        $(".slide-li li").click(function(){
          var bn_id3 = $(".slide-li li").index(this);
          if(bn_id3!=bn_id&&qhjg==1)
          {
            qhjg = 0;
            $(".slide-pic li").eq(bn_id).css("z-index","2");
            $(".slide-pic li").eq(bn_id3).css("z-index","1");
            $(".slide-pic li").eq(bn_id3).show();
            $(".slide-pic li").eq(bn_id).fadeOut("slow",function(){qhjg = 1;});
            $(".slide-li li").removeClass("cur");
            $(".slide-li li").eq(bn_id3).addClass("cur");
            bn_id=bn_id3;
            //initPicWidth(bn_id3);
          }
        })
        $(".slide-li").hover(
          function(){
            clearInterval(MyMar33);
          }
          ,
          function(){
            MyMar33=setInterval(Marquee33,speed33);
          }
        )
      }
      else
      {
        $(".slide-li").hide();
      }
    };
    return banner;
  }
);