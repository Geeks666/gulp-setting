"use strict";require.config({baseUrl:"../",paths:{platformConf:"public/js/platformConf-6e48d40e05.js"}}),require(["platformConf"],function(t){require.config(t),define("",["jquery","service","tools","layer","template","footer","header"],function(t,a,i,e,n,o,l){function s(e,o,l,s){t("#"+e).html("");var p={};""!=o&&(p.category=o),"1"===l&&(p.isRecommend=l),t.ajax({url:a.htmlHost+"/pf/api/app/list",type:"GET",data:p,success:function(a){if(a&&"success"==a.code){var o="";a.data&&a.data.length>0?("0"===l&&(y.all=a.data),t.each(a.data,function(t){a.data[t].logo=a.data[t].logo?f(a.data[t].logo):"",a.data[t].category=a.data[t].category?d(a.data[t].category):"其他"}),o=n(e+"_",a)):o="<p id='no-content'>没有您查看的内容</p>",t("#"+e).html(o),s&&i.getQueryObj().targetApp&&t("#application_list li[appid='"+i.getQueryObj().targetApp+"'").find(".appName").click()}else alert("获取应用异常")}})}function p(i){var e={};i&&(e.category=i),t.ajax({url:a.htmlHost+"/pf/api/app/list",type:"GET",data:e,success:function(a){if(a&&"success"==a.code){var e="";a.data&&a.data.length>0?(y[i||"all"]=a.data,t.each(a.data,function(t){a.data[t].logo=a.data[t].logo?f(a.data[t].logo):"",a.data[t].category=a.data[t].category?d(a.data[t].category):"其他"}),e=n("application_list_",a)):e="<p id='no-content'>没有您查看的内容</p>",t("#application_list").html(e)}else alert("获取应用异常")}})}function c(i,n,o,l){t.ajax({url:a.htmlHost+"/pf/api/app/detail/"+i,type:"get",success:function(a){"success"==a.code?(a.data.praiseNum=n,a.data.fappcategory=o,a.data.ispraise=parseInt(n)>0,t(".application_content_box").hide(),t("#app-details").show(),r(a.data)):"failed"==a.code&&e.alert("操作错误。",{icon:0})}})}function r(i){function e(t){p.animate({left:s*-t},800,function(){r=!0})}i.logo=i.logo?f(i.logo):"",i.category=i.category?d(i.category):"其他",i.qrUrl=a.htmlHost+"/pf/api/qrcode/appdown/"+i.id,t(".detail-cont .detail-msg").html(n("detailMsg",{data:i}));var o=t("#app-details").find(".prev-btn"),l=t("#app-details").find(".next-btn"),s=t("#app-details").find(".pic-box").width(),p=t("#app-details").find(".pic-list"),c="",r=!0,u=1,g=i.promotePictures?i.promotePictures.split(","):[],h=g,m=h.length;if(m<2)for(x in h)c+='<li><img src="'+f(h[x])+'" alt=""></li>',p.html(c);else!function(){for(x in h)c+='<li><img src="'+f(h[x])+'" alt=""></li>';for(var t=0;t<Math.min(3,m);t++)c+='<li><img src="'+f(h[t])+'" alt=""></li>';p.width((m+Math.min(3,m))*s),p.html(c),m+=Math.min(3,m),p.css("left",-s)}();l.unbind().bind("click",function(){!r||p.find("li").length<2||(u==m-2&&(u=0,p.css("left",-u*s)),u++,r=!1,e(u))}),o.unbind().bind("click",function(){!r||p.find("li").length<2||(0==u&&(u=m-2,p.css("left",-u*s)),u--,r=!1,e(u))})}function d(t){for(var a=0;a<m.length;a++)if(t==m[a].value)return m[a].name}function f(t){return"http"===a.path_url.download_url.substring(0,4)?a.path_url.download_url.replace("#resid#",t):a.prefix+a.path_url.download_url.replace("#resid#",t)}function u(i,n){var o=window;"2"==n&&(o=window.open("about:blank")),t.ajax({url:a.htmlHost+"/pf/api/app/verify",type:"get",data:{appId:i},success:function(t){"success"==t.code?o.location.href=t.data:"failed"==t.code&&("2"==n&&o.close(),e.alert(t.msg,{icon:0}))},error:function(t){e.alert("请求失败",{icon:0})}})}function g(i){t.ajax({url:a.htmlHost+"/pf/api/app/verifyDown",type:"get",data:{appId:i},success:function(t){"success"==t.code?window.location.href=t.data:"failed"==t.code&&e.alert("您没有该权限下载。",{icon:0})},error:function(t){e.alert("请求失败",{icon:0})}})}function h(i,n){t.ajax({type:"POST",url:a.htmlHost+"/pf/api/app/like",data:{appId:i,isLike:!0},success:function(t){"success"==t.code?n():"login_error"==t.code&&e.alert(t.msg,{icon:0})},error:function(t){e.alert("添加出错,请稍后重试。",{icon:0})}})}var m=null,y={};!function(){t.ajax({url:a.htmlHost+"/pf/api/app/types",type:"GET",success:function(a){a&&"success"==a.code?a.data&&a.data.length>0&&(m=a.data,t("#application_content_type").html(n("applicationContentType",a)),t("#recommended_list").length>0&&s("recommended_list","","1",!1),s("application_list","","0",!0)):alert("获取应用分类异常")}})}(),t("body").delegate("#application_content_type li","click",function(){t(".application_content_box").show(),t("#app-details").hide(),t(this).addClass("application_active").siblings().removeClass("application_active"),y[t(this).attr("type")]?t("#application_list").html(n("application_list_",{data:y[t(this).attr("type")]})):p(t(this).attr("type"))}),t("body").delegate(".recommended_list li , .application_content_list li","click",function(){var a=t(this).attr("appid"),i=t(this).find(".appName").attr("isLogin"),e=t(this).find(".like_num_"+a).html(),n=t(this).find(".type_"+a).html();if("false"!=t(this).attr("isDetail"))return c(a,e,n,i),t(this).unbind(),!1;u(a)}),t("body").delegate("#app-details .into-app","click",function(a){if(a.stopPropagation(),!l.getUser())return e.alert("请登录后操作。",{icon:0}),!1;u(t(this).attr("appid"),t(this).attr("kindCode"))}),t("body").delegate("#app-details .down-app","click",function(a){if(a.stopPropagation(),!l.getUser())return e.alert("请登录后操作。",{icon:0}),!1;g(t(this).attr("appid"))}),t("body").delegate(".praise-icon2","click",function(a){a.stopPropagation();var i=this;if(!l.getUser())return e.alert("请登录后操作。",{icon:0}),!1;("SPAN"==t(i)[0].tagName&&!t(i).hasClass("praised")||"STRONG"==t(i)[0].tagName&&!t(i).hasClass("praise-icon-active"))&&h(t(i).attr("appid"),function(){var a=t("span[appid='"+t(i).attr("appid")+"']"),e=t("strong[appid='"+t(i).attr("appid")+"']");a.length>0&&(a.addClass("praised").removeClass("unpraise_"+t(i).attr("appid")),t.each(a,function(a){t(this).siblings("span").text(parseInt(t(this).siblings("span").text())+1)})),e.length>0&&(e.addClass("praise-icon-active"),e.siblings("strong").text(parseInt(e.siblings("strong").text())+1));for(var n in y)t.each(y[n],function(a){y[n][a].id==t(i).attr("appid")&&(y[n][a].isLike=!0,y[n][a].likeNum=parseInt(y[n][a].likeNum)+1)})})})})});