import jwt  from "jsonwebtoken"
import { UnAuthenticated } from "../errors/index.js"

const auth = async(req, res, next) => {

    const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnAuthenticated("Authentication Invalid")
  }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload)
        req.user = { userId : payload.userId}
        next()
    } catch (error) {
        throw new UnAuthenticated("Authentication Invalid")
    }
  
}
 
export default auth