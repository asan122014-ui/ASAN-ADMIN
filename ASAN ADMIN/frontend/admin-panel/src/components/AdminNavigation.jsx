import { useState } from 'react';
import { LayoutDashboard, ClipboardList, Car, Users, School, MapPin, Wallet, Megaphone, BarChart3, ScrollText, Menu, X, LogOut, ArrowUpRight } from 'lucide-react';
import { getStoredAdmin, getStoredAdminRole, logoutAdmin, clearAdminSession } from '../services/adminAuthService';

export const adminSections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, group: 'Workspace', description: 'Your platform at a glance. Review activity and decide what needs attention.' },
  { id: 'requests', label: 'Driver Requests', icon: ClipboardList, group: 'Operations', description: 'Review parent requests and connect families with suitable drivers.' },
  { id: 'drivers', label: 'Drivers', icon: Car, group: 'Operations', description: 'Review individual driver registrations, documents and approvals.' },
  { id: 'parents', label: 'Parents', icon: Users, group: 'Operations', description: 'Manage individual parent accounts and driver assignments.' },
  { id: 'institutes', label: 'Registered Schools', icon: School, group: 'Institutes', description: 'School enrollment and school-linked drivers, parents and students.' },
  { id: 'locationChanges', label: 'Location Changes', icon: MapPin, group: 'Operations', description: 'Review requested pickup and drop-off location changes.' },
  { id: 'driverPayouts', label: 'Driver Payments', icon: Wallet, group: 'Finance', description: 'Review driver payouts and manage payment processing.' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, group: 'Communication', superadmin: true, description: 'Compose announcements for selected parents, drivers or audience groups.' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Reports', description: 'Understand driver onboarding activity and verification trends.' },
  { id: 'logs', label: 'Activity Logs', icon: ScrollText, group: 'Reports', superadmin: true, description: 'Review administrator activity and verification actions.' },
];

export default function AdminNavigation({ view, onNavigate, pending }) {
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const role = getStoredAdminRole();
  const email = getStoredAdmin()?.email || 'Administrator';
  const items = adminSections.filter(item => !item.superadmin || role === 'superadmin');
  async function logout() {
    if (!window.confirm('Are you sure you want to logout?')) return;
    setLoggingOut(true);
    try { await logoutAdmin(); } finally { clearAdminSession(); window.location.replace('/'); }
  }
  return <aside className="admin-sidebar">
    <div className="admin-brand"><div className="admin-brand-mark">A</div><div><strong>ASAN<span>Rides</span></strong><small>ADMIN WORKSPACE</small></div><button className="admin-mobile-toggle" type="button" aria-label={expanded ? 'Close navigation' : 'Open navigation'} aria-expanded={expanded} aria-controls="admin-navigation" onClick={() => setExpanded(!expanded)}>{expanded ? <X size={22}/> : <Menu size={22}/>}</button></div>
    <nav id="admin-navigation" aria-label="Admin navigation" className={expanded ? 'is-open' : ''}>
      {[...new Set(items.map(item => item.group))].map(group => <div className="admin-nav-group" key={group}><p>{group}</p>{items.filter(item => item.group === group).map(item => { const Icon = item.icon; return <a key={item.id} href={`?section=${item.id}`} aria-current={view === item.id ? 'page' : undefined} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); onNavigate(item.id); setExpanded(false); }}><Icon size={19}/><span>{item.label}</span>{item.id === 'requests' && pending > 0 && <b>{pending}</b>}{view === item.id && <ArrowUpRight size={15} className="admin-nav-arrow"/>}</a>; })}</div>)}
    </nav>
    <div className={`admin-account ${expanded ? 'is-open' : ''}`}><div className="admin-account-info"><span>{email.charAt(0).toUpperCase()}</span><div><strong title={email}>{email}</strong><small>{role === 'superadmin' ? 'Super Admin' : role === 'reviewer' ? 'Reviewer' : 'Admin'}</small></div></div><button onClick={logout} disabled={loggingOut}><LogOut size={17}/>{loggingOut ? 'Signing out...' : 'Sign out'}</button></div>
  </aside>;
}
