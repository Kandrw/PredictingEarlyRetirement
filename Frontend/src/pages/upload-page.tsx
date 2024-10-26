/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Upload } from "antd";
import axios from "axios";

export const UploadPage = () => {
  const handleBeforeUpload = (file: { type: string }) => {
    if (file.type !== "text/csv") {
      toast.error("Пожалуйста, загрузите файл в формате .csv");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const postUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Файл успешно загружен!");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      toast.error("Произошла ошибка при загрузке файла.");
      throw error;
    }
  };

  const handleUpload = async (file: File, onSuccess?: (body: any) => void) => {
    try {
      const responseData = await postUpload(file);
      if (onSuccess) {
        onSuccess(responseData);
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    }
  };

  return (
    <div className="pl-10 flex flex-row justify-center pt-[20rem]">
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
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </motion.div>
    </div>
  );
};
