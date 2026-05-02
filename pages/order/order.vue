<template>
	<view class="order-page">
		<z-paging
		ref="zPagingRef"
		:paging-style="{background: '#F4F7FD'}"
		v-model="orders"
		@query="getOrderList"
		show-refresher-update-time
		auto-show-back-to-top
	>
		<!-- 数据展示区域 -->
		<view 
			class="order-card" 
			v-for="(order, oIndex) in orders" 
			:key="oIndex"
			@click="goToDetail(order.orderNo)"
			>
			<view class="order-card-head">
				<view class="order-head-main">
					<text class="order-head-label">订单号</text>
					<text class="order-head-value">{{ order.orderNo }}</text>
				</view>
				<view class="order-status-badge">{{ order.orderStatusName }}</view>
			</view>
			<!-- 循环展示订单 -->
			<view class="order-goods-list" v-for="(shop, indexShop) in order.orderDetailList" :key="indexShop">
				<!-- 循环订单商品 -->
				<view class="order-goods-row">
					<view class="order-goods-img">
						<gui-image :src="shop.itemUrl" :width="108" :height="108"></gui-image>
					</view>
					<view class="order-goods-info">
						<text class="order-goods-name">{{ shop.itemName }}</text>
						<text class="order-goods-desc">有声内容订单</text>
					</view>
					<text class="order-goods-price">￥{{ shop.itemPrice }}</text>
				</view>
			</view>
			<!-- 订单底部 -->
			<view class="order-card-foot">
				<text class="order-foot-date">{{ order.orderDate }}</text>
				<view class="order-foot-amount">
					<text class="order-foot-meta">共{{ order.orderDetailList?.length || 0 }}件</text>
					<text class="order-foot-total">合计 ￥{{order.orderAmount}}</text>
				</view>
			</view>
		</view>
	</z-paging>
	</view>
</template>
<script setup lang="ts">
import { order } from "../../api"
import { ref } from 'vue';
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"
let orders = ref()
const zPagingRef = ref<InstanceType<typeof ZPaging>>()
const getOrderList = async (page:number, limit:number) => {
	const res:any  = await order.queryOrdeList({page, limit})
	zPagingRef.value.complete(res.data.records)
}

const goToDetail = (orderNo: string) => {
	uni.navigateTo({
		url: `/pages/orderDetail/orderDetail?orderNo=${orderNo}`
	})
}
</script>
<style scoped>
.order-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f7f9fe 0%, #f1f5fd 100%);
}
.order-card {
	margin: 24rpx 24rpx 0;
	padding: 26rpx;
	border-radius: 28rpx;
	background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
	box-shadow: 0 12rpx 36rpx rgba(45, 88, 170, 0.08);
	border: 1rpx solid rgba(92, 137, 230, 0.1);
}
.order-card-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 22rpx;
}
.order-head-main {
	flex: 1;
	min-width: 0;
}
.order-head-label {
	display: inline-block;
	padding: 6rpx 16rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	color: #4d79d8;
	background: rgba(75, 123, 236, 0.1);
	margin-bottom: 12rpx;
}
.order-head-value {
	display: block;
	font-size: 24rpx;
	line-height: 34rpx;
	color: #5f6880;
	word-break: break-all;
}
.order-status-badge {
	flex-shrink: 0;
	padding: 10rpx 22rpx;
	border-radius: 999rpx;
	font-size: 22rpx;
	font-weight: 600;
	color: #2f67d8;
	background: linear-gradient(135deg, rgba(91, 142, 255, 0.16) 0%, rgba(72, 118, 240, 0.08) 100%);
}
.order-goods-list + .order-goods-list {
	padding-top: 18rpx;
	margin-top: 18rpx;
	border-top: 1rpx solid rgba(102, 132, 196, 0.12);
}
.order-goods-row {
	display: flex;
	align-items: center;
}
.order-goods-img {
	width: 108rpx;
	height: 108rpx;
	flex-shrink: 0;
	border-radius: 18rpx;
	overflow: hidden;
	background: #eef3ff;
}
.order-goods-info {
	flex: 1;
	min-width: 0;
	margin: 0 20rpx;
}
.order-goods-name {
	display: block;
	font-size: 26rpx;
	line-height: 38rpx;
	color: #1d2438;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.order-goods-desc {
	display: block;
	margin-top: 10rpx;
	font-size: 22rpx;
	color: #96a0b5;
}
.order-goods-price {
	flex-shrink: 0;
	font-size: 28rpx;
	font-weight: 700;
	color: #ff5d6c;
	text-align: right;
}
.order-card-foot {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(102, 132, 196, 0.12);
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.order-foot-date {
	font-size: 22rpx;
	color: #9aa4b8;
}
.order-foot-amount {
	display: flex;
	align-items: center;
	column-gap: 16rpx;
}
.order-foot-meta {
	font-size: 22rpx;
	color: #8a95ac;
}
.order-foot-total {
	font-size: 24rpx;
	font-weight: 700;
	color: #24304a;
}
</style>
