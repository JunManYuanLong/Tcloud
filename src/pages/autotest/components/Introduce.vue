<template>
    <div class="introduce">
        <ArrowContainer head-text="测试方案介绍">
            <div slot="content" class="test-introduce">
                <div class="title">随机测试（Maxim）</div>
                <p><i class="el-icon-news"></i>策略：70%控件解析随机点击，其余30%按原Monkey事件概率分布</p>
                <p><i class="el-icon-news"></i>操作：模拟用户点击，滑动等操作，进行app安装，卸载测试</p>
                <p><i class="el-icon-news"></i>建议：每次测试事件建议>3小时，可以进行单个app压力，稳定性测试</p>
                <el-button style="margin-top: 20px;" @click="goReportTest">点击查看进行中的任务</el-button>
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
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/pic3.svg" alt="">
                        <p style="text-align: center;">登录</p>
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/arrow-right.svg" alt="">
                    </div>
                    <div class="introduce-item">
                        <img src="http://ctsssource.oss-cn-shanghai.aliyuncs.com/monkey/static/resource/pic4.svg" alt="">
                        <p style="text-align: center;">随机测试</p>
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
                <p>提供完整的测试报告，包括crash,anr,exceptionde报错信息。并且在crash位置有详细的截图，还可以下载到完整的logcat日志，方便后续定位问题
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
            window.location.hash = '#/auto/report'
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


