import React from 'react'
import ReactMarkdown from 'react-markdown'
import DOMPurify from 'isomorphic-dompurify'
import useSanitizedComponent from '@/components/articles/content'
import FigCaption from '../figcaption-card'

const MarkdownContent = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        p: useSanitizedComponent('p'),
        h1: useSanitizedComponent('h1'),
        h2: useSanitizedComponent('h2'),
        h3: useSanitizedComponent('h3'),
        a: useSanitizedComponent('a'),
        img: ({ src, alt }) => {
          // Check if this is our custom image syntax
          if (alt && alt.startsWith('!')) {
            const caption = alt.substring(1) // Remove the leading '!'
            return <FigCaption src={src} alt="" caption={caption} />
          }
          // For regular images, just sanitize the src
          const sanitizedSrc = DOMPurify.sanitize(src)
          return <img src={sanitizedSrc} alt={alt} />
        },
        // Add other elements as needed
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownContent
