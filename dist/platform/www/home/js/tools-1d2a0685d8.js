"use strict";require.config({paths:{}}),define([],function(){function e(e,t){var n="",r=e.length;if(e.replace(/[^\x00-\xff]/g,"**").length<=t)return e;for(var i=0,u=0;i<r;i++){var o=e.charAt(i);if(/[\x00-\xff]/.test(o)?u++:u+=2,!(u<t))return n+"...";n+=o}}var t=function(e){return e<0?e:e>=10?e:"0"+e},n=function(e){if(!e)return"";var n=new Date,i=n.getFullYear(),u=t(n.getMonth()+1),o=n.getDate();return-1==e.indexOf("-")?r(e):e.slice(0,4)==i&&e.slice(5,7)==u&&e.slice(8,10)==t(o)?e.slice(11,16):e.slice(0,11)},r=function(e){e=Number(e);var r=new Date(e),i=r.getFullYear(),u=r.getMonth()+1,o=r.getDate(),s=r.getHours(),a=r.getMinutes(),c=r.getSeconds(),f=i+"-"+t(u)+"-"+t(o)+" "+t(s)+":"+t(a)+":"+t(c);return n(f)};return window.tools={timeSet:n,args:function(e){for(var t=new Object,n=e.split("&"),r=0;r<n.length;r++){var i=n[r].indexOf("=");if(-1!=i){var u=n[r].substring(0,i),o=n[r].substring(i+1);o=decodeURIComponent(o),t[u]=o}}return t}(window.location.search.substring(1)),hideTextByLen:e}});