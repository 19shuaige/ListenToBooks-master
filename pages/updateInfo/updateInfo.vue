<template>
<gui-page>
    <!-- 页面主体 -->
    <template v-slot:gBody>
      <view class="profile-page">
        <view class="profile-preview-card" :style="{ background: `linear-gradient(135deg, ${currentTheme.deepColor} 0%, ${currentTheme.color} 100%)` }">
          <image :src="formData.avatarUrl || userStore.user.avatarUrl" mode="aspectFill" class="profile-preview-avatar"></image>
          <view class="profile-preview-main">
            <text class="profile-preview-name">{{ formData.nickname || '未设置昵称' }}</text>
            <view class="profile-preview-tags">
              <text class="profile-preview-tag">{{ userStore.user.isVip ? 'VIP会员' : '普通用户' }}</text>
              <text class="profile-preview-tag profile-preview-tag-light">ID {{ userStore.user.id || '--' }}</text>
            </view>
            <text class="profile-preview-tip">{{ vipExpireLabel }}</text>
          </view>
        </view>

        <view class="profile-info-card">
          <view class="profile-info-row">
            <text class="profile-info-label">账户余额</text>
            <text class="profile-info-value">￥{{ Number(userStore.amount || 0).toFixed(2) }}</text>
          </view>
          <view class="profile-info-row">
            <text class="profile-info-label">资料状态</text>
            <text class="profile-info-value">{{ profileStatusLabel }}</text>
          </view>
          <view class="profile-info-row">
            <text class="profile-info-label">会员状态</text>
            <text class="profile-info-value">{{ userStore.user.isVip ? '已开通' : '未开通' }}</text>
          </view>
        </view>

        <view class="profile-form-card">
        <uni-forms label-width="100" ref="formDataRef" :rules="formDataRule" :model="formData">
          <!--          专辑名称-->
          <uni-forms-item label="昵称" required name="nickname" validate-trigger="bind">
            <uni-easyinput type="text" v-model="formData.nickname"
                           placeholder="请输入昵称（必填）" />
          </uni-forms-item>
          <!--          专辑封面-->
          <uni-forms-item label="头像" required name="avatarUrl">
            <cl-upload
              class="gui-flex gui-space-between"
              :modelValue="avatarUrlList"
              @update:modelValue="syncAvatarUrlList"
              fileType="image"
              :imageFormData="{
                count:1,
                sizeType:['original', 'compressed'],
              }"
              :listStyle="{
                columns:2,
              }"
              :add="avatarUrlList.length < 1"
              :action="UPLOAD_URL.IMAGE"
              @onSuccess="uploadImgSuccess"></cl-upload>
          </uni-forms-item>
        </uni-forms>
        <button class="profile-submit-btn" @click="submit">保存资料</button>
        <view style="height: 60rpx"></view>
        </view>
      </view>

    </template>
  </gui-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from "vue"
import { user } from "../../api"
import UniForms from "../../uni_modules/uni-forms/components/uni-forms/uni-forms.vue"
import { useUserStore} from "../../stores/user"
import { UPLOAD_URL } from "../../utils/constant"
import { useTheme } from "../../hooks/useTheme"
const userStore = useUserStore()
const { currentTheme, applyTheme } = useTheme()

// 表单校验
const formDataRule = {
  nickname: {
    rules: [
      {
        required: true,
        errorMessage: "请填写昵称"
      }
    ]
  },
  avatarUrl: {
    rules: [
      {
        required: true,
        errorMessage: "请上传头像"
      }
    ]
  },

}

const formData = reactive({
  nickname: userStore.user.nickname,
  avatarUrl: userStore.user.avatarUrl
})

// 表单
const formDataRef = ref<InstanceType<typeof UniForms>>()

// 上传图片列表
const avatarUrlList = reactive<string[]>([userStore.user.avatarUrl])

const syncAvatarUrlList = (files: string[] = []) => {
  avatarUrlList.splice(0, avatarUrlList.length, ...files)
  formData.avatarUrl = files[0] || ''
}

/**
 * @description: 图片上传成功
 * @param {*} res
 * @returns {*}
 */
const uploadImgSuccess = (res: any) => {
  console.log(res)
  syncAvatarUrlList([res.data])
  formData.avatarUrl = res.data
}

const vipExpireLabel = computed(() => {
  if (userStore.user.isVip && userStore.user.vipExpireTime) {
    return `会员有效期至 ${userStore.user.vipExpireTime}`
  }
  return '完善资料后，你的账号主页会展示得更完整'
})

const profileStatusLabel = computed(() => {
  return formData.nickname && formData.avatarUrl ? '已完善' : '待完善'
})

/**
 * @description: 表单提交
 * @returns {*}
 */
const submit = () => {
  formDataRef.value.validate().then(async (res: object) => {
    console.log('--------', res)
    try {
      const res = await user.updateUserInfo(formData)
      uni.navigateBack({
        success: () => {
          userStore.getUserInfo()
        }
      })
    } catch (error) {
      console.log(error)
    }
  }).catch((err:object) => {})
}

onMounted(async () => {
  applyTheme(currentTheme.value.color)
  await userStore.getAccountBalance()
})

</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 24rpx;
  background: linear-gradient(180deg, #f4f7fe 0%, #eef3fd 100%);
}
.profile-preview-card {
  display: flex;
  align-items: center;
  padding: 28rpx;
  border-radius: 30rpx;
  box-shadow: 0 18rpx 40rpx rgba(63, 105, 213, 0.18);
}
.profile-preview-avatar {
  width: 132rpx;
  height: 132rpx;
  border-radius: 50%;
  flex-shrink: 0;
  border: 6rpx solid rgba(255, 255, 255, 0.92);
}
.profile-preview-main {
  flex: 1;
  min-width: 0;
  margin-left: 22rpx;
}
.profile-preview-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
}
.profile-preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 14rpx;
}
.profile-preview-tag {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
}
.profile-preview-tag-light {
  color: rgba(255, 255, 255, 0.9);
}
.profile-preview-tip {
  display: block;
  margin-top: 14rpx;
  font-size: 22rpx;
  line-height: 34rpx;
  color: rgba(255, 255, 255, 0.82);
}
.profile-info-card,
.profile-form-card {
  margin-top: 22rpx;
  padding: 26rpx 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 12rpx 34rpx rgba(53, 88, 168, 0.08);
  border: 1rpx solid rgba(92, 137, 230, 0.08);
}
.profile-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 0;
}
.profile-info-row + .profile-info-row {
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid rgba(102, 132, 196, 0.12);
}
.profile-info-label {
  font-size: 24rpx;
  color: #7f8ba4;
}
.profile-info-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #24304a;
}
.profile-submit-btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 999rpx;
  margin-top: 18rpx;
  background: linear-gradient(135deg, #4e86ff 0%, #6a99ff 100%);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  box-shadow: 0 14rpx 32rpx rgba(61, 108, 221, 0.2);
}
</style>
