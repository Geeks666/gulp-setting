'use strict';

define(['jquery', 'service', 'common'], function ($, service, common) {
  /**
   * 数据导出
   * @param type  string  person:用户; app:应用;space:空间;resource:资源;jy:教研
   * @param scope  获取用户时：area:导出区域数据(市级管理员);school:导出学校数据(区县管理员);person:导出用户数据(学校管理员)
   *              获取空间时:all:全部空间;person:个人空间 group:群组空间
   *              获取资源时：area:导出区域数据;school:导出学校数据
   *              获取教研时: (area/school/person)_(activity/research)_(为活动时:"start/join;为教研情况时：mamager/teacher)
   * @param time 时间(格式 yyyy-mm-dd)
   */
  var role_b = common.role;
  var convertRole = { 'city': 'edu', 'county': 'area', 'school': 'school' };
  var role = convertRole[role_b];

  function exportData(type, scope, time, phaseId, subjectId, gradeId, schoolYear) {
    if (common.role == 'school') {
      var extra = '?orgId=' + common.orgid + '&type=' + type + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear;
    } else {
      var extra = '?areaId=' + common.areaid + '&type=' + type + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear;
    }
    if (scope) extra += '&scope=' + scope;
    location.href = service.prefix + '/export' + extra;
  }

  $('body').on('click', '.wrapTableTopExport', function () {
    var type = $(this).parents('body').attr('data-module');
    var style = $(this).parents('body').attr('data-table');
    var tableList = $(this).parents('body').attr('data-tableList');
    var tableList_school = $(this).parents('body').attr('data-tableList-school');
    var scope = '';
    if (type === 'jy') {
      if (style === 'activity') {
        switch (role_b) {
          case 'city':
            scope = 'area' + tableList;
            break;
          case 'county':
            scope = 'school' + tableList;
            break;
          case 'school':
            scope = 'person' + tableList_school;
            break;
          default:
            scope = 'area' + tableList;
        }
      } else if (style === 'research') {
        var currentTab = $('.tab').attr('data-value');
        if (currentTab == 1) {
          switch (role_b) {
            case 'city':
              scope = 'area_research_teacher';
              break;
            case 'county':
              scope = 'school_research_teacher';
              break;
            case 'school':
              scope = 'person_research_teacher';
              break;
            default:
              scope = 'area_research_teacher';
          }
        } else if (currentTab == 2) {
          switch (role_b) {
            case 'city':
              scope = 'area_research_mamager';
              break;
            case 'county':
              scope = 'school_research_mamager';
              break;
            case 'school':
              scope = 'person_research_mamager';
              break;
            default:
              scope = 'area_research_mamager';
          }
        }
      }
    }
    var time = $(this).parents('.wrapTableTop').find('.row .selectTop').attr("data-value");
    var studySection = $('#studySection .selectTop').attr('data-value');
    var subject = $('#subject .selectTop').attr('data-value');
    var grade = $('#grade .selectTop').attr('data-value');
    var schoolYear = $('#schoolYear .selectTop').attr('data-value');
    exportData(type, scope, time, studySection, subject, grade, schoolYear);
  });

  // 判断当前用户是否有权限查看区域 学校统计
  function useRole() {
    var url = service.prefix + '/jy/config';
    $.ajax({
      url: url,
      type: "get",
      dataType: 'json',
      success: function success(result) {
        if (result['code'] == 200) {
          if (result.data.schoolJy == true) {
            $('.schooltotal').show();
          } else {
            $('.schooltotal').hide();
          }
          if (result.data.areaJy == true) {
            $('.areatotal').show();
          } else {
            $('.areatotal').hide();
          }
        }
      }
    });
  }

  useRole();

  // 获取 学年  学段   学科   年级
  function schoolYear() {
    var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_schoolYear_list';
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function success(result) {
        if (result['code'] == 1) {
          var html = '';
          $.each(result['data'], function (index) {
            html += '<li data-value="' + result['data'][index] + '">' + result['data'][index] + '-' + (result['data'][index] + 1) + '学年' + '</li>';
          });
          $('#schoolYear .selectBottom ol').html(html);
          $('#schoolYear .selectTop span').html($('#schoolYear .selectBottom ol li').eq(0).text());
          $('#schoolYear .selectTop').attr('data-value', $('#schoolYear .selectBottom ol li').eq(0).attr('data-value'));
        }
      }
    });
  }

  function StudySection() {
    var url = "";
    if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list?orgId=' + common.orgid;
    } else {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list';
    }
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function success(result) {
        if (result['code'] == 1) {
          var html = '';
          $.each(result['data'], function (index) {
            html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
          });
          $('#studySection .selectBottom ol').html(html);
          $('#studySection .selectTop span').html($('#studySection .selectBottom ol li').eq(0).text());
          $('#studySection .selectTop').attr('data-value', $('#studySection .selectBottom ol li').eq(0).attr('data-value'));
        }
      }
    });
  }

  function subject(phaseId) {
    var url = "";
    if (common.role == 'city') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId;
    } else if (common.role == 'county') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&areaId=' + common.areaid;
    } else if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&orgId=' + common.orgid;
    }
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function success(result) {
        var html = '';
        if (result['code'] == 1) {
          if (result['data'] && result['data'].length > 0) {
            $.each(result['data'], function (index) {
              html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
            });
            $('#subject .selectBottom ol li').hide().eq(0).show();
            $('#subject .selectBottom ol').append(html);
            $('#subject .selectTop span').html($('#subject .selectBottom ol li').eq(0).text());
            $('#subject .selectTop').attr('data-value', $('#subject .selectBottom ol li').eq(0).attr('data-value'));
          }
        }
      }
    });
  }

  function grade(phaseId) {
    var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_grade_list?phaseId=' + phaseId;
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function success(result) {
        var html = '';
        if (result['code'] == 1) {
          if (result['data'] && result['data'].length > 0) {
            $.each(result['data'], function (index) {
              html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
            });
            $('#grade .selectBottom ol li').hide().eq(0).show();
            $('#grade .selectBottom ol').append(html);
            $('#grade .selectTop span').html($('#grade .selectBottom ol li').eq(0).text());
            $('#grade .selectTop').attr('data-value', $('#grade .selectBottom ol li').eq(0).attr('data-value'));
          }
        }
      }
    });
  }

  schoolYear();
  $.when(StudySection()).done(function () {
    subject($('#studySection .selectTop').attr('data-value'));
    grade($('#studySection .selectTop').attr('data-value'));
  });

  $('body').on('selectChange', '#studySection .selectTop', function () {
    subject($('#studySection .selectTop').attr('data-value'));
    grade($('#studySection .selectTop').attr('data-value'));
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3NlbGVjdC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwic2VydmljZSIsImNvbW1vbiIsInJvbGVfYiIsInJvbGUiLCJjb252ZXJ0Um9sZSIsImV4cG9ydERhdGEiLCJ0eXBlIiwic2NvcGUiLCJ0aW1lIiwicGhhc2VJZCIsInN1YmplY3RJZCIsImdyYWRlSWQiLCJzY2hvb2xZZWFyIiwiZXh0cmEiLCJvcmdpZCIsImFyZWFpZCIsImxvY2F0aW9uIiwiaHJlZiIsInByZWZpeCIsIm9uIiwicGFyZW50cyIsImF0dHIiLCJzdHlsZSIsInRhYmxlTGlzdCIsInRhYmxlTGlzdF9zY2hvb2wiLCJjdXJyZW50VGFiIiwiZmluZCIsInN0dWR5U2VjdGlvbiIsInN1YmplY3QiLCJncmFkZSIsInVzZVJvbGUiLCJ1cmwiLCJhamF4IiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzdWx0IiwiZGF0YSIsInNjaG9vbEp5Iiwic2hvdyIsImhpZGUiLCJhcmVhSnkiLCJhc3luYyIsImh0bWwiLCJlYWNoIiwiaW5kZXgiLCJlcSIsInRleHQiLCJTdHVkeVNlY3Rpb24iLCJpZCIsIm5hbWUiLCJsZW5ndGgiLCJhcHBlbmQiLCJ3aGVuIiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBTyxDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLFFBQXRCLENBQVAsRUFBd0MsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxNQUF0QixFQUE4QjtBQUNwRTs7Ozs7Ozs7O0FBU0EsTUFBSUMsU0FBU0QsT0FBT0UsSUFBcEI7QUFDQSxNQUFJQyxjQUFjLEVBQUMsUUFBUSxLQUFULEVBQWdCLFVBQVUsTUFBMUIsRUFBa0MsVUFBVSxRQUE1QyxFQUFsQjtBQUNBLE1BQUlELE9BQU9DLFlBQVlGLE1BQVosQ0FBWDs7QUFFQSxXQUFTRyxVQUFULENBQW9CQyxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNDLElBQWpDLEVBQXVDQyxPQUF2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M0MsRUFBRSw0QkFBRixFQUFnQzhDLEVBQWhDLENBQW1DLENBQW5DLEVBQXNDQyxJQUF0QyxFQUFqQztBQUNBL0MsY0FBRSxtQkFBRixFQUF1QnNCLElBQXZCLENBQTRCLFlBQTVCLEVBQTBDdEIsRUFBRSw0QkFBRixFQUFnQzhDLEVBQWhDLENBQW1DLENBQW5DLEVBQXNDeEIsSUFBdEMsQ0FBMkMsWUFBM0MsQ0FBMUM7QUFDRDtBQUNGO0FBQ0Y7QUFsQkksS0FBUDtBQW9CRDs7QUFFRFQ7QUFDQWIsSUFBRXFELElBQUYsQ0FBT0wsY0FBUCxFQUF1Qk0sSUFBdkIsQ0FDRSxZQUFZO0FBQ1Z6QixZQUFRN0IsRUFBRSwwQkFBRixFQUE4QnNCLElBQTlCLENBQW1DLFlBQW5DLENBQVI7QUFDQVEsVUFBTTlCLEVBQUUsMEJBQUYsRUFBOEJzQixJQUE5QixDQUFtQyxZQUFuQyxDQUFOO0FBQ0QsR0FKSDs7QUFPQXRCLElBQUUsTUFBRixFQUFVb0IsRUFBVixDQUFhLGNBQWIsRUFBNkIsMEJBQTdCLEVBQXlELFlBQVk7QUFDbkVTLFlBQVE3QixFQUFFLDBCQUFGLEVBQThCc0IsSUFBOUIsQ0FBbUMsWUFBbkMsQ0FBUjtBQUNBUSxVQUFNOUIsRUFBRSwwQkFBRixFQUE4QnNCLElBQTlCLENBQW1DLFlBQW5DLENBQU47QUFDRCxHQUhEO0FBSUQsQ0F2T0QiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvc2VsZWN0LTY2YjlmMTYzOGMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoWydqcXVlcnknLCAnc2VydmljZScsICdjb21tb24nXSwgZnVuY3Rpb24gKCQsIHNlcnZpY2UsIGNvbW1vbikge1xyXG4gIC8qKlxyXG4gICAqIOaVsOaNruWvvOWHulxyXG4gICAqIEBwYXJhbSB0eXBlICBzdHJpbmcgIHBlcnNvbjrnlKjmiLc7IGFwcDrlupTnlKg7c3BhY2U656m66Ze0O3Jlc291cmNlOui1hOa6kDtqeTrmlZnnoJRcclxuICAgKiBAcGFyYW0gc2NvcGUgIOiOt+WPlueUqOaIt+aXtu+8mmFyZWE65a+85Ye65Yy65Z+f5pWw5o2uKOW4gue6p+euoeeQhuWRmCk7c2Nob29sOuWvvOWHuuWtpuagoeaVsOaNrijljLrljr/nrqHnkIblkZgpO3BlcnNvbjrlr7zlh7rnlKjmiLfmlbDmja4o5a2m5qCh566h55CG5ZGYKVxyXG4gICAqICAgICAgICAgICAgICDojrflj5bnqbrpl7Tml7Y6YWxsOuWFqOmDqOepuumXtDtwZXJzb2465Liq5Lq656m66Ze0IGdyb3VwOue+pOe7hOepuumXtFxyXG4gICAqICAgICAgICAgICAgICDojrflj5botYTmupDml7bvvJphcmVhOuWvvOWHuuWMuuWfn+aVsOaNrjtzY2hvb2w65a+85Ye65a2m5qCh5pWw5o2uXHJcbiAgICogICAgICAgICAgICAgIOiOt+WPluaVmeeglOaXtjogKGFyZWEvc2Nob29sL3BlcnNvbilfKGFjdGl2aXR5L3Jlc2VhcmNoKV8o5Li65rS75Yqo5pe2Olwic3RhcnQvam9pbjvkuLrmlZnnoJTmg4XlhrXml7bvvJptYW1hZ2VyL3RlYWNoZXIpXHJcbiAgICogQHBhcmFtIHRpbWUg5pe26Ze0KOagvOW8jyB5eXl5LW1tLWRkKVxyXG4gICAqL1xyXG4gIHZhciByb2xlX2IgPSBjb21tb24ucm9sZTtcclxuICB2YXIgY29udmVydFJvbGUgPSB7J2NpdHknOiAnZWR1JywgJ2NvdW50eSc6ICdhcmVhJywgJ3NjaG9vbCc6ICdzY2hvb2wnfTtcclxuICB2YXIgcm9sZSA9IGNvbnZlcnRSb2xlW3JvbGVfYl07XHJcblxyXG4gIGZ1bmN0aW9uIGV4cG9ydERhdGEodHlwZSwgc2NvcGUsIHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgZ3JhZGVJZCwgc2Nob29sWWVhcikge1xyXG4gICAgaWYgKGNvbW1vbi5yb2xlID09ICdzY2hvb2wnKSB7XHJcbiAgICAgIHZhciBleHRyYSA9ICc/b3JnSWQ9JyArIGNvbW1vbi5vcmdpZCArICcmdHlwZT0nICsgdHlwZSArICcmdGltZT0nICsgdGltZSArICcmcGhhc2VJZD0nICsgcGhhc2VJZCArICcmc3ViamVjdElkPScgK1xyXG4gICAgICAgIHN1YmplY3RJZCArICcmZ3JhZGVJZD0nICsgZ3JhZGVJZCArICcmc2Nob29sWWVhcj0nICsgc2Nob29sWWVhcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBleHRyYSA9ICc/YXJlYUlkPScgKyBjb21tb24uYXJlYWlkICsgJyZ0eXBlPScgKyB0eXBlICsgJyZ0aW1lPScgKyB0aW1lICsgJyZwaGFzZUlkPScgKyBwaGFzZUlkICsgJyZzdWJqZWN0SWQ9JyArXHJcbiAgICAgICAgc3ViamVjdElkICsgJyZncmFkZUlkPScgKyBncmFkZUlkICsgJyZzY2hvb2xZZWFyPScgKyBzY2hvb2xZZWFyO1xyXG4gICAgfVxyXG4gICAgaWYgKHNjb3BlKSBleHRyYSArPSAnJnNjb3BlPScgKyBzY29wZVxyXG4gICAgbG9jYXRpb24uaHJlZiA9IHNlcnZpY2UucHJlZml4ICsgJy9leHBvcnQnICsgZXh0cmE7XHJcblxyXG4gIH1cclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcud3JhcFRhYmxlVG9wRXhwb3J0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHR5cGUgPSAkKHRoaXMpLnBhcmVudHMoJ2JvZHknKS5hdHRyKCdkYXRhLW1vZHVsZScpO1xyXG4gICAgdmFyIHN0eWxlID0gJCh0aGlzKS5wYXJlbnRzKCdib2R5JykuYXR0cignZGF0YS10YWJsZScpO1xyXG4gICAgdmFyIHRhYmxlTGlzdCA9ICQodGhpcykucGFyZW50cygnYm9keScpLmF0dHIoJ2RhdGEtdGFibGVMaXN0Jyk7XHJcbiAgICB2YXIgdGFibGVMaXN0X3NjaG9vbCA9ICQodGhpcykucGFyZW50cygnYm9keScpLmF0dHIoJ2RhdGEtdGFibGVMaXN0LXNjaG9vbCcpO1xyXG4gICAgdmFyIHNjb3BlID0gJyc7XHJcbiAgICBpZiAodHlwZSA9PT0gJ2p5Jykge1xyXG4gICAgICBpZiAoc3R5bGUgPT09ICdhY3Rpdml0eScpIHtcclxuICAgICAgICBzd2l0Y2ggKHJvbGVfYikge1xyXG4gICAgICAgICAgY2FzZSAnY2l0eSc6XHJcbiAgICAgICAgICAgIHNjb3BlID0gJ2FyZWEnICsgdGFibGVMaXN0O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2NvdW50eSc6XHJcbiAgICAgICAgICAgIHNjb3BlID0gJ3NjaG9vbCcgKyB0YWJsZUxpc3Q7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnc2Nob29sJzpcclxuICAgICAgICAgICAgc2NvcGUgPSAncGVyc29uJyArIHRhYmxlTGlzdF9zY2hvb2w7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgc2NvcGUgPSAnYXJlYScgKyB0YWJsZUxpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHN0eWxlID09PSAncmVzZWFyY2gnKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRUYWIgPSAkKCcudGFiJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIGlmIChjdXJyZW50VGFiID09IDEpIHtcclxuICAgICAgICAgIHN3aXRjaCAocm9sZV9iKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NpdHknOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ2FyZWFfcmVzZWFyY2hfdGVhY2hlcic7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvdW50eSc6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnc2Nob29sX3Jlc2VhcmNoX3RlYWNoZXInO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdzY2hvb2wnOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ3BlcnNvbl9yZXNlYXJjaF90ZWFjaGVyJztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdhcmVhX3Jlc2VhcmNoX3RlYWNoZXInO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRhYiA9PSAyKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHJvbGVfYikge1xyXG4gICAgICAgICAgICBjYXNlICdjaXR5JzpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdhcmVhX3Jlc2VhcmNoX21hbWFnZXInO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdjb3VudHknOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ3NjaG9vbF9yZXNlYXJjaF9tYW1hZ2VyJztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnc2Nob29sJzpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdwZXJzb25fcmVzZWFyY2hfbWFtYWdlcic7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnYXJlYV9yZXNlYXJjaF9tYW1hZ2VyJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciB0aW1lID0gJCh0aGlzKS5wYXJlbnRzKCcud3JhcFRhYmxlVG9wJykuZmluZCgnLnJvdyAuc2VsZWN0VG9wJykuYXR0cihcImRhdGEtdmFsdWVcIik7XHJcbiAgICB2YXIgc3R1ZHlTZWN0aW9uID0gJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgdmFyIHN1YmplY3QgPSAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgdmFyIGdyYWRlID0gJCgnI2dyYWRlIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICB2YXIgc2Nob29sWWVhciA9ICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICBleHBvcnREYXRhKHR5cGUsIHNjb3BlLCB0aW1lLCBzdHVkeVNlY3Rpb24sIHN1YmplY3QsIGdyYWRlLCBzY2hvb2xZZWFyKTtcclxuICB9KTtcclxuXHJcbiAgLy8g5Yik5pat5b2T5YmN55So5oi35piv5ZCm5pyJ5p2D6ZmQ5p+l55yL5Yy65Z+fIOWtpuagoee7n+iuoVxyXG4gIGZ1bmN0aW9uIHVzZVJvbGUoKSB7XHJcbiAgICB2YXIgdXJsID0gc2VydmljZS5wcmVmaXggKyAnL2p5L2NvbmZpZyc7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgdHlwZTogXCJnZXRcIixcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5zY2hvb2xKeSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICQoJy5zY2hvb2x0b3RhbCcpLnNob3coKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5zY2hvb2x0b3RhbCcpLmhpZGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5hcmVhSnkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAkKCcuYXJlYXRvdGFsJykuc2hvdygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCgnLmFyZWF0b3RhbCcpLmhpZGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXNlUm9sZSgpO1xyXG5cclxuICAvLyDojrflj5Yg5a2m5bm0ICDlrabmrrUgICDlrabnp5EgICDlubTnuqdcclxuICBmdW5jdGlvbiBzY2hvb2xZZWFyKCkge1xyXG4gICAgdmFyIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvb3JnL3NjaF9zY2hvb2xZZWFyX2xpc3QnO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgdHlwZTogXCJnZXRcIixcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgJC5lYWNoKHJlc3VsdFsnZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGRhdGEtdmFsdWU9XCInICsgcmVzdWx0WydkYXRhJ11baW5kZXhdICsgJ1wiPicgKyAocmVzdWx0WydkYXRhJ11baW5kZXhdKSArICctJyArXHJcbiAgICAgICAgICAgICAgKHJlc3VsdFsnZGF0YSddW2luZGV4XSArIDEpICsgJ+WtpuW5tCcgKyAnPC9saT4nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkKCcjc2Nob29sWWVhciAuc2VsZWN0Qm90dG9tIG9sJykuaHRtbChodG1sKTtcclxuICAgICAgICAgICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3Agc3BhbicpLmh0bWwoJCgnI3NjaG9vbFllYXIgLnNlbGVjdEJvdHRvbSBvbCBsaScpLmVxKDApLnRleHQoKSk7XHJcbiAgICAgICAgICAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScsICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RCb3R0b20gb2wgbGknKS5lcSgwKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBTdHVkeVNlY3Rpb24oKSB7XHJcbiAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgIGlmIChjb21tb24ucm9sZSA9PSAnc2Nob29sJykge1xyXG4gICAgICB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfcGhhc2VfbGlzdD9vcmdJZD0nICsgY29tbW9uLm9yZ2lkO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXJsID0gc2VydmljZS5wcmVmaXggKyAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9vcmcvc2NoX3BoYXNlX2xpc3QnO1xyXG4gICAgfVxyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgdHlwZTogXCJnZXRcIixcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgJC5lYWNoKHJlc3VsdFsnZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGRhdGEtdmFsdWU9XCInICsgcmVzdWx0WydkYXRhJ11baW5kZXhdLmlkICsgJ1wiPicgKyByZXN1bHRbJ2RhdGEnXVtpbmRleF0ubmFtZSArICc8L2xpPic7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdEJvdHRvbSBvbCcpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3Agc3BhbicpLmh0bWwoJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0Qm90dG9tIG9sIGxpJykuZXEoMCkudGV4dCgpKTtcclxuICAgICAgICAgICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RCb3R0b20gb2wgbGknKS5lcSgwKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzdWJqZWN0KHBoYXNlSWQpIHtcclxuICAgIHZhciB1cmwgPSBcIlwiO1xyXG4gICAgaWYgKGNvbW1vbi5yb2xlID09ICdjaXR5Jykge1xyXG4gICAgICB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfc3ViamVjdF9saXN0P3BoYXNlSWQ9JyArIHBoYXNlSWQ7XHJcbiAgICB9IGVsc2UgaWYgKGNvbW1vbi5yb2xlID09ICdjb3VudHknKSB7XHJcbiAgICAgIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvb3JnL3NjaF9zdWJqZWN0X2xpc3Q/cGhhc2VJZD0nICsgcGhhc2VJZCArICcmYXJlYUlkPScgKyBjb21tb24uYXJlYWlkO1xyXG4gICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnc2Nob29sJykge1xyXG4gICAgICB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfc3ViamVjdF9saXN0P3BoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJm9yZ0lkPScgKyBjb21tb24ub3JnaWQ7XHJcbiAgICB9XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICB0eXBlOiBcImdldFwiLFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIGh0bWwgPSAnJztcclxuICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMSkge1xyXG4gICAgICAgICAgaWYgKHJlc3VsdFsnZGF0YSddICYmIHJlc3VsdFsnZGF0YSddLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJC5lYWNoKHJlc3VsdFsnZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICBodG1sICs9ICc8bGkgZGF0YS12YWx1ZT1cIicgKyByZXN1bHRbJ2RhdGEnXVtpbmRleF0uaWQgKyAnXCI+JyArIHJlc3VsdFsnZGF0YSddW2luZGV4XS5uYW1lICsgJzwvbGk+JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RCb3R0b20gb2wgbGknKS5oaWRlKCkuZXEoMCkuc2hvdygpO1xyXG4gICAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0Qm90dG9tIG9sJykuYXBwZW5kKGh0bWwpO1xyXG4gICAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wIHNwYW4nKS5odG1sKCQoJyNzdWJqZWN0IC5zZWxlY3RCb3R0b20gb2wgbGknKS5lcSgwKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScsICQoJyNzdWJqZWN0IC5zZWxlY3RCb3R0b20gb2wgbGknKS5lcSgwKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBncmFkZShwaGFzZUlkKSB7XHJcbiAgICB2YXIgdXJsID0gc2VydmljZS5wcmVmaXggKyAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9vcmcvc2NoX2dyYWRlX2xpc3Q/cGhhc2VJZD0nICsgcGhhc2VJZDtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgIHR5cGU6IFwiZ2V0XCIsXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0WydkYXRhJ10gJiYgcmVzdWx0WydkYXRhJ10ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0WydkYXRhJ10sIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBkYXRhLXZhbHVlPVwiJyArIHJlc3VsdFsnZGF0YSddW2luZGV4XS5pZCArICdcIj4nICsgcmVzdWx0WydkYXRhJ11baW5kZXhdLm5hbWUgKyAnPC9saT4nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnI2dyYWRlIC5zZWxlY3RCb3R0b20gb2wgbGknKS5oaWRlKCkuZXEoMCkuc2hvdygpO1xyXG4gICAgICAgICAgICAkKCcjZ3JhZGUgLnNlbGVjdEJvdHRvbSBvbCcpLmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgJCgnI2dyYWRlIC5zZWxlY3RUb3Agc3BhbicpLmh0bWwoJCgnI2dyYWRlIC5zZWxlY3RCb3R0b20gb2wgbGknKS5lcSgwKS50ZXh0KCkpO1xyXG4gICAgICAgICAgICAkKCcjZ3JhZGUgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnLCAkKCcjZ3JhZGUgLnNlbGVjdEJvdHRvbSBvbCBsaScpLmVxKDApLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNjaG9vbFllYXIoKTtcclxuICAkLndoZW4oU3R1ZHlTZWN0aW9uKCkpLmRvbmUoXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHN1YmplY3QoJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgZ3JhZGUoJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgIH1cclxuICApO1xyXG5cclxuICAkKCdib2R5Jykub24oJ3NlbGVjdENoYW5nZScsICcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBzdWJqZWN0KCQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICBncmFkZSgkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gIH0pO1xyXG59KTsiXX0=
