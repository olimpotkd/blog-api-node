const AWS = require("aws-sdk");

/**
 * Uploads a picture file to AWS
 * @param {object} file
 * @returns {object}
 */
const AWSProfilePicUpload = (file) => {
  //gets the credentials from the shared config file from sdk
  var awsCredentials = new AWS.SharedIniFileCredentials({
    profile: "default",
  });
  //Configure conection
  AWS.config.credentials = awsCredentials;
  AWS.config.update({ region: process.env.AWS_REGION });

  const s3 = new AWS.S3();

  const uploadParams = {
    Bucket: process.env.BUCKET,
    Key: `profilePics/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

module.exports = AWSProfilePicUpload;
