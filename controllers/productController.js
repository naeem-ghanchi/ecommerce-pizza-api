import { Product } from "../models";
import multer from "multer";
import path from 'path'
import { CustomErrorHandles } from "../services";
import fs from 'fs'
import prdouctSchema from "../validators/productValidator";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})
const handleMultipartData  = multer({storage, limits: { fileSize: 1000000 * 5 } }).single('image') // 5 mb size

const productController = {
    async store(req, res, next) {
        // Multipart form data 
        handleMultipartData(req, res, async (err)=>{
            if(err)
            {
                return next(CustomErrorHandles.serverError())
            }
            let filePath;
            if(req.file)
            {
                filePath = req.file.path;
            }
        
            //Field Validation
            const { error } = prdouctSchema.validate(req.body)
        
            if(error)
            {
                //Delete file
                if(req.file)
                {
                    fs.unlink(`${appRoot}/${filePath}`, (error)=>{
                        if(error)
                        {
                            return next(CustomErrorHandles.serverError(error.message));
                        }
                    })
                }
                return next(error);
            }
            
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    ...(req.file && {image: filePath})
                })
            } catch (error) {
                return next(error)
            }
            res.json(document)
        })
    },
    async update(req, res, next) {
        // Multipart form data 
        handleMultipartData(req, res, async (err)=>{
            if(err)
            {
                return next(CustomErrorHandles.serverError())
            }
            let filePath;
            if(req.file)
            {
                filePath = req.file.path;
            }
        
            //Field Validation
            const { error } = prdouctSchema.validate(req.body)
        
            if(error)
            {
                //Delete file
                if(req.file)
                {
                    fs.unlink(`${appRoot}/${filePath}`, (error)=>{
                        if(error)
                        {
                            return next(CustomErrorHandles.serverError(error.message));
                        }
                    })
                }
                return next(error);
            }
            
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate({_id:req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image: filePath})
                }, {new: true})
            } catch (error) {
                return next(error)
            }
            res.json(document)
        })
    },
    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({_id:req.params.id})
        if(!document)
        {
            return next(new Error("Nothing to delete"))
        }
        
        // Image delete
        // const imagePath = document.image // getters imagage path
        const imagePath = document._doc.image  //original name without any getter
        fs.unlink(`${appRoot}/${imagePath}`, (err)=>{
            if(err)
            {
                return new(CustomErrorHandles.serverError('Image not delete'))
            }
        })
        res.json(document);
    },
    async index(req, res, next) {
        let documents
        try {
            documents = await Product.find().select('-createdAt -__v').sort({_id:-1})
        } catch (error) {
            return next(CustomErrorHandles.serverError())
        }
        res.json(documents);
    },
    async show(req, res, next) {
        let documents
        try {
            documents = await Product.findOne({_id:req.params.id}).select('-createdAt -__v')
        } catch (error) {
            return next(CustomErrorHandles.serverError())
        }
        res.json(documents);
    },
    async cart_items(req, res, next) {
        let documents
        try {
            documents = await Product.find().where('_id').in(req.body.id).select('-createdAt -__v').sort({_id:-1})
        } catch (error) {
            return next(CustomErrorHandles.serverError())
        }
        res.json(documents);
    }
}
export default productController;