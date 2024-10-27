import React, { useState } from "react";
import { Select, message } from "antd";
import { Bars } from "react-loader-spinner";
import { api } from "../api/api";

export const ResultPage = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Получение результата при выборе файла
  const handleFileSelect = async (file: string) => {
    setSelectedFile(file);
    setLoading(true);
    try {
      const response = await api.get(`/files/${file}`);
      setResult(response.data.result);
    } catch (error) {
      message.error("Ошибка при получении данных");
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownVisibleChange = async (open: boolean) => {
    if (open && fileList.length === 0) {
      setLoading(true);
      try {
        const response = await api.getFileList();
        setFileList(response.files);
      } catch (error) {
        message.error("Не удалось загрузить список файлов");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-start p-6 bg-white min-h-screen">
      <Select
        placeholder="Выберите CSV файл"
        style={{
          width: 300,
          borderColor: "black",
          color: "black",
          fontWeight: "bold",
        }}
        dropdownStyle={{
          borderColor: "black",
          fontWeight: "bold",
          color: "black",
        }}
        onChange={handleFileSelect}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        className="ant-select-black"
      >
        {loading ? (
          <Select.Option disabled>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <Bars
                height={20}
                width={20}
                color="gray"
                ariaLabel="loading-indicator"
              />
            </div>
          </Select.Option>
        ) : (
          fileList.map((file) => (
            <Select.Option
              key={file}
              value={file}
              style={{ color: "black", fontWeight: "bold" }}
            >
              {file}
            </Select.Option>
          ))
        )}
      </Select>

      {result && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow">{result}</div>
      )}
    </div>
  );
};
