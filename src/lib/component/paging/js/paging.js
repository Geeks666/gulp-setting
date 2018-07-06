function pagingFn(pages, showPage, callBack, data) {
	var show_page = 8; //最多可以显示多少页数

	$('#paging').html('<div class="nav-cont"><a class="prev-page" href="javascript:;">上一页</a><ul class="page-start"></ul><a class="next-page" href="javascript:;">下一页</a><div class="go-page">转到<input class="page-target" type="text" value="">页</div><a class="page-target-go" href="javascript:;">确定</a><div class="all-number">共<span class="pages-number">2</span>页</div></div>')

	if (typeof showPage !== 'number') {
		data = callBack;
		callBack = showPage;
	} else {
		show_page = showPage;
	}

	var page_num = 0; //页数-1
	var page_a = 0; //每次加载的页数点击当前数
	function apageClick() {
		$('.page-link').each(function(index) {
			$('.page-link').eq(index).unbind().bind('click', function() {
				page_a = index;
				page_num = parseInt($('.page-link').eq(index).html()) - 1;
				$('.page-link').removeClass('page-link-active').eq(index).addClass('page-link-active');
				(typeof callBack === "function") && callBack(page_num, data);
			})
		})
	}

	function page(pageNum) {
		var link_str = '';
		for (var i = pageNum * show_page; i < (pageNum + 1) * show_page; i++) {
			if (i >= pages) break;
			link_str += '<li class="page-list"><a class="page-link" href="javascript:;">' + (i + 1) + '</a></li>';
		};
		$('.page-start').html(link_str);
		apageClick();
	}
	if (pages > show_page) {
		page(0)
		$('.next-page').unbind().bind('click', function() {
			page_num++;
			if (page_num >= pages) {
				page_num = pages - 1;
				return;
			}
			page_a++;
			$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			if (page_a > show_page - 1) {
				page_a = 0;
				page(parseInt(page_num / show_page));
				$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			}
			(typeof callBack === "function") && callBack(page_num, data);
		})
		$('.prev-page').unbind().bind('click', function() {
			page_num--;
			if (page_num < 0) {
				page_num = 0;
				return;
			}
			page_a--;
			$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			if (page_a < 0) {
				page_a = show_page - 1;
				page(parseInt(page_num / show_page));
				$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			}
			(typeof callBack === "function") && callBack(page_num, data);
		})
	} else {
		var link_str = '';
		for (var i = 0; i < pages; i++) {
			link_str += '<li class="page-list"><a class="page-link" href="javascript:;">' + (i + 1) + '</a></li>';
		};
		$('.page-start').html(link_str);
		var page_a = 0;
		$('.next-page').unbind().bind('click', function() {
			page_a++;
			if (page_a >= pages) {
				page_a = pages - 1;
				return;
			};
			$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			(typeof callBack === "function") && callBack(page_a, data);
		})
		$('.prev-page').unbind().bind('click', function() {
			page_a--;
			if (page_a < 0) {
				page_a = 0;
				return;
			};
			$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			(typeof callBack === "function") && callBack(page_a, data);
		})
	}
	$('.page-link').eq(0).addClass('page-link-active');
	apageClick();

	$('.page-target-go').unbind().bind('click', function() {
		var isnum = parseInt($('.page-target').val());
		if (!isNaN(isnum)) {
			if(isnum > pages){
				isnum = pages;
			}else if(isnum <= 0){
				isnum = 1;
			}
			page_a = (isnum % show_page) - 1;
			page_num = isnum - 1;
			page(parseInt(page_num / show_page));
			$('.page-link').removeClass('page-link-active').eq(page_a).addClass('page-link-active');
			(typeof callBack === "function") && callBack(page_num, data);
		}else{
			toast("请输入数字页数");
		}
		$('.page-target').val('')
	})
	$('.all-number').html('共<span class="pages-number">' + pages + '</span>页')
}

/**
 * 重新根据页数显示
 */
function reInitPage(pageCount){
	if (pageCount <= 0) {
		$("#paging").addClass("hidden");
	} else {
		$("#paging").removeClass("hidden");
	}
}
