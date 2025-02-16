const express = require('express')
const port = 8001;

const db = require("./config/db");
const employee = require("./module/employee");

const app = express();
const path = require('path');
const fs = require('fs')

app.use(express.urlencoded());

app.use("/upload", express.static(path.join(__dirname, 'upload')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.get("/", async (req, res) => {
    res.render('home')
})

app.get("/viewemp", async (req, res) => {
    let empdata = await employee.find();
    console.log(empdata)
    return res.render('viewemp', {
        empdata
    })

})
app.post("/insertdata", employee.uplodFileImage, async (req, res) => {
    // console.log(req.body);
    // console.log(req.file)

    var imgpath = '';
    if (req.file) {
        imgpath = employee.imgpath + "/" + req.file.filename;
    }
    req.body.image = imgpath;
    console.log(imgpath)
    await employee.create(req.body);
    return res.redirect('/viewemp');
});



app.get("/deletedata", async (req, res) => {
    var id = req.query.empId;
    let singledata = await employee.findById(id);
    console.log(singledata.image)

    const deletepath = path.join(__dirname, singledata.image);
    console.log(deletepath)

    if (deletepath) {
        try {
            fs.unlinkSync(deletepath)
        }
        catch (err) {
            console.log("img is not found")
        }
    }
    await employee.findByIdAndDelete(req.query.empId)
    return res.redirect('back');
})

app.get("/editdata/:Id", async (req, res) => {
    console.log(req.params.Id)
    let singleobj = await employee.findById(req.params.Id)
    console.log(singleobj)
    return res.render('editemp', {
        singleobj
    });

})

app.post("/updatedata", employee.uplodFileImage, async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    let singledata = await employee.findById(req.body.empId);

    if (req.file) {
        try {

            let imageoldpath = path.join(__dirname, "/", singledata.image)
            fs.unlinkSync(imageoldpath)

        }
        catch (err) {
            console.log("image not found")
        }
        var newimagepath = employee.imgpath + "/" + req.file.filename
        req.body.image = newimagepath;

        await employee.findByIdAndUpdate(req.body.empId, req.body)
        return res.redirect('/viewemp')
    }
    else {
        req.body.image = singledata.image;

        await employee.findByIdAndUpdate(req.body.empId, req.body)
        return res.redirect("/viewemp")

    }
})

app.listen(port, (err) => {
    if (err) {
        console.log(err)
        return false
    }
    console.log("server is connect in port" + port)
})