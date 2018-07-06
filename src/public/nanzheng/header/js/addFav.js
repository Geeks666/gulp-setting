
define(['jquery' , 'layer' ], function ($ , layer ) {
  if((window.opera && window.print) || (window.sidebar && !window.sidebar.addPanel)) {
    $("body li.favorite_button").html("<a href='"+window.location+"' title='"+document.title+"' rel='sidebar'>添加收藏</a>");
  }
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
    else if (document.all) {//IE类浏览器
      try{
        window.external.addFavorite(url, title);
      }catch(e){
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
      }
    }
    else if(window.sidebar && window.sidebar.addPanel) {
      window.sidebar.addPanel(name,url,''); //obsolete from FF 23.
    }
    else {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
  };

  // 设置为主页
  function setHomepage(){
    if (document.all){
      document.body.style.behavior='url(#default#homepage)';
      document.body.setHomePage(window.location.href);
    }else if (window.sidebar){
      if(window.netscape){
        try{
          netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        }catch (e){
          alert( "该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true" );
        }
      }
    }else{
      alert('您的浏览器不支持自动自动设置首页, 请使用浏览器菜单手动设置!');
    }
  }
  $("body").delegate(".home_button" , "click" , function (e) {
    setHomepage();
  });
  $("body").delegate(".favorite_button" , "click" , function (e) {
    if( $(this).find("a").length == 0 ){
      addFavorite();
    }
  });


});
