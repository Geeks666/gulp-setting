define('service', ['jquery'], function ($) {

  // var preDevelopment = 'http://192.168.0.38:8010/'; // 平台后台后台
  //var htmlDevelopment = 'http://172.16.1.141/'; // 开发html页面  供头部导航使用
  // var prefix = 'http://192.168.0.187/renrentong//';
  // var prefix = 'http://192.168.0.189/';    //活动
  // var prefix = 'http://192.168.0.38:8080/';
  var prefix = '../../../';
   // var prefix = 'http://123.124.21.168/';   //智慧校园
  var htmlHost = prefix;

  var sourcePlatformBase = 'http://192.168.0.79:8080/rmsPortal/';//资源服务平台
  // var sourceSystemBase = 'http://xiaoyuan.myuclass.com/rms/';
  var sourceSystemBase = 'http://192.168.0.79:8080/rms/';//资源管理系统
  var activityHost = 'http://192.168.0.189:8080/activity/';//活动运营
  var newSpaceBase = "http://192.168.0.187/renrentong/";//人人通地址
  var adminManager = 'http://192.168.0.189/admin';
  var ebookResourceHost = 'http://103.240.244.139/';//数字图书馆阅读地址   此处结尾"/"必须添加
  var minTeacher = 'http://www.byeduyun.cn';


  var wisdomCampusSchoolId = '9c4308908df542beabd45daa2cdd6de7';
  var ucTV4_appId = '7c5644425bfb42d884d5c22d36a297b5';//v4教师端
  var ucSV4_appId = 'e54dc052f8aa45d5a0d5f6c16eda1528';//v4学生端
  var qyjy_appId = '79c14d2252594a2cb127065839198d0e';//区域教研ID
  var jspj_appId = '694539126e5445ec81cbe68cb0653b27';//教师评价ID
  var pjxt_appId = '80e09ecff0ea4de8bb1e7f9bc46b2969';//评教系统ID
  var ebook_appId = 'c694cf702f2a4ac1a1f05d874f10f14f';//数字图书馆ID
  var teachingresearch_appId = '11a9ca75cb7746e99cda8f928429e7c4';//教研ID
  var resource_appId = '15efebee176146ecbdcaf41d387b5ec5';//资源ID
  var hanbovideo_appId = '4e34f75f300d4563bd0260a5a6eb95dc';//汉博课堂实录ID
  var OA_appId = '4cdfd3214a4a4dbd97516131a921486d';//OA ID
  var byqjyjg_appId = '2bd0a36e0bc14bdd953208828cc425f0';//白银区教育机构ID
  var upload_url = 'pf/res/upload/';//上传url地址
  var download_url = 'pf/res/download/#resid#';//下载url地址
  var ResourcePrefix = 'http://192.168.0.169:8000/ss/'; // 资源存储host

  // 供请求配置接口使用
   /*var platformUrl = '../../../../pf/api/meta/frontconfig'; // 平台
   var statisticsUrl = '../../../fetchPrefix?projectName=statistics.front';
   var renrentongUrl = '../../../fetchPrefix?projectName=renrentong.front';

   $.ajax({
     type: 'GET',
     url: platformUrl,
     async: false,
     dataType: 'script'
   });*/

  return {
    prefix: window.prefix || prefix,
    htmlHost: window.htmlHost || htmlHost,
    sourcePlatformBase: window.sourcePlatformBase || sourcePlatformBase,
    sourceSystemBase: window.sourceSystemBase || sourceSystemBase,
    activityHost: window.activityHost || activityHost,
    newSpaceBase: window.newSpaceBase || newSpaceBase,
    adminManager: window.adminManager || adminManager,
    ebookResourceHost: window.ebookResourceHost || ebookResourceHost,
    ResourcePrefix: window.ResourcePrefix || ResourcePrefix,
    minTeacher: window.minTeacher || minTeacher,
    appIds: {
      wisdomCampusSchoolId: window.wisdomCampusSchoolId || wisdomCampusSchoolId,
      ucTV4_appId: window.ucTV4_appId || ucTV4_appId,
      ucSV4_appId: window.ucSV4_appId || ucSV4_appId,
      qyjy_appId: window.qyjy_appId || qyjy_appId,
      jspj_appId: window.jspj_appId || jspj_appId,
      pjxt_appId: window.pjxt_appId || pjxt_appId,
      ebook_appId: window.ebook_appId || ebook_appId,
      teachingresearch_appId: window.teachingresearch_appId || teachingresearch_appId,
      resource_appId: window.resource_appId || resource_appId,
      hanbovideo_appId: window.hanbovideo_appId || hanbovideo_appId,
      OA_appId: window.OA_appId || OA_appId,
      byqjyjg_appId: window.byqjyjg_appId || byqjyjg_appId
    },
    path_url: {
      upload_url: window.upload_url || upload_url,
      download_url: window.download_url || download_url
    }
  }
});