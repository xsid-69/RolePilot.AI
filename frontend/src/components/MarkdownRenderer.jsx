import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm md:prose-base max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative group my-4">
                <div className="absolute right-4 top-2 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
                  {match[1]}
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-2xl border border-white/10 bg-[#0d1117]! p-5! shadow-2xl m-0!"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-white/10 text-blue-300 px-1.5 py-0.5 rounded-md font-mono text-xs md:text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-200">{children}</p>,
          h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black mb-4 mt-6 text-white tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg md:text-xl font-bold mb-3 mt-5 text-white tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base md:text-lg font-bold mb-2 mt-4 text-white tracking-tight">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2 text-gray-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-2 text-gray-300">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 px-4 py-2 my-4 italic rounded-r-lg text-gray-300">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-white/5" />,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 transition-colors">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
