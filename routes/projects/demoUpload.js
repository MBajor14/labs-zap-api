/*eslint-disable */

const express = require('express');
const router = express.Router({ mergeParams: true });
const crmWebAPI = require('../../utils/crmWebAPI');
const eol = require('eol');


router.post('/', async (req, res) => {
    if(req.files === null){
        return res.status(400).json({msg: 'No file uploaded'});
    }

    try{
        const file = req.files.file;
        const projectID = req.body.projectID;
        const headers ={
            MSCRMCallerID: 'A5C18075-399F-E911-A99A-001DD8308EF1', //impersonation
        };

        const decodedFile = decodeURI(file.data);   //  decode from 7bit
        const decodedFileCRLF = eol.crlf(decodedFile);  //  normalize line ending in string to CRLF (WINDOWS, DOS)
        const encodedBase64File = Buffer.from(decodedFileCRLF).toString('base64');      //  encode base64
        await crmWebAPI.uploadDocument('dcp_project', projectID, file.name ,encodedBase64File,true, headers);

        res.json(
          {
              success: true
          }
        );
    }catch(err){
        res.status(404).send({
            error: err.toString(),
        });
    }

});

module.exports = router;
