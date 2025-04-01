import React from "react";
import Image from "next/image";

interface PopupInterviewMenuProps {
  position: { top: number; left: number };
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const PopupInterviewMenu = React.forwardRef<HTMLDivElement, PopupInterviewMenuProps>(
  ({ position, onEdit, onDelete, onClose }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute w-[240px] bg-white shadow-md rounded-xl border border-gray-200 z-50"
      style={{ top: position.top, left: position.left }}
    >
      <ul className="py-2">
        <li
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="flex items-center px-4 py-2 hover:bg-gray-100 text-[#565656] cursor-pointer"
        >
          <Image src="/images/admin/permission/edit_icon.svg" alt="Edit" width={18} height={18} className="mr-2" />
          แก้ไขข้อมูลการสัมภาษณ์
        </li>
        <li
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-[#565656] cursor-pointer"
        >
          <div className="flex items-center">
            <Image src="/images/admin/permission/trash_icon.svg" alt="Delete" width={18} height={18} className="mr-2" />
            ลบข้อมูลการสัมภาษณ์
          </div>
          <Image src="/images/admin/permission/warning_icon.svg" alt="Warning" width={16} height={16} />
        </li>
      </ul>
    </div>
  );
});

PopupInterviewMenu.displayName = "PopupInterviewMenu";

export default PopupInterviewMenu;
