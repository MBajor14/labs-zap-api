/*eslint-disable */

const express = require('express');
const router = express.Router({ mergeParams: true });
const crmWebAPI = require('../../utils/crmWebAPI');


router.post('/', async (req, res) => {
    let { params, body } = req;
    const { id } = params;

    try{
        await crmWebAPI.update('dcp_projectmilestones', id, body);
        res.send({
            success: true
        });
    }catch(error){
        res.status(404).send({
            success: false,
            message: error
        })
    }
});

module.exports = router;
