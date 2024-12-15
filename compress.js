// Import required modules
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Function to compress a large text file
const compressFile = (inputFilePath, outputFilePath) => {
  // Create readable stream from the input file
  const readableStream = fs.createReadStream(inputFilePath);

  // Create a writable stream for the output compressed file
  const writableStream = fs.createWriteStream(outputFilePath);

  // Create a gzip transform stream
  const gzip = zlib.createGzip();

  // Pipe the readable stream (file) through the gzip compression stream, 
  // then pipe the result to the writable stream (output file)
  readableStream
    .pipe(gzip)
    .pipe(writableStream)
    .on('finish', () => {
      console.log(`File successfully compressed to: ${outputFilePath}`);
    })
    .on('error', (err) => {
      console.error('Error during compression:', err);
    });
};

// Example usage:
const inputFilePath = path.join(__dirname, 'large-file.txt'); // Replace with your file path
const outputFilePath = path.join(__dirname, 'large-file.txt.gz');

compressFile(inputFilePath, outputFilePath);a