import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { certificateApi } from '../../api/certificateApi';
import './MyCertificatesPage.css';
const CertificateVerifyPage = () => {
  const { code: urlCode } = useParams();
  const [code, setCode] = useState(urlCode || '');
  const [prevUrlCode, setPrevUrlCode] = useState(urlCode);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (urlCode !== prevUrlCode) {
    setPrevUrlCode(urlCode);
    setCode(urlCode || '');
  }

  const fetchAndVerify = async (verifyCode) => {
    if (!verifyCode.trim()) return;
    try {
      setLoading(true);
      setError('');
      setResult(null);
      const res = await certificateApi.verify(verifyCode.trim());
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

  useEffect(() => {
    let active = true;
    if (urlCode) {
      const load = async () => {
        try {
          await Promise.resolve();
          if (!active) return;
          setLoading(true);
          setError('');
          setResult(null);
          const res = await certificateApi.verify(urlCode.trim());
          if (active) {
            setResult(res.data);
          }
        } catch (err) {
          if (active) {
            if (err?.status === 404) {
              setResult({ valid: false });
            } else {
              setError(err?.message || 'An error occurred while authenticating.');
            }
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };
      load();
    }
    return () => {
      active = false;
    };
  }, [urlCode]);

  const handleVerify = (e) => {
    e.preventDefault();
    fetchAndVerify(code);
  };

  const certData = result?.certificate;

  return (
    <div className="cert-verify-page">
      <div className={`cert-verify-container ${result?.valid ? 'has-result' : ''}`}>
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
          <div className={`cert-verify-result ${result.valid ? 'valid-wrapper' : 'invalid'}`}>
            {result.valid ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <CheckCircle size={40} style={{ color: 'var(--color-success)', marginBottom: 'var(--space-xs)' }} />
                  <h3 style={{ color: 'var(--color-success)', margin: 0 }}>✅ Valid certificate</h3>
                </div>

                {/* Premium Certificate Render */}
                <div className="relative w-full max-w-4xl mx-auto aspect-[1.4/1] bg-white shadow-2xl rounded-sm p-4 md:p-8 flex flex-col items-center justify-between text-slate-800 overflow-hidden">
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
                      <h2 className="text-3xl md:text-5xl lg:text-6xl text-slate-800" style={{ fontFamily: "'Great Vibes', cursive" }}>{certData?.studentName}</h2>
                      <div className="w-48 md:w-64 h-px bg-[#C19A5B] mx-auto mt-2"></div>
                    </div>

                    <p className="text-gray-600 text-sm md:text-lg mt-4 md:mt-8 mb-2">for successfully completing the course</p>

                    <h3 className="text-lg md:text-2xl font-bold text-[#C5834C] px-4" style={{ fontFamily: "'Playfair Display', serif" }}>{certData?.courseName}</h3>

                    {/* Footer */}
                    <div className="mt-auto w-full grid grid-cols-3 items-end">
                      <div className="flex flex-col items-center">
                        <span className="text-sm md:text-xl text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>
                          {certData?.issuedAt ? new Date(certData.issuedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                        </span>
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
                        <span className="text-sm md:text-xl text-slate-700" style={{ fontFamily: "'Great Vibes', cursive" }}>{certData?.instructor || 'Instructor Aethera'}</span>
                        <div className="w-20 md:w-32 h-px bg-[#C19A5B] my-1"></div>
                        <span className="text-[8px] md:text-[10px] font-bold tracking-tighter text-gray-500 uppercase">LECTURER</span>
                      </div>
                    </div>

                    {certData?.code && (
                      <div className="absolute top-0 right-0 mt-4 mr-4 text-xs text-gray-400 font-mono tracking-wider">
                        CC Code: {certData.code}
                      </div>
                    )}
                  </div>
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
