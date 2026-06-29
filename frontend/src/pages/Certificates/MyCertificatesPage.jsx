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
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          My certificate <span className="text-3xl">🏆</span>
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
        <div className="flex flex-col gap-10">
          {certificates.map((cert) => {
            const studentName = cert.user ? `${cert.user.firstName} ${cert.user.lastName}` : 'Student';
            const courseName = cert.courseName || cert.course?.name || 'Course';
            const instructorName = cert.course?.instructor || 'Instructor Aethera';
            const issuedDate = new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            return (
              <div key={cert.id} className="relative w-full max-w-4xl mx-auto aspect-[1.4/1] bg-white shadow-2xl rounded-sm p-4 md:p-8 flex flex-col items-center justify-between text-slate-800 overflow-hidden">
                {/* Golden Border */}
                <div className="absolute inset-4 border-2 border-[#C19A5B] pointer-events-none"></div>
                <div className="absolute inset-6 border border-[#C19A5B] pointer-events-none"></div>

                {/* Corner Ornaments */}
                <div className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-[#C19A5B]"></div>
                <div className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 border-[#C19A5B]"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 md:w-12 md:h-12 border-b-4 border-l-4 border-[#C19A5B]"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-[#C19A5B]"></div>

                {/* Certificate Content */}
                <div className="relative z-10 flex flex-col items-center text-center w-full h-full py-8 px-8 md:py-12 md:px-16">
                  <p className="text-gray-700 uppercase tracking-widest mb-2 md:mb-4 text-xs md:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>Aethera Academy</p>

                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#C5834C] mb-4 md:mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>CERTIFICATE OF COMPLETION</h1>

                  <p className="text-gray-600 text-sm md:text-lg mb-4 md:mb-8">This certification is awarded to</p>

                  <div className="mb-2">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl text-slate-800" style={{ fontFamily: "'Great Vibes', cursive" }}>{studentName}</h2>
                    <div className="w-48 md:w-64 h-px bg-[#C19A5B] mx-auto mt-2"></div>
                  </div>

                  <p className="text-gray-600 text-sm md:text-lg mt-4 md:mt-8 mb-2">for successfully completing the course</p>

                  <h3 className="text-lg md:text-2xl font-bold text-[#C5834C] px-4" style={{ fontFamily: "'Playfair Display', serif" }}>{courseName}</h3>

                  {/* Footer */}
                  <div className="mt-auto w-full grid grid-cols-3 items-end">
                    <div className="flex flex-col items-center">
                      <span className="text-sm md:text-xl text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>{issuedDate}</span>
                      <div className="w-20 md:w-32 h-px bg-[#C19A5B] my-1"></div>
                      <span className="text-[8px] md:text-[10px] font-bold tracking-tighter text-gray-500 uppercase">DATE ISSUED</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl md:text-6xl text-[#C19A5B] opacity-40">military_tech</span>
                        <span className="absolute text-[6px] md:text-[8px] font-bold text-[#C19A5B] text-center leading-tight">AETHERA<br />ACADEMY</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-sm md:text-xl text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>{instructorName}</span>
                      <div className="w-20 md:w-32 h-px bg-[#C19A5B] my-1"></div>
                      <span className="text-[8px] md:text-[10px] font-bold tracking-tighter text-gray-500 uppercase">LECTURER</span>
                    </div>
                  </div>

                  {cert.certificateCode && (
                    <div className="absolute top-0 right-0 mt-4 mr-4 text-xs text-gray-400 font-mono tracking-wider">
                      CC Code: {cert.certificateCode}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCertificatesPage;
