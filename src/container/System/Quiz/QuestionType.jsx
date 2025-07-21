import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CircleDot, CheckSquare, Check, X } from "lucide-react";
import { Fragment } from "react";
import {
  QUESTION_TYPE_MAP,
  REVERSE_QUESTION_TYPE_MAP,
} from "../../../utils/constant";

const questionTypes = [
  {
    value: REVERSE_QUESTION_TYPE_MAP.SINGLE_QUESTION,
    label: QUESTION_TYPE_MAP.QT1,
    icon: <CircleDot className="w-4 h-4 text-indigo-500" />,
  },
  {
    value: REVERSE_QUESTION_TYPE_MAP.MULTIPLE_QUESTION,
    label: QUESTION_TYPE_MAP.QT2,
    icon: <CheckSquare className="w-4 h-4 text-green-600" />,
  },
  {
    value: REVERSE_QUESTION_TYPE_MAP.TRUE_FALSE,
    label: QUESTION_TYPE_MAP.QT3,
    icon: (
      <div className="flex gap-1">
        <Check className="w-4 h-4 text-green-600" />
        <X className="w-4 h-4 text-red-600" />
      </div>
    ),
  },
];

export default function QuestionTypeSelect({ value, onChange }) {
  const selectedType =
    questionTypes.find((t) => t.value === value) || questionTypes[0];

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Loại câu hỏi</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {selectedType.icon}
              {selectedType.label}
            </span>
            <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {questionTypes.map((type) => (
              <Listbox.Option key={type.value} value={type.value} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`relative flex items-center gap-2 cursor-pointer select-none py-2 px-4 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    } ${selected ? "font-medium" : "font-normal"}`}
                    style={{ listStyleType: "none" }} // NGĂN hiển thị dấu chấm
                  >
                    {type.icon}
                    {type.label}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
