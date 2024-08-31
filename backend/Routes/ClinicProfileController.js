const express = require('express');
const router = express.Router();
const multer = require('multer')()
const fs = require('fs')
const path = require('path')

router.post('/', multer.any({ dest: './Storage/clinic_profiles' }), (req, res)=>{
    const data = req.body;
    const file = req.files[0];
    const jsonData = JSON.stringify(data);
    const imageName = 'logo.jpg';

    if(file){
        fs.writeFileSync('./Storage/clinic_profiles/data.json', jsonData);
    fs.writeFileSync(`./Storage/clinic_profiles/images/${imageName}`, file.buffer);
    }
    
    res.send('Data and image saved successfully!');

})

router.get('/', (req, res) => {
    const jsonData = fs.readFileSync('./Storage/clinic_profiles/data.json', 'utf8');
    const data = JSON.parse(jsonData);
  
    const imagePath = `./Storage/clinic_profiles/images/`;
    let imageData = fs.readdirSync(imagePath);
    const imageFullPath = path.join(imagePath, 'logo.jpeg');
    imageData = fs.readFileSync(imageFullPath)
    res.json({ data, imageData: imageData.toString('base64') });
  });

module.exports = router;