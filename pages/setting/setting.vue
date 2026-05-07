<template>
	<gui-page>
		<template v-slot:gBody>
			<view class="setting-page">
				<view class="setting-hero" :style="{ background: `linear-gradient(135deg, ${currentTheme.deepColor} 0%, ${currentTheme.color} 100%)` }">
					<text class="setting-hero-title">设置中心</text>
					<text class="setting-hero-desc">账号、播放与个性化显示都在这里统一管理</text>
				</view>

				<view class="setting-card">
					<text class="setting-card-title">账号与资料</text>
					<view class="setting-row" @click="navigateTo('/pages/updateInfo/updateInfo')">
						<view class="setting-row-main">
							<text class="setting-row-title">编辑个人资料</text>
							<text class="setting-row-desc">修改昵称、头像与基础信息展示</text>
						</view>
						<uni-icons type="forward" size="18" color="#B3BDD1"></uni-icons>
					</view>
					<view class="setting-row" @click="navigateTo('/pages/wallet/wallet')">
						<view class="setting-row-main">
							<text class="setting-row-title">钱包与账单</text>
							<text class="setting-row-desc">查看余额、充值记录和消费记录</text>
						</view>
						<uni-icons type="forward" size="18" color="#B3BDD1"></uni-icons>
					</view>
					<view class="setting-row" @click="handleComingSoon('账号与安全')">
						<view class="setting-row-main">
							<text class="setting-row-title">账号与安全</text>
							<text class="setting-row-desc">后续可扩展手机号、设备与登录保护</text>
						</view>
						<uni-icons type="forward" size="18" color="#B3BDD1"></uni-icons>
					</view>
				</view>

				<view class="setting-card">
					<text class="setting-card-title">主题色</text>
					<view class="theme-option-list">
						<view
							v-for="item in themeOptions"
							:key="item.color"
							class="theme-option"
							:class="{ 'theme-option-active': themeColor === item.color }"
							:style="themeColor === item.color ? { borderColor: currentTheme.color, background: currentTheme.lightColor } : {}"
							@click="handleThemeChange(item.color)"
						>
							<view class="theme-color-dot" :style="{ background: `linear-gradient(135deg, ${item.deepColor} 0%, ${item.color} 100%)` }"></view>
							<text class="theme-option-name">{{ item.name }}</text>
						</view>
					</view>
				</view>

				<view class="setting-card">
					<text class="setting-card-title">播放与通用</text>
					<view class="setting-row setting-row-switch">
						<view class="setting-row-main">
							<text class="setting-row-title">自动续播</text>
							<text class="setting-row-desc">再次进入播放器时优先回到上次播放位置</text>
						</view>
						<switch :checked="settingState.autoResume" color="#4F86FF" @change="handleToggle('autoResume', $event)" />
					</view>
					<view class="setting-row setting-row-switch">
						<view class="setting-row-main">
							<text class="setting-row-title">仅 WiFi 加载大图</text>
							<text class="setting-row-desc">减少移动网络下的图片加载压力</text>
						</view>
						<switch :checked="settingState.wifiOnlyImage" color="#4F86FF" @change="handleToggle('wifiOnlyImage', $event)" />
					</view>
					<view class="setting-row setting-row-switch">
						<view class="setting-row-main">
							<text class="setting-row-title">消息提醒</text>
							<text class="setting-row-desc">保留新内容与活动提醒的开关入口</text>
						</view>
						<switch :checked="settingState.notifyEnabled" color="#4F86FF" @change="handleToggle('notifyEnabled', $event)" />
					</view>
				</view>

				<view class="setting-card">
					<text class="setting-card-title">帮助与清理</text>
					<view class="setting-row" @click="clearSearchHistory">
						<view class="setting-row-main">
							<text class="setting-row-title">清空搜索历史</text>
							<text class="setting-row-desc">移除本地搜索记录，让搜索页更清爽</text>
						</view>
						<uni-icons type="trash" size="18" color="#B3BDD1"></uni-icons>
					</view>
					<view class="setting-row" @click="handleComingSoon('帮助与反馈')">
						<view class="setting-row-main">
							<text class="setting-row-title">帮助与反馈</text>
							<text class="setting-row-desc">后续可接入常见问题、意见反馈和客服入口</text>
						</view>
						<uni-icons type="forward" size="18" color="#B3BDD1"></uni-icons>
					</view>
				</view>

				<view class="setting-logout-btn" @click="openDialog">
					<text class="setting-logout-text">退出登录</text>
				</view>
			</view>
		</template>
	</gui-page>
	<!--  微信登陆弹窗-->
	<uni-popup ref="dialogRef" type="dialog">
		<uni-popup-dialog type="center" cancelText="取消" confirmText="确定" title="提示" content="是否退出登陆？" @confirm="userStore.logout"></uni-popup-dialog>
	</uni-popup>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue"
import { useUserStore } from '../../stores/user'
import UniPopup from "../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue"
import { useTheme } from "../../hooks/useTheme"
/* 响应式数据 */
const dialogRef = ref<InstanceType<typeof UniPopup>>()
const userStore = useUserStore()
const { themeColor, currentTheme, themeOptions, applyTheme } = useTheme()
const SETTING_STORAGE_KEY = 'appSettingState'
const localSettingState = uni.getStorageSync(SETTING_STORAGE_KEY)

const settingState = reactive({
	autoResume: true,
	wifiOnlyImage: false,
	notifyEnabled: true,
	...(localSettingState || {})
})

/* 方法 */
// 打开微信登陆弹窗
const openDialog = () => {
	dialogRef.value.open()
}

const persistSettings = () => {
	uni.setStorageSync(SETTING_STORAGE_KEY, { ...settingState })
}

const handleThemeChange = (color: string) => {
	applyTheme(color)
	uni.showToast({
		title: '主题色已更新',
		icon: 'none'
	})
}

const handleToggle = (key: 'autoResume' | 'wifiOnlyImage' | 'notifyEnabled', event: any) => {
	settingState[key] = !!event.detail.value
	persistSettings()
}

const navigateTo = (url: string) => {
	uni.navigateTo({ url })
}

const clearSearchHistory = () => {
	uni.removeStorageSync('searchHistoryList')
	uni.showToast({
		title: '搜索历史已清空',
		icon: 'none'
	})
}

const handleComingSoon = (name: string) => {
	uni.showToast({
		title: `${name}后续补充`,
		icon: 'none'
	})
}

/* 生命周期 */
persistSettings()
</script>

<style scoped>
.setting-page {
	min-height: 100vh;
	padding: 24rpx;
	background: linear-gradient(180deg, #f4f7fe 0%, #eef3fd 100%);
}
.setting-hero {
	padding: 34rpx 30rpx;
	border-radius: 32rpx;
	box-shadow: 0 18rpx 40rpx rgba(62, 104, 212, 0.18);
}
.setting-hero-title {
	display: block;
	font-size: 38rpx;
	font-weight: 700;
	color: #ffffff;
}
.setting-hero-desc {
	display: block;
	margin-top: 14rpx;
	font-size: 24rpx;
	line-height: 36rpx;
	color: rgba(255, 255, 255, 0.82);
}
.setting-card {
	margin-top: 22rpx;
	padding: 26rpx 24rpx;
	border-radius: 28rpx;
	background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
	box-shadow: 0 12rpx 34rpx rgba(53, 88, 168, 0.08);
	border: 1rpx solid rgba(92, 137, 230, 0.08);
}
.setting-card-title {
	display: block;
	margin-bottom: 8rpx;
	font-size: 28rpx;
	font-weight: 700;
	color: #22304a;
}
.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
}
.setting-row + .setting-row {
	border-top: 1rpx solid rgba(102, 132, 196, 0.12);
}
.setting-row-main {
	flex: 1;
	min-width: 0;
	padding-right: 20rpx;
}
.setting-row-title {
	display: block;
	font-size: 26rpx;
	font-weight: 600;
	color: #24304a;
}
.setting-row-desc {
	display: block;
	margin-top: 10rpx;
	font-size: 22rpx;
	line-height: 34rpx;
	color: #95a1b7;
}
.setting-row-switch {
	align-items: flex-start;
}
.theme-option-list {
	display: flex;
	flex-wrap: wrap;
	gap: 18rpx;
	margin-top: 18rpx;
}
.theme-option {
	width: calc(50% - 9rpx);
	display: flex;
	align-items: center;
	padding: 18rpx 20rpx;
	border-radius: 24rpx;
	background: #f6f9ff;
	border: 2rpx solid transparent;
}
.theme-option-active {
	box-shadow: 0 10rpx 24rpx rgba(79, 134, 255, 0.12);
}
.theme-color-dot {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	flex-shrink: 0;
}
.theme-option-name {
	margin-left: 14rpx;
	font-size: 24rpx;
	font-weight: 600;
	color: #24304a;
}
.setting-logout-btn {
	margin-top: 26rpx;
	height: 92rpx;
	border-radius: 999rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #ff6a7a 0%, #ff7f8c 100%);
	box-shadow: 0 16rpx 32rpx rgba(255, 106, 122, 0.2);
}
.setting-logout-text {
	font-size: 28rpx;
	font-weight: 700;
	color: #ffffff;
}
</style>
