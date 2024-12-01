import React, { useState } from 'react';
import { Input, Modal, Select, message } from 'antd';
import { FileIcon } from '../assets/Icons';
import { useAxios } from '../hooks/useAxios';
import { CourseType } from '../pages/Admin';

interface FileTypes {
  type: string;
  name: string;
  size: number
}

interface ModalType {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  courses: CourseType[]
}

const ModalDemo: React.FC<ModalType> = ({ isModalOpen, setIsModalOpen, courses }) => {
  const token: string | null = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null;
  const [files, setFiles] = useState<FileTypes | []>([]);
  const [course, setCourse] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleOk = () => {
    // if (files.length === 0) {
    // message.error("Iltimos, fayllarni tanlang!");
    // return;
    // }
    handleSubmit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await useAxios().post("/api/staff/upload/contract/attachment", {
        files: files
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const contractData = {
          title: name,
          courseId: course,
          attachment: {
            size: response.data.data[0].size,
            url: response.data.data[0].path,
            origName: response.data.data[0].fileName,
          },
        };
        console.log(contractData);


        await useAxios().post("/api/staff/contracts/create", contractData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        message.success("Shartnoma muvaffaqiyatli yaratildi!");
        setFiles([]);
      }
      else {
        message.error("Xatolik yuz berdi!");
      }

    } catch (error) {
      message.error("Xatolik yuz berdi!");
      console.log(error);
    }
  };

  return (
    <>
      <Modal title="Shartnoma yaratish" open={isModalOpen} onOk={handleOk} okText={"Saqlash"} cancelText={"Bekor qilish"} onCancel={handleCancel} okButtonProps={{ style: { backgroundColor: '#0EB182', color: 'white', border: 'none' } }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <label className='mb-[32px] block'>
            <p className='text-[14px] leading-[21px] font-semibold'>Kurs</p>
            <Select
              size='large'
              placeholder="Tanlang"
              className='w-full'
              value={course}
              onChange={setCourse}
              options={
                Array.isArray(courses)
                  ? courses.map((course) => ({
                    value: course.id,
                    label: course.name,
                  }))
                  : []
              }
            />
          </label>
          <label className='mb-[32px] block'>
            <p className='text-[14px] leading-[21px] font-semibold'>Nomi</p>
            <Input
              className="w-full"
              variant="outlined"
              type="text"
              placeholder="Nomi kiriting"
              size="large"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className='py-[11px] cursor-pointer w-full border-dashed border-[1px] rounded-md border-[#DDDDDD] flex justify-center items-center mb-[20px]'>
            {files && (files as File).name ? (
              <p className='text-[#0EB182] text-[14px] leading-[18px]'>{(files as File).name}</p>
            ) : (
              <div className='flex items-center space-x-[16px]'>
                <FileIcon />
                <p className='text-[#0EB182] text-[14px] leading-[18px]'>Fayl biriktiring</p>
              </div>
            )}
            <input type="file" onChange={handleFileChange} className='hidden' />
          </label>
        </form>
      </Modal>
    </>
  );
};

export default ModalDemo;
