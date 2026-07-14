import { onRequest as __api_ai_news_ts_onRequest } from "G:\\dailynews100-source-F\\functions\\api\\ai-news.ts"
import { onRequest as __article__slug__ts_onRequest } from "G:\\dailynews100-source-F\\functions\\article\\[slug].ts"
import { onRequest as __blog__slug__ts_onRequest } from "G:\\dailynews100-source-F\\functions\\blog\\[slug].ts"
import { onRequest as __category__slug__ts_onRequest } from "G:\\dailynews100-source-F\\functions\\category\\[slug].ts"
import { onRequest as ___sitemap__ts_onRequest } from "G:\\dailynews100-source-F\\functions\\[sitemap].ts"

export const routes = [
    {
      routePath: "/api/ai-news",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ai_news_ts_onRequest],
    },
  {
      routePath: "/article/:slug",
      mountPath: "/article",
      method: "",
      middlewares: [],
      modules: [__article__slug__ts_onRequest],
    },
  {
      routePath: "/blog/:slug",
      mountPath: "/blog",
      method: "",
      middlewares: [],
      modules: [__blog__slug__ts_onRequest],
    },
  {
      routePath: "/category/:slug",
      mountPath: "/category",
      method: "",
      middlewares: [],
      modules: [__category__slug__ts_onRequest],
    },
  {
      routePath: "/:sitemap",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [___sitemap__ts_onRequest],
    },
  ]