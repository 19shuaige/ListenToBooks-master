<template>
	<z-paging
		ref="zPagingRef"
		v-model="pageData[pageData.currentPageNav].list"
		@query="getListInfo"
		:paging-style="{ background: '#F4F7FD' }"
		show-refresher-update-time
		auto-show-back-to-top>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
		<template #top>
			<!-- 分类导航 -->
			<view class="fund-top-wrap">
				<gui-switch-navigation
					textAlign="center"
					:isCenter="true"
					activeDirection="center"
					:size="0"
					:margin="0"
					padding="26rpx"
					activeLineHeight="6rpx"
					activeLineWidth="54rpx"
					:currentIndex="pageData.currentIndex"
					:items="navItems"
					@change="(index)=>navChange(index,navItems[index].id)"
				></gui-switch-navigation>
			</view>
		</template>
		<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
		<!--			专辑列表Item-->
		<view class="fund-record-card"
					v-for="(item,index) in pageData[pageData.currentPageNav].list"
					:key="item.id">
			<view class="fund-record-main">
				<view class="fund-record-left">
					<view class="fund-record-icon" :class="pageData.currentPageNav === navItems[0].id ? 'fund-record-icon-invest' : 'fund-record-icon-consume'">
						{{ pageData.currentPageNav === navItems[0].id ? '充' : '支' }}
					</view>
					<view class="fund-record-content">
						<text class="gui-ellipsis custom-title">{{ item.title }}</text>
						<text class="fund-record-time">{{ item.createTime }}</text>
					</view>
				</view>
				<view class="fund-record-right">
					<text class="fund-record-amount" :class="pageData.currentPageNav === navItems[0].id ? 'fund-record-amount-invest' : 'fund-record-amount-consume'">
						{{ pageData.currentPageNav === navItems[0].id ? `+${item.amount}` : `-${item.amount}`}}元
					</text>
					<text class="fund-record-status">交易完成</text>
				</view>
			</view>
		</view>

	</z-paging>

</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"
import GuiSelectMenu from "../../Grace6/components/gui-select-menu.vue"
import { order } from "../../api"
/* 响应式数据 */
const zPagingRef = ref<InstanceType<typeof ZPaging>>()
const props = defineProps({
		id: {
			type: String,
			default: "invest"
		}
	}
)

// 分类导航
const navItems = ref([
	{ name: "充值记录", id: 'invest'},
	{ name: "消费记录", id: 'consume'},
])
// 定义页面数据
const pageData = reactive({
	currentPageNav:'invest',
	currentIndex: 0, // 控制索引显示
	// 充值记录
	invest: {
		// 列表
		list: [],
	},
	// 消费记录
	consume: {
		// 列表
		list: []
	}
})
// 分类导航

/* 方法 */
// 导航切换
const navChange = (index: number,navItemId:string) => {
	pageData.currentPageNav = navItemId
	pageData.currentIndex = index
	// 当切换tab或搜索时请调用组件的reload方法
	zPagingRef.value.reload()
	console.log('navChange',index,navItemId)
}

// 获取列表数据
const getListInfo = async (page: number, limit: number) => {
	//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
	//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
	//模拟请求服务器获取分页数据，请替换成自己的网络请求
	const params = {
		page: page,
		limit: limit
	}
	try {
		if (pageData.currentPageNav === 'invest') {
			// 充值记录
			const res = await order.getInvestRecordList(params)
			//将请求的结果数组传递给z-paging
			zPagingRef.value.complete(res.data.records);
		} else if (pageData.currentPageNav === 'consume') {
			// 消费记录
			const res = await order.getConsumeRecordList(params)
			//将请求的结果数组传递给z-paging
			zPagingRef.value.complete(res.data.records);
		}
	} catch (error) {
		console.log(error)
		zPagingRef.value.complete(false);
	}
}
/* 生命周期 */
onMounted(() => {
	if (props.id === 'invest') {
		pageData.currentPageNav = 'invest'
		pageData.currentIndex = 0
	} else if (props.id === 'consume') {
		pageData.currentPageNav = 'consume'
		pageData.currentIndex = 1
	}
})
</script>

<style lang="scss">
.fund-top-wrap {
	padding: 18rpx 24rpx 12rpx;
	background: linear-gradient(180deg, #f4f7fd 0%, #f0f4fd 100%);
}
.fund-record-card {
	margin: 0 24rpx 20rpx;
	padding: 24rpx;
	border-radius: 28rpx;
	background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
	box-shadow: 0 12rpx 36rpx rgba(53, 88, 168, 0.08);
	border: 1rpx solid rgba(92, 137, 230, 0.08);
}
.fund-record-main {
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 20rpx;
}
.fund-record-left {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
}
.fund-record-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 700;
	flex-shrink: 0;
}
.fund-record-icon-invest {
	color: #4d7ef1;
	background: rgba(77, 126, 241, 0.12);
}
.fund-record-icon-consume {
	color: #ff6676;
	background: rgba(255, 102, 118, 0.12);
}
.fund-record-content {
	flex: 1;
	min-width: 0;
	margin-left: 18rpx;
}
.custom-title{
	display: block;
	width: 100%;
	font-size: 28rpx;
	font-weight: 700;
	color: #24304a;
}
.fund-record-time {
	display: block;
	margin-top: 10rpx;
	font-size: 22rpx;
	color: #96a0b4;
}
.fund-record-right {
	flex-shrink: 0;
	text-align: right;
}
.fund-record-amount {
	display: block;
	font-size: 30rpx;
	font-weight: 700;
}
.fund-record-amount-invest {
	color: #4d7ef1;
}
.fund-record-amount-consume {
	color: #ff6676;
}
.fund-record-status {
	display: block;
	margin-top: 10rpx;
	font-size: 22rpx;
	color: #96a0b4;
}

</style>
