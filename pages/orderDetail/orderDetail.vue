<template>
	<gui-page>
		<template v-slot:gBody>
			<view class="order-detail-page">
				<view class="detail-banner">
					<text class="detail-banner-status">{{ orderInfo?.orderStatusName }}</text>
					<text class="detail-banner-no">订单号：{{ orderInfo?.orderNo }}</text>
				</view>

				<view class="detail-card">
					<view class="detail-section-title">订单内容</view>
					<scroll-view scroll-y class="detail-goods-scroll">
					  <view class="detail-goods-item" v-for="item in orderInfo?.orderDetailList" :key="item.id">
					  	<image
					  		class="gui-album-img"
					  		mode="aspectFill"
					  		:src="item?.itemUrl"
					  	></image>
					  	<view class="detail-goods-main">
					  		<text class="detail-goods-name">{{ item?.itemName }}</text>
					  		<text class="detail-goods-tag">有声内容</text>
					  	</view>
					  	<text class="detail-goods-price">￥{{ item?.itemPrice }}</text>
					  </view>
					</scroll-view>

					<view class="detail-summary-card">
						<view class="detail-summary-row">
							<text class="detail-summary-label">商品总价</text>
							<text class="detail-summary-value">￥{{ orderInfo?.originalAmount }}</text>
						</view>
						<view class="detail-summary-divider"></view>
						<view class="detail-summary-row">
							<text class="detail-summary-label">实付款</text>
							<text class="detail-summary-pay">￥{{ orderInfo?.orderAmount }}</text>
						</view>
					</view>
					
					<view class="detail-section-title detail-section-title-space">订单信息</view>
					<view class="detail-meta-card">
						<view class="detail-meta-row">
							<text class="detail-meta-label">订单号</text>
							<text class="detail-meta-value detail-meta-break">{{ orderInfo?.orderNo }}</text>
						</view>
						<view class="detail-meta-row">
							<text class="detail-meta-label">付款方式</text>
							<text class="detail-meta-value">{{ orderInfo?.payWayName }}</text>
						</view>
						<view class="detail-meta-row">
							<text class="detail-meta-label">下单时间</text>
							<text class="detail-meta-value">{{ orderInfo?.orderDate }}</text>
						</view>
					</view>
					<view v-if="orderInfo?.orderStatus === ORDER_STATUS_MAP.Unpaid" class="pay-btn-container">
						<button class="detail-pay-btn" @click="handleCheckout">立即结算</button>
					</view>
				</view>

			</view>
		</template>
	</gui-page>
	<PayTypeSelect
		ref="payTypeSelectRef"
		:wechatSetting="{isShow:true,payMode:1}"
		:alipaySetting="{isShow:false}"
		:balanceSetting="{isShow:false}"></PayTypeSelect>
</template>
<script setup lang="ts">

import { order } from "../../api"
import { onLoad } from '@dcloudio/uni-app';
import { ref } from "vue";
import PayTypeSelect from "../../components/PayTypeSelect/PayTypeSelect.vue"
import { ORDER_STATUS_MAP, PAY_WAY_MAP } from "../../utils/constant"
import { useOrderStore } from "../../stores/order"
import { OrderInterface } from "../../api/order/interfaces"
const payTypeSelectRef= ref<InstanceType<typeof PayTypeSelect>>()
const orderInfo = ref()
const orderStore = useOrderStore()
const handleCheckout = () => {
	payTypeSelectRef.value.open()
}

onLoad(async (options: {orderNo: string}) => {
	const { orderNo } = options
	const res  = await order.queryOrderInfo(orderNo)
	orderInfo.value = res.data
	// 未支付状态 构建支付参数（通过订单号支付）
	if (orderInfo.value?.orderStatus === ORDER_STATUS_MAP.Unpaid){
		// 设置订单号
		orderStore.setOrderNo(orderNo)
	}

})

</script>
<style scoped>
.order-detail-page {
	min-height: 100vh;
	padding: 0 24rpx 32rpx;
	background: linear-gradient(180deg, #f4f7fe 0%, #eef3fd 100%);
}
.detail-banner {
	margin-top: 20rpx;
	padding: 34rpx 30rpx 88rpx;
	border-radius: 32rpx;
	background: linear-gradient(135deg, #4f86ff 0%, #6f9dff 100%);
	box-shadow: 0 18rpx 44rpx rgba(56, 104, 219, 0.2);
}
.detail-banner-status {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #ffffff;
}
.detail-banner-no {
	display: block;
	margin-top: 16rpx;
	font-size: 24rpx;
	line-height: 34rpx;
	color: rgba(255, 255, 255, 0.82);
	word-break: break-all;
}
.detail-card {
	margin-top: -48rpx;
	padding: 28rpx;
	border-radius: 30rpx;
	background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
	box-shadow: 0 16rpx 42rpx rgba(54, 91, 176, 0.1);
	border: 1rpx solid rgba(87, 130, 225, 0.1);
}
.detail-section-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #25314b;
}
.detail-section-title-space {
	margin-top: 28rpx;
}
.detail-goods-scroll {
	height: 520rpx;
	width: 100%;
	margin-top: 22rpx;
}
.detail-goods-item {
	display: flex;
	align-items: center;
	padding: 0 0 20rpx;
}
.detail-goods-item + .detail-goods-item {
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(96, 126, 193, 0.12);
}
.gui-album-img {
	width: 128rpx;
	height: 128rpx;
	border-radius: 24rpx;
	flex-shrink: 0;
}
.detail-goods-main {
	flex: 1;
	min-width: 0;
	margin: 0 20rpx;
}
.detail-goods-name {
	display: block;
	font-size: 28rpx;
	line-height: 40rpx;
	color: #1f2740;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.detail-goods-tag {
	display: inline-flex;
	margin-top: 12rpx;
	padding: 8rpx 16rpx;
	border-radius: 999rpx;
	font-size: 20rpx;
	color: #4f7ce3;
	background: rgba(88, 130, 233, 0.1);
}
.detail-goods-price {
	flex-shrink: 0;
	font-size: 28rpx;
	font-weight: 700;
	color: #ff5d6c;
}
.detail-summary-card,
.detail-meta-card {
	margin-top: 24rpx;
	padding: 24rpx;
	border-radius: 24rpx;
	background: #f6f9ff;
}
.detail-summary-row,
.detail-meta-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 24rpx;
}
.detail-summary-divider {
	height: 1rpx;
	margin: 18rpx 0;
	background: rgba(104, 134, 194, 0.14);
}
.detail-summary-label,
.detail-meta-label {
	font-size: 24rpx;
	color: #66718b;
}
.detail-summary-value,
.detail-meta-value {
	flex: 1;
	text-align: right;
	font-size: 24rpx;
	color: #25314b;
}
.detail-summary-pay {
	font-size: 30rpx;
	font-weight: 700;
	color: #ff5b6a;
}
.detail-meta-row + .detail-meta-row {
	margin-top: 22rpx;
}
.detail-meta-break {
	word-break: break-all;
}
.pay-btn-container{
	margin: 34rpx 0 10rpx;
}
.detail-pay-btn {
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 999rpx;
	background: linear-gradient(135deg, #4e86ff 0%, #6a99ff 100%);
	color: #ffffff;
	font-size: 28rpx;
	font-weight: 700;
	box-shadow: 0 14rpx 32rpx rgba(61, 108, 221, 0.24);
}
</style>
