"use strict";define(["jquery","template","layer","service","orgConfig","header","appVerify"],function(e,t,a,r,s,o,n){function c(t,s){var o=t||s;if(null==i.totalUser[o]){var n=r.htmlHost+"/pf/api/schshow/teachers";t&&(n+="?areaId="+t),s&&(n+="?orgId="+s),e.ajax({url:n,type:"GET",success:function(t){t&&"success"==t.code?(i.totalUser[o]=t.data,e(".total_user .num").text(t.data)):a.alert(t.msg,{icon:0})},error:function(e){a.alert("获取注册用户数异常。",{icon:0})}})}else e(".total_user .num").text(i.totalUser[o])}function u(t,s){var o=t||s;if(null==i.shareResourceCount[o]){var n=r.htmlHost+"/pf/api/qtapp/resI_shareCount";t&&(n+="?areaId="+t),s&&(n+="?orgId="+s),e.ajax({url:n,type:"GET",success:function(t){t&&"success"==t.code?(i.shareResourceCount[o]=t.data.data.resTotal,e(".teacher_ranked .share_resource_num .num,.spaceNavul1 .share_resource_num .num").text(t.data.data.resTotal)):a.alert(t.msg,{icon:0})},error:function(e){a.alert("获取分享资源数异常。",{icon:0})}})}else e(".teacher_ranked .share_resource_num .num,.spaceNavul1 .share_resource_num .num").text(i.shareResourceCount[o])}var i={shareResourceCount:{},totalUser:{}};return u(s.orgIds.baiyinAreaId),c(s.orgIds.baiyinAreaId),function(){var t=r.htmlHost+"/pf/api/rank/videoCount";e.ajax({url:t,type:"GET",success:function(t){t&&"success"==t.code?e(".total_ktsl .num1").text(t.data):a.alert(t.msg,{icon:0})},error:function(e){a.alert("获取课堂实录总条数异常。",{icon:0})}})}(),e.each(e(".spaceNavul a.spaceLink"),function(){e(this).hasClass("ktsl")?e(this).attr("href","#"):e(this).attr("href",r.htmlHost+e(this).attr("data-href"))}),e("body").delegate(".spaceNavul li.application","click",function(e){if(!o.getUser())return a.alert("请登录后操作。",{icon:0}),!1}),e("body .wrap").delegate(".hanbo_enter","click",function(){if(!o.getUser())return void a.alert("请登录后操作。",{icon:0});n.verifyApp(r.appIds[e(this).attr("type")],"2")}),{getShareResourceCount:u,getTotalUser:c}});