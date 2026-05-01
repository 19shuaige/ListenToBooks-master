<template>
  <view class="search-page">
    <z-paging
      class="search-page-paging"
      ref="zPagingRef"
      v-model="pageInfo.goodsList"
      @query="getSearchAlbumInfo"
      :default-page-size="20"
      :hide-empty-view="!showSearchEmptyState"
      show-refresher-update-time
      auto-show-back-to-top
    >
      <!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
      <template #top>
        <view class="search-top-shell">
          <SearchTop
            :isNeedSearchInput="!category1Id"
            :category1Id="category1Id"
            :isNeedAttrFilter="true"
            :handleSearch="reloadSearch"
            :queryParam="pageInfo.queryParams"></SearchTop>
          <view
            v-if="pageInfo.queryParams.keyword.trim() || category1Id"
            class="search-result-summary">
            <view class="search-result-summary-copy">
              <text class="search-result-summary-title">{{ pageInfo.queryParams.keyword.trim() ? '搜索结果' : props.pageTitle }}</text>
              <text class="search-result-summary-desc">
                {{ pageInfo.queryParams.keyword.trim() ? `“${pageInfo.queryParams.keyword.trim()}”` : '已为你整理相关有声内容' }}
                <text v-if="pageInfo.total"> · {{ pageInfo.total }} 条</text>
              </text>
            </view>
            <view v-if="pageInfo.queryParams.keyword.trim()" class="search-keyword-chip">
              <text>{{ pageInfo.queryParams.keyword.trim() }}</text>
            </view>
          </view>
        </view>
      </template>
      <view
        v-for="(item,index) in pageInfo.goodsList"
        :key="item.id"
        class="search-result-wrap">
        <SearchResultsItem
          :data="item"
          variant="search"></SearchResultsItem>
      </view>
      <template #empty>
        <view v-if="showSearchEmptyState" class="search-empty-state">
          <text class="search-empty-title">暂无相关内容</text>
          <text class="search-empty-desc">换个关键词试试，比如书名、主播或分类</text>
        </view>
      </template>
    </z-paging>
  </view>

</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"
import SearchTop from "../../components/SearchTop/SearchTop.vue"
import { search } from "../../api"
import { SearchItemInterface } from "../../api/search/interfaces"
import Template from "../template/template.vue"
import SearchResultsItem from "../../components/SearchResultsItem/SearchResultsItem.vue"
/* 响应式数据 */
const zPagingRef = ref<InstanceType<typeof ZPaging>>()
const props = defineProps({
  category1Id:{
    type: Number || String,
    default:''
  },
  category2Id:{
    type: Number || String,
    default:''
  },
  category3Id:{
    type: Number || String,
    default:''
  },
  pageTitle:{
    type:String || Number,
    default:'搜索'
  },
})
const pageInfo = reactive({
  // 查询参数
  queryParams: {
    keyword: "",
    category1Id: 0,
    category2Id: 0,
    category3Id: 0,
    attributeList: [],
    order: "",
  },
  // 查询商品列表
  goodsList:[] as SearchItemInterface[]
  ,
  total: 0
})
const showSearchEmptyState = computed(() => {
  return !!pageInfo.queryParams.keyword.trim() || !!pageInfo.queryParams.category3Id
})
// 分类导航

/* 方法 */
// 重载搜索
const reloadSearch = () => {
  console.log("重载搜索")
  zPagingRef.value.reload();
}
// 搜索方法
const getSearchAlbumInfo = async (pageNo:number,pageSize:number) => {
  // 清洗参数 对查询参数进行过滤
  const params = {
    keyword: pageInfo.queryParams.keyword.trim(),
    category1Id: pageInfo.queryParams.category1Id ? pageInfo.queryParams.category1Id : null,
    category2Id: pageInfo.queryParams.category2Id ? pageInfo.queryParams.category2Id : null,
    category3Id: pageInfo.queryParams.category3Id ? pageInfo.queryParams.category3Id : null,
    attributeList: pageInfo.queryParams.attributeList.length > 0 ? pageInfo.queryParams.attributeList : null,
    order: pageInfo.queryParams.order ? pageInfo.queryParams.order : null,
    pageNo,
    pageSize,
  }

  try {
    // keyword和category3Id有一个存在才进行搜索
    if (params.keyword || params.category3Id){
      const res = await search.getSearchAlbumInfo(params)
      pageInfo.total = res.data.total || 0
      zPagingRef.value.complete(res.data.list);
    }else {
      pageInfo.total = 0
      zPagingRef.value.complete([]);
    }
  } catch (e) {
    console.log(e)
  }
}

/* 生命周期 */
onMounted(() => {
  // 初始修改查询参数
  console.log('props.category1Id',props.category1Id,props.category2Id,props.category3Id)
  pageInfo.queryParams.category1Id = props.category1Id
  pageInfo.queryParams.category2Id = props.category2Id
  pageInfo.queryParams.category3Id = props.category3Id
  uni.setNavigationBarTitle({
    title: props.pageTitle || '搜索'
  });
})
</script>

<style lang="scss" scoped>
.search-page {
  position: relative;
  min-height: 100vh;
  background: #f5f6f8;
}

.search-page-paging {
  position: relative;
  z-index: 1;
}

.search-top-shell {
  padding: 12rpx 20rpx 0;
}

.search-result-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14rpx 0 12rpx;
  padding: 18rpx 22rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 6rpx 20rpx rgba(31, 41, 55, 0.04);
}

.search-result-summary-copy {
  flex: 1;
  min-width: 0;
}

.search-result-summary-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #1f2937;
}

.search-result-summary-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  line-height: 1.4;
  color: #7b8797;
}

.search-keyword-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  max-width: 220rpx;
  min-height: 52rpx;
  padding: 0 18rpx;
  margin-left: 16rpx;
  border-radius: 999rpx;
  color: #3f7de8;
  font-size: 21rpx;
  font-weight: 600;
  background: #edf4ff;
}

.search-result-wrap {
  padding: 0 20rpx 16rpx;
}

.search-empty-state {
  margin: 36rpx 20rpx 0;
  padding: 44rpx 32rpx;
  border-radius: 28rpx;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(31, 41, 55, 0.05);
}

.search-empty-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #273244;
}

.search-empty-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: #8a96aa;
}
</style>
