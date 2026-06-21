import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { certificateApi } from '../../api/certificateApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import './MyCertificatesPage.css';

const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await certificateApi.getMyCertificates();
        setCertificates(res.data || []);
      } catch {
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <div className="certificates-page">
      <h2>Chứng chỉ của tôi 🏆</h2>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Chưa có chứng chỉ nào"
          description="Hoàn thành các khóa học để nhận chứng chỉ xác nhận."
        />
      ) : (
        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert.id} className="certificate-card">
              <div className="cert-card-trophy">🏆</div>
              <div className="cert-card-title">
                {cert.courseName || cert.course?.name || 'Khóa học'}
              </div>
              <div className="cert-card-date">
                Cấp ngày: {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('vi-VN')}
              </div>
              {cert.certificateCode && <div className="cert-card-code">{cert.certificateCode}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
