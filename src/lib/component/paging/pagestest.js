require.config({
	baseUrl: 'js',
	paths: {
		"tools": "../../../js/requiretools",
		"paging": "requirepaging"
	},
	enforeDefine: true
});
require(['jquery', 'paging'], function($, paging) {
	paging.pageInit(fn); //底部paging初始化,默认使用id=paging
	paging.setNeedToast(false);
	/*paging.pageInit(fn, ".paging2");*/ //使用其他id 或者class加载paging，适用页面有多个paging
	function fn(i) { //页面切换的函数，需要一个页码的参数
		var innerHtml = "";
		for(var j = 0; j < 15; j++) {
			innerHtml += '<li><span>第' + (i + 1) + '页第' + j + '行</span></li>';
		}
		$("#testul").empty().append(innerHtml);
		if(i==0){
			paging.reloadPage(10);
		}		
		//重设页面总数量
		//
		/*if(data.totalPage != paging.getPageSize()) {   //计算页面总数是否和现在页面相同,不同重新设置页面数量
			paging.reloadPage(data.totalPage);   
		}*/
	}
});