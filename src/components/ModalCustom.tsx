import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Select } from 'antd';
import { FileIcon } from '../assets/Icons';
import { ContractType } from '../pages/Admin';
import { useAxios } from '../hooks/useAxios';

interface ModalType {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedContract: ContractType | null; 
}

const ModalCustom: React.FC<ModalType> = ({ isModalOpen, setIsModalOpen, selectedContract }) => {
  const [title, setTitle] = useState<string>('');
  const [courseId, setCourseId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const token: string | null = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null

  useEffect(() => {
    if (selectedContract) {
      setTitle(selectedContract.title || '');
      setCourseId(selectedContract.course?.id || null);
    } else {
      setTitle('');
      setCourseId(null);
      setFile(null);
    }
  }, [selectedContract]);


  const handleOk = async () => {
    try {
      const response = await useAxios().put(`/api/staff/contracts/${selectedContract?.id}`, {
        title,
        courseId,
        attachment: {
          size: file?.size || selectedContract?.attachment?.size,
          url: selectedContract?.attachment?.url,
          origName: file?.name || selectedContract?.attachment?.origName,
        },
      },{
        headers: {
          Authorization:`Bearer ${token}`
        }
      }
    );
      if (response.status === 200) {
        message.success("Shartnoma muvaffaqiyatli o‘zgartirildi!");
        setIsModalOpen(false);
      }
    } catch (error) {
      message.error("Xatolik yuz berdi!");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Modal title="Shartnoma o‘zgartirish" open={isModalOpen} onOk={handleOk} okText={"O‘zgartirish"} cancelText={"Bekor qilish"} onCancel={handleCancel} okButtonProps={{ style: { backgroundColor: '#0EB182', color: 'white', border: 'none'} }}>
        <form>
          <label className='mb-[32px] block'>
            <p className='text-[14px] leading-[21px] font-semibold'>Kurs</p>
            <Select
              size='large'
              placeholder="Tanlang"
              className='w-full'
              value={courseId}
              onChange={(value:number) => setCourseId(value)}
              options={[
                {
                  value: '1',
                  label: 'SMM',
                },
                {
                  value: '2',
                  label: 'Full Stack',
                },
                {
                  value: '3',
                  label: 'Grafik Dizayn',
                },
              ]}
            />
          </label>
          <label className='mb-[32px] block'>
            <p className='text-[14px] leading-[21px] font-semibold'>Nomi</p>
            <Input className="w-full" variant="outlined" type="text" placeholder="" size="large" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className='py-[11px] cursor-pointer w-full border-dashed border-[1px] rounded-md border-[#DDDDDD] flex justify-center items-center mb-[20px]'>
            <div className='flex items-center space-x-[16px]'><FileIcon/><p className='text-[#0EB182] text-[14px] leading-[18px]'>Fayl biriktiring</p></div>
            <input type="file" className='hidden' onChange={handleFileChange} />
          </label>
        </form>
      </Modal>
    </>
  );
};

export default ModalCustom;