---
layout: home

hero:
  name: Nanyi Blog
  text: 南一的博客
  tagline: 记录前端学习的笔记
  actions:
    - theme: brand
      text: Get Started
      link: /blog/react/start
    - theme: alt
      text: View on GitHub
      link: https://github.com/nanyishixiong/blog
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
