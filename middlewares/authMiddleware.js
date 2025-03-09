const jwt = require('jsonwebtoken');


const authentication = (req, res, next) => { 
        const token = req.header('Authorization').replace('Bearer ', '');
        if(!token){
            return res.status(401).send({message:'You are not authorized'});
        }
        const decoded = jwt.verify(token.replace("Bearer ",""), process.env.SECRET_KEY);
        // decoded heya objet fih les informations li f token 

        req.user = decoded;
        next();

  
};


module.exports = authentication;
