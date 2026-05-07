<template>
 <view class="ts-card-shell">
  <view class="ts-card-row">
   <view @click="handleJump" class="ts-card-cover-wrap">
    <image class="ts-card-cover" mode="aspectFill" :src="data.coverUrl"></image>
   </view>
   <view @click="handleJump" class="ts-card-main">
    <text class="ts-card-title gui-ellipsis">{{ data.albumTitle }}</text>
    <text class="ts-card-subtitle gui-ellipsis">更新：{{ data.createTime.slice(0, 10) }}</text>
    <view class="ts-card-meta">
     <text class="ts-card-chip ts-card-chip-soft">专辑订阅</text>
     <text v-if="data?.isFinished === '1'" class="ts-card-chip ts-card-chip-danger">完结</text>
    </view>
   </view>
   <view class="ts-card-action" @click="cancelSubscribePopUpRef.open()">
    <uni-icons custom-prefix="iconfont" type="shanchu" class="ts-card-delete" size="15"></uni-icons>
   </view>
  </view>
 </view>
 <uni-popup ref="cancelSubscribePopUpRef" type="dialog">
  <uni-popup-dialog
   :type="popSetting.type"
   :cancelText="popSetting.cancelText"
   :confirmText="popSetting.confirmText"
   :title="popSetting.title"
   :content="popSetting.content"
   @confirm="() => handleCancel(data.albumId)"
  ></uni-popup-dialog>
 </uni-popup>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue"
import { DialogInterface, SubscribeAlbumsInterface } from "../../api/albums/interfaces"
import UniPopup from "../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue"
/* 响应式数据 */
const  cancelSubscribePopUpRef= ref<InstanceType<typeof UniPopup>>()
const props = defineProps({
 // 分类导航
 data:{
  type: Object as PropType<SubscribeAlbumsInterface>,
  required: true,
  default: () => {
   return {}
  }
 },
 deleteItemHandler: {
  type: Function,
  required: true,
  default: () => {}
 },
 handleCancel: {
  type: Function,
  default: () => {}
 },
 popSetting:{
  type: Object as PropType<DialogInterface>,
  required: true,
  default: () => {
   return {
    type: "error",
    title: "注意",
    content: "你确定要取消订阅吗？",
    cancelText: "取消",
    confirmText: "确认"
   } as DialogInterface
  }
 },
 jumpRoute: {
  type: String,
  required: true,
 }
})
// 分类导航

/* 方法 */
const handleCancel = async (albumId: number) => {
 console.log("取消订阅",albumId)
 try {
  const success = await props.handleCancel(albumId)
  if (!success) {
   return
  }
  // 通知父组件删除这个数据
  props.deleteItemHandler(albumId)
 } catch (error) {
 }
}
// 跳转
const handleJump = () => {
 // 如果存在id，拼接id
 let id = props.data.albumId ? `?id=${props.data.albumId}` : ""
 uni.navigateTo({
  url: props.jumpRoute + id
 })
}
// 打开弹窗

/* 生命周期 */
</script>

<style lang="scss" scoped>
.ts-card-shell {
 margin: 0;
 background: #ffffff;
 border-bottom: 1rpx solid rgba(92, 137, 230, 0.08);
}

.ts-card-row {
 display: flex;
 align-items: center;
 padding: 10rpx 12rpx;
 background: #ffffff;
}

.ts-card-cover-wrap {
 width: 88rpx;
 height: 88rpx;
 flex-shrink: 0;
 border-radius: 16rpx;
 overflow: hidden;
 background: #edf3ff;
}

.ts-card-cover {
 width: 88rpx;
 height: 88rpx;
 border-radius: 16rpx;
}

.ts-card-main {
 flex: 1;
 min-width: 0;
 margin: 0 14rpx;
 display: flex;
 flex-direction: column;
 justify-content: center;
}

.ts-card-title {
 display: block;
 font-size: 24rpx;
 line-height: 32rpx;
 font-weight: 600;
 color: #24304a;
}

.ts-card-subtitle {
 display: block;
 margin-top: 6rpx;
 font-size: 20rpx;
 line-height: 26rpx;
 color: #97a1b5;
}

.ts-card-meta {
 display: flex;
 align-items: center;
 gap: 10rpx;
 margin-top: 8rpx;
}

.ts-card-chip {
 padding: 4rpx 12rpx;
 border-radius: 999rpx;
 font-size: 18rpx;
 line-height: 24rpx;
}

.ts-card-chip-soft {
 color: #4e82ea;
 background: rgba(78, 130, 234, 0.1);
}

.ts-card-chip-danger {
 color: #ff5f6d;
 background: rgba(255, 95, 109, 0.1);
}

.ts-card-action {
 width: 42rpx;
 height: 88rpx;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-shrink: 0;
}

.ts-card-delete {
 color: #a4afc6;
}
</style>
