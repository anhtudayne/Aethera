import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { login } = useAuth();
  const divRef = useRef(null);

  useEffect(() => {
    // If google script is loaded, initialize
    if (window.google?.accounts?.id) {
      const handleCredentialResponse = async (response) => {
        try {
          const res = await authApi.googleLogin({ idToken: response.credential });
          
          const token = res?.token || res?.data?.token;
          const user = res?.user || res?.data?.user;

          if (token && user) {
            login(token, user);
            toast.success('Logged in with Google successfully');
            if (onSuccess) onSuccess();
          } else {
            throw new Error('Invalid Google login response payload');
          }
        } catch (err) {
          toast.error(err?.message || 'Google Login verification failed');
          if (onError) onError(err);
        }
      };

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        divRef.current,
        { theme: 'outline', size: 'large', width: '380px' }
      );
    }
  }, [login, onSuccess, onError]);

  const handleCustomClick = () => {
    if (!window.google?.accounts?.id) {
      toast.info('Google Sign-In is visual-only (Requires VITE_GOOGLE_CLIENT_ID).');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {window.google?.accounts?.id ? (
        <div ref={divRef} style={{ width: '100%' }}></div>
      ) : (
        <button
          type="button"
          onClick={handleCustomClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-white)',
            color: 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border-light)';
            e.currentTarget.style.borderColor = 'var(--color-text-placeholder)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-white)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.036 0 1.61 2.222.957 5.439l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      )}
    </div>
  );
};

export default GoogleLoginButton;
