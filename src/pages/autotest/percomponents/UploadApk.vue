<template>
  <div class="upload-apk">
    <ArrowContainer head-text="上传安装包">
      <div slot="content">
        <el-tabs v-model="activeNameUpload">
          <el-tab-pane label="上传安装包" name="upload">
            <FileUpload
              v-if="ossData.hasOwnProperty('host')"
              :ossData="ossData"
              v-model="uploadFiles"
              @uploadUrl="uploadUrl"
            ></FileUpload>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="选择安装包">
      <div slot="content">
        <el-alert title="UI性能测试，现在只支持：[趣键盘]" type="warning" :closable="false"></el-alert>
        <el-tabs v-model="activeNameHasUpload">
          <el-tab-pane label="我上传的包" name="mine">
            <!-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAABCFBMVEX/AEj/6YT/9fj/7PH/9/n/8/b/6O//7vP/8vX/6vD/8PT/4er/CE7/4+v/pb7/Mmz/v9H/HFz/Bkv/zNv/obv/lrT/g6b/eJ7/dZz/X4z/XIr/JWL/E1X/09//z93/wtP/jq7/iar/cZn/ZJD/D1L/5e3/2OP/ydj/xtb/mrf/f6T/faL/LGf/2uT/tcr/rMP/k7H/haj/V4b/U4T/Q3j/3Ob/1eH/sMb/qcL/bJb/aZP/SXz/PHP/N2//GFn/us3/rsX/i6z/ToD/R3v/nrr/tHb+q2//YY7/2oD54XH70m77zW37o2b+eF7/LlP/n3H/jm3/hWv/aGP/Ul3+Vlj/PVj/LVD+J0/KEvHcAAACyklEQVQ4y9XQ1ZLbMBQG4L9WJRliiDkOGcLM2CyWmfv+b1I7m23SvWn2st94bI/OP9LRwRm+PjnAGV48Jvz6X+GP79//Ojv88s2bd3/+/xX+8Pbtn/C3f4XN7x9+4uHWOIf56fxw6sfnFy++fMR/zCwkueyz6eGhIDFzODGbuJTGs2e7hNrF/F1pNylhL+SSgRMNcqqNjPF0gr1SufoMJ8bPB6zqb4Jppa4V8yYyVSFAZpv43Sj6q5Gct2926uvYi21OLT/bVxCeCuVrEw/pmuaNnVXWhiGK4lAHbhFHVNBxIlzfTKIQiSDUjYXAANTMvrwGunSLIqV/9UypwIUmNrQMJJTcXVqOMSXlntOQZaVaOzZMkxraFmKxvKslVERmTozAapcQG1y27OMFS/LmAloFHues+0qW00ruhhFrl9NiQCdkhqM8Scc+KKPDHaBASHrmQJKkDlAdoegTqVs8hotSCWguMCZeFpYugM0VY27a+BIVJjFJOvbcU9JXv4GQNS9XBcby2T3qLILJmpg5jI1OZrebt62c2ofDlteFgLHs0FpdDXGhzoFZvV7AUW84dGpKBe16OtBAVXtAmlNHaaWIUldVlUUJf8mZsNOYf6mqOhCUFcXZL/eVTAkPPSuYmPpjJ592UdRndyO4yKdK+O/l9W3BH4/sq0uj2rKsVtW4HNqjsV+41fMnI9ODsdZS2YHFKpX002J7SrnCFKa0NDfQc0BTuqNMO51JQ1r4K3dtSXVPDTs3UmW2eOUupYMWyIESETJqEHuqO5Ml0aZrEjbJwLMLQ4/cAyeEE865enMdTfpE2cbercaHg2v31u1zN+okA34PXJa5zNPnaq6sZDnstL2tJhtBlXfTQkexm1pa3JMhHpS7ohg1RcltG3FD7K89MV0QB65jV8R7oAeanL3o87nxXLuiQ0KXK0pbYYtWR/QehEfA00f4DQOLTu/LOR5EAAAAAElFTkSuQmC" alt=""> -->
            <el-table :data="mineTableData" style="width: 100%">
              <el-table-column label="选择（ID）" width="100" align="center">
                <template slot-scope="scope">
                  <el-radio
                    v-model="chooseRadio"
                    :label="scope.row.id"
                    @change="radioChange(scope.row)"
                  ></el-radio>
                </template>
              </el-table-column>
              <el-table-column label="图标" align="center">
                <template slot-scope="scope">
                  <div style="width: 45px; height: 45px;">
                    <img
                      :src="scope.row.picture.startsWith('http') ? scope.row.picture : `data:image/png;base64,${scope.row.picture}`"
                      alt
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="APP" align="center"></el-table-column>
              <el-table-column prop="version" label="版本" align="center"></el-table-column>
              <el-table-column prop="size" label="大小" align="center"></el-table-column>
              <el-table-column prop="user_nickname" label="上传人" align="center"></el-table-column>
              <el-table-column prop="upload_time" label="上传时间" width="200px" align="center"></el-table-column>
              <el-table-column label="操作" width="50px;">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delPackage(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="mineTotal"
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page.sync="minePageIndex"
              @current-change="minePageChange"
              :total="mineTotal"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="所有的包" name="all">
            <el-table :data="allTableData" style="width: 100%">
              <el-table-column label="选择（ID）" width="100" align="center">
                <template slot-scope="scope">
                  <el-radio
                    v-model="chooseRadio"
                    :label="scope.row.id"
                    @change="radioChange(scope.row)"
                  ></el-radio>
                </template>
              </el-table-column>
              <el-table-column label="图标" align="center">
                <template slot-scope="scope">
                  <div style="width: 45px; height: 45px;">
                    <img
                      :src="scope.row.picture.startsWith('http') ? scope.row.picture : `data:image/png;base64,${scope.row.picture}`"
                      alt
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="APP" align="center"></el-table-column>
              <el-table-column prop="version" label="版本" align="center"></el-table-column>
              <el-table-column prop="size" label="大小" align="center"></el-table-column>
              <el-table-column prop="user_nickname" label="上传人" align="center"></el-table-column>
              <el-table-column prop="upload_time" label="上传时间" width="200px" align="center"></el-table-column>
              <el-table-column label="操作" width="50px;">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delPackage(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="allTotal"
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page.sync="allPageIndex"
              @current-change="allPageChange"
              :total="allTotal"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ArrowContainer>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除该安装包？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ArrowContainer from "../common/ArrowContainer";
import FileUpload from "../common/FileUpload";
import monkeyApi from "@/api/monkey.js";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "UploadApk",
  data() {
    return {
      activeNameUpload: "upload",
      activeNameHasUpload: "mine",
      uploadFiles: [],
      mineTableData: [],
      mineTotal: 0,
      allTableData: [],
      allTotal: 0,
      chooseRadio: "",
      pageSize: 10,
      minePageIndex: 1,
      allPageIndex: 1,
      dialogVisible: false,
      rowData: {}
    };
  },
  computed: {
    ...mapState("autotest", ["selectApk"]),
    ossData() {
      return this.$store.state.project.ossData;
    },
    userId() {
      return this.$store.state.login.userid;
    }
  },
  methods: {
    ...mapMutations("autotest", ["setSelectApk"]),
    // 获取上传包的数据
    async getApkList(params) {
      let data = await monkeyApi.getUploadPackage(params).catch(err => {
        this.$message.error(`${err.message}`);
      });
      return data;
    },
    // 获取我上传的包
    getMinePackege() {
      let params = {
        page_index: this.minePageIndex,
        page_size: this.pageSize,
        user_id: this.userId,
        test_type: 2
      };
      this.getApkList(params).then(res => {
        this.mineTotal = res.data.total;
        this.mineTableData = res.data.data;
        this.formateListData(this.mineTableData);
      });
    },
    // 获取所有的包
    getAllPackege() {
      let params = {
        page_index: this.allPageIndex,
        page_size: this.pageSize,
        test_type: 2
      };
      this.getApkList(params).then(res => {
        this.allTotal = res.data.total;
        this.allTableData = res.data.data;
        this.formateListData(this.allTableData);
      });
    },
    // 处理数据
    formateListData(data) {
      data.forEach(item => {
        item.size = item.size ? item.size + "M" : "";
      });
    },
    // 将apk的url传递给后台
    uploadUrl(file) {
      let params = {
        user_id: this.userId,
        oss_url: file.url,
        test_type: 2
      };
      monkeyApi
        .uploadPackage(params)
        .then(res => {
          // 刷新列表
          this.getMinePackege();
          this.getAllPackege();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    radioChange(row) {
      this.setSelectApk(row);
    },
    // 删除sdk包
    delPackage(row) {
      this.dialogVisible = true;
      this.rowData = row;
    },
    delSure() {
      monkeyApi
        .delPackage(this.rowData.id)
        .then(res => {
          this.dialogVisible = false;
          this.$message.success("删除成功");
          this.getMinePackege();
          this.getAllPackege();
        })
        .catch(err => {
          this.$message.error(`删除成功：${err.message}`);
        });
    },
    minePageChange(val) {
      this.getMinePackege();
    },
    allPageChange(val) {
      this.getAllPackege();
    }
  },
  components: {
    ArrowContainer,
    FileUpload
  },
  watch: {
    uploadFiles(data) {}
  },
  created() {
    this.getMinePackege();
    this.getAllPackege();
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.upload-apk {
  .upload-box {
    width: 100%;
  }
}
</style>
<style lang="scss">
.upload-box {
  .el-upload.el-upload--text {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>



