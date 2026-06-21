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
        setError(err?.message || 'Đã xảy ra lỗi khi xác thực.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cert-verify-page">
      <div className="cert-verify-container">
        <h2>🔍 Xác thực chứng chỉ</h2>
        <p>Nhập mã chứng chỉ để kiểm tra tính xác thực của chứng chỉ Aethera.</p>

        <form onSubmit={handleVerify}>
          <div className="cert-verify-input-group">
            <input
              type="text"
              className="cert-verify-input"
              placeholder="Nhập mã chứng chỉ (VD: CERT-XXXX)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className="cert-verify-btn" disabled={loading || !code.trim()}>
              {loading ? 'Đang kiểm tra...' : 'Xác thực'}
            </button>
          </div>
        </form>

        {error && <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>{error}</p>}

        {result && (
          <div className={`cert-verify-result ${result.valid ? '' : 'invalid'}`}>
            {result.valid ? (
              <>
                <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ color: 'var(--color-success)' }}>✅ Chứng chỉ hợp lệ</h3>
                <div className="cert-verify-detail">
                  {result.studentName && <p><strong>Học viên:</strong> {result.studentName}</p>}
                  {result.courseName && <p><strong>Khóa học:</strong> {result.courseName}</p>}
                  {(result.issuedAt || result.createdAt) && (
                    <p><strong>Ngày cấp:</strong> {new Date(result.issuedAt || result.createdAt).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <XCircle size={40} style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ color: 'var(--color-error)' }}>❌ Chứng chỉ không hợp lệ</h3>
                <p>Không tìm thấy chứng chỉ với mã này. Vui lòng kiểm tra lại.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerifyPage;
