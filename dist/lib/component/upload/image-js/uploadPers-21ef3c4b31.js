// 文件上传
define('uploadPers', ['jquery', 'webuploader','tools','rrtconfig'], function($, WebUploader,tools) {

    $(function() {
        var uploader = WebUploader.create({
            // swf文件路径
            swf: '../../lib/component/upload/image-js/Uploader.swf',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,png',
                mimeTypes: 'image/gif, image/jpg, image/jpeg, image/png'
            },
            // 文件接收服务端。
            server: JCenterHomeHost+'resourceManager/upload/2',
            //文件数量
            fileNumLimit: 50,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: '#editImg1'
            },
            fileSizeLimit: 20 * 1024 * 1024 * 1024,    // 20G
            fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 5G
        });
        uploader.addButton({
            id:'#editImg2'
        });
        //当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
            // console.log($('#rt_'+file.source.ruid));
            $('#rt_'+file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').show();
            // window.setImgEle.parent().siblings('.upLoading').show();
            uploader.upload();
        });

        uploader.on('uploadAccept',function(ob,ret){
            // console.log(ob,ret);
            // console.log(ret.success==true,window.setImgEle.attr('src'),ret.photoPath);
            if(ret.success== true){
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').attr('src',ret.photoPath);
                window.picUrlCur = true;
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
            }else{
                tools.toast("修改失败，请稍候再试！");
                $('#rt_'+ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
            }
            uploader.reset();
        });

        // // 文件上传过程中创建进度条实时显示。
        // uploader.on('uploadProgress', function(file, percentage) {
        //     var $li = $('#' + file.id),
        //         $percent = $li.find('.progress .progress-bar');
        //     // 避免重复创建
        //     if(!$percent.length) {
        //         $percent = $('<div class="progress progress-striped active">' +
        //             '<div class="progress-bar" role="progressbar" style="width: 0%">' +
        //             '</div>' +
        //             '</div>').appendTo($li).find('.progress-bar');
        //     }
        //     $li.find('p.state').text('上传中');
        //     // $li.find('.remove').hide();
        //     $percent.css('width', percentage * 100 + '%');
        // });
        // uploader.on('uploadSuccess', function(file) {
        //     //上传完成后显示清除按钮
        //     $('#' + file.id).find('.remove').show();
        //     $('#' + file.id).find('p.state').text('已上传');
        // });
        // uploader.on('uploadError', function(file) {
        //     //上传出错后显示清除按钮
        //     $('#' + file.id).find('.remove').show();
        //     // $clear.show();
        //
        //     $('#' + file.id).find('p.state').text('上传出错，请重新上传');
        // });
        // uploader.on('uploadComplete', function(file) {
        //     $('#' + file.id).find('.progress').fadeOut();
        // });

        // var spaceId = $("#spaceId").val();
    })
});