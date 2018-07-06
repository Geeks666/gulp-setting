/**
 * Created by player on 2017/12/12.
 */

define(function () {
  var dateArray=[];
  function getDate( totalDay ){
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - totalDay);
    var flag = 1;
    var dateTemp;
    for (var i = 0; i < totalDay; i++) {
      dateTemp = (myDate.getYear()+1900) + "-" + ( (myDate.getMonth()+1) > 9 ? (myDate.getMonth()+1) : '0'+(myDate.getMonth()+1) ) + "-" + ( myDate.getDate() > 9 ? myDate.getDate() : '0'+myDate.getDate());
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
  }
  getDate(8);
  /**
   * 空间统计  平台使用情况 数据
   * @type {{code: string, data: {person: {parentSpaceNum: number, researchSpaceNum: number, spaceTotal: number, studentSpaceNum: number, teacherSpaceNum: number}, group: {areaSpaceNum: number, classSpaceNum: number, schoolSpaceNum: number, spaceTotal: number, subjectSpaceNum: number}}, desc: string, result: string}}
   */
  var spaceCountData = {
    "code":"200",
    "data":{
      "person":{//个人空间模块数据
        "parentSpaceNum":8939,//家长空间数
        "researchSpaceNum":2112,//教育局职工
        "spaceTotal":28693,//个人空间开通数
        "studentSpaceNum":10803,//学生空间数
        "teacherSpaceNum":6839//教师空间数
      },
      "group":{//群组空间模块数据
        "areaSpaceNum":1,//教育局空间
        "classSpaceNum":2419,//班级空间
        "schoolSpaceNum":105,//学校空间
        "spaceTotal":2550,//群组空间开通数
        "subjectSpaceNum":25//学科空间
      }
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  /**
   * 空间统计  个人空间使用情况统计 和 群组空间使用情况统计
   * @type {{person: {code: string, data: [*], desc: string, result: string}, group: {code: string, data: [*], desc: string, result: string}}}
   */
  var spaceCaseData = {
    'person' : {//个人空间使用情况统计
      "code":"200",
      "data":[
        {
          "name":"明博中学",
          "openNum":165,//开通空间数
          "useNum":140,//使用空间数
          "visitNum":151//被访问空间数
        },
        {
          "name":"庆丰小学",
          "openNum":150,//开通空间数
          "useNum":130,//使用空间数
          "visitNum":143//被访问空间数
        },
        {
          "name":"明博高中",
          "openNum":168,//开通空间数
          "useNum":98,//使用空间数
          "visitNum":123//被访问空间数
        },
        {
          "name":"明博小学",
          "openNum":167,//开通空间数
          "useNum":143,//使用空间数
          "visitNum":121//被访问空间数
        },
        {
          "name":"崇文二小",
          "openNum":138,//开通空间数
          "useNum":121,//使用空间数
          "visitNum":140//被访问空间数
        },
        {
          "name":"阳光第一小学",
          "openNum":147,//开通空间数
          "useNum":132,//使用空间数
          "visitNum":120//被访问空间数
        }
      ],
      "desc":"请求处理成功！",
      "result":"success"
    },
    'group' :{//群组空间使用情况统计
      "code":"200",
      "data":[
        {
          "id":"11",
          "name":"房山区",
          "openNum":54,
          "visitNum":4
        }
      ],
      "desc":"请求处理成功！",
      "result":"success"
    }
  };
  /**
   * 空间统计  个人空间使用趋势分析 和 群组空间使用趋势分析
   * @type {{person: {code: string, data: [*], desc: string, result: string}, group: {code: string, data: [*], desc: string, result: string}}}
   */
  var spaceTrendData = {
    'person' : {//个人空间使用趋势分析
      "code":"200",
      "data":[
        {
          "createDate":dateArray[0],
          "openNum":60,//开通空间数
          "useNum":23,//使用空间数
          "visitNum":32//被访问空间数
        },
        {
          "createDate":dateArray[1],
          "openNum":90,//开通空间数
          "useNum":80,//使用空间数
          "visitNum":75//被访问空间数
        },
        {
          "createDate":dateArray[2],
          "openNum":30,//开通空间数
          "useNum":15,//使用空间数
          "visitNum":20//被访问空间数
        },
        {
          "createDate":dateArray[3],
          "openNum":120,//开通空间数
          "useNum":95,//使用空间数
          "visitNum":100//被访问空间数
        },
        {
          "createDate":dateArray[4],
          "openNum":60,//开通空间数
          "useNum":50,//使用空间数
          "visitNum":50//被访问空间数
        },
        {
          "createDate":dateArray[5],
          "openNum":60,//开通空间数
          "useNum":50,//使用空间数
          "visitNum":30//被访问空间数
        },
        {
          "createDate":dateArray[6],
          "openNum":150,//开通空间数
          "useNum":70,//使用空间数
          "visitNum":60//被访问空间数
        },
        {
          "createDate":dateArray[7],
          "openNum":90,//开通空间数
          "useNum":80,//使用空间数
          "visitNum":70//被访问空间数
        }
      ],
      "desc":"请求处理成功！",
      "result":"success"
    },
    'group' : {//群组空间使用趋势分析
      "code":"200",
      "data":[
        {
          "createDate":dateArray[0],
          "openNum":60,//开通空间数
          "visitNum":32//被访问空间数
        },
        {
          "createDate":dateArray[1],
          "openNum":90,//开通空间数
          "visitNum":75//被访问空间数
        },
        {
          "createDate":dateArray[2],
          "openNum":30,//开通空间数
          "visitNum":20//被访问空间数
        },
        {
          "createDate":dateArray[3],
          "openNum":120,//开通空间数
          "visitNum":100//被访问空间数
        },
        {
          "createDate":dateArray[4],
          "openNum":60,//开通空间数
          "visitNum":50//被访问空间数
        },
        {
          "createDate":dateArray[5],
          "openNum":60,//开通空间数
          "visitNum":30//被访问空间数
        },
        {
          "createDate":dateArray[6],
          "openNum":150,//开通空间数
          "visitNum":60//被访问空间数
        },
        {
          "createDate":dateArray[7],
          "openNum":90,//开通空间数
          "visitNum":70//被访问空间数
        }

  ],
      "desc":"请求处理成功！",
      "result":"success"
    }
  };

  return {
    'spaceCountData' : spaceCountData,
    'spaceTrendData' : spaceTrendData,
    'spaceCaseData' : spaceCaseData
  };
});