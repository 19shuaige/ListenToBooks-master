<template>
  <gui-page>
    <template v-slot:gBody>
      <view style="padding: 50rpx">
        <view class="gui-flex gui-row gui-justify-content-center">
          <gui-image src="../../static/logo.png" :width="220" :height="220"></gui-image>
        </view>
        <view style="margin-top: 80rpx">
          <form @submit="submit">
            <view>
              <text class="gui-text-small gui-color-gray">手机号</text>
            </view>
            <view class="gui-border-b">
              <input type="number" class="gui-form-input" name="phone" placeholder="请输入手机号" maxlength="11" />
            </view>
            <view class="gui-margin-top">
              <text class="gui-text-small gui-color-gray">密码</text>
            </view>
            <view class="gui-border-b">
              <input type="password" class="gui-form-input" name="password" placeholder="密码" />
            </view>
            <view class="gui-margin-top gui-flex gui-rows gui-space-between" hover-class="gui-tap">
              <text class="gui-text gui-color-gray gui-block gui-text-right" @tap="loginbymsg">短信登录</text>
            </view>
            <view style="margin-top: 38rpx">
              <button
                type="default"
                class="gui-button gui-bg-primary gui-noborder"
                formType="submit"
                style="border-radius: 50rpx"
              >
                <text class="gui-color-white gui-button-text">登 录</text>
              </button>
            </view>
          </form>
        </view>

        <view class="gui-flex gui-rows gui-nowrap gui-align-items-center" style="margin-top: 80rpx">
          <view class="gui-title-line"></view>
          <text class="gui-primary-color gui-h6" style="padding-left: 50rpx; padding-right: 50rpx">其他方式登录</text>
          <view class="gui-title-line"></view>
        </view>
        <view class="gui-flex gui-rows gui-nowrap gui-justify-content-center gui-margin-top">
          <view @click="openWxLoginDialog" class="other-login-icons" hover-class="gui-tap">
            <text class="other-login-icons gui-icons gui-color-gray">&#xe63e;</text>
          </view>
          <view class="other-login-icons" hover-class="gui-tap">
            <text class="other-login-icons gui-icons gui-color-gray">&#xe6cd;</text>
          </view>
        </view>
      </view>
    </template>
  </gui-page>
<!--  微信登陆弹窗-->
  <uni-popup ref="wxLoginDialogRef" type="dialog">
    <uni-popup-dialog type="center" cancelText="取消" confirmText="确定" title="提示" content="是否使用微信进行登陆？" @confirm="userStore.loginWithWechat"></uni-popup-dialog>
  </uni-popup>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from '../../stores/user'
import GuiImage from "../../Grace6/components/gui-image.vue"
import UniPopup from "../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue"
/* 响应式数据 */
const wxLoginDialogRef = ref<InstanceType<typeof UniPopup>>()
const userStore = useUserStore()

/* 方法 */
// 打开微信登陆弹窗
const openWxLoginDialog = () => {
  wxLoginDialogRef.value?.open()
}

const loginbymsg = () => {
  uni.showToast({
    title: "短信登录暂未开放",
    icon: "none"
  })
}

const submit = async (event: { detail?: { value?: Record<string, string> } }) => {
  const formValue = event.detail?.value ?? {}
  const phone = (formValue.phone || "").trim()
  const password = (formValue.password || "").trim()

  if (!/^1\d{10}$/.test(phone)) {
    uni.showToast({
      title: "请输入正确手机号",
      icon: "none"
    })
    return
  }

  if (!password) {
    uni.showToast({
      title: "请输入密码",
      icon: "none"
    })
    return
  }

  await userStore.loginWithPhonePassword({
    phone,
    password
  })
}

/* 生命周期 */
</script>

<style scoped>
.login-logo {
  width: 180rpx;
  height: 180rpx;
  font-size: 80rpx;
  text-align: center;
  line-height: 120rpx;
  padding: 30rpx;
  border-radius: 18rpx;
}
.other-login-icons {
  width: 88rpx;
  height: 88rpx;
  text-align: center;
  font-size: 70rpx;
  margin: 20rpx;
}
</style>
