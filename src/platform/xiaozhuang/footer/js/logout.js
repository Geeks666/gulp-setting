/**
 * Created by dell on 2017/5/3.
 */
// require.config({
//     paths: {
//         'jquery': '../../../../lib/jquery/jquery-1.11.2.min.js',
//         'service': '../../../../base/js/service.js'
//     }
// });

define(['jquery' , 'service' ] , function ( $ , service) {
    function judgeUrl() {
        var url = window.location.href;
        if(window.location.href.indexOf("persCenter") == -1){
            $("#xiaozhuang_footer").css({"position":"fixed"})
        }
        else {
            $("#xiaozhuang_footer").css({"position":"initial"})
        }
    }
    judgeUrl();
});


