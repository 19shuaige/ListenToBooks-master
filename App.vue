<script>
export default {
  onLaunch: function () {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation("portrait-primary");
    const dom = weex.requireModule("dom");
    dom.addRule("fontFace", {
      fontFamily: "graceIconfont",
      src: "url('/static/font/grace.ttf')",
    });
    // #endif
  },
  onShow: function () {},
  onHide: function () {},
};

</script>
<style lang="scss">
/* 加载阿里图标字体 */
@import "./static/font/ali/index.css";
/* 加载框架核心样式 */
@import "./Grace6/css/grace.scss";
/* 加载深色模式适配样式 */
// @import "./Grace6/css/graceDark.scss";
/* 加载自定义样式 */
@import "./custom/custom.scss";
/* 引入颜色库 */
@import "./Grace6/css/colors.css";

@import "./custom/iconfont.scss";
/* 加载图标字体 - 条件编译模式 */
/* #ifdef APP-PLUS-NVUE */
.gui-icons {
  font-family: graceIconfont;
}
/* #endif */
/* #ifndef APP-NVUE */
page {
  background: #f8f9fa; /* 柔和浅色背景 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 全局毛玻璃特效 */
.glass-effect {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.glass-effect-dark {
  background: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 优雅的卡片阴影与圆角 */
.soft-card {
  border-radius: 24rpx !important;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05) !important;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.soft-card:active {
  transform: scale(0.98);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.03) !important;
}

/* 播放器 CD 旋转动画 */
@keyframes spinCD {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.cd-spin {
  animation: spinCD 20s linear infinite;
}
.cd-spin-paused {
  animation-play-state: paused !important;
}

/* 首页与全局精美进场动画 */
@keyframes fadeInUpSoft {
  0% { opacity: 0; transform: translateY(40rpx); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeInUpSoft 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 渐变精美徽章（用于标签、VIP等） */
.premium-badge {
  background: linear-gradient(135deg, #ff6b81 0%, #ff4757 100%) !important;
  box-shadow: 0 4rpx 10rpx rgba(255, 71, 87, 0.3);
  border-bottom-right-radius: 16rpx !important;
  border-top-left-radius: 0 !important;
}

/* 玻璃态搜索框 */
.glass-search-bar {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.02);
  border-radius: 48rpx !important;
  padding: 0 12rpx !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.glass-search-bar:focus-within {
  border-color: #1677ff !important;
  box-shadow: 0 8rpx 20rpx rgba(22, 119, 255, 0.15);
  transform: translateY(-2rpx);
  background: rgba(255, 255, 255, 0.95) !important;
}
.glass-search-bar .gui-search-input {
  animation: slideFadeIn 0.3s ease-out;
}

@keyframes slideFadeIn {
  from { opacity: 0; transform: translateX(-10rpx); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes spinOut {
  from { transform: rotate(0) scale(1); opacity: 1; }
  to { transform: rotate(90deg) scale(0); opacity: 0; }
}
.search-clear-anim {
  animation: spinOut 0.2s ease-out forwards;
}
/* #endif */
</style>
