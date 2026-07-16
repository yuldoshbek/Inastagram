import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Database, Plus, Download, LayoutGrid,
  Search, Menu, FolderOpen, BarChart3,
} from 'lucide-react';
import type { Post } from './types';
import { PostCard } from './components/PostCard';
import { ImportModal } from './components/ImportModal';
import { PostModal } from './components/PostModal';
import { initialPosts } from './data/initialData';

const STORAGE_KEY = 'instagram-knowledge-base-v2';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  // ── Load data ──
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
          return;
        }
      } catch {
        // corrupted data — fall through to initial
      }
    }
    setPosts(initialPosts as Post[]);
  }, []);

  // ── Persist data ──
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  // ── Categories ──
  const categories = useMemo(() => {
    const catCounts = new Map<string, number>();
    for (const p of posts) {
      catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);
    }
    const sorted = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]);
    return [{ name: 'Все', count: posts.length }, ...sorted.map(([name, count]) => ({ name, count }))];
  }, [posts]);

  // ── Filtered posts ──
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedCategory !== 'Все') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, selectedCategory, searchQuery]);

  // ── Stats ──
  const stats = useMemo(() => {
    const withTrigger = posts.filter((p) => p.triggerWord).length;
    const withGuide = posts.filter((p) => p.hasList).length;
    const uniqueAuthors = new Set(posts.map((p) => p.author).filter(Boolean)).size;
    return { withTrigger, withGuide, uniqueAuthors };
  }, [posts]);

  // ── Handlers ──
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  }, []);

  function handleImport(newPosts: Post[]) {
    setPosts((prev) => [...newPosts, ...prev]);
    showToast(`✅ Добавлено ${newPosts.length} пост(ов)`);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('🗑 Пост удалён');
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram_knowledge_base.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Экспорт завершён');
  }

  function handleCategoryClick(name: string) {
    setSelectedCategory(name);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo">
          <Database size={22} />
          <span>Knowledge Base</span>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <p className="nav-section-label">Категории</p>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`nav-item ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <LayoutGrid size={16} />
              <span style={{ flex: 1 }}>{cat.name}</span>
              <span className="count">{cat.count}</span>
            </div>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={14} /> Экспорт JSON
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1>{selectedCategory}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {filteredPosts.length} из {posts.length} постов
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setIsImportModalOpen(true)}>
              <Plus size={16} /> Добавить
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-bar glass">
          <div className="stat">
            <BarChart3 size={16} color="var(--accent)" />
            <span className="stat-value">{posts.length}</span> постов
          </div>
          <div className="stat">
            <span className="stat-value">{stats.uniqueAuthors}</span> авторов
          </div>
          <div className="stat">
            <span className="stat-value">{stats.withGuide}</span> гайдов
          </div>
          <div className="stat">
            <span className="stat-value">{stats.withTrigger}</span> с кодовыми словами
          </div>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по описанию, автору, инструменту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Posts grid */}
        {filteredPosts.length > 0 ? (
          <div className="post-grid">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={48} />
            <p>Ничего не найдено</p>
            <span>Попробуйте изменить категорию или поисковый запрос</span>
          </div>
        )}
      </main>

      {/* Modals */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      <PostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Toast */}
      <div className={`toast toast-success ${toast ? 'show' : ''}`}>
        {toast}
      </div>
    </div>
  );
}

export default App;
