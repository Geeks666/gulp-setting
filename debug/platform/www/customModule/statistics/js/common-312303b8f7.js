'use strict';

define(['jquery', 'service', 'echarts'], function ($, service, echarts) {

  //service.prefix = service.dataHost;

  // sidebar 侧边栏
  // row1 页面内容区域顶部可能有的切换tab
  $('body').on('click', '.sidebar .item-wrap, .row1 .item-wrap, .data-href', function () {
    var href = $(this).attr('data-href');
    if (href) {
      if (href === 'index.html') {
        href = 'index_' + roleCode + '.html';
      }
      location.href = href;
    }
  });

  // 单选框 .radio 切换
  $('body').on('click', '.radio .item-wrap', function () {
    $(this).parents('.radio').find('.item-wrap').removeClass('active');
    $(this).addClass('active');
    $(this).parent().attr('data-value', $(this).attr('data-value'));
    $(this).parent().trigger('radioChange');
  });

  // tab 切换
  $('body').on('click', '.tab .ulli', function () {
    $(this).siblings().removeClass('liAct');
    $(this).addClass('liAct');
    $(this).parent().attr('data-value', $(this).attr('data-value'));
    $(this).parent().trigger('tabChange');
  });

  // 下拉框
  $(".selectTop").on('click', function (event) {
    selectTab(this, event);
  });
  $(".selectBottom").on('click', "li", function () {
    var selectTop = $(this).parents('.selectWrap').find('.selectTop'),
        selectBottom = $(this).parents("div.selectBottom");
    selectTop.find('span').empty().html($(this).text());
    selectTop.attr('data-value', $(this).attr('data-value'));
    selectTop.attr('data-type', $(this).attr('data-type'));
    selectBottom.hide();
    selectBottom.prev().addClass("selectTopAct").removeClass("selectTopAct1");
    selectTop.trigger('selectChange');
  });
  $('body').on('click', function () {
    $('.selectBottom').hide();
    $(".selectTop").addClass("selectTopAct").removeClass("selectTopAct1");
  });
  function selectTab(obj, event) {
    if (window.cancelBubble) event.cancelBubble = true;else event.stopPropagation();
    if ($(obj).next().css('display') == "none") {
      $(obj).next().show();
      $(obj).addClass("selectTopAct1").removeClass("selectTopAct");
    } else {
      $(obj).next().hide();
      $(obj).addClass("selectTopAct").removeClass("selectTopAct1");
    }
  }

  // 插件
  $.extend({
    alert: function alert(msg) {
      msg = msg || '请输入必要信息';

      $('body').on('click', '.mainbo-alert-mask .btn-close, .mainbo-alert-mask .close', function () {
        $(this).parents('.mainbo-alert-mask').remove();
      });

      var alert = '<div class="mainbo-alert-mask" style="position: fixed; top: 0; right: 0; ' + 'bottom: 0; left: 0; background: rgba(0,0,0,.4)">' + '<div class="mainbo-alert" style="position: absolute; top: 50%; left: 50%; ' + 'display: inline-block; text-align: center;' + 'padding: 30px; border: 1px solid #3975d7; background: #203469; color: #fff;">' + '<span class="close" style="position: absolute; top: 10px; right: 10px; width: 12px; height: 12px;' + 'background: url(images/icons.png) no-repeat -14px -439px; cursor: pointer;"  onclick="close()"></span>' + '<pre style="margin: 15px 30px 30px;">' + msg + '</pre>' + '<span class="btn-close" style="display: inline-block; width: 117px; height: 30px; line-height: 30px; ' + 'text-align: center; font-size: 14px; background: #2e51a3; cursor: pointer;" onclick="close()">确定</span>' + '</div></div>';

      $('body').append(alert);
      $('.mainbo-alert .close').hover(function () {
        $(this).css('background-position', '0 -439px');
      }, function () {
        $(this).css('background-position', '-14px -439px');
      });
      $('.mainbo-alert').css('marginLeft', '-' + $('.mainbo-alert').width() / 2 + 'px').css('marginTop', '-' + $('.mainbo-alert').height() / 2 + 'px');
    },
    loading: {
      timer: 0,
      show: function show() {
        this.hide();
        this.timer = 1;
        var _this = this;
        var loadingHtml = '<div class="mainbo-loading-mask" style="position: fixed; top: 0; right: 0; ' + 'bottom: 0; left: 0;">' + '<div class="mainbo-loading" style="position: absolute; top: 50%; left: 50%; width: 250px; height: 250px; ' + 'margin-top: -125px; margin-left: -125px; background: url(images/loading.png) no-repeat 0 0;">' + '<div class="loading-1" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -250px 0;"></div>' + '<div class="loading-2" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -500px 0;"></div>' + '<div class="loading-3" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -750px 0;"></div>' + '<div class="loading-4" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; line-height: 250px; text-align: center; color: #fff; font-size: 22px">Loading...</div>' + '</div>' + '</div>';

        var angle1 = 0,
            opacity2 = 1,
            angle3 = 0,
            v1 = 0.5,
            v2 = -0.01,
            v3 = 1;

        function rotate() {
          $('.mainbo-loading-mask .loading-1').css('transform', 'rotate(' + angle1 + 'deg)');
          $('.mainbo-loading-mask .loading-2').css('opacity', opacity2);
          $('.mainbo-loading-mask .loading-4').css('opacity', opacity2);
          $('.mainbo-loading-mask .loading-3').css('transform', 'rotate(' + angle3 + 'deg)');
          angle1 += v1;
          opacity2 += v2;
          angle3 += v3;
          if (angle1 >= 180 || angle1 <= -180) {
            v1 = -v1;
          }
          if (opacity2 >= 1 || opacity2 <= 0) v2 = -v2;
          _this.timer && setTimeout(rotate, 16);
        }

        rotate();
        $('body').append(loadingHtml);
      },
      hide: function hide() {
        this.timer = 0;
        $('.mainbo-loading-mask').remove();
      }
    }
  });

  // $.loading.show();

  // var ajaxCount = 0, exclude = [service.prefix + '/platform/user'];
  $(document).ajaxSend(function (event, request, settings) {
    // ajaxCount++;
    request.setRequestHeader('X-Requested-With', 'xmlhttprequest_mainbo');
  });
  $(document).ajaxComplete(function (event, xhr, settings) {
    // ajaxCount--;
    // if (exclude.toString().indexOf(settings.url) < 0) {
    //   if (ajaxCount === 0) $.loading.hide();
    // }
    try {
      var response = JSON.parse(xhr['responseText']);
      var domId = parsingErrorDomId(settings.url);
      if (response['code'] == 20001) location.reload();
      if ((response['code'] == 200 || response['code'] == 1) && (response['data']['length'] == 0 || response['data']['datalist']['length'] == 0 || response['data']['dataList']['length'] == 0)) {
        if (domId) appendTipDom(domId, 'tip');
      } else if (response['code'] != 200 && response['code'] != 1) {
        if (domId) appendTipDom(domId);
      }
    } catch (e) {}
  });
  $(document).ajaxError(function (event, xhr, settings) {
    var domId = parsingErrorDomId(settings.url);
    if (domId) appendTipDom(domId);
  });

  $('body').on('click', '.errorDom', function () {
    location.reload();
  });
  function parsingErrorDomId(url) {
    var errDomid = '';
    errDomid = url.indexOf('errorDomId');
    if (errDomid <= 0) return false;
    errDomid = url.substring(errDomid).split('=');
    if (errDomid.length != 2) return false;
    errDomid = errDomid[1];
    return errDomid;
  }

  function createHtml(category) {
    var cls = 'errorDom',
        titleMsg = '点击重试',
        msg = '网络异常或数据加载失败，请重试',
        imgSrc = 'images/error.png';
    if (category == 'tip') {
      cls = 'noData';
      titleMsg = '';
      msg = '暂无数据';
      imgSrc = 'images/tip.png';
    }
    return '<div class="' + cls + '" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;' + 'width: 210px; height: 123px; margin: auto; background: url(' + imgSrc + ') no-repeat center top;' + ' cursor: pointer;" title="' + titleMsg + '">' + '<p style="position:absolute; bottom: 0; width:100%; color: #e1ecff; font-size: 14px; text-align: center;">' + msg + '</p>' + '</div>';
  }

  function appendTipDom(domId, category) {
    if (domId === 'group_ratio_analysis') {
      $('#' + domId).append(createHtml(category));
      $('#' + domId + ' .group_ratio_count').hide();
      $('#' + domId + ' .divider').hide();
    } else if (domId === 'app_traffic10_wrap') {
      $('#' + domId).append(createHtml(category));
      $('#' + domId + ' #app_traffic10').hide();
      $('#' + domId + ' #app_traffic10_pie').hide();
    } else $('#' + domId).data('oldHtml', $('#' + domId).html()).html(createHtml(category));
  }

  function removeTipDom(domId) {
    if (domId === 'app_traffic10_wrap') {
      $('#' + domId + ' .errorDom').remove();
      $('#' + domId + ' .noData').remove();
      $('#' + domId + ' #app_traffic10').show();
      $('#' + domId + ' #app_traffic10_pie').show();
    }
  }

  // echarts 加载动画配置项
  var loadingOption = {
    textColor: '#a1bce9',
    maskColor: 'transparent',
    color: '#3f86ea'
  };

  /**
   * @description echarts 显示加载动画效果。
   * @param echartsInstance
   */
  function showLoading(echartsInstance) {
    echartsInstance && echartsInstance.showLoading('default', loadingOption);
  }

  function hideLoading(echartsInstance) {
    echartsInstance && echartsInstance.hideLoading();
  }

  function echarstInit(dom) {
    if (dom == null || dom['length'] == 0) return false;
    $(dom).html('');
    return echarts.init(dom);
  }

  function logout() {
    $.getJSON(service.prefix + '/logout', function (result) {
      if (result['code'] == 200) location.href = result['data']['url'];
    });
  }

  $('body').on('click', '.exit', function () {
    logout();
  });

  var roleObj = {
    100: 'city', // 市管理员
    200: 'county', // 区县管理员
    300: 'school' // 学校管理员
  };

  var role = 'city';
  var roleCode = '100';
  var areaname = '',
      areaid = '',
      orgid = '';
  // city county school
  // 根据角色显示隐藏，隐藏所有角色独有的，显示当前角色独有的
  $.ajax({
    type: 'GET',
    url: service.prefix + '/platform/user',
    async: false,
    dataType: 'json'
  }).done(function (result) {
    if (result['code'] == 200) {
      roleCode = result['data']['usertype'];
      areaname = result['data']['areaname'];
      areaid = result['data']['areaid'];
      orgid = result['data']['orgid'];
      if (roleCode == 300) areaname = result['data']['orgname'];
      $('.header strong').html(areaname);
    } else roleCode = '100';
    role = roleObj[roleCode];
    updateRole(role);
  }).fail(function () {
    roleCode = '100';
    role = roleObj[roleCode];
    updateRole(role);
  });

  function updateRole(role) {
    $('[class^="role-"]').hide();
    $('.role-' + role).show();
  }

  /**
   * @description 获取指定日期 date 的 num 天的截止日期，依赖laydate
   * @param date
   * @param num 2|-2
   */
  function getAbortDate(date, num) {
    var onDaySeconds = 1 * 24 * 60 * 60 * 1000;
    var calculateSeconds = num * onDaySeconds;
    var abortDate = laydate.now(new Date(date).getTime() + calculateSeconds);
    return abortDate;
  }

  /**
   * @description 判断日期的区间，返回是否小于30天
   * @param date_start
   * @param date_end
   * @returns {boolean}
   */
  function isLess30Day(date_start, date_end) {
    var s1 = new Date(date_start).getTime(),
        s2 = new Date(date_end).getTime();
    var day30 = 1000 * 60 * 60 * 24 * 30;
    if (s2 - s1 >= day30) return false;
    return true;
  }

  return {
    echart: {
      init: echarstInit,
      registerMap: echarts.registerMap,
      showLoading: showLoading,
      hideLoading: hideLoading
    },
    role: role,
    areaname: areaname,
    areaid: areaid,
    orgid: orgid,
    getAbortDate: getAbortDate,
    isLess30Day: isLess30Day,
    appendTipDom: appendTipDom,
    removeTipDom: removeTipDom
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL2NvbW1vbi5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwic2VydmljZSIsImVjaGFydHMiLCJvbiIsImhyZWYiLCJhdHRyIiwicm9sZUNvZGUiLCJsb2NhdGlvbiIsInBhcmVudHMiLCJmaW5kIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInBhcmVudCIsInRyaWdnZXIiLCJzaWJsaW5ncyIsImV2ZW50Iiwic2VsZWN0VGFiIiwic2VsZWN0VG9wIiwic2VsZWN0Qm90dG9tIiwiZW1wdHkiLCJodG1sIiwidGV4dCIsImhpZGUiLCJwcmV2Iiwib2JqIiwid2luZG93IiwiY2FuY2VsQnViYmxlIiwic3RvcFByb3BhZ2F0aW9uIiwibmV4dCIsImNzcyIsInNob3ciLCJleHRlbmQiLCJhbGVydCIsIm1zZyIsInJlbW92ZSIsImFwcGVuZCIsImhvdmVyIiwid2lkdGgiLCJoZWlnaHQiLCJsb2FkaW5nIiwidGltZXIiLCJfdGhpcyIsImxvYWRpbmdIdG1sIiwiYW5nbGUxIiwib3BhY2l0eTIiLCJhbmdsZTMiLCJ2MSIsInYyIiwidjMiLCJyb3RhdGUiLCJzZXRUaW1lb3V0IiwiZG9jdW1lbnQiLCJhamF4U2VuZCIsInJlcXVlc3QiLCJzZXR0aW5ncyIsInNldFJlcXVlc3RIZWFkZXIiLCJhamF4Q29tcGxldGUiLCJ4aHIiLCJyZXNwb25zZSIsIkpTT04iLCJwYXJzZSIsImRvbUlkIiwicGFyc2luZ0Vycm9yRG9tSWQiLCJ1cmwiLCJyZWxvYWQiLCJhcHBlbmRUaXBEb20iLCJlIiwiYWpheEVycm9yIiwiZXJyRG9taWQiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwic3BsaXQiLCJsZW5ndGgiLCJjcmVhdGVIdG1sIiwiY2F0ZWdvcnkiLCJjbHMiLCJ0aXRsZU1zZyIsImltZ1NyYyIsImRhdGEiLCJyZW1vdmVUaXBEb20iLCJsb2FkaW5nT3B0aW9uIiwidGV4dENvbG9yIiwibWFza0NvbG9yIiwiY29sb3IiLCJzaG93TG9hZGluZyIsImVjaGFydHNJbnN0YW5jZSIsImhpZGVMb2FkaW5nIiwiZWNoYXJzdEluaXQiLCJkb20iLCJpbml0IiwibG9nb3V0IiwiZ2V0SlNPTiIsInByZWZpeCIsInJlc3VsdCIsInJvbGVPYmoiLCJyb2xlIiwiYXJlYW5hbWUiLCJhcmVhaWQiLCJvcmdpZCIsImFqYXgiLCJ0eXBlIiwiYXN5bmMiLCJkYXRhVHlwZSIsImRvbmUiLCJ1cGRhdGVSb2xlIiwiZmFpbCIsImdldEFib3J0RGF0ZSIsImRhdGUiLCJudW0iLCJvbkRheVNlY29uZHMiLCJjYWxjdWxhdGVTZWNvbmRzIiwiYWJvcnREYXRlIiwibGF5ZGF0ZSIsIm5vdyIsIkRhdGUiLCJnZXRUaW1lIiwiaXNMZXNzMzBEYXkiLCJkYXRlX3N0YXJ0IiwiZGF0ZV9lbmQiLCJzMSIsInMyIiwiZGF5MzAiLCJlY2hhcnQiLCJyZWdpc3Rlck1hcCJdLCJtYXBwaW5ncyI6Ijs7QUFDQUEsT0FBTyxDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLFNBQXRCLENBQVAsRUFBeUMsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxPQUF0QixFQUErQjs7QUFFdEU7O0FBRUE7QUFDQTtBQUNBRixJQUFFLE1BQUYsRUFBVUcsRUFBVixDQUFhLE9BQWIsRUFBc0IsbURBQXRCLEVBQTJFLFlBQVk7QUFDckYsUUFBSUMsT0FBT0osRUFBRSxJQUFGLEVBQVFLLElBQVIsQ0FBYSxXQUFiLENBQVg7QUFDQSxRQUFJRCxJQUFKLEVBQVU7QUFDUixVQUFJQSxTQUFTLFlBQWIsRUFBMkI7QUFDekJBLGVBQU8sV0FBV0UsUUFBWCxHQUFzQixPQUE3QjtBQUNEO0FBQ0RDLGVBQVNILElBQVQsR0FBZ0JBLElBQWhCO0FBQ0Q7QUFDRixHQVJEOztBQVVBO0FBQ0FKLElBQUUsTUFBRixFQUFVRyxFQUFWLENBQWEsT0FBYixFQUFzQixtQkFBdEIsRUFBMkMsWUFBWTtBQUNyREgsTUFBRSxJQUFGLEVBQVFRLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEJDLElBQTFCLENBQStCLFlB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QUosR0FBUyxFQUFULEdBQWMsRUFBZCxHQUFtQixJQUF0QztBQUNBLFFBQUlDLG1CQUFtQkYsTUFBTUMsWUFBN0I7QUFDQSxRQUFJRSxZQUFZQyxRQUFRQyxHQUFSLENBQVksSUFBSUMsSUFBSixDQUFTUCxJQUFULEVBQWVRLE9BQWYsS0FBMkJMLGdCQUF2QyxDQUFoQjtBQUNBLFdBQU9DLFNBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBU0ssV0FBVCxDQUFxQkMsVUFBckIsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQ3pDLFFBQUlDLEtBQUssSUFBSUwsSUFBSixDQUFTRyxVQUFULEVBQXFCRixPQUFyQixFQUFUO0FBQUEsUUFBeUNLLEtBQUssSUFBSU4sSUFBSixDQUFTSSxRQUFULEVBQW1CSCxPQUFuQixFQUE5QztBQUNBLFFBQUlNLFFBQVEsT0FBTyxFQUFQLEdBQVksRUFBWixHQUFpQixFQUFqQixHQUFzQixFQUFsQztBQUNBLFFBQUlELEtBQUtELEVBQUwsSUFBV0UsS0FBZixFQUFzQixPQUFPLEtBQVA7QUFDdEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTztBQUNMQyxZQUFRO0FBQ05qQyxZQUFNRixXQURBO0FBRU5vQyxtQkFBYXpILFFBQVF5SCxXQUZmO0FBR052QyxtQkFBYUEsV0FIUDtBQUlORSxtQkFBYUE7QUFKUCxLQURIO0FBT0xTLFVBQU1BLElBUEQ7QUFRTEMsY0FBVUEsUUFSTDtBQVNMQyxZQUFRQSxNQVRIO0FBVUxDLFdBQU9BLEtBVkY7QUFXTFEsa0JBQWNBLFlBWFQ7QUFZTFUsaUJBQWFBLFdBWlI7QUFhTG5ELGtCQUFjQSxZQWJUO0FBY0xjLGtCQUFjQTtBQWRULEdBQVA7QUFnQkQsQ0FsVkQiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvY29tbW9uLTMxMjMwM2I4ZjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZGVmaW5lKFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAnZWNoYXJ0cyddLCBmdW5jdGlvbiAoJCwgc2VydmljZSwgZWNoYXJ0cykge1xyXG5cclxuICAvL3NlcnZpY2UucHJlZml4ID0gc2VydmljZS5kYXRhSG9zdDtcclxuXHJcbiAgLy8gc2lkZWJhciDkvqfovrnmoI9cclxuICAvLyByb3cxIOmhtemdouWGheWuueWMuuWfn+mhtumDqOWPr+iDveacieeahOWIh+aNonRhYlxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNpZGViYXIgLml0ZW0td3JhcCwgLnJvdzEgLml0ZW0td3JhcCwgLmRhdGEtaHJlZicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBocmVmID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKTtcclxuICAgIGlmIChocmVmKSB7XHJcbiAgICAgIGlmIChocmVmID09PSAnaW5kZXguaHRtbCcpIHtcclxuICAgICAgICBocmVmID0gJ2luZGV4XycgKyByb2xlQ29kZSArICcuaHRtbCc7XHJcbiAgICAgIH1cclxuICAgICAgbG9jYXRpb24uaHJlZiA9IGhyZWY7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIOWNlemAieahhiAucmFkaW8g5YiH5o2iXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcucmFkaW8gLml0ZW0td3JhcCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICQodGhpcykucGFyZW50cygnLnJhZGlvJykuZmluZCgnLml0ZW0td3JhcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS5wYXJlbnQoKS5hdHRyKCdkYXRhLXZhbHVlJywgJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgJCh0aGlzKS5wYXJlbnQoKS50cmlnZ2VyKCdyYWRpb0NoYW5nZScpO1xyXG4gIH0pO1xyXG5cclxuICAvLyB0YWIg5YiH5o2iXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcudGFiIC51bGxpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgJCh0aGlzKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdsaUFjdCcpO1xyXG4gICAgJCh0aGlzKS5hZGRDbGFzcygnbGlBY3QnKTtcclxuICAgICQodGhpcykucGFyZW50KCkuYXR0cignZGF0YS12YWx1ZScsICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICQodGhpcykucGFyZW50KCkudHJpZ2dlcigndGFiQ2hhbmdlJyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIOS4i+aLieahhlxyXG4gICQoXCIuc2VsZWN0VG9wXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgc2VsZWN0VGFiKHRoaXMsIGV2ZW50KTtcclxuICB9KTtcclxuICAkKFwiLnNlbGVjdEJvdHRvbVwiKS5vbignY2xpY2snLCBcImxpXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxlY3RUb3AgPSAkKHRoaXMpLnBhcmVudHMoJy5zZWxlY3RXcmFwJykuZmluZCgnLnNlbGVjdFRvcCcpLFxyXG4gICAgICBzZWxlY3RCb3R0b20gPSAkKHRoaXMpLnBhcmVudHMoXCJkaXYuc2VsZWN0Qm90dG9tXCIpO1xyXG4gICAgc2VsZWN0VG9wLmZpbmQoJ3NwYW4nKS5lbXB0eSgpLmh0bWwoJCh0aGlzKS50ZXh0KCkpO1xyXG4gICAgc2VsZWN0VG9wLmF0dHIoJ2RhdGEtdmFsdWUnLCAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICBzZWxlY3RUb3AuYXR0cignZGF0YS10eXBlJywgJCh0aGlzKS5hdHRyKCdkYXRhLXR5cGUnKSk7XHJcbiAgICBzZWxlY3RCb3R0b20uaGlkZSgpO1xyXG4gICAgc2VsZWN0Qm90dG9tLnByZXYoKS5hZGRDbGFzcyhcInNlbGVjdFRvcEFjdFwiKS5yZW1vdmVDbGFzcyhcInNlbGVjdFRvcEFjdDFcIik7XHJcbiAgICBzZWxlY3RUb3AudHJpZ2dlcignc2VsZWN0Q2hhbmdlJyk7XHJcbiAgfSk7XHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICQoJy5zZWxlY3RCb3R0b20nKS5oaWRlKCk7XHJcbiAgICAkKFwiLnNlbGVjdFRvcFwiKS5hZGRDbGFzcyhcInNlbGVjdFRvcEFjdFwiKS5yZW1vdmVDbGFzcyhcInNlbGVjdFRvcEFjdDFcIik7XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gc2VsZWN0VGFiKG9iaiwgZXZlbnQpIHtcclxuICAgIGlmICh3aW5kb3cuY2FuY2VsQnViYmxlKSBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xyXG4gICAgZWxzZSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGlmICgkKG9iaikubmV4dCgpLmNzcygnZGlzcGxheScpID09IFwibm9uZVwiKSB7XHJcbiAgICAgICQob2JqKS5uZXh0KCkuc2hvdygpO1xyXG4gICAgICAkKG9iaikuYWRkQ2xhc3MoXCJzZWxlY3RUb3BBY3QxXCIpLnJlbW92ZUNsYXNzKFwic2VsZWN0VG9wQWN0XCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChvYmopLm5leHQoKS5oaWRlKCk7XHJcbiAgICAgICQob2JqKS5hZGRDbGFzcyhcInNlbGVjdFRvcEFjdFwiKS5yZW1vdmVDbGFzcyhcInNlbGVjdFRvcEFjdDFcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDmj5Lku7ZcclxuICAkLmV4dGVuZCh7XHJcbiAgICBhbGVydDogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICBtc2cgPSBtc2cgfHwgJ+ivt+i+k+WFpeW/heimgeS/oeaBryc7XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5tYWluYm8tYWxlcnQtbWFzayAuYnRuLWNsb3NlLCAubWFpbmJvLWFsZXJ0LW1hc2sgLmNsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykucGFyZW50cygnLm1haW5iby1hbGVydC1tYXNrJykucmVtb3ZlKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIGFsZXJ0ID0gJzxkaXYgY2xhc3M9XCJtYWluYm8tYWxlcnQtbWFza1wiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyB0b3A6IDA7IHJpZ2h0OiAwOyAnICtcclxuICAgICAgICAnYm90dG9tOiAwOyBsZWZ0OiAwOyBiYWNrZ3JvdW5kOiByZ2JhKDAsMCwwLC40KVwiPicgK1xyXG4gICAgICAgICc8ZGl2IGNsYXNzPVwibWFpbmJvLWFsZXJ0XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogNTAlOyBsZWZ0OiA1MCU7ICcgK1xyXG4gICAgICAgICdkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHRleHQtYWxpZ246IGNlbnRlcjsnICtcclxuICAgICAgICAncGFkZGluZzogMzBweDsgYm9yZGVyOiAxcHggc29saWQgIzM5NzVkNzsgYmFja2dyb3VuZDogIzIwMzQ2OTsgY29sb3I6ICNmZmY7XCI+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiY2xvc2VcIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAxMHB4OyByaWdodDogMTBweDsgd2lkdGg6IDEycHg7IGhlaWdodDogMTJweDsnICtcclxuICAgICAgICAnYmFja2dyb3VuZDogdXJsKGltYWdlcy9pY29ucy5wbmcpIG5vLXJlcGVhdCAtMTRweCAtNDM5cHg7IGN1cnNvcjogcG9pbnRlcjtcIiAgb25jbGljaz1cImNsb3NlKClcIj48L3NwYW4+JyArXHJcbiAgICAgICAgJzxwcmUgc3R5bGU9XCJtYXJnaW46IDE1cHggMzBweCAzMHB4O1wiPicgKyBtc2cgKyAnPC9wcmU+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiYnRuLWNsb3NlXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHdpZHRoOiAxMTdweDsgaGVpZ2h0OiAzMHB4OyBsaW5lLWhlaWdodDogMzBweDsgJyArXHJcbiAgICAgICAgJ3RleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAxNHB4OyBiYWNrZ3JvdW5kOiAjMmU1MWEzOyBjdXJzb3I6IHBvaW50ZXI7XCIgb25jbGljaz1cImNsb3NlKClcIj7noa7lrpo8L3NwYW4+JyArXHJcbiAgICAgICAgJzwvZGl2PjwvZGl2Pic7XHJcblxyXG4gICAgICAkKCdib2R5JykuYXBwZW5kKGFsZXJ0KTtcclxuICAgICAgJCgnLm1haW5iby1hbGVydCAuY2xvc2UnKS5ob3ZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCAnMCAtNDM5cHgnKTtcclxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgJy0xNHB4IC00MzlweCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLm1haW5iby1hbGVydCcpXHJcbiAgICAgICAgLmNzcygnbWFyZ2luTGVmdCcsICctJyArICgkKCcubWFpbmJvLWFsZXJ0Jykud2lkdGgoKSAvIDIpICsgJ3B4JylcclxuICAgICAgICAuY3NzKCdtYXJnaW5Ub3AnLCAnLScgKyAoJCgnLm1haW5iby1hbGVydCcpLmhlaWdodCgpIC8gMikgKyAncHgnKTtcclxuICAgIH0sXHJcbiAgICBsb2FkaW5nOiB7XHJcbiAgICAgIHRpbWVyOiAwLFxyXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy50aW1lciA9IDE7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgbG9hZGluZ0h0bWwgPSAnPGRpdiBjbGFzcz1cIm1haW5iby1sb2FkaW5nLW1hc2tcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgdG9wOiAwOyByaWdodDogMDsgJyArXHJcbiAgICAgICAgICAnYm90dG9tOiAwOyBsZWZ0OiAwO1wiPicgK1xyXG4gICAgICAgICAgJzxkaXYgY2xhc3M9XCJtYWluYm8tbG9hZGluZ1wiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyB0b3A6IDUwJTsgbGVmdDogNTAlOyB3aWR0aDogMjUwcHg7IGhlaWdodDogMjUwcHg7ICcgK1xyXG4gICAgICAgICAgJ21hcmdpbi10b3A6IC0xMjVweDsgbWFyZ2luLWxlZnQ6IC0xMjVweDsgYmFja2dyb3VuZDogdXJsKGltYWdlcy9sb2FkaW5nLnBuZykgbm8tcmVwZWF0IDAgMDtcIj4nICtcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy0xXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDt3aWR0aDogMjUwcHg7IGhlaWdodDogMjUwcHg7IGJhY2tncm91bmQ6IHVybChpbWFnZXMvbG9hZGluZy5wbmcpIG5vLXJlcGVhdCAtMjUwcHggMDtcIj48L2Rpdj4nICtcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy0yXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDt3aWR0aDogMjUwcHg7IGhlaWdodDogMjUwcHg7IGJhY2tncm91bmQ6IHVybChpbWFnZXMvbG9hZGluZy5wbmcpIG5vLXJlcGVhdCAtNTAwcHggMDtcIj48L2Rpdj4nICtcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy0zXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDt3aWR0aDogMjUwcHg7IGhlaWdodDogMjUwcHg7IGJhY2tncm91bmQ6IHVybChpbWFnZXMvbG9hZGluZy5wbmcpIG5vLXJlcGVhdCAtNzUwcHggMDtcIj48L2Rpdj4nICtcclxuICAgICAgICAgICc8ZGl2IGNsYXNzPVwibG9hZGluZy00XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDt3aWR0aDogMjUwcHg7IGhlaWdodDogMjUwcHg7IGxpbmUtaGVpZ2h0OiAyNTBweDsgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogI2ZmZjsgZm9udC1zaXplOiAyMnB4XCI+TG9hZGluZy4uLjwvZGl2PicgK1xyXG4gICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgJzwvZGl2Pic7XHJcblxyXG4gICAgICAgIHZhciBhbmdsZTEgPSAwLCBvcGFjaXR5MiA9IDEsIGFuZ2xlMyA9IDAsIHYxID0gMC41LCB2MiA9IC0wLjAxLCB2MyA9IDE7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJvdGF0ZSgpIHtcclxuICAgICAgICAgICQoJy5tYWluYm8tbG9hZGluZy1tYXNrIC5sb2FkaW5nLTEnKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGUoJyArIGFuZ2xlMSArICdkZWcpJyk7XHJcbiAgICAgICAgICAkKCcubWFpbmJvLWxvYWRpbmctbWFzayAubG9hZGluZy0yJykuY3NzKCdvcGFjaXR5Jywgb3BhY2l0eTIpO1xyXG4gICAgICAgICAgJCgnLm1haW5iby1sb2FkaW5nLW1hc2sgLmxvYWRpbmctNCcpLmNzcygnb3BhY2l0eScsIG9wYWNpdHkyKTtcclxuICAgICAgICAgICQoJy5tYWluYm8tbG9hZGluZy1tYXNrIC5sb2FkaW5nLTMnKS5jc3MoJ3RyYW5zZm9ybScsICdyb3RhdGUoJyArIGFuZ2xlMyArICdkZWcpJyk7XHJcbiAgICAgICAgICBhbmdsZTEgKz0gdjE7XHJcbiAgICAgICAgICBvcGFjaXR5MiArPSB2MjtcclxuICAgICAgICAgIGFuZ2xlMyArPSB2MztcclxuICAgICAgICAgIGlmIChhbmdsZTEgPj0gMTgwIHx8IGFuZ2xlMSA8PSAtMTgwKSB7XHJcbiAgICAgICAgICAgIHYxID0gLXYxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKG9wYWNpdHkyID49IDEgfHwgb3BhY2l0eTIgPD0gMCkgdjIgPSAtdjI7XHJcbiAgICAgICAgICBfdGhpcy50aW1lciAmJiBzZXRUaW1lb3V0KHJvdGF0ZSwgMTYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm90YXRlKCk7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChsb2FkaW5nSHRtbCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgICAgICAkKCcubWFpbmJvLWxvYWRpbmctbWFzaycpLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vICQubG9hZGluZy5zaG93KCk7XHJcblxyXG4gIC8vIHZhciBhamF4Q291bnQgPSAwLCBleGNsdWRlID0gW3NlcnZpY2UucHJlZml4ICsgJy9wbGF0Zm9ybS91c2VyJ107XHJcbiAgJChkb2N1bWVudCkuYWpheFNlbmQoZnVuY3Rpb24gKGV2ZW50LCByZXF1ZXN0LCBzZXR0aW5ncykge1xyXG4gICAgLy8gYWpheENvdW50Kys7XHJcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAneG1saHR0cHJlcXVlc3RfbWFpbmJvJyk7XHJcbiAgfSk7XHJcbiAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uIChldmVudCwgeGhyLCBzZXR0aW5ncykge1xyXG4gICAgLy8gYWpheENvdW50LS07XHJcbiAgICAvLyBpZiAoZXhjbHVkZS50b1N0cmluZygpLmluZGV4T2Yoc2V0dGluZ3MudXJsKSA8IDApIHtcclxuICAgIC8vICAgaWYgKGFqYXhDb3VudCA9PT0gMCkgJC5sb2FkaW5nLmhpZGUoKTtcclxuICAgIC8vIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyWydyZXNwb25zZVRleHQnXSk7XHJcbiAgICAgIHZhciBkb21JZCA9IHBhcnNpbmdFcnJvckRvbUlkKHNldHRpbmdzLnVybCk7XHJcbiAgICAgIGlmIChyZXNwb25zZVsnY29kZSddID09IDIwMDAxKSBsb2NhdGlvbi5yZWxvYWQoICk7XHJcbiAgICAgIGlmICgocmVzcG9uc2VbJ2NvZGUnXSA9PSAyMDAgfHwgcmVzcG9uc2VbJ2NvZGUnXSA9PSAxKSAmJlxyXG4gICAgICAgIChyZXNwb25zZVsnZGF0YSddWydsZW5ndGgnXSA9PSAwIHx8IHJlc3BvbnNlWydkYXRhJ11bJ2RhdGFsaXN0J11bJ2xlbmd0aCddID09IDAgfHwgcmVzcG9uc2VbJ2RhdGEnXVsnZGF0YUxpc3QnXVsnbGVuZ3RoJ10gPT0gMCkpIHtcclxuICAgICAgICBpZiAoZG9tSWQpIGFwcGVuZFRpcERvbShkb21JZCwgJ3RpcCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlWydjb2RlJ10gIT0gMjAwICYmIHJlc3BvbnNlWydjb2RlJ10gIT0gMSkge1xyXG4gICAgICAgIGlmIChkb21JZCkgYXBwZW5kVGlwRG9tKGRvbUlkKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuICAkKGRvY3VtZW50KS5hamF4RXJyb3IoZnVuY3Rpb24gKGV2ZW50LCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgICB2YXIgZG9tSWQgPSBwYXJzaW5nRXJyb3JEb21JZChzZXR0aW5ncy51cmwpO1xyXG4gICAgaWYgKGRvbUlkKSBhcHBlbmRUaXBEb20oZG9tSWQpO1xyXG4gIH0pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5lcnJvckRvbScsIGZ1bmN0aW9uICgpIHtcclxuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gIH0pO1xyXG4gIGZ1bmN0aW9uIHBhcnNpbmdFcnJvckRvbUlkKHVybCkge1xyXG4gICAgdmFyIGVyckRvbWlkID0gJyc7XHJcbiAgICBlcnJEb21pZCA9IHVybC5pbmRleE9mKCdlcnJvckRvbUlkJyk7XHJcbiAgICBpZiAoZXJyRG9taWQgPD0gMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgZXJyRG9taWQgPSB1cmwuc3Vic3RyaW5nKGVyckRvbWlkKS5zcGxpdCgnPScpO1xyXG4gICAgaWYgKGVyckRvbWlkLmxlbmd0aCAhPSAyKSByZXR1cm4gZmFsc2U7XHJcbiAgICBlcnJEb21pZCA9IGVyckRvbWlkWzFdO1xyXG4gICAgcmV0dXJuIGVyckRvbWlkO1xyXG4gIH1cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUh0bWwoY2F0ZWdvcnkpIHtcclxuICAgIHZhciBjbHMgPSAnZXJyb3JEb20nLCB0aXRsZU1zZyA9ICfngrnlh7vph43or5UnLFxyXG4gICAgICBtc2cgPSAn572R57uc5byC5bi45oiW5pWw5o2u5Yqg6L295aSx6LSl77yM6K+36YeN6K+VJywgaW1nU3JjID0gJ2ltYWdlcy9lcnJvci5wbmcnO1xyXG4gICAgaWYgKGNhdGVnb3J5ID09ICd0aXAnKSB7XHJcbiAgICAgIGNscyA9ICdub0RhdGEnO1xyXG4gICAgICB0aXRsZU1zZyA9ICcnO1xyXG4gICAgICBtc2cgPSAn5pqC5peg5pWw5o2uJztcclxuICAgICAgaW1nU3JjID0gJ2ltYWdlcy90aXAucG5nJztcclxuICAgIH1cclxuICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIicgKyBjbHMgKyAnXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgYm90dG9tOiAwOyBsZWZ0OiAwOyByaWdodDogMDsnICtcclxuICAgICAgJ3dpZHRoOiAyMTBweDsgaGVpZ2h0OiAxMjNweDsgbWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiB1cmwoJyArIGltZ1NyYyArICcpIG5vLXJlcGVhdCBjZW50ZXIgdG9wOycgK1xyXG4gICAgICAnIGN1cnNvcjogcG9pbnRlcjtcIiB0aXRsZT1cIicgKyB0aXRsZU1zZyArICdcIj4nICtcclxuICAgICAgJzxwIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7IGJvdHRvbTogMDsgd2lkdGg6MTAwJTsgY29sb3I6ICNlMWVjZmY7IGZvbnQtc2l6ZTogMTRweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPidcclxuICAgICAgKyBtc2cgKyAnPC9wPicgK1xyXG4gICAgICAnPC9kaXY+JztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGVuZFRpcERvbShkb21JZCwgY2F0ZWdvcnkpIHtcclxuICAgIGlmIChkb21JZCA9PT0gJ2dyb3VwX3JhdGlvX2FuYWx5c2lzJykge1xyXG4gICAgICAkKCcjJyArIGRvbUlkKS5hcHBlbmQoY3JlYXRlSHRtbChjYXRlZ29yeSkpO1xyXG4gICAgICAkKCcjJyArIGRvbUlkICsgJyAuZ3JvdXBfcmF0aW9fY291bnQnKS5oaWRlKCk7XHJcbiAgICAgICQoJyMnICsgZG9tSWQgKyAnIC5kaXZpZGVyJykuaGlkZSgpO1xyXG4gICAgfSBlbHNlIGlmIChkb21JZCA9PT0gJ2FwcF90cmFmZmljMTBfd3JhcCcpIHtcclxuICAgICAgJCgnIycgKyBkb21JZCkuYXBwZW5kKGNyZWF0ZUh0bWwoY2F0ZWdvcnkpKTtcclxuICAgICAgJCgnIycgKyBkb21JZCArICcgI2FwcF90cmFmZmljMTAnKS5oaWRlKCk7XHJcbiAgICAgICQoJyMnICsgZG9tSWQgKyAnICNhcHBfdHJhZmZpYzEwX3BpZScpLmhpZGUoKTtcclxuICAgIH0gZWxzZVxyXG4gICAgICAkKCcjJyArIGRvbUlkKS5kYXRhKCdvbGRIdG1sJywgJCgnIycgKyBkb21JZCkuaHRtbCgpKS5odG1sKGNyZWF0ZUh0bWwoY2F0ZWdvcnkpKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZVRpcERvbShkb21JZCkge1xyXG4gICAgaWYgKGRvbUlkID09PSAnYXBwX3RyYWZmaWMxMF93cmFwJykge1xyXG4gICAgICAkKCcjJyArIGRvbUlkKycgLmVycm9yRG9tJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyMnICsgZG9tSWQrJyAubm9EYXRhJykucmVtb3ZlKCk7XHJcbiAgICAgICQoJyMnICsgZG9tSWQgKyAnICNhcHBfdHJhZmZpYzEwJykuc2hvdygpO1xyXG4gICAgICAkKCcjJyArIGRvbUlkICsgJyAjYXBwX3RyYWZmaWMxMF9waWUnKS5zaG93KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBlY2hhcnRzIOWKoOi9veWKqOeUu+mFjee9rumhuVxyXG4gIHZhciBsb2FkaW5nT3B0aW9uID0ge1xyXG4gICAgdGV4dENvbG9yOiAnI2ExYmNlOScsXHJcbiAgICBtYXNrQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICBjb2xvcjogJyMzZjg2ZWEnXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQGRlc2NyaXB0aW9uIGVjaGFydHMg5pi+56S65Yqg6L295Yqo55S75pWI5p6c44CCXHJcbiAgICogQHBhcmFtIGVjaGFydHNJbnN0YW5jZVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIHNob3dMb2FkaW5nKGVjaGFydHNJbnN0YW5jZSkge1xyXG4gICAgZWNoYXJ0c0luc3RhbmNlICYmIGVjaGFydHNJbnN0YW5jZS5zaG93TG9hZGluZygnZGVmYXVsdCcsIGxvYWRpbmdPcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGlkZUxvYWRpbmcoZWNoYXJ0c0luc3RhbmNlKSB7XHJcbiAgICBlY2hhcnRzSW5zdGFuY2UgJiYgZWNoYXJ0c0luc3RhbmNlLmhpZGVMb2FkaW5nKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBlY2hhcnN0SW5pdChkb20pIHtcclxuICAgIGlmIChkb20gPT0gbnVsbCB8fCBkb21bJ2xlbmd0aCddID09IDApIHJldHVybiBmYWxzZTtcclxuICAgICQoZG9tKS5odG1sKCcnKTtcclxuICAgIHJldHVybiBlY2hhcnRzLmluaXQoZG9tKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvbG9nb3V0JywgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSBsb2NhdGlvbi5ocmVmID0gcmVzdWx0WydkYXRhJ11bJ3VybCddO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmV4aXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBsb2dvdXQoKTtcclxuICB9KTtcclxuXHJcblxyXG4gIHZhciByb2xlT2JqID0ge1xyXG4gICAgMTAwOiAnY2l0eScsIC8vIOW4gueuoeeQhuWRmFxyXG4gICAgMjAwOiAnY291bnR5JywgLy8g5Yy65Y6/566h55CG5ZGYXHJcbiAgICAzMDA6ICdzY2hvb2wnIC8vIOWtpuagoeeuoeeQhuWRmFxyXG4gIH07XHJcblxyXG4gIHZhciByb2xlID0gJ2NpdHknO1xyXG4gIHZhciByb2xlQ29kZSA9ICcxMDAnO1xyXG4gIHZhciBhcmVhbmFtZSA9ICcnLCBhcmVhaWQgPSAnJywgb3JnaWQgPSAnJztcclxuICAvLyBjaXR5IGNvdW50eSBzY2hvb2xcclxuICAvLyDmoLnmja7op5LoibLmmL7npLrpmpDol4/vvIzpmpDol4/miYDmnInop5LoibLni6zmnInnmoTvvIzmmL7npLrlvZPliY3op5LoibLni6zmnInnmoRcclxuICAkLmFqYXgoe1xyXG4gICAgdHlwZTogJ0dFVCcsXHJcbiAgICB1cmw6IHNlcnZpY2UucHJlZml4ICsgJy9wbGF0Zm9ybS91c2VyJyxcclxuICAgIGFzeW5jOiBmYWxzZSxcclxuICAgIGRhdGFUeXBlOiAnanNvbidcclxuICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgcm9sZUNvZGUgPSByZXN1bHRbJ2RhdGEnXVsndXNlcnR5cGUnXTtcclxuICAgICAgYXJlYW5hbWUgPSByZXN1bHRbJ2RhdGEnXVsnYXJlYW5hbWUnXTtcclxuICAgICAgYXJlYWlkID0gcmVzdWx0WydkYXRhJ11bJ2FyZWFpZCddO1xyXG4gICAgICBvcmdpZCA9IHJlc3VsdFsnZGF0YSddWydvcmdpZCddO1xyXG4gICAgICBpZiAocm9sZUNvZGUgPT0gMzAwKSBhcmVhbmFtZSA9IHJlc3VsdFsnZGF0YSddWydvcmduYW1lJ11cclxuICAgICAgJCgnLmhlYWRlciBzdHJvbmcnKS5odG1sKGFyZWFuYW1lKTtcclxuICAgIH0gZWxzZSByb2xlQ29kZSA9ICcxMDAnO1xyXG4gICAgcm9sZSA9IHJvbGVPYmpbcm9sZUNvZGVdO1xyXG4gICAgdXBkYXRlUm9sZShyb2xlKTtcclxuXHJcbiAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XHJcbiAgICByb2xlQ29kZSA9ICcxMDAnO1xyXG4gICAgcm9sZSA9IHJvbGVPYmpbcm9sZUNvZGVdO1xyXG4gICAgdXBkYXRlUm9sZShyb2xlKTtcclxuICB9KTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVJvbGUocm9sZSkge1xyXG4gICAgJCgnW2NsYXNzXj1cInJvbGUtXCJdJykuaGlkZSgpO1xyXG4gICAgJCgnLnJvbGUtJyArIHJvbGUpLnNob3coKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBkZXNjcmlwdGlvbiDojrflj5bmjIflrprml6XmnJ8gZGF0ZSDnmoQgbnVtIOWkqeeahOaIquatouaXpeacn++8jOS+nei1lmxheWRhdGVcclxuICAgKiBAcGFyYW0gZGF0ZVxyXG4gICAqIEBwYXJhbSBudW0gMnwtMlxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldEFib3J0RGF0ZShkYXRlLCBudW0pIHtcclxuICAgIHZhciBvbkRheVNlY29uZHMgPSAxICogMjQgKiA2MCAqIDYwICogMTAwMDtcclxuICAgIHZhciBjYWxjdWxhdGVTZWNvbmRzID0gbnVtICogb25EYXlTZWNvbmRzO1xyXG4gICAgdmFyIGFib3J0RGF0ZSA9IGxheWRhdGUubm93KG5ldyBEYXRlKGRhdGUpLmdldFRpbWUoKSArIGNhbGN1bGF0ZVNlY29uZHMpO1xyXG4gICAgcmV0dXJuIGFib3J0RGF0ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBkZXNjcmlwdGlvbiDliKTmlq3ml6XmnJ/nmoTljLrpl7TvvIzov5Tlm57mmK/lkKblsI/kuo4zMOWkqVxyXG4gICAqIEBwYXJhbSBkYXRlX3N0YXJ0XHJcbiAgICogQHBhcmFtIGRhdGVfZW5kXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gaXNMZXNzMzBEYXkoZGF0ZV9zdGFydCwgZGF0ZV9lbmQpIHtcclxuICAgIHZhciBzMSA9IG5ldyBEYXRlKGRhdGVfc3RhcnQpLmdldFRpbWUoKSwgczIgPSBuZXcgRGF0ZShkYXRlX2VuZCkuZ2V0VGltZSgpO1xyXG4gICAgdmFyIGRheTMwID0gMTAwMCAqIDYwICogNjAgKiAyNCAqIDMwO1xyXG4gICAgaWYgKHMyIC0gczEgPj0gZGF5MzApIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVjaGFydDoge1xyXG4gICAgICBpbml0OiBlY2hhcnN0SW5pdCxcclxuICAgICAgcmVnaXN0ZXJNYXA6IGVjaGFydHMucmVnaXN0ZXJNYXAsXHJcbiAgICAgIHNob3dMb2FkaW5nOiBzaG93TG9hZGluZyxcclxuICAgICAgaGlkZUxvYWRpbmc6IGhpZGVMb2FkaW5nXHJcbiAgICB9LFxyXG4gICAgcm9sZTogcm9sZSxcclxuICAgIGFyZWFuYW1lOiBhcmVhbmFtZSxcclxuICAgIGFyZWFpZDogYXJlYWlkLFxyXG4gICAgb3JnaWQ6IG9yZ2lkLFxyXG4gICAgZ2V0QWJvcnREYXRlOiBnZXRBYm9ydERhdGUsXHJcbiAgICBpc0xlc3MzMERheTogaXNMZXNzMzBEYXksXHJcbiAgICBhcHBlbmRUaXBEb206IGFwcGVuZFRpcERvbSxcclxuICAgIHJlbW92ZVRpcERvbTogcmVtb3ZlVGlwRG9tXHJcbiAgfVxyXG59KTsiXX0=
