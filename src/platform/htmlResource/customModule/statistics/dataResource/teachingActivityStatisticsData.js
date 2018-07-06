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
    return monthArray;
  }

  function getYear(){
    var myDate = new Date();
    if( myDate.getMonth()+1 > 6 ){
      return myDate.getYear()+1900;
    }else{
      return myDate.getYear()+1900-1;
    }
  }
  //各区域发起的活动数量
  var areaTotalIssueAreaData = {
    "code":1,
    "data":[
      {
        "areaName":getYear()+'-07',
        "count":7
      },
      {
        "areaName":getYear()+'-08',
        "count":10
      },
      {
        "areaName":getYear()+'-09',
        "count":8
      },
      {
        "areaName":getYear()+'-10',
        "count":4
      },
      {
        "areaName":getYear()+'-11',
        "count":7
      },
      {
        "areaName":getYear()+'-12',
        "count":10
      },
      {
        "areaName":getYear()+1+'-01',
        "count":12
      },
      {
        "areaName":getYear()+1+'-02',
        "count":4
      },
      {
        "areaName":getYear()+1+'-03',
        "count":13
      },
      {
        "areaName":getYear()+1+'-04',
        "count":9
      },
      {
        "areaName":getYear()+1+'-05',
        "count":10
      },
      {
        "areaName":getYear()+1+'-06',
        "count":12
      },
      {
        "areaName":getYear()+1+'-07',
        "count":8
      }
    ]
  };
  // 区域活动参与数量
  var areaTotalJoinData ={
    "code":1,
    "data":[
    {
      "date":getYear()+'-07',
      "count":2831
    },
    {
      "date":getYear()+'-08',
      "count":3432
    },
    {
      "date":getYear()+'-09',
      "count":1982
    },
    {
      "date":getYear()+'-10',
      "count":2467
    },
    {
      "date":getYear()+'-11',
      "count":1874
    },
    {
      "date":getYear()+'-12',
      "count":1875
    },
    {
      "date":getYear()+1+'-01',
      "count":1456
    },
    {
      "date":getYear()+1+'-02',
      "count":2654
    },
    {
      "date":getYear()+1+'-03',
      "count":2474
    },
    {
      "date":getYear()+1+'-04',
      "count":1675
    },
    {
      "date":getYear()+1+'-05',
      "count":1654
    },
    {
      "date":getYear()+1+'-06',
      "count":2675
    },
    {
      "date":getYear()+1+'-07',
      "count":2847
    }
  ]
  };

  handleData();
  function handleData() {
    var myDate = new Date();
    var curYear = myDate.getYear()+1900;
    var curMonth = myDate.getMonth()+1;
    for( var i = 0 ; i < Math.max(areaTotalIssueAreaData.data.length,areaTotalJoinData.data.length) ; i++ ){
      if( areaTotalIssueAreaData.data[i] ){
        var year = areaTotalIssueAreaData.data[i].areaName.split("-")[0];
        var month = areaTotalIssueAreaData.data[i].areaName.split("-")[1];
        if( year > curYear ){
          areaTotalIssueAreaData.data[i].count = 0;
          //areaTotalIssueAreaData.data[i].count = areaTotalIssueAreaData.data[i-1].count;
        }else{
          if( month >= curMonth ){
            areaTotalIssueAreaData.data[i].count = 0;
            //areaTotalIssueAreaData.data[i].count = areaTotalIssueAreaData.data[i-1].count;
          }
        }
      }
      if( areaTotalJoinData.data[i] ){
        var year = areaTotalJoinData.data[i].date.split("-")[0];
        if( year > curYear ){
          areaTotalJoinData.data[i].count = 0;
          //areaTotalJoinData.data[i].count = areaTotalJoinData.data[i-1].count;
        }else{
          if( month >= curMonth ){
            areaTotalJoinData.data[i].count = 0;
            //areaTotalJoinData.data[i].count = areaTotalJoinData.data[i-1].count;
          }
        }
      }
    }
  }
  return {
    'areaTotalIssueAreaData' : areaTotalIssueAreaData,
    'areaTotalJoinData' : areaTotalJoinData
  };
});