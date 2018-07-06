/**
 * Created by lsmtty on 2017/1/3.
 */
define('paging', ['jquery','tools'], function($,tools) {
    var pagingbarItem = {
        /**
         * 页面初始化
         */
        pageInit: function(loadPage, pageClass) {
            pagingbarItem.pageClass = (pageClass == null || pageClass == undefined) ? "#paging" : '.' + pageClass; //列表id或者class
            pagingbarItem.loadPage = typeof loadPage === 'function' ? loadPage : function(){};    //页面载入函数,参数为页数
            pagingbarItem.pageSize = 0;     //页面当前页面数量,初始化页面数量为0页
            pagingbarItem.pageCount = 8;    //最多显示页面数量,默认8页
            pagingbarItem.currentPage = 0;  //列表加载页面函数 参数为页数
            pagingbarItem.currenta = 0;     //初始页标
            pagingbarItem.needToast = true; //是否需要弹出提示 默认为true

            $('' + pagingbarItem.pageClass).html('<div class="nav-cont"><a class="prev-page" href="javascript:;">上一页</a><ul class="page-start"></ul><a class="next-page" href="javascript:;">下一页</a>' +
                '<div class="go-page">转到<input class="page-target" type="text" value="">页</div><a class="page-target-go" href="javascript:;">确定</a><div class="all-number">共<span class="pages-number">0</span>页</div></div>');
            $('' + pagingbarItem.pageClass).hide();
            $('' + pagingbarItem.pageClass + '  ' + '.page-target-go').unbind().bind('click', function() {
                var isnum = parseInt($('.page-target').val());
                if(!isNaN(isnum)) {
                    if(isnum > pagingbarItem.pageSize) {
                        isnum = pagingbarItem.pageSize;
                    } else if(isnum <= 0) {
                        isnum = 1;
                    }
                    pagingbarItem.currenta = (isnum % pagingbarItem.pageCount) - 1;
                    pagingbarItem.currentPage = isnum - 1;
                    pagingbarItem.page(parseInt(pagingbarItem.currentPage / pagingbarItem.pageCount));
                    $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                    (typeof pagingbarItem.loadPage === "function") && pagingbarItem.loadPage(pagingbarItem.currentPage);
                } else {
                    if(pagingbarItem.needToast){
                        tools.toast("请输入数字页数");
                    }
                }
                $('.page-target').val('');
            });
            pagingbarItem.loadPage(0);
        },

        /**
         * 设置最多页面数量
         * @param {Object} pageCount
         */
        setPageCount: function(pageCount) {
            pagingbarItem.pageCount = pageCount;
        },

        /**
         * 获取当前页面数量
         */
        getPageSize: function() {
            return pagingbarItem.pageSize;
        },

        /**
         * 设置是否需要提示
         * @param {Object} needToast
         */
        setNeedToast:function(needToast){
            pagingbarItem.needToast = needToast;
        },

        /**
         页面选择点击事件
         */
        apageClick: function() {
            $('' + pagingbarItem.pageClass + '  ' + '.page-link').each(function(index) {
                $('' + pagingbarItem.pageClass + '  ' + '.page-link').eq(index).unbind().bind('click', function() {
                    pagingbarItem.currenta = index;
                    pagingbarItem.currentPage = parseInt($('' + pagingbarItem.pageClass + '  ' + '.page-link').eq(index).html()) - 1;
                    $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(index).addClass('page-link-active');
                    (typeof pagingbarItem.loadPage === 'function') && pagingbarItem.loadPage(pagingbarItem.currentPage);
                })
            })
        },

        /**
         * 页面列表生成
         * @param {Object} pageNum
         */
        page: function(pageNum) {
            var link_str = '';
            for(var i = pageNum * pagingbarItem.pageCount; i < (pageNum + 1) * pagingbarItem.pageCount; i++) {
                if(i >= pagingbarItem.pageSize) break;
                link_str += '<li class="page-list"><a class="page-link" href="javascript:;">' + (i + 1) + '</a></li>';
            };
            $('' + pagingbarItem.pageClass + '  ' + '.page-start').html(link_str);
            pagingbarItem.apageClick();
        },

        /**
         * 页面数量改变重载
         * @param {Object} pageSize 新页面数量
         */
        reloadPage: function(pageSize) {
            pagingbarItem.pageSize = pageSize;
            if(pagingbarItem.pageSize <= 1 || pagingbarItem.pageSize == undefined) {
                $('' + pagingbarItem.pageClass).hide();
            } else {
                $('' + pagingbarItem.pageClass).show();
            }
            if(pagingbarItem.pageSize > pagingbarItem.pageCount) {
                pagingbarItem.page(0);
                $('' + pagingbarItem.pageClass + '  ' + '.next-page').unbind().bind('click', function() {
                    pagingbarItem.currentPage++;
                    if(pagingbarItem.currentPage >= pagingbarItem.pageSize) {
                        pagingbarItem.currentPage = pagingbarItem.pageSize - 1;
                        return;
                    }
                    pagingbarItem.currenta++;
                    $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                    if(pagingbarItem.currenta > pagingbarItem.pageCount - 1) {
                        pagingbarItem.currenta = 0;
                        pagingbarItem.page(parseInt(pagingbarItem.currentPage / pagingbarItem.pageCount));
                        $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                    }
                    (typeof pagingbarItem.loadPage === "function") && pagingbarItem.loadPage(pagingbarItem.currentPage);
                })
                $('' + pagingbarItem.pageClass + '  ' + '.prev-page').unbind().bind('click', function() {
                    pagingbarItem.currentPage--;
                    if(pagingbarItem.currentPage < 0) {
                        pagingbarItem.currentPage = 0;
                        return;
                    }
                    pagingbarItem.currenta--;
                    $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                    if(pagingbarItem.currenta < 0) {
                        pagingbarItem.currenta = pagingbarItem.pageCount - 1;
                        pagingbarItem.page(parseInt(pagingbarItem.currentPage / pagingbarItem.pageCount));
                        $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                    }
                    (typeof pagingbarItem.loadPage === "function") && pagingbarItem.loadPage(pagingbarItem.currentPage);
                })
            } else {
                var link_str = '';
                for(var i = 0; i < pagingbarItem.pageSize; i++) {
                    link_str += '<li class="page-list"><a class="page-link" href="javascript:;">' + (i + 1) + '</a></li>';
                };
                $('' + pagingbarItem.pageClass + '  ' + '.page-start').html(link_str);
                $('' + pagingbarItem.pageClass + '  ' + '.next-page').unbind().bind('click', function() {
                    if(pagingbarItem.currentPage + 1 != pagingbarItem.pageSize) {
                        pagingbarItem.currenta++;
                        pagingbarItem.currentPage++;
                        if(pagingbarItem.currenta >= pagingbarItem.pageSize) {
                            pagingbarItem.currenta = pagingbarItem.pageSize - 1;
                            return;
                        };
                        $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                        (typeof pagingbarItem.loadPage === "function") && pagingbarItem.loadPage(pagingbarItem.currenta);
                    } else {
                        if(pagingbarItem.needToast){
                            tools.toast("已经是最后一页了");
                        }

                    }

                })
                $('' + pagingbarItem.pageClass + '  ' + '.prev-page').unbind().bind('click', function() {
                    if(pagingbarItem.currenta != 0) {
                        pagingbarItem.currenta--;
                        pagingbarItem.currentPage--;
                        if(pagingbarItem.currenta < 0) {
                            pagingbarItem.currenta = 0;
                            return;
                        };
                        $('' + pagingbarItem.pageClass + '  ' + '.page-link').removeClass('page-link-active').eq(pagingbarItem.currenta).addClass('page-link-active');
                        (typeof pagingbarItem.loadPage === "function") && pagingbarItem.loadPage(pagingbarItem.currenta);
                    } else {
                        if(pagingbarItem.needToast){
                            tools.toast("已经是第一页了");
                        }
                    }
                })
            }
            $('' + pagingbarItem.pageClass + '  ' + '.page-link').eq(pagingbarItem.currentPage).addClass('page-link-active');
            pagingbarItem.apageClick();
            $('' + pagingbarItem.pageClass + '  ' + '.all-number').html('共<span class="pages-number">' + pagingbarItem.pageSize + '</span>页');
        }
    }
    return pagingbarItem;
})