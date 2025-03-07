import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import DOMPurify from 'isomorphic-dompurify'
import styles from './figcaption-card.module.css'

const imageToFigure = () => {
  return (tree) => {
    const { children } = tree
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].type === 'image'
      ) {
        const imageNode = node.children[0]
        children[i] = {
          type: 'html',
          value: `<figure class="${styles.articleImg}">
            <img src="${imageNode.url}" alt="${imageNode.alt || ''}" />
            ${
              imageNode.title
                ? `<figcaption class="${styles.articleImgText}">${imageNode.title}</figcaption>`
                : ''
            }
          </figure>`,
        }
      }
    }
  }
}

const MarkdownContent = ({ content }) => {
  // Sanitize the entire content before passing it to ReactMarkdown
  const sanitizedContent = DOMPurify.sanitize(content)

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, imageToFigure]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Add an additional layer of sanitization for links
        a: ({ node, children, ...props }) => {
          if (React.Children.count(children) === 0) {
            return (
              <a {...props} href={DOMPurify.sanitize(props.href)}>
                {props.href}
              </a>
            )
          }
          return (
            <a {...props} href={DOMPurify.sanitize(props.href)}>
              {children}
            </a>
          )
        },
      }}
    >
      {sanitizedContent}
    </ReactMarkdown>
  )
}

export default MarkdownContent
