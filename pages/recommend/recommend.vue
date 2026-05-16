<template>
  <gui-page :customHeader="true" :customFooter="true">
    <template v-slot:gHeader>
      <view class="recommend-top-bar" :class="[headerSolid ? 'recommend-top-bar-solid' : 'recommend-top-bar-transparent']">
        <view class="recommend-top-search" @click="handleToSearch">
          <gui-search :customClass="['glass-search-bar']"></gui-search>
        </view>
        <view class="recommend-top-reserve"></view>
      </view>
    </template>

    <template v-slot:gBody>
      <view class="recommend-page">
        <view class="recommend-glow recommend-glow-left"></view>
        <view class="recommend-glow recommend-glow-right"></view>

        <view class="recommend-hero animate-fade-up">
          <view class="recommend-hero-decor recommend-hero-decor-left"></view>
          <view class="recommend-hero-decor recommend-hero-decor-right"></view>
          <text class="recommend-hero-kicker">DAILY CURATION</text>
          <text class="recommend-hero-title">今天想听点什么</text>
          <text class="recommend-hero-subtitle">从热度、口碑与主题里，挑出更值得停留的声音内容</text>
          <view class="recommend-chip-row">
            <text class="recommend-chip">精选书单</text>
            <text class="recommend-chip">疗愈陪伴</text>
            <text class="recommend-chip">高分热听</text>
          </view>
        </view>

        <view class="recommend-rank-card animate-fade-up">
          <view class="recommend-rank-head">
            <view class="recommend-rank-tab-row">
              <text
                v-for="(tab, index) in rankTabs"
                :key="tab.dimension"
                class="recommend-rank-tab"
                :class="{ 'recommend-rank-tab-active': currentRankTabIndex === index }"
                @click="handleRankTabChange(index)">
                {{ tab.label }}
              </text>
            </view>
            <view class="recommend-rank-more" hover-class="recommend-rank-more-hover" @click="handleToRank">
              <text class="recommend-rank-more-text">更多</text>
              <uni-icons type="right" :size="14" color="#6b7280"></uni-icons>
            </view>
          </view>

          <view class="recommend-rank-caption">
            <text>{{ rankCategoryName }} · 热门音频榜单</text>
          </view>

          <view class="recommend-rank-list">
            <view
              v-for="(item, itemIndex) in rankList"
              :key="`${currentRankDimension}-${item.id}`"
              class="recommend-rank-item"
              hover-class="recommend-rank-item-hover"
              @click="handleToDetail(item.id)">
              <image class="recommend-rank-cover" :src="item.coverUrl" mode="aspectFill"></image>
              <text class="recommend-rank-index" :class="`recommend-rank-index-${itemIndex + 1}`">
                {{ itemIndex + 1 }}
              </text>
              <view class="recommend-rank-item-main">
                <text class="recommend-rank-item-title">{{ item.albumTitle }}</text>
                <text class="recommend-rank-item-desc">{{ item.albumIntro || '精选热门内容，值得继续收听。' }}</text>
                <view class="recommend-rank-item-meta">
                  <text class="recommend-rank-item-badge">{{ currentRankLabel }}</text>
                  <text class="recommend-rank-item-dot">·</text>
                  <text class="recommend-rank-item-play">{{ formatPlayStat(item.playStatNum) }}</text>
                </view>
              </view>
              <view class="recommend-rank-item-action">
                <uni-icons type="right" :size="18" color="#5b6472"></uni-icons>
              </view>
            </view>
            <view v-if="!rankList.length && rankLoading" class="recommend-rank-empty">
              <text>榜单加载中...</text>
            </view>
            <view v-if="!rankList.length && !rankLoading" class="recommend-rank-empty">
              <text>暂无榜单内容</text>
            </view>
          </view>
        </view>

        <view class="waterfall-layout">
          <view
            v-for="(column, columnIndex) in waterfallColumns"
            :key="`column-${columnIndex}`"
            class="waterfall-column">
            <view
              v-for="(item, itemIndex) in column"
              :key="item.id"
              class="recommend-note animate-note-in"
              :style="{ animationDelay: `${((columnIndex + itemIndex * 2) % 10) * 0.02}s` }"
              @click="handleToDetail(item.id)">
              <view class="recommend-note-cover" :style="{ height: `${item.coverHeight}rpx` }">
                <image class="recommend-note-image" :src="item.coverUrl" mode="aspectFill"></image>
                <view class="recommend-note-tag">{{ item.reason }}</view>
              </view>
              <view class="recommend-note-body">
                <text class="recommend-note-title">{{ item.title }}</text>
                <text class="recommend-note-desc">{{ item.desc }}</text>
                <view class="recommend-note-author">
                  <view class="author-dot"></view>
                  <text class="recommend-note-author-text">{{ item.author }}</text>
                </view>
                <view class="recommend-note-actions">
                  <view class="note-action note-action-secondary" hover-class="note-action-hover" @click.stop="handleHate(item.id)">
                    <text class="note-action-text">不感兴趣</text>
                  </view>
                  <view class="note-action note-action-primary" hover-class="note-action-hover" @click.stop="handleCollect(item.id)">
                    <text class="note-action-text" :class="{ 'note-action-text-active': item.collected }">
                      {{ item.collected ? '已收藏' : '收藏' }}
                    </text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="recommend-page-bottom-space"></view>
      </view>
    </template>

    <template v-slot:gFooter>
      <BottomNav></BottomNav>
    </template>
  </gui-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onReachBottom, onPageScroll, onShow } from '@dcloudio/uni-app'
import { albumsService, courseService, search } from '../../api'
import { RecommendItemInterface, SearchItemInterface } from '../../api/search/interfaces'

type RecommendItem = RecommendItemInterface & {
  author: string
  desc: string
  reason: string
  collected: boolean
}
type RenderRecommendItem = RecommendItem & {
  coverHeight: number
}

const PAGE_SIZE = 20
const WATERFALL_COLUMN_COUNT = 2
const coverHeightPresets = [360, 430, 390, 470, 340, 450, 380, 420]
const rankTabs = [
  { label: '推荐榜', dimension: 'hotScore' },
  { label: '播放榜', dimension: 'playStatNum' },
  { label: '订阅榜', dimension: 'subscribeStatNum' },
  { label: '购买榜', dimension: 'buyStatNum' }
] as const
const recommendList = ref<RecommendItem[]>([])
const fetchedAlbumIds = new Set<number>()
const currentPageNo = ref(1)
const total = ref(0)
const loading = ref(false)
const finished = ref(false)
const headerSolid = ref(false)
const currentRankTabIndex = ref(0)
const rankLoading = ref(false)
const DEFAULT_RANK_CATEGORY_ID = 1
const DEFAULT_RANK_CATEGORY_NAME = '推荐榜单'
const rankCategoryName = ref(DEFAULT_RANK_CATEGORY_NAME)
const rankCategoryId = ref<number | string>(DEFAULT_RANK_CATEGORY_ID)
const rankList = ref<SearchItemInterface[]>([])

const recommendationReasonPool = ['今日热门', '首页精选', '近期高热度', '频道好书', '值得一听', '大家都在看']

const resetRecommendState = () => {
  recommendList.value = []
  fetchedAlbumIds.clear()
  currentPageNo.value = 1
  total.value = 0
  finished.value = false
}

const reloadRecommendList = async () => {
  resetRecommendState()
  await fillRecommendBatch()
}

const normalizeAlbumToRecommendItem = (album: RecommendItemInterface, sourceIndex: number): RecommendItem => {
  return {
    ...album,
    author: album.announcerName || '暂无作者信息',
    desc: album.albumIntro || '这本专辑暂时还没有简介',
    reason: album.recommendReason || recommendationReasonPool[sourceIndex % recommendationReasonPool.length],
    collected: !!album.subscribed
  }
}

const fillRecommendBatch = async () => {
  if (loading.value || finished.value) {
    return
  }

  loading.value = true
  try {
    const requestPageNo = currentPageNo.value
    const res = await search.getRecommendAlbums({
      pageNo: requestPageNo,
      pageSize: PAGE_SIZE
    })
    const responseData = res.data
    const responseTotalPages = Number(responseData?.totalPages || 0)
    const currentList = (responseData?.list || [])
      .filter((album) => {
        if (fetchedAlbumIds.has(album.id)) {
          return false
        }
        fetchedAlbumIds.add(album.id)
        return true
      })
      .map((album, index) => normalizeAlbumToRecommendItem(album, index))

    if (currentList.length) {
      recommendList.value.push(...currentList)
    }

    total.value = responseData?.total || recommendList.value.length
    if (!currentList.length) {
      finished.value = true
    } else if (responseTotalPages > 0 && requestPageNo >= responseTotalPages) {
      finished.value = true
    } else if (recommendList.value.length >= total.value && total.value > 0) {
      finished.value = true
    } else {
      currentPageNo.value += 1
    }
  } catch (error) {
    console.log('fillRecommendBatch error', error)
    uni.showToast({
      title: '推荐加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const waterfallList = computed<RenderRecommendItem[]>(() => {
  return recommendList.value.map((item, index) => ({
    ...item,
    coverHeight: coverHeightPresets[index % coverHeightPresets.length]
  }))
})

const waterfallColumns = computed<RenderRecommendItem[][]>(() => {
  const columns: RenderRecommendItem[][] = Array.from({ length: WATERFALL_COLUMN_COUNT }, () => [])
  const columnHeights = Array.from({ length: WATERFALL_COLUMN_COUNT }, () => 0)

  for (const item of waterfallList.value) {
    const targetColumnIndex =
      columnHeights[0] <= columnHeights[1] ? 0 : 1

    columns[targetColumnIndex].push(item)
    columnHeights[targetColumnIndex] += estimateCardHeight(item)
  }

  return columns
})

const estimateCardHeight = (item: RenderRecommendItem) => {
  const titleLines = Math.min(2, Math.max(1, Math.ceil((item.title?.length || 0) / 10)))
  const descLines = Math.min(2, Math.max(1, Math.ceil((item.desc?.length || 0) / 16)))
  const titleHeight = titleLines * 44
  const descHeight = descLines * 36
  const metaHeight = 140
  return item.coverHeight + titleHeight + descHeight + metaHeight
}

const handleToDetail = (albumId: number) => {
  if (!albumId) {
    return
  }
  uni.navigateTo({
    url: `/pages/detail/detail?id=${albumId}`
  })
}

const handleToRank = () => {
  uni.navigateTo({
    url: '/pages/rank/rank'
  })
}

const handleToSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

const handleRankTabChange = (index: number) => {
  if (currentRankTabIndex.value === index) {
    return
  }
  currentRankTabIndex.value = index
  void getRankList()
}

const formatPlayStat = (value?: number) => {
  const safeValue = Number(value || 0)
  if (safeValue >= 100000000) {
    return `${(safeValue / 100000000).toFixed(1).replace(/\.0$/, '')}亿次播放`
  }
  if (safeValue >= 10000) {
    return `${(safeValue / 10000).toFixed(1).replace(/\.0$/, '')}万次播放`
  }
  return `${safeValue}次播放`
}

const currentRankDimension = computed(() => rankTabs[currentRankTabIndex.value]?.dimension || 'hotScore')
const currentRankLabel = computed(() => rankTabs[currentRankTabIndex.value]?.label || '推荐榜')

const getRankList = async () => {
  if (!rankCategoryId.value) {
    return
  }
  rankLoading.value = true
  try {
    const res: any = await albumsService.getRankingList(Number(rankCategoryId.value), currentRankDimension.value)
    rankList.value = (res?.data || []).slice(0, 3)
  } catch (error) {
    console.log('getRankList error', error)
    rankList.value = []
  } finally {
    rankLoading.value = false
  }
}

const syncRankCategoryFromServer = async () => {
  try {
    const categoryRes: any = await courseService.getAllCategory()
    const categoryList = Array.isArray(categoryRes?.data) ? categoryRes.data : []
    const firstCategory = categoryList?.[0]
    if (!firstCategory?.id) {
      return
    }

    const nextCategoryId = firstCategory.id
    const nextCategoryName = firstCategory.name || firstCategory.categoryName || DEFAULT_RANK_CATEGORY_NAME
    const categoryChanged =
      Number(rankCategoryId.value) !== Number(nextCategoryId) || rankCategoryName.value !== nextCategoryName

    rankCategoryId.value = nextCategoryId
    rankCategoryName.value = nextCategoryName

    if (categoryChanged) {
      await getRankList()
    }
  } catch (error) {
    console.log('syncRankCategoryFromServer error', error)
  }
}

const loadRankOverview = async () => {
  try {
    rankList.value = []
    await getRankList()
    await syncRankCategoryFromServer()
  } catch (error) {
    console.log('loadRankOverview error', error)
  }
}

const handleCollect = async (albumId: number) => {
  const item = recommendList.value.find((recommendItem) => recommendItem.id === albumId)
  if (!item) {
    return
  }
  try {
    const res = await albumsService.subscribeAlbum(item.id)
    item.collected = !!res.data
    uni.showToast({
      title: item.collected ? '收藏成功' : '已取消收藏',
      icon: 'none'
    })
  } catch (error) {
    console.log('handleCollect error', error)
  }
}

const handleHate = async (albumId: number) => {
  const targetItem = recommendList.value.find((item) => item.id === albumId)
  if (!targetItem) {
    return
  }
  try {
    const res = await search.dislikeRecommendAlbum(targetItem.id)
    if (!res.data) {
      uni.showToast({
        title: '操作未生效，请先登录',
        icon: 'none'
      })
      return
    }
    recommendList.value = recommendList.value.filter((item) => item.id !== targetItem.id)
    uni.showToast({
      title: '已减少此类推荐',
      icon: 'none'
    })
  } catch (error) {
    console.log('handleHate error', error)
  }
}

onLoad(async () => {
  await Promise.all([fillRecommendBatch(), loadRankOverview()])
})

onShow(() => {
  if (!rankList.value.length && !rankLoading.value) {
    void loadRankOverview()
  }
})

onReachBottom(async () => {
  await fillRecommendBatch()
})

onPageScroll((event) => {
  headerSolid.value = (event?.scrollTop || 0) >= 20
})
</script>

<style scoped lang="scss">
.recommend-top-bar {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 20rpx;
  transition: background 350ms ease, backdrop-filter 350ms ease, -webkit-backdrop-filter 350ms ease;
}

.recommend-top-bar-solid {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.recommend-top-bar-transparent {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.recommend-top-search {
  flex: 1;
  min-width: 0;
}

.recommend-top-reserve {
  width: 200rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.recommend-page {
  position: relative;
  min-height: calc(100vh - 44px - 160rpx);
  padding: 20rpx 18rpx 0;
  background: linear-gradient(180deg, #eef6ff 0%, #f6f8fc 46%, #f4f5f8 100%);
  overflow: hidden;
}

.recommend-glow {
  position: absolute;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  filter: blur(48rpx);
  opacity: 0.55;
  pointer-events: none;
}

.recommend-glow-left {
  top: -100rpx;
  left: -120rpx;
  background: radial-gradient(circle, rgba(78, 145, 255, 0.22) 0%, rgba(78, 145, 255, 0) 72%);
}

.recommend-glow-right {
  top: 140rpx;
  right: -140rpx;
  background: radial-gradient(circle, rgba(255, 126, 166, 0.18) 0%, rgba(255, 126, 166, 0) 72%);
}

.recommend-hero {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 28rpx 26rpx 24rpx;
  border-radius: 34rpx;
  background: linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(247,250,255,0.98) 52%, rgba(240,246,255,0.98) 100%);
  box-shadow: 0 18rpx 36rpx rgba(31, 41, 55, 0.08);
  border: 1rpx solid rgba(255,255,255,0.9);
}

.recommend-hero-decor {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.recommend-hero-decor-left {
  top: -56rpx;
  left: -44rpx;
  width: 180rpx;
  height: 180rpx;
  background: radial-gradient(circle, rgba(110, 169, 255, 0.16) 0%, rgba(110, 169, 255, 0) 72%);
}

.recommend-hero-decor-right {
  right: -50rpx;
  bottom: -66rpx;
  width: 210rpx;
  height: 210rpx;
  background: radial-gradient(circle, rgba(255, 164, 195, 0.16) 0%, rgba(255, 164, 195, 0) 72%);
}

.recommend-hero-kicker {
  position: relative;
  display: block;
  font-size: 18rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
  color: #7fa7db;
}

.recommend-hero-title {
  position: relative;
  display: block;
  margin-top: 10rpx;
  font-size: 48rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #1f2937;
}

.recommend-hero-subtitle {
  position: relative;
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #7b8798;
}

.recommend-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 18rpx;
}

.recommend-chip {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: #4a6fa7;
  background: rgba(255, 255, 255, 0.78);
  border: 1rpx solid rgba(141, 183, 245, 0.2);
  box-shadow: inset 0 1rpx 0 rgba(255,255,255,0.88);
}

.recommend-rank-card {
  position: relative;
  z-index: 1;
  margin-top: 18rpx;
  padding: 22rpx 22rpx 18rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 18rpx 38rpx rgba(31, 41, 55, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.92);
}

.recommend-rank-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.recommend-rank-tab-row {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 24rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.recommend-rank-tab {
  position: relative;
  flex-shrink: 0;
  padding-bottom: 10rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #a1a7b2;
  transition: color 0.18s ease;
}

.recommend-rank-tab-active {
  color: #111827;
}

.recommend-rank-tab-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #1677ff 0%, #68a7ff 100%);
}

.recommend-rank-more {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #f5f7fb;
}

.recommend-rank-more-hover {
  opacity: 0.88;
}

.recommend-rank-more-text {
  font-size: 22rpx;
  color: #6b7280;
}

.recommend-rank-caption {
  margin-top: 14rpx;
  font-size: 22rpx;
  color: #9aa3af;
}

.recommend-rank-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 12rpx;
  min-height: 372rpx;
}

.recommend-rank-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 12rpx 4rpx;
  border-radius: 22rpx;
}

.recommend-rank-item-hover {
  background: rgba(247, 249, 252, 0.95);
}

.recommend-rank-cover {
  width: 116rpx;
  height: 116rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  background: #edf2f7;
}

.recommend-rank-index {
  width: 28rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.recommend-rank-index-1 {
  color: #f59e0b;
}

.recommend-rank-index-2 {
  color: #8aa0b8;
}

.recommend-rank-index-3 {
  color: #d97706;
}

.recommend-rank-item-main {
  flex: 1;
  min-width: 0;
}

.recommend-rank-item-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 32rpx;
  line-height: 1.35;
  font-weight: 700;
  color: #1f2937;
}

.recommend-rank-item-desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.5;
  color: #6b7280;
}

.recommend-rank-item-meta {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 12rpx;
  min-width: 0;
}

.recommend-rank-item-badge {
  flex-shrink: 0;
  padding: 4rpx 10rpx;
  border-radius: 10rpx;
  font-size: 20rpx;
  font-weight: 700;
  color: #5a7fc0;
  background: #edf4ff;
}

.recommend-rank-item-dot {
  flex-shrink: 0;
  font-size: 20rpx;
  color: #a3acb8;
}

.recommend-rank-item-play {
  min-width: 0;
  font-size: 22rpx;
  color: #8b95a1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommend-rank-item-action {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f3f5f8;
}

.recommend-rank-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #9ca3af;
}

.waterfall-layout {
  position: relative;
  z-index: 1;
  margin-top: 18rpx;
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}

.waterfall-column {
  flex: 1;
  min-width: 0;
}

@keyframes noteIn {
  0% {
    opacity: 0;
    transform: translate3d(0, 28rpx, 0) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

.animate-note-in {
  opacity: 0;
  animation: noteIn 0.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.recommend-note {
  margin-bottom: 18rpx;
  overflow: hidden;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18rpx 36rpx rgba(31, 41, 55, 0.08);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.recommend-note:active {
  transform: scale(0.98);
  box-shadow: 0 10rpx 20rpx rgba(31, 41, 55, 0.06);
}

.recommend-note-cover {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #eef3ff;
}

.recommend-note-image {
  width: 100%;
  height: 100%;
  display: block;
}

.recommend-note-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  color: #fff;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.recommend-note-body {
  padding: 18rpx 18rpx 20rpx;
}

.recommend-note-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 28rpx;
  line-height: 1.45;
  font-weight: 600;
  color: #1f2937;
}

.recommend-note-desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.65;
  color: #7d8696;
}

.recommend-note-author {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 14rpx;
}

.author-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #1677ff 0%, #64a8ff 100%);
  box-shadow: 0 0 0 8rpx rgba(22, 119, 255, 0.1);
}

.recommend-note-author-text {
  flex: 1;
  min-width: 0;
  font-size: 21rpx;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommend-note-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 18rpx;
}

.note-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  border-radius: 999rpx;
  transition: transform 0.18s ease, background 0.18s ease;
}

.note-action-hover {
  transform: scale(0.96);
}

.note-action-secondary {
  background: #f4f6fa;
}

.note-action-primary {
  background: rgba(22, 119, 255, 0.08);
}

.note-action-text {
  font-size: 22rpx;
  color: #6b7280;
}

.note-action-text-active {
  color: #1677ff;
  font-weight: 600;
}

.recommend-page-bottom-space {
  height: 180rpx;
}
</style>
