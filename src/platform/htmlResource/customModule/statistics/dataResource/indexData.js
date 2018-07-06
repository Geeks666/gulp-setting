/**
 * Created by player on 2017/12/12.
 */

define(function () {
  /**
   * 平台使用情况 头部 数据
   * @type {{code: string, data: {yesterday: number, total: number, lastseven: number, lastthirtyratio: string, lastthirty: number, yesterdayratio: string, lastsevenratio: string}, desc: string, result: string}}
   * yesterday: 平台昨日使用用户数,
   * total: 区域用户总数,
   * lastseven: 过去7天使用平台用户数,
   * lastthirtyratio: string,
   * lastthirty: 过去30天平台使用用户数,
   * yesterdayratio: string,
   * lastsevenratio: string
   */
  var platformCountData ={
    "code":"200",
    "data":{
      "total":226701,
      "yesterday":25300,
      "lastseven":108835,
      "lastthirtyratio":"+0.0%",
      "lastthirty":213825,
      "yesterdayratio":"+0.0%",
      "lastsevenratio":"+0.0%"
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  /**
   * 区域概况
   * @type {{student: number, teacher: number, parent: number, personal: number, group: number, resourceTotal: number, schoolTotal: number}}
   * student: 区域学生用户总数,
   * teacher: 区域教师用户总数,
   * school: 区域学校总数,
   * personal: 区域个人空间数,
   * group: 区域群组空间数,
   * resourceTotal: 区域资源总量,
   * schoolTotal: 区域各校教研成果总量
   */
  var areaData = {
    "student":108822,
    "teacher":8952,
    "school":105,
    "personal":28639,
    "group":2550,
    "resourceTotal":1697062,
    "schoolTotal":1421280
  };

  var platformUsertypeData = {
    "code":"200",
    "data":{
      "userrole":{
        "eduemploye":69,
        "edumanager":96,
        "parent":664,
        "schemploye":222,
        "schmanager":319,
        "student":1359,
        "teacher":1127,
        "total":3856
      }
    },
    "desc":"请求处理成功！",
    "result":"success"
  };

  var resourceTypeStatisticsData = {
    "code":"200",
    "data":{
      "total":725900,
      "type":[
        {
          "name":"教案",
          "value":455823
        },
        {
          "name":"课件",
          "value":172626
        },
        {
          "name":"学案",
          "value":21116
        },
        {
          "name":"作业/习题",
          "value":37
        },
        {
          "name":"其他",
          "value":66135
        },
        {
          "name":"素材",
          "value":10016
        }
      ]
    },
    "desc":"请求处理成功！",
    "result":"success"
  };

  var spaceCountData = {
    "code":"200",
    "data":{
      "person":{
        "avgVisit":0.0,
        "monthVitality":0.050793650793650794,
        "openRate":0.08141638666322047,
        "parentSpaceNum":34,
        "researchSpaceNum":33,
        "spaceTotal":315,
        "studentSpaceNum":40,
        "teacherSpaceNum":208
      },
      "group":{
        "areaSpaceNum":1,
        "avgVisit":0.0,
        "classSpaceNum":299,
        "monthVitality":0.02608695652173913,
        "schoolSpaceNum":367,
        "spaceTotal":690,
        "subjectSpaceNum":23
      }
    },
    "desc":"请求处理成功！",
    "result":"success"
  };



  /**
   * 平台概况 平台使用趋势统计
   * @type {{code: string, data: ['显示数据：time 时间   value 用户人数'], desc: string, result: string}}
   */
  var platformTendencyData = {
    "code":"200",
    "data":[
      {
        "time":'00:00',
        "value":0
      },
      {
        "time":'02:00',
        "value":0
      },
      {
        "time":'04:00',
        "value":0
      },
      {
        "time":'06:00',
        "value":0
      },
      {
        "time":'08:00',
        "value":10105
      },
      {
        "time":'10:00',
        "value":10105
      },
      {
        "time":'12:00',
        "value":12405
      },
      {
        "time":'14:00',
        "value":12405
      },
      {
        "time":'16:00',
        "value":14505
      },
      {
        "time":'18:00',
        "value":14575
      },
      {
        "time":'20:00',
        "value":1575
      }
    ],
    "desc":"请求处理成功！",
    "result":"success"
  };

  /**
   * 平台概况 区域用户统计
   * @type {{code: string, data: {teacher: number, student: number, parent: number, edu: number, school: number, used: {student: number, parent: number, teacher: number}}, desc: string, result: string}}
   * data: {
   *  teacher: 平台覆盖范围 教师,
   *  student: 平台覆盖范围 学生,
   *  parent: 平台覆盖范围 家长,
   *  edu: 平台覆盖范围 教育局,
   *  school: 平台覆盖范围 学校,
   *  used: {
   *    student: 平台使用用户 学生,
   *    parent: 平台使用用户 家长,
   *    teacher: 平台使用用户 教师
   *    }
   *  }
   */
  var orgPersonCountData = {
    "code":"200",
    "data":{
      "edu":1,
      "school":105,
      "teacher":8951,
      "student":108822,
      "parent":108822,
      "used":{
        "student":108822,
        "parent":108822,
        "teacher":8951
      }
    },
    "desc":"请求处理成功！",
    "result":"success"
  };

  /**
   * 平台概况 区域用户数排名
   * @type {{code: string, data: {dataList: ['显示数据：name 学校   value 用户人数'], pageCount: number, pageNo: number, pageSize: number, totalSize: number}, desc: string, result: string}}
   */
  var platformAreaRanking = {
    "code":"200",
    "data":{
      "dataList":[
        {
          "name":"明博高中",
          "value":2723
        },
        {
          "name":"明博小学",
          "value":2146
        },
        {
          "name":"明博中学",
          "value":598
        },
        {
          "name":"阳光第一小学",
          "value":469
        },
        {
          "name":"庆丰小学",
          "value":460
        },
        {
          "name":"崇文二小",
          "value":421
        },
        {
          "name":"双榆树一小",
          "value":394
        },
        {
          "name":"双榆树中学小学",
          "value":390
        },
        {
          "name":"人大附中实验小学",
          "value":388
        },
        {
          "name":"群英小学",
          "value":343
        },
        {
          "name":"太平路小学",
          "value":260
        },
        {
          "name":"翠微小学",
          "value":18
        },
      ],
      "pageCount":1,
      "pageNo":1,
      "pageSize":12,
      "totalSize":12
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  return {
    'platformCountData' : platformCountData,
    'platformUsertypeData' : platformUsertypeData,
    'platformAreaRanking' : platformAreaRanking,
    'resourceTypeStatisticsData' : resourceTypeStatisticsData,
    'platformTendencyData' : platformTendencyData,
    'spaceCountData' : spaceCountData,
    'orgPersonCountData' : orgPersonCountData,
    'areaData' : areaData
  };
});