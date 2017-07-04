import * as multer from "multer";
/* server.ts */
const destination = "./Application/assets/images/user";
const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        /* Save image with name user id and png extension */
        cb(null, req.user.id + ".png");
    },
});
export const upload = multer({ storage }).single("profileImage");
