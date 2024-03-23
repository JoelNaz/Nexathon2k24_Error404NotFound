


const CaseCard = ({report}) => {
  return (
    
          <div key={report._id} className="flex flex-col mb-10 px-8 py-8 sm:flex-row sm:justify-between rounded-xl bg-white text-black  backdrop-blur-lg bg-opacity-40">
            <div className="flex w-full space-x-2 sm:space-x-4">
              <div className="flex flex-col w-full justify-between pb-4">
                <div className="flex w-full justify-between space-x-2 pb-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold leading-snug sm:pr-8 text-2xl">{report.title}</h3>
                    {/* <p className="text-lg p-2">{report.color}</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-10 mt-5 p-2">
                  {/* <img
                    className="h-40 w-40 flex-shrink-0 rounded object-contain outline-none dark:border-transparent sm:h-32 sm:w-32"
                    src={report.imageSrc}
                    alt={report.name}
                  /> */}
                  <div className="flex flex-grow items-center justify-between px-10">
                  {/* <div className="text-left">
                    <button type="button" className=" bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                      Chat with Admin
                    </button>
                  </div> */}
                  {/* <div className="text-right">
                    <button type="button" className=" bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800">
                      Chat with Reporter
                    </button>
                  </div> */}
                  <div>
                    {report.description}
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

  )
}

export default CaseCard