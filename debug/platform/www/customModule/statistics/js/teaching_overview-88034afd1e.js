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

  define('', ['jquery', 'service', 'common', 'select', 'page'], function ($, service, common, select, Page) {
    //切换不是当前学年的时候，不可查看最近七天，最近三十天
    $('body').on('click', '#schoolYear li', function () {
      if ($(this).index() != 0) {
        $('#totalSelect').next().find('li').hide().eq(0).show();
        $('#totalSelectTrend').next().find('li').hide().eq(0).show();
        $('#citySelect').next().find('li').hide().eq(0).show();
        $('#totalSelect span,#totalSelectTrend span,#citySelect span').text('全学年');
      } else {
        $('#totalSelect').next().find('li').show();
        $('#totalSelectTrend').next().find('li').show();
        $('#citySelect').next().find('li').show();
      }
    });
    //各区域成果总量占比
    var echart_regionalResults = common.echart.init(document.getElementById('regionalResults'));

    //教研成果总量统计
    var echart_teaching_a_trend = common.echart.init(document.getElementById('teaching_achievements_trend'));

    //教研成果增长趋势
    var teaching_a_increase_trend = common.echart.init(document.getElementById('teaching_achievement_increase_trend'));

    function render(data, category) {
      switch (category) {
        case 'regionalResults':
          {
            var option_regionalResults = {
              color: ["#ff3f66", "#fb8b1b", "#fdd51d", "#a5d67b", "#5ab57c", "#0fcbe6", "#448cfb", "#456fde", "#8054cd", "#b652cc"],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                itemGap: 17,
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: []
              },
              series: [{
                name: '各区域成果总量占比',
                type: 'pie',
                radius: '60%',
                center: ['60%', '45%'],
                data: [],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            };
            for (var i = 0; i < data.pageList.datalist.length; i++) {
              var obj = {};
              obj['value'] = data.pageList.datalist[i].count;
              obj['name'] = data.pageList.datalist[i].areaName;
              option_regionalResults.series[0].data.push(obj);
              option_regionalResults.legend.data[i] = data.pageList.datalist[i].areaName;
            }
            echart_regionalResults.setOption(option_regionalResults);
            common.echart.hideLoading(echart_regionalResults);
            break;
          }
        case 'teaching_achievements_trend':
          {
            var teaching_achievements_t = {
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
                data: ["总量统计"]
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
                name: '',
                type: 'line',
                stack: '总量',
                itemStyle: {
                  normal: {
                    color: '#51b873',
                    lineStyle: {
                      color: '#51b873'
                    }
                  }
                },
                areaStyle: { normal: {} },
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              teaching_achievements_t.xAxis[0].data[i] = data[i].date;
              teaching_achievements_t.series[0].data[i] = data[i].count;
            }
            echart_teaching_a_trend.setOption(teaching_achievements_t);
            common.echart.hideLoading(echart_teaching_a_trend);
            break;
          }
        case 'teaching_achievement_increase_trend':
          {
            var teaching_achievement_increase_t = {
              color: ['#00bfff'],
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
                name: '',
                type: 'line',
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              teaching_achievement_increase_t.xAxis[0].data[i] = data[i].date;
              teaching_achievement_increase_t.series[0].data[i] = data[i].count;
            }
            teaching_a_increase_trend.setOption(teaching_achievement_increase_t);
            common.echart.hideLoading(teaching_a_increase_trend);
            break;
          }
      }
    }

    /**
     * @description       各区域教研成果总量
     * @param areaId      市id
     * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param phaseId     学段id
     * @param subjectId   学科id
     * @param schoolYear  学年
     */
    var currentPage = 1;

    function resultComparison(time, phaseId, subjectId, schoolYear, currentPage, isPaging) {
      currentPage = currentPage || 1;
      if (!isPaging) {
        echart_regionalResults = common.echart.init(document.getElementById('regionalResults'));
        common.echart.showLoading(echart_regionalResults);
      }
      $.getJSON(service.prefix + '/jy/open?path=/api/statistic/area/city_total_area?areaId=' + common.areaid + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&schoolYear=' + schoolYear + '&currentPage=' + currentPage + '&errorDomId=regionalResultsWrap').success(function (result) {
        if (result['code'] == 1) {
          if (!isPaging) {
            render(result.data, 'regionalResults');
          }
          var html = "";
          $.each(result.data.pageList.datalist, function (index, item) {
            var cls = '';
            if (index + (currentPage - 1) * 10 < 3) {
              cls = 'num1';
            }
            html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" + ((currentPage - 1) * 10 + (index + 1)) + "</span><strong class='strong' title='" + item.areaName + "'>" + "" + item.areaName + "</strong></td>" + " <td>" + item.count + "</td><td>" + (item.count / (result.data.allCount || 1) * 100).toFixed(2) + '%' + "</td></tr>";
          });
          $('#rank_percent').html(html);
          if (!isPaging) {
            $('#pageTool').html('');
          }
          if (result['data']['pageList']['totalPages'] > 1 && !isPaging) renderPage('pageTool', result['data']['pageList']['totalCount']);
        }
      });
    }

    $('body').on('selectChange', '#citySelect', function () {
      resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    function renderPage(domId, total) {
      var p = new Page();
      p.init({
        target: '#' + domId, pagesize: 10, pageCount: 1,
        count: total, callback: function callback(current) {
          resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), current, true);
        }
      });
    }

    /**
     * @description       教研成果总量统计
     * @param areaId      区县id
     * @param orgId       机构id
     * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param phaseId     学段id
     * @param subjectId   学科id
     * @param gradeId     年级id
     * @param schoolYear  学年
     */

    function resultComparisonTotal(time, phaseId, subjectId, gradeId, schoolYear) {
      echart_teaching_a_trend = common.echart.init(document.getElementById('teaching_achievements_trend'));
      common.echart.showLoading(echart_teaching_a_trend);
      var url = "";
      if (common.role == 'city') {
        url = '/jy/open?path=/api/statistic/area/city_total_date?areaId=' + common.areaid;
      } else if (common.role == 'county') {
        url = '/jy/open?path=/api/statistic/area/area_total_date?areaId=' + common.areaid;
      } else if (common.role == 'school') {
        url = '/jy/open?path=/api/statistic/org/sch_area_total?orgId=' + common.orgid;
      }
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=teaching_achievements_trend').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'teaching_achievements_trend');
        }
      });
    }

    $('body').on('selectChange', '#totalSelect', function () {
      resultComparisonTotal($('#totalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    /**
     * @description       教研成果增长趋势
     * @param areaId      区县id
     * @param orgId       机构id
     * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param phaseId     学段id
     * @param subjectId   学科id
     * @param gradeId     年级id
     * @param schoolYear  学年
     */

    function resultComparisonTotalTrend(time, phaseId, subjectId, gradeId, schoolYear) {
      teaching_a_increase_trend = common.echart.init(document.getElementById('teaching_achievement_increase_trend'));
      common.echart.showLoading(teaching_a_increase_trend);
      var url = "";
      if (common.role == 'city') {
        url = '/jy/open?path=/api/statistic/area/city_total_date_grow?areaId=' + common.areaid;
      } else if (common.role == 'county') {
        url = '/jy/open?path=/api/statistic/area/area_total_date_grow?areaId=' + common.areaid;
      } else if (common.role == 'school') {
        url = '/jy/open?path=/api/statistic/org/sch_area_total_trend?orgId=' + common.orgid;
      }
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=teaching_achievement_increase_trend').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'teaching_achievement_increase_trend');
        }
      });
    }

    $('body').on('selectChange', '#totalSelectTrend', function () {
      resultComparisonTotalTrend($('#totalSelectTrend').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    $('body').on('click', '#searchBtn', function () {
      if (common.role == 'city') {
        resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      }
      resultComparisonTotal($('#totalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));

      resultComparisonTotalTrend($('#totalSelectTrend').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });
    $('#searchBtn').trigger('click');
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3RlYWNoaW5nX292ZXJ2aWV3LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwiY29tbW9uIiwic2VsZWN0IiwiUGFnZSIsIm9uIiwiaW5kZXgiLCJuZXh0IiwiZmluZCIsImhpZGUiLCJlcSIsInNob3ciLCJ0ZXh0IiwiZWNoYXJ0X3JlZ2lvbmFsUmVzdWx0cyIsImVjaGFydCIsImluaXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZWNoYXJ0X3RlYWNoaW5nX2FfdHJlbmQiLCJ0ZWFjaGluZ19hX2luY3JlYXNlX3RyZW5kIiwicmVuZGVyIiwiZGF0YSIsImNhdGVnb3J5Iiwib3B0aW9uX3JlZ2lvbmFsUmVzdWx0cyIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwidG9vbHRpcCIsInRyaWdnZXIiLCJmb3JtYXR0ZXIiLCJsZWdlbmQiLCJvcmllbnQiLCJsZWZ0IiwiaXRlbUdhcCIsInRleHRTdHlsZSIsImZvbnRTaXplIiwic2VyaWVzIiwibmFtZSIsInR5cGUiLCJyYWRpdXMiLCJjZW50ZXIiLCJpdGVtU3R5bGUiLCJlbXBoYXNpcyIsInNoYWRvd0JsdXIiLCJzaGFkb3dPZmZzZXRYIiwic2hhZG93Q29sb3IiLCJpIiwicGFnZUxpc3QiLCJkYXRhbGlzdCIsImxlbmd0aCIsIm9iaiIsImNvdW50IiwiYXJlYU5hbWUiLCJwdXNoIiwic2V0T3B0aW9uIiwiaGlkZUxvYWRpbmciLCJ0ZWFjaGluZ19hY2hpZXZlbWVudHNfdCIsImdyaWQiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImNvbnRhaW5MYWJlbCIsImNhbGN1bGFibGUiLCJ4QXhpcyIsImJvdW5kYXJ5R2FwIiwiYXhpc1RpY2siLCJhbGlnbldpdGhMYWJlbCIsImF4aXNMaW5lIiwibGluZVN0eWxlIiwiYXhpc0xhYmVsIiwieUF4aXMiLCJzcGxpdExpbmUiLCJzdGFjayIsIm5vcm1hbCIsImFyZWFTdHlsZSIsImRhdGUiLCJ0ZWFjaGluZ19hY2hpZXZlbWVudF9pbmNyZWFzZV90IiwiY3VycmVudFBhZ2UiLCJyZXN1bHRDb21wYXJpc29uIiwidGltZSIsInBoYXNlSWQiLCJzdWJqZWN0SWQiLCJzY2hvb2xZZWFyIiwiaXNQYWdpbmciLCJzaG93TG9hZGluZyIsImdldEpTT04iLCJwcmVmaXgiLCJhcmVhaWQiLCJzdWNjZXNzIiwicmVzdWx0IiwiaHRtbCIsImVhY2giLCJpdGVtIiwiY2xzIiwiYWxsQ291bnQiLCJ0b0ZpeGVkIiwicmVuZGVyUGFnZSIsImF0dHIiLCJkb21JZCIsInRvdGFsIiwicCIsInRhcmdldCIsInBhZ2VzaXplIiwicGFnZUNvdW50IiwiY2FsbGJhY2siLCJjdXJyZW50IiwicmVzdWx0Q29tcGFyaXNvblRvdGFsIiwiZ3JhZGVJZCIsInVybCIsInJvbGUiLCJvcmdpZCIsInJlc3VsdENvbXBhcmlzb25Ub3RhbFRyZW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxrQkFBYztBQURUO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsWUFBRCxDQUFSLEVBQXdCLFVBQVVJLFdBQVYsRUFBdUI7QUFDN0M7QUFDQUosVUFBUUMsTUFBUixDQUFlRyxXQUFmOztBQUVBQyxTQUFPLEVBQVAsRUFBVyxDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLFFBQXRCLEVBQWdDLFFBQWhDLEVBQTBDLE1BQTFDLENBQVgsRUFDRSxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLE1BQXRCLEVBQThCQyxNQUE5QixFQUFzQ0MsSUFBdEMsRUFBNEM7QUFDMUM7QUFDQUosTUFBRSxNQUFGLEVBQVVLLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLGdCQUF0QixFQUF3QyxZQUFZO0FBQ2xELFVBQUlMLEVBQUUsSUFBRixFQUFRTSxLQUFSLE1BQW1CLENBQXZCLEVB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QUFGLEVBQXVCZ0csSUFBdkIsQ0FBNEIsWUFBNUIsQ0FBM0IsRUFBc0VoRyxFQUFFLDBCQUFGLEVBQThCZ0csSUFBOUIsQ0FBbUMsWUFBbkMsQ0FBdEUsRUFDRWhHLEVBQUUscUJBQUYsRUFBeUJnRyxJQUF6QixDQUE4QixZQUE5QixDQURGLEVBQytDaEcsRUFBRSxtQkFBRixFQUF1QmdHLElBQXZCLENBQTRCLFlBQTVCLENBRC9DLEVBRUVoRyxFQUFFLHdCQUFGLEVBQTRCZ0csSUFBNUIsQ0FBaUMsWUFBakMsQ0FGRjtBQUdELEtBWkQ7QUFhQWhHLE1BQUUsWUFBRixFQUFnQjJCLE9BQWhCLENBQXdCLE9BQXhCO0FBQ0QsR0F6WUg7QUEwWUQsQ0E5WUQiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvdGVhY2hpbmdfb3ZlcnZpZXctODgwMzRhZmQxZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICdjb21tb24nLCAnc2VsZWN0JywgJ3BhZ2UnXSxcclxuICAgIGZ1bmN0aW9uICgkLCBzZXJ2aWNlLCBjb21tb24sIHNlbGVjdCwgUGFnZSkge1xyXG4gICAgICAvL+WIh+aNouS4jeaYr+W9k+WJjeWtpuW5tOeahOaXtuWAme+8jOS4jeWPr+afpeeci+acgOi/keS4g+Wkqe+8jOacgOi/keS4ieWNgeWkqVxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNzY2hvb2xZZWFyIGxpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmluZGV4KCkgIT0gMCkge1xyXG4gICAgICAgICAgJCgnI3RvdGFsU2VsZWN0JykubmV4dCgpLmZpbmQoJ2xpJykuaGlkZSgpLmVxKDApLnNob3coKTtcclxuICAgICAgICAgICQoJyN0b3RhbFNlbGVjdFRyZW5kJykubmV4dCgpLmZpbmQoJ2xpJykuaGlkZSgpLmVxKDApLnNob3coKTtcclxuICAgICAgICAgICQoJyNjaXR5U2VsZWN0JykubmV4dCgpLmZpbmQoJ2xpJykuaGlkZSgpLmVxKDApLnNob3coKTtcclxuICAgICAgICAgICQoJyN0b3RhbFNlbGVjdCBzcGFuLCN0b3RhbFNlbGVjdFRyZW5kIHNwYW4sI2NpdHlTZWxlY3Qgc3BhbicpLnRleHQoJ+WFqOWtpuW5tCcpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCgnI3RvdGFsU2VsZWN0JykubmV4dCgpLmZpbmQoJ2xpJykuc2hvdygpO1xyXG4gICAgICAgICAgJCgnI3RvdGFsU2VsZWN0VHJlbmQnKS5uZXh0KCkuZmluZCgnbGknKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjY2l0eVNlbGVjdCcpLm5leHQoKS5maW5kKCdsaScpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvL+WQhOWMuuWfn+aIkOaenOaAu+mHj+WNoOavlFxyXG4gICAgICB2YXIgZWNoYXJ0X3JlZ2lvbmFsUmVzdWx0cyA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVnaW9uYWxSZXN1bHRzJykpO1xyXG5cclxuICAgICAgLy/mlZnnoJTmiJDmnpzmgLvph4/nu5/orqFcclxuICAgICAgdmFyIGVjaGFydF90ZWFjaGluZ19hX3RyZW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZWFjaGluZ19hY2hpZXZlbWVudHNfdHJlbmQnKSk7XHJcblxyXG4gICAgICAvL+aVmeeglOaIkOaenOWinumVv+i2i+WKv1xyXG4gICAgICB2YXIgdGVhY2hpbmdfYV9pbmNyZWFzZV90cmVuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVhY2hpbmdfYWNoaWV2ZW1lbnRfaW5jcmVhc2VfdHJlbmQnKSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiByZW5kZXIoZGF0YSwgY2F0ZWdvcnkpIHtcclxuICAgICAgICBzd2l0Y2ggKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICBjYXNlICdyZWdpb25hbFJlc3VsdHMnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fcmVnaW9uYWxSZXN1bHRzID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbXCIjZmYzZjY2XCIsIFwiI2ZiOGIxYlwiLCBcIiNmZGQ1MWRcIiwgXCIjYTVkNjdiXCIsIFwiIzVhYjU3Y1wiLCBcIiMwZmNiZTZcIiwgXCIjNDQ4Y2ZiXCIsIFwiIzQ1NmZkZVwiLCBcIiM4MDU0Y2RcIiwgXCIjYjY1MmNjXCJdLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBvcmllbnQ6ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgICBpdGVtR2FwOiAxNyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxNH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflkITljLrln5/miJDmnpzmgLvph4/ljaDmr5QnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiAnNjAlJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzYwJScsICc0NSUnXSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5wYWdlTGlzdC5kYXRhbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICBvYmpbJ3ZhbHVlJ10gPSBkYXRhLnBhZ2VMaXN0LmRhdGFsaXN0W2ldLmNvdW50O1xyXG4gICAgICAgICAgICAgIG9ialsnbmFtZSddID0gZGF0YS5wYWdlTGlzdC5kYXRhbGlzdFtpXS5hcmVhTmFtZTtcclxuICAgICAgICAgICAgICBvcHRpb25fcmVnaW9uYWxSZXN1bHRzLnNlcmllc1swXS5kYXRhLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICBvcHRpb25fcmVnaW9uYWxSZXN1bHRzLmxlZ2VuZC5kYXRhW2ldID0gZGF0YS5wYWdlTGlzdC5kYXRhbGlzdFtpXS5hcmVhTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlY2hhcnRfcmVnaW9uYWxSZXN1bHRzLnNldE9wdGlvbihvcHRpb25fcmVnaW9uYWxSZXN1bHRzKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfcmVnaW9uYWxSZXN1bHRzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICd0ZWFjaGluZ19hY2hpZXZlbWVudHNfdHJlbmQnOiB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFjaGluZ19hY2hpZXZlbWVudHNfdCA9IHtcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcyJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNkN2Q3ZDdcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtcIuaAu+mHj+e7n+iuoVwiXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBib3VuZGFyeUdhcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYXhpc1RpY2s6IHtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbldpdGhMYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48nLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUxYjg3MycsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTFiODczJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXJlYVN0eWxlOiB7bm9ybWFsOiB7fX0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB0ZWFjaGluZ19hY2hpZXZlbWVudHNfdC54QXhpc1swXS5kYXRhW2ldID0gZGF0YVtpXS5kYXRlO1xyXG4gICAgICAgICAgICAgIHRlYWNoaW5nX2FjaGlldmVtZW50c190LnNlcmllc1swXS5kYXRhW2ldID0gZGF0YVtpXS5jb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlY2hhcnRfdGVhY2hpbmdfYV90cmVuZC5zZXRPcHRpb24odGVhY2hpbmdfYWNoaWV2ZW1lbnRzX3QpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF90ZWFjaGluZ19hX3RyZW5kKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICd0ZWFjaGluZ19hY2hpZXZlbWVudF9pbmNyZWFzZV90cmVuZCc6IHtcclxuICAgICAgICAgICAgdmFyIHRlYWNoaW5nX2FjaGlldmVtZW50X2luY3JlYXNlX3QgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzAwYmZmZiddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTUlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzIlJyxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzMlJyxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2Q3ZDdkN1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB0ZWFjaGluZ19hY2hpZXZlbWVudF9pbmNyZWFzZV90LnhBeGlzWzBdLmRhdGFbaV0gPSBkYXRhW2ldLmRhdGU7XHJcbiAgICAgICAgICAgICAgdGVhY2hpbmdfYWNoaWV2ZW1lbnRfaW5jcmVhc2VfdC5zZXJpZXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uY291bnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGVhY2hpbmdfYV9pbmNyZWFzZV90cmVuZC5zZXRPcHRpb24odGVhY2hpbmdfYWNoaWV2ZW1lbnRfaW5jcmVhc2VfdCk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcodGVhY2hpbmdfYV9pbmNyZWFzZV90cmVuZCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5ZCE5Yy65Z+f5pWZ56CU5oiQ5p6c5oC76YePXHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQgICAgICDluIJpZFxyXG4gICAgICAgKiBAcGFyYW0gdGltZSAgICAgICAg5pe26Ze05q61KHllc3RlcmRheTrmmKjlpKnvvIxsYXN0c2V2ZW7vvJrmnIDov5HkuIPlpKnvvIxsYXN0dGhpcnR577ya5pyA6L+R5LiJ5Y2B5aSpKVxyXG4gICAgICAgKiBAcGFyYW0gcGhhc2VJZCAgICAg5a2m5q61aWRcclxuICAgICAgICogQHBhcmFtIHN1YmplY3RJZCAgIOWtpuenkWlkXHJcbiAgICAgICAqIEBwYXJhbSBzY2hvb2xZZWFyICDlrablubRcclxuICAgICAgICovXHJcbiAgICAgIHZhciBjdXJyZW50UGFnZSA9IDE7XHJcblxyXG4gICAgICBmdW5jdGlvbiByZXN1bHRDb21wYXJpc29uKHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgc2Nob29sWWVhciwgY3VycmVudFBhZ2UsIGlzUGFnaW5nKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZSB8fCAxO1xyXG4gICAgICAgIGlmICghaXNQYWdpbmcpIHtcclxuICAgICAgICAgIGVjaGFydF9yZWdpb25hbFJlc3VsdHMgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JlZ2lvbmFsUmVzdWx0cycpKTtcclxuICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3JlZ2lvbmFsUmVzdWx0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL2FyZWEvY2l0eV90b3RhbF9hcmVhP2FyZWFJZD0nICsgY29tbW9uLmFyZWFpZCArXHJcbiAgICAgICAgICAnJnRpbWU9JyArIHRpbWUgKyAnJnBoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJnN1YmplY3RJZD0nICsgc3ViamVjdElkICsgJyZzY2hvb2xZZWFyPScgKyBzY2hvb2xZZWFyICtcclxuICAgICAgICAgICcmY3VycmVudFBhZ2U9JyArIGN1cnJlbnRQYWdlICsgJyZlcnJvckRvbUlkPXJlZ2lvbmFsUmVzdWx0c1dyYXAnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzUGFnaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ3JlZ2lvbmFsUmVzdWx0cycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHJlc3VsdC5kYXRhLnBhZ2VMaXN0LmRhdGFsaXN0LCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGNscyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoKGluZGV4ICsgKChjdXJyZW50UGFnZSAtIDEpICogMTApKSA8IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbHMgPSAnbnVtMSc7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjx0cj48dGQgc3R5bGU9J3BhZGRpbmctbGVmdDoxMCU7dGV4dC1hbGlnbjpsZWZ0Oyc+PHNwYW4gY2xhc3M9J251bSBcIiArIGNscyArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgKCAoKGN1cnJlbnRQYWdlIC0gMSkgKiAxMCkgKyAoaW5kZXggKyAxKSApICsgXCI8L3NwYW4+PHN0cm9uZyBjbGFzcz0nc3Ryb25nJyB0aXRsZT0nXCIgKyBpdGVtLmFyZWFOYW1lICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICBcIlwiICsgaXRlbS5hcmVhTmFtZSArIFwiPC9zdHJvbmc+PC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgPHRkPlwiICsgaXRlbS5jb3VudCArIFwiPC90ZD48dGQ+XCIgKyAoKGl0ZW0uY291bnQgLyAocmVzdWx0LmRhdGEuYWxsQ291bnQgfHwgMSkpICogMTAwKS50b0ZpeGVkKDIpICsgJyUnICsgXCI8L3RkPjwvdHI+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKCcjcmFua19wZXJjZW50JykuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNQYWdpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgJCgnI3BhZ2VUb29sJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WydkYXRhJ11bJ3BhZ2VMaXN0J11bJ3RvdGFsUGFnZXMnXSA+IDEgJiYgIWlzUGFnaW5nKVxyXG4gICAgICAgICAgICAgICAgICByZW5kZXJQYWdlKCdwYWdlVG9vbCcsIHJlc3VsdFsnZGF0YSddWydwYWdlTGlzdCddWyd0b3RhbENvdW50J10pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI2NpdHlTZWxlY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmVzdWx0Q29tcGFyaXNvbigkKCcjY2l0eVNlbGVjdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3N1YmplY3QgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyUGFnZShkb21JZCwgdG90YWwpIHtcclxuICAgICAgICB2YXIgcCA9IG5ldyBQYWdlKCk7XHJcbiAgICAgICAgcC5pbml0KHtcclxuICAgICAgICAgIHRhcmdldDogJyMnICsgZG9tSWQsIHBhZ2VzaXplOiAxMCwgcGFnZUNvdW50OiAxLFxyXG4gICAgICAgICAgY291bnQ6IHRvdGFsLCBjYWxsYmFjazogZnVuY3Rpb24gKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgcmVzdWx0Q29tcGFyaXNvbigkKCcjY2l0eVNlbGVjdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksIGN1cnJlbnQsIHRydWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uICAgICAgIOaVmeeglOaIkOaenOaAu+mHj+e7n+iuoVxyXG4gICAgICAgKiBAcGFyYW0gYXJlYUlkICAgICAg5Yy65Y6/aWRcclxuICAgICAgICogQHBhcmFtIG9yZ0lkICAgICAgIOacuuaehGlkXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lICAgICAgICDml7bpl7TmrrUoeWVzdGVyZGF5OuaYqOWkqe+8jGxhc3RzZXZlbu+8muacgOi/keS4g+Wkqe+8jGxhc3R0aGlydHnvvJrmnIDov5HkuInljYHlpKkpXHJcbiAgICAgICAqIEBwYXJhbSBwaGFzZUlkICAgICDlrabmrrVpZFxyXG4gICAgICAgKiBAcGFyYW0gc3ViamVjdElkICAg5a2m56eRaWRcclxuICAgICAgICogQHBhcmFtIGdyYWRlSWQgICAgIOW5tOe6p2lkXHJcbiAgICAgICAqIEBwYXJhbSBzY2hvb2xZZWFyICDlrablubRcclxuICAgICAgICovXHJcblxyXG4gICAgICBmdW5jdGlvbiByZXN1bHRDb21wYXJpc29uVG90YWwodGltZSwgcGhhc2VJZCwgc3ViamVjdElkLCBncmFkZUlkLCBzY2hvb2xZZWFyKSB7XHJcbiAgICAgICAgZWNoYXJ0X3RlYWNoaW5nX2FfdHJlbmQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYWNoaW5nX2FjaGlldmVtZW50c190cmVuZCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF90ZWFjaGluZ19hX3RyZW5kKTtcclxuICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICBpZiAoY29tbW9uLnJvbGUgPT0gJ2NpdHknKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2NpdHlfdG90YWxfZGF0ZT9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnY291bnR5Jykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvYXJlYS9hcmVhX3RvdGFsX2RhdGU/YXJlYUlkPScgKyBjb21tb24uYXJlYWlkO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29tbW9uLnJvbGUgPT0gJ3NjaG9vbCcpIHtcclxuICAgICAgICAgIHVybCA9ICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfYXJlYV90b3RhbD9vcmdJZD0nICsgY29tbW9uLm9yZ2lkO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyB1cmwgKyAnJnRpbWU9JyArIHRpbWUgKyAnJnBoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJnN1YmplY3RJZD0nICsgc3ViamVjdElkICtcclxuICAgICAgICAgICcmZ3JhZGVJZD0nICsgZ3JhZGVJZCArICcmc2Nob29sWWVhcj0nICsgc2Nob29sWWVhciArICcmZXJyb3JEb21JZD10ZWFjaGluZ19hY2hpZXZlbWVudHNfdHJlbmQnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMSkge1xyXG4gICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ3RlYWNoaW5nX2FjaGlldmVtZW50c190cmVuZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3RvdGFsU2VsZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlc3VsdENvbXBhcmlzb25Ub3RhbCgkKCcjdG90YWxTZWxlY3QnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNncmFkZSAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5pWZ56CU5oiQ5p6c5aKe6ZW/6LaL5Yq/XHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQgICAgICDljLrljr9pZFxyXG4gICAgICAgKiBAcGFyYW0gb3JnSWQgICAgICAg5py65p6EaWRcclxuICAgICAgICogQHBhcmFtIHRpbWUgICAgICAgIOaXtumXtOautSh5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqSlcclxuICAgICAgICogQHBhcmFtIHBoYXNlSWQgICAgIOWtpuautWlkXHJcbiAgICAgICAqIEBwYXJhbSBzdWJqZWN0SWQgICDlrabnp5FpZFxyXG4gICAgICAgKiBAcGFyYW0gZ3JhZGVJZCAgICAg5bm057qnaWRcclxuICAgICAgICogQHBhcmFtIHNjaG9vbFllYXIgIOWtpuW5tFxyXG4gICAgICAgKi9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlc3VsdENvbXBhcmlzb25Ub3RhbFRyZW5kKHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgZ3JhZGVJZCwgc2Nob29sWWVhcikge1xyXG4gICAgICAgIHRlYWNoaW5nX2FfaW5jcmVhc2VfdHJlbmQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlYWNoaW5nX2FjaGlldmVtZW50X2luY3JlYXNlX3RyZW5kJykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcodGVhY2hpbmdfYV9pbmNyZWFzZV90cmVuZCk7XHJcbiAgICAgICAgdmFyIHVybCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKGNvbW1vbi5yb2xlID09ICdjaXR5Jykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvYXJlYS9jaXR5X3RvdGFsX2RhdGVfZ3Jvdz9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnY291bnR5Jykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvYXJlYS9hcmVhX3RvdGFsX2RhdGVfZ3Jvdz9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvb3JnL3NjaF9hcmVhX3RvdGFsX3RyZW5kP29yZ0lkPScgKyBjb21tb24ub3JnaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArIHVybCArICcmdGltZT0nICsgdGltZSArICcmcGhhc2VJZD0nICsgcGhhc2VJZCArICcmc3ViamVjdElkPScgKyBzdWJqZWN0SWQgK1xyXG4gICAgICAgICAgJyZncmFkZUlkPScgKyBncmFkZUlkICsgJyZzY2hvb2xZZWFyPScgKyBzY2hvb2xZZWFyICsgJyZlcnJvckRvbUlkPXRlYWNoaW5nX2FjaGlldmVtZW50X2luY3JlYXNlX3RyZW5kJylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDEpIHtcclxuICAgICAgICAgICAgICByZW5kZXIocmVzdWx0LmRhdGEsICd0ZWFjaGluZ19hY2hpZXZlbWVudF9pbmNyZWFzZV90cmVuZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyN0b3RhbFNlbGVjdFRyZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlc3VsdENvbXBhcmlzb25Ub3RhbFRyZW5kKCQoJyN0b3RhbFNlbGVjdFRyZW5kJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjZ3JhZGUgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNzZWFyY2hCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGNvbW1vbi5yb2xlID09ICdjaXR5Jykge1xyXG4gICAgICAgICAgcmVzdWx0Q29tcGFyaXNvbigkKCcjY2l0eVNlbGVjdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0Q29tcGFyaXNvblRvdGFsKCQoJyN0b3RhbFNlbGVjdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3N1YmplY3QgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI2dyYWRlIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuXHJcbiAgICAgICAgcmVzdWx0Q29tcGFyaXNvblRvdGFsVHJlbmQoJCgnI3RvdGFsU2VsZWN0VHJlbmQnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNncmFkZSAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjc2VhcmNoQnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgIH0pO1xyXG59KSJdfQ==
