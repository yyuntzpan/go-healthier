import { useRouter } from 'next/router'
import { ArticlesComment } from '@/configs/articles'
import axios from 'axios'
import LoginAlert from '../login-alert/login-alert'

export default function useSubmitComment(
  auth = {},
  comment = '',
  setError = () => {},
  setErrorText = () => {},
  sub = undefined,
  main = 0,
  setShowModal = () => {},
  subArr = [],
  setSubArr = () => {},
  mainArr = [],
  setMainArr = () => {}
) {
  const router = useRouter()
  const loginalert = LoginAlert('登入後才能留言喔~')
  const submitComment = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      if (!auth.id) {
        loginalert.fire().then((result) => {
          if (result.isConfirmed) {
            router.push('/users/sign_in')
          }
        })
      } else {
        if (!comment.trim()) {
          setError(true)
          setErrorText('留言不能是空的喔~')
        } else {
          let insertMain = 0
          let insertSub = 0
          if (sub === undefined) {
            insertMain = main + 1
          } else if (sub >= 0) {
            insertMain = main
            insertSub = sub + 1
          }

          const url = `${ArticlesComment}`
          axios
            .post(
              url,
              {
                article_id: router.query.article_id,
                main: insertMain,
                sub: insertSub,
                member_id: auth.id,
                comment_content: comment,
              },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            .then((res) => {
              if (res.data.success) {
                setShowModal(true)
                if (sub === undefined) {
                  setMainArr([
                    {
                      article_id: router.query.article_id,
                      main: insertMain,
                      sub: insertSub,
                      member_id: auth.id,
                      avatar: auth.avatar,
                      comment_content: comment,
                      update_at: '1分鐘前',
                    },
                    ...mainArr,
                  ])
                } else if (sub >= 0) {
                  setSubArr([
                    {
                      article_id: router.query.article_id,
                      main: insertMain,
                      sub: insertSub,
                      member_id: auth.id,
                      avatar: auth.avatar,
                      comment_content: comment,
                      update_at: '1分鐘前',
                    },
                    ...subArr,
                  ])
                }
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      }
    }
  }
  return submitComment
}
