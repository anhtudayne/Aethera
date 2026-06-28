const db = require('./src/models');

async function updateCourses() {
    try {
        const users = await db.User.findAll();
        // let's just pick any user with role 'instructor' or just the first few users
        let instructors = await db.User.findAll({ where: { roleId: 'instructor' } });
        if (instructors.length === 0) {
            instructors = users; // fallback
        }
        
        const courses = await db.Course.findAll();
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const instructor = instructors[i % instructors.length];
            if (instructor) {
                await course.update({ instructorId: instructor.id });
                console.log(`Updated course ${course.id} with instructorId ${instructor.id}`);
            }
        }
        console.log("Successfully updated course instructors.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating course instructors:", error);
        process.exit(1);
    }
}

updateCourses();
