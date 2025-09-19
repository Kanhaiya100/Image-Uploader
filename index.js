import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

const app = express();

mongoose.connect(
  "mongodb+srv://07kanhaiya09_db_user:AF5IXcbzbOPsnluH@cluster0.yygkhys.mongodb.net/",
  { dbName: "Node" }
)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Could not connect to MongoDB...', err));

    // Configuration
    cloudinary.config({ 
        cloud_name: "dttlrxhwd", 
        api_key: 333687913998782, 
        api_secret:"nZjly5Dd7PcT6olpCwwIBYEUP84" // Click 'View API Keys' above to copy your API secret
    });



app.get('/', (req, res) => {
  res.render('index.ejs',{url:null});
}); 


const storage = multer.diskStorage({
  // destination: './public/uploads',
   
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
const imageSchema=new mongoose.Schema({
  filename:String,
  public_id:String,
  imgUrl:String
})

const File=mongoose.model('File',imageSchema);


app.post('/upload', upload.single('file'), async(req, res)=>{
const file=req.file.path;

const cloudinaryRes=await cloudinary.uploader.upload(file,{
  folder:"NodeJS"
})

// save to mongoDB
const db= await File.create({
  filename:cloudinaryRes.original_filename,
  public_id:cloudinaryRes.public_id,
  imgUrl:cloudinaryRes.secure_url
})
res.render("index.ejs",{url:cloudinaryRes.secure_url});

});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});