import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CommentInput from './comment-input'
import CommentStrip from './comment-strip'
import ToggleComment from './toggle-comment'
import Reply from './reply'
import useGetComment from '@/hooks/article-comment/useGetComment'
import useToggleDisplay from '@/hooks/article-comment/useToggleDisplay'
import useToggleInput from '@/hooks/article-comment/useToggleInput'
import styles from './comment.module.css'

export default function Comment() {
  const router = useRouter()
  const [info, setInfo] = useState({ success: false, totalGroup: 0 })
  const [main, setMain] = useState([])
  const [group, setGroup] = useState(1)
  const [remain, setRemain] = useState(0)
  const [replySect, setReplySect] = useState({})
  const [hiddenSubs, setHiddenSubs] = useState([])
  const [isClicked, setIsClicked] = useState(false)

  // fetch main comments hook
  const { getMain } = useGetComment()

  const actionOnToggle = () => {
    const nextGroup = group + 1
    setGroup(nextGroup)
    getMain(router, nextGroup, remain).then((res) => {
      setMain([...main, ...res.data])
      setInfo(res.info)
      setRemain(res.nextRemain)
    })
  }

  const toggleComment = useToggleDisplay(
    group,
    setGroup,
    main,
    setMain,
    setRemain,
    info.totalGroup,
    info.totalRows,
    info.perGroup,
    actionOnToggle
  )

  const { toggleReplySect } = useToggleInput(
    replySect,
    setReplySect,
    hiddenSubs,
    setHiddenSubs
  )

  useEffect(() => {
    if (router.isReady) {
      getMain(router, group)
        .then((res) => {
          setMain(res.data)
          setInfo(res.info)
          setRemain(res.nextRemain)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [router])

  return (
    <>
      <div className={styles.commentContainer}>
        <div className={styles.mainComment}>
          <CommentInput
            showInput={true}
            main={main.length + remain}
            // main={info.totalRows}
            article_id={router.query.article_id || 0}
            mainArr={main}
            setMainArr={setMain}
          />
        </div>
        <div className={styles.commentArea}>
          {main.length > 0 ? (
            main.map((v, i) => {
              return (
                <div className={styles.commentBox} key={i} id={v.main}>
                  <CommentStrip
                    data={v}
                    replySect={replySect}
                    setReplySect={setReplySect}
                    handleToggle={toggleReplySect}
                    hiddenSubs={hiddenSubs}
                    setHiddenSubs={setHiddenSubs}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                  />
                  <Reply
                    article_id={v.article_id_fk}
                    main={v.main}
                    show={replySect}
                    setShow={setReplySect}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                  />
                </div>
              )
            })
          ) : (
            <>
              <div className={styles.noComment}>
                <h5>這篇文章還沒有人留言喔~</h5>
                <h5>動動手指讓這裡活絡起來吧~</h5>
              </div>
            </>
          )}
          <div
            style={{
              display: `${info.totalGroup === 1 ? 'none' : 'flex'}`,
            }}
          >
            <ToggleComment
              onClick={toggleComment}
              group={group}
              totalGroup={info.totalGroup}
              perGroup={info.perGroup}
              remain={remain}
            />
          </div>
        </div>
      </div>
    </>
  )
}
