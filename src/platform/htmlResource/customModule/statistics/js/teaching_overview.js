require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common', 'select', 'page','dataResource/teacherOverviewData.js'],
    function ($, service, common, select, Page,teacherOverviewData) {
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
          case 'regionalResults': {
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
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: []
              },
              series: [
                {
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
                }
              ]
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
          case 'teaching_achievements_trend': {
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
              xAxis: [
                {
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
                }
              ],
              yAxis: [
                {
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
                }
              ],
              series: [
                {
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
                  areaStyle: {normal: {}},
                  data: []
                }
              ]
            };
            for (var i = 0; i < data.length; i++) {
              teaching_achievements_t.xAxis[0].data[i] = data[i].date;
              teaching_achievements_t.series[0].data[i] = data[i].count;
            }
            echart_teaching_a_trend.setOption(teaching_achievements_t);
            common.echart.hideLoading(echart_teaching_a_trend);
            break;
          }
          case 'teaching_achievement_increase_trend': {
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
              xAxis: [
                {
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
                }
              ],
              yAxis: [
                {
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
                }
              ],
              series: [
                {
                  name: '',
                  type: 'line',
                  data: []
                }
              ]
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
        var result = teacherOverviewData.cityTotalAreaData;
        /*$.getJSON(service.prefix + '/jy/open?path=/api/statistic/area/city_total_area?areaId=' + common.areaid +
          '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&schoolYear=' + schoolYear +
          '&currentPage=' + currentPage + '&errorDomId=regionalResultsWrap')
          .success(function (result) {*/
              if (result['code'] == 1) {
                if (!isPaging) {
                  render(result.data, 'regionalResults');
                }
                var html = "";
                $.each(result.data.pageList.datalist, function (index, item) {
                  var cls = '';
                  if ((index + ((currentPage - 1) * 10)) < 3) {
                    cls = 'num1';
                  }
                  html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" +
                    ( ((currentPage - 1) * 10) + (index + 1) ) + "</span><strong class='strong' title='" + item.areaName + "'>" +
                    "" + item.areaName + "</strong></td>" +
                    " <td>" + item.count + "</td><td>" + ((item.count / (result.data.allCount || 1)) * 100).toFixed(2) + '%' + "</td></tr>";

                });
                $('#rank_percent').html(html);
                if (!isPaging) {
                  $('#pageTool').html('');
                }
                if (result['data']['pageList']['totalPages'] > 1 && !isPaging)
                  renderPage('pageTool', result['data']['pageList']['totalCount']);
              }
          //});
      }

      $('body').on('selectChange', '#citySelect', function () {
        resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      });

      function renderPage(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 1,
          count: total, callback: function (current) {
            resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
              $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), current, true);
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
        var result = null;
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_total_date?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_total_date?areaId=' + common.areaid;
          result = teacherOverviewData.cityTotalDate;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_area_total?orgId=' + common.orgid;
        }
        /*$.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear= ' + schoolYear + '&errorDomId=teaching_achievements_trend')
          .success(function (result) {*/
            if (result['code'] == 1) {
              render(result.data, 'teaching_achievements_trend');
            }
        //  });
      }

      $('body').on('selectChange', '#totalSelect', function () {
        resultComparisonTotal($('#totalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
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
        var result = null;
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_total_date_grow?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_total_date_grow?areaId=' + common.areaid;
          result = teacherOverviewData.cityTotalDateGrowData;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_area_total_trend?orgId=' + common.orgid;
        }
        /*$.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=teaching_achievement_increase_trend')
          .success(function (result) {*/
            if (result['code'] == 1) {
              render(result.data, 'teaching_achievement_increase_trend');
            }
        //  });
      }


      $('body').on('selectChange', '#totalSelectTrend', function () {
        resultComparisonTotalTrend($('#totalSelectTrend').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });


      $('body').on('click', '#searchBtn', function () {
        if (common.role == 'city') {
          resultComparison($('#citySelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
        }
        resultComparisonTotal($('#totalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));

        resultComparisonTotalTrend($('#totalSelectTrend').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });
      $('#searchBtn').trigger('click');
    });
})