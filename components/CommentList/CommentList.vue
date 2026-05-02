<template>
  <view class="comment-page">
    <z-paging
      ref="zPagingRef"
      v-model="commentList"
      @query="getComment"
      :default-page-size="30"
      show-refresher-update-time
      auto-show-back-to-top>
      <template #top>
        <view class="comment-hero-card">
          <view class="comment-hero-head">
            <text class="comment-hero-title">聊聊这段声音</text>
            <text class="comment-hero-subtitle">说说感受，也能快速回复其他人</text>
          </view>
          <view class="comment-composer">
            <uni-easyinput
              trim
              v-model="commentEmptyInfo.replyRelevantInformation.replyContent"
              :placeholder="commentEmptyInfo.replyRelevantInformation.replyPlaceholder"
              :inputBorder="false"
              class="comment-composer-input">
            </uni-easyinput>
            <view class="comment-composer-footer">
              <text class="comment-composer-tip">文明发言，友好交流</text>
              <text
                @click.stop="handleReplyComment(commentEmptyInfo)"
                class="comment-submit-btn">
                发布
              </text>
            </view>
          </view>
        </view>
      </template>

      <view class="comment-list">
        <view
          class="comment-card"
          v-for="(item, index) in commentList"
          :key="index">
          <image :src="item.avatarUrl" class="comment-avatar"></image>
          <view class="comment-main">
            <view class="comment-header">
              <view class="comment-user">
                <text class="comment-name">{{ item.nickname }}</text>
                <text class="comment-time">{{ item.createTime }}</text>
              </view>
              <view
                @click="handlePraise(item)"
                class="comment-like-btn"
                :class="[item.isPraise ? 'comment-like-btn-active' : '']">
                <text class="gui-icons comment-like-icon">&#xe6ea;</text>
                <text class="comment-like-count">{{ item.praiseCount }}</text>
              </view>
            </view>

            <view @click="handleOnClickItemReply(item, item)" class="comment-content padding-r">
              {{ item.content }}
              <uni-icons
                @click="handleDeleteComment(item,index)"
                v-if="item.deleteMark === '1'"
                custom-prefix="iconfont"
                type="shanchu"
                class="comment-delete-icon"
                size="12">
              </uni-icons>
            </view>

            <view v-if="item.replyCommentList" class="comment-reply-list">
              <view
                v-for="(itemRe, indexRe) in item.replyCommentList"
                :key="itemRe.id"
                class="comment-reply-card">
                <view @click.stop="handleOnClickItemReply(item, itemRe)" class="gui-relative padding-r comment-reply-text">
                  <text class="comment-reply-name">{{ itemRe.nickname }}</text>
                  <text v-if="itemRe.parent" class="comment-reply-arrow">回复</text>
                  <text v-if="itemRe.parent" class="comment-reply-name">{{ itemRe.parent?.nickname }}</text>
                  <text>：{{ itemRe.content }}</text>
                  <uni-icons
                    @click="handleDeleteComment(itemRe,index,indexRe)"
                    v-if="itemRe.deleteMark === '1'"
                    custom-prefix="iconfont"
                    type="shanchu"
                    class="comment-delete-icon"
                    size="12">
                  </uni-icons>
                </view>
              </view>
            </view>

            <view class="comment-reply-box">
              <uni-easyinput
                trim
                v-model="item.replyRelevantInformation.replyContent"
                :placeholder="item.replyRelevantInformation.replyPlaceholder"
                :inputBorder="false"
                class="comment-reply-input">
              </uni-easyinput>
              <text class="comment-reply-target">{{ getReplyTargetLabel(item) }}</text>
              <text @click.stop="handleReplyComment(item)" class="comment-reply-btn">回复</text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue"
import { CommentInterface } from "../../api/comment/interfaces"
import { commentService } from "../../api"
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"

interface ReplyDraft {
  replyPlaceholder: string;
  replyCommentId: string;
  replyContent: string;
}

interface CommentDraftTarget {
  albumId?: number | string;
  id?: string;
  nickname?: string;
  replyRelevantInformation: ReplyDraft;
}

const zPagingRef = ref<InstanceType<typeof ZPaging>>()
const props = defineProps({
  albumId: {
    type: [String, Number] as PropType<string | number>,
    required: true
  },
  trackId: {
    type: [String, Number] as PropType<string | number>,
    required: true
  }
})
// 专辑评论列表
const commentList = ref([] as CommentInterface[])
// 列表评论为空时候的构造回复内容对象
const createReplyDraft = (replyCommentId = "0", replyName = ""): ReplyDraft => ({
  replyPlaceholder: replyName ? `回复${replyName}` : "说点什么吧",
  replyCommentId,
  replyContent: ""
})

const commentEmptyInfo = ref<CommentDraftTarget>({
  replyRelevantInformation: {
    ...createReplyDraft()
  }
})

const normalizeComment = (item: CommentInterface): CommentInterface => ({
  ...item,
  replyCommentList: item.replyCommentList || [],
  parent: item.parent || null,
  replyRelevantInformation: createReplyDraft(item.id, item.nickname)
})

const resetReplyDraft = (item: CommentDraftTarget) => {
  const defaultReplyId = item.id || "0"
  const defaultReplyName = item.id ? item.nickname || "" : ""
  item.replyRelevantInformation = createReplyDraft(defaultReplyId, defaultReplyName)
}

const getReplyTargetLabel = (item: CommentDraftTarget) => {
  const placeholder = item.replyRelevantInformation.replyPlaceholder || ""
  return placeholder.startsWith("回复") ? placeholder : "回复当前评论"
}
/**
 * @description: 获取评论列表
 * @returns {*}
 */
const getComment = async (pageNo: number, pageSize: number) => {
  const params = {
    page: pageNo,
    limit: pageSize,
    albumId: props.albumId,
    trackId: props.trackId
  }
  try {
    const res = await commentService.getCommentList(params)
    const records = (res.data?.records || []).map((item) => normalizeComment(item))
    zPagingRef.value?.complete(records)
  } catch (error) {
    console.log(error)
    zPagingRef.value?.complete(false)
  }

}
// 点赞
const handlePraise = async (item: CommentInterface) => {
  try {
    const previousPraiseStatus = !!item.isPraise
    const res = await commentService.praiseComment(item.albumId, item.id)
    item.isPraise = !!res.data
    if (item.isPraise === previousPraiseStatus) {
      return
    }
    item.praiseCount = Math.max((item.praiseCount || 0) + (item.isPraise ? 1 : -1), 0)
  } catch (error) {
    console.log(error)
  }
}
// 点击评论，准备回复评论
const handleOnClickItemReply = (item: CommentInterface, clickItem: CommentInterface) => {
  item.replyRelevantInformation.replyCommentId = clickItem.id
  item.replyRelevantInformation.replyPlaceholder = `回复${clickItem.nickname}`
}
// 回复评论
const handleReplyComment = async (item: CommentDraftTarget) => {
  if (!item.replyRelevantInformation.replyContent) {
    uni.showToast({
      title: "请输入回复内容",
      icon: "none",
      duration: 1500
    })
    return
  }
  try {
    const params = {
      albumId: item.albumId || props.albumId,
      trackId: props.trackId,
      replyCommentId: item.replyRelevantInformation.replyCommentId || item.id || "0",
      content: item.replyRelevantInformation.replyContent.trim()
    }
    await commentService.addComment(params.albumId, params.trackId, params.replyCommentId, params.content)
    resetReplyDraft(item)
    zPagingRef.value?.reload()
  } catch (error) {
    console.log(error)
  }
}
// 删除评论
const handleDeleteComment = async (item: CommentInterface,index:number,replyIndex:number = -1) => {
  uni.showModal({
    title: "提示",
    content: "确定删除这条评论吗？",
    success: async ({ confirm }) => {
      if (!confirm) {
        return
      }
      try {
        await commentService.deleteComment(item.albumId, item.id)
        if (replyIndex === -1){
          commentList.value.splice(index,1)
        } else {
          commentList.value[index].replyCommentList?.splice(replyIndex,1)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.comment-page {
  min-height: 100%;
  padding: 14rpx 18rpx 24rpx;
  background: linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%);
  box-sizing: border-box;
}
.comment-hero-card {
  margin-bottom: 16rpx;
  padding: 18rpx 18rpx 16rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10rpx 24rpx rgba(31, 41, 55, 0.05);
}
.comment-hero-head {
  margin-bottom: 12rpx;
}
.comment-hero-title {
  display: block;
  font-size: 30rpx;
  line-height: 1.3;
  font-weight: 700;
  color: #1f2937;
}
.comment-hero-subtitle {
  display: block;
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #8a94a6;
}
.comment-composer {
  padding: 12rpx;
  border-radius: 18rpx;
  background: linear-gradient(180deg, #f9fbff 0%, #f4f7fd 100%);
}
.comment-composer-input,
.comment-reply-input {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 16rpx;
  overflow: hidden;
}
.comment-composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10rpx;
}
.comment-composer-tip {
  font-size: 18rpx;
  color: #98a2b3;
}
.comment-submit-btn,
.comment-reply-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 96rpx;
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #4f9bff 0%, #1677ff 100%);
  color: #fff;
  font-size: 20rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 18rpx rgba(22, 119, 255, 0.16);
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.comment-card {
  display: flex;
  align-items: flex-start;
  padding: 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10rpx 24rpx rgba(31, 41, 55, 0.05);
}
.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(31, 41, 55, 0.08);
}
.comment-main {
  flex: 1;
  min-width: 0;
  margin-left: 14rpx;
}
.comment-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8rpx;
}
.comment-user {
  flex: 1;
  min-width: 0;
}
.comment-name {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: #2563eb;
}
.comment-time {
  display: block;
  margin-top: 2rpx;
  font-size: 18rpx;
  color: #98a2b3;
}
.comment-like-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  min-width: 82rpx;
  height: 42rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background: #f4f7fb;
  color: #94a3b8;
}
.comment-like-btn-active {
  background: rgba(255, 126, 166, 0.12);
  color: #ff5f8f;
}
.comment-like-icon,
.comment-like-count {
  font-size: 18rpx;
}
.comment-content {
  position: relative;
  margin-top: 10rpx;
  font-size: 23rpx;
  line-height: 1.6;
  color: #334155;
}
.comment-reply-list {
  margin-top: 10rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.comment-reply-card {
  padding: 12rpx 14rpx;
  border-radius: 16rpx;
  background: #f5f8fc;
}
.comment-reply-text {
  font-size: 21rpx;
  line-height: 1.5;
  color: #4b5563;
}
.comment-reply-name {
  color: #2563eb;
  font-weight: 600;
}
.comment-reply-arrow {
  margin: 0 6rpx;
  color: #9ca3af;
  font-size: 19rpx;
}
.comment-reply-box {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 10rpx;
  flex-wrap: wrap;
}
.comment-reply-input {
  flex: 1;
  min-width: 0;
}
.comment-reply-target {
  font-size: 18rpx;
  color: #7f8aa3;
  padding: 0 6rpx;
}
.comment-delete-icon {
  position: absolute;
  right: 0;
  top: 2rpx;
  color: #c0c7d2 !important;
}
.padding-r {
  padding-right: 22rpx;
}
</style>
