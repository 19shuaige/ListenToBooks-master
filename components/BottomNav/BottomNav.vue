<template>
 <!-- 普通模式 -->
 <view style="padding-top: 50rpx" class="gui-relative bottom-nav-container animate-nav-in">
  <gui-flex :customClass="['gui-footer', 'glass-effect']" direction="row" :wrap="false" alignItems="center">
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.05s" @tap="navChange(0)">
    <text :class="[currentIndex == 0 ? 'gui-primary-color' : 'nav-icon-gray', currentIndex == 0 ? 'nav-bounce' : '', 'gui-icons', 'gui-footer-icon-buttons-icon', 'gui-block']">&#xe608;</text>
    <text :class="[currentIndex == 0 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">首页</text>
   </view>
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.1s" @tap="navChange(1)">
   <uni-icons
     type="paperplane"
     :color="currentIndex == 1 ? '#1677ff' : '#9ca3af'"
     :size="22"
     :class="[currentIndex == 1 ? 'nav-bounce' : '', 'gui-footer-icon-buttons-icon', 'gui-block']">
   </uni-icons>
    <text :class="[currentIndex == 1 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">推荐</text>
   </view>
   <view class="gui-footer-icon-buttons"></view>
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.15s" @tap="navChange(3)">
    <text :class="[currentIndex == 3 ? 'gui-primary-color' : 'nav-icon-gray', currentIndex == 3 ? 'nav-bounce' : '', 'gui-icons', 'gui-footer-icon-buttons-icon', 'gui-block', 'iconfont']">
     &#xe6ae;
    </text>
    <text :class="[currentIndex == 3 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">排行榜</text>
   </view>
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.2s" @tap="navChange(4)">
    <text :class="[currentIndex == 4 ? 'gui-primary-color' : 'nav-icon-gray', currentIndex == 4 ? 'nav-bounce' : '', 'gui-icons', 'gui-footer-icon-buttons-icon', 'gui-block']">&#xe6fe;</text>
    <text :class="[currentIndex == 4 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">我的</text>
   </view>
  </gui-flex>
   <view
     class="gui-footer-buttons-ab center-btn nav-item-anim-center"
     :class="{ 'center-btn-active': currentIndex == 2 }"
     style="animation-delay: 0.25s"
     @tap="navChange(2)"
     hover-class="center-btn-hover">
    <view class="center-orbit"></view>
    <view class="center-icon-shell">
     <text
       :class="[
								playerStore.playing ? 'playing' : '',
								currentIndex == 2 ? 'nav-bounce' : '',
								'center-icon',
								'gui-icons',
								'gui-footer-buttons-ab-icon',
								'gui-block'
							]"
     >
      &#xe648;
     </text>
    </view>
    <view class="center-label-shell">
     <text :class="[currentIndex == 2 ? 'gui-primary-color' : 'nav-icon-gray', 'center-label-text']">听专辑</text>
    </view>
   </view>
 </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app"
import { onMounted, ref } from "vue"
import { getCurrentPageInfo } from "../../utils/utils"
import { usePlayerStore } from "../../stores/player"

const playerStore = usePlayerStore()
/* 响应式数据 */
const currentIndex = ref(0);
const isNavigating = ref(false)
let navUnlockTimer: ReturnType<typeof setTimeout> | null = null
const navListInfo = ref([
 {
  index: 0,
  path: "/pages/index/index"
 },
 {
  index: 1,
  path: "/pages/recommend/recommend"
 },
 {
  index: 2,
  path: `/pages/player/player`
 },
 {
  index: 3,
  path: "/pages/rank/rank"
 },
 {
  index: 4,
  path: "/pages/my/my"
 }
])
// 分类导航

/* 方法 */
const syncCurrentIndex = () => {
 const currentPage = getCurrentPageInfo()
 currentIndex.value = navListInfo.value.find((item) => item.path == currentPage.route)?.index || 0
}

// 切换导航
const navChange = (index: number) => {
 if (isNavigating.value) {
  return
 }

 const targetPath = navListInfo.value[index].path
 const currentPage = getCurrentPageInfo()
 if (currentPage.route === targetPath) {
  syncCurrentIndex()
  return
 }

 isNavigating.value = true
 currentIndex.value = index;
 uni.redirectTo({
  url: targetPath,
  success: () => {
   syncCurrentIndex()
  },
  fail: () => {
   isNavigating.value = false
  },
  complete: () => {
   if (navUnlockTimer) {
    clearTimeout(navUnlockTimer)
   }
   navUnlockTimer = setTimeout(() => {
    isNavigating.value = false
    navUnlockTimer = null
   }, 120)
  }
 })
};
/* 生命周期 */
// 挂载时显示正确活动的导航
onMounted(() => {
 syncCurrentIndex()
});
onShow(() => {
 isNavigating.value = false
 syncCurrentIndex()
})
</script>

<style lang="scss" scoped>

.nav-icon-gray {
  color: #9ca3af !important;
}

@keyframes navIn {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-nav-in {
  opacity: 1;
  animation: navIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes navItemPop {
  0% { transform: translateY(20rpx); opacity: 0; }
  60% { transform: translateY(-8rpx); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
.nav-item-anim {
  opacity: 1;
  animation: navItemPop 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes navCenterPop {
  0% { transform: translateY(40rpx) scale(0.8); opacity: 0; }
  60% { transform: translateY(-12rpx) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.nav-item-anim-center {
  opacity: 1;
  animation: navCenterPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes navBounce {
  0% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-10rpx) scale(1.06); }
  100% { transform: translateY(0) scale(1); }
}
.nav-bounce {
  animation: navBounce 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes breatheGlow {
  0% { box-shadow: 0 8rpx 16rpx rgba(22, 119, 255, 0.2); transform: translateY(0); }
  50% { box-shadow: 0 16rpx 28rpx rgba(22, 119, 255, 0.3); transform: translateY(-4rpx); }
  100% { box-shadow: 0 8rpx 16rpx rgba(22, 119, 255, 0.2); transform: translateY(0); }
}
.center-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.center-orbit {
  position: absolute;
  top: 8rpx;
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 150, 255, 0.2) 0%, rgba(64, 150, 255, 0) 72%);
  pointer-events: none;
}
.center-icon-shell {
  position: relative;
  z-index: 2;
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(243, 248, 255, 0.98) 100%);
  box-shadow: 0 12rpx 30rpx rgba(54, 96, 170, 0.12), inset 0 2rpx 0 rgba(255, 255, 255, 0.9);
  border: 2rpx solid rgba(255, 255, 255, 0.95);
}
.center-icon {
  border-radius: 50%;
  width: 104rpx !important;
  height: 104rpx !important;
  line-height: 104rpx !important;
  background: linear-gradient(135deg, #6aa9ff 0%, #1677ff 55%, #4f7cff 100%) !important;
  color: #ffffff !important;
  font-weight: bold;
  border: 6rpx solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 10rpx 26rpx rgba(22, 119, 255, 0.28);
  animation: breatheGlow 2.8s ease-in-out infinite;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease;
}
.center-btn-hover:active .center-icon {
  transform: scale(1.06);
}
.center-label-shell {
  position: relative;
  z-index: 2;
  margin-top: 8rpx;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8rpx 20rpx rgba(31, 41, 55, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.95);
}
.center-label-text {
  display: block;
  font-size: 22rpx;
  line-height: 1.2;
  font-weight: 600;
}
.center-btn-active .center-icon-shell {
  box-shadow: 0 16rpx 34rpx rgba(54, 96, 170, 0.16), inset 0 2rpx 0 rgba(255, 255, 255, 0.95);
}
.center-btn-active .center-label-shell {
  background: rgba(255, 255, 255, 0.96);
}

@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
}
.center-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 72rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.6);
  opacity: 0;
  pointer-events: none;
}
.center-btn:active::after {
  opacity: 1;
  animation: ripple 0.5s ease-out forwards;
}

@keyframes rotation{
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
.playing {
  animation: rotation 6.5s linear infinite;
}
</style>
