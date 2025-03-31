import React, { useState } from "react";
import Image from "next/image";
import CustomSelect from "@components/components/form/CustomSelect";

interface PopupEditGroupingProps {
    isOpen: boolean;
    selectedCommittee: string;
    onClose: () => void;
    onSave: (value: string) => void;
}

const committeeOptions = [
    { label: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์", value: "อาจารย์ ดร. พิสุทธิ์ธร คณาวัฒนาวงศ์" },
    { label: "อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล", value: "อาจารย์ ดร. อารดา วรรณวิจิตรสุทธิกุล" },
    { label: "อาจารย์ ดร. พรรณวดี ชัยวัฒนมงคล", value: "อาจารย์ ดร. พรรณวดี ชัยวัฒนมงคล" },
];

const PopupEditGrouping: React.FC<PopupEditGroupingProps> = ({
    isOpen,
    selectedCommittee,
    onClose,
    onSave,
}) => {
    const [selected, setSelected] = useState<string>(selectedCommittee);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
                <h2 className="text-[20px] font-bold text-[#565656] mb-4">
                    แก้ไขกลุ่มผู้สมัคร
                </h2>

                <CustomSelect
                    label="กรรมการหลักสูตร"
                    options={committeeOptions}
                    value={selected}
                    onChange={(selectedOption) =>
                        setSelected(selectedOption ? selectedOption.value : "")
                    }
                    placeholder="เลือกกรรมการหลักสูตร"
                    width="100%"
                    height="44px"
                    required={false}
                />

                <div className="flex justify-center gap-2 mt-6">
                    <button
                        className="px-6 py-2 border border-[#C4C4C4] rounded-md text-[#565656]"
                        onClick={onClose}
                    >
                        ยกเลิก
                    </button>
                    <button
                        className="px-6 py-2 bg-[#008A90] hover:bg-[#007178] text-white rounded-md flex items-center gap-2"
                        onClick={() => onSave(selected)}
                        disabled={!selected}
                    >
                        <Image
                            src="/images/admin/preliminaryResult/save_icon.svg"
                            alt="บันทึก"
                            width={16}
                            height={16}
                        />
                        บันทึก
                    </button>
                </div>
                <button
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition z-50"
                    onClick={onClose}
                >
                    <Image src="/images/close_icon.svg" alt="Close" width={24} height={24} className="w-[20px] h-[20px]" />
                </button>
            </div>
        </div>
    );
};

export default PopupEditGrouping;
