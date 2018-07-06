'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);
  define('', ['jquery', 'template', 'echarts', 'service', 'footer', 'header', 'tool'], function ($, template, echarts, service, footer, header, tools) {
    //资源分享
    resourceShare($('#resourceShare'), 'resourceShare_', '');

    //资源动态
    teachingDyn();
    teachingDt($('#dynamic_list'), 'dynamic_list_');

    teachingLW();
    //资源分享
    function teachingLW() {
      var ulli = $('.teachingLeft ul li');
      var ulWidth = $('.teachingLeft').width() / ulli.length;
      ulli.width(ulWidth - 1);
      ulli.last().css("border-right", 'none');
      ulli.find('a').click(function () {
        $(this).addClass('liact').parent().siblings().children().removeClass('liact');
        resourceShare($('#resourceShare'), 'resourceShare_', $(this).attr('type'));
      });
    }

    /**
     * 资源分享
     * @param $obj
     * @param temId 模板ID
     * @param type 资源类型，类型有:教案:1229, 课件:1230, 学案:1231, 作业/习题:1458,素材:1542,其他:1505。全部的情况不传这个值
     */
    function resourceShare($obj, temId, type) {
      $.ajax({
        url: service.prefix + '/pf/api/direct/resI_ugcShareResource?orgCode=' + service.appIds.byqjyjg_appId + '&type=' + type + '&pageNum=1&pageSize=8',
        type: 'GET',
        success: function success(data) {
          if (data && data.success == true) {
            var html;
            if (data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                var title = /[.]/.exec(data.data[i].title) ? /[^.]+$/.exec(data.data[i].title.toLowerCase()) : '';
                data.data[i].pic = getImgUrl(title[0]);
              }
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert("获取资源分享异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取资源分享异常。", { icon: 0 });
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
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    }

    /**
     * 资源动态
     * @param $obj
     * @param temId 模板ID
     */
    function teachingDt($obj, temId) {
      $.ajax({
        url: service.prefix + '/pf/api/direct/resI_shareDynamic?orgCode=' + service.appIds.byqjyjg_appId + '&pageNum=1&pageSize=10',
        type: 'GET',
        success: function success(data) {
          if (data && data.success == true) {
            var html;
            if (data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                var title = /[.]/.exec(data.data[i].title) ? /[^.]+$/.exec(data.data[i].title.toLowerCase()) : '';
                data.data[i].pic = getImgUrl(title[0]);
              }
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
            teachingDyn();
          } else {
            layer.alert("获取资源动态异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取资源动态异常。", { icon: 0 });
        }
      });
    }
    resourcesCont();
    function resourcesCont() {
      teachingA = echarts.init(document.getElementById('teaAchSta'));
      $.ajax({
        url: service.prefix + '/pf/api/direct/resI_schoolResRanking?orgCode=' + service.appIds.byqjyjg_appId + '&pageNum=1&pageSize=8',
        type: 'GET',
        success: function success(data) {
          if (data && data.success == true) {
            initteaAchSta(data);
          }
        },
        error: function error(data) {
          layer.alert(data.msg, { icon: 0 });
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
      this.target.css({ 'position': 'relative' });
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
      }, this.speed, function () {
        setTimeout(function () {
          _this.move(_this.starNum);
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
            formatter: function formatter(name) {
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
        yAxis: [{
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
        }],
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

    function getImgUrl(type) {
      switch (type) {
        case "doc":
          return '../../www/public/images/base/doc-3f7e058d0b.png';
        case "excel":
          return '../../www/public/images/base/excel-589050ef85.png';
        case "docx":
          return '../../www/public/images/base/docx-3f7e058d0b.png';
        case "flv":
          return '../../www/public/images/base/flv-bf731a052d.png';
        case "gif":
          return '../../www/public/images/base/gif-c17f02ddba.png';
        case "html":
          return '../../www/public/images/base/html-7d28b88d6b.png';
        case "jpeg":
          return '../../www/public/images/base/jpeg-c17f02ddba.png';
        case "jpg":
          return '../../www/public/images/base/jpg-c17f02ddba.png';
        case "mp3":
          return '../../www/public/images/base/mp3-690c3a28e8.png';
        case "mp4":
          return '../../www/public/images/base/mp4-690c3a28e8.png';
        case "pdf":
          return '../../www/public/images/base/pdf-da18d4c38b.png';
        case "png":
          return '../../www/public/images/base/png-c17f02ddba.png';
        case "tif":
          return '../../www/public/images/base/png-c17f02ddba.png';
        case "ppt":
          return '../../www/public/images/base/ppt-5982f0915e.png';
        case "pptx":
          return '../../www/public/images/base/pptx-5982f0915e.png';
        case "rar":
          return '../../www/public/images/base/rar-ec58280c30.png';
        case "rm":
          return '../../www/public/images/base/rm-ee366f1c35.png';
        case "swf":
          return '../../www/public/images/base/swf-bf731a052d.png';
        case "txt":
          return '../../www/public/images/base/txt-427b13d312.png';
        case "wav":
          return '../../www/public/images/base/wav-fe8afdcf04.png';
        case "word":
          return '../../www/public/images/base/word-76d28cb819.png';
        case "xhtml":
          return '../../www/public/images/base/xhtml-7d28b88d6b.png';
        case "xls":
          return '../../www/public/images/base/xls-589050ef85.png';
        case "xlsx":
          return '../../www/public/images/base/xlsx-589050ef85.png';
        case "zip":
          return '../../www/public/images/base/zip-ec58280c30.png';
        case "bmp":
          return '../../www/public/images/base/bmp-c17f02ddba.png';
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9qcy9yZXNvdXJjZXMuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwiZWNoYXJ0cyIsInNlcnZpY2UiLCJmb290ZXIiLCJoZWFkZXIiLCJ0b29scyIsInJlc291cmNlU2hhcmUiLCJ0ZWFjaGluZ0R5biIsInRlYWNoaW5nRHQiLCJ0ZWFjaGluZ0xXIiwidWxsaSIsInVsV2lkdGgiLCJ3aWR0aCIsImxlbmd0aCIsImxhc3QiLCJjc3MiLCJmaW5kIiwiY2xpY2siLCJhZGRDbGFzcyIsInBhcmVudCIsInNpYmxpbmdzIiwiY2hpbGRyZW4iLCJyZW1vdmVDbGFzcyIsImF0dHIiLCIkb2JqIiwidGVtSWQiLCJ0eXBlIiwiYWpheCIsInVybCIsInByZWZpeCIsImFwcElkcyIsImJ5cWp5amdfYXBwSWQiLCJzdWNjZXNzIiwiZGF0YSIsImh0bWwiLCJpIiwidGl0bGUiLCJleGVjIiwidG9Mb3dlckNhc2UiLCJwaWMiLCJnZXRJbWdVcmwiLCJzaG93cHJvbXB0IiwibGF5ZXIiLCJhbGVydCIsImljb24iLCJlcnJvciIsImRlbGVnYXRlIiwid2luZG93IiwibG9jYXRpb24iLCJnZXRQaWNQYXRoIiwiaWQiLCJwYXRoX3VybCIsInN1YnN0cmluZyIsInJlcGxhY2UiLCJyZXNvdXJjZXNDb250IiwidGVhY2hpbmdBIiwiaW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJpbml0dGVhQWNoU3RhIiwibXNnIiwiRG9Nb3ZlIiwiZSIsImhlaWdodCIsInQiLCJ0YXJnZXQiLCIkbGkiLCJzcGVlZCIsInN0YXJOdW0iLCJfdGhpcyIsInNldFRpbWVvdXQiLCJtb3ZlIiwicHJvdG90eXBlIiwiYW5pbWF0ZSIsInRvcCIsInRlYWNoaW5nX3BlcnNvbmFsIiwiY29sb3IiLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImdyaWQiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJjb250YWluTGFiZWwiLCJsZWdlbmQiLCJjbmV0ZXIiLCJpdGVtV2lkdGgiLCJpdGVtSGVpZ2h0IiwieEF4aXMiLCJheGlzTGFiZWwiLCJmb3JtYXR0ZXIiLCJuYW1lIiwiaGlkZVRleHRCeUxlbiIsImF4aXNMaW5lIiwibGluZVN0eWxlIiwiYXhpc1RpY2siLCJzaG93IiwieUF4aXMiLCJzcGxpdExpbmUiLCJ0b29sdGlwIiwidHJpZ2dlciIsImF4aXNQb2ludGVyIiwic2VyaWVzIiwiYmFyV2lkdGgiLCJvcmdOYW1lIiwiZG93bk51bSIsInNldE9wdGlvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsb0JBQWdCO0FBRFg7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxjQUFELENBQVIsRUFBMEIsVUFBVUksV0FBVixFQUF1QjtBQUMvQ0osVUFBUUMsTUFBUixDQUFlRyxXQUFmO0FBQ0FDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsU0FBdkIsRUFBa0MsU0FBbEMsRUFBNkMsUUFBN0MsRUFBdUQsUUFBdkQsRUFBaUUsTUFBakUsQ0FBWCxFQUNFLFVBQVVDLENBQVYsRUFBYUMsUUFBYixFQUF1QkMsT0FBdkIsRUFBZ0NDLE9BQWhDLEVBQXlDQyxNQUF6QyxFQUFpREMsTUFBakQsRUFBeURDLEtBQXpELEVBQWdFO0FBQzlEO0FBQ0FDLGtCQUFjUCxFQUFFLGdCQUFGLENBQWQsRUFBa0MsZ0JBQWxDLEVBQW1ELEVBQW5EOztBQUVBO0FBQ0FRO0FBQ0FDLGVBQVdULEVBQUUsZUFBRixDQUFYLEVBQThCLGVBQTlCOztBQUdBVTtBQUNBO0FBQ0EsYUFBU0EsVUFBVCxHQUFzQjtBQUNwQixVQUFJQyxPQUFPWCxFQUFFLHFCQUFGLENBQVg7QUFDQSxVQUFJWSxVQUFVWixFQUFFLGVBQUYsRUFBbUJhLEtBQW5CLEtBQTZCRixLQUFLRyxNQUFoRDtBQUNBSCxXQUFLRSxL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QUNkLGFBQUssTUFBTDtBQUFjLGlCQUFPLHVDQUFQO0FBQ2QsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUFDYixhQUFLLEtBQUw7QUFBYSxpQkFBTyxzQ0FBUDtBQUNiLGFBQUssS0FBTDtBQUFhLGlCQUFPLHNDQUFQO0FBQ2IsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUFDYixhQUFLLEtBQUw7QUFBYSxpQkFBTyxzQ0FBUDtBQUNiLGFBQUssS0FBTDtBQUFhLGlCQUFPLHNDQUFQO0FBQ2IsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUFDYixhQUFLLE1BQUw7QUFBYyxpQkFBTyx1Q0FBUDtBQUNkLGFBQUssS0FBTDtBQUFhLGlCQUFPLHNDQUFQO0FBQ2IsYUFBSyxJQUFMO0FBQVksaUJBQU8scUNBQVA7QUFDWixhQUFLLEtBQUw7QUFBYSxpQkFBTyxzQ0FBUDtBQUNiLGFBQUssS0FBTDtBQUFhLGlCQUFPLHNDQUFQO0FBQ2IsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUFDYixhQUFLLE1BQUw7QUFBYyxpQkFBTyx1Q0FBUDtBQUNkLGFBQUssT0FBTDtBQUFlLGlCQUFPLHdDQUFQO0FBQ2YsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUFDYixhQUFLLE1BQUw7QUFBYyxpQkFBTyx1Q0FBUDtBQUNkLGFBQUssS0FBTDtBQUFhLGlCQUFPLHNDQUFQO0FBQ2IsYUFBSyxLQUFMO0FBQWEsaUJBQU8sc0NBQVA7QUExQmY7QUE0QkQ7QUFFRixHQTFTSDtBQTJTRCxDQTdTRCIsImZpbGUiOiJyZXNvdXJjZXMvanMvcmVzb3VyY2VzLTc2NTBiZjkzYzkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsncGxhdGZvcm1Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3RlbXBsYXRlJywgJ2VjaGFydHMnLCAnc2VydmljZScsICdmb290ZXInLCAnaGVhZGVyJywgJ3Rvb2wnXSxcclxuICAgIGZ1bmN0aW9uICgkLCB0ZW1wbGF0ZSwgZWNoYXJ0cywgc2VydmljZSwgZm9vdGVyLCBoZWFkZXIsIHRvb2xzKSB7XHJcbiAgICAgIC8v6LWE5rqQ5YiG5LqrXHJcbiAgICAgIHJlc291cmNlU2hhcmUoJCgnI3Jlc291cmNlU2hhcmUnKSwncmVzb3VyY2VTaGFyZV8nLCcnKTtcclxuXHJcbiAgICAgIC8v6LWE5rqQ5Yqo5oCBXHJcbiAgICAgIHRlYWNoaW5nRHluKCk7XHJcbiAgICAgIHRlYWNoaW5nRHQoJCgnI2R5bmFtaWNfbGlzdCcpLCdkeW5hbWljX2xpc3RfJyk7XHJcblxyXG5cclxuICAgICAgdGVhY2hpbmdMVygpO1xyXG4gICAgICAvL+i1hOa6kOWIhuS6q1xyXG4gICAgICBmdW5jdGlvbiB0ZWFjaGluZ0xXKCkge1xyXG4gICAgICAgIHZhciB1bGxpID0gJCgnLnRlYWNoaW5nTGVmdCB1bCBsaScpO1xyXG4gICAgICAgIHZhciB1bFdpZHRoID0gJCgnLnRlYWNoaW5nTGVmdCcpLndpZHRoKCkgLyB1bGxpLmxlbmd0aDtcclxuICAgICAgICB1bGxpLndpZHRoKHVsV2lkdGggLSAxKTtcclxuICAgICAgICB1bGxpLmxhc3QoKS5jc3MoXCJib3JkZXItcmlnaHRcIiwgJ25vbmUnKTtcclxuICAgICAgICB1bGxpLmZpbmQoJ2EnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdsaWFjdCcpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnbGlhY3QnKTtcclxuICAgICAgICAgIHJlc291cmNlU2hhcmUoJCgnI3Jlc291cmNlU2hhcmUnKSwncmVzb3VyY2VTaGFyZV8nLCQodGhpcykuYXR0cigndHlwZScpKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDotYTmupDliIbkuqtcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqIEBwYXJhbSB0eXBlIOi1hOa6kOexu+Wei++8jOexu+Wei+aciTrmlZnmoYg6MTIyOSwg6K++5Lu2OjEyMzAsIOWtpuahiDoxMjMxLCDkvZzkuJov5Lmg6aKYOjE0NTgs57Sg5p2QOjE1NDIs5YW25LuWOjE1MDXjgILlhajpg6jnmoTmg4XlhrXkuI3kvKDov5nkuKrlgLxcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHJlc291cmNlU2hhcmUoJG9iaiwgdGVtSWQsIHR5cGUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLnByZWZpeCArICcvcGYvYXBpL2RpcmVjdC9yZXNJX3VnY1NoYXJlUmVzb3VyY2U/b3JnQ29kZT0nICsgc2VydmljZS5hcHBJZHMuYnlxanlqZ19hcHBJZCArXHJcbiAgICAgICAgICAnJnR5cGU9JysgdHlwZSArICcmcGFnZU51bT0xJnBhZ2VTaXplPTgnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgIHZhciBodG1sO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gKC9bLl0vLmV4ZWMoZGF0YS5kYXRhW2ldLnRpdGxlKSkgPyAvW14uXSskLy5leGVjKGRhdGEuZGF0YVtpXS50aXRsZS50b0xvd2VyQ2FzZSgpKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaV0ucGljID0gZ2V0SW1nVXJsKHRpdGxlWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZSh0ZW1JZCwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBzaG93cHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICRvYmouaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPlui1hOa6kOWIhuS6q+W8guW4uFwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W6LWE5rqQ5YiG5Lqr5byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZShcIiNyZXNvdXJjZVNoYXJlIHN0cm9uZ1wiLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZ2V0UGljUGF0aCgkKHRoaXMpLmF0dHIoJ3Jlc0lkJykpO1xyXG4gICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOagueaNruWbvueJh0lE6L+U5Zue5Zu+54mH6Lev5b6EXHJcbiAgICAgICAqIEBwYXJhbSBpZCDlm77niYdJRFxyXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDlm77niYfot6/lvoRcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldFBpY1BhdGgoaWQpIHtcclxuICAgICAgICByZXR1cm4gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10uc3Vic3RyaW5nKDAsIDQpID09PSAnaHR0cCcgPyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5cclxuICAgICAgICByZXBsYWNlKCcjcmVzaWQjJywgaWQpIDogKHNlcnZpY2UucHJlZml4ICsgc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10ucmVwbGFjZSgnI3Jlc2lkIycsIGlkKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDotYTmupDliqjmgIFcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiB0ZWFjaGluZ0R0KCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5wcmVmaXggKyAnL3BmL2FwaS9kaXJlY3QvcmVzSV9zaGFyZUR5bmFtaWM/b3JnQ29kZT0nICsgc2VydmljZS5hcHBJZHMuYnlxanlqZ19hcHBJZCsnJnBhZ2VOdW09MSZwYWdlU2l6ZT0xMCcsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGh0bWw7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gKC9bLl0vLmV4ZWMoZGF0YS5kYXRhW2ldLnRpdGxlKSkgPyAvW14uXSskLy5leGVjKGRhdGEuZGF0YVtpXS50aXRsZS50b0xvd2VyQ2FzZSgpKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaV0ucGljID0gZ2V0SW1nVXJsKHRpdGxlWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZSh0ZW1JZCwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBzaG93cHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICRvYmouaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICB0ZWFjaGluZ0R5bigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W6LWE5rqQ5Yqo5oCB5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5botYTmupDliqjmgIHlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICByZXNvdXJjZXNDb250KCk7XHJcbiAgICAgIGZ1bmN0aW9uIHJlc291cmNlc0NvbnQoKSB7XHJcbiAgICAgICAgdGVhY2hpbmdBID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFBY2hTdGEnKSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5wcmVmaXggKyAnL3BmL2FwaS9kaXJlY3QvcmVzSV9zY2hvb2xSZXNSYW5raW5nP29yZ0NvZGU9JytzZXJ2aWNlLmFwcElkcy5ieXFqeWpnX2FwcElkICsnJnBhZ2VOdW09MSZwYWdlU2l6ZT04JyxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5zdWNjZXNzID09IHRydWUpIHtcclxuICAgICAgICAgICAgICBpbml0dGVhQWNoU3RhKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KGRhdGEubXNnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAvL+i1hOa6kOWKqOaAgVxyXG4gICAgICBmdW5jdGlvbiB0ZWFjaGluZ0R5bigpIHtcclxuICAgICAgICBuZXcgRG9Nb3ZlKCQoJyNkeW5hbWljX2xpc3QnKSwgODksIDApO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgLy/liJfooajlvqrnjq9cclxuICAgICAgZnVuY3Rpb24gRG9Nb3ZlKGUsIGhlaWdodCwgdCkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZTtcclxuICAgICAgICB0aGlzLnRhcmdldC5jc3Moeydwb3NpdGlvbic6ICdyZWxhdGl2ZSd9KTtcclxuICAgICAgICB0aGlzLiRsaSA9IGUuY2hpbGRyZW4oKTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuJGxpLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCA1MDtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMTAwMDtcclxuICAgICAgICB0aGlzLnN0YXJOdW0gPSAwO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID49IDQpIHtcclxuICAgICAgICAgIHRoaXMudGFyZ2V0Lmh0bWwodGhpcy50YXJnZXQuaHRtbCgpICsgdGhpcy50YXJnZXQuaHRtbCgpKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5tb3ZlKCk7XHJcbiAgICAgICAgICB9LCB0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIERvTW92ZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3Rhck51bSsrO1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXJOdW0gPiB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5zdGFyTnVtID0gMTtcclxuICAgICAgICAgIHRoaXMudGFyZ2V0LmNzcygndG9wJywgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICB0b3A6ICctJyArIHRoaXMuc3Rhck51bSAqIHRoaXMuaGVpZ2h0ICsgJ3B4J1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoaXMuc3BlZWQsXHJcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgIF90aGlzLm1vdmUoX3RoaXMuc3Rhck51bSlcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWFrOeUqOayoeacieWGheWuueaWueazlVxyXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2hvd3Byb21wdCgpIHtcclxuICAgICAgICByZXR1cm4gXCI8cCBpZD0nbm8tY29udGVudCc+5rKh5pyJ5oKo5p+l55yL55qE5YaF5a65PC9wPlwiO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy/lubPlj7DotYTmupDnu5/orqHliJ3lp4vljJbmn7Hnirblm75cclxuICAgICAgZnVuY3Rpb24gaW5pdHRlYUFjaFN0YShkYXRhKSB7XHJcbiAgICAgICAgdmFyIHRlYWNoaW5nQSA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVhQWNoU3RhJykpO1xyXG4gICAgICAgIHZhciB0ZWFjaGluZ19wZXJzb25hbCA9IHtcclxuICAgICAgICAgIGNvbG9yOiBbXCIjNTZiMWYwXCIsIFwiI2ZmNjY2ZVwiXSxcclxuICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICBjb2xvcjogJyMyZjJmMmYnLFxyXG4gICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgIHJpZ2h0OiAnMSUnLFxyXG4gICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICBjbmV0ZXI6IDEwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAwLFxyXG4gICAgICAgICAgICBpdGVtV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBpdGVtSGVpZ2h0OiAyMCxcclxuICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzJmMmYyZlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGE6IFtcIuS4iuS8oOmHj1wiLCBcIuS4i+i9vemHj1wiXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHhBeGlzOiBbe1xyXG4gICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xzLmhpZGVUZXh0QnlMZW4obmFtZSwgMTIpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2M5YzljOSdcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjYzljOWM5JyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2M5YzljOSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHsgLy8g5Z2Q5qCH6L205oyH56S65Zmo77yM5Z2Q5qCH6L206Kem5Y+R5pyJ5pWIXHJcbiAgICAgICAgICAgICAgdHlwZTogJ3NoYWRvdycgLy8g6buY6K6k5Li655u057q/77yM5Y+v6YCJ5Li677yaJ2xpbmUnIHwgJ3NoYWRvdydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNlcmllczogW3tcclxuICAgICAgICAgICAgbmFtZTogJ+S4iuS8oOmHjycsXHJcbiAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICBiYXJXaWR0aDogMjQsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIG5hbWU6ICfkuIvovb3ph48nLFxyXG4gICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgYmFyV2lkdGg6IDI0LFxyXG4gICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB0ZWFjaGluZ19wZXJzb25hbC54QXhpc1swXS5kYXRhW2ldID0gZGF0YS5kYXRhW2ldLm9yZ05hbWU7XHJcbiAgICAgICAgICB0ZWFjaGluZ19wZXJzb25hbC5zZXJpZXNbMF0uZGF0YVtpXSA9IGRhdGEuZGF0YVtpXS5kb3duTnVtO1xyXG4gICAgICAgICAgdGVhY2hpbmdfcGVyc29uYWwuc2VyaWVzWzFdLmRhdGFbaV0gPSBkYXRhLmRhdGFbaV0uZG93bk51bTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIHRlYWNoaW5nQS5zZXRPcHRpb24odGVhY2hpbmdfcGVyc29uYWwpO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0SW1nVXJsKHR5cGUpe1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSl7XHJcbiAgICAgICAgICBjYXNlIFwiZG9jXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvZG9jLnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiZXhjZWxcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS9leGNlbC5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcImRvY3hcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS9kb2N4LnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiZmx2XCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvZmx2LnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiZ2lmXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvZ2lmLnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiaHRtbFwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL2h0bWwucG5nJztcclxuICAgICAgICAgIGNhc2UgXCJqcGVnXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvanBlZy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcImpwZ1wiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL2pwZy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcIm1wM1wiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL21wMy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcIm1wNFwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL21wNC5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInBkZlwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3BkZi5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInBuZ1wiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3BuZy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInRpZlwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3BuZy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInBwdFwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3BwdC5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInBwdHhcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS9wcHR4LnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwicmFyXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvcmFyLnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwicm1cIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS9ybS5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInN3ZlwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3N3Zi5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInR4dFwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3R4dC5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcIndhdlwiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3dhdi5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcIndvcmRcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS93b3JkLnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwieGh0bWxcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS94aHRtbC5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInhsc1wiIDogcmV0dXJuICcuLi8uLi93d3cvcHVibGljL2ltYWdlcy9iYXNlL3hscy5wbmcnO1xyXG4gICAgICAgICAgY2FzZSBcInhsc3hcIiA6IHJldHVybiAnLi4vLi4vd3d3L3B1YmxpYy9pbWFnZXMvYmFzZS94bHN4LnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiemlwXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvemlwLnBuZyc7XHJcbiAgICAgICAgICBjYXNlIFwiYm1wXCIgOiByZXR1cm4gJy4uLy4uL3d3dy9wdWJsaWMvaW1hZ2VzL2Jhc2UvYm1wLnBuZydcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxufSk7XHJcblxyXG5cclxuXHJcbiJdfQ==
