import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { toast } from 'sonner';

export const useCategoryData = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    
    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const res = await adminApi.getCategories({ page, limit: itemsPerPage, search });
            if (res.status === 200) {
                setCategories(res.data);
                setTotalPages(res.pagination.totalPages);
                setTotalItems(res.pagination.totalItems);
                setCurrentPage(res.pagination.currentPage);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleCreateCategory = async (data) => {
        try {
            const res = await adminApi.createCategory(data);
            if (res.status === 201) {
                toast.success('Category created successfully!');
                setIsModalOpen(false);
                fetchCategories(currentPage, searchQuery); // Reload
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleUpdateCategory = async (id, data) => {
        try {
            const res = await adminApi.updateCategory(id, data);
            if (res.status === 200) {
                toast.success('Category updated successfully!');
                setIsModalOpen(false);
                setEditingCategory(null);
                fetchCategories(currentPage, searchQuery);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
            const res = await adminApi.deleteCategory(id);
            if (res.status === 200) {
                toast.success('Category deleted successfully!');
                // Auto go back if it's the last item on the page
                if (categories.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchCategories(currentPage, searchQuery);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return {
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
    };
};
