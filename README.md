# 项目名称

网址导航管理工具

# 项目介绍

该项目是一款网址导航管理工具，主要用于管理多个部门的工具的网址导航。它是一个 B 端和 C 端同构的项目，使用的技术是 next.js、next-auth、zustand、@dnd-kit 和 mantine。它不需要数据库，可以轻松管理你的导航。

# 功能特性

-   支持按部门配置网址导航。
-   支持导航的新增、删除、修改和拖拽排序。
-   支持切换多种主题色。
-   支持用户权限。

# 技术栈

-   next.js：一款基于 React 的服务端渲染框架。
-   next-auth：一款基于 next 的权限验证库
-   zustand：一款小巧但功能强大的状态管理库。
-   @dnd-kit：一款支持拖拽排序的库。
-   mantine：一款 React 组件库，用于快速构建漂亮的界面。

# 项目结构

-   pages
    -   index.tsx
    -   login.tsx
    -   edit.tsx
-   data
    -   data.json
    -   user.json
-   ...

    `pages` 目录下是页面组件。

    `data` 目录下是数据相关的文件。

# 如何使用

1. 克隆代码到本地，进入项目目录。
2. 新建 `data` 目录，并在其中新增 `data.json` 和 `user.json`。
3. 在 `data.json` 中配置部门、分类和网址信息。
4. 在 `user.json` 中配置用户信息。
5. 运行 `yarn` 安装依赖。
6. 运行 `npm run dev` 启动项目。

# 数据文件格式

data.json 的格式如下：

```
    [
        {
        "name": "前端",
        "categorys": [
            {
                "name": "实用工具",
                    "infos": [
                        {
                            "name": "图片压缩",
                            "url": "https://tinypng.com/",
                            "urls": [
                                {
                                "env": "tinypng",
                                "url": "https://tinypng.com/"
                                },
                                {
                                "env": "gif 压缩",
                                "url": "https://docsmall.com/gif-compress"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
```

user.json 的格式如下：

```
    [
        {
        "username": "xiaofeng",
        "password": "密码 md5"
        }
    ]
```

# 联系我们

如有任何问题，请发送电子邮件至 windyrain1994@163.com。
