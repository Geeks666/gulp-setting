
//写cookies 
var setCookie = function (name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ';path=/';
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
    var cval = readCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + (new Date(0)).toGMTString();
    }
}

