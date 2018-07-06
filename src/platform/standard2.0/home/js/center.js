define(['jquery' ],
  function ( $ ) {
    $(function(){

      //顶部导航
      var begin_left = 0;
      var begin_width = parseFloat($('.nav-list').eq(3).css('width'));
      for (var i = 0; i < 3; i++) {
        begin_left += parseFloat($('.nav-list').eq(i).css('width'))+10;
      }
      $('.nav-line').css('left',begin_left);
      $('.nav-line').css('width',begin_width);

      $('.nav-list').hover(
        function(){
          var line_left = 0;
          var line_width = parseFloat($(this).css('width'));//头部的白色底部
          for (var i = 0; i < $(this).index() ; i++) {
            line_left += parseFloat($('.nav-list').eq(i).css('width'))+10;
          }
          $('.nav-line').eq(0).animate({
            width:line_width,
            left:line_left
          },200)
        },
        function(){}
      )
      $('.nav-box').hover(
        function(){},
        function(){
          $('.nav-line').eq(0).animate({
            width:begin_width,
            left:begin_left
          },200)
        }

      );

      //内容多出显示隐藏
      function hideText(obj,long){
        for (var i = 0; i < obj.length; i++) {
          var str = '...';
          var be_str = obj.eq(i).html();
          be_str = be_str.replace( /^\s+|\s+$/,'');
          var newstr = '';

          if( be_str.length > long ){
            newstr = be_str.slice(0,long) + str;
            obj.eq(i).html(newstr);
          }
        }
      }
      hideText( $('.txt-message'),40 )

      //title选项卡
      $('.title-list').click(function (index){
        $('.title-list').removeClass('title-list-active');
        $(this).addClass('title-list-active');
        $('.center-message').hide();
        $('.center-message').eq($(this).index()).show();

        if( $(document.body).height()+170 < $(window).height() ){
          $('#footer').addClass('fixed-footer')
        }else{
          $('#footer').removeClass('fixed-footer')
        }
      })

    })

    function tip(value){
      $("#title01").empty();
      var adiv = document.createElement('div');
      var mask = document.createElement('div');
      var abtn = document.createElement('a');
      abtn.href = "javascript:;";
      abtn.innerHTML = '确定';
      abtn.className = 'submit';
      adiv.id = 'hint-window';
      mask.id = 'mask';
      adiv.innerHTML = value;
      document.body.appendChild(adiv);
      document.body.appendChild(mask);
      adiv.appendChild(abtn);

      abtn.onclick = function(){
        document.body.removeChild(adiv);
        document.body.removeChild(mask);
      }
    }
  }
);