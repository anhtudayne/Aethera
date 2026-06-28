import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { certificateApi } from '../../api/certificateApi';
import './MyCertificatesPage.css';

const CertificateVerifyPage = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      setLoading(true);
      setError('');
      setResult(null);
      const res = await certificateApi.verify(code.trim());
      setResult(res.data);
    } catch (err) {
      if (err?.status === 404) {
        setResult({ valid: false });
      } else {
        setError(err?.message || 'An error occurred while authenticating.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cert-verify-page">
      <div className="cert-verify-container">
        <h2>🔍 Certificate authentication</h2>
        <p>Enter the certificate code to check the authenticity of the Aethera certificate.</p>

        <form onSubmit={handleVerify}>
          <div className="cert-verify-input-group">
            <input
              type="text"
              className="cert-verify-input"
              placeholder="Enter the certificate code (eg: CERT-XXXX)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="cert-verify-btn" disabled={loading || !code.trim()}>
              {loading ? 'Checking...' : 'Verifying'}
            </button>
          </div>
        </form>

        {error && <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>{error}</p>}

        {result && (
          <div className={`cert-verify-result ${result.valid ? '' : 'invalid'}`}>
            {result.valid ? (
              <>
                <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ color: 'var(--color-success)' }}>✅ Valid certificate</h3>
                <div className="cert-verify-detail">
                  {result.studentName && <p><strong>Students:</strong> {result.studentName}</p>}
                  {result.courseName && <p><strong>Course:</strong> {result.courseName}</p>}
                  {(result.issuedAt || result.createdAt) && (
                    <p><strong>Date of issue:</strong> {new Date(result.issuedAt || result.createdAt).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <XCircle size={40} style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ color: 'var(--color-error)' }}>❌ Invalid certificate</h3>
                <p>No certificate found with this code. Please check again.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
