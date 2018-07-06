/**
 * Created by player on 2017/12/12.
 */

define(function () {
  /**
   * 各校教研成果对比 各校教研成果对比
   * @type {{code: number, data: {dataList: [*], allCount: number}}}
   */
  var areaOrgtotalOrgData = {
    "code":1,
    "data":{
      "dataList":[
        {
          "orgName":"庆丰小学",
          "count":497448
        },
        {
          "orgName":"明博高中",
          "count":170554
        },
        {
          "orgName":"五一小学",
          "count":142128
        },
        {
          "orgName":"阳光第一小学",
          "count":113702
        },
        {
          "orgName":"群英小学",
          "count":113702
        },
        {
          "orgName":"太平路小学",
          "count":99490
        },
        {
          "orgName":"崇文二小",
          "count":85277
        },
        {
          "orgName":"明博中学",
          "count":71064
        },
        {
          "orgName":"翠微小学",
          "count":56851
        },
        {
          "orgName":"明博小学",
          "count":42638
        }
      ],
      "allCount":1421280
    }
  };


  /**
   * 教研分析  学校教研与管理--成果分布
   * @type {{code: number, data: {jiaoan_write: number, fansi_write: number, plansummary_write: number, kejian_write: number, listen_write: number, activity_issue: number, xjjy_org_issue: number, thesis_write: number, record_res: number, plansummary_scan: number, activity_scan: number, jiaoan_scan: number, listen_scan: number, fansi_scan: number, kejian_scan: number, thesis_scan: number, xjjy_area_join: number, zjzd_join: number, jxyt_join: number, jxyt_issue: number, zjzd_issue: number, xjjy_area_issue: number, ktpj_issue: number, activity_join: number, zxgk_join: number, ktpj_join: number, xjjy_org_join: number, zxgk_issue: number}}}
   */
  var areaOrgData = {
    "code":1,
    "data":{
      "jiaoan_write":135647,//常规教学 教案
      "fansi_write":59785,//常规教学 教学反思
      "plansummary_write":48473,//常规教学 计划总结
      "kejian_write":534570,//常规教学 课件
      "listen_write":287475,//教育科研 听课记录
      "activity_issue":56739,//教育科研 集体备课
      "xjjy_org_issue":58645,//教育科研 校际教研
      "thesis_write":146703,//教育科研 教学文章
      "record_res":103243,//教育科研 成长档案
      "plansummary_scan":918840,//教学管理 查阅计划总结
      "activity_scan":895438,//教学管理 查阅集体备课
      "jiaoan_scan":1016482,//教学管理 查阅教案
      "listen_scan":1018850,//教学管理 查阅听课记录
      "fansi_scan":1911000,//教学管理 查阅反思
      "kejian_scan":334278,//教学管理 查阅课件
      "thesis_scan":810795,//教学管理 查阅教学文章
      "xjjy_area_join":0,
      "zjzd_join":2,
      "jxyt_join":12,
      "jxyt_issue":15,
      "zjzd_issue":18,
      "xjjy_area_issue":0,
      "ktpj_issue":6,
      "activity_join":2,
      "zxgk_join":8,
      "ktpj_join":4,
      "xjjy_org_join":0,
      "zxgk_issue":7
    }
  };

  return {
    'areaOrgtotalOrgData' : areaOrgtotalOrgData,
    'areaOrgData' : areaOrgData
  };
});