import AWS from "aws-sdk";

/**
 * Uploads a picture file to AWS
 * @param {object} file File to be uploaded
 * @param {string} fileName Name of the file when uploaded
 * @param {string} route Directory where the file will be uploaded to
 * @returns {object}
 */
const AWSFileUpload = (file, fileName, route) => {
  const fileExtension = file.originalname.split(".")[1];
  const key = `${route}${fileName}.${fileExtension}`;

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
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

export default AWSFileUpload;
