"use strict";require.config({baseUrl:"../",paths:{platformConf:"public/js/platformConf-6e48d40e05.js"},enforeDefine:!0}),require(["platformConf"],function(a){require.config(a),require(["jquery","tools","service","layer","dialog","ajaxhelper","footer","header","template"],function(a,t,n,i,e,d){function s(a){u.indexOf(a)<0&&u.push(a)}function o(t){a.when(c(t)).done(function(){d.getAppCategory({success:function(t){var n='<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';for(var i in t.data)u.indexOf(t.data[i].id)>=0&&(n+='<li class="header-li" data-id="'+t.data[i].id+'"><span>'+t.data[i].name+"</span></li>");a(".header-list").html(n);var e=a(".header-li").children().length;a(".header-li").each(function(t){return 0==t?void a(this).css({"padding-left":0}):t==e-1?void a(this).css({"border-right":"none"}):void 0}),p()},fail:function(){i.alert("请登录后再试")}})})}function c(t){var n=0==parseInt(t)?{}:{category:parseInt(t)};return d.getAppList({data:n,success:function(t){var n="";if(t.data.length){for(var e=0;e<t.data.length;e++)t.data[e].isShow&&(s(t.data[e].category),12==t.data[e].id&&(t.data[e].appUrl=t.data[e].appUrl+"&totype=area"),n+='<li class="app-li"><img class="app-pic" src="'+f(t.data[e].logo)+'"><div class="app-msg"><p><span class="app-name">'+t.data[e].name+'</span></p><p class="clearFix">',t.data[e].downUrl&&""!==t.data[e].downUrl&&(n+='<a class="download btn" target="_blank" data-href="'+t.data[e].downUrl+'" appId="'+t.data[e].id+'">下载应用</a>'),3!==t.data[e].kindCode&&"3"!==t.data[e].kindCode&&(n+='<a class="into btn" target="_blank" data-kindCode="'+t.data[e].kindCode+'" data-href="'+t.data[e].appUrl+'"  appId="'+t.data[e].id+'">进入应用</a>'),n+='</p></div><span class="remove-btn icon-close-small" appId="'+t.data[e].id+'"></span></li>');n+=' <li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>'}else n='<li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>';a("#app-list").html(n),a(".download").each(function(){var t=a(this);a(this).click(function(){d.isLogin({success:function(){d.downloadApp({data:{appId:t.attr("appId")},success:function(a){window.location.href=a.data},fail:function(){i.alert("您没有相应权限")}})},fail:function(){i.alert("请登录后再试")}})})}),a(".into").each(function(){a(this).click(function(){var t=a(this),n="";2==t.data("kindcode")&&(n=window.open("about:blank")),d.isLogin({success:function(){d.enterApp({data:{appId:t.attr("appId")},success:function(a){1==t.data("kindcode")?window.location.href=a.data:2==t.data("kindcode")&&(n.location.href=a.data)},fail:function(){2==t.data("kindcode")&&n.close(),i.alert("您没有相应权限")}})},fail:function(){i.alert("请登录后再试")}})})})},fail:function(){a("#app-list").empty().append(e.noContent("没有查到对应应用哦")),i.alert("请登录后再试")}})}function l(){var t=r(),n=0==parseInt(t)?{}:{category:parseInt(t)};d.getAppList({data:n,success:function(a){e.addAppDialog(a,function(a){var t="";for(var n in a.appId)t+=a.appId[n]+",";d.addApps({data:t,success:function(){o(r()),i.alert("添加应用成功")},fail:function(){}})})},fail:function(){a("#app-list").empty().append(e.noContent("没有查到对应应用哦")),i.alert("请登录后再试")}})}function p(){a(".header-li").each(function(){a(this).click(function(){a(this).find("span").hasClass("tab-choose")||(a(this).find("span").addClass("tab-choose").parents(".header-li").siblings().each(function(){a(this).find("span").removeClass("tab-choose")}),c(a(this).data("id")))})}),a("#add-app").on("click",function(){l()}),a("body").on("click",".remove-btn",function(){var t=a(this).attr("appId");i.open({content:"确应删除该应用吗？",btn:["确认","取消"],yes:function(n,e){d.deleteApp({data:t,success:function(){a(".app-li").each(function(){if(a(this).find(".remove-btn").attr("appId")==t)return void a(this).remove()})},fail:function(){i.alert("请登录后在试;")}}),i.close(n)},btn2:function(a,t){this.cancel()},cancel:function(){}})})}function r(){var t="0";return a(".header-li").each(function(){if(a(this).find("span").hasClass("tab-choose"))return void(t=a(this).data("id"))}),t}function f(a){return"http"===n.path_url.download_url.substring(0,4)?n.path_url.download_url.replace("#resid#",a):n.prefix+n.path_url.download_url.replace("#resid#",a)}a("#html-content").css({visibility:"inherit"});var u=[];o("0")})});