"use strict";require.config({baseUrl:"../",paths:{platformConf:"public/js/platformConf-6e48d40e05.js"}}),require(["platformConf"],function(e){require.config(e),define("",["jquery","fullPage","jqueryUIB","template","service","tool","layer","footer","header","app"],function(e,t,n,i,a,o,f,d,c,_){e("#fullpage").fullpage({slidesColor:["#F8F8F8","#E6E4E4","#F8F8F8","#E6E4E4","#F8F8F8"],anchors:["page1","page2","page3","page4","page5"],menu:"#menu",afterRender:function(){e(".section1").find(".teaching_one_left").fadeIn(2e3),e(".section1").find(".teaching_one_right img").fadeIn(),e(".section1").find(".teaching_one_right img").delay(200).animate({right:"0"},1500,"easeOutExpo"),e(".section1").find(".teaching_one_button").fadeIn(4e3),e(".section1").find(".teaching_one_download").fadeIn(4e3),e(".section1").find(".student_one_download").fadeIn(4e3)},afterLoad:function(t,n){1==n&&(e(".section1").find(".teaching_one_left").fadeIn(2e3),e(".section1").find(".teaching_one_right img").fadeIn(),e(".section1").find(".teaching_one_right img").delay(200).animate({right:"0"},1500,"easeOutExpo"),e(".section1").find(".teaching_one_button").fadeIn(4e3),e(".section1").find(".teaching_one_download").fadeIn(4e3),e(".section1").find(".student_one_download").fadeIn(4e3)),2==n&&(e(".section2").find(".teaching_two_left").fadeIn(),e(".section2").find(".teaching_two_left").delay(500).animate({left:"0"},1500,"easeOutExpo"),e(".section2").find(".teaching_two_right").fadeIn(),e(".section2").find(".teaching_two_right").delay(500).animate({right:"0"},1500,"easeOutExpo")),3==n&&(e(".section3").find(".teaching_three_left").fadeIn(),e(".section3").find(".teaching_three_left").delay(500).animate({bottom:"0"},1500,"easeOutExpo"),e(".section3").find(".teaching_three_right").fadeIn(),e(".section3").find(".teaching_three_right").delay(500).animate({right:"0"},1500,"easeOutExpo")),4==n&&(e(".section4").find(".teaching_four_left").fadeIn(2e3),e(".section4").find(".teaching_four_right").fadeIn(3e3)),5==n&&(e(".section5").find(".teaching_five_left").delay(500).animate({left:"0"},1500,"easeOutExpo"),e(".section5").find(".teaching_five_right").fadeIn(3e3))},onLeave:function(t,n){1==t&&(e(".section1").find(".teaching_one_left").fadeOut(2e3),e(".section1").find(".teaching_one_right img").fadeOut(),e(".section1").find(".teaching_one_right img").delay(500).animate({right:"-120%"},1500,"easeOutExpo"),e(".section1").find(".teaching_one_button").fadeOut(2e3),e(".section1").find(".teaching_one_download").fadeOut(2e3),e(".section1").find(".student_one_download").fadeOut(2e3)),"2"==t&&(e(".section2").find(".teaching_two_left").fadeOut(),e(".section2").find(".teaching_two_left").delay(500).animate({left:"-120%"},1500,"easeOutExpo"),e(".section2").find(".teaching_two_right").fadeOut(),e(".section2").find(".teaching_two_right").delay(500).animate({right:"-120%"},1500,"easeOutExpo")),"3"==t&&(e(".section3").find(".teaching_three_left").fadeOut(),e(".section3").find(".teaching_three_left").delay(500).animate({bottom:"-120%"},1500,"easeOutExpo"),e(".section3").find(".teaching_three_right").fadeOut(),e(".section3").find(".teaching_three_right").delay(500).animate({right:"-120%"},1500,"easeOutExpo")),"4"==t&&(e(".section4").find(".teaching_four_left").fadeOut(2e3),e(".section4").find(".teaching_four_right").fadeOut(3e3)),5==t&&(e(".section5").find(".teaching_five_left").delay(500).animate({left:"-120%"},1500,"easeOutExpo"),e(".section5").find(".teaching_five_right").fadeOut(3e3))}})})});