import { useCallback, useEffect, useState } from 'react';
import adminApi from '../services/adminApi';

const base = '/admin/announcements';
const button = 'min-h-11 rounded-xl border border-[#E7D9C2] px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-50';
const field = 'mt-2 min-h-11 w-full rounded-xl border border-[#E7D9C2] bg-white p-3 text-base text-[#1C1917] focus:outline-2 focus:outline-[#AD7400]';
const messageFor = error => error.response?.data?.message || 'Unable to reach the server. Please retry.';

export default function Announcements() {
  const [recipientType, setType] = useState('parent');
  const [scope, setScope] = useState('all');
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [people, setPeople] = useState({ data: [], pages: 0, total: 0 });
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState('');
  const [reloadPeople, setReloadPeople] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [review, setReview] = useState(null);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState({ data: [], page: 1, pages: 0 });
  const [historyPage, setHistoryPage] = useState(1);
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try { const response = await adminApi.get(base, { params: { page: historyPage } }); setHistory(response.data); setHistoryError(''); }
    catch (failure) { setHistoryError(messageFor(failure)); }
    finally { setHistoryLoading(false); }
  }, [historyPage]);
  useEffect(() => {
    void loadHistory();
    const timer = setInterval(() => { if (!document.hidden) void loadHistory(); }, 10000);
    return () => clearInterval(timer);
  }, [loadHistory]);

  useEffect(() => {
    if (scope !== 'selected') return;
    const controller = new AbortController();
    setPeopleLoading(true); setPeopleError('');
    const timer = setTimeout(async () => {
      try { const response = await adminApi.get(`${base}/recipients`, { params: { recipientType, search, page }, signal: controller.signal }); if (!controller.signal.aborted) setPeople(response.data); }
      catch (failure) { if (!controller.signal.aborted) setPeopleError(messageFor(failure)); }
      finally { if (!controller.signal.aborted) setPeopleLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [recipientType, scope, search, page, reloadPeople]);

  const audience = { recipientType, scope, recipientIds: scope === 'selected' ? Object.keys(selected) : [] };
  const locked = busy || Boolean(review) || attempted;
  async function reviewMessage(event) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try { const response = await adminApi.post(`${base}/preview`, audience); setReview(response.data); }
    catch (failure) { setError(messageFor(failure)); }
    finally { setBusy(false); }
  }
  async function sendMessage() {
    if (busy || !review) return;
    setBusy(true); setError(''); setAttempted(true);
    try {
      const response = await adminApi.post(base, { ...audience, title: title.trim(), message: message.trim(), requestId, audienceHash: review.audienceHash });
      setSuccess(`${response.data.alreadySent ? 'Already sent safely' : 'Message sent'} to ${response.data.data.recipientCount} ${recipientType === 'parent' ? 'parent' : 'driver'}${response.data.data.recipientCount === 1 ? '' : 's'}. In-app copies are saved; push delivery is queued where a device is registered.`);
      setReview(null); setAttempted(false); setTitle(''); setMessage(''); setRequestId(crypto.randomUUID());
      void loadHistory();
    } catch (failure) {
      if (failure.response && failure.response.status < 500) { setReview(null); setAttempted(false); setRequestId(crypto.randomUUID()); setError(messageFor(failure)); }
      else setError('The send result is not confirmed. Use “Check / retry send” below; it reuses the same request and cannot create a second announcement.');
    } finally { setBusy(false); }
  }

  return <div className="space-y-8 text-[#4A433B]">
    <div><h4 className="text-xl font-black">Send a message</h4><p className="mt-1 text-sm leading-6 text-[#766B5D]">Send private notifications to active parents or approved drivers. Recipients cannot see each other’s details.</p></div>
    {success && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">{success}</p>}
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
    <form onSubmit={reviewMessage} className="space-y-5">
      <fieldset disabled={locked} className="space-y-5 disabled:opacity-80">
        <legend className="mb-3 font-bold">Choose recipients</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="font-bold">Send to<select className={field} value={recipientType} onChange={event => { setType(event.target.value); setSelected({}); setSearch(''); setPage(1); setPeople({ data: [], pages: 0, total: 0 }); }}><option value="parent">Parents</option><option value="driver">Drivers</option></select></label>
          <label className="font-bold">Audience<select className={field} value={scope} onChange={event => { setScope(event.target.value); setSelected({}); setPage(1); }}><option value="all">All {recipientType === 'parent' ? 'parents' : 'drivers'}</option><option value="selected">Selected {recipientType === 'parent' ? 'parents' : 'drivers'}</option></select></label>
        </div>
        {scope === 'selected' && <section className="rounded-2xl border border-[#EEE4D5] bg-[#FFF9EE] p-4" aria-label="Recipient selection">
          <label className="font-bold">Search recipients<input className={field} value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email or driver ASAN ID" /></label>
          <p className="my-3 text-sm font-bold">{Object.keys(selected).length} selected</p>
          {Object.keys(selected).length > 0 && <div className="mb-3 flex flex-wrap gap-2">{Object.entries(selected).map(([id, person]) => <button type="button" key={id} aria-label={`Remove ${person.name} from recipients`} className="min-h-11 rounded-xl border border-[#E7D9C2] bg-white px-3 text-sm" onClick={() => setSelected(previous => { const next = { ...previous }; delete next[id]; return next; })}>{person.name} ×</button>)}</div>}
          {peopleLoading ? <p role="status">Loading recipients…</p> : peopleError ? <div role="alert"><p>{peopleError}</p><button type="button" className={`${button} mt-2`} onClick={() => setReloadPeople(value => value + 1)}>Retry recipients</button></div> : <>
            {!people.data.length && <p>No matching recipients found.</p>}
            <div className="max-h-72 space-y-2 overflow-y-auto">{people.data.map(person => <label key={person._id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-[#EEE4D5] bg-white p-3"><input type="checkbox" checked={Boolean(selected[person._id])} onChange={event => { const checked = event.target.checked; setSelected(previous => { const next = { ...previous }; if (checked) next[person._id] = person; else delete next[person._id]; return next; }); }} className="h-5 w-5" /><span className="min-w-0 break-words"><strong>{person.name}</strong><span className="block text-sm">{person.email}{person.driverId ? ` · ${person.driverId}` : ''}</span></span></label>)}</div>
            {people.pages > 1 && <div className="mt-3 flex flex-wrap items-center gap-3"><button type="button" className={button} disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {people.pages}</span><button type="button" className={button} disabled={page >= people.pages} onClick={() => setPage(value => value + 1)}>Next</button></div>}
          </>}
        </section>}
        <label className="block font-bold">Title<input className={field} value={title} onChange={event => setTitle(event.target.value)} maxLength={120} required placeholder="For example: School transport update" /><span className="mt-1 block text-right text-xs font-normal">{title.length}/120</span></label>
        <label className="block font-bold">Message<textarea className={`${field} min-h-36`} value={message} onChange={event => setMessage(event.target.value)} maxLength={2000} required rows={5} placeholder="Write the announcement recipients should receive." /><span className="mt-1 block text-right text-xs font-normal">{message.length}/2,000</span></label>
      </fieldset>
      {!review && <button className={`${button} bg-[#FFB000] text-[#1C1917]`} disabled={busy || !title.trim() || !message.trim() || (scope === 'selected' && !Object.keys(selected).length)}>{busy ? 'Preparing review…' : 'Review message & recipients'}</button>}
    </form>
    {review && <section aria-label="Review announcement" className="rounded-2xl border-2 border-[#E6B344] bg-[#FFF5DA] p-5">
      <h4 className="text-lg font-black">Review before sending</h4><p className="mt-2 font-bold">{scope === 'all' ? 'All eligible' : 'Selected'} {recipientType === 'parent' ? 'parents' : 'drivers'} · {review.count} recipient{review.count === 1 ? '' : 's'}</p>
      <p className="mt-2 text-sm">{review.sample.map(person => person.name).join(', ')}{review.count > review.sample.length ? ` and ${review.count - review.sample.length} more` : ''}</p>
      <h5 className="mt-4 break-words text-lg font-bold">{title}</h5><p className="mt-2 whitespace-pre-wrap break-words leading-7">{message}</p>
      <p className="mt-4 text-sm">This creates an in-app notification and queues a push notification for registered devices. Sending cannot be recalled.</p>
      <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={sendMessage} className={`${button} bg-[#1C1917] text-white`}>{busy ? 'Sending…' : attempted ? 'Check / retry send' : `Send to ${review.count} recipient${review.count === 1 ? '' : 's'}`}</button><button type="button" disabled={busy || attempted} className={`${button} bg-white`} onClick={() => setReview(null)}>Edit message</button></div>
    </section>}
    <section className="border-t border-[#EEE4D5] pt-6" aria-label="Sent announcements">
      <div className="flex flex-wrap items-center justify-between gap-3"><h4 className="text-xl font-black">Sent announcements</h4><button type="button" className={button} onClick={loadHistory}>Refresh history</button></div>
      <p className="mt-2 text-sm leading-6">“Accepted by Firebase” means the push service accepted at least one device notification. It does not confirm that the user received or read it.</p>
      {historyError && <p role="alert" className="mt-3 text-red-700">{historyError}</p>}
      {historyLoading && !history.data.length && <p role="status" className="mt-4">Loading sent announcements…</p>}
      {!historyLoading && !history.data.length && !historyError && <p className="mt-4">No sent announcements yet.</p>}
      <div className="mt-4 space-y-4">{history.data.map(item => <article key={item._id} className="rounded-2xl border border-[#EEE4D5] bg-white p-4"><div className="flex flex-wrap justify-between gap-2"><h5 className="break-words font-black">{item.title}</h5><time className="text-xs text-[#766B5D]">{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-2 whitespace-pre-wrap break-words">{item.message}</p><p className="mt-3 text-sm font-bold">{item.scope === 'all' ? 'All' : 'Selected'} {item.recipientType === 'parent' ? 'parents' : 'drivers'} · {item.recipientCount} recipients</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm"><span>Saved in inbox: {item.delivery.inbox}</span><span>Accepted by Firebase: {item.delivery.accepted + item.delivery.partial + item.delivery.partial_pending}</span><span>Pending: {item.delivery.pending + item.delivery.partial_pending}</span><span>No registered device: {item.delivery.no_device}</span><span>Failed / expired: {item.delivery.failed + item.delivery.expired}</span></div></article>)}</div>
      {history.pages > 1 && <div className="mt-4 flex items-center gap-3"><button type="button" className={button} disabled={historyPage <= 1} onClick={() => setHistoryPage(value => value - 1)}>Previous</button><span>Page {history.page} of {history.pages}</span><button type="button" className={button} disabled={historyPage >= history.pages} onClick={() => setHistoryPage(value => value + 1)}>Next</button></div>}
    </section>
  </div>;
}
