import { useEffect, useState } from 'react'
import { API_SERVER } from '@/configs/api-path'
import { IoChatbubble } from 'react-icons/io5'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import styles from './comment-strip.module.css'

export default function CommentStrip({
  data = {
    article_id_fk: 0,
    member_id_fk: 0,
    nick_name: '',
    avatar: 'default_avatar.jpg',
    comment_id: 0,
    create_at: '',
    update_at: '',
    comment_content: '',
    main: 0,
    sub: 0,
    sub_count: 0,
  },
  reply = false,
  handleToggle = () => {},
  isClicked = false,
  setIsClicked = () => {},
}) {
  // const [isClicked, setIsClicked] = useState(false)

  return (
    <>
      <div
        id={`tag${data.comment_id}`}
        className={`${styles.commentStrip} ${reply ? styles.reply : ''}`}
      >
        <div className={styles.userCommentTitle}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <img src={`${API_SERVER}/users/${data.avatar}`} />
            </div>
            <div className={styles.userCommentInfo}>
              <div className={styles.userName}>{data.nick_name}</div>
              <div className={styles.userCommentTime}>{data.update_at}</div>
            </div>
          </div>
          <div className={styles.reportBtnRow}>
            <button className={styles.reportBtn}>
              <IoEllipsisHorizontal className={styles.reportBtnIcon} />
            </button>
          </div>
        </div>
        <div className={styles.commentContent}>{data.comment_content}</div>
        <div
          className={styles.commentBtn}
          style={{
            display: `${reply ? 'none' : 'flex'}`,
            marginBottom: `${reply ? '-10px' : '0px'}`,
          }}
        >
          <div className={styles.replyBtn}>
            <button
              id="replyInput"
              onClick={(e) => {
                handleToggle(e, data)
              }}
            >
              <IoChatbubble className={styles.replyBtnIcon} />
              <span>回覆</span>
            </button>
          </div>
          <div
            className={styles.replyBtn}
            style={{ display: `${data.sub_count ? 'flex' : 'none'}` }}
          >
            <button
              id="reply"
              onClick={(e) => {
                handleToggle(e, data)
                setIsClicked(!isClicked)
              }}
            >
              {!data.sub_count || !isClicked ? (
                <span>查看回覆</span>
              ) : (
                <span>隱藏回覆</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
