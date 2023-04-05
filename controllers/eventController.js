import EventModel from "../model/Event.js";
import s3Uploadv2 from "../config/s3Service.js"
import jwt from 'jsonwebtoken'
import https from 'https';
// import https from 'http';
// const http = require('http');
import { parse } from 'url';
import UserModel from "../model/User.js";
import crypto from 'crypto'
import CryptoJS from "crypto-js";
import axios from "axios"
import fs from "fs"
import pkg from 'aws-sdk';                                            
const { S3 } = pkg;
 class EventController { 
    
    static addEvent = async (req, res) => { 
        
        try {
             
            const file = req.file
            const result = await s3Uploadv2(file)
            
          
            const { _id } = req.user;
            
            const data = {
                userId: _id,
                fileName: file.originalname,
                type: file.mimetype,
                Key:result.Key
            }
             
            if (_id)
            {
                const doc=new EventModel(data)
                await doc.save() 
                const list = await EventModel.find({ userId: _id }).select('-url')
                res.send({"status":"success","message":"added successfully",data: list})
            } 
            

        } catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"All filds are required"})
        }
        
         
    }

    static eventList = async (req, res) => { 
        const { _id } = req.user;
        const list = await EventModel.find({ userId: _id }).select('-url')
        if (list)
        {
            res.send({list}) 
        }
        else {
            res.send({})  
        }
        
    }

    static removeFile = async (req, res) => { 
        try {
            const { _id } = req.user;
            const { id } = req.body;
            if (_id)
            {
                const result = await EventModel.deleteOne({ _id: id }) 
                const data = await EventModel.find({ userId: _id }).select('-url')
                 if (result)
                { 
                    res.send({"status":"success","message":"added removed successfully",data: data })    
                }
                else {
                    res.status(400).send({"status":"failed","message":"unable to add file"})  
                }
            }
            else {
                res.status(400).send({"status":"failed","message":"unable to add file"}) 
            }
        }
        catch (error) {
            res.status(400).send({"status":"failed","message":"unable to add file"}) 
        }
        
      
        
    }

    static signedURL = async (req, res) => {

        try {
            const { id } = req.params;
            const { _id } = req.user;
            
            const userId = _id.toString().substr(0, 24);


             const file = await EventModel.find({ _id: id })
            if (!file) {
                return res.status(404).send('File not found');
            }
            
            const token = jwt.sign({ user: userId, id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const downloadUrl = `http://localhost:${process.env.PORT}/api/event/files/${id}?token=${token}`;
            res.send({ downloadUrl });
        
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error'); 
        }
          
    }


    static download = async (req, res) => {
        try {
            const { id } = req.params;
            const { token } = req.query; 
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId=decodedToken.userId
            const userData = await UserModel.find({ _id: userId }) 
            if (userData)
            {
            const file = await EventModel.find({ _id: id }) 
            const fileUrl = parse(file[0].url);
            const options = {
                host: fileUrl.host,
                path: fileUrl.pathname
            };

            https.get(options, (response) => {
              
                const fileName = file[0].fileName;
                const contentDisposition = `attachment; filename="${fileName}"`;
                res.setHeader('Content-Disposition', contentDisposition);
                // pipe the file contents to the response object
                response.pipe(res);
            });
            }
            else {
                res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" }) 
            }  
        } catch (error) {
             res.status(403).send('Invalid or expired token');
        }
    }

    static downloadFile = async (req, res) => {
        try {
          const { id } = req.params;
          const file = await EventModel.findById(id);
          console.log(file)
          const fileName = file.fileName;
          const fileKey = file.Key;
      
           
          const s3 = new S3({
            secretAccessKey: process.env.AWS_SECRET_KEYX,
            accessKeyId: process.env.AWS_ACCESS_KEY_IDX,
            region: process.env.AWS_REGIONX,
          });
        var options = {
            Bucket:process.env.AWS_BUKET_NAMEX,
            Key    : fileKey,
        };
       
        
        var fileStream = s3.getObject(options).createReadStream();
        res.attachment(fileKey);
        
       
        // res.set({
        //     "Content-Type": file.contentType,
        //     "Content-Length": file.contentLength,
        //     "Content-Disposition": `attachment; filename="${fileName}"`,
        // });
        fileStream.pipe(res);  
        }
        catch (error) {
          console.log('Error downloading and encrypting file:', error);
          res.status(500).send('Error downloading and encrypting file');
        }
      };
      
}

export default EventController;