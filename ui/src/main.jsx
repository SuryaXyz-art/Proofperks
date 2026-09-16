// SPDX-License-Identifier: Apache-2.0

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.js';
import {
  connectPreprodWallet,
  createProofPerksClient,
  createProofPerksReissueClient,
  readCampaignDashboard,
} from './midnight.js';
import './styles.css';

const defaultContractAddress = import.meta.env.VITE_PROOFPERKS_CONTRACT_ADDRESS ?? '';
const defaultIssuerPublicKey = import.meta.env.VITE_PROOFPERKS_ISSUER_PUBLIC_KEY ?? '';

function shortAddress(value) {
  if (!value) return 'Not connected';
  const text = typeof value === 'string' ? value : String(value);
  return text.length > 18 ? `${text.slice(0, 10)}…${text.slice(-6)}` : text;
}

function formatUnits(value) {
  if (value === undefined || value === null) return '—';
  try {
    return new Intl.NumberFormat('en-US').format(typeof value === 'bigint' ? value : BigInt(value));
  } catch {
    return String(value);
  }
}

function App() {
  const [wallet, setWallet] = useState(null);
  const [contractAddress, setContractAddress] = useState(defaultContractAddress);
  const [issuerPublicKey, setIssuerPublicKey] = useState(defaultIssuerPublicKey);
  const [issuerSecret, setIssuerSecret] = useState('');
  const [contributorAnchor, setContributorAnchor] = useState('');
  const [contributorSecret, setContributorSecret] = useState('');
  const [revokeSecret, setRevokeSecret] = useState('');
  const [reissueAnchor, setReissueAnchor] = useState('');
  const [oldContributorSecret, setOldContributorSecret] = useState('');
  const [newContributorSecret, setNewContributorSecret] = useState('');
  const [newPoints, setNewPoints] = useState('125');
  const [points, setPoints] = useState('125');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [message, setMessage] = useState('Connect an organizer wallet to load the campaign.');
  const [dashboardError, setDashboardError] = useState('');

  async function refreshDashboard() {
    if (!wallet || !contractAddress) return;
    setLoadingDashboard(true);
    setDashboardError('');
    try {
      setDashboard(await readCampaignDashboard({ wallet, contractAddress }));
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, [wallet, contractAddress]);

  async function handleConnect() {
    setBusy(true);
    try {
      const connected = await connectPreprodWallet();
      setWallet(connected);
      setMessage('Organizer wallet connected to Midnight Preprod.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  function handleAddPending(event) {
    event.preventDefault();
    if (!contributorSecret) {
      setMessage('Add the contributor secret before placing a credential in the approval queue.');
      return;
    }
    const parsedPoints = Number(points);
    if (!Number.isSafeInteger(parsedPoints) || parsedPoints < 0) {
      setMessage('Points must be a non-negative whole number.');
      return;
    }

    setPendingApprovals((current) => [
      ...current,
      { id: `${Date.now()}-${current.length + 1}`, contributorAnchor: contributorAnchor || contributorSecret, contributorSecret, points: String(parsedPoints) },
    ]);
    setContributorAnchor('');
    setContributorSecret('');
    setPoints('125');
    setMessage('Credential added to this session’s private approval queue.');
  }

  async function handleApprove(item) {
    setBusy(true);
    try {
      if (!wallet) throw new Error('Connect the organizer wallet first.');
      if (!contractAddress) throw new Error('Enter the deployed Preprod contract address.');
      if (!issuerPublicKey) throw new Error('Enter the campaign issuer public key.');
      if (!issuerSecret) throw new Error('Enter the issuer secret; it is used only in the local prover.');

      const proofPerks = await createProofPerksClient({
        wallet,
        contractAddress,
        issuerPublicKey,
        issuerSecret,
        contributorAnchor: item.contributorAnchor,
        contributorSecret: item.contributorSecret,
        points: BigInt(item.points),
      });
      const result = await proofPerks.approveContribution();
      setPendingApprovals((current) => current.filter((candidate) => candidate.id !== item.id));
      setMessage(`Contribution approved on-chain. Transaction: ${result.txHash ?? 'submitted'}`);
      await refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke(event) {
    event.preventDefault();
    setBusy(true);
    try {
      if (!wallet) throw new Error('Connect the organizer wallet first.');
      if (!contractAddress) throw new Error('Enter the deployed Preprod contract address.');
      if (!issuerPublicKey) throw new Error('Enter the campaign issuer public key.');
      if (!issuerSecret) throw new Error('Enter the issuer secret; it is used only in the local prover.');
      if (!revokeSecret) throw new Error('Enter the contributor secret to revoke.');

      const proofPerks = await createProofPerksClient({
        wallet,
        contractAddress,
        issuerPublicKey,
        issuerSecret,
        contributorSecret: revokeSecret,
        points: 0n,
      });
      const result = await proofPerks.revokeContribution();
      setRevokeSecret('');
      setMessage(`Credential revoked for future claims. Transaction: ${result.txHash ?? 'submitted'}`);
      await refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleReissue(event) {
    event.preventDefault();
    setBusy(true);
    try {
      if (!wallet) throw new Error('Connect the organizer wallet first.');
      if (!contractAddress) throw new Error('Enter the deployed Preprod contract address.');
      if (!issuerPublicKey) throw new Error('Enter the campaign issuer public key.');
      if (!issuerSecret) throw new Error('Enter the issuer secret; it is used only in the local prover.');
      if (!reissueAnchor || !oldContributorSecret || !newContributorSecret) throw new Error('Recovery anchor, old secret, and new secret are required.');

      const newValue = Number(newPoints);
      if (!Number.isSafeInteger(newValue) || newValue < 0) {
        throw new Error('New points must be a non-negative whole number.');
      }

      const proofPerks = await createProofPerksReissueClient({
        wallet,
        contractAddress,
        issuerPublicKey,
        issuerSecret,
        contributorAnchor: reissueAnchor,
        oldContributorSecret,
        newContributorSecret,
        newPoints: newValue,
      });
      const result = await proofPerks.reissueContribution();
      setReissueAnchor('');
      setOldContributorSecret('');
      setNewContributorSecret('');
      setMessage(`Credential re-issued. Old credential revoked; new commitment submitted. Transaction: ${result.txHash ?? 'submitted'}`);
      await refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  function removePending(id) {
    setPendingApprovals((current) => current.filter((item) => item.id !== id));
    setMessage('Pending credential removed from this session.');
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">P</span><span>ProofPerks</span></div>
        <div className="topbar-actions">
          <span className="network-pill"><span className="live-dot" /> Midnight Preprod</span>
          <button className="secondary compact" onClick={handleConnect} disabled={busy}>
            {wallet ? shortAddress(wallet.address) : 'Connect wallet'}
          </button>
        </div>
      </header>

      <section className="hero dashboard-hero">
        <div>
          <p className="eyebrow">ORGANIZER CONSOLE / SINGLE CAMPAIGN</p>
          <h1>Approve the work.<br /><em>Keep the proof private.</em></h1>
          <p className="lede">Review contribution credentials in this session, approve eligible work with your wallet, and watch public campaign aggregates update on Midnight.</p>
        </div>
        <div className="hero-note"><span className="note-kicker">SESSION BOUNDARY</span><strong>No browser storage</strong><span>Secrets and raw points are cleared when this tab session ends.</span></div>
      </section>

      <section className="metrics" aria-label="Campaign overview">
        <Metric label="Approved commitments" value={dashboard ? formatUnits(dashboard.approvedCommitmentCount) : '—'} detail="public Merkle tree leaves" />
        <Metric label="Claims made" value={dashboard ? formatUnits(dashboard.claimCount) : '—'} detail="public nullifier count" />
        <Metric label="Remaining budget" value={dashboard ? formatUnits(dashboard.remainingBudget) : '—'} detail="native-token base units" />
        <Metric label="Reward per claim" value={dashboard ? formatUnits(dashboard.rewardAmount) : '—'} detail="fixed native-token units" />
      </section>

      {dashboardError && <div className="alert" role="alert">Could not load public campaign state: {dashboardError}</div>}

      <section className="workspace-grid">
        <section className="card queue-card">
          <div className="card-heading">
            <div><p className="eyebrow">PRIVATE INTAKE</p><h2>Pending approvals <span className="count">{pendingApprovals.length}</span></h2></div>
            <span className="privacy-badge">Session only</span>
          </div>
          <p className="hint">Add a credential received off-chain. The secret and points stay in React memory until you approve or remove the item.</p>
          <form className="intake-form" onSubmit={handleAddPending}>
            <label>Stable recovery anchor <span>private witness</span><input type="password" value={contributorAnchor} onChange={(event) => setContributorAnchor(event.target.value)} placeholder="Keep this anchor for future re-issue" /></label>
            <label>Contributor secret <span>private witness</span><input type="password" value={contributorSecret} onChange={(event) => setContributorSecret(event.target.value)} placeholder="Never written to the ledger" /></label>
            <div className="form-row">
              <label>Approved points <span>private witness</span><input type="number" min="0" value={points} onChange={(event) => setPoints(event.target.value)} /></label>
              <button className="secondary" type="submit" disabled={busy}>Add to queue</button>
            </div>
          </form>

          <div className="queue-list">
            {pendingApprovals.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">+</span><strong>No pending credentials</strong><span>Add an off-chain approval request to begin.</span></div>
            ) : pendingApprovals.map((item, index) => (
              <article className="queue-item" key={item.id}>
                <div className="queue-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="queue-copy"><strong>Contribution credential</strong><span>Secret held locally · {item.points} points</span></div>
                <div className="queue-actions"><button className="primary small" onClick={() => handleApprove(item)} disabled={busy || !wallet}>Approve on-chain</button><button className="text-button" onClick={() => removePending(item.id)} disabled={busy}>Remove</button></div>
              </article>
            ))}
          </div>
        </section>

        <aside className="card config-card">
          <div className="card-heading"><div><p className="eyebrow">CAMPAIGN CONFIG</p><h2>Organizer access</h2></div><span className="wallet-badge">{wallet ? 'Connected' : 'Offline'}</span></div>
          <label>Contract address<input value={contractAddress} onChange={(event) => setContractAddress(event.target.value)} placeholder="Preprod contract address" /></label>
          <label>Issuer public key<input value={issuerPublicKey} onChange={(event) => setIssuerPublicKey(event.target.value)} placeholder="Deployment issuer key" /></label>
          <label>Issuer secret <span>private witness</span><input type="password" value={issuerSecret} onChange={(event) => setIssuerSecret(event.target.value)} placeholder="Used locally to authorize approval" /></label>
          <form className="revoke-box" onSubmit={handleRevoke}>
            <div><p className="eyebrow">SAFETY CONTROL</p><h3>Revoke a credential</h3></div>
            <p>Blocks future claims for this secret. A private-derived marker is published; existing claims are not undone.</p>
            <label>Contributor secret <span>private witness</span><input type="password" value={revokeSecret} onChange={(event) => setRevokeSecret(event.target.value)} placeholder="Never written to the ledger" /></label>
            <button className="danger" type="submit" disabled={busy || !wallet}>Revoke future claims</button>
          </form>
          <form className="reissue-box" onSubmit={handleReissue}>
            <div><p className="eyebrow">RECOVERY PATH</p><h3>Re-issue a credential</h3></div>
            <p>Retires the old secret marker and issues a replacement under the same private recovery anchor. This issuer-mediated path keeps one claim across secret rotation.</p>
            <label>Stable recovery anchor <span>private witness</span><input type="password" value={reissueAnchor} onChange={(event) => setReissueAnchor(event.target.value)} placeholder="Same anchor for old and new credential" /></label>
            <label>Old contributor secret <span>private witness</span><input type="password" value={oldContributorSecret} onChange={(event) => setOldContributorSecret(event.target.value)} /></label>
            <label>New points <span>private witness</span><input type="number" min="0" value={newPoints} onChange={(event) => setNewPoints(event.target.value)} /></label>
            <label>New contributor secret <span>private witness</span><input type="password" value={newContributorSecret} onChange={(event) => setNewContributorSecret(event.target.value)} placeholder="Replacement secret" /></label>
            <button className="secondary" type="submit" disabled={busy || !wallet}>Re-issue credential</button>
          </form>
          <div className="config-footer"><span>Connected wallet</span><strong>{shortAddress(wallet?.address)}</strong></div>
          <button className="secondary refresh" onClick={refreshDashboard} disabled={loadingDashboard || !wallet || !contractAddress}>{loadingDashboard ? 'Refreshing…' : 'Refresh public state'}</button>
          <p className="status" role="status">{message}</p>
        </aside>
      </section>

      <section className="ledger-strip">
        <div><span className="strip-label">COMMITMENTS ROOT</span><code>{dashboard?.commitmentsRoot ?? 'Connect wallet to read public state'}</code></div>
        <div><span className="strip-label">CAMPAIGN</span><strong>{dashboard ? `#${dashboard.campaign.id.toString()}` : '—'}</strong></div>
        <div><span className="strip-label">THRESHOLD</span><strong>{dashboard ? `${formatUnits(dashboard.campaign.thresholdPoints)} points` : '—'}</strong></div>
      </section>

      <footer className="privacy-row"><div><strong>Private</strong><span>Evidence, secret, raw points</span></div><div><strong>Public</strong><span>Rules, commitments, nullifiers, aggregates</span></div><div><strong>Trust boundary</strong><span>Issuer decides what deserves approval</span></div></footer>
    </main>
  );
}

function Metric({ label, value, detail }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
