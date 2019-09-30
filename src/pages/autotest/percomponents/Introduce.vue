<template>
    <div class="introduce">
        <ArrowContainer head-text="测试方案介绍">
            <div slot="content" class="test-introduce">
                <div class="title">APP性能测试（Airtest）</div>
                <p><i class="el-icon-news"></i>策略：执行特定的Airtest脚本，运行期间，后台用adb打点收集APP相关的各种性能数据</p>
                <p><i class="el-icon-news"></i>操作：自动安装APP，运行脚本执行特定场景的测试用例，最后产出性能报表</p>
                <p><i class="el-icon-news"></i>建议：最好使用同一台手机的这次运行与上一次运行比较。</p>
                <el-button style="margin-top: 20px;" @click="goReportTest">点击查看我的提测任务</el-button>
            </div>
        </ArrowContainer>
        <ArrowContainer head-text="测试过程">
            <div slot="content" class="test-process">
                <div class="introduce-image">
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/pic1.svg" alt="">
                        <p style="text-align: center;">安装</p>
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/arrow-right.svg" alt="">
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/pic2.svg" alt="">
                        <p style="text-align: center;">通过授权</p>
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/arrow-right.svg" alt="">
                    </div>
                    <div class="introduce-item">
                        <img src="http://tcloud-static.oss-cn-beijing.aliyuncs.com/icon/lua.svg" alt="">
                        <p style="text-align: center;">执行用例</p>
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/arrow-right.svg" alt="">
                    </div>
                    <div class="introduce-item">
                        <img src="http://tcloud-static.oss-cn-beijing.aliyuncs.com/icon/collect.svg" alt="">
                        <p style="text-align: center;">收集数据</p>
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/arrow-right.svg" alt="">
                    </div>
                    <div class="introduce-item">
                        <div class="special"></div>
                        <p style="text-align: center;">产出报表</p>
                    </div>
                </div>
            </div>
        </ArrowContainer>
        <ArrowContainer head-text="测试报告">
            <div slot="content" class="test-introduce">
                <p>
                    提供完整的性能测试报告，包括CPU、FPS、冷起动时间、热起动时间、页面打开时间等
                </p>
            </div>
        </ArrowContainer>
    </div>
</template>
<script>
import ArrowContainer from "../common/ArrowContainer";
export default {
    data () {
        return {

        }
    },
    components: {
        ArrowContainer
    },
    methods: {
        goReportTest () {
            window.location.hash = '#/auto/perReport'
        }
    }
}
</script>
<style scoped lang="scss">
.introduce {
    .test-introduce {
        .title {
            font-weight: 500;
            margin-bottom: 16px;
        }
        p {
            line-height: 1.5;
            i {
                padding-right: 10px;
            }
        }
    }
    .test-process {
        .introduce-image {
            padding: 10px 30px;
            display: flex;
            align-items: center;
            .introduce-item {
                width: 84px;
                text-align: center;
                box-sizing: border-box;
                .special {
                    width: 100%;
                    height: 63px;
                    background: url('http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/pic5.svg') no-repeat center;
                    background-size: 50px 76px;
                }
            }
        }
    }
}
</style>


