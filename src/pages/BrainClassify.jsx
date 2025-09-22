import { useState } from "react"
import { BRAIN } from "../utils"
import axios from "axios"

function BrainClassify() {
  const [img, setImg] = useState({
    status: false,
    file: {},
    tempPath: ''
  })

  const [statusResult, setStatusResult] = useState({
    loading: false,
    submitted: false,
    result: null
  })
  
  const [reportSections, setReportSections] = useState({
    findings: '',
    impression: ''
  })

  const [error, setError] = useState(null)

  const splitReport = (reportText) => {
    if (!reportText) return { findings: '', impression: '' };
    
    // Replace escaped newlines with actual newlines
    const cleanedText = reportText.replace(/\\n/g, '\n');
    
    const sections = {};
    const sectionTitles = ['FINDINGS:', 'IMPRESSION:'];
    
    sectionTitles.forEach((title, index) => {
      const start = cleanedText.indexOf(title);
      if (start !== -1) {
        const nextTitle = index < sectionTitles.length - 1 
          ? cleanedText.indexOf(sectionTitles[index + 1]) 
          : cleanedText.length;
        
        const sectionContent = cleanedText.substring(start + title.length, nextTitle).trim();
        const sectionKey = title.replace(':', '').toLowerCase();
        
        sections[sectionKey] = sectionContent;
      }
    });
    
    return sections;
  };

  const handleAnalysis = e => {
    e.preventDefault();
    setError(null)
    setStatusResult(prev => ({ ...prev, loading: true }))
    
    const formData = new FormData();
    formData.append("file", img.file);

    axios.post('https://HaiMax2007-5-brain-disease-classification.hf.space/upload-image', formData, {
      headers: {
        "Content-Type": 'multipart/form-data'
      }
    })
    .then(res => {
      if(!res.data.is_brain_xray){
        setError(res.data)
        return
      }
      setStatusResult(prev => ({...prev, result: res.data, submitted: true}))
      
      if (res.data.report) {
        const sections = splitReport(res.data.report);
        setReportSections(sections);
      }
    })
    .catch(e => console.log(e))
    .finally(() => {
      setStatusResult(prev => ({ ...prev, loading: false }))
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;
    
    const size = file.size > 1048576 ? file.size/(1024**2) : file.size/1024
    const byte = file.size > 1048576 ? 'MB' : 'KB'

    setImg({...img, file: file, tempPath: URL.createObjectURL(file), size: `${size.toFixed(2).toString()} ${byte}`})
  }
  const handleImageReset = () => {
    setImg({status: false, file: {}, tempPath: ''})
    setStatusResult({loading: false, submitted: false, result: null})
    setReportSections({findings: '', impression: ''})
  }

  return (
    <div className="bg-blue-50 min-h-screen px-10 py-10">
      <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-5">
        <img src="/brainlogo.png" alt="Logo" className="w-[60px] h-[60px] object-cover mix-blend-color-burn" />
        <h1 className="font-bold capitalize text-4xl text-center ">brain <span className="bg-blue-200 px-2 text-blue-600">x ray</span> analysis system</h1>
      </div>
      <p className="text-center text-lg mt-5">Upload gambar scan X-ray otak untuk analisis otomatis</p>
      <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-[1000px] mx-auto mt-15 gap-10">
        <div className="relative">
            <form onSubmit={handleAnalysis} className="bg-white p-4 rounded space-y-10 h-fit md:sticky top-5 bottom-0" encType="multipart/form-data">
            <div className="flex items-center gap-3">
                <img src="/upload.png" alt="upload" className="w-5 h-5" />
                <h2 className="font-semibold">Upload X-Ray Otak</h2>
            </div>
            <div 
            className={`img-box h-[250px] flex flex-col justify-center items-center w-full relative ${!img.tempPath && 'border-[2px] border-black/20 border-dashed py-6 px-3'} overflow-hidden rounded-xl hover:border-blue-500 transition duration-400`}>
                {
                img.tempPath ? (
                    <img src={img.tempPath} alt="Display Image" className="w-full h-full object-cover" />
                ) : (
                    <>
                    <label htmlFor="upload" className="absolute w-full h-full cursor-pointer">
                        <input className="hidden" type="file" accept="image/*" id="upload" onChange={handleImageChange} />
                    </label>
                    <img src="/file.png" alt="file" className="w-14 h-14" />  
                    <span className="text-blue-600 mt-4 text-center">Klik untuk upload gambar</span>
                    <span className="text-black/40 text-xs text-center">Format: JPG, PNG, JPEG (Max 5MB)</span>
                    </>
                )
                }
            </div>
            {
                img.tempPath && (
                <div className="space-y-2 flex flex-col ">
                    <div className="flex w-full gap-4">
                        <div onClick={handleAnalysis} className={`h-full flex justify-center gap-2 font-semibold rounded text-sm transition text-white grow ${statusResult.loading ? 'bg-black/50 cursor-default' : 'cursor-pointer bg-black hover:bg-black/70'} text-center py-2 px-3`}>
                            {
                            statusResult.loading ? (
                                <>
                                <img src="/loading.png" alt="Loading" className="animate-spin w-5 h-5" />
                                <span>Menganalisis . . .</span>
                                </>
                            ) : (
                                <span>Analisis Gambar</span>
                            )
                            }
                        </div>
                        <button onClick={handleImageReset} type="button" className={`${statusResult.submitted && statusResult.result && 'grow'} cursor-pointer font-semibold rounded text-sm hover:bg-black/5 transition border-black/10 border text-center py-2 px-3`}>Reset</button>
                    </div>
                    {error && <span className="text-red-600 text-center text-sm">Gambar tidak dapat di deteksi oleh AI. Mohon berikan gambar yang valid.</span>}
                </div>
                )
            }
            </form>
        </div>
        <div className="bg-white p-4 rounded space-y-5 h-fit md:h-full ">
          <div className="flex items-center gap-3">
            <img src="/thinking.png" alt="brain" className="w-5 h-5"/>
            <h2 className="font-semibold">Hasil Analisis</h2>
          </div>
          {
            statusResult.submitted && statusResult.result ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center px-5 py-3 bg-red-50 text-red-700 border-red-200 border rounded-lg text-xl">
                  <h2 className="capitalize">{statusResult.result.classification[0].condition}</h2>
                  <span>{statusResult.result.classification[0].confidence}%</span>
                </div>
                <div className="border border-black/20 px-5 py-6 rounded-lg space-y-8">
                  <div className="">
                    <h2 className="capitalize font-semibold text-lg">Laporan Radiologi</h2>
                    <span className="capitalize text-black/50">Pemeriksaan X-Ray Otak</span>
                    <hr className="text-black/20 mt-4" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold uppercase">FINDINGS:</h3>
                    <p className="p-3 text-sm bg-gray-100 rounded">{reportSections.findings}</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold uppercase">IMPRESSION:</h3>
                    <p className="p-3 text-sm bg-red-50 text-red-700 border-red-200 border rounded">{reportSections.impression}</p>
                  </div>
                </div>
                <div className="px-5 py-6 bg-gray-100 space-y-3">
                  <h3 className="text-center font-semibold">⚠️ Disclaimer!</h3>
                  <p className="text-center text-gray-500">Hasil ini hanya untuk demonstrasi dan tidak dapat digunakan untuk diagnosis medis yang sebenarnya. Konsultasikan dengan dokter spesialis untuk diagnosa yang akurat.</p>
                </div>
              </div>
            ) : (
                statusResult.loading ? (
                  <div className="h-full w-full flex flex-col justify-center items-center">
                    <img src="/tempatkita.png" alt="TempatKita Logo" className="animate-bounce" />
                    <h3 className="text-center mt-5">Menganalisis gambar X-Ray . . .</h3>
                    <span className="text-sm text-center mt-2 text-black/50">Proses ini membutuhkan beberapa detik</span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full gap-8">
                    {
                      img.tempPath && !statusResult.loading ? (
                        <>
                          <img src="/brain.png" alt="brain" className="w-24 h-24" />
                          <span className="text-lg text-center">Klik tombol "Analisis Gambar" untuk memulai</span>
                        </>
                      ) : (
                        <>
                          <img src="/file.png" alt="file" className="w-24 h-24" />
                          <span className="text-lg text-center">Silakan upload gambar X-ray untuk memulai analisis</span>
                        </>
                      )
                    }
                  </div>
                )
              )
          }
        </div>
        <div className="bg-white p-4 rounded md:col-span-2">
          <h2 className="font-semibold">Tentang Sistem Analisis</h2>
          <div className="flex justify-between flex-wrap md:flex-nowrap gap-5 mt-5">
            {
              BRAIN.map((b) => (
                <div className={`${b.bgColor} p-5 grow rounded space-y-2`}>
                  <h3 className={`${b.color} capitalize text-center`}>{b.name}</h3>
                  <p className="text-xs text-center">{b.sentence}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrainClassify
