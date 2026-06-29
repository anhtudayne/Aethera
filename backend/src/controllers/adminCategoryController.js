import db from '../models/index';
import { Op } from 'sequelize';
import slugify from 'slugify';

export const handleGetAdminCategories = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const offset = (Number(page) - 1) * Number(limit);

        const { count, rows } = await db.Category.findAndCountAll({
            where,
            include: [
                {
                    model: db.Course,
                    as: 'courses',
                    attributes: ['id']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset,
            distinct: true
        });

        // Format data to include totalCourses count
        const data = rows.map(category => {
            const cat = category.toJSON();
            cat.totalCourses = cat.courses ? cat.courses.length : 0;
            delete cat.courses; // Remove courses array from response
            return cat;
        });

        return res.status(200).json({
            status: 200,
            data,
            pagination: {
                totalItems: count,
                currentPage: Number(page),
                totalPages: Math.ceil(count / Number(limit))
            }
        });
    } catch (err) {
        next(err);
    }
};

export const handleCreateCategory = async (req, res, next) => {
    try {
        const { name, description, isActive, icon, themeColor } = req.body;
        if (!name) return res.status(400).json({ status: 400, message: 'Category name is required' });

        const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
        
        const newCategory = await db.Category.create({
            name,
            description,
            slug,
            isActive: isActive !== undefined ? isActive : true,
            icon: icon || 'category',
            themeColor: themeColor || 'primary'
        });

        return res.status(201).json({ status: 201, message: 'Category created successfully', data: newCategory });
    } catch (err) {
        next(err);
    }
};

export const handleUpdateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, isActive, icon, themeColor } = req.body;

        const category = await db.Category.findByPk(id);
        if (!category) return res.status(404).json({ status: 404, message: 'Category not found' });

        const dataToUpdate = { description };
        if (name && name !== category.name) {
            dataToUpdate.name = name;
            dataToUpdate.slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
        }
        if (isActive !== undefined) {
            dataToUpdate.isActive = isActive;
        }
        if (icon !== undefined) {
            dataToUpdate.icon = icon;
        }
        if (themeColor !== undefined) {
            dataToUpdate.themeColor = themeColor;
        }

        await category.update(dataToUpdate);
        return res.status(200).json({ status: 200, message: 'Category updated successfully', data: category });
    } catch (err) {
        next(err);
    }
};
