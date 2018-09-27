const Mock = require('mockjs')

const mockPaperList = function() {
  return {
    "code": 0,
    "msg": "ok",
    "data": [
      {"id": "12345678910","title": "问卷", "status": 0, "createTime": 1536887397173, "startTime": "2018-09-20", "endTime": "2018-10-01"},
      {"id": "22345678910","title": "问卷标题", "status": 1, "createTime": 1536887397666, "startTime": "2018-09-10", "endTime": "2018-10-01"},
      {"id": "32345678910","title": "问题", "status": 2, "createTime": 1536887397888, "startTime": "2018-09-10", "endTime": "2018-09-12"},
    ]
  }
}

const mockPaper = function () {
  return {
      "code": 0,
      "msg": "ok",
      "data": {
       "id": "4askfj1093jfi9348oueir932",
       "title": "你幸福吗的调查",
       "status": 0,
       "createTime": 1536887397173,
       "startTime": "2018-09-12",
       "endTime": "2018-10-01",   
       "questions": [
          {"id": "1234", "questionType":1, "questionTitle": "你的收入是多少？", "questionOption": ["2000以下", "2000-5000", "5000+"]},
          {"id": "2234", "questionType":2, "questionTitle": "你家里有哪些家电？", "questionOption": ["冰箱", "洗衣机", "空调", "麻将机"]},
          {"id": "3234", "questionType":3, "questionTitle": "说一说你觉得最幸福的事", "questionOption": []}
        ]
       }
    }
}

const mockPaperData = function () {
  return {
    "code": 0,
    "msg": "ok",
    "data": {
     "id": "4askfj1093jfi9348oueir932",
     "title": "你幸福吗的调查",
     "status": 0,
     "createTime": 1536887397173,
     "startTime": "2018-09-12",
     "endTime": "2018-10-01",   
     "totalCount": 140,
     "questions": [
        {
             "id": "1234", "questionType":1, 
             "questionTitle": "你的收入是多少？", 
             "questionOption": ["2000以下", "2000-5000", "5000+"],
             "answerContent": [10, 30, 100]
        },
        {    
             "id": "2234", "questionType":2, 
             "questionTitle": "你家里有哪些家电？", 
             "questionOption": ["冰箱", "洗衣机", "空调", "麻将机"],
             "answerContent": [30, 40, 80, 20]
        },
        {   
             "id": "3234", "questionType":3, 
             "questionTitle": "说一说你觉得最幸福的事", 
             "questionOption": [],
             "answerContent": [
                 "从青铜",
                 "到黄金",
                 "到王者"
             ]
        },
        {
            "id": "4234", "questionType":3,
            "questionTitle": "说一说你觉得最难过的事",
            "questionOption": [],
            "answerContent": [
                "从王者",
                "到青铜"
            ]
        }
      ]
     }
  }
}

Mock.mock('/paper-lists', 'get', mockPaperList)
Mock.mock('/delete-paper', 'post', {code:0, data: 0})
Mock.mock('/view-paper', 'post', mockPaper)
Mock.mock('/user/view-paper?id=12345678910', 'get', mockPaper)
Mock.mock('/paper-data', 'post', mockPaperData)
Mock.mock('/user/commit-paper', 'post', {code:0})

