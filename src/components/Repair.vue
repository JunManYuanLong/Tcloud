<template>
    <div class="track-repair">
        <div class="track-image">
            <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1495"><path d="M512 1024C229.239467 1024 0 794.760533 0 512S229.239467 0 512 0 1024 229.239467 1024 512 794.760533 1024 512 1024z m289.473422-315.346489l-137.511822-137.784889s-16.748089-13.994667-5.415822-31.744a223.618844 223.618844 0 0 0 17.521778-86.926222c0-124.063289-100.420267-224.642844-224.256-224.642844a220.728889 220.728889 0 0 0-61.485512 8.783644c-16.725333 5.779911-4.846933 17.976889-4.846933 17.976889l103.310222 103.469511a85.219556 85.219556 0 0 1 0 120.376889l-10.012444 10.012444a84.855467 84.855467 0 0 1-120.149333 0l-104.925867-105.130666s-10.763378-9.0112-16.497778 4.551111a222.344533 222.344533 0 0 0-9.648355 64.625778c0 124.063289 100.397511 224.6656 224.256 224.6656a222.867911 222.867911 0 0 0 93.980444-20.6848c12.9024-6.690133 22.528 4.323556 22.528 4.323555l140.515556 140.925156a60.302222 60.302222 0 0 0 51.655111 17.089422s47.331556-4.255289 57.890133-57.116445a60.552533 60.552533 0 0 0-16.907378-52.792888z" p-id="1496"></path></svg>
        </div>
        <p class="track-text">功能维护中...</p>
    </div>
</template>

<script>
export default {
    name: 'Repair',
    data () {
        return {
            
        }
    }
}
</script>

<style scoped lang="scss">
    .track-repair {
        padding-top: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        .track-image {
            width: 60px;
            height: 60px;
            font-size: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .track-text {
            font-size: 25px;
            color: rgb(102, 107, 112);
        }
    }
</style>

