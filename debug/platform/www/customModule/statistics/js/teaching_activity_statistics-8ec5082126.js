'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common', 'select'], function ($, service, common, select) {
    $('body').on('click', '#schoolYear li', function () {
      if ($(this).index() != 0) {
        $('#fqActivityNum').next().find('li').hide().eq(0).show();
        $('#cyActivityNum').next().find('li').hide().eq(0).show();
        $('#fqActivityNum span,#cyActivityNum span').text('全学年');
      } else {
        $('#fqActivityNum').next().find('li').show();
        $('#cyActivityNum').next().find('li').show();
      }
    });

    //各区发起的活动数量对比
    var echart_achievements_num = common.echart.init(document.getElementById('achievements_num'));

    //活动参与情况  学校管理员
    var echart_achievements_num1 = common.echart.init(document.getElementById('achievements_num1'));

    //各区活动参与情况对比
    var echart_activity_partake = common.echart.init(document.getElementById('activity_partake'));

    //各区活动参与情况对比
    var echart_activity_partake1 = common.echart.init(document.getElementById('activity_partake1'));

    function render(data, category) {
      switch (category) {
        case 'achievements_num':
          {
            var echart_achievements_n = {
              color: ["#00beff", "#d4588f"],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                right: 10,
                width: 400,
                itemWidth: 25,
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ['活动发起数量']
              },
              xAxis: [{
                type: 'category',
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
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
                    color: '#3e4370'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
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
                name: '',
                type: 'bar',
                barWidth: 22,
                data: []
              }]
            };

            for (var i = 0; i < data.length; i++) {
              echart_achievements_n.xAxis[0].data[i] = data[i].areaName;
              echart_achievements_n.series[0].data[i] = data[i].count;
            }
            echart_achievements_num.setOption(echart_achievements_n);
            common.echart.hideLoading(echart_achievements_num);
            break;
          }
        case 'achievements_num1':
          {
            var echart_achievements_n1 = {
              color: ["#00beff", "#d4588f"],
              textStyle: {
                color: '#92accf',
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
                right: 10,
                width: 400,
                itemWidth: 25,
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ['活动发起数量']
              },
              xAxis: [{
                type: 'category',
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisTick: {
                  show: false
                },
                data: ["教学研讨", "在线观课", "专家指导", "校际教研", "课堂教学评价"]
              }],
              yAxis: [{
                type: 'value',
                splitLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
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
                name: '',
                type: 'bar',
                barWidth: 22,
                data: [data.jxyt_join, data.zxgk_join, data.zjzd_join, data.xjjy_area_join, data.ktpj_join]
              }]
            };

            echart_achievements_num1.setOption(echart_achievements_n1);
            common.echart.hideLoading(echart_achievements_num1);
            break;
          }
        case 'activity_partake':
          {
            var echart_activity_p = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                textStyle: {
                  color: "#d7d7d7"
                },
                data: []
              },
              calculable: true,
              xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisTick: {
                  alignWithLabel: true
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 12,
                    color: '#92accf'
                  }
                },
                data: []
              }],
              yAxis: [{
                type: 'value',
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 12,
                    color: '#92accf'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                }
              }],
              series: [{
                name: '参与数',
                type: 'line',
                stack: '总量',
                itemStyle: {
                  normal: {
                    color: '#ff3f66',
                    lineStyle: {
                      color: '#ff3f66'
                    }
                  }
                },
                areaStyle: { normal: {} },
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              echart_activity_p.xAxis[0].data[i] = data[i].date;
              echart_activity_p.series[0].data[i] = data[i].count;
            }
            echart_activity_partake.setOption(echart_activity_p);
            common.echart.hideLoading(echart_activity_partake);
            break;
          }
      }
    }

    /**
     * @description       各区域发起的活动数量
     * @param areaId      市id
     * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param phaseId     学段id
     * @param subjectId   学科id
     * @param gradeId     年级id
     * @param schoolYear  学年
     */

    function fqActivityNum(time, phaseId, subjectId, gradeId, schoolYear) {
      echart_achievements_num = common.echart.init(document.getElementById('achievements_num'));
      common.echart.showLoading(echart_achievements_num);

      echart_achievements_num1 = common.echart.init(document.getElementById('achievements_num1'));
      common.echart.showLoading(echart_achievements_num1);
      var url = "";
      if (common.role == 'city') {
        url = '/jy/open?path=/api/statistic/area/areatotal_issue_area?areaId=' + common.areaid;
      } else if (common.role == 'county') {
        url = '/jy/open?path=/api/statistic/area/areatotal_issue_date?areaId=' + common.areaid;
      } else if (common.role == 'school') {
        url = '/jy/open?path=/api/statistic/org/sch_area_data?orgId=' + common.orgid;
      }
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=achievements_num_wrap').success(function (result) {
        if (result['code'] == 1) {
          if (common.role == 'school') {
            render(result.data, 'achievements_num1');
          } else {
            render(result.data, 'achievements_num');
          }
        }
      });
    }

    $('body').on('selectChange', '#fqActivityNum', function () {
      fqActivityNum($('#fqActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    /**
     * @description       区域活动参与数量
     * @param areaId      市id
     * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param phaseId     学段id
     * @param subjectId   学科id
     * @param gradeId     年级id
     * @param schoolYear  学年
     */

    function cyActivityNum(time, phaseId, subjectId, gradeId, schoolYear) {
      echart_activity_partake = common.echart.init(document.getElementById('activity_partake'));
      common.echart.showLoading(echart_activity_partake);
      var url = "";
      if (common.role == 'city') {
        url = '/jy/open?path=/api/statistic/area/areatotal_join_area?areaId=' + common.areaid;
      } else if (common.role == 'county') {
        url = '/jy/open?path=/api/statistic/area/areatotal_join_date?areaId=' + common.areaid;
      } else if (common.role == 'school') {
        url = '/jy/open?path=/api/statistic/org/sch_area_data_trend?orgId=' + common.orgid;
      }
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=activity_partake_wrap').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'activity_partake');
        }
      });
    }

    $('body').on('selectChange', '#cyActivityNum', function () {
      cyActivityNum($('#cyActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    $('body').on('click', '#searchBtn', function () {
      fqActivityNum($('#fqActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));

      cyActivityNum($('#cyActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });
    $('#searchBtn').trigger('click');
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3RlYWNoaW5nX2FjdGl2aXR5X3N0YXRpc3RpY3MuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJjb21tb24iLCJzZWxlY3QiLCJvbiIsImluZGV4IiwibmV4dCIsImZpbmQiLCJoaWRlIiwiZXEiLCJzaG93IiwidGV4dCIsImVjaGFydF9hY2hpZXZlbWVudHNfbnVtIiwiZWNoYXJ0IiwiaW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJlY2hhcnRfYWNoaWV2ZW1lbnRzX251bTEiLCJlY2hhcnRfYWN0aXZpdHlfcGFydGFrZSIsImVjaGFydF9hY3Rpdml0eV9wYXJ0YWtlMSIsInJlbmRlciIsImRhdGEiLCJjYXRlZ29yeSIsImVjaGFydF9hY2hpZXZlbWVudHNfbiIsImNvbG9yIiwidGV4dFN0eWxlIiwiZm9udFNpemUiLCJncmlkIiwidG9wIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwiY29udGFpbkxhYmVsIiwibGVnZW5kIiwid2lkdGgiLCJpdGVtV2lkdGgiLCJ4QXhpcyIsInR5cGUiLCJheGlzTGFiZWwiLCJheGlzTGluZSIsImxpbmVTdHlsZSIsImF4aXNUaWNrIiwieUF4aXMiLCJzcGxpdExpbmUiLCJ0b29sdGlwIiwidHJpZ2dlciIsImF4aXNQb2ludGVyIiwic2VyaWVzIiwibmFtZSIsImJhcldpZHRoIiwiaSIsImxlbmd0aCIsImFyZWFOYW1lIiwiY291bnQiLCJzZXRPcHRpb24iLCJoaWRlTG9hZGluZyIsImVjaGFydF9hY2hpZXZlbWVudHNfbjEiLCJqeHl0X2pvaW4iLCJ6eGdrX2pvaW4iLCJ6anpkX2pvaW4iLCJ4amp5X2FyZWFfam9pbiIsImt0cGpfam9pbiIsImVjaGFydF9hY3Rpdml0eV9wIiwiY2FsY3VsYWJsZSIsImJvdW5kYXJ5R2FwIiwiYWxpZ25XaXRoTGFiZWwiLCJzdGFjayIsIml0ZW1TdHlsZSIsIm5vcm1hbCIsImFyZWFTdHlsZSIsImRhdGUiLCJmcUFjdGl2aXR5TnVtIiwidGltZSIsInBoYXNlSWQiLCJzdWJqZWN0SWQiLCJncmFkZUlkIiwic2Nob29sWWVhciIsInNob3dMb2FkaW5nIiwidXJsIiwicm9sZSIsImFyZWFpZCIsIm9yZ2lkIiwiZ2V0SlNPTiIsInByZWZpeCIsInN1Y2Nlc3MiLCJyZXN1bHQiLCJhdHRyIiwiY3lBY3Rpdml0eU51bSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsa0JBQWM7QUFEVDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLFlBQUQsQ0FBUixFQUF3QixVQUFVSSxXQUFWLEVBQXVCO0FBQzdDO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjs7QUFFQUMsU0FBTyxFQUFQLEVBQVcsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixRQUF0QixFQUFnQyxRQUFoQyxDQUFYLEVBQ0UsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxNQUF0QixFQUE4QkMsTUFBOUIsRUFBc0M7QUFDcENILE1BQUUsTUFBRixFQUFVSSxFQUFWLENBQWEsT0FBYixFQUFzQixnQkFBdEIsRUFBd0MsWUFBWTtBQUNsRCxVQUFJSixFQUFFLElBQUYsRUFBUUssS0FBUixNQUFtQixDQUF2QixFQUEwQjtBQUN4QkwsVUFBRSxnQkFBRixFQUFvQk0sSUFBcEIsR0FBMkJDLElBQTNCLENBQWdDLElBQWhDLEVBQXNDQyxJQUF0QyxHQUE2Q0MsRUFBN0MsQ0FBZ0QsQ0FBaEQsRUFBbURDLElBQW5EO0FBQ0FWLFVBQUUsZ0JBQUYsRUFBb0JNLElBQXBCLEdBQTJCQyxJQUEzQixDQUFnQyxJQUFoQyxFQUFzQ0MsSUFBdEMsR0FBNkNDLEVBQTdDLENBQWdELENBQWhELEVBQW1EQyxJQUFuRDtBQUNBVixVQUFFLHlDQUFGLEVBQTZDVyxJQUE3QyxDQUFrRCxLQUFsRDtB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dEYsRUFBRSx3QkFBRixFQUE0QnNGLElBQTVCLENBQWlDLFlBQWpDLENBRjdDOztBQUlBQyxvQkFBY3ZGLEVBQUUsZ0JBQUYsRUFBb0JzRixJQUFwQixDQUF5QixZQUF6QixDQUFkLEVBQXNEdEYsRUFBRSwwQkFBRixFQUE4QnNGLElBQTlCLENBQW1DLFlBQW5DLENBQXRELEVBQ0V0RixFQUFFLHFCQUFGLEVBQXlCc0YsSUFBekIsQ0FBOEIsWUFBOUIsQ0FERixFQUVFdEYsRUFBRSxtQkFBRixFQUF1QnNGLElBQXZCLENBQTRCLFlBQTVCLENBRkYsRUFFNkN0RixFQUFFLHdCQUFGLEVBQTRCc0YsSUFBNUIsQ0FBaUMsWUFBakMsQ0FGN0M7QUFHRCxLQVJEO0FBU0F0RixNQUFFLFlBQUYsRUFBZ0I2QyxPQUFoQixDQUF3QixPQUF4QjtBQUNELEdBM1dIO0FBNFdELENBaFhEIiwiZmlsZSI6ImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3RlYWNoaW5nX2FjdGl2aXR5X3N0YXRpc3RpY3MtOGVjNTA4MjEyNi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICdjb21tb24nLCAnc2VsZWN0J10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgY29tbW9uLCBzZWxlY3QpIHtcclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjc2Nob29sWWVhciBsaScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5pbmRleCgpICE9IDApIHtcclxuICAgICAgICAgICQoJyNmcUFjdGl2aXR5TnVtJykubmV4dCgpLmZpbmQoJ2xpJykuaGlkZSgpLmVxKDApLnNob3coKTtcclxuICAgICAgICAgICQoJyNjeUFjdGl2aXR5TnVtJykubmV4dCgpLmZpbmQoJ2xpJykuaGlkZSgpLmVxKDApLnNob3coKTtcclxuICAgICAgICAgICQoJyNmcUFjdGl2aXR5TnVtIHNwYW4sI2N5QWN0aXZpdHlOdW0gc3BhbicpLnRleHQoJ+WFqOWtpuW5tCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcjZnFBY3Rpdml0eU51bScpLm5leHQoKS5maW5kKCdsaScpLnNob3coKTtcclxuICAgICAgICAgICQoJyNjeUFjdGl2aXR5TnVtJykubmV4dCgpLmZpbmQoJ2xpJykuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL+WQhOWMuuWPkei1t+eahOa0u+WKqOaVsOmHj+WvueavlFxyXG4gICAgICB2YXIgZWNoYXJ0X2FjaGlldmVtZW50c19udW0gPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjaGlldmVtZW50c19udW0nKSk7XHJcblxyXG4gICAgICAvL+a0u+WKqOWPguS4juaDheWGtSAg5a2m5qCh566h55CG5ZGYXHJcbiAgICAgIHZhciBlY2hhcnRfYWNoaWV2ZW1lbnRzX251bTEgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjaGlldmVtZW50c19udW0xJykpO1xyXG5cclxuICAgICAgLy/lkITljLrmtLvliqjlj4LkuI7mg4XlhrXlr7nmr5RcclxuICAgICAgdmFyIGVjaGFydF9hY3Rpdml0eV9wYXJ0YWtlID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpdml0eV9wYXJ0YWtlJykpO1xyXG5cclxuICAgICAgLy/lkITljLrmtLvliqjlj4LkuI7mg4XlhrXlr7nmr5RcclxuICAgICAgdmFyIGVjaGFydF9hY3Rpdml0eV9wYXJ0YWtlMSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZpdHlfcGFydGFrZTEnKSk7XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgY2FzZSAnYWNoaWV2ZW1lbnRzX251bSc6IHtcclxuICAgICAgICAgICAgdmFyIGVjaGFydF9hY2hpZXZlbWVudHNfbiA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogW1wiIzAwYmVmZlwiLCBcIiNkNDU4OGZcIl0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxNSUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzElJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMiUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAxMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MDAsXHJcbiAgICAgICAgICAgICAgICBpdGVtV2lkdGg6IDI1LFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNkN2Q3ZDdcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsn5rS75Yqo5Y+R6LW35pWw6YePJ11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICBheGlzUG9pbnRlcjogeyAvLyDlnZDmoIfovbTmjIfnpLrlmajvvIzlnZDmoIfovbTop6blj5HmnInmlYhcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3NoYWRvdycgLy8g6buY6K6k5Li655u057q/77yM5Y+v6YCJ5Li677yaJ2xpbmUnIHwgJ3NoYWRvdydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICBiYXJXaWR0aDogMjIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgZWNoYXJ0X2FjaGlldmVtZW50c19uLnhBeGlzWzBdLmRhdGFbaV0gPSBkYXRhW2ldLmFyZWFOYW1lO1xyXG4gICAgICAgICAgICAgIGVjaGFydF9hY2hpZXZlbWVudHNfbi5zZXJpZXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWNoYXJ0X2FjaGlldmVtZW50c19udW0uc2V0T3B0aW9uKGVjaGFydF9hY2hpZXZlbWVudHNfbik7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X2FjaGlldmVtZW50c19udW0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ2FjaGlldmVtZW50c19udW0xJzoge1xyXG4gICAgICAgICAgICB2YXIgZWNoYXJ0X2FjaGlldmVtZW50c19uMSA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogW1wiIzAwYmVmZlwiLCBcIiNkNDU4OGZcIl0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxNSUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzElJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAxMCxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiA0MDAsXHJcbiAgICAgICAgICAgICAgICBpdGVtV2lkdGg6IDI1LFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNkN2Q3ZDdcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsn5rS75Yqo5Y+R6LW35pWw6YePJ11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW1wi5pWZ5a2m56CU6K6oXCIsIFwi5Zyo57q/6KeC6K++XCIsIFwi5LiT5a625oyH5a+8XCIsIFwi5qCh6ZmF5pWZ56CUXCIsIFwi6K++5aCC5pWZ5a2m6K+E5Lu3XCJdXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHsgLy8g5Z2Q5qCH6L205oyH56S65Zmo77yM5Z2Q5qCH6L206Kem5Y+R5pyJ5pWIXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnIC8vIOm7mOiupOS4uuebtOe6v++8jOWPr+mAieS4uu+8midsaW5lJyB8ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgYmFyV2lkdGg6IDIyLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW2RhdGEuanh5dF9qb2luLCBkYXRhLnp4Z2tfam9pbiwgZGF0YS56anpkX2pvaW4sIGRhdGEueGpqeV9hcmVhX2pvaW4sIGRhdGEua3Rwal9qb2luXVxyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBlY2hhcnRfYWNoaWV2ZW1lbnRzX251bTEuc2V0T3B0aW9uKGVjaGFydF9hY2hpZXZlbWVudHNfbjEpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9hY2hpZXZlbWVudHNfbnVtMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnYWN0aXZpdHlfcGFydGFrZSc6IHtcclxuICAgICAgICAgICAgdmFyIGVjaGFydF9hY3Rpdml0eV9wID0ge1xyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTUlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzIlJyxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzMlJyxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2Q3ZDdkN1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflj4LkuI7mlbAnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrOiAn5oC76YePJyxcclxuICAgICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZjNmNjYnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmM2Y2NidcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGFyZWFTdHlsZToge25vcm1hbDoge319LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgZWNoYXJ0X2FjdGl2aXR5X3AueEF4aXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uZGF0ZTtcclxuICAgICAgICAgICAgICBlY2hhcnRfYWN0aXZpdHlfcC5zZXJpZXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWNoYXJ0X2FjdGl2aXR5X3BhcnRha2Uuc2V0T3B0aW9uKGVjaGFydF9hY3Rpdml0eV9wKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfYWN0aXZpdHlfcGFydGFrZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiAgICAgICDlkITljLrln5/lj5HotbfnmoTmtLvliqjmlbDph49cclxuICAgICAgICogQHBhcmFtIGFyZWFJZCAgICAgIOW4gmlkXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lICAgICAgICDml7bpl7TmrrUoeWVzdGVyZGF5OuaYqOWkqe+8jGxhc3RzZXZlbu+8muacgOi/keS4g+Wkqe+8jGxhc3R0aGlydHnvvJrmnIDov5HkuInljYHlpKkpXHJcbiAgICAgICAqIEBwYXJhbSBwaGFzZUlkICAgICDlrabmrrVpZFxyXG4gICAgICAgKiBAcGFyYW0gc3ViamVjdElkICAg5a2m56eRaWRcclxuICAgICAgICogQHBhcmFtIGdyYWRlSWQgICAgIOW5tOe6p2lkXHJcbiAgICAgICAqIEBwYXJhbSBzY2hvb2xZZWFyICDlrablubRcclxuICAgICAgICovXHJcblxyXG4gICAgICBmdW5jdGlvbiBmcUFjdGl2aXR5TnVtKHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgZ3JhZGVJZCwgc2Nob29sWWVhcikge1xyXG4gICAgICAgIGVjaGFydF9hY2hpZXZlbWVudHNfbnVtID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY2hpZXZlbWVudHNfbnVtJykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X2FjaGlldmVtZW50c19udW0pO1xyXG5cclxuICAgICAgICBlY2hhcnRfYWNoaWV2ZW1lbnRzX251bTEgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjaGlldmVtZW50c19udW0xJykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X2FjaGlldmVtZW50c19udW0xKTtcclxuICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICBpZiAoY29tbW9uLnJvbGUgPT0gJ2NpdHknKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2FyZWF0b3RhbF9pc3N1ZV9hcmVhP2FyZWFJZD0nICsgY29tbW9uLmFyZWFpZDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbW1vbi5yb2xlID09ICdjb3VudHknKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2FyZWF0b3RhbF9pc3N1ZV9kYXRlP2FyZWFJZD0nICsgY29tbW9uLmFyZWFpZDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbW1vbi5yb2xlID09ICdzY2hvb2wnKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9vcmcvc2NoX2FyZWFfZGF0YT9vcmdJZD0nICsgY29tbW9uLm9yZ2lkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyB1cmwgKyAnJnRpbWU9JyArIHRpbWUgKyAnJnBoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJnN1YmplY3RJZD0nICsgc3ViamVjdElkICtcclxuICAgICAgICAgICcmZ3JhZGVJZD0nICsgZ3JhZGVJZCArICcmc2Nob29sWWVhcj0nICsgc2Nob29sWWVhciArICcmZXJyb3JEb21JZD1hY2hpZXZlbWVudHNfbnVtX3dyYXAnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbW9uLnJvbGUgPT0gJ3NjaG9vbCcpIHtcclxuICAgICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnYWNoaWV2ZW1lbnRzX251bTEnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ2FjaGlldmVtZW50c19udW0nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyNmcUFjdGl2aXR5TnVtJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGZxQWN0aXZpdHlOdW0oJCgnI2ZxQWN0aXZpdHlOdW0nKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNncmFkZSAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5Yy65Z+f5rS75Yqo5Y+C5LiO5pWw6YePXHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQgICAgICDluIJpZFxyXG4gICAgICAgKiBAcGFyYW0gdGltZSAgICAgICAg5pe26Ze05q61KHllc3RlcmRheTrmmKjlpKnvvIxsYXN0c2V2ZW7vvJrmnIDov5HkuIPlpKnvvIxsYXN0dGhpcnR577ya5pyA6L+R5LiJ5Y2B5aSpKVxyXG4gICAgICAgKiBAcGFyYW0gcGhhc2VJZCAgICAg5a2m5q61aWRcclxuICAgICAgICogQHBhcmFtIHN1YmplY3RJZCAgIOWtpuenkWlkXHJcbiAgICAgICAqIEBwYXJhbSBncmFkZUlkICAgICDlubTnuqdpZFxyXG4gICAgICAgKiBAcGFyYW0gc2Nob29sWWVhciAg5a2m5bm0XHJcbiAgICAgICAqL1xyXG5cclxuICAgICAgZnVuY3Rpb24gY3lBY3Rpdml0eU51bSh0aW1lLCBwaGFzZUlkLCBzdWJqZWN0SWQsIGdyYWRlSWQsIHNjaG9vbFllYXIpIHtcclxuICAgICAgICBlY2hhcnRfYWN0aXZpdHlfcGFydGFrZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZpdHlfcGFydGFrZScpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9hY3Rpdml0eV9wYXJ0YWtlKTtcclxuICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICBpZiAoY29tbW9uLnJvbGUgPT0gJ2NpdHknKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2FyZWF0b3RhbF9qb2luX2FyZWE/YXJlYUlkPScgKyBjb21tb24uYXJlYWlkO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29tbW9uLnJvbGUgPT0gJ2NvdW50eScpIHtcclxuICAgICAgICAgIHVybCA9ICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL2FyZWEvYXJlYXRvdGFsX2pvaW5fZGF0ZT9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvb3JnL3NjaF9hcmVhX2RhdGFfdHJlbmQ/b3JnSWQ9JyArIGNvbW1vbi5vcmdpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgdXJsICsgJyZ0aW1lPScgKyB0aW1lICsgJyZwaGFzZUlkPScgKyBwaGFzZUlkICsgJyZzdWJqZWN0SWQ9JyArIHN1YmplY3RJZCArXHJcbiAgICAgICAgICAnJmdyYWRlSWQ9JyArIGdyYWRlSWQgKyAnJnNjaG9vbFllYXI9JyArIHNjaG9vbFllYXIgKyAnJmVycm9yRG9tSWQ9YWN0aXZpdHlfcGFydGFrZV93cmFwJylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnYWN0aXZpdHlfcGFydGFrZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyNjeUFjdGl2aXR5TnVtJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN5QWN0aXZpdHlOdW0oJCgnI2N5QWN0aXZpdHlOdW0nKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNncmFkZSAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI3NlYXJjaEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmcUFjdGl2aXR5TnVtKCQoJyNmcUFjdGl2aXR5TnVtJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI2dyYWRlIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG5cclxuICAgICAgICBjeUFjdGl2aXR5TnVtKCQoJyNjeUFjdGl2aXR5TnVtJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI2dyYWRlIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnI3NlYXJjaEJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICB9KTtcclxufSkiXX0=
