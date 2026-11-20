import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HistoryHeader } from '../components/history/HistoryHeader';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryRecordList } from '../components/history/HistoryRecordList';
import { HistoryBulkActions } from '../components/history/HistoryBulkActions';
import { HistoryPagination } from '../components/history/HistoryPagination';
import { HistoryEmptyState } from '../components/history/HistoryEmptyState';
import { HistoryError } from '../components/history/HistoryError';
import { HistorySkeleton } from '../components/history/HistorySkeleton';
import { DeleteConfirmation } from '../components/history/DeleteConfirmation';
import { deleteAnalyses, deleteAnalysis, getAnalysisHistory } from '../services/historyService';
import type { HistoryRecord, HistoryStatus } from '../types/history';

function level(record: HistoryRecord) { if (record.hallucinationProbability >= 30) return 'high'; if (record.hallucinationProbability >= 15) return 'medium'; return 'low'; }
function isWithin(record: HistoryRecord, days: number) { return (Date.now() - new Date(record.createdAt).getTime()) / 86400000 <= days; }

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | HistoryStatus>('all');
  const [date, setDate] = useState('all');
  const [hallucinationLevel, setHallucinationLevel] = useState('all');
  const [sort, setSort] = useState('newest');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const pageSize = 8;

  const load = async () => { setLoading(true); setError(false); try { setRecords(await getAnalysisHistory()); } catch { setError(true); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer); }, [toast]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    const next = records.filter((record) => {
      const matchesQuery = !lower || [record.title, record.preview, record.createdAt, record.status].join(' ').toLowerCase().includes(lower);
      const matchesStatus = status === 'all' || record.status === status;
      const matchesDate = date === 'all' || (date === 'today' ? isWithin(record, 1) : isWithin(record, Number(date)));
      return matchesQuery && matchesStatus && matchesDate && (hallucinationLevel === 'all' || level(record) === hallucinationLevel);
    });
    return next.sort((a, b) => sort === 'oldest' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : sort === 'high' ? b.reliabilityScore - a.reliabilityScore : sort === 'low' ? a.reliabilityScore - b.reliabilityScore : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [date, hallucinationLevel, query, records, sort, status]);
  const pages = Math.ceil(filtered.length / pageSize);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allVisibleSelected = visible.length > 0 && visible.every((record) => selected.includes(record.id));

  const changeFilter = (key: 'status' | 'date' | 'level' | 'sort', value: string) => { if (key === 'status') setStatus(value as 'all' | HistoryStatus); if (key === 'date') setDate(value); if (key === 'level') setHallucinationLevel(value); if (key === 'sort') setSort(value); setPage(1); };
  const clearFilters = () => { setQuery(''); setStatus('all'); setDate('all'); setHallucinationLevel('all'); setSort('newest'); setPage(1); };
  const toggleSelected = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleAll = () => setSelected(allVisibleSelected ? selected.filter((id) => !visible.some((record) => record.id === id)) : [...new Set([...selected, ...visible.map((record) => record.id)])]);
  const requestDelete = (id?: string) => { setDeleteTarget(id ?? null); setConfirmOpen(true); };
  const confirmDelete = async () => { const ids = deleteTarget ? [deleteTarget] : selected; setRecords(await (ids.length === 1 ? deleteAnalysis(ids[0]) : deleteAnalyses(ids))); setSelected([]); setDeleteTarget(null); setConfirmOpen(false); setToast(ids.length > 1 ? 'Analyses deleted successfully.' : 'Analysis deleted successfully.'); };

  return <div className="history-page"><Navbar /><main className="history-main"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><HistoryHeader onNew={() => { window.location.href = '/detect'; }} /><div className="history-search-row"><label htmlFor="history-search">Search analyses</label><div><span aria-hidden="true">⌕</span><input id="history-search" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search analyses..." />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}</div></div><HistoryFilters status={status} date={date} level={hallucinationLevel} sort={sort} onChange={changeFilter} /><HistoryBulkActions count={selected.length} onDelete={() => requestDelete()} />{loading ? <HistorySkeleton /> : error ? <HistoryError onRetry={load} /> : filtered.length === 0 ? <HistoryEmptyState onClear={clearFilters} onNew={() => { window.location.href = '/detect'; }} /> : <><div className="history-select-all"><label><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} /> Select visible analyses</label>  <span>{records.length} saved analyses</span></div><HistoryRecordList records={visible} selected={selected} onSelect={toggleSelected} onView={(id) => { window.location.href = `/history/${id}`; }} onDelete={requestDelete} /><HistoryPagination page={page} pages={pages} total={filtered.length} from={(page - 1) * pageSize + 1} to={Math.min(page * pageSize, filtered.length)} onChange={setPage} /></>}</motion.div></main><Footer /><DeleteConfirmation open={confirmOpen} count={deleteTarget ? 1 : selected.length} onCancel={() => setConfirmOpen(false)} onConfirm={confirmDelete} />{toast && <div className="history-toast" role="status">✓ {toast}</div>}</div>;
}
