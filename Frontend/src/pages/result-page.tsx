/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
import { Bars } from "react-loader-spinner";
import { motion } from "framer-motion";

// Интерфейс для типизации данных клиента
interface FileData {
  clnt_id: string;
  gndr: string;
  brth_yr: string;
  city: string;
  accnt_bgn_date: string;
  erly_pnsn_flg: boolean;
}

export const ResultPage = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileListLoading, setFileListLoading] = useState(false);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState<FileData[]>([]);

  const fileMapping: { [key: string]: string } = {
    "example1.csv": "/src/assets/jsons/fileData.json",
    "example2.csv": "/src/assets/jsons/fileData2.json",
    "example3.csv": "/src/assets/jsons/fileData3.json",
    "example4.csv": "/src/assets/jsons/fileData4.json",
    "example5.csv": "/src/assets/jsons/fileData5.json",
    "example6.csv": "/src/assets/jsons/fileData6.json",
    "example7.csv": "/src/assets/jsons/fileData7.json",
  };

  useEffect(() => {
    const loadFileList = async () => {
      setFileListLoading(true);
      try {
        const response = await fetch("/src/assets/jsons/fileList.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Полученные данные:", data);
        if (data.files && Array.isArray(data.files)) {
          setFileList(data.files);
        } else {
          message.error("Некорректная структура файла JSON");
        }
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);
        message.error(`Не удалось загрузить список файлов: ${error}`);
      } finally {
        setFileListLoading(false);
      }
    };
    loadFileList();
  }, []);

  const handleFileSelect = async (file: string) => {
    setSelectedFile(file);
    setTableDataLoading(true);
    try {
      const jsonFile = fileMapping[file];
      if (!jsonFile) {
        throw new Error("Нет сопоставленного JSON файла для выбранного CSV");
      }
      const response = await fetch(jsonFile);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки JSON: ${response.status}`);
      }
      const data = await response.json();
      setTableData(
        data.map((item: FileData) => ({
          clnt_id: item.clnt_id,
          gndr: item.gndr,
          brth_yr: item.brth_yr,
          city: item.city,
          accnt_bgn_date: item.accnt_bgn_date,
          erly_pnsn_flg: item.erly_pnsn_flg,
        }))
      );
    } catch (error) {
      message.error("Ошибка при получении данных");
      console.error("Ошибка:", error);
    } finally {
      setTableDataLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 items-start bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-lg text-gray-800 leading-relaxed max-w-[30rem]"
      >
        <p className="mb-[1rem] ">
          Выберите из списка .csv файлов интересующий вас. Дождитесь обработки и
          загрузки файла.
        </p>
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
          className="ant-select-black"
        >
          {fileListLoading ? (
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
        {tableDataLoading && (
          <div className="mt-8 flex justify-center">
            <Bars
              height={50}
              width={50}
              color="gray"
              ariaLabel="loading-indicator"
            />
          </div>
        )}

        {!tableDataLoading && tableData.length > 0 && (
          <table className="mt-8 border-collapse border w-[100rem] border-gray-300">
            <thead>
              <tr>
                {[
                  "ID клиента",
                  "Пол клиента",
                  "Дата рождения",
                  "Город, указанный клиентом",
                  "Дата заключения договора",
                  "Ранний выход на пенсию",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 p-2 bg-gray-100"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="border border-gray-300 p-2">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};
