"use strict";require.config({baseUrl:"../",paths:{platformConf:"public/js/platformConf-6e48d40e05.js"}}),require(["platformConf"],function(a){require.config(a),define("",["jquery","template","service","footer","header","tool"],function(a,e,t,i,s,r){function n(e){a.ajax({url:t.htmlHost+"/pf/api/notice/getByPage?page.pageSize="+e+"&page.currentPage="+r.args.currentPage,type:"GET",success:function(t){if(t&&"success"==t.code)if(t.data.datalist.length>0){a("#noticelist").empty();for(var i=0;i<t.data.datalist.length;i++)a("#noticelist").append('<li class="message-list clearFix"><a class="message-text message-title" href="noticeDetail.html?id='+t.data.datalist[i].id+"&index="+((parseInt(t.data.currentPage)-1)*e+i)+'" >'+t.data.datalist[i].title+'</a><span class="message-text message-time">'+t.data.datalist[i].crtDttm.split(" ")[0]+"</span> </li>");var s=t.data.page;s.totalPages=t.data.totalPages,s.totalPages>1&&l(t.data.page)}else a("#noticelist").html("<p id='no-content'>没有您查看的内容</p>");else layer.alert("获取重要公告异常。",{icon:0})},error:function(a){layer.alert("获取重要公告异常。",{icon:0})}})}function l(e){if(a("#pages").empty(),e.totalPages<=3){c(e);for(var t=1;t<=e.totalPages;t++)o(t);g(e)}else if(e.currentPage<=2){c(e);for(var t=e.currentPage;t<e.currentPage+3;t++)o(t);g(e)}else if(e.currentPage<=e.totalPages-2){c(e);for(var t=e.currentPage-1;t<=e.currentPage+1;t++)o(t);g(e)}else if(e.currentPage<=e.totalPages){c(e);for(var t=e.totalPages-2;t<=e.totalPages;t++)o(t);g(e)}}function c(e){if(parseInt(e.currentPage)>1){var t=parseInt(e.currentPage)-1;a("#pages").append("<li class=pages-list > <a id="+t+" page="+t+" class=pages-link href=javascript:;>&lsaquo;&lsaquo;</a> </li>")}}function o(e){a("#pages").append("<li class=pages-list > <a id="+e+" page="+e+' class="'+(r.args.currentPage==e?"pages-active pages-link":"pages-link")+'" href=javascript:;>'+e+"</a> </li>")}function g(e){if(parseInt(e.currentPage)<e.totalPages){var t=parseInt(e.currentPage)+1;a("#pages").append("<li class=pages-list > <a id="+t+" page="+t+" class=pages-link href=javascript:;>&rsaquo;&rsaquo;</a> </li>")}}function p(a){f=a,n(a)}var f=0;r.args.currentPage||(r.args.currentPage=1),n(10),a.ajax({url:t.htmlHost+"/pf/api/notice/getLimit?limit=6",type:"GET",success:function(e){if(e&&"success"==e.code)if(a("#importnotice").empty(),e.data&&e.data.length>0)for(var t=0;t<e.data.length;t++)a("#importnotice").append('<li class="imp-list"><a class="imp-text" href="noticeDetail.html?id='+e.data[t].id+"&index="+t+'">'+e.data[t].title+"</a></li>");else a("#importnotice").html("<p id='no-content'>没有您查看的内容</p>");else layer.alert("获取重要公告异常。",{icon:0})},error:function(a){layer.alert("获取重要公告异常。",{icon:0})}}),a(".wrap").delegate("#pages li","click",function(){r.args.currentPage=parseInt(a(this).find("a").attr("page")),p(10)}),a(function(){function e(e,t){var i=a(window).height()-t;i<e&&(i=e),a(".message-content").get(0).style["min-height"]=i+"px"}a(".nav-line").hide(),e(400,664),a(window).resize(function(){e()})})})});