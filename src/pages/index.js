import React from 'react';
import Head from 'next/head'
import axios from 'axios';
import Navbar from 'components/nav/navbar';
import Footer from 'components/footer/footer';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import AWS from 'aws-sdk';

const ID = process.env.ID
const SECRET = process.env.SECRET
const ENDPOINT = process.env.ENDPOINT
const AccessGrant = process.env.ACCESSGRANT
const LinkShare = process.env.LINK_SHARE
const BucketName = process.env.BUCKET_NAME;
const StorjAuth = process.env.STORJ_AUTH;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  endpoint: ENDPOINT,
});

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlImage: null,
      kData: [],
      precentageUpload: 0,
      value: '',
      copied: false,
      setDragActive: false
    };

  }

  componentDidMount = () => {
  }

  // upload image to ipfs (demo server storj bucket server)
  uploadImage = (e) => { 
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];

      let formData = new FormData();
      formData.append("file", file);

      // Setting up S3 upload parameters
      const params = {
          Bucket: BucketName,
          Key: e.target.files[0].name, // File name you want to save as in S3
          Body: file
      };
      
      let that = this;
      let options = {partSize: 10 * 1024 * 1024, queueSize: 1};
      // Uploading files to the bucket
      s3.upload(params, options, function(e, data) {
        that.setState({
          kData: data
        })
      }).on('httpUploadProgress', function(e) {
        let percentCompleted = Math.round((e.loaded * 100) / e.total)
        if (percentCompleted <= 100) {
          that.setState({
            precentageUpload: percentCompleted
          })
        }
      });
    }

    axios.post(StorjAuth, {
      access_grant: AccessGrant,
      public: true,
    },
    ).then((res) => {
      this.setState({
        access: res.request.response
      })
    })

    this.setState({
      setDragActive: false
    })    
  }

  // handle drag and drop file
  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      setDragActive: true
    })
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      setDragActive: false
    })
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      setDragActive: true
    })
  }

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      setDragActive: false
    })
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let file = e.dataTransfer.files[0];

      let formData = new FormData();
      formData.append("file", file);

      // Setting up S3 upload parameters
      const params = {
          Bucket: BucketName,
          Key: e.dataTransfer.files[0].name, // File name you want to save as in S3
          Body: file
      };
      
      let that = this;
      let options = {partSize: 10 * 1024 * 1024, queueSize: 1};
      // Uploading files to the bucket
      s3.upload(params, options, function(e, data) {
        that.setState({
          kData: data
        })
      }).on('httpUploadProgress', function(e) {
        let percentCompleted = Math.round((e.loaded * 100) / e.total)
        if (percentCompleted <= 100) {
          that.setState({
            precentageUpload: percentCompleted
          })
        }
      });
    }
    axios.post(StorjAuth, {
      access_grant: AccessGrant,
      public: true,
    },
    ).then((res) => {
      this.setState({
        access: res.request.response
      })
    })
  }


  getUploadLink = () => {
    if (this.state.access) {
      let parseAccess = JSON.parse(this.state.access)
      let AccessKeyId = parseAccess.access_key_id
      if (this.state.kData.Key) {
        let urlShareLink = LinkShare + AccessKeyId + '/' + BucketName + '/' + this.state.kData.Key
        this.setState({
          urlImage: urlShareLink
        })
      }
      
    }
  }

  restartUpload = () => {
    this.setState({
      urlImage: null,
      kData: [],
      precentageUpload: 0,
      value: '',
      copied: false,
      setDragActive: false
    })
  }


  render() {
    this.getUploadLink()

    return (
      <>
        <Head>
          <title>Decentralized Upload & Sharing Platform | 13X Labs</title>
          <meta name="description" content="Decetralized upload & sharing large files is a simple, easy-to-use tool for sharing files directly from your device without having to rely on third-party intermediaries like big corporate cloud providers." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:image" content="https://uploadfile.on.btfs.io/uploadfiletoipfs.png" ></meta>
          <meta property="twitter:image" content="https://uploadfile.on.btfs.io/uploadfiletoipfs.png"></meta>
          <meta property="og:image:type" content="image/png"></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div>
            <Navbar />
            {/* Drop File to Attach or Browser */}
            <div className=" h-screen w-screen sm:px-8 md:px-16 sm:py-8 bg-gray-700">
              <div className="container mx-auto max-w-screen-lg h-auto">
                <article aria-label="File Upload Modal" className="relative h-full flex flex-col bg-white shadow-xl rounded-md" >
                  <section className="h-full overflow-auto p-8 w-full flex flex-col">
                    {this.state.precentageUpload ? <div></div> : <label
                        for="dropzone-file"
                        className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                        onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={this.handleDrop}
                        >
                        <span className="flex items-center space-x-2">
                            <ArrowUpTrayIcon className="block h-6 w-6" aria-hidden="true" />
                            <span className="font-medium text-gray-600">
                            Drag and drop your files anywhere or &nbsp;
                            <a className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">Upload a file</a>
                            </span>
                        </span>
                        <input id='dropzone-file' type='file' onChange={this.uploadImage.bind(this)} className="hidden" />
                    </label>}
                    
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    {this.state.precentageUpload == 100 ? 
                                      <div className="bg-gray-600 text-xs font-medium text-white text-center p-1 leading-none rounded-full">Completed</div>
                                      : <div className="bg-gray-600 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full" style={{width: this.state.precentageUpload * 10, maxWidth: "100%"}}>  {this.state.precentageUpload}%</div>}
                      
                    </div>
                    <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
                          Product built 13X Labs
                    </h1> 
                    {this.state.urlImage ?
                    <div className=''>
                      <div className='flex justify-center'>
                      <input className='inline-block px-6 py-2.5 w-full bg-white text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'
                    value={`${this.state.urlImage}`} disabled/>
                      {/* <CopyToClipboard text={`${this.state.urlImage}`}
                        onCopy={() => this.setState({copied: true})}>
                        <button className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Copy</button>
                      </CopyToClipboard> */}
                      <button>  
                        <Link className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out' 
                        href={`${this.state.urlImage}`} target='_blank'>View</Link>
                      </button>
                      </div>
                      <p className='text-center mt-2'>QR Code Generator</p>
                      <div className='mt-1 flex justify-center'>
                        <QRCode value={`${this.state.urlImage}`} size={128} />
                      </div>
                      <div className='block text-center'>
                        <button onClick={this.restartUpload} className='bg-gray-600 text-xs font-medium text-white text-center p-2 mt-3 leading-none rounded-full'>Upload Again</button>
                      </div>
                    </div>
                    : null}
                    
                  </section>
                </article>
              </div>
            </div>
            <Footer />
          </div>
        </main>
      </>
    )
  }   
}