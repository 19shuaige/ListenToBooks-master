<template>
 <view class="container" :style="{ height: boxHeight + 'px' }">
  <view @touchmove.stop.prevent="handleTouchMove">
   <slot name="top" />
  </view>
  <view class="content">
   <slot></slot>
  </view>
 </view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { myThrottle } from "../../utils/utils"

const emit = defineEmits<{
 (e: "height-change", height: number): void
}>()

const props = defineProps({
 minHeight: {
  type: Number,
  default: 100
 },
 maxHeight: {
  type: Number,
  default: 300
 },
 initialHeight: {
  type: Number,
  default: 200
 }
})

const startY = ref(0)
const boxHeight = ref(props.initialHeight)
const minHeight = ref(props.minHeight)
const maxHeight = ref(props.maxHeight)

const clampHeight = (height: number) => {
 if (height < minHeight.value) return minHeight.value
 if (height > maxHeight.value) return maxHeight.value
 return Math.round(height)
}

const setHeight = (height: number) => {
 boxHeight.value = clampHeight(height)
 emit("height-change", boxHeight.value)
 return boxHeight.value
}

const expand = () => setHeight(maxHeight.value)
const collapse = () => setHeight(minHeight.value)
const toggle = (expanded: boolean) => expanded ? collapse() : expand()

function onTouchMove(e:any) {
 console.log('onTouchMove')
 if (startY.value === 0) {
  startY.value = e.changedTouches[0].clientY
  return
 }
 const diff = startY.value - e.changedTouches[0].clientY
 setHeight(boxHeight.value + diff)

 startY.value = e.changedTouches[0].clientY
}
const handleTouchMove = myThrottle(onTouchMove, 100)
// 监听高度变化并添加过渡效果
let timeoutId:number

watch(boxHeight, () => {
 clearTimeout(timeoutId)
 timeoutId = setTimeout(() => {
  boxHeight.value = clampHeight(boxHeight.value)
 }, 10)
})

defineExpose({
 boxHeight,
 setHeight,
 expand,
 collapse,
 toggle
})
</script>
<style scoped>
.container {
 width: 100vw;
 background-color: transparent;
 transition: height 0.2s ease-in-out;
}
.content{
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>
