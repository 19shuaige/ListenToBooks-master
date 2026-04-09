<template>
  <view class="gui-margin-top gui-flex gui-row gui-space-between gui-m-l-20 gui-m-r-20 animate-fade-up" :style="{ animationDelay: `${index * 0.1 + 0.3}s` }">
    <!--  主标题-->
    <view
      class="gui-bold gui-block gui-dark-bg-level-3 gui-color-drak gui-flex gui-row gui-align-items-center gui-justify-content-center">
      <text class="gui-m-r-10" style="font-size: 34rpx; font-weight: 800;">{{ goodsData.baseCategory3.name }}</text>
    </view>
    <!--   查看全部-->
    <view @click="handleViewAll" class="gui-dark-bg-level-3 gui-color-gray gui-flex">
      <text class="gui-text-small">查看全部</text>
      <text class="gui-icons gui-block gui-color-drak">&#xe601;</text>
    </view>
  </view>
  <!-- 副标题-->

  <!-- <view class="gui-m-l-20"><text class="gui-text-small gui-color-gray">精选近期收听热度高的主题书籍</text></view>-->

  <view class="goods-list-container">
    <view
      class="gui-product soft-card animate-fade-up product-hover"
      hover-class="gui-tap"
      v-for="(item, idx) in goodsData.list"
      :key="idx"
      :style="{ animationDelay: `${index * 0.1 + idx * 0.05 + 0.4}s` }"
      @tap="gotoGoodInfo(idx, item)">
      <view class="gui-relative image-container">
        <text class="gui-absolute-lt tag-label premium-badge gui-p-l-10 gui-p-r-10 gui-text-small gui-color-white">{{ payTypeMap[item.payType] }}</text>
        <view class="gui-flex gui-absolute-lb play-count-mask gui-p-l-10 gui-p-r-10 gui-text-small gui-color-white gui-p-t-10 gui-p-b-10 gui-p-l-20 gui-p-r-20">
          <text class="gui-icons gui-block gui-color-white gui-m-r-5 gui-p-t-5">&#xe649;</text>
          <text>{{ item.playStatNum }}</text>
        </view>
        <image class="product-image" mode="aspectFill" :src="item.coverUrl"></image>
      </view>
      <view class="gui-product-lines gui-p-10">
        <text class="gui-product-name gui-primary-text">{{ item.albumTitle }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue"
import { ChannelInterface, GoodsInterface } from "../../api/category/interfaces"
import { PAY_TYPE } from "../../utils/constant"

const props = defineProps({
  goodsData: {
    type: Object as PropType<ChannelInterface>,
    required: true,
    default: () => ({} as ChannelInterface),
  },
  index: {
    type: Number,
    default: 0
  }
})
/* 响应式数据 */
// 收费类型
const payTypeList = ref(PAY_TYPE)
// 计算收费类型的key：value对应值
const payTypeMap = computed(() => {
  const map: {[key:string]:string} = {}
  payTypeList.value.forEach((item) => {
    map[item.value] = item.name
  })
  return map
})

// 分类导航

/* 方法 */
// 点击去商品详情页
const gotoGoodInfo = (index: number, item: GoodsInterface) => {
  console.log(index, item)
  // 跳转到专辑详情页
  uni.navigateTo({
    url: `/pages/detail/detail?id=${item.id}`,
  })
}
// 查看全部
const handleViewAll = () => {
  console.log("查看全部")
  // 去往分类搜索搜索
  uni.navigateTo({
    url: `/pages/search/search?category1Id=${props.goodsData.list[0].category1Id}&category2Id=${props.goodsData.list[0].category2Id}&category3Id=${props.goodsData.list[0].category3Id}&pageTitle=${props.goodsData.baseCategory3.name}`
  })
}

/* 生命周期 */
</script>

<style lang="scss" scoped>
.goods-list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20rpx 30rpx;
  gap: 20rpx;
}
.gui-product {
  width: calc((100% - 40rpx) / 3); /* 一行三列，减去两个 gap */
  overflow: hidden;
  background: #ffffff;
}
.image-container {
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  width: 100%;
  height: 216rpx; /* 强制等高，适应三列宽度 */
}
.product-image {
  width: 100%;
  height: 100%;
}
.tag-label {
  border-bottom-right-radius: 16rpx;
  font-weight: bold;
  z-index: 2;
}
.play-count-mask {
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%) !important;
  width: 100%;
  box-sizing: border-box;
  z-index: 2;
}
.product-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.product-hover:active {
  transform: scale(0.94);
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.1) !important;
}
.gui-product-lines {
  margin-top: 5rpx;
}
.gui-product-name {
  font-size: 26rpx;
  line-height: 36rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 72rpx; /* 保证两行高度一致，防止卡片高度不一错位 */
}
</style>
