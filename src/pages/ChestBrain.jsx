import axios from 'axios'
import React, { useState } from 'react'

const features = [
    {
        bg: 'bg-[#FF0ECB33]',
        desc: 'Advanced deep learning detection',
        img: '/feature1.png'
    },
    {
        bg: 'bg-[#0EEFFF33]',
        desc: 'Real-time analysis in seconds',
        img: '/feature2.png'
    },
    {
        bg: 'bg-[#0EFF1A33]',
        desc: 'Medical-grade accuracy',
        img: '/feature3.png'
    },
    {
        bg: 'bg-[#FF0E1233]',
        desc: 'Multi-organ support',
        img: '/feature4.png'
    }
]

const diseaseLevels = [
    {
        bg: 'bg-[#FF0E1233]',
        type: 'high risk',
        color: '#FF0E12'
    },
    {
        bg: 'bg-[#FFFB0033]',
        type: 'medium risk',
        color: '#FF7700'
        
    },
    {
        bg: 'bg-[#0EFF1A33]',
        type: 'low risk',
        color: '#0EFF1A'

    },
]

const ChestBrain = () => {
    const [data, setData] = useState({
        img: null,
        tempPath: '',
        size: ''
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

    const handleSubmit = (e) => {
        console.log('helo');
        
        e.preventDefault();
        setError(null)
        setStatusResult(prev => ({ ...prev, loading: true }))
        
        const formData = new FormData();
        formData.append("file", data.img);

        axios.post('https://HaiMax2007-tempatkita-final-project.hf.space/upload-image', formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
        })
        .then(res => {
            if (res.data.status == 'error') {
                setError(res.data)
                return;
            }

            setStatusResult(prev => ({...prev, result: res.data, submitted: true}))
            
            // Parse the report sections when we get the result
            if (res.data.report) {
                const sections = splitReport(res.data.report);
                setReportSections(sections);
            }
        })
        .catch(e => {
            console.log(e)
        })
        .finally(() => {
            setStatusResult(prev => ({ ...prev, loading: false }))
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;
        
        const size = file.size > 1048576 ? file.size/(1024**2) : file.size/1024
        const byte = file.size > 1048576 ? 'MB' : 'KB'

        setData({...data, img: file, tempPath: URL.createObjectURL(file), size: `${size.toFixed(2).toString()} ${byte}`})
    }

    const handleDeleteImage = () => {
        setData({img: null, tempPath: '', size: ''})
        setStatusResult({loading: false, submitted: false, result: null})
        setReportSections({findings: '', impression: ''})
    }

    console.log(error);
    

  return (
    <div className='min-h-screen pb-20'>
        <div className="bg-[#234C6A] h-[80px] flex flex-col justify-center px-32 text-white sticky top-0 z-50">
            <h1 className='font-bold text-3xl'>MediScan AI</h1>
            <span className='text-white/60'>Powered by Vision Transformer</span>
        </div>
        <div className="grid grid-cols-2 gap-8 mx-32 mt-5 py-5">
            <form onSubmit={handleSubmit} encType='multipart/form-data' className="shadow-custom rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                    <img className='w-10 h-10' src="/layout.png" alt="Layout" />
                    <h2 className='font-bold text-xl'>Upload X-Ray Image</h2>
                </div>
                <div className="border-[#005EFF] h-[400px] relative rounded-xl border-2 flex flex-col gap items-center justify-center p-4 overflow-hidden">
                    {
                        data.tempPath ? (
                            <>
                                <img className='absolute top-1/2 left-1/2 -translate-1/2 h-full w-full object-cover' src={data.tempPath} alt={data.img?.name} />
                                {
                                    !statusResult.loading && (
                                        <>
                                            <button onClick={handleDeleteImage} type='button' className='absolute cursor-pointer top-5 right-5'>
                                                <img className='w-8 h-8' src="/x-btn.png" alt="delete image" />
                                            </button>
                                            <div className='absolute bottom-5 left-5 bg-black flex gap-2 items-center px-4 py-1 rounded-2xl'>
                                                <div className='w-3 h-3 bg-[#00FF0D] rounded-full animate-pulse'></div>
                                                <span className='text-[#00FF0D]'>Image Ready</span>
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        ) : (
                            <>
                                <img className='w-20 h-20' src="/download.png" alt="upload" />
                                <span className='max-w-[300px] text-center'>Choose the image you want to detect by clickin the button below</span>
                                <label htmlFor="img" className='mt-10 rounded bg-[#005EFF] hover:bg-[#004aca] transition text-white px-5 py-1 cursor-pointer'>
                                    Select File
                                    <input className='hidden' type="file" id='img' accept='image/*' onChange={handleImageChange} />
                                </label>
                                <div className="mt-2 flex items-center gap-2">
                                    <img className='w-7 h-7' src="/pictures.png" alt="pictures" />
                                    <span className='text-xs'>JPG, PNG, JPEG</span>
                                </div>
                            </>
                        )
                    }
                </div>  
                {
                    data.tempPath && (
                        <button disabled={statusResult.loading ? true : false} className='w-full mt-5 flex justify-center gap-3 p-2 items-center cursor-pointer bg-[#005EFF] hover:bg-[#024ed0] transition-all rounded-lg' type='submit'>
                            {
                                statusResult.loading ? (
                                    <>
                                        <img className='w-6 h-6 animate-spin' src="/loading.png" alt="thunder" />
                                        <span className='text-white text-lg'>Analyzing . . .</span>
                                    </>
                                ) : (
                                    <>
                                        <img className='w-6 h-6' src="/lightning.png" alt="thunder" />
                                        <span className='text-white text-lg'>Start AI Analysis</span>
                                    </>
                                )
                            }
                        </button>
                    )
                }
            </form>
            {
                statusResult.submitted ? (
                    <div className="h-fit row-span-3 flex flex-col gap-8 rounded-xl">
                        <div className='border-[#005EFF] flex gap-5 shadow-custom p-5 rounded-xl'>
                            <img className='w-18 h-18' src="/lungs.png" alt="Lungs" />
                            <div className="">
                                <h2 className='capitalize font-bold text-2xl'>Scan type detected</h2>
                                <span className='font-semibold text-xl capitalize'>{statusResult.result?.xray_image} CT Scan</span>
                            </div>
                        </div>
                        <div className='p-5 shadow-custom rounded-xl'>
                            <div className="flex gap-3 items-center">
                                <img className='w-10 h-10' src="/airesult.png" alt="AI result" />
                                <h2 className='font-bold text-xl'>AI Detection Result</h2>
                            </div>
                            <div className="mt-8 space-y-5">
                                {
                                    statusResult.result?.classification.map((c, id) => (
                                        <div className={`${diseaseLevels[id].bg} p-5 rounded-xl`}>
                                            <h3 className='font-semibold text-lg capitalize'>{c.condition}</h3>
                                            <div className="mt-8 flex items-center justify-between">
                                                <span className='px-5 py-1 capitalize text-white font-semibold rounded-full' style={{
                                                    backgroundColor: diseaseLevels[id].color
                                                }}>{diseaseLevels[id].type}</span>
                                                <span className='text-lg'>Confidence <span className='font-semibold'>{c.confidence}%</span></span>
                                            </div>
                                            <div className="mt-3 relative h-2 w-full bg-black/30 rounded-full">
                                                <div style={{
                                                    backgroundColor: diseaseLevels[id].color,
                                                    width: `${c.confidence}%`
                                                }} className="absolute h-full top-1/2 left-1/2 -translate-1/2 rounded-full"></div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className='bg-[#0d00ff1e] shadow-custom p-5 space-y-3 rounded-xl'>
                            <div className="flex items-center gap-3">
                                <img className='w-6 h-6' src="/info.png" alt="Information" />
                                <h2 className='capitalize font-semibold text-[#FF7700]'>findings</h2>
                            </div>
                            <p className='text-[#009DFF]'>{reportSections.findings}</p>
                        </div>
                        <div className='bg-[#ff00042e] shadow-custom p-5 space-y-3 rounded-xl'>
                            <div className="flex items-center gap-3">
                                <img className='w-6 h-6' src="/info.png" alt="Information" />
                                <h2 className='capitalize font-semibold text-[#FF7700]'>impression</h2>
                            </div>
                            <ul className="list-disc pl-8">
                                {reportSections.impression && reportSections.impression.split('\n')
                                    .filter(line => line.trim().startsWith('*'))
                                    .map((item, index) => (
                                    <li key={index} className="text-gray-700 mb-1">{item.replace('*', '').trim()}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="row-span-3 shadow-custom flex flex-col gap-3 justify-center items-center p-5 rounded-xl">
                        <img className={`w-40 h-40 ${statusResult.loading && 'animate-spin'}`} src={statusResult.loading ? 'loading-b.png' : error ? '/warning.png' : 'layout.png'} alt="Layout" />
                        <h2 className='text-lg font-semibold max-w-[500px] text-center'>
                            {
                                statusResult.loading ? (
                                    <span>Please wait a moment for AI to analyze your image</span>
                                ) : error ? (
                                        <span className='text-red-400 font-bold'>{error.message}</span>
                                    ) : (
                                        <span>Upload an X-ray image to get instant AI-powered medical insights and recommendations</span>
                                    )
                                
                            }
                        </h2>
                    </div>
                )
            }
            <div className="shadow-custom rounded-xl p-5">
                <h2 className='font-bold text-xl mb-5'>AI-Powered Features</h2>
                <div className="space-y-3">
                    {
                        features.map(f => (
                            <div className={`flex items-center gap-5 px-4 py-3 ${f.bg} rounded-lg`}>
                                <img className='w-8 h-8' src={f.img} alt={f.desc} />
                                <span className='font-semibold'>{f.desc}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="shadow-custom flex items-center justify-around p-5 rounded-xl">
                <div className="flex flex-col bg-[#005EFF1A] px-5 py-2 text-center border border-[#005EFF] rounded-xl">
                    <h3 className='text-[#00df0b] font-bold'>98%</h3>
                    <span className='font-semibold'>Accuracy</span>
                </div>
                <div className="flex flex-col bg-[#005EFF1A] px-5 py-2 text-center border border-[#005EFF] rounded-xl">
                    <h3 className='text-[#8e5ffa] font-bold'>&lt;2s</h3>
                    <span className='font-semibold'>Analysis</span>
                </div>
                <div className="flex flex-col bg-[#005EFF1A] px-5 py-2 text-center border border-[#005EFF] rounded-xl">
                    <h3 className='text-[#00cedd] font-bold'>24 / 7</h3>
                    <span className='font-semibold'>Available</span>
                </div>
            </div>
        </div>
        <div className="bg-[#FF77004D] mx-32 p-5 flex gap-3 rounded-xl">
            <img className='w-16 h-16' src="/disclaimer.png" alt="Disclaimer" />
            <div>
                <h2 className='font-semibold text-[#FF7700] text-lg'>Medical Disclaimer</h2>
                <p className='text-sm'>This AI-powered tool is designed for educational and demonstration purposes only. Results should not replace professional medical diagnosis. Always consult qualified healthcare professionals for accurate medical evaluation and treatment decisions.</p>
            </div>
        </div>
    </div>
  )
}

export default ChestBrain