"use strict";define(["jquery"],function(i){i(document).ready(function(){i("submitfrom").keyup(function(n){13==n.keyCode&&i("#submit").trigger("click")}),i(".discipline_list:odd").css("background","#ededed"),i(".video_content_box dl").each(function(){i(this).mouseover(function(){i(this).addClass("video_active").parent().siblings().find("dl").removeClass("video_active"),i(this).find(".mask,.play").show(),i(this).parent().siblings().find(".mask,.play").hide()}).mouseout(function(){i(this).removeClass("video_active"),i(this).find(".mask,.play").hide()})}),i(window).scroll(function(){i(this).scrollTop()>700?i(".backToTop").show():i(".backToTop").hide()}),i(".backToTop").click(function(){i("body,html").animate({scrollTop:0},200)}),i(".ranking_type li").each(function(){i(this).click(function(){var n=i(this).index();i(".ranking_content_box ul").eq(n).addClass("show").siblings().removeClass("show")})});var n=i(".ranking_type li").eq(0),e=i(".ranking_type li").eq(1),s=i(".ranking_type li").eq(2);n.click(function(){i(this).addClass("ranking_type1"),e.css("background","none"),s.removeClass("ranking_type3")}),e.click(function(){i(this).css("background","#3598d9"),n.removeClass("ranking_type1"),s.removeClass("ranking_type3")}),s.click(function(){i(this).addClass("ranking_type3"),e.css("background","none"),n.removeClass("ranking_type1")}),i(".research_two_right_type dl").each(function(){var n=this;i(this).mouseover(function(){i(n).next().show().parent().siblings().find("div").hide()}).mouseout(function(){i(n).next().hide()})}),i(".research_three_type dl").each(function(){var n=this;i(this).mouseover(function(){i(n).next().show().parent().siblings().find("div").hide()}).mouseout(function(){i(n).next().hide()})}),i(".application_content_list li").each(function(){var n=this;i(this).mouseover(function(){i(n).find(".bg,.content_add_button").show(),i(n).siblings().find(".bg,.content_add_button").hide()}).mouseout(function(){i(n).find(".bg,.content_add_button").hide()})}),i(".head-list li").each(function(){var n=this,e=i(this).index();i(this).click(function(){i(n).addClass("head-active").siblings().removeClass("head-active"),i(n).parent().parent().next().find(".list2-con").eq(e).addClass("show").siblings().removeClass("show")})}),i(".level-type li").each(function(){var n=this,e=i(this).index();i(this).click(function(){i(n).addClass("level-active").siblings().removeClass("level-active"),i(n).parent().parent().next().find(".list2-con").eq(e).addClass("show").siblings().removeClass("show")})}),i(".class-msg").each(function(){var n=i(this).html(),e=n.substr(0,21);i(this).html(e+"...")})})});