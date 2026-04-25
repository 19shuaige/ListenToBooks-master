<template>
  <gui-page :customFooter="true" :customHeader="true">
    <template v-slot:gHeader>
      <view
        style="height: 44px; position: relative; z-index: 999;"
        class="gui-flex rank-top-bar"
        :class="[headerSolid ? 'rank-top-bar-solid' : 'rank-top-bar-transparent']">
        <view class="gui-flex gui-row gui-wrap gui-align-items-center gui-m-l-20">
          <text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1 gui-m-r-10"
          >&#xe666;</text
          >
          <text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1 gui-m-r-10"
          >&#xe67b;</text
          >
          <text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1">&#xe613;</text>
        </view>
        <view style="width: 200rpx"></view>
      </view>
    </template>

    <template v-slot:gFixedTop>
			<!-- 一级导航 -->
			<view class="gui-flex gui-m-b-20 rank-nav-bar" :class="[headerSolid ? 'rank-nav-bar-solid' : 'rank-nav-bar-transparent']" style="position: relative; z-index: 998;">
				<view class="gui-bg-white gui-dark-bg-level-3 gui-p-r-20" style="background: transparent !important; width: 100%; border-radius: 0 0 40rpx 40rpx;">
					<gui-switch-navigation
						:items="navItems"
						:currentIndex="category1NavIndex"
						@change="category1NavChange"
						textAlign="center"
						:isCenter="true"
						activeDirection="center"
						:size="0"
						:margin="10"
						padding="30rpx"
						activeLineHeight="4rpx"
						:width="750">
					</gui-switch-navigation>
				</view>
			</view>
		</template>

    <template v-slot:gBody>
      <view class="rank-decor-bg"></view>
      <view style="height:88rpx;"></view>
      <!-- 左侧导航 -->
      <view class="gui-wrapper">
        <view class="gui-menu-wrap">
          <scroll-view
            scroll-y
            scroll-with-animation
            class="gui-tab-view menu-scroll-view"
            :scroll-top="scrollTop"
          >
            <view
              v-for="(item, index) in tabbarItems"
              :key="index"
              class="gui-tab-item"
              :class="[dimension == item.dimension && 'gui-tab-item-active']"
              @tap.stop="switchMenu(item.dimension)"
            >
              <text class="rank-dimension-text">{{ item.name }}</text>
            </view>
          </scroll-view>
          <scroll-view
          scroll-y
          :enhanced="true"
          :show-scrollbar="false"
          class="gui-right-box"
          @scroll="handleBodyScroll"
          >
            <view v-if="rankList">
              <view
                v-for="(item, idx) in rankList"
                :key="`${rankRenderSeed}-${item.id}`"
                class="rank-item-wrap"
                :class="{ 'rank-item-enter': idx < 5 }"
                :style="{ animationDelay: `${Math.min(idx, 4) * 0.05}s` }"
              >
                <SearchResultsItem :data="item" :rankIndex="idx + 1" />
              </view>
            </view>

            <ZPagingEmptyView v-else/>
          </scroll-view>
        </view>
      </view>
    </template>

    <template v-slot:gFooter>
			<BottomNav></BottomNav>
		</template>
  </gui-page>
</template>

<script setup lang="ts">
import { ref,watchEffect, onMounted } from "vue"
import { courseService, albumsService } from "../../api"
import { 
  CategoryTreePropsInterface,
} from "../../api/category/interfaces"
import { recursionTree } from "../../utils/utils"
import SearchResultsItem from "../../components/SearchResultsItem/SearchResultsItem.vue"
import ZPagingEmptyView from "../../uni_modules/z-paging/components/z-paging-empty-view/z-paging-empty-view.vue"

// 当前一级分类导航索引
const category1NavIndex = ref(0);
// 一级分类id
const category1Id = ref()
// 排行榜数据
const rankList = ref([])
const rankRenderSeed = ref(0)
// 分类导航数据
const navItems = ref<CategoryTreePropsInterface[]>([]);

// 侧边栏数据
const tabbarItems = [
  { name: '热度', dimension: 'hotScore'},
  { name: '播放量', dimension: 'playStatNum'},
  { name: '订阅量', dimension: 'subscribeStatNum'},
  { name: '购买量', dimension: 'buyStatNum'},
  { name: '评论数', dimension: 'albumCommentStatNum'},
]

let scrollTop = ref(0) // tab标题的滚动条位置
let dimension = ref('hotScore') // 预设当前项的值

const headerSolid = ref(false)

// 监视一级分类索引变化
watchEffect(() => {
	if(navItems.value.length){
		// 一级索引变化时，获取一级分类下商品数据
		// getCategory1IdDataInfo(navItems.value[category1NavIndex.value].id)
	}
})

const switchMenu = (current:string) => {
  if (current === dimension.value) {
    return;
  }
  // 请求数据
  dimension.value = current
  getRankList()
}

const handleBodyScroll = (e:any) => {
	headerSolid.value = (e?.detail?.scrollTop || 0) >= 20
}

const badgeClass = (idx:number) => {
	if (idx === 0) return 'rank-badge-top1'
	if (idx === 1) return 'rank-badge-top2'
	if (idx === 2) return 'rank-badge-top3'
	return 'rank-badge-normal'
}


// 获取一级分类导航数据
const getCategoryList = async () => {
	try {
		const res: any = await courseService.getAllCategory()
    recursionTree(res.data, "name", "categoryName", "categoryChild")
		recursionTree(res.data, "id", "categoryId", "categoryChild")
		recursionTree(res.data, "children", "categoryChild")
    category1Id.value = res.data[0].id
		navItems.value =  (res.data as unknown) as CategoryTreePropsInterface[]
    // 获取排行榜数据
    getRankList()
	} catch (error) {
		console.log(error)
	}
}

/**
 * @description: 获取排行榜列表
 * @returns {*}
 */
const getRankList = async () => {
  const res: any = await albumsService.getRankingList(category1Id.value, dimension.value)
  rankList.value = res.data
  rankRenderSeed.value += 1
}
 
// 一级分类导航切换
const category1NavChange = (index: number) => {
	category1NavIndex.value = index
  category1Id.value = navItems.value[index].id
  getRankList()
}

/* 生命周期 */
onMounted(() => {
	getCategoryList()
});

</script>

<style scoped lang="scss" >
.rank-decor-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 520rpx;
  background: linear-gradient(180deg, #eaf4ff 0%, #f6f6f6 100%);
  z-index: 0;
  border-bottom-left-radius: 20%;
  border-bottom-right-radius: 20%;
}

.rank-top-bar {
  transition: background 350ms ease, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease;
}
.rank-top-bar-transparent {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.rank-top-bar-solid {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
.rank-nav-bar {
  transition: background 350ms ease, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease;
}
.rank-nav-bar-transparent {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.rank-nav-bar-solid {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.gui-wrapper {
  // height: calc(100vh);
  /* #ifdef H5 */
  // height: calc(100vh - var(--window-top));
  /* #endif */
  display: flex;
  flex-direction: column;
}

.gui-menu-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.gui-tab-view {
  width: 200rpx;
  height: 100%;
  background-color: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.gui-tab-item {
  height: 92rpx;
  background: transparent;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10rpx 10rpx 0;
  padding: 0 18rpx 0 22rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #5f6b7a;
  font-weight: 500;
  line-height: 1;
  transition: background-color 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.rank-dimension-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gui-tab-item-active {
  position: relative;
  color: #1f2937;
  font-weight: 600;
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(243,248,255,0.98) 100%);
  box-shadow: 0 10rpx 22rpx rgba(31, 41, 55, 0.06);
  border: 1rpx solid rgba(22, 119, 255, 0.1);
}

.gui-tab-item-active::before {
  content: "";
  position: absolute;
  left: 12rpx;
  top: 50%;
  transform: translateY(-50%);
  height: 42rpx;
  width: 6rpx;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #66a9ff 0%, #1677ff 100%);
}

.gui-tab-item-active::after {
  display: none;
}

.gui-tab-view {
  height: 100%;
}

.gui-right-box {
  background-color: transparent;
  padding: 10rpx 20rpx;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.rank-item-wrap {
  position: relative;
  margin-bottom: 16rpx;
  border-radius: 24rpx;
}
@keyframes rankItemEnter {
  from {
    opacity: 0;
    transform: translateY(14rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.rank-item-enter {
  opacity: 0;
  animation: rankItemEnter 0.22s ease-out forwards;
  border-radius: 24rpx;
}


.gui-page-view {
  padding: 16rpx;
}

.gui-class-item {
  margin-bottom: 30rpx;
  //background-color: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
}

.gui-class-item:last-child {
  min-height: 100vh;
}

.gui-item-title {
  font-size: 26rpx;
  color: gray;
  font-weight: bold;
}

.gui-item-menu-name {
  font-weight: normal;
  font-size: 30rpx;
}

.gui-item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.gui-thumb-box {
  width: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 80rpx;
  padding: 30rpx 10rpx;
  background-color: #fff;
  border-radius: 8rpx;
  color: rgba(0, 0, 0, 0.65);
}
</style>
