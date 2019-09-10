<template>
  <div class="TaskList" v-loading="loading">
    <div class="task-search-bar">
      <div class="item">
        <label>标题：</label>
        <el-input
          placeholder="请输入标题或ID关键字"
          v-model="searchData.title"
          class="m-search"
          clearable
          @change="filterData"
        >
        </el-input>
      </div>
      <div class="item">
        <label>处理人：</label>
        <el-select
          v-model="searchData.handler"
          filterable
          placeholder="请选择"
          clearable
          multiple
          @change="filterData"
          style="width: 150px;"
        >
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.nickname"
            :value="item.userid"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <label>优先级：</label>
        <el-select
          v-model="searchData.priority"
          placeholder="请选择"
          clearable
          multiple
          @change="filterData"
          style="width: 150px;"
        >
          <el-option
            v-for="(val,key) in taskSet.priority"
            :key="key"
            :label="val"
            :value="parseInt(key)"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <label>状态：</label>
        <el-select
          v-model="searchData.status"
          placeholder="请选择"
          clearable
          multiple
          @change="filterData"
          style="width: 150px;"
        >
          <el-option
            v-for="(val,key) in taskSet.status"
            :key="key"
            :label="val"
            :value="parseInt(key)"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <label>任务标签：</label>
        <el-select
          v-model="searchData.tag"
          placeholder="请选择"
          clearable
          multiple
          filterable
          @change="filterData"
          style="width: 150px;"
        >
          <el-option v-for="item in tagData" :key="item.id" :label="item.tag" :value="item.id"></el-option>
        </el-select>
      </div>
      </div>
      <!--新增任务标签搜索-->
    <el-button
      type="primary"
      v-if="versionId!='all'"
      @click="addTaskDialogVisible = true"
      class="add-task"
    >新增任务</el-button>  
    <div class="task-show-item">
      <a-table
        :rowKey="record => record.id"
        :dataSource="taskList"
        :pagination="pagination"
        :scroll="scroll"
        :loading="loading"
        @change="handleTableChange"
      >
        <a-table-column title="ID" data-index="id" key="id"></a-table-column>
        <a-table-column title="标题" data-index="name" key="name">
          <template slot-scope="text, record">
            <router-link
              class="fixed-width-title"
              :title="record.name"
              :to="{name:'taskResult',params:{taskId:record.id, versionId: versionId}}"
            >{{record.name}}</router-link>
          </template>
        </a-table-column>
        <a-table-column title="附件" data-index="attachment" key="attachment">
          <template
            slot-scope="text, record"
          > <a :href="JSON.parse(record.attachment)[0].url" v-if="record.attachment && JSON.parse(record.attachment)[0]">{{record.attachment && JSON.parse(record.attachment)[0] ? JSON.parse(record.attachment)[0].name : ''}}</a>
          </template>
        </a-table-column>
        <a-table-column title="处理人" data-index="executor" key="executor">
          <template
            slot-scope="text, record"
          >{{record.executor.length>0?record.executor[0].name:''}}</template>
        </a-table-column>
        <a-table-column title="类型" data-index="ttype" key="ttype"></a-table-column>
        <a-table-column title="方法" data-index="tmethod" key="tmethod"></a-table-column>
        <a-table-column title="时间" data-index="start_time" key="start_time">
          <template slot-scope="text, record">{{record.start_time}} - {{record.end_time}}</template>
        </a-table-column>
        <a-table-column title="状态" data-index="status" key="status">
          <template slot-scope="text, record">
            <el-dropdown trigger="click" class="issue-edit-dropdown">
              <span class="el-dropdown-link">
                <span>{{taskSet.status[record.status]}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
                <div class="issue-down-wrap">
                  <ul>
                    <el-dropdown-item :disabled="record.status === 2 || record.status === 3">
                      <p class="finish" @click="finishTask(record)">完成</p>
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="record.status === 2|| record.status === 3">
                      <p class="finish" @click="refuseTask(record)">拒绝</p>
                    </el-dropdown-item>
                  </ul>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </a-table-column>
        <a-table-column title="优先级" data-index="priority" key="priority">
          <template slot-scope="text, record">
            <el-dropdown trigger="click" class="issue-edit-dropdown">
              <span class="el-dropdown-link">
                <span>{{taskSet.priority[record.priority]}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class="issue-edit-dropdow-wrap">
                <div class="priority-down-wrap">
                  <ul>
                    <el-dropdown-item
                      v-for="(val,key) in taskSet.priority"
                      :key="key"
                      :class="{selected:record.priority ==key}"
                    >
                      <div @click="updatePriority(record,key)">{{val}}</div>
                    </el-dropdown-item>
                  </ul>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </a-table-column>
        <a-table-column title="用例执行" key="case">
          <template slot-scope="text, record">
            <div v-if="record.casestatus.sum === 0" class="noCases">
              <p
                class="status_up"
              >{{record.casestatus.sum === 0 ? 0 : parseInt((record.casestatus.pass + record.casestatus.fail) * 100 / record.casestatus.sum)}}%</p>
            </div>
            <router-link
              v-else
              :to="{name:'taskCase',params:{taskId:record.id, versionId: versionId}}"
            >
              <p
                class="status_up"
              >{{record.casestatus.sum === 0 ? 0 : parseInt((record.casestatus.pass + record.casestatus.fail) * 100 / record.casestatus.sum)}}%</p>
            </router-link>
          </template>
        </a-table-column>
        <a-table-column title="操作" key="action">
          <template slot-scope="text, record">
            <el-button type="primary" @click="openEditDialog(record)">编辑</el-button>
            <el-button type="success" @click="copyTask(record)">复制</el-button>
            <el-button type="danger" @click="deleteTask(record)">删除</el-button>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <case-dialog
      v-if="createCaseDialogVisible"
      ref="addCaseDialog"
      :isShow="createCaseDialogVisible"
      :taskCaseList="addTaskForm.case_list"
      type="create"
      @close="isShowCaseDialog(false)"
      @caseSelect="caseSelected"
    ></case-dialog>
    <el-dialog
      title="新增任务"
      :visible.sync="addTaskDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addTaskForm"
        :rules="addTaskRules"
        ref="addTaskForm"
        labelWidth="120px"
        class="addTaskForm"
      >
        <el-form-item label="任务名：" prop="name">
          <el-input v-model.trim="addTaskForm.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="任务方法：" prop="tmethod">
          <el-radio-group v-model="addTaskForm.tmethod">
            <el-radio-button label="自动化测试"></el-radio-button>
            <el-radio-button label="人工测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务类型：" prop="ttype">
          <el-radio-group v-model="addTaskForm.ttype">
            <el-radio-button label="功能测试"></el-radio-button>
            <el-radio-button label="兼容性测试"></el-radio-button>
            <el-radio-button label="冒烟测试"></el-radio-button>
            <el-radio-button label="接口测试"></el-radio-button>
            <el-radio-button label="新功能测试"></el-radio-button>
            <el-radio-button label="改进优化测试"></el-radio-button>
            <el-radio-button label="报表测试"></el-radio-button>
            <el-radio-button label="发布测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用例列表：" prop="case_list">
          <span v-if="addTaskForm.case_list.length>0">选中了{{addTaskForm.case_list.length}}条用例</span>
          <el-button
            size="small"
            @click="createCaseDialogVisible = true"
            icon="el-icon-circle-plus-outline"
          >{{addTaskForm.case_list && addTaskForm.case_list.length > 0 ? '继续选择' : '请选择'}}</el-button>
        </el-form-item>
        <el-form-item label="优先级：" prop="priority">
          <el-select v-model="addTaskForm.priority" placeholder="请选择" style="width: 350px">
            <el-option
              v-for="(val,key) in taskSet.priority"
              :key="key"
              :label="val"
              :value="parseInt(key)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人：" prop="executor">
          <el-select
            v-model="addTaskForm.executor"
            filterable
            placeholder="请选择"
            style="width: 350px"
          >
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加附件：" class="blockItem">
          <fileUpload
            v-if="ossData.hasOwnProperty('host')"
            :ossData="ossData"
            v-model="addTaskForm.attachment"
          ></fileUpload>
        </el-form-item>
        <div style="display: inline-flex;">
          <el-form-item label="任务标签：" prop="tag" :inline="true">
            <el-select
              v-model="addTaskForm.tag"
              filterable
              placeholder="请选择"
              style="width: 350px"
              multiple
            >
              <el-option v-for="item in tagData" :key="item.id" :label="item.tag" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-button
              class="addTagData"
              type="primary"
              plain
              @click="createVersionDialogVisible=true"
            >增加标签</el-button>
          </div>
        </div>

        <el-form-item label="起止时间：" prop="duration_time">
          <el-date-picker
            v-model="addTaskForm.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务描述：" prop="description">
          <el-input v-model.trim="addTaskForm.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddTaskDialog">取消</el-button>
        <el-button type="primary" @click="addTask">确定</el-button>
      </span>
    </el-dialog>
    <case-dialog
      v-if="editCaseDialogVisible"
      ref="editCaseDialog"
      :isShow="editCaseDialogVisible"
      :taskCaseList="editTaskForm.case_list"
      type="edit"
      @close="isShowCaseEditDialog(false)"
      @caseSelect="caseEditSelected"
    ></case-dialog>
    <el-dialog
      title="编辑任务"
      :visible.sync="editTaskDialogVisible"
      width="800px"
      :close-on-click-modal="false">
      <el-form
        :model="editTaskForm"
        :rules="editTaskRules"
        ref="editTaskForm"
        labelWidth="120px"
        class="editTaskForm"
      >
        <el-form-item label="任务名：" prop="name">
          <el-input v-model.trim="editTaskForm.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="任务方法：" prop="tmethod">
          <el-radio-group v-model="editTaskForm.tmethod">
            <el-radio-button label="自动化测试"></el-radio-button>
            <el-radio-button label="人工测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务类型：" prop="ttype">
          <el-radio-group v-model="editTaskForm.ttype">
            <el-radio-button label="功能测试"></el-radio-button>
            <el-radio-button label="兼容性测试"></el-radio-button>
            <el-radio-button label="冒烟测试"></el-radio-button>
            <el-radio-button label="接口测试"></el-radio-button>
            <el-radio-button label="新功能测试"></el-radio-button>
            <el-radio-button label="改进优化测试"></el-radio-button>
            <el-radio-button label="报表测试"></el-radio-button>
            <el-radio-button label="发布测试"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用例列表：" prop="case_list">
          <span v-if="editTaskForm.case_list.length>0">选中了{{editTaskForm.case_list.length}}条用例</span>
          <el-button
            size="small"
            @click="editCaseDialogVisible = true"
            icon="el-icon-circle-plus-outline"
          >{{editTaskForm.case_list && editTaskForm.case_list.length > 0 ? '继续选择' : '请选择'}}</el-button>
        </el-form-item>
        <el-form-item label="优先级：" prop="priority">
          <el-select v-model="editTaskForm.priority" placeholder="请选择" style="width: 350px">
            <el-option
              v-for="(val,key) in taskSet.priority"
              :key="key"
              :label="val"
              :value="parseInt(key)"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="任务执行人：" prop="executor">
          <el-select
            v-model="editTaskForm.executor"
            filterable
            placeholder="请选择"
            style="width: 350px"
          >
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.nickname"
              :value="item.userid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加附件：" class="blockItem">
          <fileUpload
            v-if="ossData.hasOwnProperty('host')"
            :ossData="ossData"
            v-model="editTaskForm.attachment"
          ></fileUpload>
        </el-form-item>
        <el-form-item label="任务标签：" prop="tag">
          <el-select
            v-model="editTaskForm.tag"
            filterable
            placeholder="请选择"
            style="width: 350px"
            multiple
          >
            <el-option v-for="item in tagData" :key="item.id" :label="item.tag" :value="item.id"></el-option>
          </el-select>
          <el-button
            class="addTagData"
            type="primary"
            plain
            @click="createVersionDialogVisible=true"
          >增加标签</el-button>
        </el-form-item>
        <el-form-item label="起止时间：" prop="duration_time">
          <el-date-picker
            v-model="editTaskForm.duration_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="任务描述：" prop="description">
          <el-input v-model.trim="editTaskForm.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelTaskEdit">取消</el-button>
        <el-button type="primary" @click="editTask">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增标签"
      :visible.sync="createVersionDialogVisible"
      @close="closeCreateVersionDialog"
      width="480px"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px" :model="createVersionForm" :rules="rules" ref="createVersionForm">
        <el-form-item label="标签名称" prop="title">
          <el-input v-model.trim="createVersionForm.title" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="createVersionForm.description" style="width: 350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVersionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createVersion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import issue from "@/pages/issue/index.vue";
import taskApi from "@/api/task.js";
import userApi from "@/api/user.js";
import setApi from "@/api/settingType.js";
import moment from "moment";
import caseDialog from "@/components/caseDialog.vue";
import fileUpload from '@/pages/requirement/fileUpload'
export default {
  name: "TaskList",
  data() {
    return {
      createVersionForm: {
        title: "",
        description: ""
      },
      rules: {
        title: [{ required: true, message: "请输入标签", trigger: "blur" }]
      },
      createVersionDialogVisible: false,
      searchData: {
        status: [],
        handler: [],
        priority: [],
        title: "",
        tag: []
      },
      loading: false,
      doPercent: 10,
      taskList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 条数据`
      },
      scroll: {
        x: 1480
      },
      tData: {
        data: [],
        total: 1
      },
      tagData:[],
      addTaskDialogVisible: false,
      addTaskForm: {
        attachment: [],
        description: "",
        tmethod: "",
        ttype: "",
        status: "",
        executor: "",
        priority: 2,
        case_list: [],
        name: "",
        project_id: "",
        duration_time: [],
        version: "",
        tag: []
      },
      addTaskRules: {
        name: [
          { required: true, message: "请填写任务名称", trigger: "change" }
        ],
        tmethod: [
          { required: true, message: "请选择任务方法", trigger: "change" }
        ],
        ttype: [{ required: true, message: "请选择类型", trigger: "change" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "change" }
        ],
        executor: [
          {
            required: true,
            type: "number",
            message: "请选择处理人",
            trigger: "change"
          }
        ],
        duration_time: [
          { required: true, message: "请选择起止时间", trigger: "change" }
        ]
      },
      editTaskDialogVisible: false,
      editTaskForm: {
        attachment: [],
        id: "",
        description: "",
        tmethod: "",
        ttype: "",
        status: "",
        executor: "",
        priority: 2,
        case_list: [],
        name: "",
        project_id: "",
        duration_time: [],
        version: "",
        tag: []
      },
      editTaskRules: {
        name: [{ required: true, message: "请填写任务名称", trigger: "blur" }],
        tmethod: [
          { required: true, message: "请选择任务方法", trigger: "blur" }
        ],
        ttype: [{ required: true, message: "请选择类型", trigger: "blur" }],
        priority: [
          { required: true, message: "请选择优先级", trigger: "blur" }
        ],
        executor: [
          {
            required: true,
            type: "number",
            message: "请选择处理人",
            trigger: "blur"
          }
        ],
        duration_time: [
          { required: true, message: "请选择起止时间", trigger: "blur" }
        ]
      },
      editCaseDialogVisible: false,
      createCaseDialogVisible: false,
      pageSet: {
        page_size: 10,
        page_index: 1
      }
    };
  },
  components: {
    issue,
    caseDialog,
    fileUpload
  },
  watch: {
    $route() {
      this.pagination.current = 1;
      this.getTaskData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    "searchData.title": {
      handler: function() {
        this.pagination.current = 1;
        this.getTaskData({
          page_size: this.pagination.pageSize,
          page_index: this.pagination.current
        });
      },
      deep: true
    }
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.projectId);
    },
    versionId() {
      if (this.$route.params.versionId == "all") {
        return "all";
      } else {
        return parseInt(this.$route.params.versionId);
      }
    },
    userId() {
      return this.$store.state.login.userid;
    },
    userList() {
      return this.$store.state.project.userList;
    },
    ossData(){
      return this.$store.state.project.ossData
    },
    taskSet() {
      return this.$store.state.project.settings.task_config;
    },
  },
  methods: {
    createVersion() {
      this.$refs.createVersionForm.validate(valid => {
        if (valid) {
          taskApi
            .addTag({
              tag: this.createVersionForm.title,
              project_id: this.projectId,
              description: this.createVersionForm.description,
              tag_type: 2
            })
            .then(res => {
              this.$message.success("添加标签成功");
              this.createVersionDialogVisible = false;
              this.getTagData();
            })
            .catch(err => {
              this.createVersionDialogVisible = false;
              this.$message.error(`添加标签失败: ${err.message}`);
            });
        }
      });
    },
    closeCreateVersionDialog() {
      this.createVersionForm.title = "";
      this.createVersionForm.description = "";
    },
    getTagData() {
      taskApi.getTag(this.projectId, 2).then(res => {
        this.tagData = res.data.data;
        console.log(this.tagData);
      });
    },
    closeAddTaskDialog() {
      this.addTaskDialogVisible = false;
      this.$refs.addTaskForm.resetFields();
    },
    addTask() {
      this.$refs.addTaskForm.validate(valid => {
        if (valid) {
          let editTaskFormCopy = JSON.parse(JSON.stringify(this.addTaskForm));
          editTaskFormCopy.tag = editTaskFormCopy.tag.toString();
          let params = Object.assign({}, editTaskFormCopy);
          params.project_id = parseInt(this.projectId);
          params.version = parseInt(this.versionId);
          params.creator = this.userId;
          params.start_time =
            params.duration_time.length > 1
              ? moment(params.duration_time[0]).format("YYYY-MM-DD")
              : "";
          params.end_time =
            params.duration_time.length > 1
              ? moment(params.duration_time[1]).format("YYYY-MM-DD")
              : "";
          delete params.duration_time;
          console.info(
            "this.addTaskForm.executor:" + this.addTaskForm.executor
          );
          params.executor = parseInt(this.addTaskForm.executor);
          params.attachment = JSON.stringify(params.attachment)
          taskApi
            .addTask(params)
            .then(res => {
              this.$message.success("添加成功");
              this.addTaskDialogVisible = false;
              this.$refs.addTaskForm.resetFields();
              // this.getTaskData()
              this.pagination.current = 1;
              this.getTaskData({
                page_size: this.pagination.pageSize,
                page_index: this.pagination.current
              });
            })
            .catch(err => {
              this.$message.error("添加失败: " + err.message);
            });
        }
      });
    },
    openEditDialog(task) {
      console.log(task)
      this.editTaskDialogVisible = true;
      taskApi
        .getSingleTask(task)
        .then(res => {
          this.editTaskForm.attachment = res.data.data[0].attachment ? JSON.parse(res.data.data[0].attachment) : []
          this.editTaskForm.id = res.data.data[0].id;
          this.editTaskForm.description = res.data.data[0].description;
          this.editTaskForm.tmethod = res.data.data[0].tmethod;
          this.editTaskForm.ttype = res.data.data[0].ttype;
          this.editTaskForm.status = res.data.data[0].status;
          this.editTaskForm.executor = res.data.data[0].executor;
          this.editTaskForm.priority = res.data.data[0].priority;
          this.editTaskForm.case_list = res.data.data[0].case_list;
          this.editTaskForm.name = res.data.data[0].name;
          this.editTaskForm.project_id = res.data.data[0].project_id;
          this.editTaskForm.version = res.data.data[0].version;
          // todo
          this.editTaskForm.tag =
            res.data.data[0].tag.split(",")[0] == ""
              ? []
              : res.data.data[0].tag.split(",").map(item => {
                  return item / 1;
                });
          let start_time = new Date(res.data.data[0].start_time);
          let end_time = new Date(res.data.data[0].end_time);
          this.editTaskForm.duration_time = [start_time, end_time];
          if (this.editTaskForm.executor.length > 0) {
            this.editTaskForm.executor = this.editTaskForm.executor[0].id;
          }
          this.taskStatus = Boolean(this.editTaskForm.status);
        })
        .catch(err => {
          this.$message.error("获取内容失败: " + err.message);
        });
    },
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getTaskData({
        page_size: pagination.pageSize,
        page_index: pagination.current
      });
    },
    getTaskData(par = {}) {
      this.loading = true;
      let params = {
        ...par,
        projectid: this.projectId,
        status: this.searchData.status.toString(),
        handler: this.searchData.handler.toString(),
        priority: this.searchData.priority.toString(),
        title: this.searchData.title,
        tag: this.searchData.tag.toString()
      };
      if (this.versionId !== "all") {
        params.versionid = this.versionId;
      }
      taskApi.getTaskList(params).then(
        res => {
          let data = res.data;
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.taskList = data.data;
          this.pagination = pagination;
          this.loading = false;
        },
        error => {
          this.taskList = [];
          this.loading = false;
        }
      );

      // if(this.versionId === 'all'){
      //   taskApi.getTaskListByProject(this.projectId).then(res => {
      //   this.taskList = res.data.data
      //   this.loading = false
      // },error=>{
      //   this.loading = false
      // })
      // }else{
      //   taskApi.getTaskListByVersion(this.versionId, this.projectId).then(res => {
      //     this.taskList = res.data.data
      //     this.loading = false
      //   }).catch(err => {
      //     this.loading = false
      //   })
      // }
    },
    filterData(value) {
      this.pagination.current = 1;
      this.getTaskData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    },
    editTask() {
      this.$refs.editTaskForm.validate(valid => {
        if (valid) {
          let editTaskFormCopy = JSON.parse(JSON.stringify(this.editTaskForm));
          editTaskFormCopy.tag = editTaskFormCopy.tag.toString();
          console.log("editTaskFormCopy", editTaskFormCopy);
          let params = Object.assign({}, editTaskFormCopy);
          params.start_time =
            params.duration_time.length > 1
              ? moment(params.duration_time[0]).format("YYYY-MM-DD")
              : "";
          params.end_time =
            params.duration_time.length > 1
              ? moment(params.duration_time[1]).format("YYYY-MM-DD")
              : "";
          delete params.duration_time;
          params.attachment = JSON.stringify(params.attachment)
          taskApi
            .editTask(params.id, params)
            .then(res => {
              this.$message.success("修改成功");
              this.editTaskDialogVisible = false;
              // this.getTaskData()
              this.getTaskData({
                page_size: this.pagination.pageSize,
                page_index: this.pagination.current
              });
            })
            .catch(err => {
              this.$message.error(`修改失败：${err.message}`);
            });
        }
      });
    },
    cancelTaskEdit() {
      this.editTaskDialogVisible = false;
      //重新刷新用例
      // this.$refs.editCaseDialog.getMoudleCase()
    },
    deleteTask(task) {
      this.$confirm(`此操作将删除该任务:${task.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        taskApi
          .deleteTask(task)
          .then(res => {
            this.$message.success("删除成功!");
            this.pagination.current = 1;
            this.getTaskData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          })
          .catch(err => {
            this.$message.error("删除失败: " + err.message);
            console.log(err);
          });
      });
    },
    copyTask(task) {
      let copyTask = Object.assign({}, task);
      let copyData = copyTask;
      copyData.executor = copyTask.executor[0] ? copyTask.executor[0].id : "";
      copyData.creator = copyTask.creator[0] ? copyTask.creator[0].id : "";
      copyData.version = copyTask.version[0] ? copyTask.version[0].id : "";
      this.$confirm(`您确定你要复制:${copyTask.name} 这个任务吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        taskApi
          .addTask(copyData)
          .then(res => {
            this.$message({
              message: "task复制成功！",
              type: "success"
            });
            // this.getTaskData()
            this.pagination.current = 1;
            this.getTaskData({
              page_size: this.pagination.pageSize,
              page_index: this.pagination.current
            });
          })
          .catch(err => {
            this.$message.error("复制失败: " + err.message);
            console.log(err);
          });
      });
    },
    isShowCaseDialog(val) {
      this.createCaseDialogVisible = val;
    },
    isShowCaseEditDialog(val) {
      this.editCaseDialogVisible = val;
    },
    caseSelected(val) {
      console.log("selectedCase", val);
      this.addTaskForm.case_list = val;
      this.isShowCaseDialog(false);
    },
    caseEditSelected(val) {
      console.log("selectedCase", val);
      this.editTaskForm.case_list = val;
      this.isShowCaseEditDialog(false);
    },
    finishTask(item) {
      taskApi
        .finishTask(item.id)
        .then(res => {
          this.pagination.current = 1;
          this.getTaskData({
            page_size: this.pagination.pageSize,
            page_index: this.pagination.current
          });
          this.$message.success(`操作成功`);
        })
        .catch(err => {
          this.$message.error(`操作失败:${err.message}`);
        });
    },
    refuseTask(item) {
      taskApi
        .refuseTask(item.id)
        .then(res => {
          this.pagination.current = 1;
          this.getTaskData({
            page_size: this.pagination.pageSize,
            page_index: this.pagination.current
          });
          this.$message.success(`操作成功`);
        })
        .catch(err => {
          this.$message.error(`操作失败: ${err.message}`);
        });
    },
    updatePriority(row, status) {
      console.log("upload", row, status);
      let priority = parseInt(status);
      taskApi.updateTaskPriority(row.id, { priority: priority }).then(
        res => {
          row.priority = priority;
          // this.initTableData()
        },error=>{
          this.$message.error('操作失败：' + error.message)
        })
      },
    },
    created(){
      this.getTagData();
      this.getTaskData({
        page_size: this.pagination.pageSize,
        page_index: this.pagination.current
      });
    }
};
</script>
<style lang="scss" scoped>
.TaskList {
  /*margin-left: 240px;*/
  .add-task {
    margin-bottom: 10px;
  }
}
.goback {
  width: 100%;
  text-align: right;
  font-weight: 700;
  margin-right: 15px;
}

.plat-wrap {
  color: #333;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 6px -1px,
    rgba(0, 0, 0, 0.05) 0px 6px 28px -3px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 10px 10px 10px 20px;
  background: rgb(255, 255, 255);
  border-radius: 3px;
  border: 1px solid #eee;
  margin-bottom: 10px;
  .infos {
    -webkit-box-flex: 1;
    flex-grow: 1;
  }
  .name {
    color: #27a9e3;
    cursor: pointer;
    .edit-btn {
      margin-right: 8px;
    }
  }
  .statistics {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    font-weight: bold;
    line-height: 16px;
    font-size: 12px;
    margin-bottom: 16px;
    em {
      color: #999;
    }
  }
  .dot-span {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    margin: 0px 6px;
    background: rgb(201, 207, 215);
  }
  .statistics-col {
    &.name {
      flex: 1;
    }
    &.type {
      width: 110px;
    }
    &.handler {
      width: 100px;
    }
    &.fun {
      width: 110px;
    }
    &.time {
      flex: 1;
    }
  }
  .split-line {
    width: 1px;
    height: 56px;
    margin: 0px 20px;
    background: rgba(0, 0, 0, 0.07);
  }
  .status {
    display: flex;
    text-align: center;
    width: 260px;
    flex: 0 0 260px;
    .status_down.enter-case {
      margin-top: 0px;
      padding: 2px 3px;
      border: 1px solid #4fb8e6;
      border-radius: 4px;
      color: #27a9e3;
    }
    .status_up {
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
    }
    .status_down {
      margin-top: 3px;
      font-size: 12px;
      line-height: 16px;
      color: rgb(145, 153, 163);
    }
    .status_down.margin-top {
      margin-top: 27px;
    }
    .noCases {
      cursor: default;
      color: #999;
      .status_down {
        color: #999;
        border-color: #999;
      }
    }
    .finish {
      font-size: 40px;
    }
    .more {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 52px;
      div:hover {
        cursor: pointer;
      }
      div {
        height: 26px;
        margin-top: 3px;
        margin-bottom: 3px;
        color: #409eff;
      }
      div.copy-btn {
        margin: 0;
      }
      div.delete-btn {
        height: 26px;
        color: #f56c6c;
        bottom: 0;
      }
    }
    li + li {
      margin-left: 16px;
    }
  }
}
.task-search-bar {
  display: flex;
  flex-wrap:wrap;
  align-items: center;
  padding: 10px;
  .item{
    display: flex;
    margin-bottom:10px;
    margin-right:8px;
    align-items: center;
    label{
      width:70px;
    }
  }
  div {
    font-size: 12px;
  }
  .el-select {
    margin-right: 8px;
  }
  .m-search {
    width: 200px;
  }
}
// 	.addTagData{
// 	  align-items:center;
// 		margin-right: 12px;
//
// 	}
.task-page {
  padding: 15px;
  height: 62px;
  .el-pagination {
    float: right;
  }
}
.status_up {
  text-decoration: underline;
  text-align: center;
}
.noCases {
  .status_up {
    text-decoration: none;
  }
}
.priority-down-wrap {
  ul {
    padding-top: 10px;
    max-height: 250px;
    overflow: auto;
    li {
      div {
        padding: 1px 10px;
      }
      margin: 3px 0;
      &:hover,
      &.selected {
        background-color: rgba(16, 113, 211, 0.08);
      }
    }
  }
}
</style>
