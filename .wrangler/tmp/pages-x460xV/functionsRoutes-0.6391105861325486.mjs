import { onRequest as __api_ai_news_ts_onRequest } from "G:\\dailynews100-source-F\\functions\\api\\ai-news.ts"
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
      routePath: "/:sitemap",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [___sitemap__ts_onRequest],
    },
  ]