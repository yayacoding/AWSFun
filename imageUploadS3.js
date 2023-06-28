const AWS = require("aws-sdk")
const multipart = require('aws-lambda-multipart-parser');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    endpoint: `s3.${process.env.BUCKET_REGION}.amazonaws.com`,
});

const saveImageInS3 = async(content, fileName, contentType) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'interest/' + fileName, // File name you want to save as in S3
        Body: content,
        ContentEncoding: 'base64',
        ContentType: contentType ? contentType : 'application/octet-stream',
        ACL: 'public-read'
    };
    console.log("params===========================", params)
        // Uploading files to the bucket
    return new Promise((resolve) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err)
                resolve(err)
            } else {
                console.log("file uploaded successfully")
                resolve(data)
            }
        })
    })
}

const saveMUltipleImageInS3 = async(file, imgRes) => {
        let data = await file.map(async(element, result) => {
            let ext = element.filename.split('.').pop()
            let newFileName = Date.now() + '.' + ext
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'interest/' + newFileName, // File name you want to save as in S3
                Body: Buffer.from(element.content, 'base64'),
                ContentEncoding: 'base64',
                ContentType: element.contentType ? element.contentType : 'application/octet-stream',
                ACL: 'public-read'
            };
            // Uploading files to the bucket
            console.log("params===========================", params)
            return new Promise((resolve) => {
                s3.upload(params, (err, data) => {
                    if (err) {
                        console.error(err)
                        resolve(err)
                    } else {
                        console.log("file uploaded successfully")
                        resolve(data)
                    }
                })
            })
        });
        imgRes = await Promise.all(data);
        return imgRes

    }
