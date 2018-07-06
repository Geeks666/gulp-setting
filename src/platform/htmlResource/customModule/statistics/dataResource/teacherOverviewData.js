/**
 * Created by player on 2017/12/12.
 */

define(function () {

  function getMonth( totalMonth ){
    var myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getMonth() - totalMonth - 1);
    var flag = 1;
    var dateTemp;
    var monthArray=[];
    for (var i = 0; i < totalMonth; i++) {
      dateTemp = (myDate.getYear()+1900) + "-" + ( (myDate.getMonth()+1) > 9 ? (myDate.getMonth()+1) : '0'+(myDate.getMonth()+1) );
      monthArray.push(dateTemp);
      myDate.setMonth(myDate.getMonth() + flag);
    }
    return monthArray
  }
  function getYear(){
    var myDate = new Date();
    if( myDate.getMonth()+1 > 6 ){
      return myDate.getYear()+1900;
    }else{
      return myDate.getYear()+1900-1;
    }
  }


  var cityTotalAreaData = {
    "code":1,
    "data":{
      "pageList":{
        "datalist":[
          {
            "areaId":9,
            "areaName":"海淀区",
            "count":77
          },
          {
            "areaId":11,
            "areaName":"房山区",
            "count":34
          },
          {
            "areaId":6,
            "areaName":"朝阳区",
            "count":12
          },
          {
            "areaId":3,
            "areaName":"西城区",
            "count":11
          },
          {
            "areaId":2,
            "areaName":"东城区",
            "count":9
          },
          {
            "areaId":4,
            "areaName":"崇文区",
            "count":0
          },
          {
            "areaId":5,
            "areaName":"宣武区",
            "count":0
          },
          {
            "areaId":7,
            "areaName":"丰台区",
            "count":0
          },
          {
            "areaId":8,
            "areaName":"石景山区",
            "count":0
          },
          {
            "areaId":10,
            "areaName":"门头沟区",
            "count":0
          }
        ],
        "totalPages":2,
        "pageSize":10,
        "page":{
          "pageSize":10,
          "currentPage":1,
          "totalCount":18
        },
        "currentPage":1,
        "totalCount":18
      },
      "allCount":143
    }
  };
  //教研成果总量统计
  var cityTotalDate = {
    "code":1,
    "data":[
      {
        "date":getYear()+'-07',
        "count":1723
      },
      {
        "date":getYear()+'-08',
        "count":2881
      },
      {
        "date":getYear()+'-09',
        "count":2983
      },
      {
        "date":getYear()+'-10',
        "count":3151
      },
      {
        "date":getYear()+'-11',
        "count":3335
      },
      {
        "date":getYear()+'-12',
        "count":3983
      },
      {
        "date":getYear()+1+'-01',
        "count":3985
      },
      {
        "date":getYear()+1+'-02',
        "count":4042
      },
      {
        "date":getYear()+1+'-03',
        "count":4056
      },
      {
        "date":getYear()+1+'-04',
        "count":4312
      },
      {
        "date":getYear()+1+'-05',
        "count":4423
      },
      {
        "date":getYear()+1+'-06',
        "count":4435
      },
      {
        "date":getYear()+1+'-07',
        "count":4784
      }
    ]
  };
  //教研成果增长趋势
  var cityTotalDateGrowData = {
    "code":1,
    "data":[
      {
        "date":getYear()+'-07',
        "count":1723
      },
      {
        "date":getYear()+'-08',
        "count":2881
      },
      {
        "date":getYear()+'-09',
        "count":2983
      },
      {
        "date":getYear()+'-10',
        "count":3151
      },
      {
        "date":getYear()+'-11',
        "count":3335
      },
      {
        "date":getYear()+'-12',
        "count":3983
      },
      {
        "date":getYear()+1+'-01',
        "count":3985
      },
      {
        "date":getYear()+1+'-02',
        "count":4042
      },
      {
        "date":getYear()+1+'-03',
        "count":4056
      },
      {
        "date":getYear()+1+'-04',
        "count":4312
      },
      {
        "date":getYear()+1+'-05',
        "count":4423
      },
      {
        "date":getYear()+1+'-06',
        "count":4435
      },
      {
        "date":getYear()+1+'-07',
        "count":4784
      }
    ]
  };
  handleData();
  function handleData() {
    var myDate = new Date();
    var curYear = myDate.getYear()+1900;
    var curMonth = myDate.getMonth()+1;
    for( var i = 0 ; i < Math.max(cityTotalDate.data.length,cityTotalDateGrowData.data.length) ; i++ ){
      if( cityTotalDate.data[i] ){
        var year = cityTotalDate.data[i].date.split("-")[0];
        var month = cityTotalDate.data[i].date.split("-")[1];
        if( year > curYear ){
          //cityTotalDate.data[i].count = 0;
          cityTotalDate.data[i].count = cityTotalDate.data[i-1].count;
        }else{
          if( month >= curMonth ){
            //cityTotalDate.data[i].count = 0;
            cityTotalDate.data[i].count = cityTotalDate.data[i-1].count;
          }
        }
      }
      if( cityTotalDateGrowData.data[i] ){
        var year = cityTotalDateGrowData.data[i].date.split("-")[0];
        if( year > curYear ){
          cityTotalDateGrowData.data[i].count = 0;
          //cityTotalDateGrowData.data[i].count = cityTotalDateGrowData.data[i-1].count;
        }else{
          if( month >= curMonth ){
            cityTotalDateGrowData.data[i].count = 0;
            //cityTotalDateGrowData.data[i].count = cityTotalDateGrowData.data[i-1].count;
          }else{
            if( i>0 ){
              cityTotalDateGrowData.data[i].count = cityTotalDateGrowData.data[i].count-cityTotalDate.data[i-1].count;
            }
          }
        }
      }
    }
  }
  return {
    'cityTotalAreaData' : cityTotalAreaData,
    'cityTotalDate' : cityTotalDate,
    'cityTotalDateGrowData' : cityTotalDateGrowData
  };
});