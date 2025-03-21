import Select, { DropdownIndicatorProps, GroupBase, SingleValue, StylesConfig } from "react-select";
import { themeOptions, ThemeValues } from "../utils/themeOptions";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";


export const Options =() => {

    const { theme, setTheme } = useContext(ThemeContext)!;
    const [value, setValue] = useState<ThemeValues | null>(theme);

    const handleChange = (e: SingleValue<ThemeValues>) => {
        console.log(e)
        setValue(e);
        if(e) {
            setTheme(e);
            localStorage.setItem("theme", JSON.stringify(e));
        }
    }
    const customStyles : StylesConfig<ThemeValues, false, GroupBase<ThemeValues>>  = {
        dropdownIndicator: (provided , state: DropdownIndicatorProps<ThemeValues, false, GroupBase<ThemeValues>>) => ({
          ...provided,
          transition: 'all 0.3s ease',
          transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }),
        menu: (provided) => ({
            ...provided,
            transform: "translateY(8px)", // Start position (above)
            transition: "all 0.3s ease",
            transformOrigin: "bottom",
            borderBottom: "none",
            // backgroundColor: `${theme.value.background}`
        }),
        control: (provided) => ({
            ...provided,
        })
      };

    return (
        <div className="flex max-w-full min-w-[70vw] justify-between mx-auto ">
            <div>
                Links
            </div>
            <div className="text-black">
                <Select isSearchable={false} styles={customStyles} className="min-h-32 min-w-40" value={value} options={themeOptions} onChange={handleChange} menuPlacement="top"/>

            </div>
        </div>
    )
};