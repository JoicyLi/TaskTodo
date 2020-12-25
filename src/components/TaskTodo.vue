<template>
  <div>
      <div style="font-size:30px;" align="center" >任务管理系统</div>
     <el-divider><i class="el-icon-menu"></i></el-divider>
     <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
       <!-- 未完成界面 -->
    <!-- 任务操作按钮 -->
    <el-tab-pane label="未完成" name="first">
                  <el-col :span="12">
                     <el-input v-model="input_search" placeholder="请输入关键字进行查询" clearable></el-input>
                 </el-col>
      <el-button type="primary" round @click="formDialogShowMethod">添加任务</el-button>

    <!-- 未完成任务表格 -->
    <div class="">
    <el-table
      :data="searchFromKeyWords(input_search)"
      style="width: 100%;margin-top:10px;"
      header-cell-style="background-color: lightgray;text-align:center;"
      cell-style="text-align:center;"
    >
      <el-table-column
        label="序号"
        width="100"
      >
      <template slot-scope="scope">
      <span>{{ scope.$index + 1 }}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="任务名称"
        width="180">
       <template slot-scope="scope">
        <span>{{scope.row.task_name}}</span>
        </template>
      </el-table-column>
      <!-- 开始时间 -->
        <el-table-column
        label="起始时间"
        width="200">
       <template slot-scope="scope">
        <span>{{scope.row.start_time | dateFormat}}</span>
        <span>{{scope.row.start_time1 | dateFormat2 }}</span>
        </template>
      </el-table-column>
      <!-- 结束时间 -->
      <el-table-column
        label="结束时间"
        width="200">
       <template slot-scope="scope">
        <span>{{scope.row.end_time | dateFormat}} </span>
        <span>{{scope.row.end_time2 | dateFormat2}} </span>

        </template>
      </el-table-column>
      <el-table-column
        label="任务类型"
        width="180">
       <template slot-scope="scope">
        <span>{{scope.row.type | jugementTypeLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="任务等级"
        width="180">
      <template slot-scope="scope">
       <span>{{scope.row.task_level | jugementTaskLevel }}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="任务完成情况"
        width="120">
        <template slot-scope="scope">
      {{scope.row.completion_status }}

        </template>
      </el-table-column>
      <el-table-column
        prop="caozuo"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" style="margin-left: 10px;" icon="el-icon-edit" circle @click="detailDialogEditMethod(scope.$index,scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle @click="finishTask(scope.$index,scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteTask(scope.$index,scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </el-tab-pane>

 <!-- 任务已经完成表格 -->
             <el-tab-pane label="已完成" name="second">
                  <el-col :span="12" >
                     <el-input v-model="input_search" placeholder="请输入关键字进行查询" clearable style="margin-bottom: 10px;"></el-input>
                 </el-col>
                 <el-table
                 :data="searchFromKeyWords2(input_search)"
                 style="width: 100%;"
                 header-cell-style="background:lightgrey;text-align:center;"
                 cell-style="text-align:center;"
                 >
                     <el-table-column label="序号" width="180">
                         <template slot-scope="scope">
                             <span>{{ scope.$index + 1 }}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="任务名称" width="180">
                         <template slot-scope="scope">
                             <span>{{scope.row.task_name}}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="起始时间" width="180">
                         <template slot-scope="scope">
                             <span>{{scope.row.start_time | dateFormat}}</span>
                             <span>{{scope.row.start_time1 | dateFormat2}}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="预计结束时间">
                         <template slot-scope="scope">
                             <span>{{scope.row.end_time | dateFormat}}</span>
                             <span>{{scope.row.end_time2 | dateFormat2}}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="实际完成时间">
                         <template slot-scope="scope">
                             <span>{{scope.row.finished_time | dateFormat}} {{scope.row.finished_time | dateFormat2}}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="任务类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.type | jugementTypeLevel }}</span>
                        </template>
                    </el-table-column>
                     <el-table-column prop="options" label="操作">
                         <template slot-scope="scope">
                           <el-button type="danger" icon="el-icon-delete" circle @click="deletedFromFinishTaskList(scope.$index,scope.row)"></el-button>
                         </template>
                     </el-table-column>
                 </el-table>
             </el-tab-pane>

  </el-tabs>

   <!-- 任务添加对话框 -->
<el-dialog
  title="编辑任务"
  :visible.sync="dialogFormVisible"
  width="50%"
  :before-close="handleClose">
   <!-- 表单 -->
     <el-form ref="form" :model="addForm" label-width="80px">
  <el-form-item label="任务名称">
    <el-input v-model="addForm.task_name"></el-input>
  </el-form-item>
  <el-form-item label="任务程度">
    <el-select v-model="addForm.task_level" placeholder="请选择任务程度">
      <el-option label="一般" value="0"></el-option>
      <el-option label="重要" value="1"></el-option>
      <el-option label="紧急" value="2"></el-option>
    </el-select>
  </el-form-item>
  <!-- 预计起始时间 -->
  <el-form-item label="开始时间">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="选择日期" v-model="addForm.start_time" style="width: 100%;" format="yyyy 年 MM 月 dd 日"></el-date-picker>
    </el-col>
    <el-col class="line" :span="1" style="margin-left: 17px;margin-right: 5px;">-</el-col>
    <el-col :span="11">
      <el-time-picker type="time" placeholder="选择时间" v-model="addForm.start_time1" style="width: 100%;" format="HH 时 mm 分 ss 秒"></el-time-picker>
    </el-col>
  </el-form-item>
  <!-- 预计结束时间 -->
    <el-form-item label="结束时间">
    <el-col :span="11">
      <el-date-picker type="date" placeholder="选择日期" v-model="addForm.end_time" style="width: 100%;" format="yyyy 年 MM 月 dd 日"></el-date-picker>
    </el-col>
    <el-col class="line" :span="1" style="margin-left: 17px;margin-right: 5px;">-</el-col>
    <el-col :span="11">
      <el-time-picker placeholder="选择时间" type="time"  v-model="addForm.end_time2" style="width: 100%;" format="HH 时 mm 分 ss 秒"></el-time-picker>
    </el-col>
  </el-form-item>
  <!-- 提醒 -->
  <el-form-item label="是否提醒">
    <el-switch v-model="addForm.tixing"></el-switch>
  </el-form-item>
  <!-- 任务类型 -->
  <el-form-item label="任务类型">
    <el-select v-model="addForm.type" placeholder="请选择任务类型">
      <el-option label="日常生活" value="3"></el-option>
      <el-option label="工作学习" value="4"></el-option>
      <el-option label="其他类型" value="5"></el-option>
    </el-select>
  </el-form-item>
  <!-- 完成程度 -->
   <el-form-item label="完成进度">
  <el-slider
      v-model="addForm.completion_status"
      :step="10"
      show-stops
      style="margin-left: 10px;">
    </el-slider>
      </el-form-item>
  <!-- 任务内容 -->
  <el-form-item label="任务内容">
    <el-input type="textarea" v-model="addForm.task_details"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addTask">确定</el-button>
  </el-form-item>
</el-form>
  <!-- -->
</el-dialog>
  </div>
</template>

<script>

export default {
  data(){
    return{
       //是否是插入添加
       isAdd : false,
       input_search: '',
       //
       activeName: 'first',
        //添加任务对话框是否显示
        dialogFormVisible: false,
        //当前编辑事件的索引
        editIndex: 0,
        //添加事件form对象
        addForm: {
          //任务名称
          task_name: '',
          //任务等级
          task_level: 0,
          //起始时间
          start_time: '',//年月日
          start_time1: '',//小时分钟
          //结束时间
          end_time: '',//年月日
          end_time2: '',
          //是否提醒
          tixing: false,
          //任务类型
          type: 3,
          //滑块默认值
          completion_status : 0,
          //任务内容
          task_details: '',
         //现在进行的是添加操作
        },
        //默认未完成事件的form
                 unfinishTaskList: [{
                         task_name: "运动",
                         task_details: "仰卧起坐*100",
                         task_level: 0,
                         start_time : "2020-12-15",
                         start_time1 : "2020-12-15 14:30:00",
                         end_time : "2020-12-15",
                         end_time2 : "2020-12-15 15:00:00",
                         type : 3,
                         tixing : false,
                         completion_status: 20

                     },
                     {
                         task_name: "写交互式实验报告2",
                         task_details: "注意实验报告的格式！",
                         start_time : "2020-12-15",
                         start_time1 : "2020-12-15 19:30:38",
                         end_time : "2020-12-25",
                         end_time2 : "2020-12-25 15:00:00",
                         task_level: 1,
                         tixing : true,
                         type :4,
                         completion_status: 60

                     },
                     {
                         task_name: "专业实习实验报告",
                         task_details: "有两个报告",
                         start_time : "2020-12-11",
                         start_time1 : "2020-12-11 08:30:00",
                         end_time : "2020-12-30",
                         end_time2 : "2020-12-30 16:30:00",
                         task_level: 1,
                         tixing : true,
                         type :4,
                         completion_status: 0
                     }
                 ],
                 //默认已完成事件list
                 finishTaskList: [{
                     task_name: "安卓实验",
                     task_details: "安卓实验所有的实验报告",
                     start_time: '2020-9-22',
                     start_time1 : '2020-9-22 18:30:25',
                     end_time: '2020-11-15',
                     end_time2: '2020-11-15 18:00:00',
                     deleted_time: 'null',
                     finished_time: new Date(),
                     task_level: 2,
                     type: 4,
                     completion_status: 100
                 },
                 {
                     task_name: "每日运动",
                     task_details: "每天仰卧起坐100个",
                     start_time: '2020-11-13',
                     start_time1 : '2020-11-13 20:30:00',
                     end_time: '2020-12-20',
                     end_time2: '2020-12-20 23:00:00',
                     deleted_time: 'null',
                     finished_time: new Date(),
                     task_level: 2,
                     type: 3,
                     completion_status: 100
                 }


                 ],
    }
  },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      //
            onSubmit() {
        console.log('submit!');
      }
      ,
       handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //显示添加任务显示框
             formDialogShowMethod() {
                 //清空addForm
                 this.addForm.task_name = ""
                 this.addForm.task_details = ""
                 this.addForm.start_time = null
                 this.addForm.start_time1 = null
                 this.addForm.end_time = null
                 this.addForm.end_time2 = null
                 this.addForm.task_level = 0
                 this.addForm.completion_status = 0
                  this.addForm.type = 3
                this.addForm.tixing = false
                 //添加任务对话框可见
                 this.dialogFormVisible = true
                 //现在进行的是添加操作
                 this.isAdd = true
             },
       //添加任务
             addTask() {
                 //判断是否为空，是否是添加需求,添加则是push
                 if (this.isAdd) {
                     var resmble = JSON.parse(JSON.stringify(this.addForm))
                     this.unfinishTaskList.push(resmble)
                     this.isAdd = false
                 } else if (!this.isAdd) {
                     //否则是splice
                     //进行替换
                     this.unfinishTaskList.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.addForm)))
                     this.editIndex = 0
                 }
                 //清空addForm
                 this.addForm.task_name = ""
                 this.addForm.task_details = ""
                 this.addForm.start_time = null
                 this.addForm.start_time1 = null
                 this.addForm.end_time = null
                 this.addForm.end_time2 = null
                 this.addForm.task_level = 0
                 this.addForm.completion_status = 0
                this.addForm.type = 3
                this.addForm.tixing= false
                 this.dialogFormVisible = false

             },
              //编辑对话框
             detailDialogEditMethod(index, item) {
                 this.dialogFormVisible = true
                 this.isAdd = false
                 this.editIndex = index
                 //将传入的对象渲染表单对象
                 this.addForm = JSON.parse(JSON.stringify(item))
             },

             //根据输入筛选符合要求的列表，用于未完成
             searchFromKeyWords(keywords) {
                 //定义一个空数组，返回用
                 var newList = []
                 //循环遍历数组
                 this.unfinishTaskList.forEach(item => {
                     //如果包含
                     if (item.task_name.indexOf(keywords) != -1) {
                         //push进入新数组
                         newList.push(item)
                     }
                 })
                 return newList
             },
            //根据输入筛选符合要求的列表,用于已完成
             searchFromKeyWords2(keywords) {
                 //定义一个空数组，返回用
                 var newList = []
                 //循环遍历数组
                 this.finishTaskList.forEach(item => {
                     //如果包含
                     if (item.task_name.indexOf(keywords) != -1) {
                         //push进入新数组
                         newList.push(item)
                     }
                 })
                 return newList
             },

              //删除任务
             deleteTask(index, item) {
                 //把任务从未完成列表中彻底删除
                 this.unfinishTaskList.splice(index, 1)
             },
             //完成任务
             finishTask(index, item) {
                 //设置完成时间为当前操作时间
                 item.finished_time = new Date()
                 //添加到已完成列表中去
                 this.finishTaskList.push(JSON.parse(JSON.stringify(item)))
                 //从未完成中删除
                 this.unfinishTaskList.splice(index, 1)

             },
            //从已完成列表中彻底删除
             deletedFromFinishTaskList(index, item) {
                 this.finishTaskList.splice(index, 1)
             },

    },

//过滤器
     filters:{
           //格式化日期
             dateFormat: function (datestr) {
                 var dt = new Date(datestr)
                 var year = dt.getFullYear()
                 var month = dt.getMonth() + 1
                 var day = dt.getDate()

                 return `${year}-${month}-${day}`
             },
             //格式化时间
             dateFormat2: function (datestr) {
                 var dt2 = new Date(datestr)
                 var hour = dt2.getHours()
                 var minute = dt2.getMinutes()
                 var second = dt2.getSeconds()

                 return `${hour}:${minute}:${second}`
             },
          //任务情况：数字和汉字的转换
             jugementTaskLevel: function (num) {
                 if (num == 0 || num == '0') {
                     return '一般'
                 }
                 if (num == 1 || num == '1') {
                     return '重要'
                 }
                 if (num == 2 || num == '2') {
                     return '紧急'
                 }
             },
            //任务类型 数字和汉字的转换
             jugementTypeLevel: function (num) {
                 if (num == 3 || num == '3') {
                     return '日常生活'
                 }
                 if (num == 4 || num == '4') {
                     return '工作学习'
                 }
                 if (num == 5 || num == '5') {
                     return '其他类型'
                 }
             },
    }
}

</script>
