<template>
  <view class="gui-wrapper">
    <view class="gui-menu-wrap">
      <scroll-view
        scroll-y
        scroll-with-animation
        class="gui-tab-view menu-scroll-view"
        :scroll-top="scrollTop"
        :scroll-into-view="itemId"
      >
        <view
          v-for="(item, index) in tabBar"
          :key="index"
          class="gui-tab-item"
          :class="[current == index && 'gui-tab-item-active']"
          @tap.stop="switchMenu(index)"
        >
          <text class="u-line-1">{{ item.categoryName }}</text>
        </view>
      </scroll-view>
      <scroll-view
        :scroll-top="scrollRightTop"
        scroll-y
        scroll-with-animation
        class="gui-right-box"
        @scroll="rightScroll"
      >
        <view class="gui-page-view">
          <view class="gui-class-item" :id="'item' + index" v-for="(item, index) in tabBar" :key="index">
            <view class="gui-item-title">
              <text>{{ item.categoryName }}</text>
            </view>
            <view class="gui-item-container">
              <view @click="handleNavItemOnClick(item1)" class="gui-thumb-box" v-for="(item1, index1) in item.categoryChild" :key="index1">
                <view class="gui-item-menu-name">{{ item1.categoryName }}</view>
              </view>
            </view>
            <view style="height:100rpx;width: 10px;"></view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, ref, toRef, onMounted, getCurrentInstance } from "vue"
import { courseService } from "../../api"
import { CategoryTreeInterface } from "../../api/category/interfaces"
let scrollTop = ref(0) // tab标题的滚动条位置
let oldScrollTop = ref(0) // 上一次tab标题的滚动条位置
let current = ref(0) // 预设当前项的值
let menuHeight = ref(0) // 左边菜单的高度
let menuItemHeight = ref(0) // 左边菜单item的高度
let itemId = ref("") // 栏目右边scroll-view用于滚动的id
const tabBar = ref<CategoryTreeInterface[]>([])
let navItemsHeightList = ref([]) // 保存每个栏目的高度
let scrollRightTop = ref(0) // 右边栏目scroll-view的滚动条高度
const instance = getCurrentInstance() // 获取组件实例
// 页面可以通过定义 props 来直接接收 url 传入的参数
// 如：uni.navigateTo({ url: '/pages/index/index?id=10' })
const props = defineProps({
  category1Id:{
    type: Number || String,
    required: true,
  }, // 一级分类Id
  pageTitle:{
    type: String,
    required: true,
  }, // 一级分类Id
});


/* 方法 */
// 根据一级分类id获取全部分类信息
const getCategoryTree = async () => {
  try {
    const res = await courseService.getCategory1IdAllInfo(props.category1Id)
    tabBar.value = res.data.categoryChild || []
  } catch (error) {
    console.log(error)
  }
}
// 导航被点击
const handleNavItemOnClick = (item:CategoryTreeInterface) => {
  // 去往分类搜索搜索
  uni.navigateTo({
    url: `/pages/search/search?category1Id=${props.category1Id}&category3Id=${item.categoryId}&pageTitle=${item.categoryName}`
  })
}
// 获取每个栏目的高度
function getMenuItemTop() {
  new Promise((resolve) => {
    let selectorQuery = uni.createSelectorQuery()
    selectorQuery
      .selectAll(".gui-class-item")
      .boundingClientRect((rects) => {
        if (!rects.length) {
          setTimeout(() => {
            getMenuItemTop()
          }, 10)
          return
        }
        rects.forEach((rect) => {
          navItemsHeightList.value.push(rect.top - rects[0].top)
          resolve()
        })
      })
      .exec()
  })
}

// 切换栏目
const switchMenu = async (index) => {
  // 如果没有获取到每个栏目的高度，就先获取
  if (navItemsHeightList.value.length === 0) {
    await getMenuItemTop()
  }
  // 如果点击的是当前栏目，就不执行
  if (index == current.value) return
  // 设置右边栏目的id
  scrollRightTop.value = oldScrollTop.value
  // 设置右边栏目的滚动条位置
  await nextTick(() => {
    scrollRightTop.value = navItemsHeightList.value[index]
    current.value = index
    leftMenuStatus(index)
  })
}

// 左边菜单的状态
const leftMenuStatus = async (index) => {
  current.value = index
  if (menuHeight.value === 0 || menuItemHeight.value === 0) {
    await getElRect("menu-scroll-view", "menuHeight")
    await getElRect("gui-tab-item", "menuItemHeight")
  }
  await nextTick() // 需要 nextTick的等待

  menuHeight.value = instance.proxy.menuHeight
  menuItemHeight.value = instance.proxy.menuItemHeight

  scrollTop.value = index * menuItemHeight.value + menuItemHeight.value / 2 - menuHeight.value / 2
}

// 获取一个目标元素的高度
async function getElRect(elClass, dataVal) {
  new Promise((resolve, reject) => {
    const query = uni.createSelectorQuery().in(instance)
    query
      .select("." + elClass)
      .fields(
        {
          size: true,
        },
        (res) => {
          // 如果节点尚未生成，res值为null，循环调用执行
          if (!res) {
            setTimeout(() => {
              getElRect(elClass, dataVal)
            }, 10)
            return
          }
          instance.proxy[dataVal] = res.height
          resolve()
        }
      )
      .exec()
  })
}
// 右边栏目的滚动事件
const rightScroll = async (e) => {
  oldScrollTop.value = e.detail.scrollTop
  if (navItemsHeightList.value.length == 0) {
    await getMenuItemTop()
  }
  if (!menuHeight.value) {
    await getElRect("menu-scroll-view", "menuHeight")
  }
  setTimeout(() => {
    let scrollHeight = e.detail.scrollTop + menuHeight.value / 2
    for (let i = 0; i < navItemsHeightList.value.length; i++) {
      let height1 = navItemsHeightList.value[i]
      let height2 = navItemsHeightList.value[i + 1]
      if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
        leftMenuStatus(i)
        return
      }
    }
  }, 10)
}

/* 生命周期 */
onMounted(async () => {
  uni.setNavigationBarTitle({
    title: props.pageTitle || '分类'
  });
  await getCategoryTree() // 获取全部分类信息
  await getMenuItemTop() // 获取每个栏目的高度
  await leftMenuStatus(0) // 初始化左边菜单的状态
})
</script>

<style lang="scss" scoped>
.gui-wrapper {
  height: calc(100vh);
  /* #ifdef H5 */
  height: calc(100vh - var(--window-top));
  /* #endif */
  display: flex;
  flex-direction: column;
}

.gui-menu-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.gui-tab-view {
  width: 214rpx;
  height: 100%;
  padding: 16rpx 12rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #edf3f9 0%, #f6f8fb 100%);
}

.gui-tab-item {
  min-height: 104rpx;
  margin-bottom: 14rpx;
  padding: 18rpx 16rpx 18rpx 24rpx;
  background: transparent;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 24rpx;
  font-size: 26rpx;
  color: #64748b;
  font-weight: 500;
  line-height: 1.35;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
}

.gui-tab-item:active {
  transform: scale(0.97);
  background: rgba(255, 255, 255, 0.72);
}

.gui-tab-item-active {
  position: relative;
  color: #2f3b52;
  font-weight: 700;
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
  box-shadow: 0 10rpx 22rpx rgba(148, 163, 184, 0.14);
}

.gui-tab-item-active::before {
  content: "";
  position: absolute;
  width: 8rpx;
  height: 38rpx;
  left: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 999rpx;
  background: linear-gradient(180deg, #6aa8ff 0%, #4b8dff 100%);
}

.gui-tab-view {
  height: 100%;
}

.gui-right-box {
  background-color:#f6f6f6;
}

.gui-page-view {
  padding: 18rpx;
}

.gui-class-item {
  margin-bottom: 26rpx;
  padding: 20rpx 18rpx 10rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 8rpx 24rpx rgba(31, 41, 55, 0.05);
}

.gui-class-item:last-child {
  min-height: 100vh;
}

.gui-item-title {
  padding-left: 8rpx;
  font-size: 28rpx;
  color: #334155;
  font-weight: 700;
}

.gui-item-menu-name {
  font-weight: 600;
  font-size: 28rpx;
  line-height: 1.4;
  color: #2f3b52;
  text-align: center;
}

.gui-item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 18rpx;
  margin-top: 22rpx;
}

.gui-thumb-box {
  width: calc((100% - 18rpx) / 2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 118rpx;
  margin-top: 0;
  padding: 0 18rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%);
  border: 1rpx solid #dde8f7;
  border-radius: 26rpx;
  color: #4b5563;
  box-sizing: border-box;
  box-shadow: 0 8rpx 20rpx rgba(148, 163, 184, 0.12);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.gui-thumb-box:active {
  transform: scale(0.97);
  border-color: #bfd7ff;
  background: linear-gradient(180deg, #ffffff 0%, #edf5ff 100%);
  box-shadow: 0 12rpx 24rpx rgba(75, 141, 255, 0.16);
}

</style>
