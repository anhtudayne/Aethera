import db from '../models';

async function checkCart() {
    try {
        const userId = 3;
        const cartItems = await db.Cart.findAll({
            where: { userId },
            include: [{ model: db.Course, as: 'course' }]
        });

        console.log(`=== User ${userId} Cart ===`);
        console.log(`Cart items count: ${cartItems.length}`);
        cartItems.forEach(item => {
            console.log(`- Course ID: ${item.courseId}, Name: ${item.course?.name}, Price: ${item.course?.price}`);
        });

        const owned = await db.UserCourse.findAll({
            where: { userId }
        });
        console.log(`=== User ${userId} Owned Courses ===`);
        console.log(`Owned count: ${owned.length}`);
        owned.forEach(item => {
            console.log(`- Course ID: ${item.courseId}, Status: ${item.status}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.sequelize.close();
    }
}

checkCart();
