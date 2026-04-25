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
            <text class="comment-hero-subtitle">说说你的感受，也可以回复别人的评论</text>
          </view>
          <view class="comment-composer">
            <uni-easyinput
              type="textarea"
              trim
              v-model="commentEmptyInfo.replyRelevantInformation.replyContent"
              :placeholder="commentEmptyInfo.replyRelevantInformation.replyPlaceholder"
              :inputBorder="false"
              class="comment-composer-input">
            </uni-easyinput>
            <view class="comment-composer-footer">
              <text class="comment-composer-tip">文明发言，友好交流</text>
              <text
                @click.stop="handleReplyComment(commentEmptyInfo as CommentInterface)"
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
                <view v-if="!itemRe.parent" @click="handleOnClickItemReply(item, itemRe)" class="gui-relative padding-r comment-reply-text">
                  <text class="comment-reply-name">{{ itemRe.nickname }}</text>
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
                <view v-else @click.stop="handleOnClickItemReply(item, itemRe.parent)" class="gui-relative padding-r comment-reply-text">
                  <text class="comment-reply-name">{{ itemRe.parent?.nickname }}</text>
                  <text class="comment-reply-arrow">回复</text>
                  <text class="comment-reply-name">{{ itemRe.nickname }}</text>
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
              <text @click.stop="handleReplyComment(item)" class="comment-reply-btn">回复</text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { CommentInterface } from "../../api/comment/interfaces"
import { commentService } from "../../api"
import ZPaging from "../../uni_modules/z-paging/components/z-paging/z-paging.vue"


const zPagingRef = ref<InstanceType<typeof ZPaging>>()
const props = defineProps({
  albumId: {
    type: String,
    required: true
  },
  trackId: {
    type: String,
    required: true
  }
})
// 专辑评论列表
const commentList = ref([] as CommentInterface[])
// 列表评论为空时候的构造回复内容对象
const commentEmptyInfo = ref({
  replyRelevantInformation: {
    replyPlaceholder: "请输入回复内容",
    replyCommentId: '0',
    replyContent: ""
  }
})
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
  try { // 获取评论列表
    const res = await commentService.getCommentList(params)
    res.data.records.forEach((item) => {
      item.replyRelevantInformation = {
        replyPlaceholder: "请输入回复内容",
        replyCommentId: "",
        replyContent: ""
      }
    })
    zPagingRef.value.complete(res.data.records)
    console.log(res)
  } catch (error) {
    console.log(error)
    zPagingRef.value.complete(false)
  }

}
// 点赞
const handlePraise = async (item: CommentInterface) => {
  const params = {
    albumId: item.albumId,
    commentId: item.id
  }
  const res = await commentService.praiseComment(params.albumId, params.commentId)
  item.isPraise = !item.isPraise
  if (item.isPraise) {
    item.praiseCount++
  } else {
    item.praiseCount--
  }
  console.log(res)
}
// 点击评论，准备回复评论
const handleOnClickItemReply = (item: CommentInterface, clickItem: CommentInterface) => {
  console.log(item)
  item.replyRelevantInformation.replyCommentId = clickItem.id
  item.replyRelevantInformation.replyPlaceholder = `回复${clickItem.nickname}`
}
// 回复评论
const handleReplyComment = async (item: CommentInterface) => {
  if (!item.replyRelevantInformation.replyContent) {
    uni.showToast({
      title: "请输入回复内容",
      icon: "none",
      duration: 1500
    })
    return
  }
  console.log("item", item)
  const params = {
    albumId: item.albumId || props.albumId,
    trackId: props.trackId,
    commentId: item.replyRelevantInformation.replyCommentId || item.id,
    content: item.replyRelevantInformation.replyContent
  }
  const res = await commentService.addComment(params.albumId,params.trackId, params.commentId, params.content)
  console.log(res)
  item.replyRelevantInformation.replyContent = ""
  item.replyRelevantInformation.replyCommentId = "0"
  item.replyRelevantInformation.replyPlaceholder = "请输入回复内容"
  zPagingRef.value.reload()
}
// 删除评论
const handleDeleteComment = async (item: CommentInterface,index:number,replyIndex:number = -1) => {
  const params = {
    albumId: item.albumId,
    commentId: item.id
  }
  const res = await commentService.deleteComment(params.albumId, params.commentId)
  if (replyIndex === -1){
    commentList.value.splice(index,1)
  }else {
    commentList.value[index].replyCommentList?.splice(replyIndex,1)
  }
}
</script>

<style lang="scss" scoped>
.comment-page {
  min-height: 100%;
  padding: 20rpx 22rpx 40rpx;
  background: linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%);
  box-sizing: border-box;
}
.comment-hero-card {
  margin-bottom: 24rpx;
  padding: 26rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14rpx 32rpx rgba(31, 41, 55, 0.06);
}
.comment-hero-head {
  margin-bottom: 20rpx;
}
.comment-hero-title {
  display: block;
  font-size: 34rpx;
  line-height: 1.3;
  font-weight: 700;
  color: #1f2937;
}
.comment-hero-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #8a94a6;
}
.comment-composer {
  padding: 20rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #f9fbff 0%, #f4f7fd 100%);
}
.comment-composer-input,
.comment-reply-input {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20rpx;
  overflow: hidden;
}
.comment-composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.comment-composer-tip {
  font-size: 20rpx;
  color: #98a2b3;
}
.comment-submit-btn,
.comment-reply-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  height: 56rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #4f9bff 0%, #1677ff 100%);
  color: #fff;
  font-size: 22rpx;
  font-weight: 600;
  box-shadow: 0 10rpx 22rpx rgba(22, 119, 255, 0.18);
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
}
.comment-card {
  display: flex;
  align-items: flex-start;
  padding: 24rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 14rpx 32rpx rgba(31, 41, 55, 0.06);
}
.comment-avatar {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 6rpx 18rpx rgba(31, 41, 55, 0.1);
}
.comment-main {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
}
.comment-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}
.comment-user {
  flex: 1;
  min-width: 0;
}
.comment-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #2563eb;
}
.comment-time {
  display: block;
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #98a2b3;
}
.comment-like-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-width: 94rpx;
  height: 50rpx;
  padding: 0 16rpx;
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
  font-size: 20rpx;
}
.comment-content {
  position: relative;
  margin-top: 16rpx;
  font-size: 26rpx;
  line-height: 1.8;
  color: #334155;
}
.comment-reply-list {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.comment-reply-card {
  padding: 16rpx 18rpx;
  border-radius: 20rpx;
  background: #f5f8fc;
}
.comment-reply-text {
  font-size: 23rpx;
  line-height: 1.7;
  color: #4b5563;
}
.comment-reply-name {
  color: #2563eb;
  font-weight: 600;
}
.comment-reply-arrow {
  margin: 0 8rpx;
  color: #9ca3af;
  font-size: 21rpx;
}
.comment-reply-box {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 18rpx;
}
.comment-reply-input {
  flex: 1;
}
.comment-delete-icon {
  position: absolute;
  right: 0;
  top: 4rpx;
  color: #c0c7d2 !important;
}
.padding-r {
  padding-right: 28rpx;
}
</style>
