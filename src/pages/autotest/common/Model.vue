<template>
    <div class="model" :class="{selected: this.isSelected, disable: (!deviceData.present || deviceData.nickname)}" @click="selectedItem">
        <div class="model-header">
            <div class="model-name">
                {{`${deviceData.manufacturer}  ${deviceData.model}`}}
            </div>
            <div class="model-battery">
                <Battery :left-val="deviceData.battery.level"></Battery>
            </div>
        </div>
        <div class="model-content">
            <div class="model-image">
                <img :src="deviceData.pic" alt="pic">
            </div>
            <div class="model-desc">
                <p>型号：{{deviceData.model}}</p>
                <p>版本：{{deviceData.version}}</p>
                <p>分辨率：{{`${deviceData.display.height}x${deviceData.display.width}`}}</p>
                <p>使用次数：{{deviceData.times}}</p>
            </div>
        </div>
        <div class="model-footer">
            <el-tag v-if="deviceData.present" :type="deviceData.nickname ? 'warning' : 'success'" size="small">{{deviceData.nickname ? '占用中' : '空闲'}}</el-tag>
            <el-tag v-else type="info">已离线</el-tag>
        </div>
    </div>
</template>
<script>
import Battery from "../common/Battery";
export default {
    data () {
        return {
            isSelected: false
        }
    },
    computed: {
        
    },
    props: ['deviceData'],
    components: {
        Battery
    },
    watch: {
        'deviceData' () {
            this.deviceData.isSelected = this.isSelected
        }
    },
    methods: {
        selectedItem () {
            // 离线或者占用中不可点击
            if (!this.deviceData.present || this.deviceData.nickname) {
                return
            }
            this.isSelected = !this.isSelected
            this.deviceData.isSelected = this.isSelected
            this.$emit('selectChange')
        }
    },
    created () {
        
    }
}
</script>
<style lang="scss" scoped>
.model {
    width: 230px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    display: inline-block;
    margin-bottom: 10px;
    margin-left: 10px;
    cursor: pointer;
    &.disable {
        cursor: not-allowed;
        pointer-events:none;
    }
    .model-header {
        width: 100%;
        height: 60px;
        display: flex;
        box-sizing: border-box;
        padding: 0 15px;
        justify-content: space-between;
        align-items: center;
    }
    .model-content {
        width: 100%;
        height: 160px;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        box-sizing: boder-box;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        .model-image {
            width: 70px;
            height: 100%;
            img {
                width: 100%;
            }
        }
        .model-desc {
            width: 130px;
            height: 100%;
            font-size: 12px;
            padding: 10px 0px 10px 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .model-footer {
        width: 100%;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f3f4f6;
    }
    &.selected {
        box-shadow: 0px 0px 6px #188FFF;
    }
}
</style>


