"use strict";require.config({baseUrl:"../",paths:{platformConf:"public/js/platformConf-6e48d40e05.js"}}),require(["platformConf"],function(e){require.config(e),define("",["jquery","fullPage","jqueryUIB","template","service","tool","layer","footer","header","app"],function(e,n,t,f,i,o,a,r,u,l){function c(){e(".button").each(function(){e(this).width()/2!=0&&e(this).css("margin-left","-"+e(this).width()/2+"px")})}c(),e(window).resize(function(e){c()}),e(".into-app").fadeOut(30),e("#fullpage").fullpage({slidesColor:["#fafbfd","#fafbfd"],anchors:["page1","page2"],menu:"#menu",verticalCentered:!1,afterRender:function(e,n){c()},afterLoad:function(e,n){c()},onSlideLeave:function(e,n){c()},onLeave:function(e,n){c()}})})});