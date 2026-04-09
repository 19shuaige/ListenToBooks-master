<template>
	<gui-page :customFooter="true" :customHeader="true"  v-model="albumDetailInfo" v-if="albumDetailInfo.albumInfo">
		<!-- 自定义头部导航 -->
		<template v-slot:gHeader>
			<view style="height: 44px" class="gui-flex gui-nowrap gui-rows gui-align-items-center">
				<gui-header-leading @goHome="goHome"></gui-header-leading>
				<text class="gui-h5 gui-bold gui-flex1 gui-text-center gui-ellipsis gui-primary-text">{{ albumDetailInfo.albumInfo.albumTitle }}</text>
				<view class="gui-flex"><text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity3 gui-m-r-10">&#xe604;</text></view>
				<view style="width: 180rpx"></view>
			</view>
		</template>
		<template v-slot:gBody>
			<scroll-view
				class="gui-bg-white gui-dark-bg-level-3 gui-border-box mianImgBg gui-bg-brown-linear-gradient gui-p-30 detail-scroll-view"
				:scroll-y="true"
				:show-scrollbar="false"
				style="height: 100vh"
			>
				<view class="gui-margin-top gui-flex gui-row gui-space-between animate-fade-up">
					<view class="gui-dark-bg-level-3 gui-color-gray image-wrapper">
						<image
							class="gui-album-img premium-shadow"
							mode="aspectFill"
							:src="albumDetailInfo.albumInfo.coverUrl"
						></image>
					</view>
					<view class="gui-flex gui-column gui-flex1 gui-m-l-30" style="width: 388rpx">
						<text class="gui-color-white album-title">{{ albumDetailInfo.albumInfo.albumTitle }}</text>
						<view class="gui-m-t-20 gui-flex gui-row gui-wrap">
							<gui-tags
								:text="albumDetailInfo.baseCategoryView[`category${n}Name`]"
								:size="22"
								:customClass="['glass-effect-dark', 'gui-color-white', 'gui-m-r-10', 'gui-m-b-10', 'tag-rounded']"
								v-for="n in 3"
								:key="n"
							></gui-tags>
						</view>
					</view>
				</view>

				<view class="gui-flex gui-row gui-space-between gui-color-white gui-text-center gui-m-t-40 stat-container animate-fade-up" style="animation-delay: 0.1s;">
					<view class="gui-flex gui-column stat-item">
						<text class="gui-text-brown-light icon-wrapper">
							<text class="iconfont" style="font-size: 32rpx;">&#xe651;</text>
							<text class="gui-text-small gui-m-l-5 gui-m-r-5" style="font-weight: bold;">{{albumDetailInfo.baseCategoryView.category1Name}}</text>
							<text class="iconfont" style="font-size: 32rpx;">&#xe650;</text>
						</text>
					</view>
					<view class="gui-flex gui-column stat-item">
						<text class="stat-num">
							{{ albumDetailInfo.albumStatVo.commentStatNum || 0}}
							<text class="gui-text-small stat-unit">万</text>
						</text>
						<text class="gui-text-small stat-label">评论数</text>
					</view>
					<view class="gui-flex gui-column stat-item">
						<text class="stat-num">
							{{ albumDetailInfo.albumStatVo.playStatNum || 0}}
							<text class="gui-text-small stat-unit">亿</text>
						</text>
						<text class="gui-text-small stat-label">播放量</text>
					</view>
					<view class="gui-flex gui-column stat-item">
						<text class="stat-num">
							{{ albumDetailInfo.albumStatVo.subscribeStatNum || 0}}
							<text class="gui-text-small stat-unit">万</text>
						</text>
						<text class="gui-text-small stat-label">订阅量</text>
					</view>
				</view>

				<view class="gui-m-t-30 animate-fade-up" style="animation-delay: 0.1s;"><text class="gui-text-brown">{{albumDetailInfo.albumInfo.albumIntro}}</text></view>

				<view class="gui-m-t-20 gui-border-box glass-effect-dark gui-p-20 soft-card animate-fade-up" style="animation-delay: 0.2s;" @click="">
					<view class="gui-flex gui-column gui-flex1 gui-color-white"><text style="font-weight: 600; font-size: 32rpx;">主播介绍</text></view>
					<view class="gui-flex gui-m-t-20">
						<view class="gui-flex1">
							<view class="gui-flex">
								<image
									mode="aspectFill"
									:src="albumDetailInfo.announcer.avatarUrl"
									class="gui-album-avatar premium-shadow"
								></image>
								<view class="gui-flex gui-column gui-m-l-20 gui-justify-content-center">
									<text class="gui-color-white" style="font-size: 30rpx; font-weight: 500;">{{ albumDetailInfo.announcer.nickname }}</text>
									<text class="gui-text-brown gui-text-small gui-m-t-10">已被2331.4万人关注</text>
								</view>
							</view>
						</view>
						<view class="premium-badge gui-text-center flex-center btn-hover" style="width: 150rpx; height: 60rpx; border-radius: 30rpx !important;">
							<text class="gui-icons gui-color-white gui-text-small" style="font-weight: bold;">&#xe6c7; 关注</text>
						</view>
					</view>
					<view class="gui-m-t-20 gui-text-brown gui-text-small" style="line-height: 1.6;"><text>喜马人肉故事机!来呀，等你关注。微博求关注呀</text></view>
				</view>

				<view class="gui-m-t-30 animate-fade-up" style="animation-delay: 0.3s;" v-if="albumDetailInfo.albumInfo.albumRichIntro">
					<view class="gui-text-center"><text class="gui-color-white gui-h3" style="font-weight: bold; letter-spacing: 4rpx;">简介</text></view>
					<view class="gui-bg-white gui-dark-bg-level-3 gui-m-t-20 soft-card" style="padding: 20rpx; border-radius: 24rpx; background: rgba(255,255,255,0.9) !important;">
						<gui-spread class="guiSpread" height="200rpx" :isShrink="true">
							<mp-html :content="albumDetailInfo.albumInfo.albumRichIntro" />
						</gui-spread>
					</view>
				</view>
				<view style="height:400rpx;"></view>
			</scroll-view>
		</template>

		<template v-slot:gFooter>
			<Resizable
				ref="resizableRef"
				:min-height="150"
				:max-height="500"
				:initial-height="200">
				<template #top>
					<view class="gui-text-center resizable-top gui-bg-black">
						<text class="iconfont gui-color-white gui-h3">&#xeb2e;</text>
					</view>
				</template>
				<z-paging
					ref="zPagingRef"
					:paging-style="{height:(resizableRef?.boxHeight - 50 || 100)+'px'}"
					v-model="albumTrackList"
					@query="getAlbumTrackList"
					:fixed="false">
					<template #top>
						<view
							class="gui-flex gui-space-between gui-align-items-center gui-padding soft-card gui-m-10"
							style="background: linear-gradient(135deg, #fff 0%, #fff0f5 100%);"
							>
							<view class="gui-h4 gui-bold" style="color: #333;">{{userStore.user.isVip ? '续费会员 优惠多多' : '开通会员 优惠多多'}}</view>
							<button type="default" class="gui-button premium-badge gui-noborder btn-hover" @click="openAccountPopup" style="height: 60rpx; line-height: 60rpx;">
								<text class="gui-color-white gui-button-text gui-p-l-30 gui-p-r-30" style="font-weight: bold; border-radius: 30rpx;">{{userStore.user.isVip ? '立即续费' : '立即开通'}}</text>
							</button>
						</view>
						<view class="gui-flex gui-space-between gui-justify-content-center gui-align-items-center gui-m-t-10">
							<view
								v-if="false"
								type="default"
								class="gui-button gui-bg-black-opacity6 gui-noborder gui-flex1 gui-m-l-20 gui-m-r-20 gui-flex gui-justify-content-center btn-hover"
								style="border-radius: 40rpx; height: 80rpx;"
								>
								<text class="gui-icons gui-block gui-m-r-10 gui-text-brown-light">&#xe649;</text>
								<text class="gui-icons gui-button-text gui-text-brown-light">开始播放</text>
							</view>
							<view
								type="default"
								class="gui-button gui-bg-black-opacity6 gui-noborder gui-flex1 gui-m-l-20 gui-m-r-20 gui-flex gui-justify-content-center btn-hover"
								@click="openBuyPopup"
								style="border-radius: 40rpx; height: 80rpx;"
							>
								<text class="gui-icons gui-block gui-m-r-10 gui-color-white">&#xe620;</text>
								<text class="gui-icons gui-button-text gui-color-white">立即购买</text>
							</view>
							<view
								type="default"
								class="gui-button gui-bg-black-opacity6 gui-noborder gui-flex1 gui-m-l-20 gui-m-r-20 gui-flex gui-justify-content-center btn-hover"
								@click="handleSubscribe"
								style="border-radius: 40rpx; height: 80rpx;"
							>
								<text class="gui-icons gui-block gui-m-r-10 gui-color-white" :class="[isSubscribe ? 'gui-color-red' : '']">{{ isSubscribe ? '&#xe600;' : '&#xe6c7;'}}</text>
								<text class="gui-icons gui-button-text gui-color-white">{{ isSubscribe ? '已订阅' : '订阅'}}</text>
							</view>
						</view>
					</template>
					<!-- 渲染列表-->
					<view
						class="gui-list-items animate-fade-up track-item-hover"
						:style="{ animationDelay: `${index * 0.05 + 0.1}s` }"
						:class="item.isChecked ? 'track-item-checked' : ''"
						v-for="(item,index) in albumTrackList"
						@click="handleTrackOnClick(index,item)"
						:key="item.trackId">
						<view class="gui-relative track-item-sort">
							<view
								:class="item.isChecked ? 'track-item-title-checked' : 'gui-color-grey1'"
								class=" gui-h5">{{ item.orderNum }}</view>
						</view>
						<view class="gui-list-body gui-border-b">
							<view class="gui-list-title">
								<text :class="item.isChecked ? 'track-item-title-checked' : 'gui-primary-text '" class="gui-list-title-text gui-ellipsis">{{item.trackTitle}}</text>
							</view>
							<view class="gui-color-gray gui-flex gui-text-small gui-flex gui-align-items-center gui-m-t-20">
								<text v-if="item.isChecked && item.isPlaying" class="gui-icons gui-block gui-m-r-10">&#xe64b;</text>
								<text v-else class="gui-icons gui-block gui-m-r-10">&#xe649;</text>
								<text class="gui-block gui-m-r-20">{{ item.playStatNum }}</text>
								<text class="gui-icons gui-block gui-m-r-10">&#xe6b8;</text>
								<text class="gui-block gui-m-r-20">{{ item.commentStatNum }}</text>
								<text class="gui-icons gui-block gui-m-r-10">&#xe607;</text>
								<text class="gui-block">{{ formatTime(item.mediaDuration)  }}</text>
							</view>
						</view>
						<view class="gui-flex gui-column gui-color-gray gui-text-center gui-m-l-20 gui-m-r-20">
							<text class="gui-color-gray gui-text-small gui-block gui-m-b-20">{{ item.createTime.slice(0, 10) }}</text>
							<uni-icons v-if="item.isShowPaidMark"  custom-prefix="iconfont" type="shoufeiguanli" class="gui-m-r-10" size="15" color="#ef5350"></uni-icons>
							<uni-icons v-else custom-prefix="iconfont" type="xiazai" class="gui-m-r-10" size="15"></uni-icons>
						</view>
					</view>
				</z-paging>

			</Resizable>
		</template>

	</gui-page>
	<!-- 弹出层，开通会员 -->
	<gui-popup ref="accountPopupRef" position="bottom">
		<view class="gui-relative gui-box-shadow gui-bg-white gui-dark-bg-level-1">
			<text class="gui-icons gui-block gui-absolute-rt gui-h3 gui-p-20" @click="closeAccountPopup">&#xe610;</text>
			<text class="gui-h3 gui-block gui-p-t-20 gui-p-b-20 gui-text-center">{{userStore.user.isVip ? '续费会员 优惠多多' : '开通会员 优惠多多'}}</text>
			<view class="gui-flex gui-space-between gui-m-20">
				<view @click="handleBuyVip(item)" v-for="item in vipSettingList" :key="item.id" class="gui-flex gui-column gui-align-items-center gui-p-20 gui-border-radius gui-border">
					<text>{{ item.name }}</text>
					<view class="price-container">
						￥
						<text>{{ item.discountPrice }}</text>
					</view>
					<view class="gui-line-through gui-text-small gui-text-brown">
						原价￥
						<text>{{ item.price }}</text>
					</view>
					<text class="gui-text-small gui-text-brown">每日仅需￥{{(item.discountPrice/(item.serviceMonth*30)).toFixed(2)}}</text>
				</view>
			</view>

			<view class="gui-flex gui-rows gui-nowrap gui-align-items-center" style="margin-top: 80rpx">
				<view class="gui-title-line"></view>
				<text class="gui-h6" style="padding-left: 50rpx; padding-right: 50rpx">开通会员，将享有</text>
				<view class="gui-title-line"></view>
			</view>

			<view class="gui-flex gui-space-between gui-m-50">
				<view class="gui-flex gui-column">
					<view class="gui-bg-orange-opacity1 gui-border-radius">
						<text class="iconfont gui-block gui-h3 gui-text-center gui-p-20 gui-text-orange-opacity9">&#xe641;</text>
					</view>
					<text class="gui-m-t-10 gui-block gui-text-small gui-text-orange-opacity9">会员免费听</text>
				</view>

				<view class="gui-flex gui-column">
					<view class="gui-bg-orange-opacity1 gui-border-radius">
						<text class="iconfont gui-block gui-h3 gui-text-center gui-p-20 gui-text-orange-opacity9">&#xe8a6;</text>
					</view>
					<text class="gui-m-t-10 gui-block gui-text-small gui-text-orange-opacity9">会员专享</text>
				</view>

				<view class="gui-flex gui-column">
					<view class="gui-bg-orange-opacity1 gui-border-radius">
						<text class="iconfont gui-block gui-h3 gui-text-center gui-p-20 gui-text-orange-opacity9">&#xe65d;</text>
					</view>
					<text class="gui-m-t-10 gui-block gui-text-small gui-text-orange-opacity9">免音贴广告</text>
				</view>

				<view class="gui-flex gui-column">
					<view class="gui-bg-orange-opacity1 gui-border-radius">
						<text class="iconfont gui-block gui-h3 gui-text-center gui-p-20 gui-text-orange-opacity9">&#xe605;</text>
					</view>
					<text class="gui-m-t-10 gui-block gui-text-small gui-text-orange-opacity9">会员音效</text>
				</view>
			</view>

			<view class="gui-flex gui-padding-x gui-column">
				<text class="gui-text-small gui-block gui-text-center gui-m-t-20 gui-m-b-20">购买即视为同意《会员服务协议》和《自动续费服务规则》</text>
			</view>
		</view>
	</gui-popup>

	<!-- 弹出层，全集购买 -->
	<gui-popup ref="buyPopupRef" position="bottom">
		<view class="gui-relative gui-box-shadow gui-bg-white gui-dark-bg-level-1">
			<text class="gui-icons gui-block gui-absolute-rt gui-h3 gui-p-20" @click="closeBuyPopup">&#xe610;</text>
			<text class="gui-h3 gui-block gui-p-t-20 gui-p-b-20 gui-text-center">购买</text>
			<view class="gui-flex gui-m-20 gui-wrap gui-row buy-track-container">

				<view
					v-for="(item,index) in trackSettingList"
					:key="index"
					@click="handleBuySingle(item)"
					class="buy-card gui-text-small gui-flex gui-column gui-align-items-center gui-p-20 gui-border-radius gui-border">
					<text>{{ item.name }}</text>
					<text class="gui-text-orange-opacity9 gui-block gui-m-t-10">￥{{ item.price }}</text>
				</view>
				<view
					v-if="userStore.user.isVip === 0 && albumDetailInfo?.albumInfo?.payType === PAY_TYPE_MAP.VipFree"
					@click="handleBuyAllIsMeanBuyVip"
					class="buy-card gui-text-small gui-flex gui-column gui-align-items-center gui-p-20 gui-border-radius gui-border">
					<text>全集</text>
					<text class="gui-text-orange-opacity9 gui-block gui-m-t-10 gui-h4">VIP免费</text>
				</view>
<!--				占位元素-->
				<view
					v-else
					class="buy-card gui-p-20">
					<text></text>
					<text class="gui-text-orange-opacity9 gui-block gui-m-t-10 gui-h4"></text>
				</view>

			</view>

			<view class="gui-flex gui-column gui-padding">
				<text class="gui-text-small gui-block gui-m-b-10 gui-text-black-opacity3">喜马拉雅VIP会员享多项特权</text>
				<text class="gui-text-small gui-block gui-m-b-20 gui-text-black-opacity3">有声书免费听|去声音广告|喜马讲书畅听等9项权益</text>
			</view>

			<view
				@click="handleBuyAllIsMeanBuyVip"
				class="gui-h4 gui-color-white gui-flex1 gui-text-center gui-bg-orange gui-p-30">{{userStore.user.isVip ? '续费会员 优惠多多' : '开通会员 优惠多多'}}</view>
		</view>
	</gui-popup>

	<!-- 弹出层，整专辑购买 -->
	<gui-popup ref="albumPopupRef" position="bottom">
		<view class="gui-relative gui-box-shadow gui-bg-white gui-dark-bg-level-1">
			<text class="gui-icons gui-block gui-absolute-rt gui-h3 gui-p-20" @click="closeAlbumPopup">&#xe610;</text>
			<navigator class="gui-list-items gui-m-40">
				<view class="gui-list-image gui-relative">
					<image
						class="gui-list-image"
						mode="aspectFill"
						:src="albumDetailInfo?.albumInfo?.coverUrl"
					></image>
				</view>
				<view class="gui-list-body gui-border-b">
					<view class="gui-list-title"><text class="gui-list-title-text gui-primary-text">以下方式开启畅听</text></view>
					<text class="gui-list-body-desc gui-color-gray">{{ albumDetailInfo?.albumInfo?.albumTitle }}</text>
				</view>
			</navigator>
<!--			购买会员-->
			<view
				@click="handleBuyAllIsMeanBuyVip"
				class="gui-flex gui-row gui-space-between gui-m-40 gui-align-items-center">
				<view class="gui-flex gui-flex1 gui-column">
					<text class="gui-block">{{userStore.user.isVip ? '续费会员 优惠多多' : '开通会员 优惠多多'}}</text>
					<text class="gui-block gui-text-small gui-text-brown-light">{{ albumDetailInfo?.albumInfo?.vipDiscount > 0 ? `会员专享：${albumDetailInfo.albumInfo.vipDiscount}折购买本专辑` : '可收听所有会员内容'}}</text>
				</view>
				<view class="gui-bg-orange gui-color-white gui-p-20">{{userStore.user.isVip ? '立即续费' : '立即开通'}}</view>
			</view>
			<navigator
				@click="handleBuyAllAlbums"
				class="gui-m-40 gui-flex gui-space-between gui-bg-black-opacity2 gui-p-20">
				<text class="gui-ellipsis gui-flex1">
					{{albumDetailInfo?.albumInfo?.discount > 0 ? `${albumDetailInfo.albumInfo.discount}折` : ''}}购买本专辑
				</text>
				<text class="gui-list-arrow-right gui-icons">&#xe601;</text>
			</navigator>

			<view style="height: 100rpx"></view>
		</view>
	</gui-popup>


</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onLoad,onShow } from "@dcloudio/uni-app"
import GuiPopup from "../../Grace6/components/gui-popup.vue"
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"
import Resizable from "../../components/Resizable/Resizable.vue"
import { AlbumDetailInterface, TrackInterface } from "../../api/albums/interfaces"
import { albumsService, order } from "../../api"
import { formatTime } from "../../utils/utils"
import { TrackSettingInterface, VipSettingInterface } from "../../api/order/interfaces"
import { PAY_TYPE_MAP, PAYMENT_ITEM_TYPE_MAP, PRICE_TYPE_MAP } from "../../utils/constant"
import { useOrderStore } from "../../stores/order"
import { useUserStore } from "../../stores/user"

const accountPopupRef = ref<InstanceType<typeof GuiPopup>>()
const buyPopupRef = ref<InstanceType<typeof GuiPopup>>()
const albumPopupRef = ref<InstanceType<typeof GuiPopup>>()
const resizableRef = ref<InstanceType<typeof Resizable>>()

const zPagingRef = ref<InstanceType<typeof ZPaging>>()
// 使用用户相关
const userStore = useUserStore()
// 使用订单相关的store
const orderStore = useOrderStore()
// 初始加载清空订单信息
orderStore.clearOrderInfo()

const props = defineProps({
	id: {
		type: Number || String,
		default: 2
	}
})
// 专辑信息
const albumDetailInfo = ref({} as AlbumDetailInterface)
//专辑声音列表
const albumTrackList = ref<TrackInterface[]>([])
// 会员收费列表
const vipSettingList = ref<VipSettingInterface[]>([])
// 声音收费列表
const trackSettingList = ref<TrackSettingInterface[]>([])
// 是否订阅
const isSubscribe = ref<boolean>(false)

/* 方法 */
// 获取专辑详情
const getAlbumDetailInfo = async () => {
	try {
		const res = await albumsService.getAlbumDetail(props.id)
		albumDetailInfo.value = res.data
	} catch (error) {
		console.log(error)
	}
}
// 获取专辑声音列表
const getAlbumTrackList= async (page:number, limit:number) => {
	const params = {
		page,
		limit,
		albumId: props.id
	}
	try {
		const res = await albumsService.getAlbumTrackList(params)
		res.data.records.forEach((item:TrackInterface) => {
			item.isChecked = false
			item.isPlaying = false
		})
		zPagingRef.value.complete(res.data.records)
	} catch (error) {
		console.log(error)
	}
}
// 专辑声音被点击
const handleTrackOnClick = async (index: number, item: TrackInterface) => {
	console.log('item', item)
	// 是否收费
	if (item.isShowPaidMark) {
		// 判断是整张专辑购买还是分级购买
		if (albumDetailInfo.value.albumInfo.priceType === PRICE_TYPE_MAP.Single) {
			// 分集购买
			// 请求收费信息配置
			await getTrackVipSettingList(item.trackId)
			// 弹出收费弹窗
			openBuyPopup()
		} else if (albumDetailInfo.value.albumInfo.priceType === PRICE_TYPE_MAP.Album) {
			// 整张专辑购买
			// 请求收费信息配置
			// await getVipSettingList()
			// 弹出收费弹窗
			openAlbumPopup()
		}
	} else {
		// 免费
		albumTrackList.value.forEach((item2: TrackInterface, index2: number) => {
			if (index2 !== index) {
				item2.isChecked = false
				item2.isPlaying = false
			} else {
				item2.isChecked = true
				item2.isPlaying = !item2.isPlaying
			}
		})
		// 跳转到播放页面
		uni.navigateTo({
			url: `/pages/player/player?albumId=${albumDetailInfo.value.albumInfo.id}&trackId=${item.trackId}`
		})
	}
}
// 获取会员收费配置列表
const getVipSettingList = async () => {
	try {
		const res = await order.getVipSettingList()
		vipSettingList.value = res.data
	} catch (error) {
		console.log(error)
	}
}
// 获取声音收费配置列表
const getTrackVipSettingList = async (trackId:number) => {
	try {
		const res = await order.getTrackSettingList(trackId)
		// 增加声音Id，用于之后的购买
		res.data.forEach((item:TrackSettingInterface) => {
			item.trackId = trackId
		})
		trackSettingList.value = res.data
	} catch (error) {
		console.log(error)
	}
}
// 订阅
const handleSubscribe = async () => {
	try {
		const res: any =await albumsService.subscribeAlbum(albumDetailInfo.value.albumInfo.id)
		console.log('res.data', res.data)
		isSubscribe.value = res.data
		uni.showToast({
			title: res.data ? '订阅成功' : '取消订阅成功',
			icon: 'none'
		})
	} catch (error) {
		console.log(error)
	}
}

// 去往订单页
const handleToOrder = () => {
	uni.navigateTo({
		url: '/pages/confirmOrder/confirmOrder'
	})
}
const openAccountPopup = () => {
	console.log('openAccountPopup')
	accountPopupRef.value.open();
};
const openBuyPopup = () => {
	buyPopupRef.value.open();
};
const openAlbumPopup = () => {
	albumPopupRef.value.open();
};

const closeBuyPopup = () => {
	buyPopupRef.value.close();
};
// 关闭专辑弹窗
const closeAlbumPopup = () => {
	albumPopupRef.value.close();
};
const closeAccountPopup = () => {
	accountPopupRef.value.close();
};
// 购买会员
const handleBuyVip = (item:VipSettingInterface) => {
	console.log('handleBuyVip')
	// 关闭会员购买弹窗
	closeAccountPopup()
	orderStore.setConfirmOrderInfo({
		itemType: PAYMENT_ITEM_TYPE_MAP.Vip,
		itemId: item.id,
	})
	// 去往确认订单页面
	handleToOrder()
};
// 购买全集
const handleBuyAllIsMeanBuyVip = () => {
	console.log('handleBuyAllIsMeanBuyVip')
	// 弹出支付方式选择弹窗
	// 关闭购买弹窗
	closeBuyPopup()
	// 关闭专辑弹窗
	closeAlbumPopup()
	// 打开会员购买弹窗
	openAccountPopup()
};
// 分集单次购买
const handleBuySingle = (item:TrackSettingInterface) => {
	console.log('handleBuySingle')
	orderStore.setConfirmOrderInfo({
		itemType: PAYMENT_ITEM_TYPE_MAP.Track,
		itemId: item.trackId as number,
		trackCount: item.trackCount,
	})
	// 关闭购买弹窗
	closeBuyPopup()
	// 去往确认订单页面
	handleToOrder()
};
// 购买整张专辑
const handleBuyAllAlbums = () => {
	console.log('handleBuyAllAlbums')
	orderStore.setConfirmOrderInfo({
		itemType: PAYMENT_ITEM_TYPE_MAP.Album,
		itemId: albumDetailInfo.value.albumInfo.id,
	})
	// 关闭购买弹窗
	closeAlbumPopup()
	// 去往确认订单页面
	handleToOrder()
};

const goHome = () => {
	uni.redirectTo({
		url: '/pages/index/index'
	});
}

const getIsSubscribe = () => {
	console.log(1);
	const res: any = albumsService.isSubscribeAlbum(props.id)
	isSubscribe.value = res.data
}
onLoad(() => {
	getAlbumDetailInfo()
	getVipSettingList()
	getIsSubscribe()
});
onShow(() => {
  // 处理支付成功后的回显问题
  zPagingRef.value.refresh()
})

</script>
<style scoped lang="scss">
.mianImgBg {
	left: 0;
	top: 0;
	z-index: 1;
}
.detail-scroll-view {
	background: linear-gradient(180deg, #2c3e50 0%, #1a1a2e 100%) !important; /* 更高级的深色渐变背景 */
}
.image-wrapper {
	border-radius: 20rpx;
	overflow: hidden;
}
.premium-shadow {
	box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.4);
}
.album-title {
	font-size: 42rpx;
	font-weight: bold;
	line-height: 1.4;
	text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.3);
}
.tag-rounded {
	border-radius: 12rpx !important;
	padding: 6rpx 16rpx !important;
	border: 1px solid rgba(255,255,255,0.15);
}
.stat-container {
	background: rgba(0, 0, 0, 0.2);
	border-radius: 24rpx;
	padding: 30rpx 10rpx;
	backdrop-filter: blur(10px);
}
.stat-item {
	flex: 1;
	align-items: center;
	position: relative;
}
.stat-item:not(:last-child)::after {
	content: '';
	position: absolute;
	right: 0;
	top: 20%;
	height: 60%;
	width: 1px;
	background: rgba(255,255,255,0.1);
}
.stat-num {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
}
.stat-unit {
	color: #b3a598;
	margin-left: 4rpx;
	font-weight: normal;
}
.stat-label {
	color: #999;
}
.icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(226, 187, 146, 0.15);
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
}
.btn-hover {
	transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.2s;
}
.btn-hover:active {
	transform: scale(0.92);
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.2) !important;
}
.track-item-hover {
	transition: background-color 0.2s ease, transform 0.1s ease;
}
.track-item-hover:active {
	background-color: rgba(0,0,0,0.02);
	transform: scale(0.98);
}

.mainScrollView {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
	width: 750rpx;
	border-radius: 8rpx;
}

.popupScrollView {
	height: calc(100vh - var(--window-top) - 250px);
}

.popupView {
	height: calc(100vh - var(--window-top) - 200px);
}

.gui-album-img {
	width: 150rpx;
	height: 150rpx;
	border: 2rpx solid gold;
	border-radius: 10rpx;
}

.gui-album-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
}

.gui-text-brown {
	color: #b3a598;
}

.gui-text-brown-light {
	color: #e2bb92;
}

/*  深度样式 */
.guiSpread :deep(.gui-editor-show) {
	width: 690rpx !important;
}

.create-team-scroll {
	white-space: nowrap; // 滚动必须加的属性
	width: 100%;
	padding: 20rpx 20rpx 20rpx 0rpx;
}
.create-team-item {
	display: inline-flex; // item的外层定义成行内元素才可进行滚动 inline-block / inline-flex 均可
	flex-direction: column;
	align-items: center;
	border-radius: 20rpx;
}

.create-team-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
}

.buy-card {
	width: 160rpx;
	text-align: center;
	margin: 10rpx;
}
.resizable-top{
	height: 80rpx;
}
.track-item-checked{
	background-color: #f5f5f5;
}
.track-item-title-checked{
	color: #ff0036;
}
.track-item-sort{
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60rpx;
	text-align: center;
}
.price-container{
	color:#ff6e40;
}
.buy-track-container{
	justify-content:space-evenly;
}
</style>
