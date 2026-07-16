import { useState, useEffect, useMemo } from 'react';
import { Database, Plus, Download, LayoutGrid } from 'lucide-react';
import type { Post } from './types';
import { PostCard } from './components/PostCard';
import { ImportModal } from './components/ImportModal';
import { initialPosts } from './data/initialData';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from local storage or use initial data
  useEffect(() => {
    const saved = localStorage.getItem('instagram-knowledge-base');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    // Fallback to initial data if nothing in storage
    setPosts(initialPosts as Post[]);
  }, []);

  // Save to local storage whenever posts change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('instagram-knowledge-base', JSON.stringify(posts));
    }
  }, [posts]);

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return ['Все', ...Array.from(cats)].sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'Все') return posts;
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleImport = (newPosts: Post[]) => {
    setPosts(prev => [...newPosts, ...prev]);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "instagram_knowledge_base.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo">
          <Database size={24} color="var(--accent-color)" />
          <span>Knowledge Base</span>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '16px' }}>Категории</p>
            {categories.map(cat => (
              <div 
                key={cat}
                className={`nav-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <LayoutGrid size={18} />
                {cat}
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>
                  {cat === 'Все' ? posts.length : posts.filter(p => p.category === cat).length}
                </span>
              </div>
            ))}
          </div>
        </nav>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Экспорт JSON
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>{selectedCategory}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Найдено постов: {filteredPosts.length}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Добавить пост
          </button>
        </header>

        <div className="post-grid">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <ImportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onImport={handleImport}
      />
    </div>
  );
}

export default App;
