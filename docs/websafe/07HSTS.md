# HTTP 严格传输安全（HTTP Strict Transport Security）

## 问题：用了 HTTPS 也可能掉坑里

为了保护信息在传输过程中不被泄露，保证传输安全，使用 TLS 或者通俗的讲，使用 HTTPS 已经是当今的标准配置了。然而事情并没有这么简单，即使是服务器端开启了 HTTPS，也还是存在安全隐患，黑客可以利用 SSL Stripping 这种攻击手段，强制让 HTTPS 降级回 HTTP，从而继续进行中间人攻击。

**问题的本质在于浏览器发出去第一次请求就被攻击者拦截了下来并做了修改，根本不给浏览器和服务器进行 HTTPS 通信的机会。** 大致过程如下，用户在浏览器里输入 URL 的时候往往不是从`https://`开始的，而是直接从域名开始输入，随后浏览器向服务器发起 HTTP 通信，然而由于攻击者的存在，它把服务器端返回的跳转到 HTTPS 页面的响应拦截了，并且代替客户端和服务器端进行后续的通信。由于这一切都是暗中进行的，所以使用前端应用的用户对此毫无察觉。

## 什么是 HSTS？

> HTTP 严格传输安全(HSTS)是一种安全功能，web 服务器通过它来告诉浏览器仅用 HTTPS 来与之通讯，而不是使用 HTTP。

HSTS（HTTP Strict Transport Security）是一种安全策略，旨在强制客户端（浏览器）通过 HTTPS 与网站进行通信，从而提供更高的安全性。HSTS 的原理是通过 HTTP 响应头中的 Strict-Transport-Security 字段将网站标记为 HSTS，并告知浏览器在未来的一段时间内只通过 HTTPS 与该网站通信。

当浏览器首次访问一个支持 HSTS 的网站时，网站会在 HTTP 响应头中添加 Strict-Transport-Security 字段，指定一个最大有效期（max-age），例如`Strict-Transport-Security: max-age=31536000`，表示在接下来的一年内浏览器只能通过 HTTPS 与该网站进行通信。

一旦浏览器接收到带有 HSTS 响应头的响应，它会将该网站添加到自己的 HSTS 预加载列表中，即使用户在之后访问该网站时输入了 HTTP 的 URL，浏览器也会自动将其转换为 HTTPS，以确保安全连接。此外，一旦 HSTS 生效，浏览器将不再向该网站发送 HTTP 请求，即使用户手动输入 HTTP 的 URL 也不会发送。

HSTS 的原理是通过浏览器的内部机制来强制实施，用户无法覆盖或绕过 HSTS 策略。当浏览器在预加载列表中找到网站时，它会自动将所有该网站的请求转发到 HTTPS，无论用户是否尝试使用 HTTP 进行访问。

这种机制的目的是防止恶意攻击者通过中间人攻击、网络劫持或钓鱼攻击等方式，迫使用户使用不安全的 HTTP 连接与网站通信。通过 HSTS，网站可以强制使用安全的 HTTPS 连接，提供更可靠的数据传输和防止窃听、篡改或劫持等安全问题。

需要注意的是，HSTS 策略的生效需要网站首次通过 HTTPS 与浏览器建立安全连接，并发送带有 HSTS 响应头的 HTTP 响应。因此，网站在实施 HSTS 之前需要确保其 HTTPS 配置正确，并获取有效的 SSL/TLS 证书，以确保初始安全连接的可靠性

HSTS 代表[HTTP 严格传输安全性](https://link.juejin.cn?target=https%3A%2F%2Fwww.wbolt.com%2Fgo%3F_%3D98f4d606d4aHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFRUUF9TdHJpY3RfVHJhbnNwb3J0X1NlY3VyaXR5)，由 IETF 在 2012 年的[RFC 6797](https://link.juejin.cn?target=https%3A%2F%2Fwww.wbolt.com%2Fgo%3F_%3D984b124a28aHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY3OTc%3D)中指定。创建它是为了在站点通过 HTTPS 运行时**强制浏览器使用安全连接**。它是您添加到 Web 服务器的安全标头，**并在响应标头中反映为 Strict-Transport-Security**。HSTS 很重要，因为它解决了以下问题：

- 用户书签或手动输入`http://example.com`并且容易受到中间人攻击

  - HSTS 自动将目标域的 HTTP 请求重定向到 HTTPS

- 旨在纯粹 HTTPS 的 Web 应用程序无意中包含 HTTP 链接或通过 HTTP 提供内容

  - HSTS 自动将目标域的 HTTP 请求重定向到 HTTPS

- 中间人攻击者尝试使用无效证书拦截受害用户的流量，并希望用户接受错误的证书

  - HSTS 不允许用户覆盖无效的证书消息

**当用户访问该网站时输入了 HTTP 的 URL，浏览器也会自动将其重定向到 HTTPS 网址，这是浏览器内部行为，开始的 HTTP 的请求并不会发送出去，重定向状态码为 307。**

重定向状态码

| 永久重定向 | 临时重定向 |
| ---------- | ---------- |
| 301        | 302        |
| 308        | 307        |

状态码 307 与 302 之间的唯一区别在于，当发送重定向请求的时候，307 状态码可以确保请求方法和消息主体不会发生变化。当响应状态码为 302 的时候，一些旧有的用户代理会错误地将请求方法转换为 GET：使用非 GET 请求方法而返回 302 状态码，Web 应用的运行状况是不可预测的；而返回 307 状态码时则是可预测的。对于 GET 请求来说，两种情况没有区别。

注意，**如果之前没有使用 HTTPS 协议访问过该站点，那么 HSTS 是不奏效的**，只有浏览器曾经与服务器创建过一次安全连接并且网站通过 HTTPS 协议告诉浏览器它支持 HSTS，那么之后浏览器才会强制使用 HTTPS，即使链接被换成了 HTTP。

> 虽然我们的系统默认更喜欢 HTTPS 版本，但您也可以通过将您的 HTTP 站点重定向到您的 HTTPS 版本并在您的服务器上实施 HSTS 标头，使其他搜索引擎更清楚这一点。 —— 谷歌安全团队

## 开启 HSTS

**在 Apache 中启用 HSTS**

将以下代码添加到您的虚拟主机文件中。

```apl
Header always set Strict-Transport-Security max-age=31536000
```

**在 NGINX 中启用 HSTS**

将以下代码添加到您的 NGINX 配置中。

```nginx
add_header Strict-Transport-Security max-age=31536000
```

事实上，添加 HSTS 标头有性能优势。如果有人试图通过 HTTP 访问您的站点，而不是发出 HTTP 请求，它只是重定向到 HTTPS 版本。
