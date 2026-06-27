import db from '../../models/index';

export const validateCoursePublish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await db.Course.findByPk(id, {
            include: [{
                model: db.Section,
                as: 'sections',
                include: [{
                    model: db.Lesson,
                    as: 'lessons'
                }]
            }]
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const errors = [];

        if (!course.thumbnail) {
            errors.push('Course must have a thumbnail image.');
        }

        if (!course.description || course.description.trim().length < 50) {
            errors.push('Course must have a detailed description (at least 50 characters).');
        }

        if (!course.categoryId) {
            errors.push('Course must have an assigned category.');
        }

        let totalLessons = 0;
        let totalDurationSecs = 0;

        if (course.sections && course.sections.length > 0) {
            course.sections.forEach(section => {
                if (section.lessons && section.lessons.length > 0) {
                    totalLessons += section.lessons.length;
                    section.lessons.forEach(lesson => {
                        if (lesson.duration) {
                            const parts = lesson.duration.split(':').reverse();
                            let secs = 0;
                            if (parts[0]) secs += parseInt(parts[0], 10);
                            if (parts[1]) secs += parseInt(parts[1], 10) * 60;
                            if (parts[2]) secs += parseInt(parts[2], 10) * 3600;
                            totalDurationSecs += secs;
                        }
                    });
                }
            });
        }

        if (totalLessons < 3) {
            errors.push(`Course must have at least 3 lessons. Currently has ${totalLessons}.`);
        }

        if (totalDurationSecs < 15 * 60) {
            const currentMins = Math.floor(totalDurationSecs / 60);
            errors.push(`Course must have at least 15 minutes of content. Currently has ${currentMins} minutes.`);
        }

        if (errors.length > 0) {
            return res.status(400).json({ 
                message: 'Course does not meet the requirements for review.',
                errors: errors 
            });
        }

        next();
    } catch (err) {
        console.error('validateCoursePublish error:', err);
        return res.status(500).json({ message: 'Internal Server Error during validation' });
    }
};
