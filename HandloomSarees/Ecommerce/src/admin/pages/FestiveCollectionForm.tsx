import { uploadFestiveImage } from '../lib/uploadFestiveImage';
import { Upload, X, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  createFestiveCollection,
  getAdminFestiveCollectionById,
  updateFestiveCollection,
} from '@/api/festiveCollections';
import { Calendar, Sparkles } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

.festive-form {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  padding: 120px 0 80px;
}
.form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width: 900px){ .form-container { padding: 0 24px; } }
@media(max-width: 480px){ .form-container { padding: 0 16px; } }

.form-header {
  margin-bottom: 32px;
}
.form-title {
  font-family: 'Cinzel', serif;
  font-size: 32px;
  font-weight: 400;
  color: #800020;
  margin-bottom: 8px;
  letter-spacing: 0.04em;
}
.form-sub {
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #9a8070;
  font-weight: 300;
}

.form-card {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 28px;
  padding: 28px 32px;
  margin-bottom: 28px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
}
@media(max-width: 700px){ .form-card { padding: 20px 24px; } }

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 500;
  color: #800020;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.02em;
}
.card-title svg { color: #C4980A; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media(max-width: 700px){ .form-grid { grid-template-columns: 1fr; } }
.form-field-full {
  grid-column: span 2;
}
@media(max-width: 700px){ .form-field-full { grid-column: span 1; } }

.form-label {
  display: block;
  font-family: 'Josefin Sans';
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
  margin-bottom: 8px;
}
.form-input, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 1.5px solid rgba(196,152,10,.3);
  border-radius: 16px;
  font-family: 'Josefin Sans';
  font-size: 14px;
  color: #1a1010;
  transition: all 0.25s;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #C4980A;
  box-shadow: 0 0 0 3px rgba(196,152,10,.12);
}
.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #800020;
  margin-right: 10px;
}
.form-checkbox-label {
  display: flex;
  align-items: center;
  font-family: 'Josefin Sans';
  font-size: 14px;
  font-weight: 500;
  color: #4a3828;
  cursor: pointer;
}
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 38px;
  background: linear-gradient(135deg, #D4AF37, #b8960f);
  color: #800020;
  border: none;
  border-radius: 100px;
  font-family: 'Josefin Sans';
  font-size: 13px;
  letter-spacing: .12em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform .35s, box-shadow .35s;
  box-shadow: 0 6px 24px rgba(212,175,55,.38);
}
.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.52);
}
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

export default function FestiveCollectionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [imageUploading, setImageUploading] = useState(false);
  const handleBannerUpload = async (file: File) => {
  try {
    setImageUploading(true);
    const url = await uploadFestiveImage(file);

    setForm((prev) => ({
      ...prev,
      banner_image: url,
    }));

    toast.success("Banner uploaded successfully");
  } catch (err: any) {
    console.error("Festive banner upload failed", err);
    toast.error(
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Upload failed"
    );
  } finally {
    setImageUploading(false);
  }
};

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    banner_image: '',
    popup_enabled: false,
    popup_message: '',
    start_date: '',
    end_date: '',
    is_active: true,
    product_ids: [],
  });

  useEffect(() => {
    const loadInitial = async () => {
      if (!isEdit || !id) return;

      try {
        const data = await getAdminFestiveCollectionById(id);

        setForm({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          banner_image: data.banner_image || '',
          popup_enabled: !!data.popup_enabled,
          popup_message: data.popup_message || '',
          start_date: data.start_date ? data.start_date.slice(0, 16) : '',
          end_date: data.end_date ? data.end_date.slice(0, 16) : '',
          is_active: !!data.is_active,
          product_ids: data.product_ids || [],
        });
      } catch (error: any) {
        console.error('Failed to load festive collection data', error);
        toast.error(
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'Failed to load form data'
        );
      }
    };

    loadInitial();
  }, [id, isEdit]);

  const title = useMemo(
    () => (isEdit ? 'Edit Festive Collection' : 'Create Festive Collection'),
    [isEdit]
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        product_ids: form.product_ids || [],
      };

      if (isEdit && id) {
        await updateFestiveCollection(id, payload);
        toast.success('Festive collection updated');
      } else {
        await createFestiveCollection(payload);
        toast.success('Festive collection created');
      }

      navigate('/admin/festive-collections');
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to save festive collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="festive-form">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">{title}</h1>
            <p className="form-sub">Manage festive collections for seasonal campaigns and popups</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Details Card */}
            <div className="form-card">
              <div className="card-title">
                <Sparkles size={20} />
                Basic Details
              </div>
              <div className="form-grid">
                <div>
                  <label className="form-label">Collection Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g., Diwali Collection 2025"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Slug</label>
                  <input
                    className="form-input"
                    placeholder="e.g., diwali-2025"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field-full">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the festive collection..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
                <div>
  <label className="form-label">Banner Image</label>

  <div
    style={{
      border: '1px dashed rgba(196,152,10,.4)',
      borderRadius: 16,
      padding: 14,
      background: '#fff'
    }}
  >
    <div style={{ marginBottom: 12 }}>
      {form.banner_image ? (
        <img
          src={form.banner_image}
          alt="preview"
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />
      ) : (
        <div
          style={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9a8070'
          }}
        >
          No image uploaded
        </div>
      )}
    </div>

    <label
      className="btn-save"
      style={{ cursor: 'pointer', padding: '10px 20px' }}
    >
      {imageUploading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload size={14} />
          Upload Banner
        </>
      )}

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleBannerUpload(file);
        }}
      />
    </label>

    {form.banner_image && (
      <button
        type="button"
        style={{
          marginLeft: 12,
          background: 'transparent',
          border: '1px solid #800020',
          padding: '8px 16px',
          borderRadius: 12,
          cursor: 'pointer'
        }}
        onClick={() => handleChange('banner_image', '')}
      >
        <X size={14} /> Remove
      </button>
    )}
  </div>
</div>
                <div>
                  <label className="form-label">Popup Message</label>
                  <input
                    className="form-input"
                    placeholder="Special offer message for popup"
                    value={form.popup_message}
                    onChange={(e) => handleChange('popup_message', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Date & Status Card */}
            <div className="form-card">
              <div className="card-title">
                <Calendar size={20} />
                Scheduling & Status
              </div>
              <div className="form-grid">
                <div>
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={form.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={form.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                    />
                    Active Collection
                  </label>
                </div>
                <div>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={form.popup_enabled}
                      onChange={(e) => handleChange('popup_enabled', e.target.checked)}
                    />
                    Enable Popup
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-save">
              {loading ? 'Saving...' : (isEdit ? 'Update Collection' : 'Create Collection')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}