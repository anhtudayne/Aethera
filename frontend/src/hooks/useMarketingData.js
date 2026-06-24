import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export const useMarketingData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const [vouchers, setVouchers] = useState([]);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, currentPage: 1, limit: 10 });

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getVouchers({ page, limit: 10 });
      setVouchers(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
      toast.error('Không thể tải danh sách voucher. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [page]);

  useEffect(() => {
    adminApi
      .getSetting('campaign_banner_url')
      .then((res) => { if (res.data) setBannerUrl(res.data); })
      .catch(() => { });
  }, []);

  const handleVoucherSubmit = async (formData, id) => {
    if (id) {
      const res = await adminApi.updateVoucher(id, formData);
      toast.success(`Đã cập nhật: ${formData.code}`);
      setVouchers((prev) => prev.map((v) => (v.id === id ? res.data : v)));
    } else {
      const res = await adminApi.createVoucher(formData);
      toast.success(`Đã tạo voucher: ${formData.code}`);
      setVouchers((prev) => [res.data, ...prev]);
    }
  };

  const handleToggleVoucherStatus = async (voucher) => {
    if (voucher.status === 'EXPIRED') {
      toast.warning('Voucher đã hết hạn, không thể kích hoạt lại.');
      return;
    }
    const newStatus = voucher.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await adminApi.updateVoucherStatus(voucher.id, newStatus);
      toast.success(`${voucher.code} → ${newStatus}`);
      setVouchers((prev) =>
        prev.map((v) => (v.id === voucher.id ? { ...v, status: newStatus } : v))
      );
    } catch {
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  const handleUploadBanner = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('banner', file);
    try {
      const res = await adminApi.uploadBanner(formData);
      const newUrl = res.data.url;
      setBannerUrl(newUrl);
      await adminApi.updateSetting('campaign_banner_url', newUrl);
      toast.success('Upload banner thành công!');
    } catch {
      toast.error('Upload banner thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async () => {
    try {
      setBannerUrl(null); // Optimistic UI
      await adminApi.updateSetting('campaign_banner_url', '');
      toast.success('Đã gỡ banner chiến dịch!');
    } catch {
      toast.error('Gỡ banner thất bại');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return {
    vouchers,
    bannerUrl,
    loading,
    isUploading,
    pagination,
    handlers: {
      submitVoucher: handleVoucherSubmit,
      toggleStatus: handleToggleVoucherStatus,
      uploadBanner: handleUploadBanner,
      deleteBanner: handleDeleteBanner,
      pageChange: handlePageChange,
    },
  };
};
