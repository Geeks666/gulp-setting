"use strict";define(["jquery","NProgress","layer"],function(e,t,n){e(document).ajaxStart(function(){t.start()}),e(document).ajaxComplete(function(){t.done(!0)}),n.msg("我是 baiyin 定制版的 home")});