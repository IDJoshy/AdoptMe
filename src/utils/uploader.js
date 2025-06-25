import { __dirname } from "../config/config.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        let folder = "misc";
        if(file.fieldname === 'petImage') folder = "pets";
        else if (file.fieldname === 'documents') folder = 'documents';
        
        cb(null, path.join(__dirname, `../public/${folder}`));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploader = multer({storage})

export default uploader;