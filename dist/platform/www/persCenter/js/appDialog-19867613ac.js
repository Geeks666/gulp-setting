"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};define("dialog",["jquery","tools","service"],function(t,a,o){var e=function(o,e){function i(){return t("#mask").remove(),t(".dialog-box").remove(),!1}o||e||(o=function(){},e={}),t("#mask").on({mousewheel:function(){return!1},click:function(){return!1}}),t("#confirm").click(function(){return e.output?("function"==typeof o&&("object"==(void 0===e?"undefined":_typeof(e))?o(e):o()),t("#mask").remove(),t(".dialog-box").remove(),!1):(e.appId?a.textTip("您还未选择应用"):e.hintText?a.textTip(e.hintText):a.textTip("请输入完整内容"),!1)}),t("#cancel").click(i),t(".close-dialog").click(i)},i=function(a,o){var i={appId:[],output:!1},l="",c="";a=a.data;for(var n=0;n<a.length;n++)a[n].isShow||(l+='<li class="app-li" key="1" appid="'+a[n].id+'"><span class="checkbox"></span><img class="app-pic" src="'+p(a[n].logo)+'"><div class="app-msg"><p><a class="app-name" href="javascript:;">'+a[n].name+"</a></p></div></li>");var r="";""!==l&&(r='<p class="clearFix"><span id="choose-all" key="1"><span class="checkbox"></span>全选</span></p>'),""==l&&(c='style="overflow: hidden;"',l=s("暂无可添加应用"),i.output=!0),t("body").append('<div id="mask"></div>'),t("body").append('<div id="addAppDialog" class="dialog-box"><h2 class="box-header">添加应用</h2>'+r+'<ul class="app-boxs clearFix" '+c+">"+l+'</ul><p class="clearFix btns"><a id="confirm" href="javascript:;">确定</a><a id="cancel" href="javascript:;">取消</a></p><span class="close-dialog icon-close-small"></span></div>'),a.length>6&&t("#addAppDialog .app-boxs").css({width:"666px",left:"-7px"}),t("#choose-all").on("click",function(){1==t(this).attr("key")?(t(this).attr("key",2),t(this).addClass("choose-active"),t("#addAppDialog li").each(function(){t(this).attr("key",2),t(this).addClass("active"),i.appId.push(t(this).attr("appid"))}),i.output=!0):(t(this).attr("key",1),t(this).removeClass("choose-active"),t("#addAppDialog li").each(function(){t(this).attr("key",1),t(this).removeClass("active")}),i.appId.length=0,i.output=!1)}),t("#addAppDialog").on("click","li",function(){if(1==t(this).attr("key"))t(this).attr("key",2),t(this).addClass("active"),i.appId.push(t(this).attr("appid"));else{t(this).attr("key",1);for(var a=0;a<i.appId.length;a++)if(i.appId[a]==t(this).attr("appid")){i.appId.splice(a,1);break}t("#choose-all").removeClass("choose-active"),t(this).removeClass("active")}i.appId.length?i.output=!0:(i.output=!1,t("#choose-all").removeClass("choose-active"))}),e(o,i)},s=function(t){return'<div id="hint-content" class="no-content">'+t+"</div>"},p=function(t){return"http"===o.path_url.download_url.substring(0,4)?o.path_url.download_url.replace("#resid#",t):o.prefix+o.path_url.download_url.replace("#resid#",t)};return{addAppDialog:i,noContent:s}});