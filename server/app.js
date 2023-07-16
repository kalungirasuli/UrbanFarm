const express = require('express');
const app = express()
const router = express.Router()
const mongoose = require('mongoose')
const path =require('path')
const crypto = require('crypto')
const bodyParser =require('body-parser')
const multer =require('multer')
const methodOverride = require('method-override')
const {GridFsStorage}= require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
//Port connect
const Port = 3000
//data base connection 
const Url ='mongodb+srv://kalungirasuli495gmailcom:Kalungi2002@cluster0.gbj33mr.mongodb.net/?retryWrites=true&w=majority'
let gfs;
const conn = mongoose.createConnection(Url,{
    useUnifiedTopology: true,
})

conn.once('open',() => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('Product Uploads')
    console.log('Database connected')
})
conn.on('error',(err)=>{
    console.log('Failed to connect',err)
 })
//storage 
const storage = new GridFsStorage({
    url: Url,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
//body-parse
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//methodoveride
app.use(methodOverride('_method'))
//router testing

router.get('/',(req,res)=>{
    res.send('This app is live and runing')
})
router.post('/uploads',upload.array('file',6),(req,res)=>{
    res.json({files:req.files})
})

app.use('/',router)

app.listen(Port,() => console.log(`Listening at ${Port}....`))