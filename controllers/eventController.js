import EventModel from "../model/Event.js";
import s3Uploadv2 from "../config/s3Service.js"
class EventController { 
    
    static addEvent = async (req, res) => { 
        
        try {
            console.log("userdara",req.user)
            console.log("file data",req.file)
            
            const file = req.file
            const result = await s3Uploadv2(file)
            const obj = {
                name: file.originalname,
                type: file.mimetype,
                fileUrl:result
            }
          
            const { _id } = req.user;
            
            const data = {
                userId: _id,
                fileName: file.originalname,
                type: file.mimetype,
                url:result.Location
            }
             
            if (_id)
            {
                const doc=new EventModel(data)
                await doc.save() 
                res.send({"status":"success","message":"added successfully",data: obj })
            } 
            

        } catch (error) {
            console.log(error)
            res.status(400).send({"status":"failed","message":"All filds are required"})
        }
        
         
    }

    static eventList = async (req, res) => { 
        const { _id } = req.user;
        const list = await EventModel.find({ userId: _id })
        if (list)
        {
            res.send({list}) 
        }
        else {
            res.send({})  
        }
        
    }
}

export default EventController;