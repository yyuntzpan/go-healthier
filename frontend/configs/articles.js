import { API_SERVER } from './api-path'

export const ArticlesAPI = `${API_SERVER}/articles/api`

export const ArticlesListData = `${ArticlesAPI}/listData`

export const ArticlesEntry = `${ArticlesAPI}/entry`

export const ArticlesIndex = `${ArticlesAPI}/articleIndex`

// POST 文章加入收藏
export const ArticlesAddFav = `${ArticlesAPI}/addfavarticle`

// DELETE 文章取消收藏
export const ArticlesRemoveFav = `${ArticlesAPI}/removefavarticle`

// POST 新增文章留言或回覆 / GET 列出文章留言或回覆
export const ArticlesComment = `${ArticlesAPI}/comment`

// UPDATE 更新文章留言或回覆
export const ArticlesUpdateComment = `${ArticlesAPI}/comment`
