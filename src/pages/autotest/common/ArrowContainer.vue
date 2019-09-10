<template>
    <div class="arrow-container">
        <!-- 标题 -->
        <div class="container-title">
            <div class="icon">
                <i class="el-icon-d-arrow-right" style="color: #188fff;"></i>
            </div>
            <div class="text">{{headText}}</div>
        </div>
        <!-- 内容 -->
        <div class="container-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props: ['headText']
}
</script>
<style scoped lang="scss">
.arrow-container {
    font-size: 14px;
    width: 100%;
    .container-title {
        display: flex;
        justify-content: flex-start;
        padding: 5px;
        .text {
            padding-left: 15px;
            font-weight: 500;
        }
    }
    .container-content {
        background: white;
        border: 1px solid #ccc;
        padding: 20px;
    }
}
</style>


