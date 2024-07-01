import React, { useState, useEffect } from "react";
import { getFiles } from "../services/fileServices"

const FilePage = () => {
  //States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState(null);
  const [search, setSearch] = useState(null);
  const [activeSearch, setActiveSearch] = useState(false);

  const getAllFiles = async () => {
    setLoading(true);
    try {
      const files = await getFiles(search);
      setLoading(false);
      setFiles(files);
    }
    catch (e) {
      console.log(`[File Page] error fetching files`, e);
      setLoading(false);
      setError(e?.data ?? "Something went wrong");
    }
  };

  useEffect(() => {
    getAllFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // not call this function when the search is not active
    if (!activeSearch) return;
    const handler = setTimeout(() => {
      getAllFiles();
    }, 700);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onChange = (e) => {
    if (!activeSearch) setActiveSearch(true)
    setSearch(e.target.value);
  };

  if (error) {
    return (
      <div class="text-center position-absolute top-50 start-50 text-danger">
        {error}
      </div>
    )
  };

  return (
    <div className="p-4">
      <input
        type="string"
        id="search"
        onChange={onChange}
        placeholder="Search by File name"
        className="mb-3 bg-gray-50 border border-gray-500 text-gray-900 rounded-lg w-full p-2.5"
      />

      {loading &&
        <div className="d-flex justify-content-center w-full position-absolute top-50 start-50">
          <div className="spinner-border" role="status">
          </div>
        </div>
      }

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">File Name</th>
            <th scope="col">Text</th>
            <th scope="col">Number</th>
            <th scope="col">Hex</th>
          </tr>
        </thead>
        <tbody>
          {files?.length > 0 &&
            files?.map((file => {
              return file?.lines.map((line, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{file?.file}</th>
                    <th scope="row">{line?.text}</th>
                    <th scope="row">{line?.number}</th>
                    <th scope="row">{line?.hex}</th>
                  </tr>
                )
              })
            }))
          }
        </tbody>
      </table>
    </div>
  )

}

export default FilePage;