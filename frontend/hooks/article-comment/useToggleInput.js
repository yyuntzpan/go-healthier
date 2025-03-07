import React from 'react'

export default function useToggleInput(
  replySect = {},
  setReplySect = () => {},
  hiddenSubs = 0,
  setHiddenSubs = () => {}
) {
  const toggleReplySect = (e, data) => {
    if (e.currentTarget.id === 'reply') {
      const nextReplySect = { ...replySect, [data.main]: 'reply' }
      setReplySect(nextReplySect)
      // set hidden sub count to display
      if (hiddenSubs < 3) {
        setHiddenSubs(0)
      } else {
        const nextHiddenSubs = hiddenSubs - 3
        setHiddenSubs(nextHiddenSubs)
      }
    } else if (e.currentTarget.id === 'replyInput') {
      const nextReplySect = { ...replySect, [data.main]: 'replyInput' }
      setReplySect(nextReplySect)
    }
    if (replySect[data.main] && e.currentTarget.id === replySect[data.main]) {
      // if click the same toggle again, hide it
      const nextReplySect = { ...replySect }
      delete nextReplySect[data.main]
      setReplySect(nextReplySect)
      if (e.currentTarget.id === 'reply') {
        // if hide replies, update hiddenSubs to set replyBtn
        setHiddenSubs(data.sub_count)
      }
    }
  }

  const toggleReplyInput = (e, data) => {
    if (e.currentTarget.id === 'replyInput') {
      const nextReplySect = { ...replySect, [data.sub]: 'replyInput' }
      setReplySect(nextReplySect)
    }

    if (replySect[data.sub] && e.currentTarget.id === replySect[data.sub]) {
      // if click the same toggle again, hide it
      const nextReplySect = { ...replySect }
      delete nextReplySect[data.sub]
      setReplySect(nextReplySect)
    }
  }
  return { toggleReplyInput, toggleReplySect }
}
