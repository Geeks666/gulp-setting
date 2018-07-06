//输入框提示
/*
      obj   输入框input 默认值为 input 的 value
            类型 jquery对象
*/
function textHint(obj) {
  obj.bind({
    focus: function () {
      if (this.value == this.defaultValue) {
        this.value = "";
      }
    },
    blur: function () {
      if (this.value == "") {
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
function winChange(obj, minNum, hideNum) {
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
function titleNum(obj, target, maxNnm) {
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
    确认提示框
    title  传入的显示标题 类型 string
    callback 回掉的函数   函数 function
 */
function confirmDialog(title, content, callBack) {
  $('body').append('<div id="mask"></div>');
  $('body').append('<div id="dialog-box">'
    + '<h2 class="header">' + title + '</h2>'
    + '<p class="text">' + content + '</p>'
    + '<p class="btns">'
    + '<a id="confirm" class="btn remve-btn" href="javascript:;">确定</a>'
    + '<a id="cancel" class="btn-active remve-btn" href="javascript:;">取消</a>'
    + '</p>'
    + '</div>');
  $('#mask').on('mousewheel', function () {
    return false;
  })
  //删除确定按钮
  $('#confirm').click(function () {
    if (typeof callBack == 'function') {
      callBack();
    }
    $('#mask').remove();
    $('#dialog-box').remove();
  });
  $('#cancel').click(function () {
    $('#mask').remove();
    $('#dialog-box').remove();
  });
}

function deleteDialog(callback) {
  confirmDialog('删除', '您确定要删除吗？删除后不可恢复。', callback);
}

/* 
    success 上传成功
    failed 上传失败

 */
function toast(content,duration) {
  if ($("#upload-msg").length == 0) {
    $('body').append('<div id="upload-msg">' + content + '</div>');
    setTimeout(function () {
      $('#upload-msg').fadeOut(function () {
        $('#upload-msg').remove();
      })

    }, duration?duration:2500);
  } else if ($("#upload-msg").html() !== content) {
    $('#upload-msg').remove();
    $('body').append('<div id="upload-msg">' + content + '</div>');
    setTimeout(function () {
      $('#upload-msg').fadeOut(function () {
        $('#upload-msg').remove();
      })

    }, duration?duration:2500);
  }
}

function uploadToast(isSuccess) {
  var box_content = '';
  if (isSuccess) {
    box_content = '<span class="icon-success"></span>恭喜，上传成功。'
  }
  else {
    box_content = '<span class="icon-error"></span>抱歉，上传失败。'
  }
  toast(box_content);
}

function setFileIcon() {
  $("#fileicon").each(function () {
    var fileType = $(this).attr("data-file");
    fileType = "icon-" + fileType + "-small";
    $(this).addClass(fileType);
  })
}


//评论的展开与隐藏
function showComment(obj, target) {
  var $li = $(target, obj);
  if ($li.length > 5) {
    if (!$('.show-li', obj).length) {
      obj.append('<li class="show-li"><span class="icon-comment-open"></span>全部展开<li>');
    } else {
      $('.show-li', obj).html('<span class="icon-comment-open"></span>全部展开');
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
      $(this).html('<span class="icon-comment-close"></span>收起评论');
      $li.show();
      $(this).attr('key', 2)
    } else {
      showComment(obj, target)
    }
  })
}


//把search值转化成对象
function getQueryObj() {      //参数为window.location.search
  var search = window.location.search;
  var str = search.slice(1);  //去掉首字母
  var obj = new Object();     //创建search对象

  if (str.indexOf('&') == -1) {     //判断search值是否是多个
    var newArr = str.split('=');
    obj[newArr[0]] = newArr[1];   //拆分search并给 search对象赋值
  } else {
    var arr = str.split('&');
    for (var i = 0; i < arr.length; i++) {
      var newArr = arr[i].split('=');
      obj[newArr[0]] = newArr[1]
    }
  }
  return obj;   //输出search对象
}

//添加search对象
function setQueryObj(str) {
  var arr = str.split('=');
  var search = window.location.search;
  var obj = searchObj(search);             //转化search值
  obj[arr[0]] = arr[1];               	//改变或赋值
  var searchArr = [];
  for (var n in obj) {						//再把对象转化回来
    var searchStr = n + '=' + obj[n];
    searchArr.push(searchStr);
  }
  window.location.search = searchArr.join('&');  //改变search值
}

//删除search 的某个值
function removeQuery(str) {

  console.log(searchObj)

  var search = window.location.search;
  var obj = searchObj(search);
  var searchArr = [];
  for (var n in obj) {						//再把对象转化回来
    if (n == str) {
      continue;
    }
    var searchStr = n + '=' + obj[n];
    searchArr.push(searchStr);
  }
  window.location.search = searchArr.join('&');  //改变search值
}


//写cookies 
var setCookie = function (name, value) {
  var days = 1;
  // var exp = new Date();
  // exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ';path=/';
};

//读取cookies 
var readCookie = function (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

//删除cookies 
var delCookie = function (name) {
  setCookie(name, "", -1);
}

String.prototype.subCompare = function (begin, end, str) {
  var comparestring = this.substring(begin, end);
  return comparestring.localeCompare(str);
}
