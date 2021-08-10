import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import _ from "underscore";
import { IMAGE_UPLOAD_URL } from "../recoil/images";

export default function ImageLoader() {
  // the file handles
  const [uploads, setuploads] = useState([]);
  const [form, setForm] = useState({ uploadDir: "" });
  const [error, setError] = useState("");
  // the img tags generated from them
  const [uploadedImages, setuploadedImages] = useState([]);
  //the completed uploads
  const [uploadeds, setuploadeds] = useState([]);

  useEffect(() => {});

  const onDrop = useCallback((acceptedFiles) => {
    dealWithUploads(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = function (e) {
    e.preventDefault();
    uploadSelectedFiles();
  };
  const inputChanged = function (e) {
    let newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    newValue = e.target.type === "number" ? parseInt(newValue) : newValue;
    const newLocalState = _.defaults(
      { [e.target.name]: newValue },
      { ...form }
    );
    setForm(newLocalState);
  };

  const dealWithUploads = async function (rawFileHandles) {
    setuploads(rawFileHandles);
    const promises = _.map(rawFileHandles, (upload) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(upload);
      });
    });
    let result;
    await Promise.all(promises).then((allDataURIs) => {
      result = _.map(allDataURIs, (fileContent, fileIndex) => (
        <img key={fileIndex} src={fileContent} />
      ));
    });
    setuploadedImages(result);
  };
  const uploadSelectedFiles = async () => {
    const promises = _.map(uploads, (rawFileHandle) => {
      const formData = new FormData();
      formData.append("file", rawFileHandle);
      console.log(rawFileHandle);
      const request = new Request(IMAGE_UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: {},
      });

      return fetch(request).then((res) => res.json());
    });
    Promise.all(promises).then((results) => {
      console.log(results);
    });
  };
  const emptyMessage = _.isEmpty(uploadedImages) ? (
    <p>Drag files here, or click to select files</p>
  ) : (
    <p></p>
  );

  return (
    <div>
      <div className="u-pad--top-20">
        <h4>Image uploader</h4>
      </div>
      <p>
        Upload your images by dropping them into the area below. When you have
        selected them, hit upload.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Col sm="4">
            <Form.Group controlId="uploadDir">
              <Form.Label>Upload subdirectory</Form.Label>
              <Form.Control
                name="uploadDir"
                onChange={inputChanged}
                type="text"
                value={form.uploadDir}
              />
              <Form.Text className="text-muted">
                Optional subdir to upload files - can make filtering easier..
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <div className="c-filedropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="c-filedropzone-inner">
                {isDragActive ? <p>Drop the files here ...</p> : emptyMessage}
                <div className="upload">{uploadedImages}</div>
              </div>
            </div>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Group className="sm-3 u-margin--top-20" controlId="save">
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}
