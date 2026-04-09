<template>
 <!-- 普通模式 -->
 <view style="padding-top: 50rpx" class="gui-relative bottom-nav-container animate-nav-in">
  <gui-flex :customClass="['gui-footer', 'glass-effect']" direction="row" :wrap="false" alignItems="center">
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.05s" @tap="navChange(0)">
    <text :class="[currentIndex == 0 ? 'gui-primary-color' : 'nav-icon-gray', currentIndex == 0 ? 'nav-bounce' : '', 'gui-icons', 'gui-footer-icon-buttons-icon', 'gui-block']">&#xe608;</text>
    <text :class="[currentIndex == 0 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">首页</text>
   </view>
   <view class="gui-footer-icon-buttons nav-item-anim" style="animation-delay: 0.1s" @tap="navChange(1)">
    <text :class="[currentIndex == 1 ? 'gui-primary-color' : 'nav-icon-gray', currentIndex == 1 ? 'nav-bounce' : '', 'gui-icons', 'gui-footer-icon-buttons-icon', 'gui-block', 'iconfont']">
     &#xe7d5;
    </text>
    <text :class="[currentIndex == 1 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">直播</text>
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
   <view class="gui-footer-buttons-ab center-btn nav-item-anim-center" style="animation-delay: 0.25s" @tap="navChange(2)" hover-class="center-btn-hover">
   <text
     :class="[
							playerStore.playing ? 'playing' : '',
							currentIndex == 2 ? 'nav-bounce' : '',
							'center-icon',
							'gui-footer',
							'gui-icons',
							'gui-footer-buttons-ab-icon',
							'gui-block'
						]"
   >
    &#xe648;
   </text>
   <text :class="[currentIndex == 2 ? 'gui-primary-color' : 'nav-icon-gray', 'gui-icons', 'gui-footer-icon-buttons-text', 'gui-block']">听专辑</text>
  </view>
 </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app"
import { onMounted, ref } from "vue"
import { getCurrentPageInfo } from "../../utils/utils"
import { usePlayerStore } from "../../stores/player"

const playerStore = usePlayerStore()
// 引入路由
const pages = getCurrentPageInfo()
/* 响应式数据 */
const currentIndex = ref(0);
const navListInfo = ref([
 {
  index: 0,
  path: "/pages/index/index"
 },
 {
  index: 1,
  path: "/pages/live/live"
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
// 切换导航
const navChange = (index: number) => {
 currentIndex.value = index;
 uni.navigateTo({
    url: navListInfo.value[index].path
  });
};
/* 生命周期 */
// 挂载时显示正确活动的导航
onMounted(() => {
 console.log('navListInfo.value.find((item) => item.path == pages.route)?.index || 0',navListInfo.value.find((item) => item.path == pages.route)?.index || 0)
 currentIndex.value = navListInfo.value.find((item) => item.path == pages.route)?.index || 0
});
onShow(() => {
 console.log('navListInfo.value.find((item) => item.path == pages.route)?.index || 0',navListInfo.value.find((item) => item.path == pages.route)?.index || 0)
 currentIndex.value = navListInfo.value.find((item) => item.path == pages.route)?.index || 0
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
  animation: navIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes navItemPop {
  0% { transform: translateY(20rpx); opacity: 0; }
  60% { transform: translateY(-8rpx); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
.nav-item-anim {
  opacity: 0;
  animation: navItemPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes navCenterPop {
  0% { transform: translateY(40rpx) scale(0.8); opacity: 0; }
  60% { transform: translateY(-12rpx) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.nav-item-anim-center {
  opacity: 0;
  animation: navCenterPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
}
.center-icon {
  border-radius: 50%;
  width: 112rpx !important;
  height: 112rpx !important;
  line-height: 112rpx !important;
  background: linear-gradient(135deg, #4096ff 0%, #1677ff 100%) !important;
  color: #ffffff !important;
  font-weight: bold;
  border: 4rpx solid #ffffff;
  animation: breatheGlow 2.5s ease-in-out infinite;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.center-btn-hover:active .center-icon {
  transform: scale(1.1) rotate(15deg);
}

@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
}
.center-btn::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 56rpx;
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

