import React, { useState, useEffect, useRef } from 'react';
import { 
    X, ChevronDown, LayoutGrid, Code, Palette, Megaphone, Briefcase, 
    BarChart, Globe, Monitor, Smartphone, Database, Cloud, Camera, 
    Music, Video, PenTool, BookOpen, Lightbulb, Target, Award, 
    Cpu, Pen, GraduationCap, Library, FlaskConical, Heart, 
    Dumbbell, Utensils, Brush, Scissors 
} from 'lucide-react';

const ICONS = [
    { name: 'LayoutGrid', label: 'Default (Grid)', icon: LayoutGrid },
    { name: 'Code', label: 'Code', icon: Code },
    { name: 'Palette', label: 'Design', icon: Palette },
    { name: 'Megaphone', label: 'Marketing', icon: Megaphone },
    { name: 'Briefcase', label: 'Business', icon: Briefcase },
    { name: 'BarChart', label: 'Data Science', icon: BarChart },
    { name: 'Globe', label: 'Language', icon: Globe },
    { name: 'Monitor', label: 'Tech (Monitor)', icon: Monitor },
    { name: 'Smartphone', label: 'Mobile', icon: Smartphone },
    { name: 'Database', label: 'Database', icon: Database },
    { name: 'Cloud', label: 'Cloud', icon: Cloud },
    { name: 'Camera', label: 'Photography', icon: Camera },
    { name: 'Music', label: 'Music', icon: Music },
    { name: 'Video', label: 'Video', icon: Video },
    { name: 'PenTool', label: 'Writing', icon: PenTool },
    { name: 'BookOpen', label: 'Reading', icon: BookOpen },
    { name: 'Lightbulb', label: 'Idea', icon: Lightbulb },
    { name: 'Target', label: 'Target', icon: Target },
    { name: 'Award', label: 'Award', icon: Award },
    { name: 'Cpu', label: 'Hardware', icon: Cpu },
    { name: 'Pen', label: 'Pen', icon: Pen },
    { name: 'GraduationCap', label: 'Education', icon: GraduationCap },
    { name: 'Library', label: 'Library', icon: Library },
    { name: 'FlaskConical', label: 'Science', icon: FlaskConical },
    { name: 'Heart', label: 'Health', icon: Heart },
    { name: 'Dumbbell', label: 'Fitness', icon: Dumbbell },
    { name: 'Utensils', label: 'Cooking', icon: Utensils },
    { name: 'Brush', label: 'Art', icon: Brush },
    { name: 'Scissors', label: 'Craft', icon: Scissors },
];

const THEMES = [
    { name: 'gray', label: 'Gray (Default)', color: 'bg-gray-500' },
    { name: 'indigo', label: 'Indigo', color: 'bg-indigo-500' },
    { name: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { name: 'amber', label: 'Amber', color: 'bg-amber-500' },
    { name: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { name: 'green', label: 'Green', color: 'bg-green-500' },
    { name: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { name: 'rose', label: 'Rose', color: 'bg-rose-500' },
];

const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler]);
};

const CustomSelect = ({ value, options, onChange, name, renderOption, renderSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setIsOpen(false));

    const selectedOption = options.find(o => o.name === value) || options[0];

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm flex items-center justify-between ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {renderSelected(selectedOption)}
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map(option => (
                        <button
                            key={option.name}
                            type="button"
                            className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${value === option.name ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => {
                                onChange({ target: { name, value: option.name } });
                                setIsOpen(false);
                            }}
                        >
                            {renderOption(option, value === option.name)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const CategoryModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: true,
        icon: 'LayoutGrid',
        themeColor: 'gray'
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    slug: initialData.slug || '',
                    description: initialData.description || '',
                    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
                    icon: initialData.icon || 'LayoutGrid',
                    themeColor: initialData.themeColor || 'gray'
                });
            } else {
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    isActive: true,
                    icon: 'LayoutGrid',
                    themeColor: 'gray'
                });
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button 
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors" 
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" 
                                placeholder="e.g. Artificial Intelligence" 
                                type="text"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input 
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm" 
                                placeholder="e.g. artificial-intelligence" 
                                type="text"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm resize-none" 
                                placeholder="Brief description of the category..." 
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                <CustomSelect
                                    name="icon"
                                    value={formData.icon}
                                    options={ICONS}
                                    onChange={handleChange}
                                    renderSelected={(opt) => (
                                        <div className="flex items-center gap-2">
                                            <opt.icon className="w-4 h-4 text-gray-500" />
                                            <span>{opt.label}</span>
                                        </div>
                                    )}
                                    renderOption={(opt, isSelected) => (
                                        <div className="flex items-center gap-2">
                                            <opt.icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                                            <span>{opt.label}</span>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                                <CustomSelect
                                    name="themeColor"
                                    value={formData.themeColor}
                                    options={THEMES}
                                    onChange={handleChange}
                                    renderSelected={(opt) => (
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${opt.color}`}></span>
                                            <span>{opt.label}</span>
                                        </div>
                                    )}
                                    renderOption={(opt) => (
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${opt.color}`}></span>
                                            <span>{opt.label}</span>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                                    type="checkbox"
                                />
                                <span className="text-sm font-medium text-gray-900">Set as Active</span>
                            </label>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                        <button 
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors bg-white shadow-sm" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {initialData ? 'Save Changes' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
