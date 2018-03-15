
const imageMethods = {
    data() {
        return {
            action: HOST + "upload/up.php",
            currentImage: "",
            success: false,
        }
    },
    methods: {
        handleAvatarSuccess(res, file) {
            if (this.currentImage != this.form.image) {
                this.deleteImage(this.form.image)
            }
            this.image = res;
            this.form.image = res;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        deleteImage(image) {
            let data = {
                params: {
                    image: image
                }
            };
            this.apiGet("upload/delete.php", data).then(res => { });
        },
        destroyedDeleteImage() {
            if (!this.success) {
                if (this.form.image != this.currentImage) {
                    this.deleteImage(this.form.image)
                }
            }
        },
        updateDeleteImage() {
                if (this.currentImage) {
                    this.deleteImage(this.currentImage)
                }
        },
        recoveryImage() {
            if (this.currentImage == this.form.image) {
                this.form.image = ""
            }else{
                this.deleteImage(this.form.image)
                this.form.image = ""
            }

        }
    },
    computed: {

    }
}

export default imageMethods
