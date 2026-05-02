<template>
	<gui-page :customHeader="true" :customFooter="true">
		<template v-slot:gHeader>
			<view
				style="height: 44px; position: relative; z-index: 999;"
				class="gui-flex animate-fade-up home-top-bar"
				:class="[headerSolid ? 'home-top-bar-solid' : 'home-top-bar-transparent']">
				<view class="gui-p-15 gui-flex1" @click="handleSearchOnClick">
					<gui-search :customClass="['glass-search-bar']"></gui-search>
				</view>
<!--				<view class="gui-flex gui-row gui-wrap gui-align-items-center">-->
<!--					<text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black4 gui-m-r-10">&#xe69e;</text>-->
<!--					<text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black4">&#xe6c7;</text>-->
<!--				</view>-->
				<view style="width: 200rpx"></view>
			</view>
		</template>

		<template v-slot:gFixedTop>
			<!--			一级导航-->
			<view
				class="gui-flex gui-m-b-20 animate-fade-up home-nav-bar"
				:class="[headerSolid ? 'home-nav-bar-solid' : 'home-nav-bar-transparent']"
				style="animation-delay: 0.1s; position: relative; z-index: 998;">
				<view class="gui-bg-white gui-dark-bg-level-3 gui-p-r-20" style="border-radius: 0 0 40rpx 40rpx; width: 100%; background: transparent !important;">
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
						activeColor="#1677ff"
						color="#666666"
						:activeLineClass="['top-nav-active-line']"
						:width="750">
					</gui-switch-navigation>
				</view>
			</view>
		</template>

		<template v-slot:gBody>
			<!-- 顶部唯美渐变氛围背景 -->
			<view class="home-decor-bg"></view>
			
			<!--			吸顶间隔-->
			<view style="height:88rpx;"></view>
			<!--			轮播图-->
			<view class="gui-margin animate-fade-up banner-container" style="animation-delay: 0.2s;">
				<gui-swiper
					:swiperItems="swiperItems"
					:width="690"
					:height="330"
					:spacing="0"
					:padding="0"
					:indicatorActiveWidth="38"
					:duration="300"
					imgMode="widthFix"
					borderRadius="24rpx"></gui-swiper>
			</view>
			<!--			二级导航-->
			<view class="animate-fade-up" style="animation-delay: 0.3s;">
				<SecondaryClassificationNav
					v-if="navItems.length"
					:navData="category3NavItems"
					:category1Name="navItems[category1NavIndex].name"
					:category1Id="navItems[category1NavIndex].id"></SecondaryClassificationNav>
			</view>
			<!--			商品模块-->
			<GoodsCard
				v-for="(item,index) in category1IdData"
				:goodsData="item"
				:index="index"
				:key="index">
			</GoodsCard>

			<!-- 底部安全区占位，防止被底部导航栏遮挡 -->
			<view style="height: 180rpx;"></view>
		</template>

		<template v-slot:gFooter>
			<BottomNav></BottomNav>
		</template>
	</gui-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch,watchEffect } from "vue"
import { onPageScroll } from "@dcloudio/uni-app"
import { courseService } from "../../api"
import { recursionTree } from "../../utils/utils"
import { CategoryTreeInterface, CategoryTreePropsInterface, ChannelInterface } from "../../api/category/interfaces"
const swiperItems = ref([
	{
		img: '../../static/carousel/ChatGPT Image 2026年5月2日 11_22_20.png',
		url: '',
		title: '测试标题 001',
		opentype: 'navigate'
	},
	{
		img: '../../static/carousel/ChatGPT Image 2026年5月2日 11_06_26.png',
		url: '',
		title: '测试标题 002',
		opentype: 'navigate'
	},
	{
		img: '../../static/carousel/ChatGPT Image 2026年5月2日 11_07_41.png',
		url: '',
		title: '测试标题很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
		opentype: 'navigate'
	}
]);
// 当前一级分类导航索引
const category1NavIndex = ref(0);
// 一级分类下商品数据
const category1IdData = ref<ChannelInterface[]>([]);
// 分类导航数据
const navItems = ref<CategoryTreePropsInterface[]>([]);
const category3NavItems = ref<CategoryTreePropsInterface[]>([]);

const headerSolid = ref(false)

// 监视一级分类索引变化
watchEffect(() => {
	if(navItems.value.length){
		// 一级索引变化时，获取一级分类下商品数据
		getCategory1IdDataInfo(navItems.value[category1NavIndex.value].id)
		// 通过监视当前当行索引来动态请求三级导航
		getCategory3NavItems(navItems.value[category1NavIndex.value].id)
	}
})

/* 方法 */
// 搜索组件被点击
const handleSearchOnClick = () => {
	console.log('handleSearchOnClick')
	uni.navigateTo({
		url: `/pages/search/search`
	})
}
// 获取导航数据
const getCategoryList = async () => {
	try {
		const res = await courseService.getAllCategory()
		recursionTree(res.data, "name", "categoryName", "categoryChild")
		recursionTree(res.data, "id", "categoryId", "categoryChild")
		recursionTree(res.data, "children", "categoryChild")
		navItems.value =  (res.data as unknown) as CategoryTreePropsInterface[]
	} catch (error) {
		console.log(error)
	}
}
// 获取频道页数据
const getCategory1IdDataInfo = async (id:number | string) => {
	try {
		const res = await courseService.getCategory1IdData(id)
		category1IdData.value = res.data
	} catch (error) {
		console.log(error)
	}
}
// 获取一级分类下置顶到频道页的三级分类列表
async function getCategory3NavItems (id:number | string){
	try {
		const res = await courseService.getCategory1IdTopList(id)
		category3NavItems.value = res.data
	} catch (error) {
		console.log(error)
	}
}
// 一级分类导航切换
const category1NavChange = (index: number) => {
	category1NavIndex.value = index
}


/* 生命周期 */
onMounted(() => {
	getCategoryList()
});

onPageScroll((e) => {
	headerSolid.value = e.scrollTop >= 20
})
</script>
<style lang="scss" scoped>
.home-decor-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 600rpx;
	background: linear-gradient(180deg, #e3f2fd 0%, #f8f9fa 100%);
	z-index: 0;
	border-bottom-left-radius: 20%;
	border-bottom-right-radius: 20%;
}

.home-top-bar {
	transition: background 350ms ease, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(0px);
	-webkit-backdrop-filter: blur(0px);
}
.home-top-bar-solid {
	background: rgba(255, 255, 255, 0.92);
	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);
}
.home-top-bar-transparent {
	background: rgba(255, 255, 255, 0.35);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}
.home-nav-bar {
	transition: background 350ms ease, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease;
}
.home-nav-bar-solid {
	background: rgba(255, 255, 255, 0.92);
	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);
}
.home-nav-bar-transparent {
	background: rgba(255, 255, 255, 0.55);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

/* 修复轮播图溢出和圆角 */
.banner-container {
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
	transform: translateZ(0); /* 强制开启硬件加速，解决圆角在部分机型失效的问题 */
	position: relative;
	z-index: 1;
	background: transparent;
	width: 690rpx;
	margin: 0 auto;
}

/* 一级分类导航优化 */
::v-deep .gui-nav-item {
	transition: all 0.3s ease-out;
}
::v-deep .gui-nav-item:hover .gui-nav-item-title {
	color: #333 !important;
	transform: translateY(-2rpx);
}
::v-deep .gui-nav-item-active .gui-nav-item-title {
	transform: translateY(-4rpx) scale(1.05);
	font-weight: bold;
}
::v-deep .top-nav-active-line {
	background: #1677ff !important;
	height: 4rpx !important;
	border-radius: 2rpx;
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
