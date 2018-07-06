/**
 * Created by lsmtty on 2017/4/19.
 */
define("dialog",['jquery','tools','service'],function ($,tools,service) {
    var dialogClick = function(callBack,obj){
        if( !callBack && !obj ){
            callBack = function(){};
            obj = {};
        }
        $('#mask').on({
            'mousewheel':function () { return false; },
            'click':function () { return false; }
        });
        //删除确定按钮
        $('#confirm').click(function () {
            if( !obj.output ){
                if( obj.appId ){
                    tools.textTip('您还未选择应用');
                }else{
                    if( obj.hintText ){
                        tools.textTip(obj.hintText);
                    }else{
                        tools.textTip('请输入完整内容');
                    }
                }
                return false;
            }
            if (typeof callBack == 'function') {
                if( typeof obj == 'object' ){
                    callBack(obj);
                }else{
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
    }

    /*
     * 添加app
     * */
    var addAppDialog = function(data,callBack){
        var dataObj = {
            appId:[],
            output:false
        }
        var apps = '';
        var style = '';
        data = data.data;
        for(var i = 0;i< data.length; i++){

            if( data[i].isShow) continue;
            apps += '<li class="app-li" key="1" appid="'+ data[i].id + '">' +
                '<span class="checkbox"></span>' +
                '<img class="app-pic" src="' + getPicPath(data[i].logo)  + '">' +
                '<div class="app-msg">' +
                '<p><a class="app-name" href="javascript:;">' + data[i].name + '</a></p>' +
                '</div>' +
                '</li>';
        }
        var chooseAll = '';
        if( apps !== ''){
            chooseAll = '<p class="clearFix"><span id="choose-all" key="1"><span class="checkbox"></span>全选</span></p>';
        }
        if( apps == '' ){
            style = 'style="overflow: hidden;"';
            apps = noContent('暂无可添加应用');
            dataObj.output = true;
        }
        $('body').append('<div id="mask"></div>');
        $('body').append('<div id="addAppDialog" class="dialog-box">' +
            '<h2 class="box-header">添加应用</h2>' + chooseAll +
            '<ul class="app-boxs clearFix" ' + style + '>' + apps +'</ul>' +
            '<p class="clearFix btns">' +
            '<a id="confirm" href="javascript:;">确定</a>' +
            '<a id="cancel" href="javascript:;">取消</a>' +
            '</p>' +
            '<span class="close-dialog icon-close-small"></span>' +
            '</div>');
        if( data.length > 6 ){
            $('#addAppDialog .app-boxs').css({
                'width':'666px',
                'left':'-7px'
            });
        }
        $('#choose-all').on('click',function(){
            if($(this).attr('key') == 1){
                $(this).attr('key',2);
                $(this).addClass('choose-active');
                $('#addAppDialog li').each(function(){
                    $(this).attr('key',2);
                    $(this).addClass('active');
                    dataObj.appId.push($(this).attr('appid'));
                });
                dataObj.output = true;
            }else{
                $(this).attr('key',1);
                $(this).removeClass('choose-active');
                $('#addAppDialog li').each(function(){
                    $(this).attr('key',1);
                    $(this).removeClass('active');
                });
                dataObj.appId.length = 0;
                dataObj.output = false;
            }
        });
        $('#addAppDialog').on('click','li',function(){
            if( $(this).attr('key') == 1 ){
                $(this).attr('key',2);
                $(this).addClass('active');
                dataObj.appId.push($(this).attr('appid'));
            }else{
                $(this).attr('key',1);
                for(var i=0;i<dataObj.appId.length;i++){
                    if( dataObj.appId[i] == $(this).attr('appid') ){
                        dataObj.appId.splice(i,1);
                        break;
                    }
                }
                $('#choose-all').removeClass('choose-active');
                $(this).removeClass('active');
            }
            if( dataObj.appId.length ){
                dataObj.output = true;
            }else{
                dataObj.output = false;
                $('#choose-all').removeClass('choose-active');
            }
        });
        dialogClick(callBack,dataObj);
    }
    var noContent  = function (text){
        return '<div id="hint-content" class="no-content">' + text + '</div>';
    }

    var getPicPath = function(id){
      return service.path_url['download_url'].substring(0,4) === 'http' ? service.path_url['download_url'].replace('#resid#',id) : (service.prefix + service.path_url['download_url'].replace('#resid#',id)) ;
    };
    return {
        "addAppDialog":addAppDialog,
        "noContent":noContent
    }
});