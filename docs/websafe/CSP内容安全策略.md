# CSP内容安全策略（Content Security Policy）

严格的 CSP 在 XSS 的防范中可以起到以下的作用：

- 禁止加载外域代码，防止复杂的攻击逻辑。
- 禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。
- 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。
- 禁止未授权的脚本执行（新特性，Google Map 移动版在使用）。
- 合理使用上报可以及时发现 XSS，利于尽快修复问题。

## CSP概述

CSP 全称为 Content Security Policy，即内容安全策略，是一种开发者定义的安全策略声明，可以阻止恶意内容在受信 web 页面上下文中的执行，减少 XSS、clickjacking、code inject 等攻击。**其主要以“白名单”的形式指定可信的内容来源，或是控制一些安全相关的选项。**



## CSP 策略类型

CSP 有两种策略类型：

- Content-Security-Policy
- Content-Secuirty-Policy-Report-Only

顾名思义，第一种会对违反策略的资源进行拦截阻止，第二种只会对违例进行上报，不会实际阻止拦截不安全的资源。

## CSP 策略语法

一条 CSP 策略可包含多条 CSP 指令 (directive) ，多条 CSP 指令间使用英文分号分隔。CSP 指令由指令名 (directive-name) 和指令值 (directive-value) 两部分组成，中间隔着空格。例如：

```nginx
Content-Security-Policy: default-src 'self'; script-src 'self' *.example.com;
```

## source-list 语法

source-list 是 CSP 中用来表示内容来源的一种语法，也是大多数指令值的形式。CSP 的主要形式是资源“白名单”，如何表示“白名单”自然是其重点，先在本小节介绍 source-list 的语法。

source-list 由一个以上的源表达式（source-expression）组成，使用空格分隔连接。源表达式分为以下几种：

#### 关键字 keyword-source

预定义的关键字，注意：**关键字包括左右两侧的单引号**。

| 关键字          | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| 'none'          | 不允许任何内容源。                                           |
| 'self'          | 与当前文档同源的内容（协议、域名、端口号）。推荐所有指令都包含的关键字。 |
| 'unsafe-inline' | 允许内联资源。包括内联的 script 和 style 元素、内联的事件处理函数（onclick）、内联的 style 样式（元素的 style 属性）和 `javascript:` URL 。存在一定的安全风险，使用需谨慎。 |
| 'unsafe-eval'   | 允许使用 `eval()` 。安全风险较大，不推荐使用。               |

#### 主机源 host-source

主机名或 IP 地址，可带 URL 协议前缀、端口号和资源路径，可使用 `*` 通配前缀子域或端口号。

- `https://*.meituan.net` 使用 https 协议访问 meituan.net 任意子域名的资源
- `127.0.0.1:*` IP 为 127.0.0.1 的、任意端口号的资源
- `http://fecsp.sankuai.com/report` URL 为 http://fecsp.sankuai.com/report 的资源

#### 协议源 scheme-source

匹配特定的协议类型，在移动端开发中使用了自定义的桥协议时比较有用。其形式为协议名 + 英文冒号，如：

- `https:` https协议。
- `data:` data 协议。
- `blob:` blob 协议。
- `meituan:` 自定义的桥协议。

#### 随机源 nonce-source

形如 `'nonce-${随机 base64 值}'`，匹配所有 nonce 属性为指定随机值的元素。

可以用在 lib-flexible、错误监控等必须内联的脚本上来避免 `'unsafe-inline'` 的使用，但最好保证每次访问都是不同的随机值而不是固定值才能保证相对安全。

```html
<!--Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-cXdlcjEyMzQ';-->
<script nonce="cXdlcjEyMzQ">  
  // safe inline script  
  // lib-flexible、埋点等需内联的脚本  
  var _errors = [];  
  window.onerror = function (err) {
    _errors.push(err);  
  };
</script>
```



注意：**两侧英文单引号不可省略**。

#### 哈希源 hash-source

形如 `'${hash算法}-${base64 hash}'`，指定资源的 hash 值。可以防止脚本传输过程中被注入，但实施成本相对较高。

```html
<!-- script-src 'self' 'sha256-9LAG3TcdTu6iBpWdD05hiHRystG+vdxvTSJJudgwXko='; -->
<script>console.log('violation')</script>
```



注意：**两侧英文单引号不可省略**。

### 指令集合

#### fetch-directives

最常用的一类指令，指定特定类型的资源可以从哪些源加载，也就是所谓的 “白名单”。这些指令的值都是 source-list。

| 指令         | 说明                                                         | 备注                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| script-src   | 脚本                                                         |                                                              |
| style-src    | 样式                                                         |                                                              |
| img-src      | 图片                                                         | 需留意 `data:` 协议                                          |
| font-src     | 字体文件                                                     | `@font-face` 。同样需留意 `data:` 协议                       |
| media-src    | 媒体源                                                       | `<audio>` `<video>` `<track>`                                |
| object-src   |                                                              | `<object>` `<embed>` `<applet>`                              |
| child-src    | 即 frame-src 和 worker-src                                   | **已不赞成使用**。请直接使用 frame-src 和 worker-src 。      |
| frame-src    | frame 和 iframe 元素可使用的源                               | `<iframe>` `<frame>`                                         |
| worker-src   | 受信任的 worker 脚本来源                                     | 包括 Worker、SharedWorker、ServiceWorker                     |
| manifest-src | 受信任的 manifest.json 来源                                  |                                                              |
| connect-src  | 使用 JS 接口可访问的 URL                                     | 主要指 XHR、fetch、WebSocket、EventSource                    |
| default-src  | 以上所有指令的 fallback。当以上指令未明确指定时取 default-src 的值。 | 当以上指令被指定时，**会覆盖** default-src 的值，**不会包含** default-src 的资源列表。 |

#### Document directives

这类指令用来控制文档或 worker 的一些属性。

| 指令                      | 说明                                          | Example                                                      |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| base-uri `<sourc-list>`     | 约束 `<base>` 元素能指定的 URL                |                                                              |
| plugin-types `<MIME types>` |                                               | `plugin-types application/pdf;`                              |
| sandbox `<value>`           | 含义和 `<iframe>` 元素的 sandbox 属性值相同。 | `allow-forms` 允许提交表单、`allow-modals` 允许模态弹窗（alert）等 |

#### Navigation directives

用来控制导航行为的一类指令。

| 指令                            | 说明                                                         | 备注                                                         |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| form-action `<source-list>`     | 指定表单可提交的 URL                                         | 提交行为实际发生时才拦截                                     |
| frame-ancestors `<source-list>` | “选爹”。可以通过 `<frame>` `<iframe>` `<object>` `<embed>` `<applet>` 被嵌入的页面 | `frame-ancestors 'none'` 效果等同于 `X-Frame-Options: DENY` 可以防止点击劫持（clickjacking）攻击 |
| navigation-to `<source-list>`   | 所有类型的导航、跳转（a、form、window.location、window.open 等） | **非标准**                                                   |

#### Reporting directives

`report-uri <uri>` 指定 CSP 违例的上报地址。当浏览器发现 CSP 规则被违反的时候会向 report-uri 指定的 uri POST 一条 JSON 格式的数据：

```html
POST /report-uri HTTP/1.1
...
Content-Type: application/csp-report

{
  "csp-report": {
    "document-uri": "http://example.com/signup.html",
    "referrer": "",
    "blocked-uri": "http://example.com/css/style.css",
    "violated-directive": "style-src cdn.example.com",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports"
  }
}
```



注意：**CSP report 请求的 Content-Type 为 `application/csp-report` ，不是 `application/json`**。部分 body-parser 类中间件未对 `application/csp-report` MIME type 进行处理，因此无法拿到上报数据。

## CSP 的使用方式

### HTML meta 元素

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

使用 meta 元素设置 CSP 时，需要将 meta 元素尽可能声明在文档的顶部，因为 meta 元素设置的策略无法应用于先于它声明的元素。**使用 JS 动态修改 meta 标签不会生效**。

标准规定使用 meta 标签 http-equiv 设置 CSP 策略时不可以使用 `Content-Security-Policy-Report-Only` 和 `report-uri`，`frame-ancestors`，`sandbox` 等指令。

### HTTP 响应头

```
HTTP/1.1 200 OK
...
Content-Security-Policy: default-src 'self'; script-src 'self' *.example.com; report-uri /_csp-report
```

线上部署 CSP 时推荐使用 HTTP 响应头设置 CSP 策略，因为：

1. HTTP 响应头对 CSP 策略的支持最完整
2. HTTP 响应头设置的策略对整个文档都生效
3. 可同时配置多个 HTML 文档，统一修改维护更方便

## CSP 实践方案

策略制定不当可能会拦截正常的资源，影响业务功能，一不小心半年绩效就没了。因此 CSP 的部署实施需要慎重，可以按以下步骤执行：

1. 使用 HTML meta 标签在本地或 Dev 环境进行初步的策略制定
2. 使用 Content-Security-Policy-Report-Only HTTP Response Header 进行线上验证
3. 根据线上收集的违例数据完善 CSP 策略
4. 改用 Content-Security-Policy Header 进行实际的拦截阻止

**Tip**：可以将 Content-Security-Policy 和 Content-Security-Policy-Report-Only 响应头的切换、应用的 CSP 策略做成配置项，可以避免后端频繁发布，出现问题时也能及时修改补救。