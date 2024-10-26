import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
// import { api } from "./api/api"; // убедитесь, что путь к API правильный
import { Bars } from "react-loader-spinner";

export const ResultPage = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Получение списка CSV файлов при загрузке компонента
  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await api.get("/files");
        setFileList(response.data.files);
      } catch (error) {
        message.error("Не удалось загрузить список файлов");
      }
    }
    fetchFiles();
  }, []);

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

  return (
    <div className="flex flex-col items-start p-6 bg-white min-h-screen">
      <Select
        placeholder="Выберите CSV файл"
        style={{
          width: 300,
          borderColor: "black", // Черные границы
          color: "black", // Черный цвет текста
          fontWeight: "bold", // Жирный текст
        }}
        dropdownStyle={{
          borderColor: "black", // Черные границы в выпадающем списке
          fontWeight: "bold", // Жирный текст в списке
          color: "black", // Черный цвет текста в списке
        }}
        onChange={handleFileSelect}
        className="ant-select-black" // Используем для дополнительного стиля через CSS
      >
        {fileList.map((file) => (
          <Select.Option
            key={file}
            value={file}
            style={{ color: "black", fontWeight: "bold" }}
          >
            {file}
          </Select.Option>
        ))}
      </Select>

      {/* Отображение загрузки или результата */}
      {loading ? (
        <Bars
          height={50}
          width={50}
          color="gray"
          ariaLabel="loading-indicator"
        />
      ) : (
        result && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow">{result}</div>
        )
      )}
    </div>
  );
};
