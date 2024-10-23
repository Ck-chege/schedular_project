import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon, XIcon } from "lucide-react";

const MultiSelect = ({ options, value, onChange, placeholder,primaryTask }: { options: string[], value: string[], onChange: (newValue: string[]) => void, placeholder: string, primaryTask: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <div
        className="border rounded-md p-2 flex flex-wrap gap-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          value
          .filter(item => item !== primaryTask)
          .map(item => (
            <span key={item} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {item}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(item);
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <XIcon size={14} />
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2"
          />
          <ScrollArea className="h-60">
            {filteredOptions.map(option => (
              <div
                key={option}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  value.includes(option) ? 'bg-blue-100' : ''
                }`}
                onClick={() => toggleOption(option)}
              >
                <CheckIcon
                  className={`inline-block mr-2 ${
                    value.includes(option) ? 'text-blue-600' : 'invisible'
                  }`}
                  size={16}
                />
                {option}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
export default MultiSelect;