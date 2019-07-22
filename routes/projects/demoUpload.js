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
        const projectName = req.body.projectName;
        // const projectName = req.body.projectName;
        const entityName = req.body.entityName;
        const headers ={
            MSCRMCallerID: 'A5C18075-399F-E911-A99A-001DD8308EF1', //impersonation
        };

        const projectRecord = (await crmWebAPI.get(`dcp_projects?$select=dcp_projectid,dcp_name&$filter=dcp_name eq '${projectName}'&$top=1`))['value'][0];
        if(!projectRecord) throw new Error('Project not found');
        const projectGUID = projectRecord.dcp_projectid;
        const projectID = projectRecord.dcp_name;
        const folderName = `${projectID}_${projectGUID.replace(/\-/g,'').toUpperCase()}`;

        const decodedFile = decodeURI(file.data);   //  decode from 7bit
        const decodedFileCRLF = eol.crlf(decodedFile);  //  normalize line ending in string to CRLF (WINDOWS, DOS)
        const encodedBase64File = Buffer.from(decodedFileCRLF).toString('base64');      //  encode base64
        await crmWebAPI.uploadDocument(entityName, projectGUID, folderName, file.name ,encodedBase64File,true, headers);

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
