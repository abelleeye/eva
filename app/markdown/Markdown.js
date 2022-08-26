import React, { Component } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/esm/styles/prism'

import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { atomone } from '@uiw/codemirror-theme-atomone';
import './index.css'


class Markdown extends Component {

  constructor (props){
    super(props);
    this.state = { 
      content: `Just a link: https://reactjs.com.`,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(content) {
    this.setState({content})
  }

  render() {
    return (
      <div className='markdown-container'>
        <CodeMirror
          className='code-mirror'
          value={this.state.content}
          width='50vw'
          height='calc(100vh - 48px)'
          basicSetup={{lineNumbers: false, foldGutter: false}}
          theme={atomone}
          extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
          onChange={this.onChange}
        />
        <div className='markdown-body-container'>
          <ReactMarkdown 
            className='markdown-body'
            children={this.state.content} 
            remarkPlugins={[remarkGfm, remarkMath]} 
            rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={github}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          ></ReactMarkdown>
        </div>
      </div>
    )
  }
}

export default Markdown;