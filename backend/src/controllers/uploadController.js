export const handleUploadVideo = (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: 'Vui lòng chọn file video' });
        }
        
        // Cloudinary trả về thông tin file trong req.file
        // req.file.path chính là URL video đã được upload
        return res.status(200).json({
            status: 200,
            message: 'Upload video thành công',
            data: {
                url: req.file.path,
                filename: req.file.filename,
                size: req.file.size
            }
        });
    } catch (err) {
        next(err);
    }
};
