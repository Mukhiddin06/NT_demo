import { Button, Input } from "antd"
import TableCustom from "../components/TableCustom"
import { useAxios } from "../hooks/useAxios"
import { SearchOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import useDebounce from "../hooks/useDebounce"
// import ModalCustom from "../components/ModalCustom"
import ModalDemo from "../components/ModalDemo"


export interface AttachmentType {
  url: string;
  origName?: string;
  size?: number;
}

export interface CourseType {
  id?: number;
  name: string;
  createdAt?: string;
}

export interface ContractType {
  id: number;
  title: string;
  attachment: AttachmentType;
  course: CourseType;
  createdAt?: string;
}

export interface FetchType {
  (page: number, pageSize: number): void;
}

function Admin() {
  const token: string | null = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null
  // console.log(token)
  const [contracts, setContracts] = useState<ContractType[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // console.log(contracts)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const SearchTerm = useDebounce(search, 800);
  const [courses, setCourses] = useState<CourseType[]>([])


  const fetchContracts = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  };


  useEffect(() => {
    useAxios().get("/api/staff/contracts/all", {
      params: {
        page,
        perPage:pageSize,
        search: SearchTerm
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    }).then(res => {
      // console.log(res.data.data.contracts)
      setContracts(res.data.data.contracts)
    }).catch((error) => {
      console.log(error)
    })
  }, [SearchTerm, page, pageSize])

  function handleClickBtn() {
    setIsModalOpen(true);
    useAxios().get("/api/staff/courses", {
      params: {
        page:1,
        perPage:100,
      },
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    }).then(res => {
      const fetchedCourses = res.data.data.courses; // Ma'lumotni oling
      setCourses(fetchedCourses);
      // console.log(res.data.data.courses)
    }).catch((error) => {
      console.log(error)
    })
  };

  return (
    <div className="p-[24px]">
      <div className="flex justify-between items-center mb-[20px] rounded-t-[12px] bg-[#FBFBFB] p-[24px]">
        <Input onChange={(e) => setSearch(e.target.value)} size="small" className="h-[40px] w-[300px] hover:bg-[#FBFBFB] bg-[#FBFBFB] border-none outline-none focus:border-none" style={{ borderColor: "transparent", boxShadow: "none" }} placeholder="Qidiruv" prefix={<SearchOutlined />} />
        <Button onClick={() => handleClickBtn()} htmlType="button" type="primary" size="large" className="bg-[#0EB182]">Qo‘shish</Button>
      </div>
      <TableCustom contracts={contracts} fetchContracts={fetchContracts}/>
      <ModalDemo isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} courses={courses}/>
    </div>
  )
}

export default Admin