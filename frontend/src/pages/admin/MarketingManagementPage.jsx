import React from 'react';
import { useMarketingData } from '../../hooks/useMarketingData';
import VoucherSection from '../../components/admin/marketing/VoucherSection';
import CampaignAssetsSection from '../../components/admin/marketing/CampaignAssetsSection';

const MarketingManagementPage = () => {
  const { vouchers, bannerUrl, loading, isUploading, pagination, handlers } = useMarketingData();

  return (
    <div className="w-full min-h-full text-gray-900 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Marketing Admin</h2>
        <p className="text-lg text-gray-500">Manage marketing campaigns, vouchers, and advertising assets.</p>
      </div>

      {/* Voucher Section */}
      <VoucherSection 
        vouchers={vouchers} 
        isLoading={loading} 
        onAction={handlers} 
        pagination={pagination}
      />

      {/* Campaign Assets Section */}
      <CampaignAssetsSection 
        bannerUrl={bannerUrl} 
        isUploading={isUploading}
        onUpload={handlers.uploadBanner} 
        onDelete={handlers.deleteBanner}
      />
    </div>
  );
};

export default MarketingManagementPage;
