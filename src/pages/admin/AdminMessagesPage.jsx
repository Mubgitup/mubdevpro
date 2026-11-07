import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Check, 
  CheckCheck, 
  RefreshCw, 
  Clock, 
  User, 
  CornerUpLeft, 
  AlertCircle,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import api from '../../services/api';

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [search, setSearch] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter === 'unread') params.is_read = '0';
      if (filter === 'read') params.is_read = '1';
      if (search.trim()) params.search = search.trim();

      const res = await api.messages.list(params);
      if (res.data) {
        setMessages(res.data);
        if (res.data.length > 0 && !selectedMessage) {
          setSelectedMessage(res.data[0]);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch messages from PHP backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const handleToggleRead = async (msg) => {
    try {
      const nextReadState = !msg.is_read;
      await api.messages.markRead(msg.id, nextReadState);
      
      // Update local state
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: nextReadState ? 1 : 0 } : m));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(prev => ({ ...prev, is_read: nextReadState ? 1 : 0 }));
      }
      setActionFeedback(nextReadState ? 'Marked as read' : 'Marked as unread');
      setTimeout(() => setActionFeedback(null), 2500);
    } catch (err) {
      alert(`Error updating message: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      return;
    }

    try {
      await api.messages.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        const remaining = messages.filter(m => m.id !== id);
        setSelectedMessage(remaining[0] || null);
      }
      setActionFeedback('Message deleted successfully');
      setTimeout(() => setActionFeedback(null), 2500);
    } catch (err) {
      alert(`Error deleting message: ${err.message}`);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.subject?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Mail size={28} color="var(--color-neon-cyan, #00D9FF)" /> Contact Messages Inbox
          </h1>
          <p className="admin-page-subtitle">
            Manage inquiries, project requests, and messages submitted via your portfolio contact form.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={fetchMessages}
            disabled={loading}
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34D399',
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} /> {actionFeedback}
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#F87171',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginBottom: '1.25rem' 
      }}>
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`admin-btn admin-btn-sm ${filter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`admin-btn admin-btn-sm ${filter === 'unread' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            Unread ({messages.filter(m => !m.is_read).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`admin-btn admin-btn-sm ${filter === 'read' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            Read ({messages.filter(m => m.is_read).length})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245, 248, 255, 0.4)' }} />
          <input
            type="text"
            className="admin-input"
            style={{ paddingLeft: '2.5rem', paddingRight: '0.85rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
            placeholder="Search by sender, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Inbox Split View: List on Left, Detail on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Message List */}
        <div className="admin-card" style={{ padding: '0.5rem', maxHeight: '720px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(245, 248, 255, 0.5)' }}>
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'rgba(245, 248, 255, 0.5)' }}>
              <Inbox size={40} color="rgba(0, 217, 255, 0.4)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No messages found matching this criteria.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      background: isSelected 
                        ? 'rgba(8, 123, 255, 0.2)' 
                        : !msg.is_read 
                          ? 'rgba(7, 27, 61, 0.7)' 
                          : 'rgba(2, 8, 23, 0.4)',
                      border: isSelected 
                        ? '1px solid rgba(0, 217, 255, 0.5)' 
                        : !msg.is_read 
                          ? '1px solid rgba(0, 217, 255, 0.25)' 
                          : '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: !msg.is_read ? 700 : 500, color: '#fff', fontSize: '0.9rem' }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.5)' }}>
                        {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ 
                      fontSize: '0.82rem', 
                      color: !msg.is_read ? 'var(--color-neon-cyan, #00D9FF)' : 'rgba(245, 248, 255, 0.8)',
                      fontWeight: !msg.is_read ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginBottom: '0.2rem'
                    }}>
                      {msg.subject || '(No Subject)'}
                    </div>

                    <div style={{ 
                      fontSize: '0.76rem', 
                      color: 'rgba(245, 248, 255, 0.5)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message Detail View */}
        <div className="admin-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          {selectedMessage ? (
            <div>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                paddingBottom: '1.25rem', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                    {selectedMessage.subject || '(No Subject)'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-neon-cyan, #00D9FF)', fontWeight: 600 }}>
                      {selectedMessage.name}
                    </span>
                    <span style={{ color: 'rgba(245, 248, 255, 0.4)' }}>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(245, 248, 255, 0.5)', marginTop: '0.35rem' }}>
                    <Clock size={12} />
                    <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Mubdev Contact Inquiry')}`}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    title="Send Email Reply"
                  >
                    <CornerUpLeft size={14} /> Reply
                  </a>
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title={selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {selectedMessage.is_read ? <Check size={14} /> : <CheckCheck size={14} />}
                    {selectedMessage.is_read ? 'Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ 
                padding: '1.75rem 0', 
                fontSize: '0.95rem', 
                lineHeight: 1.7, 
                color: 'rgba(245, 248, 255, 0.9)', 
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit'
              }}>
                {selectedMessage.message}
              </div>

              {/* Sender Details Pill */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'rgba(245, 248, 255, 0.5)'
              }}>
                <div>Message ID: #{selectedMessage.id}</div>
                <div>Stored in: MySQL (`contact_messages`)</div>
              </div>
            </div>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'rgba(245, 248, 255, 0.4)', padding: '3rem' }}>
              <Inbox size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <div>Select a message from the list to view its complete content and reply.</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessagesPage;

