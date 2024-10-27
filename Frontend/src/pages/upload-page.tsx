/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Upload } from "antd";
import { api } from "../api/api";

export const UploadPage = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleBeforeUpload = (file: { type: string }) => {
    if (file.type !== "text/csv") {
      toast.error("Пожалуйста, загрузите файл в формате .csv");
      return Upload.LIST_IGNORE;
    }
    setIsFileUploaded(true);
    return true;
  };

  const handleUpload = async (file: File, onSuccess?: (body: any) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.postUpload(formData);
      toast.success("Файл успешно загружен!");
      console.log(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      toast.error("Произошла ошибка при загрузке файла.");
    }
  };

  return (
    <div className="pl-10 flex flex-col items-center pt-[3rem]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-lg text-gray-800 leading-relaxed max-w-[60rem]"
      >
        <p className="mb-[3rem]">
          Мы предлагаем пользователю загрузить файл или файлы в .csv формате.
          Сделать это можно, воспользовавшись формой для выгрузки. Файлы
          обязательно должны быть соответствующего формата, иначе форма не даст
          их загрузить. После того как файлы выбраны и загружены пользователю
          нужно перейти на страницу "Результаты".
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-[40rem] h-[18rem] border-2 border-solid border-black flex flex-col rounded-lg justify-start pr-[4rem] pl-[4rem] pt-[2rem]">
          <Dragger
            className="h-[11rem]"
            beforeUpload={handleBeforeUpload}
            customRequest={({ file, onSuccess }) => {
              handleUpload(file as File, onSuccess);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите файл в указанную область для загрузки
            </p>
            <p className="ant-upload-hint">
              Есть поддержка как одиночной, так и массовой загрузки
            </p>
          </Dragger>
          {!isFileUploaded && (
            <p className="ant-upload-hint flex flex-row justify-center">
              Загрузите файл в .csv формат
            </p>
          )}
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </motion.div>
    </div>
  );
};
