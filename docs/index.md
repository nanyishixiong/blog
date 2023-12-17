---
layout: home

hero:
  name: Nanyi Blog
  text: 南一的博客
  tagline: The Note About Front-End
  actions:
    - theme: brand
      text: Get Start
      link: /Javascript/%E5%9F%BA%E7%A1%80.html
    - theme: alt
      text: View on GitHub
      link: https://github.com/nanyishixiong/blog
features:
  - icon: 🍕
    title: 前端安全
    details: Lorem ipsum...
  - icon: 🍔
    title: JavaScript 基础
    details: Lorem ipsum...
  - icon: 🍭
    title: Webpack
    details: Lorem ipsum...
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
