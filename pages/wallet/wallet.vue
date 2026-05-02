<template>
  <gui-page>
    <template v-slot:gBody>
      <view class="wallet-page">
        <view class="wallet-balance-card">
          <view class="wallet-balance-head">
            <text class="wallet-balance-label">我的钱包</text>
            <text class="wallet-balance-caption">账户余额</text>
          </view>
          <view class="wallet-balance-row">
            <view class="wallet-amount-block">
              <text class="wallet-amount-symbol">￥</text>
              <text class="wallet-amount-value">{{ userStore.amount }}</text>
            </view>
            <view @click="investPopupRef.open()" class="wallet-invest-btn">
              <text class="wallet-invest-btn-text">立即充值</text>
            </view>
          </view>
        </view>

        <view class="wallet-entry-list">
          <navigator url="/pages/fund/fund?id=consume" class="wallet-entry-card">
            <view class="wallet-entry-main">
              <view class="wallet-entry-icon wallet-entry-icon-consume">支</view>
              <view class="wallet-entry-content">
                <text class="wallet-entry-title">消费记录</text>
                <text class="wallet-entry-desc">查看订单消费与余额扣减明细</text>
              </view>
            </view>
            <text class="wallet-entry-arrow gui-icons">&#xe601;</text>
          </navigator>

          <navigator url="/pages/fund/fund?id=invest" class="wallet-entry-card">
            <view class="wallet-entry-main">
              <view class="wallet-entry-icon wallet-entry-icon-invest">充</view>
              <view class="wallet-entry-content">
                <text class="wallet-entry-title">充值记录</text>
                <text class="wallet-entry-desc">查看每一笔充值到账记录</text>
              </view>
            </view>
            <text class="wallet-entry-arrow gui-icons">&#xe601;</text>
          </navigator>
        </view>
      </view>
    </template>
  </gui-page>

  <!-- 弹出层，全集购买 -->
  <gui-popup ref="investPopupRef" position="bottom">
    <view class="gui-relative gui-box-shadow gui-bg-white gui-dark-bg-level-1">
      <text class="gui-icons gui-block gui-absolute-rt gui-h3 gui-p-20" @click="closeInvestPopup">&#xe610;</text>
      <text class="gui-h3 gui-block gui-p-t-20 gui-p-b-20 gui-text-center">充值</text>
      <view class="gui-flex gui-padding gui-wrap gui-row buy-track-container">

        <view
          v-for="(item,index) in investSettingsList"
          :key="index"
          @click="handleInvest(item)"
          class="buy-card gui-text-small gui-flex gui-column gui-align-items-center gui-p-20 gui-border-radius gui-border">
          <text class="gui-text-orange-opacity9 gui-block gui-padding gui-h6">{{ item.name }}</text>
        </view>
        <!--        自定义充值金额-->
        <view
          @click="openCustomAmountPopup"
          class="buy-card gui-text-small gui-flex gui-column gui-align-items-center gui-p-20 gui-border-radius gui-border">
          <text class="gui-block gui-padding gui-h6">自定义</text>
        </view>
      </view>

    </view>
  </gui-popup>
  <!-- 自定义金额 -->
  <uni-popup ref="customAmountPopupRef" type="dialog">
    <uni-popup-dialog
      ref="customAmountDialogRef"
      mode="input"
      title="自定义金额"
      value=""
      before-close
      placeholder="请输入正自然数"
      @confirm="handleCustomizeInvest"></uni-popup-dialog>
  </uni-popup>
</template>

<script setup lang="ts">
import GuiPopup from "../../Grace6/components/gui-popup.vue"
import { onMounted, ref } from "vue"
import { useOrderStore } from "../../stores/order"
import { useUserStore } from "../../stores/user"
import UniPopup from "../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue"
import { useUpdateUserInfo } from "../../hooks/useUpdateUserInfo"
/* 响应式数据 */
const orderStore = useOrderStore()
const userStore = useUserStore()
const investPopupRef = ref<InstanceType<typeof GuiPopup>>()
const customAmountPopupRef = ref<InstanceType<typeof UniPopup>>()

// 充值选项
const investSettingsList = ref([
  {
    price: 10,
    name: "10元"
  },
  {
    price: 20,
    name: "20元"
  },
  {
    price: 30,
    name: "30元"
  },
  {
    price: 50,
    name: "50元"
  },
  {
    price: 100,
    name: "100元"
  }
])
// 分类导航

/* 方法 */
// 关闭重置弹窗
const closeInvestPopup = () => {
  investPopupRef.value.close()
}
// 充值
const handleInvest = (item: typeof investSettingsList.value[0]) => {
  console.log(item)
  // 关闭弹窗
  closeInvestPopup()
  // 调用支付
  orderStore.investAmount(item.price)
}
// 打开自定义金额弹窗，关闭其他弹窗
const openCustomAmountPopup = () => {
  closeInvestPopup()
  customAmountPopupRef.value.open()
}
// 自定义充值金额
const handleCustomizeInvest = (value: string) => {
  const amount = value.trim()
  const regex = /^[1-9]\d*$/
  if (regex.test(amount)) {
    // 关闭弹窗
    customAmountPopupRef.value.close()
    // 调用支付
    orderStore.investAmount(Number(amount))

  } else {
    // 弹出提示
    uni.showToast({
      title: "请输入正自然数",
      icon: "none"
    })
  }


}

onMounted(() => {
  // 更新余额信息
  userStore.getAccountBalance()
})

/* 生命周期 */
</script>

<style lang="scss">
.wallet-page {
  min-height: 100vh;
  padding: 28rpx 24rpx 36rpx;
  background: linear-gradient(180deg, #f4f7fe 0%, #eef3fd 100%);
}
.wallet-balance-card {
  padding: 32rpx 30rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #4f86ff 0%, #6b9aff 100%);
  box-shadow: 0 18rpx 42rpx rgba(61, 106, 214, 0.2);
}
.wallet-balance-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wallet-balance-label {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}
.wallet-balance-caption {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.14);
}
.wallet-balance-row {
  margin-top: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20rpx;
}
.wallet-amount-block {
  display: flex;
  align-items: flex-end;
  color: #ffffff;
}
.wallet-amount-symbol {
  font-size: 34rpx;
  line-height: 1;
  margin-right: 8rpx;
}
.wallet-amount-value {
  font-size: 66rpx;
  line-height: 1;
  font-weight: 700;
}
.wallet-invest-btn {
  flex-shrink: 0;
  padding: 20rpx 32rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10rpx 24rpx rgba(38, 77, 172, 0.16);
}
.wallet-invest-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #3970dd;
}
.wallet-entry-list {
  margin-top: 26rpx;
}
.wallet-entry-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26rpx 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 12rpx 36rpx rgba(53, 88, 168, 0.08);
  border: 1rpx solid rgba(92, 137, 230, 0.08);
}
.wallet-entry-card + .wallet-entry-card {
  margin-top: 20rpx;
}
.wallet-entry-main {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.wallet-entry-icon {
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
.wallet-entry-icon-consume {
  color: #ff6a7a;
  background: rgba(255, 103, 124, 0.12);
}
.wallet-entry-icon-invest {
  color: #4c7cf0;
  background: rgba(76, 124, 240, 0.12);
}
.wallet-entry-content {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
}
.wallet-entry-title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #23304a;
}
.wallet-entry-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #8d98ae;
}
.wallet-entry-arrow {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #b3bdd1;
}
.buy-card {
  width: 160rpx;
  text-align: center;
  margin: 10rpx;
}
</style>
