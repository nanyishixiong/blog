有些时候我们的前端页面需要用到第三方提供的页面组件，通常会以iframe的方式引入。典型的例子是使用iframe在页面上添加第三方提供的广告、天气预报、社交分享插件等等。

iframe在给我们的页面带来更多丰富的内容和能力的同时，也带来了不少的安全隐患。因为iframe中的内容是由第三方来提供的，默认情况下他们不受我们的控制，他们可以在iframe中运行JavaScirpt脚本、Flash插件、弹出对话框等等，这可能会破坏前端用户体验。

如果说iframe只是有可能会给用户体验带来影响，看似风险不大，那么如果iframe中的域名因为过期而被恶意攻击者抢注，或者第三方被黑客攻破，iframe中的内容被替换掉了，从而利用用户浏览器中的安全漏洞下载安装木马、恶意勒索软件等等，这问题可就大了。

## **如何防御**

还好在HTML5中，iframe有了一个叫做sandbox的安全属性，通过它可以对iframe的行为进行各种限制，充分实现“最小权限“原则。使用sandbox的最简单的方式就是只在iframe元素中添加上这个关键词就好，就像下面这样：
```html
<iframe sandbox src="..."> ... </iframe>
```
sandbox还忠实的实现了“Secure By Default”原则，也就是说，如果你只是添加上这个属性而保持属性值为空，那么浏览器将会对iframe实施史上最严厉的调控限制，基本上来讲就是除了允许显示静态资源以外，其他什么都做不了。比如不准提交表单、不准弹窗、不准执行脚本等等，连Origin都会被强制重新分配一个唯一的值，换句话讲就是iframe中的页面访问它自己的服务器都会被算作跨域请求。

另外，sandbox也提供了丰富的配置参数，我们可以进行较为细粒度的控制。一些典型的参数如下：

- allow-forms：允许iframe中提交form表单
- allow-popups：允许iframe中弹出新的窗口或者标签页（例如，window.open()，showModalDialog()，target=”_blank”等等）
- allow-scripts：允许iframe中执行JavaScript
- allow-same-origin：允许iframe中的网页开启同源策略

更多详细的资料，可以参考[iframe中关于sandbox的介绍](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en/docs/Web/HTML/Element/iframe)。