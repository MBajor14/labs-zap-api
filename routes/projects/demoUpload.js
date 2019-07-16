/*eslint-disable */

const express = require('express');
const router = express.Router({ mergeParams: true });
const crmWebAPI = require('../../utils/crmWebAPI');


router.post('/', async (req, res) => {
    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    try{
        const file = req.files.file;
        // const projectID = '1F2FF604-1F5A-E811-8132-1458D04D95C0';   // hardcoded - remove later
        const projectID = '5F3A462D-B541-E811-812F-1458D04D95C0';   // hardcoded - remove later

        const decodedFile = decodeURI(file.data);   //  decode from 7bit
        const encodedBase64File = Buffer.from(decodedFile).toString('base64');      //  encode base64
        // const encodedBase64File = 'VGVzdCBEQVRBIC0gTE1TIC0gVVBEQVRFRCAxMDo1NUFNIDcvMTUvMTk=';      //  encode base64 hard coded
        await crmWebAPI.uploadDocument('dcp_project',projectID,file.name,encodedBase64File,true);

        res.json(
          {
              success: true,
              project_id: projectID
          }
        );
    }catch(err){
        res.status(404).send({
            error: err.toString(),
        });
    }

});

module.exports = router;

const decode = file => {

    return file;
};
