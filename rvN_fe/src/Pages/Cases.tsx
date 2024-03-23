import { getAssignedReports, getReportByStatus } from "@/api"
import CaseCard from "@/components/CaseCard"
import { useEffect, useState } from "react"

const Cases = () => {
  const [pendingCases, setPendingCases] = useState([])
  useEffect(()=>{
    const fetchPending = async()=>{

      try{
        const response = await getAssignedReports()
        setPendingCases(response.data)
      }
      catch{
        console.log("error")
      }
    }
    fetchPending();
  },[])
  console.log(pendingCases)
  return (
    <div >
      <div className="text-[24px]">Assigned Cases:</div>
      {
        pendingCases.length==0 ? <div className="text-center mt-10">No Assigned Reports</div>:pendingCases.map((report)=>{
          return <CaseCard report={report}/>
        })
      }
    </div>
  )
}

export default Cases
