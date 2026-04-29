import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminFestiveCollections,
  deleteFestiveCollection,
  type FestiveCollection,
} from '@/api/festiveCollections';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.admin-festive {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  padding: 120px 0 80px;
}
.admin-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width: 900px){ .admin-container { padding: 0 24px; } }
@media(max-width: 480px){ .admin-container { padding: 0 16px; } }

.admin-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 48px;
}
.admin-title {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  font-weight: 400;
  color: #800020;
  letter-spacing: 0.04em;
  margin: 0;
}
.admin-sub {
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #9a8070;
  font-weight: 300;
  margin-top: 4px;
}
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing: .1em;
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 20px rgba(212,175,55,.35);
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.5);
}

.festive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}
@media(max-width: 700px) { .festive-grid { grid-template-columns: 1fr; } }

.festive-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 24px;
  transition: transform .3s, box-shadow .3s;
  display: flex;
  flex-direction: column;
}
.festive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(128,0,32,.12);
  border-color: rgba(196,152,10,.4);
}
.festive-name {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
.festive-slug {
  font-family: 'Josefin Sans';
  font-size: 12px;
  color: #9a8070;
  margin-bottom: 12px;
}
.festive-desc {
  font-family: 'Josefin Sans';
  font-size: 13px;
  font-weight: 300;
  color: #4a3828;
  line-height: 1.7;
  margin-bottom: 16px;
  flex: 1;
}
.festive-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-top: 12px;
  border-top: 1px solid rgba(196,152,10,.18);
}
.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(196,152,10,.1);
  border: 1px solid rgba(196,152,10,.3);
  color: #800020;
  font-weight: 600;
}
.meta-badge.active {
  background: rgba(34,197,94,.12);
  border-color: rgba(34,197,94,.3);
  color: #059669;
}
.meta-badge.inactive {
  background: rgba(156,163,175,.12);
  border-color: rgba(156,163,175,.3);
  color: #6b7280;
}
.meta-badge.popup-on {
  background: rgba(196,152,10,.12);
  border-color: rgba(196,152,10,.3);
  color: #C4980A;
}
.festive-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all .25s;
  cursor: pointer;
}
.action-edit {
  border: 1.5px solid rgba(196,152,10,.4);
  color: #800020;
  background: transparent;
}
.action-edit:hover {
  border-color: #800020;
  background: rgba(128,0,32,.05);
  transform: translateY(-1px);
}
.action-delete {
  border: 1.5px solid rgba(220,38,38,.3);
  color: #dc2626;
  background: transparent;
}
.action-delete:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  transform: translateY(-1px);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 80px 20px;
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #9a8070;
  background: rgba(255,249,240,.97);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 28px;
}
`;

export default function AdminFestiveCollections() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [items, setItems] = useState<FestiveCollection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminFestiveCollections();
      setItems(data);
    } catch {
      toast.error('Failed to load festive collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this festive collection?')) return;
    try {
      await deleteFestiveCollection(id);
      toast.success('Festive collection deleted');
      loadData();
    } catch {
      toast.error('Failed to delete festive collection');
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-festive">
        <div className="admin-container">
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Festive Collections</h1>
              <p className="admin-sub">Manage seasonal and festive campaign collections</p>
            </div>
            <Link to="/admin/festive-collections/new" className="btn-add">
              <Plus size={16} /> New Collection
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">Loading festive collections...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={32} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No festive collections yet.</p>
              <Link to="/admin/festive-collections/new" style={{ marginTop: 16, display: 'inline-block' }} className="btn-add">
                Create your first collection
              </Link>
            </div>
          ) : (
            <div className="festive-grid">
              {items.map((item) => (
                <div key={item.id} className="festive-card">
                  <h2 className="festive-name">{item.name}</h2>
                  <div className="festive-slug">{item.slug}</div>
                  <p className="festive-desc">
                    {item.description || 'No description provided.'}
                  </p>
                  <div className="festive-meta">
                    <span className={`meta-badge ${item.is_active ? 'active' : 'inactive'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`meta-badge ${item.popup_enabled ? 'popup-on' : ''}`}>
                      {item.popup_enabled ? 'Popup Enabled' : 'Popup Off'}
                    </span>
                    <span className="meta-badge">
                      <Calendar size={11} /> {item.products?.length || 0} Products
                    </span>
                  </div>
                  <div className="festive-actions">
                    <Link
                      to={`/admin/festive-collections/${item.id}/edit`}
                      className="action-btn action-edit"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="action-btn action-delete"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}