require.config({
  paths: {}
});

define([],function () {
  var doubleNum = function two(m){
    if (m < 0) return m;
    if (m >= 10) {
      return m;
    } else {
      return '0' + m;
    }
  };
  var timeSet = function (timeStr) {
    if( !timeStr ){
      return '';
    }
    var time = new Date;
    var y = time.getFullYear();
    var m = doubleNum(time.getMonth() + 1);
    var d = time.getDate();
    if( timeStr.indexOf('-') == -1){
      return format(timeStr);
    }
    if ( timeStr.slice(0, 4) == y && timeStr.slice(5, 7) == m && timeStr.slice(8, 10) == doubleNum(d)) {
      return timeStr.slice(11, 16);
    } else {
      return timeStr.slice(0, 11);
    }
  };
  var format = function format(shijianchuo){
    shijianchuo = Number(shijianchuo);
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var timeStr =  y+'-'+doubleNum(m)+'-'+doubleNum(d)+' '+doubleNum(h)+':'+doubleNum(mm)+':'+doubleNum(s);
    return timeSet(timeStr);
  };
  function getUrlArgObject( query ){//获取url参数值
    var args=new Object();
    var pairs=query.split("&");//在逗号处断开
    for(var i=0;i<pairs.length;i++){
      var pos=pairs[i].indexOf('=');//查找name=value
      if(pos==-1){//如果没有找到就跳过
        continue;
      }
      var argname=pairs[i].substring(0,pos);//提取name
      var value=pairs[i].substring(pos+1);//提取value
      value=decodeURIComponent(value);//传过来的编码过得汉字进行解码;
      //args[argname]=unescape(value);//存为属性
      args[argname]=value;//存为属性
    }
    return args;//返回对象
  };

  /**
   * 超出字节显示省略号
   * @param str 要截取的字符串
   * @param Len 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
   * @returns {*} 截取后的字符串
   */
  function hideTextByLen(str,Len){
    var result = '',
        strlen = str.length, // 字符串长度
        chrlen = str.replace(/[^\x00-\xff]/g,'**').length; // 字节长度

    if(chrlen<=Len){return str;}

    for(var i=0,j=0;i<strlen;i++){
      var chr = str.charAt(i);
      if(/[\x00-\xff]/.test(chr)){
        j++; // ascii码为0-255，一个字符就是一个字节的长度
      }else{
        j+=2; // ascii码为0-255以外，一个字符就是两个字节的长度
      }
      if(j<Len){ // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
        result += chr;
      }else{ // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
        return result+"...";
      }
    }
  }
  return window.tools = {
    //时间处理函数
    timeSet : timeSet,
    args : getUrlArgObject( window.location.search.substring(1) ),
    hideTextByLen : hideTextByLen
     //: getHeadMes
  }
});

