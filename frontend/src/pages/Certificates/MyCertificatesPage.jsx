import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, X, Download, Eye, ExternalLink } from 'lucide-react';
import { certificateApi } from '../../api/certificateApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { downloadCertificatePDF } from '../../utils/pdfHelper';
import './MyCertificatesPage.css';

const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownload = async (cert) => {
    try {
      setDownloadingId(cert.id);
      const element = document.getElementById(`hidden-cert-${cert.id}`);
      if (element) {
        await downloadCertificatePDF(element, cert.certificateCode);
      }
    } catch (error) {
      console.error('Error downloading certificate PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const renderFullCertificate = (cert, isModal = false) => {
    const studentName = cert.user ? `${cert.user.firstName} ${cert.user.lastName}` : 'Student';
    const courseName = cert.courseName || cert.course?.name || 'Course';
    const instructorName = cert.course?.instructor || 'Instructor Aethera';
    const issuedDate = new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className={`relative w-full aspect-[1.4/1] bg-white shadow-2xl rounded-sm p-4 md:p-8 flex flex-col items-center justify-between text-slate-800 overflow-hidden ${isModal ? 'max-w-4xl mx-auto' : ''}`}>
        {/* Golden Border */}
        <div className="absolute inset-4 border-2 border-[#C19A5B] pointer-events-none"></div>
        <div className="absolute inset-6 border border-[#C19A5B] pointer-events-none"></div>

        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-[#C19A5B]"></div>
        <div className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 border-[#C19A5B]"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 md:w-12 md:h-12 border-b-4 border-l-4 border-[#C19A5B]"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-[#C19A5B]"></div>

        {/* Certificate Content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full h-full py-6 px-4 md:py-12 md:px-16 justify-between">
          <p className="text-gray-700 uppercase tracking-widest text-[10px] md:text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Aethera Academy</p>

          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#C5834C]" style={{ fontFamily: "'Playfair Display', serif" }}>CERTIFICATE OF COMPLETION</h1>

          <p className="text-gray-600 text-xs md:text-base">This certification is awarded to</p>

          <div className="my-1">
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-slate-800" style={{ fontFamily: "'Great Vibes', cursive" }}>{studentName}</h2>
            <div className="w-32 md:w-64 h-px bg-[#C19A5B] mx-auto mt-1"></div>
          </div>

          <p className="text-gray-600 text-xs md:text-base">for successfully completing the course</p>

          <h3 className="text-sm md:text-xl font-bold text-[#C5834C] px-2" style={{ fontFamily: "'Playfair Display', serif" }}>{courseName}</h3>

          {/* Footer */}
          <div className="w-full grid grid-cols-3 items-end mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xs md:text-lg text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>{issuedDate}</span>
              <div className="w-16 md:w-32 h-px bg-[#C19A5B] my-1"></div>
              <span className="text-[6px] md:text-[8px] font-bold tracking-tighter text-gray-500 uppercase">DATE ISSUED</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl md:text-5xl text-[#C19A5B] opacity-40">military_tech</span>
                <span className="absolute text-[5px] md:text-[7px] font-bold text-[#C19A5B] text-center leading-tight">AETHERA<br />ACADEMY</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs md:text-lg text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>{instructorName}</span>
              <div className="w-16 md:w-32 h-px bg-[#C19A5B] my-1"></div>
              <span className="text-[6px] md:text-[8px] font-bold tracking-tighter text-gray-500 uppercase">LECTURER</span>
            </div>
          </div>

          {cert.certificateCode && (
            <div className="absolute top-0 right-0 mt-1 mr-1 text-[8px] md:text-xs text-gray-400 font-mono tracking-wider">
              CC Code: {cert.certificateCode}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="certificates-page">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          My certificates <span className="text-3xl">🏆</span>
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Manage and view all the certificates you have earned from your courses.
        </p>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Loading...</span>
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete courses to receive a certified certificate."
        />
      ) : (
        <>
          {/* Certificate Grid List */}
          <div className="certificates-grid">
            {certificates.map((cert) => {
              const courseName = cert.courseName || cert.course?.name || 'Course';
              const courseSlug = cert.course?.slug || cert.courseId || cert.course?.id;
              const issuedDate = new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

              return (
                <div key={cert.id} className="certificate-item-card bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
                  {/* Course Thumbnail or fallback trophy gradient */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                    {cert.course?.thumbnail ? (
                      <img
                        src={cert.course.thumbnail}
                        alt={courseName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                        <span className="text-3xl">🏆</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                      Certified
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/courses/${courseSlug}`}
                        className="text-sm font-bold text-slate-800 hover:text-amber-600 transition line-clamp-2 min-h-[2.5rem] mb-1 flex items-center gap-1 group"
                        title="View Course Details"
                      >
                        <span className="flex-1 line-clamp-2">{courseName}</span>
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition shrink-0 text-slate-400" />
                      </Link>
                      <p className="text-[11px] text-slate-400">Issued: {issuedDate}</p>
                      <span className="text-[9px] bg-slate-50 text-slate-500 font-mono px-2 py-0.5 rounded-full mt-2 inline-block border border-slate-100">
                        {cert.certificateCode}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded transition duration-200"
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => handleDownload(cert)}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition duration-200"
                        disabled={downloadingId === cert.id}
                      >
                        <Download size={12} /> {downloadingId === cert.id ? 'Saving...' : 'PDF'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Off-screen elements rendering the full-size certificates for canvas capturing */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1024px' }}>
            {certificates.map((cert) => (
              <div key={`hidden-${cert.id}`} id={`hidden-cert-${cert.id}`} style={{ width: '1024px' }}>
                {renderFullCertificate(cert, false)}
              </div>
            ))}
          </div>

          {/* Certificate Detail Modal */}
          {selectedCert && (
            <div className="modal-overlay">
              <div className="modal-content relative max-w-4xl w-full">
                <button
                  onClick={() => setSelectedCert(null)}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                <h3 className="modal-title mb-4">Certificate Preview</h3>

                <div className="my-4 overflow-x-auto flex justify-center">
                  <div style={{ width: '100%', minWidth: '600px', maxWidth: '800px' }}>
                    {renderFullCertificate(selectedCert, true)}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="cert-btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDownload(selectedCert)}
                    className="cert-btn-primary"
                    disabled={downloadingId === selectedCert.id}
                  >
                    <Download size={16} />
                    {downloadingId === selectedCert.id ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCertificatesPage;
