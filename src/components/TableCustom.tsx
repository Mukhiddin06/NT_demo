import React, { useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { ContractType } from '../pages/Admin';
import ModalCustom from './ModalCustom';

interface TableCustomProps {
  contracts: ContractType[];
  fetchContracts: (page: number, pageSize: number) => void;
}

const TableCustom: React.FC<TableCustomProps> = ({ contracts, fetchContracts }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [selectedContract, setSelectedContract] = useState<ContractType | null>(null);

  const handleTableChange = (paginationInfo: any) => {
    const { current, pageSize } = paginationInfo;
    setPagination({ current, pageSize });
    fetchContracts(current, pageSize);
  };

  function handleClickMore(contract: ContractType) {
    setSelectedContract(contract);
    setIsModalOpen(true)

    // //
  }

  const columns: TableColumnsType<ContractType> = [
    { title: "#", dataIndex: "id", key: "id" },
    {
      title: "Nomi",
      dataIndex: "attachment",
      key: "attachment",
      render: (attachment) => attachment ? attachment.origName : "Fayl mavjud emas",
    },
    {
      title: "Kurs",
      dataIndex: "course",
      key: "course",
      render: (course) => course ? course.name : "Kurs mavjud emas",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Button  onClick={() => handleClickMore(record)}>
          <MoreOutlined/>
        </Button>
      ),
    },
  ];


  return (
    <>
    <ModalCustom selectedContract={selectedContract} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <Table<ContractType> columns={columns} dataSource={contracts.map((contract) => ({
        ...contract,
        key: contract.id,
      }))}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: 100,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableCustom;