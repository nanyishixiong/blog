---
layout: home

hero:
  name: Nanyi Blog
  text: 南一的博客
  tagline: The Note About Front-End
  actions:
    - theme: brand
      text: Get Start
      link: /Javascript/基础.html
    - theme: alt
      text: View on GitHub
      link: https://github.com/nanyishixiong/blog
features:
  - icon: 🍕
    title: 前端安全
    details: Lorem ipsum...
    link: /websafe/00总览.html
    linkText: 查看文档
  - icon: 🍔
    title: JavaScript 基础
    details: Lorem ipsum...
    link: /Javascript/基础.html
    linkText: 查看文档
  - icon: 🍭
    title: 计算机网络
    details: Lorem ipsum...
    link: /计算机网络/总览.html
    linkText: 查看文档
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(40px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>
