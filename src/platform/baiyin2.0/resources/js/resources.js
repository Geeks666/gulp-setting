require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);
  define('', ['jquery', 'template', 'echarts', 'service', 'footer', 'header', 'tool'],
    function ($, template, echarts, service, footer, header, tools) {
      //资源分享
      resourceShare($('#resourceShare'),'resourceShare_','');

      //资源动态
      teachingDyn();
      teachingDt($('#dynamic_list'),'dynamic_list_');


      teachingLW();
      //资源分享
      function teachingLW() {
        var ulli = $('.teachingLeft ul li');
        var ulWidth = $('.teachingLeft').width() / ulli.length;
        ulli.width(ulWidth - 1);
        ulli.last().css("border-right", 'none');
        ulli.find('a').click(function () {
          $(this).addClass('liact').parent().siblings().children().removeClass('liact');
          resourceShare($('#resourceShare'),'resourceShare_',$(this).attr('type'))
        })
      }

      /**
       * 资源分享
       * @param $obj
       * @param temId 模板ID
       * @param type 资源类型，类型有:教案:1229, 课件:1230, 学案:1231, 作业/习题:1458,素材:1542,其他:1505。全部的情况不传这个值
       */
      function resourceShare($obj, temId, type) {
        $.ajax({
          url: service.prefix + '/pf/api/direct/resI_ugcShareResource?orgCode=' + service.appIds.byqjyjg_appId +
          '&type='+ type + '&pageNum=1&pageSize=8',
          type: 'GET',
          success: function (data) {
            if (data && data.success == true) {
              var html;
              if (data.data && data.data.length > 0) {
                for (var i = 0; i < data.data.length; i++) {
                 var title = (/[.]/.exec(data.data[i].title)) ? /[^.]+$/.exec(data.data[i].title.toLowerCase()) : '';
                  data.data[i].pic = getImgUrl(title[0]);
                }
                html = template(temId, data);
              } else {
                html = showprompt();
              }
              $obj.html(html);
            } else {
              layer.alert("获取资源分享异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取资源分享异常。", {icon: 0});
          }
        });

      }

      $("body").delegate("#resourceShare strong", "click", function () {
         window.location = getPicPath($(this).attr('resId'));
      });



      /**
       * 根据图片ID返回图片路径
       * @param id 图片ID
       * @returns {string} 图片路径
       */
      function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].
        replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      }

      /**
       * 资源动态
       * @param $obj
       * @param temId 模板ID
       */
      function teachingDt($obj, temId) {
        $.ajax({
          url: service.prefix + '/pf/api/direct/resI_shareDynamic?orgCode=' + service.appIds.byqjyjg_appId+'&pageNum=1&pageSize=10',
          type: 'GET',
          success: function (data) {
            if (data && data.success == true) {
              var html;
              if (data.data && data.data.length > 0) {
                for (var i = 0; i < data.data.length; i++) {
                  var title = (/[.]/.exec(data.data[i].title)) ? /[^.]+$/.exec(data.data[i].title.toLowerCase()) : '';
                  data.data[i].pic = getImgUrl(title[0]);
                }
                html = template(temId, data);
              } else {
                html = showprompt();
              }
              $obj.html(html);
              teachingDyn();
            } else {
              layer.alert("获取资源动态异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取资源动态异常。", {icon: 0});
          }
        });
      }
      resourcesCont();
      function resourcesCont() {
        teachingA = echarts.init(document.getElementById('teaAchSta'));
        $.ajax({
          url: service.prefix + '/pf/api/direct/resI_schoolResRanking?orgCode='+service.appIds.byqjyjg_appId +'&pageNum=1&pageSize=8',
          type: 'GET',
          success: function (data) {
            if (data && data.success == true) {
              initteaAchSta(data);
            }
          },
          error: function (data) {
            layer.alert(data.msg, {icon: 0});
          }
        });
      }




      //资源动态
      function teachingDyn() {
        new DoMove($('#dynamic_list'), 89, 0);
      }


      //列表循环
      function DoMove(e, height, t) {
        this.target = e;
        this.target.css({'position': 'relative'});
        this.$li = e.children();
        this.length = this.$li.length;
        this.height = height || 50;
        this.speed = 1000;
        this.starNum = 0;
        var _this = this;
        if (this.length >= 4) {
          this.target.html(this.target.html() + this.target.html());
          setTimeout(function () {
            _this.move();
          }, t);
        }
      }

      DoMove.prototype.move = function () {
        var _this = this;
        this.starNum++;
        if (this.starNum > this.length) {
          this.starNum = 1;
          this.target.css('top', 0);
        }
        this.target.animate({
            top: '-' + this.starNum * this.height + 'px'
          },
          this.speed,
          function () {
            setTimeout(function () {
              _this.move(_this.starNum)
            }, 1000);
          });
      };



      /**
       * 公用没有内容方法
       * @returns {string}
       */
      function showprompt() {
        return "<p id='no-content'>没有您查看的内容</p>";
      };

      //平台资源统计初始化柱状图
      function initteaAchSta(data) {
        var teachingA = echarts.init(document.getElementById('teaAchSta'));
        var teaching_personal = {
          color: ["#56b1f0", "#ff666e"],
          textStyle: {
            color: '#2f2f2f',
            fontSize: 12
          },
          grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            cneter: 10,
            width: 400,
            itemWidth: 30,
            itemHeight: 20,
            textStyle: {
              color: "#2f2f2f"
            },
            data: ["上传量", "下载量"]
          },
          xAxis: [{
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: 14
              },
              formatter: function (name) {
                return tools.hideTextByLen(name, 12);
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c9c9c9'
              }
            },
            axisTick: {
              show: false
            },
            data: []
          }],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: '#c9c9c9',
                  fontSize: 14
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#c9c9c9'
                }
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          series: [{
            name: '上传量',
            type: 'bar',
            barWidth: 24,
            data: []
          }, {
            name: '下载量',
            type: 'bar',
            barWidth: 24,
            data: []
          }]
        };
        for (var i = 0; i < data.data.length; i++) {
          teaching_personal.xAxis[0].data[i] = data.data[i].orgName;
          teaching_personal.series[0].data[i] = data.data[i].downNum;
          teaching_personal.series[1].data[i] = data.data[i].downNum;
         }
        teachingA.setOption(teaching_personal);
      }


      function getImgUrl(type){
        switch (type){
          case "doc" : return '../../www/public/images/base/doc.png';
          case "excel" : return '../../www/public/images/base/excel.png';
          case "docx" : return '../../www/public/images/base/docx.png';
          case "flv" : return '../../www/public/images/base/flv.png';
          case "gif" : return '../../www/public/images/base/gif.png';
          case "html" : return '../../www/public/images/base/html.png';
          case "jpeg" : return '../../www/public/images/base/jpeg.png';
          case "jpg" : return '../../www/public/images/base/jpg.png';
          case "mp3" : return '../../www/public/images/base/mp3.png';
          case "mp4" : return '../../www/public/images/base/mp4.png';
          case "pdf" : return '../../www/public/images/base/pdf.png';
          case "png" : return '../../www/public/images/base/png.png';
          case "tif" : return '../../www/public/images/base/png.png';
          case "ppt" : return '../../www/public/images/base/ppt.png';
          case "pptx" : return '../../www/public/images/base/pptx.png';
          case "rar" : return '../../www/public/images/base/rar.png';
          case "rm" : return '../../www/public/images/base/rm.png';
          case "swf" : return '../../www/public/images/base/swf.png';
          case "txt" : return '../../www/public/images/base/txt.png';
          case "wav" : return '../../www/public/images/base/wav.png';
          case "word" : return '../../www/public/images/base/word.png';
          case "xhtml" : return '../../www/public/images/base/xhtml.png';
          case "xls" : return '../../www/public/images/base/xls.png';
          case "xlsx" : return '../../www/public/images/base/xlsx.png';
          case "zip" : return '../../www/public/images/base/zip.png';
          case "bmp" : return '../../www/public/images/base/bmp.png'
        }
      }

    });
});



