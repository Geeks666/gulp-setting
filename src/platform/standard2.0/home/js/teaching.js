require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('', ['jquery', 'fullPage', 'jqueryUIB', 'template', 'service', 'tools', 'layer', 'footer', 'header', 'app'],
    function ($, fullPage, jqueryUI, template, service, tools, layer, footer, header, app) {
      //全屏滚动
      $("#fullpage").fullpage({
        slidesColor: ['#F8F8F8', '#E6E4E4', '#F8F8F8', '#E6E4E4', '#F8F8F8'],
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
        menu: '#menu',
        afterRender: function () {
          $('.section1').find('.teaching_one_left').fadeIn(2000);
          $('.section1').find('.teaching_one_right img').fadeIn();
          $('.section1').find('.teaching_one_right img').delay(200).animate({
            right: '0'
          }, 1500, 'easeOutExpo');
          $('.section1').find('.teaching_one_button').fadeIn(4000);
          $('.section1').find('.teaching_one_download').fadeIn(4000);
          $('.section1').find('.student_one_download').fadeIn(4000);
        },
        afterLoad: function (anchorLink, index) {
          if (index == 1) {
            $('.section1').find('.teaching_one_left').fadeIn(2000);
            $('.section1').find('.teaching_one_right img').fadeIn();
            $('.section1').find('.teaching_one_right img').delay(200).animate({
              right: '0'
            }, 1500, 'easeOutExpo');
            $('.section1').find('.teaching_one_button').fadeIn(4000);
            $('.section1').find('.teaching_one_download').fadeIn(4000);
            $('.section1').find('.student_one_download').fadeIn(4000);
          }
          if (index == 2) {
            $('.section2').find('.teaching_two_left').fadeIn();
            $('.section2').find('.teaching_two_left').delay(500).animate({
              left: '0'
            }, 1500, 'easeOutExpo');
            $('.section2').find('.teaching_two_right').fadeIn();
            $('.section2').find('.teaching_two_right').delay(500).animate({
              right: '0'
            }, 1500, 'easeOutExpo');
          }
          if (index == 3) {
            $('.section3').find('.teaching_three_left').fadeIn();
            $('.section3').find('.teaching_three_left').delay(500).animate({
              bottom: '0'
            }, 1500, 'easeOutExpo');
            $('.section3').find('.teaching_three_right').fadeIn();
            $('.section3').find('.teaching_three_right').delay(500).animate({
              right: '0'
            }, 1500, 'easeOutExpo');
          }
          if (index == 4) {
            $('.section4').find('.teaching_four_left').fadeIn(2000);
            $('.section4').find('.teaching_four_right').fadeIn(3000);
          }
          if (index == 5) {
            $('.section5').find('.teaching_five_left').delay(500).animate({
              left: '0'
            }, 1500, 'easeOutExpo');
            $('.section5').find('.teaching_five_right').fadeIn(3000);
          }
        },
        onLeave: function (index, direction) {
          if (index == 1) {
            $('.section1').find('.teaching_one_left').fadeOut(2000);
            $('.section1').find('.teaching_one_right img').fadeOut();
            $('.section1').find('.teaching_one_right img').delay(500).animate({
              right: '-120%'
            }, 1500, 'easeOutExpo');
            $('.section1').find('.teaching_one_button').fadeOut(2000);
            $('.section1').find('.teaching_one_download').fadeOut(2000);
            $('.section1').find('.student_one_download').fadeOut(2000);
          }
          if (index == '2') {
            $('.section2').find('.teaching_two_left').fadeOut();
            $('.section2').find('.teaching_two_left').delay(500).animate({
              left: '-120%'
            }, 1500, 'easeOutExpo');
            $('.section2').find('.teaching_two_right').fadeOut();
            $('.section2').find('.teaching_two_right').delay(500).animate({
              right: '-120%'
            }, 1500, 'easeOutExpo');
          }
          if (index == '3') {
            $('.section3').find('.teaching_three_left').fadeOut();
            $('.section3').find('.teaching_three_left').delay(500).animate({
              bottom: '-120%'
            }, 1500, 'easeOutExpo');
            $('.section3').find('.teaching_three_right').fadeOut();
            $('.section3').find('.teaching_three_right').delay(500).animate({
              right: '-120%'
            }, 1500, 'easeOutExpo');
          }
          if (index == '4') {
            $('.section4').find('.teaching_four_left').fadeOut(2000);
            $('.section4').find('.teaching_four_right').fadeOut(3000);
          }
          if (index == 5) {
            $('.section5').find('.teaching_five_left').delay(500).animate({
              left: '-120%'
            }, 1500, 'easeOutExpo');
            $('.section5').find('.teaching_five_right').fadeOut(3000);
          }
        }
      });
    }
  );
})




