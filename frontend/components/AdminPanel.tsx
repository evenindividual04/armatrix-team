'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { TeamMember } from '@/types';
import { api } from '@/lib/api';

interface Props {
  members: TeamMember[];
  onRefresh: () => void;
}

const DEPARTMENTS = ['Leadership', 'Engineering', 'Design', 'Operations'];
const CARD_SIZES = ['standard', 'wide', 'featured'];

type FormState = {
  name: string;
  role: string;
  department: string;
  bio: string;
  photo_url: string;
  linkedin_url: string;
  twitter_url: string;
  email: string;
  card_size: 'featured' | 'wide' | 'standard';
  order: number;
};

const EMPTY_FORM: FormState = {
  name: '', role: '', department: 'Engineering', bio: '',
  photo_url: '', linkedin_url: '', twitter_url: '', email: '',
  card_size: 'standard', order: 0,
};

const CARD_SIZE_STYLE: Record<string, React.CSSProperties> = {
  featured: { color: '#FF9500', border: '1px solid rgba(255,149,0,0.35)', background: 'rgba(255,149,0,0.08)' },
  wide:     { color: '#E08800', border: '1px solid rgba(224,136,0,0.4)', background: 'rgba(224,136,0,0.08)' },
  standard: { color: '#7A8078', border: '1px solid #2A2F2A',             background: 'transparent' },
};

const MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
  letterSpacing: '0.12em', color: '#7A8078',
  textTransform: 'uppercase', marginBottom: '0.375rem', display: 'block',
};

function CardSizeBadge({ size }: { size: string }) {
  const s = CARD_SIZE_STYLE[size] ?? CARD_SIZE_STYLE.standard;
  return (
    <span style={{ ...s, fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', padding: '2px 6px', textTransform: 'uppercase' }}>
      {size}
    </span>
  );
}

function TableRow({ member, deleting, onEdit, onDelete }: {
  member: TeamMember;
  deleting: number | null;
  onEdit: (m: TeamMember) => void;
  onDelete: (id: number, name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid #1C1F1C', background: hovered ? '#151715' : 'transparent', transition: 'background 0.15s' }}
    >
      <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-barlow-condensed)', fontWeight: 700, fontSize: '1rem', color: '#E8EBE8', letterSpacing: '0.01em' }}>
        {member.name}
      </td>
      <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#9A9F98' }}>
        {member.role}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', color: '#9A9F98', border: '1px solid #2A2F2A', padding: '2px 6px', textTransform: 'uppercase' }}>
          {member.department}
        </span>
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <CardSizeBadge size={member.card_size} />
      </td>
      <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#5A5F5A', letterSpacing: '0.05em' }}>
        {member.order}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(member)}
            aria-label="Edit"
            style={{ padding: 6, background: 'transparent', border: '1px solid #1C1F1C', color: '#4A4F4A', cursor: 'pointer', display: 'flex', transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF9500'; (e.currentTarget as HTMLElement).style.borderColor = '#FF9500'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A4F4A'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C'; }}
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(member.id, member.name)}
            disabled={deleting === member.id}
            aria-label="Delete"
            style={{ padding: 6, background: 'transparent', border: '1px solid #1C1F1C', color: '#4A4F4A', cursor: deleting === member.id ? 'not-allowed' : 'pointer', display: 'flex', transition: 'color 0.15s, border-color 0.15s', opacity: deleting === member.id ? 0.4 : 1 }}
            onMouseEnter={e => { if (deleting !== member.id) { (e.currentTarget as HTMLElement).style.color = '#FF4444'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,68,68,0.4)'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A4F4A'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminPanel({ members, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setEditingMember(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (m: TeamMember) => {
    setEditingMember(m);
    setForm({ name: m.name, role: m.role, department: m.department, bio: m.bio || '',
      photo_url: m.photo_url, linkedin_url: m.linkedin_url || '', twitter_url: m.twitter_url || '',
      email: m.email || '', card_size: m.card_size as 'featured' | 'wide' | 'standard', order: m.order });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.photo_url) { toast.error('Name, role, and photo URL are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, linkedin_url: form.linkedin_url || null, twitter_url: form.twitter_url || null, email: form.email || null };
      if (editingMember) { await api.updateMember(editingMember.id, payload); toast.success(`${form.name} updated`); }
      else { await api.createMember(payload); toast.success(`${form.name} added to the team`); }
      setShowForm(false); onRefresh();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    setDeleting(id);
    try { await api.deleteMember(id); toast.success(`${name} removed from the team`); onRefresh(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : 'Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filtered = search.trim()
    ? members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.department.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.14em', color: '#FF9500', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
            {filtered.length === members.length
              ? `${members.length} PERSONNEL ON RECORD`
              : `${filtered.length} OF ${members.length} PERSONNEL`}
          </p>
          <h2 style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: '1.75rem', color: '#E8EBE8', margin: 0, letterSpacing: '-0.01em' }}>
            TEAM ROSTER
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: search ? '#FF9500' : '#4A4F4A', pointerEvents: 'none', transition: 'color 0.15s' }} />
            <input
              type="text"
              placeholder="SEARCH..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#0D0F0D', border: '1px solid #1C1F1C', borderBottom: `1px solid ${search ? '#FF9500' : '#1C1F1C'}`, color: '#E8EBE8', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', padding: '7px 24px 7px 26px', width: 160, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,149,0,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = search ? 'rgba(255,149,0,0.5)' : '#1C1F1C'; }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#4A4F4A', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
          {/* Add button */}
          <button
            onClick={openAdd}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#FF9500', border: '1px solid rgba(255,149,0,0.4)', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,149,0,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = '#FF9500'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,149,0,0.4)'; }}
          >
            <Plus size={12} /> ADD MEMBER
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #1C1F1C', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1C1F1C', background: '#0D0F0D' }}>
                {['NAME', 'ROLE', 'DEPARTMENT', 'CARD SIZE', 'ORDER', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', color: '#7A8078', textTransform: 'uppercase', fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(m => (
                  <TableRow key={m.id} member={m} deleting={deleting} onEdit={openEdit} onDelete={handleDelete} />
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#4A4F4A' }}>
                    NO RESULTS FOR &quot;{search}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)', background: 'rgba(8,10,8,0.85)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-lg overflow-hidden"
              style={{ background: '#111311', border: '1px solid #1C1F1C', borderLeft: '2px solid #FF9500' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1C1F1C' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.14em', color: '#FF9500', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {editingMember ? 'EDIT RECORD' : 'NEW RECORD'}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-barlow-condensed)', fontWeight: 800, fontSize: '1.25rem', color: '#E8EBE8', margin: 0, letterSpacing: '0.01em' }}>
                    {editingMember ? editingMember.name.toUpperCase() : 'ADD MEMBER'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ padding: 8, background: 'transparent', border: '1px solid #1C1F1C', color: '#4A4F4A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF9500'; (e.currentTarget as HTMLElement).style.borderColor = '#FF9500'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4A4F4A'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C'; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {([
                  { label: 'NAME *',         key: 'name',         type: 'text',   placeholder: 'Vishrant Dave' },
                  { label: 'ROLE *',         key: 'role',         type: 'text',   placeholder: 'Co-Founder & CEO' },
                  { label: 'PHOTO URL *',    key: 'photo_url',    type: 'url',    placeholder: 'https://...' },
                  { label: 'LINKEDIN URL',   key: 'linkedin_url', type: 'url',    placeholder: 'https://linkedin.com/in/...' },
                  { label: 'TWITTER URL',    key: 'twitter_url',  type: 'url',    placeholder: 'https://twitter.com/...' },
                  { label: 'EMAIL',          key: 'email',        type: 'email',  placeholder: 'name@armatrix.in' },
                  { label: 'DISPLAY ORDER',  key: 'order',        type: 'number', placeholder: '1' },
                ] as const).map(field => (
                  <div key={field.key}>
                    <label style={MONO_LABEL}>{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(form as Record<string, string | number>)[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="admin-input"
                    />
                  </div>
                ))}

                <div>
                  <label style={MONO_LABEL}>DEPARTMENT *</label>
                  <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="admin-input">
                    {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#111311' }}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label style={MONO_LABEL}>CARD SIZE *</label>
                  <select value={form.card_size} onChange={e => setForm(f => ({ ...f, card_size: e.target.value as 'featured' | 'wide' | 'standard' }))} className="admin-input">
                    {CARD_SIZES.map(s => <option key={s} value={s} style={{ background: '#111311' }}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={MONO_LABEL}>BIO (MAX 500 CHARS)</label>
                  <textarea
                    rows={4}
                    placeholder="Brief professional bio..."
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    maxLength={500}
                    className="admin-input"
                    style={{ resize: 'none' }}
                  />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#3A3F3A', letterSpacing: '0.08em', marginTop: '0.25rem' }}>
                    {form.bio.length}/500
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid #1C1F1C' }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#7A8078', border: '1px solid #1C1F1C', background: 'transparent', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#E8EBE8'; (e.currentTarget as HTMLElement).style.borderColor = '#4A4F4A'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#7A8078'; (e.currentTarget as HTMLElement).style.borderColor = '#1C1F1C'; }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ flex: 1, padding: '8px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: '#080A08', background: '#FF9500', border: '1px solid #FF9500', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.2s' }}
                >
                  {saving ? 'SAVING...' : editingMember ? 'SAVE CHANGES' : 'ADD MEMBER'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
