<template>
<uni-card padding="0" :border="false" margin="0" :is-shadow="false">
  <view class="rank-card-touch-area" :class="variantClass" @tap="handleGoToDetails">
    <view class="gui-card-body gui-flex gui-rows gui-nowrap">
      <view v-if="rankIndex" class="rank-badge-inner" :class="badgeClass(rankIndex)">{{ rankIndex }}</view>
      <text class="pay-type-pill" :class="variant === 'search' ? 'pay-type-pill-search' : 'pay-type-pill-default'">{{ getNameByValue(PAY_TYPE,data.payType) }}</text>
      <view class="cover-wrapper">
        <image
          mode="aspectFit"
          :src="data.coverUrl"
          class="gui-card-img"></image>
      </view>
      <view class="gui-card-desc">
        <view class="gui-flex gui-rows gui-nowrap gui-align-items-center">
<!--          <view-->
<!--            class="gui-primary-text gui-text-small gui-color-orange1 finished-flag">-->
<!--            {{getNameByValue(FINISH_TYPE,data.isFinished)}}-->
<!--          </view>-->
          <uni-icons
            v-if="data.isFinished === '1'"
            custom-prefix="iconfont"
            type="wanjie"
            color="#ff6e40"
            class="gui-m-r-5"
            size="25"></uni-icons>
          <view class="gui-card-name gui-primary-text">
            <rich-text v-if="showRichTitle" :nodes="replaceTitle(data.albumTitle)"></rich-text>
            <text v-else class="gui-card-title-text">{{ data.albumTitle }}</text>
          </view>
        </view>
        <!-- 副标题-->
        <view class="gui-flex gui-rows gui-nowrap gui-align-items-center gui-m-t-5 gui-card-intro-row">
          <text
            class="gui-primary-text gui-text-small gui-color-gray gui-card-intro">
            {{data.albumIntro }}
          </text>
        </view>
        <view class="gui-flex gui-rows gui-nowrap gui-align-items-center gui-m-t-10 gui-card-meta">
          <view v-if="variant === 'search'" class="gui-card-meta-item gui-card-meta-item-author">
            <uni-icons custom-prefix="iconfont" type="shengyin_o" class="gui-m-r-10"></uni-icons>
            <text>{{ data.announcerName || '佚名主播' }}</text>
          </view>
          <view class="gui-m-r-20 gui-card-meta-item">
            <uni-icons custom-prefix="iconfont" type="shengyin_o" class="gui-m-r-10"></uni-icons>
            <text>{{ data.includeTrackCount}}集</text>
          </view>
          <view class="gui-m-r-20 gui-card-meta-item">
            <uni-icons custom-prefix="iconfont" type="erji" class="gui-m-r-10"></uni-icons>
            <text>{{ data.playStatNum}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</uni-card>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue"
import { SearchItemInterface } from "../../api/search/interfaces"
import { PAY_TYPE } from "../../utils/constant"
import { getNameByValue } from "../../utils/utils"
const props = defineProps({
  data: {
    type: Object as PropType<SearchItemInterface>,
    required: true,
    default: () => {}
  },
  rankIndex: {
    type: Number,
    default: 0
  },
  variant: {
    type: String,
    default: 'default'
  }
})

const badgeClass = (idx:number) => {
	if (idx === 1) return 'rank-badge-top1'
	if (idx === 2) return 'rank-badge-top2'
	if (idx === 3) return 'rank-badge-top3'
	return 'rank-badge-normal'
}

const showRichTitle = /<font/i.test(props.data.albumTitle || '')
const variantClass = props.variant === 'search' ? 'search-result-card' : 'default-result-card'

/* 响应式数据 */
// 分类导航

/* 方法 */
const handleGoToDetails = () => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${props.data.id}`
  })
}
// 标题高亮正则替换兼容小程序
const replaceTitle = (title: string) => {
  // 假设要替换的字符串为 str，颜色值为 color
  return title.replace(/<font color='(.+?)'>/gi, "<font style=\"color:$1\">");

}
/* 生命周期 */
</script>

<style lang="scss" scoped>
.search-result-item {
  width: 100%;
  box-sizing: border-box;
}
.default-result-card {
  margin-top: 12rpx;
}
.search-result-card {
  position: relative;
  padding: 18rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(31, 41, 55, 0.05);
}
.cover-wrapper {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f7fb;
}

@keyframes breathBadge {
  0% { opacity: 0.85; }
  50% { opacity: 1; box-shadow: 0 0 10rpx rgba(255, 107, 129, 0.4); }
  100% { opacity: 0.85; }
}
.rank-badge-inner {
  position: absolute;
  left: -12rpx;
  top: -12rpx;
  z-index: 3;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 24rpx;
  box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.15);
  transition: transform 0.25s ease;
}
.search-result-item:hover .rank-badge-inner {
  transform: scale(1.15) rotate(-5deg);
}

.rank-badge-top1 { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
.rank-badge-top2 { background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%); color: #333; }
.rank-badge-top3 { background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); color: #333; }
.rank-badge-normal { background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); }

/* 卡片视图 */
.gui-card-body{
  position: relative;
  align-items: center;
  padding: 8rpx 6rpx 10rpx;
  min-width: 0;
}
.search-result-card .gui-card-body {
  padding: 0;
  align-items: flex-start;
}
.search-result-card .cover-wrapper {
  width: 140rpx;
  height: 140rpx;
  border-radius: 18rpx;
  background: #f1f4f8;
}
.pay-type-pill {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84rpx;
  height: 40rpx;
  padding: 0 12rpx;
  border-radius: 16rpx 0 16rpx 0;
  font-size: 17rpx;
  font-weight: 700;
  color: #fff;
}
.pay-type-pill-default {
  background: linear-gradient(135deg, #ff7c70 0%, #ff6e40 100%);
  animation: breathBadge 2s ease-in-out infinite;
}
.pay-type-pill-search {
  background: linear-gradient(135deg, #63a0ff 0%, #4d8dff 100%);
  box-shadow: none;
}
.gui-card-img{
  width:100%;
  height:100%;
  display: block;
}
.gui-card-desc{
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
  padding-right: 8rpx;
}
.search-result-card .gui-card-desc {
  margin-left: 18rpx;
  padding-right: 0;
}
.gui-card-name{
  flex: 1;
  min-width: 0;
  margin-right: 8rpx;
  font-size: 26rpx;
  line-height: 1.5;
  font-weight: 600;
  color: #1f2937;
}
.search-result-card .gui-card-name {
  font-size: 31rpx;
  line-height: 1.34;
  font-weight: 700;
  color: #1e293b;
}
.gui-card-title-text {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-all;
}
.gui-card-name :deep(div),
.gui-card-name :deep(span),
.gui-card-name :deep(font) {
  display: inline;
  font-size: inherit;
  line-height: inherit;
  word-break: break-all;
}
.gui-card-intro-row {
  min-width: 0;
}
.gui-card-intro {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5;
  word-break: break-all;
}
.search-result-card .gui-card-intro {
  margin-top: 4rpx;
  color: #8a94a6 !important;
  line-height: 1.5;
}
.gui-card-meta {
  flex-wrap: wrap;
  row-gap: 8rpx;
}
.search-result-card .gui-card-meta {
  margin-top: 16rpx !important;
  row-gap: 10rpx;
}
.gui-card-meta-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #6b7280;
  font-size: 22rpx;
}
.search-result-card .gui-card-meta-item {
  padding: 8rpx 16rpx;
  margin-right: 10rpx;
  border-radius: 999rpx;
  color: #6b7280;
  font-size: 19rpx;
  background: #f3f5f8;
}
.search-result-card .gui-card-meta-item-author {
  max-width: 100%;
}
</style>
