define('service', ['jquery'], function ($) {

  var preDevelopment = 'http://www.byeduyun.cn/'; // 平台后台后台
  var htmlDevelopment = 'http://www.byeduyun.cn/'; // 开发html页面  供头部导航使用

  var sourcePlatformBase = 'http://www.byeduyun.cn/rmsPortal/';//资源服务平台
  var sourceSystemBase = 'http://www.byeduyun.cn/rms/';//资源管理系统
  var activityHost = 'http://www.byeduyun.cn/activity';//活动运营
  var newSpaceBase = "http://www.byeduyun.cn/renrentong/";//人人通地址
  var adminManager = 'http://www.byeduyun.cn/admin';
  var ebookResourceHost = 'http://103.240.244.139/';//数字图书馆阅读地址   此处结尾"/"必须添加

  var ucTV4_appId = '7c5644425bfb42d884d5c22d36a297b5';//v4教师端
  var ucSV4_appId = 'e54dc052f8aa45d5a0d5f6c16eda1528';//v4学生端
  var qyjy_appId = '79c14d2252594a2cb127065839198d0e';//区域教研ID
  var xxjy_appId = '11a9ca75cb7746e99cda8f928429e7c4';//学校教研ID
  var jspj_appId = '694539126e5445ec81cbe68cb0653b27';//教师评价ID
  var pjxt_appId = '80e09ecff0ea4de8bb1e7f9bc46b2969';//评教系统ID
  var ebook_appId = 'c694cf702f2a4ac1a1f05d874f10f14f';//数字图书馆ID
  var teachingresearch_appId = '11a9ca75cb7746e99cda8f928429e7c4';//教研ID
  var resource_appId = '15efebee176146ecbdcaf41d387b5ec5';//资源ID
  var hanbovideo_appId = '4e34f75f300d4563bd0260a5a6eb95dc';//汉博课堂实录ID
  var OA_appId = '23e8e99a7c894a8796d607a4dcf21295';//OA ID
  var byqjyjg_appId = '3ee8ae214e2641899d14ecdf93af2e72';//白银区教育机构ID
  var download_url = 'pf/res/download/#resid#';//下载url地址
  var upload_url = 'pf/res/upload/';//上传url地址

  return {
    prefix : preDevelopment,
    htmlHost : htmlDevelopment,
    sourcePlatformBase : sourcePlatformBase,
    sourceSystemBase : sourceSystemBase,
    activityHost : activityHost,
    newSpaceBase : newSpaceBase,
    adminManager : adminManager,
    ebookResourceHost : ebookResourceHost,
    appIds : {
      ucTV4_appId : ucTV4_appId,
      ucSV4_appId : ucSV4_appId,
      qyjy_appId : qyjy_appId,
      xxjy_appId : xxjy_appId,
      jspj_appId : jspj_appId,
      pjxt_appId : pjxt_appId,
      ebook_appId : ebook_appId,
      teachingresearch_appId : teachingresearch_appId,
      resource_appId : resource_appId,
      hanbovideo_appId : hanbovideo_appId,
      OA_appId : OA_appId,
      byqjyjg_appId : byqjyjg_appId
    },
    path_url: {
      upload_url: window.upload_url || upload_url,
      download_url: window.download_url || download_url
    }
  }
});