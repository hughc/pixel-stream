import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useResetRecoilState } from "recoil";
import _ from "underscore";
import { imagesList, IMAGE_UPLOAD_URL } from "../recoil/images";

export default function ImageLoader() {
  // the file handles
  const [form, setForm] = useState({ uploadDir: "" });
  const [error, setError] = useState("");
  // the img tags generated from them
  const [uploadedImages, setuploadedImages] = useState([]);
  const resetImages = useResetRecoilState(imagesList);
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
    const promises = _.map(rawFileHandles, (upload) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () =>
          resolve({ uid: upload.path, file: upload, uri: reader.result });
        reader.readAsDataURL(upload);
      });
    });
    let result;
    await Promise.all(promises).then((allDataURIs) => {
      result = _.map(allDataURIs, (resultObj, fileIndex) => {
        return {
          uid: resultObj.uid,
          element: (
            <img alt={resultObj.uid} key={fileIndex} src={resultObj.uri} />
          ),
          file: resultObj.file,
        };
      });
    });
    console.log({ result });
    setuploadedImages(result);
  };
  const uploadSelectedFiles = async () => {
    const promises = _.map(uploadedImages, ({ file }) => {
      const formData = new FormData();
      formData.append("subdir", form.uploadDir);
      formData.append("file", file);
      console.log(`form.uploadDir: ${form.uploadDir}`);
      const request = new Request(IMAGE_UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: {},
      });

      return fetch(request).then((res) => res.json());
    });
    Promise.all(promises)
      .then((results) => {
        let newUploads = _.clone(uploadedImages);
        _.each(results, (uploadResult) => {
          newUploads = _.filter(
            newUploads,
            (upload) => upload.uid !== uploadResult.uid
          );
        });
        setuploadedImages(newUploads);
      })
      .then((result) => {
        // force a refresh from the server;
        resetImages();
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
                <div className="upload">
                  {_.pluck(uploadedImages, "element")}
                </div>
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
