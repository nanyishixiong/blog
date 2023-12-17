import fs from "fs";
import path from "path";
import { defineConfig } from "vitepress";

const rootDir = process.cwd();
const excludeDir = [".vitepress", "public", "index.md"];
const excludeFile = ["image", "img"];
function createSidebar() {
  const sidebar = [];

  const basePath = path.resolve(rootDir, "docs");
  const dirs = fs.readdirSync(basePath);
  for (let i = 0; i < dirs.length; i++) {
    const dirName = dirs[i];
    if (excludeDir.includes(dirName)) continue;
    // 取到文件路径
    const filePath = path.resolve(basePath, dirName);
    // 读文件夹 拿到文件
    const files = fs.readdirSync(filePath);
    const items = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      // 剔除文件夹 只留markdown文件
      if (excludeFile.includes(file)) continue;
      file = file.split(".")[0]; // 去掉 .md
      items.push({ text: file, link: file });
    }
    sidebar.push({
      text: dirName,
      base: `/${dirName}/`,
      items
    });
  }

  return sidebar;
}
const sidebar = createSidebar();
console.dir(sidebar, { depth: null, colors: true });

function createNav(sidebar) {
  const nav = [];
  nav.push({
    text: "面试题",
    link: "/Javascript/基础.html"
  });
  return nav;
}

export default defineConfig({
  title: "Nanyi Blog",
  description: "Nanyi Blog",
  lang: "zh-CN",

  head: [["link", { rel: "icon", href: "/blog/favicon.ico" }]],
  base: "/blog/",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      ...createNav(sidebar)
      // {
      //   text: "Nanyi",
      //   items: [
      //     { text: "Github", link: "https://github.com/nanyishixiong" },
      //     { text: "掘金", link: "https://juejin.cn/user/1799224251386701" }
      //   ]
      // } //lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg
    ],
    sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/nanyishixiong" },
      {
        icon: {
          svg: "<img src='https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg' title='稀土掘金' style='width:20px;'/>"
        },
        link: "https://juejin.cn/user/1799224251386701",
        ariaLabel: "稀土掘金"
      }
    ],
    search: {
      provider: "local"
    },
    // edit this page
    editLink: {
      pattern: "https://github.com/nanyishixiong/blog/docs/:path"
    }
  },
  lastUpdated: true
  // 生成sitemap 用于提交给各个搜索引擎平台，方便根据 sitemap 抓取我们的页面。提高SSO
  // github 主域下太多网页百度注册不了
  // sitemap: {
  //   hostname: "https://nanyishixiong.github.io/blog/"
  // }
});
