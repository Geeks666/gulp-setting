/**
 * Created by player on 2017/12/12.
 */

define(function () {
  /**
   * 用户统计 平台用户类型分布
   * @type {{code: string, data: {userrole: {eduemploye: number, edumanager: number, parent: number, schemploye: number, schmanager: number, student: number, teacher: number, total: number}}, desc: string, result: string}}
   * userrole: {
   *  edu : 教育局,
   *  school : 学校,
   *  eduemploye: 教育局职工,
   *  edumanager: 教育局管理者,
   *  parent: 家长,
   *  schemploye: 学校职工,
   *  schmanager: 学校管理者,
   *  student: 学生,
   *  teacher: 教师,
   *  total: 总数
   *  }
   */
  var platformUsertypeData = {
    "code":"200",
    "data":{
      "userrole":{
        "edu" : 1,
        "school" : 105,
        "eduemploye":2124,
        "edumanager":12,
        "parent":108822,
        "schemploye":5341,
        "schmanager":120,
        "student":108822,
        "teacher":1354,
        "total":226701
      }
    },
    "desc":"请求处理成功！",
    "result":"success"
  };
  /**
   * 用户统计 使用平台的用户类型统计
   * @type {{usertype_nofirst: {code: string, data: [*], desc: string, result: string}}}
   * teacher : 老师
   * student : 学生
   * parent : 家长
   * schemploye : 学校职工
   * schmanager : 学校管理者
   * edumanager : 教育局管理者
   * eduemploye : 教育局职工
   */
  var userTypeUsedData = {
    'usertype_nofirst':{
      "code":"200",
      "data":[
        {
          "time":'00:00',
          "teacher":0,
          "student":0,
          "parent":0,
          "schemploye":0,
          "schmanager":0,
          "edumanager":0,
          "eduemploye":0
        },
        {
          "time":'02:00',
          "teacher":0,
          "student":0,
          "parent":0,
          "schemploye":0,
          "schmanager":0,
          "edumanager":0,
          "eduemploye":0
        },
        {
          "time":'04:00',
          "teacher":0,
          "student":0,
          "parent":0,
          "schemploye":0,
          "schmanager":0,
          "edumanager":0,
          "eduemploye":0
        },
        {
          "time":'06:00',
          "teacher":0,
          "student":0,
          "parent":0,
          "schemploye":0,
          "schmanager":0,
          "edumanager":0,
          "eduemploye":0
        },
        {
          "time":'08:00',
          "teacher":7500,
          "student":10050,
          "parent":1050,
          "schemploye":500,
          "schmanager":150,
          "edumanager":150,
          "eduemploye":150
        },
        {
          "time":'10:00',
          "teacher":7500,
          "student":12050,
          "parent":2050,
          "schemploye":750,
          "schmanager":150,
          "edumanager":150,
          "eduemploye":150
        },
        {
          "time":'12:00',
          "teacher":1450,
          "student":3450,
          "parent":1450,
          "schemploye":1450,
          "schmanager":150,
          "edumanager":150,
          "eduemploye":150
        },
        {
          "time":'14:00',
          "teacher":5500,
          "student":12500,
          "parent":5500,
          "schemploye":1500,
          "schmanager":100,
          "edumanager":100,
          "eduemploye":100
        },
        {
          "time":'16:00',
          "teacher":2000,
          "student":8000,
          "parent":8000,
          "schemploye":2000,
          "schmanager":100,
          "edumanager":100,
          "eduemploye":100
        },
        {
          "time":'18:00',
          "teacher":5200,
          "student":3080,
          "parent":5580,
          "schemploye":880,
          "schmanager":0,
          "edumanager":0,
          "eduemploye":0
        },
        {
          "time":'20:00',
          "teacher":1200,
          "student":1300,
          "parent":500,
          "schemploye":250,
          "schmanager":0,
          "edumanager":10,
          "eduemploye":2
        }
      ],
      "desc":"请求处理成功！",
      "result":"success"
    }
  };
  userTypeUsedData.usertype_isfirst = userTypeUsedData.usertype_nofirst;

  return {
    'platformUsertypeData' : platformUsertypeData,
    'userTypeUsedData' : userTypeUsedData
  };
});