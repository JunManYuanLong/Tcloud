<template>
  <div class="submit-test">
    <ArrowContainer head-text="安装包信息">
      <div slot="content" class="apk-info">
        <p>安装包：{{selectApk.name}}</p>
        <p>版本：{{selectApk.version}}</p>
        <p>大小：{{selectApk.size}}</p>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="测试手机信息">
      <div slot="content" class="phone-info">
        <el-table :data="tableData" style="width: 100%;" max-height="250">
          <el-table-column prop="phoneName" label="手机名称"></el-table-column>
          <el-table-column prop="resolution" label="分辨率"></el-table-column>
          <el-table-column prop="version" label="android版本"></el-table-column>
          <el-table-column
            prop="electric"
            label="电量">
            <template slot-scope="scope">
                <!-- <Battery :left-val="scope.row.electricNum"></Battery> -->
                {{scope.row.electricNum + '%'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="occupy"
            label="占用情况">
            <template slot-scope="scope">
                <el-tag size="mini" :type="scope.row.using ? 'warning' : 'success'">{{scope.row.using ? '占用中' : '空闲'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ArrowContainer>
    <ArrowContainer head-text="其他配置信息">
      <div slot="content" class="other-info">
          <p>运行时间：{{perRunTime}}分钟</p>
          <p v-show="show">测试类型：{{testTypeMap[testType]}}</p>
          <p>是否安装包：<el-tag size="mini" type="success">{{isInstallApp ? '是' : '否'}}</el-tag></p>
          <p>是否尝试登陆：<el-tag size="mini" type="success">{{jumpLogin ? '是' : '否'}}</el-tag></p>
          <p>配置项：{{testConfig}}</p>
      </div>
    </ArrowContainer>
  </div>
</template>

<script>
import ArrowContainer from "../common/ArrowContainer";
import Battery from "../common/Battery";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "SubmitTest",
  data() {
    return {
      show: false,
      tableData: [],
      testTypeMap: {
        1: 'MIX（混合模式）',
        2: 'DFS（深度遍历）',
        3: 'TROY（可配置的深度遍历）'  
      }
    };
  },
  computed: {
    ...mapState('autotest', ['selectApk', 'selectPhoneList', 'perRunTime', 'isInstallApp', 'jumpLogin', 'testType', 'testConfig'])
  },
  methods: {
    ...mapMutations('autotest', ['']),
    formateData () {
      this.tableData = JSON.parse(JSON.stringify(this.selectPhoneList))
      this.tableData.forEach(item => {
        item.phoneName = item.manufacturer + ' ' +  item.model
        item.resolution = item.display.height + 'x' + item.display.width
        item.electricNum = item.battery.level
      })
    }
  },
  components: {
    ArrowContainer,
    Battery
  },
  watch: {
    selectPhoneList () {
      this.formateData()
    }
  },
  created () {
    this.formateData()
  },
  beforeDestroy () {

  }
};
</script>

<style lang="scss" scoped>
.submit-test {
  .apk-info {
    p {
      line-height: 1.6;
    }
  }
  .other-info {

  }
}
</style>
