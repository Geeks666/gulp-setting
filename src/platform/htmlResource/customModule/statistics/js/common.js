
define(['jquery', 'service', 'echarts'], function ($, service, echarts) {

  //service.prefix = service.dataHost;

  // sidebar 侧边栏
  // row1 页面内容区域顶部可能有的切换tab
  $('body').on('click', '.sidebar .item-wrap, .row1 .item-wrap, .data-href', function () {
    var href = $(this).attr('data-href');
    if (href) {
      if (href === 'index.html') {
        href = 'index_200' + '.html';
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
    if (window.cancelBubble) event.cancelBubble = true;
    else event.stopPropagation();
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
    alert: function (msg) {
      msg = msg || '请输入必要信息';

      $('body').on('click', '.mainbo-alert-mask .btn-close, .mainbo-alert-mask .close', function () {
        $(this).parents('.mainbo-alert-mask').remove();
      });

      var alert = '<div class="mainbo-alert-mask" style="position: fixed; top: 0; right: 0; ' +
        'bottom: 0; left: 0; background: rgba(0,0,0,.4)">' +
        '<div class="mainbo-alert" style="position: absolute; top: 50%; left: 50%; ' +
        'display: inline-block; text-align: center;' +
        'padding: 30px; border: 1px solid #3975d7; background: #203469; color: #fff;">' +
        '<span class="close" style="position: absolute; top: 10px; right: 10px; width: 12px; height: 12px;' +
        'background: url(images/icons.png) no-repeat -14px -439px; cursor: pointer;"  onclick="close()"></span>' +
        '<pre style="margin: 15px 30px 30px;">' + msg + '</pre>' +
        '<span class="btn-close" style="display: inline-block; width: 117px; height: 30px; line-height: 30px; ' +
        'text-align: center; font-size: 14px; background: #2e51a3; cursor: pointer;" onclick="close()">确定</span>' +
        '</div></div>';

      $('body').append(alert);
      $('.mainbo-alert .close').hover(function () {
        $(this).css('background-position', '0 -439px');
      }, function () {
        $(this).css('background-position', '-14px -439px');
      });
      $('.mainbo-alert')
        .css('marginLeft', '-' + ($('.mainbo-alert').width() / 2) + 'px')
        .css('marginTop', '-' + ($('.mainbo-alert').height() / 2) + 'px');
    },
    loading: {
      timer: 0,
      show: function () {
        this.hide();
        this.timer = 1;
        var _this = this;
        var loadingHtml = '<div class="mainbo-loading-mask" style="position: fixed; top: 0; right: 0; ' +
          'bottom: 0; left: 0;">' +
          '<div class="mainbo-loading" style="position: absolute; top: 50%; left: 50%; width: 250px; height: 250px; ' +
          'margin-top: -125px; margin-left: -125px; background: url(images/loading.png) no-repeat 0 0;">' +
          '<div class="loading-1" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -250px 0;"></div>' +
          '<div class="loading-2" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -500px 0;"></div>' +
          '<div class="loading-3" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; background: url(images/loading.png) no-repeat -750px 0;"></div>' +
          '<div class="loading-4" style="position: absolute; top: 0; left: 0;width: 250px; height: 250px; line-height: 250px; text-align: center; color: #fff; font-size: 22px">Loading...</div>' +
          '</div>' +
          '</div>';

        var angle1 = 0, opacity2 = 1, angle3 = 0, v1 = 0.5, v2 = -0.01, v3 = 1;

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
      hide: function () {
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
      if (response['code'] == 20001) location.reload( );
      if ((response['code'] == 200 || response['code'] == 1) &&
        (response['data']['length'] == 0 || response['data']['datalist']['length'] == 0 || response['data']['dataList']['length'] == 0)) {
        if (domId) appendTipDom(domId, 'tip');
      } else if (response['code'] != 200 && response['code'] != 1) {
        if (domId) appendTipDom(domId);
      }
    } catch (e) {
    }

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
    var cls = 'errorDom', titleMsg = '点击重试',
      msg = '网络异常或数据加载失败，请重试', imgSrc = 'images/error.png';
    if (category == 'tip') {
      cls = 'noData';
      titleMsg = '';
      msg = '暂无数据';
      imgSrc = 'images/tip.png';
    }
    return '<div class="' + cls + '" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0;' +
      'width: 210px; height: 123px; margin: auto; background: url(' + imgSrc + ') no-repeat center top;' +
      ' cursor: pointer;" title="' + titleMsg + '">' +
      '<p style="position:absolute; bottom: 0; width:100%; color: #e1ecff; font-size: 14px; text-align: center;">'
      + msg + '</p>' +
      '</div>';
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
    } else
      $('#' + domId).data('oldHtml', $('#' + domId).html()).html(createHtml(category));
  }

  function removeTipDom(domId) {
    if (domId === 'app_traffic10_wrap') {
      $('#' + domId+' .errorDom').remove();
      $('#' + domId+' .noData').remove();
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
    })
  }

  $('body').on('click', '.exit', function () {
    logout();
  });


  var roleObj = {
    100: 'city', // 市管理员
    200: 'county', // 区县管理员
    300: 'school' // 学校管理员
  };

  var role = 'county';
  var roleCode = '200';
  var areaname = '', areaid = '', orgid = '';
  // city county school
  // 根据角色显示隐藏，隐藏所有角色独有的，显示当前角色独有的
  /*$.ajax({
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
      if (roleCode == 300) areaname = result['data']['orgname']
      $('.header strong').html(areaname);
    } else roleCode = '100';
    role = roleObj[roleCode];
    updateRole(role);

  }).fail(function () {
    roleCode = '100';
    role = roleObj[roleCode];
    updateRole(role);
  });*/
  updateRole();
  function updateRole(role) {
    /*$('[class^="role-"]').hide();
    $('.role-' + role).show();*/
    $('[class^="role-"]').hide();
    $('.role-county').show();
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
    var s1 = new Date(date_start).getTime(), s2 = new Date(date_end).getTime();
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
  }
});