以后必须死记住的规则
规则1
一个标签里不要重复写同名属性。
尤其是 style、class、ref、v-model 这种最容易重复。
如果有多个样式，合并到一个 style 里写。

规则2
uni-forms 这种表单容器，不要直接写 v-model="formData"。
在这个项目里统一改成：
:model="formData"

也就是说：
表单容器类组件优先传 model，不要用整体 v-model。

规则3
上传组件、文件列表组件、图片列表组件，不要直接把 const reactive([]) 用 v-model 双绑。
比如不要写：
v-model="coverUrlList"

统一改成：
:modelValue="coverUrlList"
@update:modelValue="syncCoverUrlList"

然后在方法里手动同步：
const syncCoverUrlList = (files = []) => {
  coverUrlList.splice(0, coverUrlList.length, ...files)
}

规则4
const reactive 定义出来的对象和数组，只能改内部，不能整体替换。
正确写法：
formData.title = 'xxx'
coverUrlList.push(url)
coverUrlList.splice(0, coverUrlList.length, ...newList)

错误写法：
formData = newData
coverUrlList = newList

规则5
普通输入框可以继续写 v-model="formData.xxx"
这种是安全的，因为它改的是对象内部字段，不是替换整个对象。
比如：
v-model="formData.nickname"
v-model="formData.albumTitle"
v-model="formData.tagId"

这种写法没问题。

规则6
只要是“组件级整体双向绑定”，都要先警惕。
比如下面这些都属于高风险写法：
v-model="formData"
v-model="coverUrlList"
v-model="mediaFileList"

以后看到这种写法，先别急着写，先判断这个组件是不是会把整个值回写回来。
如果会整体回写，就不要直接用 v-model。

规则7
script setup 里不要导入 defineProps、defineEmits、defineExpose。
正确写法是只导入 ref、reactive、computed、watch 这些运行时 API。
defineProps 直接写就行。

规则8
第三方组件先看它 Vue 3 推荐的绑定方式。
以后遇到 uni-ui、uni_modules、自定义组件，先看它到底推荐：
model
modelValue
还是 value

不要一上来就习惯性写 v-model。

四、这个项目以后统一推荐写法
1. 表单对象
const formData = reactive({
  title: '',
  coverUrl: '',
  categoryId: ''
})

2. 表单容器
<uni-forms :model="formData" :rules="formRules" ref="formRef">

3. 输入项
<uni-easyinput v-model="formData.title" />
<uni-data-select v-model="formData.categoryId" />

4. 上传列表
const coverUrlList = reactive([])

const syncCoverUrlList = (files = []) => {
  coverUrlList.splice(0, coverUrlList.length, ...files)
}

组件里写：
:modelValue="coverUrlList"
@update:modelValue="syncCoverUrlList"

五、以后开发时的判断口诀
输入框改字段，可以直接 v-model
表单容器传对象，优先 :model
上传组件绑数组，优先 :modelValue + @update:modelValue
const reactive 只改内容，不整体赋值
script setup 宏不 import
一个标签不要重复属性

六、这次问题的本质一句话总结
不是 uni-app 启动坏了，而是这个项目进入 Vue 3 严格编译后，原来那些旧式、宽松、会整体回写 const 的写法都不再被允许了。

七、以后写这个项目的硬性规范
1. uni-forms 统一使用 :model，不使用 v-model 绑定整个 formData
2. cl-upload 这类上传组件统一使用 :modelValue 和 @update:modelValue
3. 输入组件只允许绑定到 formData.xxx 这种字段级路径
4. reactive 和 reactive([]) 定义成 const 后，不允许整体重新赋值
5. script setup 中不导入 defineProps、defineEmits、defineExpose
6. 模板里不允许重复属性
7. 新增组件时，先确认它的 Vue 3 双向绑定写法，再接入页面

八、你以后最该防的坑
最容易再犯的，不是业务逻辑错误，而是下面这类：
把整个对象拿去 v-model
把整个数组拿去 v-model
给 const 变量做整体赋值
把 Vue 3 编译宏当普通 API 导入
模板里为了图省事重复写 style 或 class

九、最终记忆版
以后在这个项目里写代码，默认按下面这套：
表单容器用 :model
上传组件用 :modelValue + @update:modelValue
输入框用 v-model="formData.xxx"
const reactive 只改内部
script setup 宏不导入
模板属性不重复

如果你愿意，主人，我下一条还能继续给你一份更短的“项目开发禁忌清单”，一屏就能看完。