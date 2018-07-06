
define(['jquery' , 'layer' ], function ($ , layer ) {
  function tab($1,$2){
    $1.on('click',function(){
      if( $2.is(':hidden')){
        $('.arrow').removeClass('arrowUp').addClass('arrowDown');
        $('.chooseList').hide();
        $2.show();
        $(this).find('.arrow').removeClass('arrowDown').addClass('arrowUp');
      }else{
        $2.hide();
        $(this).find('.arrow').removeClass('arrowUp').addClass('arrowDown');
      }
      return false;
    });
  }
  tab($('.userName'),$('.chooseList').eq(1));
  tab($('.area','.chooseArea'),$('.chooseList').eq(0));
  $('body').on('click',function(){
    $('.chooseList').hide();
    $('.arrow').removeClass('arrowUp').addClass('arrowDown');
  });
  $('body').delegate('.nav_bottom>ul li' , 'click' , function(e){
    e.stopPropagation();
    $(this).find(".resource").show();
    $(this).find('.arrow').addClass('arrowUp');
  });


});
