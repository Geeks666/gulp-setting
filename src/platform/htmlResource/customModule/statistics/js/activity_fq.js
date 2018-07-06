require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common', 'select', 'page'],
    function ($, service, common, select, Page) {
      //切换不是当前学年的时候，不可查看最近七天，最近三十天
      $('body').on('click', '#schoolYear li', function () {
        if ($(this).index() != 0) {
          $('#fqList').next().find('li').hide().eq(0).show();
          $('#fqList span').text('全学年');
        } else {
          $('#fqList').next().find('li').show();
        }
      });
      /**
       * @description       发起详细情况
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */
      var currentPage = 1;

      function fqList(time, phaseId, subjectId, gradeId, schoolYear, currentPage, isPaging, spaceTable) {
        currentPage = currentPage || 1;
        var url = "";
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_areadata_area?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_areadata_subject?areaId=' + common.areaid;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_area_view?orgId=' + common.orgid;
        }
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&pageSize=10' + '&currentPage=' + currentPage +
          '&errorDomId=' + spaceTable)
          .success(function (result) {
            if (result['code'] == 1) {
              var html1 = "", html2 = "", html3 = "";
              $.each(result.data.datalist, function (index, item) {
                if (index % 2 == 0) {
                  trColor = "odd";
                }
                else {
                  trColor = "even";
                }
                if (common.role == 'city') {
                  html1 += "<tr class='" + trColor + "'><td>" + item.areaName + "</td><td>" +
                    (item.jxyt_issue + item.zxgk_issue + item.zjzd_issue + item.ktpj_issue + item.xjjy_area_issue) +
                    "</td><td>" + item.jxyt_issue + "</td><td>" + item.zxgk_issue + "</td><td>" + item.zjzd_issue +
                    "</td><td>" + item.ktpj_issue + "</td><td>" + item.xjjy_area_issue + "</td></tr>";
                } else if (common.role == 'county') {
                  html2 += "<tr class='" + trColor + "'><td>" + item.subjectName + "</td><td>" +
                    (item.jxyt_issue + item.zxgk_issue + item.zjzd_issue + item.ktpj_issue + item.xjjy_area_issue) +
                    "</td><td>" + item.jxyt_issue + "</td><td>" + item.zxgk_issue + "</td><td>" + item.zjzd_issue +
                    "</td><td>" + item.ktpj_issue + "</td><td>" + item.xjjy_area_issue + "</td></tr>";
                } else if (common.role == 'school') {
                  html3 += "<tr class='" + trColor + "'><td>" + item.userName +
                    "</td><td>" + item.jxyt_join + "</td><td>" + item.zxgk_join + "</td><td>" + item.zjzd_join +
                    "</td><td>" + item.ktpj_join + "</td><td>" + item.xjjy_area_join + "</td></tr>";
                }
              });
              if (common.role == 'city') {
                $('#activityFqTableCity tbody').html(html1);
              } else if (common.role == 'county') {
                $('#activityFqTableCounty tbody').html(html2);
              } else if (common.role == 'school') {
                $('#activityFqTableSchool tbody').html(html3);

              }
              if (!isPaging) {
                $('#pageTool1').html('');
              }
              if (result['data']['totalPages'] > 1 && !isPaging)
                renderPage('pageTool1', result['data']['totalCount']);
            }
          });
      }


      function renderPage(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 8,
          count: total, callback: function (current) {
            fqList($('#fqList').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'),
              $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), current, true,
              $('.role-' + common.role + '.activityFqTable tbody').attr('id'));

          }
        });
      }

      $('body').on('selectChange', '#fqList', function () {
        fqList($('#fqList').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'),
          $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), 1, '',
          $('.role-' + common.role + '.activityFqTable tbody').attr('id'));
      });

      $('body').on('click', '#searchBtn', function () {
        fqList($('#fqList').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'),
          $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), 1, '',
          $('.role-' + common.role + '.activityFqTable tbody').attr('id'));
      });
      $('#searchBtn').trigger('click');
    });
})