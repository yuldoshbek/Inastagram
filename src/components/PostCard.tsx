import React from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import type { Post } from '../types';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(post.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="post-card glass">
      <div className="post-meta">
        <span>{post.author ? `@${post.author}` : 'Unknown Author'}</span>
      </div>
      
      <div className="badges">
        {post.triggerWord && (
          <span className="badge badge-trigger">🎁 Пиши: {post.triggerWord}</span>
        )}
        {post.tools.map(tool => (
          <span key={tool} className="badge">🛠 {tool}</span>
        ))}
        {post.hasList && <span className="badge">📋 Гайд</span>}
      </div>

      <p className="post-desc">
        {post.description.length > 150 
          ? post.description.substring(0, 150) + '...' 
          : post.description}
      </p>

      <div className="post-actions">
        <a 
          href={post.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <ExternalLink size={16} /> Перейти
        </a>
        <button 
          onClick={handleCopy} 
          className="btn btn-secondary"
          title="Скопировать текст"
        >
          {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
