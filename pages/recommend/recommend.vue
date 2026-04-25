<template>
  <gui-page :customHeader="true" :customFooter="true">
    <template v-slot:gHeader>
      <view class="recommend-header">
        <view class="recommend-header-pill">
          <text class="recommend-header-title">灵感书单</text>
        </view>
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

        <view class="waterfall-layout">
          <view
            v-for="(row, rowIndex) in pairedRows"
            :key="`row-${rowIndex}-${row.items[0]?.id || rowIndex}`"
            class="waterfall-row"
            :class="row.directionClass"
            :style="row.pullUp > 0 ? { marginTop: `-${row.pullUp}rpx` } : null">
            <view v-for="(item, colIndex) in row.items" :key="item.id" class="waterfall-cell">
              <view
                class="recommend-note animate-note-in"
                :style="{ animationDelay: `${((rowIndex * 2 + colIndex) % 10) * 0.02}s` }">
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
                    <view class="note-action note-action-secondary" hover-class="note-action-hover" @click="handleHate(item.id)">
                      <text class="note-action-text">不感兴趣</text>
                    </view>
                    <view class="note-action note-action-primary" hover-class="note-action-hover" @click="handleCollect(item.id)">
                      <text class="note-action-text" :class="{ 'note-action-text-active': item.collected }">
                        {{ item.collected ? '已收藏' : '收藏' }}
                      </text>
                    </view>
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
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { courseService } from '../../api'
import { CategoryListInterface } from '../../api/albums/interfaces'
import { ChannelInterface, GoodsInterface } from '../../api/category/interfaces'
import { recursionTree } from '../../utils/utils'

type RecommendItem = GoodsInterface & {
  author: string
  desc: string
  reason: string
  collected: boolean
}
type RenderRecommendItem = RecommendItem & {
  coverHeight: number
}
type RecommendRow = {
  items: RenderRecommendItem[]
  directionClass: 'waterfall-row-right-down' | 'waterfall-row-left-down'
  pullUp: number
}

const PAGE_SIZE = 20
const ROW_STAGGER_OFFSET = 22
const ROW_VISUAL_GAP = 14
const coverHeightPresets = [360, 430, 390, 470, 340, 450, 380, 420]
const recommendList = ref<RecommendItem[]>([])
const allCategoryList = ref<CategoryListInterface[]>([])
const fetchedAlbumIds = new Set<number>()
const bufferedList = ref<RecommendItem[]>([])
const categoryFetchCursor = ref(0)
const loading = ref(false)
const finished = ref(false)

const recommendationReasonPool = ['今日热门', '首页精选', '近期高热度', '频道好书', '值得一听', '大家都在看']

const postHateFeedback = async (albumId: number) => {
  console.log('postHateFeedback', albumId)
}

const postCollect = async (albumId: number) => {
  console.log('postCollect', albumId)
}

const normalizeAlbumToRecommendItem = (album: GoodsInterface, sourceIndex: number): RecommendItem => {
  return {
    ...album,
    author: album.announcerName || '暂无作者信息',
    desc: album.albumIntro || '这本专辑暂时还没有简介',
    reason: recommendationReasonPool[sourceIndex % recommendationReasonPool.length],
    collected: false
  }
}

const getAllCategoryList = async () => {
  const res = await courseService.getAllCategory()
  recursionTree(res.data, 'name', 'categoryName', 'categoryChild')
  recursionTree(res.data, 'id', 'categoryId', 'categoryChild')
  recursionTree(res.data, 'children', 'categoryChild')
  allCategoryList.value = res.data
}

const appendBufferedPage = () => {
  if (!bufferedList.value.length) {
    return
  }
  let appendCount = Math.min(bufferedList.value.length, PAGE_SIZE)
  if (appendCount % 2 !== 0) {
    appendCount -= 1
  }
  if (appendCount <= 0) {
    return
  }
  const nextPage = bufferedList.value.splice(0, appendCount)
  recommendList.value.push(...nextPage)
}

const collectAlbumsFromChannel = (channelList: ChannelInterface[]) => {
  const collectedItems: RecommendItem[] = []
  channelList.forEach((channel, channelIndex) => {
    channel.list.forEach((album) => {
      if (!fetchedAlbumIds.has(album.id)) {
        fetchedAlbumIds.add(album.id)
        collectedItems.push(normalizeAlbumToRecommendItem(album, channelIndex))
      }
    })
  })
  return collectedItems
}

const fillRecommendBatch = async () => {
  // 如果缓冲池已经有足够数据，直接呈现，实现“秒开”
  if (bufferedList.value.length >= PAGE_SIZE) {
    appendBufferedPage()
    // 静默预加载下一批数据
    preloadNextBatch()
    return
  }

  if (loading.value || finished.value) {
    return
  }

  loading.value = true
  try {
    await fetchMoreIntoBuffer()
    appendBufferedPage()
    // 静默预加载下一批数据
    preloadNextBatch()
  } catch (error) {
    console.log('fillRecommendBatch error', error)
  } finally {
    loading.value = false
  }
}

const fetchMoreIntoBuffer = async () => {
  while (
    (bufferedList.value.length < PAGE_SIZE || bufferedList.value.length % 2 !== 0) &&
    categoryFetchCursor.value < allCategoryList.value.length
  ) {
    const currentCategory = allCategoryList.value[categoryFetchCursor.value]
    categoryFetchCursor.value += 1
    const res = await courseService.getCategory1IdData(currentCategory.id)
    const channelAlbums = collectAlbumsFromChannel(res.data || [])
    if (channelAlbums.length) {
      bufferedList.value.push(...channelAlbums)
    }
  }
  if (categoryFetchCursor.value >= allCategoryList.value.length && bufferedList.value.length % 2 !== 0) {
    bufferedList.value.pop()
  }
  if (!bufferedList.value.length && categoryFetchCursor.value >= allCategoryList.value.length) {
    finished.value = true
  }
}

const preloadNextBatch = async () => {
  // 如果正在加载、已加载完所有分类，或者缓冲池已经有足够数据了，则跳过
  if (loading.value || finished.value || bufferedList.value.length >= PAGE_SIZE) {
    return
  }
  loading.value = true
  try {
    await fetchMoreIntoBuffer()
  } catch (error) {
    console.log('preload error', error)
  } finally {
    loading.value = false
  }
}

const ensureEvenRecommendList = async () => {
  if (recommendList.value.length % 2 === 0) {
    return
  }
  if (!bufferedList.value.length && !finished.value && !loading.value) {
    await fetchMoreIntoBuffer()
  }
  if (bufferedList.value.length) {
    const nextItem = bufferedList.value.shift()
    if (nextItem) {
      recommendList.value.push(nextItem)
    }
    return
  }
  recommendList.value.pop()
}

const waterfallList = computed<RenderRecommendItem[]>(() => {
  return recommendList.value.map((item, index) => ({
    ...item,
    coverHeight: coverHeightPresets[index % coverHeightPresets.length]
  }))
})

const pairedRows = computed<RecommendRow[]>(() => {
  const rows: RecommendRow[] = []
  let previousBridgeGap = 0
  for (let i = 0; i < waterfallList.value.length; i += 2) {
    const pair = waterfallList.value.slice(i, i + 2)
    if (pair.length === 2) {
      const leftHigher = Math.floor(i / 2) % 2 === 0
      const left = pair[0]
      const right = pair[1]
      const maxH = Math.max(left.coverHeight, right.coverHeight)
      const minH = Math.min(left.coverHeight, right.coverHeight)
      rows.push({
        items: [
          { ...left, coverHeight: leftHigher ? maxH : minH },
          { ...right, coverHeight: leftHigher ? minH : maxH }
        ],
        directionClass: leftHigher ? 'waterfall-row-right-down' : 'waterfall-row-left-down',
        pullUp: rows.length === 0 ? 0 : previousBridgeGap
      })
      previousBridgeGap = Math.max(0, maxH - (minH + ROW_STAGGER_OFFSET) - ROW_VISUAL_GAP)
    } else {
      rows.push({
        items: pair,
        directionClass: 'waterfall-row-right-down',
        pullUp: rows.length === 0 ? 0 : previousBridgeGap
      })
    }
  }
  return rows
})

const handleCollect = (albumId: number) => {
  const item = recommendList.value.find((recommendItem) => recommendItem.id === albumId)
  if (!item) {
    return
  }
  item.collected = !item.collected
  uni.showToast({
    title: item.collected ? '已加入收藏' : '已取消收藏',
    icon: 'none'
  })
  // 模拟触发算法权重重新计算的 API 调用
  postCollect(item.id)
}

const handleHate = (albumId: number) => {
  const targetIndex = recommendList.value.findIndex((item) => item.id === albumId)
  if (targetIndex === -1) {
    return
  }

  const item = recommendList.value[targetIndex]
  uni.showToast({
    title: '将减少此类推荐',
    icon: 'none'
  })
  // 模拟反馈接口调用
  postHateFeedback(item.id)
  
  // 模拟从列表中移除
  setTimeout(async () => {
    recommendList.value.splice(targetIndex, 1)
    await ensureEvenRecommendList()
  }, 300)
}

onLoad(async () => {
  await getAllCategoryList()
  await fillRecommendBatch()
})

onReachBottom(async () => {
  await fillRecommendBatch()
})
</script>

<style scoped lang="scss">
.recommend-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.recommend-header-pill {
  padding: 10rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.72);
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 10rpx 24rpx rgba(31, 41, 55, 0.06);
}

.recommend-header-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
  color: #1f2937;
}

.recommend-page {
  position: relative;
  min-height: calc(100vh - 44px - 160rpx);
  padding: 24rpx 18rpx 0;
  background: linear-gradient(180deg, #f7faff 0%, #f9fbff 52%, #f5f6fa 100%);
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
  padding: 30rpx 26rpx 28rpx;
  border-radius: 34rpx;
  background: linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(244,248,255,0.98) 52%, rgba(238,245,255,0.98) 100%);
  box-shadow: 0 20rpx 42rpx rgba(31, 41, 55, 0.08);
  border: 1rpx solid rgba(255,255,255,0.88);
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
  margin-top: 22rpx;
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

.waterfall-layout {
  position: relative;
  z-index: 1;
  margin-top: 22rpx;
}

.waterfall-row {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}

.waterfall-cell {
  flex: 1;
  min-width: 0;
}

.waterfall-row-right-down .waterfall-cell:nth-child(2) {
  margin-top: 22rpx;
}

.waterfall-row-left-down .waterfall-cell:nth-child(1) {
  margin-top: 22rpx;
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
  margin-bottom: 0;
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
