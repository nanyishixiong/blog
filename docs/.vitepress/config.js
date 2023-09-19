import fs from "fs";
import path from "path";
import { defineConfig } from "vitepress";

const rootDir = process.cwd();

function createSidebar() {
  const sidebar = {};
  const basePath = path.resolve(rootDir, "docs/blog");
  const dirs = fs.readdirSync(basePath);
  sidebar["/blog/"] = dirs.map((dirName) => {
    // 取到文件路径
    const filePath = path.resolve(basePath, dirName);
    // 读文件夹 拿到文件
    const files = fs.readdirSync(filePath);
    const items = files.map((file) => {
      file = file.split(".")[0]; // 去掉 .md
      return { text: file, link: `/blog/${dirName}/${file}` };
    });
    return { text: dirName, items };
  });
  return sidebar;
}
const sidebar = createSidebar();

export default defineConfig({
  title: "Nanyi Blog",
  description: "Nanyi Blog",
  lang: "zh-CN",

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  base: "/blog/",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" }
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
    }
  }
});
