import { useEffect, useState } from 'react';

import adminApi from '../services/adminApi';

import { getStoredAdminRole } from '../services/adminAuthService';

function DriverDocuments({ instituteId, driverId }) {

  const [details, setDetails] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);

  const load = async () => { setBusy(true); setError(''); try { setDetails((await adminApi.get(`/institute-admin/${instituteId}/drivers/${driverId}/documents`)).data); } catch (error) { setError(error.response?.data?.message || 'Unable to load documents.'); } finally { setBusy(false); } };

  return <div><button disabled={busy} className="mt-2 min-h-11 font-bold text-amber-800 underline" onClick={load}>{busy ? 'Loading…' : 'Review documents'}</button>{error && <p role="alert">{error}</p>}{details && <div className="max-w-xs space-y-2 py-2"><p>{details.driver.address}</p><p>{details.driver.vehicleNumber} · {details.driver.vehicleType}</p><p>Licence: {details.driver.licenseNumber}</p>{details.documents.map(document => <a className="block min-h-11 text-amber-800 underline" key={document.field} href={document.url} target="_blank" rel="noreferrer">{document.field.replace(/([a-z])([A-Z])/g, '$1 $2')}</a>)}<small>Document links expire after one minute. Select Review documents to refresh them.</small></div>}</div>;

}



export default function Institutes() {

  const [institutes, setInstitutes] = useState([]), [open, setOpen] = useState(''), [kind, setKind] = useState('drivers'), [members, setMembers] = useState({ data: [] }), [page, setPage] = useState(1), [error, setError] = useState(''), [busy, setBusy] = useState(false), [prefix, setPrefix] = useState('');

  const load = async () => { try { setInstitutes((await adminApi.get('/institute-admin')).data.data); } catch (error) { setError(error.response?.data?.message || 'Unable to load Institutes.'); } };

  useEffect(() => { load(); }, []);

  useEffect(() => {

    setMembers({ data: [] }); if (!open) return;

    const controller = new AbortController(); setBusy(true); setError('');

    adminApi.get(`/institute-admin/${open}/${kind}?page=${page}`, { signal: controller.signal }).then(response => setMembers(response.data)).catch(error => { if (!controller.signal.aborted) setError(error.response?.data?.message || 'Unable to load members.'); }).finally(() => { if (!controller.signal.aborted) setBusy(false); });

    return () => controller.abort();

  }, [open, kind, page]);

  const save = async (institute, enabled) => {

    setBusy(true); setError('');

    try { await adminApi.patch(`/institute-admin/${institute._id}/enrollment`, { enabled, driverPrefix: prefix }); await load(); }

    catch (error) { setError(error.response?.data?.message || 'Unable to update Institute.'); }

    finally { setBusy(false); }

  };

  return <div className="space-y-5"><h2 className="text-2xl font-bold">Registered Schools</h2><p>Select a school to view its drivers, parents and students. School accounts are managed separately from regular accounts.</p>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}

    {!institutes.length && <p>No Institutes available.</p>}

    {institutes.map(institute => <section key={institute._id} className="overflow-hidden rounded-2xl border border-[#E7D9C2] bg-white"><button className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left" aria-expanded={open === institute._id} onClick={() => { setOpen(open === institute._id ? '' : institute._id); setPrefix(institute.driverPrefix || ''); setPage(1); }}><span className="font-bold">{institute.name}<span className="mt-1 block text-sm font-normal">{institute.managedEnrollmentEnabled ? `Enrollment enabled  /  ${institute.driverPrefix}` : 'Enrollment awaiting activation'}</span></span><span>{institute.drivers} drivers  /  {institute.parents} parents  /  {institute.children} students  +</span></button>

      {open === institute._id && <div className="border-t p-5">{getStoredAdminRole() === 'superadmin' && <div className="mb-5 flex flex-wrap items-end gap-3"><label>Unique Institute prefix<input className="mt-1 block rounded-lg border p-3" value={prefix} maxLength={12} onChange={event => setPrefix(event.target.value.toUpperCase())} placeholder="KGR" /></label><button disabled={busy} className="rounded-lg bg-amber-400 p-3 font-bold disabled:opacity-50" onClick={() => save(institute, !institute.managedEnrollmentEnabled)}>{institute.managedEnrollmentEnabled ? 'Pause enrollment' : 'Enable enrollment'}</button></div>}

      <div className="mb-4 flex flex-wrap gap-2">{['drivers', 'parents', 'children'].map(tab => <button key={tab} onClick={() => { setKind(tab); setPage(1); }} className={`rounded-lg border px-4 py-2 capitalize ${kind === tab ? 'bg-amber-100 font-bold' : ''}`}>{tab === "children" ? "Students" : tab}</button>)}</div>{busy && <p role="status">Loading...</p>}

      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Name', kind === 'children' ? 'School' : 'Email', kind === 'children' ? 'Class' : 'Phone', 'Driver ID', 'Status'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{members.data.map(person => <tr key={person._id} className="border-t"><td className="p-3">{person.name}{kind === "drivers" && <DriverDocuments instituteId={institute._id} driverId={person._id} />}</td><td className="p-3">{kind === "children" ? person.school || "Not set" : person.email || "Not set"}</td><td className="p-3">{person.phone || person.grade}</td><td className="p-3">{person.driverId || '-'}</td><td className="p-3">{person.status || 'Registered'}</td></tr>)}</tbody></table></div>{!busy && !members.data.length && <p className="p-3">No {kind === "children" ? "students" : kind} registered through this school.</p>}<div className="mt-4 flex items-center gap-3"><button disabled={page <= 1 || busy} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {Math.max(1, members.pages || 1)}</span><button disabled={page >= (members.pages || 1) || busy} onClick={() => setPage(page + 1)}>Next</button></div></div>}

    </section>)}

  </div>;

}

