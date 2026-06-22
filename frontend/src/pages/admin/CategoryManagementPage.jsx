import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useCategoryData } from '../../hooks/useCategoryData';
import CategoryTable from '../../components/admin/categories/CategoryTable';
import CategoryModal from '../../components/admin/categories/CategoryModal';
import PaginationBar from '../../components/common/PaginationBar';

const CategoryManagementPage = () => {
    const {
        categories,
        loading,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        searchQuery,
        isModalOpen,
        editingCategory,
        handleSearch,
        setCurrentPage,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        openCreateModal,
        openEditModal,
        closeModal
    } = useCategoryData();

    return (
        <div className="w-full min-h-full text-gray-900 p-4 sm:p-6 lg:p-8 relative flex flex-col">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">Categories</h2>
                    <p className="text-sm md:text-base text-gray-500">Manage and organize your course taxonomy.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex items-center group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input 
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" 
                            placeholder="Search categories..." 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                    >
                        <Plus className="w-4 h-4" />
                        Add New Category
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <CategoryTable 
                categories={categories}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDeleteCategory}
            />

            {/* Pagination placeholder is already inside CategoryTable for now or we can extract it if needed */}
            {/* <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <PaginationBar 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={totalItems}
                    loading={loading}
                    pageSize={itemsPerPage}
                />
            </div> */}

            {/* Modal */}
            <CategoryModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                initialData={editingCategory}
                onSave={(data) => {
                    if (editingCategory) {
                        handleUpdateCategory(editingCategory.id, data);
                    } else {
                        handleCreateCategory(data);
                    }
                }}
            />
        </div>
    );
};

export default CategoryManagementPage;
