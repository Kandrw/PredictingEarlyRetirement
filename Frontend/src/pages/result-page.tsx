/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Select, message } from "antd";
import { Bars } from "react-loader-spinner";
import { api } from "../api/api";
import { motion } from "framer-motion";

export const ResultPage = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileListLoading, setFileListLoading] = useState(false);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [tableData, setTableData] = useState<Array<any>>([]);

  // Получение результата при выборе файла
  const handleFileSelect = async (file: string) => {
    setSelectedFile(file);
    setTableDataLoading(true);
    try {
      const response = await api.get(`/files/${file}`);
      setTableData(
        response.data.map((item: any) => ({
          "ID клиента": item.clnt_id,
          Пол: item.gndr,
          "Дата рождения": item.brth_yr,
          "Город, указанный клиентом": item.city,
          "Дата заключения договора": item.accnt_bgn_date,
          "Ранний выход на пенсию": item.erly_pnsn_flg,
        }))
      );
    } catch (error) {
      message.error("Ошибка при получении данных");
    } finally {
      setTableDataLoading(false);
    }
  };

  const handleDropdownVisibleChange = async (open: boolean) => {
    if (open && fileList.length === 0) {
      setFileListLoading(true);
      try {
        const response = await api.getFileList();
        setFileList(response.files);
      } catch (error) {
        message.error("Не удалось загрузить список файлов");
      } finally {
        setFileListLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-start p-6 bg-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-lg text-gray-800 leading-relaxed max-w-[30rem]"
      >
        <p className="mb-[1rem]">
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
          onDropdownVisibleChange={handleDropdownVisibleChange}
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
          <table className="mt-8 w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {[
                  "ID клиента",
                  "Пол",
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
