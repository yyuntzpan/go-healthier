import axios from 'axios'
import { ArticlesComment } from '@/configs/articles'

export default function useGetComment() {
  const calcRemain = (totalRows, group, perGroup, remain = undefined) => {
    if (!remain || remain >= perGroup) {
      // if remain not given(1st time), or remain a lot(when toggle)
      const nextRemain = parseInt(totalRows) - group * perGroup
      return nextRemain
    } else if (remain < perGroup) {
      // when remain is smaller than perGroup, give 0
      const nextRemain = 0
      return nextRemain
    }
  }

  const getMain = async (router, group, remain = undefined) => {
    const article_id = router.query.article_id
    const url = `${ArticlesComment}?article_id=${article_id}&main=0&sub=0&group=${group}`
    try {
      const res = await axios.get(url)
      if (res.data.success) {
        const { data, ...info } = res.data
        const nextRemain = calcRemain(
          info.totalRows,
          group,
          info.perGroup,
          remain
        )
        return { data, info, nextRemain }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSub = async (article_id, group, main, remain = undefined) => {
    const url = `${ArticlesComment}?article_id=${article_id}&main=${main}&sub=-1&group=${group}`
    try {
      const res = await axios.get(url)
      if (res.data.success) {
        const { data, ...info } = res.data
        const nextRemain = calcRemain(
          info.totalRows,
          group,
          info.perGroup,
          remain
        )
        return { data, info, nextRemain }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return { getMain, getSub }
}
