import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Post } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (posts: Post[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImport = () => {
    try {
      setError('');
      const data = JSON.parse(jsonText);
      const postsArray = Array.isArray(data) ? data : [data];
      
      // Basic validation
      const validPosts = postsArray.map(post => ({
        id: post.id || crypto.randomUUID(),
        url: post.url || '',
        description: post.description || '',
        author: post.author || '',
        category: post.category || 'Разное',
        triggerWord: post.triggerWord || null,
        tools: Array.isArray(post.tools) ? post.tools : [],
        hasList: !!post.hasList,
        links: Array.isArray(post.links) ? post.links : []
      }));

      onImport(validPosts);
      setJsonText('');
      onClose();
    } catch (err) {
      setError('Неверный формат JSON. Пожалуйста, проверьте текст.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal glass" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Импорт постов (JSON)</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Вставьте сюда JSON-код, сгенерированный нейросетью. 
        </p>

        <textarea 
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='[\n  {\n    "url": "https://instagram.com/...",\n    "description": "...",\n    "category": "AI"\n  }\n]'
        />

        {error && <p style={{ color: '#ff7675', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={handleImport}>
            <Upload size={16} /> Импортировать
          </button>
        </div>
      </div>
    </div>
  );
};
