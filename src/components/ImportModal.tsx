import { useState } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import type { Post } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (posts: Post[]) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  function handleImport() {
    try {
      setError('');
      setSuccess('');
      const data = JSON.parse(jsonText);
      const postsArray = Array.isArray(data) ? data : [data];

      const validPosts: Post[] = postsArray.map((p: Record<string, unknown>) => ({
        id: (p.id as string) || crypto.randomUUID(),
        url: (p.url as string) || '',
        description: (p.description as string) || '',
        author: (p.author as string) || '',
        category: (p.category as string) || 'Разное',
        triggerWord: (p.triggerWord as string | null) || null,
        tools: Array.isArray(p.tools) ? (p.tools as string[]) : [],
        hasList: !!p.hasList,
        links: Array.isArray(p.links) ? (p.links as string[]) : [],
      }));

      onImport(validPosts);
      setSuccess(`Успешно импортировано: ${validPosts.length} пост(ов)`);
      setJsonText('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch {
      setError('Неверный формат JSON. Проверьте, что текст является валидным JSON объектом или массивом.');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Импорт постов</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="help-section">
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 600 }}>
            <HelpCircle size={14} /> Как добавить пост?
          </p>
          <p>
            Отправьте любому ИИ (ChatGPT, Claude) ссылку на пост и попросите его
            выдать JSON в формате:
          </p>
          <code style={{ display: 'block', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
{`{
  "url": "https://instagram.com/p/...",
  "description": "Текст поста",
  "author": "username",
  "category": "AI / Офис / Бизнес",
  "triggerWord": "СЛОВО или null",
  "tools": ["Claude", "Excel"],
  "hasList": true,
  "links": []
}`}
          </code>
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="Вставьте JSON сюда..."
        />

        {error && <div className="error-text">{error}</div>}
        {success && <div className="success-text">{success}</div>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={handleImport} disabled={!jsonText.trim()}>
            <Upload size={16} /> Импортировать
          </button>
        </div>
      </div>
    </div>
  );
}
