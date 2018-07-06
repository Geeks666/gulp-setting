require.config({
  paths: {
    "webuploader": "../../../../lib/component/upload/js/webuploader.js"
  }
});
// 文件上传
define('uploadPers', ['jquery', 'webuploader','service'], function($, WebUploader,service) {

    function getPicPath( id ){
        return service.prefix + '/pf/res/download/'+id;
    }
    function userLogoInfo(str) {
        var icc={};
        str=str._raw;
        str=str.substring(0,str.length-1);
        str=str.slice(1);
        str=str.split(',');
        for(var i=0;i<str.length;i++){
            if(i==0){
                icc.state=str[i].split(':')[1];
            }
            if(i==1){
                icc.id=str[i].split(':')[1];
                icc.id=icc.id.substring(0,icc.id.length-1);
                icc.id=icc.id.slice(1);
            }
        }
        return icc;
    }

    $(function() {
        var uploader = WebUploader.create({
            // swf文件路径
            swf: '../../lib/component/upload/image-js/Uploader.swf',
            accept: {
                title: 'Images',
                extensions: 'jpg,jpeg,png',
                mimeTypes: 'image/jpg, image/jpeg, image/png'
            },
            // 文件接收服务端。
            server: service.htmlHost+'/pf/res/upload',
            //文件数量
            fileNumLimit: 50,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: '#editImg2'
            },
            fileSizeLimit: 20 * 1024 * 1024 * 1024,    // 20G
            fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 5G
        });
        //当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
            window.picUrlId='';
            // console.log($('#rt_'+file.source.ruid));
            $('#rt_'+file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').show();
            // window.setImgEle.parent().siblings('.upLoading').show();
            uploader.upload();
        });

        uploader.on('uploadAccept',function(ob,ret){
            // console.log(ob,ret);
            ret=userLogoInfo(ret);
            // console.log(ret.success==true,window.setImgEle.attr('src'),ret.photoPath);
            if(ret.state== 'success'){
                window.picUrlId=ret.id;
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').attr('src',getPicPath(ret.id));
                window.picUrlCur = true;
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
            }else{
                window.picUrlCur = false;
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
            }
            uploader.reset();
        });
        uploader.on('uploadError',function(code){
            console.log(code);
            $('#rt_'+code.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
        });
    })
});