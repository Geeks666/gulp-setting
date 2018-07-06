define('tools', ['jquery'], function ($) {
  String.prototype.subCompare = function (begin, end, str) {
    var comparestring = this.substring(begin, end);
    return comparestring.localeCompare(str);
  }
  //输入框提示
  /*
   obj   输入框input 默认值为 input 的 value
   类型 jquery对象
   */
  var textHint = function (obj, callback) {
    obj.bind({
      focus: function () {
        if (this.value == this.defaultValue) {
          this.value = "";
        }
      },
      blur: function () {
        if (this.value == "") {
          typeof callback == 'function' && callback();
          this.value = this.defaultValue;
        }
      }
    });
  }

  //底部自适应
  /*
   obj         设置高度对象                  类型 jquery对象
   hideNum     屏幕固定不变的高度            类型 Number
   minNum      可设置为内容的最小高度        类型 Number
   如果计算出来的值大于该值则使用计算的值
   */
  var winChange = function (obj, minNum, hideNum) {
    var contHeight = $(window).height() - hideNum;
    if (contHeight < minNum) {
      contHeight = minNum;
    }
    obj.css('min-height', contHeight)
  }

  /* 计算标题数量

   obj     input  输入框      类型 jquery对象
   target  要改变的数字       类型 jquery对象
   maxNum  最大值             类型 Number

   */
  var titleNum = function (obj, target, maxNnm) {
    var length = 0;
    var time = null;

    function watchNum() {
      time = setInterval(function () {
        target.html(obj.val().length);
      }, 30);
    }

    obj.bind({
      focus: function () {
        watchNum();
      },
      blur: function () {
        clearInterval(time);
      }
    });
  }
  /*
   success 上传成功
   failed 上传失败

   */
  var toast = function (content) {
    if ($("#upload-msg").length == 0) {
      $('body').append('<div id="upload-msg">' + content + '</div>');
      var adiv = $('#upload-msg').eq(0).get(0);
      adiv.style.marginTop = -adiv.offsetHeight / 2 + 'px';
      adiv.style.marginLeft = -adiv.offsetWidth / 2 + 'px';
      setTimeout(function () {
        $('#upload-msg').fadeOut(function () {
          $('#upload-msg').remove();
        })

      }, 2500)
    } else if ($("#upload-msg").html() !== content) {
      $('#upload-msg').remove();
      $('body').append('<div id="upload-msg">' + content + '</div>');
      var adiv = $('#upload-msg').eq(0).get(0);
      adiv.style.marginTop = -adiv.offsetHeight / 2 + 'px';
      adiv.style.marginLeft = -adiv.offsetWidth / 2 + 'px';
      setTimeout(function () {
        $('#upload-msg').fadeOut(function () {
          $('#upload-msg').remove();
        })

      }, 2500)
    }
  }

  var uploadToast = function (isSuccess) {
    var box_content = '';
    if (isSuccess) {
      box_content = '<span class="icon-success"></span>恭喜，上传成功。'
    } else {
      box_content = '<span class="icon-error"></span>抱歉，上传失败。'
    }
    toast(box_content);
  }

  var setFileIcon = function () {
    $("#fileicon").each(function () {
      var fileType = $(this).attr("data-file");
      fileType = "icon-" + fileType + "-small";
      $(this).addClass(fileType);
    })
  }

  /*
   * 对话框点击事件
   * */
  var dialogClick = function (callBack, obj) {
    if (!callBack && !obj) {
      callBack = function () {
      };
      obj = {};
    }
    $('#mask,.dialog-box').on({
      'mousewheel': function () {
        return false;
      },
      'click': function () {
        return false;
      }
    });
    //删除确定按钮
    $('#confirm').click(function () {
      if (typeof callBack == 'function') {
        if (typeof obj == 'object') {
          callBack(obj);
        } else {
          callBack();
        }
      }
      $('#mask').remove();
      $('.dialog-box').remove();
      return false;
    });
    $('#cancel').click(closeDialog);
    $('.close-dialog').click(closeDialog);
    function closeDialog() {
      $('#mask').remove();
      $('.dialog-box').remove();
      return false;
    }
  };

  /*对话框提示*/
  var confirmDialog = function (title, content, callBack, hasCancel) {
    if (typeof callBack !== 'function') {
      hasCancel = callBack;
    }
    hasCancel = typeof hasCancel == 'boolean' ? hasCancel : true;
    var cancelStr = '';
    if (hasCancel) {
      cancelStr = '<a id="cancel" class="btn-active remve-btn" href="javascript:;">取消</a>';
    }
    $('body').append('<div id="mask"></div>');
    $('body').append('<div id="dialog-box" class="dialog-box">' +
      '<h2 class="header">' + title + '</h2>' +
      '<p class="text">' + content + '</p>' +
      '<p class="btns">' +
      '<a id="confirm" class="btn remve-btn" href="javascript:;">确定</a>' + cancelStr +
      '</p>' +
      '<span class="close-dialog icon-close-small"></span>' +
      '</div>');
    dialogClick(callBack);
  };

  //评论的展开与隐藏
  var showList = function (obj, target) {
    var $li = $(target, obj);
    if ($li.length > 5) {
      if (!$('.show-li', obj).length) {
        obj.append('<li class="show-li"><span class="text"><span class="icon-list-down"></span>展开</span><li>');
      } else {
        $('.show-li', obj).html('<span class="text"><span class="icon-list-down"></span>展开</span>');
      }
      $('.show-li', obj).attr('key', 1)
    }
    $li.each(function (n) {
      if (n >= 5) {
        $li.eq(n).hide();
      }
    })
    $('.show-li', obj).show();
    $('.show-li', obj).unbind().bind('click', function () {
      if ($(this).attr('key') == 1) {
        $(this).html('<span class="text"><span class="icon-list-up"></span>收起</span>');
        $li.show();
        $(this).attr('key', 2)
      } else {
        showList(obj, target)
      }
    })
  }

  //把search值转化成对象
  var getQueryObj = function () { //参数为window.location.search
    var search = window.location.search;
    var str = search.slice(1); //去掉首字母
    var obj = new Object(); //创建search对象

    if (str.indexOf('&') == -1) { //判断search值是否是多个
      var newArr = str.split('=');
      obj[newArr[0]] = newArr[1]; //拆分search并给 search对象赋值
    } else {
      var arr = str.split('&');
      for (var i = 0; i < arr.length; i++) {
        var newArr = arr[i].split('=');
        obj[newArr[0]] = newArr[1]
      }
    }
    return obj; //输出search对象
  }

  //添加search对象
  var setQueryObj = function (str) {
    var arr = str.split('=');
    var obj = this.getQueryObj(); //转化search值
    obj[arr[0]] = arr[1]; //改变或赋值
    var searchArr = [];
    for (var n in obj) { //再把对象转化回来
      var searchStr = n + '=' + obj[n];
      searchArr.push(searchStr);
    }
    window.location.search = searchArr.join('&'); //改变search值
  }

  //删除search 的某个值
  var removeQuery = function (str) {
    var obj = this.getQueryObj();
    var searchArr = [];
    for (var n in obj) { //再把对象转化回来
      if (n == str) {
        continue;
      }
      var searchStr = n + '=' + obj[n];
      searchArr.push(searchStr);
    }
    window.location.search = searchArr.join('&'); //改变search值
  }

  //写cookies
  var setCookie = function (name, value) {
    var days = 1;
    // var exp = new Date();
    // exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ';path=/';
  }

  //读取cookies
  var readCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  //删除cookies
  var delCookie = function (name) {
    setCookie(name, "", -1);
  }

  /*把一位数字转化成两位数字例如 9 - 09*/
  var doubleNum = function two(m) {
    if (m < 0) return m;
    if (m >= 10) {
      return m;
    } else {
      return '0' + m;
    }
  }

  /*
   * 文字提示
   * isRemove 是否在一定时间后删除提示 默认为true
   * */
  var textTip = function (value, isRemove) {
    if (typeof isRemove == 'undefined') {
      isRemove = true;
    }
    var adiv = document.createElement('div');
    var disable = document.createElement('div');
    adiv.innerHTML = value;
    disable.style.cssText = 'position: fixed;' +
      'width: 100%;' +
      'height: 100%;' +
      'top: 0%;' +
      'left: 0%;';
    adiv.style.cssText = 'line-height: 40px;' +
      'position: fixed;' +
      'top: 50%;' +
      'left: 50%;' +
      'background: #c3e6ff;' +
      'z-index: 999999;' +
      'border: 1px solid #94d9ff;' +
      'font: 14px/40px Microsoft YaHei;' +
      'color: #383838;' +
      'padding: 0px 26px;' +
      'border-radius: 4px;';
    document.body.appendChild(adiv);
    document.body.appendChild(disable);
    $(disable).on('click', function () {
      return false;
    });
    adiv.style.marginTop = -adiv.offsetHeight / 2 + 'px';
    adiv.style.marginLeft = -adiv.offsetWidth / 2 + 'px';
    if (isRemove) {
      setTimeout(function () {
        $(adiv).fadeOut(function () {
          document.body.removeChild(adiv);
          document.body.removeChild(disable);
        });
      }, 1500);
    }
  }
  /*
   * 时间处理函数
   *
   * 时间格式 "2016-09-28 14:35:52"
   * */
  var timeSet = function (timeStr) {
    if (!timeStr) {
      return '';
    }
    var time = new Date;
    var y = time.getFullYear();
    var m = doubleNum(time.getMonth() + 1);
    var d = time.getDate();
    if (timeStr.slice(5, 7) == m && timeStr.slice(8, 10) == this.doubleNum(d)) {
      return timeStr.slice(11, 16);
    } else {
      //rrt
      return timeStr.slice(0, 16);
      //平台
      //return timeStr.slice(0, 11);
    }
  }

  /*
   *params{
   *   url:"", 链接地址
   *   type:"",请求方式
   *   data:,请求数据
   *   dataType:,请求格式
   * }
   * successCallback 请求成功执行函数
   * errorCallback 请求失败执行函数
   * */
  var mainBoAjax = function (params, successCallback, errorCallback) {
    $.ajax({
      url: params.url,
      type: params.type || 'get',
      data: params.data,
      dataType: params.dataType || 'json',
      success: function (data) {
        typeof successCallback == 'function' && successCallback(data);
      },
      error: function (jqXHR) {
        typeof errorCallback == 'function' && errorCallback(jqXHR);
      }
    })
  }

  //编辑下拉框（相册，随笔，分享）
  var setBox = function (obj) {
    //文章设置点击
    obj.on('click', '.set-name', function () {
      var setBox = $(this).next().next();
      var sanjiao = $(this).next();
      if (setBox.is(':hidden')) {
        $('.set-box').hide();
        $('.alog-set-sj').removeClass('set-sj-ok');
        setBox.show();
        sanjiao.addClass('set-sj-ok');
      } else {
        setBox.hide();
        sanjiao.removeClass('set-sj-ok');
      }
      return false;
    });
    //清除编辑框状态
    $('body').on('click', function () {
      $('.set-box').hide();
      $('.alog-set-sj').removeClass('set-sj-ok');
    });
  }

  //全选
  var checkAll = function (input, target) {
    input.on('click', function () {
      if ($(this).get(0).checked) {
        target.each(function (index) {
          target.eq(index).get(0).checked = true;
        })
      } else {
        target.each(function (index) {
          target.eq(index).get(0).checked = false;
        })
      }
    });
    $('body').on('click', target, function () {
      target.each(function () {
        if (this.checked) {
          input.eq(0).get(0).checked = true;
        } else {
          try {
            input.eq(0).get(0).checked = false;
          } catch (e) {
          }
          return false;
        }
      })
    });
  }
  /*
   * 照片定位
   * */
  var photoScope = function (img, booleans) {
    //获取元素父集
    var imgParent = img.parent();
    var scale = booleans ? 1 : 2;
    var percentile = booleans ? '90%' : '200%';
    //清空img样式
    img.eq(0).get(0).style.cssText = '';
    //初次设置图片大小位置
    if (img.width() >= img.height()) {
      if (img.width() >= imgParent.width() * scale) {
        img.width(percentile);
      }
    } else {
      if (img.height() >= imgParent.height() * scale) {
        img.height(percentile);
      }
    }
    //最后判断图片是否有超出部分
    if (booleans && (img.height() >= imgParent.height())) {
      img.height(percentile).width('initial');
    } else if (booleans && (img.width() >= imgParent.width())) {
      img.width(percentile).height('initial');
      ;
    }

    if (!booleans) {
      if (img.height() < imgParent.height()) {
        img.height(imgParent.height());
      }
      if (img.width() < imgParent.width()) {
        img.width(imgParent.width());
      }
    }
    //设置图片 top left 值
    var top = (imgParent.height() - img.height()) / 2;
    var left = (imgParent.width() - img.width()) / 2;
    img.css({
      position: 'absolute',
      top: top + 'px',
      left: left + 'px'
    })
  }

  //超出文本显示省略号
  function hideText(text, long) {
    var str = '...';
    text = text.replace(/(^\s*)|(\s*$)/g, "");
    var newstr = '';
    if (text.length > long) {
      newstr = text.slice(0, long) + str;
    } else {
      newstr = text;
    }
    return newstr;
  }

  /**
   * 超出字节显示省略号
   * @param str 要截取的字符串
   * @param Len 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
   * @returns {*} 截取后的字符串
   */
  function hideTextByLen(str, Len) {
    var result = '',
      strlen = str.length, // 字符串长度
      chrlen = str.replace(/[^\x00-\xff]/g, '**').length; // 字节长度

    if (chrlen <= Len) {
      return str;
    }

    for (var i = 0, j = 0; i < strlen; i++) {
      var chr = str.charAt(i);
      if (/[\x00-\xff]/.test(chr)) {
        j++; // ascii码为0-255，一个字符就是一个字节的长度
      } else {
        j += 2; // ascii码为0-255以外，一个字符就是两个字节的长度
      }
      if (j < Len) { // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
        result += chr;
      } else { // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
        return result + "...";
      }
    }
  }

  //123.jpg?size=1920x1080|360x360|240x240|120x120
  var getPicUrl = function (url, size) {
    if (typeof url !== 'string') return '';
    if (url.indexOf('?size=') == -1) return url;
    var newUrl = url.split('?')[0];
    var sizeLeng = url.split('?size=')[1].split('|');
    var newSize = 0;
    for (var i = sizeLeng.length - 1; i >= 0; i--) {
      if (sizeLeng[i].split('x')[0] >= size) {
        newSize = sizeLeng[i].split('x')[0];
        break;
      }
    }
    if (!newSize) newSize = sizeLeng[0].split('x')[0];
    if (newSize >= 1920) {
      newUrl = newUrl;
    } else {
      newUrl = newUrl.slice(0, newUrl.lastIndexOf('.')) + '_' + newSize + 'x' + newSize + newUrl.slice(newUrl.lastIndexOf('.'));
    }
    return newUrl;

  }

  function getPicUrl1(url, size) {
    var newUrl = '';
    if (url.indexOf('?') > 0) {
      newUrl = url + '&imageW=' + size + '&imageH=' + size;
    } else {
      newUrl = url + '?imageW=' + size + '&imageH=' + size;
    }
    return newUrl;
  }

  function getBrowserVersion() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
      return "Opera"
    }
    if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    }
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if (fIEVersion == 7) {
        return "IE7";
      }
      else if (fIEVersion == 8) {
        return "IE8";
      }
      else if (fIEVersion == 9) {
        return "IE9";
      }
      else if (fIEVersion == 10) {
        return "IE10";
      }
      else if (fIEVersion == 11) {
        return "IE11";
      }
      else {
        return "0"
      }
    }
    ;
  }

  function isLessIE8() {
    var browerVersion = getBrowserVersion();
    if (browerVersion == "IE7" || browerVersion == "IE8" || browerVersion == "0") {
      return true;
    }
    return false;
  }

  function info(info) {
    if (!isLessIE8()) {
      // console.info(info);
    }
  }

  function log(info) {
    if (!isLessIE8()) {
      // console.log(info);
    }
  }

  function error(info) {
    if (!isLessIE8()) {
      // console.error(info);
    }
  }


  return {
    textHint: textHint,
    //底部自适应
    winChange: winChange,
    //标题数量计算
    titleNum: titleNum,
    //上传成功失败提示
    uploadToast: uploadToast,
    //
    setFileIcon: setFileIcon,
    //评论展开与隐藏
    showList: showList,
    //获取search对象
    getQueryObj: getQueryObj,
    //添加search对象
    setQueryObj: setQueryObj,
    //删除某个search值
    removeQuery: removeQuery,
    //双位数
    doubleNum: doubleNum,
    //文字提示
    textTip: textTip,
    //时间格式化
    timeSet: timeSet,
    //编辑下拉框
    setBox: setBox,
    //全选
    checkAll: checkAll,
    //照片定位
    photoScope: photoScope,
    //自定义ajax
    mainBoAjax: mainBoAjax,
    //提示
    toast: toast,
    //超出显示省略号
    hideText: hideText,
    //超出指定字节显示省略号
    hideTextByLen: hideTextByLen,
    confirmDialog: confirmDialog,
    log: log,
    error: error,
    info: info,
    isLessIE8: isLessIE8,
    getBrowserVersion: getBrowserVersion,
    //根据固定大小获取不同大小图片路径
    getPicUrl: getPicUrl,
    getPicUrl1: getPicUrl1
  }
})