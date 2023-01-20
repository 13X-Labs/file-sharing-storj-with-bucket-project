# About File Sharing

File Sharing by <a href="https://www.13xlabs.com/" target="_blank">13X Labs</a> is the simplest way to send your files around the world. <br/> This is Demo Project.

## Features
- Share and receive files using IPFS.
- Upload or drag-and-drop individual files or entire directories
- Preview files in-browser (browser-supported formats only) before sharing or downloading
- Generates a QR code for share links for easy distribution
- 100% mobile-friendly

## Initial Set-up (Important)
Install node-gyp globally
```
$ npm install -g node-gyp
```
Install the storj-nodejs Node.js package
```
$ npm install uplink-nodejs
```
Set Environment variable: <br />
- MacOS:
  - Set DYLD_LIBRARY_PATH environment variable
    - Run following command inside root directory of your project
      ```
      export  DYLD_LIBRARY_PATH=$DYLD_LIBRARY_PATH:$PWD/node_modules/uplink-nodejs/
      ```
    OR
    - Copy libuplinkc*.* files from $PROJECTROOT/node_modules/uplink-nodejs/ to /usr/local/lib
    <br/>
- Windows:
  - Set Path environment variable to libuplinkc*.* which is $PROJECTROOT/node_modules/uplink-nodejs

```  
For NodeJS
```

- Please ensure Node.js with version 10 or higher is installed
  - Check Node.js version
    ```
    $ node -v
    ```
- please ensure make is already installed.
- please ensure node-gyp dependencies is already installed.
- please ensure @types/node dependencies is installed for running module in typescript.

## Run development

First, run the development server:

```bash
npm run dev
```
Config .env

```bash
ID=
SECRET=
ENDPOINT='https://gateway.storjshare.io'
ACCESSGRANT=''
STORJ_AUTH='https://auth.storjshare.io/v1/access'
LINK_SHARE='https://link.storjshare.io/s/'
BUCKET_NAME=''
```

## Upload Files 

Upload any files to IPFS (Demo server storj-ipfs.com)

```bash
const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        endpoint: ENDPOINT
    });

    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];

      let formData = new FormData();
      formData.append("file", file);

      // Setting up S3 upload parameters
      const params = {
          Bucket: BucketName,
          Key: e.target.files[0].name, // File name you want to save as in S3
          Body: file,
          ACL: 'public-read',
          ContentType: 'image/jpeg'
      };
      
      const that = this;
      // Uploading files to the bucket
      s3.upload(params, function(e, data) {
        that.setState({
          kData: data
        })
        
        axios.post(StorjAuth, {
          access_grant: AccessGrant,
          public: true
        }).then((res) => {
          let urlShareLink = LinkShare + JSON.parse(res.request.response).access_key_id + '/' + BucketName + '/' + data.Key
          that.setState({
            urlImage: urlShareLink
          })
        })
      });
    }
```