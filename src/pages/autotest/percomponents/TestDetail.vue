<template>
    <div class="test-detail">
        <el-button type="primary" @click="goBack">返回</el-button> 
        <!-- 头部 -->
        <div class="detail-header">
            <div class="header-item header-item-one">
                <div class="one-icon">
                    <img :src="detailData.app_picture.startsWith('http') ? detailData.app_picture : `data:image/png;base64,${detailData.app_picture}`" alt="icon" v-if="detailData.app_picture">
                </div>
                <div class="one-content">
                    <p>APP：{{detailData.app_name}}</p>
                    <p style="color: transparent">xxx</p>
                    <!-- <p>状态：<el-tag>{{detailData.current_stage}}</el-tag></p> -->
                </div>
            </div>
            <div class="header-item header-item-content">
                <p>版本：<el-tag>{{detailData.app_version}}</el-tag></p>
                <p>包名：{{detailData.app_package_name}}</p>
            </div>
            <div class="header-item header-item-content">
                <p>类型：<el-tag>{{typeMap[detailData.type_id]}}</el-tag></p>
                <p>进度：{{detailData.process}}%</p>
            </div>
            <div class="header-item header-item-content">
                <p>创建时间：{{detailData.creation_time}}</p>
                <p>开始时间：{{detailData.begin_time}}</p>
            </div>
            <div class="header-item header-item-content">
                <p>创建人：{{detailData.user_nickname}}</p>
                <p>总耗时：{{detailData.run_time}} 分钟</p>
            </div>
        </div>
        <!-- 主体tab内容 -->
        <div class="detail-content">
            <el-tabs v-model="activeName" style="width: 100%;">
                <el-tab-pane name="first" class="detail-content-panel">
                    <span slot="label"><i class="el-icon-tickets"></i> 测试概况</span>
                    <TestOverview :sub-data="detailData"></TestOverview> 
                </el-tab-pane>
                <!-- <el-tab-pane name="second" class="detail-content-panel">
                    <span slot="label"><i class="el-icon-goods"></i> 版本对比</span>
                    <VersionDiff :sub-data="detailData"></VersionDiff>    
                </el-tab-pane> -->
            </el-tabs>
        </div>
    </div>    
</template>
<script>
import TestOverview from './detailComp/TestOverview'
import VersionDiff from './detailComp/VersionDiff'
export default {
    data () {
        return {
            activeName: 'first',
            typeMap: {
                1: 'MIX（混合模式）',
                2: 'DFS（深度遍历）',
                3: 'TROY（可配置的深度遍历）'  
            }
        }
    },
    computed: {

    },
    props: [ 'detailData' ],
    methods: {
        goBack () {
            this.$emit('closeDetail')
        }
    },
    components: {
        TestOverview,
        VersionDiff
    },
    created () {
        
    }
}
</script>
<style scoped lang="scss">
.test-detail {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 15px;
    font-size: 14px;
    /* 头部 */
    .detail-header {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        padding-top: 10px;
        margin-top: 10px;
        border-top: 1px solid #ccc;
        .header-item {
            height: 58px;
        }
        .header-item-one {
            display: flex;
            justify-content: start;
            .one-icon {
                width: 44px;
                height: 58px;
                img {
                    width: 100%;
                }
            }
            .one-content {
                padding-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding-right: 20px;
            }
        }
        .header-item-content {
            padding-right: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    }
    /* 主体内容 */
    .detail-content {
        width: 100%;
        padding-top: 20px;
        .detail-content-panel {
            width: 100%;
            height: 430px;
            padding-bottom: 10px;
            overflow: auto;
        }
    }
}
</style>


