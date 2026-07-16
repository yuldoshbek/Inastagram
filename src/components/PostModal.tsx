import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import type { Post } from '../types';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal glass" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-color)' }}>
            {post.author ? `@${post.author}` : 'Детали поста'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div className="badges" style={{ marginBottom: '24px' }}>
          {post.triggerWord && (
            <span className="badge badge-trigger" style={{ fontSize: '0.85rem' }}>🎁 Пиши: {post.triggerWord}</span>
          )}
          {post.tools.map(tool => (
            <span key={tool} className="badge" style={{ fontSize: '0.85rem' }}>🛠 {tool}</span>
          )}
          {post.hasList && <span className="badge" style={{ fontSize: '0.85rem' }}>📋 Гайд / Инструкция</span>}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', marginBottom: '24px', flex: 1, overflowY: 'auto' }}>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)' }}>
            {post.description}
          </p>
        </div>

        <div className="modal-actions" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-secondary"
          >
            <ExternalLink size={16} /> Открыть в Instagram
          </a>
          <button className="btn btn-primary" onClick={handleCopy}>
            {copied ? <><Check size={16} /> Скопировано!</> : <><Copy size={16} /> Скопировать весь текст</>}
          </button>
        </div>
      </div>
    </div>
  );
};
