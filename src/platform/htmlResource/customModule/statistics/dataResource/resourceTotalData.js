/**
 * Created by player on 2017/12/12.
 */

define(function () {
  /**
   * 应用统计  平台资源统计
   * @type {{code: string, data: {subjectCoverageRate: number, publisherCoverageRate: number, resTotal: number, syncResourceTotal: number, ugcResourceTotal: number}, desc: string, result: string}}
   * subjectCoverageRate: 学科覆盖率,
   * publisherCoverageRate: 教材覆盖率,
   * resTotal: 资源总量,
   * syncResourceTotal: 同步教学资源量,
   * ugcResourceTotal: 教师上传资源量
   */
  var resourceCountData = {
    "code":"200",
    "data":{
      "subjectCoverageRate":1,
      "publisherCoverageRate":0.97,
      "resTotal":1697062,
      "syncResourceTotal":1570602,
      "ugcResourceTotal":126460
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  /**
   * 应用统计  平台资源总量统计
   * @type {{code: string, data: {subject: [*], publisher: [*]}, desc: string, result: string}}
   */
  var resourceTotalData = {
    "code":"200",
    "data":{
      "subject":[//按学科统计
        {
          "name":"语文",
          "value":1020
        },
        {
          "name":"英语",
          "value":1165
        },
        {
          "name":"数学",
          "value":915
        },
        {
          "name":"音乐",
          "value":325
        },
        {
          "name":"科学",
          "value":820
        },
        {
          "name":"美术",
          "value":700
        },
        {
          "name":"品德与社会",
          "value":1165
        },
        {
          "name":"信息技术",
          "value":840
        },
        {
          "name":"品德与生活",
          "value":530
        },
        {
          "name":"艺术",
          "value":850
        },
        {
          "name":"其他",
          "value":700
        }
      ],
      "publisher":[//按出版社统计
        {
          "name":"人民教育出版社",
          "value":1020
        },
        {
          "name":"北京出版社",
          "value":1165
        },
        {
          "name":"河北教育出版社",
          "value":915
        },
        {
          "name":"上海教育出版社",
          "value":325
        },
        {
          "name":"北京师范大学出版社",
          "value":820
        },
        {
          "name":"语文出版社",
          "value":1035
        },
        {
          "name":"山东教育出版社",
          "value":840
        },
        {
          "name":"湖北教育出版社",
          "value":530
        }
      ]
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  /**
   * 应用统计  平台资源使用情况统计
   * @type {{code: string, data: [*], desc: string, result: string}}
   * name :
   * download : 下载量
   * collect : 收藏量
   */
  var resourceUseData = {
    "code":"200",
    "data":[
      {
        "name":"毛石镇",
        "download":12005,
        "collect":11000
      },
      {
        "name":"松林镇",
        "download":12520,
        "collect":15230
      },
      {
        "name":"高坪办",
        "download":11110,
        "collect":10235
      },
      {
        "name":"直属小学",
        "download":15230,
        "collect":15040
      },
      {
        "name":"直属中学",
        "download":10244,
        "collect":12521
      },
      {
        "name":"山盆镇",
        "download":12038,
        "collect":15247
      },
      {
        "name":"板桥镇",
        "download":15211,
        "collect":12457
      },
      {
        "name":"泗渡镇",
        "download":15242,
        "collect":13653
      },
      {
        "name":"团泽镇",
        "download":15464,
        "collect":11110
      },
      {
        "name":"沙湾镇",
        "download":15218,
        "collect":12055
      },
      {
        "name":"芝麻镇",
        "download":14256,
        "collect":15219
      },
    ],
    "desc":"请求处理成功！",
    "result":"success"
  };

  /**
   * 应用统计  平台资源使用趋势
   * @type {{code: string, data: [*], desc: string, result: string}}
   * name :
   * download : 下载量
   * collect : 收藏量
   */
  var resourceTendencyData = {
    "code":"200",
    "data":[
      {
        "name":"00:00",
        "download":0,
        "collect":0
      },
      {
        "name":"02:00",
        "download":0,
        "collect":0
      },
      {
        "name":"04:00",
        "download":0,
        "collect":0
      },
      {
        "name":"06:00",
        "download":0,
        "collect":0
      },
      {
        "name":"08:00",
        "download":0,
        "collect":0
      },
      {
        "name":"10:00",
        "download":16000,
        "collect":12000
      },
      {
        "name":"12:00",
        "download":11237,
        "collect":15237
      },
      {
        "name":"14:00",
        "download":16853,
        "collect":11253
      },
      {
        "name":"16:00",
        "download":11850,
        "collect":16850
      },
      {
        "name":"18:00",
        "download":55,
        "collect":55
      },
      {
        "name":"20:00",
        "download":19,
        "collect":19
      },
    ],
    "desc":"请求处理成功！",
    "result":"success"
  };


  return {
    'resourceCountData' : resourceCountData,
    'resourceTendencyData' : resourceTendencyData,
    'resourceTotalData' : resourceTotalData,
    'resourceUseData' : resourceUseData
  };
});