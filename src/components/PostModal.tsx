import { useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import type { Post } from '../types';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  function handleCopy() {
    navigator.clipboard.writeText(post!.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{post.author ? `@${post.author}` : 'Детали поста'}</h2>
            <span className="category-label" style={{ marginTop: '8px', display: 'inline-block' }}>
              {post.category}
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="badges" style={{ marginBottom: '20px' }}>
          {post.triggerWord && (
            <span className="badge badge-trigger" style={{ fontSize: '0.85rem' }}>
              🎁 Кодовое слово: {post.triggerWord}
            </span>
          )}
          {post.tools.map((tool) => (
            <span key={tool} className="badge" style={{ fontSize: '0.85rem' }}>
              🛠 {tool}
            </span>
          ))}
          {post.hasList && (
            <span className="badge badge-list" style={{ fontSize: '0.85rem' }}>
              📋 Содержит инструкцию
            </span>
          )}
        </div>

        <div className="modal-body">
          <p>{post.description}</p>
        </div>

        {post.links && post.links.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Ссылки в тексте:
            </p>
            {post.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', color: 'var(--accent-hover)', fontSize: '0.85rem', marginBottom: '4px' }}
              >
                {link}
              </a>
            ))}
          </div>
        )}

        <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <ExternalLink size={16} /> Открыть в Instagram
          </a>
          <button className="btn btn-primary" onClick={handleCopy}>
            {copied
              ? <><Check size={16} /> Скопировано!</>
              : <><Copy size={16} /> Скопировать текст</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
