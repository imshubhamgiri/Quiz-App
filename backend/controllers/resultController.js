import { response } from "express";
import Result from "../models/resultModel.js";
export async function createResult(req, res) {
    try{
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success:false,
                message:'Not authorized'
            })
        }
        const {title, technology, level , totalquestion, correctanswers, wronganswers} = req.body;

        if(!technology || !level || totalquestion=== undefined || correctanswers === undefined){
            return res.status(400).json({
                success:false,
                message:'missing fields'
            })
        }

        //compute wrong
        const computeWrong = wronganswers !=undefined ? Number(wronganswers) : Math.max(0,Number(totalquestion)-Number(correctanswers))

        if(!title){
            return res.status(400).json({
                success:false,
                message:'Title is missing'
            })
        }

        const payload ={
            //write the payload
            title:String(title).trim(),
            technology,
            level,
            totalquestion: Number(totalquestion),
            correctanswers: Number(correctanswers),
            wronganswers: computeWrong,
            user: req.user.id //for a particular user they can see their result
        }
        const created = await Result.create(payload)
        return res.status(200).json({
            success:true,
            message:'Result saved',
            result: created
        })
    }catch(e){
        console.error('CreatedResult error',e)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}


//List the result

export async function listResult(req,res){
    try{
        if(!req.user || !req.user.id){
            return res.status(400).json({
                success:false,
                message:'Not authorized'
            })
        }

        const {technology }= req.query;
        const query = {user:req.user.id}

        if(technology && technology.toLowerCase() !== 'all'){
            query.technology = technology
        }

        const items = await Result.find(query).sort({createdAt: -1}).lean();
        return res.json({
            success:true,
            results : items
        })

    }catch(e){
        console.error('ListResult error',e)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}

