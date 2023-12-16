# XSS攻击

### XSS 的本质

XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

### 产生XSS攻击的条件

1. 需要向WEB页面注入恶意代码
2. 这些恶意代码能够被浏览器成功执行

因此，Web 应用程序中的所有变量都需要受到保护。确保**所有变量**都经过验证，然后进行转义或清理，这被称为**完美的注入阻力**。任何不经过此过程的变量都是潜在的弱点。框架可以轻松确保变量得到正确验证、转义或清理。

### XSS攻击类型

#### 1、存储型

<img src="https://blog.poetries.top/img/static/gitee/2019/11/93.png" style="zoom:0.4" />

1. 首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中；
2. 然后用户向网站请求包含了恶意 JavaScript 脚本的页面；
3. 当用户浏览该页面的时候，恶意脚本就会将用户的 Cookie 信息等数据上传到恶意服务器。
4. 黑客拿到了用户 Cookie 信息之后，就可以利用 Cookie 信息在其他机器上登录该用户的账号（如下图），并利用用户账号进行一些恶意操作。

#### 2、反射型

我们会发现用户将一段含有恶意代码的请求提交给 Web 服务器，Web 服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。在现实生活中，黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击这些恶意链接，所以对于一些链接我们一定要慎之又慎。

另外需要注意的是，Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方

#### 3、基于DOM的XSS攻击

黑客通过各种手段将恶意脚本注入到用户的页面中，比如在Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据

1. 在 HTML 中内嵌的文本中，恶意内容以 script 标签形成注入。
2. 在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）。
3. 在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签。
4. 在标签的 href、src 等属性中，包含 `javascript:` 等可执行代码。
5. 在 onload、onerror、onclick 等事件中，注入不受控制代码。
6. 在 style 属性和标签中，包含类似 `background-image:url("javascript:...");` 的代码（新版本浏览器已经可以防范）。
7. 在 style 属性和标签中，包含类似 `expression(...)` 的 CSS 表达式代码（新版本浏览器已经可以防范）。



### XSS攻击的危害

1. 劫持Cookie，cookie一般保存了用户登录凭证，浏览器发起的所有请求都会自带上，如果cookie被盗取，用户可以不用通过密码，而直接登录你的账户。
2. 构建Get和POST请求，如果按照上述进行了设置，则无法直接劫持Cookie信息来使用，但是XSS可以在JavaScript中构建Get和POST请求来实现自己的攻击
3. 恶意代码能够直接获取用户的信息，或者利用这些信息冒充用户向网站发起攻击者定义的请求。

在部分情况下，由于输入的限制，注入的恶意脚本比较短。但可以通过引入外部的脚本，并由浏览器执行，来完成比较复杂的攻击策略。

### 阻止XSS攻击

1. 输入过滤：服务端对于明确的输入类型，例如数字、URL、电话号码、邮件地址等等内容，进行**输入过滤**还是必要的。

2. 纯前端渲染，把代码和数据分隔开

3. HTML转义，**在输出到页面之前，对拼接HTML进行转义**

   - 整体的 XSS 防范是非常复杂和繁琐的，我们不仅需要在全部需要转义的位置，对数据进行对应的转义。而且要防止多余和错误的转义，避免正常的用户输入出现乱码。
   - 转义应该在输出 HTML 时进行，而不是在提交用户输入时。

4. 预防DOM型XSS攻击：在使用 `.innerHTML`、`.outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent`、`.setAttribute()` 等。如果用 Vue/React 技术栈，并且不使用 `v-html`/`dangerouslySetInnerHTML` 功能，

   - `.textContent`、`.setAttribute()` 都是安全接收器，会对字符串进行转义

5. **CSP（内容安全策略）**

   + 限制加载其他域下的资源文件，这样即使黑客插入了一个JavaScript文件，这个JavaScript文件也是无法被加载的

   + 禁止向第三方提交数据，这样用户数据也不会外泄

   + 禁止执行内联脚本和未授权脚本

   + 还提供了上报机制，帮助尽快发现XSS攻击，以便尽快修复。

     > 怎么做？
     >
     > 1. 服务器返回 [`Content-Security-Policy`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) HTTP 标头
     >
     > 2. html配置meta标签，[CSP指令](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/default-src)
     >
     >    ```html
     >    <meta
     >      http-equiv="Content-Security-Policy"
     >      content="default-src 'self'; img-src https://*; child-src 'none';" />
     >    ```

6. HttpOnly属性：由于 JavaScript 无法读取设置了 HttpOnly 的 Cookie 数据，所以即使页面被注入了恶意 JavaScript 脚本，也是无法获取到设置了 HttpOnly 的数据。因此一些比较重要的数据我们建议设置 HttpOnly 标志。

### XSS的检测

1. 使用通用 XSS 攻击字符串手动检测 XSS 漏洞。
2. 使用扫描工具自动检测 XSS 漏洞。

### 减少XSS攻击带来的损失

1. 立即修复漏洞
2. 恢复被篡改的数据，恢复备份
3. 通知受影响的用户
4. 审查日志
5. 加强安全措施

### 参考文章

https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#xss-defense-philosophy

















