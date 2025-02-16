const mongoose = require ('mongoose');

const imgepath  = "/upload";

const path = require('path')

const multer = require('multer')

const EmployeeSchema = mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true
    },
    password:{
        type : String,
        require : true
    },
    gender:{
        type : String,
        require : true
    },
    hobby:{
        type : Array,
        require : true
    },
    city:{
        type : String,
        require : true
    },
    text:{
        type : String,
        require : true
    },
    image:{
        type : String,
        require : true
    },
})


const storegeImages = multer.diskStorage({
 destination: (req,file,cb)=>{
    cb(null,path.join(__dirname,'..',imgepath))
 },
 filename:(req,file,cb)=>{
    cb(null,file.fieldname+'-'+Date.now())
}
});

EmployeeSchema.statics.uplodFileImage = multer({storage:storegeImages}).single('image');
EmployeeSchema.statics.imgpath=imgepath

const employee = mongoose.model('employee',EmployeeSchema);
module.exports = employee;