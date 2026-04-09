<template>
 <view class="gui-grid gui-bg-white gui-dark-bg-level-3 soft-card nav-grid-container">
  <view
    v-for="(item, index) in navData"
    :key="index"
    @click="handleNavItemOnClick(item)"
    class="gui-grid-item grid-item-box glass-effect nav-hover animate-pop-up"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
   <text class="gui-grid-text gui-primary-text" style="font-weight: 500;">{{ item.name }}</text>
  </view>
  <view class="gui-grid-item grid-item-box glass-effect nav-hover animate-pop-up all-category-btn"
        :style="{ animationDelay: `${navData.length * 0.1}s` }"
        @click="goToCategoryPage">
   <text class="gui-grid-text all-text">全部</text>
  </view>
 </view>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue"
import { CategoryTreePropsInterface } from "../../api/category/interfaces"
/* 响应式数据 */
const props = defineProps({
 navData: {
  type: Array as PropType<CategoryTreePropsInterface[]>,
  required: true,
  default: []
 },
 category1Id: {
  type: Number || String,
  required: true,
 },
 category1Name: {
  type: String,
  required: true,
 },
})
// 分类导航

/* 方法 */
// 导航被点击
const handleNavItemOnClick = (item:CategoryTreePropsInterface) => {
 console.log('handleNavItemOnClick',item.category2Id)
 // 去往分类搜索搜索
 uni.navigateTo({
  url: `/pages/search/search?category1Id=${props.category1Id}&category2Id=${item.category2Id}&category3Id=${item.id}&pageTitle=${item.name}`
 })
}
const goToCategoryPage = () => {
 uni.navigateTo({
  url: `/pages/categories/categories?category1Id=${props.category1Id}&pageTitle=${props.category1Name}`
 })
}

/* 生命周期 */
</script>

<style lang="scss" scoped>
.nav-grid-container {
 display: flex;
 flex-wrap: wrap;
 justify-content: flex-start;
 padding: 16rpx 20rpx; /* 大幅缩减上下内边距 */
 margin: 0 30rpx;
 gap: 16rpx; /* 调整分类项行间距，使模块更紧凑 */
}

@keyframes popUp {
 0% { transform: translateY(16rpx); opacity: 0; }
 100% { transform: translateY(0); opacity: 1; }
}
.animate-pop-up {
 opacity: 0;
 animation: popUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.grid-item-box {
 width: calc((100% - 32rpx) / 3); /* 每行 3 个，减去 2 个 16rpx 的 gap */
 box-sizing: border-box;
 border-radius: 12rpx; /* 轻微减小圆角以匹配紧凑高度 */
 padding: 14rpx 0; /* 压缩单项高度 */
 display: flex;
 justify-content: center;
 align-items: center;
 background: rgba(0, 0, 0, 0.03); /* 微弱的底色衬托 */
 transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease;
}

.gui-grid-text {
 transition: color 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
 display: inline-block; /* 允许 transform 生效 */
}

.nav-hover {
 transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}
.nav-hover:hover {
 transform: translateY(-4rpx);
 box-shadow: 0 6rpx 12rpx rgba(0,0,0,0.06);
 background-color: rgba(22, 119, 255, 0.04);
}
.nav-hover:hover .gui-grid-text {
 color: #1677ff !important;
 transform: scale(1.05); /* 悬浮时文字轻微放大 */
}
.nav-hover:active {
 transform: scale(0.96); /* 点击时分类项缩放至0.96倍 */
 box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.04);
 transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1); /* 回弹动画更快更干脆 */
}

.all-category-btn {
 position: relative;
 overflow: hidden;
}
.all-text {
 font-weight: bold;
 color: #1677ff;
 position: relative;
 z-index: 2;
 text-shadow: 0 0 8rpx rgba(22, 119, 255, 0.3); /* 柔和外发光 */
}
@keyframes breatheLightLine {
 0% { width: 60%; opacity: 0.5; }
 50% { width: 90%; opacity: 1; box-shadow: 0 0 8rpx 2rpx rgba(22, 119, 255, 0.5); }
 100% { width: 60%; opacity: 0.5; }
}
.all-category-btn::after {
 content: '';
 position: absolute;
 bottom: 6rpx; /* 调整下划线位置以适应更矮的容器 */
 left: 50%;
 transform: translateX(-50%);
 height: 4rpx;
 background: #1677ff;
 border-radius: 4rpx;
 animation: breatheLightLine 2s infinite ease-in-out; /* 平滑呼吸动画 */
}
</style>
