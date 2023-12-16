

# CSRF攻击原理及防御

## 什么是CSRF？

CSRF（Cross-site request forgery）跨站请求伪造：黑客通过冒用用户的登录凭证（cookie），在第三方网站向目标网站发送请求，绕过后台用户认证，实现某项用户操作的目的。

举个🌰：

1. 小明登录了A网站，记录下A网站的cookie
2. 随后点击了黑客自制的B网站
3. B网站会向A网站发送请求，并自动携带上可以识别小明身份的cookie
4. A网站收到请求，验证身份，确认是小明
5. 以小明的身份执行了某项操作
6. 完成CSRF攻击，冒充小明并执行了操作。

> cookie里面存着用户登录凭证，服务端会根据cookie进行用户身份验证，对cookie不熟悉的同学可以移步[**Cookie、Session、token小白科普版**](https://juejin.cn/post/7195384787886932024/)这篇文章。

## CSRF漏洞原理

CSRF漏洞是因为web应用程序在用户进行敏感操作时，如修改账号密码、添加账号、转账等，**没有校验表单token或者http请求头中的referer值（没有校验请求来源）**，从而导致恶意攻击者利用普通用户的身份（cookie）完成攻击行为。

**完成CSRF攻击两个必要条件**

1. 登录受信任网站A，并在本地生成Cookie 。
2. 在A的cookie存活期内，访问危险网站B。

## CSRF的攻击类型

攻击的方法多样，这里列举几个例子

## 前情提要

> 服务端`http://localhost:80`
>
> 客户端`http://localhost:3000`
>
> 恶意网站`http://localhost:5500`


>**❗Tip:** 起初，恶意网站是在`http://127.0.0.1:5500`，但是csrf攻击不成功，发出的请求没有带上`cookie`。
>
>**原因：** 客户端登录拿到的`cookie`，没有设置`sameSite`，谷歌浏览器80版本之后，`sameSite`属性默认值为`Lax`，跨站请求不会携带`cookie`，80版本之前默认值为`none`跨站请求就有携带`cookie`。这里单纯为了学习原理，就用了同站的地址。(下面有`SameSite`的详解)

## GET类型的CSRF

```html
<img src="http://localhost:80/aaa?num=10000"/>
```

当用户访问带有以上代码的网站，就会自动向`http://localhost:80`的`/aaa`接口发送`get`请求并携带参数`num=10000`

有同学就会想了，这种方式只能发送get请求，那把接口改成post不就可以防范了。

## POST类型的CSRF

构建一个隐藏的自动提交的表单就可以实现post请求的csrf攻击了

```html
  <form action="http://localhost:80/bbb" id="form" method="post" target="_blank">
    <input type="text" value="10100" name="num" hidden>
    <input type="submit" value="submit" hidden>
  </form>
  <script>
    document.getElementById('form').submit()
  </script>
```

## 链接类型的CSRF

相比前面两种自动发请求的攻击方式，链接类型的需要诱导用户去点击链接才会生效

```html
<a href="http://localhost:80/aaa?num=10100">点击就送女朋友！</a>
```

# CSRF防御

| CSRF攻击的特点                       | 防御手段                           | 具体方法                       |
| ------------------------------------ | ---------------------------------- | ------------------------------ |
| 通常CSRF攻击发生在第三方网站         | 阻止不明外域访问                   | 同源检测、cookie的SameSite属性 |
| 黑客只能冒用用户的登录凭证，不能获取 | 发起请求时，附加本域才能获取的信息 | CSRF token、双重cookie验证     |


## 同源检测

既然CSRF攻击一般发生在第三方网站，如果可以知道出请求来源，就可以将有风险的请求过滤掉。

### 怎么知道请求来源呢？

在HTTP协议请求头中有两个属性：origin，referer

origin由协议、主机、端口组成`https://juejin.cn:80`

referer由协议、主机、端口、路径组成`https://juejin.cn:80/editor/drafts`

服务端通过解析这两个字段，可以知道请求来源，判断是否拦截。

这两个Header在浏览器发起请求时，大多数情况会自动带上，并且不能由前端自定义内容。但是referer有可能会被伪造，origin 在正常浏览器环境下不会被伪造，除非使用中间人攻击。

## CSRF Token

利用攻击者只能冒用登录凭证的特点，我们只要在发请求的时候带上本域才能获取到的信息即可

**`CSRF Token`工作原理:**

1. 用户访问某个表单页面
2. 服务端生成`token`，`token`由随机字符串和时间戳组成，再经过算法加密而来。然后存到`session`中，并将`token`发送给客户端
3. 客户端接收到`token`，为了防止`CSRF`，自然不能再放入`cookie`中，可以存到`localstorage`
4. 客户端将token以参数的形式注入到每个请求中
5. 当最终用户发出请求时，服务器端必须验证请求中Token的存在性和有效性，与会话中找到的Token相比较。如果在请求中找不到Token，或者提供的值与会话中的值不匹配，则应中止请求，应重置Token并将事件记录为正在进行的潜在CSRF攻击。服务器需要判断Token的有效性，验证过程是先解密Token，对比加密字符串以及时间戳，如果加密字符串一致且时间未过期，那么这个Token就是有效的。

事实上，服务端用`session`存储`CSRF Token`压力会很大。具体原因可以看这篇文章（[Cookie、Session、token小白科普版](https://juejin.cn/post/7195384787886932024)）。因此就出现了`JWT`，服务端不用存储`token`，只需要通过计算，即可验证用户身份。

> 这里我觉得token存在localstorage，可以起到防第三方网站的作用，假如CSRF发生在本域是不是就失效了，用户同样可以拿到token。或许可以将服务端发来的token进行加密再存到localstorage，发请求时再解密拿到原来的token。这样即使被拿到，不知道解密算法也没用。

## 双重cookie验证

**工作原理**
1. 用户登录后客户端生成token（随机且加密），放到cookie里面
2. 发请求时，获取cookie值，然后将token放在URL参数中，发给服务端
3. 服务端接收到请求，比较cookie和URL参数中的token是否相同

这样就省去了存储token的资源消耗

## cookie的SameSite属性

`CSRF`攻击已有上述的方法可以防御，谷歌为了从源头解决问题，给`cookie`新增了`SameSite`属性。防止第三方网站自动携带`cookie`去发请求，只能是同站的请求，才能携带`cookie`。

`SameSite`有三个值可取，`Strict`、`Lax`、`None`，自谷歌80版本之后，默认值是`Lax`。

### SameSite=Strict

严格模式，不会被任何第三方网站自动携带。cookie 仅发送到它来源的站点。假如用户登录过网站，再通过百度等方式访问网站，也是需要重新登录，不会保持登录状态。

### SameSite=Lax

限制比Strict宽松一点，获取当前页面的请求可以携带cookie，假如用户登录过网站，再通过百度等方式访问网站，是会保持登录状态的。

### SameSite=None

指定浏览器会在同站请求和跨站请求下继续发送 cookie，但仅在安全的上下文中（即，如果 `SameSite=None`，且还必须设置 `Secure` 属性）

### SameSite的缺点

不过SameSite的兼容性不高，还有就是不支持子域获取cookie，存在`a.com`下的cookie，`editor.a.com`获取不到

## 验证码
验证码能很好遏制CSRF攻击。但是出于用户体验考虑，网站不能给所有的操作都加上验证码。因此验证码只能作为一种辅助手段，不能作为主要解决方案。

# 参考文章


[前端安全系列之二：如何防止CSRF攻击？](https://juejin.cn/post/6844903689702866952)

[Csrf Token防止csrf攻击的原理？](https://segmentfault.com/q/1010000040501451)