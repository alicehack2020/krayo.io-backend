import UserModel from "../model/User.js";
import Jwt  from "jsonwebtoken";
import generator from 'generate-password';

class UserController{
   
  //register
  static userRegistration = async (req, res) => {
    
    const { name, email, googleId, imageUrl } = req.body
    console.log(req.body)
    const user = await UserModel.findOne({ email: email })
    if(user)
    {
         const data = {
          userID:user._id,email:user.email,name:user.name,imageUrl:user.imageUrl
           }
           const token=Jwt.sign(data,
            process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
      res.send({
        "status": "success", "message": "user data", data: {
              data,token
          }})
        }
        else
        {
          try {
            var password = generator.generate({
              length: 10,
              numbers: true
            });        
            
            const doc=new UserModel({
              name:name,
              email:email,
              password: password,
              googleId,
              imageUrl
            })

            await doc.save()
            const user = await UserModel.findOne({ email: email })
            const data = {
              userID:user._id,email:user.email,name:user.name,imageUrl:user.imageUrl
               }
            const token=Jwt.sign(data,
              process.env.JWT_SECRET_KEY,{expiresIn:"5d"})
            res.send({"status":"success","message":"registration successfully",data: {
              data,token
          }})
          } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"unable to register"})
           }
        }



    
    }

}

export default UserController;