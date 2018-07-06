require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common','dataResource/userTypeData.js'], function ($, service, common , userTypeData) {
    var role = common.role;
    var echart_usertype = common.echart.init(document.getElementById('usertype'));
    echart_usertype.on('legendselectchanged', function (param) {
      updateTotal(param['selected']);
    });
    var echart_usertype_nofirst = common.echart.init(document.getElementById('usertype_nofirst'));
    var echart_usertype_isfirst = common.echart.init(document.getElementById('usertype_isfirst'));

    /**
     * @description 平台使用用户统计 用户类型分布
     * @param scope 范围(all:所有用户类型，part：部分用户类型)
     */
    var userType = {};

    function usertypeTotalFetchData(scope) {
      var result = userTypeData.platformUsertypeData;
      /*$.getJSON(service.prefix + '/platform/usertype?scope=' + scope + '&errorDomId=usertype', function (result) {*/
        if (result['code'] == 200) {
          $('#total').html(result['data']['userrole']['total']);
          userType = result['data']['userrole'];
          render(convertData(result['data']['userrole'], scope), 'pie')
        }
      /*})*/
    }

    var usertypeObj = {
      edu: '教育局',
      school: '学校',
      userrole: {
        edumanager: '教育局管理者',
        eduemploye: '教育局职工',
        schmanager: '学校管理者',
        parent: '家长',
        schemploye: '学校职工',
        teacher: '教师',
        student: '学生'
      }
    };

    if (role === 'school') {
      delete  usertypeObj.userrole.edumanager;
      delete  usertypeObj.userrole.eduemploye;
    }

    function convertData(data, scope) {
      var legendData = [], seriesData1 = [], seriesData2 = [], total_school = 0;
      $.each(data, function (key, value) {
        if (usertypeObj['userrole'][key]) {
          legendData.push(usertypeObj['userrole'][key]);
          seriesData2.push({name: usertypeObj['userrole'][key], value: value});
          if (key != 'edumanager' && key != 'eduemploye') total_school += value;
        }
      });
      if (role !== 'school') {
        seriesData1.push({name: usertypeObj['edu'], value: data['edu']});
        seriesData1.push({name: usertypeObj['school'], value: data['school']});
      }

      return {
        legendData: legendData,
        seriesData1: seriesData1,
        seriesData2: seriesData2
      };
    }

    function updateTotal(data) {
      var total = 0;
      $.each(data, function (key, value) {
        if (value) {
          $.each(usertypeObj.userrole, function (k, v) {
            if (key === v) total += userType[k];
          });
        }
      });
      $('#total').html(total);
    }

    if (role === 'school') usertypeTotalFetchData('part');
    else usertypeTotalFetchData('all');

    /**
     * @description 使用平台的用户类型统计
     * @param isfirst 是否是首次登陆(true:首次登陆，false:非首次登陆)
     * @param time 时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     */
    function usertypeFetchData(isfirst, time, domId) {
      if (domId === 'usertype_nofirst') {
        echart_usertype_nofirst = common.echart.init(document.getElementById('usertype_nofirst'));
        common.echart.showLoading(echart_usertype_nofirst);
      } else {
        echart_usertype_isfirst = common.echart.init(document.getElementById('usertype_isfirst'));
        common.echart.showLoading(echart_usertype_isfirst);
      }
      var result = userTypeData.userTypeUsedData[domId];
      /*$.getJSON(service.prefix + '/platform/usertype/' + isfirst + '/used?time=' + time + '&errorDomId=' + domId,
        function (result) {*/
          if (result['code'] == 200) render(convertBarData(result['data']), domId)
       /* });*/
    }

    function convertBarData(data) {
      var legendData = [], xAxisData = [], seriesData = [];
      $.each(data, function (index, item) {
        var temp = (item['time'] + "").split(' ')[0];
        temp = temp.length < 3 ? temp.length < 2 ? '0' + temp + ':00' : temp + ':00' : temp;
        xAxisData.push(temp);
      });
      if (role === 'school') delete usertypeObj.userrole.eduemploye;
      $.each(usertypeObj.userrole, function (key, value) {
        legendData.push(usertypeObj.userrole[key]);
        var temp = {name: value, type: 'bar', stack: '总量', barWidth: 20, data: []};
        $.each(data, function (index, item) {
          temp.data.push(item[key]);
        });
        seriesData.push(temp);
      });

      return {
        legendData: legendData,
        xAxisData: xAxisData,
        seriesData: seriesData
      }
    }

    $('body').on('selectChange', '.selectTop', function () {
      usertypeFetchData($(this).attr('data-fun'), $(this).attr('data-value'), $(this).attr('data-id'));
    });
    $('.selectTop').trigger('selectChange');

    function render(data, category) {
      switch (category) {
        case 'pie': {
          debugger
          var option_usertype = {};
          if (role === 'school') {
            option_usertype = {
              color: ['#ff3f66', '#53bb77', '#3f86ea', '#fdd51d'],
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: '20%',
                y: 'center',
                data: data['legendData'],
                itemGap: 20,
                textStyle: {color: '#e7e7e7', fontSize: 14}
              },
              calculable: true,
              series: [
                {
                  type: 'pie',
                  radius: [30, 110],
                  center: ['65%', '50%'],
                  roseType: 'area',
                  data: data['seriesData2']
                },
                {
                  name: '内圆圈',
                  type: 'pie',
                  radius: [20, 21],
                  center: ['65%', '50%'],
                  silent: true,
                  labelLine: {normal: {show: false}},
                  itemStyle: {
                    normal: {
                      color: '#3758ab'
                    }
                  },
                  data: [100]
                },
                {
                  name: '外圆圈',
                  type: 'pie',
                  radius: [120, 121],
                  center: ['65%', '50%'],
                  silent: true,
                  labelLine: {normal: {show: false}},
                  itemStyle: {
                    normal: {
                      color: '#3758ab'
                    }
                  },
                  data: [100]
                }
              ]
            };
          } else {
            option_usertype = {
              color: ['#306cc1', '#d0174f', '#fdd51d', '#53bb77', '#14c7e0', '#3f86ea', '#b653cf', '#ff3f66', '#fd8c1d'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br /> {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: '5%',
                y: '20%',
                itemGap: 20,
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: data['legendData']
              },
              series: [
                {
                  type: 'pie',
                  center: ['60%', '50%'],
                  radius: [0, '40%'],
                  label: {
                    normal: {
                      position: 'inner'
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: data['seriesData1']
                },
                {
                  type: 'pie',
                  center: ['60%', '50%'],
                  radius: ['55%', '75%'],
                  data: data['seriesData2']
                }
              ]
            };
          }
          echart_usertype.setOption(option_usertype);
          echart_usertype.hideLoading();
          break;
        }
        default: {
          var option_bar = {
            color: ['#2569ca', '#377ddf', '#4e8ee9', '#5b9af3', '#82adeb', '#a5c6f5', '#c8dcf9'],
            textStyle: {
              color: '#92accf',
              fontSize: 12
            },
            legend: {
              data: data['legendData'],
              x: 'center',
              itemGap: 20,
              textStyle: {
                color: '#a1bce9',
                fontSize: 14
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: data['xAxisData'],
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
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
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
              }
            ],
            series: data['seriesData']
          };

          if (category === 'usertype_nofirst') {
            echart_usertype_nofirst.setOption(option_bar);
            common.echart.hideLoading(echart_usertype_nofirst);
          }
          else if (category === 'usertype_isfirst') {
            echart_usertype_isfirst.setOption(option_bar);
            common.echart.hideLoading(echart_usertype_isfirst);
          }
        }
      }
    }
  });
})
