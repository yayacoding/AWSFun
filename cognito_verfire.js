const { CognitoJwtVerifier,JwtRsaVerifier } =require("aws-jwt-verify")
const {SimpleJwksCache,SimplePenaltyBox}=require("aws-jwt-verify/jwk")
const {SimpleJsonFetcher}=require("aws-jwt-verify/https")
const connectToDatabase = require('./db')
const AWS = require("aws-sdk")

let verifier =  JwtRsaVerifier.create([
    {
        issuer: "https://cognito-idp.eu-west-1.amazonaws.com/"+process.env.admin_cognito_poolId,
        audience: process.env.admin_clientId,
        graceSeconds:10
    },
    {
      issuer: "https://cognito-idp.eu-west-1.amazonaws.com/"+process.env.user_cognito_poolId,
      audience: process.env.user_clientId,
      graceSeconds: 10
    },
  ],{
    jwksCache: new SimpleJwksCache({
        fetcher: new SimpleJsonFetcher({
            defaultRequestOptions: {
                timeout:1000,
                responseTimeout: 10000,
            },
          }),
  })
  });
const verifyToken=async(event)=>{
    if(event.headers ){
        if(!event.headers.Authorization){
            return{ statusCode: 400, message: 'token not provided!' }
         }else{
    
             console.log("🚀 ~ file: helper.js:522 ~ verifyToken ~ verifier", verifier)
      try {
        const otherPayload = await verifier.verify(event.headers.Authorization); // Token must be from either idp1 or idp2
        console.log("Token is valid. Payload:", otherPayload);
        return
      } catch (err){
        console.log("Token not valid!",err);
        return{ statusCode: 401, message:err.message }
      }}}
    else{
        return{ statusCode: 402, message: 'No headers provided' }
    }
}
