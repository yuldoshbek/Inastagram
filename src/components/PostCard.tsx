import { useState } from 'react';
import { ExternalLink, Copy, Check, Trash2 } from 'lucide-react';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onClick, onDelete }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(post.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(post.id);
  }

  function handleLinkClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="post-card glass" onClick={onClick}>
      <button className="delete-btn" onClick={handleDelete} title="Удалить">
        <Trash2 size={14} />
      </button>

      <div className="post-card-header">
        <span className="post-author">
          {post.author ? `@${post.author}` : 'Неизвестный автор'}
        </span>
        <span className="category-label">{post.category}</span>
      </div>

      <div className="badges">
        {post.triggerWord && (
          <span className="badge badge-trigger">🎁 {post.triggerWord}</span>
        )}
        {post.tools.map((tool) => (
          <span key={tool} className="badge">🛠 {tool}</span>
        ))}
        {post.hasList && (
          <span className="badge badge-list">📋 Гайд</span>
        )}
      </div>

      <p className="post-desc">
        {post.description.length > 200
          ? post.description.substring(0, 200) + '…'
          : post.description}
      </p>

      <div className="post-actions">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={handleLinkClick}
        >
          <ExternalLink size={14} /> Открыть
        </a>
        <button onClick={handleCopy} className="btn btn-secondary btn-sm" title="Скопировать текст">
          {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
