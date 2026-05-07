<template>
 <view class="ts-card-shell">
  <view class="ts-card-row">
   <view @click="handleJump" class="ts-card-cover-wrap">
    <image class="ts-card-cover" mode="aspectFill" :src="data.coverUrl"></image>
   </view>
   <view @click="handleJump" class="ts-card-main">
    <text class="ts-card-title gui-ellipsis">{{ data.trackTitle }}</text>
    <text class="ts-card-subtitle gui-ellipsis">
     {{ mode === 'collect' ? `收藏于：${data.createTime.slice(0, 10)}` : `专辑：${data.albumTitle}` }}
    </text>
    <view class="ts-card-meta">
     <text class="ts-card-chip ts-card-chip-soft">{{ mode === 'collect' ? '声音收藏' : '最近播放' }}</text>
     <template v-if="mode === 'history'">
      <text class="ts-card-meta-text">{{ formatTime(data.mediaDuration) }}</text>
      <text class="ts-card-chip ts-card-chip-warm">已播 {{ data.playRate }}</text>
     </template>
    </view>
   </view>
   <view class="ts-card-action" @click="cancelPopUpRef.open()">
    <uni-icons custom-prefix="iconfont" type="shanchu" class="ts-card-delete" size="15"></uni-icons>
   </view>
  </view>
 </view>
 <uni-popup ref="cancelPopUpRef" type="dialog">
  <uni-popup-dialog
   :type="popSetting.type"
   :cancelText="popSetting.cancelText"
   :confirmText="popSetting.confirmText"
   :title="popSetting.title"
   :content="popSetting.content"
   @confirm="() => handleCancel(mode === 'collect' ? data.trackId as number : data.id as number)"
  ></uni-popup-dialog>
 </uni-popup>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue"
import {
 CollectTrackInterface,
 DialogInterface,
 HistoryTrackInterface,
} from "../../api/albums/interfaces"
import UniPopup from "../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue"
import { formatTime } from "../../utils/utils"
/* 响应式数据 */
const cancelPopUpRef= ref<InstanceType<typeof UniPopup>>()
const props = defineProps({
 // 分类导航
 data:{
  type: Object as PropType<CollectTrackInterface & HistoryTrackInterface>,
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
 mode: {
  type: String,
  default: "collect"
 },
 jumpRoute: {
  type: String,
  required: true,
 }
})
// 分类导航

/* 方法 */
const handleCancel = async (albumId: number | string) => {
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
 uni.navigateTo({
  url: `${props.jumpRoute}?albumId=${props.data.albumId}&trackId=${props.data.trackId}`
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
 flex-wrap: wrap;
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

.ts-card-chip-warm {
 color: #ff8a3d;
 background: rgba(255, 138, 61, 0.12);
}

.ts-card-meta-text {
 font-size: 18rpx;
 color: #9aa4b8;
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
