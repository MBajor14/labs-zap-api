/*eslint-disable */

const express = require('express');
const router = express.Router({ mergeParams: true });
const crmWebAPI = require('../../utils/crmWebAPI');


router.post('/', async (req, res) => {
    console.log(req.files);
    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    try{
        const file = req.files.file;

        file.mv(`${__dirname}/../../demoUploads/${file.name}`, err => {
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }

            res.json(
                {
                    success: true,
                    fileName: file.name,
                    filePath: `/demoUploads/${file.name}`
                }
            );
        })
    }catch(err){
        console.error(err);
    }

});

module.exports = router;