<template>
  <gui-page :customHeader="true" :customFooter="true">
    <template v-slot:gHeader>
      <view style="height: 44px" class="gui-flex">
        <view class="gui-flex gui-row gui-wrap gui-align-items-center gui-m-l-20">
          <text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1 gui-m-r-10"
          >&#xe666;</text
          >
          <text class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1 gui-m-r-10"
          >&#xe67b;</text
          >
          <text @click="handleGoToOtherPage('/pages/setting/setting')" class="gui-icons gui-block gui-color-drak gui-p-10 gui-b-50 gui-bg-black-opacity1">&#xe613;</text>
        </view>
        <view style="width: 200rpx"></view>
      </view>
    </template>

    <template v-slot:gBody>
      <view class="gui-relative my-page-shell">
        <view class="gui-list gui-padding gui-p-b-40 my-profile-card">
          <view class="gui-list-items gui-relative">
            <view class="my-avatar-wrap" hover-class="my-avatar-hover" @tap="triggerAvatarWiggle">
              <image
                mode="aspectFill"
                :src="user.avatarUrl"
                class="gui-card-img my-avatar"
                :class="[avatarWiggle ? 'my-avatar-wiggle' : '']"
              ></image>
            </view>
            <view class="gui-list-body gui-m-t-10">
              <view class="gui-card-desc">
                <view class="gui-flex gui-rows gui-nowrap gui-align-items-center">
                  <text class="gui-card-name gui-primary-text gui-h4 gui-bold my-username" :style="{ color: usernameColor }">{{user.nickname}}</text>
                  <uni-icons v-if="user.isVip" custom-prefix="iconfont" type="VIP" class="gui-m-r-10" color="#f78414" size="15"></uni-icons>
                </view>
                <view class="my-user-tags">
                  <text class="my-user-tag" :style="{ color: currentTheme.deepColor, background: currentTheme.lightColor }">{{ vipStatusLabel }}</text>
                  <text class="my-user-tag my-user-tag-muted">ID {{ user.id || '--' }}</text>
                </view>
                <text class="my-profile-tip">{{ vipExpireLabel }}</text>
              </view>
            </view>
            <text class="gui-list-arrow-right gui-icons gui-color-gray" @click="handleGoToOtherPage('/pages/updateInfo/updateInfo')">&#xe601;</text>
          </view>
        </view>


        <view class="gui-creation-live">
          <view class="gui-flex gui-row gui-nowrap gui-space-around my-quick-entry-row">
            <view @click="handleGoToOtherPage('/pages/myWork/myWork')" class="gui-flex gui-row gui-align-items-center animate-fade-up my-entry" style="animation-delay: 0.05s;" hover-class="my-entry-hover">
              <text class="gui-icons gui-h4 gui-color-drak my-entry-icon">&#xe666;</text>
              <text class="my-entry-text">创作中心</text>
            </view>
            <view @click="getLiveRoom" class="gui-flex gui-row gui-align-items-center animate-fade-up my-entry" style="animation-delay: 0.15s;" hover-class="my-entry-hover">
              <text class="iconfont gui-color-drak gui-h4 my-entry-icon">&#xe7d5;</text>
              <text class="my-entry-text">录音/直播</text>
            </view>
          </view>
        </view>
      </view>

      <view class="gui-flex gui-space-between gui-padding gui-m-t-20 my-feature-panel">
        <view class="gui-grid-item animate-fade-up my-feature-item my-feature-vip" style="animation-delay: 0.2s;" hover-class="my-feature-hover" @click="handleGoToOtherPage('')">
          <text class="gui-grid-icon gui-icons gui-color-gray my-feature-icon">&#xe634;</text>
          <text class="gui-grid-text gui-icons gui-color-gray">VIP会员</text>
        </view>
        <view class="gui-grid-item animate-fade-up my-feature-item" style="animation-delay: 0.3s;" hover-class="my-feature-hover" @click="handleGoToOtherPage('/pages/wallet/wallet')">
          <text class="gui-grid-icon gui-icons gui-color-gray my-feature-icon">&#xe612;</text>
          <text class="gui-grid-text gui-icons gui-color-gray">我的钱包</text>
        </view>
        <view class="gui-grid-item animate-fade-up my-feature-item" style="animation-delay: 0.4s;" hover-class="my-feature-hover" @click="handleGoToOtherPage('/pages/order/order')">
          <text class="gui-grid-icon gui-icons gui-color-gray my-feature-icon">&#xe62f;</text>
          <text class="gui-grid-text gui-icons gui-color-gray">我的订单</text>
        </view>
      </view>


      <view class="gui-padding my-content-panel">
        <z-paging
          ref="zPagingRef"
          :paging-style="{height:'980rpx'}"
          v-model="pageData[pageData.currentPageNav].list"
          @query="getListInfo"
          :fixed="false">
          <template #top>
            <gui-switch-navigation
              :items="navItems"
              textAlign="center"
              :isCenter="true"
              :size="120"
              :margin="0"
              padding="20rpx"
              activeDirection="center"
              lineHeight="42rpx"
              activeFontSize="40rpx"
              :activeLineClass="['gui-nav-scale', 'my-nav-underline']"
              @change="(index)=>navChange(index,navItems[index].id)"
            ></gui-switch-navigation>
            <view style="height:8rpx;"></view>
          </template>
          <template #empty>
            <view class="my-empty animate-fade-up">
              <view class="my-empty-badge">{{ emptyStateConfig.badge }}</view>
              <!-- 图标区域 -->
              <view class="my-empty-icon-wrap">
                <uni-icons v-if="pageData.currentPageNav === 'subscribe'" type="sound-filled" size="46" class="my-empty-icon my-empty-icon-subscribe"></uni-icons>
                <uni-icons v-else-if="pageData.currentPageNav === 'collect'" type="star-filled" size="46" class="my-empty-icon my-empty-icon-collect"></uni-icons>
                <uni-icons v-else type="redo-filled" size="46" class="my-empty-icon my-empty-icon-history"></uni-icons>
                <!-- 装饰性光晕 -->
                <view class="my-empty-glow"></view>
              </view>
              
              <text class="my-empty-title">{{ emptyStateConfig.title }}</text>
              <text class="my-empty-desc">{{ emptyStateConfig.desc }}</text>
              
              <view class="my-empty-btn gui-flex gui-row gui-align-items-center gui-justify-content-center" hover-class="my-empty-btn-hover" @click="handleEmptyAction">
                <text class="my-empty-btn-text">{{ emptyStateConfig.buttonText }}</text>
                <text class="gui-icons my-empty-btn-arrow">&#xe601;</text>
              </view>
            </view>
          </template>
          <SubscribeItemCard
            v-if="pageData.currentPageNav === 'subscribe'"
            :data="item"
            :deleteItemHandler="deleteItem"
            :handleCancel="handleCancelSubscribe"
            :popSetting="pageData[pageData.currentPageNav].popSetting"
            :jumpRoute="pageData[pageData.currentPageNav].jumpRoute"
            v-for="item in pageData[pageData.currentPageNav].list"
            :key="item.albumId"
          />
          <CollectAndHistoryTrackItemCard
            v-if="pageData.currentPageNav === 'collect'"
            :data="item"
            :deleteItemHandler="deleteItem"
            :handleCancel="handleCancelCollect"
            :popSetting="pageData[pageData.currentPageNav].popSetting"
            mode="collect"
            :jumpRoute="pageData[pageData.currentPageNav].jumpRoute"
            v-for="item in pageData[pageData.currentPageNav].list"
            :key="item.trackId"></CollectAndHistoryTrackItemCard>
          <CollectAndHistoryTrackItemCard
            v-if="pageData.currentPageNav === 'history'"
            :data="item"
            :deleteItemHandler="deleteItem"
            :handleCancel="handleDeleteHistory"
            :popSetting="pageData[pageData.currentPageNav].popSetting"
            mode="history"
            :jumpRoute="pageData[pageData.currentPageNav].jumpRoute"
            v-for="item in pageData[pageData.currentPageNav].list"
            :key="item.trackId"></CollectAndHistoryTrackItemCard>
        </z-paging>
      </view>
    </template>

    <template v-slot:gFooter>
      <!-- 普通模式 -->
      <BottomNav></BottomNav>
    </template>
  </gui-page>
</template>
<script setup lang="ts">
import { computed, ref, reactive } from "vue"
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { useUserStore} from "../../stores/user"
import { storeToRefs } from 'pinia'
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"
import SubscribeItemCard from "../../components/SubscribeItemCard/SubscribeItemCard.vue"
import { albumsService, liveService } from "../../api"
import { CollectTrackInterface, HistoryTrackInterface, SubscribeAlbumsInterface } from "../../api/albums/interfaces"
import { useTheme } from "../../hooks/useTheme"
const userStore = useUserStore()
let {user} = storeToRefs(userStore)
const { currentTheme, applyTheme } = useTheme()

const zPagingRef = ref<InstanceType<typeof ZPaging>>()

const navItems = ref([
  { name: "订阅", id: 'subscribe' },
  { name: "收藏", id: 'collect' },
  { name: "历史", id: 'history' },
])
// 定义页面数据
const pageData = reactive({
  currentPageNav:'subscribe',
  // 订阅专辑列表
  subscribe: {
    // 专辑列表
    list: [] as SubscribeAlbumsInterface[],
    // 跳转路径
    jumpRoute: '/pages/detail/detail',
    // 弹出框配置
    popSetting:{
      type: "error",
      title: "注意",
      content: "你确定要取消订阅吗？",
      cancelText: "取消",
      confirmText: "确认"
    }
  },
  // 收藏声音列表
  collect: {
    // 声音列表
    list: [] as CollectTrackInterface[],
    // 跳转路径
    jumpRoute: '/pages/player/player',
    // 弹出框配置
    popSetting:{
      type: "error",
      title: "注意",
      content: "你确定要取消收藏吗？",
      cancelText: "取消",
      confirmText: "确认"
    }
  },
  // 历史声音列表
  history: {
    // 声音列表
    list: [] as HistoryTrackInterface[],
    // 跳转路径
    jumpRoute: '/pages/player/player',
    popSetting:{
      type: "error",
      title: "注意",
      content: "你确定要删除此历史吗？",
      cancelText: "取消",
      confirmText: "确认"
    }
  },
})
const currentIndex = ref(4)

const avatarWiggle = ref(false)
const scrollRatio = ref(0)

const usernameColor = computed(() => {
  const t = Math.max(0, Math.min(1, scrollRatio.value))
  const from = { r: 255, g: 107, b: 129 }
  const to = { r: 51, g: 51, b: 51 }
  const r = Math.round(from.r + (to.r - from.r) * t)
  const g = Math.round(from.g + (to.g - from.g) * t)
  const b = Math.round(from.b + (to.b - from.b) * t)
  return `rgb(${r}, ${g}, ${b})`
})

const pageLoadState = reactive({
  subscribe: 'idle',
  collect: 'idle',
  history: 'idle'
})

const emptyStateConfig = computed(() => {
  if (pageData.currentPageNav === 'subscribe') {
    return {
      badge: '订阅清单',
      title: '你还没有订阅任何专辑',
      desc: '先去首页逛逛，把喜欢的内容加入订阅，更新后就能第一时间听到',
      buttonText: '去发现专辑'
    }
  }
  if (pageData.currentPageNav === 'collect') {
    return {
      badge: '收藏夹',
      title: '收藏列表还是空的',
      desc: '听到想反复回味的声音时记得点一下收藏，之后会更方便继续收听',
      buttonText: '去挑好内容'
    }
  }
  return {
    badge: '最近播放',
    title: '暂时还没有收听历史',
    desc: '开始播放任意专辑后，最近听过的内容都会自动出现在这里',
    buttonText: '去首页看看'
  }
})

const vipStatusLabel = computed(() => user.value?.isVip ? 'VIP会员' : '普通用户')
const vipExpireLabel = computed(() => {
  if (user.value?.isVip && user.value?.vipExpireTime) {
    return `会员有效期至 ${user.value.vipExpireTime}`
  }
  return '完善个人资料后，可获得更统一的账号展示体验'
})

const profileStats = computed(() => ([
  { label: '订阅内容', value: pageData.subscribe.list.length },
  { label: '收藏声音', value: pageData.collect.list.length },
  { label: '最近收听', value: pageData.history.list.length }
]))

const triggerAvatarWiggle = () => {
  avatarWiggle.value = false
  setTimeout(() => {
    avatarWiggle.value = true
    setTimeout(() => {
      avatarWiggle.value = false
    }, 320)
  }, 0)
}

onPageScroll((e) => {
  scrollRatio.value = Math.max(0, Math.min(1, (e.scrollTop || 0) / 120))
})
// 导航切换
const navChange = (index: number | string,navItemId:string) => {
  pageData.currentPageNav = navItemId
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
    if (pageData.currentPageNav === 'subscribe') {
      // 专辑列表
      const res = await albumsService.getSubscribeAlbums(params)
      pageLoadState.subscribe = 'success'
      //将请求的结果数组传递给z-paging
      zPagingRef.value.complete(res.data.records);
    } else if (pageData.currentPageNav === 'collect') {
      // 声音列表
      const res = await albumsService.getCollectTrack(params)
      pageLoadState.collect = 'success'
      //将请求的结果数组传递给z-paging
      zPagingRef.value.complete(res.data.records);
    } else if (pageData.currentPageNav === 'history') {
      // 声音列表
      const res = await albumsService.getHistoryTrack(params)
      pageLoadState.history = 'success'
      //将请求的结果数组传递给z-paging
      zPagingRef.value.complete(res.data.records);
    }
  } catch (error) {
    console.log(error)
    pageLoadState[pageData.currentPageNav] = 'success'
    zPagingRef.value.complete([]);
  }
}
const handleEmptyAction = () => {
  handleGoToOtherPage('/pages/index/index')
}

const handleCancelSubscribe = async (albumId: number) => {
  const res = await albumsService.subscribeAlbum(albumId)
  if (res.data === false) {
    uni.showToast({
      title: '已取消订阅',
      icon: 'none'
    })
    return true
  }
  uni.showToast({
    title: '取消失败',
    icon: 'none'
  })
  return false
}

const handleCancelCollect = async (trackId: number) => {
  const res = await albumsService.collectTrack(trackId)
  if (res.data === false) {
    uni.showToast({
      title: '已取消收藏',
      icon: 'none'
    })
    return true
  }
  uni.showToast({
    title: '取消失败',
    icon: 'none'
  })
  return false
}

const handleDeleteHistory = async (id: number | string) => {
  await albumsService.deleteHistoryTrack(Number(id))
  uni.showToast({
    title: '已删除历史',
    icon: 'none'
  })
  return true
}

// 子组件被删除，触发父组件的删除列表子项事件
const deleteItem = (id: number | string) => {
  if (pageData.currentPageNav === 'subscribe') {
    // 专辑列表
    pageData.subscribe.list = pageData.subscribe.list.filter((item:SubscribeAlbumsInterface) => item.albumId !== id)
  }  else if (pageData.currentPageNav === 'collect') {
    // 声音列表
    pageData.collect.list = pageData.collect.list.filter((item:CollectTrackInterface) => item.trackId !== id)
  } else if (pageData.currentPageNav === 'history') {
    // 声音列表
    pageData.history.list = pageData.history.list.filter((item:HistoryTrackInterface) => item.trackId !== id)
  }
}
// 去其他页面
const handleGoToOtherPage = (route:string) => {
  if(route) {
      uni.navigateTo({
      url: route
    })
  } else {
    uni.showToast({
      title : "该功能暂未开放",
      icon  : "none"
    })
  }
}
onLoad(async () => {
  applyTheme(currentTheme.value.color)
  await userStore.getAccountBalance()
})
// 获取当前用户的直播间
const getLiveRoom = async () => {
  // #ifdef MP-WEIXIN
  // 小程序原生直播文档
  // https://developers.weixin.qq.com/miniprogram/product/live/access-requirement.html
  // https://mp.weixin.qq.com/wxamp/broadcast/access?token=1769749118&lang=zh_CN
  uni.showToast({
    title: '请在H5演示此功能',
    icon: 'none'
  })
  // #endif
  // #ifdef H5
  try {
    const res = await liveService.getCurrentLiveRoom()
    console.log(res)
    if (res.data?.id) {
      uni.navigateTo({
        url: `/pages/livePush/livePush?id=${res.data.id}`
      })
    } else {
      uni.navigateTo({
        url: `/pages/creatLivePush/creatLivePush`
      })
    }
  } catch (error) {
    console.log(error)
  }
  // #endif
}
</script>
<style>
page {
  background-color: #f8f9fa;
}
</style>
<style scoped>
.my-page-shell {
  background: transparent;
}

.my-profile-card {
  position: relative;
  overflow: visible;
  background: transparent;
}

.my-user-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 14rpx;
}

.my-user-tag {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 600;
}

.my-user-tag-muted {
  color: #8090ad;
  background: rgba(255, 255, 255, 0.9);
}

.my-profile-tip {
  display: block;
  margin-top: 14rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #97a1b4;
}

.my-summary-card {
  margin-top: 18rpx;
  padding: 26rpx 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 14rpx 34rpx rgba(53, 88, 168, 0.08);
  border: 1rpx solid rgba(92, 137, 230, 0.08);
}

.my-summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.my-summary-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #22304a;
}

.my-summary-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #95a0b6;
}

.my-summary-wallet {
  flex-shrink: 0;
  padding: 12rpx 18rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 700;
}

.my-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: 22rpx;
}

.my-summary-item {
  padding: 18rpx 12rpx;
  border-radius: 22rpx;
  background: #f6f9ff;
  text-align: center;
}

.my-summary-value {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #25314b;
}

.my-summary-label {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #8f9ab0;
}

.gui-card-img {
    width: 150rpx;
    height: 150rpx;
    border-radius: 150rpx;
}

@keyframes avatarEnter {
  0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
  60% { transform: scale(1.06) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes avatarWiggle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  50% { transform: rotate(-12deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
}

.my-avatar {
  animation: avatarEnter 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 6rpx solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 14rpx 30rpx rgba(22, 119, 255, 0.12);
}

.my-avatar-wiggle {
  animation: avatarWiggle 0.32s ease-out both;
}

.my-avatar-hover .my-avatar {
  transform: scale(1.05);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.18);
}

.my-username {
  opacity: 0;
  transform: translateX(-20rpx);
  animation: myNameIn 0.35s ease-out forwards;
}

@keyframes myNameIn {
  to { opacity: 1; transform: translateX(0); }
}

.my-entry {
  padding: 12rpx 18rpx;
  border-radius: 18rpx;
  background: transparent;
  box-shadow: none;
  transition: transform 0.25s ease-out;
}

.my-entry-text {
  padding-left: 10rpx;
  font-size: 24rpx;
  color: #24304a;
}

.my-entry-hover:active {
  transform: translateY(-4rpx) scale(0.985);
}

.my-entry-icon {
  color: #3c7dff !important;
}

.my-entry-hover:active .my-entry-icon {
  color: #1d62f0 !important;
}

.my-feature-item {
  padding: 14rpx 0 12rpx;
  border-radius: 18rpx;
  background: transparent;
  box-shadow: none;
  transition: transform 0.25s ease-out;
}

.my-feature-hover:active {
  transform: translateY(-4rpx) scale(0.985);
}

.my-feature-hover:active .gui-grid-text {
  color: #333 !important;
}

.my-feature-icon {
  color: #5a8dff !important;
  font-size: 32rpx !important;
}

.my-feature-vip.my-feature-hover:active .my-feature-icon {
  color: #f6d365 !important;
}

.my-feature-panel,
.my-content-panel {
  margin-left: 0;
  margin-right: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}

.my-feature-panel {
  padding-top: 10rpx;
  padding-bottom: 10rpx;
}

.my-content-panel {
  padding-top: 8rpx;
}

.my-service-panel {
  margin: 18rpx 30rpx 0;
}

.my-service-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 12rpx 30rpx rgba(53, 88, 168, 0.08);
  border: 1rpx solid rgba(92, 137, 230, 0.08);
}

.my-service-card + .my-service-card {
  margin-top: 18rpx;
}

.my-service-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.my-service-icon-muted {
  color: #6e84b8;
  background: #eef3ff;
}

.my-service-main {
  flex: 1;
  min-width: 0;
  margin: 0 18rpx;
}

.my-service-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #24304a;
}

.my-service-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: #96a0b5;
}

.my-service-arrow {
  color: #b3bdd1;
}

.my-nav-underline {
  background: linear-gradient(90deg, rgba(161, 196, 253, 1) 0%, rgba(194, 233, 251, 1) 100%);
  border-radius: 10rpx;
  transition: all 350ms ease;
}

@keyframes emptyFloat {
  0% { transform: translateY(0); opacity: 0.85; }
  50% { transform: translateY(-10rpx); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.85; }
}

.my-empty {
  padding: 40rpx 40rpx 70rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.my-empty-badge {
  margin-bottom: 24rpx;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #4d7cc8;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8rpx 18rpx rgba(31, 41, 55, 0.05);
  border: 1rpx solid rgba(161, 196, 253, 0.35);
}

.my-empty-icon-wrap {
  position: relative;
  width: 176rpx;
  height: 176rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.04), inset 0 4rpx 10rpx rgba(255, 255, 255, 0.9);
  margin-bottom: 28rpx;
  animation: emptyFloat 3.5s ease-in-out infinite;
}

.my-empty-icon {
  z-index: 2;
}

.my-empty-icon-subscribe {
  color: #4a8cff !important;
}

.my-empty-icon-collect {
  color: #ffb31a !important;
}

.my-empty-icon-history {
  color: #7a8ca5 !important;
}

.my-empty-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  background: #1677ff;
  filter: blur(35rpx);
  opacity: 0.15;
  z-index: 1;
  border-radius: 50%;
}

.my-empty-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 2rpx;
  text-align: center;
}

.my-empty-desc {
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.75;
  text-align: center;
  max-width: 520rpx;
}

.my-empty-btn {
  margin-top: 34rpx;
  padding: 18rpx 56rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
  box-shadow: 0 8rpx 24rpx rgba(22, 119, 255, 0.25);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.my-empty-btn-text {
  color: #ffffff;
  font-weight: bold;
  font-size: 30rpx;
  letter-spacing: 2rpx;
}

.my-empty-btn-arrow {
  color: #ffffff;
  font-size: 26rpx;
  margin-left: 8rpx;
}

.my-empty-btn-hover:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(22, 119, 255, 0.15);
}

.gui-creation-live {
    height: auto;
    margin-top: 10rpx;
    padding: 4rpx 0 0;
    border-radius: 0;
    width: auto;
    box-shadow: none;
    background: transparent;
}

.my-quick-entry-row {
  padding: 0 12rpx;
}
</style>
